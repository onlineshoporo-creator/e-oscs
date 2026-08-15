"use client";

import React, { useEffect, useRef, useCallback } from "react";

/* ============================================
   LANDING PAGE CONTENT e-OSCS PREMIUM
   Client Component - Production Ready
   Sans styled-jsx (évite l'hydratation mismatch)
   ============================================ */
export function PremiumLandingContent() {
  const headerRef = useRef<HTMLElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  /* === EFFETS CÔTÉ CLIENT === */
  
  // Animation au scroll avec IntersectionObserver
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (prefersReducedMotion) {
      // Si reduced motion, tout afficher directement
      document.querySelectorAll('.animate-on-scroll').forEach(el => {
        (el as HTMLElement).style.opacity = '1';
      });
      return;
    }

    // Observer pour animations fadeInUp
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

    // Observer pour lignes de progression
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

    return () => {
      observer.disconnect();
      progressObserver.disconnect();
    };
  }, []);

  // Effet magnétique sur les boutons
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const hasFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    
    if (!prefersReducedMotion && hasFinePointer) {
      const handleMouseMove = (e: MouseEvent) => {
        const btn = e.currentTarget as HTMLElement;
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        btn.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px)`;
      };

      const handleMouseLeave = (e: MouseEvent) => {
        const btn = e.currentTarget as HTMLElement;
        btn.style.transform = 'translate(0, 0)';
      };

      const buttons = document.querySelectorAll('.magnetic-btn');
      buttons.forEach(btn => {
        btn.addEventListener('mousemove', handleMouseMove);
        btn.addEventListener('mouseleave', handleMouseLeave);
      });

      return () => {
        buttons.forEach(btn => {
          btn.removeEventListener('mousemove', handleMouseMove);
          btn.removeEventListener('mouseleave', handleMouseLeave);
        });
      };
    }
  }, []);

  // Header sticky glassmorphism + Mobile menu + Smooth scroll
  useEffect(() => {
    const header = headerRef.current;
    const mobileMenu = mobileMenuRef.current;
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    
    if (!header) return;

    // Header sticky on scroll
    const handleScroll = () => {
      const currentScroll = window.pageYOffset;
      
      if (currentScroll > 50) {
        header.classList.add('bg-white/95', 'backdrop-blur-md', 'shadow-lg', 'border-b', 'border-slate-100');
      } else {
        header.classList.remove('bg-white/95', 'backdrop-blur-md', 'shadow-lg', 'border-b', 'border-slate-100');
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    // Mobile menu toggle
    const handleMobileMenuClick = () => {
      if (!mobileMenu || !mobileMenuBtn) return;
      const isOpen = !mobileMenu.classList.contains('hidden');
      mobileMenu.classList.toggle('hidden');
      mobileMenuBtn.setAttribute('aria-expanded', String(!isOpen));
    };

    if (mobileMenuBtn && mobileMenu) {
      mobileMenuBtn.addEventListener('click', handleMobileMenuClick);
    }

    // Smooth scroll pour les liens ancrages
    const handleAnchorClick = (e: Event) => {
      const anchor = e.currentTarget as HTMLAnchorElement;
      const href = anchor.getAttribute('href');
      
      if (href && href !== '#' && href.startsWith('#')) {
        e.preventDefault();
        const target = document.querySelector(href);
        if (target && header) {
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
    };

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', handleAnchorClick);
    });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (mobileMenuBtn) {
        mobileMenuBtn.removeEventListener('click', handleMobileMenuClick);
      }
      document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.removeEventListener('click', handleAnchorClick);
      });
    };
  }, []);

  /* === RENDER === */
  return (
    <>
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
          ref={headerRef}
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
                <span className="text-xl font-bold text-[#0F172A]">-</span>
                <span className="text-2xl font-extrabold text-[#F77F00]">OSCS</span>
              </a>

              {/* Navigation desktop */}
              <div className="hidden md:flex items-center gap-8">
                {[
                  { label: "Fonctionnalités", href: "#fonctionnalites" },
                  { label: "Comment ça marche", href: "#comment-ca-marche" },
                  { label: "Tarifs", href: "#tarifs" },
                  { label: "Témoignages", href: "#temoignages" },
                  { label: "FAQ", href: "#faq" },
                ].map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    className="text-sm font-medium text-slate-600 hover:text-[#F77F00] transition-colors"
                  >
                    {link.label}
                  </a>
                ))}
                <a
                  href="#demande"
                  className="magnetic-btn inline-flex items-center px-5 py-2.5 text-sm font-semibold text-white bg-[#F77F00] rounded-xl shadow-lg shadow-orange-500/20 hover:bg-[#E67300] transition-colors"
                >
                  Demander un accès
                </a>
              </div>

              {/* Bouton menu mobile */}
              <button
                id="mobile-menu-btn"
                type="button"
                className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
                aria-expanded="false"
                aria-controls="mobile-menu"
                aria-label="Ovrir le menu de navigation"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>

            {/* Menu mobile (caché par défaut) */}
            <div
              ref={mobileMenuRef}
              id="mobile-menu"
              className="hidden md:hidden pb-4 border-t border-slate-100 mt-2"
            >
              <div className="flex flex-col gap-3 pt-4">
                {[
                  { label: "Fonctionnalités", href: "#fonctionnalites" },
                  { label: "Comment ça marche", href: "#comment-ca-marche" },
                  { label: "Tarifs", href: "#tarifs" },
                  { label: "Témoignages", href: "#temoignages" },
                  { label: "FAQ", href: "#faq" },
                ].map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    className="px-3 py-2 text-base font-medium text-slate-600 hover:text-[#F77F00] hover:bg-orange-50 rounded-lg transition-colors"
                  >
                    {link.label}
                  </a>
                ))}
                <a
                  href="#demande"
                  className="mt-2 inline-flex items-center justify-center px-5 py-3 text-base font-semibold text-white bg-[#F77F00] rounded-xl shadow-lg shadow-orange-500/20 hover:bg-[#E67300] transition-colors"
                >
                  Demander un accès
                </a>
              </div>
            </div>
          </nav>
        </header>

        {/* ===== 2. SECTION HERO ===== */}
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
                <h1 className="landing-heading text-4xl sm:text-5xl lg:text-[56px] xl:text-[64px] font-extrabold text-[#0F172A] leading-[1.1]">
                  Fini les rapports trimestriels bricolés sur Word et Excel.
                </h1>

                {/* Sous-titre explicatif */}
                <p className="landing-body text-lg sm:text-xl text-slate-600 leading-relaxed max-w-xl mx-auto lg:mx-0">
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

                {/* Preuve sociale mini */}
                <div className="flex items-center gap-4 justify-center lg:justify-start pt-4">
                  <div className="flex -space-x-2">
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className="w-9 h-9 rounded-full bg-gradient-to-br from-[#F77F00]/80 to-[#009E60]/80 border-2 border-white flex items-center justify-center text-[10px] font-bold text-white"
                      >
                        {['AK', 'KN', 'MA', 'DJ'][i - 1]}
                      </div>
                    ))}
                  </div>
                  <p className="text-sm text-slate-500">
                    <span className="font-semibold text-slate-700">+12 directions</span> nous font déjà confiance
                  </p>
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
                            {item.label}
                            {item.badge && (
                              <span className="ml-auto bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">
                                {item.badge}
                              </span>
                            )}
                          </div>
                        ))}
                      </div>

                      {/* Contenu principal mockup */}
                      <div className="flex-1 p-4 sm:p-5 bg-slate-50 min-h-[320px] sm:min-h-[380px]">
                        {/* En-tête contenu */}
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <h3 className="text-sm font-semibold text-slate-800">Tableau de bord</h3>
                            <p className="text-xs text-slate-500">Trimestre 4 • 2024</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-md font-medium">
                              ● En ligne
                            </span>
                          </div>
                        </div>

                        {/* KPI Cards */}
                        <div className="grid grid-cols-2 gap-2 sm:gap-3 mb-4">
                          {[
                            { value: "47", label: "Activités", color: "#F77F00", change: "+12%" },
                            { value: "38", label: "Validées", color: "#009E60", change: "+8%" },
                            { value: "9", label: "En attente", color: "#D97706", change: "-3" },
                            { value: "94%", label: "Taux compl.", color: "#2563EB", change: "+5%" },
                          ].map((kpi) => (
                            <div key={kpi.label} className="bg-white rounded-lg p-2.5 sm:p-3 border border-slate-100">
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-lg sm:text-xl font-bold" style={{ color: kpi.color }}>
                                  {kpi.value}
                                </span>
                                <span className={`text-[10px] sm:text-xs font-medium ${kpi.change.startsWith('+') ? 'text-green-600' : 'text-amber-600'}`}>
                                  {kpi.change}
                                </span>
                              </div>
                              <span className="text-[10px] sm:text-xs text-slate-500">{kpi.label}</span>
                            </div>
                          ))}
                        </div>

                        {/* Graphique barres simplifié */}
                        <div className="bg-white rounded-lg p-3 sm:p-4 border border-slate-100 mb-4">
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-xs font-semibold text-slate-700">Activités par mois</span>
                            <span className="text-[10px] text-slate-400">T4 2024</span>
                          </div>
                          <div className="flex items-end gap-1.5 h-20 sm:h-24">
                            {[
                              { month: "O", height: 45 },
                              { month: "N", height: 70 },
                              { month: "D", height: 90 },
                            ].map((bar) => (
                              <div key={bar.month} className="flex-1 flex flex-col items-center gap-1">
                                <div
                                  className="w-full rounded-t-sm bg-gradient-to-t from-[#F77F00] to-[#FF9933]"
                                  style={{ height: `${bar.height}%` }}
                                />
                                <span className="text-[9px] text-slate-400">{bar.month}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Tableau activités récentes */}
                        <div className="bg-white rounded-lg border border-slate-100 overflow-hidden">
                          <div className="px-3 py-2 bg-slate-50 border-b border-slate-100">
                            <span className="text-xs font-semibold text-slate-700">Activités récentes</span>
                          </div>
                          {[
                            { name: "Atelier cohésion sociale", status: "Validée", statusColor: "bg-green-100 text-green-700" },
                            { name: "Visite terrain Daloa", status: "En cours", statusColor: "bg-amber-100 text-amber-700" },
                            { name: "Rapport mensuel nov.", status: "Brouillon", statusColor: "bg-slate-100 text-slate-600" },
                          ].map((act, i) => (
                            <div
                              key={i}
                              className="px-3 py-2 flex items-center justify-between border-b border-slate-50 last:border-0"
                            >
                              <span className="text-[11px] text-slate-700 truncate mr-2">{act.name}</span>
                              <span className={`text-[9px] px-1.5 py-0.5 rounded font-medium whitespace-nowrap ${act.statusColor}`}>
                                {act.status}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Ombre décorative sous le mockup */}
                  <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-3/4 h-8 bg-[#F77F00]/10 rounded-[50%] blur-xl" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ===== 3. SECTION PROBLÈME ("Vous reconnaissez ?") ===== */}
        <section id="probleme" className="py-20 lg:py-28 bg-white" aria-label="Problématiques">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* En-tête section */}
            <div className="text-center max-w-3xl mx-auto mb-16 animate-on-scroll">
              <span className="inline-block text-sm font-semibold text-[#F77F00] uppercase tracking-wide mb-4">
                La réalité terrain
              </span>
              <h2 className="landing-heading text-3xl sm:text-4xl lg:text-[44px] font-bold text-[#0F172A] mb-6 leading-tight">
                Vous reconnaissez ces situations ?
              </h2>
              <p className="landing-body text-lg text-slate-600">
                Chaque trimestre, les mêmes difficultés se répètent dans les directions régionales et départementales.
              </p>
            </div>

            {/* Grille 3 problèmes */}
            <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
              {[
                {
                  icon: (
                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.217.38 2.846 1.835 2.592L4.5 18.75m0 0V12m0 3.75H18M3.697 16.296 6.09 13.88m2.914 2.914 2.81-2.81M12 12h6.75m-6.75 0 2.81 2.81M18.75 12v6m0-3.75h.008v.008H18.75Z" />
                    </svg>
                  ),
                  title: "Perte de données entre Word et Excel",
                  description: "Les activités saisies dans un fichier Excel finissent mal copiées-collées dans le rapport Word. Résultat : incohérences, chiffres qui ne correspondent pas, heures perdues à tout vérifier.",
                  stat: "73% des agents",
                  highlight: true,
                },
                {
                  icon: (
                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 9a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                    </svg>
                  ),
                  title: "Rush de dernière minute avant échéance",
                  description: "La semaine précédant la remise du rapport trimestriel, c'est la course : reconstituer les activités oubliées, retrouver les preuves photos, demander les validations en urgence.",
                  stat: "-48h de stress",
                  highlight: false,
                },
                {
                  icon: (
                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
                    </svg>
                  ),
                  title: "Consolidation impossible au niveau central",
                  description: "Le ministère reçoit 36 formats différents des 36 directions. Consolider tout ça demande des semaines de travail manuel, quand ce n'est pas tout simplement impossible.",
                  stat: "36 formats différents",
                  highlight: false,
                },
              ].map((problem, index) => (
                <div
                  key={index}
                  className={`group relative p-6 lg:p-8 rounded-2xl border transition-all duration-300 animate-on-scroll delay-${index + 1} ${
                    problem.highlight
                      ? "bg-gradient-to-br from-[#FFF7ED] to-[#FFFBF5] border-[#FED7AA] shadow-lg shadow-orange-500/5"
                      : "bg-white border-slate-200 hover:border-slate-300 hover:shadow-lg"
                  }`}
                >
                  {/* Icône */}
                  <div className={`inline-flex items-center justify-center w-14 h-14 rounded-xl mb-5 ${
                    problem.highlight ? "bg-[#F77F00]/10 text-[#F77F00]" : "bg-slate-100 text-slate-600 group-hover:bg-[#F77F00]/10 group-hover:text-[#F77F00] transition-colors"
                  }`}>
                    {problem.icon}
                  </div>

                  {/* Stat en badge */}
                  <div className="inline-block mb-3">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                      problem.highlight ? "bg-[#F77F00]/10 text-[#F77F00]" : "bg-slate-100 text-slate-600"
                    }`}>
                      {problem.stat}
                    </span>
                  </div>

                  {/* Titre */}
                  <h3 className="landing-heading text-lg lg:text-xl font-bold text-[#0F172A] mb-3">
                    {problem.title}
                  </h3>

                  {/* Description */}
                  <p className="landing-body text-sm lg:text-base text-slate-600 leading-relaxed">
                    {problem.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== 4. SECTION FONCTIONNALITÉS CLÉS ===== */}
        <section id="fonctionnalites" className="py-20 lg:py-28 bg-[#FFFBF5] african-pattern" aria-label="Fonctionnalités">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* En-tête section */}
            <div className="text-center max-w-3xl mx-auto mb-16 animate-on-scroll">
              <span className="inline-block text-sm font-semibold text-[#009E60] uppercase tracking-wide mb-4">
                Fonctionnalités clés
              </span>
              <h2 className="landing-heading text-3xl sm:text-4xl lg:text-[44px] font-bold text-[#0F172A] mb-6 leading-tight">
                Tout ce qu'il vous faut, rien de superflu
              </h2>
              <p className="landing-body text-lg text-slate-600">
                Quatre piliers technologiques conçus spécifiquement pour les réalités du MCNSLP ivoirien.
              </p>
            </div>

            {/* Grille 4 fonctionnalités avec SVG inline */}
            <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
              {[
                {
                  svg: (
                    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-16 h-16">
                      <rect x="8" y="12" width="48" height="40" rx="4" stroke="#F77F00" strokeWidth="2.5" fill="#FFF7ED"/>
                      <line x1="8" y1="22" x2="56" y2="22" stroke="#F77F00" strokeWidth="2.5"/>
                      <circle cx="16" cy="17" r="2" fill="#F77F00"/>
                      <circle cx="22" cy="17" r="2" fill="#F77F00"/>
                      <circle cx="28" cy="17" r="2" fill="#F77F00"/>
                      <rect x="14" y="28" width="20" height="3" rx="1.5" fill="#FED7AA"/>
                      <rect x="14" y="35" width="36" height="2" rx="1" fill="#E2E8F0"/>
                      <rect x="14" y="41" width="30" height="2" rx="1" fill="#E2E8F0"/>
                      <rect x="14" y="47" width="34" height="2" rx="1" fill="#E2E8F0"/>
                      <path d="M42 32l4 4 8-8" stroke="#009E60" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  ),
                  title: "Saisie unique, restitution multiple",
                  description: "Vous saisissez une activité UNE seule fois avec photos, localisation et indicateurs. Le système génère automatiquement : fiches d'activité, tableaux de bord trimestriels, rapports consolidés au format institutionnel.",
                  badge: "Gain de temps",
                  color: "orange",
                },
                {
                  svg: (
                    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-16 h-16">
                      <rect x="12" y="8" width="40" height="48" rx="4" stroke="#009E60" strokeWidth="2.5" fill="#ECFDF5"/>
                      <path d="M20 20h24M20 28h24M20 36h16" stroke="#009E60" strokeWidth="2" strokeLinecap="round"/>
                      <rect x="28" y="44" width="16" height="6" rx="3" fill="#009E60"/>
                      <circle cx="46" cy="47" r="6" stroke="#F77F00" strokeWidth="2" fill="#FFF7ED"/>
                      <path d="M44 47l2 2 4-4" stroke="#F77F00" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  ),
                  title: "Circuit de validation intégré",
                  description: "Chaque activité suit un circuit de validation clair : agent → chef de service → directeur régional → direction centrale. Notifications automatiques à chaque étape, historique complet des validations.",
                  badge: "Traçabilité totale",
                  color: "green",
                },
                {
                  svg: (
                    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-16 h-16">
                      <rect x="8" y="16" width="48" height="32" rx="4" stroke="#2563EB" strokeWidth="2.5" fill="#EFF6FF"/>
                      <path d="M8 26h48" stroke="#2563EB" strokeWidth="2.5"/>
                      <bar x="14" y="32" width="8" height="12" rx="1" fill="#93C5FD"/>
                      <rect x="14" y="34" width="8" height="10" rx="1" fill="#3B82F6"/>
                      <rect x="26" y="36" width="8" height="8" rx="1" fill="#60A5FA"/>
                      <rect x="38" y="30" width="8" height="14" rx="1" fill="#2563EB"/>
                      <circle cx="18" cy="20" r="2" fill="#2563EB"/>
                      <circle cx="32" cy="20" r="2" fill="#2563EB"/>
                      <circle cx="46" cy="20" r="2" fill="#2563EB"/>
                    </svg>
                  ),
                  title: "Tableaux de bord & indicateurs en temps réel",
                  description: "Visualisez instantanément l'avancement de votre direction : taux de réalisation du plan annuel, couverture géographique, répartition par type d'activité, comparaison inter-périodes.",
                  badge: "Visibilité 360°",
                  color: "blue",
                },
                {
                  svg: (
                    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-16 h-16">
                      <path d="M12 52V20a8 8 0 0 1 8-8h24a8 8 0 0 1 8 8v32" stroke="#0F172A" strokeWidth="2.5" fill="#F8FAFC"/>
                      <rect x="18" y="24" width="28" height="6" rx="2" fill="#F77F00"/>
                      <rect x="18" y="34" width="20" height="4" rx="1" fill="#E2E8F0"/>
                      <rect x="18" y="42" width="24" height="4" rx="1" fill="#E2E8F0"/>
                      <circle cx="48" cy="44" r="8" stroke="#009E60" strokeWidth="2.5" fill="#ECFDF5"/>
                      <path d="M45 44l2 2 4-4" stroke="#009E60" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  ),
                  title: "Rapports prêts à présenter en 1 clic",
                  description: "Générez votre rapport trimestriel ou annuel en un clic : mise en page professionnelle, graphiques intégrés, données consolidées, format PDF conforme aux standards ministériels.",
                  badge: "Export PDF/Excel",
                  color: "slate",
                },
              ].map((feature, index) => (
                <div
                  key={index}
                  className="group bg-white rounded-2xl p-6 lg:p-8 border border-slate-200 hover:border-slate-300 hover:shadow-xl transition-all duration-300 animate-on-scroll delay-(index % 2) + 1"
                >
                  <div className="flex items-start gap-5">
                    {/* SVG Icon */}
                    <div className="flex-shrink-0 mt-1">
                      {feature.svg}
                    </div>

                    {/* Contenu */}
                    <div className="flex-1">
                      {/* Badge */}
                      <span className={`inline-block text-[11px] font-semibold uppercase tracking-wide px-2.5 py-1 rounded-full mb-3 ${
                        feature.color === 'orange' ? 'bg-orange-100 text-orange-700' :
                        feature.color === 'green' ? 'bg-green-100 text-green-700' :
                        feature.color === 'blue' ? 'bg-blue-100 text-blue-700' :
                        'bg-slate-100 text-slate-700'
                      }`}>
                        {feature.badge}
                      </span>

                      {/* Titre */}
                      <h3 className="landing-heading text-lg lg:text-xl font-bold text-[#0F172A] mb-3">
                        {feature.title}
                      </h3>

                      {/* Description */}
                      <p className="landing-body text-sm lg:text-base text-slate-600 leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== 5. SECTION COMMENT ÇA MARCHE ===== */}
        <section id="comment-ca-marche" className="py-20 lg:py-28 bg-white relative overflow-hidden" aria-label="Fonctionnement">
          {/* Ligne de progression verticale */}
          <div className="absolute left-1/2 top-0 bottom-0 w-0.5 hidden lg:block">
            <div className="progress-line absolute inset-0 w-full" />
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* En-tête section */}
            <div className="text-center max-w-3xl mx-auto mb-20 animate-on-scroll">
              <span className="inline-block text-sm font-semibold text-[#F77F00] uppercase tracking-wide mb-4">
                Mode d'emploi
              </span>
              <h2 className="landing-heading text-3xl sm:text-4xl lg:text-[44px] font-bold text-[#0F172A] mb-6 leading-tight">
                Trois étapes, et vous êtes opérationnel
              </h2>
              <p className="landing-body text-lg text-slate-600">
                Pas de formation complexe, pas de migration de données. Vous commencez à saisir vos activités dès le premier jour.
              </p>
            </div>

            {/* Timeline 3 étapes */}
            <div className="space-y-12 lg:space-y-0 lg:relative">
              {/* Étape 01 */}
              <div className="lg:flex items-center gap-12 animate-on-scroll">
                <div className="lg:w-1/2 lg:text-right lg:pr-12">
                  <div className="bg-gradient-to-br from-[#FFF7ED] to-white rounded-2xl p-6 lg:p-8 border border-[#FED7AA]">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-[#F77F00] text-white text-xl font-bold mb-4">
                      01
                    </div>
                    <h3 className="landing-heading text-xl lg:text-2xl font-bold text-[#0F172A] mb-3">
                      On crée votre espace direction
                    </h3>
                    <p className="landing-body text-slate-600 mb-4">
                      À partir de votre demande validée par la direction centrale, nous provisionnez votre espace personnalisé en moins de 24h. Import de votre plan annuel si disponible.
                    </p>
                    <ul className="space-y-2 text-sm text-slate-600">
                      {["Création comptes agents", "Configuration structure", "Import plan annuel"].map((item) => (
                        <li key={item} className="flex items-center gap-2 lg:justify-end">
                          <span>{item}</span>
                          <svg className="w-4 h-4 text-[#009E60] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                {/* Point timeline (desktop only) */}
                <div className="hidden lg:flex absolute left-1/2 -translate-x-1/2 w-12 h-12 rounded-full bg-[#F77F00] text-white items-center justify-center text-lg font-bold shadow-lg shadow-orange-500/30 z-10" style={{ top: '60px' }}>
                  01
                </div>
                <div className="lg:w-1/2 hidden lg:block" />
              </div>

              {/* Étape 02 */}
              <div className="lg:flex items-center gap-12 mt-12 lg:mt-0 animate-on-scroll delay-1">
                <div className="hidden lg:block lg:w-1/2" />
                {/* Point timeline (desktop only) */}
                <div className="hidden lg:flex absolute left-1/2 -translate-x-1/2 w-12 h-12 rounded-full bg-[#009E60] text-white items-center justify-center text-lg font-bold shadow-lg shadow-green-500/30 z-10" style={{ top: '280px' }}>
                  02
                </div>
                <div className="lg:w-1/2 lg:pl-12">
                  <div className="bg-gradient-to-br from-[#ECFDF5] to-white rounded-2xl p-6 lg:p-8 border border [#BBF7D0]">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-[#009E60] text-white text-xl font-bold mb-4">
                      02
                    </div>
                    <h3 className="landing-heading text-xl lg:text-2xl font-bold text-[#0F172A] mb-3">
                      Vous saisissez vos activités au fil de l'eau
                    </h3>
                    <p className="landing-body text-slate-600 mb-4">
                      Après chaque mission, atelier ou réunion, vous la saisissez en 3 minutes : titre, date, lieu, photos, nombre de bénéficiaires. Fini l'accumulation de paperasse.
                    </p>
                    <ul className="space-y-2 text-sm text-slate-600">
                      {["Formulaire guidé mobile-friendly", "Upload photos depuis smartphone", "Géolocalisation automatique"].map((item) => (
                        <li key={item} className="flex items-center gap-2">
                          <svg className="w-4 h-4 text-[#009E60] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Étape 03 */}
              <div className="lg:flex items-center gap-12 mt-12 lg:mt-0 animate-on-scroll delay-2">
                <div className="lg:w-1/2 lg:text-right lg:pr-12">
                  <div className="bg-gradient-to-br from-[#EFF6FF] to-white rounded-2xl p-6 lg:p-8 border border-[#BFDBFE]">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-[#2563EB] text-white text-xl font-bold mb-4">
                      03
                    </div>
                    <h3 className="landing-heading text-xl lg:text-2xl font-bold text-[#0F172A] mb-3">
                      Les rapports se génèrent tout seuls
                    </h3>
                    <p className="landing-body text-slate-600 mb-4">
                      À chaque échéance trimestrielle, cliquez sur « Générer le rapport » : toutes vos activités validées sont automatiquement consolidées, mises en forme et prêtes à envoyer.
                    </p>
                    <ul className="space-y-2 text-sm text-slate-600">
                      {["Rapport PDF professionnel", "Données consolidées", "Envoi direct au MCNSLP"].map((item) => (
                        <li key={item} className="flex items-center gap-2 lg:justify-end">
                          <span>{item}</span>
                          <svg className="w-4 h-4 text-[#009E60] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                {/* Point timeline (desktop only) */}
                <div className="hidden lg:flex absolute left-1/2 -translate-x-1/2 w-12 h-12 rounded-full bg-[#0F172A] text-white items-center justify-center text-lg font-bold shadow-lg z-10" style={{ top: '500px' }}>
                  03
                </div>
                <div className="lg:w-1/2 hidden lg:block" />
              </div>
            </div>
          </div>
        </section>

        {/* ===== 6. SECTION TÉMOIGNAGES ===== */}
        <section id="temoignages" className="py-20 lg:py-28 bg-[#0F172A] relative overflow-hidden" aria-label="Témoignages">
          {/* Motif subtil overlay */}
          <div className="absolute inset-0 african-pattern opacity-30" />

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* En-tête section */}
            <div className="text-center max-w-3xl mx-auto mb-16 animate-on-scroll">
              <span className="inline-block text-sm font-semibold text-[#F77F00] uppercase tracking-wide mb-4">
                Témoignages
              </span>
              <h2 className="landing-heading text-3xl sm:text-4xl lg:text-[44px] font-bold text-white mb-6 leading-tight">
                Ils ont dit adieu aux rapports de dernière minute
              </h2>
              <p className="text-lg text-slate-400">
                Découvrez comment e-OSCS a transformé le quotidien de professionnels comme vous.
              </p>
            </div>

            {/* Grille 3 témoignages */}
            <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
              {[
                {
                  quote: "Avant e-OSCS, je passais mes deux dernières semaines de chaque trimestre à reconstituer mes activités dans Excel. Maintenant, je saisis au fil de l'eau et mon rapport trimestriel est prêt en 10 minutes. C'est une autre vie.",
                  name: "Aminata K.",
                  role: "Chef de Service, DR Bouaké",
                  location: "Bouaké",
                  avatar: "AK",
                  stats: { activities: "127", timeSaved: "15j/an" },
                },
                {
                  quote: "La consolidation des rapports de nos 8 départements était un cauchemar. Avec e-OSCS, j'ai une vue en temps réel de tout le territoire et le rapport consolidé se génère seul. Mes collègues des autres directions sont jaloux.",
                  name: "Koné S.",
                  role: "Directeur Régional, Korhogo",
                  location: "Korhogo",
                  avatar: "KS",
                  stats: { departments: "8", reports: "100%" },
                },
                {
                  quote: "J'étais réticente au début parce que je ne suis pas très technology. Mais l'interface est tellement simple que je l'ai adoptée en une demi-journée. Maintenant, je forme moi-même les nouveaux agents.",
                  name: "Adjoua M.",
                  role: "Charge d'Activités, San-Pédro",
                  location: "San-Pédro",
                  avatar: "AM",
                  stats: { training: "12 agents", adoption: "2 jours" },
                },
              ].map((testimonial, index) => (
                <div
                  key={index}
                  className="group bg-white/5 backdrop-blur-sm rounded-2xl p-6 lg:p-8 border border-white/10 hover:border-white/20 hover:bg-white/10 transition-all duration-300 animate-on-scroll delay-index + 1"
                >
                  {/* Quote icon */}
                  <svg className="w-10 h-10 text-[#F77F00]/30 mb-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                  </svg>

                  {/* Citation */}
                  <blockquote className="landing-body text-sm lg:text-base text-slate-300 leading-relaxed mb-6">
                    "{testimonial.quote}"
                  </blockquote>

                  {/* Stats mini */}
                  <div className="flex items-center gap-4 mb-6 pb-6 border-b border-white/10">
                    {Object.entries(testimonial.stats).map(([key, value]) => (
                      <div key={key} className="text-center">
                        <div className="text-lg font-bold text-[#F77F00]">{value}</div>
                        <div className="text-[10px] text-slate-500 uppercase tracking-wide">
                          {key === 'activities' ? 'Activités' : key === 'timeSaved' ? 'Temps gagné' : key === 'departments' ? 'Départements' : key === 'reports' ? 'Taux rapport' : key === 'training' ? 'Formés' : 'Adoption'}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Auteur */}
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[#F77F00] to-[#009E60] flex items-center justify-center text-white font-bold text-sm">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <div className="font-semibold text-white text-sm">{testimonial.name}</div>
                      <div className="text-xs text-slate-400">{testimonial.role}</div>
                      <div className="text-[10px] text-[#F77F00]">📍 {testimonial.location}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== 7. SECTION TARIFICATION ===== */}
        <section id="tarifs" className="py-20 lg:py-28 bg-white" aria-label="Tarification">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* En-tête section */}
            <div className="text-center max-w-3xl mx-auto mb-16 animate-on-scroll">
              <span className="inline-block text-sm font-semibold text-[#009E60] uppercase tracking-wide mb-4">
                Tarification transparente
              </span>
              <h2 className="landing-heading text-3xl sm:text-4xl lg:text-[44px] font-bold text-[#0F172A] mb-6 leading-tight">
                Un investissement mesurable pour votre direction
              </h2>
              <p className="landing-body text-lg text-slate-600">
                Des tarifs adaptés aux réalités budgétaires des services publics ivoiriens. Pas de frais cachés, pas de surprise.
              </p>
            </div>

            {/* Toggle Annuel/Mensuel (optionnel visuel) */}
            <div className="flex items-center justify-center gap-4 mb-12 animate-on-scroll">
              <span className="text-sm font-medium text-slate-600">Facturation mensuelle</span>
              <div className="relative inline-flex items-center">
                <span className="text-sm font-semibold text-[#009E60] mr-2">✓</span>
                <span className="text-sm font-medium text-slate-800">Paiement FCFA</span>
              </div>
            </div>

            {/* Grille 3 plans */}
            <div className="grid md:grid-cols-3 gap-6 lg:gap-8 items-start">
              {[
                {
                  name: "Essentiel",
                  price: "10 000",
                  currency: "FCFA/mois",
                  description: "Pour les départements qui débutent leur transformation numérique",
                  features: [
                    "Jusqu'à 5 utilisateurs",
                    "Saisie d'activités illimitée",
                    "Rapports trimestriels automatiques",
                    "Stockage photos (2 Go)",
                    "Support par email",
                  ],
                  limitations: [
                    "Pas de validation multi-niveaux",
                    "Pas de tableau de bord avancé",
                  ],
                  popular: false,
                  cta: "Commencer l'essai",
                  color: "slate",
                },
                {
                  name: "Professionnel",
                  price: "15 000",
                  currency: "FCFA/mois",
                  description: "Pour les directions régionales qui veulent maîtriser leur reporting",
                  features: [
                    "Jusqu'à 20 utilisateurs",
                    "Tout le plan Essentiel, plus :",
                    "Circuit de validation multi-niveaux",
                    "Tableaux de bord & indicateurs",
                    "Export PDF/Excel avancé",
                    "Stockage photos (10 Go)",
                    "Support prioritaire",
                    "Formation incluse",
                  ],
                  limitations: [],
                  popular: true,
                  cta: "Demander ce plan",
                  color: "orange",
                },
                {
                  name: "Institutionnel",
                  price: "25 000",
                  currency: "FCFA/mois",
                  description: "Pour la direction centrale et les grandes structures",
                  features: [
                    "Utilisateurs illimités",
                    "Tout le plan Professionnel, plus :",
                    "Consolidation multi-directions",
                    "API d'integration",
                    "Compte dédié personnalisé",
                    "SLA garantie 99.9%",
                    "Manager de succès dédié",
                    "Formation sur mesure",
                    "Reports customisés",
                  ],
                  limitations: [],
                  popular: false,
                  cta: "Nous contacter",
                  color: "green",
                },
              ].map((plan, index) => (
                <div
                  key={index}
                  className={`relative rounded-2xl overflow-hidden transition-all duration-300 animate-on-scroll delay-index + 1 ${
                    plan.popular
                      ? "ring-2 ring-[#F77F00] shadow-2xl shadow-orange-500/10 scale-[1.02]"
                      : "border border-slate-200 hover:border-slate-300 hover:shadow-lg"
                  }`}
                >
                  {/* Badge populaire */}
                  {plan.popular && (
                    <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-[#F77F00] to-[#E67300] text-white text-center text-sm font-semibold py-2">
                      ⭐ Plan le plus populaire
                    </div>
                  )}

                  <div className={`p-6 lg:p-8 ${plan.popular ? 'pt-14' : ''} bg-white`}>
                    {/* Nom du plan */}
                    <h3 className="landing-heading text-xl font-bold text-[#0F172A] mb-2">
                      {plan.name}
                    </h3>
                    <p className="text-sm text-slate-500 mb-6">{plan.description}</p>

                    {/* Prix */}
                    <div className="mb-6">
                      <div className="flex items-baseline gap-1">
                        <span className="text-4xl lg:text-5xl font-extrabold text-[#0F172A]">
                          {plan.price}
                        </span>
                      </div>
                      <span className="text-sm text-slate-500">{plan.currency}</span>
                    </div>

                    {/* Features */}
                    <ul className="space-y-3 mb-8">
                      {plan.features.map((feature) => (
                        <li key={feature} className="flex items-start gap-3 text-sm">
                          <svg className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                            plan.popular ? 'text-[#F77F00]' : 'text-[#009E60]'
                          }`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                          <span className="text-slate-600">{feature}</span>
                        </li>
                      ))}
                      {plan.limitations.map((limitation) => (
                        <li key={limitation} className="flex items-start gap-3 text-sm text-slate-400">
                          <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                          <span>{limitation}</span>
                        </li>
                      ))}
                    </ul>

                    {/* CTA */}
                    <a
                      href="#demande"
                      className={`block w-full text-center py-3.5 px-6 rounded-xl font-semibold transition-all ${
                        plan.popular
                          ? "bg-[#F77F00] text-white hover:bg-[#E67300] shadow-lg shadow-orange-500/20"
                          : plan.color === 'green'
                          ? "bg-[#009E60] text-white hover:bg-[#059669]"
                          : "bg-[#0F172A] text-white hover:bg-[#1E293B]"
                      }`}
                    >
                      {plan.cta}
                    </a>
                  </div>
                </div>
              ))}
            </div>

            {/* Note transparence */}
            <p className="text-center text-sm text-slate-500 mt-8 animate-on-scroll">
              💡 Tous les prix sont HT. Réduction de 15% pour paiement annuel. Formation et support inclus sans limitation.
            </p>
          </div>
        </section>

        {/* ===== 8. SECTION FAQ ===== */}
        <section id="faq" className="py-20 lg:py-28 bg-[#FFFBF5] african-pattern" aria-label="Questions fréquentes">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* En-tête section */}
            <div className="text-center mb-16 animate-on-scroll">
              <span className="inline-block text-sm font-semibold text-[#F77F00] uppercase tracking-wide mb-4">
                FAQ
              </span>
              <h2 className="landing-heading text-3xl sm:text-4xl lg:text-[44px] font-bold text-[#0F172A] mb-6 leading-tight">
                Questions fréquentes
              </h2>
              <p className="landing-body text-lg text-slate-600">
                Tout ce que vous besoin de savoir avant de commencer.
              </p>
            </div>

            {/* Liste FAQ */}
            <div className="space-y-4">
              {[
                {
                  question: "Combien de temps faut-il pour mettre en place e-OSCS dans ma direction ?",
                  answer: "Une fois votre demande validée par la direction centrale, nous provisionnons votre espace en moins de 24 heures. La formation initiale prend environ 2 heures pour les administrateurs et 30 minutes pour les utilisateurs finaux. La plupart de nos directions sont pleinement opérationnelles en moins d'une semaine.",
                },
                {
                  question: "Mes données sont-elles hébergées en Côte d'Ivoire ?",
                  answer: "e-OSCS est hébergé sur des serveurs sécurisés conformes au RGPD. Nous utilisons Supabase (basé sur PostgreSQL) avec chiffrement des données en transit et au repos. Les sauvegardes quotidiennes sont effectuées automatiquement. Un accord de confidentialité spécifique peut être signé pour les institutions qui le souhaitent.",
                },
                {
                  question: "Puis-je importer mes données existantes (anciens rapports, activités) ?",
                  answer: "Oui, nous fournissons des templates Excel structurés pour importer votre historique d'activités et votre plan annuel en cours. Notre équipe peut aussi vous accompagner lors de la migration initiale. Les données importées sont immédiatement disponibles dans vos rapports et tableaux de bord.",
                },
                {
                  question: "Que se passe-t-il si internet coupe pendant une saisie sur le terrain ?",
                  answer: "L'application fonctionne en mode dégradé : vous pouvez préparer vos saisies hors-ligne et les synchroniser dès que la connexion revient. Les photos stockées localement seront uploadées automatiquement. Aucune donnée n'est perdue même en cas de coupure brutale.",
                },
              ].map((faq, index) => (
                <details
                  key={index}
                  className="group bg-white rounded-2xl border border-slate-200 overflow-hidden animate-on-scroll delay-index % 2 + 1"
                >
                  <summary className="flex items-center justify-between cursor-pointer px-6 py-5 text-left hover:bg-slate-50 transition-colors">
                    <span className="landing-heading pr-8 font-semibold text-[#0F172A] text-base lg:text-lg">
                      {faq.question}
                    </span>
                    <span className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center group-open:bg-[#F77F00]/10 group-open:rotate-180 transition-all">
                      <svg className="w-4 h-4 text-slate-500 group-open:text-[#F77F00]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                      </svg>
                    </span>
                  </summary>
                  <div className="px-6 pb-5 pt-0">
                    <p className="landing-body text-slate-600 leading-relaxed pl-0 border-t border-slate-100 pt-4">
                      {faq.answer}
                    </p>
                  </div>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* ===== 9. SECTION DEMANDE D'ACCÈS / CTA FINAL ===== */}
        <section id="demande" className="py-20 lg:py-28 bg-white" aria-label="Demande d'accès">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="relative bg-gradient-to-br from-[#0F172A] via-[#1E293B] to-[#0F172A] rounded-3xl overflow-hidden shadow-2xl">
              {/* Décorations */}
              <div className="absolute top-0 right-0 w-96 h-96 bg-[#F77F00]/10 rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#009E60]/10 rounded-full blur-3xl" />

              <div className="relative z-10 px-6 py-12 sm:px-12 sm:py-16 lg:px-16 lg:py-20 text-center">
                {/* Badge */}
                <span className="inline-flex items-center gap-2 text-sm font-semibold text-[#F77F00] uppercase tracking-wide mb-6">
                  <span className="w-2 h-2 rounded-full bg-[#F77F00] animate-pulse" />
                  Démarrage rapide
                </span>

                {/* Titre */}
                <h2 className="landing-heading text-3xl sm:text-4xl lg:text-[44px] font-bold text-white mb-6 leading-tight">
                  Prêt à transformer votre reporting ?
                </h2>

                {/* Description */}
                <p className="text-lg text-slate-300 mb-10 max-w-2xl mx-auto">
                  Demandez votre accès dès aujourd'hui et rejoignez les directions qui ont déjà dit adieu aux rapports de dernière minute.
                </p>

                {/* Formulaire simplifié */}
                <form className="max-w-md mx-auto space-y-4 text-left" onSubmit={(e) => e.preventDefault()}>
                  {/* Nom complet */}
                  <div>
                    <label htmlFor="demande-nom" className="block text-sm font-medium text-slate-300 mb-2">
                      Nom complet *
                    </label>
                    <input
                      type="text"
                      id="demande-nom"
                      required
                      placeholder="Ex: Koné Mohamed"
                      className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#F77F00] focus:border-transparent transition-all"
                    />
                  </div>

                  {/* Email institutionnel */}
                  <div>
                    <label htmlFor="demande-email" className="block text-sm font-medium text-slate-300 mb-2">
                      Email institutionnel *
                    </label>
                    <input
                      type="email"
                      id="demande-email"
                      required
                      placeholder="exemple@gouv.ci"
                      className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#F77F00] focus:border-transparent transition-all"
                    />
                  </div>

                  {/* Direction / Structure */}
                  <div>
                    <label htmlFor="demande-direction" className="block text-sm font-medium text-slate-300 mb-2">
                      Direction / Structure *
                    </label>
                    <select
                      id="demande-direction"
                      required
                      className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-[#F77F00] focus:border-transparent transition-all appearance-none"
                    >
                      <option value="" className="bg-[#1E293B]">Sélectionnez votre structure</option>
                      <option value="direction-regionale" className="bg-[#1E293B]">Direction Régionale</option>
                      <option value="direction-departementale" className="bg-[#1E293B]">Direction Départementale</option>
                      <option value="direction-centrale" className="bg-[#1E293B]">Direction Centrale</option>
                      <option value="autre" className="bg-[#1E293B]">Autre structure</option>
                    </select>
                  </div>

                  {/* Message optionnel */}
                  <div>
                    <label htmlFor="demande-message" className="block text-sm font-medium text-slate-300 mb-2">
                      Message (optionnel)
                    </label>
                    <textarea
                      id="demande-message"
                      rows={3}
                      placeholder="Précisez vos besoins spécifiques..."
                      className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#F77F00] focus:border-transparent transition-all resize-none"
                    />
                  </div>

                  {/* Submit */}
                  <button
                    type="submit"
                    className="magnetic-btn w-full py-4 px-8 bg-[#F77F00] hover:bg-[#E67300] text-white font-semibold rounded-xl shadow-lg shadow-orange-500/25 transition-all text-lg"
                  >
                    Envoyer ma demande
                    <svg className="inline ml-2 w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </button>
                </form>

                {/* Note confiance */}
                <p className="mt-6 text-sm text-slate-400">
                  🔒 Vos données sont protégées et ne seront jamais partagées avec des tiers. Réponse sous 48h ouvrables.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ===== 10. SECTION CTA FINAL (Optionnel) ===== */}
        <section className="py-16 lg:py-20 bg-gradient-to-r from-[#F77F00] to-[#E67300] relative overflow-hidden" aria-label="Appel à l'action final">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-10 left-10 w-40 h-40 border-2 border-white rounded-full" />
            <div className="absolute bottom-10 right-10 w-60 h-60 border-2 border-white rounded-full" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 border border-white rounded-full" />
          </div>

          <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="landing-heading text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4">
              Rejoignez la transformation digitale du MCNSLP
            </h2>
            <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
              Plus de 12 directions utilisent déjà e-OSCS au quotidien. La prochaine pourrait être la vôtre.
            </p>
            <a
              href="#demande"
              className="magnetic-btn inline-flex items-center px-8 py-4 bg-white text-[#F77F00] font-semibold rounded-2xl shadow-xl hover:bg-slate-50 transition-all text-lg"
            >
              Demander mon accès maintenant
              <svg className="ml-2 w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </a>
          </div>
        </section>

        {/* ===== 11. FOOTER ARDOISE ===== */}
        <footer className="bg-[#0F172A] text-slate-400" role="contentinfo">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12">
              {/* Colonne 1 : Marque */}
              <div className="col-span-2 md:col-span-1">
                <a href="/" className="flex items-center gap-2 mb-4">
                  <span className="text-2xl font-extrabold text-[#009E60]">e</span>
                  <span className="text-xl font-bold text-white">-</span>
                  <span className="text-2xl font-extrabold text-[#F77F00]">OSCS</span>
                </a>
                <p className="text-sm leading-relaxed mb-4">
                  Solution de reporting et de gestion des activités pour le Ministère de la Cohésion Nationale, de la Solidarité Sociale et de la Lutte contre la Pauvreté.
                </p>
                {/* Liseré tricolore mini */}
                <div className="flex gap-1">
                  <div className="w-6 h-1 rounded-full bg-[#F77F00]" />
                  <div className="w-6 h-1 rounded-full bg-white" />
                  <div className="w-6 h-1 rounded-full bg-[#009E60]" />
                </div>
              </div>

              {/* Colonne 2 : Produit */}
              <div>
                <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wide">Produit</h4>
                <ul className="space-y-2.5 text-sm">
                  {['Fonctionnalités', 'Tarification', 'Témoignages', 'FAQ', 'Roadmap'].map((item) => (
                    <li key={item}>
                      <a href={`#${item.toLowerCase()}`} className="hover:text-white transition-colors">
                        {item}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Colonne 3 : Support */}
              <div>
                <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wide">Support</h4>
                <ul className="space-y-2.5 text-sm">
                  {[
                    { label: 'Documentation', href: '#' },
                    { label: 'Contact', href: '#contact' },
                    { label: 'Statut du service', href: '#' },
                    { label: 'Mentions légales', href: '#' },
                  ].map((item) => (
                    <li key={item.label}>
                      <a href={item.href} className="hover:text-white transition-colors">
                        {item.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Colonne 4 : Contact */}
              <div>
                <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wide">Contact</h4>
                <ul className="space-y-2.5 text-sm">
                  <li className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-[#F77F00]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.07 8.91A2.25 2.25 0 0 1 2 8.668V6.75" />
                    </svg>
                    contact@e-oscs.ci
                  </li>
                  <li className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-[#F77F00]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.715 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />
                    </svg>
                    +225 07 XX XX XX XX
                  </li>
                  <li className="flex items-start gap-2">
                    <svg className="w-4 h-4 mt-0.5 text-[#F77F00]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                    </svg>
                    Abidjan, Plateau<br/>Côte d'Ivoire
                  </li>
                </ul>
              </div>
            </div>

            {/* Séparation */}
            <div className="border-t border-white/10 mt-12 pt-8">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <p className="text-sm">
                  © {new Date().getFullYear()} e-OSCS. Tous droits réservés.
                </p>
                <p className="text-xs text-slate-500">
                  Fièrement développé en Côte d'Ivoire 🇨🇮 pour le MCNSLP
                </p>
              </div>
            </div>
          </div>
        </footer>
      </main>
    </>
  );
}

export default PremiumLandingContent;
