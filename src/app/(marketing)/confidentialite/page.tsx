import type { Metadata } from "next";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";

export const metadata: Metadata = {
  title: "Politique de confidentialité — e-OSCS",
  description: "Politique de protection des données personnelles de la plateforme e-OSCS.",
};

export default function ConfidentialitePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header simple */}
      <header className="border-b bg-white">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#F77F00] to-[#009E60] flex items-center justify-center">
              <span className="text-lg font-bold text-white">e</span>
            </div>
            <span className="text-xl font-bold text-slate-900">e-OSCS</span>
          </Link>
          <Button variant="outline" size="sm" asChild>
            <Link href="/">Retour à l&apos;accueil</Link>
          </Button>
        </div>
      </header>

      {/* Contenu */}
      <main className="container mx-auto px-4 md:px-6 py-12 md:py-16">
        <article className="max-w-3xl mx-auto prose prose-slate">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">
            Politique de confidentialité
          </h1>
          <p className="text-muted-foreground mb-8">
            Dernière mise à jour : Janvier 2026
          </p>

          <Separator className="mb-8" />

          {/* Introduction */}
          <section className="mb-8">
            <p className="text-slate-600 leading-relaxed mb-4">
              Le Ministère de la Cohésion Nationale, de la Solidarité et de la Lutte contre la Pauvreté
              (MCNSLP) s&apos;engage à protéger la vie privée des utilisateurs de la plateforme e-OSCS.
              Cette politique de confidentialité explique comment nous collectons, utilisons, stockons
              et protégeons vos données personnelles.
            </p>
            <p className="text-slate-600 leading-relaxed">
              En utilisant e-OSCS, vous acceptez les pratiques décrites dans cette politique.
            </p>
          </section>

          {/* Section 1 */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold text-slate-900 mb-4">1. Données collectées</h2>
            <div className="space-y-4 text-slate-600">
              <p><strong>1.1 Données de compte :</strong></p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Nom et prénoms</li>
                <li>Adresse email professionnelle</li>
                <li>Numéro de téléphone</li>
                <li>Direction d&apos;affectation (Régionale ou Départementale)</li>
                <li>Fonction/Poste occupé</li>
              </ul>

              <p className="mt-4"><strong>1.2 Données d&apos;activité :</strong></p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Informations sur les activités planifiées et réalisées</li>
                <li>Données agrégées sur les bénéficiaires (sans données sensibles individuelles)</li>
                <li>Indicateurs de performance et statistiques</li>
                <li>Rapports générés via la plateforme</li>
              </ul>

              <p className="mt-4"><strong>1.3 Données techniques :</strong></p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Adresse IP (logs de connexion)</li>
                <li>Type de navigateur et système d&apos;exploitation</li>
                <li>Dates et heures de connexion</li>
              </ul>
            </div>
          </section>

          {/* Section 2 */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold text-slate-900 mb-4">2. Finalités du traitement</h2>
            <div className="space-y-4 text-slate-600">
              <p>Vos données sont collectées pour les finalités suivantes :</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Gérer votre compte utilisateur et vos accès à la plateforme</li>
                <li>Permettre la saisie et le suivi des activités de solidarité</li>
                <li>Générer automatiquement vos rapports administratifs</li>
                <li>Assurer le support technique et l&apos;assistance aux utilisateurs</li>
                <li>Sécuriser la plateforme et prévenir les fraudes</li>
                <li>Respecter nos obligations légales et réglementaires</li>
              </ul>
            </div>
          </section>

          {/* Section 3 */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold text-slate-900 mb-4">3. Base légale</h2>
            <p className="text-slate-600 leading-relaxed">
              Le traitement des données personnelles est nécessaire pour l&apos;exécution d&apos;une mission
              d&apos;intérêt public dont est chargé le MCNSLP, conformément à l&apos;article 14 de la loi
              n°2013-450 du 19 juin 2013 relative à la protection des données à caractère personnel
              en Côte d&apos;Ivoire.
            </p>
          </section>

          {/* Section 4 */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold text-slate-900 mb-4">4. Conservation des données</h2>
            <div className="space-y-4 text-slate-600">
              <p><strong>4.1 Durée de conservation :</strong></p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Données de compte : pendant toute la durée du contrat d&apos;abonnement</li>
                <li>Données d&apos;activité : 5 ans après la fin de l&apos;exercice concerné (conformément aux archives publiques)</li>
                <li>Logs techniques : maximum 12 mois</li>
              </ul>

              <p className="mt-4">
                <strong>4.2 Suppression :</strong> À l&apos;expiration des délais de conservation,
                les données sont définitivement supprimées ou anonymisées.
              </p>
            </div>
          </section>

          {/* Section 5 */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold text-slate-900 mb-4">5. Sécurité des données</h2>
            <div className="space-y-4 text-slate-600">
              <p>Nous mettons en œuvre des mesures techniques et organisationnelles appropriées pour protéger vos données :</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Chiffrement SSL/TLS</strong> pour toutes les communications</li>
                <li><strong>Isolation complète</strong> des données par Direction (chaque Direction n&apos;accède qu&apos;à ses propres données)</li>
                <li><strong>Authentification forte</strong> avec mots de passe sécurisés</li>
                <li><strong>Sauvegardes quotidiennes</strong> des données</li>
                <li><strong>Contrôle d&apos;accès strict</strong> basé sur les rôles et permissions</li>
                <li><strong>Journalisation</strong> des accès pour traçabilité</li>
              </ul>
            </div>
          </section>

          {/* Section 6 */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold text-slate-900 mb-4">6. Partage des données</h2>
            <div className="space-y-4 text-slate-600">
              <p><strong>6.1 Principe d&apos;isolation :</strong></p>
              <p>
                Les données de chaque Direction Régionale ou Départementale sont strictement isolées.
                Aucune Direction ne peut accéder aux données d&apos;une autre Direction.
              </p>

              <p className="mt-4"><strong>6.2 Hiérarchie administrative :</strong></p>
              <p>
                Dans le respect des organigrammes officiels, les données peuvent être consultées
                par les niveaux hiérarchiques supérieurs pour besoins de consolidation nationale
                (Direction Générale, Cabinet).
              </p>

              <p className="mt-4"><strong>6.3 Tiers :</strong></p>
              <p>
                Nous ne vendons, ne louons ni ne partageons vos données personnelles avec des tiers
                à des fins commerciales. Seuls nos prestataires techniques indispensables au
                fonctionnement de la plateforme peuvent y accéder dans le cadre strict de leur mission.
              </p>
            </div>
          </section>

          {/* Section 7 */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold text-slate-900 mb-4">7. Vos droits</h2>
            <div className="space-y-4 text-slate-600">
              <p>Conformément à la loi ivoirienne n°2013-450, vous disposez des droits suivants :</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Droit d&apos;accès :</strong> Consulter vos données personnelles</li>
                <li><strong>Droit de rectification :</strong> Corriger des données inexactes</li>
                <li><strong>Droit d&apos;effacement :</strong> Demander la suppression de vos données (sous réserve des obligations légales d&apos;archivage)</li>
                <li><strong>Droit à la portabilité :</strong> Recevoir vos données dans un format structuré</li>
                <li><strong>Droit d&apos;opposition :</strong> Vous opposer à certains traitements, sauf base légale impérative</li>
              </ul>
              <p className="mt-4">
                Pour exercer ces droits, contactez-nous aux coordonnées indiquées section 10.
              </p>
            </div>
          </section>

          {/* Section 8 */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold text-slate-900 mb-4">8. Cookies et technologies similaires</h2>
            <p className="text-slate-600 leading-relaxed">
              e-OSCS utilise exclusivement des cookies techniques nécessaires au bon fonctionnement
              de la plateforme (maintien de session, préférences d&apos;affichage). Aucun cookie
              de suivi publicitaire ou d&apos;analyse tierce n&apos;est utilisé.
            </p>
          </section>

          {/* Section 9 */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold text-slate-900 mb-4">9. Modifications</h2>
            <p className="text-slate-600 leading-relaxed">
              Nous nous réservons le droit de modifier cette politique de confidentialité à tout moment.
              Les modifications seront publiées sur cette page avec la date de mise à jour. Nous vous
              encourageons à consulter régulièrement cette page.
            </p>
          </section>

          {/* Section 10 */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold text-slate-900 mb-4">10. Contact</h2>
            <div className="text-slate-600 space-y-2">
              <p>Pour toute question relative à la protection de vos données :</p>
              <div className="bg-slate-50 rounded-lg p-4 mt-4">
                <p><strong>Délégué à la protection des données (DPO)</strong></p>
                <ul className="list-none mt-2 space-y-1">
                  <li>Email : omouitsi@gmail.com</li>
                  <li>WhatsApp : +225 05 76 103 277</li>
                  <li>Adresse : MCNSLP, Abidjan, Côte d&apos;Ivoire</li>
                </ul>
              </div>
              <p className="mt-4">
                Vous pouvez également saisir l&apos;Autorité Ivoirienne de Protection des Données
                Personnelles (AIPDP) si vous estimez que vos droits n&apos;ont pas été respectés.
              </p>
            </div>
          </section>

          <Separator className="my-8" />

          <p className="text-sm text-muted-foreground text-center">
            © 2026 e-OSCS — MCNSLP, Côte d&apos;Ivoire
          </p>
        </article>
      </main>
    </div>
  );
}

// Import Button pour le header
function Button({ 
  children, 
  variant, 
  size, 
  asChild, 
  ...props 
}: { 
  children: React.ReactNode;
  variant?: string;
  size?: string;
  asChild?: boolean;
  [key: string]: unknown;
}) {
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] ${
        variant === "outline" 
          ? "border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground px-4 py-2" 
          : "bg-primary text-primary-foreground shadow-xs hover:bg-primary/90 h-9 px-4 py-2"
      } ${size === "sm" ? "h-8 rounded-md gap-1.5 px-3" : ""}`}
      {...(props as React.ButtonHTMLAttributes<HTMLButtonElement>)}
    >
      {children}
    </button>
  );
}
