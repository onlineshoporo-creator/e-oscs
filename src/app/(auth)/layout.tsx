/**
 * Layout Auth e-OSCS
 * 
 * Layout partagé pour toutes les pages d'authentification.
 * - Fond dégradé subtil
 * - Centrage vertical et horizontal
 * - Pas de sidebar ni header de navigation
 */

import { ReactNode } from 'react'

/**
 * Props du layout auth
 */
interface AuthLayoutProps {
  children: ReactNode
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-orange-50/30 px-4 py-8 relative overflow-hidden">
      {/* Décorations de fond */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Cercle orange en haut à droite */}
        <div 
          className="absolute -top-40 -right-40 w-80 h-80 rounded-full opacity-[0.03]"
          style={{ backgroundColor: '#F77F00' }}
        />
        {/* Cercle vert en bas à gauche */}
        <div 
          className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full opacity-[0.03]"
          style={{ backgroundColor: '#009E60' }}
        />
        {/* Grille subtile */}
        <div 
          className="absolute inset-0 opacity-[0.015]"
          style={{
            backgroundImage: `linear-gradient(#F77F00 1px, transparent 1px), linear-gradient(90deg, #F77F00 1px, transparent 1px)`,
            backgroundSize: '60px 60px'
          }}
        />
      </div>

      {/* Contenu principal (au-dessus des décorations) */}
      <div className="relative z-10 w-full">
        {children}
      </div>
      
      {/* Footer minimaliste */}
      <footer className="absolute bottom-4 left-0 right-0 text-center">
        <p className="text-xs text-muted-foreground/60">
          © {new Date().getFullYear()} e-OSCS — MCNSLP Côte d&apos;Ivoire
        </p>
      </footer>
    </div>
  )
}
