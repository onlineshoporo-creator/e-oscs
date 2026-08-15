"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, X } from "lucide-react";

/** Formatteur de prix FCFA */
const formatPrice = (price: number): string => {
  return new Intl.NumberFormat("fr-FR").format(price);
};

interface PricingPlan {
  code: string;
  name: string;
  price: number;
  tagline: string;
  description: string;
  featured?: boolean;
  features: {
    name: string;
    included: boolean;
  }[];
}

/** Plans de tarification e-OSCS */
const pricingPlans: PricingPlan[] = [
  {
    code: "ESSENTIEL",
    name: "Essentiel",
    price: 10000,
    tagline: "L'essentiel pour structurer",
    description: "Pour les directions qui débutent la digitalisation de leur suivi d'activités.",
    features: [
      { name: "Plan annuel d'activités", included: true },
      { name: "Saisie des activités", included: true },
      { name: "Jusqu'à 3 utilisateurs", included: true },
      { name: "Rapport mensuel (Word)", included: true },
      { name: "Rapport trimestriel", included: false },
      { name: "Rapport annuel (PPT)", included: false },
      { name: "Tableau de bord avancé", included: false },
      { name: "Export Excel", included: true },
      { name: "Support prioritaire", included: false },
    ],
  },
  {
    code: "PROFESSIONNEL",
    name: "Professionnel",
    price: 15000,
    tagline: "Le plus choisi",
    description: "La solution complète pour une gestion efficace et des rapports automatiques.",
    featured: true,
    features: [
      { name: "Plan annuel d'activités", included: true },
      { name: "Saisie des activités", included: true },
      { name: "Jusqu'à 5 utilisateurs", included: true },
      { name: "Rapport mensuel (Word)", included: true },
      { name: "Rapport trimestriel", included: true },
      { name: "Rapport annuel (PPT)", included: true },
      { name: "Tableau de bord avancé", included: true },
      { name: "Export Excel", included: true },
      { name: "Support prioritaire", included: true },
    ],
  },
  {
    code: "INSTITUTIONNEL",
    name: "Institutionnel",
    price: 25000,
    tagline: "Puissance maximale",
    description: "Pour les directions régionales nécessitant capacités étendues et personnalisation.",
    features: [
      { name: "Plan annuel d'activités", included: true },
      { name: "Saisie des activités", included: true },
      { name: "Utilisateurs illimités", included: true },
      { name: "Rapport mensuel (Word)", included: true },
      { name: "Rapport trimestriel", included: true },
      { name: "Rapport annuel (PPT)", included: true },
      { name: "Tableau de bord avancé", included: true },
      { name: "Export Excel + PDF", included: true },
      { name: "Support dédié 24/7", included: true },
    ],
  },
];

/**
 * PricingCards - Composant de grille de tarifs
 * Affiche les 3 plans avec leurs fonctionnalités
 */
export function PricingCards() {
  return (
    <div className="w-full">
      {/* Grille des plans */}
      <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
        {pricingPlans.map((plan) => (
          <Card
            key={plan.code}
            className={`relative flex flex-col ${
              plan.featured
                ? "border-2 border-primary shadow-lg scale-[1.02] md:scale-105"
                : "border-slate-200"
            }`}
          >
            {/* Badge populaire */}
            {plan.featured && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <Badge className="bg-primary text-primary-foreground px-4 py-1 text-sm">
                  Le plus choisi
                </Badge>
              </div>
            )}

            <CardHeader className="text-center pb-2">
              <CardTitle className="text-xl font-bold">{plan.name}</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                {plan.tagline}
              </p>
              
              {/* Prix */}
              <div className="mt-4 mb-2">
                <span className="text-4xl font-bold text-slate-900">
                  {formatPrice(plan.price)}
                </span>
                <span className="text-muted-foreground ml-1">FCFA/mois</span>
              </div>
              
              <p className="text-xs text-muted-foreground">{plan.description}</p>
            </CardHeader>

            <CardContent className="flex-1">
              <ul className="space-y-3 mt-2">
                {plan.features.map((feature) => (
                  <li key={feature.name} className="flex items-start gap-3">
                    {feature.included ? (
                      <Check className="size-5 text-success shrink-0 mt-0.5" />
                    ) : (
                      <X className="size-5 text-slate-300 shrink-0 mt-0.5" />
                    )}
                    <span
                      className={`text-sm ${
                        feature.included ? "text-slate-700" : "text-slate-400"
                      }`}
                    >
                      {feature.name}
                    </span>
                  </li>
                ))}
              </ul>
            </CardContent>

            <CardFooter>
              <Button
                className="w-full"
                variant={plan.featured ? "default" : "outline"}
                asChild
              >
                <a href={`/demande?plan=${plan.code}`}>
                  Demander cette formule
                </a>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Note sous les cartes */}
      <p className="text-center text-sm text-muted-foreground mt-8 max-w-2xl mx-auto">
        Paiement par Mobile Money après validation — aucun prélèvement automatique.
        <br />
        <span className="text-xs">Facture officielle fournie pour chaque paiement.</span>
      </p>
    </div>
  );
}

export default PricingCards;
