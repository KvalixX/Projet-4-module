<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Patient;
use App\Models\Appointment;
use App\Models\Treatment;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    /**
     * Obtenir les statistiques du tableau de bord
     */
    public function stats(): JsonResponse
    {
        try {
            // Nombre total de patients
            $totalPatients = Patient::count();

            // Rendez-vous du jour
            $todayAppointments = Appointment::whereDate('date', today())
                ->where('status', 'scheduled')
                ->count();

            // Revenus de la semaine
            $weekRevenue = Treatment::whereBetween('date', [
                now()->startOfWeek(),
                now()->endOfWeek()
            ])->sum('cost');

            // Taux de complétion des rendez-vous
            $totalAppointments = Appointment::count();
            $completedAppointments = Appointment::where('status', 'completed')->count();
            $completionRate = $totalAppointments > 0 
                ? round(($completedAppointments / $totalAppointments) * 100, 2)
                : 0;

            // Rendez-vous par jour (7 derniers jours)
            $appointmentsByDay = Appointment::select(
                DB::raw('DATE(date) as day'),
                DB::raw('COUNT(*) as count')
            )
            ->whereBetween('date', [now()->subDays(6), now()])
            ->groupBy('day')
            ->orderBy('day')
            ->get()
            ->map(function ($item) {
                return [
                    'day' => \Carbon\Carbon::parse($item->day)->format('Y-m-d'),
                    'count' => $item->count
                ];
            });

            // Types de traitements
            $treatmentTypes = Treatment::select('type', DB::raw('COUNT(*) as count'))
                ->groupBy('type')
                ->orderBy('count', 'desc')
                ->limit(10)
                ->get()
                ->map(function ($item) {
                    return [
                        'type' => $item->type,
                        'count' => $item->count
                    ];
                });

            return response()->json([
                'success' => true,
                'data' => [
                    'totalPatients' => $totalPatients,
                    'todayAppointments' => $todayAppointments,
                    'weekRevenue' => (float) $weekRevenue,
                    'completionRate' => $completionRate,
                    'appointmentsByDay' => $appointmentsByDay,
                    'treatmentTypes' => $treatmentTypes,
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la récupération des statistiques',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Obtenir les rendez-vous à venir
     */
    public function upcomingAppointments(): JsonResponse
    {
        $appointments = Appointment::with(['patient', 'dentist'])
            ->upcoming()
            ->limit(10)
            ->get();

        return response()->json([
            'success' => true,
            'data' => $appointments->map(function ($appointment) {
                return [
                    'id' => $appointment->id,
                    'patientName' => $appointment->patient_name,
                    'dentistName' => $appointment->dentist_name,
                    'date' => $appointment->date->format('Y-m-d'),
                    'time' => $appointment->time->format('H:i'),
                    'type' => $appointment->type,
                ];
            })
        ]);
    }

    /**
     * Obtenir les rappels en attente
     */
    public function pendingReminders(): JsonResponse
    {
        $reminders = \App\Models\Reminder::with('patient')
            ->pending()
            ->orderBy('due_date')
            ->limit(10)
            ->get();

        return response()->json([
            'success' => true,
            'data' => $reminders->map(function ($reminder) {
                return [
                    'id' => $reminder->id,
                    'patientName' => $reminder->patient_name,
                    'type' => $reminder->type,
                    'dueDate' => $reminder->due_date->format('Y-m-d'),
                    'message' => $reminder->message,
                ];
            })
        ]);
    }
}
