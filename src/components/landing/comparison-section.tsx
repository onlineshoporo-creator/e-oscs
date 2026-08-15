"use client";

import React from "react";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

const indicators = [
  { name: "Actions solidarité", t1: 12, t2: 15, t3: 10, t4: 8, unit: "" },
  { name: "Cohésion sociale", t1: 5, t2: 7, t3: 6, t4: 4, unit: "" },
  { name: "Visites de terrain", t1: 8, t2: 10, t3: 9, t4: 6, unit: "" },
  { name: "Sensibilisations JE", t1: 3, t2: 4, t3: 3, t4: 2, unit: "" },
  { name: "Formations organisées", t1: 2, t2: 2, t3: 1, t4: 1, unit: "" },
  { name: "Bénéficiaires directs", t1: 245, t2: 312, t3: 198, t4: 156, unit: "" },
  { name: "Incidents signalés", t1: 0, t2: 1, t3: 0, t4: 0, unit: "" },
];

function getTrend(current: number, previous: number) {
  if (current > previous) return "up";
  if (current < previous) return "down";
  return "stable";
}

function TrendIcon({ type }: { type: string }) {
  switch (type) {
    case "up":
      return <TrendingUp className="w-4 h-4 text-success" />;
    case "down":
      return <TrendingDown className="w-4 h-4 text-red-500" />;
    default:
      return <Minus className="w-4 h-4 text-slate-400" />;
  }
}

export function ComparisonSection() {
  return (
    <section
      className="py-20 lg:py-28 bg-slate-50"
      id="comparaison"
      aria-label="Comparaison annuelle"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* En-tête */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block px-4 py-1.5 bg-cyan-100 text-cyan-700 rounded-full text-sm font-medium mb-4">
            Analyse
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-6">
            Suivi comparatif{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0891B2] to-[#009E60]">
              sur l'année
            </span>
          </h2>
          <p className="text-lg text-slate-600">
            Visualisez l&apos;évolution de vos indicateurs clés trimestre après trimestre.
          </p>
        </div>

        {/* Tableau de comparaison */}
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full" role="table">
              <thead>
                <tr className="bg-gradient-to-r from-slate-900 to-slate-800">
                  <th className="px-6 py-4 text-left text-sm font-semibold text-white">
                    Indicateurs
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-white">
                    <div>T1</div>
                    <div className="text-xs font-normal text-slate-400">Jan-Mar</div>
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-white">
                    <div>T2</div>
                    <div className="text-xs font-normal text-slate-400">Avr-Juin</div>
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-white">
                    <div>T3</div>
                    <div className="text-xs font-normal text-slate-400">Jul-Sep</div>
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-white">
                    <div>T4</div>
                    <div className="text-xs font-normal text-slate-400">Oct-Déc</div>
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-primary">
                    <div>Total</div>
                    <div className="text-xs font-normal text-orange-300">Année</div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {indicators.map((indicator, index) => {
                  const total = indicator.t1 + indicator.t2 + indicator.t3 + indicator.t4;
                  const trends = [
                    getTrend(indicator.t2, indicator.t1),
                    getTrend(indicator.t3, indicator.t2),
                    getTrend(indicator.t4, indicator.t3),
                  ];
                  
                  return (
                    <tr
                      key={indicator.name}
                      className={`border-b border-slate-100 hover:bg-slate-50 transition-colors ${
                        index % 2 === 0 ? "bg-white" : "bg-slate-50/50"
                      }`}
                    >
                      <td className="px-6 py-4">
                        <span className="font-medium text-slate-900">
                          {indicator.name}
                        </span>
                      </td>
                      {[indicator.t1, indicator.t2, indicator.t3, indicator.t4].map(
                        (value, i) => (
                          <td key={i} className="px-6 py-4 text-center">
                            <div className="flex items-center justify-center gap-2">
                              <span className="font-semibold text-slate-700">
                                {value.toLocaleString("fr-FR")}
                              </span>
                              {trends[i] && i > 0 && <TrendIcon type={trends[i - 1]} />}
                            </div>
                          </td>
                        )
                      )}
                      <td className="px-6 py-4 text-center">
                        <span className="inline-flex items-center justify-center min-w-[60px] px-3 py-1.5 bg-primary/10 text-primary rounded-lg font-bold">
                          {total.toLocaleString("fr-FR")}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot>
                <tr className="bg-slate-100 font-bold">
                  <td className="px-6 py-4 text-slate-900">TOTAL</td>
                  <td className="px-6 py-4 text-center text-slate-900">
                    {indicators.reduce((sum, ind) => sum + ind.t1, 0).toLocaleString("fr-FR")}
                  </td>
                  <td className="px-6 py-4 text-center text-slate-900">
                    {indicators.reduce((sum, ind) => sum + ind.t2, 0).toLocaleString("fr-FR")}
                  </td>
                  <td className="px-6 py-4 text-center text-slate-900">
                    {indicators.reduce((sum, ind) => sum + ind.t3, 0).toLocaleString("fr-FR")}
                  </td>
                  <td className="px-6 py-4 text-center text-slate-900">
                    {indicators.reduce((sum, ind) => sum + ind.t4, 0).toLocaleString("fr-FR")}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="inline-flex items-center justify-center px-4 py-2 bg-success text-white rounded-lg">
                      {indicators
                        .reduce(
                          (sum, ind) => sum + ind.t1 + ind.t2 + ind.t3 + ind.t4,
                          0
                        )
                        .toLocaleString("fr-FR")}
                    </span>
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Légende */}
          <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center gap-6 text-sm text-slate-600">
            <span className="font-medium">Légende :</span>
            <span className="flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-success" /> En augmentation
            </span>
            <span className="flex items-center gap-1.5">
              <TrendingDown className="w-4 h-4 text-red-500" /> En diminution
            </span>
            <span className="flex items-center gap-1.5">
              <Minus className="w-4 h-4 text-slate-400" /> Stable
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ComparisonSection;
