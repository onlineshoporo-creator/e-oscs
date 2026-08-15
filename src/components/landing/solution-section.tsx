"use client";

import React from "react";
import { ArrowRight, CheckCircle2 } from "lucide-react";

const flowSteps = [
  { label: "PLAN ANNUEL", icon: "📋", color: "#F77F00" },
  { label: "ACTIVITÉS", icon: "✅", color: "#FB923C" },
  { label: "VALIDATION", icon: "🔄", color: "#009E60" },
  { label: "CONSOLIDATION", icon: "📊", color: "#0891B2" },
  { label: "RAPPORTS", icon: "📄", color: "#7C3AED" },
  { label: "POWERPOINT", icon: "📽️", color: "#DB2777" },
];

export function SolutionSection() {
  return (
    <section
      className="py-20 lg:py-28 bg-white"
      id="solution"
      aria-label="La solution e-OSCS"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* En-tête */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block px-4 py-1.5 bg-green-100 text-success rounded-full text-sm font-medium mb-4">
            La solution
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-6">
            Une seule plateforme pour{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#009E60] to-[#004D25]">
              toute votre Direction
            </span>
          </h2>
          <p className="text-lg text-slate-600">
            Du plan annuel jusqu&apos;aux rapports finaux, tout est connecté et automatisé.
          </p>
        </div>

        {/* Flow visuel */}
        <div className="relative mb-16">
          {/* Ligne de connexion desktop */}
          <div className="hidden md:block absolute top-1/2 left-0 right-0 h-1 -translate-y-1/2 bg-gradient-to-r from-primary via-success to-purple-500 rounded-full opacity-20" />

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6 relative">
            {flowSteps.map((step, index) => (
              <div key={step.label} className="flex flex-col items-center group">
                {/* Cercle avec icône */}
                <div className="relative mb-4">
                  <div
                    className="w-16 h-16 md:w-20 md:h-20 rounded-2xl flex items-center justify-center text-2xl md:text-3xl shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:shadow-xl border-2 border-white"
                    style={{
                      backgroundColor: `${step.color}15`,
                      borderColor: step.color,
                    }}
                  >
                    {step.icon}
                  </div>
                  {/* Numéro */}
                  <div
                    className="absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-md"
                    style={{ backgroundColor: step.color }}
                  >
                    {index + 1}
                  </div>
                </div>

                {/* Label */}
                <p className="text-xs md:text-sm font-semibold text-slate-700 text-center">
                  {step.label}
                </p>

                {/* Flèche (sauf le dernier) */}
                {index < flowSteps.length - 1 && (
                  <ArrowRight className="hidden md:block absolute top-8 right-[-12px] w-5 h-5 text-slate-400" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Message clé */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-8 md:p-12 text-center shadow-2xl">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-success flex items-center justify-center mx-auto mb-6 shadow-lg">
              <CheckCircle2 className="h-8 w-8 text-white" />
            </div>
            <blockquote className="text-xl md:text-2xl lg:text-3xl font-bold text-white leading-relaxed mb-6">
              &laquo; Une activité saisie{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-300 to-yellow-300">
                une seule fois
              </span>{" "}
              peut alimenter automatiquement le suivi mensuel, le rapport
              trimestriel et le bilan annuel. &raquo;
            </blockquote>
            <p className="text-slate-400 text-base md:text-lg">
              Fini la double saisie. Fini les erreurs de consolidation.
            </p>

            {/* Illustration visuelle du concept */}
            <div className="mt-10 flex flex-wrap items-center justify-center gap-3 md:gap-4">
              {["Activité saisie", "→ Suivi mensuel", "→ Rapport T", "→ Bilan annuel"].map(
                (item, i) => (
                  <React.Fragment key={item}>
                    <span
                      className={`px-4 py-2 rounded-lg text-sm font-medium ${
                        i === 0
                          ? "bg-primary text-white"
                          : "bg-white/10 text-white/80 border border-white/20"
                      }`}
                    >
                      {item}
                    </span>
                    {i < 3 && (
                      <ArrowRight className="hidden sm:block w-4 h-4 text-white/40" />
                    )}
                  </React.Fragment>
                )
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default SolutionSection;
