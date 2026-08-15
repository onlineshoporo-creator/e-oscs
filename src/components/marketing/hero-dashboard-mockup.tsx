"use client";

import React from "react";

/**
 * HeroDashboardMockup - Maquette CSS pure d'un tableau de bord e-OSCS
 * Affiche des fausses cartes KPI et un graphique en barres
 */
export function HeroDashboardMockup() {
  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Conteneur du dashboard */}
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header du dashboard */}
        <div className="bg-slate-900 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Logo mini */}
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#F77F00] to-[#009E60] flex items-center justify-center">
              <span className="text-sm font-bold text-white">e</span>
            </div>
            <span className="text-white font-semibold text-sm">e-OSCS</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-red-500" />
            <div className="w-2 h-2 rounded-full bg-yellow-500" />
            <div className="w-2 h-2 rounded-full bg-green-500" />
          </div>
        </div>

        {/* Barre de navigation interne */}
        <div className="bg-slate-50 border-b border-slate-200 px-4 py-2 flex gap-1">
          {["Tableau de bord", "Activités", "Rapports", "Validation"].map(
            (item, i) => (
              <span
                key={item}
                className={`px-3 py-1.5 rounded-md text-xs font-medium ${
                  i === 0
                    ? "bg-primary text-white"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                {item}
              </span>
            )
          )}
        </div>

        {/* Contenu principal */}
        <div className="p-6 space-y-6">
          {/* Cartes KPI */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <KpiCard
              label="Activités planifiées"
              value="24"
              change="+12%"
              color="#F77F00"
            />
            <KpiCard
              label="Activités réalisées"
              value="18"
              change="+8%"
              color="#009E60"
            />
            <KpiCard
              label="Bénéficiaires"
              value="1 247"
              change="+23%"
              color="#0891B2"
            />
            <KpiCard
              label="Taux de réalisation"
              value="75%"
              change="+5%"
              color="#7C3AED"
            />
          </div>

          {/* Graphique + Liste */}
          <div className="grid md:grid-cols-3 gap-4">
            {/* Graphique barres CSS */}
            <div className="md:col-span-2 bg-slate-50 rounded-xl p-5 border border-slate-100">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-slate-700">
                  Réalisation par trimestre
                </h3>
                <span className="text-xs text-slate-500">2026</span>
              </div>
              
              {/* Bar chart CSS pur */}
              <div className="space-y-3">
                {[
                  { label: "T1", value: 65, color: "#F77F00" },
                  { label: "T2", value: 85, color: "#FF9933" },
                  { label: "T3", value: 45, color: "#009E60" },
                  { label: "T4", value: 30, color: "#0891B2" },
                ].map((bar) => (
                  <div key={bar.label} className="flex items-center gap-3">
                    <span className="text-xs text-slate-600 w-6">{bar.label}</span>
                    <div className="flex-1 h-7 bg-slate-200 rounded-md overflow-hidden">
                      <div
                        className="h-full rounded-md transition-all duration-700 ease-out flex items-center justify-end pr-2"
                        style={{
                          width: `${bar.value}%`,
                          backgroundColor: bar.color,
                        }}
                      >
                        <span className="text-xs font-medium text-white opacity-0 md:opacity-100">
                          {bar.value}%
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Dernières activités */}
            <div className="bg-slate-50 rounded-xl p-5 border border-slate-100">
              <h3 className="text-sm font-semibold text-slate-700 mb-3">
                Dernières activités
              </h3>
              <div className="space-y-3">
                {[
                  { name: "Distribution vivres", status: "Terminé", color: "bg-green-100 text-green-700" },
                  { name: "Sensibilisation JE", status: "En cours", color: "bg-orange-100 text-orange-700" },
                  { name: "Visite domicile", status: "Planifié", color: "bg-blue-100 text-blue-700" },
                  { name: "Atelier formation", status: "En attente", color: "bg-slate-100 text-slate-600" },
                ].map((activity) => (
                  <div key={activity.name} className="flex items-center justify-between">
                    <span className="text-xs text-slate-600 truncate pr-2">
                      {activity.name}
                    </span>
                    <span
                      className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${activity.color}`}
                    >
                      {activity.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Barre d'actions rapides */}
          <div className="flex flex-wrap gap-2 pt-2">
            {[
              { icon: "📄", label: "Générer rapport Word", primary: true },
              { icon: "📊", label: "Générer présentation PPT", primary: false },
              { icon: "📥", label: "Exporter les données", primary: false },
            ].map((action) => (
              <button
                key={action.label}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium transition-colors ${
                  action.primary
                    ? "bg-primary text-white hover:bg-primary/90"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                <span>{action.icon}</span>
                {action.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/** Carte KPI individuelle */
function KpiCard({
  label,
  value,
  change,
  color,
}: {
  label: string;
  value: string;
  change: string;
  color: string;
}) {
  return (
    <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
      <p className="text-[11px] text-slate-500 mb-1">{label}</p>
      <p className="text-2xl font-bold text-slate-900">{value}</p>
      <div className="flex items-center gap-1 mt-1">
        <span
          className="w-1.5 h-1.5 rounded-full"
          style={{ backgroundColor: color }}
        />
        <span className="text-[11px] font-medium text-green-600">{change}</span>
      </div>
    </div>
  );
}

export default HeroDashboardMockup;
