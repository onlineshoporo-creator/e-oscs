import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import {
  FileSpreadsheet,
  Clock,
  TrendingUp,
  Calendar,
  FileText,
  ShieldCheck,
  BarChart3,
  FileOutput,
  AlertTriangle,
  MessageCircle,
  Mail,
  Menu,
  X,
  Check,
} from "lucide-react";

// Composants marketing
import { HeroDashboardMockup } from "@/components/marketing/hero-dashboard-mockup";
import { PricingCards } from "@/components/marketing/pricing-cards";
import { FAQSection } from "@/components/marketing/faq-section";
import { HowItWorks } from "@/components/marketing/how-it-works";

export const metadata: Metadata = {
  title: "e-OSCS — Plateforme de suivi des activités de solidarité | MCNSLP",
  description:
    "Pilotez les activités de votre Direction Régionale ou Départementale du MCNSLP. Planification, saisie guidée, validation et génération automatique de rapports Word et PowerPoint.",
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
  ],
  openGraph: {
    title: "e-OSCS — Plateforme de suivi des activités de solidarité",
    description:
      "Du plan annuel au rapport administratif : centralisez, suivez et rapportez automatiquement.",
    siteName: "e-OSCS",
    type: "website",
    locale: "fr_CI",
  },
};

/* ============================================
   LANDING PAGE e-OSCS
   ============================================ */
