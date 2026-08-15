"use client";

import React from "react";
import { Shield, Lock, Users, History, Database, Cloud } from "lucide-react";

const securityFeatures = [
  {
    icon: <Lock className="h-6 w-6" />,
    title: "Accès sécurisé",
    description: "Connexion authentifiée avec mots de passe robustes et option 2FA.",
  },
  {
    icon: <Users className="h-6 w-6" />,
    title: "Rôles et permissions",
    description: "Chaque utilisateur a un accès adapté à sa fonction (Admin, Chef, Agent).",
  },
  {
    icon: <Database className="h-6 w-6" />,
    title: "Séparation des données",
    description: "Les données de chaque Direction sont isolées et protégées.",
  },
  {
    icon: <History className="h-6 w-6" />,
    title: "Historique complet",
    description: "Traçabilité de chaque action avec date, auteur et modification.",
  },
  {
    icon: <Cloud className="h-6 w-6" />,
    title: "Sauvegarde automatique",
    description: "Sauvegardes quotidiennes avec rétention sur 90 jours minimum.",
  },
  {
    icon: <Shield className="h-6 w-6" />,
    title: "Hébergement sécurisé",
    description: "Serveurs sécurisés avec chiffrement SSL/TLS et conformité RGPD.",
  },
];

export function SecuritySection() {
  return (
    <section
      className="py-20 lg:py-28 bg-slate-50"
      id="securite"
      aria-label="Sécurité"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* En-tête */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block px-4 py-1.5 bg-red-100 text-red-700 rounded-full text-sm font-medium mb-4">
            Sécurité
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-6">
            Vos données restent{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#DC2626] to-[#EF4444]">
              sous contrôle
            </span>
          </h2>
          <p className="text-lg text-slate-600">
            La sécurité de vos informations est notre priorité. e-OSCS met en
            œuvre les meilleures pratiques pour protéger vos données.
          </p>
        </div>

        {/* Grille des fonctionnalités sécurité */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {securityFeatures.map((feature) => (
            <div
              key={feature.title}
              className="bg-white rounded-xl p-6 border border-slate-200 hover:border-red-200 hover:shadow-lg transition-all duration-300 group"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-red-50 text-red-600 flex items-center justify-center shrink-0 group-hover:bg-red-100 group-hover:scale-110 transition-all">
                  {feature.icon}
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 mb-1 group-hover:text-red-700 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Badge de confiance */}
        <div className="max-w-2xl mx-auto">
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-8 border border-green-200 text-center">
            <Shield className="h-10 w-10 text-success mx-auto mb-4" />
            <h3 className="font-bold text-lg text-slate-900 mb-2">
              Vos données vous appartiennent
            </h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Nous ne vendons, ne partageons ni n&apos;exploitons vos données à des fins commerciales.
              Chaque Direction reste propriétaire exclusive de ses informations.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default SecuritySection;
