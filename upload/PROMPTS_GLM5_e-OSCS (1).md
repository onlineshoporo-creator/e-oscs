# e-OSCS — Plan de construction guidé pour GLM-5
### 27 prompts séquentiels pour construire le SaaS complet, page par page
**Basé sur le PRD e-OSCS v2.0 — Août 2026**

---

## MODE D'EMPLOI (à lire avant de commencer)

1. **Ordre impératif** : exécutez les prompts dans l'ordre (0 → 26). Chaque prompt suppose que les précédents sont terminés et validés.
2. **Un prompt à la fois** : collez le contenu du bloc `text` dans GLM-5, attendez la fin du travail, **vérifiez les critères d'acceptation**, puis passez au suivant.
3. **Commit après chaque prompt** : GLM-5 doit commiter et pousser sur GitHub à la fin de chaque prompt. C'est votre filet de sécurité (retour arrière possible).
4. **Nouvelle session GLM-5** : si vous ouvrez une nouvelle conversation, collez d'abord le **PROMPT 0 (contexte maître)** puis le **PROMPT R (reprise)** en annexe E, puis le prompt en cours.
5. **Secrets** : ne collez jamais vos vraies clés dans GLM-5, GitHub ou le code. Elles vont dans `.env.local` (local) et dans les variables d'environnement Vercel (production). Voir annexe B.
6. **Couleurs nationales** : l'identité visuelle s'inspire de la Côte d'Ivoire (orange `#F77F00`, vert `#009E60`) sur fond institutionnel clair.

---

## LES 3 PLANS TARIFAIRES (intégrés dans les prompts 3, 4, 11 et 21)

| | **ESSENTIEL** — 10 000 FCFA/mois | **PROFESSIONNEL** — 15 000 FCFA/mois ⭐ populaire | **INSTITUTIONNEL** — 25 000 FCFA/mois |
|---|---|---|---|
| Organisations | 1 Direction | 1 Direction | 1 Direction |
| Utilisateurs | 5 max | 15 max | Illimités |
| Plan annuel + Activités + Validation | ✅ | ✅ | ✅ |
| Pièces jointes / photos | 1 Go | 5 Go | 20 Go |
| Tableau de bord | ✅ | ✅ | ✅ |
| Rapport trimestriel Word | ✅ | ✅ | ✅ |
| Rapport mensuel Word | — | ✅ | ✅ |
| Rapport annuel Word | — | ✅ | ✅ |
| Présentations PowerPoint | — | ✅ | ✅ |
| Indicateurs avancés + Prévision/Réalisation | — | ✅ | ✅ |
| Archivage & versions | — | ✅ | ✅ |
| Incidents / faits majeurs | ✅ | ✅ | ✅ |
| Modèles de documents personnalisés (logo, couleurs) | — | — | ✅ |
| Statistiques avancées + Carte nationale | — | — | ✅ |
| Export complet des données (CSV/XLSX) | — | — | ✅ |
| Support | Email / WhatsApp | Prioritaire | Prioritaire + accompagnement |

*Le paiement se fait hors application (Mobile Money), après contact avec le Super Admin — conformément au PRD §6-7. Aucun paiement en ligne.*

---

## ANNEXE A — Variables d'environnement (`.env.example`)

Le PROMPT 1 crée ce fichier. Contenu attendu :

```text
# --- Publiques (frontend autorisé) ---
NEXT_PUBLIC_SUPABASE_URL=https://VOTRE-PROJET.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=VOTRE_CLE_ANON_PUBLIQUE
NEXT_PUBLIC_APP_URL=http://localhost:3000

# --- Secrètes (SERVEUR UNIQUEMENT — jamais côté client, jamais dans GitHub) ---
SUPABASE_SERVICE_ROLE_KEY=VOTRE_CLE_SERVICE_ROLE

# --- Coordonnées commerciales Super Admin (valeurs par défaut, modifiables dans /admin/parametres) ---
NEXT_PUBLIC_CONTACT_WHATSAPP=2250576103277
NEXT_PUBLIC_CONTACT_EMAIL=omouitsi@gmail.com
```

## ANNEXE B — Sécurité des tokens (OBLIGATOIRE AVANT LE PROMPT 1)

Les tokens qui ont circulé hors des coffres-forts doivent être considérés comme compromis :

1. **GitHub** : github.com → Settings → Developer settings → Personal access tokens → **Revoke** l'ancien token → créer un nouveau token `repo` classique. Ne le stockez que dans votre gestionnaire de mots de passe et la config Git locale (`git remote`), jamais dans le code.
2. **Supabase** : Dashboard → Project Settings → API → **Regenerate** la `service_role` key (elle contourne toute la sécurité RLS). Mettez à jour `.env.local` et Vercel ensuite.
3. Vérifiez que `.gitignore` contient `.env.local` et `.env*.local`.
4. La clé `anon` est publique par conception, **mais elle n'est sûre que si RLS est activée partout** — d'où le PROMPT 2.

---

# LES PROMPTS

---

## 📋 PROMPT 0 — CONTEXTE MAÎTRE (à coller au début de TOUTE session GLM-5)

```text
CONTEXTE MAÎTRE — PROJET e-OSCS (ne rien coder dans ce message, juste confirmer la compréhension)

RÔLE : Tu es un ingénieur full-stack senior et product designer. Tu construis e-OSCS, un SaaS
multi-tenant pour le MCNSLP (Ministère de la Cohésion Nationale, de la Solidarité et de la Lutte
contre la Pauvreté, Côte d'Ivoire). Les clients sont les Directions Régionales (DR), Directions
Départementales (DD). Ils planifient leurs activités annuelles, saisissent leurs activités
(solidarité, cohésion sociale, visites de compassion, alerte précoce), les font valider, puis
génèrent automatiquement leurs rapports administratifs mensuels/trimestriels/annuels en Word et
PowerPoint. Principe directeur : « une donnée saisie une seule fois, exploitée à tous les niveaux ».

CYCLE PRODUIT : Landing page → demande d'abonnement → Super Admin traite (contact WhatsApp/téléphone,
paiement Mobile Money HORS application) → activation par code → espace Direction → collaborateurs →
plan annuel → activités → validation → consolidation trimestrielle/annuelle → rapports Word/PPTX →
archivage. Abonnements manuels gérés par le Super Admin. Aucun paiement en ligne.

STACK IMPOSÉE : Next.js 15 (App Router) + TypeScript strict + Tailwind CSS + shadcn/ui + Supabase
(PostgreSQL + Auth + Storage) via @supabase/ssr + Recharts + react-hook-form + zod + date-fns (locale fr)
+ docx (génération Word) + pptxgenjs (PowerPoint) + lucide-react. Déploiement Vercel. Repo GitHub :
https://github.com/onlineshoporo-creator/e-oscs.git

RÔLES : SUPER_ADMIN (propriétaire plateforme, hors tenant) ; PROPRIETAIRE (chef de DR/DD) ;
AGENT (collaborateur) ; LECTEUR (consultation seule). Trimestres : T1=janv-mars, T2=avr-juin,
T3=juil-sept, T4=oct-déc.

RÈGLES D'OR (inviolables) :
1. JAMAIS de secret en dur dans le code : uniquement process.env.* ; .env.local jamais commité ;
   la clé SUPABASE_SERVICE_ROLE_KEY n'est utilisée QUE dans des Server Actions ou Route Handlers.
2. RLS activée sur TOUTE table métier, isolation stricte par organizations.id (tenant_id).
3. Interface 100 % en français simple, pensée pour des débutants. Noms de fichiers/routes en français.
4. Montants en FCFA : Intl.NumberFormat('fr-FR', { maximumFractionDigits: 0 }) + suffixe « FCFA ».
   Dates via date-fns locale fr.
5. Simplicité > effets : pas d'animations superflues ; lisibilité, accessibilité, responsive
   mobile-first (ordinateur/tablette/smartphone).
6. À la fin de CHAQUE tâche : exécuter tsc --noEmit, npm run lint, npm run build — tout doit passer ;
   puis git commit (convention : feat/fix/chore + description claire) et git push.
7. Ne jamais casser ni supprimer une fonctionnalité existante. En cas de doute, demander.
8. Code modulaire et documenté : commentaires JSDoc sur les fonctions métier complexes.

DESIGN SYSTEM : thème clair institutionnel. Primaire orange CI #F77F00 (CTA), secondaire vert CI
#009E60 (succès/validation), neutres slate. Police Inter via next/font. Composants shadcn/ui :
button, card, input, textarea, select, table, badge, dialog, sheet, tabs, toast, dropdown-menu,
accordion, form, calendar, popover, tooltip, skeleton, alert. Sidebar #0F172A (slate-900) pour
l'admin, navigation claire avec icônes lucide. Cartes KPI sobres avec icône, valeur grande, libellé
petit, variation optionnelle. Tableaux : en-tête sticky, recherche, filtres, pagination, états vides
illustrés en texte. Formulaires métier en étapes (stepper) avec sauvegarde brouillon.

STRUCTURE CIBLE DU REPO :
app/(marketing)/... landing + demande ; app/(auth)/... connexion, activation ; app/admin/... cockpit
Super Admin ; app/app/... espace Direction ; components/ui + components/metier ; lib/supabase/
(client.ts, server.ts, admin.ts) ; lib/utils.ts ; types/database.ts ; supabase/migrations/*.sql ;
supabase/seed.sql ; public/.

Réponds uniquement par un résumé de ta compréhension (10 lignes max) et attends le premier prompt
de construction.
```

---

## 📋 PROMPT 1 — Initialisation du projet (scaffold)

```text
TÂCHE : Initialiser le projet e-OSCS from scratch et pousser sur GitHub.

1. create-next-app e-oscs : Next.js 15, TypeScript, Tailwind CSS, App Router, src/ NON (dossier app/
   à la racine), ESLint, import alias @/*.
2. Installer : @supabase/supabase-js @supabase/ssr, zod, react-hook-form, @hookform/resolvers,
   date-fns, recharts, lucide-react, docx, pptxgenjs, clsx, tailwind-merge.
3. npx shadcn init (style New York, slate) puis ajouter : button card input textarea select table
   badge dialog sheet tabs toast dropdown-menu accordion form calendar popover tooltip skeleton
   alert separator avatar progress.
4. Configurer tailwind.config : couleurs primaire #F77F00 et secondaire #009E60 + tokens sémantiques
   (success, warning, danger), radius lg. Configurer Inter via next/font dans app/layout.tsx, lang="fr",
   metadata title « e-OSCS — Plateforme nationale de suivi des activités de solidarité et de cohésion
   sociale ».
5. Créer la structure de dossiers du CONTEXTE MAÎTRE, avec un fichier index ou placeholder par dossier.
6. Créer lib/supabase/client.ts (browser client), lib/supabase/server.ts (server client avec cookies
   Next.js), lib/supabase/admin.ts (service role — server only, garde "import 'server-only'").
7. Créer .env.example EXACTEMENT selon l'annexe A du dossier de prompts que je t'ai fourni (variables
   NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, NEXT_PUBLIC_APP_URL,
   SUPABASE_SERVICE_ROLE_KEY, NEXT_PUBLIC_CONTACT_WHATSAPP, NEXT_PUBLIC_CONTACT_EMAIL). Ajouter
   .env.local et .env*.local au .gitignore.
8. Créer middleware.ts Next.js : rafraîchissement de session Supabase Auth (pattern officiel
   @supabase/ssr), redirection de /app/* et /admin/* vers /connexion si non authentifié (placeholder,
   sera affiné au prompt Auth).
9. Page d'accueil temporaire minimaliste (« e-OSCS — en construction ») + app/globals.css avec les
   variables CSS du design system.
10. Initialiser git, remote origin https://github.com/onlineshoporo-creator/e-oscs.git, .gitignore
    vérifié, commit « chore: initialisation du projet e-OSCS », push.
11. Créer README.md : description, stack, installation, variables d'environnement requises, commandes.

CRITÈRES D'ACCEPTATION : npm run build passe ; tsc --noEmit passe ; repo poussé sur GitHub ; aucun
secret dans le dépôt (git log + grep de vérification) ; .env.example présent.
```

