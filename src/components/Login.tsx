import { useState } from 'react';
import { User, UserRole } from '../types';
import { User as UserIcon, Stethoscope, UserCog, Mail, Lock, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { authService } from '../services/api/authService';
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
  const [isSubmitting, setIsSubmitting] = useState(false);

  const roles: { value: UserRole; label: string; icon: typeof UserIcon; description: string; color: string; hoverColor: string }[] = [
    {
      value: 'patient',
      label: 'Patient',
      icon: UserIcon,
      description: 'Accédez à vos rendez-vous et dossiers médicaux',
      color: 'bg-blue-50 text-blue-600',
      hoverColor: 'border-blue-500'
    },
    {
      value: 'docteur',
      label: 'Docteur',
      icon: Stethoscope,
      description: 'Gérez vos patients et rendez-vous',
      color: 'bg-green-50 text-green-600',
      hoverColor: 'border-green-500'
    },
    {
      value: 'personnelAdministratif',
      label: 'Admin',
      icon: UserCog,
      description: 'Administration du cabinet dentaire',
      color: 'bg-purple-50 text-purple-600',
      hoverColor: 'border-purple-500'
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

    const login = async () => {
      try {
        setIsSubmitting(true);
        const response = await authService.login(email, password);

        if (!response.success) {
          setError('Email ou mot de passe incorrect');
          return;
        }

        if (response.user.role !== selectedRole) {
          setError("Le type d'utilisateur sélectionné ne correspond pas à ce compte");
          return;
        }

        const user: User = {
          id: response.user.id,
          email: response.user.email,
          password: '',
          role: response.user.role as UserRole,
          firstName: response.user.firstName,
          lastName: response.user.lastName,
          patientId: response.user.patientId,
          staffId: response.user.staffId,
        };

        localStorage.setItem('token', response.token);
        localStorage.setItem('currentUser', JSON.stringify(user));

        onLogin(user);
      } catch (err: any) {
        const message = err?.response?.data?.message;
        setError(message || 'Email ou mot de passe incorrect');
      } finally {
        setIsSubmitting(false);
      }
    };

    login();
  };

  const handleRegister = (user: User) => {
    onLogin(user);
  };

  if (showRegister) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <PatientRegister onRegister={handleRegister} onBack={() => setShowRegister(false)} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white relative overflow-hidden flex flex-col">
      {/* Background blobs */}
      <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-[600px] h-[600px] bg-blue-50 rounded-full blur-3xl opacity-50 -z-0" />
      <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/4 w-[500px] h-[500px] bg-green-50 rounded-full blur-3xl opacity-50 -z-0" />

      {/* Navigation Simili */}
      <nav className="relative z-10 w-full bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-md">
              <Stethoscope className="text-white" size={18} />
            </div>
            <span className="text-lg font-bold text-gray-900">DentalCare</span>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="text-sm font-medium text-gray-500 hover:text-blue-600 transition-colors flex items-center gap-1"
          >
            <ArrowLeft size={16} /> Retour à l'accueil
          </button>
        </div>
      </nav>

      <main className="relative z-10 flex-1 flex items-center justify-center p-4 py-12">
        <div className="w-full max-w-xl">
          <div className="bg-white rounded-[2rem] shadow-2xl shadow-blue-100/50 border border-gray-100 overflow-hidden">
            {!selectedRole ? (
              <div className="p-8 md:p-12">
                <div className="text-center mb-10">
                  <h1 className="text-3xl font-bold text-gray-900 mb-3">Ravie de vous revoir</h1>
                  <p className="text-gray-500">Sélectionnez votre profil pour vous connecter</p>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  {roles.map((role) => {
                    const Icon = role.icon;
                    return (
                      <button
                        key={role.value}
                        onClick={() => handleRoleSelect(role.value)}
                        className={`group flex items-center gap-6 p-6 border-2 border-gray-50 rounded-2xl hover:${role.hoverColor} hover:bg-gray-50 transition-all duration-300 text-left`}
                      >
                        <div className={`${role.color} w-14 h-14 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                          <Icon size={24} />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-bold text-gray-900">{role.label}</h3>
                          <p className="text-sm text-gray-500">{role.description}</p>
                        </div>
                        <div className="text-gray-300 group-hover:text-blue-500 group-hover:translate-x-1 transition-all">
                          <ArrowLeft className="rotate-180" size={20} />
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="p-8 md:p-12">
                <button
                  onClick={() => {
                    setSelectedRole(null);
                    setError('');
                  }}
                  className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700 mb-8 p-2 rounded-lg hover:bg-blue-50 transition-all"
                >
                  <ArrowLeft size={16} /> Changer de profil
                </button>

                <div className="flex items-center gap-4 mb-8">
                  {(() => {
                    const roleInfo = roles.find(r => r.value === selectedRole);
                    const Icon = roleInfo?.icon || UserIcon;
                    return (
                      <div className={`${roleInfo?.color || 'bg-gray-500'} w-14 h-14 rounded-2xl flex items-center justify-center`}>
                        <Icon size={24} />
                      </div>
                    );
                  })()}
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      Accès {roles.find(r => r.value === selectedRole)?.label}
                    </h2>
                    <p className="text-sm text-gray-500">Entrez vos identifiants ci-dessous</p>
                  </div>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                  {error && (
                    <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-xl text-sm font-medium animate-shake">
                      {error}
                    </div>
                  )}

                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-bold text-gray-700 ml-1">
                      Email professionnel
                    </label>
                    <div className="relative group">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" size={20} />
                      <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="nom@exemple.com"
                        className="w-full pl-12 pr-4 py-4 bg-gray-50 border-transparent focus:bg-white border-2 focus:border-blue-500 rounded-2xl transition-all outline-none"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="password" className="text-sm font-bold text-gray-700 ml-1">
                      Mot de passe
                    </label>
                    <div className="relative group">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" size={20} />
                      <input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full pl-12 pr-12 py-4 bg-gray-50 border-transparent focus:bg-white border-2 focus:border-blue-500 rounded-2xl transition-all outline-none"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-600 transition-colors"
                      >
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold text-lg hover:bg-blue-700 transition-all shadow-xl shadow-blue-200 active:scale-[0.98] disabled:opacity-70 flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      'Se connecter'
                    )}
                  </button>

                  {selectedRole === 'patient' && (
                    <div className="text-center pt-2">
                      <p className="text-gray-500 text-sm">
                        Nouveau chez DentalCare ?{' '}
                        <button
                          type="button"
                          onClick={() => setShowRegister(true)}
                          className="text-blue-600 hover:text-blue-700 font-bold hover:underline"
                        >
                          Créer un compte
                        </button>
                      </p>
                    </div>
                  )}
                </form>
              </div>
            )}
          </div>

          <p className="text-center mt-8 text-gray-400 text-sm">
            &copy; 2024 DentalCare System. Sécurisé par cryptage SSL.
          </p>
        </div>
      </main>

      <style dangerouslySetInnerHTML={{
        __html: `
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        .animate-shake { animation: shake 0.2s ease-in-out 0s 2; }
      ` }} />
    </div>
  );
}


