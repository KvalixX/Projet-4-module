# Backend Laravel - État d'Avancement

## ✅ Complété

### 1. Installation et Configuration
- ✅ Laravel 12 installé dans le dossier `backend/`
- ✅ Configuration `.env` pour MySQL
- ✅ Clé d'application générée
- ✅ JWT Auth installé et configuré
- ✅ Secret JWT généré

### 2. Migrations de Base de Données
Toutes les migrations créées avec schémas complets :
- ✅ `users` - Utilisateurs avec rôles (patient, docteur, personnelAdministratif)
- ✅ `patients` - Informations patients avec UUID
- ✅ `staff` - Personnel du cabinet
- ✅ `appointments` - Rendez-vous avec relations
- ✅ `treatments` - Traitements médicaux
- ✅ `reminders` - Rappels pour patients
- ✅ `notifications` - Notifications utilisateurs
- ✅ `admin_notifications` - Notifications administratives

### 3. Modèles Eloquent (POO)
Tous les modèles créés avec :
- ✅ **Patient** - Relations, accessors (fullName, age)
- ✅ **User** - JWT implementation, méthodes de rôle
- ✅ **Staff** - Scopes (dentists, available)
- ✅ **Appointment** - Détection de conflits, scopes temporels
- ✅ **Treatment** - Calculs de coûts
- ✅ **Reminder** - Gestion de statuts
- ✅ **Notification** - Système de lecture
- ✅ **AdminNotification** - Notifications admin

## 📋 Prochaines Étapes

### 1. Base de Données MySQL
**IMPORTANT** : Créer la base de données avant de continuer

```sql
CREATE DATABASE dental_care CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

Puis exécuter les migrations :
```bash
cd backend
php artisan migrate
```

### 2. Configuration CORS
Configurer CORS pour permettre les requêtes du frontend React (port 5173)

### 3. Controllers API
Créer les controllers pour :
- AuthController (login, register, logout, refresh, me)
- PatientController (CRUD + history)
- AppointmentController (CRUD + conflict check)
- TreatmentController (CRUD + patient treatments)
- StaffController (CRUD)
- ReminderController (CRUD)
- NotificationController (get, mark as read, count)
- DashboardController (statistics)

### 4. Services (Logique Métier)
Créer les services pour :
- PatientService
- AppointmentService (avec notifications)
- TreatmentService
- AuthService
- NotificationService
- DashboardService

### 5. Repositories
Créer les repositories pour l'accès aux données

### 6. Request Validation
Créer les Form Requests pour valider les données entrantes

### 7. Routes API
Définir toutes les routes dans `routes/api.php`

### 8. Seeders
Créer des données de test pour le développement

### 9. Frontend Integration
- Installer Axios dans le frontend
- Créer ApiService pour remplacer DataService
- Adapter les composants React

## 📁 Structure Actuelle

```
backend/
├── app/
│   └── Models/
│       ├── User.php ✅
│       ├── Patient.php ✅
│       ├── Staff.php ✅
│       ├── Appointment.php ✅
│       ├── Treatment.php ✅
│       ├── Reminder.php ✅
│       ├── Notification.php ✅
│       └── AdminNotification.php ✅
├── database/
│   └── migrations/
│       ├── 0001_01_01_000000_create_users_table.php ✅
│       ├── 2025_12_14_210758_create_patients_table.php ✅
│       ├── 2025_12_14_210805_create_staff_table.php ✅
│       ├── 2025_12_14_210820_create_appointments_table.php ✅
│       ├── 2025_12_14_210829_create_treatments_table.php ✅
│       ├── 2025_12_14_210837_create_reminders_table.php ✅
│       ├── 2025_12_14_210844_create_notifications_table.php ✅
│       └── 2025_12_14_210857_create_admin_notifications_table.php ✅
├── config/
│   └── jwt.php ✅
└── .env ✅

À créer :
├── app/
│   ├── Http/
│   │   ├── Controllers/
│   │   │   └── Api/
│   │   ├── Requests/
│   │   └── Middleware/
│   ├── Services/
│   └── Repositories/
└── database/
    └── seeders/
```

## 🔧 Commandes Utiles

```bash
# Créer la base de données (via MySQL client)
CREATE DATABASE dental_care;

# Exécuter les migrations
php artisan migrate

# Créer un controller
php artisan make:controller Api/PatientController --api

# Créer un service
php artisan make:class Services/PatientService

# Créer une Request
php artisan make:request StorePatientRequest

# Créer un seeder
php artisan make:seeder DatabaseSeeder

# Démarrer le serveur
php artisan serve

# Vider le cache
php artisan cache:clear
php artisan config:clear
php artisan route:clear
```

## 📝 Notes Techniques

### UUID vs Auto-increment
Tous les modèles utilisent des UUID pour les clés primaires, comme dans le frontend TypeScript.

### Relations Eloquent
- Patient → hasMany → Appointments, Treatments, Reminders
- Staff → hasMany → Appointments, Treatments
- User → belongsTo → Patient, Staff
- User → hasMany → Notifications

### Soft Deletes
Activé sur : Patient, Staff, Appointment, Treatment, Reminder

### JWT Authentication
- Token TTL : 60 minutes (configurable dans .env)
- Claims personnalisés : role, first_name, last_name

### Validation
À implémenter dans les Form Requests pour :
- Email unique
- Dates valides
- Relations existantes (foreign keys)
- Détection de conflits de rendez-vous
