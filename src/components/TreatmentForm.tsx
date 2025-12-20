import { useState, useEffect } from 'react';
import { X, Save, Calendar, DollarSign, User, FileText, Plus } from 'lucide-react';
import { Treatment, Patient, Staff } from '../types';
import { patientService } from '../services/api/patientService';
import { staffService } from '../services/api/staffService';

interface TreatmentFormProps {
  treatment?: Treatment;
  onSave: (treatment: Treatment) => void;
  onCancel: () => void;
}

const treatmentTypes = [
  'Consultation',
  'Détartrage',
  'Plombage',
  'Extraction',
  'Couronne',
  'Blanchiment',
  'Orthodontie',
  'Prothèse',
  'Implant',
  'Chirurgie',
  'Autre'
];

export default function TreatmentForm({ treatment, onSave, onCancel }: TreatmentFormProps) {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [staff, setStaff] = useState<Staff[]>([]);
  const [formData, setFormData] = useState<Omit<Treatment, 'patientName' | 'dentistName'>>(
    treatment || {
      id: '',
      patientId: '',
      dentistId: '',
      date: new Date().toISOString().split('T')[0],
      type: 'Consultation',
      tooth: '',
      description: '',
      cost: 0,
      prescriptions: [],
      nextVisit: ''
    }
  );
  const [newPrescription, setNewPrescription] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (treatment) {
      setFormData({
        ...treatment,
        prescriptions: treatment.prescriptions || []
      });
    }
  }, [treatment]);

  useEffect(() => {
    const loadOptions = async () => {
      try {
        setLoading(true);
        setError(null);

        const [patientsData, staffData] = await Promise.all([
          patientService.getAll(),
          staffService.getAll(),
        ]);

        setPatients(patientsData);
        setStaff(staffData.filter(s => s.role === 'dentist'));
      } catch (e) {
        setError('Erreur lors du chargement des données');
      } finally {
        setLoading(false);
      }
    };

    loadOptions();
  }, []);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.patientId) newErrors.patientId = 'Le patient est requis';
    if (!formData.dentistId) newErrors.dentistId = 'Le dentiste est requis';
    if (!formData.date) newErrors.date = 'La date est requise';
    if (!formData.type) newErrors.type = 'Le type de traitement est requis';
    if (!formData.description.trim()) newErrors.description = 'La description est requise';
    if (formData.cost < 0) newErrors.cost = 'Le coût ne peut pas être négatif';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      const selectedPatient = patients.find(p => p.id === formData.patientId);
      const selectedDentist = staff.find(s => s.id === formData.dentistId);
      
      const treatmentToSave: Treatment = {
        ...formData,
        id: treatment?.id || `treat-${Date.now()}`,
        patientName: selectedPatient ? `${selectedPatient.firstName} ${selectedPatient.lastName}` : '',
        dentistName: selectedDentist ? `${selectedDentist.firstName} ${selectedDentist.lastName}` : ''
      };
      
      onSave(treatmentToSave);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'cost' ? parseFloat(value) || 0 : value
    }));
  };

  const addPrescription = () => {
    if (newPrescription.trim() && !formData.prescriptions?.includes(newPrescription.trim())) {
      setFormData(prev => ({
        ...prev,
        prescriptions: [...(prev.prescriptions || []), newPrescription.trim()]
      }));
      setNewPrescription('');
    }
  };

  const removePrescription = (prescriptionToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      prescriptions: prev.prescriptions?.filter(p => p !== prescriptionToRemove) || []
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-lg font-semibold">
            {treatment ? 'Modifier le traitement' : 'Nouveau traitement'}
          </h3>
          <button 
            onClick={onCancel}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Patient <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <select
                  name="patientId"
                  value={formData.patientId}
                  onChange={handleChange}
                  className={`pl-10 w-full rounded-lg border ${errors.patientId ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                >
                  <option value="">Sélectionner un patient</option>
                  {patients.map(patient => (
                    <option key={patient.id} value={patient.id}>
                      {patient.firstName} {patient.lastName} - {patient.phone}
                    </option>
                  ))}
                </select>
              </div>
              {errors.patientId && <p className="mt-1 text-sm text-red-600">{errors.patientId}</p>}
              {loading && <p className="mt-1 text-xs text-gray-500">Chargement...</p>}
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Dentiste <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
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
              {loading && <p className="mt-1 text-xs text-gray-500">Chargement...</p>}
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
                  max={new Date().toISOString().split('T')[0]}
                  className={`pl-10 w-full rounded-lg border ${errors.date ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                />
              </div>
              {errors.date && <p className="mt-1 text-sm text-red-600">{errors.date}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Type de traitement <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className={`pl-10 w-full rounded-lg border ${errors.type ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                >
                  {treatmentTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
              {errors.type && <p className="mt-1 text-sm text-red-600">{errors.type}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Dent (optionnel)
              </label>
              <input
                type="text"
                name="tooth"
                value={formData.tooth || ''}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ex: 16, 26, etc."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Coût (DH) <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="number"
                  name="cost"
                  value={formData.cost}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  className={`pl-10 w-full rounded-lg border ${errors.cost ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                  placeholder="0.00"
                />
              </div>
              {errors.cost && <p className="mt-1 text-sm text-red-600">{errors.cost}</p>}
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className={`w-full rounded-lg border ${errors.description ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                placeholder="Description détaillée du traitement réalisé..."
              />
              {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Prescriptions
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newPrescription}
                  onChange={(e) => setNewPrescription(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addPrescription())}
                  className="flex-1 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Ajouter une prescription"
                />
                <button
                  type="button"
                  onClick={addPrescription}
                  className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors flex items-center gap-2"
                >
                  <Plus size={18} />
                  Ajouter
                </button>
              </div>
              {formData.prescriptions && formData.prescriptions.length > 0 && (
                <div className="mt-2 space-y-2">
                  {formData.prescriptions.map((prescription, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-2 bg-yellow-50 border border-yellow-200 rounded-lg"
                    >
                      <span className="text-sm text-gray-900">{prescription}</span>
                      <button
                        type="button"
                        onClick={() => removePrescription(prescription)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Prochain rendez-vous (optionnel)
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="date"
                  name="nextVisit"
                  value={formData.nextVisit || ''}
                  onChange={handleChange}
                  min={formData.date}
                  className="pl-10 w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
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
              {treatment ? 'Mettre à jour' : 'Enregistrer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

