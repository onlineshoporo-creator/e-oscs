/**
 * Utilitaires pour les moteurs de génération de rapports e-OSCS
 * 
 * Fonctions de formatage, calcul de statistiques et helpers divers.
 */

import {
  ActivityForReport,
  RapportStats,
  EvolutionMensuelle,
  RapportType,
} from './types'

// ===========================================
// Constantes
// ===========================================

/** Noms des mois en français */
export const MOIS_FR: Record<number, string> = {
  1: 'Janvier',
  2: 'Février',
  3: 'Mars',
  4: 'Avril',
  5: 'Mai',
  6: 'Juin',
  7: 'Juillet',
  8: 'Août',
  9: 'Septembre',
  10: 'Octobre',
  11: 'Novembre',
  12: 'Décembre',
}

/** Noms des trimestres */
export const TRIMESTRES_FR: Record<number, string> = {
  1: 'T1 (Janvier-Mars)',
  2: 'T2 (Avril-Juin)',
  3: 'T3 (Juillet-Septembre)',
  4: 'T4 (Octobre-Décembre)',
}

/** Abréviations des trimestres */
export const TRIMESTRES_ABREV: Record<number, string> = {
  1: 'T1',
  2: 'T2',
  3: 'T3',
  4: 'T4',
}

// ===========================================
// Formatage des montants
// ===========================================

/**
 * Formate un montant en FCFA avec séparateurs de milliers
 * @param montant - Le montant à formater
 * @returns Chaîne formatée (ex: "1 234 567 FCFA")
 */
export function formatMontantFCFA(montant: number | undefined | null): string {
  if (montant === undefined || montant === null || isNaN(montant)) {
    return '0 FCFA'
  }
  
  // Arrondir à 2 décimales
  const arrondi = Math.round(montant)
  
  // Formater avec séparateurs d'espaces (norme française)
  const formate = arrondi.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
  
  return `${formate} FCFA`
}

/**
 * Formate un nombre avec séparateurs de milliers
 * @param valeur - La valeur à formater
 * @returns Chaîne formatée (ex: "1 234")
 */
export function formatNombre(valeur: number | undefined | null): string {
  if (valeur === undefined || valeur === null || isNaN(valeur)) {
    return '0'
  }
  
  return Math.round(valeur).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
}

/**
 * Formate un pourcentage
 * @param valeur - La valeur en pourcentage (0-100)
 * @param decimals - Nombre de décimales (défaut: 1)
 * @returns Chaîne formatée (ex: "85,5%")
 */
export function formatPourcentage(valeur: number, decimals: number = 1): string {
  if (isNaN(valeur)) return '0%'
  return `${valeur.toFixed(decimals)}%`
}

// ===========================================
// Formatage des dates
// ===========================================

/**
 * Formate une date ISO en français
 * @param dateStr - Date au format ISO ou string parsable
 * @returns Date formatée (ex: "15 janvier 2026")
 */
export function formatDateFR(dateStr: string | Date | undefined | null): string {
  if (!dateStr) return '-'
  
  const date = typeof dateStr === 'string' ? new Date(dateStr) : dateStr
  
  if (isNaN(date.getTime())) return '-'
  
  const jour = date.getDate()
  const mois = MOIS_FR[date.getMonth() + 1]
  const annee = date.getFullYear()
  
  return `${jour} ${mois} ${annee}`
}

/**
 * Formate une date courte (JJ/MM/YYYY)
 * @param dateStr - Date au format ISO
 * @returns Date courte (ex: "15/01/2026")
 */
export function formatDateCourte(dateStr: string | Date | undefined | null): string {
  if (!dateStr) return '-'
  
  const date = typeof dateStr === 'string' ? new Date(dateStr) : dateStr
  
  if (isNaN(date.getTime())) return '-'
  
  const jour = date.getDate().toString().padStart(2, '0')
  const mois = (date.getMonth() + 1).toString().padStart(2, '0')
  const annee = date.getFullYear()
  
  return `${jour}/${mois}/${annee}`
}

/**
 * Retourne la date actuelle formatée
 * @returns Date actuelle formatée
 */
export function getDateActuelle(): string {
  return formatDateFR(new Date())
}

// ===========================================
// Labels de période
// ===========================================

/**
 * Génère le label d'une période mensuelle
 * @param mois - Numéro du mois (1-12)
 * @param annee - Année
 * @returns Label (ex: "Janvier 2026")
 */
export function getPeriodeLabel(mois: number, annee: number): string {
  const nomMois = MOIS_FR[mois] || `${mois}`
  return `${nomMois} ${annee}`
}