---

## 📋 PROMPT 2 — Schéma de base de données complet + RLS (fondation critique)

```text
TÂCHE : Créer la migration Supabase complète du modèle de données e-OSCS avec RLS multi-tenant.
Fichier supabase/migrations/0001_init.sql + helpers SQL. (Exécution : via Supabase SQL Editor, je
le ferai ; fournis aussi supabase db push comme alternative documentée dans le README.)

ENUMS : org_role (PROPRIETAIRE, AGENT, LECTEUR) ; subscription_status (DEMANDE, EN_TRAITEMENT,
EN_ATTENTE_PAIEMENT, ACTIF, EXPIRANT_BIENTOT, EXPIRE, SUSPENDU, RESILIE) ; activity_status
(BROUILLON, SOUMIS, EN_VERIFICATION, VALIDE, REJETE, CORRECTION, CONSOLIDE) ; request_status
(NOUVELLE, EN_CONTACT, EN_ATTENTE_PAIEMENT, PAYEE, REFUSEE, CLOTUREE) ; period_status (OUVERT, CLOTURE) ;
indicator_kind (QUANTITATIF, QUALITATIF) ; severity (FAIBLE, MOYENNE, ELEVEE, CRITIQUE) ;
incident_status (EN_COURS, CLOTURE).

TABLES (toutes avec id uuid pk default gen_random_uuid(), created_at, updated_at + trigger
set_updated_at, et sauf mention contraire organization_id uuid not null references organizations) :

1. organizations : id, nom, type (DR/DD), region, departement, telephone, email, logo_url, actif bool,
   created_by (owner user id).
2. subscription_plans (PAS de tenant, global) : code unique (ESSENTIEL/PROFESSIONNEL/INSTITUTIONNEL),
   nom, prix_mensuel int (FCFA), max_users int (null = illimité), storage_gb int, features jsonb
   (monthly_report, annual_report, pptx, advanced_indicators, archive, custom_templates,
   national_stats, data_export : booléens), ordre int, actif bool.
3. subscriptions : organization_id, plan_id, date_debut, date_fin, duree_mois, statut enum,
   montant int, reference_paiement text, confirme_le timestamptz, confirme_par uuid, notes.
4. activation_codes (global sauf colonne) : code unique, organization_id, plan_id, email_proprietaire,
   duree_mois, expire_le, utilise bool, utilise_le, cree_par.
5. subscription_requests (global) : demandes landing : nom, fonction, direction, type (DR/DD), region,
   departement, telephone, whatsapp, email, taille_equipe int, besoin text, formule_souhaitee text,
   statut enum request_status, traite_par uuid, traite_le, notes_internes, historique_statuts jsonb[].
6. profiles (global, id = auth.users.id) : nom_complet, telephone, organization_id null (null =
   SUPER_ADMIN), org_role null, is_super_admin bool default false, actif bool, avatar_url.
7. regions / departments / sub_prefectures (référentiels globaux, lecture tous) : nom, code,
   parent_id pour hiérarchie.
8. structures (services/équipes internes d'une org) : nom, description.
9. activity_categories (global, seed) : code unique, nom, description, couleur (avec sous-entité
   activity_types : category_id, nom). Administrables : table admin_manageable via is_super_admin.
10. annual_plans : annee int, titre, statut (OUVERT/CLOTURE). plan_activities : plan_id, axe_strategique,
    objectif, activite_prevue, indicateur, cible, responsable, periode_prevue (T1..T4/M1..M12/ANNEE),
    budget numeric null, observations.
11. activities : reference text unique (générée : PREFIXEORG-ANNEE-SEQUENCE via séquence par org),
    date_activite date not null, mois smallint GENERATED (extract month) , trimestre smallint
    GENERATED (ceil(month/3)), annee smallint GENERATED, region, departement, sous_prefecture,
    category_id, type_id, intitule, description, objectif, structure_responsable, responsables text[],
    resultats, difficultes, recommandations, perspectives, observations, statut enum activity_status,
    plan_activity_id null (null = activité supplémentaire non prévue), est_supplementaire bool,
    cree_par uuid, soumis_le, valide_le, valide_par, motif_rejet.
12. activity_actors : activity_id, acteur nom, type_acteur (INTERNE/PARTENAIRE), role. actors
    (répertoire org) : nom, type, contact.
13. beneficiaries : activity_id, hommes int, femmes int, enfants int, adultes int, personnes_agees int,
    vulnerables int, total int ; CHECK cohérence : total = hommes+femmes ET contrainte applicative
    documentée (le total doit égaler la somme par sexe).
14. indicators (global ou org : colonne organization_id NULLABLE ; null = indicateur global) : nom,
    unite, kind enum, axe, category_id null. indicator_values : activity_id/plan_activity_id,
    indicator_id, valeur_numerique numeric null, valeur_texte text null.
15. incidents + incident_types (global seed) : date, lieu, region, departement, nature, type_id,
    gravite enum, victimes int, deces int, actions_entreprises, acteurs text, statut enum.
16. attachments : activity_id (ou incident_id), kind (PHOTO/DOCUMENT), storage_path, nom_fichier,
    mime, taille int, legende, date_prise, lieu_prise, description, selection_presentation bool.
17. periods : organization_id, annee, trimestre, statut period_status, cloture_le, cloture_par,
    rouverte_le, rouverte_par, motif_reouverture.
18. reports : organization_id, type (MENSUEL/TRIMESTRIEL/ANNUEL), annee, periode (mois ou trimestre),
    statut (BROUILLON/FINAL), titre. report_versions : report_id, version int, format (DOCX/PPTX),
    storage_path, genere_par, parametres jsonb.
19. notifications : organization_id, user_id null (null = tous les habilités), type, titre, message,
    lien, lue bool.
20. audit_logs : organization_id null, user_id, action, objet_type, objet_id, ancienne_valeur jsonb,
    nouvelle_valeur jsonb, ip text, user_agent, created_at.
21. admin_settings (global, 1 ligne) : whatsapp, email, textes jsonb.

FONCTIONS SQL HELPER (security definer, stable) : current_org_id() → organization_id du profile ;
current_org_role() ; is_super_admin(). Fonction compute_subscription_status() (retourne EXPIRANT_BIENTOT
si date_fin <= now()+30j).

RLS — POLITIQUES OBLIGATOIRES sur CHAQUE table métier :
- SELECT : organization_id = current_org_id() OU is_super_admin().
- INSERT/UPDATE : idem + rôle != LECTEUR pour activities/plans ; validation (changement statut)
  réservée PROPRIETAIRE sauf BROUILLON par l'auteur.
- DELETE : PROPRIETAIRE ou auteur en BROUILLON ; super admin tout.
- subscription_requests : INSERT autorisé au rôle anon (formulaire public) ; SELECT/UPDATE :
  super admin uniquement.
- activation_codes : SELECT usage public limité (fonction RPC verify_code), écriture super admin.
- Référentiels globaux (regions, plans, catégories, types d'incidents) : SELECT à tous les
  authentifiés, écriture super admin ; indicateurs globaux idem, org pour les leurs.
- audit_logs : INSERT via trigger security definer ; SELECT super admin (tout) + PROPRIETAIRE (son org).
TRIGGERS d'audit génériques sur : activities (UPDATE statut), subscriptions, organizations, profiles,
periods — écrivent dans audit_logs (ancienne/nouvelle valeur en jsonb via to_jsonb(OLD/NEW)).

STORAGE : buckets « attachments » et « reports » privés ; policies : chemin préfixé par
organization_id/ (foldername[1] = current_org_id()) ; taille max 10 Mo/fichier côté app ; mime
autorisés JPG PNG PDF DOCX XLSX PPTX.

CRITÈRES D'ACCEPTATION : migration appliquée sans erreur (je colle le SQL dans l'éditeur Supabase) ;
requête de vérification fournie affichant toutes les tables avec rowsecurity = true (aucune table
métier sans RLS) ; fonctions helper testables ; guide pas-à-pas de la requête de contrôle fourni dans
le README section « Sécurité ».
```

---

## 📋 PROMPT 3 — Données de référence (seed) : plans, catégories, régions, super admin

```text
TÂCHE : Créer supabase/seed.sql (idempotent : INSERT ... ON CONFLICT DO NOTHING / DO UPDATE) et le
script npm « npm run seed » documenté.

1. PLANS D'ABONNEMENT — insérer exactement ces 3 plans :
   a) ESSENTIEL — 10 000 FCFA/mois — max_users 5 — storage_gb 1 — features : { monthly_report:false,
      annual_report:false, pptx:false, advanced_indicators:false, archive:false, custom_templates:false,
      national_stats:false, data_export:false }. Tagline : « L'essentiel pour structurer le suivi de
      votre Direction ».
   b) PROFESSIONNEL — 15 000 FCFA/mois — max_users 15 — storage_gb 5 — features : tout true sauf
      custom_templates:false, national_stats:false, data_export:false. Tagline : « Le reporting complet
      Word + PowerPoint, mois par mois ». Mis en avant (ordre 2, badge populaire).
   c) INSTITUTIONNEL — 25 000 FCFA/mois — max_users NULL (illimité) — storage_gb 20 — features : tout
      true. Tagline : « La puissance maximale, documents à vos couleurs et carte nationale ».
2. CATÉGORIES + TYPES (PRD §13) : Solidarité (Action de solidarité, Assistance, Appui matériel,
   Appui financier, Distribution, Aide aux personnes vulnérables) ; Cohésion sociale (Sensibilisation,
   Formation, Dialogue, Sport, Activité communautaire, Activité culturelle, Promotion de la paix,
   Vivre-ensemble) ; Visites de compassion (Visite, Assistance, Accompagnement) ; Alerte précoce
   (Alerte, Vérification, Suivi, Intervention) ; Autres (Réunion, Cérémonie, Mission, Atelier,
   Supervision, Journée internationale/nationale). Couleur par catégorie (orange, vert, bleu, rouge,
   slate).
3. RÉGIONS DE CÔTE D'IVOIRE : les 31 régions + 2 districts autonomes (District d'Abidjan, District de
   Yamoussoukro, Agnéby-Tiassa, Bafing, Bagoué, Béré, Bounkani, Cavally, Folon, Gbêkê, Gbôklé, Gôh,
   Gontougo, Grands-Ponts, Guémon, Hambol, Haut-Sassandra, Iffou, Indénié-Djuablin, Kabadougou, La Mé,
   Lôh-Djiboua, Marahoué, Moronou, N'Zi, Nawa, Poro, San-Pédro, Sud-Comoé, Tchologo, Tonkpi,
   Worodougou). Départements : table prête + quelques exemples (Abidjan, Bouaké, Daloa, Korhogo,
   San-Pédro, Yamoussoukro, Man, Gagnoa, Soubré, Abengourou) — le reste administrable par les orgs.
4. TYPES D'INCIDENTS : Conflit communautaire, Catastrophe naturelle, Incendie, Inondation, Épidémie,
   Accident, Tension sociale, Autre.
5. INDICATEURS GLOBAUX de départ : Nombre d'activités réalisées ; Nombre de bénéficiaires directs ;
   Nombre de femmes bénéficiaires ; Nombre de personnes vulnérables assistées ; Nombre de sessions de
   sensibilisation ; Nombre d'alertes traitées ; Taux de résolution des incidents.
6. admin_settings : 1 ligne (whatsapp « 2250576103277 », email « omouitsi@gmail.com »).
7. SUPER ADMIN : instructions claires dans le README + script seed : je crée l'utilisateur
   omouitsi@gmail.com via Supabase Auth (dashboard), puis UPDATE profiles SET is_super_admin=true où
   le trigger de création de profile (à ajouter : trigger on auth.users insert → insert into profiles)
   a déjà créé la ligne. Fournis le trigger handle_new_user.
8. DONNÉES DÉMO (optionnelles, flag SEED_DEMO) : 1 organisation de démonstration « DR DÉMO Abidjan »,
   plan Professionnel, 2 utilisateurs, 8 activités variées sur T1/T2, incidents, plan annuel — pour
   tester les écrans. Documenter comment les purger.

CRITÈRES : seed rejouable sans doublon ; vérifications SQL fournies (compte des plans = 3, régions
≥ 33, catégories = 5) ; trigger handle_new_user fonctionnel.
```

