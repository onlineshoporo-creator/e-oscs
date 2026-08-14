import { Activite, Organisation, Indicateur, Beneficiaire, StatMensuelle, STATUT_CONFIG, CATEGORIES, ORGANISATION_TYPES } from './types'

// Ré-exports pour commodité
export { STATUT_CONFIG, CATEGORIES, ORGANISATION_TYPES }
export type { Activite, Organisation, Indicateur, Beneficiaire, StatMensuelle }

// Organisations mock
export const organisations: Organisation[] = [
  {
    id: 'org-001',
    nom: 'Ministère MCNSLP',
    type: 'ministere',
    description: 'Ministère de la Solidité Sociale, de la Lutte contre la Pauvreté et des Personnes Âgées',
    activitesCount: 28,
    tauxExecution: 72.5,
  },
  {
    id: 'org-002',
    nom: 'Direction de la Planification',
    type: 'direction',
    description: 'Direction chargée de la planification stratégique',
    parentId: 'org-001',
    parentNom: 'Ministère MCNSLP',
    activitesCount: 12,
    tauxExecution: 85.2,
  },
  {
    id: 'org-003',
    nom: 'Direction des Programmes Sociaux',
    type: 'direction',
    description: 'Direction des programmes sociaux et d\'accompagnement',
    parentId: 'org-001',
    parentNom: 'Ministère MCNSLP',
    activitesCount: 15,
    tauxExecution: 68.4,
  },
  {
    id: 'org-004',
    nom: 'Service Formation',
    type: 'service',
    description: 'Service de formation continue',
    parentId: 'org-002',
    parentNom: 'Direction de la Planification',
    activitesCount: 8,
    tauxExecution: 91.3,
  },
  {
    id: 'org-005',
    nom: 'Service Suivi-Évaluation',
    type: 'service',
    description: 'Service du suivi et évaluation des programmes',
    parentId: 'org-002',
    parentNom: 'Direction de la Planification',
    activitesCount: 6,
    tauxExecution: 78.9,
  },
]

