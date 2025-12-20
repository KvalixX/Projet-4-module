# 🧪 Guide de Test - Compte Admin

## 📧 Identifiants Admin

```
Email    : admin@test.com
Password : password
Rôle     : personnelAdministratif
Nom      : Sophie Bernard
```

---

## 🚀 Étape 1 : Connexion Admin

### Avec curl

```bash
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@test.com",
    "password": "password"
  }'
```

### Réponse attendue

```json
{
  "success": true,
  "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
  "user": {
    "id": "uuid-de-l-admin",
    "email": "admin@test.com",
    "role": "personnelAdministratif",
    "firstName": "Sophie",
    "lastName": "Bernard",
    "staffId": "uuid-du-staff"
  }
}
```

**💡 Important** : Copiez le `token` pour les requêtes suivantes !

---

## ✅ Étape 2 : Tests des Permissions Admin

### 1. ✅ Voir Tous les Patients (AUTORISÉ)

```bash
curl -X GET http://localhost:8000/api/patients \
  -H "Authorization: Bearer VOTRE_TOKEN"
```

**Résultat attendu** : Liste de tous les patients (Jean Dupont, Marie Dubois, Pierre Leroy)

---

### 2. ✅ Créer un Nouveau Patient (AUTORISÉ)

```bash
curl -X POST http://localhost:8000/api/patients \
  -H "Authorization: Bearer VOTRE_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Alice",
    "lastName": "Moreau",
    "dateOfBirth": "1992-07-15",
    "phone": "0678901234",
    "email": "alice.moreau@example.com",
    "address": "10 Rue de la Paix, 75002 Paris",
    "bloodType": "AB+",
    "allergies": ["Aspirine"],
    "medicalHistory": "Aucun antécédent"
  }'
```

**Résultat attendu** : Patient créé avec succès

---

### 3. ✅ Voir Tous les Rendez-vous (AUTORISÉ)

```bash
curl -X GET http://localhost:8000/api/appointments \
  -H "Authorization: Bearer VOTRE_TOKEN"
```

**Résultat attendu** : Liste de tous les rendez-vous

---

### 4. ✅ Créer un Rendez-vous (AUTORISÉ)

```bash
# D'abord, récupérez les IDs des patients et dentistes
curl -X GET http://localhost:8000/api/patients \
  -H "Authorization: Bearer VOTRE_TOKEN"

curl -X GET http://localhost:8000/api/staff \
  -H "Authorization: Bearer VOTRE_TOKEN"

# Puis créez le rendez-vous (remplacez les UUIDs)
curl -X POST http://localhost:8000/api/appointments \
  -H "Authorization: Bearer VOTRE_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "patientId": "UUID_DU_PATIENT",
    "dentistId": "UUID_DU_DENTISTE",
    "date": "2025-12-20",
    "time": "15:00",
    "duration": 30,
    "type": "Consultation",
    "notes": "Rendez-vous créé par l admin"
  }'
```

**Résultat attendu** : Rendez-vous créé avec succès

---

### 5. ✅ Modifier un Rendez-vous (AUTORISÉ)

```bash
curl -X PUT http://localhost:8000/api/appointments/UUID_DU_RENDEZ_VOUS \
  -H "Authorization: Bearer VOTRE_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "completed",
    "notes": "Rendez-vous terminé"
  }'
```

**Résultat attendu** : Rendez-vous modifié avec succès

---

### 6. ✅ Voir les Statistiques (AUTORISÉ)

```bash
curl -X GET http://localhost:8000/api/dashboard/stats \
  -H "Authorization: Bearer VOTRE_TOKEN"
```

**Résultat attendu** : Statistiques complètes du cabinet

---

### 7. ❌ Créer un Traitement (NON AUTORISÉ)

**Note** : Cette fonctionnalité devrait être bloquée pour les admins (à implémenter avec middleware)

```bash
curl -X POST http://localhost:8000/api/treatments \
  -H "Authorization: Bearer VOTRE_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "patientId": "UUID_DU_PATIENT",
    "dentistId": "UUID_DU_DENTISTE",
    "date": "2025-12-14",
    "type": "Détartrage",
    "description": "Test",
    "cost": 80
  }'
```

**Résultat attendu** : Erreur 403 Forbidden (une fois le middleware implémenté)

---

## 🧪 Test Complet avec Postman

### Configuration Postman

1. **Créer une collection** : "Tests Admin"

