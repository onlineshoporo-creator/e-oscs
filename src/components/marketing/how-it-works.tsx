"use client";

import React from "react";
import { FileText, Phone, CreditCard, KeyRound } from "lucide-react";

interface Step {
  number: number;
  icon: React.ReactNode;
  title: string;
  description: string;
}

/** Étapes de souscription e-OSCS */
const steps: Step[] = [
  {
    number: 1,
    icon: <FileText className="size-6" />,
    title: "Vous demandez un abonnement en ligne",
    description:
      "Remplissez le formulaire de demande avec les informations de votre Direction et la formule souhaitée.",
  },
  {
    number: 2,
    icon: <Phone className="size-6" />,
    title: "Nous vous contactons pour valider",
    description:
      "Notre équipe vous rejoint par appel ou WhatsApp pour confirmer votre besoin et répondre à vos questions.",
  },
  {
    number: 3,
    icon: <CreditCard className="size-6" />,
    title: "Paiement simple par Mobile Money",
    description:
      "Recevez les coordonnées de paiement et effectuez votre règlement via Orange Money, MTN ou Wave.",
  },
  {
    number: 4,
    icon: <KeyRound className="size-6" />,
    title: "Votre espace est activé sous 24h",
    description:
      "Recevez vos codes d'accès par SMS et email. Commencez immédiatement à utiliser la plateforme.",
  },
];

/**
 * HowItWorks - Composant des étapes numérotées de souscription
 */
export function HowItWorks() {
  return (
    <div className="w-full">
      {/* Grille des étapes */}
      <div className="grid md:grid-cols-4 gap-8 relative">
        {/* Ligne de connexion (desktop) */}
        <div className="hidden md:block absolute top-12 left-[12%] right-[12%] h-0.5 bg-gradient-to-r from-primary/30 via-success/50 to-primary/30" />

        {steps.map((step) => (
          <div key={step.number} className="flex flex-col items-center text-center relative">
            {/* Cercle numéroté */}
            <div className="relative z-10 mb-4">
              <div className="w-24 h-24 rounded-full bg-white border-2 border-primary flex items-center justify-center shadow-lg">
                <div className="text-primary">{step.icon}</div>
              </div>
              {/* Numéro */}
              <div className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-primary text-primary-foreground text-sm font-bold flex items-center justify-center shadow-md">
                {step.number}
              </div>
            </div>

            {/* Contenu */}
            <h3 className="font-semibold text-slate-900 mb-2 text-sm md:text-base">
              {step.title}
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
              {step.description}
            </p>
          </div>
        ))}
      </div>

      {/* Note importante */}
      <div className="mt-10 text-center">
        <p className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 text-success rounded-full text-sm font-medium">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="size-4"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
          Aucun paiement en ligne requis — tout se fait par Mobile Money après validation
        </p>
      </div>
    </div>
  );
}

export default HowItWorks;
