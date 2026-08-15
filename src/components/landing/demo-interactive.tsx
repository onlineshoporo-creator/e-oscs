"use client";

import React, { useState, useEffect } from "react";

/* ============================================
   SECTION DÉMO INTERACTIVE e-OSCS
   Composant Client - Dashboard Mockup Interactif
   ============================================ */

type TabType = "dashboard" | "activities" | "reports";

// Données fictives pour les KPIs
const kpiData = [
  { value: 47, label: "Activités totales", color: "#F77F00", change: "+12%", icon: "📊" },
  { value: 38, label: "Validées", color: "#009E60", change: "+8%", icon: "✓" },
  { value: 9, label: "En attente", color: "#D97706", change: "-3", icon: "⏳" },
  { value: 94, label: "Taux complétion", suffix: "%", color: "#2563EB", change: "+5%", icon: "📈" },
];

// Données du graphique en barres
const chartData = [
  { month: "Jan", value: 32 },
  { month: "Fév", value: 45 },
  { month: "Mar", value: 38 },
  { month: "Avr", value: 52 },
  { month: "Mai", value: 48 },
  { month: "Jun", value: 65 },
];

// Activités récentes
const recentActivities = [
  { name: "Atelier cohésion sociale", department: "Social", status: "Validée", date: "15 Jan 2025" },
  { name: "Visite terrain Daloa", department: "Opérations", status: "En cours", date: "14 Jan 2025" },
  { name: "Rapport mensuel décembre", department: "Reporting", status: "Brouillon", date: "13 Jan 2025" },
  { name: "Formation OSC locales", department: "Formation", status: "Validée", date: "12 Jan 2025" },
  { name: "Réunion coordination", direction: "Management", status: "Planifiée", date: "11 Jan 2025" },
];

// Liste complète des activités pour l'onglet Activités
const activitiesList = [
  { id: 1, name: "Atelier cohésion sociale Yamoussoukro", type: "Atelier", status: "Validée", progress: 100, budget: "2.5M FCFA", date: "15 Jan 2025" },
  { id: 2, name: "Visite terrain Daloa - Phase 2", type: "Mission", status: "En cours", progress: 65, budget: "1.8M FCFA", date: "14 Jan 2025" },
  { id: 3, name: "Rapport d'activités Q4 2024", type: "Rapport", status: "Brouillon", progress: 30, budget: "-", date: "13 Jan 2025" },
  { id: 4, name: "Formation gestionnaires OSC", type: "Formation", status: "Validée", progress: 100, budget: "3.2M FCFA", date: "12 Jan 2025" },
  { id: 5, name: "Réunion bilan semestriel", type: "Réunion", status: "Planifiée", progress: 0, budget: "500K FCFA", date: "18 Jan 2025" },
  { id: 6, name: "Audit interne procédures", type: "Audit", status: "En cours", progress: 45, budget: "800K FCFA", date: "10 Jan 2025" },
  { id: 7, name: "Campagne sensibilisation", type: "Campagne", status: "Validée", progress: 100, budget: "4.1M FCFA", date: "08 Jan 2025" },
  { id: 8, name: "Évaluation impact projets", type: "Évaluation", status: "Brouillon", progress: 15, budget: "-", date: "07 Jan 2025" },
];

// Rapports disponibles
const reportsList = [
  { title: "Rapport d'activités - Q4 2024", type: "Trimestriel", pages: 24, date: "05/01/2025", size: "2.4 MB" },
  { title: "Bilan financier annuel 2024", type: "Annuel", pages: 56, date: "02/01/2025", size: "5.8 MB" },
  { title: "État des lieux OSC partenaires", type: "Diagnostic", pages: 18, date: "28/12/2024", size: "1.9 MB" },
  { title: "Plan d'action 2025", type: "Stratégique", pages: 32, date: "20/12/2024", size: "3.1 MB" },
];

