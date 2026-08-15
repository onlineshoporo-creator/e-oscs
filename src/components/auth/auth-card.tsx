/**
 * Composant AuthCard e-OSCS
 * 
 * Card wrapper commune pour tous les formulaires d'authentification.
 * Affiche le logo e-OSCS et enveloppe le contenu dans une card stylisée.
 */

'use client'

import React from 'react'
import { Card, CardContent } from '@/components/ui/card'

/**
 * Props du composant AuthCard
 */
interface AuthCardProps {
  /** Contenu du formulaire */
  children: React.ReactNode
  /** Titre de la card (optionnel) */
  title?: string
  /** Description sous le titre (optionnel) */
  description?: string
  /** Footer de la card (liens, etc.) */
  footer?: React.ReactNode
  /** Classe CSS additionnelle */
  className?: string
}

/**
 * Logo e-OSCS - Carré dégradé orange-vert avec "e"
 */
function EoscsLogo() {
  return (
    <div className="flex justify-center mb-6">
      <div className="relative w-16 h-16 bg-gradient-brand rounded-xl flex items-center justify-center shadow-lg">
        <span className="text-3xl font-bold text-white">e</span>
      </div>
    </div>
  )
}

export function AuthCard({ 
  children, 
  title, 
  description, 
  footer,
  className = '' 
}: AuthCardProps) {
  return (
    <div className={`w-full max-w-md mx-auto ${className}`}>
      {/* Logo e-OSCS */}
      <EoscsLogo />
      
      {/* Card principale */}
      <Card className="border-0 shadow-xl bg-white/95 backdrop-blur-sm">
        <CardContent className="p-8">
          {/* Titre optionnel */}
          {title && (
            <div className="text-center mb-6">
              <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
              {description && (
                <p className="mt-2 text-sm text-muted-foreground">{description}</p>
              )}
            </div>
          )}
          
          {/* Contenu du formulaire */}
          <div className="space-y-5">
            {children}
          </div>
          
          {/* Footer optionnel */}
          {footer && (
            <div className="mt-6 pt-5 border-t border-gray-100">
              {footer}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

/**
 * Composant pour les liens d'action secondaires dans l'auth
 */
export function AuthLink({ 
  href, 
  children,
  className = ''
}: { 
  href: string
  children: React.ReactNode
  className?: string 
}) {
  return (
    <a 
      href={href}
      className={`text-sm text-muted-foreground hover:text-primary transition-colors underline-offset-4 hover:underline ${className}`}
    >
      {children}
    </a>
  )
}

export default AuthCard
