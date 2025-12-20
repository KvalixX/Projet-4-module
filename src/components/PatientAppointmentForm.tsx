import { useState, useEffect } from 'react';
import { X, Save, Calendar, Clock, FileText } from 'lucide-react';
import { Appointment, Staff } from '../types';
import { appointmentService } from '../services/api/appointmentService';
import { staffService } from '../services/api/staffService';

interface PatientAppointmentFormProps {
  appointment?: Appointment;
  patientId: string;
  onSave: (appointment: Appointment) => void;
  onCancel: () => void;
  selectedDate?: string;
  selectedTime?: string;
}

const appointmentTypes = [
  'Consultation',
  'Détartrage',
  'Plombage',
  'Extraction',
  'Couronne',
  'Blanchiment',
  'Orthodontie',
  'Urgence',
  'Contrôle',
  'Autre'
];

export default function PatientAppointmentForm({
  appointment,
  patientId,
  onSave,
  onCancel,
  selectedDate,
  selectedTime
}: PatientAppointmentFormProps) {
  const [staff, setStaff] = useState<Staff[]>([]);
  const [formData, setFormData] = useState<Omit<Appointment, 'patientName' | 'dentistName' | 'patientId'>>(
    appointment || {
      id: '',
      dentistId: '',
      date: selectedDate || new Date().toISOString().split('T')[0],
      time: selectedTime || '09:00',
      duration: 30,
      type: 'Consultation',
      status: 'scheduled',
      notes: ''
    }
  );
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (appointment) {
      setFormData(appointment);
    }
  }, [appointment]);

  useEffect(() => {
    const loadDentists = async () => {
      try {
        setLoading(true);
        const allStaff = await staffService.getAll();
        setStaff(allStaff.filter(s => s.role === 'dentist'));
      } catch (e) {
        setStaff([]);
      } finally {
        setLoading(false);
      }
    };

    loadDentists();
  }, []);

  const validateForm = async () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.dentistId) newErrors.dentistId = 'Le dentiste est requis';
    if (!formData.date) newErrors.date = 'La date est requise';
    if (!formData.time) newErrors.time = 'L\'heure est requise';
    
    // Vérifier que la date n'est pas dans le passé
    const selectedDateTime = new Date(`${formData.date}T${formData.time}`);
    if (selectedDateTime < new Date()) {
      newErrors.date = 'La date et l\'heure doivent être dans le futur';
    }
    
    // Vérifier les conflits de rendez-vous
    if (formData.dentistId && formData.date && formData.time && formData.duration > 0) {
      try {
        const conflict = await appointmentService.checkConflicts({
          dentistId: formData.dentistId,
          date: formData.date,
          time: formData.time,
          duration: formData.duration,
          appointmentId: appointment?.id,
        });

        if (conflict.hasConflict) {
          newErrors.time = 'Ce créneau est déjà réservé. Veuillez choisir un autre horaire.';
        }
      } catch (e) {
        // ignore
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const submit = async () => {
      if (await validateForm()) {
        const selectedDentist = staff.find(s => s.id === formData.dentistId);

        const appointmentToSave: Appointment = {
          ...formData,
          id: appointment?.id || `apt-${Date.now()}`,
          patientId: patientId,
          patientName: '',
          dentistName: selectedDentist ? `${selectedDentist.firstName} ${selectedDentist.lastName}` : ''
        };

        onSave(appointmentToSave);
      }
    };

    submit();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'duration' ? parseInt(value) || 0 : value
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-lg font-semibold">
            {appointment ? 'Modifier le rendez-vous' : 'Prendre un rendez-vous'}
          </h3>
          <button 
            onClick={onCancel}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Dentiste <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <select
                  name="dentistId"
                  value={formData.dentistId}
                  onChange={handleChange}
                  className={`pl-10 w-full rounded-lg border ${errors.dentistId ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                >
                  <option value="">Sélectionner un dentiste</option>
                  {staff.map(dentist => (
                    <option key={dentist.id} value={dentist.id}>
                      {dentist.firstName} {dentist.lastName} {dentist.specialty ? `- ${dentist.specialty}` : ''}
                    </option>
                  ))}
                </select>
              </div>
              {errors.dentistId && <p className="mt-1 text-sm text-red-600">{errors.dentistId}</p>}
              {loading && <p className="mt-1 text-sm text-gray-500">Chargement des dentistes...</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  min={new Date().toISOString().split('T')[0]}
                  className={`pl-10 w-full rounded-lg border ${errors.date ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                />
              </div>
              {errors.date && <p className="mt-1 text-sm text-red-600">{errors.date}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Heure <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="time"
                  name="time"
                  value={formData.time}
                  onChange={handleChange}
                  className={`pl-10 w-full rounded-lg border ${errors.time ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                />
              </div>
              {errors.time && <p className="mt-1 text-sm text-red-600">{errors.time}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Durée (minutes) <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <select
                  name="duration"
                  value={formData.duration}
                  onChange={handleChange}
                  className="pl-10 w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value={15}>15 minutes</option>
                  <option value={30}>30 minutes</option>
                  <option value={45}>45 minutes</option>
                  <option value={60}>1 heure</option>
                  <option value={90}>1h30</option>
                  <option value={120}>2 heures</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Type de rendez-vous <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className="pl-10 w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {appointmentTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Notes (optionnel)
              </label>
              <textarea
                name="notes"
                value={formData.notes || ''}
                onChange={handleChange}
                rows={4}
                className="w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Informations supplémentaires sur votre rendez-vous..."
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <Save size={18} />
              {appointment ? 'Mettre à jour' : 'Prendre rendez-vous'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