function getStatusConfig(status: string) {
  const configs: Record<string, { bg: string; text: string; dot: string }> = {
    "Validée": { bg: "bg-green-100", text: "text-green-700", dot: "bg-green-500" },
    "En cours": { bg: "bg-amber-100", text: "text-amber-700", dot: "bg-amber-500" },
    "Brouillon": { bg: "bg-slate-100", text: "text-slate-600", dot: "bg-slate-400" },
    "Planifiée": { bg: "bg-blue-100", text: "text-blue-700", dot: "bg-blue-500" },
  };
  return configs[status] || configs["Brouillon"];
}

// Composant compteur animé
function AnimatedCounter({ value, suffix = "" }: { value: number; suffix?: string }) {
  const [displayValue, setDisplayValue] = useState(0);
  
  useEffect(() => {
    const duration = 1500;
    const steps = 60;
    const increment = value / steps;
    let current = 0;
    
    const timer = setInterval(() => {
      current += increment;
      if (current >= value) {
        setDisplayValue(value);
        clearInterval(timer);
      } else {
        setDisplayValue(Math.floor(current));
      }
    }, duration / steps);
    
    return () => clearInterval(timer);
  }, [value]);
  
  return <span>{displayValue}{suffix}</span>;
}

export function DemoInteractive() {
  const [activeTab, setActiveTab] = useState<TabType>("dashboard");
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    
    const element = document.getElementById("demo");
    if (element) observer.observe(element);
    
    return () => observer.disconnect();
  }, []);

  const scrollToDemande = () => {
    const element = document.getElementById("demande");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const tabs: { id: TabType; label: string; icon: string }[] = [
    { id: "dashboard", label: "Tableau de bord", icon: "📊" },
    { id: "activities", label: "Activités", icon: "📋" },
    { id: "reports", label: "Rapports", icon: "📄" },
  ];

  return (
    <section 
      id="demo" 
      className="py-20 lg:py-28 bg-gradient-to-b from-slate-50 to-white relative overflow-hidden"
      aria-label="Démo interactive"
    >
      {/* Décorations de fond */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-[#F77F00]/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#009E60]/5 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* En-tête de section */}
        <div className={`text-center mb-12 lg:mb-16 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="inline-flex items-center gap-2 bg-[#F77F00]/10 text-[#F77F00] px-4 py-2 rounded-full text-sm font-semibold mb-4">
            <span className="w-2 h-2 bg-[#F77F00] rounded-full animate-pulse" />
            Démo Interactive
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#0F172A] mb-4">
            Voyez{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F77F00] to-[#FF9933]">
              e-OSCS
            </span>{" "}
            en action
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Explorez une prévisualisation fonctionnelle du tableau de bord. 
            Changez d&apos;onglet pour découvrir les différentes fonctionnalités.
          </p>
        </div>

        {/* Container du Dashboard Mockup */}
        <div className={`max-w-5xl mx-auto transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
          {/* Frame du navigateur */}
          <div className="bg-white rounded-2xl shadow-2xl shadow-slate-200/50 border border-slate-200 overflow-hidden">
            
            {/* Barre de titre style navigateur */}
            <div className="bg-gradient-to-r from-[#0F172A] to-slate-800 px-4 py-3 flex items-center gap-3">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <div className="w-3 h-3 rounded-full bg-green-500" />
              </div>
              <div className="flex-1 flex justify-center">
                <div className="bg-slate-700/50 rounded-lg px-4 py-1.5 flex items-center gap-2 max-w-md w-full">
                  <div className="w-4 h-4 rounded-full bg-[#F77F00]/80 flex items-center justify-center">
                    <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
                    </svg>
                  </div>
                  <span className="text-xs text-slate-300 font-medium">app.e-oscs.ci/dashboard</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="p-1.5 hover:bg-slate-700 rounded transition-colors">
                  <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Navigation principale du dashboard */}
            <div className="bg-white border-b border-slate-200 px-4 py-2 flex items-center justify-between">
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-[#F77F00] to-[#FF9933] rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-sm">eO</span>
                  </div>
                  <span className="font-bold text-[#0F172A] hidden sm:block">e-OSCS</span>
                </div>
                
                {/* Onglets interactifs */}
                <nav className="hidden md:flex items-center gap-1">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 flex items-center gap-2 ${
                        activeTab === tab.id
                          ? "bg-[#F77F00]/10 text-[#F77F00]"
                          : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                      }`}
                    >
                      <span>{tab.icon}</span>
                      {tab.label}
                    </button>
                  ))}
                </nav>
              </div>

              {/* Indicateur utilisateur */}
              <div className="flex items-center gap-3">
                <button className="relative p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
                </button>
                <div className="w-8 h-8 bg-gradient-to-br from-[#009E60] to-emerald-400 rounded-full flex items-center justify-center text-white text-xs font-bold">
                  AD
                </div>
              </div>
            </div>

            {/* Onglets mobiles */}
            <div className="md:hidden flex items-center gap-1 px-4 py-2 border-b border-slate-200 overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                    activeTab === tab.id
                      ? "bg-[#F77F00] text-white"
                      : "bg-slate-100 text-slate-600"
                  }`}
                >
                  {tab.icon} {tab.label}
                </button>
              ))}
            </div>

            {/* Contenu dynamique selon l'onglet */}
            <div className="bg-slate-50 min-h-[480px] lg:min-h-[520px] p-4 lg:p-6">
              
              {/* ===== ONGLET TABLEAU DE BORD ===== */}
              {activeTab === "dashboard" && (
                <div className="animate-fadeIn space-y-5">
                  {/* En-tête avec infos */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <h3 className="text-lg font-bold text-[#0F172A]">Tableau de bord</h3>
                      <p className="text-sm text-slate-500">Vue d&apos;ensemble • Janvier 2025</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                        Système opérationnel
                      </span>
                    </div>
                  </div>

                  {/* Grille KPIs */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
                    {kpiData.map((kpi, index) => (
                      <div
                        key={kpi.label}
                        className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm hover:shadow-md hover:border-[#F77F00]/30 transition-all duration-300 group cursor-pointer"
                        style={{ animationDelay: `${index * 100}ms` }}
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div 
                            className="w-10 h-10 rounded-lg flex items-center justify-center text-lg"
                            style={{ backgroundColor: `${kpi.color}15` }}
                          >
                            {kpi.icon}
                          </div>
                          <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                            kpi.change.startsWith('+') ? 'bg-green-100 text-green-600' : 'bg-amber-100 text-amber-600'
                          }`}>
                            {kpi.change}
                          </span>
                        </div>
                        <div className="text-2xl lg:text-3xl font-bold mb-1" style={{ color: kpi.color }}>
                          <AnimatedCounter value={kpi.value} suffix={kpi.suffix || ""} />
                        </div>
                        <p className="text-xs text-slate-500">{kpi.label}</p>
                      </div>
                    ))}
                  </div>

                  {/* Graphique + Tableau côte à côte sur grand écran */}
                  <div className="grid lg:grid-cols-5 gap-4">
                    {/* Graphique en barres */}
                    <div className="lg:col-span-3 bg-white rounded-xl p-4 lg:p-5 border border-slate-200 shadow-sm">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h4 className="font-semibold text-[#0F172A]">Activités par mois</h4>
                          <p className="text-xs text-slate-500">Semestre 1 • 2025</p>
                        </div>
                        <select className="text-xs bg-slate-100 border-0 rounded-lg px-3 py-1.5 text-slate-600 focus:ring-2 focus:ring-[#F77F00]/30">
                          <option>Ce semestre</option>
                          <option>Semestre précédent</option>
                          <option>Cette année</option>
                        </select>
                      </div>
                      
                      {/* Graphique CSS pur */}
                      <div className="flex items-end gap-2 sm:gap-3 h-44 lg:h-52 pt-4">
                        {chartData.map((bar, i) => (
                          <div key={bar.month} className="flex-1 flex flex-col items-center group">
                            <div className="relative w-full flex justify-center mb-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <span className="text-xs font-bold text-[#F77F00] bg-white px-2 py-1 rounded shadow-sm">
                                {bar.value}
                              </span>
                            </div>
                            <div
                              className="w-full rounded-t-lg bg-gradient-to-t from-[#F77F00] to-[#FFB366] transition-all duration-500 group-hover:from-[#E57200] group-hover:to-[#F77F00] cursor-pointer min-h-[8px]"
                              style={{ 
                                height: `${isVisible ? bar.value * 1.5 : 0}%`,
                                transitionDelay: `${i * 100 + 500}ms`
                              }}
                            />
                            <span className="text-xs text-slate-500 mt-2 font-medium">{bar.month}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Tableau activités récentes */}
                    <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                      <div className="px-4 py-3 bg-slate-50 border-b border-slate-200">
                        <h4 className="font-semibold text-[#0F172A] text-sm">Activités récentes</h4>
                      </div>
                      <div className="divide-y divide-slate-100">
                        {recentActivities.map((act, i) => {
                          const statusConfig = getStatusConfig(act.status);
                          return (
                            <div
                              key={i}
                              className="px-4 py-3 flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer group"
                            >
                              <div className="flex-1 min-w-0 mr-3">
                                <p className="text-sm text-[#0F172A] truncate group-hover:text-[#F77F00] transition-colors font-medium">
                                  {act.name}
                                </p>
                                <p className="text-xs text-slate-400">{act.department}</p>
                              </div>
                              <span className={`text-[10px] px-2 py-1 rounded-full font-medium whitespace-nowrap ${statusConfig.bg} ${statusConfig.text}`}>
                                <span className={`inline-block w-1.5 h-1.5 rounded-full mr-1 ${statusConfig.dot}`} />
                                {act.status}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                      <div className="px-4 py-3 bg-slate-50 border-t border-slate-200 text-center">
                        <button className="text-xs text-[#F77F00] font-medium hover:text-[#E57200] transition-colors">
                          Voir tout →
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ===== ONGLET ACTIVITÉS ===== */}
              {activeTab === "activities" && (
                <div className="animate-fadeIn space-y-4">
                  {/* En-tête et filtres */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <h3 className="text-lg font-bold text-[#0F172A]">Gestion des activités</h3>
                      <p className="text-sm text-slate-500">{activitiesList.length} activités trouvées</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="Rechercher..."
                          className="pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#F77F00]/30 focus:border-[#F77F00]"
                        />
                        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                      </div>
                      <button className="px-4 py-2 bg-[#F77F00] text-white rounded-lg text-sm font-medium hover:bg-[#E57200] transition-colors flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Nouvelle
                      </button>
                    </div>
                  </div>

                  {/* Filtres rapides */}
                  <div className="flex flex-wrap items-center gap-2">
                    {["Toutes", "Validée", "En cours", "Brouillon", "Planifiée"].map((filter) => (
                      <button
                        key={filter}
                        className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                          filter === "Toutes"
                            ? "bg-[#0F172A] text-white"
                            : "bg-white text-slate-600 border border-slate-200 hover:border-[#F77F00] hover:text-[#F77F00]"
                        }`}
                      >
                        {filter}
                      </button>
                    ))}
                  </div>

                  {/* Tableau des activités */}
                  <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                    {/* Header tableau */}
                    <div className="hidden sm:grid grid-cols-12 gap-4 px-4 py-3 bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                      <div className="col-span-4">Activité</div>
                      <div className="col-span-2">Type</div>
                      <div className="col-span-2">Statut</div>
                      <div className="col-span-2">Progression</div>
                      <div className="col-span-2">Budget</div>
                    </div>

                    {/* Lignes du tableau */}
                    <div className="divide-y divide-slate-100">
                      {activitiesList.map((activity) => {
                        const statusConfig = getStatusConfig(activity.status);
                        return (
                          <div
                            key={activity.id}
                            className="grid grid-cols-1 sm:grid-cols-12 gap-2 sm:gap-4 px-4 py-4 hover:bg-slate-50/80 transition-colors cursor-pointer group"
                          >
                            <div className="sm:col-span-4">
                              <p className="text-sm font-medium text-[#0F172A] group-hover:text-[#F77F00] transition-colors">
                                {activity.name}
                              </p>
                              <p className="text-xs text-slate-400 sm:hidden mt-1">{activity.type} • {activity.date}</p>
                            </div>
                            <div className="sm:col-span-2 hidden sm:block">
                              <span className="text-sm text-slate-600">{activity.type}</span>
                            </div>
                            <div className="sm:col-span-2">
                              <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${statusConfig.bg} ${statusConfig.text}`}>
                                <span className={`w-1.5 h-1.5 rounded-full ${statusConfig.dot}`} />
                                {activity.status}
                              </span>
                            </div>
                            <div className="sm:col-span-2 hidden sm:block">
                              <div className="flex items-center gap-2">
                                <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                                  <div
                                    className="h-full rounded-full transition-all duration-1000"
                                    style={{
                                      width: `${activity.progress}%`,
                                      backgroundColor: activity.progress === 100 ? '#009E60' : activity.progress > 50 ? '#F77F00' : '#D97706'
                                    }}
                                  />
                                </div>
                                <span className="text-xs text-slate-500 w-8">{activity.progress}%</span>
                              </div>
                            </div>
                            <div className="sm:col-span-2 hidden sm:block">
                              <span className="text-sm text-slate-600 font-medium">{activity.budget}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Pagination */}
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-slate-500">Affichage 1-{activitiesList.length} sur {activitiesList.length}</p>
                    <div className="flex items-center gap-1">
                      <button className="px-3 py-1.5 rounded-lg text-sm text-slate-400 bg-slate-100 cursor-not-allowed">Précédent</button>
                      <button className="px-3 py-1.5 rounded-lg text-sm text-slate-400 bg-slate-100 cursor-not-allowed">Suivant</button>
                    </div>
                  </div>
                </div>
              )}

              {/* ===== ONGLET RAPPORTS ===== */}
              {activeTab === "reports" && (
                <div className="animate-fadeIn space-y-4">
                  {/* En-tête */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <h3 className="text-lg font-bold text-[#0F172A]">Centre de rapports</h3>
                      <p className="text-sm text-slate-500">Générez et téléchargez vos documents</p>
                    </div>
                    <button className="px-4 py-2 bg-[#009E60] text-white rounded-lg text-sm font-medium hover:bg-[#008050] transition-colors flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      Générer un rapport
                    </button>
                  </div>

                  <div className="grid lg:grid-cols-3 gap-4">
                    {/* Liste des rapports */}
                    <div className="lg:col-span-2 space-y-3">
                      {reportsList.map((report, index) => (
                        <div
                          key={index}
                          className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm hover:shadow-md hover:border-[#009E60]/30 transition-all duration-300 cursor-pointer group"
                        >
                          <div className="flex items-start gap-4">
                            {/* Icône PDF */}
                            <div className="w-12 h-14 bg-gradient-to-br from-red-500 to-red-600 rounded-lg flex flex-col items-center justify-center text-white shadow-sm flex-shrink-0">
                              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6zm-1 2l5 5h-5V4zM6 20V4h6v6h6v10H6z"/>
                              </svg>
                              <span className="text-[8px] font-bold mt-0.5">PDF</span>
                            </div>
                            
                            <div className="flex-1 min-w-0">
                              <h4 className="font-semibold text-[#0F172A] group-hover:text-[#009E60] transition-colors text-sm">
                                {report.title}
                              </h4>
                              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1.5">
                                <span className="text-xs text-slate-500 flex items-center gap-1">
                                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                                  </svg>
                                  {report.type}
                                </span>
                                <span className="text-xs text-slate-500 flex items-center gap-1">
                                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                  </svg>
                                  {report.date}
                                </span>
                                <span className="text-xs text-slate-500">{report.pages} pages</span>
                                <span className="text-xs text-slate-400">{report.size}</span>
                              </div>
                            </div>

                            <button className="p-2 text-slate-400 hover:text-[#009E60] hover:bg-[#009E60]/10 rounded-lg transition-all opacity-0 group-hover:opacity-100">
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Aperçu PDF */}
                    <div className="lg:col-span-1">
                      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden sticky top-4">
                        <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                          <h4 className="font-semibold text-[#0F172A] text-sm">Aperçu</h4>
                          <button className="text-xs text-[#F77F00] font-medium hover:text-[#E57200]">
                            Plein écran
                          </button>
                        </div>
                        
                        {/* Mockup document PDF */}
                        <div className="p-4 bg-slate-100">
                          <div className="bg-white rounded-lg shadow-md overflow-hidden">
                            {/* En-tête document */}
                            <div className="bg-gradient-to-r from-[#0F172A] to-slate-700 p-4">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                                  <span className="text-white font-bold text-sm">eO</span>
                                </div>
                                <div>
                                  <p className="text-white font-semibold text-sm">e-OSCS</p>
                                  <p className="text-white/60 text-[10px]">Rapport d&apos;activités</p>
                                </div>
                              </div>
                            </div>
                            
                            {/* Contenu document mockup */}
                            <div className="p-4 space-y-3">
                              <div className="h-3 bg-slate-200 rounded w-3/4" />
                              <div className="h-3 bg-slate-100 rounded w-full" />
                              <div className="h-3 bg-slate-100 rounded w-5/6" />
                              
                              <div className="pt-2">
                                <div className="h-2 bg-[#F77F00]/20 rounded w-1/3 mb-2" />
                                <div className="h-3 bg-slate-100 rounded w-full mb-1.5" />
                                <div className="h-3 bg-slate-100 rounded w-4/5 mb-1.5" />
                                <div className="h-3 bg-slate-100 rounded w-11/12" />
                              </div>
                              
                              <div className="pt-2">
                                <div className="h-2 bg-[#009E60]/20 rounded w-1/2 mb-2" />
                                <div className="grid grid-cols-2 gap-2">
                                  <div className="h-16 bg-slate-50 rounded border border-slate-100" />
                                  <div className="h-16 bg-slate-50 rounded border border-slate-100" />
                                </div>
                              </div>
                              
                              <div className="pt-2">
                                <div className="h-3 bg-slate-100 rounded w-2/3 mb-1.5" />
                                <div className="h-3 bg-slate-100 rounded w-1/2" />
                              </div>
                            </div>
                            
                            {/* Pied de page document */}
                            <div className="px-4 py-2 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                              <span className="text-[9px] text-slate-400">Page 1 / 24</span>
                              <span className="text-[9px] text-slate-400">e-OSCS © 2025</span>
                            </div>
                          </div>
                          
                          <p className="text-center text-xs text-slate-400 mt-3">
                            Cliquez pour voir le rapport complet
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Footer du dashboard */}
            <div className="bg-white border-t border-slate-200 px-4 py-3 flex items-center justify-between">
              <p className="text-xs text-slate-400">
                Dernière synchronisation: Il y a 2 minutes
              </p>
              <div className="flex items-center gap-3">
                <button className="text-xs text-slate-500 hover:text-[#0F172A] transition-colors flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Actualiser
                </button>
                <button className="text-xs text-slate-500 hover:text-[#0F172A] transition-colors flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Paramètres
                </button>
              </div>
            </div>
          </div>

          {/* Bouton CTA sous le dashboard */}
          <div className="text-center mt-10">
            <button
              onClick={scrollToDemande}
              className="group inline-flex items-center gap-3 bg-gradient-to-r from-[#F77F00] to-[#FF9933] text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-lg shadow-[#F77F00]/25 hover:shadow-xl hover:shadow-[#F77F00]/30 hover:-translate-y-0.5 transition-all duration-300"
            >
              <span>Essayer la démo complète</span>
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </button>
            <p className="mt-3 text-sm text-slate-500">
              Accès instantané • Sans engagement • Support dédié
            </p>
          </div>
        </div>
      </div>

      {/* Styles CSS pour animations */}
      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.4s ease-out forwards;
        }
      `}</style>
    </section>
  );
}