---

## 📋 PROMPT 4 — Landing page (marketing + tarifs)

```text
TÂCHE : Construire la landing page publique e-OSCS à la racine « / » (route group (marketing)).
Objectif : conversion — amener un DR/DD à cliquer « Demander un abonnement ». Design institutionnel
haut de gamme, sobre, rapide, 100 % français, sans image externe : utiliser des compositions CSS/SVG
inline (dégradés orange/vert, motifs géométriques discrets) et des maquettes d'interface construites
en composants React (fausses cartes KPI, faux tableau) pour les aperçus.

SECTIONS (dans l'ordre) :
1. Header sticky : logo e-OSCS (lettre « e » dans un carré arrondi orange→vert + « e-OSCS »), nav
   ancres (Fonctionnalités, Reporting, Tarifs, FAQ, Contact), bouton CTA « Demander un abonnement »
   (orange) + « Se connecter » (ghost → /connexion).
2. Hero : badge « Plateforme officielle de suivi — Solidarité • Cohésion sociale • Alerte précoce »,
   titre H1 : « Pilotez les activités de votre Direction, du plan annuel au rapport annuel »,
   sous-titre : « e-OSCS centralise la planification, la saisie, la validation et génère
   automatiquement vos rapports administratifs Word et PowerPoint. Une donnée saisie une seule fois,
   exploitée à tous les niveaux. » ; 2 CTA (Demander un abonnement / Découvrir les fonctionnalités) ;
   visuel : maquette de tableau de bord en composants React dans un cadre navigateur stylisé
   (KPI + graphique en barres construits en CSS, pas d'image).
3. Bandeau de confiance : « Conçu pour les Directions Régionales et Départementales du MCNSLP » +
   4 mini-stats « 1 seule saisie », « 3 niveaux de reporting », « Word + PowerPoint automatiques »,
   « Données 100 % isolées par Direction ».
4. Problèmes résolus (3 cartes avec icônes lucide) : saisie dispersée (Excel/papier), compilation
   manuelle des rapports chronophage, aucune vision prévision vs réalisation.
5. Fonctionnalités clés (grille 2×3) : Plan annuel structuré ; Saisie guidée des activités ; Circuit
   de validation ; Indicateurs & bénéficiaires ; Rapports Word/PPT automatiques (mensuel, trimestriel,
   annuel) ; Alertes & incidents (faits majeurs). Chaque carte : icône, titre, 2 phrases simples.
6. Aperçu du reporting : onglets Mensuel / Trimestriel / Annuel montrant chacun une maquette
   (composants React) du dashboard correspondant + liste des livrables (DOCX, PPTX).
7. Comment ça marche (4 étapes numérotées) : 1) Vous demandez un abonnement en ligne ; 2) Nous vous
   contactons (appel/WhatsApp) pour valider ; 3) Paiement simple par Mobile Money ; 4) Votre espace
   est activé sous 24 h avec un code d'activation. Mention claire : « Aucun paiement en ligne. »
8. TARIFS : 3 cartes lues DEPUIS la table subscription_plans (server component, avec revalidate 3600 ;
   fallback statique si DB indisponible) selon la matrice tarifaire de mon dossier : ESSENTIEL 10 000
   FCFA/mois ; PROFESSIONNEL 15 000 FCFA/mois (mise en avant « Le plus choisi », bordure orange,
   légèrement agrandie) ; INSTITUTIONNEL 25 000 FCFA/mois. Chaque carte : nom, prix « 10 000 FCFA » +
   « /mois », tagline, liste à puces des fonctionnalités (coches vertes / croix grises), bouton
   « Demander cette formule » → /demande?plan=CODE. Note sous les cartes : « Paiement par Mobile
   Money après validation de votre demande — aucun prélèvement automatique. Résiliable à tout moment. »
9. FAQ (accordion) : 6 questions (paiement, délai d'activation, nombre d'utilisateurs, sécurité et
   isolation des données, résiliation, besoin d'Internet/compétences).
10. Bloc contact final : fond dégradé orange/vert, « Une question ? Parlons-en », boutons WhatsApp
    (wa.me/2250576103277 avec message pré-rempli « Bonjour, je souhaite des informations sur e-OSCS »)
    et Email (omouitsi@gmail.com), icônes, mention « Réponse sous 24 h ouvrées ».
11. Footer : logo, description courte, liens (Fonctionnalités, Tarifs, FAQ, Conditions d'utilisation,
    Politique de confidentialité), contact, © 2026 e-OSCS — MCNSLP. Pages /conditions et
    /confidentialite : contenu juridique simple et clair (pas de collecte bancaire, données hébergées
    de façon sécurisée, propriété des données = la Direction).

QUALITÉ : responsive parfait (mobile d'abord), ancres fluides, balises sémantiques + meta OG,
performances (pas de librairie lourde), accessibilité (contrastes, focus visibles, aria-labels sur
icônes-boutons). Commit « feat: landing page publique avec tarifs ».

CRITÈRES : les 3 prix s'affichent correctement formatés (10 000 / 15 000 / 25 000 FCFA) ; les CTA
mènent à /demande?plan= ; build vert ; aperçu mobile propre.
```

---

## 📋 PROMPT 5 — Formulaire public de demande d'abonnement

```text
TÂCHE : Créer le parcours /demande (formulaire multi-étapes) + page /demande/merci.
Pré-remplissage : ?plan=CODE sélectionne la formule à l'étape finale (récap).

STEPPER 3 ÉTAPES (react-hook-form + zod, validation à chaque étape, barre de progression) :
Étape 1 « Vous et votre Direction » : nom complet*, fonction*, type de Direction* (DR/DD radio
cartes), nom de la Direction*, région* (select des 33 entrées seed), département.
Étape 2 « Vos coordonnées » : téléphone*, WhatsApp*, email* (format), confirmation email.
Étape 3 « Votre besoin » : taille de l'équipe (select 1–5 / 6–15 / 16–30 / 30+), formule souhaitée
(cartes radio des 3 plans avec prix 10 000 / 15 000 / 25 000 FCFA/mois lus en DB), besoin en quelques
mots* (textarea, placeholder exemple concret), case « J'accepte d'être contacté par l'équipe e-OSCS »*.
Anti-spam : champ honeypot invisible + délai minimum de remplissage 4 s.

SOUMISSION : Server Action submitSubscriptionRequest → validation zod serveur → INSERT dans
subscription_requests (statut NOUVELLE, historique_statuts initialisé) → revalidatePath /admin/
demandes → redirection /demande/merci?plan=XX&nom=YY (state en query, rien de sensible).

PAGE MERCI : icône succès verte, récapitulatif (formule, prix), prochaines étapes numérotées
(1. Notre équipe vous contacte sous 24 h ouvrées ; 2. Paiement Mobile Money ; 3. Réception de votre
code d'activation ; 4. Accès à votre espace), bouton WhatsApp pré-rempli « Bonjour, je viens de faire
une demande d'abonnement e-OSCS (Formule X). Mon nom : ... » (wa.me/2250576103277), lien retour
accueil. Message chaleureux et rassurant.

ERGONOMIE : messages d'erreur sous chaque champ, simples et orientés solution (« Veuillez saisir un
numéro à 10 chiffres, ex : 07 00 00 00 00 ») ; sauvegarde du brouillon en localStorage (reprise si
fermeture) ; total responsive ; indication « Étape X sur 3 ».

CRITÈRES : insertion visible côté Supabase ; rôle anon peut insérer mais pas lire (RLS) ; double soumission
impossible (bouton désactivé pendant l'envoi) ; aucun état d'erreur non géré ; commit « feat: formulaire
de demande d'abonnement ».
```

---

## 📋 PROMPT 6 — Authentification (connexion, mot de passe, gardes de routes)

```text
TÂCHE : Mettre en place Supabase Auth (email/mot de passe) et toutes les gardes.

PAGES (route group (auth), layout centré sobre avec logo et fond motif doux) :
1. /connexion : email + mot de passe, « Se souvenir de moi », lien « Mot de passe oublié ? », erreurs
   en français clair (« Email ou mot de passe incorrect. Réessayez ou réinitialisez votre mot de
   passe. »), état de chargement. Après connexion : redirection selon rôle → SUPER_ADMIN : /admin ;
   autres : /app. Si compte inactif : message dédié.
2. /mot-de-passe-oublie : email → resetPasswordForEmail (redirectTo /reinitialiser) ; écran neutre
   « Si un compte existe, un email a été envoyé » (anti-énumération).
3. /reinitialiser : updateUser nouveau mot de passe + confirmation + règles (min 8 caractères, 1
   chiffre) ; succès → /connexion.

MIDDLEWARE + GARDES SERVEUR (layout.tsx des groupes, pas que middleware) :
- /admin/** : exige is_super_admin() sinon redirection /connexion puis /app (403 page sobre si
  connecté non admin).
- /app/** : exige un profile actif avec organization ; contrôle abonnement : charger l'abonnement
  courant de l'org ; si EXPIRE/SUSPENDU/RESILIE → écran plein page « Abonnement suspendu/expiré » :
  message rassurant, date d'expiration, bouton WhatsApp renouvellement (wa.me pré-rempli avec nom de
  Direction) + email ; seule déconnexion possible. Si EXPIRANT_BIENTOT (≤ 30 j) : bandeau orange
  persistant en haut de /app « Votre abonnement expire le JJ mois AAAA — Renouveler » (lien WhatsApp).
- / : publique.

SESSION : helpers getUser(), getProfile() (cache React), signOut avec menu utilisateur (avatar,
initiales, nom, rôle, « Se déconnecter »). Types générés dans types/database.ts (supabase gen types
si dispo, sinon types manuels propres).

SÉCURITÉ : rate limiting basique côté action de connexion (compteur en mémoire + délai) ; aucune clé
service ; messages neutres anti-énumération.

CRITÈRES : parcours complet testé avec un compte créé dans Supabase ; un utilisateur d'org ne peut
pas atteindre /admin ; suspension org → écran blocage ; rafraîchissement de session OK après 1 h ;
commit « feat: authentification et gardes de routes ».
```

---

## 📋 PROMPT 7 — Activation du compte par code (parcours client post-paiement)

