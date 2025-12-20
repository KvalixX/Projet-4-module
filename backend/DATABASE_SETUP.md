# Guide de Configuration de la Base de Données MySQL

## Étape 1: Créer la base de données

Ouvrez votre client MySQL (phpMyAdmin, MySQL Workbench, ou ligne de commande) et exécutez:

```sql
CREATE DATABASE dental_care CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

## Étape 2: Vérifier la configuration

Le fichier `backend/.env` est déjà configuré avec:

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=dental_care
DB_USERNAME=root
DB_PASSWORD=
```

**Important**: Si votre utilisateur MySQL n'est pas `root` ou si vous avez un mot de passe, modifiez les valeurs `DB_USERNAME` et `DB_PASSWORD` dans le fichier `backend/.env`.

## Étape 3: Tester la connexion

Après avoir créé la base de données, testez la connexion avec:

```bash
cd backend
php artisan migrate:status
```

Si la connexion fonctionne, vous verrez un message indiquant qu'aucune migration n'a encore été exécutée.

## Étape 4: Exécuter les migrations

Une fois que toutes les migrations seront créées, vous pourrez les exécuter avec:

```bash
php artisan migrate
```

## Étape 5: Peupler la base de données (optionnel)

Pour ajouter des données de test:

```bash
php artisan db:seed
```

## Dépannage

### Erreur de connexion
Si vous obtenez une erreur "Access denied", vérifiez:
1. Que MySQL est démarré
2. Que les identifiants dans `.env` sont corrects
3. Que la base de données `dental_care` existe

### Erreur "database does not exist"
Assurez-vous d'avoir créé la base de données avec la commande SQL ci-dessus.

### Port MySQL différent
Si MySQL utilise un port différent de 3306, modifiez `DB_PORT` dans `.env`.
