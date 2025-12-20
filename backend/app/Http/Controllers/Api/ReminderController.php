<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Reminder;
use App\Models\Patient;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

class ReminderController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): JsonResponse
    {
        $query = Reminder::query();

        if ($request->has('patientId')) {
            $query->where('patient_id', $request->patientId);
        }

        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        $reminders = $query->orderBy('due_date')->get();

        return response()->json([
            'success' => true,
            'data' => $reminders->map(function ($reminder) {
                return [
                    'id' => $reminder->id,
                    'patientId' => $reminder->patient_id,
                    'patientName' => $reminder->patient_name,
                    'type' => $reminder->type,
                    'dueDate' => $reminder->due_date?->format('Y-m-d'),
                    'message' => $reminder->message,
                    'status' => $reminder->status,
                ];
            })
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'patientId' => 'required|uuid|exists:patients,id',
            'type' => 'required|in:checkup,treatment,followup',
            'dueDate' => 'required|date',
            'message' => 'required|string',
            'status' => 'nullable|in:pending,sent,completed',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors(),
            ], 422);
        }

        try {
            $patient = Patient::find($request->patientId);

            $reminder = Reminder::create([
                'id' => Str::uuid(),
                'patient_id' => $request->patientId,
                'patient_name' => $patient?->full_name ?? ($patient?->first_name . ' ' . $patient?->last_name),
                'type' => $request->type,
                'due_date' => $request->dueDate,
                'message' => $request->message,
                'status' => $request->status ?? 'pending',
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Rappel créé avec succès',
                'data' => [
                    'id' => $reminder->id,
                    'patientId' => $reminder->patient_id,
                    'patientName' => $reminder->patient_name,
                    'type' => $reminder->type,
                    'dueDate' => $reminder->due_date?->format('Y-m-d'),
                    'message' => $reminder->message,
                    'status' => $reminder->status,
                ]
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la création du rappel',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id): JsonResponse
    {
        $reminder = Reminder::find($id);

        if (!$reminder) {
            return response()->json([
                'success' => false,
                'message' => 'Rappel non trouvé'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => [
                'id' => $reminder->id,
                'patientId' => $reminder->patient_id,
                'patientName' => $reminder->patient_name,
                'type' => $reminder->type,
                'dueDate' => $reminder->due_date?->format('Y-m-d'),
                'message' => $reminder->message,
                'status' => $reminder->status,
            ]
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id): JsonResponse
    {
        $reminder = Reminder::find($id);

        if (!$reminder) {
            return response()->json([
                'success' => false,
                'message' => 'Rappel non trouvé'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'patientId' => 'sometimes|required|uuid|exists:patients,id',
            'type' => 'sometimes|required|in:checkup,treatment,followup',
            'dueDate' => 'sometimes|required|date',
            'message' => 'sometimes|required|string',
            'status' => 'sometimes|required|in:pending,sent,completed',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors(),
            ], 422);
        }

        try {
            $patientName = $reminder->patient_name;

            if ($request->has('patientId')) {
                $patient = Patient::find($request->patientId);
                $patientName = $patient?->full_name ?? ($patient?->first_name . ' ' . $patient?->last_name);
            }

            $reminder->update([
                'patient_id' => $request->patientId ?? $reminder->patient_id,
                'patient_name' => $patientName,
                'type' => $request->type ?? $reminder->type,
                'due_date' => $request->dueDate ?? $reminder->due_date,
                'message' => $request->message ?? $reminder->message,
                'status' => $request->status ?? $reminder->status,
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Rappel mis à jour avec succès',
                'data' => [
                    'id' => $reminder->id,
                    'patientId' => $reminder->patient_id,
                    'patientName' => $reminder->patient_name,
                    'type' => $reminder->type,
                    'dueDate' => $reminder->due_date?->format('Y-m-d'),
                    'message' => $reminder->message,
                    'status' => $reminder->status,
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la mise à jour du rappel',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id): JsonResponse
    {
        $reminder = Reminder::find($id);

        if (!$reminder) {
            return response()->json([
                'success' => false,
                'message' => 'Rappel non trouvé'
            ], 404);
        }

        try {
            $reminder->delete();

            return response()->json([
                'success' => true,
                'message' => 'Rappel supprimé avec succès'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la suppression du rappel',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