```text
TÂCHE : Construire le flux d'activation : le client a payé → le Super Admin génère un code
(prompt 11) → le client active son compte sans aide.

PAGE /activation (publique mais guidée) en 3 étapes :
1. « Votre code d'activation » : champ unique formaté EOSCS-XXXX-XXXX (auto-MAJ, tirets auto),
   vérification via RPC SECURITY DEFINER verify_activation_code(code) qui retourne { valide, nom_org,
   formule, email_attendu } sans exposer plus. Erreurs claires : code inexistant / déjà utilisé /
   expiré → « Contactez-nous sur WhatsApp » avec lien.
2. « Vos identifiants » : si l'email du propriétaire n'a pas encore de compte Auth : formulaire email
   (pré-rempli, readonly si transmis par le code), mot de passe + confirmation (règles affichées) →
   Server Action activateAccount : vérifie code à nouveau côté serveur, crée l'utilisateur (admin
   API auth.admin.createUser, email_confirm:true) OU rattache l'utilisateur existant ; insère/maj
   profiles (organization_id du code, org_role PROPRIETAIRE, actif) ; marque le code utilise=true,
   utilise_le ; crée subscription ACTIF (date_debut=now, date_fin=+duree_mois) si pas déjà créée ;
   audit_log « ACTIVATION_COMPTE ». Atomic : tout en une transaction RPC plpgsql
   activate_account(p_code, p_user_id) côté DB pour éviter les états incohérents.
3. « Bienvenue » : message de succès personnalisé (nom Direction + formule + date de fin), checklist
   de démarrage « 3 premières actions » (compléter le profil de la Direction, inviter vos
   collaborateurs, créer votre plan annuel) + bouton « Accéder à mon espace » → connexion puis /app.
   Bouton WhatsApp aide.

ONBOARDING /app/bienvenue (au premier login du PROPRIETAIRE, wizard 3 écrans persisté via
organizations.onboarding_completed bool) : 1) Profil de la Direction (nom, type, région, département,
téléphone, logo optionnel vers Storage attachments/public-logo) ; 2) Année en cours → création du
plan annuel vide guidé (renvoi vers /app/plan) ; 3) Invitation du 1er collaborateur (renvoi vers
/app/equipe). Possibilité « Passer » à chaque écran. Confettis discrets ou animation sobre de succès.

CRITÈRES : un code ne peut servir qu'une fois même en double-clic ; compte activé = PROPRIETAIRE de
la bonne org (vérification SQL fournie) ; parcours faisable par un débutant en < 3 min ; aucune clé
service exposée (vérifier réseau) ; commit « feat: activation par code et onboarding ».
```

---

## 📋 PROMPT 8 — Cockpit Super Admin : layout + tableau de bord

```text
TÂCHE : Construire /admin (garde is_super_admin posée au prompt 6) : layout admin + tableau de bord SaaS.

LAYOUT : sidebar sombre (slate-900) : logo e-OSCS + badge « Super Admin » ; menu : Tableau de bord,
Demandes (badge compteur NOUVELLE), Organisations, Abonnements, Codes d'activation, Plans & tarifs,
Statistiques, Journal d'audit, Paramètres. Icônes lucide, état actif orange, sidebar repliable sur
mobile (sheet). Topbar : recherche globale (placeholder, branchée plus tard), menu utilisateur,
bouton « Voir le site ».

TABLEAU DE BORD /admin :
1. Ligne KPI (8 cartes, 4×2) : Organisations totales ; Abonnements ACTIFS ; Expirent ≤ 30 j ;
   EXPIRÉS ; SUSPENDUS ; Nouvelles demandes ; En attente de paiement ; Utilisateurs totaux. Chaque
   carte cliquable → liste filtrée correspondante.
2. Carte « Revenu mensuel indicatif » : somme des prix mensuels des abonnements ACTIF + 
   EXPIRANT_BIENTOT (formatée FCFA), avec sous-texte « indicatif — paiements hors plateforme ».
3. Graphique (Recharts) « Évolution des organisations actives » : 12 derniers mois (courbe verte,
   area).
4. Deux colonnes : « Demandes récentes » (5 dernières, statut badge coloré, lien traiter) et
   « Activité récente » (10 derniers audit_logs plateforme : icône par type, texte naturel « X a
   suspendu l'organisation Y », date relative « il y a 2 h »).
5. Bloc « Alertes & anomalies » : codes d'activation expirés non utilisés ; abonnements expirés depuis
   > 7 j non renouvelés ; orgs sans utilisateur actif ; demandes sans nouvelle > 7 j. Ligne orange
   avec bouton d'action direct.
6. Filtre global de période (7 j / 30 j / 12 mois) affectant cartes 2-3.

DONNÉES : requêtes server components via service role admin (justifié : super admin) OU RPC
security definer admin_dashboard_stats() — privilégier des vues SQL dédiées (CREATE VIEW
admin_kpis...) documentées. Aucun N+1.

CRITÈRES : chiffres cohérents avec les données seed/démo ; tout cliquable mène à la bonne liste
filtrée ; chargement avec skeletons ; commit « feat: cockpit super admin et tableau de bord ».
```

---

## 📋 PROMPT 9 — Gestion des demandes d'abonnement (pipeline commercial)

```text
TÂCHE : Construire /admin/demandes — le pipeline de traitement des demandes landing.

LISTE : onglets compteurs par statut (Nouvelles / En contact / Attente paiement / Payées / Refusées /
Clôturées / Toutes) ; table : date, nom, Direction (type+région), formule (badge prix), WhatsApp,
statut ; recherche (nom, direction, téléphone) ; filtre période ; tri date desc. Badges couleur :
NOUVELLE orange, EN_CONTACT bleu, EN_ATTENTE_PAIEMENT violet, PAYEE vert, REFUSEE rouge, CLOTUREE slate.

DÉTAIL (sheet latéral droit, large) : toutes les infos du formulaire mises en page ; timeline
verticale de l'historique des statuts (qui, quand, de → vers) depuis historique_statuts jsonb ;
champ « Notes internes » (textarea autosave).

ACTIONS (Server Actions, chaque changement = maj statut + push dans historique_statuts + audit_log) :
- « Marquer En contact » ; « Marquer En attente de paiement » ; « Refuser » (dialog avec motif
  obligatoire) ; « Clôturer ».
- Bouton WhatsApp (wa.me/{whatsapp}?texte pré-rempli « Bonjour {nom}, je suis {X} de la plateforme
  e-OSCS, suite à votre demande d'abonnement pour {direction} (formule {plan})… ») + bouton Appeler
  (tel:) + copier l'email.
- ACTION PRINCIPALE « Confirmer le paiement et activer » (visible statut EN_ATTENTE_PAIEMENT ou
  EN_CONTACT) : dialog récapitulatif → choisir/compléter : formule (plan), durée (1/3/6/12 mois),
  montant reçu (FCFA, pré-rempli prix × durée), référence paiement Mobile Money (texte libre, ex :
  « OM/MTN/Moov + n° transaction »), date de confirmation. Validation → une transaction RPC
  admin_activate_request(p_request_id, p_plan_id, p_duree, p_montant, p_reference) :
  1) crée l'organization (nom=direction, type, region, departement) ;
  2) crée l'abonnement ACTIF (date_fin = now + durée) ;
  3) génère le code d'activation (format EOSCS-XXXX-XXXX, caractères sans ambiguïté, unique) lié à
     l'org + plan + email du demandeur ;
  4) passe la demande à PAYEE ; 5) audit_log complet. Retour : le code en clair + message WhatsApp
  pré-rempli contenant le code et le lien /activation (bouton « Envoyer les identifiants par
  WhatsApp »). Gestion d'erreurs transactionnelle propre (tout ou rien).

CRITÈRES : cycle complet NOUVELLE → … → PAYEE testable ; un code unique généré par activation ;
timeline exacte ; compteurs des onglets exacts ; commit « feat: pipeline de demandes d'abonnement ».
```

---

## 📋 PROMPT 10 — Organisations & abonnements (admin)

```text
TÂCHE : Construire /admin/organisations et /admin/abonnements.

PAGE ORGANISATIONS : table (logo/initiales, nom, type DR/DD, région, département, nb utilisateurs
actifs, plan actuel + prix, statut abonnement badge, date fin, créée le) ; recherche ; filtres statut
abonnement + type + région ; tri. Création manuelle possible (« + Nouvelle organisation » : dialog —
cas du client contacté directement par téléphone, on crée org + abonnement + code d'un coup, même RPC
que prompt 9 factorisé).

DÉTAIL ORGANISATION /admin/organisations/[id] :
- En-tête : identité + statut + propriétaire (nom, email, téléphone, dernier login) ; actions :
  Suspendre / Réactiver / Renouveler / Modifier / Voir le journal d'audit filtré.
- Onglets : « Vue d'ensemble » (stats internes readonly : nb activités, nb rapports, stockage
  utilisé, dernière activité) ; « Utilisateurs » (liste readonly + bouton « Réinitialiser l'accès »
  par utilisateur → envoi email de reset Supabase ; « Désigner nouveau propriétaire ») ;
  « Abonnements » (historique complet table : plan, dates, montant, référence, statut, confirmé par) ;
  « Notes » (notes internes datées).
- ACTIONS avec dialogs de confirmation et motifs : SUSPENDRE (motif obligatoire → statut SUSPENDU,
  effet immédiat : l'org voit l'écran de blocage du prompt 6 ; notification créée) ; RÉACTIVER ;
  RENOUVELER (dialog : durée, plan possible modifié, montant, référence → prolonge date_fin depuis
  max(now, date_fin actuelle), statut ACTIF, audit) ; CORRIGER UNE DATE DE FIN (dialog expert avec
  avertissement). Chaque action → audit_log détaillé (avant/après jsonb).

PAGE ABONNEMENTS /admin/abonnements : vue transverse : table de tous les abonnements avec mêmes
filtres + « Expirent bientôt » pré-filtrable + export CSV (côté client à partir des données chargées,
respect des filtres). Rappel automatique : fonction SQL mark_expiring_subscriptions() (EXPIRANT_BIENTOT
si ≤ 30 j ; EXPIRE si date_fin < now) appelée au chargement du layout admin + documenter l'appel
quotidien via Supabase cron (pg_cron) — fournir le SQL du cron prêt à coller.

CRITÈRES : suspension visible instantanément côté client ; renouvellement calcule la bonne date ;
historique conservé (nouveau row par renouvellement) ; CSV propre ; commit « feat: gestion
organisations et abonnements admin ».
```

---

## 📋 PROMPT 11 — Codes d'activation + administration des plans tarifaires

