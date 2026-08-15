"use client"

import React, { useState, useEffect, useCallback } from "react"
import { X, CheckCircle2, AlertCircle, AlertTriangle, Info } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

/* ============================================
   TYPES POUR NOTIFICATION BANNER
   ============================================ */

export type BannerType = "success" | "error" | "warning" | "info"

export interface NotificationBannerProps {
  /** Type de notification */
  type: BannerType
  /** Titre de la notification */
  title: string
  /** Description optionnelle */
  description?: string
  /** La bannière peut-elle être fermée ? */
  dismissible?: boolean
  /** Callback quand la bannière est fermée */
  onDismiss?: () => void
  /** Action optionnelle */
  action?: {
    label: string
    onClick: () => void
    variant?: "default" | "outline" | "ghost" | "link"
  }
  /** Classe CSS additionnelle */
  className?: string
  /** ID pour le stockage local (persistance) */
  storageKey?: string
  /** Icône personnalisée */
  icon?: React.ReactNode
}

/* ============================================
   CONFIGURATION PAR TYPE
   ============================================ */

interface BannerConfig {
  containerClass: string
  icon: React.ReactNode
  ariaType: string
}

const bannerConfigs: Record<BannerType, BannerConfig> = {
  success: {
    containerClass:
      "bg-emerald-50 border-emerald-200 text-emerald-900 dark:bg-emerald-950/50 dark:border-emerald-800 dark:text-emerald-100",
    icon: <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />,
    ariaType: "succès",
  },
  error: {
    containerClass:
      "bg-red-50 border-red-200 text-red-900 dark:bg-red-950/50 dark:border-red-800 dark:text-red-100",
    icon: <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />,
    ariaType: "erreur",
  },
  warning: {
    containerClass:
      "bg-amber-50 border-amber-200 text-amber-900 dark:bg-amber-950/50 dark:border-amber-800 dark:text-amber-100",
    icon: <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400" />,
    ariaType: "avertissement",
  },
  info: {
    containerClass:
      "bg-blue-50 border-blue-200 text-blue-900 dark:bg-blue-950/50 dark:border-blue-800 dark:text-blue-100",
    icon: <Info className="h-5 w-5 text-blue-600 dark:text-blue-400" />,
    ariaType: "information",
  },
}

/* ============================================
   COMPOSANT NOTIFICATION BANNER
   ============================================ */

/**
 * Composant de bannière de notification persistante
 * 
 * Affiche un message important en haut de page avec :
 * - Animation slide down/up
 * - Support du dismiss avec persistance optionnelle (localStorage)
 * - Icône selon le type
 * - Accessibilité complète (aria-live)
 * 
 * @example
 * ```tsx
 * <NotificationBanner
 *   type="warning"
 *   title="Maintenance prévue"
 *   description="Le système sera indisponible le 25 décembre"
 *   dismissible
 *   storageKey="maintenance-dec-2024"
 * />
 * ```
 */
