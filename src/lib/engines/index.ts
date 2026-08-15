/**
 * Point d'entrée principal pour les moteurs de génération de rapports e-OSCS
 * 
 * Ce module ré-exporte toutes les fonctionnalités des moteurs :
 * - Word Engine (génération .docx)
 * - PowerPoint Engine (génération .pptx)
 * - Types et constantes
 * - Utilitaires de formatage
 */

// Types et constantes
export {
  EOSCS_COLORS,
  WORD_STYLES,
  PPTX_STYLES,
  type RapportType,
  type RapportFormat,
  type OrganisationRapport,
  type PeriodeRapport,
  type ActivityForReport,
  type IndicatorForReport,
  type RapportStats,
  type EvolutionMensuelle,
  type RapportParams,
  type PresentationParams,
  type GenerationResult,
} from './types'

// Utilitaires
export {
  formatMontantFCFA,
  formatNombre,
  formatPourcentage,
  formatDateFR,
  formatDateCourte,
  getDateActuelle,
  getPeriodeLabel,
  getTrimestreLabel,
  getTrimestreDuMois,
  getMoisDuTrimestre,
  calculerStats,
  grouperParCategorie,
  calculerEvolutionMensuelle,
  genererNomFichier,
  tronquerTexte,
  getCouleurStatut,
  getLabelStatut,
  MOIS_FR,
  TRIMESTRES_FR,
  TRIMESTRES_ABREV,
} from './utils'

// Word Engine
export {
  generateRapportMensuelWord,
  generateRapportTrimestrielWord,
  generateRapportAnnuelWord,
  generateWordReport,
} from './word-engine'

// PowerPoint Engine
export {
  generatePresentationRapport,
  generatePowerPointReport,
} from './pptx-engine'
