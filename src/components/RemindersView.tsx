import { useState, useEffect } from 'react';
import { Bell, Calendar, Filter, Check, X, AlertCircle, Send } from 'lucide-react';
import { Reminder } from '../types';
import { DataService } from '../services/dataService';
import { mockReminders } from '../data/mockData';

export default function RemindersView() {
  const [filterType, setFilterType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [reminders, setReminders] = useState<Reminder[]>([]);

  useEffect(() => {
    if (DataService.getReminders().length === 0) {
      mockReminders.forEach(r => DataService.saveReminder(r));
    }
    setReminders(DataService.getReminders());
  }, []);

  const filteredReminders = reminders.filter((reminder) => {
    const matchesType = filterType === 'all' || reminder.type === filterType;
    const matchesStatus = filterStatus === 'all' || reminder.status === filterStatus;
    return matchesType && matchesStatus;
  });

  const handleSendReminder = (reminder: Reminder) => {
    const updatedReminder = { ...reminder, status: 'sent' as const };
    DataService.saveReminder(updatedReminder);
    setReminders(DataService.getReminders());
    // Dans une vraie application, on enverrait ici une notification par email/SMS
    alert(`Rappel envoyé à ${reminder.patientName}`);
  };

  const handleMarkCompleted = (reminder: Reminder) => {
    const updatedReminder = { ...reminder, status: 'completed' as const };
    DataService.saveReminder(updatedReminder);
    setReminders(DataService.getReminders());
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'checkup':
        return 'Contrôle';
      case 'treatment':
        return 'Traitement';
      case 'followup':
        return 'Suivi';
      default:
        return type;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'checkup':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'treatment':
        return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'followup':
        return 'bg-green-100 text-green-700 border-green-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return (
          <span className="flex items-center gap-1 px-2 py-1 bg-yellow-100 text-yellow-700 text-xs font-medium rounded-full">
            <AlertCircle size={12} />
            En attente
          </span>
        );
      case 'sent':
        return (
          <span className="flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
            <Bell size={12} />
            Envoyé
          </span>
        );
      case 'completed':
        return (
          <span className="flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
            <Check size={12} />
            Terminé
          </span>
        );
      default:
        return null;
    }
  };

  const getDaysUntil = (date: string) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dueDate = new Date(date);
    dueDate.setHours(0, 0, 0, 0);
    const diffTime = dueDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getUrgencyColor = (daysUntil: number) => {
    if (daysUntil < 0) return 'border-l-4 border-red-500';
    if (daysUntil <= 7) return 'border-l-4 border-orange-500';
    if (daysUntil <= 30) return 'border-l-4 border-yellow-500';
    return 'border-l-4 border-green-500';
  };

  const stats = {
    total: reminders.length,
    pending: reminders.filter((r) => r.status === 'pending').length,
    urgent: reminders.filter((r) => {
      const days = getDaysUntil(r.dueDate);
      return days >= 0 && days <= 7;
    }).length,
    overdue: reminders.filter((r) => getDaysUntil(r.dueDate) < 0).length
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Rappels et Notifications</h2>
        <p className="text-gray-600">Gérez les rappels pour vos patients</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Bell className="text-blue-600" size={20} />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              <p className="text-xs text-gray-600">Total Rappels</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <AlertCircle className="text-yellow-600" size={20} />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.pending}</p>
              <p className="text-xs text-gray-600">En Attente</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Calendar className="text-orange-600" size={20} />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.urgent}</p>
              <p className="text-xs text-gray-600">Urgents (7j)</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 rounded-lg">
              <X className="text-red-600" size={20} />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.overdue}</p>
              <p className="text-xs text-gray-600">En Retard</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center gap-2 mb-4">
            <Filter size={20} className="text-gray-600" />
            <h3 className="font-semibold text-gray-900">Filtres</h3>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <p className="text-xs font-medium text-gray-500 mb-2">Type de rappel:</p>
              <div className="flex gap-2 flex-wrap">
                <button
                  onClick={() => setFilterType('all')}
                  className={`px-3 py-1 rounded-full text-sm ${
                    filterType === 'all'
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  Tous
                </button>
                <button
                  onClick={() => setFilterType('checkup')}
                  className={`px-3 py-1 rounded-full text-sm ${
                    filterType === 'checkup'
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  Contrôles
                </button>
                <button
                  onClick={() => setFilterType('treatment')}
                  className={`px-3 py-1 rounded-full text-sm ${
                    filterType === 'treatment'
                      ? 'bg-orange-100 text-orange-700'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  Traitements
                </button>
                <button
                  onClick={() => setFilterType('followup')}
                  className={`px-3 py-1 rounded-full text-sm ${
                    filterType === 'followup'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  Suivis
                </button>
              </div>
            </div>

            <div className="flex-1">
              <p className="text-xs font-medium text-gray-500 mb-2">Statut:</p>
              <div className="flex gap-2 flex-wrap">
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
                  onClick={() => setFilterStatus('pending')}
                  className={`px-3 py-1 rounded-full text-sm ${
                    filterStatus === 'pending'
                      ? 'bg-yellow-100 text-yellow-700'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  En Attente
                </button>
                <button
                  onClick={() => setFilterStatus('sent')}
                  className={`px-3 py-1 rounded-full text-sm ${
                    filterStatus === 'sent'
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  Envoyés
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="p-4">
          {filteredReminders.length === 0 ? (
            <div className="text-center py-12">
              <Bell className="mx-auto text-gray-300 mb-2" size={48} />
              <p className="text-gray-500">Aucun rappel trouvé</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredReminders
                .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
                .map((reminder) => {
                  const daysUntil = getDaysUntil(reminder.dueDate);
                  return (
                    <div
                      key={reminder.id}
                      className={`bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow ${getUrgencyColor(
                        daysUntil
                      )}`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                        <div className="flex items-start gap-3">
                          <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-semibold text-sm">
                            {reminder.patientName
                              .split(' ')
                              .map((n) => n[0])
                              .join('')}
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900">{reminder.patientName}</h4>
                            <span
                              className={`inline-block mt-1 px-2 py-1 text-xs font-medium border rounded-full ${getTypeColor(
                                reminder.type
                              )}`}
                            >
                              {getTypeLabel(reminder.type)}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {getStatusBadge(reminder.status)}
                        </div>
                      </div>

                      <p className="text-sm text-gray-700 mb-3 pl-13">{reminder.message}</p>

                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pl-13">
                        <div className="flex items-center gap-2">
                          <Calendar size={16} className="text-gray-400" />
                          <span className="text-sm text-gray-600">
                            {new Date(reminder.dueDate).toLocaleDateString('fr-FR', {
                              weekday: 'long',
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </span>
                          {daysUntil >= 0 ? (
                            <span
                              className={`text-xs font-medium px-2 py-1 rounded ${
                                daysUntil <= 7
                                  ? 'bg-orange-100 text-orange-700'
                                  : 'bg-green-100 text-green-700'
                              }`}
                            >
                              dans {daysUntil} jour{daysUntil !== 1 ? 's' : ''}
                            </span>
                          ) : (
                            <span className="text-xs font-medium px-2 py-1 rounded bg-red-100 text-red-700">
                              En retard de {Math.abs(daysUntil)} jour{Math.abs(daysUntil) !== 1 ? 's' : ''}
                            </span>
                          )}
                        </div>

                        {reminder.status === 'pending' && (
                          <div className="flex gap-2">
                            <button 
                              onClick={() => handleSendReminder(reminder)}
                              className="px-3 py-1 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-1"
                            >
                              <Send size={14} />
                              Envoyer Rappel
                            </button>
                            <button 
                              onClick={() => handleMarkCompleted(reminder)}
                              className="px-3 py-1 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors flex items-center gap-1"
                            >
                              <Check size={14} />
                              Marquer Terminé
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
