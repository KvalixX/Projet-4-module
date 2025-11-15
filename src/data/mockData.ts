import { Patient, Appointment, Treatment, Staff, Reminder, DashboardStats } from '../types';

export const mockPatients: Patient[] = [
  {
    id: '1',
    firstName: 'Mohammed',
    lastName: 'Alami',
    dateOfBirth: '1985-03-15',
    phone: '+212 6 12 34 56 78',
    email: 'mohammed.alami@email.com',
    address: '45 Rue Mohamed V, Casablanca',
    bloodType: 'A+',
    allergies: ['Pénicilline'],
    medicalHistory: 'Diabète type 2',
    registrationDate: '2023-01-10'
  },
  {
    id: '2',
    firstName: 'Fatima',
    lastName: 'Bennis',
    dateOfBirth: '1990-07-22',
    phone: '+212 6 23 45 67 89',
    email: 'fatima.bennis@email.com',
    address: '12 Avenue Hassan II, Rabat',
    bloodType: 'O+',
    allergies: [],
    medicalHistory: 'Aucun',
    registrationDate: '2023-03-15'
  },
  {
    id: '3',
    firstName: 'Youssef',
    lastName: 'El Idrissi',
    dateOfBirth: '1978-11-30',
    phone: '+212 6 34 56 78 90',
    email: 'youssef.elidrissi@email.com',
    address: '78 Boulevard Zerktouni, Marrakech',
    bloodType: 'B+',
    allergies: ['Latex'],
    medicalHistory: 'Hypertension',
    registrationDate: '2022-11-20'
  },
  {
    id: '4',
    firstName: 'Aisha',
    lastName: 'Chakir',
    dateOfBirth: '1995-05-18',
    phone: '+212 6 45 67 89 01',
    email: 'aisha.chakir@email.com',
    address: '23 Rue Allal Ben Abdellah, Fès',
    bloodType: 'AB+',
    allergies: [],
    registrationDate: '2024-01-05'
  },
  {
    id: '5',
    firstName: 'Hassan',
    lastName: 'Tazi',
    dateOfBirth: '1982-09-08',
    phone: '+212 6 56 78 90 12',
    email: 'hassan.tazi@email.com',
    address: '67 Avenue de la Liberté, Tanger',
    bloodType: 'O-',
    allergies: ['Iode'],
    medicalHistory: 'Asthme',
    registrationDate: '2023-06-12'
  }
];

export const mockStaff: Staff[] = [
  {
    id: 's1',
    firstName: 'Dr. Karim',
    lastName: 'Benslimane',
    role: 'dentist',
    specialty: 'Orthodontie',
    phone: '+212 6 11 22 33 44',
    email: 'k.benslimane@cabinet.ma',
    schedule: ['Lundi', 'Mardi', 'Mercredi', 'Jeudi']
  },
  {
    id: 's2',
    firstName: 'Dr. Salma',
    lastName: 'Ouazzani',
    role: 'dentist',
    specialty: 'Chirurgie dentaire',
    phone: '+212 6 22 33 44 55',
    email: 's.ouazzani@cabinet.ma',
    schedule: ['Mardi', 'Mercredi', 'Jeudi', 'Vendredi']
  },
  {
    id: 's3',
    firstName: 'Nadia',
    lastName: 'Mrabet',
    role: 'assistant',
    phone: '+212 6 33 44 55 66',
    email: 'n.mrabet@cabinet.ma',
    schedule: ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi']
  },
  {
    id: 's4',
    firstName: 'Samira',
    lastName: 'Fassi',
    role: 'receptionist',
    phone: '+212 6 44 55 66 77',
    email: 's.fassi@cabinet.ma',
    schedule: ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi']
  }
];