```text
TÂCHE : Construire /admin/codes et /admin/plans.

PAGE CODES D'ACTIVATION :
- En-tête : bouton « + Générer un code » (dialog : organisation (select), formule, durée, email
  propriétaire, expiration du code 7/15/30 j → insert activation_codes, code affiché UNE FOIS en
  grand avec bouton copier + message WhatsApp pré-rempli prêt à envoyer).
- Table : code (masqué partiellement EOSCS-••••-3F9K sauf survol/copie), organisation, formule,
  email, statut calculé (Actif / Utilisé / Expiré) badge, expire le, créé le, utilisé le. Filtres
  statut, recherche. Actions : Révoquer (dialog confirmation ; si utilisé → impossible, message
  explicite), Régénérer pour la même org (nouveau code, ancien révoqué), Copier le message WhatsApp.
- Statistiques haut de page : codes actifs, utilisés ce mois, expirés non utilisés.

PAGE PLANS & TARIFS /admin/plans :
- Les 3 plans seed affichés en cartes (nom, prix FCFA/mois éditable, utilisateurs max, stockage,
  liste des fonctionnalités avec interrupteurs). Édition → dialog formulaire (prix, max_users
  « illimité » = toggle, storage_gb, features booléens, tagline, ordre d'affichage, actif oui/non).
- Avertissement clair : « Ces modifications s'appliquent immédiatement à la page tarifs publique et
  aux limitations des comptes. Ne modifiez les prix qu'en accord avec votre politique commerciale. »
- Aperçu en direct du rendu de la carte publique (composant partagé avec la landing).
- Possibilité d'ajouter un plan promotionnel (ex : offre lancement) avec date de visibilité.

RAPPEL FONCTIONNEL (implémenter le garde-fou côté app et DB) : les limites du plan (max utilisateurs,
stockage, fonctionnalités) sont lues depuis subscription_plans à CHAQUE usage côté serveur (helper
lib/plan-gates.ts : canAddUser(org), canUseFeature(org, 'pptx'), etc.) — ne jamais figer dans le
client.

CRITÈRES : modifier le prix d'un plan met à jour la landing (après revalidate) ; codes révoqués
inutilisables à /activation ; commit « feat: codes d'activation et administration des plans ».
```

---

## 📋 PROMPT 12 — Paramètres Super Admin + journal d'audit + statistiques SaaS

```text
TÂCHE : Trois pages admin de gouvernance.

1. /admin/parametres :
   - Carte « Coordonnées commerciales » : WhatsApp et Email affichés sur la landing et les écrans
     d'aide — formulaire edit admin_settings (validation format). Note : « Ces coordonnées apparaissent
     dans tous les parcours client (contact, renouvellement, activation). Valeurs par défaut :
     +225 0576103277 / omouitsi@gmail.com. »
   - Carte « Textes de la page d'accueil » : slogan, message WhatsApp pré-rempli par défaut (champs
     textes simples, stockés jsonb dans admin_settings.textes, lus par la landing).
   - Carte « Sécurité » : durée de validité par défaut des codes, rappel des bonnes pratiques (lien
     README sécurité), info dernière mutation admin.
   - Carte « Compte » : mon profil super admin (nom, email), changer mon mot de passe.

2. /admin/audit : journal d'audit plateforme. Table : date/heure, utilisateur (nom + email),
   organisation, action (badge : CREATION/MODIFICATION/SUPPRESSION/STATUT/ACTIVATION/SUSPENSION/
   RENOUVELLEMENT/CONNEXION/RAPPORT), objet, détail. Filtres combinables : période, organisation,
   utilisateur, type d'action, recherche. Détail : dialog montrant ancienne → nouvelle valeur en
   diff jsonb lisible (clé: valeur, rouge/vert). Export CSV filtré. Pagination serveur (50/page).

3. /admin/statistiques : statistiques SaaS : entonnoir de conversion (Demandes → En contact →
   Attente paiement → Payées/Actives) en funnel Recharts ; abonnements par plan (donut) ; revenus
   mensuels indicatifs sur 12 mois (barres) ; taux de renouvellement ; top 5 organisations par nombre
   d'activités ; répartition géographique des orgs par région (barres horizontales). Filtre période.

QUALITÉ : vues/SQL dédiés pour agrégats ; skeletons ; zéro donnée sensible inutile affichée (pas de
références de paiement complètes dans les listes — masquage partiel).

CRITÈRES : modifier WhatsApp dans paramètres change bien les liens wa.me de la landing ; audit
couvre les actions des prompts 8–11 ; commit « feat: paramètres, audit et statistiques super admin ».
```

---

## 📋 PROMPT 13 — Espace Direction : layout + tableau de bord

```text
TÂCHE : Construire /app — l'espace de travail d'une Direction (garde : profile actif + abonnement
valide du prompt 6).

LAYOUT : thème clair. Sidebar gauche (blanche, bordure, icônes lucide) : Tableau de bord, Plan
annuel, Activités (badge = nb SOUMIS pour validateurs), Validation (visible PROPRIETAIRE),
Indicateurs, Incidents, Rapports, Équipe (PROPRIETAIRE), Référentiels (PROPRIETAIRE), Paramètres.
Topbar : sélecteur d'année (défaut année courante, pilote tout l'espace), nom de la Direction,
bouton notifications (cloche + dot), menu utilisateur. Bandeau abonnement (prompt 6) si
EXPIRANT_BIENTOT. Fil d'Ariane simple. 100 % français, libellés grand public.

TABLEAU DE BORD /app :
1. Carte de bienvenue : « Bonjour {prénom} » + date du jour en français + phrase d'état (« 3 activités
   en attente de validation »).
2. KPIs (année sélectionnée) : Activités réalisées (validées) ; En attente de validation ;
   Brouillons ; Bénéficiaires cumulés ; Taux de réalisation du plan annuel (%) ; Incidents en cours.
   Cliquables → listes filtrées.
3. Graphiques (Recharts) : « Activités par mois » (barres vertes, prévu vs réalisé superposé) ;
   « Répartition par catégorie » (donut aux couleurs des catégories) ; « Bénéficiaires par trimestre »
   (barres T1–T4).
4. Deux colonnes : « À faire » (brouillons à terminer, activités à valider pour PROPRIETAIRE, données
   incomplètes signalées, échéance de clôture proche) ; « Dernières activités » (5 dernières avec
   statut badge, date, lieu).
5. Bloc « Rapports » : prochains rapports (trimestre en cours), bouton direct vers /app/rapports.

DONNÉES : vues SQL par org : v_org_stats_annuelles(organization_id, annee) etc. Tout passe par RLS
(aucun filtre org côté client). États vides chaleureux avec action (« Aucune activité pour T2 —
Saisir une activité »).

CRITÈRES : un LECTEUR voit tout en lecture sans boutons d'action ; les chiffres changent quand on
change d'année ; chaque KPI mène à la bonne liste ; commit « feat: espace direction et tableau de
bord ».
```

---

## 📋 PROMPT 14 — Gestion de l'équipe (collaborateurs)

```text
TÂCHE : Construire /app/equipe (PROPRIETAIRE uniquement pour les actions ; visible LECTEUR en lecture).

LISTE : table membres (avatar initiales, nom, email, téléphone, rôle badge — Propriétaire / Agent /
Consultation, statut Actif/Inactif, dernière connexion, activités saisies). Recherche + filtre rôle.

INVITER : bouton « + Inviter un collaborateur » : dialog (nom complet, email, téléphone, rôle AGENT
ou LECTEUR, structure). Garde plan : si max_users atteint → dialog pédagogique « Votre formule
ESSENTIEL permet 5 utilisateurs. Passez à PROFESSIONNEL (15 000 FCFA/mois, 15 utilisateurs) » +
bouton WhatsApp upgrade. Server Action inviteMember : crée l'utilisateur Auth (inviteUserByEmail ou
createUser + email reset), profile org lié, rôle, notification de bienvenue ; audit.

ACTIONS LIGNE (menu ⋯) : Modifier le rôle (avec avertissement si rétrogradation PROPRIETAIRE — il
doit toujours rester ≥ 1 propriétaire actif) ; Modifier les infos ; Désactiver / Réactiver (compte
conservé, historique conservé ; un inactif ne peut plus se connecter — géré à la connexion) ;
Réinitialiser l'accès (envoi email reset) ; Réaffecter ses activités (si désactivation avec
brouillons : dialog choix du repreneur).

PAGE DÉTAIL MEMBRE /app/equipe/[id] : infos ; ses indicateurs (activités saisies, validées,
brouillons) ; sa liste d'activités ; historique de ses changements de rôle (audit filtré).

SÉCURITÉ : RLS + vérifications serveur (un PROPRIETAIRE ne gère que SON org ; jamais soi-même en
dernier propriétaire). Messages d'erreur pédagogiques.

CRITÈRES : la limite de plan bloque réellement (tester en réduisant max_users) ; un désactivé ne peut
plus se connecter ; commit « feat: gestion des collaborateurs ».
```

---

## 📋 PROMPT 15 — Référentiels de la Direction

```text
TÂCHE : Construire /app/referentiels (PROPRIETAIRE ; lecture pour tous). Onglets :

1. « Catégories & types » : lecture des catégories globales (Solidarité, Cohésion sociale,
   Visites de compassion, Alerte précoce, Autres) + possibilité d'ajouter des TYPES personnalisés à
   son org (activity_types.organization_id nullable : null=global) ; activer/désactiver au niveau org.
2. « Structures / services » : CRUD simple (nom, description, responsable optionnel).
3. « Acteurs & partenaires » : répertoire (nom, type INTERNE/PARTENAIRE, contact) — alimente
   l'autocomplétion du module Activités ; fusion de doublons (dialog).
4. « Indicateurs » : CRUD indicateurs de l'org (nom, unité ex « personnes », « séances », type
   QUANTITATIF/QUALITATIF, axe stratégique lié, catégorie liée) + consultation des indicateurs
   globaux (non modifiables, marqués « Référentiel national »).
5. « Périodes » : vue de l'année : grille 12 mois + 4 trimestres avec statut (Ouvert/Clôturé),
   renvoyant à la clôture (construite au prompt 19). Ici : lecture + info.

PATTERNS UI : tables inline-éditables où pertinent (édition en ligne avec coche/annuler), toasts de
succès (« Indicateur ajouté »), suppressions avec dialog de prudence (« utilisé par X activités —
désactivation proposée à la place »), états vides illustrés avec bouton d'action.

RÈGLES : noms uniques par org (contrainte unique composite + message « Ce nom existe déjà dans vos
référentiels ») ; pas de suppression d'un élément référencé (erreur explicite) ; audit des
modifications.

CRITÈRES : un type personnalisé apparaît dans le formulaire d'activité ; référentiels isolés par org
(deux orgs ne se voient pas) ; commit « feat: référentiels de la direction ».
```

---

## 📋 PROMPT 16 — Plan annuel

```text
TÂCHE : Construire /app/plan — la planification annuelle structurée.

VUE : sélecteur d'année (topbar) ; si aucun plan pour l'année → écran vide guidé « Créer le plan
{année} » (bouton « Créer un plan vierge » ou « Dupliquer le plan {année-1} » si existant — la
duplication copie les lignes en statuts neufs).

STRUCTURE VISUELLE : tableau hiérarchique groupé par AXE STRATÉGIQUE (en-têtes de section colorés,
pliables) : colonnes Objectif | Activité prévue | Indicateur | Cible | Responsable | Période (badge
T1/T2/T3/T4/Mois/Annuelle) | Budget (FCFA, optionnel) | Réalisé (compteur auto d'activités validées
liées + puce de statut : réalisé/partiel/non réalisé) | Actions (⋯). Pied de groupe : bouton
« + Ajouter une ligne ».

ÉDITION : dialog (ou panneau latéral) complet : axe stratégique (input avec autocomplétion des axes
existants), objectif, activité prévue, indicateur (select référentiel ou texte libre), cible
(quantitative nombre ou qualitative texte — bascule), responsable (select membres), période prévue
(select T1..T4 / mois / annuelle), budget (FCFA formaté), observations. Validation zod : cible
cohérente avec type d'indicateur.

FONCTIONS : recherche dans le plan ; filtre par période/axe/statut de réalisation ; résumé haut de
page (NB d'activités prévues, réalisées, taux %) ; vue impression propre (mode clair, logo,
landscape) ; clôture de l'année : si toutes les périodes sont clôturées, plan verrouillé en lecture
(badge « Année clôturée ») sauf réouverture autorisée.

DONNÉES : le compteur « Réalisé » doit être calculé par vue SQL (count activities liées VALIDE) —
pas de requête N+1 ; tout scoped RLS org.

CRITÈRES : duplication d'année fonctionnelle ; liaison activité ↔ plan reflétée en temps réel après
validation (revalidatePath) ; impression propre ; commit « feat: module plan annuel ».
```

