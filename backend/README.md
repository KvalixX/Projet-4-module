# Backend Laravel - Guide de Démarrage

## 🎉 Ce qui a été créé

### ✅ Configuration Complète
- Laravel 12 installé dans `backend/`
- JWT Auth configuré pour l'authentification
- Configuration MySQL dans `.env`
- Configuration CORS pour le frontend React
- Routes API configurées

### ✅ Base de Données
**7 Migrations créées** avec schémas complets :
- `users` - Authentification avec rôles
- `patients` - Dossiers patients
- `staff` - Personnel du cabinet
- `appointments` - Rendez-vous
- `treatments` - Traitements
- `reminders` - Rappels
- `notifications` - Notifications utilisateurs
- `admin_notifications` - Notifications admin

### ✅ Modèles Eloquent (POO)
**8 Modèles** avec relations, scopes et méthodes métier :
- `User` - JWT, rôles (patient, docteur, personnelAdministratif)
- `Patient` - Relations, accessors (fullName, age)
- `Staff` - Scopes (dentists, available)
- `Appointment` - Détection de conflits
- `Treatment` - Calculs de coûts
- `Reminder` - Gestion de statuts
- `Notification` - Système de lecture
- `AdminNotification` - Notifications admin

### ✅ API REST
**AuthController** créé avec :
- `POST /api/auth/login` - Connexion
- `POST /api/auth/register` - Inscription patient
- `POST /api/auth/logout` - Déconnexion
- `POST /api/auth/refresh` - Rafraîchir token
- `GET /api/auth/me` - Utilisateur connecté

---

## 🚀 Étapes pour Démarrer

### 1. Créer la Base de Données MySQL

Ouvrez votre client MySQL (phpMyAdmin, MySQL Workbench, ou ligne de commande) :

```sql
CREATE DATABASE dental_care CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

**Important** : Si votre utilisateur MySQL n'est pas `root` ou si vous avez un mot de passe, modifiez le fichier `backend/.env` :

```env
DB_USERNAME=votre_utilisateur
DB_PASSWORD=votre_mot_de_passe
```

### 2. Exécuter les Migrations

```bash
cd backend
php artisan migrate
```

Vous devriez voir :
```
Migration table created successfully.
Migrating: 0001_01_01_000000_create_users_table
Migrated:  0001_01_01_000000_create_users_table
Migrating: 2025_12_14_210758_create_patients_table
Migrated:  2025_12_14_210758_create_patients_table
...
```

### 3. Créer des Données de Test (Optionnel)

Pour tester l'API, vous pouvez créer un utilisateur manuellement via MySQL ou créer un seeder.

**Option rapide - Via MySQL** :

```sql
USE dental_care;

-- Créer un patient
INSERT INTO patients (id, first_name, last_name, date_of_birth, phone, email, address, registration_date, created_at, updated_at)
VALUES (UUID(), 'Jean', 'Dupont', '1990-01-15', '0612345678', 'jean.dupont@example.com', '123 Rue de Paris', NOW(), NOW(), NOW());

-- Créer un utilisateur patient
INSERT INTO users (id, email, password, role, first_name, last_name, patient_id, created_at, updated_at)
VALUES (
    UUID(),
    'jean.dupont@example.com',
    '$2y$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5NANh98WvUtzG', -- password: password
    'patient',
    'Jean',
    'Dupont',
    (SELECT id FROM patients WHERE email = 'jean.dupont@example.com'),
    NOW(),
    NOW()
);

-- Créer un dentiste
INSERT INTO staff (id, first_name, last_name, role, phone, email, created_at, updated_at)
VALUES (UUID(), 'Dr. Marie', 'Martin', 'dentist', '0623456789', 'dr.martin@dentalcare.com', NOW(), NOW());

-- Créer un utilisateur docteur
INSERT INTO users (id, email, password, role, first_name, last_name, staff_id, created_at, updated_at)
VALUES (
    UUID(),
    'dr.martin@dentalcare.com',
    '$2y$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5NANh98WvUtzG', -- password: password
    'docteur',
    'Dr. Marie',
    'Martin',
    (SELECT id FROM staff WHERE email = 'dr.martin@dentalcare.com'),
    NOW(),
    NOW()
);
```

### 4. Démarrer le Serveur Laravel

```bash
php artisan serve
```

Le serveur démarre sur `http://localhost:8000`

### 5. Tester l'API

**Test de connexion** (avec Postman, Insomnia, ou curl) :

```bash
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "jean.dupont@example.com",
    "password": "password"
  }'
```

Réponse attendue :
```json
{
  "success": true,
  "token": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "user": {
    "id": "...",
    "email": "jean.dupont@example.com",
    "role": "patient",
    "firstName": "Jean",
    "lastName": "Dupont",
    "patientId": "..."
  }
}
```