export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* ===== SECTION 1 : HEADER STICKY ===== */}
      <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#F77F00] to-[#009E60] flex items-center justify-center shadow-sm">
              <span className="text-lg font-bold text-white">e</span>
            </div>
            <span className="text-xl font-bold text-slate-900">e-OSCS</span>
          </Link>

          {/* Navigation desktop */}
          <nav className="hidden md:flex items-center gap-6" aria-label="Navigation principale">
            <a href="#fonctionnalites" className="text-sm font-medium text-slate-600 hover:text-primary transition-colors">
              Fonctionnalités
            </a>
            <a href="#reporting" className="text-sm font-medium text-slate-600 hover:text-primary transition-colors">
              Reporting
            </a>
            <a href="#tarifs" className="text-sm font-medium text-slate-600 hover:text-primary transition-colors">
              Tarifs
            </a>
            <a href="#faq" className="text-sm font-medium text-slate-600 hover:text-primary transition-colors">
              FAQ
            </a>
            <a href="#contact" className="text-sm font-medium text-slate-600 hover:text-primary transition-colors">
              Contact
            </a>
          </nav>

          {/* Boutons CTA desktop */}
          <div className="hidden md:flex items-center gap-3">
            <Button variant="outline" size="sm" asChild>
              <Link href="/connexion">Se connecter</Link>
            </Button>
            <Button size="sm" asChild>
              <Link href="/demande">Demander un abonnement</Link>
            </Button>
          </div>

          {/* Menu mobile (placeholder - nécessite state client) */}
          <button
            className="md:hidden p-2 text-slate-600"
            aria-label="Ouvrir le menu"
          >
            <Menu className="size-5" />
          </button>
        </div>
      </header>

      {/* ===== SECTION 2 : HERO ===== */}
      <section className="relative overflow-hidden bg-gradient-to-b from-orange-50/50 via-white to-white py-16 md:py-24">
        {/* Décorations d'arrière-plan */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-primary/5 blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-success/5 blur-3xl" />
        </div>

        <div className="container mx-auto px-4 md:px-6 relative">
          <div className="max-w-4xl mx-auto text-center mb-12">
            {/* Badge */}
            <Badge
              variant="outline"
              className="mb-6 px-4 py-1.5 text-sm border-primary/30 bg-primary/5"
            >
              Plateforme officielle — Solidarité • Cohésion sociale • Alerte précoce
            </Badge>

            {/* Titre H1 */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 leading-tight mb-6">
              Pilotez les activités de votre Direction,{" "}
              <span className="text-gradient-primary">du plan annuel au rapport annuel</span>
            </h1>

            {/* Sous-titre */}
            <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto mb-8 leading-relaxed">
              Centralisez la planification, la saisie et le suivi de vos activités de solidarité.
              Générez automatiquement vos rapports{" "}
              <strong>Word</strong> et <strong>PowerPoint</strong> en quelques clics.
            </p>

            {/* Boutons CTA */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" className="w-full sm:w-auto text-base px-8" asChild>
                <Link href="/demande">Demander un abonnement</Link>
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="w-full sm:w-auto text-base px-8"
                asChild
              >
                <a href="#fonctionnalites">Découvrir les fonctionnalités</a>
              </Button>
            </div>
          </div>

          {/* Maquette dashboard */}
          <HeroDashboardMockup />
        </div>
      </section>

      {/* ===== SECTION 3 : BANDEAU DE CONFIANCE ===== */}
      <section className="py-12 bg-slate-900 text-white">
        <div className="container mx-auto px-4 md:px-6">
          <p className="text-center text-sm md:text-base text-slate-300 mb-8 max-w-2xl mx-auto">
            Conçu pour les Directions Régionales et Départementales du MCNSLP
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {[
              { value: "1 seule", label: "saisie", sublabel: "Données centralisées" },
              { value: "3 niveaux", label: "de reporting", sublabel: "Mensuel / Trimestriel / Annuel" },
              { value: "Word + PPT", label: "automatiques", sublabel: "Génération instantanée" },
              { value: "100%", label: "données isolées", sublabel: "Par Direction" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-2xl md:text-3xl font-bold text-primary">{stat.value}</p>
                <p className="text-sm md:text-base font-semibold mt-1">{stat.label}</p>
                <p className="text-xs text-slate-400 mt-0.5 hidden md:block">{stat.sublabel}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== SECTION 4 : PROBLÈMES RÉSOLUS ===== */}
      <section className="py-16 md:py-24 bg-slate-50/50">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-slate-900 mb-4">
              Finis les cauchemars administratifs
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              e-OSCS résout les problèmes quotidiens des Directions dans la gestion de leurs activités.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 lg:gap-8 max-w-5xl mx-auto">
            {/* Problème 1 */}
            <Card className="text-center group hover:shadow-md transition-shadow">
              <CardContent className="pt-8 pb-6">
                <div className="w-16 h-16 rounded-2xl bg-red-50 flex items-center justify-center mx-auto mb-5 group-hover:scale-110 transition-transform">
                  <FileSpreadsheet className="size-7 text-red-500" />
                </div>
                <h3 className="font-semibold text-lg text-slate-900 mb-2">
                  Saisie dispersée
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Plus de fichiers Excel éparpillés, de feuilles de papier perdues ou de données
                  incohérentes entre services.
                </p>
              </CardContent>
            </Card>

            {/* Problème 2 */}
            <Card className="text-center group hover:shadow-md transition-shadow">
              <CardContent className="pt-8 pb-6">
                <div className="w-16 h-16 rounded-2xl bg-amber-50 flex items-center justify-center mx-auto mb-5 group-hover:scale-110 transition-transform">
                  <Clock className="size-7 text-amber-500" />
                </div>
                <h3 className="font-semibold text-lg text-slate-900 mb-2">
                  Compilation chronophage
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Finies les heures passées à rassembler manuellement les données pour produire
                  un rapport mensuel.
                </p>
              </CardContent>
            </Card>

            {/* Problème 3 */}
            <Card className="text-center group hover:shadow-md transition-shadow">
              <CardContent className="pt-8 pb-6">
                <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center mx-auto mb-5 group-hover:scale-110 transition-transform">
                  <TrendingUp className="size-7 text-blue-500" />
                </div>
                <h3 className="font-semibold text-lg text-slate-900 mb-2">
                  Aucune vision globale
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Visualisez en temps réel l'écart entre vos prévisions et réalisations pour
                  une meilleure prise de décision.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* ===== SECTION 5 : FONCTIONNALITÉS CLÉS ===== */}
      <section id="fonctionnalites" className="py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-slate-900 mb-4">
              Tout ce dont vous avez besoin
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Des outils conçus spécifiquement pour répondre aux besoins des Directions
              Régionales et Départementales.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {/* Fonctionnalité 1 */}
            <FeatureCard
              icon={<Calendar className="size-6" />}
              iconBg="bg-orange-100"
              iconColor="text-orange-600"
              title="Plan annuel structuré"
              description="Définissez vos objectifs et planifiez vos activités sur toute l'année avec un calendrier visuel."
              detail="Suivez l'avancement en temps réel par rapport à vos prévisions."
            />

            {/* Fonctionnalité 2 */}
            <FeatureCard
              icon={<FileText className="size-6" />}
              iconBg="bg-green-100"
              iconColor="text-green-600"
              title="Saisie guidée des activités"
              description="Un formulaire intuitif pour saisir chaque activité : type, bénéficiaires, coûts, résultats."
              detail="Pas d'erreur possible grâce aux validations intégrées."
            />

            {/* Fonctionnalité 3 */}
            <FeatureCard
              icon={<ShieldCheck className="size-6" />}
              iconBg="bg-blue-100"
              iconColor="text-blue-600"
              title="Circuit de validation"
              description="Validez chaque activité selon la hiérarchie de votre Direction avant intégration."
              detail="Traçabilité complète avec historique des approbations."
            />

            {/* Fonctionnalité 4 */}
            <FeatureCard
              icon={<BarChart3 className="size-6" />}
              iconBg="bg-purple-100"
              iconColor="text-purple-600"
              title="Indicateurs & bénéficiaires"
              description="Suivez vos KPI : nombre d'activités, bénéficiaires atteints, budget consommé."
              detail="Graphiques et tableaux de bord automatiquement mis à jour."
            />

            {/* Fonctionnalité 5 */}
            <FeatureCard
              icon={<FileOutput className="size-6" />}
              iconBg="bg-red-100"
              iconColor="text-red-600"
              title="Rapports Word/PPT automatiques"
              description="Générez vos rapports administratifs formatés en un clic, prêts à imprimer ou présenter."
              detail="Modèles conformes aux standards du ministère."
            />

            {/* Fonctionnalité 6 */}
            <FeatureCard
              icon={<AlertTriangle className="size-6" />}
              iconBg="bg-amber-100"
              iconColor="text-amber-600"
              title="Alertes & incidents"
              description="Signalez et suivez les incidents ou situations d'urgence requiring attention immédiate."
              detail="Système d'alerte précoce intégré pour la gestion des crises."
            />
          </div>
        </div>
      </section>

      {/* ===== SECTION 6 : APERÇU REPORTING ===== */}
      <section id="reporting" className="py-16 md:py-24 bg-slate-50/50">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-slate-900 mb-4">
              Reporting à tous les niveaux
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Du rapport mensuel au bilan annuel, générez tous vos livrables en quelques clics.
            </p>
          </div>

          <Tabs defaultValue="mensuel" className="max-w-4xl mx-auto">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="mensuel">Mensuel</TabsTrigger>
              <TabsTrigger value="trimestriel">Trimestriel</TabsTrigger>
              <TabsTrigger value="annuel">Annuel</TabsTrigger>
            </TabsList>

            {/* Onglet Mensuel */}
            <TabsContent value="mensuel">
              <ReportingPreview
                title="Rapport Mensuel d'Activités"
                period="Janvier 2026"
                deliverables={[
                  { format: "DOCX", name: "Rapport narratif mensuel", desc: "Synthèse des activités réalisées" },
                  { format: "XLSX", name: "Tableau des indicateurs", desc: "KPI et métriques du mois" },
                ]}
                metrics={[
                  { label: "Activités réalisées", value: "8 / 10" },
                  { label: "Bénéficiaires", value: "342" },
                  { label: "Budget exécuté", value: "67%" },
                ]}
              />
            </TabsContent>

            {/* Onglet Trimestriel */}
            <TabsContent value="trimestriel">
              <ReportingPreview
                title="Bilan Trimestriel"
                period="T1 2026 (Jan-Mars)"
                deliverables={[
                  { format: "DOCX", name: "Rapport trimestriel détaillé", desc: "Analyse des 3 mois" },
                  { format: "PPTX", name: "Présentation direction", desc: "Slides pour réunion" },
                  { format: "XLSX", name: "Export données brutes", desc: "Pour analyses personnalisées" },
                ]}
                metrics={[
                  { label: "Taux réalisation", value: "78%" },
                  { label: "Total bénéficiaires", value: "1 024" },
                  { label: "Budget consommé", value: "72%" },
                ]}
              />
            </TabsContent>

            {/* Onglet Annuel */}
            <TabsContent value="annuel">
              <ReportingPreview
                title="Rapport Annuel de Gestion"
                period="Exercice 2026"
                deliverables={[
                  { format: "DOCX", name: "Rapport annuel complet", desc: "Document officiel ~50 pages" },
                  { format: "PPTX", name: "Présentation bilan annuel", desc: "~20 slides illustrées" },
                  { format: "PDF", name: "Annexes statistiques", desc: "Graphiques et tableaux détaillés" },
                ]}
                metrics={[
                  { label: "Objectif global", value: "85%" },
                  { label: "Bénéficiaires cumulés", value: "4 521" },
                  { label: "Budget total exécuté", value: "91%" },
                ]}
              />
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* ===== SECTION 7 : COMMENT ÇA MARCHE ===== */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-slate-900 mb-4">
              Comment ça marche ?
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              4 étapes simples pour commencer à utiliser e-OSCS dans votre Direction.
            </p>
          </div>

          <HowItWorks />
        </div>
      </section>

      {/* ===== SECTION 8 : TARIFS ===== */}
      <section id="tarifs" className="py-16 md:py-24 bg-slate-50/50">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-slate-900 mb-4">
              Choisissez votre formule
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Des tarifs adaptés à la taille et aux besoins de chaque Direction.
              Sans engagement de longue durée.
            </p>
          </div>

          <PricingCards />
        </div>
      </section>

      {/* ===== SECTION 9 : FAQ ===== */}
      <section id="faq" className="py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-slate-900 mb-4">
              Questions fréquentes
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Tout ce que vous devez savoir sur e-OSCS avant de vous abonner.
            </p>
          </div>

          <FAQSection />
        </div>
      </section>

      {/* ===== SECTION 10 : CONTACT FINAL ===== */}
      <section id="contact" className="py-16 md:py-20 bg-gradient-brand">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-4">
            Une question ? Parlons-en
          </h2>
          <p className="text-white/80 max-w-xl mx-auto mb-8">
            Notre équipe est disponible pour répondre à toutes vos questions et vous accompagner
            dans votre démarche de souscription.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            {/* WhatsApp */}
            <a
              href="https://wa.me/2250576103277?text=Bonjour%2C%20je%20souhaite%20avoir%20des%20informations%20sur%20e-OSCS"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white text-success font-semibold rounded-lg shadow-lg hover:shadow-xl transition-shadow"
            >
              <MessageCircle className="size-5" />
              WhatsApp
            </a>

            {/* Email */}
            <a
              href="mailto:omouitsi@gmail.com?subject=Question%20sur%20e-OSCS"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 text-white font-semibold rounded-lg border border-white/30 hover:bg-white/20 transition-colors"
            >
              <Mail className="size-5" />
              Envoyer un email
            </a>
          </div>

          <p className="mt-6 text-white/70 text-sm">
            Réponse sous 24h ouvrées garantie
          </p>
        </div>
      </section>

      {/* ===== SECTION 11 : FOOTER ===== */}
      <footer className="bg-slate-900 text-white py-12 md:py-16">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid md:grid-cols-4 gap-8 md:gap-12">
            {/* Colonne 1 : Logo & Description */}
            <div className="md:col-span-2">
              <Link href="/" className="flex items-center gap-2 mb-4">
                <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#F77F00] to-[#009E60] flex items-center justify-center">
                  <span className="text-lg font-bold text-white">e</span>
                </div>
                <span className="text-xl font-bold">e-OSCS</span>
              </Link>
              <p className="text-slate-400 text-sm leading-relaxed max-w-md mb-6">
                Plateforme numérique de suivi des activités de solidarité et de cohésion sociale
                pour les Directions Régionales et Départementales du MCNSLP, Côte d&apos;Ivoire.
              </p>
              <div className="flex items-center gap-4">
                <a
                  href="https://wa.me/2250576103277"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-400 hover:text-white transition-colors"
                  aria-label="Contactez-nous sur WhatsApp"
                >
                  <MessageCircle className="size-5" />
                </a>
                <a
                  href="mailto:omouitsi@gmail.com"
                  className="text-slate-400 hover:text-white transition-colors"
                  aria-label="Envoyez-nous un email"
                >
                  <Mail className="size-5" />
                </a>
              </div>
            </div>

            {/* Colonne 2 : Liens utiles */}
            <div>
              <h3 className="font-semibold mb-4 text-sm uppercase tracking-wider text-slate-300">
                Liens utiles
              </h3>
              <ul className="space-y-3">
                <li>
                  <a href="#fonctionnalites" className="text-sm text-slate-400 hover:text-white transition-colors">
                    Fonctionnalités
                  </a>
                </li>
                <li>
                  <a href="#tarifs" className="text-sm text-slate-400 hover:text-white transition-colors">
                    Tarifs
                  </a>
                </li>
                <li>
                  <a href="#faq" className="text-sm text-slate-400 hover:text-white transition-colors">
                    FAQ
                  </a>
                </li>
                <li>
                  <Link href="/conditions" className="text-sm text-slate-400 hover:text-white transition-colors">
                    Conditions d&apos;utilisation
                  </Link>
                </li>
                <li>
                  <Link href="/confidentialite" className="text-sm text-slate-400 hover:text-white transition-colors">
                    Confidentialité
                  </Link>
                </li>
              </ul>
            </div>

            {/* Colonne 3 : Contact */}
            <div>
              <h3 className="font-semibold mb-4 text-sm uppercase tracking-wider text-slate-300">
                Contact
              </h3>
              <ul className="space-y-3">
                <li>
                  <a
                    href="https://wa.me/2250576103277"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-slate-400 hover:text-white transition-colors"
                  >
                    WhatsApp : +225 05 76 103 277
                  </a>
                </li>
                <li>
                  <a
                    href="mailto:omouitsi@gmail.com"
                    className="text-sm text-slate-400 hover:text-white transition-colors"
                  >
                    omouitsi@gmail.com
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <Separator className="my-8 bg-slate-800" />

          {/* Copyright */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-slate-500">
            <p>&copy; 2026 e-OSCS — MCNSLP. Tous droits réservés.</p>
            <p>
              Ministère de la Cohésion Nationale, de la Solidarité et de la Lutte contre la Pauvreté — Côte d&apos;Ivoire
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

/* ============================================
   COMPOSANTS INTERNES
   ============================================ */

/** Carte de fonctionnalité */
function FeatureCard({
  icon,
  iconBg,
  iconColor,
  title,
  description,
  detail,
}: {
  icon: React.ReactNode;
  iconBg: string;
  iconColor: string;
  title: string;
  description: string;
  detail: string;
}) {
  return (
    <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
      <CardHeader>
        <div className={`w-12 h-12 rounded-xl ${iconBg} flex items-center justify-center ${iconColor} mb-3`}>
          {icon}
        </div>
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription className="text-sm leading-relaxed mb-2">
          {description}
        </CardDescription>
        <p className="text-xs text-muted-foreground italic">{detail}</p>
      </CardContent>
    </Card>
  );
}

/** Aperçu de rapport par onglet */
function ReportingPreview({
  title,
  period,
  deliverables,
  metrics,
}: {
  title: string;
  period: string;
  deliverables: { format: string; name: string; desc: string }[];
  metrics: { label: string; value: string }[];
}) {
  return (
    <div className="bg-white rounded-xl border p-6 md:p-8">
      {/* En-tête du rapport */}
      <div className="border-b pb-4 mb-6">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-semibold text-lg text-slate-900">{title}</h3>
            <p className="text-sm text-muted-foreground">{period}</p>
          </div>
          <Badge variant="secondary">Aperçu</Badge>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Métriques */}
        <div>
          <h4 className="text-sm font-medium text-slate-700 mb-4">Indicateurs clés</h4>
          <div className="space-y-3">
            {metrics.map((metric) => (
              <div key={metric.label} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                <span className="text-sm text-slate-600">{metric.label}</span>
                <span className="font-semibold text-slate-900">{metric.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Livrables */}
        <div>
          <h4 className="text-sm font-medium text-slate-700 mb-4">Livrables générés</h4>
          <div className="space-y-3">
            {deliverables.map((item) => (
              <div key={item.name} className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                  item.format === "DOCX" ? "bg-blue-100 text-blue-700" :
                  item.format === "PPTX" ? "bg-orange-100 text-orange-700" :
                  item.format === "XLSX" ? "bg-green-100 text-green-700" :
                  "bg-purple-100 text-purple-700"
                }`}>
                  {item.format}
                </span>
                <div>
                  <p className="text-sm font-medium text-slate-900">{item.name}</p>
                  <p className="text-xs text-muted-foreground">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bouton action simulé */}
      <div className="mt-6 pt-6 border-t">
        <div className="flex items-center justify-between">
          <p className="text-xs text-muted-foreground">
            Généré automatiquement à partir de vos données saisies
          </p>
          <Button size="sm" variant="outline" disabled>
            <Check className="size-4 mr-2" />
            Prêt à générer
          </Button>
        </div>
      </div>
    </div>
  );
}
