"use client"

import { useToast } from "@/hooks/use-toast"
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast"
import { CheckCircle2, AlertCircle, AlertTriangle, Info } from "lucide-react"

/* ============================================
   ICÔNES PAR TYPE DE TOAST
   ============================================ */

const variantIcons = {
  default: null,
  destructive: <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />,
  success: <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />,
  warning: <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400" />,
  info: <Info className="h-5 w-5 text-blue-600 dark:text-blue-400" />,
}

type VariantType = keyof typeof variantIcons

/**
 * Toaster principal e-OSCS
 * 
 * Affiche les notifications toast avec :
 * - Icône selon le type (success, error, warning, info)
 * - Animation slide-in depuis la droite
 * - Support des actions personnalisées
 * - Position top-right par défaut, responsive sur mobile
 */
export function Toaster() {
  const { toasts } = useToast()

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, variant = "default", ...props }) {
        const icon = variantIcons[variant as VariantType]
        
        return (
          <Toast key={id} variant={variant} {...props}>
            <div className="flex items-start gap-3">
              {/* Icône du type */}
              {icon && <div className="shrink-0 mt-0.5">{icon}</div>}
              
              {/* Contenu */}
              <div className="grid gap-1 flex-1 min-w-0">
                {title && <ToastTitle>{title}</ToastTitle>}
                {description && (
                  <ToastDescription>{description}</ToastDescription>
                )}
              </div>
              
              {/* Action */}
              {action}
            </div>
            <ToastClose />
          </Toast>
        )
      })}
      <ToastViewport />
    </ToastProvider>
  )
}