// Activités mock
export const activites: Activite[] = [
  {
    id: 'act-001',
    nom: 'Formation des cadres sur le nouveau système e-OSCS',
    description: 'Session de formation intensive pour les cadres du ministère sur l\'utilisation de la plateforme e-OSCS',
    intitule: 'Formation e-OSCS Niveau 1',
    statut: 'en_cours',
    dateActivite: '2026-01-15',
    dateFinPrevue: '2026-01-17',
    lieu: 'Salle de conférence MCNSLP, Abidjan-Plateau',
    budgetAlloue: 2500000,
    budgetDepense: 1250000,
    progression: 50,
    categorie: 'Formation',
    organisationId: 'org-004',
    organisationNom: 'Service Formation',
    responsable: 'M. Koné Ibrahim',
    beneficiairesCount: 45,
    indicateursCount: 4,
    createdAt: '2025-12-20T10:00:00Z',
  },
  {
    id: 'act-002',
    nom: 'Atelier de planification annuelle 2026',
    description: 'Atelier de planification des activités pour l\'année 2026 avec toutes les directions',
    intitule: 'Atelier Planning 2026',
    statut: 'termine',
    dateActivite: '2026-01-10',
    dateFinPrevue: '2026-01-11',
    lieu: 'Hôtel Sofitel, Abidjan',
    budgetAlloue: 5000000,
    budgetDepense: 4800000,
    progression: 100,
    categorie: 'Atelier',
    organisationId: 'org-002',
    organisationNom: 'Direction de la Planification',
    responsable: 'Mme Diallo Aminata',
    beneficiairesCount: 35,
    indicateursCount: 6,
    createdAt: '2025-12-15T08:00:00Z',
  },
  {
    id: 'act-003',
    nom: 'Sensibilisation programme filets sociaux',
    description: 'Campagne de sensibilisation sur les filets sociaux dans la région d\'Abidjan',
    intitule: 'Sensibilisation Filets Sociaux',
    statut: 'en_attente',
    dateActivite: '2026-02-05',
    lieu: 'Commune de Yopougon, Abidjan',
    budgetAlloue: 1500000,
    budgetDepense: 0,
    progression: 0,
    categorie: 'Sensibilisation',
    organisationId: 'org-003',
    organisationNom: 'Direction des Programmes Sociaux',
    responsable: 'M. Yao Serge',
    beneficiairesCount: 500,
    indicateursCount: 3,
    createdAt: '2026-01-08T14:00:00Z',
  },
  {
    id: 'act-004',
    nom: 'Évaluation mi-parcours programmes Q1',
    description: 'Évaluation à mi-parcours des programmes du premier trimestre 2026',
    intitule: 'Évaluation Q1-2026',
    statut: 'planifie',
    dateActivite: '2026-02-15',
    dateFinPrevue: '2026-02-16',
    lieu: 'Salle MCNSLP',
    budgetAlloue: 800000,
    budgetDepense: 0,
    progression: 10,
    categorie: 'Évaluation',
    organisationId: 'org-005',
    organisationNom: 'Service Suivi-Évaluation',
    responsable: 'Mme Kouadio Marie',
    beneficiairesCount: 12,
    indicateursCount: 8,
    createdAt: '2026-01-12T09:00:00Z',
  },
  {
    id: 'act-005',
    nom: 'Réunion de coordination mensuelle',
    description: 'Réunion de coordination entre toutes les directions du ministère',
    intitute: 'Coordination Mensuelle Janvier',
    statut: 'valide',
    dateActivite: '2026-01-25',
    lieu: 'Salle du Conseil, MCNSLP',
    budgetAlloue: 200000,
    budgetDepense: 180000,
    progression: 100,
    categorie: 'Réunion',
    organisationId: 'org-001',
    organisationNom: 'Ministère MCNSLP',
    responsable: 'Dr Bamba Kolo',
    beneficiairesCount: 25,
    indicateursCount: 2,
    createdAt: '2026-01-18T11:00:00Z',
  },
  {
    id: 'act-006',
    nom: 'Formation gestionnaires de programmes',
    description: 'Formation avancée pour les gestionnaires de programmes sur les outils de suivi',
    intitule: 'Formation Gestionnaires Niveau 2',
    statut: 'en_attente',
    dateActivite: '2026-02-20',
    dateFinPrevue: '2026-02-22',
    lieu: 'Centre de Formation, Bingerville',
    budgetAlloue: 3500000,
    budgetDepense: 0,
    progression: 0,
    categorie: 'Formation',
    organisationId: 'org-004',
    organisationNom: 'Service Formation',
    responsable: 'M. Koné Ibrahim',
    beneficiairesCount: 30,
    indicateursCount: 5,
    createdAt: '2026-01-14T16:00:00Z',
  },
  {
    id: 'act-007',
    nom: 'Mission terrain régions Centre',
    description: 'Mission de suivi des activités dans les régions du centre (Yamoussoukro, Bouaké)',
    intitule: 'Mission Terrain Centre',
    statut: 'en_cours',
    dateActivite: '2026-01-28',
    dateFinPrevue: '2026-01-31',
    lieu: 'Yamoussoukro - Bouaké',
    budgetAlloue: 4200000,
    budgetDepense: 2100000,
    progression: 45,
    categorie: 'Autre',
    organisationId: 'org-005',
    organisationNom: 'Service Suivi-Évaluation',
    responsable: 'Mme Kouadio Marie',
    beneficiairesCount: 120,
    indicateursCount: 4,
    createdAt: '2026-01-20T07:00:00Z',
  },
  {
    id: 'act-008',
    nom: 'Rapport d\'activités janvier 2026',
    description: 'Compilation et rédaction du rapport mensuel d\'activités pour janvier 2026',
    intitule: 'Rapport Mensuel Janvier 2026',
    statut: 'planifie',
    dateActivite: '2026-02-01',
    lieu: 'MCNSLP (interne)',
    budgetAlloue: 300000,
    budgetDepense: 0,
    progression: 15,
    categorie: 'Rapport',
    organisationId: 'org-002',
    organisationNom: 'Direction de la Planification',
    responsable: 'Mme Diallo Aminata',
    beneficiairesCount: 1,
    indicateursCount: 10,
    createdAt: '2026-01-22T13:00:00Z',
  },
  {
    id: 'act-009',
    nom: 'Lancement programme vulnérables',
    description: 'Cérémonie officielle de lancement du programme d\'accompagnement des personnes vulnérables',
    intitule: 'Lancement Programme Vulnérables',
    statut: 'en_attente',
    dateActivite: '2026-02-10',
    lieu: 'Palais de la Culture, Abidjan',
    budgetAlloue: 8000000,
    budgetDepense: 500000,
    progression: 5,
    categorie: 'Autre',
    organisationId: 'org-003',
    organisationNom: 'Direction des Programmes Sociaux',
    responsable: 'M. Yao Serge',
    beneficiairesCount: 200,
    indicateursCount: 7,
    createdAt: '2026-01-23T10:00:00Z',
  },
  {
    id: 'act-010',
    nom: 'Audit interne systèmes information',
    description: 'Audit des systèmes d\'information et de la plateforme e-OSCS',
    intitule: 'Audit SI e-OSCS',
    statut: 'planifie',
    dateActivite: '2026-02-25',
    dateFinPrevue: '2026-02-28',
    lieu: 'MCNSLP + Sites distants',
    budgetAlloue: 1200000,
    budgetDepense: 0,
    progression: 0,
    catégorie: 'Évaluation',
    organisationId: 'org-001',
    organisationNom: 'Ministère MCNSLP',
    responsable: 'Dr Bamba Kolo',
    beneficiairesCount: 5,
    indicateursCount: 6,
    createdAt: '2026-01-24T09:00:00Z',
  },
]

