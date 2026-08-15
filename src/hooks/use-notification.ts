"use client"

import { useToast } from "@/hooks/use-toast"
import { toast as sonnerToast } from "sonner"
import type { ToastActionElement } from "@/components/ui/toast"

/* ============================================
   TYPES DE NOTIFICATION e-OSCS
   ============================================ */

export type NotificationType = "success" | "error" | "warning" | "info"

export interface NotificationOptions {
  title: string
  description?: string
  type?: NotificationType
  duration?: number // ms, default 5000
  action?: {
    label: string
    onClick: () => void
  }
  /** Utiliser Sonner au lieu du toaster par défaut (pour toasts plus riches) */
  useSonner?: boolean
}

export interface NotificationResult {
  id: string
  dismiss: () => void
  update: (options: Partial<NotificationOptions>) => void
}

/* ============================================
   CONFIGURATION PAR TYPE DE NOTIFICATION
   ============================================ */

interface TypeConfig {
  variant: "default" | "destructive" | "success" | "warning" | "info"
  className: string
  icon?: React.ReactNode
  sonnerTheme?: {
    className: string
  }
}

const notificationTypeConfigs: Record<NotificationType, TypeConfig> = {
  success: {
    variant: "success",
    className: 
      "border-green-200 bg-green-50 text-green-900 dark:border-green-800 dark:bg-green-950 dark:text-green-100",
    sonnerTheme: {
      className: "bg-green-50 border border-green-200 text-green-900 dark:bg-green-950 dark:border-green-800 dark:text-green-100",
    },
  },
  error: {
    variant: "destructive",
    className: 
      "border-red-200 bg-red-50 text-red-900 dark:border-red-800 dark:bg-red-950 dark:text-red-100",
    sonnerTheme: {
      className: "bg-red-50 border border-red-200 text-red-900 dark:bg-red-950 dark:border-red-800 dark:text-red-100",
    },
  },
  warning: {
    variant: "warning",
    className: 
      "border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-100",
    sonnerTheme: {
      className: "bg-amber-50 border border-amber-200 text-amber-900 dark:bg-amber-950 dark:border-amber-800 dark:text-amber-100",
    },
  },
  info: {
    variant: "info",
    className: 
      "border-blue-200 bg-blue-50 text-blue-900 dark:border-blue-800 dark:bg-blue-950 dark:text-blue-100",
    sonnerTheme: {
      className: "bg-blue-50 border border-blue-200 text-blue-900 dark:bg-blue-950 dark:border-blue-800 dark:text-blue-100",
    },
  },
}

/* ============================================
   HOOK PRINCIPAL - useNotification
   ============================================ */

/**
 * Hook de notification amélioré pour e-OSCS
 * 
 * Fournit une API typée pour les notifications toast avec :
 * - Types prédéfinis (success, error, warning, info)
 * - Styles cohérents avec la charte graphique e-OSCS
 * - Support des actions personnalisées
 * - Compatibilité avec le système existant
 * 
 * @example
 * ```tsx
 * const { notify, success, error, warning, info, dismissAll } = useNotification()
 * 
 * // Notification simple
 * success("Opération réussie", "Les données ont été enregistrées")
 * 
 * // Notification avec action
 * error("Erreur", "Une erreur est survenue", {
 *   action: { label: "Réessayer", onClick: retryFunction }
 * })
 * ```
 */
