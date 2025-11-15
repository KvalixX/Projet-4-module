import { useState, useEffect } from 'react';
import {
  Users,
  Calendar,
  TrendingUp,
  Activity,
  Clock,
  AlertCircle,
  Bell
} from 'lucide-react';
import { DataService } from '../services/dataService';
import { mockDashboardStats, mockAppointments, mockReminders, mockPatients, mockStaff, mockTreatments } from '../data/mockData';

export default function Dashboard() {
  const [patients, setPatients] = useState(DataService.getPatients());
  const [appointments, setAppointments] = useState(DataService.getAppointments());
  const [treatments, setTreatments] = useState(DataService.getTreatments());
  const [reminders, setReminders] = useState(DataService.getReminders());
  const [adminNotifications, setAdminNotifications] = useState(DataService.getAdminNotifications());

  useEffect(() => {
    // Initialiser les données si nécessaire
    if (DataService.getPatients().length === 0) {
      mockPatients.forEach(p => DataService.savePatient(p));
    }
    if (DataService.getStaff().length === 0) {
      mockStaff.forEach(s => DataService.saveStaff(s));
    }
    if (DataService.getAppointments().length === 0) {
      mockAppointments.forEach(a => DataService.saveAppointment(a));
    }
    if (DataService.getTreatments().length === 0) {
      mockTreatments.forEach(t => DataService.saveTreatment(t));
    }
    if (DataService.getReminders().length === 0) {
      mockReminders.forEach(r => DataService.saveReminder(r));
    }
    
    setPatients(DataService.getPatients());
    setAppointments(DataService.getAppointments());
    setTreatments(DataService.getTreatments());
    setReminders(DataService.getReminders());
    setAdminNotifications(DataService.getAdminNotifications());
  }, []);

  const unreadNotifications = adminNotifications.filter(n => !n.read).length;

  const today = new Date().toISOString().split('T')[0];
  const todayAppointments = appointments.filter(
    (apt) => apt.date === today && apt.status === 'scheduled'
  );
  const upcomingReminders = reminders.filter((r) => r.status === 'pending').slice(0, 3);

  // Calculer les statistiques dynamiquement
  const calculateWeekRevenue = () => {
    const today = new Date();
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - today.getDay() + 1);
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);
    
    return treatments
      .filter(t => {
        const treatDate = new Date(t.date);
        return treatDate >= weekStart && treatDate <= weekEnd;
      })
      .reduce((sum, t) => sum + t.cost, 0);
  };

  const calculateCompletionRate = () => {
    const completed = appointments.filter(a => a.status === 'completed').length;
    const total = appointments.filter(a => a.status !== 'cancelled').length;
    return total > 0 ? Math.round((completed / total) * 100) : 0;
  };

  const getAppointmentsByDay = () => {
    const days = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
    return days.map(day => {
      // Pour simplifier, on utilise les données mockées pour les graphiques
      // Dans une vraie application, on calculerait à partir des rendez-vous réels
      return { day, count: mockDashboardStats.appointmentsByDay.find(d => d.day === day)?.count || 0 };
    });
  };

  const stats = {
    totalPatients: patients.length,
    todayAppointments: todayAppointments.length,
    weekRevenue: calculateWeekRevenue(),
    completionRate: calculateCompletionRate(),
    appointmentsByDay: getAppointmentsByDay(),
    treatmentTypes: mockDashboardStats.treatmentTypes // On garde les données mockées pour les types de traitements
  };

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Tableau de Bord</h2>
        <p className="text-gray-600">
          Bienvenue, Dr. Benslimane - Aperçu de l'activité du cabinet
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Users className="text-blue-600" size={24} />
            </div>
            <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
              +12%
            </span>
          </div>
          <h3 className="text-sm font-medium text-gray-500 mb-1">Total Patients</h3>
          <p className="text-3xl font-bold text-gray-900">{stats.totalPatients}</p>
          <p className="text-xs text-gray-600 mt-2">Patients actifs</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-green-100 rounded-lg">
              <Calendar className="text-green-600" size={24} />
            </div>
            <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
              Aujourd'hui
            </span>
          </div>
          <h3 className="text-sm font-medium text-gray-500 mb-1">Rendez-vous</h3>
          <p className="text-3xl font-bold text-gray-900">{stats.todayAppointments}</p>
          <p className="text-xs text-gray-600 mt-2">Programmés aujourd'hui</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-orange-100 rounded-lg">
              <TrendingUp className="text-orange-600" size={24} />
            </div>
            <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
              +8%
            </span>
          </div>
          <h3 className="text-sm font-medium text-gray-500 mb-1">Revenus Semaine</h3>
          <p className="text-3xl font-bold text-gray-900">
            {stats.weekRevenue.toLocaleString()} DH
          </p>
          <p className="text-xs text-gray-600 mt-2">Cette semaine</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-purple-100 rounded-lg">
              <Activity className="text-purple-600" size={24} />
            </div>
            <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
              Excellent
            </span>
          </div>
          <h3 className="text-sm font-medium text-gray-500 mb-1">Taux de Présence</h3>
          <p className="text-3xl font-bold text-gray-900">{stats.completionRate}%</p>
          <p className="text-xs text-gray-600 mt-2">Ce mois-ci</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Rendez-vous par jour de la semaine
          </h3>
          <div className="space-y-4">
            {stats.appointmentsByDay.map((item) => {
              const maxCount = Math.max(...stats.appointmentsByDay.map((d) => d.count));
              const percentage = (item.count / maxCount) * 100;
              return (
                <div key={item.day}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">{item.day}</span>
                    <span className="text-sm font-semibold text-gray-900">{item.count}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-blue-600 h-3 rounded-full transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Types de Traitements</h3>
          <div className="space-y-3">
            {stats.treatmentTypes.map((item, index) => {
              const colors = [
                'bg-blue-100 text-blue-700',
                'bg-green-100 text-green-700',
                'bg-orange-100 text-orange-700',
                'bg-purple-100 text-purple-700',
                'bg-pink-100 text-pink-700'
              ];
              return (
                <div
                  key={item.type}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-lg ${colors[index % colors.length]} flex items-center justify-center font-bold text-sm`}
                    >
                      {item.count}
                    </div>
                    <span className="text-sm font-medium text-gray-900">{item.type}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Rendez-vous d'aujourd'hui</h3>
            <Clock className="text-blue-600" size={20} />
          </div>
          {todayAppointments.length === 0 ? (
            <div className="text-center py-8">
              <Calendar className="mx-auto text-gray-300 mb-2" size={48} />
              <p className="text-gray-500 text-sm">Aucun rendez-vous aujourd'hui</p>
            </div>
          ) : (
            <div className="space-y-3">
              {todayAppointments.slice(0, 4).map((appointment) => (
                <div
                  key={appointment.id}
                  className="flex items-start gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-sm font-semibold min-w-[60px] text-center">
                    {appointment.time}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">
                      {appointment.patientName}
                    </p>
                    <p className="text-xs text-gray-600">{appointment.type}</p>
                    <p className="text-xs text-gray-500 mt-1">{appointment.dentistName}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Rappels à venir</h3>
            <AlertCircle className="text-orange-600" size={20} />
          </div>
          {upcomingReminders.length === 0 ? (
            <div className="text-center py-8">
              <AlertCircle className="mx-auto text-gray-300 mb-2" size={48} />
              <p className="text-gray-500 text-sm">Aucun rappel en attente</p>
            </div>
          ) : (
            <div className="space-y-3">
              {upcomingReminders.map((reminder) => {
                const typeColors = {
                  checkup: 'bg-blue-100 text-blue-700 border-blue-200',
                  treatment: 'bg-orange-100 text-orange-700 border-orange-200',
                  followup: 'bg-green-100 text-green-700 border-green-200'
                };
                const typeLabels = {
                  checkup: 'Contrôle',
                  treatment: 'Traitement',
                  followup: 'Suivi'
                };
                return (
                  <div
                    key={reminder.id}
                    className={`p-3 border rounded-lg ${typeColors[reminder.type]}`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <p className="text-sm font-semibold text-gray-900">
                        {reminder.patientName}
                      </p>
                      <span className="text-xs font-medium px-2 py-1 bg-white rounded">
                        {typeLabels[reminder.type]}
                      </span>
                    </div>
                    <p className="text-xs text-gray-700 mb-2">{reminder.message}</p>
                    <p className="text-xs text-gray-600">
                      Date prévue: {new Date(reminder.dueDate).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Notifications administratives */}
      {unreadNotifications > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Bell className="text-purple-600" size={24} />
              <h3 className="text-lg font-semibold text-gray-900">
                Notifications Administratives ({unreadNotifications} non lues)
              </h3>
            </div>
          </div>
          <div className="space-y-3">
            {adminNotifications.filter(n => !n.read).slice(0, 5).map((notification) => (
              <div
                key={notification.id}
                className="border border-blue-200 bg-blue-50 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                      <h4 className="font-semibold text-gray-900">{notification.title}</h4>
                    </div>
                    <p className="text-sm text-gray-700">{notification.message}</p>
                    <p className="text-xs text-gray-500 mt-2">
                      {new Date(notification.createdAt).toLocaleString('fr-FR')}
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      DataService.markAdminNotificationAsRead(notification.id);
                      setAdminNotifications(DataService.getAdminNotifications());
                    }}
                    className="ml-4 text-blue-600 hover:text-blue-700 text-sm"
                  >
                    Marquer comme lu
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
