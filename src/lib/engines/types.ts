/**
 * Types pour les moteurs de génération de rapports e-OSCS
 * 
 * Ce fichier définit les interfaces et types utilisés par :
 * - Word Engine (génération .docx)
 * - PowerPoint Engine (génération .pptx)
 */

// ===========================================
// Types de rapport
// ===========================================

/** Type de rapport */
export type RapportType = 'mensuel' | 'trimestriel' | 'annuel'

/** Format d'export du rapport */
export type RapportFormat = 'docx' | 'pptx'

// ===========================================
// Paramètres de génération
// ===========================================

/** Organisation pour le rapport */
export interface OrganisationRapport {
  id: string
  nom: string
  type_org: 'DR' | 'DD'
  region: string
  departement?: string
  telephone?: string
  email?: string
}

/** Période du rapport */
export interface PeriodeRapport {
  debut: string // Date ISO (YYYY-MM-DD)
  fin: string   // Date ISO (YYYY-MM-DD)
  label: string // Label affiché (ex: "Janvier 2026")
  mois?: number // Numéro du mois (1-12)
  annee: number // Année
  trimestre?: number // Numéro du trimestre (1-4) si applicable
}

/** Activité formatée pour le rapport */
export interface ActivityForReport {
  id: string
  titre: string
  description?: string
  categorie: string
  type_activite: string
  statut: string
  date_debut: string
  date_fin?: string
  lieu?: string
  budget_alloue: number
  budget_depense: number
  beneficiaires_count: number
  beneficiaires_hommes?: number
  beneficiaires_femmes?: number
  beneficiaires_jeunes?: number
}

/** Indicateur de performance */
export interface IndicatorForReport {
  code: string
  nom: string
  valeur?: number
  objectif?: number
  unite?: string
  kind: 'QUANTITATIF' | 'QUALITATIF'
}

// ===========================================
// Statistiques agrégées
// ===========================================

/** Statistiques calculées pour le rapport */
export interface RapportStats {
  // Activités
  totalActivites: number
  activitesValidees: number
  activitesEnCours: number
  activitesBrouillon: number
  tauxExecution: number // Pourcentage
  
  // Budget
  budgetTotal: number
  budgetDepense: number
  budgetRestant: number
  tauxBudgetUtilise: number // Pourcentage
  
  // Bénéficiaires
  beneficiairesTotal: number
  beneficiairesHommes: number
  beneficiairesFemmes: number
  beneficiairesJeunes: number
  
  // Répartition par catégorie
  parCategorie: Record<string, number>
  
  // Évolution mensuelle (pour rapports trimestriels/annuels)
  evolutionMensuelle?: EvolutionMensuelle[]
}

/** Données d'évolution mensuelle */
export interface EvolutionMensuelle {
  mois: string
  annee: number
  nbActivites: number
  budgetAlloue: number
  budgetDepense: number
  beneficiaires: number
}

// ===========================================
// Paramètres complets de génération
// ===========================================

/** Paramètres principaux pour générer un rapport */
export interface RapportParams {
  organisation: OrganisationRapport
  periode: PeriodeRapport
  activities: ActivityForReport[]
  stats: RapportStats
  indicators?: IndicatorForReport[]
  type: RapportType
}

/** Paramètres spécifiques PowerPoint */
export interface PresentationParams extends RapportParams {
  /** Inclure les slides de recommandations */
  includeRecommandations?: boolean
  /** Titre personnalisé */
  titrePersonnalise?: string
  /** Sous-titre personnalisé */
  sousTitre?: string
}

// ===========================================
// Résultat de génération
// ===========================================

/** Résultat de la génération d'un rapport */
export interface GenerationResult {
  success: boolean
  buffer?: Buffer
  filename: string
  mimeType: string
  size?: number
  error?: string
}

// ===========================================
// Configuration des couleurs e-OSCS
// ===========================================

/** Couleurs institutionnelles e-OSCS */
export const EOSCS_COLORS = {
  /** Orange Côte d'Ivoire - Primaire */
  ORANGE_CI: '#F77F00',
  /** Vert Côte d'Ivoire - Secondaire */
  VERT_CI: '#009E60',
  /** Blanc */
  BLANC: '#FFFFFF',
  /** Gris foncé pour textes */
  GRIS_FONCE: '#1E293B',
  /** Gris moyen */
  GRIS_MOYEN: '#64748B',
  /** Gris clair pour fonds */
  GRIS_CLAIR: '#F1F5F9',
  /** Orange clair pour fonds */
  ORANGE_CLAIR: '#FFF7ED',
  /** Vert clair pour fonds */
  VERT_CLAIR: '#F0FDF4',
  /** Rouge pour alertes */
  ROUGE: '#DC2626',
  /** Bleu pour informations */
  BLEU: '#2563EB',
} as const

// ===========================================
// Configuration document Word
// ===========================================

/** Styles pour le document Word */
export const WORD_STYLES = {
  /** Police principale */
  FONT_MAIN: 'Arial',
  /** Police secondaire */
  FONT_SECONDARY: 'Calibri',
  /** Taille titre principal */
  TITLE_SIZE: 36,
  /** Taille H1 */
  H1_SIZE: 28,
  /** Taille H2 */
  H2_SIZE: 24,
  /** Taille H3 */
  H3_SIZE: 20,
  /** Taille corps de texte */
  BODY_SIZE: 22, // en demi-points (11pt)
  /** Taille petit texte */
  SMALL_SIZE: 18, // en demi-points (9pt)
  /** Marges en cm converties en twips (1 cm ≈ 567 twips) */
  MARGINS: {
    top: 1134,    // 2cm
    bottom: 1134, // 2cm
    left: 1134,   // 2cm
    right: 1134,  // 2cm
  },
} as const

// ===========================================
// Configuration présentation PowerPoint
// ===========================================

/** Styles pour la présentation PowerPoint */
export const PPTX_STYLES = {
  /** Police principale */
  FONT_MAIN: 'Arial',
  /** Titre taille */
  TITLE_SIZE: 44,
  /** Sous-titre taille */
  SUBTITLE_SIZE: 24,
  /** Corps taille */
  BODY_SIZE: 18,
  /** KPI taille */
  KPI_SIZE: 36,
  /** Largeur slide standard */
  SLIDE_WIDTH: 10, // inches
  /** Hauteur slide standard */
  SLIDE_HEIGHT: 7.5, // inches
} as const
