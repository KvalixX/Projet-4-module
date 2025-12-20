<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Patient;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

class PatientController extends Controller
{
    /**
     * Liste de tous les patients
     */
    public function index(): JsonResponse
    {
        $patients = Patient::with(['appointments', 'treatments', 'reminders'])
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $patients->map(function ($patient) {
                return [
                    'id' => $patient->id,
                    'firstName' => $patient->first_name,
                    'lastName' => $patient->last_name,
                    'dateOfBirth' => $patient->date_of_birth->format('Y-m-d'),
                    'phone' => $patient->phone,
                    'email' => $patient->email,
                    'address' => $patient->address,
                    'bloodType' => $patient->blood_type,
                    'allergies' => $patient->allergies,
                    'medicalHistory' => $patient->medical_history,
                    'registrationDate' => $patient->registration_date->format('Y-m-d H:i:s'),
                ];
            })
        ]);
    }

    /**
     * Créer un nouveau patient
     */
    public function store(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'firstName' => 'required|string|max:255',
            'lastName' => 'required|string|max:255',
            'dateOfBirth' => 'required|date',
            'phone' => 'required|string',
            'email' => 'required|email|unique:patients,email',
            'address' => 'required|string',
            'bloodType' => 'nullable|string',
            'allergies' => 'nullable|array',
            'medicalHistory' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $patient = Patient::create([
                'id' => Str::uuid(),
                'first_name' => $request->firstName,
                'last_name' => $request->lastName,
                'date_of_birth' => $request->dateOfBirth,
                'phone' => $request->phone,
                'email' => $request->email,
                'address' => $request->address,
                'blood_type' => $request->bloodType,
                'allergies' => $request->allergies,
                'medical_history' => $request->medicalHistory,
                'registration_date' => now(),
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Patient créé avec succès',
                'data' => [
                    'id' => $patient->id,
                    'firstName' => $patient->first_name,
                    'lastName' => $patient->last_name,
                    'dateOfBirth' => $patient->date_of_birth->format('Y-m-d'),
                    'phone' => $patient->phone,
                    'email' => $patient->email,
                    'address' => $patient->address,
                    'bloodType' => $patient->blood_type,
                    'allergies' => $patient->allergies,
                    'medicalHistory' => $patient->medical_history,
                    'registrationDate' => $patient->registration_date->format('Y-m-d H:i:s'),
                ]
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la création du patient',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Afficher un patient spécifique
     */
    public function show(string $id): JsonResponse
    {
        $patient = Patient::with(['appointments', 'treatments', 'reminders'])->find($id);

        if (!$patient) {
            return response()->json([
                'success' => false,
                'message' => 'Patient non trouvé'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => [
                'id' => $patient->id,
                'firstName' => $patient->first_name,
                'lastName' => $patient->last_name,
                'dateOfBirth' => $patient->date_of_birth->format('Y-m-d'),
                'phone' => $patient->phone,
                'email' => $patient->email,
                'address' => $patient->address,
                'bloodType' => $patient->blood_type,
                'allergies' => $patient->allergies,
                'medicalHistory' => $patient->medical_history,
                'registrationDate' => $patient->registration_date->format('Y-m-d H:i:s'),
                'appointments' => $patient->appointments,
                'treatments' => $patient->treatments,
                'reminders' => $patient->reminders,
            ]
        ]);
    }

    /**
     * Mettre à jour un patient
     */
    public function update(Request $request, string $id): JsonResponse
    {
        $patient = Patient::find($id);

        if (!$patient) {
            return response()->json([
                'success' => false,
                'message' => 'Patient non trouvé'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'firstName' => 'sometimes|required|string|max:255',
            'lastName' => 'sometimes|required|string|max:255',
            'dateOfBirth' => 'sometimes|required|date',
            'phone' => 'sometimes|required|string',
            'email' => 'sometimes|required|email|unique:patients,email,' . $id,
            'address' => 'sometimes|required|string',
            'bloodType' => 'nullable|string',
            'allergies' => 'nullable|array',
            'medicalHistory' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $patient->update([
                'first_name' => $request->firstName ?? $patient->first_name,
                'last_name' => $request->lastName ?? $patient->last_name,
                'date_of_birth' => $request->dateOfBirth ?? $patient->date_of_birth,
                'phone' => $request->phone ?? $patient->phone,
                'email' => $request->email ?? $patient->email,
                'address' => $request->address ?? $patient->address,
                'blood_type' => $request->bloodType ?? $patient->blood_type,
                'allergies' => $request->allergies ?? $patient->allergies,
                'medical_history' => $request->medicalHistory ?? $patient->medical_history,
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Patient mis à jour avec succès',
                'data' => [
                    'id' => $patient->id,
                    'firstName' => $patient->first_name,
                    'lastName' => $patient->last_name,
                    'dateOfBirth' => $patient->date_of_birth->format('Y-m-d'),
                    'phone' => $patient->phone,
                    'email' => $patient->email,
                    'address' => $patient->address,
                    'bloodType' => $patient->blood_type,
                    'allergies' => $patient->allergies,
                    'medicalHistory' => $patient->medical_history,
                    'registrationDate' => $patient->registration_date->format('Y-m-d H:i:s'),
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la mise à jour du patient',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Supprimer un patient
     */
    public function destroy(string $id): JsonResponse
    {
        $patient = Patient::find($id);

        if (!$patient) {
            return response()->json([
                'success' => false,
                'message' => 'Patient non trouvé'
            ], 404);
        }

        try {
            $patient->delete();

            return response()->json([
                'success' => true,
                'message' => 'Patient supprimé avec succès'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la suppression du patient',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
