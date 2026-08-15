import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProviderWrapper } from "@/components/ui/theme-toggle";
import { ThemeProvider as NextThemesProvider } from "next-themes";

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

/**
 * RootLayout - Layout racine de l'application
 * 
 * Intègre:
 * - ThemeProvider (next-themes) pour le dark mode global
 * - Script anti-flash pour éviter le clignotement au chargement
 * - Toaster pour les notifications toast
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <head>
        {/* Script anti-flash pour le thème */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('theme');
                  if (theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                    document.documentElement.classList.add('dark');
                  }
                } catch(e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="font-sans antialiased bg-background text-foreground transition-colors duration-300">
        <NextThemesProvider
          attribute="class"
          defaultTheme="system"
          enableSystem={true}
          disableTransitionOnChange={false}
        >
          <ThemeProviderWrapper>
            {children}
            <Toaster />
          </ThemeProviderWrapper>
        </NextThemesProvider>
      </body>
    </html>
  );
}