2. **Créer une variable d'environnement** :
   - `base_url` = `http://localhost:8000/api`
   - `admin_token` = (vide pour l'instant)

### Requêtes à créer

#### 1️⃣ Login Admin
- **Method** : POST
- **URL** : `{{base_url}}/auth/login`
- **Body** (JSON) :
```json
{
  "email": "admin@test.com",
  "password": "password"
}
```
- **Tests** (pour sauvegarder le token) :
```javascript
pm.environment.set("admin_token", pm.response.json().token);
```

#### 2️⃣ Get Me (vérifier l'utilisateur connecté)
- **Method** : GET
- **URL** : `{{base_url}}/auth/me`
- **Headers** :
  - `Authorization` : `Bearer {{admin_token}}`

#### 3️⃣ Get All Patients
- **Method** : GET
- **URL** : `{{base_url}}/patients`
- **Headers** :
  - `Authorization` : `Bearer {{admin_token}}`

#### 4️⃣ Create Patient
- **Method** : POST
- **URL** : `{{base_url}}/patients`
- **Headers** :
  - `Authorization` : `Bearer {{admin_token}}`
- **Body** (JSON) :
```json
{
  "firstName": "Test",
  "lastName": "Admin",
  "dateOfBirth": "1990-01-01",
  "phone": "0600000000",
  "email": "test.admin@example.com",
  "address": "123 Test Street"
}
```

#### 5️⃣ Get All Appointments
- **Method** : GET
- **URL** : `{{base_url}}/appointments`
- **Headers** :
  - `Authorization` : `Bearer {{admin_token}}`

#### 6️⃣ Dashboard Stats
- **Method** : GET
- **URL** : `{{base_url}}/dashboard/stats`
- **Headers** :
  - `Authorization` : `Bearer {{admin_token}}`

---

## 📊 Comparaison des Permissions

| Action | Patient | Admin | Docteur |
|--------|---------|-------|---------|
| Voir tous les patients | ❌ | ✅ | ✅ |
| Créer un patient | ❌ | ✅ | ✅ |
| Modifier un patient | ❌ | ✅ | ✅ |
| Supprimer un patient | ❌ | ⚠️ | ✅ |
| Voir tous les rendez-vous | ❌ | ✅ | ✅ |
| Créer un rendez-vous | ✅ (soi) | ✅ | ✅ |
| Modifier un rendez-vous | ✅ (soi) | ✅ | ✅ |
| Annuler un rendez-vous | ✅ (soi) | ✅ | ✅ |
| Créer un traitement | ❌ | ❌ | ✅ |
| Modifier un traitement | ❌ | ❌ | ✅ |
| Gérer le personnel | ❌ | ❌ | ✅ |
| Voir les statistiques | ❌ | ✅ | ✅ |

**Légende** : ✅ Autorisé | ❌ Interdit | ⚠️ Limité

---

## 🎯 Scénario de Test Complet

### Scénario : L'admin gère un nouveau patient

```bash
# 1. Connexion
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@test.com", "password": "password"}'

# Copiez le token reçu

# 2. Créer un nouveau patient
curl -X POST http://localhost:8000/api/patients \
  -H "Authorization: Bearer VOTRE_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Nouveau",
    "lastName": "Patient",
    "dateOfBirth": "1988-03-20",
    "phone": "0611223344",
    "email": "nouveau.patient@example.com",
    "address": "50 Avenue Test, 75001 Paris"
  }'

# 3. Récupérer la liste des patients pour vérifier
curl -X GET http://localhost:8000/api/patients \
  -H "Authorization: Bearer VOTRE_TOKEN"

# 4. Récupérer les dentistes disponibles
curl -X GET http://localhost:8000/api/staff \
  -H "Authorization: Bearer VOTRE_TOKEN"

# 5. Créer un rendez-vous pour ce patient
curl -X POST http://localhost:8000/api/appointments \
  -H "Authorization: Bearer VOTRE_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "patientId": "UUID_DU_NOUVEAU_PATIENT",
    "dentistId": "UUID_DU_DENTISTE",
    "date": "2025-12-25",
    "time": "10:00",
    "duration": 30,
    "type": "Première consultation",
    "notes": "Nouveau patient"
  }'

# 6. Vérifier les rendez-vous
curl -X GET http://localhost:8000/api/appointments \
  -H "Authorization: Bearer VOTRE_TOKEN"

# 7. Voir les statistiques mises à jour
curl -X GET http://localhost:8000/api/dashboard/stats \
  -H "Authorization: Bearer VOTRE_TOKEN"
```

---

## 💡 Conseils de Test

1. **Utilisez Postman** pour une meilleure expérience
2. **Sauvegardez le token** dans une variable d'environnement
3. **Testez les erreurs** en essayant des actions non autorisées
4. **Comparez avec les autres rôles** (patient, docteur)

---

## 🔄 Réinitialiser pour Retester

```bash
# Supprimer toutes les données et recommencer
php artisan migrate:fresh --seed
```

---

## 📚 Documentation Complète

- **Tous les endpoints** : `backend/IMPLEMENTATION_COMPLETE.md`
- **Guide de démarrage** : `backend/QUICK_START.md`
- **Tous les comptes** : `backend/TEST_ACCOUNTS.md`
