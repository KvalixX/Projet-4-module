<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Patient;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use Tymon\JWTAuth\Facades\JWTAuth;

class AuthController extends Controller
{
    /**
     * Connexion utilisateur
     */
    public function login(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
            'password' => 'required|string|min:6',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $credentials = $request->only('email', 'password');

        if (!$token = auth()->attempt($credentials)) {
            return response()->json([
                'success' => false,
                'message' => 'Email ou mot de passe incorrect'
            ], 401);
        }

        $user = auth()->user();

        return response()->json([
            'success' => true,
            'token' => $token,
            'user' => [
                'id' => $user->id,
                'email' => $user->email,
                'role' => $user->role,
                'firstName' => $user->first_name,
                'lastName' => $user->last_name,
                'patientId' => $user->patient_id,
                'staffId' => $user->staff_id,
            ]
        ]);
    }

    /**
     * Inscription patient
     */
    public function register(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'firstName' => 'required|string|max:255',
            'lastName' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:6|confirmed',
            'dateOfBirth' => 'required|date',
            'phone' => 'required|string',
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
            // Créer le patient
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

            // Créer l'utilisateur
            $user = User::create([
                'id' => Str::uuid(),
                'email' => $request->email,
                'password' => Hash::make($request->password),
                'role' => 'patient',
                'first_name' => $request->firstName,
                'last_name' => $request->lastName,
                'patient_id' => $patient->id,
            ]);

            // Générer le token
            $token = auth()->login($user);

            return response()->json([
                'success' => true,
                'message' => 'Inscription réussie',
                'token' => $token,
                'user' => [
                    'id' => $user->id,
                    'email' => $user->email,
                    'role' => $user->role,
                    'firstName' => $user->first_name,
                    'lastName' => $user->last_name,
                    'patientId' => $user->patient_id,
                ]
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de l\'inscription',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Déconnexion
     */
    public function logout(): JsonResponse
    {
        auth()->logout();

        return response()->json([
            'success' => true,
            'message' => 'Déconnexion réussie'
        ]);
    }

    /**
     * Rafraîchir le token
     */
    public function refresh(): JsonResponse
    {
        $token = auth()->refresh();

        return response()->json([
            'success' => true,
            'token' => $token
        ]);
    }

    /**
     * Obtenir l'utilisateur connecté
     */
    public function me(): JsonResponse
    {
        $user = auth()->user();

        return response()->json([
            'success' => true,
            'user' => [
                'id' => $user->id,
                'email' => $user->email,
                'role' => $user->role,
                'firstName' => $user->first_name,
                'lastName' => $user->last_name,
                'patientId' => $user->patient_id,
                'staffId' => $user->staff_id,
            ]
        ]);
    }
}