---

## 📋 PROMPT 17 — Module Activités : liste + saisie guidée (cœur du produit)

```text
TÂCHE : Construire /app/activites — la plus importante page métier. Rigueur maximale exigée.

LISTE /app/activites :
- Toolbar : recherche (intitulé, référence, lieu) ; filtres : statut (chips multi), catégorie, type,
  mois, trimestre, structure, « Non prévues au plan » ; sélecteur de vue (table/cartes) ; bouton
  « + Nouvelle activité » (masqué pour LECTEUR) ; export CSV des lignes filtrées (INSTITUTIONNEL :
  feature data_export ; sinon masqué).
- Table : référence, date (format fr), intitulé (2 lignes max), catégorie badge couleur, lieu
  (région/département), bénéficiaires total, statut badge (BROUILLON slate, SOUMIS bleu,
  EN_VERIFICATION violet, VALIDE vert, REJETE rouge avec motif en tooltip, CONSOLIDE dark),
  responsable. Tri date desc. Pagination serveur 20.
- Mini-stat bande au-dessus (contexte filtres) : total, validés, en attente, bénéficiaires.

FICHE /app/activites/[id] : en-tête (référence, statut, timeline du workflow : chips
Brouillon→Soumis→Vérification→Validé→Consolidé avec dates) ; sections en accordéons : Informations,
Acteurs & partenaires, Résultats, Bénéficiaires (tableau ventilation + total), Indicateurs, Photos
(grille avec légendes) & Pièces jointes (liste téléchargeable), Historique (audit filtré). Actions
selon rôle/statut : Modifier (BROUILLON/REJETE/CORRECTION, auteur ou PROPRIETAIRE), Soumettre,
Supprimer (brouillon), Dupliquer, Imprimer la fiche.

SAISIE /app/activites/nouveau — WIZARD 5 ÉTAPES (stepper en haut, « Étape X/5 », précédent/suivant,
SAUVEGARDE BROUILLON AUTOMATIQUE à chaque étape (debounced) + indicateur « Brouillon enregistré
il y a X s » ; reprise d'un brouillon existant) :
É1 « Informations générales » : date* (calendar fr ; mois+trimestre calculés AFFICHÉS en badge auto
ex « Août • T3 »), région* / département* / sous-préfecture ou localité (selects chaînés depuis
référentiels), catégorie* puis type* (dépendants), intitulé* (exemple en placeholder), objectif,
description ; rattachement : radio « Activité du plan {année} » (select des plan_activities non
clôturées, rechercable) / « Activité supplémentaire (non prévue) » — info pédagogique « Elle sera
comptabilisée en plus du plan ».
É2 « Acteurs & partenaires » : structure responsable* (select référentiel), responsable(s)*
(multi-select membres + texte libre), acteurs/partenaires : liste dynamique (autocomplétion
répertoire + ajout à la volée « Créer l'acteur … »).
É3 « Résultats & analyse » : résultats obtenus* (textarea guidé avec exemple), observations,
difficultés rencontrées, recommandations, perspectives (chacun avec placeholder concret).
É4 « Bénéficiaires & indicateurs » : tableau de ventilation : hommes, femmes, enfants, adultes,
personnes âgées, personnes vulnérables (inputs numériques ; TOTAL auto affiché) ; CONTRÔLES DE
COHÉRENCE bloquants : total par sexe = total général (erreur claire « Le total Hommes + Femmes (240)
diffère du total déclaré (250). Corrigez l'un des deux. ») ; indicateurs : pour chaque indicateur
applicable (par catégorie/axe/plan) saisir la valeur (nombre ou texte selon type) ; valeur
d'indicateur ne pouvant excéder le total bénéficiaires quand pertinent (avertissement).
É5 « Photos & pièces jointes » : upload multiple vers Storage attachments (JPG/PNG/PDF/DOCX/XLSX,
10 Mo max/fichier, barre de progression, miniature) ; pour chaque PHOTO : légende, date de prise
(auto=date activité), lieu (auto=lieu activité), case « Inclure dans les présentations » ;
récapitulatif final en lecture compacte de tout → boutons « Enregistrer le brouillon » /
« Soumettre pour validation » (dialog de confirmation récap : statut futur + qui sera notifié).

PRÉVENTION DOUBLES SAISIES : à la saisie de l'intitulé+date, requête similarité (ilike) — bandeau
« Une activité similaire existe le {date} : “…” — Voir » (non bloquant).

DROITS : AGENT crée/modifie ses brouillons ; PROPRIETAIRE tout ; LECTEUR lecture. RLS applique.

CRITÈRES : brouillon récupéré après fermeture navigateur ; référence auto générée unique au format
ORG-ANNEE-0001 ; mois/trimestre affichés correspondent à la date ; contrôles bénéficiaires bloquants ;
uploads visibles dans la galerie ; zéro régression de build ; commit « feat: module activités complet ».
```

---

## 📋 PROMPT 18 — Workflow de validation + module Incidents (faits majeurs)

```text
TÂCHE : Deux chantiers.

A) VALIDATION /app/validation (PROPRIETAIRE ; AGENT voit uniquement ses propres soumissions) :
- Onglets compteurs : À valider (SOUMIS + EN_VERIFICATION) / Rejetées / Validées (période).
- Table des files ; actions groupées (sélection multiple → « Valider la sélection » avec
  confirmation).
- FICHE DÉTAIL validateur : vue activité + panneau décision sticky : boutons « Valider » (dialog :
  commentaire optionnel → VALIDE, notification à l'auteur) ; « Demander une correction » (= REJETE :
  motif OBLIGATOIRE textarea guidé « Décrivez précisément ce qui doit être corrigé » → notification
  avec motif) ; « Mettre en vérification » (EN_VERIFICATION — réservé, commentaire).
- L'AGENT côté /app/activites : les rejetées apparaissent avec carte rouge du motif + bouton
  « Corriger et resoumettre » (statut CORRECTION → édition → SOUMIS).
- RÈGLES : un validateur ne peut valider ses propres saisies QUE s'il est PROPRIETAIRE et que c'est
  autorisé dans les paramètres org (toggle « auto-validation du propriétaire », défaut oui pour les
  petites équipes) ; chaque transition écrit : statut_history table dédiée (activity_status_history :
  activity_id, de, vers, par, le, commentaire) + audit_log ; timeline affichée dans la fiche.
- CLÔTURE (préparation prompt 19) : consolider = passer VALIDE → CONSOLIDE quand période clôturée
  (fonction fournie, branchée au prompt 19).

B) INCIDENTS /app/incidents (tous rôles sauf LECTEUR pour saisie) :
- Liste : cartes/table : date, nature, type badge gravité (FAIBLE slate, MOYENNE bleu, ELEVEE orange,
  CRITIQUE rouge), lieu, victimes/décès, statut (En cours/Clôturé).
- Création/édition : formulaire simple en 1 page : date*, région/département/localité*, nature*
  (types seed + autre), gravité*, description des faits*, victimes (nombre), décès (nombre), actions
  entreprises, acteurs impliqués, statut. Pièces jointes possibles (même composant upload que le
  prompt 17, réutilisé — factoriser components/metier/FileUploader).
- Détail : fiche + fil chronologique de mises à jour (commentaires datés sur l'incident : table
  incident_updates) + clôture (dialog récap : bilan final obligatoire).
- Mini-dashboard haut de page : incidents du trimestre, par gravité (barres), clôturés vs en cours.

CRITÈRES : rejet sans motif impossible ; timeline exacte et immuable ; incidents séparés des
activités ( Pas de mélange dans les stats activités, mais repris dans les rapports plus tard) ;
commit « feat: workflow de validation et module incidents ».
```

---

## 📋 PROMPT 19 — Périodes, clôture de trimestre et centre de notifications

```text
TÂCHE : Gouvernance temporelle et notifications internes.

A) PÉRIODES /app/referentiels?onglet=periodes + page dédiée /app/periodes :
- Grille de l'année : 4 cartes trimestres (T1..T4) : statut badge (Ouvert/Clôturé), nb activités par
  statut (brouillons/soumis/validés), barre de complétude ; sous chacune : les 3 mois.
- Action « Clôturer T{n} » (PROPRIETAIRE) : dialog de contrôle bloquant avec checklist auto :
  « 2 activités encore SOUMISES — elles doivent être validées ou rejetées » (liste + liens) ; si 0
  bloquant : confirmations en 2 temps (« Les données du T{n} deviendront non modifiables ») →
  RPC close_period : passe les VALIDE → CONSOLIDE, verrouille periods ROW, audit, notification à
  toute l'org.
- RÉOUVERTURE : uniquement PROPRIETAIRE (ou super admin) avec MOTIF obligatoire + double
  confirmation + audit spécifique « REOUVERTURE_PERIODE » (rouge dans le journal) ; repasse la
  période OUVERT et les CONSOLIDE → VALIDE.
- Effet applicatif global : si période clôturée, toute écriture sur activité de cette période refusée
  côté serveur (guard dans les actions) + RLS (clause : période ouverte pour INSERT/UPDATE).

B) NOTIFICATIONS : cloche topbar → panneau (sheet) : liste des notifications org (icône par type :
  validation, rejet, rappel, rapport, abonnement), non lues en surbrillance, « Tout marquer lu »,
  clic → lien cible. Table notifications du schéma ; Server Actions markRead/markAllRead.
TRIGGERS de création de notifications (fonctions SQL ou Server Actions centralisées dans
lib/notifications.ts) : activité soumise (→ validateurs), validée/rejetée (→ auteur, avec motif),
données incomplètes détectées (ex : bénéficiaires vides sur activité soumise — contrôle à la
soumission), échéance de clôture (à J-7 et J-2 — fonction SQL appelée au chargement du layout /app,
idempotente via clé unique notification), rapport disponible (prompt 21-22 le déclenchera),
abonnement EXPIRANT_BIENTOT/EXPIRE (→ propriétaire).
PAGE /app/notifications : historique complet filtrable (lues/non lues, type, période).

RÈGLES : pas de doublons de rappels (contrainte unique sur (organization_id, type, cle_contexte,
date_jour)) ; textes des notifications simples et actionnables (« Le rapport T2 2026 est prêt —
Télécharger »).

CRITÈRES : clôture rend impossible toute modif (test API + UI) ; réouverture tracée rouge dans
l'audit ; notifications temps réel au chargement (pas besoin de websocket, revalidate OK) ; commit
« feat: clôture des périodes et notifications ».
```

---

## 📋 PROMPT 20 — Consolidation, suivi et comparaison prévision/réalisation

