"use client";

import React, { useEffect, useRef, useCallback, useState } from "react";

/* ============================================
   LANDING PAGE CONTENT e-OSCS PREMIUM
   Client Component - Production Ready
   Sans styled-jsx (évite l'hydratation mismatch)
   
   AMÉLIORATIONS:
   - Animations fluides (stagger, parallax, compteurs, typing)
   - Responsive mobile parfait
   - Micro-interactions (hover, ripple, glow)
   - Améliorations visuelles (gradients, icônes, typographie)
   ============================================ */

// Hook personnalisé pour animation typing
function useTypingEffect(text: string, speed: number = 50, startDelay: number = 500) {
  const [displayText, setDisplayText] = useState("");
  const [isComplete, setIsComplete] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    
    // Délai avant de commencer
    const startTimeout = setTimeout(() => {
      setHasStarted(true);
    }, startDelay);

    if (!hasStarted) return;

    let currentIndex = 0;
    
    const type = () => {
      if (currentIndex <= text.length) {
        setDisplayText(text.slice(0, currentIndex));
        currentIndex++;
        timeoutId = setTimeout(type, speed);
      } else {
        setIsComplete(true);
      }
    };

    timeoutId = setTimeout(type, speed);

    return () => {
      clearTimeout(startTimeout);
      clearTimeout(timeoutId);
    };
  }, [text, speed, startDelay, hasStarted]);

  return { displayText, isComplete };
}

// Composant compteur animé
function AnimatedCounter({ 
  target, 
  suffix = "", 
  prefix = "",
  duration = 2000,
  className = "" 
}: { 
  target: number | string; 
  suffix?: string; 
  prefix?: string;
  duration?: number;
  className?: string;
}) {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);
  const numericTarget = typeof target === 'string' ? parseInt(target) || 0 : target;

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true);
        }
      },
      { threshold: 0.5 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [isVisible]);

  useEffect(() => {
    if (!isVisible) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      setCount(numericTarget);
      return;
    }

    let startTime: number;
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      
      // Easing function (ease-out-expo)
      const easeOutExpo = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      setCount(Math.floor(easeOutExpo * numericTarget));
      
      if (progress < 1) {
        requestAnimationFrame(step);
      }
    };

    requestAnimationFrame(step);
  }, [isVisible, numericTarget, duration]);

  return (
    <span ref={ref} className={className}>
      {prefix}{count}{suffix}
    </span>
  );
}

