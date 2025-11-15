import { useState, useEffect } from 'react';
import { Search, Plus, FileText, DollarSign, Calendar, Edit2, Trash2 } from 'lucide-react';
import { Treatment } from '../types';
import { DataService } from '../services/dataService';
import { mockTreatments } from '../data/mockData';
import TreatmentForm from './TreatmentForm';

export default function TreatmentHistory() {
  const [searchTerm, setSearchTerm] = useState('');
  const [treatments, setTreatments] = useState<Treatment[]>([]);
  const [selectedTreatment, setSelectedTreatment] = useState<Treatment | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [treatmentToDelete, setTreatmentToDelete] = useState<string | null>(null);

  useEffect(() => {
    if (DataService.getTreatments().length === 0) {
      mockTreatments.forEach(t => DataService.saveTreatment(t));
    }
    setTreatments(DataService.getTreatments());
  }, []);

  const filteredTreatments = treatments.filter(
    (treatment) =>
      treatment.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      treatment.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      treatment.dentistName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalRevenue = treatments.reduce((sum, treatment) => sum + treatment.cost, 0);
  const averageCost = treatments.length > 0 ? totalRevenue / treatments.length : 0;

  const handleSaveTreatment = (treatment: Treatment) => {
    DataService.saveTreatment(treatment);
    setTreatments(DataService.getTreatments());
    setShowForm(false);
    setSelectedTreatment(null);
  };

  const handleEditTreatment = (treatment: Treatment) => {
    setSelectedTreatment(treatment);
    setShowForm(true);
  };

  const handleDeleteTreatment = () => {
    if (!treatmentToDelete) return;
    DataService.deleteTreatment(treatmentToDelete);
    setTreatments(DataService.getTreatments());
    setShowDeleteConfirm(false);
    setTreatmentToDelete(null);
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Historique des Traitements</h2>
        <p className="text-gray-600">Consultez les traitements réalisés et leur suivi</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-500">Total Traitements</h3>
            <FileText className="text-blue-600" size={20} />
          </div>
          <p className="text-3xl font-bold text-gray-900">{treatments.length}</p>
          <p className="text-sm text-gray-600 mt-1">Enregistrés au total</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-500">Revenu Total</h3>
            <DollarSign className="text-green-600" size={20} />
          </div>
          <p className="text-3xl font-bold text-gray-900">{totalRevenue.toLocaleString()} DH</p>
          <p className="text-sm text-gray-600 mt-1">Tous les traitements</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-500">Coût Moyen</h3>
            <DollarSign className="text-orange-600" size={20} />
          </div>
          <p className="text-3xl font-bold text-gray-900">{Math.round(averageCost).toLocaleString()} DH</p>
          <p className="text-sm text-gray-600 mt-1">Par traitement</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row gap-4 justify-between">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Rechercher un traitement (patient, type, dentiste...)"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <button 
              onClick={() => {
                setSelectedTreatment(null);
                setShowForm(true);
              }}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2 transition-colors"
            >
              <Plus size={20} />
              <span>Nouveau Traitement</span>
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Patient
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type de Traitement
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Dent
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Dentiste
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Coût
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Prochain RDV
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredTreatments.map((treatment) => (
                <tr
                  key={treatment.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {new Date(treatment.date).toLocaleDateString('fr-FR')}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-semibold text-xs">
                        {treatment.patientName.split(' ').map(n => n[0]).join('')}
                      </div>
                      <span className="ml-2 text-sm font-medium text-gray-900">
                        {treatment.patientName}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                      {treatment.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {treatment.tooth || '-'}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {treatment.dentistName}
                  </td>
                  <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                    {treatment.cost.toLocaleString()} DH
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {treatment.nextVisit
                      ? new Date(treatment.nextVisit).toLocaleDateString('fr-FR')
                      : '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => {
                          setSelectedTreatment(treatment);
                          setShowModal(true);
                        }}
                        className="text-blue-600 hover:text-blue-900"
                        title="Voir détails"
                      >
                        <FileText size={18} />
                      </button>
                      <button
                        onClick={() => handleEditTreatment(treatment)}
                        className="text-blue-600 hover:text-blue-900"
                        title="Modifier"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button
                        onClick={() => {
                          setTreatmentToDelete(treatment.id);
                          setShowDeleteConfirm(true);
                        }}
                        className="text-red-600 hover:text-red-900"
                        title="Supprimer"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredTreatments.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">Aucun traitement trouvé</p>
          </div>
        )}
      </div>

      {showModal && selectedTreatment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Détails du Traitement</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    {new Date(selectedTreatment.date).toLocaleDateString('fr-FR', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Patient</p>
                  <p className="text-base font-semibold text-gray-900">
                    {selectedTreatment.patientName}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Dentiste</p>
                  <p className="text-base font-semibold text-gray-900">
                    {selectedTreatment.dentistName}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Type de traitement</p>
                  <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 text-sm font-medium rounded-full">
                    {selectedTreatment.type}
                  </span>
                </div>
                {selectedTreatment.tooth && (
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Dent traitée</p>
                    <p className="text-base font-semibold text-gray-900">
                      Dent #{selectedTreatment.tooth}
                    </p>
                  </div>
                )}
              </div>

              <div>
                <p className="text-sm text-gray-500 mb-2">Description</p>
                <p className="text-base text-gray-900 bg-gray-50 p-4 rounded-lg">
                  {selectedTreatment.description}
                </p>
              </div>

              {selectedTreatment.prescriptions && selectedTreatment.prescriptions.length > 0 && (
                <div>
                  <p className="text-sm text-gray-500 mb-2">Prescriptions</p>
                  <div className="space-y-2">
                    {selectedTreatment.prescriptions.map((prescription, index) => (
                      <div
                        key={index}
                        className="bg-yellow-50 border border-yellow-200 p-3 rounded-lg flex items-start gap-2"
                      >
                        <FileText className="text-yellow-600 mt-0.5" size={16} />
                        <p className="text-sm text-gray-900">{prescription}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-6">
                <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <DollarSign className="text-green-600" size={20} />
                    <p className="text-sm text-gray-600">Coût du traitement</p>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">
                    {selectedTreatment.cost.toLocaleString()} DH
                  </p>
                </div>

                {selectedTreatment.nextVisit && (
                  <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <Calendar className="text-blue-600" size={20} />
                      <p className="text-sm text-gray-600">Prochain rendez-vous</p>
                    </div>
                    <p className="text-base font-semibold text-gray-900">
                      {new Date(selectedTreatment.nextVisit).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 bg-gray-50">
              <button
                onClick={() => setShowModal(false)}
                className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Formulaire de traitement */}
      {showForm && (
        <TreatmentForm
          treatment={selectedTreatment || undefined}
          onSave={handleSaveTreatment}
          onCancel={() => {
            setShowForm(false);
            setSelectedTreatment(null);
          }}
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
                Supprimer le traitement
              </h3>
              <p className="text-gray-600 text-sm text-center mb-6">
                Êtes-vous sûr de vouloir supprimer ce traitement ? Cette action est irréversible.
              </p>
              <div className="flex justify-center space-x-4">
                <button
                  onClick={() => {
                    setShowDeleteConfirm(false);
                    setTreatmentToDelete(null);
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Annuler
                </button>
                <button
                  onClick={handleDeleteTreatment}
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
