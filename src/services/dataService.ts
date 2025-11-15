import { Patient, Appointment, Treatment, Staff, Reminder, User, Notification, AdminNotification } from '../types';

const STORAGE_KEYS = {
  PATIENTS: 'patients',
  APPOINTMENTS: 'appointments',
  TREATMENTS: 'treatments',
  STAFF: 'staff',
  REMINDERS: 'reminders',
  USERS: 'users',
  NOTIFICATIONS: 'notifications',
  ADMIN_NOTIFICATIONS: 'adminNotifications',
  CURRENT_USER: 'currentUser'
};

// Service pour gérer toutes les opérations de données
export class DataService {
  // Patients
  static getPatients(): Patient[] {
    const data = localStorage.getItem(STORAGE_KEYS.PATIENTS);
    return data ? JSON.parse(data) : [];
  }

  static savePatient(patient: Patient): void {
    const patients = this.getPatients();
    const index = patients.findIndex(p => p.id === patient.id);
    if (index >= 0) {
      patients[index] = patient;
    } else {
      patients.push(patient);
    }
    localStorage.setItem(STORAGE_KEYS.PATIENTS, JSON.stringify(patients));
  }

  static deletePatient(id: string): void {
    const patients = this.getPatients().filter(p => p.id !== id);
    localStorage.setItem(STORAGE_KEYS.PATIENTS, JSON.stringify(patients));
  }

  // Rendez-vous
  static getAppointments(): Appointment[] {
    const data = localStorage.getItem(STORAGE_KEYS.APPOINTMENTS);
    return data ? JSON.parse(data) : [];
  }

  static saveAppointment(appointment: Appointment): void {
    const appointments = this.getAppointments();
    const index = appointments.findIndex(a => a.id === appointment.id);
    if (index >= 0) {
      appointments[index] = appointment;
    } else {
      appointments.push(appointment);
    }
    localStorage.setItem(STORAGE_KEYS.APPOINTMENTS, JSON.stringify(appointments));
  }

  static deleteAppointment(id: string): void {
    const appointments = this.getAppointments().filter(a => a.id !== id);
    localStorage.setItem(STORAGE_KEYS.APPOINTMENTS, JSON.stringify(appointments));
  }

  // Traitements
  static getTreatments(): Treatment[] {
    const data = localStorage.getItem(STORAGE_KEYS.TREATMENTS);
    return data ? JSON.parse(data) : [];
  }

  static saveTreatment(treatment: Treatment): void {
    const treatments = this.getTreatments();
    const index = treatments.findIndex(t => t.id === treatment.id);
    if (index >= 0) {
      treatments[index] = treatment;
    } else {
      treatments.push(treatment);
    }
    localStorage.setItem(STORAGE_KEYS.TREATMENTS, JSON.stringify(treatments));
  }

  static deleteTreatment(id: string): void {
    const treatments = this.getTreatments().filter(t => t.id !== id);
    localStorage.setItem(STORAGE_KEYS.TREATMENTS, JSON.stringify(treatments));
  }

  // Personnel
  static getStaff(): Staff[] {
    const data = localStorage.getItem(STORAGE_KEYS.STAFF);
    return data ? JSON.parse(data) : [];
  }

  static saveStaff(staff: Staff): void {
    const staffList = this.getStaff();
    const index = staffList.findIndex(s => s.id === staff.id);
    if (index >= 0) {
      staffList[index] = staff;
    } else {
      staffList.push(staff);
    }
    localStorage.setItem(STORAGE_KEYS.STAFF, JSON.stringify(staffList));
  }

  static deleteStaff(id: string): void {
    const staffList = this.getStaff().filter(s => s.id !== id);
    localStorage.setItem(STORAGE_KEYS.STAFF, JSON.stringify(staffList));
  }

  // Rappels
  static getReminders(): Reminder[] {
    const data = localStorage.getItem(STORAGE_KEYS.REMINDERS);
    return data ? JSON.parse(data) : [];
  }

  static saveReminder(reminder: Reminder): void {
    const reminders = this.getReminders();
    const index = reminders.findIndex(r => r.id === reminder.id);
    if (index >= 0) {
      reminders[index] = reminder;
    } else {
      reminders.push(reminder);
    }
    localStorage.setItem(STORAGE_KEYS.REMINDERS, JSON.stringify(reminders));
  }

  static deleteReminder(id: string): void {
    const reminders = this.getReminders().filter(r => r.id !== id);
    localStorage.setItem(STORAGE_KEYS.REMINDERS, JSON.stringify(reminders));
  }

  // Utilisateurs
  static getUsers(): User[] {
    const data = localStorage.getItem(STORAGE_KEYS.USERS);
    return data ? JSON.parse(data) : [];
  }

  static saveUser(user: User): void {
    const users = this.getUsers();
    const index = users.findIndex(u => u.id === user.id || u.email === user.email);
    if (index >= 0) {
      users[index] = user;
    } else {
      users.push(user);
    }
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  }

  static getUserByEmail(email: string): User | undefined {
    return this.getUsers().find(u => u.email === email);
  }

  // Notifications
  static getNotifications(userId: string): Notification[] {
    const data = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
    const allNotifications: Notification[] = data ? JSON.parse(data) : [];
    return allNotifications.filter(n => n.userId === userId).sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  static saveNotification(notification: Notification): void {
    const data = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
    const notifications: Notification[] = data ? JSON.parse(data) : [];
    notifications.push(notification);
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications));
  }

  static markNotificationAsRead(notificationId: string): void {
    const data = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
    const notifications: Notification[] = data ? JSON.parse(data) : [];
    const notification = notifications.find(n => n.id === notificationId);
    if (notification) {
      notification.read = true;
      localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications));
    }
  }

  static getUnreadNotificationCount(userId: string): number {
    return this.getNotifications(userId).filter(n => !n.read).length;
  }

  // Notifications administratives
  static getAdminNotifications(): AdminNotification[] {
    const data = localStorage.getItem(STORAGE_KEYS.ADMIN_NOTIFICATIONS);
    const notifications: AdminNotification[] = data ? JSON.parse(data) : [];
    return notifications.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  static saveAdminNotification(notification: AdminNotification): void {
    const notifications = this.getAdminNotifications();
    notifications.push(notification);
    localStorage.setItem(STORAGE_KEYS.ADMIN_NOTIFICATIONS, JSON.stringify(notifications));
  }

  static markAdminNotificationAsRead(notificationId: string): void {
    const notifications = this.getAdminNotifications();
    const notification = notifications.find(n => n.id === notificationId);
    if (notification) {
      notification.read = true;
      localStorage.setItem(STORAGE_KEYS.ADMIN_NOTIFICATIONS, JSON.stringify(notifications));
    }
  }

  static getUnreadAdminNotificationCount(): number {
    return this.getAdminNotifications().filter(n => !n.read).length;
  }

  // Initialisation avec données mockées si nécessaire
  static initializeData(): void {
    if (!localStorage.getItem(STORAGE_KEYS.PATIENTS)) {
      // Les données seront initialisées depuis mockData si nécessaire
    }
  }
}

