# 🔐 Comptes de Test - Dental Care API

## 📧 Identifiants de Connexion

### 👤 PATIENT
```
Email    : patient@test.com
Password : password
Rôle     : patient
Nom      : Jean Dupont
```

**Accès** :
- ✅ Voir son propre dossier médical
- ✅ Voir ses rendez-vous
- ✅ Créer/modifier/annuler ses rendez-vous
- ✅ Voir ses traitements
- ✅ Voir ses notifications
- ❌ Accès aux autres patients
- ❌ Gestion du personnel
- ❌ Gestion des traitements

---

### 👨‍⚕️ DOCTEUR
```
Email    : docteur@test.com
Password : password
Rôle     : docteur
Nom      : Dr. Marie Martin
Spécialité : Orthodontie
```

**Accès** :
- ✅ Voir tous les patients
- ✅ Créer/modifier/supprimer des patients
- ✅ Voir tous les rendez-vous
- ✅ Créer/modifier/annuler des rendez-vous
- ✅ Créer/modifier/supprimer des traitements
- ✅ Gérer le personnel
- ✅ Voir les statistiques
- ✅ Gérer les rappels

---

### 👔 ADMIN (Personnel Administratif)
```
Email    : admin@test.com
Password : password
Rôle     : personnelAdministratif
Nom      : Sophie Bernard
```

**Accès** :
- ✅ Voir tous les patients
- ✅ Créer/modifier des patients
- ✅ Voir tous les rendez-vous
- ✅ Créer/modifier/annuler des rendez-vous
- ✅ Voir les statistiques
- ❌ Créer/modifier des traitements
- ❌ Gérer le personnel

---

## 🧪 Tests API avec curl

### 1. Connexion Patient

```bash
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "patient@test.com",
    "password": "password"
  }'
```

**Réponse attendue** :
```json
{
  "success": true,
  "token": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "user": {
    "id": "...",
    "email": "patient@test.com",
    "role": "patient",
    "firstName": "Jean",
    "lastName": "Dupont",
    "patientId": "..."
  }
}
```

### 2. Connexion Docteur

```bash
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "docteur@test.com",
    "password": "password"
  }'
```

### 3. Connexion Admin

```bash
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@test.com",
    "password": "password"
  }'
```

### 4. Récupérer les Patients (avec token)

```bash
curl -X GET http://localhost:8000/api/patients \
  -H "Authorization: Bearer {VOTRE_TOKEN}"
```

### 5. Récupérer les Rendez-vous

```bash
curl -X GET http://localhost:8000/api/appointments \
  -H "Authorization: Bearer {VOTRE_TOKEN}"
```

### 6. Statistiques Dashboard

```bash
curl -X GET http://localhost:8000/api/dashboard/stats \
  -H "Authorization: Bearer {VOTRE_TOKEN}"
```

---

## 🧪 Tests avec Postman

### Configuration

1. **Créer une nouvelle collection** : "Dental Care API"
2. **Ajouter une variable d'environnement** :
   - `base_url` = `http://localhost:8000/api`
   - `token` = (sera rempli après login)

### Requêtes à créer

#### 1. Login Patient
- **Method** : POST
- **URL** : `{{base_url}}/auth/login`
- **Body** (JSON) :
```json
{
  "email": "patient@test.com",
  "password": "password"
}
```
- **Tests** (pour sauvegarder le token) :
```javascript
pm.environment.set("token", pm.response.json().token);
```

#### 2. Get Patients
- **Method** : GET
- **URL** : `{{base_url}}/patients`
- **Headers** :
  - `Authorization` : `Bearer {{token}}`

#### 3. Get Appointments
- **Method** : GET
- **URL** : `{{base_url}}/appointments`
- **Headers** :
  - `Authorization` : `Bearer {{token}}`

#### 4. Dashboard Stats
- **Method** : GET
- **URL** : `{{base_url}}/dashboard/stats`
- **Headers** :
  - `Authorization` : `Bearer {{token}}`

---

## 📊 Données de Test Disponibles

### Patients (3)
1. **Jean Dupont** (patient@test.com)
   - Né le : 15/05/1990
   - Groupe sanguin : A+
   - Allergies : Pénicilline, Pollen

2. **Marie Dubois**
   - Né le : 20/08/1985
   - Groupe sanguin : O+
   - Antécédents : Diabète type 2

3. **Pierre Leroy**
   - Né le : 10/03/1995
   - Groupe sanguin : B+
   - Allergies : Latex

### Dentistes (2)
1. **Dr. Marie Martin** (docteur@test.com)
   - Spécialité : Orthodontie
   - Horaires : Lun-Ven

2. **Dr. Thomas Petit**
   - Spécialité : Chirurgie dentaire
   - Horaires : Lun, Mer, Ven

### Rendez-vous (3)
1. Jean Dupont → Dr. Martin (dans 2 jours, 09:00)
2. Marie Dubois → Dr. Martin (dans 3 jours, 14:00)
3. Pierre Leroy → Dr. Petit (dans 5 jours, 10:30)

### Traitements (2)
1. Jean Dupont - Détartrage (il y a 10 jours)
2. Marie Dubois - Plombage (il y a 5 jours)

### Rappels (2)
1. Jean Dupont - Contrôle semestriel (dans 6 mois)
2. Marie Dubois - Suivi plombage (dans 2 semaines)

---

## 🔄 Réinitialiser les Données

Pour recommencer avec des données fraîches :

```bash
php artisan migrate:fresh --seed
```

**⚠️ Attention** : Cette commande supprime TOUTES les données !

---

## 💡 Conseils

1. **Sauvegardez le token** après la connexion pour les requêtes suivantes
2. **Le token expire après 60 minutes** - utilisez `/auth/refresh` pour le renouveler
3. **Testez avec différents rôles** pour voir les restrictions d'accès
4. **Utilisez Postman** pour une meilleure expérience de test

---

## 📚 Documentation Complète

- **API Documentation** : `backend/IMPLEMENTATION_COMPLETE.md`
- **Quick Start** : `backend/QUICK_START.md`
- **Frontend Integration** : `FRONTEND_INTEGRATION.md`
