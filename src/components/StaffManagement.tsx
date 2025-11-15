import { useState, useEffect } from 'react';
import { Search, Plus, Mail, Phone, UserCog, Stethoscope, Users as UsersIcon, Edit2, Trash2 } from 'lucide-react';
import { Staff } from '../types';
import { DataService } from '../services/dataService';
import { mockStaff } from '../data/mockData';
import StaffForm from './StaffForm';

export default function StaffManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState<string>('all');
  const [staff, setStaff] = useState<Staff[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<Staff | undefined>();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [staffToDelete, setStaffToDelete] = useState<string | null>(null);

  useEffect(() => {
    if (DataService.getStaff().length === 0) {
      mockStaff.forEach(s => DataService.saveStaff(s));
    }
    setStaff(DataService.getStaff());
  }, []);

  const filteredStaff = staff.filter((staffMember) => {
    const matchesSearch =
      staffMember.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      staffMember.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      staffMember.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRole = filterRole === 'all' || staffMember.role === filterRole;

    return matchesSearch && matchesRole;
  });

  const handleSaveStaff = (staffMember: Staff) => {
    if (!staffMember.id) {
      staffMember.id = `staff-${Date.now()}`;
    }
    DataService.saveStaff(staffMember);
    setStaff(DataService.getStaff());
    setShowForm(false);
    setSelectedStaff(undefined);
  };

  const handleEditStaff = (staffMember: Staff) => {
    setSelectedStaff(staffMember);
    setShowForm(true);
  };

  const handleDeleteStaff = () => {
    if (!staffToDelete) return;
    DataService.deleteStaff(staffToDelete);
    setStaff(DataService.getStaff());
    setShowDeleteConfirm(false);
    setStaffToDelete(null);
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'dentist':
        return 'Dentiste';
      case 'assistant':
        return 'Assistant(e)';
      case 'receptionist':
        return 'Réceptionniste';
      case 'admin':
        return 'Administrateur';
      default:
        return role;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'dentist':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'assistant':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'receptionist':
        return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'admin':
        return 'bg-orange-100 text-orange-700 border-orange-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'dentist':
        return <Stethoscope size={20} />;
      case 'assistant':
        return <UsersIcon size={20} />;
      case 'receptionist':
        return <Phone size={20} />;
      case 'admin':
        return <UserCog size={20} />;
      default:
        return <UserCog size={20} />;
    }
  };

  const roleStats = {
    dentist: staff.filter((s) => s.role === 'dentist').length,
    assistant: staff.filter((s) => s.role === 'assistant').length,
    receptionist: staff.filter((s) => s.role === 'receptionist').length,
    admin: staff.filter((s) => s.role === 'admin').length
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Gestion du Personnel</h2>
        <p className="text-gray-600">Gérez votre équipe et leurs plannings</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Stethoscope className="text-blue-600" size={20} />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{roleStats.dentist}</p>
              <p className="text-xs text-gray-600">Dentistes</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <UsersIcon className="text-green-600" size={20} />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{roleStats.assistant}</p>
              <p className="text-xs text-gray-600">Assistants</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Phone className="text-purple-600" size={20} />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{roleStats.receptionist}</p>
              <p className="text-xs text-gray-600">Réceptionnistes</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-100 rounded-lg">
              <UserCog className="text-orange-600" size={20} />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{staff.length}</p>
              <p className="text-xs text-gray-600">Total Personnel</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row gap-4 justify-between mb-4">
            <div className="relative flex-1">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="text"
                placeholder="Rechercher un membre du personnel..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <button 
              onClick={() => {
                setSelectedStaff(undefined);
                setShowForm(true);
              }}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2 transition-colors"
            >
              <Plus size={20} />
              <span>Ajouter Personnel</span>
            </button>
          </div>

          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setFilterRole('all')}
              className={`px-3 py-1 rounded-full text-sm ${
                filterRole === 'all'
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Tous
            </button>
            <button
              onClick={() => setFilterRole('dentist')}
              className={`px-3 py-1 rounded-full text-sm ${
                filterRole === 'dentist'
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Dentistes
            </button>
            <button
              onClick={() => setFilterRole('assistant')}
              className={`px-3 py-1 rounded-full text-sm ${
                filterRole === 'assistant'
                  ? 'bg-green-100 text-green-700'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Assistants
            </button>
            <button
              onClick={() => setFilterRole('receptionist')}
              className={`px-3 py-1 rounded-full text-sm ${
                filterRole === 'receptionist'
                  ? 'bg-purple-100 text-purple-700'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Réceptionnistes
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
          {filteredStaff.map((staff) => (
            <div
              key={staff.id}
              className="border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-3">
                  <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-semibold text-lg">
                    {staff.firstName[0]}
                    {staff.lastName[0]}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {staff.firstName} {staff.lastName}
                    </h3>
                    {staff.specialty && (
                      <p className="text-sm text-gray-600">{staff.specialty}</p>
                    )}
                  </div>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium border flex items-center gap-1 ${getRoleColor(
                    staff.role
                  )}`}
                >
                  {getRoleIcon(staff.role)}
                  {getRoleLabel(staff.role)}
                </span>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Phone size={16} className="text-gray-400" />
                  {staff.phone}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Mail size={16} className="text-gray-400" />
                  {staff.email}
                </div>
              </div>

              {staff.schedule && staff.schedule.length > 0 && (
                <div>
                  <p className="text-xs font-medium text-gray-500 mb-2">Planning de travail:</p>
                  <div className="flex flex-wrap gap-1">
                    {staff.schedule.map((day, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded"
                      >
                        {day}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-4 pt-4 border-t border-gray-200 flex gap-2">
                <button
                  onClick={() => handleEditStaff(staff)}
                  className="flex-1 px-3 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors flex items-center justify-center gap-2 text-sm"
                >
                  <Edit2 size={16} />
                  Modifier
                </button>
                <button
                  onClick={() => {
                    setStaffToDelete(staff.id);
                    setShowDeleteConfirm(true);
                  }}
                  className="flex-1 px-3 py-2 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors flex items-center justify-center gap-2 text-sm"
                >
                  <Trash2 size={16} />
                  Supprimer
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredStaff.length === 0 && (
          <div className="text-center py-12">
            <UsersIcon className="mx-auto text-gray-300 mb-2" size={48} />
            <p className="text-gray-500">Aucun membre du personnel trouvé</p>
          </div>
        )}
      </div>

      {/* Formulaire de personnel */}
      {showForm && (
        <StaffForm
          staff={selectedStaff}
          onSave={handleSaveStaff}
          onCancel={() => {
            setShowForm(false);
            setSelectedStaff(undefined);
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
                Supprimer le membre du personnel
              </h3>
              <p className="text-gray-600 text-sm text-center mb-6">
                Êtes-vous sûr de vouloir supprimer ce membre du personnel ? Cette action est irréversible.
              </p>
              <div className="flex justify-center space-x-4">
                <button
                  onClick={() => {
                    setShowDeleteConfirm(false);
                    setStaffToDelete(null);
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Annuler
                </button>
                <button
                  onClick={handleDeleteStaff}
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
