'use client';

import type { LucideIcon } from 'lucide-react';
import {
  Brain,
  CalendarDays,
  CheckCircle2,
  ClipboardList,
  HeartPulse,
  Mail,
  MapPin,
  MessageSquare,
  Phone,
  RefreshCcw,
  ScanLine,
  ShieldCheck,
  SmilePlus,
  Sparkles,
  Star,
  Stethoscope,
  Timer
} from 'lucide-react';
import heroImage from '../../img/implant-dentaire-casablanca-jnane-californie-by-dr-salhi-badr-casablanca-.webp';

interface LandingPageProps {
  onEnter: () => void;
}

type FeatureCard = {
  title: string;
  description: string;
  icon: LucideIcon;
  tag?: string;
};

const features: FeatureCard[] = [
  {
    title: 'Gestion des patients',
    description: 'Dossiers complets, historiques de soins et documents centralisés.',
    icon: ClipboardList,
    tag: 'Workflow'
  },
  {
    title: 'Agenda intelligent',
    description: 'Planification assistée avec rappels automatisés pour limiter les absences.',
    icon: CalendarDays,
    tag: 'Opérations'
  },
  {
    title: 'Suivi clinique',
    description: 'Visualisation claire des plans de soins, radios, prescriptions et consentements.',
    icon: HeartPulse,
    tag: 'Clinique'
  },
  {
    title: 'Sécurité & conformité',
    description: 'Chiffrement, accès granulaire et audit trail certifiés RGPD.',
    icon: ShieldCheck,
    tag: 'Sécurité'
  }
];

const careHighlights: FeatureCard[] = [
  {
    title: 'Plateforme connectée',
    description: 'Portail patient & pro pour documents, paiements et messages sécurisés.',
    icon: Sparkles
  },
  {
    title: 'Équipe pluridisciplinaire',
    description: 'Orthodontistes, implantologues, omnipraticiens et hygiénistes dédiés.',
    icon: Stethoscope
  },
  {
    title: 'Suivi proactif',
    description: 'Scores de risque, rappels santé et coaching d’hygiène sur-mesure.',
    icon: MessageSquare
  }
];

const technologyStacks = [
  {
    title: 'Imagerie & diagnostics',
    description: 'Scanner 3D, radiologie cone beam, photographie calibrée et IA descriptive.',
    icon: ScanLine,
    items: ['CBCT 3D', 'Smile design numérique', 'Simulation AR']
  },
  {
    title: 'Fabrication numérique',
    description: 'Flux CFAO intégré, impressions chairside et aligners invisibles personnalisés.',
    icon: RefreshCcw,
    items: ['CFAO chairside', 'Guides chirurgicaux', 'Aligneurs premium']
  },
  {
    title: 'Pilotage data-driven',
    description: 'Tableaux de bord en temps réel sur la satisfaction, la production et la prévention.',
    icon: Brain,
    items: ['KPI en direct', 'Alertes qualité', 'Benchmark national']
  }
];

const workflowSteps = [
  {
    title: 'Diagnostic digital',
    description: 'Bilan photo, scanner 3D et questionnaire santé automatisé.',
    icon: ScanLine,
    metric: '45 min'
  },
  {
    title: 'Plan de traitement collaboratif',
    description: 'Visualisations 3D partagées et consentements digitaux en temps réel.',
    icon: SmilePlus,
    metric: 'J+2'
  },
  {
    title: 'Suivi immersif',
    description: 'Notifications, télésuivi et échanges sécurisés avec l’équipe.',
    icon: MessageSquare,
    metric: '100% en ligne'
  },
  {
    title: 'Optimisation continue',
    description: 'Revues trimestrielles et coaching personnalisé selon vos objectifs.',
    icon: Timer,
    metric: '4x / an'
  }
];

const faqs = [
  {
    question: 'Comment se déroule la première visite ?',
    answer:
      'Un coordinateur vous accompagne pour le bilan photo, l’analyse 3D et la création de votre espace sécurisé. Vous repartez avec un pré-diagnostic complet.'
  },
  {
    question: 'Puis-je accéder à mes documents en ligne ?',
    answer:
      'Oui, comptes-rendus, radios, devis et factures sont disponibles 24/7 dans votre portail, avec notifications dès qu’un nouvel élément est publié.'
  },
  {
    question: 'Proposez-vous des facilités de paiement ?',
    answer:
      'Nous mettons à disposition des plans de règlement flexibles et des partenariats bancaires pour les traitements longue durée.'
  }
];

