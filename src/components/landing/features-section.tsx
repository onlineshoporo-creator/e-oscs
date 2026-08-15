"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";

const features = [
  {
    icon: "📋",
    title: "Plan Annuel",
    description:
      "Organisez vos activités sur l'année avec une vision claire de vos objectifs et échéances.",
    color: "#F77F00",
    bgColor: "#FFF7ED",
    borderColor: "#FED7AA",
  },
  {
    icon: "✅",
    title: "Suivi des Activités",
    description:
      "Enregistrez chaque activité avec résultats détaillés, acteurs impliqués et bénéficiaires.",
    color: "#009E60",
    bgColor: "#ECFDF5",
    borderColor: "#A7F3D0",
  },
  {
    icon: "📈",
    title: "Indicateurs",
    description:
      "Suivez automatiquement vos indicateurs clés avec calculs et tendances en temps réel.",
    color: "#0891B2",
    bgColor: "#ECFEFF",
    borderColor: "#A5F3FC",
  },
  {
    icon: "🔄",
    title: "Validation",
    description:
      "Workflow simple et efficace de soumission/validation par les responsables hiérarchiques.",
    color: "#7C3AED",
    bgColor: "#F5F3FF",
    borderColor: "#DDD6FE",
  },
  {
    icon: "📄",
    title: "Rapports Word",
    description:
      "Génération automatique des rapports mensuels, trimestriels et annuels au format Word professionnel.",
    color: "#2563EB",
    bgColor: "#EFF6FF",
    borderColor: "#BFDBFE",
  },
  {
    icon: "📊",
    title: "Présentations PowerPoint",
    description:
      "Transformez vos données en présentations PowerPoint prêtes pour les réunions de direction.",
    color: "#DB2777",
    bgColor: "#FDF2F8",
    borderColor: "#FBCFE8",
  },
  {
    icon: "🖥️",
    title: "Tableau de Bord",
    description:
      "Chiffres clés, niveau de réalisation et vue d'ensemble en un coup d'œil sur votre dashboard.",
    color: "#D97706",
    bgColor: "#FFFBEB",
    borderColor: "#FDE68A",
  },
  {
    icon: "📜",
    title: "Historique",
    description:
      "Trace complète des modifications, validations et états successifs de chaque élément.",
    color: "#6B7280",
    bgColor: "#F9FAFB",
    borderColor: "#E5E7EB",
  },
];

export function FeaturesSection() {
  return (
    <section
      className="py-20 lg:py-28 bg-slate-50"
      id="fonctionnalites"
      aria-label="Fonctionnalités"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* En-tête */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block px-4 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-medium mb-4">
            Fonctionnalités
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-6">
            Tout ce dont votre Direction{" "}
            <span className="text-primary">a besoin</span>
          </h2>
          <p className="text-lg text-slate-600">
            Une suite complète d&apos;outils conçus spécifiquement pour les besoins
            du MCNSLP.
          </p>
        </div>

        {/* Grille des fonctionnalités */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="group hover:shadow-xl transition-all duration-300 border-slate-200 overflow-hidden cursor-pointer hover:-translate-y-1"
              style={{
                "--hover-color": feature.color,
              } as React.CSSProperties}
            >
              <CardContent className="p-6 h-full flex flex-col">
                {/* Icon */}
                <div
                  className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl mb-4 transition-transform group-hover:scale-110"
                  style={{
                    backgroundColor: feature.bgColor,
                    border: `1px solid ${feature.borderColor}`,
                  }}
                >
                  {feature.icon}
                </div>

                {/* Contenu */}
                <h3 className="text-lg font-semibold text-slate-900 mb-2 group-hover:text-[var(--hover-color)] transition-colors">
                  {feature.title}
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed flex-1">
                  {feature.description}
                </p>

                {/* Lien subtil */}
                <div className="mt-4 pt-4 border-t border-slate-100">
                  <span
                    className="text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{ color: feature.color }}
                  >
                    En savoir plus →
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

export default FeaturesSection;
