<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Appointment;
use App\Models\AdminNotification;
use App\Models\Notification;
use App\Models\Patient;
use App\Models\Staff;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

class AppointmentController extends Controller
{
    /**
     * Liste de tous les rendez-vous
     */
    public function index(Request $request): JsonResponse
    {
        $query = Appointment::with(['patient', 'dentist']);

        // Filtrer par patient si spécifié
        if ($request->has('patientId')) {
            $query->where('patient_id', $request->patientId);
        }

        // Filtrer par dentiste si spécifié
        if ($request->has('dentistId')) {
            $query->where('dentist_id', $request->dentistId);
        }

        // Filtrer par statut si spécifié
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        $appointments = $query->orderBy('date')->orderBy('time')->get();

        return response()->json([
            'success' => true,
            'data' => $appointments->map(function ($appointment) {
                return [
                    'id' => $appointment->id,
                    'patientId' => $appointment->patient_id,
                    'patientName' => $appointment->patient_name,
                    'dentistId' => $appointment->dentist_id,
                    'dentistName' => $appointment->dentist_name,
                    'date' => $appointment->date->format('Y-m-d'),
                    'time' => $appointment->time->format('H:i'),
                    'duration' => $appointment->duration,
                    'type' => $appointment->type,
                    'status' => $appointment->status,
                    'notes' => $appointment->notes,
                ];
            })
        ]);
    }

