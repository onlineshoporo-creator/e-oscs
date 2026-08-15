"use client";

import React from "react";
import { PenLine, CheckCircle2, BarChart3 } from "lucide-react";

const steps = [
  {
    number: "01",
    icon: <PenLine className="h-8 w-8" />,
    title: "Saisissez",
    description:
      "Entrez vos activités simplement avec notre interface intuitive. Ajoutez photos, bénéficiaires et résultats en quelques clics.",
    details: ["Formulaire guidé", "Saisie mobile", "Photos intégrées"],
    color: "#F77F00",
  },
  {
    number: "02",
    icon: <CheckCircle2 className="h-8 w-8" />,
    title: "Validez",
    description:
      "Votre responsable valide les activités soumises. Un workflow simple qui garantit la qualité des données.",
    details: ["Notification automatique", "Validation en 1 clic", "Historique complet"],
    color: "#009E60",
  },
  {
    number: "03",
    icon: <BarChart3 className="h-8 w-8" />,
    title: "Exploitez",
    description:
      "Générez vos rapports, consultez vos indicateurs et présentez vos résultats. Tout est automatique !",
    details: ["Rapports Word/PPT", "Tableau de bord live", "Export multi-formats"],
    color: "#7C3AED",
  },
];

export function SimplicitySection() {
  return (
    <section
      className="py-20 lg:py-28 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900"
      id="simplicite"
      aria-label="Simplicité d'utilisation"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* En-tête */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block px-4 py-1.5 bg-white/10 text-white/90 rounded-full text-sm font-medium mb-4">
            Facilité d&apos;utilisation
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
            Pas besoin d&apos;être{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-300 to-yellow-300">
              informaticien
            </span>
          </h2>
          <p className="text-lg text-slate-400">
            e-OSCS a été conçu pour être utilisé par tout le monde, sans
            formation technique préalable.
          </p>
        </div>

        {/* Étapes */}
        <div className="grid md:grid-cols-3 gap-8 relative">
          {/* Ligne de connexion (desktop) */}
          <div className="hidden md:block absolute top-24 left-[20%] right-[20%] h-0.5 bg-gradient-to-r from-primary via-success to-purple-500" />

          {steps.map((step, index) => (
            <div key={step.number} className="relative group">
              {/* Carte */}
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 hover:border-white/20 transition-all duration-300 hover:bg-white/10 h-full">
                {/* Numéro + Icon */}
                <div className="relative mb-6">
                  <div
                    className="w-20 h-20 rounded-2xl flex items-center justify-center shadow-xl transition-transform group-hover:scale-110"
                    style={{
                      backgroundColor: `${step.color}20`,
                      color: step.color,
                      border: `2px solid ${step.color}40`,
                    }}
                  >
                    {step.icon}
                  </div>
                  <span
                    className="absolute -top-3 -left-3 w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg"
                    style={{ backgroundColor: step.color }}
                  >
                    {step.number}
                  </span>
                </div>

                {/* Contenu */}
                <h3
                  className="text-2xl font-bold text-white mb-3"
                  style={{ color: step.color }}
                >
                  {step.title}
                </h3>
                <p className="text-slate-400 leading-relaxed mb-6">
                  {step.description}
                </p>

                {/* Détails */}
                <ul className="space-y-2">
                  {step.details.map((detail) => (
                    <li
                      key={detail}
                      className="flex items-center gap-2 text-sm text-slate-300"
                    >
                      <svg
                        className="w-4 h-4 shrink-0"
                        style={{ color: step.color }}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {detail}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Flèche (sauf le dernier) */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute -right-4 top-1/2 -translate-y-1/2 z-10">
                  <svg
                    width="32"
                    height="32"
                    viewBox="0 0 32 32"
                    fill="none"
                    className="text-slate-600"
                  >
                    <path
                      d="M12 8L20 16L12 24"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Message de confiance */}
        <div className="mt-16 text-center">
          <p className="inline-flex items-center gap-3 px-6 py-3 bg-success/20 text-success rounded-full text-base font-medium border border-success/30">
            <svg
              className="w-5 h-5"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            Moins de 10 minutes de formation pour être opérationnel
          </p>
        </div>
      </div>
    </section>
  );
}

export default SimplicitySection;