```text
TÂCHE : Construire l'analytique qui alimente les rapports (zéro nouvelle saisie — tout calculé
depuis les activités VALIDE/CONSOLIDE + plan).

VUES SQL (créer migration 0002_analytics.sql) : v_stats_mensuelles (org, année, mois : nb activités
par catégorie, bénéficiaires par axe sexe/âge/vulnérabilité, incidents) ; v_stats_trimestrielles
(idem par trimestre) ; v_stats_annuelles ; v_prevision_realisation (plan_activities LEFT JOIN count
activités liées validées + statut calculé : REALISE / PARTIELLEMENT_REALISE / NON_REALISE ; +
activités supplémentaires comptées à part) ; v_indicateurs_periode (valeurs agrégées SUM/dernière
selon type, par trimestre — table du rapport : Indicateur | T1 | T2 | T3 | T4 | Total).

PAGES :
1. /app/suivi (onglets période) :
   - « Mensuel » : table 12 mois × colonnes (Activités, Solidarité, Cohésion, Visites, Alertes,
     Autres, Bénéficiaires, Incidents) ; ligne totale ; chaque cellule nb cliquable → liste filtrée.
   - « Trimestriel » : 4 colonnes T1-T4 consolidées (cumul des 3 mois) + radar/barres ; bouton
     « Générer le rapport Word/PPT » (renvoi /app/rapports, garde feature du plan — bandeau upsell
     sobre si ESSENTIEL pour mensuel/annuel/PPT : « Disponible à partir de la formule PROFESSIONNEL »
     + WhatsApp).
   - « Annuel » : vue T1+T2+T3+T4 (cumul, jamais copie de T4) + grandes tendances.
2. /app/suivi/previsionnel : table du plan avec colonnes : Prévu | Réalisé | Écart | Taux % | Statut
   (puces vert/orange/rouge) + les « Activités supplémentaires non prévues » dans une section à part
   (compteur + liste) ; filtres par axe/période ; graphique comparatif barres groupées ; export CSV.
   Règle affichée en info-bulle : « Réalisé = 100 % de la cible • Partiellement réalisé = 1–99 % •
   Non réalisé = 0 % » (cibles qualitatives : statut manuel du PROPRIETAIRE avec justification).
3. /app/indicateurs : tableau « Indicateur | T1 | T2 | T3 | T4 | Total annuel » (source
   v_indicateurs_periode, QUANTITATIF=somme, QUALITATIF=dernière synthèse) + graphique d'évolution
   par indicateur sélectionné ; indicateurs sans donnée signalés « à compléter ».

QUALITÉ : tout est en lecture calculée (pas de cache périmé : revalidatePath après validation
d'activité) ; tooltips explicatifs partout ; export CSV fidèle aux filtres.

CRITÈRES : T2 = somme exacte avr+mai+juin (vérification sur données démo) ; l'annuel = T1+T2+T3+T4 ;
un indicateur QUALITATIF ne se somme pas ; commit « feat: consolidation et prévision/réalisation ».
```

---

## 📋 PROMPT 21 — Génération des rapports Word (DOCX)

```text
TÂCHE : Construire le moteur de génération Word (/app/rapports) avec la librairie « docx » côté
serveur (Route Handler /api/rapports/generer — jamais côté client). INSTITUTIONNEL : en-tête
personnalisé (logo + couleur de la Direction depuis organizations) ; autres plans : en-tête standard
e-OSCS/MCNSLP.

ARCHITECTURE : lib/reporting/collect.ts (agrégation des données via les vues du prompt 20 + activités
validées détaillées + incidents + photos sélectionnées) ; lib/reporting/docx-builder.ts
(construction du document : styles institutionnels — titres bleus institutionnels #1F4E79 ou orange
primaire sobre, tables avec en-têtes colorés, marges, pagination, page de garde) ; un builder par
type : buildMonthlyDocx, buildQuarterlyDocx, buildAnnualDocx.

PAGE /app/rapports :
- Étape 1 « Paramètres » (carte formulaire) : type de rapport (Mensuel/Trimestriel/Annuel — options
  grisées selon le plan avec pastille « PRO »), année, période (mois ou trimestre), sections
  incluses (cases à cocher selon gabarit ci-dessous, tout coché par défaut), options (inclure la
  galerie photos, inclure annexes détaillées, seuils d'alerte). Si période non clôturée : avertissement
  orange « T{n} n'est pas clôturé — les données validées à ce jour seront utilisées » + case « Je
  comprends ».
- Étape 2 « Prévisualisation » : rendu HTML fidèle du contenu (mêmes données/sections/tables, titres
  numérotés) scrollable avec résumé latéral (nb pages estimées, nb tableaux, nb photos) → bouton
  « Générer le document Word » (loader avec étapes affichées : collecte → calculs → construction →
  archivage).
- Étape 3 « Terminé » : succès + boutons Télécharger / Voir dans l'archive (prompt 23).

CONTENU RAPPORT TRIMESTRIEL (PRD §19, structure institutionnelle) : Page de garde (République de
Côte d'Ivoire — Union-Discipline-Travail ; MCNSLP ; nom Direction ; titre « RAPPORT D'ACTIVITÉS DU
TRIMESTRE {n} — {année} » ; mois/année) ; Sommaire ; 1. Introduction ; 2. Objectifs ; 3. Missions et
rôle de la Direction ; 4. Point global des activités (tableau : mois × catégories + totaux) ;
5. Solidarité (synthèse rédigée automatiquement à partir des champs résultats des activités validées
de la catégorie : intro automatique + tableau des activités + encadré difficultés/recommandations
concaténés) ; 6. Visites de compassion ; 7. Cohésion sociale (même pattern) ; 8. État des
indicateurs (tableau Indicateur | Mois 1-3 | Total trimestre | observation auto) ; 9. Bilan du
trimestre (paragraphe de synthèse calculée : totaux, comparaison trimestre précédent en %) ;
10. Incidents et faits majeurs (tableau + récits) ; 11. Difficultés rencontrées ; 12. Recommandations ;
13. Perspectives ; 14. Divers ; 15. Conclusion. Annexe : liste exhaustive des activités du trimestre.

CONTENU RAPPORT ANNUEL (PRD §20) : garde annuelle ; bilan général ; objectifs et rappel du plan
annuel ; TAUX DE RÉALISATION DU PLAN (tableau prévision/réalisation + %) ; comparaison T1/T2/T3/T4
(tableau + graphique image généré — simple bar chart rendu en SVG/PNG inline dans le DOCX) ; total
activités prévues/réalisées/supplémentaires ; bénéficiaires (tableaux ventilés) ; sections Solidarité,
Cohésion sociale, Visites de compassion, Formations et sensibilisations ; incidents et faits majeurs
annuels ; évolution des indicateurs (tableau Indicateur | T1 | T2 | T3 | T4 | Total annuel) ;
activités majeures (top 10 par bénéficiaires) ; difficultés annuelles ; recommandations ;
perspectives année N+1 ; galerie des principales activités (photos cochées « présentation », 2×2 par
page avec légendes date+lieu) ; conclusion.

CONTENU RAPPORT MENSUEL (si plan l'autorise) : version courte : garde simple, résumé chiffré,
activités du mois par catégorie, incidents, difficultés, perspectives.

ARCHIVAGE (lien prompt 23) : chaque génération = sauvegarde DOCX dans bucket reports
(org/année/période/) + ligne reports/report_versions (version incrémentée V1, V2… , paramètres
jsonb) + notification « Rapport prêt » + audit. NOM DE FICHIER NORMALISÉ :
Rapport_{Type}_{Periode}_{Annee}_{NomDirection}_v{n}.docx (caractères sûrs).

QUALITÉ : timeout géré (génération < 30 s, sinon arrière-plan + notification) ; mémoire maîtrisée
(stream) ; texte nul-safe (« Aucune activité validée sur cette période » dans les sections vides au
lieu de crash) ; document relu : orthographe/typographie française (espaces insécables avant « : »,
nombres fr-FR).

CRITÈRES : le DOCX s'ouvre dans Word et LibreOffice sans réparation ; garde + 15 sections présentes ;
les chiffres = ceux des écrans de suivi ; nom de fichier conforme ; feature-gating fonctionnel ;
commit « feat: génération des rapports Word ».
```

---

## 📋 PROMPT 22 — Génération PowerPoint (PPTX)

```text
TÂCHE : Ajouter le moteur de présentations PowerPoint avec pptxgenjs (même page /app/rapports,
choix de sortie « Word » / « PowerPoint » / « Les deux »). Feature pptx : PROFESSIONNEL et +.

ARCHITECTURE : lib/reporting/pptx-builder.ts ; thème de slides : fond blanc, bandeau supérieur
orange→vert fin, titre orange foncé ou vert, pied de page « {Direction} — {période} — page n/N »,
police système. Utilitaires : addTitleSlide, addSectionHeader, addKpiSlide (chiffres géants),
addTableSlide (pptx table stylée), addBulletsSlide, addChartSlide (barres/pie pptx natifs),
addPhotoGridSlide (2×2 avec légendes). NOMBRE DE SLIDES ADAPTATIF : section vide → slide omise ;
trop de contenu → découpage automatique en plusieurs slides (max 6 puces, max 8 lignes de tableau par
slide, photos 4/slide).

DECK TRIMESTRIEL (PRD §22) : 1. Garde (logo, Direction, « Rapport d'activités — Trimestre n,
année ») ; 2. Contexte et missions (3 puces max) ; 3. Objectifs de la période ; 4. Chiffres clés
(4 KPI géants : activités, bénéficiaires, incidents traités, taux plan) ; 5. Solidarité (chiffres +
1 tableau) ; 6. Cohésion sociale ; 7. Visites de compassion ; 8. Indicateurs (tableau/barres) ;
9. Incidents et faits majeurs ; 10. Galerie photos (autant de slides que nécessaire) ; 11. Difficultés ;
12. Recommandations ; 13. Perspectives T{n+1} ; 14. Conclusion / Merci + contacts.

DECK ANNUEL : garde annuelle ; objectifs ; plan annuel et taux de réalisation (jauge/barres) ;
chiffres clés annuels ; une slide récap par trimestre T1, T2, T3, T4 (mêmes gabarits, chiffres
différents — NE PAS les confondre) ; comparaison T1–T4 (chart) ; Solidarité ; Cohésion ; Visites ;
Formations/sensibilisations ; Indicateurs (tableau T1|T2|T3|T4|Total) ; Incidents ; Activités
majeures (top 5 avec chiffres) ; Galerie photos ; Difficultés ; Recommandations ; Perspectives N+1 ;
Conclusion.

FLUX : mêmes étapes que Word (paramètres → prévisualisation LISTE des slides avec titres et contenu
résumé → génération → archive reports + version + notification + téléchargement). Nom :
Presentation_{Type}_{Periode}_{Annee}_{Direction}_v{n}.pptx.

QUALITÉ : images redimensionnées avant insertion (max 1600 px) pour garder des fichiers légers ;
texte nul-safe ; test d'ouverture PowerPoint/Google Slides/LibreOffice Impress.

CRITÈRES : deck trimestriel généré ≤ 25 slides sur données démo ; sections vides omises proprement ;
fichier < 15 Mo ; chiffres identiques au DOCX même période ; commit « feat: génération PowerPoint ».
```

---

## 📋 PROMPT 23 — Bibliothèque et archivage des rapports

