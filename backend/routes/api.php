<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\PatientController;
use App\Http\Controllers\Api\AppointmentController;
use App\Http\Controllers\Api\TreatmentController;
use App\Http\Controllers\Api\StaffController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\ReminderController;
use App\Http\Controllers\Api\NotificationController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

// Routes publiques (sans authentification)
Route::prefix('auth')->group(function () {
    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/register', [AuthController::class, 'register']);
});

// Routes protégées (avec authentification JWT)
Route::middleware('auth:api')->group(function () {

    // Auth
    Route::prefix('auth')->group(function () {
        Route::post('/logout', [AuthController::class, 'logout']);
        Route::post('/refresh', [AuthController::class, 'refresh']);
        Route::get('/me', [AuthController::class, 'me']);
    });

    // Patients
    Route::apiResource('patients', PatientController::class);

    // Appointments
    Route::apiResource('appointments', AppointmentController::class);
    Route::post('/appointments/check-conflicts', [AppointmentController::class, 'checkConflicts']);

    // Treatments
    Route::apiResource('treatments', TreatmentController::class);

    // Staff - Liste accessible pour tout le monde (pour les rendez-vous), mais gestion seulement pour admin
    Route::get('staff', [StaffController::class, 'index']);
    Route::middleware('role:personnelAdministratif')->group(function () {
        Route::apiResource('staff', StaffController::class)->except(['index']);
    });

    // Dashboard
    Route::prefix('dashboard')->group(function () {
        Route::get('/stats', [DashboardController::class, 'stats']);
        Route::get('/upcoming-appointments', [DashboardController::class, 'upcomingAppointments']);
        Route::get('/pending-reminders', [DashboardController::class, 'pendingReminders']);
    });

    // Reminders
    Route::apiResource('reminders', ReminderController::class);

    // Notifications
    Route::prefix('notifications')->group(function () {
        Route::get('/', [NotificationController::class, 'index']);
        Route::get('/admin', [NotificationController::class, 'admin']);
        Route::put('/admin/{id}/read', [NotificationController::class, 'markAdminAsRead']);
        Route::put('/{id}/read', [NotificationController::class, 'markAsRead']);
        Route::get('/unread-count', [NotificationController::class, 'unreadCount']);
    });
});
