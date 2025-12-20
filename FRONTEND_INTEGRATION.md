# Guide d'Intégration Frontend React avec Backend Laravel

## 🎯 Objectif

Remplacer le `DataService` (LocalStorage) par des appels API vers le backend Laravel.

## 📦 Étape 1 : Installation des Dépendances

```bash
npm install axios jwt-decode
```

## 📁 Étape 2 : Créer la Structure des Services

Créer les fichiers suivants dans `src/services/` :

```
src/services/
├── api/
│   ├── apiClient.ts          # Client Axios configuré
│   ├── authService.ts         # Authentification
│   ├── patientService.ts      # Patients
│   ├── appointmentService.ts  # Rendez-vous
│   ├── treatmentService.ts    # Traitements
│   ├── staffService.ts        # Personnel
│   └── dashboardService.ts    # Tableau de bord
└── dataService.ts             # À supprimer après migration
```

## 🔧 Étape 3 : Créer le Client API

**`src/services/api/apiClient.ts`**

```typescript
import axios, { AxiosInstance } from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const apiClient: AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Intercepteur pour ajouter le token JWT
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Intercepteur pour gérer les erreurs
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expiré ou invalide
      localStorage.removeItem('token');
      localStorage.removeItem('currentUser');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default apiClient;
```

## 🔐 Étape 4 : Service d'Authentification

**`src/services/api/authService.ts`**

```typescript
import apiClient from './apiClient';
import { User } from '../../types';

export interface LoginResponse {
  success: boolean;
  token: string;
  user: User;
}

export interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  password_confirmation: string;
  dateOfBirth: string;
  phone: string;
  address: string;
  bloodType?: string;
  allergies?: string[];
  medicalHistory?: string;
}

export const authService = {
  login: async (email: string, password: string): Promise<LoginResponse> => {
    const response = await apiClient.post('/auth/login', { email, password });
    return response.data;
  },

  register: async (data: RegisterData): Promise<LoginResponse> => {
    const response = await apiClient.post('/auth/register', data);
    return response.data;
  },

  logout: async (): Promise<void> => {
    await apiClient.post('/auth/logout');
    localStorage.removeItem('token');
    localStorage.removeItem('currentUser');
  },

  me: async (): Promise<User> => {
    const response = await apiClient.get('/auth/me');
    return response.data.user;
  },

  refreshToken: async (): Promise<string> => {
    const response = await apiClient.post('/auth/refresh');
    return response.data.token;
  },
};
```

## 👥 Étape 5 : Service Patients

**`src/services/api/patientService.ts`**

```typescript
import apiClient from './apiClient';
import { Patient } from '../../types';

export const patientService = {
  getAll: async (): Promise<Patient[]> => {
    const response = await apiClient.get('/patients');
    return response.data.data;
  },

  getById: async (id: string): Promise<Patient> => {
    const response = await apiClient.get(`/patients/${id}`);
    return response.data.data;
  },

  create: async (patient: Omit<Patient, 'id' | 'registrationDate'>): Promise<Patient> => {
    const response = await apiClient.post('/patients', patient);
    return response.data.data;
  },

  update: async (id: string, patient: Partial<Patient>): Promise<Patient> => {
    const response = await apiClient.put(`/patients/${id}`, patient);
    return response.data.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/patients/${id}`);
  },
};
```

## 📅 Étape 6 : Service Rendez-vous

**`src/services/api/appointmentService.ts`**

```typescript
import apiClient from './apiClient';
import { Appointment } from '../../types';

