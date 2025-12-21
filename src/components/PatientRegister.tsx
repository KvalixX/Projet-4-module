import { useState } from 'react';
import { User } from '../types';
import { User as UserIcon, Mail, Lock, Eye, EyeOff, Phone, Calendar, MapPin, ArrowLeft } from 'lucide-react';
import { authService } from '../services/api/authService';

interface PatientRegisterProps {
  onRegister: (user: User) => void;
  onBack: () => void;
}

export default function PatientRegister({ onRegister, onBack }: PatientRegisterProps) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    phone: '',
    email: '',
    address: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.firstName.trim()) newErrors.firstName = 'Le prénom est requis';
    if (!formData.lastName.trim()) newErrors.lastName = 'Le nom est requis';
    if (!formData.dateOfBirth) newErrors.dateOfBirth = 'La date de naissance est requise';
    if (!formData.phone.trim()) newErrors.phone = 'Le téléphone est requis';
    if (!formData.email.trim()) {
      newErrors.email = 'L\'email est requis';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email invalide';
    }
    if (!formData.password) {
      newErrors.password = 'Le mot de passe est requis';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Le mot de passe doit contenir au moins 6 caractères';
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Les mots de passe ne correspondent pas';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await authService.register({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
        password_confirmation: formData.confirmPassword,
        dateOfBirth: formData.dateOfBirth,
        phone: formData.phone,
        address: formData.address,
      });

      if (!response.success) {
        setErrors({ submit: 'Une erreur est survenue lors de l\'inscription. Veuillez réessayer.' });
        return;
      }

      const user: User = {
        id: response.user.id,
        email: response.user.email,
        password: '',
        role: 'patient',
        firstName: response.user.firstName,
        lastName: response.user.lastName,
        patientId: response.user.patientId,
      };

      localStorage.setItem('token', response.token);
      localStorage.setItem('currentUser', JSON.stringify(user));

      onRegister(user);
    } catch (error) {
      setErrors({ submit: 'Une erreur est survenue lors de l\'inscription. Veuillez réessayer.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  return (
    <div className="w-full max-w-3xl bg-white rounded-[2rem] shadow-2xl shadow-blue-100/50 border border-gray-100 overflow-hidden">
      <div className="p-8 md:p-12">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700 mb-8 p-2 rounded-lg hover:bg-blue-50 transition-all"
        >
          <ArrowLeft size={16} /> Retour à la connexion
        </button>

        <div className="flex items-center gap-4 mb-10">
          <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-200">
            <UserIcon className="text-white" size={28} />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Créer mon compte</h1>
            <p className="text-gray-500">Rejoignez DentalCare pour gérer vos rendez-vous</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {errors.submit && (
            <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-xl text-sm font-medium animate-shake">
              {errors.submit}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            {/* Prénom */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 ml-1">Prénom</label>
              <div className="relative group">
                <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" size={20} />
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className={`w-full pl-12 pr-4 py-3.5 bg-gray-50 border-transparent focus:bg-white border-2 rounded-2xl transition-all outline-none ${errors.firstName ? 'border-red-500' : 'focus:border-blue-500'}`}
                  placeholder="Jean"
                  required
                />
              </div>
              {errors.firstName && <p className="text-xs text-red-500 ml-1">{errors.firstName}</p>}
            </div>

            {/* Nom */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 ml-1">Nom</label>
              <div className="relative group">
                <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" size={20} />
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className={`w-full pl-12 pr-4 py-3.5 bg-gray-50 border-transparent focus:bg-white border-2 rounded-2xl transition-all outline-none ${errors.lastName ? 'border-red-500' : 'focus:border-blue-500'}`}
                  placeholder="Dupont"
                  required
                />
              </div>
              {errors.lastName && <p className="text-xs text-red-500 ml-1">{errors.lastName}</p>}
            </div>

            {/* Date de naissance */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 ml-1">Date de naissance</label>
              <div className="relative group">
                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" size={20} />
                <input
                  type="date"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                  className={`w-full pl-12 pr-4 py-3.5 bg-gray-50 border-transparent focus:bg-white border-2 rounded-2xl transition-all outline-none ${errors.dateOfBirth ? 'border-red-500' : 'focus:border-blue-500'}`}
                  required
                />
              </div>
            </div>

            {/* Téléphone */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 ml-1">Téléphone</label>
              <div className="relative group">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" size={20} />
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className={`w-full pl-12 pr-4 py-3.5 bg-gray-50 border-transparent focus:bg-white border-2 rounded-2xl transition-all outline-none ${errors.phone ? 'border-red-500' : 'focus:border-blue-500'}`}
                  placeholder="06 12 34 56 78"
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 ml-1">Email</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" size={20} />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full pl-12 pr-4 py-3.5 bg-gray-50 border-transparent focus:bg-white border-2 rounded-2xl transition-all outline-none ${errors.email ? 'border-red-500' : 'focus:border-blue-500'}`}
                  placeholder="jean.dupont@exemple.com"
                  required
                />
              </div>
            </div>

            {/* Adresse */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 ml-1">Adresse (facultatif)</label>
              <div className="relative group">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" size={20} />
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border-transparent focus:bg-white border-2 focus:border-blue-500 rounded-2xl transition-all outline-none"
                  placeholder="123 Rue de la République"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 ml-1">Mot de passe</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" size={20} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`w-full pl-12 pr-12 py-3.5 bg-gray-50 border-transparent focus:bg-white border-2 rounded-2xl transition-all outline-none ${errors.password ? 'border-red-500' : 'focus:border-blue-500'}`}
                  placeholder="••••••••"
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
              {errors.password && <p className="text-xs text-red-500 ml-1">{errors.password}</p>}
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 ml-1">Confirmer le mot de passe</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" size={20} />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`w-full pl-12 pr-12 py-3.5 bg-gray-50 border-transparent focus:bg-white border-2 rounded-2xl transition-all outline-none ${errors.confirmPassword ? 'border-red-500' : 'focus:border-blue-500'}`}
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-600 transition-colors"
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.confirmPassword && <p className="text-xs text-red-500 ml-1">{errors.confirmPassword}</p>}
            </div>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold text-lg hover:bg-blue-700 transition-all shadow-xl shadow-blue-200 active:scale-[0.98] disabled:opacity-70 flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                'Créer mon compte patient'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