export function useNotification() {
  const { toast: baseToast, dismiss: baseDismiss, toasts } = useToast()

  /**
   * Crée et affiche une notification
   */
  const notify = (options: NotificationOptions): NotificationResult => {
    const {
      title,
      description,
      type = "info",
      duration = 5000,
      action,
      useSonner = false,
    } = options

    const config = notificationTypeConfigs[type]

    if (useSonner) {
      // Utiliser Sonner pour des toasts plus riches
      const id = sonnerToast(title, {
        description,
        duration,
        action: action && {
          label: action.label,
          onClick: action.onClick,
        },
        className: config.sonnerTheme?.className,
      })

      return {
        id: String(id),
        dismiss: () => sonnerToast.dismiss(id),
        update: () => {
          // Sonner ne supporte pas facilement l'update
          console.warn("useNotification: update() n'est pas supporté avec Sonner")
        },
      }
    }

    // Utiliser le toaster Radix par défaut
    const result = baseToast({
      title,
      description,
      variant: config.variant as "default" | "destructive",
      className: config.className,
      duration,
      action: action &&
        ({
          altText: action.label,
          onClick: action.onClick,
        }) as ToastActionElement,
    })

    return result as NotificationResult
  }

  /**
   * Raccourci pour notification de succès
   */
  const success = (
    title: string, 
    description?: string, 
    options?: Omit<NotificationOptions, "title" | "description" | "type">
  ) => notify({ title, description, type: "success", ...options })

  /**
   * Raccourci pour notification d'erreur
   */
  const error = (
    title: string, 
    description?: string, 
    options?: Omit<NotificationOptions, "title" | "description" | "type">
  ) => notify({ title, description, type: "error", ...options })

  /**
   * Raccourci pour notification d'avertissement
   */
  const warning = (
    title: string, 
    description?: string, 
    options?: Omit<NotificationOptions, "title" | "description" | "type">
  ) => notify({ title, description, type: "warning", ...options })

  /**
   * Raccourci pour notification d'information
   */
  const info = (
    title: string, 
    description?: string, 
    options?: Omit<NotificationOptions, "title" | "description" | "type">
  ) => notify({ title, description, type: "info", ...options })

  /**
   * Dismiss toutes les notifications
   */
  const dismissAll = () => baseDismiss()

  /**
   * Dismiss une notification spécifique
   */
  const dismiss = (id?: string) => baseDismiss(id)

  return {
    /** Liste des toasts actuels */
    toasts,
    /** Crée une notification personnalisée */
    notify,
    /** Notification de succès (vert) */
    success,
    /** Notification d'erreur (rouge) */
    error,
    /** Notification d'avertissement (ambre) */
    warning,
    /** Notification d'information (bleu) */
    info,
    /** Ferme toutes les notifications */
    dismissAll,
    /** Ferme une notification spécifique */
    dismiss,
  }
}

/* ============================================
   EXPORTS POUR UTILISATION SANS HOOK
   ============================================ */

/**
 * Fonction statique pour notifier depuis un contexte non-Réactif
 * (ex: dans un utilitaire ou un callback)
 * 
 * Note: Pour une utilisation optimale, préférez le hook useNotification()
 */
export const notification = {
  success: (title: string, description?: string, options?: Omit<NotificationOptions, "title" | "description" | "type">) => {
    if (typeof window !== "undefined") {
      const config = notificationTypeConfigs.success
      return sonnerToast.success(title, {
        description,
        ...options,
        className: config.sonnerTheme?.className,
      })
    }
  },
  error: (title: string, description?: string, options?: Omit<NotificationOptions, "title" | "description" | "type">) => {
    if (typeof window !== "undefined") {
      const config = notificationTypeConfigs.error
      return sonnerToast.error(title, {
        description,
        ...options,
        className: config.sonnerTheme?.className,
      })
    }
  },
  warning: (title: string, description?: string, options?: Omit<NotificationOptions, "title" | "description" | "type">) => {
    if (typeof window !== "undefined") {
      const config = notificationTypeConfigs.warning
      return sonnerToast.warning(title, {
        description,
        ...options,
        className: config.sonnerTheme?.className,
      })
    }
  },
  info: (title: string, description?: string, options?: Omit<NotificationOptions, "title" | "description" | "type">) => {
    if (typeof window !== "undefined") {
      const config = notificationTypeConfigs.info
      return sonnerToast.info(title, {
        description,
        ...options,
        className: config.sonnerTheme?.className,
      })
    }
  },
}
