import type { Metadata } from "next";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";

export const metadata: Metadata = {
  title: "Conditions d'utilisation — e-OSCS",
  description: "Conditions générales d'utilisation de la plateforme e-OSCS pour le MCNSLP.",
};

export default function ConditionsPage() {
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
            Conditions d&apos;utilisation
          </h1>
          <p className="text-muted-foreground mb-8">
            Dernière mise à jour : Janvier 2026
          </p>

          <Separator className="mb-8" />

          {/* Section 1 */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold text-slate-900 mb-4">1. Objet</h2>
            <p className="text-slate-600 leading-relaxed mb-4">
              Les présentes conditions générales d&apos;utilisation (ci-après &quot;CGU&quot;) régissent
              l&apos;accès et l&apos;utilisation de la plateforme e-OSCS (électronique - Organisation,
              Suivi et Contrôle des activités de Solidarité), mise à disposition par le Ministère
              de la Cohésion Nationale, de la Solidarité et de la Lutte contre la Pauvreté
              (MCNSLP) de Côte d&apos;Ivoire.
            </p>
            <p className="text-slate-600 leading-relaxed">
              La plateforme e-OSCS est destinée exclusivement aux Directions Régionales et
              Départementales du MCNSLP pour la gestion de leurs activités de solidarité et
              de cohésion sociale.
            </p>
          </section>

          {/* Section 2 */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold text-slate-900 mb-4">2. Accès au service</h2>
            <div className="space-y-4 text-slate-600">
              <p>
                <strong>2.1 Éligibilité :</strong> L&apos;accès à e-OSCS est réservé aux agents
                habilités des Directions Régionales et Départementales du MCNSLP ayant souscrit
                un abonnement valide.
              </p>
              <p>
                <strong>2.2 Inscription :</strong> Toute demande d&apos;abonnement fait l&apos;objet
                d&apos;une validation par les services compétents du MCNSLP avant activation du compte.
              </p>
              <p>
                <strong>2.3 Identifiants :</strong> L&apos;utilisateur s&apos;engage à garder confidentiels
                ses identifiants de connexion et à ne pas les partager avec des tiers. Toute connexion
                effectuée avec ces identifiants est réputée émaner de l&apos;utilisateur titulaire.
              </p>
            </div>
          </section>

          {/* Section 3 */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold text-slate-900 mb-4">3. Abonnements et tarifs</h2>
            <div className="space-y-4 text-slate-600">
              <p>
                <strong>3.1 Formules :</strong> e-OSCS propose trois formules d&apos;abonnement :
                Essentiel, Professionnel et Institutionnel, dont les caractéristiques et tarifs
                sont détaillés sur la page Tarifs du site.
              </p>
              <p>
                <strong>3.2 Paiement :</strong> Le paiement s&apos;effectue par Mobile Money
                (Orange Money, MTN, Wave) après validation de la demande. Aucun prélèvement
                automatique n&apos;est effectué.
              </p>
              <p>
                <strong>3.3 Durée :</strong> L&apos;abonnement est reconduit mensuellement ou
                annuellement selon l&apos;option choisie, sauf résiliation de la part de l&apos;abonné.
              </p>
              <p>
                <strong>3.4 Résiliation :</strong> L&apos;utilisateur peut résilier son abonnement
                à tout moment sans frais ni pénalité. En cas de résiliation en cours de période
                payée, l&apos;accès reste ouvert jusqu&apos;à la fin de cette période.
              </p>
            </div>
          </section>

          {/* Section 4 */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold text-slate-900 mb-4">4. Obligations des utilisateurs</h2>
            <div className="space-y-4 text-slate-600">
              <p>
                <strong>4.1 Exactitude des données :</strong> L&apos;utilisateur s&apos;engage à saisir
                des données exactes, complètes et à jour concernant les activités de sa Direction.
              </p>
              <p>
                <strong>4.2 Usage conforme :</strong> La plateforme doit être utilisée conformément
                à sa destination, à savoir le suivi des activités de solidarité et de cohésion sociale.
              </p>
              <p>
                <strong>4.3 Interdictions :</strong> Il est interdit de :
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Tenter d&apos;accéder indûment à des données d&apos;une autre Direction</li>
                <li>Introduire des données fausses ou trompeuses</li>
                <li>Détériorer ou tenter de compromettre le bon fonctionnement de la plateforme</li>
                <li>Reproduire ou distribuer illicitement les rapports générés</li>
              </ul>
            </div>
          </section>

          {/* Section 5 */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold text-slate-900 mb-4">5. Données personnelles</h2>
            <div className="space-y-4 text-slate-600">
              <p>
                Le traitement des données personnelles effectué via e-OSCS se conforme à la
                législation ivoirienne en matière de protection des données, notamment la loi
                n°2013-450 du 19 juin 2013 relative à la protection des données à caractère personnel.
              </p>
              <p>
                Pour plus de détails, consultez notre{" "}
                <Link href="/confidentialite" className="text-primary hover:underline">
                  Politique de confidentialité
                </Link>.
              </p>
            </div>
          </section>

          {/* Section 6 */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold text-slate-900 mb-4">6. Propriété intellectuelle</h2>
            <p className="text-slate-600 leading-relaxed">
              L&apos;ensemble des éléments composant la plateforme e-OSCS (logiciel, interface,
              graphismes, documentation) est protégé par le droit d&apos;auteur et la propriété
              intellectuelle. Toute reproduction ou représentation, intégrale ou partielle, est
              interdite sans autorisation préalable du MCNSLP.
            </p>
          </section>

          {/* Section 7 */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold text-slate-900 mb-4">7. Responsabilité</h2>
            <div className="space-y-4 text-slate-600">
              <p>
                <strong>7.1 Disponibilité :</strong> Le MCNSLP s&apos;efforce d&apos;assurer une
                disponibilité optimale de la plateforme mais ne peut garantir un accès continu
                et sans interruption.
              </p>
              <p>
                <strong>7.2 Données saisies :</strong> La responsabilité des données saisies
                incombe entièrement à l&apos;utilisateur. Le MCNSLP décline toute responsabilité
                en cas d&apos;erreurs ou omissions dans les données introduites par les utilisateurs.
              </p>
              <p>
                <strong>7.3 Limitation :</strong> La responsabilité du MCNSLP est limitée aux
                dommages directs et ne couvre pas les dommages indirects ou perte de profits.
              </p>
            </div>
          </section>

          {/* Section 8 */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold text-slate-900 mb-4">8. Modifications des CGU</h2>
            <p className="text-slate-600 leading-relaxed">
              Le MCNSLP se réserve le droit de modifier les présentes CGU à tout moment.
              Les utilisateurs seront informés des modifications significatives par email
              ou via la plateforme. La poursuite de l&apos;utilisation du service après
              modification vaut acceptation des nouvelles conditions.
            </p>
          </section>

          {/* Section 9 */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold text-slate-900 mb-4">9. Droit applicable</h2>
            <p className="text-slate-600 leading-relaxed">
              Les présentes CGU sont soumises au droit ivoirien. Tout litige relatif à
              l&apos;interprétation ou l&apos;exécution des présentes sera de la compétence
              des tribunaux d&apos;Abidjan, Côte d&apos;Ivoire.
            </p>
          </section>

          {/* Section 10 */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold text-slate-900 mb-4">10. Contact</h2>
            <div className="text-slate-600 space-y-2">
              <p>Pour toute question relative aux présentes CGU :</p>
              <ul className="list-none space-y-1">
                <li><strong>Email :</strong> omouitsi@gmail.com</li>
                <li><strong>WhatsApp :</strong> +225 05 76 103 277</li>
              </ul>
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
