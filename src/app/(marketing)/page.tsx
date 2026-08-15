import type { Metadata } from "next";
import { Sora, Inter } from "next/font/google";
import { PremiumLandingContent } from "@/components/landing/premium-landing-content";

/* ============================================
   FONTS GOOGLE - Configuration e-OSCS Premium
   ============================================ */
const sora = Sora({
  subsets: ["latin"],
  weight: ["700", "800"],
  variable: "--font-sora",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-inter",
  display: "swap",
});

/* ============================================
   METADONNÉES SEO & OPEN GRAPH
   ============================================ */
export const metadata: Metadata = {
  title: "e-OSCS — Fini les rapports bricolés sur Word et Excel | MCNSLP Côte d'Ivoire",
  description:
    "e-OSCS transforme chaque activité saisie une seule fois en rapports institutionnels prêts à présenter. Validation, consolidation et indicateurs inclus. MCNSLP Côte d'Ivoire.",
  keywords: [
    "e-OSCS",
    "MCNSLP",
    "Côte d'Ivoire",
    "rapport trimestriel",
    "Direction Régionale",
    "Direction Départementale",
    "reporting institutionnel",
    "suivi des activités",
    "indicateurs consolidés",
    "validation tracée",
  ],
  authors: [{ name: "MCNSLP — Ministère de la Cohésion Nationale, de la Solidarité Sociale et de la Lutte contre la Pauvreté" }],
  icons: {
    icon: "/logo.svg",
  },
  openGraph: {
    title: "e-OSCS — Rapports institutionnels en un clic | MCNSLP CI",
    description:
      "Transformez vos activités saisies une seule fois en rapports Word et PowerPoint conformes. Validation tracée, indicateurs consolidés.",
    siteName: "e-OSCS",
    type: "website",
    locale: "fr_CI",
  },
};

/* ============================================
   LANDING PAGE e-OSCS PREMIUM
   Page racine (/) — Production Ready
   ============================================ */
export default function LandingPage() {
  return (
    <div className={`${sora.variable} ${inter.variable}`}>
      <PremiumLandingContent />
    </div>
  );
}
