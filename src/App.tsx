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
import LandingPage from './components/LandingPage';

function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [showLanding, setShowLanding] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser) as User;
        setCurrentUser(parsed);
        setShowLanding(false);
      } catch {
        localStorage.removeItem('currentUser');
      }
    }
  }, []);

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    setCurrentPage('dashboard');
    setShowLanding(false);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setShowLanding(true);
    localStorage.removeItem('token');
    localStorage.removeItem('currentUser');
  };

  // Rediriger les docteurs s'ils essaient d'accéder à la gestion du personnel
  // IMPORTANT: Tous les Hooks doivent être appelés avant tout return conditionnel
  useEffect(() => {
    if (currentUser && currentUser.role === 'docteur' && currentPage === 'staff') {
      setCurrentPage('dashboard');
    }
  }, [currentUser, currentPage]);

  // Si l'utilisateur n'est pas connecté, afficher la landing page puis la page de login
  if (!currentUser) {
    if (showLanding) {
      return <LandingPage onEnter={() => setShowLanding(false)} />;
    }
    return <Login onLogin={handleLogin} />;
  }

  // Si l'utilisateur est un patient, afficher la vue patient
  if (currentUser.role === 'patient') {
    return <PatientView user={currentUser} onLogout={handleLogout} />;
  }

  // Pour les docteurs et le personnel administratif, afficher l'interface complète
  // L'administrateur (personnelAdministratif) a accès à TOUT :
  // - Gestion des patients (patients)
  // - Gestion des rendez-vous (appointments)
  // - Traitements (treatments)
  // - Personnel (staff)
  // - Notifications/Rappels (reminders)
  // Les docteurs ont accès à tout SAUF :
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
        return <TreatmentHistory />;
      case 'staff':
        // Seuls les admins peuvent accéder à la gestion du personnel
        if (currentUser.role === 'docteur') {
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
