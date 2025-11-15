# Cabinet Dentaire - Système de Gestion

Application web complète de gestion de cabinet dentaire développée avec React, TypeScript, Vite et Tailwind CSS.

## 🚀 Fonctionnalités

### 👤 Espace Patient

Les patients peuvent :

- ✅ **Créer un compte** - Inscription complète avec validation
- ✅ **Consulter leur dossier médical** - Accès à toutes les informations médicales, traitements et antécédents
- ✅ **Recevoir des notifications** - Système de notifications en temps réel
- ✅ **Prendre un rendez-vous** - Réservation en ligne avec vérification des créneaux disponibles
- ✅ **Modifier leurs informations** - Mise à jour du profil personnel
- ✅ **Gérer leurs rendez-vous** - Vue complète de tous les rendez-vous
- ✅ **Modifier un rendez-vous** - Modification des rendez-vous existants
- ✅ **Annuler un rendez-vous** - Annulation avec notifications automatiques
- ✅ **Rappels automatiques** - Notifications 24h avant chaque rendez-vous
- ✅ **Notifications au personnel** - Le personnel administratif est notifié de toutes les actions importantes

### 👨‍⚕️ Espace Docteur

- Gestion complète des patients
- Planification et suivi des rendez-vous
- Historique des traitements
- Gestion du personnel
- Tableau de bord avec statistiques

### 📋 Espace Personnel Administratif

- Gestion des patients
- Gestion des rendez-vous
- Système de rappels
- Notifications des actions patients
- Tableau de bord

## 🛠️ Technologies Utilisées

- **React 18** - Bibliothèque UI
- **TypeScript** - Typage statique
- **Vite** - Build tool et dev server
- **Tailwind CSS** - Framework CSS
- **Lucide React** - Icônes
- **LocalStorage** - Stockage local des données

## 📦 Installation

```bash
# Cloner le dépôt
git clone https://github.com/KvalixX/Projet-4-module.git

# Aller dans le dossier
cd Projet4module

# Installer les dépendances
npm install

# Lancer le serveur de développement
npm run dev
```

## 🎯 Structure du Projet

```
Projet4module/
├── src/
│   ├── components/          # Composants React
│   │   ├── PatientView.tsx  # Vue patient complète
│   │   ├── PatientRegister.tsx
│   │   ├── PatientAppointmentForm.tsx
│   │   ├── Dashboard.tsx
│   │   ├── Login.tsx
│   │   └── ...
│   ├── services/            # Services de données
│   │   └── dataService.ts   # Gestion LocalStorage
│   ├── types/               # Types TypeScript
│   │   └── index.ts
│   ├── data/                # Données mockées
│   │   └── mockData.ts
│   └── App.tsx              # Composant principal
├── package.json
└── README.md
```

## 🔐 Authentification

Le système supporte trois types d'utilisateurs :

1. **Patient** - Accès à l'espace patient
2. **Docteur** - Accès complet au système
3. **Personnel Administratif** - Accès limité (pas de traitements/personnel)

## 📱 Interface Utilisateur

- Design moderne et responsive
- Navigation par sidebar (espace patient)
- Notifications en temps réel
- Tableaux de bord interactifs
- Formulaires avec validation

## 🔔 Système de Notifications

- Notifications pour les patients (rendez-vous, rappels, système)
- Notifications administratives (actions patients)
- Rappels automatiques 24h avant les rendez-vous
- Badge avec compteur de notifications non lues

## 📝 Fonctionnalités Techniques

- Gestion d'état avec React Hooks
- Persistance des données avec LocalStorage
- Validation des formulaires
- Gestion des conflits de rendez-vous
- Interface responsive (mobile, tablette, desktop)

## 🚧 Développement

```bash
# Mode développement
npm run dev

# Build de production
npm run build

# Preview du build
npm run preview

# Linting
npm run lint
```

## 📄 Licence

Ce projet est un projet éducatif.

## 👥 Auteur

KvalixX

## 🔗 Lien GitHub

https://github.com/KvalixX/Projet-4-module

