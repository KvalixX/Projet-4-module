<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckRole
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     * @param  string  $roles  Roles autorisés séparés par des virgules
     */
    public function handle(Request $request, Closure $next, string $roles): Response
    {
        $user = auth()->user();

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'Non authentifié'
            ], 401);
        }

        // Admin a accès à tout
        if ($user->role === 'personnelAdministratif') {
            return $next($request);
        }

        // Vérifier si le rôle de l'utilisateur est dans les rôles autorisés
        $allowedRoles = explode(',', $roles);

        if (!in_array($user->role, $allowedRoles)) {
            return response()->json([
                'success' => false,
                'message' => 'Accès non autorisé'
            ], 403);
        }

        return $next($request);
    }
}
