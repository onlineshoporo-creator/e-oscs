"use client";

import React from "react";
import { Building2, MapPin, Users } from "lucide-react";

const profiles = [
  {
    icon: <Building2 className="h-8 w-8" />,
    title: "Direction Régionale",
    description:
      "Pilotez l'ensemble des activités de votre région. Vue consolidée de tous les départements, validation centralisée et rapports globaux.",
    features: [
      "Vue d'ensemble multi-départementale",
      "Validation des activités départementales",
      "Rapports régionaux automatiques",
      "Suivi des indicateurs clés",
    ],
    color: "#F77F00",
    bgColor: "#FFF7ED",
  },
  {
    icon: <MapPin className="h-8 w-8" />,
    title: "Direction Départementale",
    description:
      "Gérez vos activités locales avec un suivi précis. Saisie simplifiée, validation par la DR et rapports départementaux.",
    features: [
      "Saisie guidée des activités",
      "Suivi mensuel détaillé",
      "Galerie photo intégrée",
      "Gestion des incidents",
    ],
    color: "#009E60",
    bgColor: "#ECFDF5",
  },
  {
    icon: <Users className="h-8 w-8" />,
    title: "Collaborateurs",
    description:
      "Chaque agent peut saisir ses activités sur le terrain. Interface mobile-friendly pour une utilisation en déplacement.",
    features: [
      "Saisie rapide d'activités",
      "Accès mobile responsive",
      "Historique personnel",
      "Notifications de validation",
    ],
    color: "#0891B2",
    bgColor: "#ECFEFF",
  },
];

export function UsersSection() {
  return (
    <section
      className="py-20 lg:py-28 bg-white"
      id="pour-qui"
      aria-label="Pour qui"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* En-tête */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block px-4 py-1.5 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium mb-4">
            Cibles
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-6">
            e-OSCS s&apos;adapte à{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#6366F1] to-[#8B5CF6]">
              votre organisation
            </span>
          </h2>
          <p className="text-lg text-slate-600">
            Que vous soyez Direction Régionale, Départementale ou collaborateur,
            e-OSCS s&apos;adapte à vos besoins spécifiques.
          </p>
        </div>

        {/* Cartes des profils */}
        <div className="grid md:grid-cols-3 gap-8">
          {profiles.map((profile, index) => (
            <div
              key={profile.title}
              className="group relative rounded-2xl overflow-hidden border transition-all duration-300 hover:shadow-2xl hover:-translate-y-2"
              style={{
                backgroundColor: profile.bgColor,
                borderColor: `${profile.color}30`,
              }}
            >
              {/* Header */}
              <div className="p-8 pb-4">
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform shadow-lg"
                  style={{ color: profile.color, backgroundColor: `white` }}
                >
                  {profile.icon}
                </div>

                <h3
                  className="text-xl font-bold mb-3"
                  style={{ color: profile.color }}
                >
                  {profile.title}
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {profile.description}
                </p>
              </div>

              {/* Features list */}
              <div className="p-8 pt-0">
                <ul className="space-y-3">
                  {profile.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-start gap-3 text-sm text-slate-700"
                    >
                      <svg
                        className="w-5 h-5 shrink-0 mt-0.5"
                        style={{ color: profile.color }}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2.5}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Badge position */}
              <div
                className="absolute top-6 right-6 w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg opacity-80"
                style={{ backgroundColor: profile.color }}
              >
                {index + 1}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default UsersSection;
