import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

export const metadata: Metadata = {
  title: "e-OSCS — Plateforme nationale de suivi des activités de solidarité et de cohésion sociale",
  description: 
    "e-OSCS centralise la planification, la saisie, la validation et génère " +
    "automatiquement vos rapports administratifs Word et PowerPoint. " +
    "Une donnée saisie une seule fois, exploitée à tous les niveaux.",
  keywords: [
    "e-OSCS", 
    "MCNSLP", 
    "Côte d'Ivoire", 
    "solidarité", 
    "cohésion sociale", 
    "suivi des activités",
    "rapport administratif",
    "Direction Régionale",
    "Direction Départementale"
  ],
  authors: [{ name: "MCNSLP — Ministère de la Cohésion Nationale" }],
  icons: {
    icon: "/logo.svg",
  },
  openGraph: {
    title: "e-OSCS — Plateforme de suivi des activités de solidarité",
    description:
      "Pilotez les activités de votre Direction, du plan annuel au rapport administratif.",
    siteName: "e-OSCS",
    type: "website",
    locale: "fr_CI",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className="font-sans antialiased bg-background text-foreground">
        {children}
        <Toaster />
      </body>
    </html>
  );
}
