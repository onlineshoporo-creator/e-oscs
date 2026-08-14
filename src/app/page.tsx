'use client'

import Link from 'next/link'
import { 
  Shield, 
  ArrowRight, 
  BarChart3, 
  CheckSquare, 
  ClipboardList,
  Database,
  Zap
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-orange-900">
      {/* Header */}
      <header className="border-b border-white/10 backdrop-blur-sm bg-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-lg shadow-orange-500/25">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">e-OSCS</h1>
                <p className="text-xs text-white/60">MCNSLP Côte d'Ivoire</p>
              </div>
            </div>
            
            <Link href="/app/dashboard">
              <Button className="gap-2 bg-orange-500 hover:bg-orange-600 text-white">
                Accéder au tableau de bord
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-sm mb-6">
            <Zap className="w-4 h-4" />
            Plateforme de Gestion Intégrée
          </div>
          
          <h2 className="text-4xl lg:text-6xl font-bold text-white mb-6 leading-tight">
            Suivi des Objectifs du
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600">
              {' '}Chef de l'État
            </span>
          </h2>
          
          <p className="text-lg text-white/70 max-w-3xl mx-auto mb-8">
            e-OSCS est la plateforme numérique du Ministère MCNSLP pour le suivi, 
            l'évaluation et la reporting des activités gouvernementales en Côte d'Ivoire.
          </p>
          
          <div className="flex items-center justify-center gap-4">
            <Link href="/app/dashboard">
              <Button size="lg" className="gap-2 bg-orange-500 hover:bg-orange-600 text-white px-8">
                Démarrer maintenant
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="border-white/20 text-white hover:bg-white/10 px-8">
              En savoir plus
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
          <Card className="bg-white/5 border-white/10 backdrop-blur-sm hover:bg-white/10 transition-colors">
            <CardContent className="p-6">
              <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center mb-4">
                <ClipboardList className="w-6 h-6 text-blue-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Gestion des Activités</h3>
              <p className="text-white/60 text-sm">
                Planifiez, suivez et gérez toutes les activités du ministère avec un système centralisé.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/5 border-white/10 backdrop-blur-sm hover:bg-white/10 transition-colors">
            <CardContent className="p-6">
              <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center mb-4">
                <CheckSquare className="w-6 h-6 text-green-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Validation</h3>
              <p className="text-white/60 text-sm">
                Workflow de validation structuré pour garantir la qualité et la conformité des données.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/5 border-white/10 backdrop-blur-sm hover:bg-white/10 transition-colors">
            <CardContent className="p-6">
              <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center mb-4">
                <BarChart3 className="w-6 h-6 text-purple-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Analytics</h3>
              <p className="text-white/60 text-sm">
                Tableaux de bord et analyses approfondies pour piloter les décisions stratégiques.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/5 border-white/10 backdrop-blur-sm hover:bg-white/10 transition-colors">
            <CardContent className="p-6">
              <div className="w-12 h-12 rounded-xl bg-orange-500/20 flex items-center justify-center mb-4">
                <Database className="w-6 h-6 text-orange-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Base de données</h3>
              <p className="text-white/60 text-sm">
                Infrastructure Supabase sécurisée avec synchronisation temps réel des données.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/5 border-white/10 backdrop-blur-sm hover:bg-white/10 transition-colors">
            <CardContent className="p-6">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-emerald-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Sécurité</h3>
              <p className="text-white/60 text-sm">
                Authentification sécurisée et contrôle d'accès basé sur les rôles (RBAC).
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/5 border-white/10 backdrop-blur-sm hover:bg-white/10 transition-colors">
            <CardContent className="p-6">
              <div className="w-12 h-12 rounded-xl bg-cyan-500/20 flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-cyan-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Rapports Automatisés</h3>
              <p className="text-white/60 text-sm">
                Génération automatique de rapports Word et PowerPoint pour les réunions.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Stats */}
        <div className="mt-20 grid grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { value: '28+', label: 'Activités actives', color: 'text-blue-400' },
            { value: '5', label: 'Organisations', color: 'text-green-400' },
            { value: '72%', label: 'Taux exécution', color: 'text-orange-400' },
            { value: '1000+', label: 'Bénéficiaires', color: 'text-purple-400' },
          ].map((stat, i) => (
            <div key={i} className="text-center">
              <p className={`text-4xl font-bold ${stat.color}`}>{stat.value}</p>
              <p className="text-white/50 mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2 text-white/40 text-sm">
              <Shield className="w-4 h-4" />
              © 2024 MCNSLP Côte d'Ivoire - e-OSCS Platform
            </div>
            <p className="text-white/30 text-sm">
              Propulsé par Next.js + Supabase
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
