"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { DashboardMockup } from "./mockups/dashboard-mockup";
import { ArrowRight, Play } from "lucide-react";

export function HeroSection() {
  return (
    <section
      className="relative min-h-screen flex items-center overflow-hidden pt-20"
      aria-label="Section principale"
    >
      {/* Fond avec dégradé */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#004D25] via-[#006B35] to-[#009E60]" />
      
      {/* Motifs décoratifs */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full bg-white/5 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-success/5 blur-3xl" />
        {/* Grille subtile */}
        <div 
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: '60px 60px'
          }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Contenu texte */}
          <div className="text-center lg:text-left space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-sm text-white/90 font-medium">
                Plateforme MCNSLP Côte d&apos;Ivoire
              </span>
            </div>

            {/* Titre principal */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight">
              Gérez vos activités.
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-300 to-yellow-300">
                Produisez vos rapports
              </span>
              <br />
              plus simplement.
            </h1>

            {/* Sous-titre */}
            <p className="text-lg sm:text-xl text-white/80 leading-relaxed max-w-xl mx-auto lg:mx-0">
              e-OSCS centralise la planification, le suivi, la validation et le
              reporting des activités de votre Direction, du mensuel à
              l&apos;annuel.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
              <Button
                size="lg"
                className="bg-primary hover:bg-primary/90 text-white shadow-xl shadow-primary/30 hover:shadow-2xl hover:shadow-primary/40 transition-all text-base px-8 h-12"
                asChild
              >
                <a href="#abonnement">
                  Demander un abonnement
                  <ArrowRight className="ml-2 h-5 w-5" />
                </a>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white/30 text-white hover:bg-white/10 hover:text-white px-8 h-12"
                asChild
              >
                <a href="#fonctionnalites">
                  <Play className="mr-2 h-5 w-5" />
                  Découvrir e-OSCS
                </a>
              </Button>
            </div>

            {/* Mention cible */}
            <p className="text-sm text-white/60 italic">
              Conçu pour les Directions Régionales et Départementales du MCNSLP
            </p>
          </div>

          {/* Mockup dashboard */}
          <div className="relative">
            {/* Effet de glow derrière le mockup */}
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-success/20 rounded-3xl blur-3xl transform scale-95" />
            
            <div className="relative animate-in fade-in slide-in-from-right-8 duration-1000 delay-200">
              <DashboardMockup />
            </div>
          </div>
        </div>
      </div>

      {/* Onde de séparation en bas */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg
          viewBox="0 0 1440 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-auto"
          preserveAspectRatio="none"
        >
          <path
            d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
            fill="#F8FAFC"
          />
        </svg>
      </div>
    </section>
  );
}

export default HeroSection;
