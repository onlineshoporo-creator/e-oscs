"use client";

import React from "react";

/**
 * DashboardMockup - Maquette CSS pure d'un tableau de bord e-OSCS réaliste
 * Affiche sidebar, KPIs, graphiques, activités récentes et filtres
 */
export function DashboardMockup() {
  return (
    <div className="w-full max-w-5xl mx-auto">
      {/* Conteneur principal du dashboard */}
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header du dashboard */}
        <div className="bg-gradient-to-r from-slate-900 to-slate-800 px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Logo */}
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#F77F00] to-[#009E60] flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-base">e</span>
            </div>
            <div>
              <span className="text-white font-semibold text-sm">e-OSCS</span>
              <p className="text-slate-400 text-[10px]">Direction Régionale d&apos;Abidjan</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {/* Filtres année/trimestre */}
            <div className="hidden sm:flex items-center gap-2 bg-slate-700/50 rounded-lg px-3 py-1.5">
              <select className="bg-transparent text-xs text-slate-300 outline-none cursor-pointer">
                <option value="2026">2026</option>
                <option value="2025">2025</option>
              </select>
              <span className="text-slate-500">|</span>
              <select className="bg-transparent text-xs text-slate-300 outline-none cursor-pointer">
                <option value="all">Tous trimestres</option>
                <option value="t1">T1</option>
                <option value="t2">T2</option>
                <option value="t3">T3</option>
                <option value="t4">T4</option>
              </select>
            </div>
            {/* Boutons fenêtre */}
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-500/80" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
              <div className="w-3 h-3 rounded-full bg-green-500/80" />
            </div>
          </div>
        </div>

        <div className="flex">
          {/* Sidebar */}
          <div className="hidden md:block w-48 bg-slate-50 border-r border-slate-200 p-4 space-y-1">
            {[
              { icon: "📊", label: "Tableau de bord", active: true },
              { icon: "📋", label: "Plan annuel", active: false },
              { icon: "✅", label: "Activités", active: false },
              { icon: "📈", label: "Indicateurs", active: false },
              { icon: "🔄", label: "Validation", active: false, badge: "3" },
              { icon: "📄", label: "Rapports", active: false },
              { icon: "⚠️", label: "Incidents", active: false },
              { icon: "🖼️", label: "Galerie", active: false },
              { icon: "⚙️", label: "Paramètres", active: false },
            ].map((item) => (
              <div
                key={item.label}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                  item.active
                    ? "bg-primary text-white shadow-md"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                <span>{item.icon}</span>
                <span className="flex-1">{item.label}</span>
                {item.badge && (
                  <span className="w-5 h-5 rounded-full bg-red-500 text-white text-[10px] flex items-center justify-center">
                    {item.badge}
                  </span>
                )}
              </div>
            ))}
          </div>

          {/* Contenu principal */}
          <div className="flex-1 p-5 space-y-5 min-w-0">
            {/* Cartes KPI */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              <KpiCard
                icon="📋"
                label="Activités prévues"
                value="24"
                subtitle="Plan 2026"
                color="#F77F00"
                bgColor="#FFF7ED"
              />
              <KpiCard
                icon="✅"
                label="Activités réalisées"
                value="18"
                subtitle="+3 ce mois"
                color="#009E60"
                bgColor="#ECFDF5"
              />
              <KpiCard
                icon="👥"
                label="Bénéficiaires"
                value="1,247"
                subtitle="+234 ce T"
                color="#0891B2"
                bgColor="#ECFEFF"
              />
              <KpiCard
                icon="📊"
                label="Taux réalisation"
                value="75%"
                subtitle="+5% vs 2025"
                color="#7C3AED"
                bgColor="#F5F3FF"
              />
            </div>

            {/* Graphique + Activités */}
            <div className="grid lg:grid-cols-3 gap-4">
              {/* Graphique barres */}
              <div className="lg:col-span-2 bg-slate-50 rounded-xl p-5 border border-slate-100">
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <h3 className="text-sm font-semibold text-slate-800">
                      Réalisation par trimestre
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Comparaison Prévu vs Réalisé
                    </p>
                  </div>
                  <div className="flex items-center gap-4 text-xs">
                    <span className="flex items-center gap-1.5">
                      <span className="w-3 h-3 rounded bg-primary/30" /> Prévu
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="w-3 h-3 rounded bg-success" /> Réalisé
                    </span>
                  </div>
                </div>

                {/* Bar chart CSS pur */}
                <div className="space-y-4">
                  {[
                    { label: "T1 (Jan-Mar)", planned: 6, realized: 5 },
                    { label: "T2 (Avr-Juin)", planned: 7, realized: 7 },
                    { label: "T3 (Jul-Sep)", planned: 6, realized: 4 },
                    { label: "T4 (Oct-Déc)", planned: 5, realized: 2 },
                  ].map((bar) => (
                    <div key={bar.label} className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs text-slate-600">
                        <span>{bar.label}</span>
                        <span className="font-medium">
                          {bar.realized}/{bar.planned} activités
                        </span>
                      </div>
                      <div className="flex gap-1.5 h-8">
                        <div className="flex-1 bg-slate-200 rounded-lg overflow-hidden relative">
                          <div
                            className="absolute inset-y-0 left-0 bg-primary/40 rounded-lg transition-all duration-1000 ease-out"
                            style={{ width: `${(bar.planned / 8) * 100}%` }}
                          />
                        </div>
                        <div className="flex-1 bg-slate-200 rounded-lg overflow-hidden relative">
                          <div
                            className="absolute inset-y-0 left-0 bg-success rounded-lg transition-all duration-1000 ease-out delay-100"
                            style={{ width: `${(bar.realized / 8) * 100}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Activités récentes */}
              <div className="bg-slate-50 rounded-xl p-5 border border-slate-100">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-slate-800">
                    Activités récentes
                  </h3>
                  <button className="text-xs text-primary font-medium hover:underline">
                    Voir tout →
                  </button>
                </div>
                <div className="space-y-3">
                  {[
                    {
                      name: "Distribution vivres",
                      date: "15 Jan 2026",
                      status: "Terminé",
                      statusColor: "bg-green-100 text-green-700 border-green-200",
                    },
                    {
                      name: "Sensibilisation JE",
                      date: "12 Jan 2026",
                      status: "En cours",
                      statusColor: "bg-orange-100 text-orange-700 border-orange-200",
                    },
                    {
                      name: "Visite domicile PPH",
                      date: "10 Jan 2026",
                      status: "Validé",
                      statusColor: "bg-blue-100 text-blue-700 border-blue-200",
                    },
                    {
                      name: "Atelier formation",
                      date: "08 Jan 2026",
                      status: "En attente",
                      statusColor: "bg-slate-100 text-slate-600 border-slate-200",
                    },
                    {
                      name: "Réunion coordination",
                      date: "05 Jan 2026",
                      status: "Terminé",
                      statusColor: "bg-green-100 text-green-700 border-green-200",
                    },
                  ].map((activity) => (
                    <div
                      key={activity.name}
                      className="flex items-start gap-3 p-2.5 rounded-lg hover:bg-white transition-colors border border-transparent hover:border-slate-200"
                    >
                      <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-sm shrink-0">
                        {activity.name.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-slate-700 truncate">
                          {activity.name}
                        </p>
                        <p className="text-[10px] text-slate-400 mt-0.5">
                          {activity.date}
                        </p>
                      </div>
                      <span
                        className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${activity.statusColor}`}
                      >
                        {activity.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Barre d'actions rapides */}
            <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-100">
              {[
                { icon: "📄", label: "Rapport mensuel Word", primary: true },
                { icon: "📊", label: "Présentation PowerPoint", primary: false },
                { icon: "📅", label: "Bilan annuel", primary: false },
                { icon: "📥", label: "Exporter Excel", primary: false },
              ].map((action) => (
                <button
                  key={action.label}
                  className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-medium transition-all ${
                    action.primary
                      ? "bg-primary text-white shadow-md shadow-primary/20 hover:bg-primary/90 hover:shadow-lg"
                      : "bg-white text-slate-700 border border-slate-200 hover:border-primary/30 hover:text-primary"
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

      {/* Légende sous le mockup */}
      <p className="text-center text-xs text-slate-500 mt-4 italic">
        Aperçu de l&apos;interface e-OSCS — Données illustratives
      </p>
    </div>
  );
}

/** Carte KPI individuelle */
function KpiCard({
  icon,
  label,
  value,
  subtitle,
  color,
  bgColor,
}: {
  icon: string;
  label: string;
  value: string;
  subtitle: string;
  color: string;
  bgColor: string;
}) {
  return (
    <div className={`${bgColor} rounded-xl p-4 border border-slate-100/50`}>
      <div className="flex items-start justify-between mb-2">
        <span className="text-lg">{icon}</span>
        <span
          className="w-2 h-2 rounded-full"
          style={{ backgroundColor: color }}
        />
      </div>
      <p className="text-[11px] text-slate-500 mb-1">{label}</p>
      <p className="text-2xl font-bold text-slate-900">{value}</p>
      <p className="text-[10px] text-slate-500 mt-1">{subtitle}</p>
    </div>
  );
}

export default DashboardMockup;
