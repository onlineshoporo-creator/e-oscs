"use client";

import React from "react";
import { ArrowRight, FileText, Presentation, BarChart3, Sparkles } from "lucide-react";

const processSteps = [
  { label: "ACTIVITÉ", sublabel: "Saisie sur le terrain", icon: "✅" },
  { label: "MOIS", sublabel: "Suivi mensuel", icon: "📅" },
  { label: "TRIMESTRE", sublabel: "Consolidation T", icon: "📊" },
  { label: "ANNÉE", sublabel: "Bilan final", icon: "🎯" },
];

const outputs = [
  {
    icon: <FileText className="h-6 w-6" />,
    title: "RAPPORT MENSUEL",
    description: "Synthèse des activités du mois",
    color: "#F77F00",
    bgColor: "#FFF7ED",
  },
  {
    icon: <FileText className="h-6 w-6" />,
    title: "RAPPORT TRIMESTRIEL",
    description: "Bilan détaillé du trimestre",
    color: "#009E60",
    bgColor: "#ECFDF5",
  },
  {
    icon: <BarChart3 className="h-6 w-6" />,
    title: "BILAN ANNUEL",
    description: "Rapport annuel complet",
    color: "#7C3AED",
    bgColor: "#F5F3FF",
  },
  {
    icon: <Presentation className="h-6 w-6" />,
    title: "POWERPOINT",
    description: "Présentation direction",
    color: "#DB2777",
    bgColor: "#FDF2F8",
  },
];

export function ReportingSection() {
  return (
    <section
      className="py-20 lg:py-28 bg-white"
      id="reporting"
      aria-label="Reporting automatique"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* En-tête */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block px-4 py-1.5 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-4">
            Reporting
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-6">
            Du terrain au rapport{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#009E60] to-[#0891B2]">
              en quelques clics
            </span>
          </h2>
          <p className="text-lg text-slate-600">
            Transformez vos activités saisies en documents professionnels sans
            aucune manipulation supplémentaire.
          </p>
        </div>

        {/* Processus visuel */}
        <div className="mb-16">
          <div className="bg-slate-50 rounded-3xl p-8 md:p-12 border border-slate-200">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 relative">
              {/* Ligne de connexion */}
              <div className="hidden md:block absolute top-12 left-[12%] right-[12%] h-1 bg-gradient-to-r from-primary via-success to-purple-500 rounded-full" />

              {processSteps.map((step, index) => (
                <div key={step.label} className="flex flex-col items-center text-center relative">
                  {/* Cercle */}
                  <div className="relative z-10 mb-4">
                    <div className="w-24 h-24 rounded-full bg-white shadow-lg flex items-center justify-center text-3xl border-2 border-slate-100 hover:border-primary transition-colors">
                      {step.icon}
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-primary text-white text-sm font-bold flex items-center justify-center shadow-md">
                      {index + 1}
                    </div>
                  </div>

                  {/* Texte */}
                  <h3 className="font-bold text-slate-900 mb-1">{step.label}</h3>
                  <p className="text-xs text-slate-500">{step.sublabel}</p>

                  {/* Flèche (mobile) */}
                  {index < processSteps.length - 1 && (
                    <ArrowRight className="md:hidden mt-3 w-5 h-5 text-slate-400 rotate-90" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Outputs - Les livrables */}
        <div className="mb-12">
          <h3 className="text-xl font-semibold text-center text-slate-900 mb-8">
            Documents générés automatiquement
          </h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {outputs.map((output, index) => (
              <div
                key={output.title}
                className="group p-6 rounded-2xl border border-slate-200 hover:border-transparent hover:shadow-xl transition-all duration-300 cursor-pointer"
                style={{ backgroundColor: output.bgColor }}
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform"
                  style={{ backgroundColor: `${output.color}20`, color: output.color }}
                >
                  {output.icon}
                </div>
                <h4 className="font-semibold text-slate-900 mb-1">{output.title}</h4>
                <p className="text-sm text-slate-600">{output.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Highlight principal */}
        <div className="bg-gradient-to-r from-success/10 to-emerald-50 rounded-2xl p-8 border border-success/20 text-center">
          <div className="flex items-center justify-center gap-3 mb-3">
            <Sparkles className="h-6 w-6 text-success" />
            <span className="text-lg font-bold text-success">Point fort</span>
            <Sparkles className="h-6 w-6 text-success" />
          </div>
          <p className="text-xl font-semibold text-slate-900">
            Aucune nouvelle saisie nécessaire.
          </p>
          <p className="text-slate-600 mt-2 max-w-2xl mx-auto">
            Une fois vos activités enregistrées dans le système, tous les rapports
            sont générés automatiquement avec les données à jour. Vous gagnez des
            heures de travail à chaque échéance.
          </p>
        </div>
      </div>
    </section>
  );
}

export default ReportingSection;
