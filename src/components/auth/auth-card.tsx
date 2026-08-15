/**
 * Composant AuthCard e-OSCS
 * 
 * Card wrapper commune pour tous les formulaires d'authentification.
 * Affiche le logo e-OSCS officiel et enveloppe le contenu dans une card stylisée.
 */

'use client'

import React from 'react'
import Image from 'next/image'
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
  /** Cacher le logo (pour les vues alternatives) */
  hideLogo?: boolean
}

/**
 * Logo e-OSCS officiel - Image avec décoration
 */
function EoscsLogo() {
  return (
    <div className="flex justify-center mb-6">
      <div className="relative group">
        {/* Anneau de décoration animée */}
        <div className="absolute -inset-2 bg-gradient-to-br from-[#F77F00] via-transparent to-[#009E60] rounded-2xl opacity-20 group-hover:opacity-30 blur transition-opacity duration-500" />
        
        {/* Container du logo */}
        <div className="relative bg-white rounded-2xl p-3 shadow-lg border border-gray-100">
          <Image
            src="/logo-eoscs.png"
            alt="e-OSCS Logo - MCNSLP Côte d'Ivoire"
            width={120}
            height={80}
            className="h-16 w-auto object-contain"
            priority
          />
        </div>
      </div>
    </div>
  )
}

export function AuthCard({ 
  children, 
  title, 
  description, 
  footer,
  className = '',
  hideLogo = false
}: AuthCardProps) {
  return (
    <div className={`w-full max-w-md mx-auto ${className}`}>
      {/* Logo e-OSCS (sauf si caché) */}
      {!hideLogo && <EoscsLogo />}
      
      {/* Card principale */}
      <Card className="border-0 shadow-xl bg-white/95 backdrop-blur-sm overflow-hidden">
        {/* Liseré tricolore CI en haut */}
        <div className="h-1.5 bg-gradient-to-r from-[#F77F00] via-white to-[#009E60]" />
        
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
