# 🚀 Guide de Démarrage Rapide - Base de Données

## Étape 1 : Créer la Base de Données MySQL

Ouvrez votre terminal MySQL (ou phpMyAdmin) :

```bash
mysql -u root -p
```

Puis exécutez :

```sql
CREATE DATABASE dental_care CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
exit;
```

## Étape 2 : Exécuter les Migrations

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

## Étape 3 : Insérer les Données de Test

```bash
php artisan db:seed
```

Vous verrez :
```
✅ Données de test créées avec succès !

📧 Comptes de test créés :
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
👤 PATIENT
   Email    : patient@test.com
   Password : password
   Nom      : Jean Dupont

👨‍⚕️ DOCTEUR
   Email    : docteur@test.com
   Password : password
   Nom      : Dr. Marie Martin

👔 ADMIN (Personnel Administratif)
   Email    : admin@test.com
   Password : password
   Nom      : Sophie Bernard
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📊 Données supplémentaires :
   • 3 patients
   • 2 dentistes
   • 3 rendez-vous
   • 2 traitements
   • 2 rappels
```

## Étape 4 : Démarrer le Serveur

```bash
php artisan serve
```

Le serveur démarre sur **http://localhost:8000**

## 🧪 Tester l'API

### Test de Connexion - Patient

```bash
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "patient@test.com",
    "password": "password"
  }'
```

### Test de Connexion - Docteur

```bash
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "docteur@test.com",
    "password": "password"
  }'
```

### Test de Connexion - Admin

```bash
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@test.com",
    "password": "password"
  }'
```

### Récupérer la Liste des Patients (avec token)

```bash
# Remplacez {TOKEN} par le token obtenu lors de la connexion
curl -X GET http://localhost:8000/api/patients \
  -H "Authorization: Bearer {TOKEN}"
```

### Récupérer les Statistiques du Dashboard

```bash
curl -X GET http://localhost:8000/api/dashboard/stats \
  -H "Authorization: Bearer {TOKEN}"
```

## 📋 Comptes de Test Créés

| Rôle | Email | Password | Nom |
|------|-------|----------|-----|
| Patient | patient@test.com | password | Jean Dupont |
| Docteur | docteur@test.com | password | Dr. Marie Martin |
| Admin | admin@test.com | password | Sophie Bernard |

## 📊 Données de Test Insérées

- **3 Patients** : Jean Dupont, Marie Dubois, Pierre Leroy
- **2 Dentistes** : Dr. Marie Martin (Orthodontie), Dr. Thomas Petit (Chirurgie)
- **1 Admin** : Sophie Bernard
- **3 Rendez-vous** planifiés dans les prochains jours
- **2 Traitements** passés (détartrage, plombage)
- **2 Rappels** en attente

## 🔄 Réinitialiser la Base de Données

Si vous voulez tout recommencer :

```bash
# Supprimer toutes les tables et recréer
php artisan migrate:fresh

# Supprimer et recréer + insérer les données de test
php artisan migrate:fresh --seed
```

## ⚠️ Troubleshooting

### Erreur "Access denied for user"
- Vérifiez `DB_USERNAME` et `DB_PASSWORD` dans `backend/.env`

### Erreur "Database does not exist"
- Créez la base de données : `CREATE DATABASE dental_care;`

### Erreur "SQLSTATE[42S01]: Base table or view already exists"
- Utilisez : `php artisan migrate:fresh --seed`

## 🎯 Prochaine Étape

Maintenant que la base de données est prête, vous pouvez :

1. **Tester l'API** avec Postman ou curl
2. **Intégrer le frontend** React avec les services API
3. **Développer les fonctionnalités** manquantes

Consultez `backend/README.md` pour plus de détails !
