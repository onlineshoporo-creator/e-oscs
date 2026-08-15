"use client";

import React from "react";
import { Calendar, Target, CheckCircle2, Circle } from "lucide-react";

const months = [
  { name: "Jan", t: "T1" },
  { name: "Fév", t: "T1" },
  { name: "Mar", t: "T1" },
  { name: "Avr", t: "T2" },
  { name: "Mai", t: "T2" },
  { name: "Jun", t: "T2" },
  { name: "Jul", t: "T3" },
  { name: "Aoû", t: "T3" },
  { name: "Sep", t: "T3" },
  { name: "Oct", t: "T4" },
  { name: "Nov", t: "T4" },
  { name: "Déc", t: "T4" },
];

const trimesters = [
  { label: "T1", months: "Jan - Mar", color: "#F77F00", planned: 6, realized: 5 },
  { label: "T2", months: "Avr - Jun", color: "#FB923C", planned: 7, realized: 7 },
  { label: "T3", months: "Jul - Sep", color: "#009E60", planned: 6, realized: 4 },
  { label: "T4", months: "Oct - Déc", color: "#0891B2", planned: 5, realized: 2 },
];

export function AnnualPlanSection() {
  const totalPlanned = trimesters.reduce((sum, t) => sum + t.planned, 0);
  const totalRealized = trimesters.reduce((sum, t) => sum + t.realized, 0);
  const rate = Math.round((totalRealized / totalPlanned) * 100);

  return (
    <section
      className="py-20 lg:py-28 bg-slate-50"
      id="plan-annuel"
      aria-label="Plan annuel"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* En-tête */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block px-4 py-1.5 bg-orange-100 text-orange-700 rounded-full text-sm font-medium mb-4">
            Planification
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-6">
            Gardez une vision claire de{" "}
            <span className="text-primary">votre année</span>
          </h2>
          <p className="text-lg text-slate-600">
            Visualisez votre plan d&apos;activités annuel avec le suivi en temps réel
            de vos réalisations.
          </p>
        </div>

        {/* Visualisation du plan 2026 */}
        <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
          {/* Header du plan */}
          <div className="bg-gradient-to-r from-slate-900 to-slate-800 px-6 py-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Calendar className="h-6 w-6 text-primary" />
              <div>
                <h3 className="text-white font-bold text-lg">Plan Annuel 2026</h3>
                <p className="text-slate-400 text-sm">Direction Régionale d&apos;Abidjan</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-primary/40" />
                <span className="text-xs text-slate-400">Prévu</span>
              </div>
              <div className="hidden sm:flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-success" />
                <span className="text-xs text-slate-400">Réalisé</span>
              </div>
            </div>
          </div>

          {/* Timeline des mois */}
          <div className="p-6 border-b border-slate-100">
            <div className="grid grid-cols-12 gap-1 md:gap-2">
              {months.map((month) => {
                const trimester = trimesters.find((t) => t.label === month.t);
                return (
                  <div
                    key={month.name}
                    className="text-center p-2 rounded-lg"
                    style={{ backgroundColor: `${trimester?.color}10` }}
                  >
                    <p className="text-xs font-medium text-slate-600">{month.name}</p>
                    <p
                      className="text-[10px] font-semibold mt-0.5"
                      style={{ color: trimester?.color }}
                    >
                      {month.t}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Statistiques par trimestre */}
          <div className="p-6 grid grid-cols-2 lg:grid-cols-4 gap-4">
            {trimesters.map((t) => {
              const pct = Math.round((t.realized / t.planned) * 100);
              return (
                <div
                  key={t.label}
                  className="bg-slate-50 rounded-xl p-4 border border-slate-100"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span
                      className="font-bold text-lg"
                      style={{ color: t.color }}
                    >
                      {t.label}
                    </span>
                    <span className="text-xs text-slate-500">{t.months}</span>
                  </div>
                  
                  {/* Barre de progression */}
                  <div className="mb-3">
                    <div className="h-3 bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{
                          width: `${pct}%`,
                          backgroundColor: t.color,
                        }}
                      />
                    </div>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">{t.realized}/{t.planned} act.</span>
                    <span className="font-semibold" style={{ color: t.color }}>
                      {pct}%
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Résumé global */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 flex flex-col md:flex-row items-center justify-between gap-4 border-t border-green-100">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <Target className="h-5 w-5 text-slate-600" />
                <span className="text-sm text-slate-600">Prévu:</span>
                <span className="font-bold text-slate-900">{totalPlanned}</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-success" />
                <span className="text-sm text-slate-600">Réalisé:</span>
                <span className="font-bold text-success">{totalRealized}</span>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-slate-600">Taux global:</span>
              <span className="px-4 py-2 bg-success text-white rounded-xl font-bold text-lg shadow-md shadow-success/20">
                {rate}%
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default AnnualPlanSection;