export function PremiumLandingContent() {
  const headerRef = useRef<HTMLElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLElement>(null);
  const parallaxRef = useRef<HTMLDivElement>(null);
  
  // Animation typing pour le titre principal
  const { displayText: heroTitle, isComplete: titleComplete } = useTypingEffect(
    "Fini les rapports trimestriels bricolés sur Word et Excel.",
    40,
    300
  );

  /* === EFFETS CÔTÉ CLIENT === */
  
  // Animation au scroll avec IntersectionObserver + Stagger effect
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (prefersReducedMotion) {
      document.querySelectorAll('.animate-on-scroll').forEach(el => {
        (el as HTMLElement).style.opacity = '1';
        (el as HTMLElement).style.transform = 'none';
      });
      return;
    }

    // Observer pour animations fadeInUp avec stagger
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          const el = entry.target as HTMLElement;
          const delay = parseInt(el.dataset.delay || '0') || 0;
          
          setTimeout(() => {
            el.classList.add('is-visible');
          }, delay);
          
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
    
    document.querySelectorAll('.animate-on-scroll').forEach((el, index) => {
      // Calculer le délai basé sur la position dans le conteneur parent
      const parent = el.parentElement;
      const siblings = parent ? Array.from(parent.querySelectorAll('.animate-on-scroll')) : [];
      const siblingIndex = siblings.indexOf(el);
      
      if (!el.dataset.delay) {
        el.dataset.delay = String(siblingIndex * 100); // 100ms entre chaque élément
      }
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

  // Effet Parallax subtil sur le Hero
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion || !parallaxRef.current) return;

    const handleScroll = () => {
      const scrolled = window.pageYOffset;
      const parallaxElements = parallaxRef.current.querySelectorAll('[data-parallax]');
      
      parallaxElements.forEach((el) => {
        const htmlEl = el as HTMLElement;
        const speed = parseFloat(htmlEl.dataset.parallax || '0.1');
        const yPos = -(scrolled * speed);
        htmlEl.style.transform = `translateY(${yPos}px)`;
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Effet magnétique + ripple sur les boutons
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const hasFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    
    if (!prefersReducedMotion && hasFinePointer) {
      // Effet magnétique
      const handleMouseMove = (e: MouseEvent) => {
        const btn = e.currentTarget as HTMLElement;
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        btn.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px) scale(1.02)`;
      };

      const handleMouseLeave = (e: MouseEvent) => {
        const btn = e.currentTarget as HTMLElement;
        btn.style.transform = 'translate(0, 0) scale(1)';
      };

      // Effet Ripple
      const createRipple = (e: MouseEvent) => {
        const btn = e.currentTarget as HTMLElement;
        const rect = btn.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        const ripple = document.createElement('span');
        ripple.className = 'ripple-effect';
        ripple.style.cssText = `
          position: absolute;
          width: ${size}px;
          height: ${size}px;
          left: ${x}px;
          top: ${y}px;
          background: rgba(255, 255, 255, 0.3);
          border-radius: 50%;
          transform: scale(0);
          animation: ripple-animation 0.6s ease-out;
          pointer-events: none;
        `;
        
        btn.appendChild(ripple);
        setTimeout(() => ripple.remove(), 600);
      };

      const buttons = document.querySelectorAll('.magnetic-btn');
      buttons.forEach(btn => {
        btn.addEventListener('mousemove', handleMouseMove);
        btn.addEventListener('mouseleave', handleMouseLeave);
        btn.addEventListener('click', createRipple);
        btn.style.position = 'relative';
        btn.style.overflow = 'hidden';
      });

      return () => {
        buttons.forEach(btn => {
          btn.removeEventListener('mousemove', handleMouseMove);
          btn.removeEventListener('mouseleave', handleMouseLeave);
          btn.removeEventListener('click', createRipple);
        });
      };
    }
  }, []);

  // Header sticky glassmorphism + Mobile menu avec slide animation + Smooth scroll
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

    // Mobile menu toggle avec animation slide
    const handleMobileMenuClick = () => {
      if (!mobileMenu || !mobileMenuBtn) return;
      const isOpen = !mobileMenu.classList.contains('hidden');
      
      if (isOpen) {
        // Fermeture avec animation
        mobileMenu.classList.add('mobile-menu-closing');
        setTimeout(() => {
          mobileMenu.classList.add('hidden');
          mobileMenu.classList.remove('mobile-menu-closing', 'mobile-menu-open');
        }, 300);
      } else {
        // Ouverture avec animation
        mobileMenu.classList.remove('hidden');
        // Force reflow
        void mobileMenu.offsetWidth;
        mobileMenu.classList.add('mobile-menu-open');
      }
      
      mobileMenuBtn.setAttribute('aria-expanded', String(!isOpen));
      
      // Animation hamburger -> X
      const hamburgerIcon = mobileMenuBtn.querySelector('.hamburger-icon');
      const closeIcon = mobileMenuBtn.querySelector('.close-icon');
      if (hamburgerIcon && closeIcon) {
        hamburgerIcon.classList.toggle('hidden', !isOpen);
        closeIcon.classList.toggle('hidden', isOpen);
      }
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
            mobileMenu.classList.add('mobile-menu-closing');
            setTimeout(() => {
              mobileMenu.classList.add('hidden');
              mobileMenu.classList.remove('mobile-menu-closing', 'mobile-menu-open');
            }, 300);
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
      {/* Styles CSS injectés via style tag (pas styled-jsx) */}
      <style jsx global>{`
        /* Animations globales */
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeInLeft {
          from {
            opacity: 0;
            transform: translateX(-30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes fadeInRight {
          from {
            opacity: 0;
            transform: translateX(30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        @keyframes pulse-glow {
          0%, 100% {
            box-shadow: 0 0 20px rgba(247, 127, 0, 0.3), 0 0 40px rgba(247, 127, 0, 0.1);
          }
          50% {
            box-shadow: 0 0 30px rgba(247, 127, 0, 0.5), 0 0 60px rgba(247, 127, 0, 0.2);
          }
        }

        @keyframes shimmer {
          0% {
            background-position: -200% center;
          }
          100% {
            background-position: 200% center;
          }
        }

        @keyframes underline-slide {
          from {
            width: 0;
          }
          to {
            width: 100%;
          }
        }

        @keyframes ripple-animation {
          to {
            transform: scale(4);
            opacity: 0;
          }
        }

        @keyframes blink-caret {
          from, to {
            border-color: transparent;
          }
          50% {
            border-color: #F77F00;
          }
        }

        @keyframes gradient-shift {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }

        /* Classes d'animation */
        .animate-on-scroll {
          opacity: 0;
          transform: translateY(30px);
          transition: opacity 0.7s cubic-bezier(0.4, 0, 0.2, 1),
                      transform 0.7s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .animate-on-scroll.is-visible {
          opacity: 1;
          transform: translateY(0);
        }

        .animate-on-scroll.delay-1 { transition-delay: 0.1s; }
        .animate-on-scroll.delay-2 { transition-delay: 0.2s; }
        .animate-on-scroll.delay-3 { transition-delay: 0.3s; }
        .animate-on-scroll.delay-4 { transition-delay: 0.4s; }
        .animate-on-scroll.delay-5 { transition-delay: 0.5s; }

        /* Mobile menu animations */
        .mobile-menu-open {
          animation: slideDown 0.3s ease-out forwards;
        }

        .mobile-menu-closing {
          animation: slideUp 0.3s ease-out forwards;
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            max-height: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            max-height: 500px;
            transform: translateY(0);
          }
        }

        @keyframes slideUp {
          from {
            opacity: 1;
            max-height: 500px;
            transform: translateY(0);
          }
          to {
            opacity: 0;
            max-height: 0;
            transform: translateY(-10px);
          }
        }

        /* Progress line animation */
        .progress-line {
          width: 0;
          transition: width 1.5s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .progress-line.progress-line-animated {
          width: var(--progress-width, 100%);
        }

        /* Card hover effects */
        .card-hover {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .card-hover:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 40px rgba(15, 23, 42, 0.12), 0 8px 16px rgba(15, 23, 42, 0.08);
        }

        /* Testimonial card rotation */
        .testimonial-card {
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .testimonial-card:hover {
          transform: perspective(1000px) rotateY(-5deg) translateZ(20px);
          box-shadow: -10px 10px 30px rgba(15, 23, 42, 0.15);
        }

        /* Nav link underline animation */
        .nav-link {
          position: relative;
        }

        .nav-link::after {
          content: '';
          position: absolute;
          bottom: -4px;
          left: 0;
          width: 0;
          height: 2px;
          background: linear-gradient(90deg, #F77F00, #009E60);
          transition: width 0.3s ease;
        }

        .nav-link:hover::after {
          width: 100%;
        }

        /* CTA Glow effect */
        .cta-glow {
          position: relative;
          z-index: 1;
        }

        .cta-glow::before {
          content: '';
          position: absolute;
          inset: -2px;
          background: linear-gradient(45deg, #F77F00, #FF9933, #F77F00);
          border-radius: inherit;
          z-index: -1;
          opacity: 0;
          filter: blur(10px);
          transition: opacity 0.3s ease;
        }

        .cta-glow:hover::before {
          opacity: 1;
          animation: pulse-glow 2s infinite;
        }

        /* Mockup floating animation */
        .mockup-float {
          animation: float 6s ease-in-out infinite;
        }

        /* Decorative icon pulse */
        .icon-pulse {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }

        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }

        /* Gradient text */
        .gradient-text {
          background: linear-gradient(135deg, #F77F00 0%, #E67300 50%, #009E60 100%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: gradient-shift 3s ease infinite;
        }

        /* Shimmer effect for loading states */
        .shimmer {
          background: linear-gradient(
            90deg,
            rgba(255, 255, 255, 0) 0%,
            rgba(255, 255, 255, 0.3) 50%,
            rgba(255, 255, 255, 0) 100%
          );
          background-size: 200% 100%;
          animation: shimmer 2s infinite;
        }

        /* African pattern background */
        .african-pattern {
          background-image: 
            radial-gradient(circle at 25% 25%, rgba(247, 127, 0, 0.03) 0%, transparent 50%),
            radial-gradient(circle at 75% 75%, rgba(0, 158, 96, 0.03) 0%, transparent 50%);
        }

        /* Reduced motion preferences */
        @media (prefers-reduced-motion: reduce) {
          *, *::before, *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>

      {/* ==========================================
          LANDING PAGE PRINCIPALE
          ========================================== */}
      <main className="min-h-screen bg-[#FFFBF5] overflow-x-hidden">
        
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
              {/* Logo e-OSCS avec couleurs distinctes et hover effect */}
              <a href="/" className="flex items-center gap-2 group nav-link" aria-label="e-OSCS - Accueil">
                <span className="text-2xl font-extrabold text-[#009E60] group-hover:scale-110 transition-transform">e</span>
                <span className="text-xl font-bold text-[#0F172A]">-</span>
                <span className="text-2xl font-extrabold text-[#F77F00] group-hover:scale-110 transition-transform">OSCS</span>
              </a>

              {/* Navigation desktop avec underline animé */}
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
                    className="nav-link text-sm font-medium text-slate-600 hover:text-[#F77F00] transition-colors py-1"
                  >
                    {link.label}
                  </a>
                ))}
                <a
                  href="#demande"
                  className="cta-glow magnetic-btn inline-flex items-center px-5 py-2.5 text-sm font-semibold text-white bg-[#F77F00] rounded-xl shadow-lg shadow-orange-500/20 hover:bg-[#E67300] transition-all"
                >
                  Demander un accès
                </a>
              </div>

              {/* Bouton menu mobile avec animation hamburger/X */}
              <button
                id="mobile-menu-btn"
                type="button"
                className="md:hidden p-2 rounded-xl text-slate-600 hover:bg-orange-50 hover:text-[#F77F00] transition-all duration-300"
                aria-expanded="false"
                aria-controls="mobile-menu"
                aria-label="Ouvrir le menu de navigation"
              >
                <svg className="w-6 h-6 hamburger-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
                <svg className="w-6 h-6 close-icon hidden" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Menu mobile avec animation slide */}
            <div
              ref={mobileMenuRef}
              id="mobile-menu"
              className="hidden md:hidden overflow-hidden"
            >
              <div className="pb-4 border-t border-slate-100 mt-2 bg-white/95 backdrop-blur-md rounded-b-2xl">
                <div className="flex flex-col gap-1 pt-4 px-2">
                  {[
                    { label: "Fonctionnalités", href: "#fonctionnalites", icon: "⚡" },
                    { label: "Comment ça marche", href: "#comment-ca-marche", icon: "🔄" },
                    { label: "Tarifs", href: "#tarifs", icon: "💰" },
                    { label: "Témoignages", href: "#temoignages", icon: "💬" },
                    { label: "FAQ", href: "#faq", icon: "❓" },
                  ].map((link, index) => (
                    <a
                      key={link.href}
                      href={link.href}
                      className="flex items-center gap-3 px-4 py-3 text-base font-medium text-slate-600 hover:text-[#F77F00] hover:bg-orange-50 rounded-xl transition-all duration-200"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <span className="text-lg">{link.icon}</span>
                      {link.label}
                    </a>
                  ))}
                  <a
                    href="#demande"
                    className="mt-3 mx-2 inline-flex items-center justify-center px-6 py-4 text-base font-semibold text-white bg-gradient-to-r from-[#F77F00] to-[#E67300] rounded-xl shadow-lg shadow-orange-500/25 hover:shadow-xl hover:shadow-orange-500/30 transition-all"
                  >
                    Demander un accès
                    <svg className="ml-2 w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </nav>
        </header>

        {/* ===== 2. SECTION HERO AVEC PARALLAX ===== */}
        <section
          ref={heroRef}
          className="relative min-h-screen flex items-center pt-20 pb-32 african-pattern overflow-hidden"
          aria-label="Section principale"
        >
          {/* Dégradés de fond enrichis avec parallax */}
          <div ref={parallaxRef} className="absolute inset-0 pointer-events-none">
            <div data-parallax="0.05" className="absolute top-20 right-10 w-96 h-96 bg-gradient-to-br from-[#F77F00]/10 to-[#F77F00]/5 rounded-full blur-3xl" />
            <div data-parallax="0.08" className="absolute bottom-20 left-10 w-80 h-80 bg-gradient-to-tr from-[#009E60]/10 to-[#009E60]/5 rounded-full blur-3xl" />
            <div data-parallax="0.03" className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-[#F77F00]/5 to-[#009E60]/5 rounded-full blur-3xl" />
            
            {/* Icônes SVG décoratives flottantes */}
            <svg data-parallax="0.02" className="absolute top-32 left-[10%] w-12 h-12 text-[#F77F00]/10 icon-pulse" fill="currentColor" viewBox="0 0 24 24">
              <path d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <svg data-parallax="0.04" className="absolute bottom-40 right-[15%] w-16 h-16 text-[#009E60]/10 icon-pulse" style={{ animationDelay: '1s' }} fill="currentColor" viewBox="0 0 24 24">
              <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <svg data-parallax="0.03" className="absolute top-[60%] left-[5%] w-10 h-10 text-[#F77F00]/10 icon-pulse" style={{ animationDelay: '0.5s' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5" />
            </svg>
          </div>

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              {/* Contenu texte Hero avec animation typing */}
              <div className="text-center lg:text-left space-y-8 animate-on-scroll">
                {/* Eyebrow ministère + mini-liseré tricolore */}
                <div className="inline-flex items-center gap-3">
                  <div className="h-px w-8 bg-[#F77F00]" />
                  <span className="text-sm font-semibold text-slate-500 tracking-wide uppercase">
                    Ministère de la Cohésion Nationale — Côte d&apos;Ivoire
                  </span>
                  <div className="h-px w-8 bg-[#009E60]" />
                </div>

                {/* Titre accrocheur avec effet typing */}
                <h1 className="landing-heading text-3xl sm:text-4xl lg:text-[52px] xl:text-[60px] font-extrabold text-[#0F172A] leading-[1.1] min-h-[1.2em]">
                  <span>{heroTitle}</span>
                  {!titleComplete && (
                    <span className="inline-block w-[3px] h-[0.85em] ml-1 bg-[#F77F00] align-middle animate-pulse" />
                  )}
                </h1>

                {/* Sous-titre explicatif */}
                <p className="landing-body text-lg sm:text-xl text-slate-600 leading-relaxed max-w-xl mx-auto lg:mx-0">
                  e-OSCS transforme chaque activité saisie une seule fois en rapports institutionnels prêts à présenter — validation, consolidation et indicateurs inclus.
                </p>

                {/* CTAs principaux avec glow effect */}
                <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start pt-4">
                  <a
                    href="#demande"
                    className="cta-glow magnetic-btn inline-flex items-center justify-center px-8 py-4 text-base font-semibold text-white bg-gradient-to-r from-[#F77F00] to-[#E67300] rounded-2xl shadow-lg shadow-orange-500/25 hover:shadow-xl hover:shadow-orange-500/30 transition-all duration-300 group"
                  >
                    Demander mon espace
                    <svg className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </a>
                  <a
                    href="#demo"
                    className="magnetic-btn inline-flex items-center justify-center px-8 py-4 text-base font-semibold text-[#009E60] border-2 border-[#009E60] rounded-2xl hover:bg-green-50 hover:border-[#009E60] hover:shadow-lg hover:shadow-green-500/10 transition-all duration-300 group"
                  >
                    <svg className="mr-2 w-5 h-5 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                    Voir la démo
                  </a>
                </div>

                {/* Preuve sociale mini */}
                <div className="flex items-center gap-4 justify-center lg:justify-start pt-4">
                  <div className="flex -space-x-3">
                    {['AK', 'KN', 'MA', 'DJ'].map((initials, i) => (
                      <div
                        key={i}
                        className="w-10 h-10 rounded-full bg-gradient-to-br from-[#F77F00] to-[#009E60] border-2 border-white flex items-center justify-center text-xs font-bold text-white shadow-md hover:scale-110 hover:z-10 transition-all cursor-default"
                        style={{ animationDelay: `${i * 100}ms` }}
                      >
                        {initials}
                      </div>
                    ))}
                  </div>
                  <p className="text-sm text-slate-500">
                    <span className="font-semibold text-slate-700">+12 directions</span> nous font déjà confiance
                  </p>
                </div>
              </div>

              {/* MOCKUP DASHBOARD CSS PUR avec animation flottement */}
              <div className="mockup-container mockup-float animate-on-scroll delay-2">
                <div className="mockup-card relative">
                  {/* Fenêtre navigateur */}
                  <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden card-hover" style={{ boxShadow: '0 25px 50px rgb(15 23 42 / .1)' }}>
                    
                    {/* Barre titre fenêtre */}
                    <div className="bg-gradient-to-r from-[#0F172A] via-[#1E293B] to-[#0F172A] px-4 py-3 flex items-center gap-3">
                      <div className="flex items-center gap-1.5">
                        <div className="w-3 h-3 rounded-full bg-red-500/80 hover:scale-125 transition-transform cursor-pointer" />
                        <div className="w-3 h-3 rounded-full bg-yellow-500/80 hover:scale-125 transition-transform cursor-pointer" />
                        <div className="w-3 h-3 rounded-full bg-green-500/80 hover:scale-125 transition-transform cursor-pointer" />
                      </div>
                      <div className="flex-1 flex justify-center">
                        <div className="bg-slate-700/50 rounded-lg px-4 py-1 text-xs text-slate-300 backdrop-blur-sm">
                          dashboard.e-oscs.ci / Direction Régionale d&apos;Abidjan
                        </div>
                      </div>
                    </div>

                    <div className="flex">
                      {/* Sidebar sombre */}
                      <div className="hidden sm:block w-44 bg-gradient-to-b from-[#0F172A] to-[#1E293B] p-3 space-y-1">
                        {/* Logo sidebar */}
                        <div className="flex items-center gap-2 px-3 py-3 mb-4">
                          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#F77F00] to-[#009E60] flex items-center justify-center shadow-lg shadow-orange-500/20">
                            <span className="text-white font-bold text-sm">e</span>
                          </div>
                          <span className="text-white font-bold text-sm">e-OSCS</span>
                        </div>
                        
                        {/* Items menu */}
                        {[
                          { label: "Tableau de bord", active: true, icon: "📊" },
                          { label: "Plan annuel", active: false, icon: "📅" },
                          { label: "Activités", active: false, icon: "✅" },
                          { label: "Validation", active: false, badge: "3", icon: "✓" },
                          { label: "Rapports", active: false, icon: "📄" },
                          { label: "Indicateurs", active: false, icon: "📈" },
                        ].map((item) => (
                          <div
                            key={item.label}
                            className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-xs font-medium cursor-pointer transition-all duration-200 ${
                              item.active 
                                ? "bg-gradient-to-r from-[#F77F00] to-[#E67300] text-white shadow-md shadow-orange-500/20" 
                                : "text-slate-400 hover:bg-white/5 hover:text-white hover:translate-x-1"
                            }`}
                          >
                            <span className="text-sm">{item.icon}</span>
                            {item.label}
                            {item.badge && (
                              <span className="ml-auto bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full animate-pulse">
                                {item.badge}
                              </span>
                            )}
                          </div>
                        ))}
                      </div>

                      {/* Contenu principal mockup */}
                      <div className="flex-1 p-4 sm:p-5 bg-gradient-to-br from-slate-50 to-slate-100 min-h-[320px] sm:min-h-[380px]">
                        {/* En-tête contenu */}
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <h3 className="text-sm font-semibold text-slate-800">Tableau de bord</h3>
                            <p className="text-xs text-slate-500">Trimestre 4 • 2024</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-md font-medium flex items-center gap-1">
                              <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                              En ligne
                            </span>
                          </div>
                        </div>

                        {/* KPI Cards avec compteurs animés */}
                        <div className="grid grid-cols-2 gap-2 sm:gap-3 mb-4">
                          {[
                            { value: 47, label: "Activités", color: "#F77F00", change: "+12%" },
                            { value: 38, label: "Validées", color: "#009E60", change: "+8%" },
                            { value: 9, label: "En attente", color: "#D97706", change: "-3" },
                            { value: 94, label: "Taux compl.", color: "#2563EB", change: "+5%", suffix: "%" },
                          ].map((kpi) => (
                            <div key={kpi.label} className="bg-white rounded-xl p-2.5 sm:p-3 border border-slate-100 card-hover">
                              <div className="flex items-center justify-between mb-1">
                                <AnimatedCounter 
                                  target={kpi.value} 
                                  suffix={kpi.suffix || ""}
                                  className="text-lg sm:text-xl font-bold"
                                  style={{ color: kpi.color }}
                                />
                                <span className={`text-[10px] sm:text-xs font-medium px-1.5 py-0.5 rounded-full ${
                                  kpi.change.startsWith('+') 
                                    ? 'bg-green-100 text-green-600' 
                                    : 'bg-amber-100 text-amber-600'
                                }`}>
                                  {kpi.change}
                                </span>
                              </div>
                              <span className="text-[10px] sm:text-xs text-slate-500">{kpi.label}</span>
                            </div>
                          ))}
                        </div>

                        {/* Graphique barres simplifié */}
                        <div className="bg-white rounded-xl p-3 sm:p-4 border border-slate-100 mb-4 card-hover">
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-xs font-semibold text-slate-700">Activités par mois</span>
                            <span className="text-[10px] text-slate-400 bg-slate-100 px-2 py-0.5 rounded">T4 2024</span>
                          </div>
                          <div className="flex items-end gap-1.5 h-20 sm:h-24">
                            {[
                              { month: "O", height: 45, color: "from-[#F77F00] to-[#FF9933]" },
                              { month: "N", height: 70, color: "from-[#F77F00] to-[#FFB366]" },
                              { month: "D", height: 90, color: "from-[#E67300] to-[#F77F00]" },
                            ].map((bar) => (
                              <div key={bar.month} className="flex-1 flex flex-col items-center gap-1 group">
                                <div
                                  className={`w-full rounded-t-md bg-gradient-to-t ${bar.color} transition-all duration-500 group-hover:opacity-80`}
                                  style={{ height: `${bar.height}%` }}
                                />
                                <span className="text-[9px] text-slate-400 font-medium">{bar.month}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Tableau activités récentes */}
                        <div className="bg-white rounded-xl border border-slate-100 overflow-hidden card-hover">
                          <div className="px-3 py-2 bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-100">
                            <span className="text-xs font-semibold text-slate-700 flex items-center gap-2">
                              <svg className="w-3.5 h-3.5 text-[#F77F00]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              Activités récentes
                            </span>
                          </div>
                          {[
                            { name: "Atelier cohésion sociale", status: "Validée", statusColor: "bg-green-100 text-green-700" },
                            { name: "Visite terrain Daloa", status: "En cours", statusColor: "bg-amber-100 text-amber-700" },
                            { name: "Rapport mensuel nov.", status: "Brouillon", statusColor: "bg-slate-100 text-slate-600" },
                          ].map((act, i) => (
                            <div
                              key={i}
                              className="px-3 py-2.5 flex items-center justify-between border-b border-slate-50 last:border-0 hover:bg-slate-50 transition-colors"
                            >
                              <span className="text-[11px] text-slate-700 truncate mr-2">{act.name}</span>
                              <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-medium whitespace-nowrap ${act.statusColor}`}>
                                {act.status}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Ombre décorative sous le mockup */}
                  <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-3/4 h-8 bg-gradient-to-r from-[#F77F00]/20 via-[#009E60]/10 to-[#F77F00]/20 rounded-[50%] blur-2xl" />
                  
                  {/* Éléments décoratifs autour du mockup */}
                  <div className="absolute -top-4 -right-4 w-8 h-8 bg-gradient-to-br from-[#F77F00] to-[#E67300] rounded-full flex items-center justify-center shadow-lg shadow-orange-500/30 animate-bounce" style={{ animationDuration: '3s' }}>
                    <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div className="absolute -bottom-2 -left-4 w-10 h-10 bg-gradient-to-br from-[#009E60] to-[#059669] rounded-full flex items-center justify-center shadow-lg shadow-green-500/30 animate-bounce" style={{ animationDuration: '2.5s', animationDelay: '0.5s' }}>
                    <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ===== 3. SECTION PROBLÈME ("Vous reconnaissez ?") ===== */}
        <section id="probleme" className="py-20 lg:py-28 bg-white relative overflow-hidden" aria-label="Problématiques">
          {/* Décorations subtiles */}
          <div className="absolute top-0 left-0 w-64 h-64 bg-[#F77F00]/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-80 h-80 bg-[#009E60]/5 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            {/* En-tête section */}
            <div className="text-center max-w-3xl mx-auto mb-16 animate-on-scroll">
              <span className="inline-flex items-center gap-2 text-sm font-semibold text-[#F77F00] uppercase tracking-wide mb-4">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.217.38 2.846 1.835 2.592L4.5 18.75m0 0V12m0 3.75H18M3.697 16.296 6.09 13.88m2.914 2.914 2.81-2.81M12 12h6.75m-6.75 0 2.81 2.81M18.75 12v6m0-3.75h.008v.008H18.75Z" />
                </svg>
                La réalité terrain
              </span>
              <h2 className="landing-heading text-3xl sm:text-4xl lg:text-[44px] font-bold text-[#0F172A] mb-6 leading-tight">
                Vous reconnaissez ces situations ?
              </h2>
              <p className="landing-body text-lg text-slate-600">
                Chaque trimestre, les mêmes difficultés se répètent dans les directions régionales et départementales.
              </p>
            </div>

            {/* Grille 3 problèmes avec cards hover */}
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
                  stat: "73%",
                  statLabel: "des agents",
                  highlight: true,
                },
                {
                  icon: (
                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  ),
                  title: "Rapports de dernière minute",
                  description: "La deadline approche et vous passez vos week-ends à consolider manuellement les données de 12 directions. Stress, erreurs de fatigue, et toujours ce sentiment d'avoir pu oublier quelque chose.",
                  stat: "2-3",
                  statLabel: "jours perdus / trimestre",
                  highlight: true,
                },
                {
                  icon: (
                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
                    </svg>
                  ),
                  title: "Indicateurs impossibles à suivre",
                  description: "Comment savoir en temps réel le taux de réalisation de votre plan annuel ? Avec Word et Excel, c'est un casse-tête. Vous naviguez à vue, sans visibilité claire sur la performance.",
                  stat: "< 50%",
                  statLabel: "de visibilité réelle",
                  highlight: true,
                },
              ].map((problem, index) => (
                <div
                  key={index}
                  className="animate-on-scroll card-hover group relative bg-white rounded-2xl p-6 lg:p-8 border border-slate-200 overflow-hidden"
                >
                  {/* Background accent on hover */}
                  <div className="absolute inset-0 bg-gradient-to-br from-[#F77F00]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  <div className="relative">
                    {/* Icône */}
                    <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br from-[#F77F00]/10 to-[#F77F00]/5 text-[#F77F00] mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                      {problem.icon}
                    </div>

                    {/* Titre */}
                    <h3 className="landing-heading text-lg lg:text-xl font-bold text-[#0F172A] mb-3 group-hover:text-[#F77F00] transition-colors">
                      {problem.title}
                    </h3>

                    {/* Description */}
                    <p className="text-slate-600 text-sm lg:text-base leading-relaxed mb-6">
                      {problem.description}
                    </p>

                    {/* Statistique */}
                    <div className="pt-4 border-t border-slate-100">
                      <div className="flex items-baseline gap-2">
                        <AnimatedCounter 
                          target={problem.stat.replace(/[^0-9]/g, '') || problem.stat} 
                          suffix={problem.stat.includes('%') ? '%' : ''}
                          prefix={problem.stat.includes('< ') ? '< ' : ''}
                          className="text-2xl lg:text-3xl font-extrabold text-[#F77F00]"
                        />
                        <span className="text-sm text-slate-500">{problem.statLabel}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== 4. SECTION SOLUTION ===== */}
        <section id="solution" className="py-20 lg:py-28 bg-gradient-to-br from-[#0F172A] via-[#1E293B] to-[#0F172A] relative overflow-hidden" aria-label="Solution e-OSCS">
          {/* Décorations */}
          <div className="absolute inset-0">
            <div className="absolute top-20 right-20 w-72 h-72 bg-[#F77F00]/10 rounded-full blur-3xl" />
            <div className="absolute bottom-20 left-20 w-64 h-64 bg-[#009E60]/10 rounded-full blur-3xl" />
            {/* Pattern dots */}
            <div className="absolute inset-0 opacity-5" style={{
              backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
              backgroundSize: '30px 30px'
            }} />
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
              {/* Texte solution */}
              <div className="animate-on-scroll">
                <span className="inline-flex items-center gap-2 text-sm font-semibold text-[#F77F00] uppercase tracking-wide mb-6">
                  <span className="w-8 h-[2px] bg-[#F77F00]" />
                  La solution
                </span>
                
                <h2 className="landing-heading text-3xl sm:text-4xl lg:text-[44px] font-bold text-white mb-6 leading-tight">
                  Une plateforme conçue pour{' '}
                  <span className="gradient-text">vos réalités terrain</span>
                </h2>
                
                <p className="text-lg text-slate-300 leading-relaxed mb-8">
                  e-OSCS centralise toute votre activité : planification, saisie terrain, validation hiérarchique, consolidation automatique et génération de rapports — le tout en un seul endroit.
                </p>

                {/* Points clés */}
                <div className="space-y-4">
                  {[
                    { icon: "✓", text: "Saisie unique, exploitation multiple", color: "text-green-400" },
                    { icon: "✓", text: "Validation en cascade respectant la hiérarchie", color: "text-blue-400" },
                    { icon: "✓", text: "Rapports générés automatiquement", color: "text-purple-400" },
                    { icon: "✓", text: "Indicateurs calculés en temps réel", color: "text-orange-400" },
                  ].map((point, i) => (
                    <div key={i} className="flex items-start gap-3 animate-on-scroll" style={{ transitionDelay: `${i * 100}ms` }}>
                      <span className={`${point.color} font-bold text-lg mt-0.5`}>{point.icon}</span>
                      <span className="text-slate-300">{point.text}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Visuel solution - Cards empilées */}
              <div className="relative animate-on-scroll delay-2">
                <div className="relative">
                  {/* Card principale */}
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/10 card-hover">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#F77F00] to-[#E67300] flex items-center justify-center">
                        <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-semibold text-white">Rapport Trimestriel Q4</h4>
                        <p className="text-xs text-slate-400">Généré automatiquement</p>
                      </div>
                      <span className="ml-auto text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded-full">À jour</span>
                    </div>
                    
                    {/* Mini graphique */}
                    <div className="bg-white/5 rounded-xl p-4">
                      <div className="flex items-end justify-between h-24 gap-2">
                        {[65, 82, 78, 94].map((height, i) => (
                          <div key={i} className="flex-1 flex flex-col items-center gap-1">
                            <div 
                              className="w-full rounded-t bg-gradient-to-t from-[#F77F00] to-[#FF9933] transition-all duration-500"
                              style={{ height: `${height}%` }}
                            />
                            <span className="text-[10px] text-slate-500">Q{i+1}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Card flottante */}
                  <div className="absolute -bottom-6 -left-6 bg-white rounded-xl p-4 shadow-xl card-hover max-w-[200px]">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center">
                        <svg className="w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span className="text-sm font-semibold text-slate-800">Validé</span>
                    </div>
                    <p className="text-xs text-slate-500">Direction Régionale d&apos;Abidjan</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ===== 5. SECTION FONCTIONNALITÉS ===== */}
        <section id="fonctionnalites" className="py-20 lg:py-28 bg-[#FFFBF5] african-pattern" aria-label="Fonctionnalités">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* En-tête section */}
            <div className="text-center max-w-3xl mx-auto mb-16 animate-on-scroll">
              <span className="inline-flex items-center gap-2 text-sm font-semibold text-[#009E60] uppercase tracking-wide mb-4">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
                </svg>
                Fonctionnalités clés
              </span>
              <h2 className="landing-heading text-3xl sm:text-4xl lg:text-[44px] font-bold text-[#0F172A] mb-6 leading-tight">
                Tout ce dont vous avez besoin,{' '}
                <span className="text-[#F77F00]">rien de superflu</span>
              </h2>
              <p className="landing-body text-lg text-slate-600">
                Des outils pensés pour simplifier votre quotidien, pas le compliquer.
              </p>
            </div>

            {/* Grille fonctionnalités */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {[
                {
                  icon: (
                    <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                    </svg>
                  ),
                  title: "Plan Annuel Programmable",
                  description: "Définissez vos objectifs, activités et indicateurs une seule fois. Le système les propage automatiquement sur tous les trimestres.",
                  color: "orange",
                },
                {
                  icon: (
                    <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
                    </svg>
                  ),
                  title: "Saisie Terrain Simplifiée",
                  description: "Interface mobile-friendly pour saisir vos activités depuis le terrain, même hors connexion. Photos et preuves incluses.",
                  color: "green",
                },
                {
                  icon: (
                    <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  ),
                  title: "Validation Hiérarchique",
                  description: "Circuit de validation qui respecte la chaîne de commandement : agent → chef service → directeur → direction centrale.",
                  color: "blue",
                },
                {
                  icon: (
                    <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                    </svg>
                  ),
                  title: "Génération Automatique de Rapports",
                  description: "Rapports trimestriels et annuels générés en un clic, formatés selon les standards institutionnels. Plus de copier-coller.",
                  color: "purple",
                },
                {
                  icon: (
                    <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
                    </svg>
                  ),
                  title: "Tableaux de Bord en Temps Réel",
                  description: "Visualisez instantanément l'état d'avancement de votre plan, les taux de réalisation et les alertes.",
                  color: "orange",
                },
                {
                  icon: (
                    <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                    </svg>
                  ),
                  title: "Sécurité & Traçabilité",
                  description: "Chaque action est tracée et horodatée. Rôles et permissions granulaires. Hébergement sécurisé conforme aux normes.",
                  color: "green",
                },
              ].map((feature, index) => (
                <div
                  key={index}
                  className={`animate-on-scroll card-hover group bg-white rounded-2xl p-6 lg:p-8 border border-slate-200 relative overflow-hidden ${
                    feature.color === 'orange' ? 'hover:border-orange-200' :
                    feature.color === 'green' ? 'hover:border-green-200' :
                    feature.color === 'blue' ? 'hover:border-blue-200' :
                    'hover:border-purple-200'
                  }`}
                >
                  {/* Accent corner */}
                  <div className={`absolute top-0 right-0 w-20 h-20 rounded-bl-3xl opacity-5 group-hover:opacity-10 transition-opacity ${
                    feature.color === 'orange' ? 'bg-[#F77F00]' :
                    feature.color === 'green' ? 'bg-[#009E60]' :
                    feature.color === 'blue' ? 'bg-blue-500' :
                    'bg-purple-500'
                  }`} />
                  
                  <div className="relative">
                    {/* Icône */}
                    <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl mb-5 group-hover:scale-110 transition-transform ${
                      feature.color === 'orange' ? 'bg-orange-100 text-[#F77F00]' :
                      feature.color === 'green' ? 'bg-green-100 text-[#009E60]' :
                      feature.color === 'blue' ? 'bg-blue-100 text-blue-600' :
                      'bg-purple-100 text-purple-600'
                    }`}>
                      {feature.icon}
                    </div>

                    {/* Titre */}
                    <h3 className="landing-heading text-lg font-bold text-[#0F172A] mb-3 group-hover:text-[#F77F00] transition-colors">
                      {feature.title}
                    </h3>

                    {/* Description */}
                    <p className="text-slate-600 text-sm leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== 6. SECTION COMMENT ÇA MARCHE ===== */}
        <section id="comment-ca-marche" className="py-20 lg:py-28 bg-white relative overflow-hidden" aria-label="Fonctionnement">
          {/* Ligne de progression verticale */}
          <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-slate-200 hidden lg:block">
            <div className="progress-line h-full bg-gradient-to-b from-[#F77F00] via-[#009E60] to-[#2563EB]" style={{ '--progress-width': '100%' }} />
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* En-tête section */}
            <div className="text-center max-w-3xl mx-auto mb-20 animate-on-scroll">
              <span className="inline-flex items-center gap-2 text-sm font-semibold text-[#F77F00] uppercase tracking-wide mb-4">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" />
                </svg>
                Comment ça marche
              </span>
              <h2 className="landing-heading text-3xl sm:text-4xl lg:text-[44px] font-bold text-[#0F172A] mb-6 leading-tight">
                4 étapes pour transformer votre reporting
              </h2>
              <p className="landing-body text-lg text-slate-600">
                Pas besoin d'être technicien. Si vous savez utiliser Word ou Excel, vous saurez utiliser e-OSCS.
              </p>
            </div>

            {/* Timeline des étapes */}
            <div className="space-y-12 lg:space-y-24">
              {[
                {
                  step: "01",
                  title: "Onboarding & Configuration",
                  description: "Nous créons votre espace personnalisé, importons votre plan annuel existant et formons vos équipes en moins d'une semaine.",
                  detail: "Durée : 2-3 jours de configuration + formation",
                  icon: "🚀",
                  color: "#F77F00",
                },
                {
                  step: "02",
                  title: "Saisie des Activités",
                  description: "Vos agents saisissent leurs activités au fur et à mesure, depuis le bureau ou le terrain via mobile. Photos et documents attachés.",
                  detail: "Une seule saisie = exploitable partout",
                  icon: "📝",
                  color: "#E67300",
                },
                {
                  step: "03",
                  title: "Validation en Cascade",
                  description: "Le circuit de validation respecte votre organigramme. Chaque niveau valide, commente ou retourne avec observations.",
                  detail: "Notifications automatiques à chaque étape",
                  icon: "✅",
                  color: "#009E60",
                },
                {
                  step: "04",
                  title: "Rapports & Indicateurs",
                  description: "Générez vos rapports trimestriels/annuels en un clic. Consultez vos tableaux de bord et indicateurs en temps réel.",
                  detail: "Export PDF, Excel ou consultation directe",
                  icon: "📊",
                  color: "#2563EB",
                },
              ].map((etape, index) => (
                <div
                  key={index}
                  className={`animate-on-scroll relative flex flex-col lg:flex-row items-center gap-8 lg:gap-16 ${
                    index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'
                  }`}
                >
                  {/* Numéro étape + cercle */}
                  <div className="hidden lg:flex absolute left-1/2 -translate-x-1/2 w-14 h-14 rounded-full bg-white border-4 shadow-lg items-center justify-center z-10" style={{ borderColor: etape.color }}>
                    <span className="text-lg font-black" style={{ color: etape.color }}>{etape.step}</span>
                  </div>

                  {/* Contenu texte */}
                  <div className={`flex-1 ${index % 2 === 0 ? 'lg:text-right' : 'lg:text-left'}`}>
                    <div className={`bg-white rounded-2xl p-6 lg:p-8 border border-slate-200 card-hover inline-block ${
                      index % 2 === 0 ? 'lg:ml-auto' : 'lg:mr-auto'
                    }`}>
                      <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl mb-4 text-2xl`} style={{ backgroundColor: `${etape.color}15` }}>
                        {etape.icon}
                      </div>
                      <h3 className="landing-heading text-xl lg:text-2xl font-bold text-[#0F172A] mb-3">
                        {etape.title}
                      </h3>
                      <p className="text-slate-600 leading-relaxed mb-4">
                        {etape.description}
                      </p>
                      <p className="text-sm font-medium" style={{ color: etape.color }}>
                        {etape.detail}
                      </p>
                    </div>
                  </div>

                  {/* Espace vide pour l'autre côté */}
                  <div className="flex-1 hidden lg:block" />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== 7. SECTION CHIFFRES CLÉS / SOCIAL PROOF ===== */}
        <section id="chiffres" className="py-20 lg:py-28 bg-gradient-to-br from-[#F77F00] via-[#E67300] to-[#F77F00] relative overflow-hidden" aria-label="Chiffres clés">
          {/* Pattern décoratif */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-10 left-10 w-40 h-40 border-2 border-white rounded-full" />
            <div className="absolute bottom-10 right-10 w-60 h-60 border-2 border-white rounded-full" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 border border-white rounded-full" />
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="text-center mb-16 animate-on-scroll">
              <h2 className="landing-heading text-3xl sm:text-4xl font-bold text-white mb-4">
                e-OSCS en chiffres
              </h2>
              <p className="text-white/80 text-lg">
                Résultats concrets mesurés auprès de nos utilisateurs
              </p>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
              {[
                { value: 12, suffix: "+", label: "Directions équipées", icon: "🏛️" },
                { value: 85, suffix: "%", label: "Temps gagné sur le reporting", icon: "⏱️" },
                { value: 2500, suffix: "+", label: "Activités traitées", icon: "✅" },
                { value: 99, suffix: "%", label: "Satisfaction utilisateur", icon: "⭐" },
              ].map((stat, index) => (
                <div
                  key={index}
                  className="animate-on-scroll text-center bg-white/10 backdrop-blur-sm rounded-2xl p-6 lg:p-8 border border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-105"
                >
                  <div className="text-3xl lg:text-4xl mb-3">{stat.icon}</div>
                  <div className="text-3xl lg:text-4xl font-extrabold text-white mb-2">
                    <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                  </div>
                  <div className="text-white/80 text-sm lg:text-base">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== 8. SECTION TÉMOIGNAGES ===== */}
        <section id="temoignages" className="py-20 lg:py-28 bg-[#FFFBF5] african-pattern" aria-label="Témoignages">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* En-tête section */}
            <div className="text-center max-w-3xl mx-auto mb-16 animate-on-scroll">
              <span className="inline-flex items-center gap-2 text-sm font-semibold text-[#009E60] uppercase tracking-wide mb-4">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M4.583 17.321C3.553 16.227 3 15 3 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 01-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179zm10 0C13.553 16.227 13 15 13 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 01-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179z" />
                </svg>
                Témoignages
              </span>
              <h2 className="landing-heading text-3xl sm:text-4xl lg:text-[44px] font-bold text-[#0F172A] mb-6 leading-tight">
                Ce qu&apos;ils disent d&apos;e-OSCS
              </h2>
              <p className="landing-body text-lg text-slate-600">
                Des retours d&apos;expérience authentiques de nos premiers utilisateurs.
              </p>
            </div>

            {/* Grille témoignages avec effet rotation */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {[
                {
                  quote: "Avant, je passais 3 jours à consolider les rapports de mes 8 départements. Maintenant, c'est fait en 30 minutes. Je peux enfin me concentrer sur l'analyse.",
                  author: "Dr. Adjoumani Kouadio",
                  role: "Directeur Régional, Sud-Comoé",
                  initials: "AK",
                  rating: 5,
                },
                {
                  quote: "La validation en cascade a résolu nos problèmes de traçabilité. On sait exactement qui a validé quoi et quand. C'est de la transparence totale.",
                  author: "Mme. Touré Aminata",
                  role: "Chef Service Planification, Abidjan",
                  initials: "TA",
                  rating: 5,
                },
                {
                  quote: "Mes agents sur le terrain peuvent saisir directement depuis leur téléphone. Fini les feuilles de route papier qu'on perdait tout le temps.",
                  author: "M. Yao Jean-Baptiste",
                  role: "Direction Départementale, Daloa",
                  initials: "YJ",
                  rating: 5,
                },
              ].map((testimonial, index) => (
                <div
                  key={index}
                  className="animate-on-scroll testimonial-card bg-white rounded-2xl p-6 lg:p-8 border border-slate-200 shadow-sm"
                >
                  {/* Stars */}
                  <div className="flex gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <svg key={i} className="w-5 h-5 text-[#F77F00]" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                      </svg>
                    ))}
                  </div>

                  {/* Citation */}
                  <blockquote className="text-slate-700 leading-relaxed mb-6 italic">
                    &ldquo;{testimonial.quote}&rdquo;
                  </blockquote>

                  {/* Auteur */}
                  <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#F77F00] to-[#009E60] flex items-center justify-center text-white font-bold text-sm">
                      {testimonial.initials}
                    </div>
                    <div>
                      <div className="font-semibold text-slate-800">{testimonial.author}</div>
                      <div className="text-sm text-slate-500">{testimonial.role}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== 9. SECTION TARIFS ===== */}
        <section id="tarifs" className="py-20 lg:py-28 bg-white" aria-label="Tarification">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* En-tête section */}
            <div className="text-center max-w-3xl mx-auto mb-16 animate-on-scroll">
              <span className="inline-flex items-center gap-2 text-sm font-semibold text-[#F77F00] uppercase tracking-wide mb-4">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />
                </svg>
                Tarification simple
              </span>
              <h2 className="landing-heading text-3xl sm:text-4xl lg:text-[44px] font-bold text-[#0F172A] mb-6 leading-tight">
                Un prix adapté à votre structure
              </h2>
              <p className="landing-body text-lg text-slate-600">
                Pas de frais cachés. Payez seulement ce dont vous avez besoin.
              </p>
            </div>

            {/* Grille tarifs */}
            <div className="grid md:grid-cols-3 gap-6 lg:gap-8 max-w-5xl mx-auto">
              {[
                {
                  name: "Starter",
                  price: "0",
                  currency: "FCFA/mois",
                  description: "Pour tester et découvrir la plateforme",
                  features: [
                    "1 direction départementale",
                    "Jusqu'à 5 utilisateurs",
                    "Plan annuel limité à 20 activités",
                    "Rapports basiques",
                    "Support email",
                  ],
                  limitations: [
                    "Pas de consolidation multi-directions",
                    "Pas d'API",
                  ],
                  popular: false,
                  cta: "Commencer gratuitement",
                  color: "slate",
                },
                {
                  name: "Professionnel",
                  price: "25 000",
                  currency: "FCFA/mois",
                  description: "Pour les directions régionales actives",
                  features: [
                    "1 direction régionale complète",
                    "Utilisateurs illimités",
                    "Activités illimitées",
                    "Tous types de rapports",
                    "Validation hiérarchique complète",
                    "Tableaux de bord avancés",
                    "Support prioritaire",
                    "Formation incluse",
                  ],
                  limitations: [],
                  popular: true,
                  cta: "Choisir Professionnel",
                  color: "orange",
                },
                {
                  name: "Entreprise",
                  price: "Sur mesure",
                  currency: "",
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
                  className={`animate-on-scroll relative rounded-2xl overflow-hidden transition-all duration-300 card-hover ${
                    plan.popular
                      ? "ring-2 ring-[#F77F00] shadow-2xl shadow-orange-500/10 scale-[1.02]"
                      : "border border-slate-200"
                  }`}
                >
                  {/* Badge populaire */}
                  {plan.popular && (
                    <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-[#F77F00] to-[#E67300] text-white text-center text-sm font-semibold py-2.5 flex items-center justify-center gap-2">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                      </svg>
                      Plan le plus populaire
                    </div>
                  )}

                  <div className={`p-6 lg:p-8 ${plan.popular ? 'pt-16' : ''} bg-white h-full flex flex-col`}>
                    {/* Nom du plan */}
                    <h3 className="landing-heading text-xl font-bold text-[#0F172A] mb-2">
                      {plan.name}
                    </h3>
                    <p className="text-sm text-slate-500 mb-6">{plan.description}</p>

                    {/* Prix */}
                    <div className="mb-6">
                      <div className="flex items-baseline gap-1">
                        {plan.price === "Sur mesure" ? (
                          <span className="text-3xl lg:text-4xl font-extrabold text-[#0F172A]">{plan.price}</span>
                        ) : (
                          <>
                            <span className="text-4xl lg:text-5xl font-extrabold text-[#0F172A]">
                              {plan.price}
                            </span>
                          </>
                        )}
                      </div>
                      <span className="text-sm text-slate-500">{plan.currency}</span>
                    </div>

                    {/* Features */}
                    <ul className="space-y-3 mb-8 flex-1">
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
                      className={`block w-full text-center py-3.5 px-6 rounded-xl font-semibold transition-all duration-300 magnetic-btn ${
                        plan.popular
                          ? "cta-glow bg-[#F77F00] text-white hover:bg-[#E67300] shadow-lg shadow-orange-500/20"
                          : plan.color === 'green'
                          ? "bg-[#009E60] text-white hover:bg-[#059669] hover:shadow-lg"
                          : "bg-[#0F172A] text-white hover:bg-[#1E293B] hover:shadow-lg"
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

        {/* ===== 10. SECTION FAQ ===== */}
        <section id="faq" className="py-20 lg:py-28 bg-[#FFFBF5] african-pattern" aria-label="Questions fréquentes">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* En-tête section */}
            <div className="text-center mb-16 animate-on-scroll">
              <span className="inline-flex items-center gap-2 text-sm font-semibold text-[#F77F00] uppercase tracking-wide mb-4">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
                </svg>
                FAQ
              </span>
              <h2 className="landing-heading text-3xl sm:text-4xl lg:text-[44px] font-bold text-[#0F172A] mb-6 leading-tight">
                Questions fréquentes
              </h2>
              <p className="landing-body text-lg text-slate-600">
                Tout ce que vous devez savoir avant de commencer.
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
                  className="group bg-white rounded-2xl border border-slate-200 overflow-hidden animate-on-scroll card-hover"
                >
                  <summary className="flex items-center justify-between cursor-pointer px-6 py-5 text-left hover:bg-slate-50 transition-colors">
                    <span className="landing-heading pr-8 font-semibold text-[#0F172A] text-base lg:text-lg">
                      {faq.question}
                    </span>
                    <span className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center group-open:bg-[#F77F00]/10 group-open:rotate-180 transition-all duration-300">
                      <svg className="w-4 h-4 text-slate-500 group-open:text-[#F77F00] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
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

        {/* ===== 11. SECTION DEMANDE D'ACCÈS / CTA FINAL ===== */}
        <section id="demande" className="py-20 lg:py-28 bg-white relative overflow-hidden" aria-label="Demande d'accès">
          {/* Décorations de fond */}
          <div className="absolute inset-0">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-[#0F172A]/5 via-transparent to-[#F77F00]/5" />
            <div className="absolute -top-20 -right-20 w-80 h-80 bg-[#F77F00]/10 rounded-full blur-3xl" />
            <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-[#009E60]/10 rounded-full blur-3xl" />
          </div>

          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="relative bg-gradient-to-br from-[#0F172A] via-[#1E293B] to-[#0F172A] rounded-3xl overflow-hidden shadow-2xl">
              {/* Décorations internes */}
              <div className="absolute top-0 right-0 w-96 h-96 bg-[#F77F00]/10 rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#009E60]/10 rounded-full blur-3xl" />
              
              {/* Pattern dots */}
              <div className="absolute inset-0 opacity-5" style={{
                backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
                backgroundSize: '25px 25px'
              }} />

              <div className="relative z-10 px-6 py-12 sm:px-12 sm:py-16 lg:px-16 lg:py-20 text-center">
                {/* Badge */}
                <span className="inline-flex items-center gap-2 text-sm font-semibold text-[#F77F00] uppercase tracking-wide mb-6 bg-[#F77F00]/10 px-4 py-2 rounded-full">
                  <span className="w-2 h-2 rounded-full bg-[#F77F00] animate-pulse" />
                  Démarrage rapide
                </span>

                {/* Titre */}
                <h2 className="landing-heading text-3xl sm:text-4xl lg:text-[44px] font-bold text-white mb-6 leading-tight">
                  Prêt à transformer votre{' '}
                  <span className="gradient-text">reporting</span> ?
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
                      className="w-full px-4 py-3.5 rounded-xl bg-white/10 border border-white/20 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#F77F00] focus:border-transparent transition-all hover:bg-white/15"
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
                      className="w-full px-4 py-3.5 rounded-xl bg-white/10 border border-white/20 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#F77F00] focus:border-transparent transition-all hover:bg-white/15"
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
                      className="w-full px-4 py-3.5 rounded-xl bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-[#F77F00] focus:border-transparent transition-all appearance-none hover:bg-white/15 cursor-pointer"
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
                      className="w-full px-4 py-3.5 rounded-xl bg-white/10 border border-white/20 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#F77F00] focus:border-transparent transition-all resize-none hover:bg-white/15"
                    />
                  </div>

                  {/* Submit avec glow effect */}
                  <button
                    type="submit"
                    className="cta-glow magnetic-btn w-full py-4 px-8 bg-gradient-to-r from-[#F77F00] to-[#E67300] hover:from-[#E67300] hover:to-[#F77F00] text-white font-semibold rounded-xl shadow-lg shadow-orange-500/25 transition-all duration-300 text-lg group"
                  >
                    Envoyer ma demande
                    <svg className="inline ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </button>
                </form>

                {/* Note confiance */}
                <p className="mt-6 text-sm text-slate-400 flex items-center justify-center gap-2">
                  <svg className="w-4 h-4 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                  </svg>
                  Vos données sont protégées et ne seront jamais partagées. Réponse sous 48h.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ===== 12. SECTION CTA FINAL ===== */}
        <section className="py-16 lg:py-20 bg-gradient-to-r from-[#F77F00] via-[#E67300] to-[#F77F00] relative overflow-hidden" aria-label="Appel à l'action final">
          {/* Animation gradient */}
          <div className="absolute inset-0 bg-[length:200%_auto] animate-gradient-shift" style={{
            backgroundImage: 'linear-gradient(90deg, #F77F00, #E67300, #F77F00)'
          }} />
          
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-10 left-10 w-40 h-40 border-2 border-white rounded-full animate-pulse" />
            <div className="absolute bottom-10 right-10 w-60 h-60 border-2 border-white rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 border border-white rounded-full animate-pulse" style={{ animationDelay: '0.5s' }} />
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
              className="cta-glow magnetic-btn inline-flex items-center px-8 py-4 bg-white text-[#F77F00] font-semibold rounded-2xl shadow-xl hover:bg-slate-50 hover:shadow-2xl transition-all duration-300 text-lg group"
            >
              Demander mon accès maintenant
              <svg className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </a>
          </div>
        </section>

        {/* ===== 13. FOOTER ARDOISE ===== */}
        <footer className="bg-[#0F172A] text-slate-400 relative overflow-hidden" role="contentinfo">
          {/* Subtle pattern */}
          <div className="absolute inset-0 opacity-5" style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
            backgroundSize: '30px 30px'
          }} />
          
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12">
              {/* Colonne 1 : Marque */}
              <div className="col-span-2 md:col-span-1">
                <a href="/" className="flex items-center gap-2 mb-4 group">
                  <span className="text-2xl font-extrabold text-[#009E60] group-hover:scale-110 transition-transform inline-block">e</span>
                  <span className="text-xl font-bold text-white">-</span>
                  <span className="text-2xl font-extrabold text-[#F77F00] group-hover:scale-110 transition-transform inline-block">OSCS</span>
                </a>
                <p className="text-sm leading-relaxed mb-4">
                  Solution de reporting et de gestion des activités pour le Ministère de la Cohésion Nationale, de la Solidarité Sociale et de la Lutte contre la Pauvreté.
                </p>
                {/* Liseré tricolore mini */}
                <div className="flex gap-1.5">
                  <div className="w-8 h-1.5 rounded-full bg-[#F77F00] hover:w-10 transition-all duration-300 cursor-default" />
                  <div className="w-8 h-1.5 rounded-full bg-white hover:w-10 transition-all duration-300 cursor-default" />
                  <div className="w-8 h-1.5 rounded-full bg-[#009E60] hover:w-10 transition-all duration-300 cursor-default" />
                </div>
              </div>

              {/* Colonne 2 : Produit */}
              <div>
                <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wide">Produit</h4>
                <ul className="space-y-2.5 text-sm">
                  {['Fonctionnalités', 'Tarification', 'Témoignages', 'FAQ', 'Roadmap'].map((item) => (
                    <li key={item}>
                      <a href={`#${item.toLowerCase()}`} className="nav-link text-slate-400 hover:text-white transition-colors inline-block">
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
                      <a href={item.href} className="nav-link text-slate-400 hover:text-white transition-colors inline-block">
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
                  <li className="flex items-center gap-2 group">
                    <svg className="w-4 h-4 text-[#F77F00] group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.07 8.91A2.25 2.25 0 0 1 2 8.668V6.75" />
                    </svg>
                    <span className="group-hover:text-white transition-colors">omouitsi@gmail.com</span>
                  </li>
                  <li className="flex items-center gap-2 group">
                    <svg className="w-4 h-4 text-[#F77F00] group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.715 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />
                    </svg>
                    <span className="group-hover:text-white transition-colors">+225 05 761 032 77</span>
                  </li>
                  <li className="flex items-start gap-2 group">
                    <svg className="w-4 h-4 mt-0.5 text-[#F77F00] group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                    </svg>
                    <span className="group-hover:text-white transition-colors">Abidjan, Plateau<br/>Côte d'Ivoire 🇨🇮</span>
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
                <p className="text-xs text-slate-500 flex items-center gap-2">
                  Fièrement développé en Côte d'Ivoire
                  <span className="text-base">🇨🇮</span>
                  pour le MCNSLP
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
