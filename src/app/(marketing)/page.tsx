import type { Metadata } from "next";

// Landing page components
import { Navbar } from "@/components/landing/navbar";
import { HeroSection } from "@/components/landing/hero";
import { ProblemSection } from "@/components/landing/problem-section";
import { SolutionSection } from "@/components/landing/solution-section";
import { FeaturesSection } from "@/components/landing/features-section";
import { ReportingSection } from "@/components/landing/reporting-section";
import { AnnualPlanSection } from "@/components/landing/annual-plan-section";
import { ReportsSection } from "@/components/landing/reports-section";
import { ComparisonSection } from "@/components/landing/comparison-section";
import { UsersSection } from "@/components/landing/users-section";
import { SimplicitySection } from "@/components/landing/simplicity-section";
import { SecuritySection } from "@/components/landing/security-section";
import { SubscriptionSection } from "@/components/landing/subscription-section";
import { HowItWorksSection } from "@/components/landing/how-it-works-section";
import { RequestFormSection } from "@/components/landing/request-form-section";
import { ContactSection } from "@/components/landing/contact-section";
import { FinalCTASection } from "@/components/landing/final-cta";
import { Footer } from "@/components/landing/footer";

export const metadata: Metadata = {
  title: "e-OSCS — Plateforme de gestion et reporting des activités | MCNSLP",
  description:
    "e-OSCS centralise la planification, le suivi, la validation et génère automatiquement vos rapports Word et PowerPoint. Une donnée saisie une seule fois, exploitée à tous les niveaux du reporting.",
  keywords: [
    "e-OSCS",
    "MCNSLP",
    "Côte d'Ivoire",
    "solidarité",
    "cohésion sociale",
    "suivi des activités",
    "rapport administratif",
    "Direction Régionale",
    "Direction Départementale",
    "reporting",
    "plan annuel",
  ],
  authors: [{ name: "MCNSLP — Ministère de la Cohésion Nationale" }],
  icons: {
    icon: "/logo.svg",
  },
  openGraph: {
    title: "e-OSCS — Plateforme de gestion des activités MCNSLP",
    description:
      "Gérez vos activités, suivez vos indicateurs et générez vos rapports automatiquement avec e-OSCS.",
    siteName: "e-OSCS",
    type: "website",
    locale: "fr_CI",
  },
};

/**
 * Landing Page e-OSCS
 * 
 * Page d'accueil principale présentant la plateforme e-OSCS.
 * Cette page est conçue pour convertir les visiteurs en utilisateurs
 * en présentant clairement la valeur ajoutée du produit.
 */
export default function LandingPage() {
  return (
    <main className="min-h-screen overflow-hidden">
      {/* Navigation sticky */}
      <Navbar />

      {/* Hero Section - Accroche principale */}
      <HeroSection />

      {/* Problem Section - Les défis actuels */}
      <ProblemSection />

      {/* Solution Section - La réponse d'e-OSCS */}
      <SolutionSection />

      {/* Features Section - Fonctionnalités détaillées */}
      <FeaturesSection />

      {/* Reporting Section - Processus de reporting */}
      <ReportingSection />

      {/* Annual Plan Section - Visualisation du plan */}
      <AnnualPlanSection />

      {/* Reports Section - Types de rapports générés */}
      <ReportsSection />

      {/* Comparison Section - Tableau comparatif annuel */}
      <ComparisonSection />

      {/* Users Section - Pour qui ? */}
      <UsersSection />

      {/* Simplicity Section - Facilité d'utilisation */}
      <SimplicitySection />

      {/* Security Section - Sécurité des données */}
      <SecuritySection />

      {/* Subscription Section - CTA abonnement */}
      <SubscriptionSection />

      {/* How It Works Section - Processus d'inscription */}
      <HowItWorksSection />

      {/* Request Form Section - Formulaire de demande */}
      <RequestFormSection />

      {/* Contact Section - Coordonnées de contact */}
      <ContactSection />

      {/* Final CTA Section - Dernier appel à l'action */}
      <FinalCTASection />

      {/* Footer */}
      <Footer />
    </main>
  );
}
