import { useState } from 'react';
import { User, UserRole } from '../types';
import { User as UserIcon, Stethoscope, UserCog, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { DataService } from '../services/dataService';
import PatientRegister from './PatientRegister';

interface LoginProps {
  onLogin: (user: User) => void;
}

export default function Login({ onLogin }: LoginProps) {
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [showRegister, setShowRegister] = useState(false);

  const roles: { value: UserRole; label: string; icon: typeof UserIcon; description: string; color: string }[] = [
    {
      value: 'patient',
      label: 'Patient',
      icon: UserIcon,
      description: 'Accédez à vos rendez-vous et dossiers médicaux',
      color: 'bg-blue-500'
    },
    {
      value: 'docteur',
      label: 'Docteur',
      icon: Stethoscope,
      description: 'Gérez vos patients et rendez-vous',
      color: 'bg-green-500'
    },
    {
      value: 'personnelAdministratif',
      label: 'Personnel Administratif',
      icon: UserCog,
      description: 'Gestion complète du cabinet dentaire',
      color: 'bg-purple-500'
    }
  ];

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    setError('');
    setEmail('');
    setPassword('');
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!selectedRole) {
      setError('Veuillez sélectionner un type d\'utilisateur');
      return;
    }

    if (!email || !password) {
      setError('Veuillez remplir tous les champs');
      return;
    }

    // Vérifier si c'est un patient qui essaie de se connecter
    if (selectedRole === 'patient') {
      const user = DataService.getUserByEmail(email);
      if (user && user.role === 'patient') {
        // Vérifier le mot de passe (en production, il faudrait comparer avec un hash)
        if (user.password === password) {
          onLogin(user);
          return;
        } else {
          setError('Email ou mot de passe incorrect');
          return;
        }
      } else {
        setError('Aucun compte trouvé avec cet email. Veuillez créer un compte.');
        return;
      }
    }

    // Pour les docteurs et le personnel administratif, simulation d'authentification
    const mockUser: User = {
      id: `user-${Date.now()}`,
      email,
      password,
      role: selectedRole,
      firstName: selectedRole === 'docteur' ? 'Dr. Karim' : 'Samira',
      lastName: selectedRole === 'docteur' ? 'Benslimane' : 'Fassi',
      staffId: selectedRole === 'docteur' ? 's1' : 's4'
    };

    onLogin(mockUser);
  };

  const handleRegister = (user: User) => {
    onLogin(user);
  };

  if (showRegister) {
    return <PatientRegister onRegister={handleRegister} onBack={() => setShowRegister(false)} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-600 rounded-2xl mb-4 shadow-lg">
            <Stethoscope className="text-white" size={40} />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Cabinet Dentaire</h1>
          <p className="text-gray-600">Connectez-vous pour accéder à votre espace</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {!selectedRole ? (
            <div className="p-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6 text-center">
                Sélectionnez votre profil
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {roles.map((role) => {
                  const Icon = role.icon;
                  return (
                    <button
                      key={role.value}
                      onClick={() => handleRoleSelect(role.value)}
                      className="group relative p-6 border-2 border-gray-200 rounded-xl hover:border-blue-500 hover:shadow-lg transition-all duration-300 text-left"
                    >
                      <div className={`${role.color} w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                        <Icon className="text-white" size={24} />
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">{role.label}</h3>
                      <p className="text-sm text-gray-600">{role.description}</p>
                      <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="p-8">
              <button
                onClick={() => {
                  setSelectedRole(null);
                  setError('');
                }}
                className="text-gray-600 hover:text-gray-900 mb-6 flex items-center gap-2"
              >
                <span>←</span> Retour au choix du profil
              </button>

              <div className="max-w-md mx-auto">
                <div className="flex items-center justify-center mb-6">
                  {(() => {
                    const roleInfo = roles.find(r => r.value === selectedRole);
                    const Icon = roleInfo?.icon || UserIcon;
                    return (
                      <div className={`${roleInfo?.color || 'bg-gray-500'} w-16 h-16 rounded-xl flex items-center justify-center`}>
                        <Icon className="text-white" size={32} />
                      </div>
                    );
                  })()}
                </div>

                <h2 className="text-2xl font-semibold text-gray-900 mb-2 text-center">
                  Connexion - {roles.find(r => r.value === selectedRole)?.label}
                </h2>
                <p className="text-gray-600 text-center mb-8">
                  {roles.find(r => r.value === selectedRole)?.description}
                </p>

                <form onSubmit={handleLogin} className="space-y-6">
                  {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                      {error}
                    </div>
                  )}

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                      <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="votre.email@example.com"
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                      Mot de passe
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                      <input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl"
                  >
                    Se connecter
                  </button>

                  {selectedRole === 'patient' && (
                    <p className="text-sm text-gray-500 text-center">
                      Pas encore de compte ?{' '}
                      <button
                        type="button"
                        onClick={() => setShowRegister(true)}
                        className="text-blue-600 hover:text-blue-700 font-medium"
                      >
                        Créer un compte
                      </button>
                    </p>
                  )}
                  {selectedRole !== 'patient' && (
                    <p className="text-sm text-gray-500 text-center">
                      Pour la démo, utilisez n'importe quel email et mot de passe
                    </p>
                  )}
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

