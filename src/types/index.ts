export interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  phone: string;
  email: string;
  address: string;
  bloodType?: string;
  allergies?: string[];
  medicalHistory?: string;
  registrationDate: string;
  generatedPassword?: string;
}

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  dentistId: string;
  dentistName: string;
  date: string;
  time: string;
  duration: number;
  type: string;
  status: 'scheduled' | 'completed' | 'cancelled' | 'no-show';
  notes?: string;
}

export interface Treatment {
  id: string;
  patientId: string;
  patientName: string;
  date: string;
  type: string;
  tooth?: string;
  description: string;
  cost: number;
  dentistId: string;
  dentistName: string;
  prescriptions?: string[];
  nextVisit?: string;
}

export interface Staff {
  id: string;
  firstName: string;
  lastName: string;
  role: 'dentist' | 'assistant' | 'receptionist' | 'admin';
  specialty?: string;
  phone: string;
  email: string;
  schedule?: string[];
  generatedPassword?: string;
}

export interface Reminder {
  id: string;
  patientId: string;
  patientName: string;
  type: 'checkup' | 'treatment' | 'followup';
  dueDate: string;
  message: string;
  status: 'pending' | 'sent' | 'completed';
}

export interface DashboardStats {
  totalPatients: number;
  todayAppointments: number;
  weekRevenue: number;
  completionRate: number;
  appointmentsByDay: { day: string; count: number }[];
  treatmentTypes: { type: string; count: number }[];
}

export type UserRole = 'patient' | 'docteur' | 'personnelAdministratif';

export interface User {
  id: string;
  email: string;
  password: string;
  role: UserRole;
  firstName: string;
  lastName: string;
  patientId?: string; // Si c'est un patient
  staffId?: string; // Si c'est un docteur ou personnel
}

export interface Notification {
  id: string;
  userId: string;
  type: 'appointment' | 'reminder' | 'system' | 'appointment_cancelled' | 'appointment_modified' | 'appointment_created';
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  relatedId?: string; // ID du rendez-vous, rappel, etc.
}

export interface AdminNotification {
  id: string;
  type: 'appointment_created' | 'appointment_cancelled' | 'appointment_modified' | 'patient_registered';
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  relatedId?: string;
  patientId?: string;
}
