import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  Rocket,
  Sparkles,
  Bug,
  Wrench,
  Palette,
  Code2,
  Database,
  Shield,
  Smartphone,
  Globe,
  CalendarDays,
  Mail,
  Github,
  ChevronDown,
  Star,
  Zap,
  Package,
  Clock,
  TrendingUp,
  MessageSquare,
} from "lucide-react";

/* ============================================
   METADONNÉES SEO & OPEN GRAPH
   ============================================ */
export const metadata: Metadata = {
  title: "Nouveautés & Changelog — e-OSCS | MCNSLP Côte d'Ivoire",
  description:
    "Suivez l'évolution d'e-OSCS : nouvelles fonctionnalités, améliorations et corrections. Découvrez toutes les mises à jour de la plateforme.",
  keywords: [
    "e-OSCS",
    "changelog",
    "nouveautés",
    "mises à jour",
    "MCNSLP",
    "Côte d'Ivoire",
    "historique des versions",
  ],
};

/* ============================================
   TYPES POUR LE CHANGELOG
   ============================================ */
interface ChangelogItem {
  type: "feature" | "improvement" | "fix" | "design" | "tech";
  text: string;
}

interface VersionData {
  version: string;
  date: string;
  title: string;
  description?: string;
  isCurrent: boolean;
  items: ChangelogItem[];
  categories?: {
    title: string;
    icon: React.ReactNode;
    items: string[];
  }[];
}

/* ============================================
   DONNÉES DU CHANGELOG
   ============================================ */
const changelogVersions: VersionData[] = [
  {
    version: "1.0.0",
    date: "Janvier 2025",
    title: "Lancement Initial",
    isCurrent: true,
    categories: [
      {
        title: "Features majeures",
        icon: <Rocket className="w-5 h-5" />,
        items: [
          "Landing page professionnelle avec charte CI",
          "Espace Agent complet (activités, brouillons, rapports)",
          "Espace Admin (gestion utilisateurs, codes, organisations)",
          "Dashboard avec KPIs et graphiques interactifs",
          "Système d'authentification sécurisé",
          "Mode sombre/clair adaptatif",
        ],
      },
      {
        title: "Design",
        icon: <Palette className="w-5 h-5" />,
        items: [
          "Charte graphique Côte d'Ivoire (orange, vert, blanc)",
          "Motifs africains discrets et élégants",
          "Responsive mobile-first optimisé",
          "Animations fluides au scroll",
          "Interface accessible et intuitive",
        ],
      },
      {
        title: "Technique",
        icon: <Wrench className="w-5 h-5" />,
        items: [
          "Next.js 16 + TypeScript strict",
          "Supabase (PostgreSQL + Auth)",
          "Tailwind CSS 4 + shadcn/ui",
          "API routes complètes et sécurisées",
          "Architecture scalable multi-rôles",
        ],
      },
    ],
    items: [],
  },
  {
    version: "0.9.0",
    date: "Décembre 2024",
    title: "Beta Publique",
    isCurrent: false,
    description:
      "Ouverture aux premiers testeurs pour validation finale avant le lancement officiel.",
    items: [
      { type: "feature", text: "Ouverture aux premiers testeurs sélectionnés" },
      { type: "improvement", text: "Feedback et corrections basées sur les retours utilisateurs" },
      { type: "improvement", text: "Documentation utilisateur complète" },
      { type: "fix", text: "Correction de bugs mineurs rapportés par les bêta-testeurs" },
      { type: "tech", text: "Optimisation des performances de chargement" },
    ],
  },
  {
    version: "0.5.0",
    date: "Novembre 2024",
    title: "Alpha Interne",
    isCurrent: false,
    description:
      "Première version fonctionnelle utilisée en interne pour les tests initiaux.",
    items: [
      { type: "feature", text: "Développement initial du core applicatif" },
      { type: "feature", text: "Architecture de base établie" },
      { type: "feature", text: "Premiers tests d'intégration" },
      { type: "tech", text: "Mise en place de l'infrastructure Supabase" },
      { type: "design", text: "Maquettes UI premières versions" },
    ],
  },
];

