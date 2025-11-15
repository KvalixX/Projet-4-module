import { useState, useEffect } from 'react';
import { Search, Plus, Edit2, Trash2, Eye, Phone, Mail } from 'lucide-react';
import { Patient } from '../types';
import { mockPatients } from '../data/mockData';
import { DataService } from '../services/dataService';
import PatientForm from './PatientForm';

export default function PatientList() {
  const [searchTerm, setSearchTerm] = useState('');
  const [patients, setPatients] = useState<Patient[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [patientToDelete, setPatientToDelete] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);

  // Charger les patients depuis le stockage local ou utiliser les données mockées
  useEffect(() => {
    if (DataService.getPatients().length === 0) {
      mockPatients.forEach(p => DataService.savePatient(p));
    }
    setPatients(DataService.getPatients());
  }, []);

  const filteredPatients = patients.filter(
    (patient) =>
      patient.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.phone.includes(searchTerm) ||
      patient.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Gestion de l'ajout d'un nouveau patient
  const handleAddPatient = () => {
    setSelectedPatient(null);
    setShowForm(true);
  };

  // Gestion de la modification d'un patient existant
  const handleEditPatient = (patient: Patient) => {
    setSelectedPatient(patient);
    setShowForm(true);
  };

  // Sauvegarde d'un patient (création ou mise à jour)
  const handleSavePatient = (patientData: Omit<Patient, 'id' | 'registrationDate'>) => {
    if (selectedPatient) {
      // Mise à jour d'un patient existant
      const updatedPatient: Patient = {
        ...patientData,
        id: selectedPatient.id,
        registrationDate: selectedPatient.registrationDate
      };
      DataService.savePatient(updatedPatient);
    } else {
      // Création d'un nouveau patient
      const newPatient: Patient = {
        ...patientData,
        id: `pat-${Date.now()}`,
        registrationDate: new Date().toISOString().split('T')[0]
      };
      DataService.savePatient(newPatient);
    }
    setPatients(DataService.getPatients());
    setShowForm(false);
  };

  // Confirmation de suppression d'un patient
  const confirmDelete = (patientId: string) => {
    setPatientToDelete(patientId);
    setShowDeleteConfirm(true);
  };

  // Suppression d'un patient
  const handleDeletePatient = () => {
    if (!patientToDelete) return;
    
    DataService.deletePatient(patientToDelete);
    setPatients(DataService.getPatients());
    setShowDeleteConfirm(false);
    setPatientToDelete(null);
  };

  // Formatage de la date au format français
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('fr-FR', options);
  };

  // Calcul de l'âge à partir de la date de naissance
  const calculateAge = (dateOfBirth: string) => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Gestion des Patients</h2>
        <p className="text-gray-600">Consultez et gérez les dossiers de vos patients</p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row gap-4 justify-between">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Rechercher un patient (nom, téléphone, email...)"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <button 
              onClick={handleAddPatient}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2 transition-colors"
            >
              <Plus size={20} />
              <span>Nouveau Patient</span>
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Patient
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Âge
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Groupe Sanguin
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Inscrit le
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredPatients.length > 0 ? (
                filteredPatients.map((patient) => (
                  <tr key={patient.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-semibold flex-shrink-0">
                          {patient.firstName[0]}{patient.lastName[0]}
                        </div>
                        <div className="ml-3">
                          <p className="text-sm font-medium text-gray-900">
                            {patient.firstName} {patient.lastName}
                          </p>
                          {patient.allergies && patient.allergies.length > 0 && (
                            <p className="text-xs text-red-600 truncate max-w-xs" title={patient.allergies.join(', ')}>
                              Allergies: {patient.allergies.join(', ')}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col">
                        <div className="flex items-center text-sm text-gray-900">
                          <Phone className="mr-2 h-4 w-4 text-gray-500" />
                          {patient.phone}
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <Mail className="mr-2 h-4 w-4 text-gray-400" />
                          <span className="truncate max-w-xs">{patient.email}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {calculateAge(patient.dateOfBirth)} ans
                      </div>
                      <div className="text-sm text-gray-500">
                        {new Date(patient.dateOfBirth).toLocaleDateString('fr-FR')}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        patient.bloodType ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {patient.bloodType || 'Non renseigné'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(patient.registrationDate)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => {
                            setSelectedPatient(patient);
                            setShowModal(true);
                          }}
                          className="text-blue-600 hover:text-blue-900"
                          title="Voir détails"
                        >
                          <Eye size={18} />
                        </button>
                        <button
                          onClick={() => handleEditPatient(patient)}
                          className="text-blue-600 hover:text-blue-900"
                          title="Modifier"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button
                          onClick={() => confirmDelete(patient.id)}
                          className="text-red-600 hover:text-red-900"
                          title="Supprimer"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">
                    Aucun patient trouvé
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Formulaire d'ajout/édition de patient */}
      {showForm && (
        <PatientForm
          patient={selectedPatient}
          onSave={handleSavePatient}
          onCancel={() => setShowForm(false)}
        />
      )}

      {/* Modale de confirmation de suppression */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-100 mx-auto mb-4">
                <Trash2 className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 text-center mb-2">
                Supprimer le patient
              </h3>
              <p className="text-gray-600 text-sm text-center mb-6">
                Êtes-vous sûr de vouloir supprimer ce patient ? Cette action est irréversible.
              </p>
              <div className="flex justify-center space-x-4">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Annuler
                </button>
                <button
                  onClick={handleDeletePatient}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Supprimer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modale de détails du patient */}
      {showModal && selectedPatient && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">
                    {selectedPatient.firstName} {selectedPatient.lastName}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">Dossier Patient</p>
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
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Informations Personnelles</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Date de naissance</p>
                    <p className="text-sm font-medium text-gray-900">
                      {new Date(selectedPatient.dateOfBirth).toLocaleDateString('fr-FR')}
                      <span className="text-gray-600"> ({calculateAge(selectedPatient.dateOfBirth)} ans)</span>
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Groupe sanguin</p>
                    <p className="text-sm font-medium text-gray-900">
                      {selectedPatient.bloodType || 'Non renseigné'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Téléphone</p>
                    <p className="text-sm font-medium text-gray-900">{selectedPatient.phone}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="text-sm font-medium text-gray-900">{selectedPatient.email}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-sm text-gray-500">Adresse</p>
                    <p className="text-sm font-medium text-gray-900">{selectedPatient.address}</p>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Informations Médicales</h4>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-500">Allergies</p>
                    {selectedPatient.allergies && selectedPatient.allergies.length > 0 ? (
                      <div className="flex flex-wrap gap-2 mt-1">
                        {selectedPatient.allergies.map((allergy, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-red-100 text-red-700 text-sm rounded-full"
                          >
                            {allergy}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm font-medium text-gray-900">Aucune allergie connue</p>
                    )}
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Antécédents médicaux</p>
                    <p className="text-sm font-medium text-gray-900 whitespace-pre-line">
                      {selectedPatient.medicalHistory || 'Aucun antécédent'}
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-500">Date d'inscription</p>
                <p className="text-sm font-medium text-gray-900">
                  {formatDate(selectedPatient.registrationDate)}
                </p>
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
    </div>
  );
}
