import { Stethoscope, Shield, Clock, Phone, ChevronRight, Menu, X, Users, MessageSquare, ArrowRight } from 'lucide-react';
import { useState } from 'react';

interface LandingPageProps {
    onEnter: () => void;
}

export default function LandingPage({ onEnter }: LandingPageProps) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const services = [
        {
            title: "Soins Préventifs",
            description: "Nettoyage, examens et conseils pour maintenir une hygiène bucco-dentaire parfaite.",
            icon: Shield,
            color: "bg-blue-50 text-blue-600"
        },
        {
            title: "Chirurgie Dentaire",
            description: "Interventions spécialisées avec les dernières technologies pour votre confort.",
            icon: Stethoscope,
            color: "bg-green-50 text-green-600"
        },
        {
            title: "Urgences 24/7",
            description: "Une équipe dédiée pour traiter vos douleurs et urgences dentaires sans attendre.",
            icon: Clock,
            color: "bg-purple-50 text-purple-600"
        }
    ];

    return (
        <div className="min-h-screen bg-white">
            {/* Navigation */}
            <nav className="fixed w-full z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16 items-center">
                        <div className="flex items-center gap-2">
                            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-200">
                                <Stethoscope className="text-white" size={24} />
                            </div>
                            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-800">
                                DentalCare
                            </span>
                        </div>

                        {/* Desktop Nav */}
                        <div className="hidden md:flex items-center gap-8">
                            <a href="#services" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">Services</a>
                            <a href="#about" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">À Propos</a>
                            <a href="#contact" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">Contact</a>
                            <button
                                onClick={onEnter}
                                className="bg-blue-600 text-white px-6 py-2 rounded-full font-semibold hover:bg-blue-700 transition-all shadow-md hover:shadow-lg active:scale-95"
                            >
                                Se connecter
                            </button>
                        </div>

                        {/* Mobile menu button */}
                        <div className="md:hidden">
                            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-gray-600 p-2">
                                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Nav */}
                {isMenuOpen && (
                    <div className="md:hidden bg-white border-b border-gray-100 p-4 space-y-4">
                        <a href="#services" className="block text-gray-600 hover:text-blue-600 font-medium py-2">Services</a>
                        <a href="#about" className="block text-gray-600 hover:text-blue-600 font-medium py-2">À Propos</a>
                        <a href="#contact" className="block text-gray-600 hover:text-blue-600 font-medium py-2">Contact</a>
                        <button
                            onClick={onEnter}
                            className="w-full bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-all"
                        >
                            Se connecter
                        </button>
                    </div>
                )}
            </nav>

            {/* Hero Section */}
            <section className="relative pt-24 pb-16 lg:pt-32 lg:pb-24 overflow-hidden">
                {/* Background blobs */}
                <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-[450px] h-[450px] bg-blue-50 rounded-full blur-3xl opacity-50 -z-10" />
                <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/4 w-[350px] h-[350px] bg-green-50 rounded-full blur-3xl opacity-50 -z-10" />

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <div className="space-y-6 text-center lg:text-left">
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 text-blue-700 text-sm font-semibold animate-fade-in">
                                <span className="flex h-2 w-2 rounded-full bg-blue-600 animate-pulse"></span>
                                Cabinet Dentaire Moderne
                            </div>
                            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
                                Retrouvez votre plus <br />
                                <span className="text-blue-600">beau sourire</span>
                            </h1>
                            <p className="text-lg text-gray-600 max-w-2xl mx-auto lg:mx-0">
                                Une équipe d'experts passionnés et des technologies de pointe pour prendre soin de votre santé bucco-dentaire au quotidien.
                            </p>
                        </div>

                        <div className="relative hidden lg:block">
                            <div className="relative z-10 w-full h-[450px] bg-gradient-to-br from-blue-100 to-blue-50 rounded-3xl overflow-hidden shadow-2xl">
                                <img
                                    src="/img/implant-dentaire-casablanca-jnane-californie-by-dr-salhi-badr-casablanca-.webp"
                                    alt="Cabinet Dentaire"
                                    className="w-full h-full object-cover"
                                />
                                {/* Overlaying Info Cards */}
                                <div className="absolute top-10 right-10 bg-white p-4 rounded-2xl shadow-xl animate-bounce-slow">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                                            <Shield className="text-green-600" size={20} />
                                        </div>
                                        <div>
                                            <div className="font-bold text-sm text-gray-900">Sûr & Certifié</div>
                                            <div className="text-xs text-gray-500">Normes ISO 2024</div>
                                        </div>
                                    </div>
                                </div>
                                <div className="absolute bottom-10 left-10 bg-white p-4 rounded-2xl shadow-xl animate-float">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                            <Users className="text-blue-600" size={20} />
                                        </div>
                                        <div>
                                            <div className="font-bold text-sm text-gray-900">Experts Qualifiés</div>
                                            <div className="text-xs text-gray-500">Équipe senior</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* Decorative circle */}
                            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-blue-600/10 rounded-full blur-2xl"></div>
                        </div>
                    </div>
                </div>
            </section >

            {/* Services Section */}
            < section id="services" className="py-24 bg-gray-50/50" >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
                        <h2 className="text-blue-600 font-bold uppercase tracking-wider">Nos Services</h2>
                        <h3 className="text-4xl font-bold text-gray-900">Une approche complète de la santé dentaire</h3>
                        <p className="text-gray-600 text-lg">Nous utilisons les dernières avancées médicales pour vous offrir des soins de qualité supérieure dans un environnement serein.</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {services.map((service, index) => (
                            <div
                                key={index}
                                className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 group"
                            >
                                <div className={`w-14 h-14 ${service.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                                    <service.icon size={28} />
                                </div>
                                <h4 className="text-xl font-bold text-gray-900 mb-4">{service.title}</h4>
                                <p className="text-gray-600 leading-relaxed mb-6">{service.description}</p>
                                <a href="#" className="flex items-center gap-2 text-blue-600 font-semibold group-hover:gap-3 transition-all">
                                    En savoir plus <ChevronRight size={18} />
                                </a>
                            </div>
                        ))}
                    </div>
                </div>
            </section >

            {/* Footer */}
            < footer className="bg-gray-900 text-white py-16" >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-4 gap-12">
                        <div className="space-y-6">
                            <div className="flex items-center gap-2">
                                <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
                                    <Stethoscope className="text-white" size={24} />
                                </div>
                                <span className="text-xl font-bold">DentalCare</span>
                            </div>
                            <p className="text-gray-400">Votre partenaire santé pour un sourire éclatant et durable.</p>
                        </div>
                        <div>
                            <h5 className="font-bold mb-6">Liens Rapides</h5>
                            <ul className="space-y-4 text-gray-400">
                                <li><a href="#" className="hover:text-blue-400">Accueil</a></li>
                                <li><a href="#" className="hover:text-blue-400">Nos Experts</a></li>
                                <li><a href="#" className="hover:text-blue-400">Témoignages</a></li>
                                <li><a href="#" className="hover:text-blue-400">Blog</a></li>
                            </ul>
                        </div>
                        <div>
                            <h5 className="font-bold mb-6">Horaires</h5>
                            <ul className="space-y-4 text-gray-400">
                                <li>Lun - Ven: 9h00 - 19h00</li>
                                <li>Samedi: 9h00 - 13h00</li>
                                <li>Dimanche: Fermé</li>
                            </ul>
                        </div>
                        <div>
                            <h5 className="font-bold mb-6">Contact</h5>
                            <ul className="space-y-4 text-gray-400">
                                <li className="flex items-center gap-2"><Phone size={16} /> 01 23 45 67 89</li>
                                <li className="flex items-center gap-2"><MessageSquare size={16} /> contact@dentalcare.fr</li>
                            </ul>
                        </div>
                    </div>
                    <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-500 text-sm">
                        © 2024 DentalCare. Tous droits réservés.
                    </div>
                </div>
            </footer >

            <style dangerouslySetInnerHTML={{
                __html: `
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .animate-float { animation: float 6s ease-in-out infinite; }
        .animate-bounce-slow { animation: bounce-slow 4s ease-in-out infinite; }
        .animate-fade-in { animation: fadeIn 1s ease-out; }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      ` }} />
        </div >
    );
}
