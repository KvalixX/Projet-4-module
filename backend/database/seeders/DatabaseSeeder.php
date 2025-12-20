<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Patient;
use App\Models\Staff;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // 1. Créer un patient
        $patient = Patient::create([
            'id' => Str::uuid(),
            'first_name' => 'Jean',
            'last_name' => 'Dupont',
            'date_of_birth' => '1990-05-15',
            'phone' => '0612345678',
            'email' => 'patient@test.com',
            'address' => '123 Rue de Paris, 75001 Paris',
            'blood_type' => 'A+',
            'allergies' => ['Pénicilline', 'Pollen'],
            'medical_history' => 'Aucun antécédent majeur',
            'registration_date' => now(),
        ]);

        // Créer l'utilisateur patient
        User::create([
            'id' => Str::uuid(),
            'email' => 'patient@test.com',
            'password' => Hash::make('password'),
            'role' => 'patient',
            'first_name' => 'Jean',
            'last_name' => 'Dupont',
            'patient_id' => $patient->id,
        ]);

        // 2. Créer un dentiste
        $dentist = Staff::create([
            'id' => Str::uuid(),
            'first_name' => 'Dr. Marie',
            'last_name' => 'Martin',
            'role' => 'dentist',
            'specialty' => 'Orthodontie',
            'phone' => '0623456789',
            'email' => 'docteur@test.com',
            'schedule' => ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi'],
        ]);

        // Créer l'utilisateur docteur
        User::create([
            'id' => Str::uuid(),
            'email' => 'docteur@test.com',
            'password' => Hash::make('password'),
            'role' => 'docteur',
            'first_name' => 'Dr. Marie',
            'last_name' => 'Martin',
            'staff_id' => $dentist->id,
        ]);

        // 3. Créer un personnel administratif
        $admin = Staff::create([
            'id' => Str::uuid(),
            'first_name' => 'Sophie',
            'last_name' => 'Bernard',
            'role' => 'admin',
            'phone' => '0634567890',
            'email' => 'admin@test.com',
        ]);

        // Créer l'utilisateur admin
        User::create([
            'id' => Str::uuid(),
            'email' => 'admin@test.com',
            'password' => Hash::make('password'),
            'role' => 'personnelAdministratif',
            'first_name' => 'Sophie',
            'last_name' => 'Bernard',
            'staff_id' => $admin->id,
        ]);

        // 4. Créer quelques patients supplémentaires
        $patient2 = Patient::create([
            'id' => Str::uuid(),
            'first_name' => 'Marie',
            'last_name' => 'Dubois',
            'date_of_birth' => '1985-08-20',
            'phone' => '0645678901',
            'email' => 'marie.dubois@example.com',
            'address' => '456 Avenue de Lyon, 69001 Lyon',
            'blood_type' => 'O+',
            'allergies' => [],
            'medical_history' => 'Diabète type 2',
            'registration_date' => now()->subDays(30),
        ]);

        $patient3 = Patient::create([
            'id' => Str::uuid(),
            'first_name' => 'Pierre',
            'last_name' => 'Leroy',
            'date_of_birth' => '1995-03-10',
            'phone' => '0656789012',
            'email' => 'pierre.leroy@example.com',
            'address' => '789 Boulevard de Marseille, 13001 Marseille',
            'blood_type' => 'B+',
            'allergies' => ['Latex'],
            'medical_history' => 'Hypertension',
            'registration_date' => now()->subDays(15),
        ]);

        // 5. Créer un autre dentiste
        $dentist2 = Staff::create([
            'id' => Str::uuid(),
            'first_name' => 'Dr. Thomas',
            'last_name' => 'Petit',
            'role' => 'dentist',
            'specialty' => 'Chirurgie dentaire',
            'phone' => '0667890123',
            'email' => 'thomas.petit@dentalcare.com',
            'schedule' => ['Lundi', 'Mercredi', 'Vendredi'],
        ]);

        // 6. Créer quelques rendez-vous
        \App\Models\Appointment::create([
            'id' => Str::uuid(),
            'patient_id' => $patient->id,
            'patient_name' => $patient->first_name . ' ' . $patient->last_name,
            'dentist_id' => $dentist->id,
            'dentist_name' => $dentist->first_name . ' ' . $dentist->last_name,
            'date' => now()->addDays(2),
            'time' => '09:00',
            'duration' => 30,
            'type' => 'Consultation',
            'status' => 'scheduled',
            'notes' => 'Contrôle de routine',
        ]);

        \App\Models\Appointment::create([
            'id' => Str::uuid(),
            'patient_id' => $patient2->id,
            'patient_name' => $patient2->first_name . ' ' . $patient2->last_name,
            'dentist_id' => $dentist->id,
            'dentist_name' => $dentist->first_name . ' ' . $dentist->last_name,
            'date' => now()->addDays(3),
            'time' => '14:00',
            'duration' => 60,
            'type' => 'Détartrage',
            'status' => 'scheduled',
            'notes' => 'Détartrage complet',
        ]);

        \App\Models\Appointment::create([
            'id' => Str::uuid(),
            'patient_id' => $patient3->id,
            'patient_name' => $patient3->first_name . ' ' . $patient3->last_name,
            'dentist_id' => $dentist2->id,
            'dentist_name' => $dentist2->first_name . ' ' . $dentist2->last_name,
            'date' => now()->addDays(5),
            'time' => '10:30',
            'duration' => 45,
            'type' => 'Plombage',
            'status' => 'scheduled',
            'notes' => 'Carie molaire gauche',
        ]);

        // 7. Créer quelques traitements
        \App\Models\Treatment::create([
            'id' => Str::uuid(),
            'patient_id' => $patient->id,
            'patient_name' => $patient->first_name . ' ' . $patient->last_name,
            'date' => now()->subDays(10),
            'type' => 'Détartrage',
            'tooth' => null,
            'description' => 'Détartrage complet avec polissage',
            'cost' => 80.00,
            'dentist_id' => $dentist->id,
            'dentist_name' => $dentist->first_name . ' ' . $dentist->last_name,
            'prescriptions' => [],
            'next_visit' => now()->addMonths(6),
        ]);

        \App\Models\Treatment::create([
            'id' => Str::uuid(),
            'patient_id' => $patient2->id,
            'patient_name' => $patient2->first_name . ' ' . $patient2->last_name,
            'date' => now()->subDays(5),
            'type' => 'Plombage',
            'tooth' => '36',
            'description' => 'Plombage composite molaire inférieure gauche',
            'cost' => 120.00,
            'dentist_id' => $dentist->id,
            'dentist_name' => $dentist->first_name . ' ' . $dentist->last_name,
            'prescriptions' => ['Ibuprofène 400mg - 3x/jour pendant 3 jours'],
            'next_visit' => now()->addWeeks(2),
        ]);

        // 8. Créer quelques rappels
        \App\Models\Reminder::create([
            'id' => Str::uuid(),
            'patient_id' => $patient->id,
            'patient_name' => $patient->first_name . ' ' . $patient->last_name,
            'type' => 'checkup',
            'due_date' => now()->addMonths(6),
            'message' => 'Contrôle semestriel',
            'status' => 'pending',
        ]);

        \App\Models\Reminder::create([
            'id' => Str::uuid(),
            'patient_id' => $patient2->id,
            'patient_name' => $patient2->first_name . ' ' . $patient2->last_name,
            'type' => 'followup',
            'due_date' => now()->addWeeks(2),
            'message' => 'Suivi après plombage',
            'status' => 'pending',
        ]);

        echo "\n✅ Données de test créées avec succès !\n\n";
        echo "📧 Comptes de test créés :\n";
        echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n";
        echo "👤 PATIENT\n";
        echo "   Email    : patient@test.com\n";
        echo "   Password : password\n";
        echo "   Nom      : Jean Dupont\n\n";
        echo "👨‍⚕️ DOCTEUR\n";
        echo "   Email    : docteur@test.com\n";
        echo "   Password : password\n";
        echo "   Nom      : Dr. Marie Martin\n\n";
        echo "👔 ADMIN (Personnel Administratif)\n";
        echo "   Email    : admin@test.com\n";
        echo "   Password : password\n";
        echo "   Nom      : Sophie Bernard\n";
        echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n";
        echo "📊 Données supplémentaires :\n";
        echo "   • 3 patients\n";
        echo "   • 2 dentistes\n";
        echo "   • 3 rendez-vous\n";
        echo "   • 2 traitements\n";
        echo "   • 2 rappels\n\n";
    }
}