export const mockAppointments: Appointment[] = [
  {
    id: 'a1',
    patientId: '1',
    patientName: 'Mohammed Alami',
    dentistId: 's1',
    dentistName: 'Dr. Karim Benslimane',
    date: '2025-11-01',
    time: '09:00',
    duration: 30,
    type: 'Consultation',
    status: 'scheduled',
    notes: 'Première visite de contrôle'
  },
  {
    id: 'a2',
    patientId: '2',
    patientName: 'Fatima Bennis',
    dentistId: 's2',
    dentistName: 'Dr. Salma Ouazzani',
    date: '2025-11-01',
    time: '10:30',
    duration: 60,
    type: 'Détartrage',
    status: 'scheduled'
  },
  {
    id: 'a3',
    patientId: '3',
    patientName: 'Youssef El Idrissi',
    dentistId: 's1',
    dentistName: 'Dr. Karim Benslimane',
    date: '2025-11-01',
    time: '14:00',
    duration: 90,
    type: 'Extraction',
    status: 'scheduled',
    notes: 'Dent de sagesse'
  },
  {
    id: 'a4',
    patientId: '4',
    patientName: 'Aisha Chakir',
    dentistId: 's1',
    dentistName: 'Dr. Karim Benslimane',
    date: '2025-11-01',
    time: '16:00',
    duration: 45,
    type: 'Plombage',
    status: 'scheduled'
  },
  {
    id: 'a5',
    patientId: '5',
    patientName: 'Hassan Tazi',
    dentistId: 's2',
    dentistName: 'Dr. Salma Ouazzani',
    date: '2025-10-30',
    time: '11:00',
    duration: 30,
    type: 'Consultation',
    status: 'completed'
  }
];

export const mockTreatments: Treatment[] = [
  {
    id: 't1',
    patientId: '1',
    patientName: 'Mohammed Alami',
    date: '2025-10-15',
    type: 'Plombage',
    tooth: '16',
    description: 'Plombage composite sur molaire supérieure droite',
    cost: 800,
    dentistId: 's1',
    dentistName: 'Dr. Karim Benslimane',
    prescriptions: ['Ibuprofène 400mg - 3x/jour pendant 3 jours'],
    nextVisit: '2025-11-15'
  },
  {
    id: 't2',
    patientId: '2',
    patientName: 'Fatima Bennis',
    date: '2025-10-20',
    type: 'Détartrage',
    description: 'Détartrage complet et polissage',
    cost: 500,
    dentistId: 's2',
    dentistName: 'Dr. Salma Ouazzani',
    nextVisit: '2026-04-20'
  },
  {
    id: 't3',
    patientId: '3',
    patientName: 'Youssef El Idrissi',
    date: '2025-09-10',
    type: 'Couronne',
    tooth: '26',
    description: 'Pose de couronne céramique',
    cost: 2500,
    dentistId: 's1',
    dentistName: 'Dr. Karim Benslimane',
    nextVisit: '2025-12-10'
  },
  {
    id: 't4',
    patientId: '5',
    patientName: 'Hassan Tazi',
    date: '2025-10-30',
    type: 'Consultation',
    description: 'Examen de routine - RAS',
    cost: 300,
    dentistId: 's2',
    dentistName: 'Dr. Salma Ouazzani',
    nextVisit: '2026-04-30'
  }
];

export const mockReminders: Reminder[] = [
  {
    id: 'r1',
    patientId: '1',
    patientName: 'Mohammed Alami',
    type: 'followup',
    dueDate: '2025-11-15',
    message: 'Visite de contrôle post-plombage',
    status: 'pending'
  },
  {
    id: 'r2',
    patientId: '3',
    patientName: 'Youssef El Idrissi',
    type: 'followup',
    dueDate: '2025-12-10',
    message: 'Contrôle de la couronne',
    status: 'pending'
  },
  {
    id: 'r3',
    patientId: '2',
    patientName: 'Fatima Bennis',
    type: 'checkup',
    dueDate: '2026-04-20',
    message: 'Détartrage semestriel',
    status: 'pending'
  },
  {
    id: 'r4',
    patientId: '5',
    patientName: 'Hassan Tazi',
    type: 'checkup',
    dueDate: '2026-04-30',
    message: 'Examen de routine semestriel',
    status: 'pending'
  }
];

export const mockDashboardStats: DashboardStats = {
  totalPatients: 5,
  todayAppointments: 4,
  weekRevenue: 8500,
  completionRate: 92,
  appointmentsByDay: [
    { day: 'Lun', count: 5 },
    { day: 'Mar', count: 7 },
    { day: 'Mer', count: 6 },
    { day: 'Jeu', count: 8 },
    { day: 'Ven', count: 4 },
    { day: 'Sam', count: 2 }
  ],
  treatmentTypes: [
    { type: 'Consultation', count: 15 },
    { type: 'Détartrage', count: 12 },
    { type: 'Plombage', count: 10 },
    { type: 'Extraction', count: 5 },
    { type: 'Couronne', count: 3 }
  ]
};
