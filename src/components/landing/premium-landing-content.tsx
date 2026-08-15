"use client";

import React from "react";

/* ============================================
   LANDING PAGE CONTENT e-OSCS PREMIUM
   Client Component - Production Ready
   ============================================ */
export function PremiumLandingContent() {
  return (
    <>
      <style jsx global>{`
        /* === TYPOGRAPHIE DE BASE === */
        body {
          font-family: var(--font-inter), system-ui, -apple-system, sans-serif;
          font-size: 16px;
          line-height: 1.7;
          color: #172033;
        }
        
        h1, h2, h3, .heading-font {
          font-family: var(--font-sora), system-ui, sans-serif;
          line-height: 1.15;
          letter-spacing: -0.02em;
        }
        
        /* === ANIMATIONS AU SCROLL === */
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(24px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-on-scroll {
          opacity: 0;
        }
        
        .animate-on-scroll.is-visible {
          animation: fadeInUp 0.6s ease-out forwards;
        }
        
        .animate-on-scroll.delay-1 { animation-delay: 80ms; }
        .animate-on-scroll.delay-2 { animation-delay: 160ms; }
        .animate-on-scroll.delay-3 { animation-delay: 240ms; }
        .animate-on-scroll.delay-4 { animation-delay: 320ms; }
        
        /* Respect reduced motion */
        @media (prefers-reduced-motion: reduce) {
          .animate-on-scroll {
            opacity: 1;
            animation: none !important;
          }
        }
        
        /* === EFFET MAGNÉTIQUE SUR CTAs === */
        @media (hover: hover) and (pointer: fine) {
          .magnetic-btn {
            transition: transform 0.15s ease-out;
          }
        }
        
        /* === MOTIFS AFRICAINS DISCRETS === */
        .african-pattern {
          background-image: 
            linear-gradient(30deg, rgba(247, 127, 0, 0.04) 12%, transparent 12.5%, transparent 87%, rgba(247, 127, 0, 0.04) 87.5%, rgba(247, 127, 0, 0.04)),
            linear-gradient(150deg, rgba(0, 158, 96, 0.04) 12%, transparent 12.5%, transparent 87%, rgba(0, 158, 96, 0.04) 87.5%, rgba(0, 158, 96, 0.04)),
            linear-gradient(30deg, rgba(247, 127, 0, 0.04) 12%, transparent 12.5%, transparent 87%, rgba(247, 127, 0, 0.04) 87.5%, rgba(247, 127, 0, 0.04)),
            linear-gradient(150deg, rgba(0, 158, 96, 0.04) 12%, transparent 12.5%, transparent 87%, rgba(0, 158, 96, 0.04) 87.5%, rgba(0, 158, 96, 0.04)),
            linear-gradient(60deg, rgba(247, 127, 0, 0.03) 25%, transparent 25.5%, transparent 75%, rgba(247, 127, 0, 0.03) 75%, rgba(247, 127, 0, 0.03)),
            linear-gradient(60deg, rgba(0, 158, 96, 0.03) 25%, transparent 25.5%, transparent 75%, rgba(0, 158, 96, 0.03) 75%, rgba(0, 158, 96, 0.03));
          background-size: 80px 140px;
          background-position: 0 0, 0 0, 40px 70px, 40px 70px, 0 0, 40px 70px;
        }
        
        /* === MOCKUP 3D EFFECT === */
        .mockup-container {
          perspective: 1200px;
        }
        
        .mockup-card {
          transition: transform 0.4s ease-out;
          transform-style: preserve-3d;
        }
        
        @media (hover: hover) and (pointer: fine) {
          .mockup-card:hover {
            transform: rotateY(-2deg) rotateX(1deg) scale(1.01);
          }
        }
        
        /* === PROGRESS LINE ANIMATION === */
        .progress-line {
          background: linear-gradient(to bottom, #009E60, #F77F00);
        }
        
        .progress-line-animated {
          background: linear-gradient(to bottom, #009E60, #F77F00);
          animation: progressGrow 1.5s ease-out forwards;
          transform-origin: top;
        }
        
        @keyframes progressGrow {
          from { transform: scaleY(0); }
          to { transform: scaleY(1); }
        }
      `}</style>

      {/* Script pour animations au scroll */}
      <script
        dangerouslySetInnerHTML={{
          __html: `
            document.addEventListener('DOMContentLoaded', function() {
              // Vérifier reduced motion preference
              const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
              
              if (!prefersReducedMotion) {
                const observer = new IntersectionObserver((entries) => {
                  entries.forEach(entry => {
                    if (entry.isIntersecting) {
                      entry.target.classList.add('is-visible');
                      observer.unobserve(entry.target);
                    }
                  });
                }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
                
                document.querySelectorAll('.animate-on-scroll').forEach(el => {
                  observer.observe(el);
                });
                
                // Animation ligne de progression
                const progressObserver = new IntersectionObserver((entries) => {
                  entries.forEach(entry => {
                    if (entry.isIntersecting) {
                      entry.target.classList.add('progress-line-animated');
                      progressObserver.unobserve(entry.target);
                    }
                  });
                }, { threshold: 0.5 });
                
                document.querySelectorAll('.progress-line').forEach(el => {
                  progressObserver.observe(el);
                });
              } else {
                // Si reduced motion, tout afficher directement
                document.querySelectorAll('.animate-on-scroll').forEach(el => {
                  el.style.opacity = '1';
                });
              }
              
              // Effet magnétique sur les boutons
              if (!prefersReducedMotion && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
                document.querySelectorAll('.magnetic-btn').forEach(btn => {
                  btn.addEventListener('mousemove', function(e) {
                    const rect = this.getBoundingClientRect();
                    const x = e.clientX - rect.left - rect.width / 2;
                    const y = e.clientY - rect.top - rect.height / 2;
                    this.style.transform = 'translate(' + (x * 0.15) + 'px, ' + (y * 0.15) + 'px)';
                  });
                  
                  btn.addEventListener('mouseleave', function() {
                    this.style.transform = 'translate(0, 0)';
                  });
                });
              }
            });
          `,
        }}
      />

      {/* ==========================================
          LANDING PAGE PRINCIPALE
          ========================================== */}
      <main className="min-h-screen bg-[#FFFBF5] overflow-hidden">
        
        {/* ===== LISERÉ TRICOLORE CI EN TÊTE DE PAGE ===== */}
        <div className="h-1 w-full flex" role="presentation">
          <div className="flex-1 bg-[#F77F00]" /> {/* Orange CI */}
          <div className="flex-1 bg-white" />
          <div className="flex-1 bg-[#009E60]" /> {/* Vert CI */}
        </div>

        {/* ===== 1. HEADER STICKY GLASSMORPHISM ===== */}
        <header
          id="header"
          className="fixed top-1 left-0 right-0 z-50 transition-all duration-300"
          role="banner"
        >
          <nav
            className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
            aria-label="Navigation principale"
          >
            <div className="flex items-center justify-between h-16 md:h-20">
              {/* Logo e-OSCS avec couleurs distinctes */}
              <a href="/" className="flex items-center gap-2 group" aria-label="e-OSCS - Accueil">
                <span className="text-2xl font-extrabold text-[#009E60]">e</span>
                <span className="text-2xl font-extrabold text-[#F77F00]">OSCS</span>
              </a>

              {/* Navigation desktop */}
              <ul className="hidden md:flex items-center gap-6 lg:gap-8" role="list">
                <li>
                  <a href="#problemes" className="text-sm font-medium text-slate-600 hover:text-[#F77F00] transition-colors">
                    Problèmes
                  </a>
                </li>
                <li>
                  <a href="#fonctionnalites" className="text-sm font-medium text-slate-600 hover:text-[#F77F00] transition-colors">
                    Fonctionnalités
                  </a>
                </li>
                <li>
                  <a href="#tarifs" className="text-sm font-medium text-slate-600 hover:text-[#F77F00] transition-colors">
                    Tarifs
                  </a>
                </li>
                <li>
                  <a href="#faq" className="text-sm font-medium text-slate-600 hover:text-[#F77F00] transition-colors">
                    FAQ
                  </a>
                </li>
              </ul>

              {/* CTA discret outline */}
              <a
                href="#demande"
                className="hidden sm:inline-flex items-center px-5 py-2.5 text-sm font-semibold text-[#F77F00] border-2 border-[#F77F00] rounded-xl hover:bg-orange-50 transition-all magnetic-btn"
              >
                Demander mon espace
              </a>

              {/* Menu mobile button */}
              <button
                type="button"
                id="mobile-menu-btn"
                className="md:hidden p-2 rounded-lg text-slate-700 hover:bg-slate-100"
                aria-label="Ouvrir le menu"
                aria-expanded="false"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>

            {/* Menu mobile (caché par défaut) */}
            <div id="mobile-menu" className="md:hidden hidden bg-white/95 backdrop-blur-lg rounded-2xl shadow-xl border border-slate-100 mt-2 p-4 mb-4">
              <nav aria-label="Navigation mobile">
                <ul className="space-y-1" role="list">
                  {["Problèmes", "Fonctionnalités", "Tarifs", "FAQ"].map((item) => (
                    <li key={item}>
                      <a
                        href={`#${item.toLowerCase()}`}
                        className="block px-4 py-3 text-slate-700 hover:text-[#F77F00] hover:bg-orange-50 rounded-lg font-medium transition-colors"
                      >
                        {item}
                      </a>
                    </li>
                  ))}
                </ul>
                <div className="pt-4 mt-4 border-t border-slate-100">
                  <a
                    href="#demande"
                    className="block w-full px-5 py-3 text-center text-sm font-semibold text-white bg-[#F77F00] rounded-xl hover:bg-[#E67300] transition-colors"
                  >
                    Demander mon espace
                  </a>
                </div>
              </nav>
            </div>
          </nav>
        </header>

        {/* ===== 2. HERO SECTION ===== */}
        <section
          className="relative min-h-screen flex items-center pt-20 pb-32 african-pattern overflow-hidden"
          aria-label="Section principale"
        >
          {/* Dégradés de fond subtils */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-20 right-10 w-96 h-96 bg-[#F77F00]/5 rounded-full blur-3xl" />
            <div className="absolute bottom-20 left-10 w-80 h-80 bg-[#009E60]/5 rounded-full blur-3xl" />
          </div>

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              {/* Contenu texte Hero */}
              <div className="text-center lg:text-left space-y-8 animate-on-scroll">
                {/* Eyebrow ministère + mini-liseré tricolore */}
                <div className="inline-flex items-center gap-3">
                  <div className="h-px w-8 bg-[#F77F00]" />
                  <span className="text-sm font-medium text-slate-500 tracking-wide uppercase">
                    Ministère de la Cohésion Nationale — Côte d&apos;Ivoire
                  </span>
                  <div className="h-px w-8 bg-[#009E60]" />
                </div>

                {/* Titre accrocheur PROBLÈME */}
                <h1 className="text-4xl sm:text-5xl lg:text-[56px] xl:text-[64px] font-extrabold text-[#0F172A] leading-[1.1]">
                  Fini les rapports trimestriels bricolés sur Word et Excel.
                </h1>

                {/* Sous-titre explicatif */}
                <p className="text-lg sm:text-xl text-slate-600 leading-relaxed max-w-xl mx-auto lg:mx-0">
                  e-OSCS transforme chaque activité saisie une seule fois en rapports institutionnels prêts à présenter — validation, consolidation et indicateurs inclus.
                </p>

                {/* CTAs principaux */}
                <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start pt-4">
                  <a
                    href="#demande"
                    className="magnetic-btn inline-flex items-center justify-center px-8 py-4 text-base font-semibold text-white bg-[#F77F00] rounded-2xl shadow-lg shadow-orange-500/25 hover:bg-[#E67300] hover:shadow-xl hover:shadow-orange-500/30 transition-all"
                  >
                    Demander mon espace
                    <svg className="ml-2 w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </a>
                  <a
                    href="#demo"
                    className="magnetic-btn inline-flex items-center justify-center px-8 py-4 text-base font-semibold text-[#009E60] border-2 border-[#009E60] rounded-2xl hover:bg-green-50 transition-all"
                  >
                    <svg className="mr-2 w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                    Voir la démo
                  </a>
                </div>
              </div>

              {/* MOCKUP DASHBOARD CSS PUR */}
              <div className="mockup-container animate-on-scroll delay-2">
                <div className="mockup-card relative">
                  {/* Fenêtre navigateur */}
                  <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden" style={{ boxShadow: '0 8px 30px rgb(15 23 42 / .06)' }}>
                    
                    {/* Barre titre fenêtre */}
                    <div className="bg-gradient-to-r from-[#0F172A] to-[#1E293B] px-4 py-3 flex items-center gap-3">
                      <div className="flex items-center gap-1.5">
                        <div className="w-3 h-3 rounded-full bg-red-500/80" />
                        <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                        <div className="w-3 h-3 rounded-full bg-green-500/80" />
                      </div>
                      <div className="flex-1 flex justify-center">
                        <div className="bg-slate-700/50 rounded-lg px-4 py-1 text-xs text-slate-300">
                          dashboard.e-oscs.ci / Direction Régionale d&apos;Abidjan
                        </div>
                      </div>
                    </div>

                    <div className="flex">
                      {/* Sidebar sombre */}
                      <div className="hidden sm:block w-44 bg-[#0F172A] p-3 space-y-1">
                        {/* Logo sidebar */}
                        <div className="flex items-center gap-2 px-3 py-3 mb-4">
                          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#F77F00] to-[#009E60] flex items-center justify-center">
                            <span className="text-white font-bold text-sm">e</span>
                          </div>
                          <span className="text-white font-bold text-sm">e-OSCS</span>
                        </div>
                        
                        {/* Items menu */}
                        {[
                          { label: "Tableau de bord", active: true },
                          { label: "Plan annuel", active: false },
                          { label: "Activités", active: false },
                          { label: "Validation", active: false, badge: "3" },
                          { label: "Rapports", active: false },
                          { label: "Indicateurs", active: false },
                        ].map((item) => (
                          <div
                            key={item.label}
                            className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-xs font-medium cursor-pointer transition-colors ${
                              item.active ? "bg-[#F77F00] text-white" : "text-slate-400 hover:bg-white/5 hover:text-white"
                            }`}
                          >
                            <span className="flex-1">{item.label}</span>
                            {item.badge && (
                              <span className="w-5 h-5 rounded-full bg-red-500 text-white text-[10px] flex items-center justify-center">
                                {item.badge}
                              </span>
                            )}
                          </div>
                        ))}
                      </div>

                      {/* Contenu principal mockup */}
                      <div className="flex-1 p-4 sm:p-5 bg-[#F8FAFC] min-w-0">
                        {/* Badge trimestre clôturé */}
                        <div className="mb-4 inline-flex items-center gap-2 px-3 py-1.5 bg-green-100 text-green-800 rounded-full text-xs font-semibold">
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                          T2 2026 clôturé ✓
                        </div>

                        {/* Cartes KPI */}
                        <div className="grid grid-cols-3 gap-3 mb-4">
                          {/* KPI 1 */}
                          <div className="bg-white rounded-xl p-3 border border-slate-100 shadow-sm">
                            <div className="flex items-center gap-2 mb-2">
                              <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center">
                                <svg className="w-4 h-4 text-[#F77F00]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                              </div>
                            </div>
                            <p className="text-[10px] text-slate-500 uppercase tracking-wide">Activités validées</p>
                            <p className="text-xl font-bold text-slate-900">124</p>
                          </div>
                          
                          {/* KPI 2 */}
                          <div className="bg-white rounded-xl p-3 border border-slate-100 shadow-sm">
                            <div className="flex items-center gap-2 mb-2">
                              <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center">
                                <svg className="w-4 h-4 text-[#009E60]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                              </div>
                            </div>
                            <p className="text-[10px] text-slate-500 uppercase tracking-wide">Bénéficiaires</p>
                            <p className="text-xl font-bold text-slate-900">8&nbsp;540</p>
                          </div>
                          
                          {/* KPI 3 */}
                          <div className="bg-white rounded-xl p-3 border border-slate-100 shadow-sm">
                            <div className="flex items-center gap-2 mb-2">
                              <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                                <svg className="w-4 h-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                </svg>
                              </div>
                            </div>
                            <p className="text-[10px] text-slate-500 uppercase tracking-wide">Taux plan</p>
                            <p className="text-xl font-bold text-slate-900">78<span className="text-sm text-slate-500">%</span></p>
                          </div>
                        </div>

                        {/* Mini bar-chart vert/orange */}
                        <div className="bg-white rounded-xl p-4 border border-slate-100 shadow-sm">
                          <p className="text-xs font-semibold text-slate-700 mb-3">Réalisation par trimestre</p>
                          <div className="space-y-2">
                            {[
                              { label: "T1", planned: 90, realized: 75 },
                              { label: "T2", planned: 95, realized: 92 },
                              { label: "T3", planned: 88, realized: 45 },
                              { label: "T4", planned: 85, realized: 20 },
                            ].map((bar) => (
                              <div key={bar.label} className="flex items-center gap-2">
                                <span className="text-[10px] text-slate-500 w-6">{bar.label}</span>
                                <div className="flex-1 h-4 bg-slate-100 rounded overflow-hidden flex">
                                  <div 
                                    className="bg-[#F77F00]/30 h-full" 
                                    style={{ width: `${bar.planned}%` }}
                                  />
                                  <div 
                                    className="bg-[#009E60] h-full" 
                                    style={{ width: `${bar.realized}%` }}
                                  />
                                </div>
                              </div>
                            ))}
                          </div>
                          <div className="flex items-center gap-4 mt-3 text-[10px] text-slate-500">
                            <span className="flex items-center gap-1">
                              <span className="w-2 h-2 rounded bg-[#F77F00]/50" /> Prévu
                            </span>
                            <span className="flex items-center gap-1">
                              <span className="w-2 h-2 rounded bg-[#009E60]" /> Réalisé
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bandeau preuve sous mockup */}
                <p className="text-center text-sm text-slate-500 italic mt-6 animate-on-scroll delay-3">
                  « Désormais les DR/DD passent d&apos;une semaine de consolidation à 20 minutes »
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ===== 3. SECTION PROBLÈME ("Vous reconnaissez ?") ===== */}
        <section id="problemes" className="py-24 lg:py-32 bg-white relative" aria-label="Les problèmes actuels">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Titre section */}
            <div className="text-center max-w-3xl mx-auto mb-16 animate-on-scroll">
              <span className="inline-block px-4 py-1.5 bg-orange-100 text-[#F77F00] text-sm font-semibold rounded-full mb-4">
                Vous reconnaissez ?
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-[44px] font-extrabold text-[#0F172A] mb-4">
                Les défis du reporting trimestriel
              </h2>
              <p className="text-lg text-slate-600">
                Chaque trimestre, le même calvaire se répète dans nos Directions.
              </p>
            </div>

            {/* 3 cartes problème */}
            <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
              {/* Carte 1 : Ressaisie */}
              <article className="animate-on-scroll delay-1 group bg-[#FFFBF5] rounded-2xl p-8 border border-orange-100 hover:border-[#F77F00]/30 hover:shadow-lg transition-all duration-300" style={{ boxShadow: '0 8px 30px rgb(15 23 42 / .06)' }}>
                <div className="w-14 h-14 rounded-2xl bg-orange-100 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <svg className="w-7 h-7 text-[#F77F00]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-[#0F172A] mb-3">
                  La ressaisie sans fin
                </h3>
                <p className="text-slate-600 leading-relaxed">
                  Chaque trimestre, les mêmes données recopiées d&apos;Excel vers Word, avec des chiffres qui ne concordent jamais.
                </p>
              </article>

              {/* Carte 2 : Validation chronophage */}
              <article className="animate-on-scroll delay-2 group bg-[#FFFBF5] rounded-2xl p-8 border border-orange-100 hover:border-[#F77F00]/30 hover:shadow-lg transition-all duration-300" style={{ boxShadow: '0 8px 30px rgb(15 23 42 / .06)' }}>
                <div className="w-14 h-14 rounded-2xl bg-red-100 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <svg className="w-7 h-7 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-[#0F172A] mb-3">
                  La validation chronophage
                </h3>
                <p className="text-slate-600 leading-relaxed">
                  Activités envoyées par email ou WhatsApp, sans traçabilité : qui a validé quoi, quand, pourquoi ?
                </p>
              </article>

              {/* Carte 3 : Indicateurs introuvables */}
              <article className="animate-on-scroll delay-3 group bg-[#FFFBF5] rounded-2xl p-8 border border-orange-100 hover:border-[#F77F00]/30 hover:shadow-lg transition-all duration-300" style={{ boxShadow: '0 8px 30px rgb(15 23 42 / .06)' }}>
                <div className="w-14 h-14 rounded-2xl bg-blue-100 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <svg className="w-7 h-7 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-[#0F172A] mb-3">
                  Des indicateurs introuvables
                </h3>
                <p className="text-slate-600 leading-relaxed">
                  Bénéficiaires éparpillés dans des cahiers : impossible de répondre vite au niveau central.
                </p>
              </article>
            </div>
          </div>
        </section>

        {/* ===== 4. SECTION FONCTIONNALITÉS ===== */}
        <section id="fonctionnalites" className="py-24 lg:py-32 bg-[#F8FAFC] relative african-pattern" aria-label="Fonctionnalités">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Titre section */}
            <div className="text-center max-w-3xl mx-auto mb-16 animate-on-scroll">
              <span className="inline-block px-4 py-1.5 bg-green-100 text-[#009E60] text-sm font-semibold rounded-full mb-4">
                La solution e-OSCS
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-[44px] font-extrabold text-[#0F172A] mb-4">
                Tout ce qu&apos;il vous faut, rien de superflu
              </h2>
              <p className="text-lg text-slate-600">
                Quatre piliers pour transformer votre reporting trimestriel.
              </p>
            </div>

            {/* 4 cartes fonctionnalités avec icônes SVG inline */}
            <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
              {/* Feature 1 : Saisie unique */}
              <article className="animate-on-scroll delay-1 bg-white rounded-2xl p-8 lg:p-10 border border-slate-100 hover:border-[#009E60]/30 hover:shadow-xl transition-all duration-300 group" style={{ boxShadow: '0 8px 30px rgb(15 23 42 / .06)' }}>
                <div className="flex items-start gap-6">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#F77F00] to-[#FF9933] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                    <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-[#0F172A] mb-3">
                      Saisie unique, exploitée partout
                    </h3>
                    <p className="text-slate-600 leading-relaxed mb-4">
                      Guide pas-à-pas, anti-doublon, photos et pièces jointes. Une seule saisie qui alimente automatiquement tous vos rapports.
                    </p>
                    <ul className="space-y-2">
                      {["Formulaire intelligent par type d'activité", "Détection automatique des doublons", "Photos et preuves jointes"].map((item) => (
                        <li key={item} className="flex items-center gap-2 text-sm text-slate-600">
                          <svg className="w-4 h-4 text-[#009E60] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </article>

              {/* Feature 2 : Workflow validation */}
              <article className="animate-on-scroll delay-2 bg-white rounded-2xl p-8 lg:p-10 border border-slate-100 hover:border-[#009E60]/30 hover:shadow-xl transition-all duration-300 group" style={{ boxShadow: '0 8px 30px rgb(15 23 42 / .06)' }}>
                <div className="flex items-start gap-6">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#009E60] to-[#10B981] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                    <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-[#0F172A] mb-3">
                      Workflow de validation tracé
                    </h3>
                    <p className="text-slate-600 leading-relaxed mb-4">
                      Brouillon → Soumis → Validé → Consolidé ; chaque décision est datée, motivée et historisée.
                    </p>
                    <ul className="space-y-2">
                      {["Chaîne de validation configurable", "Historique complet des décisions", "Notifications automatiques"].map((item) => (
                        <li key={item} className="flex items-center gap-2 text-sm text-slate-600">
                          <svg className="w-4 h-4 text-[#009E60] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </article>

              {/* Feature 3 : Rapports auto */}
              <article className="animate-on-scroll delay-3 bg-white rounded-2xl p-8 lg:p-10 border border-slate-100 hover:border-[#009E60]/30 hover:shadow-xl transition-all duration-300 group" style={{ boxShadow: '0 8px 30px rgb(15 23 42 / .06)' }}>
                <div className="flex items-start gap-6">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-blue-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                    <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-[#0F172A] mb-3">
                      Rapports Word &amp; PowerPoint en un clic
                    </h3>
                    <p className="text-slate-600 leading-relaxed mb-4">
                      Canevas national, 15 sections générées automatiquement, nommage normalisé conforme aux standards MCNSLP.
                    </p>
                    <ul className="space-y-2">
                      {["Document Word formaté prêt à imprimer", "Présentation PowerPoint incluse", "Archivage automatique daté"].map((item) => (
                        <li key={item} className="flex items-center gap-2 text-sm text-slate-600">
                          <svg className="w-4 h-4 text-[#009E60] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </article>

              {/* Feature 4 : Indicateurs consolidés */}
              <article className="animate-on-scroll delay-4 bg-white rounded-2xl p-8 lg:p-10 border border-slate-100 hover:border-[#009E60]/30 hover:shadow-xl transition-all duration-300 group" style={{ boxShadow: '0 8px 30px rgb(15 23 42 / .06)' }}>
                <div className="flex items-start gap-6">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-600 to-purple-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                    <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-[#0F172A] mb-3">
                      Indicateurs consolidés T1 → annuel
                    </h3>
                    <p className="text-slate-600 leading-relaxed mb-4">
                      Tableau « Indicateur | T1 | T2 | T3 | T4 | Total » calculé seul, exportable en un instant.
                    </p>
                    <ul className="space-y-2">
                      {["Consolidation automatique par période", "Comparaison année précédente", "Export Excel pour analyses"].map((item) => (
                        <li key={item} className="flex items-center gap-2 text-sm text-slate-600">
                          <svg className="w-4 h-4 text-[#009E60] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </article>
            </div>
          </div>
        </section>

        {/* ===== 5. SECTION COMMENT ÇA MARCHE ===== */}
        <section id="comment-ca-marche" className="py-24 lg:py-32 bg-white relative" aria-label="Comment ça marche">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Titre section */}
            <div className="text-center max-w-3xl mx-auto mb-16 animate-on-scroll">
              <span className="inline-block px-4 py-1.5 bg-blue-100 text-blue-700 text-sm font-semibold rounded-full mb-4">
                En 3 étapes simples
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-[44px] font-extrabold text-[#0F172A] mb-4">
                Comment ça marche ?
              </h2>
              <p className="text-lg text-slate-600">
                De la demande à vos premiers rapports, en moins de 48 heures.
              </p>
            </div>

            {/* 3 étapes numérotées avec ligne de progression */}
            <div className="relative max-w-4xl mx-auto">
              {/* Ligne de progression verticale (desktop) */}
              <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-slate-200 -translate-x-1/2">
                <div className="progress-line w-full h-0" />
              </div>

              <div className="space-y-12 md:space-y-16">
                {/* Étape 01 */}
                <div className="animate-on-scroll delay-1 relative flex flex-col md:flex-row items-center gap-8">
                  <div className="md:w-1/2 md:text-right order-2 md:order-1">
                    <div className="bg-[#FFFBF5] rounded-2xl p-8 border border-orange-100" style={{ boxShadow: '0 8px 30px rgb(15 23 42 / .06)' }}>
                      <h3 className="text-2xl font-bold text-[#0F172A] mb-3">
                        Demandez votre espace
                      </h3>
                      <p className="text-slate-600 leading-relaxed">
                        Demande en ligne, paiement Mobile Money, code d&apos;activation sous 24h ouvrées.
                      </p>
                    </div>
                  </div>
                  
                  {/* Numéro étape */}
                  <div className="order-1 md:order-2 relative z-10 w-16 h-16 rounded-full bg-gradient-to-br from-[#F77F00] to-[#FF9933] flex items-center justify-center shadow-lg shadow-orange-500/25 shrink-0">
                    <span className="text-2xl font-extrabold text-white">01</span>
                  </div>
                  
                  <div className="md:w-1/2 order-3 hidden md:block" />
                </div>

                {/* Étape 02 */}
                <div className="animate-on-scroll delay-2 relative flex flex-col md:flex-row items-center gap-8">
                  <div className="md:w-1/2 order-2 hidden md:block" />
                  
                  {/* Numéro étape */}
                  <div className="order-1 relative z-10 w-16 h-16 rounded-full bg-gradient-to-br from-[#009E60] to-[#10B981] flex items-center justify-center shadow-lg shadow-green-500/25 shrink-0">
                    <span className="text-2xl font-extrabold text-white">02</span>
                  </div>
                  
                  <div className="md:w-1/2 order-3">
                    <div className="bg-[#FFFBF5] rounded-2xl p-8 border border-green-100" style={{ boxShadow: '0 8px 30px rgb(15 23 42 / .06)' }}>
                      <h3 className="text-2xl font-bold text-[#0F172A] mb-3">
                        Saisissez vos activités une seule fois
                      </h3>
                      <p className="text-slate-600 leading-relaxed">
                        Sur téléphone ou ordinateur, même avec connexion modeste. Guide intuitif inclus.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Étape 03 */}
                <div className="animate-on-scroll delay-3 relative flex flex-col md:flex-row items-center gap-8">
                  <div className="md:w-1/2 md:text-right order-2 md:order-1">
                    <div className="bg-[#FFFBF5] rounded-2xl p-8 border border-blue-100" style={{ boxShadow: '0 8px 30px rgb(15 23 42 / .06)' }}>
                      <h3 className="text-2xl font-bold text-[#0F172A] mb-3">
                        Générez et présentez
                      </h3>
                      <p className="text-slate-600 leading-relaxed">
                        Rapport Word conforme + slides PowerPoint, archivés automatiquement. Prêt pour la hiérarchie.
                      </p>
                    </div>
                  </div>
                  
                  {/* Numéro étape */}
                  <div className="order-1 md:order-2 relative z-10 w-16 h-16 rounded-full bg-gradient-to-br from-blue-600 to-blue-400 flex items-center justify-center shadow-lg shadow-blue-500/25 shrink-0">
                    <span className="text-2xl font-extrabold text-white">03</span>
                  </div>
                  
                  <div className="md:w-1/2 order-3 hidden md:block" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ===== 6. SECTION TÉMOIGNAGES ===== */}
        <section className="py-24 lg:py-32 bg-[#0F172A] relative overflow-hidden" aria-label="Témoignages">
          {/* Motif décoratif subtil */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-0 left-0 w-96 h-96 bg-[#F77F00] rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#009E60] rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
          </div>

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Titre section */}
            <div className="text-center max-w-3xl mx-auto mb-16 animate-on-scroll">
              <span className="inline-block px-4 py-1.5 bg-white/10 text-white/90 text-sm font-semibold rounded-full mb-4">
                Ils ont fait le pas
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-[44px] font-extrabold text-white mb-4">
                Ce que disent nos utilisateurs
              </h2>
              <p className="text-lg text-slate-400">
                Des Directions Régionales et Départementales qui ont transformé leur reporting.
              </p>
            </div>

            {/* 3 cartes témoignages */}
            <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
              {/* Témoignage 1 */}
              <blockquote className="animate-on-scroll delay-1 bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 hover:border-white/20 transition-all">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#F77F00] to-[#FF9933] flex items-center justify-center text-white text-xl font-bold">
                    AK
                  </div>
                  <div>
                    <cite className="not-italic font-semibold text-white">Aminata K.</cite>
                    <p className="text-sm text-slate-400">Directrice Régionale, Bouaké</p>
                  </div>
                </div>
                <p className="text-slate-300 leading-relaxed italic">
                  « Avant, mon T4 me prenait deux semaines. Cette année : un après-midi. »
                </p>
                <div className="flex gap-1 mt-4">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 text-[#F77F00]" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </blockquote>

              {/* Témoignage 2 */}
              <blockquote className="animate-on-scroll delay-2 bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 hover:border-white/20 transition-all">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#009E60] to-[#10B981] flex items-center justify-center text-white text-xl font-bold">
                    KS
                  </div>
                  <div>
                    <cite className="not-italic font-semibold text-white">Koné S.</cite>
                    <p className="text-sm text-slate-400">Chef de service, Korhogo</p>
                  </div>
                </div>
                <p className="text-slate-300 leading-relaxed italic">
                  « Le flux de validation a mis fin aux allers-retours : tout est écrit et motivé, au noir sur blanc. »
                </p>
                <div className="flex gap-1 mt-4">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 text-[#F77F00]" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </blockquote>

              {/* Témoignage 3 */}
              <blockquote className="animate-on-scroll delay-3 bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 hover:border-white/20 transition-all">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-blue-400 flex items-center justify-center text-white text-xl font-bold">
                    AM
                  </div>
                  <div>
                    <cite className="not-italic font-semibold text-white">Adjoua M.</cite>
                    <p className="text-sm text-slate-400">Assistante de direction, San-Pédro</p>
                  </div>
                </div>
                <p className="text-slate-300 leading-relaxed italic">
                  « La hiérarchie a ses indicateurs consolidés du premier coup. On est devenus la référence du district. »
                </p>
                <div className="flex gap-1 mt-4">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 text-[#F77F00]" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </blockquote>
            </div>
          </div>
        </section>

        {/* ===== 7. SECTION TARIFICATION ===== */}
        <section id="tarifs" className="py-24 lg:py-32 bg-[#FFFBF5] relative african-pattern" aria-label="Tarifs">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Titre section */}
            <div className="text-center max-w-3xl mx-auto mb-16 animate-on-scroll">
              <span className="inline-block px-4 py-1.5 bg-purple-100 text-purple-700 text-sm font-semibold rounded-full mb-4">
                Tarification transparente
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-[44px] font-extrabold text-[#0F172A] mb-4">
                Un abonnement adapté à votre Direction
              </h2>
              <p className="text-lg text-slate-600">
                Paiement Mobile Money — Wave, Orange Money ou MTN MoMo.
              </p>
            </div>

            {/* 3 plans tarifs */}
            <div className="grid md:grid-cols-3 gap-6 lg:gap-8 max-w-5xl mx-auto items-start">
              {/* Plan ESSENTIEL */}
              <div className="animate-on-scroll delay-1 bg-white rounded-2xl p-8 border border-slate-200 hover:border-slate-300 hover:shadow-xl transition-all duration-300" style={{ boxShadow: '0 8px 30px rgb(15 23 42 / .06)' }}>
                <div className="text-center mb-8">
                  <h3 className="text-lg font-bold text-slate-900 mb-2">Essentiel</h3>
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-4xl font-extrabold text-[#0F172A]">10&nbsp;000</span>
                    <span className="text-slate-500">FCFA/mois</span>
                  </div>
                </div>
                <ul className="space-y-4 mb-8">
                  {[
                    "5 utilisateurs",
                    "1 Go stockage",
                    "Rapport trimestriel Word",
                    "Gestion incidents",
                    "Support email",
                  ].map((feature) => (
                    <li key={feature} className="flex items-center gap-3 text-sm text-slate-600">
                      <svg className="w-5 h-5 text-[#009E60] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
                <a
                  href="#demande"
                  className="block w-full py-3 text-center text-sm font-semibold text-[#F77F00] border-2 border-[#F77F00] rounded-xl hover:bg-orange-50 transition-colors magnetic-btn"
                >
                  Choisir Essentiel
                </a>
              </div>

              {/* Plan PROFESSIONNEL (Populaire) */}
              <div className="animate-on-scroll delay-2 bg-white rounded-2xl p-8 border-2 border-[#F77F00] relative shadow-xl md:-mt-4 md:mb-4" style={{ boxShadow: '0 20px 40px rgb(247 127 0 / .15)' }}>
                {/* Pastille populaire */}
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="inline-flex items-center px-4 py-1.5 bg-[#F77F00] text-white text-sm font-semibold rounded-full shadow-lg">
                    ⭐ Le plus populaire
                  </span>
                </div>
                {/* Mini liseré tricolore sous la pastille */}
                <div className="absolute -top-1 left-1/4 right-1/4 h-1 flex rounded-full overflow-hidden">
                  <div className="flex-1 bg-[#F77F00]" />
                  <div className="flex-1 bg-white" />
                  <div className="flex-1 bg-[#009E60]" />
                </div>
                
                <div className="text-center mb-8 pt-4">
                  <h3 className="text-lg font-bold text-slate-900 mb-2">Professionnel</h3>
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-4xl font-extrabold text-[#F77F00]">15&nbsp;000</span>
                    <span className="text-slate-500">FCFA/mois</span>
                  </div>
                </div>
                <ul className="space-y-4 mb-8">
                  {[
                    "15 utilisateurs",
                    "5 Go stockage",
                    "+ Rapport mensuel & annuel",
                    "+ PowerPoint",
                    "+ Indicateurs avancés",
                    "+ Archive automatique",
                    "Support prioritaire WhatsApp",
                  ].map((feature) => (
                    <li key={feature} className="flex items-center gap-3 text-sm text-slate-600">
                      <svg className="w-5 h-5 text-[#009E60] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
                <a
                  href="#demande"
                  className="magnetic-btn block w-full py-3 text-center text-sm font-semibold text-white bg-[#F77F00] rounded-xl hover:bg-[#E67300] shadow-lg shadow-orange-500/25 transition-all"
                >
                  Choisir Professionnel
                </a>
              </div>

              {/* Plan INSTITUTIONNEL */}
              <div className="animate-on-scroll delay-3 bg-white rounded-2xl p-8 border border-slate-200 hover:border-slate-300 hover:shadow-xl transition-all duration-300" style={{ boxShadow: '0 8px 30px rgb(15 23 42 / .06)' }}>
                <div className="text-center mb-8">
                  <h3 className="text-lg font-bold text-slate-900 mb-2">Institutionnel</h3>
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-4xl font-extrabold text-[#0F172A]">25&nbsp;000</span>
                    <span className="text-slate-500">FCFA/mois</span>
                  </div>
                </div>
                <ul className="space-y-4 mb-8">
                  {[
                    "Utilisateurs illimités",
                    "20 Go stockage",
                    "+ En-tête personnalisé",
                    "+ Carte nationale",
                    "+ Export données complètes",
                    "Formation incluse",
                    "Account manager dédié",
                  ].map((feature) => (
                    <li key={feature} className="flex items-center gap-3 text-sm text-slate-600">
                      <svg className="w-5 h-5 text-[#009E60] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
                <a
                  href="#demande"
                  className="block w-full py-3 text-center text-sm font-semibold text-[#0F172A] border-2 border-[#0F172A] rounded-xl hover:bg-slate-50 transition-colors magnetic-btn"
                >
                  Choisir Institutionnel
                </a>
              </div>
            </div>

            {/* Note paiement */}
            <p className="text-center text-sm text-slate-500 mt-10 animate-on-scroll">
              Abonnement mensuel sans engagement — paiement Wave, Orange Money ou MTN MoMo, confirmé par notre équipe.
            </p>
          </div>
        </section>

        {/* ===== 8. SECTION FAQ ===== */}
        <section id="faq" className="py-24 lg:py-32 bg-white" aria-label="Questions fréquentes">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Titre section */}
            <div className="text-center mb-16 animate-on-scroll">
              <span className="inline-block px-4 py-1.5 bg-slate-100 text-slate-700 text-sm font-semibold rounded-full mb-4">
                FAQ
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-[44px] font-extrabold text-[#0F172A] mb-4">
                Questions fréquentes
              </h2>
              <p className="text-lg text-slate-600">
                Tout ce que vous devez savoir avant de commencer.
              </p>
            </div>

            {/* 4 questions/réponses */}
            <div className="space-y-4">
              {/* Q1 */}
              <details className="animate-on-scroll delay-1 group bg-[#FFFBF5] rounded-2xl border border-slate-200 overflow-hidden" style={{ boxShadow: '0 4px 20px rgb(15 23 42 / .04)' }}>
                <summary className="flex items-center justify-between px-6 py-5 cursor-pointer list-none font-semibold text-[#0F172A] hover:text-[#F77F00] transition-colors">
                  <span>Mes cahiers actuels, j&apos;en fais quoi ?</span>
                  <svg className="w-5 h-5 text-slate-400 group-open:rotate-180 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <div className="px-6 pb-5 text-slate-600 leading-relaxed">
                  Reprise d&apos;exercice assistée : notre équipe vous accompagne pour intégrer vos données existantes dans e-OSCS. Pas besoin de tout ressaisir manuellement.
                </div>
              </details>

              {/* Q2 */}
              <details className="animate-on-scroll delay-2 group bg-[#FFFBF5] rounded-2xl border border-slate-200 overflow-hidden" style={{ boxShadow: '0 4px 20px rgb(15 23 42 / .04)' }}>
                <summary className="flex items-center justify-between px-6 py-5 cursor-pointer list-none font-semibold text-[#0F172A] hover:text-[#F77F00] transition-colors">
                  <span>Et si la connexion coupe ?</span>
                  <svg className="w-5 h-5 text-slate-400 group-open:rotate-180 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <div className="px-6 pb-5 text-slate-600 leading-relaxed">
                  Brouillon sauvegardé en continu dans votre navigateur. Vous reprendrez exactement où vous vous êtes arrêté dès le retour de connexion.
                </div>
              </details>

              {/* Q3 */}
              <details className="animate-on-scroll delay-3 group bg-[#FFFBF5] rounded-2xl border border-slate-200 overflow-hidden" style={{ boxShadow: '0 4px 20px rgb(15 23 42 / .04)' }}>
                <summary className="flex items-center justify-between px-6 py-5 cursor-pointer list-none font-semibold text-[#0F172A] hover:text-[#F77F00] transition-colors">
                  <span>Qui voit mes données ?</span>
                  <svg className="w-5 h-5 text-slate-400 group-open:rotate-180 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <div className="px-6 pb-5 text-slate-600 leading-relaxed">
                  Votre Direction uniquement (cloisonnement strict, hébergement sécurisé). Les DR ne voient pas les DD, et vice-versa. Vous contrôlez totalement l&apos;accès.
                </div>
              </details>

              {/* Q4 */}
              <details className="animate-on-scroll delay-4 group bg-[#FFFBF5] rounded-2xl border border-slate-200 overflow-hidden" style={{ boxShadow: '0 4px 20px rgb(15 23 42 / .04)' }}>
                <summary className="flex items-center justify-between px-6 py-5 cursor-pointer list-none font-semibold text-[#0F172A] hover:text-[#F77F00] transition-colors">
                  <span>Combien de temps pour démarrer ?</span>
                  <svg className="w-5 h-5 text-slate-400 group-open:rotate-180 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <div className="px-6 pb-5 text-slate-600 leading-relaxed">
                  Code d&apos;activation sous 24 heures ouvrées après confirmation de paiement. Formation express de 30 minutes incluse pour vous lancer immédiatement.
                </div>
              </details>
            </div>
          </div>
        </section>

        {/* ===== 9. SECTION CTA FINAL ===== */}
        <section id="demande" className="py-24 lg:py-32 relative overflow-hidden" aria-label="Appel à l'action final">
          {/* Fond dégradé orange→vert */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#F77F00] via-[#E67300] to-[#009E60]" />
          
          {/* Motif décoratif */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl -translate-x-1/2 translate-y-1/2" />
          </div>

          {/* Liseré tricolore en haut */}
          <div className="absolute top-0 left-0 right-0 h-1 flex">
            <div className="flex-1 bg-white/30" />
            <div className="flex-1 bg-white/50" />
            <div className="flex-1 bg-white/30" />
          </div>

          <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="animate-on-scroll">
              <h2 className="text-3xl sm:text-4xl lg:text-[48px] font-extrabold text-white mb-6 leading-tight">
                Rejoignez les Directions qui présentent des rapports impeccables, trimestre après trimestre.
              </h2>
              <p className="text-xl text-white/90 mb-10 max-w-2xl mx-auto">
                Ne laissez plus le reporting vous prendre des nuits blanches.
              </p>
              
              <a
                href="https://wa.me/2250576103227?text=Bonjour%2C%20je%20souhaite%20demander%20mon%20espace%20e-OSCS"
                target="_blank"
                rel="noopener noreferrer"
                className="magnetic-btn inline-flex items-center justify-center px-10 py-5 text-lg font-bold text-[#F77F00] bg-white rounded-2xl shadow-2xl hover:shadow-3xl hover:scale-105 transition-all duration-300"
              >
                Demander mon espace
                <svg className="ml-3 w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </a>
              
              <p className="mt-8 text-white/80 text-sm">
                réponse sous 24h · assistance WhatsApp incluse
              </p>
            </div>
          </div>
        </section>

        {/* ===== 10. FOOTER ===== */}
        <footer className="bg-[#0F172A] text-slate-400 py-16" role="contentinfo">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-10 lg:gap-12">
              {/* Colonne logo & baseline */}
              <div className="col-span-2 md:col-span-1">
                <a href="/" className="flex items-center gap-2 mb-4">
                  <span className="text-xl font-extrabold text-[#009E60]">e</span>
                  <span className="text-xl font-extrabold text-[#F77F00]">OSCS</span>
                </a>
                <p className="text-sm text-slate-500 leading-relaxed">
                  Suivi-évaluation et reporting du MCNSLP
                </p>
                <p className="mt-4 text-sm italic text-slate-500">
                  Fait avec fierté en Côte d&apos;Ivoire 🇨🇮
                </p>
              </div>

              {/* Colonne Navigation */}
              <div>
                <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Navigation</h4>
                <ul className="space-y-3" role="list">
                  {[
                    { name: "Accueil", href: "#" },
                    { name: "Fonctionnalités", href: "#fonctionnalites" },
                    { name: "Tarifs", href: "#tarifs" },
                    { name: "FAQ", href: "#faq" },
                    { name: "Contact", href: "#contact" },
                  ].map((link) => (
                    <li key={link.name}>
                      <a href={link.href} className="text-sm hover:text-white transition-colors">
                        {link.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Colonne Contact */}
              <div>
                <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Contact</h4>
                <ul className="space-y-3">
                  <li>
                    <a 
                      href="https://wa.me/2250576103227" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm hover:text-green-400 transition-colors"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                      </svg>
                      +225 05 76 10 32 27
                    </a>
                  </li>
                  <li>
                    <a 
                      href="mailto:omouitsi@gmail.com" 
                      className="flex items-center gap-2 text-sm hover:text-[#F77F00] transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      omouitsi@gmail.com
                    </a>
                  </li>
                </ul>
              </div>

              {/* Colonne Légal */}
              <div>
                <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Légal</h4>
                <ul className="space-y-3" role="list">
                  <li>
                    <a href="/conditions" className="text-sm hover:text-white transition-colors">
                      Conditions d'utilisation
                    </a>
                  </li>
                  <li>
                    <a href="/confidentialite" className="text-sm hover:text-white transition-colors">
                      Confidentialité
                    </a>
                  </li>
                </ul>
              </div>
            </div>

            {/* Bas de page copyright */}
            <div className="border-t border-slate-800 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-sm text-slate-600">
                © 2026 e-OSCS. Tous droits réservés.
              </p>
              <p className="text-xs text-slate-700">
                MCNSLP — Ministère de la Cohésion Nationale, de la Solidarité Sociale et de la Lutte contre la Pauvreté
              </p>
            </div>
          </div>
        </footer>
      </main>

      {/* Script pour header sticky et menu mobile */}
      <script
        dangerouslySetInnerHTML={{
          __html: `
            // Header sticky glassmorphism
            const header = document.getElementById('header');
            let lastScroll = 0;
            
            window.addEventListener('scroll', () => {
              const currentScroll = window.pageYOffset;
              
              if (currentScroll > 50) {
                header.classList.add('bg-white/95', 'backdrop-blur-md', 'shadow-lg', 'border-b', 'border-slate-100');
              } else {
                header.classList.remove('bg-white/95', 'backdrop-blur-md', 'shadow-lg', 'border-b', 'border-slate-100');
              }
              
              lastScroll = currentScroll;
            });
            
            // Mobile menu toggle
            const mobileMenuBtn = document.getElementById('mobile-menu-btn');
            const mobileMenu = document.getElementById('mobile-menu');
            
            if (mobileMenuBtn && mobileMenu) {
              mobileMenuBtn.addEventListener('click', () => {
                const isOpen = !mobileMenu.classList.contains('hidden');
                mobileMenu.classList.toggle('hidden');
                mobileMenuBtn.setAttribute('aria-expanded', !isOpen);
              });
            }
            
            // Smooth scroll pour les liens ancrages
            document.querySelectorAll('a[href^="#"]').forEach(anchor => {
              anchor.addEventListener('click', function(e) {
                const href = this.getAttribute('href');
                if (href && href !== '#') {
                  e.preventDefault();
                  const target = document.querySelector(href);
                  if (target) {
                    const headerHeight = header.offsetHeight;
                    const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight - 20;
                    window.scrollTo({
                      top: targetPosition,
                      behavior: 'smooth'
                    });
                    // Fermer le menu mobile si ouvert
                    if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
                      mobileMenu.classList.add('hidden');
                    }
                  }
                }
              });
            });
          `,
        }}
      />
    </>
  );
}

export default PremiumLandingContent;
