import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Heart,
  HandHeart,
  Target,
  Users,
  Building2,
  TrendingUp,
  Clock,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Shield,
  Zap,
  BarChart3,
  FileText,
  Globe,
  Code2,
  Database,
  Server,
  CalendarDays,
  Rocket,
  Star,
  Award,
  BookOpen,
  Lightbulb,
  AlertTriangle,
  ThumbsUp,
  Layers,
  Cpu,
} from "lucide-react";

export const metadata: Metadata = {
  title: "À Propos — e-OSCS | MCNSLP Côte d'Ivoire",
  description:
    "Découvrez e-OSCS, la solution numérique au service de la Cohésion Nationale. Notre mission, notre histoire et notre engagement pour le MCNSLP.",
};

/* ============================================
   PAGE À PROPOS e-OSCS
   Présentation du projet et de sa mission
   ============================================ */
export default function AProposPage() {
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
                <span className="text-slate-900 font-medium">À propos</span>
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
        <div className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-[#0F172A] py-20 md:py-28 lg:py-36">
          {/* Motifs décoratifs CSS */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-20 left-10 w-72 h-72 bg-[#F77F00] rounded-full blur-3xl" />
            <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#009E60] rounded-full blur-3xl" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white rounded-full blur-3xl opacity-5" />
          </div>

          <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 mb-8">
              <Star className="w-4 h-4 text-[#F77F00]" />
              <span className="text-sm text-white/90 font-medium">
                Plateforme officielle MCNSLP
              </span>
            </div>

            {/* Titre principal */}
            <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold text-white mb-6 tracking-tight">
              À propos d&apos;{" "}
              <span className="bg-gradient-to-r from-[#F77F00] to-[#FFB84D] bg-clip-text text-transparent">
                e-OSCS
              </span>
            </h1>

            {/* Sous-titre */}
            <p className="text-xl md:text-2xl lg:text-3xl text-white/80 max-w-4xl mx-auto mb-8 leading-relaxed font-light">
              La solution numérique au service de la{" "}
              <span className="text-[#009E60] font-semibold">Cohésion Nationale</span>
            </p>

            {/* Description */}
            <p className="text-base md:text-lg text-slate-400 max-w-3xl mx-auto mb-12 leading-relaxed">
              e-OSCS (électronique Organisation, Suivi et Contrôle des activités de Solidarité)
              est une plateforme innovante développée pour le Ministère de la Cohésion Nationale,
              de la Solidarité Sociale et de la Lutte contre la Pauvreté.
            </p>

            {/* CTA buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button
                size="lg"
                asChild
                className="bg-gradient-to-r from-[#F77F00] to-[#E67E00] hover:from-[#E67E00] hover:to-[#F77F00] text-white shadow-lg shadow-orange-500/25 px-8 h-14 text-base"
              >
                <Link href="#mission">
                  Découvrir notre mission
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
              <Button
                variant="outline"
                size="lg"
                asChild
                className="border-white/30 text-white hover:bg-white/10 px-8 h-14 text-base"
              >
                <Link href="#contact">
                  Nous contacter
                  <Mail className="ml-2 w-5 h-5" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================
          SECTION NOTRE MISSION
          ============================================ */}
      <section id="mission" className="py-20 md:py-28 bg-gradient-to-b from-slate-50 to-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* En-tête de section */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-[#F77F00]/10 to-[#009E60]/10 mb-6">
              <Target className="w-8 h-8 text-[#F77F00]" />
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 mb-6">
              Notre Mission
            </h2>
            <p className="text-lg text-slate-600 leading-relaxed">
              Au service du{" "}
              <strong className="text-slate-900">MCNSLP</strong>, nous transformons la gestion
              des activités de solidarité grâce à une solution numérique moderne, efficace et
              adaptée aux réalités ivoiriennes.
            </p>
          </div>

          {/* Les 3 piliers */}
          <div className="grid md:grid-cols-3 gap-8 mb-20">
            {/* Pilier 1 : Cohésion sociale */}
            <div className="group relative bg-white rounded-2xl p-8 shadow-sm border border-slate-200 hover:shadow-xl hover:border-[#F77F00]/30 transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-[#F77F00]/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#F77F00] to-[#E67E00] flex items-center justify-center mb-6 shadow-lg shadow-orange-500/20 group-hover:scale-110 transition-transform">
                  <Heart className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">
                  Cohésion Sociale
                </h3>
                <p className="text-slate-600 leading-relaxed">
                  Renforcer les liens entre les communautés et promouvoir le vivre ensemble
                  à travers un suivi rigoureux des programmes d&apos;intégration sociale.
                </p>
              </div>
            </div>

            {/* Pilier 2 : Solidarité nationale */}
            <div className="group relative bg-white rounded-2xl p-8 shadow-sm border border-slate-200 hover:shadow-xl hover:border-[#009E60]/30 transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-[#009E60]/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#009E60] to-[#007A4D] flex items-center justify-center mb-6 shadow-lg shadow-green-500/20 group-hover:scale-110 transition-transform">
                  <HandHeart className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">
                  Solidarité Nationale
                </h3>
                <p className="text-slate-600 leading-relaxed">
                  Faciliter la coordination des actions de solidarité sur tout le territoire
                  national pour une répartition équitable des ressources.
                </p>
              </div>
            </div>

            {/* Pilier 3 : Lutte contre la pauvreté */}
            <div className="group relative bg-white rounded-2xl p-8 shadow-sm border border-slate-200 hover:shadow-xl hover:border-[#0F172A]/30 transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-[#0F172A]/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#0F172A] to-slate-700 flex items-center justify-center mb-6 shadow-lg shadow-slate-500/20 group-hover:scale-110 transition-transform">
                  <TrendingUp className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">
                  Lutte contre la Pauvreté
                </h3>
                <p className="text-slate-600 leading-relaxed">
                  Mesurer l&apos;impact réel des programmes sociaux et optimiser l&apos;allocation
                  des ressources pour une efficacité maximale.
                </p>
              </div>
            </div>
          </div>

          {/* Statistiques clés */}
          <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-[#0F172A] rounded-3xl p-8 md:p-12 relative overflow-hidden">
            {/* Décorations */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#F77F00]/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#009E60]/10 rounded-full blur-3xl" />

            <div className="relative">
              <h3 className="text-2xl md:text-3xl font-bold text-white text-center mb-12">
                Impact en chiffres
              </h3>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                {/* Stat 1 */}
                <div className="text-center">
                  <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-[#F77F00] to-[#FFB84D] bg-clip-text text-transparent mb-2">
                    31+
                  </div>
                  <p className="text-slate-400 text-sm md:text-base">
                    Directions Régionales<br />connectées
                  </p>
                </div>

                {/* Stat 2 */}
                <div className="text-center">
                  <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-[#009E60] to-[#34D399] bg-clip-text text-transparent mb-2">
                    150+
                  </div>
                  <p className="text-slate-400 text-sm md:text-base">
                    Directions<br />Départementales
                  </p>
                </div>

                {/* Stat 3 */}
                <div className="text-center">
                  <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 to-blue-300 bg-clip-text text-transparent mb-2">
                    50K+
                  </div>
                  <p className="text-slate-400 text-sm md:text-base">
                    Bénéficiaires<br />suivis/an
                  </p>
                </div>

                {/* Stat 4 */}
                <div className="text-center">
                  <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-400 to-purple-300 bg-clip-text text-transparent mb-2">
                    98%
                  </div>
                  <p className="text-slate-400 text-sm md:text-base">
                    Taux de satisfaction<br />des utilisateurs
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================
          SECTION LE PROBLÈME (Avant/Après)
          ============================================ */}
      <section id="probleme" className="py-20 md:py-28 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* En-tête */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-red-50 mb-6">
              <AlertTriangle className="w-8 h-8 text-red-500" />
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 mb-6">
              Le Problème
            </h2>
            <p className="text-lg text-slate-600 leading-relaxed">
              Avant e-OSCS, le reporting institutionnel du MCNSLP faisait face à des défis majeurs
              qui freinaient l&apos;efficacité de l&apos;action publique.
            </p>
          </div>

          {/* Comparaison Avant / Après */}
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* AVANT */}
            <div className="relative bg-gradient-to-br from-red-50 to-orange-50 rounded-3xl p-8 border border-red-100 overflow-hidden">
              {/* Badge "Avant" */}
              <div className="absolute top-6 right-6 px-4 py-1.5 bg-red-500 text-white text-sm font-semibold rounded-full">
                AVANT
              </div>

              <div className="pt-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 rounded-2xl bg-red-100 flex items-center justify-center">
                    <FileText className="w-7 h-7 text-red-500" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">
                      Processus Manuel
                    </h3>
                    <p className="text-slate-600 text-sm">
                      Reporting traditionnel
                    </p>
                  </div>
                </div>

                <ul className="space-y-4">
                  {[
                    {
                      icon: "📄",
                      title: "Saisie multiple",
                      desc: "Mêmes données recopiées dans Word, Excel, PowerPoint",
                    },
                    {
                      icon: "⏱️",
                      title: "Perte de temps",
                      desc: "Journées entières pour compiler les rapports",
                    },
                    {
                      icon: "❌",
                      title: "Erreurs fréquentes",
                      desc: "Incohérences entre documents",
                    },
                    {
                      icon: "📊",
                      title: "Pas de consolidation",
                      desc: "Difficulté à agréger les données nationales",
                    },
                    {
                      icon: "🔒",
                      title: "Traçabilité faible",
                      desc: "Impossible de suivre les validations",
                    },
                  ].map((item, index) => (
                    <li key={index} className="flex items-start gap-3 p-3 bg-white/70 rounded-xl">
                      <span className="text-xl">{item.icon}</span>
                      <div>
                        <p className="font-semibold text-slate-900 text-sm">{item.title}</p>
                        <p className="text-slate-600 text-xs">{item.desc}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* APRÈS */}
            <div className="relative bg-gradient-to-br from-green-50 to-emerald-50 rounded-3xl p-8 border border-green-100 overflow-hidden">
              {/* Badge "Après" */}
              <div className="absolute top-6 right-6 px-4 py-1.5 bg-[#009E60] text-white text-sm font-semibold rounded-full">
                APRÈS e-OSCS
              </div>

              <div className="pt-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 rounded-2xl bg-green-100 flex items-center justify-center">
                    <Zap className="w-7 h-7 text-[#009E60]" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">
                      Processus Digitalisé
                    </h3>
                    <p className="text-slate-600 text-sm">
                      Solution intégrée e-OSCS
                    </p>
                  </div>
                </div>

                <ul className="space-y-4">
                  {[
                    {
                      icon: "✅",
                      title: "Saisie unique",
                      desc: "Une donnée saisie, exploitée partout",
                    },
                    {
                      icon: "⚡",
                      title: "Rapports instantanés",
                      desc: "Génération automatique en un clic",
                    },
                    {
                      icon: "✓",
                      title: "Données fiables",
                      desc: "Validation intégrée et cohérence garantie",
                    },
                    {
                      icon: "📈",
                      title: "Consolidation temps réel",
                      desc: "Vue nationale automatisée",
                    },
                    {
                      icon: "🔐",
                      title: "Traçabilité complète",
                      desc: "Historique de toutes les actions",
                    },
                  ].map((item, index) => (
                    <li key={index} className="flex items-start gap-3 p-3 bg-white/70 rounded-xl">
                      <span className="text-xl">{item.icon}</span>
                      <div>
                        <p className="font-semibold text-slate-900 text-sm">{item.title}</p>
                        <p className="text-slate-600 text-xs">{item.desc}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Flèche de transformation */}
          <div className="hidden md:flex justify-center my-8">
            <div className="flex items-center gap-4">
              <div className="h-0.5 w-24 bg-gradient-to-r from-red-300 to-green-300" />
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[#F77F00] to-[#009E60] flex items-center justify-center shadow-lg">
                <ArrowRight className="w-6 h-6 text-white" />
              </div>
              <div className="h-0.5 w-24 bg-gradient-to-l from-red-300 to-green-300" />
            </div>
          </div>
        </div>
      </section>

      {/* ============================================
          SECTION LA SOLUTION e-OSCS
          ============================================ */}
      <section id="solution" className="py-20 md:py-28 bg-gradient-to-b from-slate-50 to-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* En-tête */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-[#F77F00]/10 to-[#009E60]/10 mb-6">
              <Lightbulb className="w-8 h-8 text-[#F77F00]" />
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 mb-6">
              La Solution e-OSCS
            </h2>
            <p className="text-lg text-slate-600 leading-relaxed">
              Une plateforme complète qui révolutionne la gestion et le reporting des activités
              de solidarité sociale en Côte d&apos;Ivoire.
            </p>
          </div>

          {/* Mockup Dashboard CSS */}
          <div className="max-w-5xl mx-auto mb-16">
            <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">
              {/* Barre du haut du mockup */}
              <div className="bg-slate-100 px-4 py-3 flex items-center gap-2">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                  <div className="w-3 h-3 rounded-full bg-yellow-400" />
                  <div className="w-3 h-3 rounded-full bg-green-400" />
                </div>
                <div className="flex-1 flex justify-center">
                  <div className="bg-white rounded-md px-4 py-1 text-xs text-slate-500 max-w-md w-full text-center">
                    app.e-oscs.ci / dashboard
                  </div>
                </div>
              </div>

              {/* Contenu du mockup */}
              <div className="p-6 bg-slate-50">
                <div className="grid grid-cols-4 gap-4 mb-6">
                  {/* Cards stats mockup */}
                  {[
                    { label: "Activités", value: "1,247", color: "#F77F00", icon: "📋" },
                    { label: "Bénéficiaires", value: "12,459", color: "#009E60", icon: "👥" },
                    { label: "Taux complétion", value: "87%", color: "#3B82F6", icon: "✓" },
                    { label: "Rapports", value: "34", color: "#8B5CF6", icon: "📄" },
                  ].map((stat, i) => (
                    <div
                      key={i}
                      className="bg-white rounded-xl p-4 shadow-sm border border-slate-100"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-2xl">{stat.icon}</span>
                        <span
                          className="text-xs px-2 py-0.5 rounded-full text-white font-medium"
                          style={{ backgroundColor: stat.color }}
                        >
                          +{Math.floor(Math.random() * 20) + 5}%
                        </span>
                      </div>
                      <div className="text-2xl font-bold text-slate-900">{stat.value}</div>
                      <div className="text-xs text-slate-500">{stat.label}</div>
                    </div>
                  ))}
                </div>

                {/* Graphique mockup CSS */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="col-span-2 bg-white rounded-xl p-4 shadow-sm border border-slate-100">
                    <div className="text-sm font-semibold text-slate-700 mb-4">
                      Activités par trimestre
                    </div>
                    <div className="flex items-end gap-2 h-32">
                      {[65, 80, 95, 72, 88, 105, 120, 135, 115, 140, 155, 145].map(
                        (height, i) => (
                          <div
                            key={i}
                            className="flex-1 rounded-t-sm bg-gradient-to-t from-[#F77F00] to-[#FFB84D]"
                            style={{ height: `${height}%` }}
                          />
                        )
                      )}
                    </div>
                    <div className="flex justify-between mt-2 text-xs text-slate-400">
                      <span>Jan</span>
                      <span>Juin</span>
                      <span>Déc</span>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
                    <div className="text-sm font-semibold text-slate-700 mb-4">
                      Répartition
                    </div>
                    <div className="relative w-24 h-24 mx-auto mb-4">
                      {/* Donut chart CSS */}
                      <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                        <circle
                          cx="18"
                          cy="18"
                          r="15.9"
                          fill="none"
                          stroke="#F77F00"
                          strokeWidth="3"
                          strokeDasharray="40 60"
                        />
                        <circle
                          cx="18"
                          cy="18"
                          r="15.9"
                          fill="none"
                          stroke="#009E60"
                          strokeWidth="3"
                          strokeDasharray="30 70"
                          strokeDashoffset="-40"
                        />
                        <circle
                          cx="18"
                          cy="18"
                          r="15.9"
                          fill="none"
                          stroke="#3B82F6"
                          strokeWidth="3"
                          strokeDasharray="20 80"
                          strokeDashoffset="-70"
                        />
                        <circle
                          cx="18"
                          cy="18"
                          r="15.9"
                          fill="none"
                          stroke="#8B5CF6"
                          strokeWidth="3"
                          strokeDasharray="10 90"
                          strokeDashoffset="-90"
                        />
                      </svg>
                    </div>
                    <div className="space-y-1 text-xs">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-[#F77F00]" />
                        <span className="text-slate-600">Social (40%)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-[#009E60]" />
                        <span className="text-slate-600">Éducatif (30%)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-blue-500" />
                        <span className="text-slate-600">Santé (20%)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-purple-500" />
                        <span className="text-slate-600">Autres (10%)</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <p className="text-center text-sm text-slate-500 mt-4 italic">
              Interface du tableau de bord e-OSCS
            </p>
          </div>

          {/* Liste des bénéfices */}
          <div className="max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-slate-900 text-center mb-10">
              Bénéfices clés de la plateforme
            </h3>

            <div className="grid sm:grid-cols-2 gap-6">
              {[
                {
                  icon: Zap,
                  title: "Gain de temps considérable",
                  description:
                    "Réduction de 80% du temps consacré au reporting grâce à l'automatisation.",
                  color: "from-yellow-500 to-orange-500",
                },
                {
                  icon: Shield,
                  title: "Sécurité des données",
                  description:
                    "Chiffrement bout-en-bout et traçabilité complète de chaque action.",
                  color: "from-blue-500 to-cyan-500",
                },
                {
                  icon: BarChart3,
                  title: "Tableau de bord analytique",
                  description:
                    "Visualisation en temps réel des indicateurs de performance.",
                  color: "from-green-500 to-emerald-500",
                },
                {
                  icon: FileText,
                  title: "Génération automatique",
                  description:
                    "Rapports Word et PowerPoint conformes générés en un clic.",
                  color: "from-purple-500 to-pink-500",
                },
                {
                  icon: Users,
                  title: "Collaboration simplifiée",
                  description:
                    "Workflow de validation entre agents, chefs de service et directeurs.",
                  color: "from-rose-500 to-red-500",
                },
                {
                  icon: Globe,
                  title: "Accessibilité totale",
                  description:
                    "Plateforme accessible 24/7 depuis n'importe quel appareil connecté.",
                  color: "from-indigo-500 to-violet-500",
                },
              ].map((benefit, index) => (
                <div
                  key={index}
                  className="group flex items-start gap-4 p-6 bg-white rounded-2xl border border-slate-200 hover:shadow-lg hover:border-slate-300 transition-all"
                >
                  <div
                    className={`flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br ${benefit.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}
                  >
                    <benefit.icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 mb-1">{benefit.title}</h4>
                    <p className="text-sm text-slate-600 leading-relaxed">
                      {benefit.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ============================================
          SECTION ÉQUIPE / PARTENAIRES
          ============================================ */}
      <section id="equipe" className="py-20 md:py-28 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* En-tête */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#009E60]/10 mb-6">
              <Building2 className="w-8 h-8 text-[#009E60]" />
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 mb-6">
              Nos Partenaires & Technologies
            </h2>
            <p className="text-lg text-slate-600 leading-relaxed">
              Un projet porté par le MCNSLP et construit avec les meilleures technologies
              du marché.
            </p>
          </div>

          {/* Ministère porteur */}
          <div className="max-w-4xl mx-auto mb-16">
            <div className="bg-gradient-to-br from-[#F77F00]/5 via-white to-[#009E60]/5 rounded-3xl p-8 md:p-12 border border-slate-200">
              <div className="flex flex-col md:flex-row items-center gap-8">
                {/* Logo placeholder ministère */}
                <div className="flex-shrink-0 w-32 h-32 rounded-2xl bg-gradient-to-br from-[#F77F00] to-[#009E60] flex items-center justify-center shadow-xl">
                  <div className="text-center">
                    <Award className="w-12 h-12 text-white mx-auto mb-1" />
                    <span className="text-white font-bold text-sm">MCNSLP</span>
                  </div>
                </div>

                <div className="text-center md:text-left">
                  <h3 className="text-2xl font-bold text-slate-900 mb-3">
                    Ministère de la Cohésion Nationale, de la Solidarité Sociale
                    et de la Lutte contre la Pauvreté
                  </h3>
                  <p className="text-slate-600 leading-relaxed mb-4">
                    Porteur du projet e-OSCS, le MCNSLP est le ministère souverain en charge
                    des politiques de cohésion sociale en République de Côte d&apos;Ivoire.
                    Cette plateforme est le fruit d&apos;une vision ambitieuse de modernisation
                    de l&apos;administration publique.
                  </p>
                  <div className="flex flex-wrap justify-center md:justify-start gap-3">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#F77F00]/10 text-[#F77F00] rounded-full text-sm font-medium">
                      <CheckCircle2 className="w-4 h-4" />
                      Projet Officiel
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#009E60]/10 text-[#009E60] rounded-full text-sm font-medium">
                      <Shield className="w-4 h-4" />
                      Validé par l'État
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Stack technologique */}
          <div className="max-w-4xl mx-auto">
            <h3 className="text-xl font-bold text-slate-900 text-center mb-8">
              Construit avec les technologies modernes
            </h3>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                {
                  name: "Next.js 16",
                  category: "Framework Frontend",
                  icon: "⚛️",
                  color: "bg-slate-900",
                },
                {
                  name: "TypeScript",
                  category: "Langage",
                  icon: "📘",
                  color: "bg-blue-600",
                },
                {
                  name: "Supabase",
                  category: "Base de données",
                  icon: "🗄️",
                  color: "bg-emerald-500",
                },
                {
                  name: "Tailwind CSS",
                  category: "Styling",
                  icon: "🎨",
                  color: "bg-cyan-500",
                },
                {
                  name: "Prisma ORM",
                  category: "Database Toolkit",
                  icon: "🔷",
                  color: "bg-gray-800",
                },
                {
                  name: "React",
                  category: "UI Library",
                  icon: "⚛️",
                  color: "bg-blue-400",
                },
                {
                  name: "Vercel",
                  category: "Hébergement",
                  icon: "▲",
                  color: "bg-black",
                },
                {
                  name: "shadcn/ui",
                  category: "Components",
                  icon: "🧩",
                  color: "bg-slate-700",
                },
              ].map((tech, index) => (
                <div
                  key={index}
                  className="group p-5 bg-white rounded-2xl border border-slate-200 hover:shadow-lg hover:border-slate-300 transition-all text-center"
                >
                  <div
                    className={`w-14 h-14 ${tech.color} rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform shadow-md`}
                  >
                    <span className="text-2xl">{tech.icon}</span>
                  </div>
                  <h4 className="font-bold text-slate-900 text-sm">{tech.name}</h4>
                  <p className="text-xs text-slate-500 mt-1">{tech.category}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Logos partenaires placeholder */}
          <div className="mt-16 pt-12 border-t border-slate-200">
            <p className="text-center text-sm text-slate-500 mb-8">
              Ils nous font confiance
            </p>
            <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12 opacity-60">
              {["République de Côte d'Ivoire", "MCNSLP", "Direction IT", "Partenaire Tech"].map(
                (partner, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 px-6 py-3 bg-slate-100 rounded-xl"
                  >
                    <div className="w-10 h-10 rounded-lg bg-slate-300 flex items-center justify-center">
                      <Building2 className="w-5 h-5 text-slate-500" />
                    </div>
                    <span className="font-semibold text-slate-600 text-sm">{partner}</span>
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ============================================
          SECTION TIMELINE / HISTORIQUE
          ============================================ */}
      <section id="historique" className="py-20 md:py-28 bg-gradient-to-b from-slate-900 via-slate-800 to-[#0F172A]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* En-tête */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/10 mb-6">
              <CalendarDays className="w-8 h-8 text-[#F77F00]" />
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
              Notre Historique
            </h2>
            <p className="text-lg text-slate-400 leading-relaxed">
              Retour sur les étapes clés qui ont façonné e-OSCS.
            </p>
          </div>

          {/* Timeline */}
          <div className="max-w-3xl mx-auto">
            <div className="relative">
              {/* Ligne verticale centrale */}
              <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-[#F77F00] via-[#009E60] to-slate-600 md:-translate-x-0.5" />

              {/* Items timeline */}
              <div className="space-y-12">
                {/* 2023 - Idéation */}
                <div className="relative flex items-start gap-8 md:gap-0">
                  {/* Content gauche (desktop) / droite (mobile) */}
                  <div className="flex-1 md:w-1/2 md:pr-12 md:text-right pl-20 md:pl-0">
                    <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:bg-white/10 transition-colors">
                      <span className="inline-block px-3 py-1 bg-[#F77F00] text-white text-sm font-bold rounded-full mb-3">
                        2023
                      </span>
                      <h3 className="text-xl font-bold text-white mb-2">
                        Idéation du Projet
                      </h3>
                      <p className="text-slate-400 text-sm leading-relaxed">
                        Identification des besoins en digitalisation du reporting au sein du
                        MCNSLP. Études préliminaires et définition du cahier des charges.
                      </p>
                      <ul className="mt-4 space-y-2 text-sm text-slate-500">
                        <li className="flex items-center gap-2 md:justify-end">
                          <BookOpen className="w-4 h-4" />
                          Analyse des processus existants
                        </li>
                        <li className="flex items-center gap-2 md:justify-end">
                          <Lightbulb className="w-4 h-4" />
                          Conception de la solution
                        </li>
                        <li className="flex items-center gap-2 md:justify-end">
                          <Users className="w-4 h-4" />
                          Consultation des parties prenantes
                        </li>
                      </ul>
                    </div>
                  </div>

                  {/* Point central */}
                  <div className="absolute left-8 md:left-1/2 w-4 h-4 bg-[#F77F00] rounded-full border-4 border-slate-800 md:-translate-x-1/2 -translate-x-1/2 ring-4 ring-[#F77F00]/30" />

                  {/* Espace vide côté droite */}
                  <div className="hidden md:block flex-1 w-1/2 pl-12" />
                </div>

                {/* 2024 - Développement */}
                <div className="relative flex items-start gap-8 md:gap-0">
                  {/* Espace vide côté gauche */}
                  <div className="hidden md:block flex-1 w-1/2 pr-12" />

                  {/* Point central */}
                  <div className="absolute left-8 md:left-1/2 w-4 h-4 bg-[#009E60] rounded-full border-4 border-slate-800 md:-translate-x-1/2 -translate-x-1/2 ring-4 ring-[#009E60]/30" />

                  {/* Content droite (desktop) / gauche (mobile) */}
                  <div className="flex-1 md:w-1/2 md:pl-12 pl-20 md:pl-12">
                    <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:bg-white/10 transition-colors">
                      <span className="inline-block px-3 py-1 bg-[#009E60] text-white text-sm font-bold rounded-full mb-3">
                        2024
                      </span>
                      <h3 className="text-xl font-bold text-white mb-2">
                        Développement & Lancement
                      </h3>
                      <p className="text-slate-400 text-sm leading-relaxed">
                        Développement de la plateforme, tests intensifs et déploiement progressif
                        auprès des directions pilotes.
                      </p>
                      <ul className="mt-4 space-y-2 text-sm text-slate-500">
                        <li className="flex items-center gap-2">
                          <Code2 className="w-4 h-4" />
                          Développement de la plateforme
                        </li>
                        <li className="flex items-center gap-2">
                          <Shield className="w-4 h-4" />
                          Tests de sécurité et validation
                        </li>
                        <li className="flex items-center gap-2">
                          <Rocket className="w-4 h-4" />
                          Lancement officiel
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* 2025 - Expansion (objectif) */}
                <div className="relative flex items-start gap-8 md:gap-0">
                  {/* Content gauche (desktop) / droite (mobile) */}
                  <div className="flex-1 md:w-1/2 md:pr-12 md:text-right pl-20 md:pl-0">
                    <div className="bg-gradient-to-br from-[#F77F00]/10 to-[#009E60]/10 backdrop-blur-sm rounded-2xl p-6 border border-[#F77F00]/20 hover:border-[#F77F00]/40 transition-colors">
                      <span className="inline-block px-3 py-1 bg-gradient-to-r from-[#F77F00] to-[#009E60] text-white text-sm font-bold rounded-full mb-3">
                        2025
                      </span>
                      <h3 className="text-xl font-bold text-white mb-2">
                        Expansion Nationale 🚀
                      </h3>
                      <p className="text-slate-400 text-sm leading-relaxed">
                        Objectif : couverture de l&apos;ensemble des 31 directions régionales et
                        150+ directions départementales.
                      </p>
                      <ul className="mt-4 space-y-2 text-sm text-slate-500">
                        <li className="flex items-center gap-2 md:justify-end">
                          <Globe className="w-4 h-4" />
                          Déploiement national complet
                        </li>
                        <li className="flex items-center gap-2 md:justify-end">
                          <Cpu className="w-4 h-4" />
                          Nouvelles fonctionnalités IA
                        </li>
                        <li className="flex items-center gap-2 md:justify-end">
                          <Star className="w-4 h-4" />
                          Certification et reconnaissance
                        </li>
                      </ul>
                    </div>
                  </div>

                  {/* Point central */}
                  <div className="absolute left-8 md:left-1/2 w-4 h-4 bg-gradient-to-r from-[#F77F00] to-[#009E60] rounded-full border-4 border-slate-800 md:-translate-x-1/2 -translate-x-1/2 ring-4 ring-white/20 animate-pulse" />

                  {/* Espace vide côté droite */}
                  <div className="hidden md:block flex-1 w-1/2 pl-12" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================
          SECTION CONTACT CTA
          ============================================ */}
      <section id="contact" className="py-20 md:py-28 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-[#0F172A] rounded-3xl p-8 md:p-16 relative overflow-hidden">
              {/* Décorations */}
              <div className="absolute top-0 left-0 w-64 h-64 bg-[#F77F00]/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
              <div className="absolute bottom-0 right-0 w-64 h-64 bg-[#009E60]/20 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />

              <div className="relative text-center">
                {/* Icône */}
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-[#F77F00] to-[#009E60] mb-8 shadow-2xl">
                  <Mail className="w-10 h-10 text-white" />
                </div>

                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
                  Rejoignez l&apos;aventure e-OSCS
                </h2>

                <p className="text-lg text-slate-300 max-w-2xl mx-auto mb-10 leading-relaxed">
                  Vous représentez une direction régionale ou départementale ? Vous souhaitez
                  en savoir plus sur la plateforme ? Contactez-nous pour discuter de vos besoins.
                </p>

                {/* Coordonnées contact */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-10">
                  <a
                    href="mailto:omouitsi@gmail.com"
                    className="flex items-center gap-3 px-6 py-4 bg-white/10 hover:bg-white/20 rounded-xl transition-colors group"
                  >
                    <div className="w-12 h-12 rounded-xl bg-[#F77F00]/20 flex items-center justify-center group-hover:bg-[#F77F00]/30 transition-colors">
                      <Mail className="w-5 h-5 text-[#F77F00]" />
                    </div>
                    <div className="text-left">
                      <p className="text-xs text-slate-400 uppercase tracking-wide">Email</p>
                      <p className="text-white font-medium">omouitsi@gmail.com</p>
                    </div>
                  </a>

                  <a
                    href="https://wa.me/2250576103277"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 px-6 py-4 bg-white/10 hover:bg-white/20 rounded-xl transition-colors group"
                  >
                    <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center group-hover:bg-green-500/30 transition-colors">
                      <Phone className="w-5 h-5 text-green-400" />
                    </div>
                    <div className="text-left">
                      <p className="text-xs text-slate-400 uppercase tracking-wide">WhatsApp</p>
                      <p className="text-white font-medium">+225 05 76 103 277</p>
                    </div>
                  </a>

                  <div className="flex items-center gap-3 px-6 py-4 bg-white/10 rounded-xl">
                    <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
                      <MapPin className="w-5 h-5 text-blue-400" />
                    </div>
                    <div className="text-left">
                      <p className="text-xs text-slate-400 uppercase tracking-wide">Adresse</p>
                      <p className="text-white font-medium">Abidjan, Plateau, CI</p>
                    </div>
                  </div>
                </div>

                {/* Boutons CTA */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <Button
                    size="lg"
                    asChild
                    className="bg-gradient-to-r from-[#F77F00] to-[#E67E00] hover:from-[#E67E00] hover:to-[#F77F00] text-white shadow-lg shadow-orange-500/25 px-8 h-14 text-base"
                  >
                    <Link href="/#demande">
                      Demander un accès
                      <ArrowRight className="ml-2 w-5 h-5" />
                    </Link>
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    asChild
                    className="border-white/30 text-white hover:bg-white/10 px-8 h-14 text-base"
                  >
                    <Link href="/">
                      Retour à l'accueil
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================
          FOOTER SIMPLIFIÉ
          ============================================ */}
      <footer className="mt-auto border-t border-slate-200 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#F77F00] to-[#009E60] flex items-center justify-center">
                <span className="text-sm font-bold text-white">e</span>
              </div>
              <span className="text-sm text-slate-600">
                © {new Date().getFullYear()} e-OSCS — MCNSLP Côte d&apos;Ivoire
              </span>
            </div>
            <div className="flex items-center gap-6 text-sm">
              <Link
                href="/conditions"
                className="text-slate-500 hover:text-[#F77F00] transition-colors"
              >
                Mentions Légales
              </Link>
              <Link
                href="/confidentialite"
                className="text-slate-500 hover:text-[#F77F00] transition-colors"
              >
                Confidentialité
              </Link>
              <Link
                href="/a-propos"
                className="text-slate-500 hover:text-[#F77F00] transition-colors font-medium"
              >
                À propos
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