export function NotificationBanner({
  type,
  title,
  description,
  dismissible = false,
  onDismiss,
  action,
  className,
  storageKey,
  icon: customIcon,
}: NotificationBannerProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [isAnimatingOut, setIsAnimatingOut] = useState(false)

  const config = bannerConfigs[type]
  const displayIcon = customIcon || config.icon

  // Vérifier si la bannière a déjà été dismissée
  const checkDismissed = useCallback(() => {
    if (storageKey && typeof window !== "undefined") {
      return localStorage.getItem(`banner-dismissed-${storageKey}`) === "true"
    }
    return false
  }, [storageKey])

  // Animation d'entrée
  useEffect(() => {
    if (!checkDismissed()) {
      // Petit délai pour l'animation
      requestAnimationFrame(() => {
        setIsVisible(true)
      })
    }
  }, [checkDismissed])

  // Gérer le dismiss
  const handleDismiss = useCallback(() => {
    setIsAnimatingOut(true)
    
    // Persister le dismiss si storageKey fourni
    if (storageKey && typeof window !== "undefined") {
      localStorage.setItem(`banner-dismissed-${storageKey}`, "true")
    }
    
    // Callback externe
    onDismiss?.()
    
    // Attendre la fin de l'animation avant de masquer
    setTimeout(() => {
      setIsVisible(false)
    }, 300) // Durée de l'animation
  }, [onDismiss, storageKey])

  // Ne pas render si déjà dismissée ou pas visible
  if (!isVisible && !isAnimatingOut) {
    return null
  }

  return (
    <div
      role="status"
      aria-live="polite"
      aria-label={`Notification ${config.ariaType}: ${title}`}
      className={cn(
        // Container principal
        "w-full border-b px-4 py-3 sm:px-6",
        config.containerClass,
        // Animation
        "transition-all duration-300 ease-in-out",
        isAnimatingOut
          ? "opacity-0 -translate-y-full"
          : "opacity-100 translate-y-0",
        className
      )}
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 max-w-7xl mx-auto">
        {/* Contenu principal */}
        <div className="flex items-start gap-3 flex-1 min-w-0">
          {/* Icône */}
          <div className="shrink-0 mt-0.5">
            {displayIcon}
          </div>
          
          {/* Texte */}
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-sm sm:text-base">{title}</p>
            {description && (
              <p className="text-sm opacity-80 mt-0.5">{description}</p>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 shrink-0 sm:ml-4">
          {action && (
            <Button
              size="sm"
              variant={action.variant || "outline"}
              onClick={action.onClick}
              className={cn(
                "text-xs font-medium",
                type === "success" && "border-emerald-600 text-emerald-700 hover:bg-emerald-100 dark:hover:bg-emerald-900/30",
                type === "error" && "border-red-600 text-red-700 hover:bg-red-100 dark:hover:bg-red-900/30",
                type === "warning" && "border-amber-600 text-amber-700 hover:bg-amber-100 dark:hover:bg-amber-900/30",
                type === "info" && "border-blue-600 text-blue-700 hover:bg-blue-100 dark:hover:bg-blue-900/30"
              )}
            >
              {action.label}
            </Button>
          )}
          
          {dismissible && (
            <Button
              variant="ghost"
              size="icon"
              onClick={handleDismiss}
              className={cn(
                "h-8 w-8 shrink-0",
                "hover:bg-black/5 dark:hover:bg-white/10"
              )}
              aria-label="Fermer la notification"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

/* ============================================
   COMPOSANT WRAPPER POUR BANNIÈRES MULTIPLES
   ============================================ */

export interface BannerItem extends Omit<NotificationBannerProps, "className"> {
  id: string
}

interface NotificationBannersContainerProps {
  banners: BannerItem[]
  className?: string
}

/**
 * Container pour afficher plusieurs bannières empilées
 */
export function NotificationBannersContainer({
  banners,
  className,
}: NotificationBannersContainerProps) {
  if (banners.length === 0) return null

  return (
    <div
      role="region"
      aria-label="Notifications importantes"
      className={cn("w-full", className)}
    >
      {banners.map((banner) => (
        <NotificationBanner key={banner.id} {...banner} />
      ))}
    </div>
  )
}

/* ============================================
   HOOK POUR GÉRER UNE BANNIERE AVEC ÉTAT
   ============================================ */

/**
 * Hook pour gérer une bannière de notification avec état local
 * 
 * @example
 * ```tsx
 * const { showBanner, hideBanner, bannerProps } = useNotificationBanner({
 *   type: 'info',
 *   title: 'Bienvenue !',
 * })
 * 
 * // Pour afficher
 * showBanner({ description: 'Nouveau message' })
 * ```
 */
export function useNotificationBanner(initialProps?: Partial<NotificationBannerProps>) {
  const [isVisible, setIsVisible] = useState(false)
  const [props, setProps] = useState<Partial<NotificationBannerProps>>(initialProps || {})

  const showBanner = useCallback((newProps?: Partial<NotificationBannerProps>) => {
    if (newProps) {
      setProps(newProps)
    }
    setIsVisible(true)
  }, [])

  const hideBanner = useCallback(() => {
    setIsVisible(false)
  }, [])

  const bannerProps: NotificationBannerProps | null = isVisible
    ? {
        type: props.type || "info",
        title: props.title || "",
        description: props.description,
        dismissible: props.dismissible ?? true,
        onDismiss: hideBanner,
        action: props.action,
        storageKey: props.storageKey,
        icon: props.icon,
      }
    : null

  return {
    showBanner,
    hideBanner,
    bannerProps,
    isVisible,
  }
}

export default NotificationBanner
