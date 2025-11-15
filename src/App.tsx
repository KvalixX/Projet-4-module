import { useState, useEffect } from 'react';
import { User } from './types';
import Login from './components/Login';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import PatientList from './components/PatientList';
import AppointmentCalendar from './components/AppointmentCalendar';
import TreatmentHistory from './components/TreatmentHistory';
import StaffManagement from './components/StaffManagement';
import RemindersView from './components/RemindersView';
import PatientView from './components/PatientView';

function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentPage, setCurrentPage] = useState('dashboard');

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    setCurrentPage('dashboard');
  };

  const handleLogout = () => {
    setCurrentUser(null);
  };

  // Rediriger le personnel administratif s'il essaie d'accéder à des pages non autorisées
  // IMPORTANT: Tous les Hooks doivent être appelés avant tout return conditionnel
  useEffect(() => {
    if (currentUser && currentUser.role === 'personnelAdministratif' && (currentPage === 'treatments' || currentPage === 'staff')) {
      setCurrentPage('dashboard');
    }
  }, [currentUser, currentPage]);

  // Si l'utilisateur n'est pas connecté, afficher la page de login
  if (!currentUser) {
    return <Login onLogin={handleLogin} />;
  }

  // Si l'utilisateur est un patient, afficher la vue patient
  if (currentUser.role === 'patient') {
    return <PatientView user={currentUser} onLogout={handleLogout} />;
  }

  // Pour les docteurs et le personnel administratif, afficher l'interface complète
  // Le personnel administratif a accès à :
  // - Gestion des patients (patients)
  // - Gestion des rendez-vous (appointments)
  // - Notifications/Rappels (reminders)
  // Le personnel administratif N'A PAS accès à :
  // - Traitements (treatments)
  // - Personnel (staff)

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'patients':
        return <PatientList />;
      case 'appointments':
        return <AppointmentCalendar />;
      case 'treatments':
        // Seuls les docteurs peuvent accéder aux traitements
        if (currentUser.role === 'personnelAdministratif') {
          return <Dashboard />;
        }
        return <TreatmentHistory />;
      case 'staff':
        // Seuls les docteurs peuvent accéder à la gestion du personnel
        if (currentUser.role === 'personnelAdministratif') {
          return <Dashboard />;
        }
        return <StaffManagement />;
      case 'reminders':
        return <RemindersView />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <Layout currentPage={currentPage} onNavigate={setCurrentPage} user={currentUser} onLogout={handleLogout}>
      {renderPage()}
    </Layout>
  );
}

export default App;