/**
 * Génère le label d'un trimestre
 * @param trimestre - Numéro du trimestre (1-4)
 * @param annee - Année
 * @returns Label (ex: "T1 2026" ou "T1 (Janvier-Mars) 2026")
 */
export function getTrimestreLabel(trimestre: number, annee: number, complet: boolean = false): string {
  const abrev = TRIMESTRES_ABREV[trimestre] || `T${trimestre}`
  if (complet) {
    const nom = TRIMESTRES_FR[trimestre] || `Trimestre ${trimestre}`
    return `${nom} ${annee}`
  }
  return `${abrev} ${annee}`
}

/**
 * Calcule le trimestre à partir d'un mois
 * @param mois - Numéro du mois (1-12)
 * @returns Numéro du trimestre (1-4)
 */
export function getTrimestreDuMois(mois: number): number {
  return Math.ceil(mois / 3)
}

/**
 * Détermine les mois d'un trimestre
 * @param trimestre - Numéro du trimestre (1-4)
 * @returns Tableau des numéros de mois
 */
export function getMoisDuTrimestre(trimestre: number): number[] {
  const debut = (trimestre - 1) * 3 + 1
  return [debut, debut + 1, debut + 2]
}

// ===========================================
// Calcul de statistiques
// ===========================================

/**
 * Calcule les statistiques agrégées depuis une liste d'activités
 * @param activities - Liste des activités
 * @returns Statistiques calculées
 */
export function calculerStats(activities: ActivityForReport[]): RapportStats {
  // Initialiser les compteurs
  let totalActivites = activities.length
  let activitesValidees = 0
  let activitesEnCours = 0
  let activitesBrouillon = 0
  let budgetTotal = 0
  let budgetDepense = 0
  let beneficiairesTotal = 0
  let beneficiairesHommes = 0
  let beneficiairesFemmes = 0
  let beneficiairesJeunes = 0
  
  // Répartition par catégorie
  const parCategorie: Record<string, number> = {}
  
  // Parcourir les activités
  for (const activity of activities) {
    // Compter par statut
    const statutUpper = activity.statut?.toUpperCase()
    if (statutUpper === 'VALIDE' || statutUpper === 'CONSOLIDE') {
      activitesValidees++
    } else if (
      statutUpper === 'SOUMIS' || 
      statutUpper === 'EN_VERIFICATION' ||
      statutUpper === 'CORRECTION'
    ) {
      activitesEnCours++
    } else if (statutUpper === 'BROUILLON') {
      activitesBrouillon++
    }
    
    // Accumuler budget
    budgetTotal += activity.budget_alloue || 0
    budgetDepense += activity.budget_depense || 0
    
    // Accumuler bénéficiaires
    beneficiairesTotal += activity.beneficiaires_count || 0
    beneficiairesHommes += activity.beneficiaires_hommes || 0
    beneficiairesFemmes += activity.beneficiaires_femmes || 0
    beneficiairesJeunes += activity.beneficiaires_jeunes || 0
    
    // Compter par catégorie
    const categorie = activity.categorie || 'Non classifié'
    parCategorie[categorie] = (parCategorie[categorie] || 0) + 1
  }
  
  // Calculer les taux
  const tauxExecution = totalActivites > 0 
    ? (activitesValidees / totalActivites) * 100 
    : 0
  
  const tauxBudgetUtilise = budgetTotal > 0 
    ? (budgetDepense / budgetTotal) * 100 
    : 0
  
  return {
    totalActivites,
    activitesValidees,
    activitesEnCours,
    activitesBrouillon,
    tauxExecution: Math.round(tauxExecution * 10) / 10,
    budgetTotal,
    budgetDepense,
    budgetRestant: budgetTotal - budgetDepense,
    tauxBudgetUtilise: Math.round(tauxBudgetUtilise * 10) / 10,
    beneficiairesTotal,
    beneficiairesHommes,
    beneficiairesFemmes,
    beneficiairesJeunes,
    parCategorie,
  }
}

/**
 * Groupe les activités par catégorie
 * @param activities - Liste des activités
 * @returns Record catégorisé
 */
export function grouperParCategorie(activities: ActivityForRecord[]): Record<string, ActivityForReport[]> {
  const groupes: Record<string, ActivityForReport[]> = {}
  
  for (const activity of activities) {
    const categorie = activity.categorie || 'Non classifié'
    if (!groupes[categorie]) {
      groupes[categorie] = []
    }
    groupes[categorie].push(activity)
  }
  
  return groupes
}

// Type alias pour éviter la confusion
type ActivityForRecord = ActivityForReport

