import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// ===========================================
// Utilitaires de formatage de dates e-OSCS
// ===========================================

/**
 * Formater la date relative (ex: "Il y a 2h", "Hier")
 */
export function formatRelativeDate(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffSecs = Math.floor(diffMs / 1000)
  const diffMins = Math.floor(diffSecs / 60)
  const diffHours = Math.floor(diffMins / 60)
  const diffDays = Math.floor(diffHours / 24)

  if (diffSecs < 60) {
    return "À l'instant"
  }
  if (diffMins < 60) {
    return `Il y a ${diffMins}min`
  }
  if (diffHours < 24) {
    return `Il y a ${diffHours}h`
  }
  if (diffDays === 1) {
    return 'Hier'
  }
  if (diffDays < 7) {
    return `Il y a ${diffDays} jours`
  }

  // Format date complète pour les dates plus anciennes
  return date.toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
    year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
  })
}

/**
 * Formater une date en format français complet
 */
export function formatDateFR(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

/**
 * Formater une date courte (DD/MM/YYYY)
 */
export function formatDateShort(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}

/**
 * Obtenir le trimestre courant
 */
export function getCurrentTrimestre(): { annee: number; trimestre: number } {
  const now = new Date()
  const mois = now.getMonth() + 1 // 1-12
  const annee = now.getFullYear()
  const trimestre = Math.ceil(mois / 3) // 1-4

  return { annee, trimestre }
}

/**
 * Obtenir le label d'un trimestre (ex: "T1 2025")
 */
export function getTrimestreLabel(annee: number, trimestre: number): string {
  return `T${trimestre} ${annee}`
}

/**
 * Obtenir le label d'un mois (ex: "Janvier 2025")
 */
export function getMoisLabel(mois: number, annee?: number): string {
  const moisNoms = [
    'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
    'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
  ]
  const label = moisNoms[mois - 1] || `${mois}`
  return annee ? `${label} ${annee}` : label
}
