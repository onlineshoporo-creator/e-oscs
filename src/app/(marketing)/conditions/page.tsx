import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Building2,
  Server,
  Scale,
  Shield,
  Phone,
  Mail,
  MapPin,
  ArrowLeft,
  FileText,
  Lock,
  Gavel,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Mentions Légales — e-OSCS",
  description:
    "Mentions légales de la plateforme e-OSCS - Éditeur, hébergement, propriété intellectuelle et informations légales.",
};

/* ============================================
   PAGE MENTIONS LÉGALES e-OSCS
   Informations légales complètes
   ============================================ */
export default function MentionsLegalesPage() {
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
                <span className="text-slate-900 font-medium">Mentions Légales</span>
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
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-[#F77F00]/10 to-[#009E60]/10 mb-6">
              <Gavel className="w-8 h-8 text-[#F77F00]" />
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 mb-4">
              Mentions Légales
            </h1>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Informations légales relatives à la plateforme e-OSCS conformément à la
              législation ivoirienne en vigueur.
            </p>
            <p className="text-sm text-slate-500 mt-4">
              Dernière mise à jour : Janvier 2026
            </p>
          </div>

          <Separator className="mb-12" />

          {/* Sections principales */}
          <div className="space-y-12">
            {/* Section 1 - Éditeur */}
            <section className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start gap-4 mb-6">
                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-[#F77F00]/10 flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-[#F77F00]" />
                </div>
                <div>
                  <h2 className="text-xl md:text-2xl font-bold text-slate-900">
                    1. Éditeur de la plateforme
                  </h2>
                  <p className="text-slate-600 mt-1">
                    Responsable de la publication et du contenu
                  </p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="bg-slate-50 rounded-xl p-4">
                    <p className="text-sm font-semibold text-slate-700 uppercase tracking-wide mb-3">
                      Identification
                    </p>
                    <dl className="space-y-3">
                      <div className="flex flex-col">
                        <dt className="text-xs text-slate-500">Dénomination</dt>
                        <dd className="font-medium text-slate-900">e-OSCS</dd>
                      </div>
                      <div className="flex flex-col">
                        <dt className="text-xs text-slate-500">Nom complet</dt>
                        <dd className="font-medium text-slate-900">
                          Plateforme électronique d&apos;Organisation, de Suivi et de Contrôle des
                          activités de Solidarité
                        </dd>
                      </div>
                      <div className="flex flex-col">
                        <dt className="text-xs text-slate-500">Ministère de tutelle</dt>
                        <dd className="font-medium text-slate-900">
                          MCNSLP — Ministère de la Cohésion Nationale, de la Solidarité Sociale
                          et de la Lutte contre la Pauvreté
                        </dd>
                      </div>
                    </dl>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="bg-slate-50 rounded-xl p-4">
                    <p className="text-sm font-semibold text-slate-700 uppercase tracking-wide mb-3">
                      Coordonnées
                    </p>
                    <address className="not-italic space-y-3">
                      <div className="flex items-start gap-3">
                        <MapPin className="w-4 h-4 text-[#009E60] mt-0.5 flex-shrink-0" />
                        <span className="text-slate-700 text-sm">
                          Abidjan, Plateau<br />
                          Côte d&apos;Ivoire
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Phone className="w-4 h-4 text-[#009E60] flex-shrink-0" />
                        <a
                          href="tel:+2250576103277"
                          className="text-slate-700 hover:text-[#F77F00] transition-colors text-sm"
                        >
                          +225 05 76 103 277
                        </a>
                      </div>
                      <div className="flex items-center gap-3">
                        <Mail className="w-4 h-4 text-[#009E60] flex-shrink-0" />
                        <a
                          href="mailto:omouitsi@gmail.com"
                          className="text-slate-700 hover:text-[#F77F00] transition-colors text-sm"
                        >
                          omouitsi@gmail.com
                        </a>
                      </div>
                    </address>
                  </div>
                </div>
              </div>

              <div className="mt-6 p-4 bg-[#009E60]/5 border border-[#009E60]/20 rounded-xl">
                <p className="text-sm text-slate-700">
                  <strong className="text-[#009E60]">Directeur de la publication :</strong> Le
                  Secrétaire Général du Ministère de la Cohésion Nationale, de la Solidarité
                  Sociale et de la Lutte contre la Pauvreté (MCNSLP).
                </p>
              </div>
            </section>

            {/* Section 2 - Hébergement */}
            <section className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start gap-4 mb-6">
                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center">
                  <Server className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-xl md:text-2xl font-bold text-slate-900">
                    2. Hébergement
                  </h2>
                  <p className="text-slate-600 mt-1">
                    Prestataire technique d&apos;hébergement
                  </p>
                </div>
              </div>

              <div className="bg-slate-50 rounded-xl p-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <dl className="space-y-3">
                      <div className="flex flex-col">
                        <dt className="text-xs text-slate-500 uppercase tracking-wide">
                          Hébergeur
                        </dt>
                        <dd className="font-medium text-slate-900">Vercel Inc.</dd>
                      </div>
                      <div className="flex flex-col">
                        <dt className="text-xs text-slate-500 uppercase tracking-wide">
                          Adresse
                        </dt>
                        <dd className="text-slate-700 text-sm">
                          340 S Lemon Ave #4133<br />
                          Walnut, CA 91789<br />
                          États-Unis
                        </dd>
                      </div>
                    </dl>
                  </div>
                  <div className="space-y-3">
                    <dl className="space-y-3">
                      <div className="flex flex-col">
                        <dt className="text-xs text-slate-500 uppercase tracking-wide">
                          Site web
                        </dt>
                        <dd>
                          <a
                            href="https://vercel.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#F77F00] hover:text-[#F77F00]/80 transition-colors text-sm font-medium"
                          >
                            vercel.com
                            <span className="sr-only"> (ouvre dans un nouvel onglet)</span>
                          </a>
                        </dd>
                      </div>
                      <div className="flex flex-col">
                        <dt className="text-xs text-slate-500 uppercase tracking-wide">
                          Contact
                        </dt>
                        <dd className="text-slate-700 text-sm">
                          support@vercel.com
                        </dd>
                      </div>
                    </dl>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 3 - Propriété intellectuelle */}
            <section className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start gap-4 mb-6">
                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center">
                  <FileText className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h2 className="text-xl md:text-2xl font-bold text-slate-900">
                    3. Propriété intellectuelle
                  </h2>
                  <p className="text-slate-600 mt-1">
                    Droits sur le contenu et les éléments de la plateforme
                  </p>
                </div>
              </div>

              <div className="prose prose-slate max-w-none space-y-4 text-slate-700 leading-relaxed">
                <p>
                  L&apos;ensemble des éléments composant la plateforme e-OSCS, incluant mais non
                  limité à :
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Le code source et l&apos;architecture logicielle</li>
                  <li>L&apos;interface utilisateur et l&apos;expérience graphique</li>
                  <li>Les graphismes, logos, icônes et éléments visuels</li>
                  <li>La documentation et les contenus rédactionnels</li>
                  <li>Les bases de données et structures de données</li>
                  <li>Les rapports générés automatiquement</li>
                </ul>
                <p>
                  sont la propriété exclusive du MCNSLP et sont protégés par le droit
                  d&apos;auteur ivoirien et international, ainsi que par les lois relatives à la
                  propriété intellectuelle.
                </p>

                <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-xl">
                  <p className="text-sm text-red-800 font-medium flex items-start gap-2">
                    <Lock className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    Toute reproduction, représentation, modification, publication ou adaptation,
                    intégrale ou partielle des éléments de la plateforme, quel que soit le moyen
                    ou le procédé utilisé, est interdite sans autorisation préalable et écrite du
                    MCNSLP.
                  </p>
                </div>
              </div>
            </section>

            {/* Section 4 - Responsabilité */}
            <section className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start gap-4 mb-6">
                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center">
                  <Shield className="w-6 h-6 text-amber-600" />
                </div>
                <div>
                  <h2 className="text-xl md:text-2xl font-bold text-slate-900">
                    4. Limitation de responsabilité
                  </h2>
                  <p className="text-slate-600 mt-1">
                    Cadre juridique de responsabilité
                  </p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-4 bg-slate-50 rounded-xl">
                    <h3 className="font-semibold text-slate-900 mb-2 text-sm uppercase tracking-wide">
                      Disponibilité du service
                    </h3>
                    <p className="text-sm text-slate-600">
                      Le MCNSLP s&apos;efforce d&apos;assurer une disponibilité optimale de la
                      plateforme 24h/24 et 7j/7. Cependant, il ne peut garantir un accès continu
                      et sans interruption en cas de maintenance, force majeure ou événements
                      indépendants de sa volonté.
                    </p>
                  </div>

                  <div className="p-4 bg-slate-50 rounded-xl">
                    <h3 className="font-semibold text-slate-900 mb-2 text-sm uppercase tracking-wide">
                      Qualité des données
                    </h3>
                    <p className="text-sm text-slate-600">
                      La responsabilité des données saisies incombe entièrement à
                      l&apos;utilisateur. Le MCNSLP décline toute responsabilité en cas
                      d&apos;erreurs, omissions ou inexactitudes dans les données introduites par
                      les utilisateurs.
                    </p>
                  </div>

                  <div className="p-4 bg-slate-50 rounded-xl">
                    <h3 className="font-semibold text-slate-900 mb-2 text-sm uppercase tracking-wide">
                      Liens hypertextes
                    </h3>
                    <p className="text-sm text-slate-600">
                      La plateforme peut contenir des liens vers des sites tiers. Le MCNSLP ne
                      peut être tenu responsable du contenu de ces sites externes sur lesquels
                      il n&apos;a aucun contrôle.
                    </p>
                  </div>

                  <div className="p-4 bg-slate-50 rounded-xl">
                    <h3 className="font-semibold text-slate-900 mb-2 text-sm uppercase tracking-wide">
                      Dommages indirects
                    </h3>
                    <p className="text-sm text-slate-600">
                      La responsabilité du MCNSLP est limitée aux dommages directs. Elle ne
                      couvre pas les dommages indirects, perte de profits, perte de chance ou
                      préjudice commercial.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 5 - Loi applicable */}
            <section className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start gap-4 mb-6">
                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-[#009E60]/10 flex items-center justify-center">
                  <Scale className="w-6 h-6 text-[#009E60]" />
                </div>
                <div>
                  <h2 className="text-xl md:text-2xl font-bold text-slate-900">
                    5. Droit applicable et juridiction compétente
                  </h2>
                  <p className="text-slate-600 mt-1">
                    Cadre juridique applicable
                  </p>
                </div>
              </div>

              <div className="prose prose-slate max-w-none space-y-4 text-slate-700 leading-relaxed">
                <p>
                  Les présentes mentions légales sont régies par le droit ivoirien. En cas de
                  litige relatif à l&apos;interprétation, l&apos;exécution ou la validité des
                  présentes mentions :
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>
                    <strong>Droit applicable :</strong> Droit de la République de Côte
                    d&apos;Ivoire
                  </li>
                  <li>
                    <strong>Juridiction compétente :</strong> Tribunaux compétents d&apos;Abidjan,
                    Côte d&apos;Ivoire
                  </li>
                  <li>
                    <strong>Langue :</strong> Les présentes mentions sont rédigées en français,
                    langue faisant foi en cas de litige
                  </li>
                </ul>
              </div>
            </section>

            {/* Section 6 - Contact pour réclamations */}
            <section className="bg-gradient-to-br from-[#F77F00]/5 to-[#009E60]/5 rounded-2xl border border-[#F77F00]/20 p-6 md:p-8">
              <div className="flex items-start gap-4 mb-6">
                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-white flex items-center justify-center shadow-sm">
                  <Mail className="w-6 h-6 text-[#F77F00]" />
                </div>
                <div>
                  <h2 className="text-xl md:text-2xl font-bold text-slate-900">
                    6. Contact pour réclamations
                  </h2>
                  <p className="text-slate-600 mt-1">
                    Pour toute question ou réclamation relative au site
                  </p>
                </div>
              </div>

              <div className="grid sm:grid-cols-3 gap-4">
                <a
                  href="mailto:omouitsi@gmail.com"
                  className="flex flex-col items-center gap-3 p-5 bg-white rounded-xl shadow-sm hover:shadow-md transition-all group"
                >
                  <div className="w-12 h-12 rounded-full bg-[#F77F00]/10 flex items-center justify-center group-hover:bg-[#F77F00]/20 transition-colors">
                    <Mail className="w-5 h-5 text-[#F77F00]" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium text-slate-900">Email</p>
                    <p className="text-xs text-slate-500 break-all">omouitsi@gmail.com</p>
                  </div>
                </a>

                <a
                  href="https://wa.me/2250576103277"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center gap-3 p-5 bg-white rounded-xl shadow-sm hover:shadow-md transition-all group"
                >
                  <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center group-hover:bg-green-200 transition-colors">
                    <Phone className="w-5 h-5 text-green-600" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium text-slate-900">WhatsApp</p>
                    <p className="text-xs text-slate-500">+225 05 76 103 277</p>
                  </div>
                </a>

                <div className="flex flex-col items-center gap-3 p-5 bg-white rounded-xl shadow-sm">
                  <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium text-slate-900">Adresse</p>
                    <p className="text-xs text-slate-500">Abidjan, Plateau, CI</p>
                  </div>
                </div>
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
                  <Link href="/confidentialite">
                    <Lock className="w-4 h-4" />
                    Politique de confidentialité
                  </Link>
                </Button>
                <Button asChild className="gap-2 bg-gradient-to-r from-[#F77F00] to-[#E67E00] hover:from-[#E67E00] hover:to-[#F77F00] text-white">
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