```text
TÂCHE : Construire /app/rapports/archive (et onglet « Générer » lié à la page actuelle de rapports) :
bibliothèque complète des documents.

LISTE : filtres (année, type MENSUEL/TRIMESTRIEL/ANNUEL, format DOCX/PPTX, période) ; cartes ou
table : nom normalisé, type badge, période, version, taille, généré par + date relative, statut
(Brouillon/Final), nb téléchargements. Recherche par nom. Tri par date desc. Regroupement visuel par
année (sections pliables).

ACTIONS : Télécharger (URL signée courte durée) ; « Voir les versions » (dialog historique V1..Vn
avec paramètres de génération lisibles et téléchargement par version) ; « Régénérer » (retour à
l'étape 1 pré-remplie mêmes paramètres → nouvelle version, JAMAIS d'écrasement de l'ancienne) ;
« Marquer Final » / remettre Brouillon (PROPRIETAIRE) ; Supprimer une version (PROPRIETAIRE + avertissement
+ audit) ; partager le récap par WhatsApp (texte pré-rempli avec nom du rapport — pas de lien public,
les fichiers restent privés).

RAPPELS D'ÉCHÉANCE : en haut de page, carte « Échéancier de l'année » : pour chaque trimestre :
statut (rapport généré ✓ / à produire / données incomplètes / période non clôturée) avec lien
d'action ; le rapport annuel débloqué quand les 4 trimestres ont au moins des données validées
(warning sinon).

RÈGLES : les fichiers vivent dans le bucket reports privé (org/année/…) — aucune URL publique ; le
compte de versions est par (report, format) ; audit sur téléchargements sensibles (optionnel : log
DOWNLOAD) ; quotas de stockage par plan contrôlés à l'upload/génération (message clair + lien
upgrade si dépassement).

CRITÈRES : régénération crée V2 sans toucher V1 ; URLs signées expirent ; l'échéancier reflète la
réalité ; commit « feat: bibliothèque et archivage des rapports ».
```

---

## 📋 PROMPT 24 — Fonctionnalités avancées : export complet, carte nationale, lecture consolidée

```text
TÂCHE : Trois chantiers P1/P2 (feature-gated INSTITUTIONNEL sauf mention contraire) ; si un chantier
est trop lourd, livre-les séparément dans l'ordre A, B, C.

A) EXPORT COMPLET DES DONNÉES (INSTITUTIONNEL, /app/parametres > « Exporter mes données ») :
génération côté serveur d'un ZIP (ou multi-CSV) : activités, bénéficiaires agrégés, indicateurs,
incidents, plan annuel, membres — CSV UTF-8 BOM Excel-friendly + un XLSX récap (lib exceljs à
installer) ; audit « EXPORT_DONNEES ». Droit PROPRRIETAIRE.

B) CARTE NATIONALE (/app/suivi > onglet « Carte », INSTITUTIONNEL + visible super admin dans
/admin/statistiques) : carte SVG simplifiée de la Côte d'Ivoire découpée par DISTRICTS/RÉGIONS
(dessiner un SVG inline simplifié avec paths approximatifs étiquetés — qualité schématique assumée,
pas une carte géographique précise ; NE PAS charger de bibliothèque de cartographie lourde externe).
Couleur de chaque région selon l'intensité d'activités de l'org (échelle vert clair → vert foncé,
légende), tooltip (région, nb activités, bénéficiaires), clic → liste filtrée par région. Pour le
super admin : même carte avec toutes les orgs (compte d'organisations par région, abonnements actifs)
— données déjà autorisées par son rôle.

C) VUE LECTURE CONSOLIDÉE NATIONALE (NOUVEAU RÔLE optionnel LECTEUR_NATIONAL, créé par le super
admin depuis /admin/organisations — réservé MCNSLP/commissions) : accès readonly à un dashboard
national AGGRÉGÉ (totaux par région/catégorie/période de TOUTES les orgs, aucune fiche nominative) :
implémenter par vues SQL SECURITY DEFINER v_national_* + RLS dédié (is_national_viewer()), jamais de
données ligne à ligne. Dashboard : KPIs nationaux, comparaison inter-régions (barres), tendance
mensuelle nationale, répartition par catégorie, incidents par gravité. Mention en pied : « Données
consolidées automatiquement à partir des rapports validés des Directions ».

CRITÈRES : export relu et complet ; carte fluide sans dépendance externe lourde ; le lecteur
national ne voit AUCUNE liste d'activités nominative (test RLS avec second compte) ; commit
« feat: exports, carte nationale et lecture consolidée ».
```

---

## 📋 PROMPT 25 — Passe qualité, sécurité et UX finale

```text
TÂCHE : Audit et durcissement complet avant mise en production. Produire un rapport « AUDIT.md » à la
racine listant chaque point : OK / CORRIGÉ / À SUIVRE.

1. SÉCURITÉ : script SQL de contrôle → toute table métier sans RLS activée = FAIL (corriger) ;
   revue des RPC security definer (search_path fixé, droits minimaux) ; aucune clé
   service dans le bundle client (grep build) ; validation zod présente sur TOUTES les Server
   Actions (input + fichiers) ; limites de taille type/mime fichiers ; rate limiting sur actions
   publiques (demande, activation, connexion) ; headers de sécurité Next (next.config : X-Frame-Options
   DENY, nosniff, Referrer-Policy) ; capots anti-énumération (messages neutres) ; sessions : durées
   par défaut Supabase documentées.
2. FONCTIONNEL (check-list des critères d'acceptation du PRD §33) — rejouer les 18 scénarios de bout
   en bout sur les données démo et noter le résultat dans AUDIT.md (demande landing → traitement →
   paiement → code → activation → équipe → plan → activité → validation → clôture → consolidation →
   DOCX → PPTX → archive → audit), dont : isolation inter-organisations prouvée (compte A ne voit
   rien de B, RLS) ; mois/trimestres auto exacts ; annuel = somme des trimestres.
3. UX : chaque liste a un état vide + skeleton + état d'erreur avec bouton « Réessayer » ; focus
   clavier complet sur formulaires critiques ; contrastes AA ; navigation mobile (sidebar sheet) ;
   messages d'erreur uniformisés en français simple ; pas de page sans fil d'Ariane/titre ; textes
   relus (orthographe FR).
4. PERFORMANCE : audit des requêtes (pas de N+1, indexes présents sur les colonnes de filtre :
   EXPLAIN des vues principales documentés) ; images optimisées ; bundle : pas de lib cliente lourde
   inutile (docx/pptxgenjs côté serveur uniquement — vérifier imports) ; lazy loading des graphiques
   lourds.
5. ROBUSTESSE : pages not-found / error par segment personnalisées en français ; garde sur tous les
   [id] (404 propre si hors org grâce RLS) ; logs serveur sans données sensibles.
6. README FINAL : architecture (schéma mermaid LANDING → DEMANDE → SUPER ADMIN → MOBILE MONEY →
   ACTIVATION → ESPACE → PLAN → ACTIVITÉS → VALIDATION → CONSOLIDATION → RAPPORTS → WORD/PPT →
   ARCHIVAGE), guide complet de démarrage, variables d'environnement, scripts (dev/build/seed),
   procédures ops (créer un super admin, relancer un seed, purger la démo), lien politique de
   sécurité (section « Ne jamais committer de secrets »).

CRITÈRE GLOBAL : AUDIT.md complet, tout FAIL bloquant corrigé ; commit « chore: audit qualité,
sécurité et UX final ».
```

---

## 📋 PROMPT 26 — Déploiement production sur Vercel + mise en service

```text
TÂCHE : Déployer e-OSCS en production, proprement.

1. VERCEL : importer le repo GitHub onlineshoporo-creator/e-oscs ; framework Next.js auto ;
   variables d'environnement Production : NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY,
   NEXT_PUBLIC_APP_URL (URL de prod finale), SUPABASE_SERVICE_ROLE_KEY (Marquée SENSIBLE),
   NEXT_PUBLIC_CONTACT_WHATSAPP, NEXT_PUBLIC_CONTACT_EMAIL. NE JAMAIS les committer — saisie dans
   le dashboard Vercel uniquement. Build command par défaut. Vérifier le premier déploiement vert.
2. SUPABASE PROD : Authentication → URL Configuration : Site URL = URL Vercel ; Redirect URLs =
   https://<domaine>/** (reset password, activation) ; Email templates traduits en FR (confirmation,
   reset — fournir le HTML simple institutionnel) ; vérifier rate limits SMTP (proposer config SMTP
   custom, documenter) ; activer le cron quotidien mark_expiring_subscriptions() (SQL prêt) ;
   Plan de sauvegarde : documenter PITR/snapshots Supabase + export hebdo conseillé.
3. DOMAINE (si fourni par moi) : configurer le domaine custom + HTTPS auto ; sinon conserver
   *.vercel.app.
4. TEST FUMÉE PROD (checklist à exécuter et cocher dans DEPLOIEMENT.md) : landing OK + prix OK ;
   demande test → visible admin ; activation test avec code → espace ; création activité + validation ;
   génération DOCX T courant ; upload photo ; blocage après passage manuel abonnement EXPIRE ;
   remise ACTIF ; connexion mobile (viewport).
5. EXPLOITATION : activer Vercel Analytics ; configurer alertes d'erreur (Vercel + onerror page) ;
   documenter la procédure de rollback (redeploy commit précédent) ; page /statut optionnelle simple ;
   créer le 1er compte super admin de prod (procédure seed prod, SANS données démo : SEED_DEMO off).
6. LIVRAISON : fichier DEPLOIEMENT.md récapitulant : URLs, env vars (noms uniquement), cron, checklist
   fumée cochée, contacts support (WhatsApp +225 0576103277 / omouitsi@gmail.com), procédures de
   maintenance courantes (renouveler un client, régénérer un code, purger des comptes de test).

CRITÈRES : production accessible et fumée 100 % verte ; zéro secret dans le repo (dernier grep) ;
commit « chore: déploiement production ».
```

---

## ANNEXE C — Ordre d'exécution & estimation

| Phase PRD | Prompts | Livrable |
|---|---|---|
| Fondations | 0, 1, 2, 3 | Projet + base de données sécurisée + référentiels |
| 1 — SaaS commercial | 4, 5, 6, 7 | Landing + demandes + auth + activation |
| Cockpit Super Admin | 8, 9, 10, 11, 12 | Gestion complète des abonnements |
| 2 — Espace DR/DD | 13, 14, 15, 16, 17 | Équipe + référentiels + plan + activités |
| 3 — Validation & suivi | 18, 19, 20 | Workflow + incidents + consolidation |
| 4 — Reporting | 21, 22, 23 | Word + PowerPoint + archivage |
| 5 — Avancé & go-live | 24, 25, 26 | Avancé + audit + production |

**Conseil** : faites relire visuellement par GLM-5 l'ensemble des pages à la fin de chaque phase (« fais une passe UX sur les pages X ») avant d'enchainer.

## ANNEXE D — Modèle de suivi d'avancement

Créez un fichier `AVANCEMENT.md` dans le repo ; après chaque prompt, ajoutez : numéro, date, résultat (« OK » / « OK avec réserve : … »), commit hash. GLM-5 y contribue à chaque commit.

## ANNEXE E — PROMPT R (reprise de session)

```text
Nous reprenons la construction e-OSCS (contexte maître collé précédemment). État actuel : les
prompts 0 à N ont été exécutés et commités (dernier commit : « … »). Lis la structure actuelle du
repo et le fichier AVANCEMENT.md, résume en 10 lignes ce qui existe déjà (pages, modules, tables,
fonctionnalités), signale toute incohérence éventuelle, puis attends le prompt N+1.
```

## ANNEXE F — PROMPT D (dépannage générique, en cas de bug)

```text
Un bug existe sur e-OSCS : [DÉCRIRE : page concernée, action effectuée, attendu vs obtenu, message
d'erreur exact, mobile ou desktop]. Mission : 1) reproduire et diagnostiquer la cause racine (pas un
pansement) ; 2) proposer le correctif minimal sans casser les fonctionnalités existantes (liste les
fichiers impactés et pourquoi) ; 3) appliquer, ajouter un garde-fou ou un test de non-régression si
pertinent ; 4) vérifier tsc/lint/build ; 5) commit « fix: … » et me résumer cause + correctif en 5
lignes.
```

---

*Fin du plan de construction — e-OSCS v2.0. Document généré le 12 août 2026.*
