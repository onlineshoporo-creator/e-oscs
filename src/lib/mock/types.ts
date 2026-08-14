// Types pour e-OSCS
export interface Activite {
  id: string
  nom: string
  description: string
  intitule: string
  statut: 'planifie' | 'en_cours' | 'termine' | 'annule' | 'valide' | 'rejete' | 'en_attente'
  dateActivite: string
  dateFinPrevue?: string
  lieu: string
  budgetAlloue: number
  budgetDepense: number
  progression: number
  categorie: string
  organisationId: string
  organisationNom: string
  responsable: string
  beneficiairesCount: number
  indicateursCount: number
  createdAt: string
}

export interface Organisation {
  id: string
  nom: string
  type: 'ministere' | 'direction' | 'service' | 'division'
  description: string
  parentId?: string
  parentNom?: string
  activitesCount: number
  tauxExecution: number
}

export interface Indicateur {
  id: string
  nom: string
  type: 'quantitatif' | 'qualitatif'
  unite?: string
  cibleValeur?: number
  valeurActuelle?: number
  progression: number
  activiteId: string
  activiteNom: string
}

export interface Beneficiaire {
  id: string
  nom: string
  type: 'physique' | 'morale' | 'groupe'
  categorie: string
  localisation: string
  activiteId: string
}

export interface StatMensuelle {
  mois: string
  annee: number
  activitesPlanifiees: number
  activitesRealisees: number
  tauxExecution: number
  budgetAlloue: number
  budgetDepense: number
  beneficiairesAtteints: number
}

// Statuts avec couleurs
export const STATUT_CONFIG = {
  planifie: { label: 'Planifiée', color: 'bg-slate-100 text-slate-700', dotColor: 'bg-slate-400' },
  en_cours: { label: 'En cours', color: 'bg-blue-100 text-blue-700', dotColor: 'bg-blue-500' },
  termine: { label: 'Terminée', color: 'bg-green-100 text-green-700', dotColor: 'bg-green-500' },
  annule: { label: 'Annulée', color: 'bg-red-100 text-red-700', dotColor: 'bg-red-500' },
  valide: { label: 'Validée', color: 'bg-emerald-100 text-emerald-700', dotColor: 'bg-emerald-500' },
  rejete: { label: 'Rejetée', color: 'bg-red-100 text-red-700', dotColor: 'bg-red-500' },
  en_attente: { label: 'En attente', color: 'bg-orange-100 text-orange-700', dotColor: 'bg-orange-500' },
} as const

export const CATEGORIES = [
  'Formation',
  'Atelier',
  'Réunion',
  'Sensibilisation',
  'Évaluation',
  'Planning',
  'Rapport',
  'Autre',
]

export const ORGANISATION_TYPES = {
  ministere: { label: 'Ministère', color: 'bg-purple-100 text-purple-700' },
  direction: { label: 'Direction', color: 'bg-blue-100 text-blue-700' },
  service: { label: 'Service', color: 'bg-green-100 text-green-700' },
  division: { label: 'Division', color: 'bg-orange-100 text-orange-700' },
} as const
