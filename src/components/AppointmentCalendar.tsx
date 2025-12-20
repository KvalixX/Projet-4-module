import { useState, useEffect } from 'react';
import { Calendar, Clock, Plus, ChevronLeft, ChevronRight, Edit2, Trash2 } from 'lucide-react';
import { Appointment } from '../types';
import { appointmentService } from '../services/api/appointmentService';
import AppointmentForm from './AppointmentForm';

export default function AppointmentCalendar() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | undefined>();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [appointmentToDelete, setAppointmentToDelete] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadAppointments = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await appointmentService.getAll();
        setAppointments(data);
      } catch (e) {
        setError('Erreur lors du chargement des rendez-vous');
      } finally {
        setLoading(false);
      }
    };

    loadAppointments();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'completed':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'cancelled':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'no-show':
        return 'bg-gray-100 text-gray-700 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'Prévu';
      case 'completed':
        return 'Terminé';
      case 'cancelled':
        return 'Annulé';
      case 'no-show':
        return 'Absent';
      default:
        return status;
    }
  };

  const filteredAppointments = appointments.filter((apt) => {
    if (filterStatus === 'all') return true;
    return apt.status === filterStatus;
  });

  const selectedDateStr = selectedDate.toISOString().split('T')[0];
  const todayAppointments = filteredAppointments.filter(
    (apt) => apt.date === selectedDateStr
  );

  const upcomingAppointments = filteredAppointments
    .filter((apt) => new Date(apt.date) > selectedDate && apt.status === 'scheduled')
    .sort((a, b) => {
      const dateCompare = a.date.localeCompare(b.date);
      if (dateCompare !== 0) return dateCompare;
      return a.time.localeCompare(b.time);
    })
    .slice(0, 5);

  const handleSaveAppointment = (appointment: Appointment) => {
    const saveAppointment = async () => {
      try {
        setLoading(true);
        setError(null);

        if (selectedAppointment) {
          await appointmentService.update(selectedAppointment.id, {
            patientId: appointment.patientId,
            dentistId: appointment.dentistId,
            date: appointment.date,
            time: appointment.time,
            duration: appointment.duration,
            type: appointment.type,
            status: appointment.status,
            notes: appointment.notes,
          });
        } else {
          const created = await appointmentService.create({
            patientId: appointment.patientId,
            dentistId: appointment.dentistId,
            date: appointment.date,
            time: appointment.time,
            duration: appointment.duration,
            type: appointment.type,
            notes: appointment.notes,
          });

          if (appointment.status && appointment.status !== 'scheduled') {
            await appointmentService.update(created.id, { status: appointment.status });
          }
        }

        const data = await appointmentService.getAll();
        setAppointments(data);
        setShowForm(false);
        setSelectedAppointment(undefined);
      } catch (e) {
        setError('Erreur lors de la sauvegarde du rendez-vous');
      } finally {
        setLoading(false);
      }
    };

    saveAppointment();
  };

  const handleEditAppointment = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setShowForm(true);
  };

  const handleDeleteAppointment = () => {
    if (!appointmentToDelete) return;
    const deleteAppointment = async () => {
      try {
        setLoading(true);
        setError(null);
        await appointmentService.delete(appointmentToDelete);
        const data = await appointmentService.getAll();
        setAppointments(data);
        setShowDeleteConfirm(false);
        setAppointmentToDelete(null);
      } catch (e) {
        setError('Erreur lors de la suppression du rendez-vous');
      } finally {
        setLoading(false);
      }
    };

    deleteAppointment();
  };

  const handleCancelAppointment = (appointment: Appointment) => {
    const cancelAppointment = async () => {
      try {
        setLoading(true);
        setError(null);
        await appointmentService.update(appointment.id, { status: 'cancelled' });
        const data = await appointmentService.getAll();
        setAppointments(data);
      } catch (e) {
        setError('Erreur lors de l\'annulation du rendez-vous');
      } finally {
        setLoading(false);
      }
    };

    cancelAppointment();
  };

  const changeDate = (days: number) => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + days);
    setSelectedDate(newDate);
  };

  const getWeekStats = () => {
    const today = new Date();
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - today.getDay() + 1);
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);
    
    const weekAppointments = appointments.filter(apt => {
      const aptDate = new Date(apt.date);
      return aptDate >= weekStart && aptDate <= weekEnd;
    });
    
    return weekAppointments.length;
  };

  const getCompletionRate = () => {
    const completed = appointments.filter(a => a.status === 'completed').length;
    const total = appointments.filter(a => a.status !== 'cancelled').length;
    return total > 0 ? Math.round((completed / total) * 100) : 0;
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Gestion des Rendez-vous</h2>
        <p className="text-gray-600">Planifiez et suivez les rendez-vous de vos patients</p>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-500">Aujourd'hui</h3>
            <Calendar className="text-blue-600" size={20} />
          </div>
          <p className="text-3xl font-bold text-gray-900">{todayAppointments.length}</p>
          <p className="text-sm text-gray-600 mt-1">Rendez-vous prévus</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-500">Cette semaine</h3>
            <Clock className="text-green-600" size={20} />
          </div>
          <p className="text-3xl font-bold text-gray-900">{getWeekStats()}</p>
          <p className="text-sm text-gray-600 mt-1">Total planifiés</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-500">Taux de présence</h3>
            <div className="text-green-600 text-xl">✓</div>
          </div>
          <p className="text-3xl font-bold text-gray-900">{getCompletionRate()}%</p>
          <p className="text-sm text-gray-600 mt-1">Ce mois-ci</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-4 border-b border-gray-200">
              <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {selectedDate.toLocaleDateString('fr-FR', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {todayAppointments.length} rendez-vous programmés
                  </p>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => changeDate(-1)}
                    className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                    title="Jour précédent"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <button 
                    onClick={() => setSelectedDate(new Date())}
                    className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm"
                    title="Aujourd'hui"
                  >
                    Aujourd'hui
                  </button>
                  <button 
                    onClick={() => changeDate(1)}
                    className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                    title="Jour suivant"
                  >
                    <ChevronRight size={20} />
                  </button>
                  <button 
                    onClick={() => {
                      setSelectedAppointment(undefined);
                      setShowForm(true);
                    }}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
                  >
                    <Plus size={20} />
                    <span className="hidden sm:inline">Nouveau</span>
                  </button>
                </div>
              </div>

              <div className="flex gap-2 mt-4 flex-wrap">
                <button
                  onClick={() => setFilterStatus('all')}
                  className={`px-3 py-1 rounded-full text-sm ${
                    filterStatus === 'all'
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  Tous
                </button>
                <button
                  onClick={() => setFilterStatus('scheduled')}
                  className={`px-3 py-1 rounded-full text-sm ${
                    filterStatus === 'scheduled'
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  Prévus
                </button>
                <button
                  onClick={() => setFilterStatus('completed')}
                  className={`px-3 py-1 rounded-full text-sm ${
                    filterStatus === 'completed'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  Terminés
                </button>
              </div>
            </div>

            <div className="p-4">
              {loading ? (
                <div className="text-center py-12">
                  <p className="text-gray-500">Chargement...</p>
                </div>
              ) : todayAppointments.length === 0 ? (
                <div className="text-center py-12">
                  <Calendar className="mx-auto text-gray-300 mb-3" size={48} />
                  <p className="text-gray-500">Aucun rendez-vous pour cette date</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {todayAppointments
                    .sort((a, b) => a.time.localeCompare(b.time))
                    .map((appointment) => (
                      <div
                        key={appointment.id}
                        className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex items-start gap-3 flex-1">
                            <div className="bg-blue-100 text-blue-700 px-3 py-1 rounded-lg font-semibold text-sm">
                              {appointment.time}
                            </div>
                            <div className="flex-1">
                              <h4 className="font-semibold text-gray-900">
                                {appointment.patientName}
                              </h4>
                              <p className="text-sm text-gray-600">{appointment.type}</p>
                              <p className="text-xs text-gray-500 mt-1">
                                Dr. {appointment.dentistName}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                                appointment.status
                              )}`}
                            >
                              {getStatusLabel(appointment.status)}
                            </span>
                            {appointment.status === 'scheduled' && (
                              <div className="flex gap-1">
                                <button
                                  onClick={() => handleEditAppointment(appointment)}
                                  className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                                  title="Modifier"
                                >
                                  <Edit2 size={16} />
                                </button>
                                <button
                                  onClick={() => {
                                    setAppointmentToDelete(appointment.id);
                                    setShowDeleteConfirm(true);
                                  }}
                                  className="p-1 text-red-600 hover:bg-red-50 rounded"
                                  title="Supprimer"
                                >
                                  <Trash2 size={16} />
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-100">
                          <div className="flex items-center text-sm text-gray-600">
                            <Clock size={14} className="mr-1" />
                            {appointment.duration} minutes
                          </div>
                          {appointment.notes && (
                            <p className="text-xs text-gray-500 italic">{appointment.notes}</p>
                          )}
                        </div>
                        {appointment.status === 'scheduled' && (
                          <div className="mt-3 pt-3 border-t border-gray-100">
                            <button
                              onClick={() => handleCancelAppointment(appointment)}
                              className="text-xs text-red-600 hover:text-red-800"
                            >
                              Annuler le rendez-vous
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="font-semibold text-gray-900 mb-4">Rendez-vous à venir</h3>
            <div className="space-y-3">
              {upcomingAppointments.map((appointment) => (
                <div
                  key={appointment.id}
                  className="border border-gray-200 rounded-lg p-3 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex justify-between items-start mb-2">
                    <p className="font-medium text-sm text-gray-900">{appointment.patientName}</p>
                    <span className="text-xs text-gray-500">
                      {new Date(appointment.date).toLocaleDateString('fr-FR', {
                        day: 'numeric',
                        month: 'short'
                      })}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600">{appointment.type}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <Clock size={12} className="text-gray-400" />
                    <span className="text-xs text-gray-500">{appointment.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg shadow-sm border border-blue-200 p-4">
            <h3 className="font-semibold text-gray-900 mb-2">Astuce</h3>
            <p className="text-sm text-gray-700">
              Utilisez les filtres pour visualiser rapidement les rendez-vous par statut. Cliquez sur un
              rendez-vous pour voir plus de détails ou le modifier.
            </p>
          </div>
        </div>
      </div>

      {/* Formulaire de rendez-vous */}
      {showForm && (
        <AppointmentForm
          appointment={selectedAppointment}
          onSave={handleSaveAppointment}
          onCancel={() => {
            setShowForm(false);
            setSelectedAppointment(undefined);
          }}
          selectedDate={selectedDateStr}
        />
      )}

      {/* Confirmation de suppression */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-100 mx-auto mb-4">
                <Trash2 className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 text-center mb-2">
                Supprimer le rendez-vous
              </h3>
              <p className="text-gray-600 text-sm text-center mb-6">
                Êtes-vous sûr de vouloir supprimer ce rendez-vous ? Cette action est irréversible.
              </p>
              <div className="flex justify-center space-x-4">
                <button
                  onClick={() => {
                    setShowDeleteConfirm(false);
                    setAppointmentToDelete(null);
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Annuler
                </button>
                <button
                  onClick={handleDeleteAppointment}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Supprimer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
