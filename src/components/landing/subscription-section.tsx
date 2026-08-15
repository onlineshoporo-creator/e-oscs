"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2 } from "lucide-react";

export function SubscriptionSection() {
  return (
    <section
      className="py-20 lg:py-28 bg-gradient-to-br from-primary via-orange-600 to-[#E85D04]"
      id="abonnement"
      aria-label="Abonnement"
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Icône */}
        <div className="w-20 h-20 rounded-3xl bg-white/20 backdrop-blur-sm flex items-center justify-center mx-auto mb-8 shadow-xl">
          <svg
            className="h-10 w-10 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9"
            />
          </svg>
        </div>

        {/* Titre */}
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
          Une solution adaptée à{" "}
          <span className="text-yellow-200">votre Direction</span>
        </h2>

        <p className="text-lg sm:text-xl text-white/90 mb-10 max-w-2xl mx-auto leading-relaxed">
          Rejoignez les Directions qui ont déjà transformé leur gestion des
          activités avec e-OSCS. Sans engagement complexe, sans surprise.
        </p>

        {/* Points clés (pas de tarifs) */}
        <div className="flex flex-wrap justify-center gap-6 mb-10">
          {[
            "Pas de carte bancaire requise",
            "Tarification adaptée à votre taille",
            "Support dédié inclus",
            "Mise en route accompagnée",
          ].map((point) => (
            <div
              key={point}
              className="flex items-center gap-2 px-4 py-2 bg-white/15 backdrop-blur-sm rounded-full text-white/95 text-sm font-medium"
            >
              <CheckCircle2 className="h-4 w-4 text-green-300" />
              {point}
            </div>
          ))}
        </div>

        {/* CTA principal */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button
            size="lg"
            className="bg-white text-primary hover:bg-slate-50 shadow-2xl shadow-black/20 text-base px-8 h-14 font-semibold"
            asChild
          >
            <a href="#demande">
              Demander les informations d&apos;abonnement
              <ArrowRight className="ml-2 h-5 w-5" />
            </a>
          </Button>
        </div>

        {/* Note */}
        <p className="mt-6 text-sm text-white/70 italic">
          Un membre de notre équipe vous contactera sous 24h pour vous accompagner.
        </p>
      </div>
    </section>
  );
}

export default SubscriptionSection;
