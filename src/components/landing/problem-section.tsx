"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { FileText, FolderOpen, Clock, BarChart3, ArrowRight } from "lucide-react";

const painPoints = [
  {
    icon: <FolderOpen className="h-6 w-6" />,
    title: "Informations dispersées",
    description:
      "Vos données sont éparpillées entre Word, Excel, carnets papier et fichiers sur différents postes.",
    examples: ["Fichiers Excel multiples", "Documents Word non standardisés", "Notes manuscrites"],
    color: "#EF4444",
    bgColor: "#FEF2F2",
  },
  {
    icon: <FileText className="h-6 w-6" />,
    title: "Compilation manuelle",
    description:
      "Vous passez des heures à consolider les informations de vos collaborateurs dans un seul document.",
    examples: ["Saisies en double", "Risques d'erreurs", "Perte de temps considérable"],
    color: "#F97316",
    bgColor: "#FFF7ED",
  },
  {
    icon: <Clock className="h-6 w-6" />,
    title: "Rapports longs à préparer",
    description:
      "Chaque rapport trimestriel ou annuel demande des jours de travail pour compiler et formater.",
    examples: ["Rapports mensuels", "Bilans trimestriels", "Rapports annuels"],
    color: "#EAB308",
    bgColor: "#FEFCE8",
  },
  {
    icon: <BarChart3 className="h-6 w-6" />,
    title: "Difficulté à suivre les indicateurs",
    description:
      "Impossible d'avoir une vue claire de l'évolution de vos indicateurs sans historique structuré.",
    examples: ["Pas d'historique fiable", "Tendances invisibles", "Décisions non informées"],
    color: "#8B5CF6",
    bgColor: "#F5F3FF",
  },
];

export function ProblemSection() {
  return (
    <section
      className="py-20 lg:py-28 bg-slate-50"
      id="probleme"
      aria-label="Les défis actuels"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* En-tête */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block px-4 py-1.5 bg-red-100 text-red-700 rounded-full text-sm font-medium mb-4">
            Le problème
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-6">
            Encore trop de temps consacré à{" "}
            <span className="text-primary">compiler</span> vos activités ?
          </h2>
          <p className="text-lg text-slate-600">
            Les Directions Régionales et Départementales font face aux mêmes
            défis répétitifs qui freinent leur efficacité.
          </p>
        </div>

        {/* Grille des problèmes */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {painPoints.map((point, index) => (
            <Card
              key={index}
              className="group hover:shadow-xl transition-all duration-300 border-slate-200 hover:border-red-200 overflow-hidden"
            >
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div
                    className="w-14 h-14 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-110"
                    style={{ backgroundColor: point.bgColor, color: point.color }}
                  >
                    {point.icon}
                  </div>

                  {/* Contenu */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-slate-900 mb-2">
                      {point.title}
                    </h3>
                    <p className="text-slate-600 text-sm mb-3">
                      {point.description}
                    </p>
                    <ul className="space-y-1">
                      {point.examples.map((example) => (
                        <li
                          key={example}
                          className="flex items-center gap-2 text-xs text-slate-500"
                        >
                          <span
                            className="w-1.5 h-1.5 rounded-full shrink-0"
                            style={{ backgroundColor: point.color }}
                          />
                          {example}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Phrase de transition vers la solution */}
        <div className="text-center p-8 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl border border-green-100">
          <div className="inline-flex items-center gap-3 flex-wrap justify-center">
            <span className="text-lg text-slate-700">
              e-OSCS transforme ces informations dispersées en
            </span>
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-success text-white rounded-lg font-semibold shadow-md shadow-success/20">
              un système de suivi centralisé
              <ArrowRight className="h-4 w-4" />
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ProblemSection;
