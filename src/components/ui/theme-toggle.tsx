"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"

/**
 * ThemeToggle - Composant de bascule dark/light mode
 * 
 * Caractéristiques:
 * - Icônes soleil/lune animées avec transition smooth
 * - Utilise next-themes pour la persistance (localStorage)
 * - Respecte prefers-color-scheme du système
 * - Accessible: aria-label, navigation clavier
 * - Pas de flash au chargement (géré par ThemeProvider)
 */
export function ThemeToggle({
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  // Éviter le mismatch d'hydratation (SSR vs client)
  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <Button
        variant="ghost"
        size="icon"
        className={`relative h-9 w-9 ${className || ""}`}
        disabled
        aria-label="Changer le thème"
        {...props}
      >
        <span className="h-5 w-5" />
      </Button>
    )
  }

  const isDark = theme === "dark"

  return (
    <Button
      variant="ghost"
      size="icon"
      className={`relative h-9 w-9 overflow-hidden transition-all duration-300 hover:bg-slate-100 dark:hover:bg-slate-800 ${className || ""}`}
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={isDark ? "Passer en mode clair" : "Passer en mode sombre"}
      {...props}
    >
      {/* Icône Soleil (mode clair) */}
      <Sun
        className={`
          h-5 w-5 transition-all duration-500 ease-in-out
          ${isDark 
            ? "rotate-90 scale-0 opacity-0 absolute" 
            : "rotate-0 scale-100 opacity-100"
          }
          text-amber-500
        `}
        strokeWidth={2}
      />
      
      {/* Icône Lune (mode sombre) */}
      <Moon
        className={`
          h-5 w-5 transition-all duration-500 ease-in-out
          ${!isDark 
            ? "-rotate-90 scale-0 opacity-0 absolute" 
            : "rotate-0 scale-100 opacity-100"
          }
          text-slate-400
        `}
        strokeWidth={2}
      />

      {/* Animation subtile de glow */}
      <span 
        className={`
          absolute inset-0 rounded-full transition-opacity duration-500
          ${isDark 
            ? "bg-gradient-to-br from-indigo-500/10 to-purple-500/10 opacity-100" 
            : "opacity-0"
          }
        `}
        aria-hidden="true"
      />
    </Button>
  )
}

/**
 * ThemeToggleCompact - Version compacte pour les headers existants
 * Moins de padding, s'intègre mieux dans les barres d'actions
 */
export function ThemeToggleCompact({
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <button
        className={`p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:text-slate-300 dark:hover:bg-slate-800 transition-colors ${className || ""}`}
        disabled
        aria-label="Changer le thème"
        {...props}
      >
        <span className="h-4 w-4" />
      </button>
    )
  }

  const isDark = theme === "dark"

  return (
    <button
      className={`
        p-2 rounded-lg transition-all duration-300
        ${isDark 
          ? "text-indigo-400 hover:text-indigo-300 hover:bg-slate-800/80" 
          : "text-slate-400 hover:text-amber-500 hover:bg-amber-50"
        }
        ${className || ""}
      `}
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={isDark ? "Passer en mode clair" : "Passer en mode sombre"}
      {...props}
    >
      {/* Soleil */}
      <Sun
        className={`
          h-4 w-4 transition-all duration-300
          ${isDark ? "scale-0 rotate-45 absolute" : "scale-100 rotate-0"}
        `}
        strokeWidth={2}
      />
      
      {/* Lune */}
      <Moon
        className={`
          h-4 w-4 transition-all duration-300
          ${!isDark ? "scale-0 -rotate-45 absolute" : "scale-100 rotate-0"}
        `}
        strokeWidth={2}
      />
    </button>
  )
}

/**
 * ThemeProviderWrapper - Wrapper pour next-themes ThemeProvider
 * À utiliser dans le layout racine pour éviter le flash de thème
 */
export function ThemeProviderWrapper({ 
  children 
}: { 
  children: React.ReactNode 
}) {
  return (
    <>
      {/* Script inline pour éviter le flash de thème au chargement */}
      <script
        dangerouslySetInnerHTML={{
          __html: `
            try {
              const theme = localStorage.getItem('theme');
              if (theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                document.documentElement.classList.add('dark');
              }
            } catch (_) {}
          `,
        }}
      />
      {children}
    </>
  )
}