    /**
     * Créer un nouveau rendez-vous
     */
    public function store(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'patientId' => 'required|uuid|exists:patients,id',
            'dentistId' => 'required|uuid|exists:staff,id',
            'date' => 'required|date|after_or_equal:today',
            'time' => 'required|date_format:H:i',
            'duration' => 'required|integer|min:15|max:240',
            'type' => 'required|string',
            'notes' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            // Vérifier les conflits
            $patient = Patient::find($request->patientId);
            $dentist = Staff::find($request->dentistId);

            $appointment = new Appointment();
            $hasConflict = $appointment->isConflicting(
                $request->date,
                $request->time,
                $request->duration,
                $request->dentistId
            );

            if ($hasConflict) {
                return response()->json([
                    'success' => false,
                    'message' => 'Ce créneau horaire est déjà occupé'
                ], 409);
            }

            $appointment = Appointment::create([
                'id' => Str::uuid(),
                'patient_id' => $request->patientId,
                'patient_name' => $patient->full_name,
                'dentist_id' => $request->dentistId,
                'dentist_name' => $dentist->full_name,
                'date' => $request->date,
                'time' => $request->time,
                'duration' => $request->duration,
                'type' => $request->type,
                'status' => 'scheduled',
                'notes' => $request->notes,
            ]);

            $patientUser = User::where('patient_id', $appointment->patient_id)->first();
            if ($patientUser) {
                Notification::create([
                    'id' => Str::uuid(),
                    'user_id' => $patientUser->id,
                    'type' => 'appointment_created',
                    'title' => 'Rendez-vous créé',
                    'message' => "Votre rendez-vous avec {$appointment->dentist_name} le {$appointment->date->format('Y-m-d')} à {$appointment->time->format('H:i')} a été créé avec succès.",
                    'read' => false,
                    'related_id' => $appointment->id,
                ]);
            }

            AdminNotification::create([
                'id' => Str::uuid(),
                'type' => 'appointment_created',
                'title' => 'Nouveau rendez-vous créé',
                'message' => "{$appointment->patient_name} a créé un rendez-vous avec {$appointment->dentist_name} le {$appointment->date->format('Y-m-d')} à {$appointment->time->format('H:i')}.",
                'read' => false,
                'related_id' => $appointment->id,
                'patient_id' => $appointment->patient_id,
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Rendez-vous créé avec succès',
                'data' => [
                    'id' => $appointment->id,
                    'patientId' => $appointment->patient_id,
                    'patientName' => $appointment->patient_name,
                    'dentistId' => $appointment->dentist_id,
                    'dentistName' => $appointment->dentist_name,
                    'date' => $appointment->date->format('Y-m-d'),
                    'time' => $appointment->time->format('H:i'),
                    'duration' => $appointment->duration,
                    'type' => $appointment->type,
                    'status' => $appointment->status,
                    'notes' => $appointment->notes,
                ]
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la création du rendez-vous',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Afficher un rendez-vous spécifique
     */
    public function show(string $id): JsonResponse
    {
        $appointment = Appointment::with(['patient', 'dentist'])->find($id);

        if (!$appointment) {
            return response()->json([
                'success' => false,
                'message' => 'Rendez-vous non trouvé'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => [
                'id' => $appointment->id,
                'patientId' => $appointment->patient_id,
                'patientName' => $appointment->patient_name,
                'dentistId' => $appointment->dentist_id,
                'dentistName' => $appointment->dentist_name,
                'date' => $appointment->date->format('Y-m-d'),
                'time' => $appointment->time->format('H:i'),
                'duration' => $appointment->duration,
                'type' => $appointment->type,
                'status' => $appointment->status,
                'notes' => $appointment->notes,
            ]
        ]);
    }

    /**
     * Mettre à jour un rendez-vous
     */
    public function update(Request $request, string $id): JsonResponse
    {
        $appointment = Appointment::find($id);

        if (!$appointment) {
            return response()->json([
                'success' => false,
                'message' => 'Rendez-vous non trouvé'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'patientId' => 'sometimes|required|uuid|exists:patients,id',
            'dentistId' => 'sometimes|required|uuid|exists:staff,id',
            'date' => 'sometimes|required|date',
            'time' => 'sometimes|required|date_format:H:i',
            'duration' => 'sometimes|required|integer|min:15|max:240',
            'type' => 'sometimes|required|string',
            'status' => 'sometimes|required|in:scheduled,completed,cancelled,no-show',
            'notes' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            // Vérifier les conflits si date/heure/durée changent
            if ($request->has(['date', 'time', 'duration']) || $request->has('dentistId')) {
                $hasConflict = $appointment->isConflicting(
                    $request->date ?? $appointment->date,
                    $request->time ?? $appointment->time,
                    $request->duration ?? $appointment->duration,
                    $request->dentistId ?? $appointment->dentist_id
                );

                if ($hasConflict) {
                    return response()->json([
                        'success' => false,
                        'message' => 'Ce créneau horaire est déjà occupé'
                    ], 409);
                }
            }

            // Mettre à jour les noms si patient ou dentiste changent
            if ($request->has('patientId')) {
                $patient = Patient::find($request->patientId);
                $appointment->patient_name = $patient->full_name;
            }

            if ($request->has('dentistId')) {
                $dentist = Staff::find($request->dentistId);
                $appointment->dentist_name = $dentist->full_name;
            }

            $appointment->update([
                'patient_id' => $request->patientId ?? $appointment->patient_id,
                'dentist_id' => $request->dentistId ?? $appointment->dentist_id,
                'date' => $request->date ?? $appointment->date,
                'time' => $request->time ?? $appointment->time,
                'duration' => $request->duration ?? $appointment->duration,
                'type' => $request->type ?? $appointment->type,
                'status' => $request->status ?? $appointment->status,
                'notes' => $request->notes ?? $appointment->notes,
            ]);

            $patientUser = User::where('patient_id', $appointment->patient_id)->first();
            $isCancelled = $oldStatus !== 'cancelled' && $appointment->status === 'cancelled';

            if ($patientUser) {
                Notification::create([
                    'id' => Str::uuid(),
                    'user_id' => $patientUser->id,
                    'type' => $isCancelled ? 'appointment_cancelled' : 'appointment_modified',
                    'title' => $isCancelled ? 'Rendez-vous annulé' : 'Rendez-vous modifié',
                    'message' => $isCancelled
                        ? "Votre rendez-vous avec {$appointment->dentist_name} le {$appointment->date->format('Y-m-d')} à {$appointment->time->format('H:i')} a été annulé."
                        : "Votre rendez-vous avec {$oldDentistName} le {$oldDate->format('Y-m-d')} à {$oldTime->format('H:i')} a été modifié.",
                    'read' => false,
                    'related_id' => $appointment->id,
                ]);
            }

            AdminNotification::create([
                'id' => Str::uuid(),
                'type' => $isCancelled ? 'appointment_cancelled' : 'appointment_modified',
                'title' => $isCancelled ? 'Rendez-vous annulé' : 'Rendez-vous modifié',
                'message' => $isCancelled
                    ? "{$appointment->patient_name} a annulé son rendez-vous avec {$appointment->dentist_name} prévu le {$appointment->date->format('Y-m-d')} à {$appointment->time->format('H:i')}."
                    : "{$appointment->patient_name} a modifié un rendez-vous avec {$appointment->dentist_name} (ancien: {$oldDate->format('Y-m-d')} {$oldTime->format('H:i')}).",
                'read' => false,
                'related_id' => $appointment->id,
                'patient_id' => $appointment->patient_id,
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Rendez-vous mis à jour avec succès',
                'data' => [
                    'id' => $appointment->id,
                    'patientId' => $appointment->patient_id,
                    'patientName' => $appointment->patient_name,
                    'dentistId' => $appointment->dentist_id,
                    'dentistName' => $appointment->dentist_name,
                    'date' => $appointment->date->format('Y-m-d'),
                    'time' => $appointment->time->format('H:i'),
                    'duration' => $appointment->duration,
                    'type' => $appointment->type,
                    'status' => $appointment->status,
                    'notes' => $appointment->notes,
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la mise à jour du rendez-vous',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Supprimer un rendez-vous
     */
    public function destroy(string $id): JsonResponse
    {
        $appointment = Appointment::find($id);

        if (!$appointment) {
            return response()->json([
                'success' => false,
                'message' => 'Rendez-vous non trouvé'
            ], 404);
        }

        try {
            $patientUser = User::where('patient_id', $appointment->patient_id)->first();
            if ($patientUser) {
                Notification::create([
                    'id' => Str::uuid(),
                    'user_id' => $patientUser->id,
                    'type' => 'appointment_cancelled',
                    'title' => 'Rendez-vous annulé',
                    'message' => "Votre rendez-vous avec {$appointment->dentist_name} le {$appointment->date->format('Y-m-d')} à {$appointment->time->format('H:i')} a été annulé.",
                    'read' => false,
                    'related_id' => $appointment->id,
                ]);
            }

            AdminNotification::create([
                'id' => Str::uuid(),
                'type' => 'appointment_cancelled',
                'title' => 'Rendez-vous annulé',
                'message' => "{$appointment->patient_name} a annulé un rendez-vous avec {$appointment->dentist_name} prévu le {$appointment->date->format('Y-m-d')} à {$appointment->time->format('H:i')}.",
                'read' => false,
                'related_id' => $appointment->id,
                'patient_id' => $appointment->patient_id,
            ]);

            $appointment->delete();

            return response()->json([
                'success' => true,
                'message' => 'Rendez-vous supprimé avec succès'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la suppression du rendez-vous',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Vérifier les conflits de rendez-vous
     */
    public function checkConflicts(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'dentistId' => 'required|uuid|exists:staff,id',
            'date' => 'required|date',
            'time' => 'required|date_format:H:i',
            'duration' => 'required|integer|min:15',
            'appointmentId' => 'nullable|uuid',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $appointment = new Appointment();
        if ($request->appointmentId) {
            $appointment = Appointment::find($request->appointmentId) ?? new Appointment();
        }

        $hasConflict = $appointment->isConflicting(
            $request->date,
            $request->time,
            $request->duration,
            $request->dentistId
        );

        return response()->json([
            'success' => true,
            'hasConflict' => $hasConflict,
            'message' => $hasConflict ? 'Ce créneau est déjà occupé' : 'Ce créneau est disponible'
        ]);
    }
}