const partners = ['Align Technology', '3Shape', 'Straumann', 'Philips Zoom', 'Carestream Dental'];

const stats = [
  { label: 'Patients suivis', value: '3 500+' },
  { label: 'Professionnels', value: '12' },
  { label: 'Années d\'expérience', value: '15' }
];

const contactInfos = [
  {
    label: 'Adresse',
    value: '25 Rue des Capucines, 75002 Paris',
    icon: MapPin
  },
  {
    label: 'Téléphone',
    value: '01 86 95 24 30',
    icon: Phone
  },
  {
    label: 'Email',
    value: 'contact@cabinet-horizon.fr',
    icon: Mail
  }
];

export default function LandingPage({ onEnter }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 text-gray-900 font-sans">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur sticky top-0 z-20 border-b border-blue-100">
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-lg shadow-lg">
              CH
            </div>
            <div>
              <p className="font-semibold text-lg">Cabinet Horizon</p>
              <p className="text-xs text-gray-500">Excellence dentaire</p>
            </div>
          </div>
          <div className="hidden sm:flex gap-8 text-sm font-medium">
            <a href="#services" className="hover:text-blue-600 transition-colors">Services</a>
            <a href="#approche" className="hover:text-blue-600 transition-colors">Approche</a>
            <a href="#contact" className="hover:text-blue-600 transition-colors">Contact</a>
          </div>
          <button
            onClick={onEnter}
            className="px-6 py-2.5 rounded-full bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-colors shadow-lg"
          >
            Accéder
          </button>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="max-w-7xl mx-auto px-6 py-20 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <p className="text-xs tracking-widest uppercase font-semibold text-blue-600">
                  Cabinet dentaire nouvelle génération
                </p>
                <h1 className="text-5xl lg:text-6xl font-bold leading-tight text-gray-900">
                  Des soins d'excellence, amplifiés par la technologie.
                </h1>
              </div>
              
              <p className="text-lg text-gray-600 leading-relaxed max-w-lg">
                Nous combinons expertise médicale, protocoles de prévention avancés et plateforme numérique sécurisée pour offrir une expérience patient incomparable.
              </p>

              <div className="flex flex-wrap gap-4">
                <button
                  onClick={onEnter}
                  className="px-8 py-4 rounded-full bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl"
                >
                  Prendre rendez-vous
                </button>
                <a
                  href="#services"
                  className="px-8 py-4 rounded-full border-2 border-blue-600 text-blue-600 font-semibold hover:bg-blue-50 transition-colors"
                >
                  En savoir plus
                </a>
              </div>

              {/* Stats */}
              <div className="pt-8 grid grid-cols-3 gap-6">
                {stats.map((stat) => (
                  <div key={stat.label}>
                    <p className="text-3xl font-bold text-blue-600">{stat.value}</p>
                    <p className="text-xs text-gray-500 uppercase tracking-wide mt-1">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Visual Right */}
            <div className="relative">
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-blue-400/20 via-transparent to-transparent blur-3xl" />
              <div className="relative rounded-3xl border border-blue-200 overflow-hidden shadow-xl">
                <img
                  src={heroImage}
                  alt="Innovation dentaire Cabinet Horizon"
                  className="w-full h-full object-cover aspect-square"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-blue-900/60 via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 bg-white/85 backdrop-blur rounded-2xl p-6 shadow-lg">
                  <p className="text-xs uppercase tracking-[0.3em] text-blue-500 font-semibold">Technologies</p>
                  <p className="text-2xl font-bold text-gray-900 mt-2">Imagerie 3D & CFAO</p>
                  <p className="text-sm text-gray-600 mt-1">Lasers dentaires, aligners invisibles, diagnostics assistés.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Trusted Partners */}
        <section className="border-y border-blue-100 bg-blue-50/70">
          <div className="max-w-7xl mx-auto px-6 py-10 flex flex-wrap items-center justify-center gap-8 text-xs uppercase tracking-[0.3em] text-gray-500">
            {partners.map((partner) => (
              <span key={partner} className="font-semibold text-center opacity-80">
                {partner}
              </span>
            ))}
          </div>
        </section>

        {/* Features Section */}
        <section id="services" className="bg-green-50 py-20 lg:py-28">
          <div className="max-w-7xl mx-auto px-6 space-y-12">
            <div className="space-y-4 max-w-2xl">
              <p className="text-xs tracking-widest uppercase font-semibold text-blue-600">Nos expertises</p>
              <h2 className="text-4xl lg:text-5xl font-bold">Un cabinet pluridisciplinaire</h2>
              <p className="text-lg text-gray-600">
                De l'orthodontie à l'implantologie, nos spécialistes conçoivent des plans de traitement intégrés.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-8">
              {features.map((feature) => (
                <div
                  key={feature.title}
                  className="group bg-white rounded-3xl border border-gray-200 p-8 hover:-translate-y-1 hover:border-blue-200 hover:shadow-2xl hover:shadow-blue-100 transition-all duration-300"
                >
                  {feature.tag && (
                    <span className="inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 mb-6">
                      {feature.tag}
                    </span>
                  )}
                  <div className="h-12 w-12 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center mb-6">
                    <feature.icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-2xl font-bold mb-3">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                </div>
              ))}
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {careHighlights.map((highlight) => (
                <div key={highlight.title} className="bg-white rounded-3xl border border-gray-200 p-6 flex gap-4 shadow-sm">
                  <div className="h-12 w-12 rounded-2xl bg-green-100 text-blue-600 flex items-center justify-center flex-shrink-0">
                    <highlight.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-lg font-semibold">{highlight.title}</p>
                    <p className="text-sm text-gray-600 leading-relaxed">{highlight.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Approach Section */}
        <section id="approche" className="max-w-7xl mx-auto px-6 py-20 lg:py-28">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <p className="text-xs tracking-widest uppercase font-semibold text-blue-600">Notre approche</p>
                <h2 className="text-4xl lg:text-5xl font-bold">Humain + Digital</h2>
              </div>
              
              <p className="text-lg text-gray-600 leading-relaxed">
                Nous combinons expertise médicale, protocoles de prévention et outils numériques pour offrir une expérience fluide, de la première consultation jusqu'au suivi long terme.
              </p>

              <ul className="space-y-4 text-gray-600">
                {[
                  'Parcours patient totalement digitalisé',
                  'Communication proactive entre équipes',
                  'Sécurisation RGPD des données médicales'
                ].map((item) => (
                  <li key={item} className="flex gap-3 items-start">
                    <CheckCircle2 className="h-5 w-5 text-blue-600 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Testimonial */}
            <div className="bg-white rounded-3xl border border-gray-200 p-10 space-y-6 shadow-xl">
              <div className="flex gap-1 text-blue-500">
                {Array.from({ length: 5 }, (_, index) => (
                  <Star key={index} className="h-5 w-5 fill-blue-500 text-blue-500" />
                ))}
              </div>
              <blockquote className="text-2xl font-bold leading-relaxed">
                « Enfin un cabinet où l'on se sent accompagné. Les rappels automatiques, les comptes-rendus et la disponibilité de l'équipe changent tout. »
              </blockquote>
              <div>
                <p className="font-semibold">Chloé Martel</p>
                <p className="text-sm text-gray-500">Patiente Invisalign</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section id="contact" className="bg-blue-600 text-white py-20 lg:py-28">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div className="space-y-8">
                <div className="space-y-4">
                  <p className="text-xs tracking-widest uppercase font-semibold opacity-90">Contact</p>
                  <h2 className="text-4xl lg:text-5xl font-bold">Prêt à nous rejoindre ?</h2>
                </div>
                <p className="text-lg opacity-90 leading-relaxed">
                  Accédez à notre plateforme sécurisée pour suivre vos dossiers, planifier vos rendez-vous et rester en contact avec notre équipe.
                </p>
                <div className="space-y-3 text-sm">
                  {contactInfos.map((info) => (
                    <div key={info.label} className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-full bg-white/15 flex items-center justify-center">
                        <info.icon className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-xs uppercase tracking-wide opacity-70">{info.label}</p>
                        <p className="font-medium">{info.value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur rounded-3xl border border-white/20 p-10 space-y-6">
                <div>
                  <p className="font-semibold text-lg">Espace patient & professionnel</p>
                  <p className="text-sm opacity-80">Accès sécurisé à votre plateforme</p>
                </div>
                <button
                  onClick={onEnter}
                  className="w-full py-4 rounded-full bg-white text-blue-600 font-semibold hover:bg-blue-50 transition-colors"
                >
                  Se connecter
                </button>
                <p className="text-xs opacity-75">
                  Accès réservé aux patients et professionnels du cabinet.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Technology Section */}
        <section className="max-w-7xl mx-auto px-6 py-20 lg:py-28">
          <div className="space-y-4 max-w-3xl">
            <p className="text-xs tracking-widest uppercase font-semibold text-blue-600">Technologie & innovation</p>
            <h2 className="text-4xl lg:text-5xl font-bold">Des protocoles guidés par la data</h2>
            <p className="text-lg text-gray-600">
              Nos équipes s'appuient sur une stack numérique dernier cri pour apporter précision, confort et transparence à chaque étape.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 mt-12">
            {technologyStacks.map((tech) => (
              <div
                key={tech.title}
                className="rounded-3xl border border-gray-200 bg-gradient-to-br from-white via-blue-50 to-green-50 p-8 flex flex-col gap-6 shadow-lg"
              >
                <div className="h-12 w-12 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center">
                  <tech.icon className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-2">{tech.title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{tech.description}</p>
                </div>
                <ul className="space-y-2 text-sm text-gray-600">
                  {tech.items.map((item) => (
                    <li key={item} className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-blue-500" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* Workflow Section */}
        <section className="bg-green-50 py-20 lg:py-28">
          <div className="max-w-7xl mx-auto px-6 space-y-12">
            <div className="space-y-4 max-w-2xl">
              <p className="text-xs tracking-widest uppercase font-semibold text-blue-600">Parcours patient</p>
              <h2 className="text-4xl lg:text-5xl font-bold">Un accompagnement en 4 temps forts</h2>
              <p className="text-lg text-gray-600">
                Chaque étape est orchestrée par une équipe dédiée, avec un coach patient pour maintenir le lien entre vos visites.
              </p>
            </div>

            <div className="grid lg:grid-cols-4 gap-6">
              {workflowSteps.map((step, index) => (
                <div
                  key={step.title}
                  className="relative rounded-3xl border border-gray-200 bg-white p-6 flex flex-col gap-4 shadow-sm"
                >
                  <div className="flex justify-between items-center">
                    <div className="h-12 w-12 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center">
                      <step.icon className="h-5 w-5" />
                    </div>
                    <span className="text-sm font-semibold text-gray-500">0{index + 1}</span>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wide text-blue-600 font-semibold">{step.metric}</p>
                    <h3 className="text-xl font-bold mt-2 mb-2">{step.title}</h3>
                    <p className="text-sm text-gray-600 leading-relaxed">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="max-w-5xl mx-auto px-6 py-20 lg:py-28">
          <div className="space-y-4">
            <p className="text-xs tracking-widest uppercase font-semibold text-blue-600">Questions fréquentes</p>
            <h2 className="text-4xl font-bold">Tout savoir avant de commencer</h2>
          </div>

          <div className="mt-10 space-y-6">
            {faqs.map((faq) => (
              <div key={faq.question} className="rounded-3xl border border-blue-100 p-6 bg-white shadow-sm">
                <p className="text-lg font-semibold mb-2">{faq.question}</p>
                <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-blue-100 bg-green-50/80 py-8">
        <div className="max-w-7xl mx-auto px-6 flex flex-wrap items-center justify-between gap-4 text-sm text-gray-600">
          <p>© {new Date().getFullYear()} Cabinet Dentaire Horizon. Tous droits réservés.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-gray-900 transition-colors">Mentions légales</a>
            <a href="#" className="hover:text-gray-900 transition-colors">Politique de confidentialité</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
