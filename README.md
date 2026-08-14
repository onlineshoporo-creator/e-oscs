# e-OSCS

**Plateforme nationale de suivi des activités de solidarité et de cohésion sociale**

🇨🇮 Développée pour le **MCNSLP** (Ministère de la Cohésion Nationale, de la Solidarité et de la Lutte contre la Pauvreté, Côte d'Ivoire).

---

## 📋 Description

e-OSCS est une plateforme SaaS multi-tenant qui permet aux **Directions Régionales (DR)** et **Directions Départementales (DD)** du MCNSLP de :

1. **Planifier** leurs activités annuelles
2. **Saisir** leurs activités (solidarité, cohésion sociale, visites de compassion, alerte précoce)
3. **Faire valider** par le responsable hiérarchique
4. **Générer automatiquement** les rapports administratifs en **Word et PowerPoint**

### Principe directeur

> **Une donnée saisie une seule fois, exploitée à tous les niveaux.**

---

## 🛠 Stack Technique

| Technologie | Usage |
|-------------|-------|
| **Next.js 15+** (App Router) | Framework React full-stack |
| **TypeScript** (strict) | Typage statique |
| **Tailwind CSS 4** | Styles utilitaires |
| **shadcn/ui** | Composants UI accessibles |
| **Supabase** | Base de données PostgreSQL + Auth + Storage + RLS |
| **Recharts** | Graphiques et visualisations |
| **react-hook-form + zod** | Formulaires et validation |
| **date-fns** (locale fr) | Manipulation des dates |
| **docx** | Génération de rapports Word |
| **pptxgenjs** | Génération de présentations PowerPoint |
| **lucide-react** | Icônes |

---

## 🚀 Installation

### Prérequis

- **Node.js** 18+ ou **Bun**
- Un projet **Supabase** (voir configuration ci-dessous)

### Étapes

```bash
# 1. Cloner le repository
git clone https://github.com/onlineshoporo-creator/e-oscs.git
cd e-oscs

# 2. Installer les dépendances
bun install  # ou npm install

# 3. Configurer l'environnement
cp .env.example .env.local
# Éditer .env.local avec vos clés Supabase

# 4. Lancer en développement
bun run dev

# 5. Ouvrir http://localhost:3000
```

---

## ⚙️ Variables d'environnement requises

Copier `.env.example` vers `.env.local` et remplir :

| Variable | Description | Exemple |
|----------|-------------|---------|
| `NEXT_PUBLIC_SUPABASE_URL` | URL du projet Supabase | `https://xxxx.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Clé anon publique | `eyJhbGciOi...` |
| `SUPABASE_SERVICE_ROLE_KEY` | Clé service role (**serveur uniquement**) | `eyJhbGciOi...` |
| `NEXT_PUBLIC_APP_URL` | URL de l'application | `http://localhost:3000` |
| `NEXT_PUBLIC_CONTACT_WHATSAPP` | Numéro WhatsApp contact | `2250576103277` |
| `NEXT_PUBLIC_CONTACT_EMAIL` | Email de contact | `omouitsi@gmail.com` |

> ⚠️ **Ne jamais commit `.env.local`** — il est dans `.gitignore`

---

## 📁 Structure du projet

```
e-oscs/
├── app/
│   ├── (marketing)/        # Landing page, demande d'abonnement
│   ├── (auth)/             # Connexion, activation par code
│   ├── admin/              # Cockpit Super Admin
│   └── app/                # Espace Direction (DR/DD)
├── components/
│   ├── ui/                 # Composants shadcn/ui
│   └── metier/             # Composants métier e-OSCS
├── lib/
│   ├── supabase/
│   │   ├── client.ts       # Client browser
│   │   ├── server.ts       # Client serveur (cookies)
│   │   └── admin.ts        # Client admin (service role)
│   └── utils.ts            # Utilitaires (cn(), formatFCFA...)
├── supabase/
│   ├── migrations/         # Migrations SQL (schéma + RLS)
│   └── seed.sql            # Données initiales
├── types/
│   └── database.ts         # Types TypeScript générés
└── public/                 # Statiques
```

---

## 🎨 Design System

| Élément | Valeur | Usage |
|---------|--------|-------|
| **Primaire** | `#F77F00` (Orange CI) | CTA, actions principales |
| **Secondaire** | `#009E60` (Vert CI) | Succès, validation |
| **Neutres** | Slate palette | Textes, fonds, bordures |
| **Sidebar** | `#0F172A` (slate-900) | Navigation administration |
| **Police** | Inter (via next/font) | Tout le texte |

---

## 👥 Rôles

| Rôle | Permissions |
|------|-------------|
| **SUPER_ADMIN** | Propriétaire de la plateforme, gère les abonnements |
| **PROPRIETAIRE** | Chef de DR/DD, valide les activités |
| **AGENT** | Collaborateur, saisit les activités |
| **LECTEUR** | Consultation seule |

---

## 📦 Commandes disponibles

```bash
# Développement
bun run dev          # Serveur avec hot-reload (port 3000)

# Qualité
bun run lint         # ESLint
bun run build        # Production build

# Base de données (si Prisma utilisé)
bun run db:push      # Pousser schéma
```

---

## 🔒 Sécurité

- **RLS (Row Level Security)** activé sur toute table métier
- Isolation stricte par `organization_id` (tenant_id)
- Clé `SUPABASE_SERVICE_ROLE_KEY` utilisée **uniquement côté serveur**
- Aucun secret en dur dans le code source

Vérification RLS :
```sql
-- Toutes les tables métier doivent avoir rowsecurity = true
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public'
ORDER BY tablename;
```

---

## 📄 Licence

Propriété du **MCNSLP — Ministère de la Cohésion Nationale, de la Solidarité et de la Lutte contre la Pauvreté**, Côte d'Ivoire.

---

## 🤝 Contact

- **WhatsApp** : [225 05 761 03 277](https://wa.me/2250576103277?text=Bonjour%20je%20souhaite%20des%20informations%20sur%20e-OSCS)
- **Email** : omouitsi@gmail.com

---

© 2026 e-OSCS — MCNSLP