**Test d'inscription** :

```bash
curl -X POST http://localhost:8000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Sophie",
    "lastName": "Bernard",
    "email": "sophie.bernard@example.com",
    "password": "password123",
    "password_confirmation": "password123",
    "dateOfBirth": "1995-05-20",
    "phone": "0634567890",
    "address": "456 Avenue de Lyon"
  }'
```

---

## 📋 Prochaines Étapes

### Controllers à Créer

```bash
# Patients
php artisan make:controller Api/PatientController --api

# Appointments
php artisan make:controller Api/AppointmentController --api

# Treatments
php artisan make:controller Api/TreatmentController --api

# Staff
php artisan make:controller Api/StaffController --api

# Reminders
php artisan make:controller Api/ReminderController --api

# Notifications
php artisan make:controller Api/NotificationController

# Dashboard
php artisan make:controller Api/DashboardController
```

### Services à Créer

```bash
mkdir app/Services
# Puis créer manuellement :
# - PatientService.php
# - AppointmentService.php
# - TreatmentService.php
# - NotificationService.php
# - DashboardService.php
```

### Repositories à Créer (Optionnel)

```bash
mkdir app/Repositories
# Puis créer manuellement les repositories
```

### Form Requests pour Validation

```bash
php artisan make:request StorePatientRequest
php artisan make:request UpdatePatientRequest
php artisan make:request StoreAppointmentRequest
php artisan make:request UpdateAppointmentRequest
# etc...
```

---

## 🔧 Commandes Utiles

```bash
# Vider le cache
php artisan cache:clear
php artisan config:clear
php artisan route:clear

# Voir toutes les routes
php artisan route:list

# Voir les migrations
php artisan migrate:status

# Rollback migrations
php artisan migrate:rollback

# Rafraîchir la base de données
php artisan migrate:fresh

# Créer un seeder
php artisan make:seeder DatabaseSeeder

# Exécuter les seeders
php artisan db:seed
```

---

## 🌐 Intégration Frontend

### 1. Installer Axios dans le Frontend

```bash
cd ..  # Retour à la racine du projet
npm install axios jwt-decode
```

### 2. Créer le Service API

Créer `src/services/apiService.ts` :

```typescript
import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur pour ajouter le token JWT
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authService = {
  login: async (email: string, password: string) => {
    const response = await apiClient.post('/auth/login', { email, password });
    return response.data;
  },
  
  register: async (data: any) => {
    const response = await apiClient.post('/auth/register', data);
    return response.data;
  },
  
  logout: async () => {
    const response = await apiClient.post('/auth/logout');
    localStorage.removeItem('token');
    return response.data;
  },
  
  me: async () => {
    const response = await apiClient.get('/auth/me');
    return response.data;
  },
};

// Ajouter d'autres services (patients, appointments, etc.)
```

### 3. Adapter le Composant Login

Modifier `src/components/Login.tsx` pour utiliser l'API :

```typescript
const handleLogin = async (e: React.FormEvent) => {
  e.preventDefault();
  try {
    const response = await authService.login(email, password);
    if (response.success) {
      localStorage.setItem('token', response.token);
      localStorage.setItem('currentUser', JSON.stringify(response.user));
      onLogin(response.user);
    }
  } catch (error) {
    console.error('Erreur de connexion:', error);
    alert('Email ou mot de passe incorrect');
  }
};
```

---

## 📚 Documentation

### Structure des Réponses API

Toutes les réponses suivent ce format :

**Succès** :
```json
{
  "success": true,
  "data": { ... },
  "message": "Message optionnel"
}
```

**Erreur** :
```json
{
  "success": false,
  "message": "Message d'erreur",
  "errors": { ... }
}
```

### Authentification JWT

Toutes les routes protégées nécessitent un header :
```
Authorization: Bearer {token}
```

Le token est valide pendant 60 minutes (configurable dans `.env` : `JWT_TTL=60`)

---

## ⚠️ Troubleshooting

### Erreur "Access denied for user"
- Vérifiez les identifiants MySQL dans `backend/.env`
- Assurez-vous que MySQL est démarré

### Erreur "Base table or view not found"
- Exécutez les migrations : `php artisan migrate`

### Erreur CORS
- Vérifiez que `FRONTEND_URL=http://localhost:5173` est dans `.env`
- Redémarrez le serveur Laravel

### Token invalide
- Vérifiez que `JWT_SECRET` est défini dans `.env`
- Régénérez le secret : `php artisan jwt:secret`

---

## 📞 Support

Pour toute question ou problème :
1. Consultez `PROGRESS.md` pour l'état d'avancement
2. Consultez `DATABASE_SETUP.md` pour la configuration MySQL
3. Vérifiez les logs Laravel : `storage/logs/laravel.log`

---

**Bon développement ! 🚀**
