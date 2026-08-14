'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Database, 
  CheckCircle2, 
  XCircle, 
  Loader2,
  Server,
  Shield,
  Globe
} from 'lucide-react'

interface SupabaseStatus {
  success: boolean
  message: string
  projectUrl: string
  activitiesCount: number
  timestamp: string
  note?: string
  error?: string
}

export default function Home() {
  const [status, setStatus] = useState<SupabaseStatus | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkSupabaseConnection()
  }, [])

  async function checkSupabaseConnection() {
    try {
      setLoading(true)
      const response = await fetch('/api/supabase')
      const data = await response.json()
      setStatus(data)
    } catch (error) {
      console.error('Erreur:', error)
      setStatus({
        success: false,
        message: 'Erreur de connexion',
        projectUrl: '',
        activitiesCount: 0,
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : 'Erreur inconnue'
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 md:p-8">
      {/* Header */}
      <header className="max-w-6xl mx-auto mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-lg">
              <Globe className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
                e-OSCS
              </h1>
              <p className="text-sm text-slate-500">
                Plateforme de Suivi des Objectifs du Chef de l'État
              </p>
            </div>
          </div>
          <Badge variant={status?.success ? "default" : "destructive"} className="hidden md:flex">
            {status?.success ? "En ligne" : "Hors ligne"}
          </Badge>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        
        {/* Status Card */}
        <Card className="md:col-span-2 lg:col-span-2">
          <CardHeader className="flex flex-row items-center gap-4">
            <div className={`p-3 rounded-full ${status?.success ? 'bg-green-100' : 'bg-red-100'}`}>
              {loading ? (
                <Loader2 className={`w-6 h-6 animate-spin ${status?.success ? 'text-green-600' : 'text-red-600'}`} />
              ) : status?.success ? (
                <CheckCircle2 className="w-6 h-6 text-green-600" />
              ) : (
                <XCircle className="w-6 h-6 text-red-600" />
              )}
            </div>
            <div className="flex-1">
              <CardTitle className="text-xl">
                Connexion Supabase
              </CardTitle>
              <CardDescription>
                {loading ? 'Vérification de la connexion...' : status?.message}
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            {status && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="space-y-1">
                    <p className="text-slate-500">URL du Projet</p>
                    <p className="font-mono text-xs bg-slate-100 p-2 rounded break-all">
                      {status.projectUrl || 'N/A'}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-slate-500">Activités</p>
                    <p className="text-2xl font-bold text-slate-900">
                      {status.activitiesCount ?? 'N/A'}
                    </p>
                  </div>
                </div>
                
                {status.note && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-800">
                    ℹ️ {status.note}
                  </div>
                )}

                {status.error && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-800">
                    ❌ Erreur: {status.error}
                  </div>
                )}

                <Button 
                  onClick={checkSupabaseConnection} 
                  variant="outline" 
                  size="sm"
                  disabled={loading}
                >
                  {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  Vérifier à nouveau
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Info Cards */}
        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <Database className="w-5 h-5 text-orange-500" />
                <CardTitle className="text-base">Base de données</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-500">Fournisseur</span>
                  <span className="font-medium">Supabase (PostgreSQL)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Statut</span>
                  <Badge variant={status?.success ? "default" : "destructive"} className="text-xs">
                    {status?.success ? "Connecté" : "Déconnecté"}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-green-500" />
                <CardTitle className="text-base">Authentification</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-500">Méthode</span>
                  <span className="font-medium">Supabase Auth</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Middleware</span>
                  <Badge variant="outline" className="text-xs">Actif</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <Server className="w-5 h-5 text-blue-500" />
                <CardTitle className="text-base">API</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-500">Endpoint Test</span>
                  <code className="text-xs bg-slate-100 px-1 rounded">/api/supabase</code>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Client JS</span>
                  <Badge variant="outline" className="text-xs">@supabase/ssr</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-6xl mx-auto mt-12 pt-6 border-t border-slate-200">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-slate-500">
          <p>© 2024 MCNSLP Côte d'Ivoire - e-OSCS Platform</p>
          <p>Propulsé par Next.js + Supabase</p>
        </div>
      </footer>
    </div>
  )
}