/* ============================================
   ROADMAP - VERSIONS À VENIR
   ============================================ */
const roadmapItems = [
  {
    version: "v1.1.0",
    title: "Application Mobile (PWA)",
    description: "Accès hors-ligne, notifications push, interface mobile native.",
    icon: <Smartphone className="w-6 h-6" />,
    status: "planned" as const,
    estimated: "Q1 2025",
  },
  {
    version: "v1.2.0",
    title: "API Publique",
    description: "API REST pour intégrations tierces et connecteurs externes.",
    icon: <Code2 className="w-6 h-6" />,
    status: "planned" as const,
    estimated: "Q2 2025",
  },
  {
    version: "v2.0.0",
    title: "Multi-pays UEMOA",
    description: "Extension aux pays de l'Union Économique et Monétaire Ouest-Africaine.",
    icon: <Globe className="w-6 h-6" />,
    status: "vision" as const,
    estimated: "2026",
  },
];

/* ============================================
   CONFIGURATION DES BADGES DE TYPE
   ============================================ */
const typeConfig = {
  feature: {
    label: "Feature",
    icon: <Sparkles className="w-3.5 h-3.5 mr-1" />,
    bgColor: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300",
    emoji: "🎉",
  },
  improvement: {
    label: "Amélioration",
    icon: <TrendingUp className="w-3.5 h-3.5 mr-1" />,
    bgColor: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
    emoji: "✨",
  },
  fix: {
    label: "Bug Fix",
    icon: <Bug className="w-3.5 h-3.5 mr-1" />,
    bgColor: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
    emoji: "🐛",
  },
  design: {
    label: "Design",
    icon: <Palette className="w-3.5 h-3.5 mr-1" />,
    bgColor: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
    emoji: "🎨",
  },
  tech: {
    label: "Technique",
    icon: <Wrench className="w-3.5 h-3.5 mr-1" />,
    bgColor: "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300",
    emoji: "🔧",
  },
};

/* ============================================
   PAGE CHANGELOG e-OSCS
   ============================================ */