export const appointmentService = {
  getAll: async (filters?: {
    patientId?: string;
    dentistId?: string;
    status?: string;
  }): Promise<Appointment[]> => {
    const response = await apiClient.get('/appointments', { params: filters });
    return response.data.data;
  },

  getById: async (id: string): Promise<Appointment> => {
    const response = await apiClient.get(`/appointments/${id}`);
    return response.data.data;
  },

  create: async (appointment: Omit<Appointment, 'id' | 'status'>): Promise<Appointment> => {
    const response = await apiClient.post('/appointments', appointment);
    return response.data.data;
  },

  update: async (id: string, appointment: Partial<Appointment>): Promise<Appointment> => {
    const response = await apiClient.put(`/appointments/${id}`, appointment);
    return response.data.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/appointments/${id}`);
  },

  checkConflicts: async (data: {
    dentistId: string;
    date: string;
    time: string;
    duration: number;
    appointmentId?: string;
  }): Promise<{ hasConflict: boolean; message: string }> => {
    const response = await apiClient.post('/appointments/check-conflicts', data);
    return response.data;
  },
};
```

## 📊 Étape 7 : Service Dashboard

**`src/services/api/dashboardService.ts`**

```typescript
import apiClient from './apiClient';
import { DashboardStats } from '../../types';

export const dashboardService = {
  getStats: async (): Promise<DashboardStats> => {
    const response = await apiClient.get('/dashboard/stats');
    return response.data.data;
  },

  getUpcomingAppointments: async () => {
    const response = await apiClient.get('/dashboard/upcoming-appointments');
    return response.data.data;
  },

  getPendingReminders: async () => {
    const response = await apiClient.get('/dashboard/pending-reminders');
    return response.data.data;
  },
};
```

## 🔄 Étape 8 : Adapter les Composants

### Exemple : Login.tsx

**Avant (avec DataService)** :
```typescript
const handleLogin = (e: React.FormEvent) => {
  e.preventDefault();
  const user = DataService.getUserByEmail(email);
  
  if (user && user.password === password) {
    localStorage.setItem('currentUser', JSON.stringify(user));
    onLogin(user);
  } else {
    alert('Email ou mot de passe incorrect');
  }
};
```

**Après (avec API)** :
```typescript
import { authService } from '../services/api/authService';

const handleLogin = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);
  setError('');
  
  try {
    const response = await authService.login(email, password);
    
    if (response.success) {
      localStorage.setItem('token', response.token);
      localStorage.setItem('currentUser', JSON.stringify(response.user));
      onLogin(response.user);
    }
  } catch (error: any) {
    setError(error.response?.data?.message || 'Erreur de connexion');
  } finally {
    setLoading(false);
  }
};
```

### Exemple : PatientList.tsx

**Avant** :
```typescript
const [patients, setPatients] = useState<Patient[]>([]);

useEffect(() => {
  const data = DataService.getPatients();
  setPatients(data);
}, []);
```

**Après** :
```typescript
import { patientService } from '../services/api/patientService';

const [patients, setPatients] = useState<Patient[]>([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState('');

useEffect(() => {
  loadPatients();
}, []);

const loadPatients = async () => {
  try {
    setLoading(true);
    const data = await patientService.getAll();
    setPatients(data);
  } catch (error: any) {
    setError(error.response?.data?.message || 'Erreur de chargement');
  } finally {
    setLoading(false);
  }
};

const handleDelete = async (id: string) => {
  if (confirm('Êtes-vous sûr ?')) {
    try {
      await patientService.delete(id);
      loadPatients(); // Recharger la liste
    } catch (error: any) {
      alert(error.response?.data?.message || 'Erreur de suppression');
    }
  }
};
```

## 🎨 Étape 9 : Ajouter les États de Chargement

Créer un composant de chargement :

**`src/components/Loading.tsx`**

```typescript
export const Loading = () => (
  <div className="flex items-center justify-center p-8">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
  </div>
);
```

**`src/components/ErrorMessage.tsx`**

```typescript
interface Props {
  message: string;
  onRetry?: () => void;
}

export const ErrorMessage = ({ message, onRetry }: Props) => (
  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
    <p className="text-red-800">{message}</p>
    {onRetry && (
      <button
        onClick={onRetry}
        className="mt-2 text-red-600 hover:text-red-800 underline"
      >
        Réessayer
      </button>
    )}
  </div>
);
```

## 🔧 Étape 10 : Configuration Environnement

**`.env`** (à la racine du projet frontend)

```env
VITE_API_URL=http://localhost:8000/api
```

## 📝 Étape 11 : Hook Personnalisé

Créer un hook pour simplifier les appels API :

**`src/hooks/useApi.ts`**

```typescript
import { useState, useEffect } from 'react';

export function useApi<T>(apiCall: () => Promise<T>, dependencies: any[] = []) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await apiCall();
      setData(result);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refetch();
  }, dependencies);

  return { data, loading, error, refetch };
}
```

**Utilisation** :

```typescript
const PatientList = () => {
  const { data: patients, loading, error, refetch } = useApi(
    () => patientService.getAll(),
    []
  );

  if (loading) return <Loading />;
  if (error) return <ErrorMessage message={error} onRetry={refetch} />;

  return (
    <div>
      {patients?.map(patient => (
        <div key={patient.id}>{patient.firstName} {patient.lastName}</div>
      ))}
    </div>
  );
};
```

## ✅ Checklist de Migration

- [ ] Installer axios et jwt-decode
- [ ] Créer apiClient.ts
- [ ] Créer authService.ts
- [ ] Créer patientService.ts
- [ ] Créer appointmentService.ts
- [ ] Créer dashboardService.ts
- [ ] Adapter Login.tsx
- [ ] Adapter PatientList.tsx
- [ ] Adapter AppointmentCalendar.tsx
- [ ] Adapter Dashboard.tsx
- [ ] Ajouter les états de chargement
- [ ] Ajouter la gestion d'erreurs
- [ ] Tester toutes les fonctionnalités
- [ ] Supprimer DataService.ts

## 🚀 Ordre de Migration Recommandé

1. **Authentification** (Login, Register, Logout)
2. **Dashboard** (Statistiques)
3. **Patients** (CRUD complet)
4. **Rendez-vous** (CRUD + conflits)
5. **Traitements** (CRUD)
6. **Personnel** (CRUD)
7. **Notifications** (Liste, marquer comme lu)

## 🧪 Tests

Après chaque migration, testez :

1. ✅ Connexion fonctionne
2. ✅ Données s'affichent correctement
3. ✅ Création fonctionne
4. ✅ Modification fonctionne
5. ✅ Suppression fonctionne
6. ✅ Gestion d'erreurs fonctionne
7. ✅ États de chargement s'affichent

## 📚 Ressources

- [Documentation Axios](https://axios-http.com/)
- [Documentation JWT](https://jwt.io/)
- [Documentation React Hooks](https://react.dev/reference/react)

---

**Bon courage pour l'intégration ! 🎯**
