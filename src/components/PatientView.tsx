import { useState, useEffect } from 'react';
import { Calendar, Clock, FileText, User, LogOut, Plus, Edit2, X, Bell, LayoutDashboard } from 'lucide-react';
import { User as UserType, Appointment, Treatment, Patient, Notification } from '../types';
import { DataService } from '../services/dataService';
import PatientForm from './PatientForm';
import PatientAppointmentForm from './PatientAppointmentForm';

interface PatientViewProps {
  user: UserType;
  onLogout: () => void;
}

type ViewMode = 'dashboard' | 'appointments' | 'medical' | 'notifications' | 'settings';

export default function PatientView({ user, onLogout }: PatientViewProps) {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [treatments, setTreatments] = useState<Treatment[]>([]);
  const [patient, setPatient] = useState<Patient | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [currentView, setCurrentView] = useState<ViewMode>('dashboard');
  const [showPatientForm, setShowPatientForm] = useState(false);
  const [showAppointmentForm, setShowAppointmentForm] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | undefined>();
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    loadData();
    // Charger les notifications
    const patientNotifications = DataService.getNotifications(user.id);
    setNotifications(patientNotifications);
    
    // Vérifier les rappels automatiques
    checkAutomaticReminders();
    
    // Rafraîchir les données toutes les 30 secondes
    const interval = setInterval(() => {
      loadData();
      const updatedNotifications = DataService.getNotifications(user.id);
      setNotifications(updatedNotifications);
    }, 30000);

    return () => clearInterval(interval);
  }, [user.id, user.patientId]);

  const loadData = () => {
    if (user.patientId) {
      const allPatients = DataService.getPatients();
      const patientData = allPatients.find(p => p.id === user.patientId);
      setPatient(patientData || null);

      const allAppointments = DataService.getAppointments();
      const patientAppointments = allAppointments.filter(a => a.patientId === user.patientId);
      setAppointments(patientAppointments);

      const allTreatments = DataService.getTreatments();
      const patientTreatments = allTreatments.filter(t => t.patientId === user.patientId);
      setTreatments(patientTreatments);
    }
  };

  const checkAutomaticReminders = () => {
    if (!user.patientId) return;

    const upcomingAppointments = appointments.filter(
      a => a.status === 'scheduled' && new Date(a.date) >= new Date()
    );

    // Créer des rappels automatiques 24h avant chaque rendez-vous
    upcomingAppointments.forEach(appointment => {
      const appointmentDate = new Date(`${appointment.date}T${appointment.time}`);
      const now = new Date();
      const hoursUntilAppointment = (appointmentDate.getTime() - now.getTime()) / (1000 * 60 * 60);

      // Si le rendez-vous est dans 24-26 heures, créer un rappel
      if (hoursUntilAppointment >= 24 && hoursUntilAppointment <= 26) {
        const existingReminder = notifications.find(
          n => n.type === 'reminder' && n.relatedId === appointment.id
        );

        if (!existingReminder) {
          const reminder: Notification = {
            id: `reminder-${appointment.id}-${Date.now()}`,
            userId: user.id,
            type: 'reminder',
            title: 'Rappel de rendez-vous',
            message: `Vous avez un rendez-vous demain à ${appointment.time} avec ${appointment.dentistName} pour ${appointment.type}.`,
            read: false,
            createdAt: new Date().toISOString(),
            relatedId: appointment.id
          };
          DataService.saveNotification(reminder);
          setNotifications([...notifications, reminder]);
        }
      }
    });
  };

  const handleSavePatient = (patientData: Omit<Patient, 'id' | 'registrationDate'>) => {
    if (patient) {
      const updatedPatient: Patient = {
        ...patient,
        ...patientData
      };
      DataService.savePatient(updatedPatient);
      setPatient(updatedPatient);
      setShowPatientForm(false);
      
      // Notifier le personnel administratif
      const adminNotification = {
        id: `admin-notif-${Date.now()}`,
        type: 'patient_registered' as 'patient_registered',
        title: 'Modification du profil patient',
        message: `${patient.firstName} ${patient.lastName} a modifié ses informations personnelles.`,
        read: false,
        createdAt: new Date().toISOString(),
        patientId: patient.id
      };
      DataService.saveAdminNotification(adminNotification);
    }
  };

  const handleSaveAppointment = (appointment: Appointment) => {
    const isNew = !selectedAppointment;
    DataService.saveAppointment(appointment);
    loadData();

    // Créer une notification pour le patient
    const notification: Notification = {
      id: `notif-${Date.now()}`,
      userId: user.id,
      type: isNew ? 'appointment_created' : 'appointment_modified',
      title: isNew ? 'Rendez-vous créé' : 'Rendez-vous modifié',
      message: isNew
        ? `Votre rendez-vous avec ${appointment.dentistName} le ${formatDate(appointment.date)} à ${appointment.time} a été créé avec succès.`
        : `Votre rendez-vous avec ${appointment.dentistName} a été modifié.`,
      read: false,
      createdAt: new Date().toISOString(),
      relatedId: appointment.id
    };
    DataService.saveNotification(notification);
    setNotifications([...notifications, notification]);

    // Notifier le personnel administratif
    const adminNotification = {
      id: `admin-notif-${Date.now()}`,
      type: (isNew ? 'appointment_created' : 'appointment_modified') as 'appointment_created' | 'appointment_modified',
      title: isNew ? 'Nouveau rendez-vous créé' : 'Rendez-vous modifié',
      message: `${patient?.firstName} ${patient?.lastName} a ${isNew ? 'créé' : 'modifié'} un rendez-vous avec ${appointment.dentistName} le ${formatDate(appointment.date)} à ${appointment.time}.`,
      read: false,
      createdAt: new Date().toISOString(),
      relatedId: appointment.id,
      patientId: user.patientId
    };
    DataService.saveAdminNotification(adminNotification);

    setShowAppointmentForm(false);
    setSelectedAppointment(undefined);
  };

  const handleCancelAppointment = (appointment: Appointment) => {
    const cancelledAppointment = { ...appointment, status: 'cancelled' as const };
    DataService.saveAppointment(cancelledAppointment);
    loadData();

    // Créer une notification pour le patient
    const notification: Notification = {
      id: `notif-${Date.now()}`,
      userId: user.id,
      type: 'appointment_cancelled',
      title: 'Rendez-vous annulé',
      message: `Votre rendez-vous avec ${appointment.dentistName} le ${formatDate(appointment.date)} à ${appointment.time} a été annulé.`,
      read: false,
      createdAt: new Date().toISOString(),
      relatedId: appointment.id
    };
    DataService.saveNotification(notification);
    setNotifications([...notifications, notification]);

    // Notifier le personnel administratif
    const adminNotification = {
      id: `admin-notif-${Date.now()}`,
      type: 'appointment_cancelled' as 'appointment_cancelled',
      title: 'Rendez-vous annulé',
      message: `${patient?.firstName} ${patient?.lastName} a annulé son rendez-vous avec ${appointment.dentistName} prévu le ${formatDate(appointment.date)} à ${appointment.time}.`,
      read: false,
      createdAt: new Date().toISOString(),
      relatedId: appointment.id,
      patientId: user.patientId
    };
    DataService.saveAdminNotification(adminNotification);
  };

  const handleMarkNotificationAsRead = (notificationId: string) => {
    DataService.markNotificationAsRead(notificationId);
    const updatedNotifications = DataService.getNotifications(user.id);
    setNotifications(updatedNotifications);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  };

  const upcomingAppointments = appointments
    .filter(a => a.status === 'scheduled' && new Date(a.date) >= new Date())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const pastAppointments = appointments
    .filter(a => a.status === 'completed' || new Date(a.date) < new Date() || a.status === 'cancelled')
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const unreadNotificationCount = notifications.filter(n => !n.read).length;

  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Statistiques rapides */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-500">Rendez-vous à venir</h3>
            <Calendar className="text-blue-600" size={20} />
              </div>
          <p className="text-3xl font-bold text-gray-900">{upcomingAppointments.length}</p>
              </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-500">Traitements</h3>
            <FileText className="text-green-600" size={20} />
            </div>
          <p className="text-3xl font-bold text-gray-900">{treatments.length}</p>
              </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-500">Notifications</h3>
            <Bell className="text-purple-600" size={20} />
          </div>
          <p className="text-3xl font-bold text-gray-900">{unreadNotificationCount}</p>
        </div>
      </div>

      {/* Prochains rendez-vous */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Calendar className="text-blue-600" size={24} />
            <h2 className="text-2xl font-bold text-gray-900">Prochains Rendez-vous</h2>
                </div>
          <button
            onClick={() => {
              setSelectedAppointment(undefined);
              setShowAppointmentForm(true);
            }}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
          >
            <Plus size={20} />
            Prendre un rendez-vous
          </button>
                </div>
        {upcomingAppointments.length > 0 ? (
          <div className="space-y-4">
            {upcomingAppointments.slice(0, 3).map((appointment) => (
              <div
                key={appointment.id}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="text-gray-400" size={16} />
                      <span className="font-semibold text-gray-900">
                        {formatDate(appointment.date)} à {appointment.time}
                      </span>
                </div>
                    <p className="text-gray-600 mb-1">
                      <span className="font-medium">Type:</span> {appointment.type}
                    </p>
                    <p className="text-gray-600 mb-1">
                      <span className="font-medium">Dentiste:</span> {appointment.dentistName}
                    </p>
                    <p className="text-gray-600">
                      <span className="font-medium">Durée:</span> {appointment.duration} minutes
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setSelectedAppointment(appointment);
                        setShowAppointmentForm(true);
                      }}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                      title="Modifier"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button
                      onClick={() => handleCancelAppointment(appointment)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                      title="Annuler"
                    >
                      <X size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Calendar className="mx-auto text-gray-300 mb-2" size={48} />
            <p className="text-gray-500 mb-4">Aucun rendez-vous à venir</p>
            <button
              onClick={() => {
                setSelectedAppointment(undefined);
                setShowAppointmentForm(true);
              }}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2 mx-auto"
            >
              <Plus size={20} />
              Prendre un rendez-vous
            </button>
            </div>
          )}
      </div>
    </div>
  );

  const renderAppointments = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Mes Rendez-vous</h2>
          <p className="text-gray-600">Gérez tous vos rendez-vous</p>
        </div>
        <button
          onClick={() => {
            setSelectedAppointment(undefined);
            setShowAppointmentForm(true);
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
        >
          <Plus size={20} />
          Prendre un rendez-vous
        </button>
      </div>

          {/* Rendez-vous à venir */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Rendez-vous à venir</h3>
            {upcomingAppointments.length > 0 ? (
              <div className="space-y-4">
                {upcomingAppointments.map((appointment) => (
                  <div
                    key={appointment.id}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Clock className="text-gray-400" size={16} />
                          <span className="font-semibold text-gray-900">
                            {formatDate(appointment.date)} à {appointment.time}
                          </span>
                        </div>
                        <p className="text-gray-600 mb-1">
                          <span className="font-medium">Type:</span> {appointment.type}
                        </p>
                        <p className="text-gray-600 mb-1">
                          <span className="font-medium">Dentiste:</span> {appointment.dentistName}
                        </p>
                    <p className="text-gray-600 mb-1">
                          <span className="font-medium">Durée:</span> {appointment.duration} minutes
                        </p>
                        {appointment.notes && (
                          <p className="text-gray-600 mt-2 text-sm italic">{appointment.notes}</p>
                        )}
                      </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setSelectedAppointment(appointment);
                        setShowAppointmentForm(true);
                      }}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                      title="Modifier"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button
                      onClick={() => handleCancelAppointment(appointment)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                      title="Annuler"
                    >
                      <X size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Calendar className="mx-auto text-gray-300 mb-2" size={48} />
                <p className="text-gray-500">Aucun rendez-vous à venir</p>
              </div>
            )}
          </div>

      {/* Historique */}
      {pastAppointments.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Historique</h3>
          <div className="space-y-3">
            {pastAppointments.map((appointment) => (
              <div
                key={appointment.id}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-gray-900">
                      {formatDate(appointment.date)} à {appointment.time}
                    </p>
                    <p className="text-sm text-gray-600">
                      {appointment.type} - {appointment.dentistName}
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      appointment.status === 'completed'
                        ? 'bg-green-100 text-green-700'
                        : appointment.status === 'cancelled'
                        ? 'bg-red-100 text-red-700'
                        : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {appointment.status === 'completed'
                      ? 'Terminé'
                      : appointment.status === 'cancelled'
                      ? 'Annulé'
                      : appointment.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const renderMedical = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Mon Dossier Médical</h2>
        <p className="text-gray-600">Consultez votre dossier médical complet</p>
      </div>

      {/* Informations personnelles */}
      {patient && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-gray-900">Informations Personnelles</h3>
            <button
              onClick={() => setShowPatientForm(true)}
              className="text-blue-600 hover:text-blue-700 flex items-center gap-2"
            >
              <Edit2 size={18} />
              Modifier
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Nom complet</p>
              <p className="text-lg font-semibold text-gray-900">
                {patient.firstName} {patient.lastName}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Date de naissance</p>
              <p className="text-lg font-semibold text-gray-900">
                {new Date(patient.dateOfBirth).toLocaleDateString('fr-FR')}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Téléphone</p>
              <p className="text-lg font-semibold text-gray-900">{patient.phone}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p className="text-lg font-semibold text-gray-900">{patient.email}</p>
            </div>
            {patient.address && (
              <div className="md:col-span-2">
                <p className="text-sm text-gray-500">Adresse</p>
                <p className="text-lg font-semibold text-gray-900">{patient.address}</p>
              </div>
            )}
            {patient.bloodType && (
              <div>
                <p className="text-sm text-gray-500">Groupe sanguin</p>
                <p className="text-lg font-semibold text-gray-900">{patient.bloodType}</p>
              </div>
            )}
            {patient.allergies && patient.allergies.length > 0 && (
              <div>
                <p className="text-sm text-gray-500">Allergies</p>
                <div className="flex flex-wrap gap-2 mt-1">
                  {patient.allergies.map((allergy, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium"
                    >
                      {allergy}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {patient.medicalHistory && (
              <div className="md:col-span-2">
                <p className="text-sm text-gray-500">Antécédents médicaux</p>
                <p className="text-lg font-semibold text-gray-900">{patient.medicalHistory}</p>
              </div>
            )}
          </div>
        </div>
      )}

          {/* Historique des traitements */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <FileText className="text-green-600" size={24} />
          <h3 className="text-xl font-semibold text-gray-900">Historique des Traitements</h3>
            </div>
            {treatments.length > 0 ? (
              <div className="space-y-4">
                {treatments
                  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                  .map((treatment) => (
                    <div
                      key={treatment.id}
                      className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div>
                      <h4 className="font-semibold text-gray-900 text-lg">{treatment.type}</h4>
                          <p className="text-sm text-gray-500">
                        {new Date(treatment.date).toLocaleDateString('fr-FR')} - {treatment.dentistName}
                          </p>
                        </div>
                        <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                          {treatment.cost.toLocaleString('fr-FR')} MAD
                        </span>
                      </div>
                      <p className="text-gray-700 mb-2">{treatment.description}</p>
                      {treatment.tooth && (
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">Dent:</span> {treatment.tooth}
                        </p>
                      )}
                      {treatment.prescriptions && treatment.prescriptions.length > 0 && (
                        <div className="mt-2">
                          <p className="text-sm font-medium text-gray-700 mb-1">Prescriptions:</p>
                          <ul className="list-disc list-inside text-sm text-gray-600">
                            {treatment.prescriptions.map((prescription, idx) => (
                              <li key={idx}>{prescription}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {treatment.nextVisit && (
                        <p className="text-sm text-gray-600 mt-2">
                          <span className="font-medium">Prochaine visite:</span>{' '}
                          {new Date(treatment.nextVisit).toLocaleDateString('fr-FR')}
                        </p>
                      )}
                    </div>
                  ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <FileText className="mx-auto text-gray-300 mb-2" size={48} />
                <p className="text-gray-500">Aucun traitement enregistré</p>
              </div>
            )}
          </div>
    </div>
  );

  const renderNotifications = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Mes Notifications</h2>
        <p className="text-gray-600">Consultez toutes vos notifications</p>
      </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        {notifications.length > 0 ? (
          <div className="space-y-4">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`border rounded-lg p-4 hover:shadow-md transition-shadow ${
                  notification.read
                    ? 'border-gray-200 bg-gray-50'
                    : 'border-blue-200 bg-blue-50'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      {!notification.read && (
                        <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                      )}
                      <h4 className="font-semibold text-gray-900">{notification.title}</h4>
                    </div>
                    <p className="text-gray-700 text-sm">{notification.message}</p>
                    <p className="text-xs text-gray-500 mt-2">
                      {new Date(notification.createdAt).toLocaleString('fr-FR')}
                    </p>
                  </div>
                  {!notification.read && (
                    <button
                      onClick={() => handleMarkNotificationAsRead(notification.id)}
                      className="ml-4 text-blue-600 hover:text-blue-700 text-sm"
                    >
                      Marquer comme lu
                    </button>
                  )}
                    </div>
                  </div>
                ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Bell className="mx-auto text-gray-300 mb-2" size={48} />
            <p className="text-gray-500">Aucune notification</p>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <nav className="bg-white shadow-sm border-b border-gray-200 fixed w-full z-30">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <div className="bg-blue-600 p-2 rounded-lg">
                <User className="text-white" size={24} />
              </div>
              <div className="ml-3">
                <h1 className="text-xl font-bold text-gray-900">Espace Patient</h1>
                <p className="text-xs text-gray-500">Cabinet Dentaire</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                title="Notifications"
              >
                <Bell size={20} />
                {unreadNotificationCount > 0 && (
                  <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {unreadNotificationCount}
                  </span>
                )}
              </button>
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium text-gray-900">
                  {user.firstName} {user.lastName}
                </p>
                <p className="text-xs text-gray-500">Patient</p>
              </div>
              <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold">
                {user.firstName[0]}{user.lastName[0]}
              </div>
              <button
                onClick={onLogout}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                title="Déconnexion"
              >
                <LogOut size={20} />
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex pt-16">
        {/* Sidebar Navigation */}
        <aside className="w-64 bg-white border-r border-gray-200 fixed h-[calc(100vh-4rem)] overflow-y-auto">
          <nav className="mt-5 px-3 space-y-1">
            {[
              { id: 'dashboard', label: 'Tableau de bord', icon: LayoutDashboard },
              { id: 'appointments', label: 'Rendez-vous', icon: Calendar },
              { id: 'medical', label: 'Dossier Médical', icon: FileText },
              { id: 'notifications', label: 'Notifications', icon: Bell }
            ].map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentView(item.id as ViewMode)}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                    isActive
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <Icon size={20} />
                  {item.label}
                </button>
              );
            })}
          </nav>
        </aside>

      {/* Notifications dropdown */}
      {showNotifications && (
        <div className="fixed right-4 top-20 bg-white rounded-lg shadow-xl border border-gray-200 w-96 max-h-96 overflow-y-auto z-50">
          <div className="p-4 border-b border-gray-200 flex items-center justify-between">
            <h3 className="font-semibold text-gray-900">Notifications</h3>
            <button
              onClick={() => setShowNotifications(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <X size={18} />
            </button>
          </div>
          <div className="p-2">
            {notifications.slice(0, 5).map((notification) => (
              <div
                key={notification.id}
                className={`p-3 rounded-lg mb-2 cursor-pointer ${
                  notification.read ? 'bg-gray-50' : 'bg-blue-50'
                }`}
                onClick={() => {
                  if (!notification.read) {
                    handleMarkNotificationAsRead(notification.id);
                  }
                  setShowNotifications(false);
                  setCurrentView('notifications');
                }}
              >
                <div className="flex items-start gap-2">
                  {!notification.read && (
                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                  )}
                  <div className="flex-1">
                    <h4 className="font-semibold text-sm text-gray-900">{notification.title}</h4>
                    <p className="text-xs text-gray-600 mt-1">{notification.message}</p>
                  </div>
                </div>
              </div>
            ))}
            {notifications.length === 0 && (
              <div className="text-center py-8">
                <Bell className="mx-auto text-gray-300 mb-2" size={32} />
                <p className="text-sm text-gray-500">Aucune notification</p>
            </div>
          )}
        </div>
        </div>
      )}

        {/* Main Content */}
        <main className="flex-1 ml-64 p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {currentView === 'dashboard' && renderDashboard()}
            {currentView === 'appointments' && renderAppointments()}
            {currentView === 'medical' && renderMedical()}
            {currentView === 'notifications' && renderNotifications()}
          </div>
      </main>
      </div>

      {/* Formulaire de modification du patient */}
      {showPatientForm && patient && (
        <PatientForm
          patient={patient}
          onSave={handleSavePatient}
          onCancel={() => setShowPatientForm(false)}
        />
      )}

      {/* Formulaire de rendez-vous */}
      {showAppointmentForm && user.patientId && (
        <PatientAppointmentForm
          appointment={selectedAppointment}
          patientId={user.patientId}
          onSave={handleSaveAppointment}
          onCancel={() => {
            setShowAppointmentForm(false);
            setSelectedAppointment(undefined);
          }}
        />
      )}
    </div>
  );
}