export default function ChangelogPage() {
  // Compteurs de statistiques
  const totalFeatures = changelogVersions.reduce(
    (acc, v) => acc + v.items.filter((i) => i.type === "feature").length +
      (v.categories ? v.categories.reduce((cAcc, c) => cAcc + c.items.length, 0) : 0),
    0
  );
  const totalVersions = changelogVersions.length;

  return (
    <div className="min-h-screen bg-white">
      {/* ============================================
          HEADER STICKY avec navigation et breadcrumb
          ============================================ */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Logo et breadcrumb */}
            <div className="flex items-center gap-4">
              <Link
                href="/"
                className="flex items-center gap-2.5 group"
                aria-label="Retour à l'accueil e-OSCS"
              >
                <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#F77F00] to-[#009E60] flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow">
                  <span className="text-lg font-bold text-white">e</span>
                </div>
                <span className="text-xl font-bold text-slate-900">e-OSCS</span>
              </Link>

              {/* Breadcrumb */}
              <nav aria-label="Fil d'Ariane" className="hidden sm:flex items-center gap-2 text-sm">
                <Separator orientation="vertical" className="h-5 bg-slate-300" />
                <Link href="/" className="text-slate-500 hover:text-[#F77F00] transition-colors">
                  Accueil
                </Link>
                <span className="text-slate-400">/</span>
                <span className="text-slate-900 font-medium">Changelog</span>
              </nav>
            </div>

            {/* Bouton retour */}
            <Button variant="outline" size="sm" asChild className="gap-2">
              <Link href="/">
                <ArrowLeft className="w-4 h-4" />
                Retour à l&apos;accueil
              </Link>
            </Button>
          </div>
        </div>
      </header>

      {/* ============================================
          SECTION HERO - Liseré tricolore CI
          ============================================ */}
      <section className="relative overflow-hidden">
        {/* Liseré tricolore Côte d'Ivoire */}
        <div className="h-2 flex">
          <div className="flex-1 bg-[#F77F00]" /> {/* Orange */}
          <div className="flex-1 bg-white" /> {/* Blanc */}
          <div className="flex-1 bg-[#009E60]" /> {/* Vert */}
        </div>

        {/* Fond hero avec gradient */}
        <div className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-[#0F172A] py-16 md:py-24">
          {/* Motifs décoratifs CSS */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-20 left-10 w-72 h-72 bg-[#F77F00] rounded-full blur-3xl" />
            <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#009E60] rounded-full blur-3xl" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white rounded-full blur-3xl opacity-5" />
          </div>

          <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            {/* Badge version actuelle */}
            <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-[#F77F00]/20 to-[#009E60]/20 border border-[#F77F00]/30 mb-8">
              <Zap className="w-4 h-4 text-[#F77F00]" />
              <span className="text-sm text-white/90 font-semibold tracking-wide">
                v1.0.0 — Janvier 2025
              </span>
              <Badge className="ml-1 bg-green-500 text-white hover:bg-green-500 text-xs">
                Actuel
              </Badge>
            </div>

            {/* Titre principal */}
            <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold text-white mb-6 tracking-tight">
              Nouveautés &{" "}
              <span className="bg-gradient-to-r from-[#F77F00] to-[#FFB84D] bg-clip-text text-transparent">
                Changelog
              </span>
            </h1>

            {/* Sous-titre */}
            <p className="text-xl md:text-2xl text-white/80 max-w-3xl mx-auto mb-8 leading-relaxed font-light">
              Suivez l&apos;évolution d&apos;{" "}
              <span className="text-[#009E60] font-semibold">e-OSCS</span>
            </p>

            {/* Description */}
            <p className="text-base md:text-lg text-slate-400 max-w-2xl mx-auto mb-12 leading-relaxed">
              Découvrez chaque nouvelle fonctionnalité, amélior technique et correction de bug.
              Transparence totale sur notre feuille de route.
            </p>

            {/* Statistiques rapides */}
            <div className="flex flex-wrap items-center justify-center gap-6 md:gap-10">
              <div className="flex items-center gap-3 px-5 py-3 rounded-xl bg-white/5 border border-white/10">
                <Package className="w-5 h-5 text-[#F77F00]" />
                <div className="text-left">
                  <div className="text-2xl font-bold text-white">{totalVersions}</div>
                  <div className="text-xs text-slate-400">Versions</div>
                </div>
              </div>
              <div className="flex items-center gap-3 px-5 py-3 rounded-xl bg-white/5 border border-white/10">
                <Sparkles className="w-5 h-5 text-[#009E60]" />
                <div className="text-left">
                  <div className="text-2xl font-bold text-white">{totalFeatures}+</div>
                  <div className="text-xs text-slate-400">Nouveautés</div>
                </div>
              </div>
              <div className="flex items-center gap-3 px-5 py-3 rounded-xl bg-white/5 border border-white/10">
                <CalendarDays className="w-5 h-5 text-blue-400" />
                <div className="text-left">
                  <div className="text-2xl font-bold text-white">3</div>
                  <div className="text-xs text-slate-400">Mois de dev</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================
          SECTION TIMELINE PRINCIPALE
          ============================================ */}
      <section className="py-20 md:py-28 bg-gradient-to-b from-slate-50 to-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* En-tête avec actions */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-16">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3">
                Historique des versions
              </h2>
              <p className="text-slate-600 text-lg">
                Toutes les mises à jour, de la première alpha à la version actuelle.
              </p>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap items-center gap-3">
              {/* Bouton s'abonner */}
              <Button
                asChild
                className="bg-gradient-to-r from-[#F77F00] to-[#E67E00] hover:from-[#E67E00] hover:to-[#F77F00] text-white shadow-lg shadow-orange-500/25 gap-2"
              >
                <a href="mailto:omouitsi@gmail.com?subject=Abonnement%20aux%20mises%20à%20jour%20e-OSCS&body=Bonjour,%0A%0AJe%20souhaite%20être%20tenu(e)%20au%20courant%20des%20nouvelles%20versions%20d'e-OSCS.%0A%0ACordialement">
                  <Mail className="w-4 h-4" />
                  S&apos;abonner aux mises à jour
                </a>
              </Button>

              {/* Lien GitHub (optionnel) */}
              <Button variant="outline" className="gap-2 border-slate-300 hover:border-slate-400">
                <Github className="w-4 h-4" />
                GitHub Releases
              </Button>
            </div>
          </div>

          {/* ============================================
              TIMELINE VERTICALE
              ============================================ */}
          <div className="relative max-w-4xl mx-auto">
            {/* Ligne centrale du timeline */}
            <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-[#F77F00] via-[#009E60] to-slate-300 md:-translate-x-0.5" />

            {/* Items du timeline */}
            <div className="space-y-12">
              {changelogVersions.map((version, index) => (
                <div
                  key={version.version}
                  className={`relative flex flex-col md:flex-row gap-8 ${
                    index % 2 === 0 ? "md:flex-row-reverse" : ""
                  }`}
                >
                  {/* Point du timeline */}
                  <div className="absolute left-4 md:left-1/2 w-4 h-4 -translate-x-1/2 mt-6 z-10">
                    <div
                      className={`w-4 h-4 rounded-full border-4 border-white shadow-md ${
                        version.isCurrent
                          ? "bg-[#F77F00] ring-4 ring-[#F77F00]/30"
                          : "bg-[#009E60]"
                      }`}
                    >
                      {version.isCurrent && (
                        <Star className="absolute -top-1 -right-1 w-3 h-3 text-[#F77F00] fill-current" />
                      )}
                    </div>
                  </div>

                  {/* Contenu - côté gauche (desktop pair) ou droite (impair) */}
                  <div className={`ml-12 md:ml-0 md:w-1/2 ${index % 2 === 0 ? "md:pr-12" : "md:pl-12"}`}>
                    <div
                      className={`relative bg-white rounded-2xl p-6 md:p-8 shadow-sm border-2 transition-all duration-300 hover:shadow-xl ${
                        version.isCurrent
                          ? "border-[#F77F00] shadow-lg shadow-orange-500/10"
                          : "border-slate-200 hover:border-slate-300"
                      }`}
                    >
                      {/* Badge version courante */}
                      {version.isCurrent && (
                        <div className="absolute -top-3 right-6">
                          <Badge className="bg-gradient-to-r from-[#F77F00] to-[#E67E00] text-white px-3 py-1 gap-1 shadow-md">
                            <Star className="w-3 h-3" />
                            Version actuelle
                          </Badge>
                        </div>
                      )}

                      {/* En-tête de la carte */}
                      <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
                        <div>
                          <div className="flex items-center gap-3 mb-2">
                            <span className="text-2xl md:text-3xl font-bold text-slate-900">
                              v{version.version}
                            </span>
                            {version.isCurrent && (
                              <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
                                <Zap className="w-3 h-3 mr-1" />
                                Stable
                              </Badge>
                            )}
                          </div>
                          <h3 className="text-lg font-semibold text-slate-700 mb-1">
                            {version.title}
                          </h3>
                          <div className="flex items-center gap-2 text-sm text-slate-500">
                            <CalendarDays className="w-4 h-4" />
                            <time dateTime={version.date}>{version.date}</time>
                          </div>
                        </div>
                      </div>

                      {/* Description optionnelle */}
                      {version.description && (
                        <p className="text-slate-600 mb-6 leading-relaxed border-b border-slate-100 pb-4">
                          {version.description}
                        </p>
                      )}

                      {/* Catégories détaillées (pour v1.0.0) */}
                      {version.categories && version.categories.length > 0 && (
                        <div className="space-y-6">
                          {version.categories.map((category, catIndex) => (
                            <div key={catIndex}>
                              <div className="flex items-center gap-2 mb-3">
                                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-slate-100 text-slate-700">
                                  {category.icon}
                                </div>
                                <h4 className="font-semibold text-slate-800">{category.title}</h4>
                              </div>
                              <ul className="grid gap-2 ml-11">
                                {category.items.map((item, itemIndex) => (
                                  <li
                                    key={itemIndex}
                                    className="flex items-start gap-2 text-sm text-slate-600"
                                  >
                                    <CheckIcon className="w-4 h-4 text-[#009E60] mt-0.5 flex-shrink-0" />
                                    <span>{item}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Liste d'items simple (pour autres versions) */}
                      {!version.categories &&
                        version.items.length > 0 && (
                          <div className="space-y-3">
                            {version.items.map((item, itemIndex) => (
                              <div
                                key={itemIndex}
                                className="flex items-start gap-3 p-3 rounded-xl bg-slate-50/80 hover:bg-slate-50 transition-colors"
                              >
                                <Badge
                                  variant="secondary"
                                  className={`${typeConfig[item.type].bgColor} shrink-0 mt-0.5`}
                                >
                                  {typeConfig[item.type].icon}
                                  {typeConfig[item.type].label}
                                </Badge>
                                <span className="text-sm text-slate-700 leading-relaxed">
                                  {item.text}
                                </span>
                              </div>
                            ))}
                          </div>
                        )}
                    </div>
                  </div>

                  {/* Espace vide pour l'autre côté (desktop) */}
                  <div className="hidden md:block md:w-1/2" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ============================================
          SECTION ROADMAP - À VENIR
          ============================================ */}
      <section className="py-20 md:py-28 bg-gradient-to-br from-slate-900 via-slate-800 to-[#0F172A] relative overflow-hidden">
        {/* Motifs décoratifs */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 right-20 w-72 h-72 bg-[#009E60] rounded-full blur-3xl" />
          <div className="absolute bottom-20 left-20 w-96 h-96 bg-[#F77F00] rounded-full blur-3xl" />
        </div>

        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8">
          {/* En-tête section */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-[#F77F00]/20 to-[#009E60]/20 border border-white/10 mb-6">
              <Clock className="w-7 h-7 text-[#F77F00]" />
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
              Roadmap{" "}
              <span className="bg-gradient-to-r from-[#009E60] to-[#34D399] bg-clip-text text-transparent">
                à venir
              </span>
            </h2>
            <p className="text-lg text-slate-400 leading-relaxed">
              Découvrez les fonctionnalités que nous préparons pour l&apos;avenir d&apos;e-OSCS.
            </p>
          </div>

          {/* Cartes roadmap */}
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {roadmapItems.map((item, index) => (
              <div
                key={item.version}
                className="group relative bg-white/5 backdrop-blur-sm rounded-2xl p-6 md:p-8 border border-white/10 hover:border-[#F77F00]/50 transition-all duration-300"
              >
                {/* Badge statut */}
                <div className="flex items-center justify-between mb-6">
                  <span className="text-xs font-semibold text-[#F77F00] uppercase tracking-wider">
                    {item.version}
                  </span>
                  <Badge
                    variant="secondary"
                    className={
                      item.status === "planned"
                        ? "bg-blue-500/20 text-blue-300 border-blue-500/30"
                        : "bg-purple-500/20 text-purple-300 border-purple-500/30"
                    }
                  >
                    {item.status === "planned" ? "Planifié" : "Vision"}
                  </Badge>
                </div>

                {/* Icône */}
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#F77F00]/20 to-[#009E60]/20 flex items-center justify-center text-[#F77F00] mb-6 group-hover:scale-110 transition-transform">
                  {item.icon}
                </div>

                {/* Contenu */}
                <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed mb-6">
                  {item.description}
                </p>

                {/* Estimation */}
                <div className="flex items-center gap-2 text-sm text-slate-500 pt-4 border-t border-white/10">
                  <CalendarDays className="w-4 h-4" />
                  <span>Prévu : {item.estimated}</span>
                </div>

                {/* Numéro décoratif */}
                <div className="absolute top-4 right-6 text-6xl font-black text-white/5">
                  {String(index + 1).padStart(2, "0")}
                </div>
              </div>
            ))}
          </div>

          {/* CTA feedback */}
          <div className="mt-16 text-center">
            <div className="inline-flex flex-col sm:flex-row items-center gap-4 p-6 md:p-8 rounded-2xl bg-white/5 border border-white/10">
              <MessageSquare className="w-8 h-8 text-[#009E60] flex-shrink-0" />
              <div className="text-left">
                <p className="text-white font-semibold mb-1">Une suggestion ?</p>
                <p className="text-slate-400 text-sm">
                  Partagez vos idées pour les prochaines versions d&apos;e-OSCS.
                </p>
              </div>
              <Button
                asChild
                variant="outline"
                className="border-white/20 text-white hover:bg-white/10 whitespace-nowrap"
              >
                <a href="mailto:omouitsi@gmail.com?subject=Suggestion%20e-OSCS%20Roadmap">
                  Envoyer une idée
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================
          SECTION NEWSLETTER / ABONNEMENT
          ============================================ */}
      <section className="py-20 bg-gradient-to-b from-white to-slate-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-[#F77F00]/10 to-[#009E60]/10 mb-6">
              <Mail className="w-8 h-8 text-[#F77F00]" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Restez informé
            </h2>
            <p className="text-lg text-slate-600 mb-8 leading-relaxed">
              Recevez une notification à chaque nouvelle version d&apos;e-OSCS.
              Pas de spam, que des vraies nouveautés.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button
                asChild
                size="lg"
                className="bg-gradient-to-r from-[#F77F00] to-[#E67E00] hover:from-[#E67E00] hover:to-[#F77F00] text-white shadow-lg shadow-orange-500/25 px-8 h-14 text-base gap-2"
              >
                <a href="mailto:omouitsi@gmail.com?subject=Abonnement%20Newsletter%20e-OSCS&body=Bonjour,%0A%0AJe%20souhaite%20s'abonner%20à%20la%20newsletter%20des%20mises%20à%20jour%20e-OSCS.%0A%0ANom:%0AOrganisation:%0A%0ACordialement">
                  <Mail className="w-5 h-5" />
                  S&apos;abonner aux mises à jour
                </a>
              </Button>
              <p className="text-sm text-slate-500 flex items-center gap-2">
                <Shield className="w-4 h-4" />
                Gratuit • Aucun spam • Désabonnement facile
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================
          FOOTER STANDARD
          ============================================ */}
      <footer className="bg-slate-900 text-white" role="contentinfo">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#F77F00] to-[#009E60] flex items-center justify-center">
                <span className="text-white font-bold text-lg">e</span>
              </div>
              <div>
                <span className="text-xl font-bold">e-OSCS</span>
                <p className="text-sm text-slate-400">MCNSLP Côte d&apos;Ivoire</p>
              </div>
            </div>

            <nav className="flex flex-wrap items-center justify-center gap-6 text-sm">
              <Link href="/" className="text-slate-400 hover:text-white transition-colors">
                Accueil
              </Link>
              <Link href="/a-propos" className="text-slate-400 hover:text-white transition-colors">
                À propos
              </Link>
              <Link href="/conditions" className="text-slate-400 hover:text-white transition-colors">
                Conditions
              </Link>
              <Link href="/confidentialite" className="text-slate-400 hover:text-white transition-colors">
                Confidentialité
              </Link>
            </nav>

            <p className="text-sm text-slate-500">
              © {new Date().getFullYear()} e-OSCS. Tous droits réservés.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

/* ============================================
   COMPOSANT ICÔNE CHECK PERSONNALISÉ
   ============================================ */
function CheckIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}