// Indicateurs mock
export const indicateurs: Indicateur[] = [
  { id: 'ind-001', nom: 'Taux de participation', type: 'quantitatif', unite: '%', cibleValeur: 90, valeurActuelle: 85, progression: 94.4, activiteId: 'act-001', activiteNom: 'Formation e-OSCS' },
  { id: 'ind-002', nom: 'Satisfaction participants', type: 'quantitatif', unite: '%', cibleValeur: 85, valeurActuelle: 88, progression: 103.5, activiteId: 'act-001', activiteNom: 'Formation e-OSCS' },
  { id: 'ind-003', nom: 'Nombre de plans validés', type: 'quantitatif', unite: 'plans', cibleValeur: 12, valeurActuelle: 10, progression: 83.3, activiteId: 'act-002', activiteNom: 'Atelier Planning 2026' },
  { id: 'ind-004', nom: 'Personnes sensibilisées', type: 'quantitatif', unite: 'personnes', cibleValeur: 500, valeurActuelle: 0, progression: 0, activiteId: 'act-003', activiteNom: 'Sensibilisation Filets' },
  { id: 'ind-005', nom: 'Taux de couverture', type: 'quantitatif', unite: '%', cibleValeur: 75, valeurActuelle: 60, progression: 80, activiteId: 'act-007', activiteNom: 'Mission Terrain' },
]

// Bénéficiaires mock
export const beneficiaires: Beneficiaire[] = [
  { id: 'ben-001', nom: 'Cadres MCNSLP', type: 'physique', categorie: 'Interne', localisation: 'Abidjan', activiteId: 'act-001' },
  { id: 'ben-002', nom: 'Directeurs de direction', type: 'groupe', categorie: 'Interne', localisation: 'Abidjan', activiteId: 'act-002' },
  { id: 'ben-003', nom: 'Population Yopougon', type: 'groupe', categorie: 'Externe', localisation: 'Yopougon', activiteId: 'act-003' },
  { id: 'ben-004', nom: 'Gestionnaires programmes', type: 'groupe', categorie: 'Interne', localisation: 'National', activiteId: 'act-006' },
  { id: 'ben-005', nom: 'Habitants Yamoussoukro', type: 'groupe', categorie: 'Externe', localisation: 'Yamoussoukro', activiteId: 'act-007' },
]

// Statistiques mensuelles
export const statsMensuelles: StatMensuelle[] = [
  { mois: 'Septembre', annee: 2025, activitesPlanifiees: 22, activitesRealisees: 18, tauxExecution: 81.8, budgetAlloue: 15000000, budgetDepense: 13500000, beneficiairesAtteints: 850 },
  { mois: 'Octobre', annee: 2025, activitesPlanifiees: 25, activitesRealisees: 21, tauxExecution: 84.0, budgetAlloue: 18000000, budgetDepense: 16200000, beneficiairesAtteints: 1020 },
  { mois: 'Novembre', annee: 2025, activitesPlanifiees: 28, activitesRealisees: 24, tauxExecution: 85.7, budgetAlloue: 16500000, budgetDepense: 14850000, beneficiairesAtteints: 980 },
  { mois: 'Décembre', annee: 2025, activitesPlanifiees: 30, activitesRealisees: 26, tauxExecution: 86.7, budgetAlloue: 22000000, budgetDepense: 19800000, beneficiairesAtteints: 1250 },
  { mois: 'Janvier', annee: 2026, activitesPlanifiees: 32, activitesRealisees: 24, tauxExecution: 75.0, budgetAlloue: 19500000, budgetDepense: 11235000, beneficiairesAtteints: 720 },
]

// Helper functions
export function getActiviteById(id: string): Activite | undefined {
  return activites.find(a => a.id === id)
}

export function getActivitesByStatut(statut: Activite['statut']): Activite[] {
  return activites.filter(a => a.statut === statut)
}

export function getActivitesByOrganisation(orgId: string): Activite[] {
  return activites.filter(a => a.organisationId === orgId)
}

export function getIndicateursByActivite(activiteId: string): Indicateur[] {
  return indicateurs.filter(i => i.activiteId === activiteId)
}

export function formatMontant(montant: number): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'XOF',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(montant)
}
