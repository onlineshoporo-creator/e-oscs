import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Shield,
  Database,
  Clock,
  UserCheck,
  Cookie,
  Lock,
  Phone,
  Mail,
  MapPin,
  ArrowLeft,
  Eye,
  FileEdit,
  Trash2,
  Download,
  Ban,
  AlertTriangle,
  CheckCircle2,
  Scale,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Politique de Confidentialité — e-OSCS",
  description:
    "Politique de protection des données personnelles de la plateforme e-OSCS - Conforme à la législation ivoirienne.",
};

/* ============================================
   PAGE POLITIQUE DE CONFIDENTIALITÉ e-OSCS
   RGPD adapté Côte d'Ivoire
   ============================================ */
export default function ConfidentialitePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Header avec navigation */}
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
                <span className="text-slate-900 font-medium">Confidentialité</span>
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

      {/* Contenu principal */}
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
        <article className="max-w-4xl mx-auto">
          {/* En-tête de page */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-[#009E60]/10 to-[#F77F00]/10 mb-6">
              <Shield className="w-8 h-8 text-[#009E60]" />
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 mb-4">
              Politique de Confidentialité
            </h1>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Le MCNSLP s&apos;engage à protéger vos données personnelles. Découvrez comment nous
              collectons, utilisons et sécurisons vos informations.
            </p>
            <p className="text-sm text-slate-500 mt-4">
              Dernière mise à jour : Janvier 2026
            </p>
          </div>

          <Separator className="mb-12" />

          {/* Introduction */}
          <section className="bg-gradient-to-r from-[#009E60]/5 to-[#F77F00]/5 rounded-2xl p-6 md:p-8 mb-12 border border-[#009E60]/10">
            <p className="text-slate-700 leading-relaxed">
              Le Ministère de la Cohésion Nationale, de la Solidarité Sociale et de la Lutte
              contre la Pauvreté (MCNSLP), éditeur de la plateforme e-OSCS, s&apos;engage à
              respecter la vie privée des utilisateurs et à protéger leurs données personnelles.
              Cette politique de confidentialité explique nos pratiques conformément à{" "}
              <strong>la loi n°2013-450 du 19 juin 2013</strong> relative à la protection des
              données à caractère personnel en République de Côte d&apos;Ivoire.
            </p>
          </section>

          {/* Sections principales */}
          <div className="space-y-12">
            {/* Section 1 - Données collectées */}
            <section className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start gap-4 mb-6">
                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center">
                  <Database className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-xl md:text-2xl font-bold text-slate-900">
                    1. Données collectées
                  </h2>
                  <p className="text-slate-600 mt-1">
                    Catégories de données que nous collectons
                  </p>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                {/* Données de compte */}
                <div className="bg-slate-50 rounded-xl p-5">
                  <h3 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                    <UserCheck className="w-4 h-4 text-blue-500" />
                    Données de compte
                  </h3>
                  <ul className="space-y-2 text-sm text-slate-600">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      Nom et prénoms
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      Adresse email professionnelle
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      Numéro de téléphone
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      Direction d&apos;affectation (Régionale/Départementale)
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      Fonction / Poste occupé
                    </li>
                  </ul>
                </div>

                {/* Données d'activité */}
                <div className="bg-slate-50 rounded-xl p-5">
                  <h3 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                    <FileEdit className="w-4 h-4 text-[#F77F00]" />
                    Données d&apos;activité
                  </h3>
                  <ul className="space-y-2 text-sm text-slate-600">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      Activités planifiées et réalisées
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      Données agrégées sur les bénéficiaires
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      Indicateurs de performance
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      Statistiques consolidées
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      Rapports générés
                    </li>
                  </ul>
                </div>

                {/* Données techniques */}
                <div className="bg-slate-50 rounded-xl p-5">
                  <h3 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                    <Eye className="w-4 h-4 text-purple-500" />
                    Données techniques
                  </h3>
                  <ul className="space-y-2 text-sm text-slate-600">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      Adresse IP (logs de connexion)
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      Type de navigateur
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      Système d&apos;exploitation
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      Dates et heures de connexion
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      Pages visitées
                    </li>
                  </ul>
                </div>
              </div>

              <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-xl">
                <p className="text-sm text-amber-800 flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <strong>Note importante :</strong> Nous ne collectons aucune donnée sensible au
                  sens de la loi (origine ethnique, opinions politiques, santé, orientation
                  sexuelle, etc.) sauf si strictement nécessaire pour les activités de solidarité
                  et avec consentement explicite.
                </p>
              </div>
            </section>

            {/* Section 2 - Finalités */}
            <section className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start gap-4 mb-6">
                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-[#F77F00]/10 flex items-center justify-center">
                  <Database className="w-6 h-6 text-[#F77F00]" />
                </div>
                <div>
                  <h2 className="text-xl md:text-2xl font-bold text-slate-900">
                    2. Finalités du traitement
                  </h2>
                  <p className="text-slate-600 mt-1">
                    Pourquoi nous collectons vos données
                  </p>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  {
                    icon: "👤",
                    title: "Gestion des comptes",
                    desc: "Création et administration de votre compte utilisateur",
                  },
                  {
                    icon: "📊",
                    title: "Suivi des activités",
                    desc: "Saisie et suivi des activités de votre Direction",
                  },
                  {
                    icon: "📄",
                    title: "Génération de rapports",
                    desc: "Production automatique des rapports institutionnels",
                  },
                  {
                    icon: "🛠️",
                    title: "Support technique",
                    desc: "Assistance et résolution des problèmes techniques",
                  },
                  {
                    icon: "🔒",
                    title: "Sécurité",
                    desc: "Protection de la plateforme et prévention des fraudes",
                  },
                  {
                    icon: "⚖️",
                    title: "Obligations légales",
                    desc: "Respect des réglementations en vigueur",
                  },
                ].map((item) => (
                  <div
                    key={item.title}
                    className="p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors"
                  >
                    <span className="text-2xl">{item.icon}</span>
                    <h3 className="font-semibold text-slate-900 mt-2 text-sm">
                      {item.title}
                    </h3>
                    <p className="text-xs text-slate-600 mt-1">{item.desc}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Section 3 - Base légale */}
            <section className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start gap-4 mb-6">
                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center">
                  <Lock className="w-6 h-6 text-indigo-600" />
                </div>
                <div>
                  <h2 className="text-xl md:text-2xl font-bold text-slate-900">
                    3. Base légale du traitement
                  </h2>
                  <p className="text-slate-600 mt-1">
                    Fondement juridique de la collecte des données
                  </p>
                </div>
              </div>

              <div className="prose prose-slate max-w-none space-y-4 text-slate-700 leading-relaxed">
                <p>
                  Le traitement des données personnelles effectué via la plateforme e-OSCS repose
                  sur les bases légales suivantes :
                </p>

                <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-5 my-4">
                  <p className="font-semibold text-indigo-900 mb-2">
                    Mission d&apos;intérêt public
                  </p>
                  <p className="text-sm text-indigo-800">
                    Conformément à l&apos;article 14 de la loi n°2013-450 du 19 juin 2013 relative
                    à la protection des données à caractère personnel en Côte d&apos;Ivoire, le
                    traitement est nécessaire pour l&apos;exécution d&apos;une mission
                    d&apos;intérêt public dont est chargé le MCNSLP.
                  </p>
                </div>

                <p>
                  Les données sont traitées dans le cadre des missions de gestion administrative,
                  de planification et de reporting des activités de solidarité sociale confiées aux
                  Directions Régionales et Départementales du MCNSLP.
                </p>
              </div>
            </section>

            {/* Section 4 - Durée de conservation */}
            <section className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start gap-4 mb-6">
                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-cyan-50 flex items-center justify-center">
                  <Clock className="w-6 h-6 text-cyan-600" />
                </div>
                <div>
                  <h2 className="text-xl md:text-2xl font-bold text-slate-900">
                    4. Durée de conservation
                  </h2>
                  <p className="text-slate-600 mt-1">
                    Combien de temps nous conservons vos données
                  </p>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b-2 border-slate-200">
                      <th className="text-left py-3 px-4 font-semibold text-slate-900">
                        Type de données
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-slate-900">
                        Durée de conservation
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-slate-900">
                        Motif
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    <tr className="hover:bg-slate-50">
                      <td className="py-3 px-4 text-slate-700">Données de compte</td>
                      <td className="py-3 px-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          Durée de l&apos;abonnement + 3 ans
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-600">Archivage administratif</td>
                    </tr>
                    <tr className="hover:bg-slate-50">
                      <td className="py-3 px-4 text-slate-700">Données d&apos;activité</td>
                      <td className="py-3 px-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                          5 ans après l&apos;exercice
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-600">
                        Archives publiques (réglementation)
                      </td>
                    </tr>
                    <tr className="hover:bg-slate-50">
                      <td className="py-3 px-4 text-slate-700">Logs techniques</td>
                      <td className="py-3 px-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Maximum 12 mois
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-600">Sécurité et audit</td>
                    </tr>
                    <tr className="hover:bg-slate-50">
                      <td className="py-3 px-4 text-slate-700">Cookies</td>
                      <td className="py-3 px-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                          13 mois maximum
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-600">Préférences utilisateur</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="mt-6 p-4 bg-slate-50 rounded-xl">
                <p className="text-sm text-slate-700">
                  <strong>À l&apos;expiration des délais :</strong> Les données sont soit
                  définitivement supprimées, soit anonymisées pour des fins statistiques,
                  conformément aux obligations d&apos;archivage public.
                </p>
              </div>
            </section>

            {/* Section 5 - Droits utilisateurs */}
            <section className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start gap-4 mb-6">
                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-[#009E60]/10 flex items-center justify-center">
                  <UserCheck className="w-6 h-6 text-[#009E60]" />
                </div>
                <div>
                  <h2 className="text-xl md:text-2xl font-bold text-slate-900">
                    5. Vos droits
                  </h2>
                  <p className="text-slate-600 mt-1">
                    Conformément à la loi ivoirienne n°2013-450
                  </p>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Droit d'accès */}
                <div className="p-5 bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-xl border border-blue-200">
                  <div className="w-10 h-10 rounded-lg bg-blue-500 flex items-center justify-center mb-3">
                    <Eye className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="font-semibold text-slate-900 mb-1">Droit d&apos;accès</h3>
                  <p className="text-sm text-slate-600">
                    Consulter l&apos;ensemble des données personnelles vous concernant que nous
                    détenons.
                  </p>
                </div>

                {/* Droit de rectification */}
                <div className="p-5 bg-gradient-to-br from-amber-50 to-amber-100/50 rounded-xl border border-amber-200">
                  <div className="w-10 h-10 rounded-lg bg-amber-500 flex items-center justify-center mb-3">
                    <FileEdit className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="font-semibold text-slate-900 mb-1">
                    Droit de rectification
                  </h3>
                  <p className="text-sm text-slate-600">
                    Demander la correction de données inexactes ou incomplètes.
                  </p>
                </div>

                {/* Droit d'effacement */}
                <div className="p-5 bg-gradient-to-br from-red-50 to-red-100/50 rounded-xl border border-red-200">
                  <div className="w-10 h-10 rounded-lg bg-red-500 flex items-center justify-center mb-3">
                    <Trash2 className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="font-semibold text-slate-900 mb-1">Droit d&apos;effacement</h3>
                  <p className="text-sm text-slate-600">
                    Demander la suppression de vos données (sous réserve des obligations
                    d&apos;archivage).
                  </p>
                </div>

                {/* Droit à la portabilité */}
                <div className="p-5 bg-gradient-to-br from-green-50 to-green-100/50 rounded-xl border border-green-200">
                  <div className="w-10 h-10 rounded-lg bg-green-500 flex items-center justify-center mb-3">
                    <Download className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="font-semibold text-slate-900 mb-1">
                    Droit à la portabilité
                  </h3>
                  <p className="text-sm text-slate-600">
                    Recevoir vos données dans un format structéré et couramment utilisé.
                  </p>
                </div>

                {/* Droit d'opposition */}
                <div className="p-5 bg-gradient-to-br from-purple-50 to-purple-100/50 rounded-xl border border-purple-200">
                  <div className="w-10 h-10 rounded-lg bg-purple-500 flex items-center justify-center mb-3">
                    <Ban className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="font-semibold text-slate-900 mb-1">
                    Droit d&apos;opposition
                  </h3>
                  <p className="text-sm text-slate-600">
                    Vous opposer à certains traitements, sauf base légale impérative.
                  </p>
                </div>

                {/* Droit de limitation */}
                <div className="p-5 bg-gradient-to-br from-cyan-50 to-cyan-100/50 rounded-xl border border-cyan-200">
                  <div className="w-10 h-10 rounded-lg bg-cyan-500 flex items-center justify-center mb-3">
                    <Clock className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="font-semibold text-slate-900 mb-1">
                    Droit de limitation
                  </h3>
                  <p className="text-sm text-slate-600">
                    Demander la limitation du traitement dans certaines situations.
                  </p>
                </div>
              </div>

              <div className="mt-6 p-4 bg-[#009E60]/5 border border-[#009E60]/20 rounded-xl">
                <p className="text-sm text-slate-700">
                  <strong className="text-[#009E60]">Pour exercer ces droits :</strong>{" "}
                  Contactez notre Délégué à la Protection des Données (DPO) aux coordonnées
                  indiquées dans la section 8 ci-dessous. Nous répondrons dans un délai maximum
                  de <strong>30 jours</strong> conformément à la réglementation en vigueur.
                </p>
              </div>
            </section>

            {/* Section 6 - Cookies */}
            <section className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start gap-4 mb-6">
                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-orange-50 flex items-center justify-center">
                  <Cookie className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <h2 className="text-xl md:text-2xl font-bold text-slate-900">
                    6. Cookies et technologies similaires
                  </h2>
                  <p className="text-slate-600 mt-1">
                    Utilisation des cookies sur la plateforme
                  </p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="prose prose-slate max-w-none text-slate-700 leading-relaxed">
                  <p>
                    e-OSCS utilise exclusivement des cookies techniques nécessaires au bon
                    fonctionnement de la plateforme. Aucun cookie de suivi publicitaire ou
                    d&apos;analyse tierce n&apos;est utilisé sans votre consentement explicite.
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-4 bg-green-50 border border-green-200 rounded-xl">
                    <h3 className="font-semibold text-green-800 mb-3 text-sm uppercase tracking-wide">
                      Cookies utilisés (Techniques)
                    </h3>
                    <ul className="space-y-2 text-sm text-green-700">
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        <span>
                          <strong>Session :</strong> Maintien de votre connexion authentifiée
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        <span>
                          <strong>Préférences :</strong> Mémorisation de vos choix d&apos;affichage
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        <span>
                          <strong>Sécurité :</strong> Protection contre les attaques CSRF/XSS
                        </span>
                      </li>
                    </ul>
                  </div>

                  <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
                    <h3 className="font-semibold text-red-800 mb-3 text-sm uppercase tracking-wide">
                      Cookies non utilisés
                    </h3>
                    <ul className="space-y-2 text-sm text-red-700">
                      <li className="flex items-start gap-2">
                        <Ban className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        <span>Cookies de publicité ciblée</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Ban className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        <span>Cookies d&apos;analyse tierce (Google Analytics, etc.)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Ban className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        <span>Cookies de réseaux sociaux</span>
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="p-4 bg-slate-50 rounded-xl">
                  <p className="text-sm text-slate-600">
                    <strong>Gestion des cookies :</strong> Vous pouvez configurer votre navigateur
                    pour refuser les cookies. Cependant, cela pourrait affecter le bon
                    fonctionnement de certaines fonctionnalités de la plateforme.
                  </p>
                </div>
              </div>
            </section>

            {/* Section 7 - Sécurité */}
            <section className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start gap-4 mb-6">
                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center">
                  <Shield className="w-6 h-6 text-emerald-600" />
                </div>
                <div>
                  <h2 className="text-xl md:text-2xl font-bold text-slate-900">
                    7. Sécurité des données
                  </h2>
                  <p className="text-slate-600 mt-1">
                    Mesures de protection mises en œuvre
                  </p>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  {
                    title: "Chiffrement SSL/TLS",
                    desc: "Toutes les communications sont chiffrées de bout en bout",
                    level: "Élevé",
                  },
                  {
                    title: "Isolation des données",
                    desc: "Chaque Direction n'accède qu'à ses propres données",
                    level: "Élevé",
                  },
                  {
                    title: "Authentification forte",
                    desc: "Mots de passe sécurisés avec politique de complexité",
                    level: "Moyen",
                  },
                  {
                    title: "Sauvegardes quotidiennes",
                    desc: "Backup automatique des données sur serveurs sécurisés",
                    level: "Élevé",
                  },
                  {
                    title: "Contrôle d'accès RBAC",
                    desc: "Permissions granulaires basées sur les rôles",
                    level: "Élevé",
                  },
                  {
                    title: "Journalisation complète",
                    desc: "Traçabilité de toutes les actions effectuées",
                    level: "Moyen",
                  },
                ].map((item) => (
                  <div
                    key={item.title}
                    className="p-4 bg-slate-50 rounded-xl border border-slate-100"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-slate-900 text-sm">
                        {item.title}
                      </h3>
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full ${
                          item.level === "Élevé"
                            ? "bg-green-100 text-green-700"
                            : "bg-amber-100 text-amber-700"
                        }`}
                      >
                        {item.level}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600">{item.desc}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Section 8 - Contact DPO */}
            <section className="bg-gradient-to-br from-[#F77F00]/5 via-white to-[#009E60]/5 rounded-2xl border border-[#F77F00]/20 p-6 md:p-8">
              <div className="flex items-start gap-4 mb-6">
                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-white flex items-center justify-center shadow-sm">
                  <Mail className="w-6 h-6 text-[#F77F00]" />
                </div>
                <div>
                  <h2 className="text-xl md:text-2xl font-bold text-slate-900">
                    8. Contact DPO / Protection des données
                  </h2>
                  <p className="text-slate-600 mt-1">
                    Délégué à la Protection des Données
                  </p>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <a
                  href="mailto:omouitsi@gmail.com"
                  className="flex flex-col items-center gap-3 p-5 bg-white rounded-xl shadow-sm hover:shadow-md transition-all group"
                >
                  <div className="w-14 h-14 rounded-full bg-[#F77F00]/10 flex items-center justify-center group-hover:bg-[#F77F00]/20 transition-colors">
                    <Mail className="w-6 h-6 text-[#F77F00]" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium text-slate-900">Email DPO</p>
                    <p className="text-xs text-slate-500 break-all mt-1">
                      omouitsi@gmail.com
                    </p>
                  </div>
                </a>

                <a
                  href="https://wa.me/2250576103277"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center gap-3 p-5 bg-white rounded-xl shadow-sm hover:shadow-md transition-all group"
                >
                  <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center group-hover:bg-green-200 transition-colors">
                    <Phone className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium text-slate-900">WhatsApp</p>
                    <p className="text-xs text-slate-500 mt-1">+225 05 76 103 277</p>
                  </div>
                </a>

                <div className="flex flex-col items-center gap-3 p-5 bg-white rounded-xl shadow-sm">
                  <div className="w-14 h-14 rounded-full bg-blue-50 flex items-center justify-center">
                    <MapPin className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium text-slate-900">Adresse postale</p>
                    <p className="text-xs text-slate-500 mt-1">
                      Abidjan, Plateau<br />
                      Côte d&apos;Ivoire
                    </p>
                  </div>
                </div>

                <div className="flex flex-col items-center gap-3 p-5 bg-white rounded-xl shadow-sm">
                  <div className="w-14 h-14 rounded-full bg-purple-50 flex items-center justify-center">
                    <Scale className="w-6 h-6 text-purple-600" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium text-slate-900">Autorité de contrôle</p>
                    <p className="text-xs text-slate-500 mt-1">
                      AIPDP<br />
                  Côte d'Ivoire
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-6 p-4 bg-white/80 rounded-xl border border-slate-200">
                <p className="text-sm text-slate-700 text-center">
                  Si vous estimez que vos droits n&apos;ont pas été respectés, vous pouvez
                  également saisir{" "}
                  <strong>
                    l&apos;Autorité Ivoirienne de Protection des Données Personnelles (AIPDP)
                  </strong>{" "}
                  conformément à la loi n°2013-450.
                </p>
              </div>
            </section>

            {/* Section 9 - Modifications */}
            <section className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start gap-4 mb-6">
                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center">
                  <FileEdit className="w-6 h-6 text-slate-600" />
                </div>
                <div>
                  <h2 className="text-xl md:text-2xl font-bold text-slate-900">
                    9. Modifications de cette politique
                  </h2>
                  <p className="text-slate-600 mt-1">
                    Mises à jour futures
                  </p>
                </div>
              </div>

              <div className="prose prose-slate max-w-none space-y-4 text-slate-700 leading-relaxed">
                <p>
                  Nous nous réservons le droit de modifier cette politique de confidentialité à
                  tout moment pour refléter :
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Les changements dans nos pratiques de traitement des données</li>
                  <li>Les évolutions technologiques de la plateforme</li>
                  <li>Les modifications légales et réglementaires</li>
                  <li>Les recommandations de l&apos;autorité de contrôle (AIPDP)</li>
                </ul>
                <p>
                  Toute modification sera publiée sur cette page avec mise à jour de la date de
                  dernière modification. Nous vous encourageons à consulter régulièrement cette
                  page pour rester informé.
                </p>
              </div>
            </section>
          </div>

          {/* Navigation entre pages légales */}
          <div className="mt-12 pt-8 border-t border-slate-200">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-sm text-slate-600">
                Vous souhaitez consulter nos autres documents légaux ?
              </p>
              <div className="flex gap-3">
                <Button variant="outline" asChild className="gap-2">
                  <Link href="/conditions">
                    <Scale className="w-4 h-4" />
                    Mentions Légales
                  </Link>
                </Button>
                <Button
                  asChild
                  className="gap-2 bg-gradient-to-r from-[#009E60] to-[#007a4d] hover:from-[#007a4d] hover:to-[#009E60] text-white"
                >
                  <Link href="/">Retour à l&apos;accueil</Link>
                </Button>
              </div>
            </div>
          </div>
        </article>
      </main>

      {/* Footer simplifié */}
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
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