/**
 * Calcule l'évolution mensuelle des activités
 * @param activities - Liste des activités
 * @param annee - Année de référence
 * @param type - Type de rapport pour déterminer la portée
 * @returns Tableau d'évolution mensuelle
 */
export function calculerEvolutionMensuelle(
  activities: ActivityForReport[],
  annee: number,
  type: RapportType
): EvolutionMensuelle[] {
  // Déterminer les mois à couvrir
  let moisDebut: number
  let moisFin: number
  
  switch (type) {
    case 'mensuel':
      // Pour un rapport mensuel, on prend juste le mois concerné
      // (à déterminer par l'appelant via periode.mois)
      return []
    case 'trimestriel':
      // On suppose que les activités sont déjà filtrées pour le trimestre
      moisDebut = 1
      moisFin = 12
      break
    case 'annuel':
    default:
      moisDebut = 1
      moisFin = 12
      break
  }
  
  const evolution: EvolutionMensuelle[] = []
  
  for (let mois = moisDebut; mois <= moisFin; mois++) {
    // Filtrer les activités de ce mois
    const activitiesDuMois = activities.filter(a => {
      const dateDebut = new Date(a.date_debut)
      return dateDebut.getMonth() + 1 === mois && dateDebut.getFullYear() === annee
    })
    
    // Calculer les agrégats du mois
    let nbActivites = activitiesDuMois.length
    let budgetAlloue = 0
    let budgetDepense = 0
    let beneficiaires = 0
    
    for (const a of activitiesDuMois) {
      budgetAlloue += a.budget_alloue || 0
      budgetDepense += a.budget_depense || 0
      beneficiaires += a.beneficiaires_count || 0
    }
    
    evolution.push({
      mois: MOIS_FR[mois],
      annee,
      nbActivites,
      budgetAlloue,
      budgetDepense,
      beneficiaires,
    })
  }
  
  return evolution
}

// ===========================================
// Helpers divers
// ===========================================

/**
 * Génère un nom de fichier pour le rapport
 * @param type - Type de rapport
 * @param format - Format du fichier
 * @param organisationNom - Nom de l'organisation
 * @param periodeLabel - Label de la période
 * @returns Nom de fichier propre
 */
export function genererNomFichier(
  type: RapportType,
  format: 'docx' | 'pptx',
  organisationNom: string,
  periodeLabel: string
): string {
  // Nettoyer le nom de l'organisation (enlever caractères spéciaux)
  const orgClean = organisationNom
    .replace(/[^a-zA-ZÀ-ÿ0-9\s-]/g, '')
    .replace(/\s+/g, '_')
    .substring(0, 30)
  
  // Nettoyer le label de période
  const periodeClean = periodeLabel
    .replace(/[^a-zA-ZÀ-ÿ0-9\s-]/g, '')
    .replace(/\s+/g, '_')
  
  const typeLabel = type === 'mensuel' ? 'Mensuel' 
    : type === 'trimestriel' ? 'Trimestriel' 
    : 'Annuel'
  
  const ext = format === 'docx' ? '.docx' : '.pptx'
  
  return `Rapport_${typeLabel}_${orgClean}_${periodeClean}${ext}`
}

/**
 * Tronque un texte à une longueur maximale
 * @param texte - Texte à tronquer
 * @param maxLength - Longueur maximale
 * @returns Texte tronqué avec "..." si nécessaire
 */
export function tronquerTexte(texte: string, maxLength: number): string {
  if (!texte || texte.length <= maxLength) return texte || ''
  return texte.substring(0, maxLength - 3) + '...'
}

/**
 * Retourne la classe de couleur selon une valeur de pourcentage
 * @param pourcentage - Valeur de 0 à 100
 * @returns Nom de classe sémantique
 */
export function getCouleurStatut(pourcentage: number): 'success' | 'warning' | 'danger' {
  if (pourcentage >= 75) return 'success'
  if (pourcentage >= 50) return 'warning'
  return 'danger'
}

/**
 * Retourne le label du statut d'une activité
 * @param statut - Statut technique
 * @returns Label lisible
 */
export function getLabelStatut(statut: string): string {
  const labels: Record<string, string> = {
    'BROUILLON': 'Brouillon',
    'SOUMIS': 'Soumis',
    'EN_VERIFICATION': 'En vérification',
    'VALIDE': 'Validé',
    'REJETE': 'Rejeté',
    'CORRECTION': 'En correction',
    'CONSOLIDE': 'Consolidé',
  }
  return labels[statut?.toUpperCase()] || statut || 'Inconnu'
}
