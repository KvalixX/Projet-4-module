# 🦷 Système de Gestion de Cabinet Dentaire (DentalCare)

[![React](https://img.shields.io/badge/Frontend-React-61DAFB?logo=react)](https://reactjs.org/)
[![Laravel](https://img.shields.io/badge/Backend-Laravel-FF2D20?logo=laravel)](https://laravel.com/)
[![TypeScript](https://img.shields.io/badge/Language-TypeScript-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![TailwindCSS](https://img.shields.io/badge/Styling-TailwindCSS-06B6D4?logo=tailwindcss)](https://tailwindcss.com/)
[![MySQL](https://img.shields.io/badge/Database-MySQL-4479A1?logo=mysql)](https://www.mysql.com/)

Une solution complète et moderne pour la gestion d'un cabinet dentaire, combinant une interface utilisateur intuitive, un backend robuste et un module avancé d'analyse de compilation.

---

## 🌟 Aperçu

Ce projet est une application web intégrée permettant de gérer l'ensemble des opérations d'un cabinet dentaire : de la prise de rendez-vous par les patients à la gestion des traitements par les dentistes, en passant par le suivi administratif et les rappels automatisés.

### Points Forts :
- **Multi-acteurs** : Espaces dédiés pour Patients, Docteurs et Personnel Administratif.
- **Design Premium** : Interface réactive avec animations fluides et mode sombre intégré.
- **Sécurité** : Authentification JWT et gestion fine des permissions.
- **Module de Compilation** : Analyseur complet (lexical, syntaxique, sémantique) pour le code source PHP.

---

## 🚀 Fonctionnalités

### 👤 Espace Patient
- **Landing Page Moderne** : Présentation du cabinet et des services.
- **Authentification** : Inscription et connexion sécurisées.
- **Rendez-vous** : Prise de RDV en ligne, modification et annulation.
- **Dossier Médical** : Consultation de l'historique et des traitements.
- **Notifications** : Réception de rappels automatiques.

### 🩺 Espace Docteur (Dentiste)
- **Tableau de Bord** : Statistiques en temps réel et planification quotidienne.
- **Gestion des Patients** : Accès complet aux dossiers médicaux et antécédents.
- **Traitements** : Ajout et modification des soins prodigués.
- **Gestion du Personnel** : Supervision de l'équipe du cabinet.
- **Notifications** : Alertes pour les nouveaux RDV ou changements.

### 💼 Espace Administratif
- **Gestion Agenda** : Vue calendrier pour organiser les créneaux.
- **Rappels** : Suivi et envoi des notifications aux patients.
- **Fiches Patients** : Création et mise à jour des informations administratives.

---

## 🛠️ Stack Technique

### Frontend
- **Framework** : [React 18](https://reactjs.org/) avec Vite
- **Langage** : [TypeScript](https://www.typescriptlang.org/)
- **Styling** : [Tailwind CSS](https://tailwindcss.com/)
- **Icons** : [Lucide React](https://lucide.dev/)
- **State Management** : Hooks (useState, useEffect)
- **API Client** : [Axios](https://axios-http.com/)

### Backend
- **Framework** : [Laravel 10+](https://laravel.com/)
- **Langage** : PHP 8.1+
- **Authentification** : JWT (JSON Web Token)
- **Base de Données** : [MySQL](https://www.mysql.com/)
- **Documentation API** : Routes RESTful et contrôleurs dédiés.

### Documentation & Analyse
- **Rapport** : [LaTeX](https://www.latex-project.org/) (`main.tex`)
- **Modélisation** : UML (diagrammes de classes, séquence et cas d'utilisation).

---

## 📂 Structure du Projet

```text
├── backend/            # API Laravel (Backend)
│   ├── app/            # Modèles, Contrôleurs, Middlewares
│   ├── database/       # Migrations et Seeders
│   └── routes/         # Définition des API (routes/api.php)
├── src/                # Frontend React
│   ├── components/     # Composants réutilisables
│   ├── types/          # Définitions TypeScript
│   └── App.tsx         # Point d'entrée principal
├── compilation/        # Module d'analyse de code (Images & Analyse)
├── screens/            # Captures d'écran de l'application
├── public/             # Assets statiques
├── main.tex            # Rapport complet au format LaTeX
└── Cahier de charge.docx # Spécifications fonctionnelles
```

---

## ⚙️ Installation et Configuration

### Prérequis
- [Node.js](https://nodejs.org/) (v18+)
- [PHP](https://www.php.net/) (v8.1+)
- [Composer](https://getcomposer.org/)
- [MySQL](https://www.mysql.com/)

### 1. Configuration du Backend (Laravel)
```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
php artisan jwt:secret
```
*Configurez votre base de données dans le fichier `.env` (ex: SQLite ou MySQL).*
```bash
# Pour SQLite (facile pour les tests rapides)
touch database/database.sqlite
# Modifiez DB_CONNECTION=sqlite dans votre .env

php artisan migrate --seed
php artisan serve
```

### 2. Configuration du Frontend (React)
```bash
# Dans le dossier racine du projet
npm install
npm run dev
```
*L'application sera accessible sur `http://localhost:5173`.*

---

## 🔑 Identifiants de Test (Login)

Pour tester l'application, utilisez les comptes créés via le seeder :

| Profil | Email | Mot de passe |
| :--- | :--- | :--- |
| **Patient** | `patient@test.com` | `password` |
| **Docteur** | `docteur@test.com` | `password` |
| **Admin** | `admin@test.com` | `password` |

> [!IMPORTANT]
> Lors de la connexion, veillez à sélectionner le **bon profil** (Patient, Docteur ou Admin) correspondant à l'email utilisé.

---

## 🧩 Module de Compilation

Un aspect unique de ce projet est le module d'analyse de code source PHP situé dans le dossier `compilation/`. Il illustre les phases critiques de la compilation :
1. **Analyse Lexicale** : Décomposition en jetons (tokens).
2. **Analyse Syntaxique** : Validation de la structure grammaticale.
3. **Analyse Sémantique** : Vérification de la cohérence logique.
4. **Optimisation** : Amélioration des performances du code.
5. **Génération de Code** : Sortie finale optimisée.

---

## 📊 Conception UML

Le projet s'appuie sur une conception UML rigoureuse détaillée dans le rapport :
- **Diagramme de Cas d'Utilisation** : Identification des rôles et fonctionnalités.
- **Diagramme de Séquence** : Modélisation des flux de données (Prise de RDV, Traitement).
- **Diagramme de Classes** : Architecture logicielle et relations base de données.

---

## ✍️ Auteur
- **Projet 4 - Module** (Développement d'Application Web & Compilation)

---

## 📄 Licence
Ce projet est réalisé dans un cadre académique/professionnel. Tous droits réservés.
