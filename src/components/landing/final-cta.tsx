"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";

export function FinalCTASection() {
  return (
    <section
      className="py-20 lg:py-28 bg-gradient-to-br from-[#004D25] via-[#006B35] to-[#009E60] relative overflow-hidden"
      aria-label="Appel à l'action final"
    >
      {/* Motifs décoratifs */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full bg-white/5 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-[400px] h-[400px] rounded-full bg-primary/10 blur-3xl" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Icône */}
        <div className="w-20 h-20 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center mx-auto mb-8 border border-white/20">
          <Sparkles className="h-10 w-10 text-yellow-300" />
        </div>

        {/* Titre */}
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
          Transformez la gestion{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-300 to-yellow-300">
            de vos activités
          </span>
        </h2>

        <p className="text-lg sm:text-xl text-white/80 mb-10 max-w-2xl mx-auto leading-relaxed">
          Rejoignez les Directions qui ont déjà adopté e-OSCS pour simplifier
          leur reporting et gagner un temps précieux.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button
            size="lg"
            className="bg-white text-green-800 hover:bg-slate-50 shadow-2xl shadow-black/20 text-base px-8 h-14 font-semibold"
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
            className="border-white/30 text-white hover:bg-white/10 hover:text-white px-8 h-14"
            asChild
          >
            <a href="#contact">
              Nous contacter
            </a>
          </Button>
        </div>

        {/* Preuve sociale */}
        <div className="mt-12 pt-8 border-t border-white/10">
          <p className="text-white/60 text-sm">
            Déjà utilisé par plusieurs Directions Régionales et Départementales
          </p>
        </div>
      </div>
    </section>
  );
}

export default FinalCTASection;
