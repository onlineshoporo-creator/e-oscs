"use client";

import React from "react";
import { FileText, Phone, KeyRound, Rocket } from "lucide-react";

const steps = [
  {
    number: "01",
    icon: <FileText className="h-7 w-7" />,
    title: "Faites une demande",
    description:
      "Remplissez le formulaire ci-dessous avec les informations de votre Direction.",
    color: "#F77F00",
  },
  {
    number: "02",
    icon: <Phone className="h-7 w-7" />,
    title: "Notre équipe vous contacte",
    description:
      "Nous vous appelons ou vous écrivons sur WhatsApp pour comprendre vos besoins.",
    color: "#FB923C",
  },
  {
    number: "03",
    icon: <KeyRound className="h-7 w-7" />,
    title: "Activation de votre espace",
    description:
      "Nous configurons votre espace et créons les comptes de vos collaborateurs.",
    color: "#009E60",
  },
  {
    number: "04",
    icon: <Rocket className="h-7 w-7" />,
    title: "Commencez !",
    description:
      "Formez votre équipe en quelques minutes et commencez à saisir vos activités.",
    color: "#0891B2",
  },
];

export function HowItWorksSection() {
  return (
    <section
      className="py-20 lg:py-28 bg-white"
      id="comment-ca-marche"
      aria-label="Comment ça marche"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* En-tête */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block px-4 py-1.5 bg-teal-100 text-teal-700 rounded-full text-sm font-medium mb-4">
            Processus
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-6">
            Comment ça{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#14B8A6] to-[#0891B2]">
              marche ?
            </span>
          </h2>
          <p className="text-lg text-slate-600">
            Un processus simple en 4 étapes pour passer de la demande à
            l&apos;utilisation.
          </p>
        </div>

        {/* Timeline des étapes */}
        <div className="relative max-w-4xl mx-auto">
          {/* Ligne verticale (desktop) */}
          <div className="hidden md:block absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary via-success to-cyan-500" />

          <div className="space-y-8 md:space-y-12">
            {steps.map((step, index) => (
              <div key={step.number} className="relative flex gap-6 md:gap-8">
                {/* Cercle numéroté */}
                <div className="relative z-10 shrink-0">
                  <div
                    className="w-16 h-16 rounded-full flex items-center justify-center shadow-lg border-4 border-white"
                    style={{ backgroundColor: step.color }}
                  >
                    {step.icon}
                  </div>
                  {/* Numéro */}
                  <span
                    className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-white shadow-md flex items-center justify-center text-xs font-bold"
                    style={{ color: step.color }}
                  >
                    {index + 1}
                  </span>
                </div>

                {/* Contenu */}
                <div className="flex-1 pt-2 pb-2">
                  <div className="bg-slate-50 rounded-xl p-6 border border-slate-100 hover:border-slate-200 hover:shadow-md transition-all">
                    <h3 className="font-bold text-lg text-slate-900 mb-2">
                      {step.title}
                    </h3>
                    <p className="text-slate-600 leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Note de réassurance */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center gap-3 px-6 py-3 bg-green-50 rounded-full border border-green-200">
            <svg
              className="w-5 h-5 text-success"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            <span className="text-sm font-medium text-success">
              Accompagnement personnalisé à chaque étape
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HowItWorksSection;
