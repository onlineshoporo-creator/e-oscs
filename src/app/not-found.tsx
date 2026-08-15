'use client';

import Link from 'next/link';
import { Home, Mail, LayoutDashboard, MessageCircleQuestion } from 'lucide-react';

/* ============================================
   PAGE 404 PERSONNALISÉE e-OSCS
   Design cohérent charte graphique CI
   ============================================ */

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col bg-[#FFFBF5] relative overflow-hidden">
      {/* Liseré tricolore CI en haut */}
      <div className="h-1.5 w-full flex">
        <div className="h-full flex-1 bg-[#F77F00]" /> {/* Orange CI */}
        <div className="h-full flex-1 bg-[#FFFFFF]" /> {/* Blanc */}
        <div className="h-full flex-1 bg-[#009E60]" /> {/* Vert CI */}
      </div>

      {/* Motif africain subtil en arrière-plan */}
      <div 
        className="absolute inset-0 opacity-40 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(30deg, rgba(247, 127, 0, 0.06) 12%, transparent 12.5%, transparent 87%, rgba(247, 127, 0, 0.06) 87.5%, rgba(247, 127, 0, 0.06)),
            linear-gradient(150deg, rgba(0, 158, 96, 0.06) 12%, transparent 12.5%, transparent 87%, rgba(0, 158, 96, 0.06) 87.5%, rgba(0, 158, 96, 0.06)),
            linear-gradient(30deg, rgba(247, 127, 0, 0.06) 12%, transparent 12.5%, transparent 87%, rgba(247, 127, 0, 0.06) 87.5%, rgba(247, 127, 0, 0.06)),
            linear-gradient(150deg, rgba(0, 158, 96, 0.06) 12%, transparent 12.5%, transparent 87%, rgba(0, 158, 96, 0.06) 87.5%, rgba(0, 158, 96, 0.06)),
            linear-gradient(60deg, rgba(247, 127, 0, 0.04) 25%, transparent 25.5%, transparent 75%, rgba(247, 127, 0, 0.04) 75%, rgba(247, 127, 0, 0.04)),
            linear-gradient(60deg, rgba(0, 158, 96, 0.04) 25%, transparent 25.5%, transparent 75%, rgba(0, 158, 96, 0.04) 75%, rgba(0, 158, 96, 0.04))
          `,
          backgroundSize: '80px 140px',
          backgroundPosition: '0 0, 0 0, 40px 70px, 40px 70px, 0 0, 40px 70px'
        }}
      />

      {/* Contenu principal centré */}
      <main className="flex-1 flex items-center justify-center px-4 py-12 relative z-10">
        <div className="max-w-2xl mx-auto text-center animate-fade-in-up">
          
          {/* Illustration CSS - Dossier perdu / Page déconstruite */}
          <div className="mb-8 flex justify-center">
            <div className="relative w-48 h-48 sm:w-56 sm:h-56 md:w-64 md:h-64">
              {/* Cercle de fond dégradé */}
              <div 
                className="absolute inset-0 rounded-full opacity-10"
                style={{
                  background: 'linear-gradient(135deg, #F77F00 0%, #009E60 100%)'
                }}
              />
              
              {/* Écran / Document déconstruit */}
              <div className="absolute inset-4 sm:inset-6 flex items-center justify-center">
                {/* Cadre principal */}
                <div 
                  className="relative w-full h-full rounded-xl border-2 border-dashed border-[#F77F00]/30 bg-white/80 backdrop-blur-sm shadow-lg transform rotate-3 hover:rotate-0 transition-transform duration-500"
                  style={{ animation: 'float 6s ease-in-out infinite' }}
                >
                  {/* Barre supérieure écran */}
                  <div className="absolute top-0 left-0 right-0 h-6 bg-[#0F172A] rounded-t-lg flex items-center px-2 gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-[#FF5F57]" />
                    <div className="w-2 h-2 rounded-full bg-[#FEBC2E]" />
                    <div className="w-2 h-2 rounded-full bg-[#28C840]" />
                  </div>
                  
                  {/* Contenu de l'écran - 404 stylisé */}
                  <div className="pt-10 pb-4 px-3 flex flex-col items-center justify-center h-full">
                    {/* Texte 404 grand */}
                    <span 
                      className="text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tighter"
                      style={{
                        fontFamily: "'Plus Jakarta Sans', sans-serif",
                        background: 'linear-gradient(135deg, #F77F00 0%, #D46B00 50%, #009E60 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text'
                      }}
                    >
                      404
                    </span>
                    
                    {/* Ligne décorative */}
                    <div className="flex items-center gap-2 mt-2 mb-1">
                      <div className="w-8 h-0.5 bg-[#F77F00] rounded" />
                      <div className="w-2 h-2 rotate-45 bg-[#009E60]" />
                      <div className="w-8 h-0.5 bg-[#009E60] rounded" />
                    </div>
                    
                    {/* Points d'interrogation flottants */}
                    <div className="relative mt-1">
                      <span 
                        className="text-lg text-[#F77F00]/60 font-bold absolute -top-1 -left-6"
                        style={{ animation: 'floatAlt 3s ease-in-out infinite' }}
                      >
                        ?
                      </span>
                      <span 
                        className="text-sm text-[#009E60]/50 font-bold absolute -top-2 -right-5"
                        style={{ animation: 'floatAlt 4s ease-in-out infinite 0.5s' }}
                      >
                        ?
                      </span>
                    </div>
                  </div>
                  
                  {/* Effet glitch subtil sur les coins */}
                  <div 
                    className="absolute -top-0.5 -right-0.5 w-4 h-4 border-t-2 border-r-2 border-[#009E60]/50"
                    style={{ animation: 'glitch 4s ease-in-out infinite' }}
                  />
                  <div 
                    className="absolute -bottom-0.5 -left-0.5 w-4 h-4 border-b-2 border-l-2 border-[#F77F00]/50"
                    style={{ animation: 'glitch 4s ease-in-out infinite 2s' }}
                  />
                </div>
                
                {/* Particules décoratives */}
                <div 
                  className="absolute w-3 h-3 rounded-full bg-[#F77F00]/30"
                  style={{ 
                    top: '10%', left: '-5%',
                    animation: 'particleFloat 8s ease-in-out infinite'
                  }}
                />
                <div 
                  className="absolute w-2 h-2 rounded-full bg-[#009E60]/30"
                  style={{ 
                    bottom: '15%', right: '-8%',
                    animation: 'particleFloat 6s ease-in-out infinite 1s'
                  }}
                />
                <div 
                  className="absolute w-2.5 h-2.5 rounded-full bg-[#0F172A]/20"
                  style={{ 
                    top: '20%', right: '-10%',
                    animation: 'particleFloat 7s ease-in-out infinite 2s'
                  }}
                />
              </div>
            </div>
          </div>

          {/* Titre principal */}
          <h1 
            className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#0F172A] mb-4 tracking-tight"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          >
            Page non trouvée
          </h1>

          {/* Sous-titre */}
          <p className="text-base sm:text-lg text-[#64748B] max-w-md mx-auto mb-8 leading-relaxed" style={{ fontFamily: "'Inter', sans-serif" }}>
            La page que vous cherchez a été déplacée ou n&apos;existe plus.
          </p>

          {/* Boutons d'action */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <Link
              href="/"
              className="group inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold text-white transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 min-w-[180px]"
              style={{ 
                backgroundColor: '#F77F00',
                fontFamily: "'Inter', sans-serif"
              }}
            >
              <Home className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
              Retour à l&apos;accueil
            </Link>
            
            <a
              href="mailto:omouitsi@gmail.com?subject=Question%20-%20e-OSCS&body=Bonjour,%0A%0AJ'ai rencontré un problème sur le site e-OSCS.%0APourriez-vous m'aider ?%0A%0AMerci,"
              className="group inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold text-[#0F172A] transition-all duration-300 border-2 hover:border-[#009E60] hover:bg-[#009E60]/5 active:translate-y-0 min-w-[180px]"
              style={{ 
                borderColor: '#0F172A',
                backgroundColor: 'transparent',
                fontFamily: "'Inter', sans-serif"
              }}
            >
              <Mail className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
              Contacter le support
            </a>
          </div>

          {/* Liens utiles */}
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-[#E2E8F0]/60 max-w-md mx-auto">
            <p className="text-sm font-medium text-[#64748B] uppercase tracking-wider mb-4" style={{ fontFamily: "'Inter', sans-serif" }}>
              Liens utiles
            </p>
            
            <nav className="grid grid-cols-1 sm:grid-cols-3 gap-3" aria-label="Navigation utile">
              <Link
                href="/app/dashboard"
                className="group flex flex-col items-center gap-2 p-4 rounded-xl bg-[#F8FAFC] hover:bg-[#0F172A] transition-all duration-300 hover:-translate-y-1"
              >
                <LayoutDashboard className="w-6 h-6 text-[#0F172A] group-hover:text-[#F77F00] transition-colors duration-200" />
                <span className="text-xs font-medium text-[#64748B] group-hover:text-white transition-colors duration-200" style={{ fontFamily: "'Inter', sans-serif" }}>
                  Tableau de bord
                </span>
              </Link>
              
              <Link
                href="/"
                className="group flex flex-col items-center gap-2 p-4 rounded-xl bg-[#F8FAFC] hover:bg-[#009E60] transition-all duration-300 hover:-translate-y-1"
              >
                <Home className="w-6 h-6 text-[#0F172A] group-hover:text-white transition-colors duration-200" />
                <span className="text-xs font-medium text-[#64748B] group-hover:text-white transition-colors duration-200" style={{ fontFamily: "'Inter', sans-serif" }}>
                  Accueil
                </span>
              </Link>
              
              <Link
                href="/#demande"
                className="group flex flex-col items-center gap-2 p-4 rounded-xl bg-[#F8FAFC] hover:bg-[#F77F00] transition-all duration-300 hover:-translate-y-1"
              >
                <MessageCircleQuestion className="w-6 h-6 text-[#0F172A] group-hover:text-white transition-colors duration-200" />
                <span className="text-xs font-medium text-[#64748B] group-hover:text-white transition-colors duration-200" style={{ fontFamily: "'Inter', sans-serif" }}>
                  Contact
                </span>
              </Link>
            </nav>
          </div>

          {/* Footer info */}
          <p className="mt-8 text-xs text-[#94A3B8]" style={{ fontFamily: "'Inter', sans-serif" }}>
            e-OSCS — MCNSLP Côte d&apos;Ivoire
          </p>
        </div>
      </main>

      {/* Styles d'animation inline (pas de styled-jsx) */}
      <style>{`
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
        
        @keyframes float {
          0%, 100% {
            transform: translateY(0) rotate(3deg);
          }
          50% {
            transform: translateY(-8px) rotate(-1deg);
          }
        }
        
        @keyframes floatAlt {
          0%, 100% {
            transform: translateY(0) rotate(0deg);
          }
          50% {
            transform: translateY(-6px) rotate(10deg);
          }
        }
        
        @keyframes particleFloat {
          0%, 100% {
            opacity: 0.3;
            transform: translate(0, 0);
          }
          25% {
            opacity: 0.6;
            transform: translate(5px, -10px);
          }
          50% {
            opacity: 0.4;
            transform: translate(-3px, -15px);
          }
          75% {
            opacity: 0.5;
            transform: translate(8px, -5px);
          }
        }
        
        @keyframes glitch {
          0%, 90%, 100% {
            opacity: 0.5;
            transform: translate(0, 0);
          }
          92% {
            opacity: 1;
            transform: translate(2px, -1px);
          }
          94% {
            opacity: 0.7;
            transform: translate(-2px, 1px);
          }
          96% {
            opacity: 1;
            transform: translate(1px, 2px);
          }
          98% {
            opacity: 0.5;
            transform: translate(-1px, -2px);
          }
        }
        
        .animate-fade-in-up {
          animation: fadeInUp 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        
        /* Respect reduced motion */
        @media (prefers-reduced-motion: reduce) {
          .animate-fade-in-up,
          [style*="animation"] {
            animation: none !important;
            opacity: 1 !important;
            transform: none !important;
          }
        }
      `}</style>
    </div>
  );
}
