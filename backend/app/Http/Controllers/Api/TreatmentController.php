<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Treatment;
use App\Models\Patient;
use App\Models\Staff;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

class TreatmentController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): JsonResponse
    {
        $query = Treatment::query();

        if ($request->has('patientId')) {
            $query->where('patient_id', $request->patientId);
        }

        if ($request->has('dentistId')) {
            $query->where('dentist_id', $request->dentistId);
        }

        $treatments = $query->orderBy('date', 'desc')->get();

        return response()->json([
            'success' => true,
            'data' => $treatments->map(function ($treatment) {
                return [
                    'id' => $treatment->id,
                    'patientId' => $treatment->patient_id,
                    'patientName' => $treatment->patient_name,
                    'date' => $treatment->date?->format('Y-m-d'),
                    'type' => $treatment->type,
                    'tooth' => $treatment->tooth,
                    'description' => $treatment->description,
                    'cost' => (float) $treatment->cost,
                    'dentistId' => $treatment->dentist_id,
                    'dentistName' => $treatment->dentist_name,
                    'prescriptions' => $treatment->prescriptions ?? [],
                    'nextVisit' => $treatment->next_visit?->format('Y-m-d'),
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
            'date' => 'required|date',
            'type' => 'required|string|max:255',
            'tooth' => 'nullable|string|max:50',
            'description' => 'required|string',
            'cost' => 'required|numeric|min:0',
            'dentistId' => 'required|uuid|exists:staff,id',
            'prescriptions' => 'nullable|array',
            'nextVisit' => 'nullable|date',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $patient = Patient::find($request->patientId);
            $dentist = Staff::find($request->dentistId);

            $treatment = Treatment::create([
                'id' => Str::uuid(),
                'patient_id' => $request->patientId,
                'patient_name' => $patient?->full_name ?? ($patient?->first_name . ' ' . $patient?->last_name),
                'date' => $request->date,
                'type' => $request->type,
                'tooth' => $request->tooth,
                'description' => $request->description,
                'cost' => $request->cost,
                'dentist_id' => $request->dentistId,
                'dentist_name' => $dentist?->full_name ?? ($dentist?->first_name . ' ' . $dentist?->last_name),
                'prescriptions' => $request->prescriptions,
                'next_visit' => $request->nextVisit,
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Traitement créé avec succès',
                'data' => [
                    'id' => $treatment->id,
                    'patientId' => $treatment->patient_id,
                    'patientName' => $treatment->patient_name,
                    'date' => $treatment->date?->format('Y-m-d'),
                    'type' => $treatment->type,
                    'tooth' => $treatment->tooth,
                    'description' => $treatment->description,
                    'cost' => (float) $treatment->cost,
                    'dentistId' => $treatment->dentist_id,
                    'dentistName' => $treatment->dentist_name,
                    'prescriptions' => $treatment->prescriptions ?? [],
                    'nextVisit' => $treatment->next_visit?->format('Y-m-d'),
                ]
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la création du traitement',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id): JsonResponse
    {
        $treatment = Treatment::find($id);

        if (!$treatment) {
            return response()->json([
                'success' => false,
                'message' => 'Traitement non trouvé'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => [
                'id' => $treatment->id,
                'patientId' => $treatment->patient_id,
                'patientName' => $treatment->patient_name,
                'date' => $treatment->date?->format('Y-m-d'),
                'type' => $treatment->type,
                'tooth' => $treatment->tooth,
                'description' => $treatment->description,
                'cost' => (float) $treatment->cost,
                'dentistId' => $treatment->dentist_id,
                'dentistName' => $treatment->dentist_name,
                'prescriptions' => $treatment->prescriptions ?? [],
                'nextVisit' => $treatment->next_visit?->format('Y-m-d'),
            ]
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id): JsonResponse
    {
        $treatment = Treatment::find($id);

        if (!$treatment) {
            return response()->json([
                'success' => false,
                'message' => 'Traitement non trouvé'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'patientId' => 'sometimes|required|uuid|exists:patients,id',
            'date' => 'sometimes|required|date',
            'type' => 'sometimes|required|string|max:255',
            'tooth' => 'nullable|string|max:50',
            'description' => 'sometimes|required|string',
            'cost' => 'sometimes|required|numeric|min:0',
            'dentistId' => 'sometimes|required|uuid|exists:staff,id',
            'prescriptions' => 'nullable|array',
            'nextVisit' => 'nullable|date',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $patientName = $treatment->patient_name;
            $dentistName = $treatment->dentist_name;

            if ($request->has('patientId')) {
                $patient = Patient::find($request->patientId);
                $patientName = $patient?->full_name ?? ($patient?->first_name . ' ' . $patient?->last_name);
            }

            if ($request->has('dentistId')) {
                $dentist = Staff::find($request->dentistId);
                $dentistName = $dentist?->full_name ?? ($dentist?->first_name . ' ' . $dentist?->last_name);
            }

            $treatment->update([
                'patient_id' => $request->patientId ?? $treatment->patient_id,
                'patient_name' => $patientName,
                'date' => $request->date ?? $treatment->date,
                'type' => $request->type ?? $treatment->type,
                'tooth' => $request->tooth ?? $treatment->tooth,
                'description' => $request->description ?? $treatment->description,
                'cost' => $request->cost ?? $treatment->cost,
                'dentist_id' => $request->dentistId ?? $treatment->dentist_id,
                'dentist_name' => $dentistName,
                'prescriptions' => $request->prescriptions ?? $treatment->prescriptions,
                'next_visit' => $request->nextVisit ?? $treatment->next_visit,
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Traitement mis à jour avec succès',
                'data' => [
                    'id' => $treatment->id,
                    'patientId' => $treatment->patient_id,
                    'patientName' => $treatment->patient_name,
                    'date' => $treatment->date?->format('Y-m-d'),
                    'type' => $treatment->type,
                    'tooth' => $treatment->tooth,
                    'description' => $treatment->description,
                    'cost' => (float) $treatment->cost,
                    'dentistId' => $treatment->dentist_id,
                    'dentistName' => $treatment->dentist_name,
                    'prescriptions' => $treatment->prescriptions ?? [],
                    'nextVisit' => $treatment->next_visit?->format('Y-m-d'),
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la mise à jour du traitement',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id): JsonResponse
    {
        $treatment = Treatment::find($id);

        if (!$treatment) {
            return response()->json([
                'success' => false,
                'message' => 'Traitement non trouvé'
            ], 404);
        }

        try {
            $treatment->delete();

            return response()->json([
                'success' => true,
                'message' => 'Traitement supprimé avec succès'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la suppression du traitement',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
