<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Staff;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

class StaffController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): JsonResponse
    {
        $staff = Staff::orderBy('created_at', 'desc')->get();

        return response()->json([
            'success' => true,
            'data' => $staff->map(function ($member) {
                return [
                    'id' => $member->id,
                    'firstName' => $member->first_name,
                    'lastName' => $member->last_name,
                    'role' => $member->role,
                    'specialty' => $member->specialty,
                    'phone' => $member->phone,
                    'email' => $member->email,
                    'schedule' => $member->schedule,
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
            'firstName' => 'required|string|max:255',
            'lastName' => 'required|string|max:255',
            'role' => 'required|in:dentist,assistant,receptionist,admin',
            'specialty' => 'nullable|string|max:255',
            'phone' => 'required|string',
            'email' => 'required|email|unique:staff,email',
            'schedule' => 'nullable|array',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors(),
            ], 422);
        }

        try {
            $staff = Staff::create([
                'id' => Str::uuid(),
                'first_name' => $request->firstName,
                'last_name' => $request->lastName,
                'role' => $request->role,
                'specialty' => $request->specialty,
                'phone' => $request->phone,
                'email' => $request->email,
                'schedule' => $request->schedule,
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Membre du personnel créé avec succès',
                'data' => [
                    'id' => $staff->id,
                    'firstName' => $staff->first_name,
                    'lastName' => $staff->last_name,
                    'role' => $staff->role,
                    'specialty' => $staff->specialty,
                    'phone' => $staff->phone,
                    'email' => $staff->email,
                    'schedule' => $staff->schedule,
                ]
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la création du membre du personnel',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id): JsonResponse
    {
        $member = Staff::find($id);

        if (!$member) {
            return response()->json([
                'success' => false,
                'message' => 'Membre du personnel non trouvé'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => [
                'id' => $member->id,
                'firstName' => $member->first_name,
                'lastName' => $member->last_name,
                'role' => $member->role,
                'specialty' => $member->specialty,
                'phone' => $member->phone,
                'email' => $member->email,
                'schedule' => $member->schedule,
            ]
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id): JsonResponse
    {
        $member = Staff::find($id);

        if (!$member) {
            return response()->json([
                'success' => false,
                'message' => 'Membre du personnel non trouvé'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'firstName' => 'sometimes|required|string|max:255',
            'lastName' => 'sometimes|required|string|max:255',
            'role' => 'sometimes|required|in:dentist,assistant,receptionist,admin',
            'specialty' => 'nullable|string|max:255',
            'phone' => 'sometimes|required|string',
            'email' => 'sometimes|required|email|unique:staff,email,' . $id,
            'schedule' => 'nullable|array',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors(),
            ], 422);
        }

        try {
            $member->update([
                'first_name' => $request->firstName ?? $member->first_name,
                'last_name' => $request->lastName ?? $member->last_name,
                'role' => $request->role ?? $member->role,
                'specialty' => $request->specialty ?? $member->specialty,
                'phone' => $request->phone ?? $member->phone,
                'email' => $request->email ?? $member->email,
                'schedule' => $request->schedule ?? $member->schedule,
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Membre du personnel mis à jour avec succès',
                'data' => [
                    'id' => $member->id,
                    'firstName' => $member->first_name,
                    'lastName' => $member->last_name,
                    'role' => $member->role,
                    'specialty' => $member->specialty,
                    'phone' => $member->phone,
                    'email' => $member->email,
                    'schedule' => $member->schedule,
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la mise à jour du membre du personnel',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id): JsonResponse
    {
        $member = Staff::find($id);

        if (!$member) {
            return response()->json([
                'success' => false,
                'message' => 'Membre du personnel non trouvé'
            ], 404);
        }

        try {
            $member->delete();

            return response()->json([
                'success' => true,
                'message' => 'Membre du personnel supprimé avec succès'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la suppression du membre du personnel',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
