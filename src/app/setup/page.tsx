/**
 * Page d'Installation - Initialisation du Super Admin
 * 
 * Cette page permet d'initialiser le compte Super Administrateur
 * avec les identifiants par défaut.
 */

'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ShieldCheck, UserPlus, CheckCircle2, Loader2, AlertCircle, ArrowRight } from 'lucide-react'

interface SetupStatus {
  exists: boolean
  user?: {
    id: string
    email: string
    nom_complet: string
    is_super_admin: boolean
    actif: boolean
  }
  error?: string
}

export default function SetupPage() {
  const [status, setStatus] = useState<SetupStatus | null>(null)
  const [loading, setLoading] = useState(false)
  const [settingUp, setSettingUp] = useState(false)
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null)

  // Vérifier le statut au chargement
  useEffect(() => {
    checkStatus()
  }, [])

  async function checkStatus() {
    setLoading(true)
    try {
      const res = await fetch('/api/setup/super-admin')
      const data = await res.json()
      setStatus(data)
    } catch (error) {
      console.error('Erreur vérification statut:', error)
      setStatus({ exists: false, error: 'Impossible de vérifier le statut' })
    } finally {
      setLoading(false)
    }
  }

  async function initializeSuperAdmin() {
    setSettingUp(true)
    setResult(null)

    try {
      const res = await fetch('/api/setup/super-admin', { method: 'POST' })
      const data = await res.json()

      if (data.success) {
        setResult({
          success: true,
          message: `Super Admin créé avec succès! Email: ${data.credentials.email}`
        })
        // Rafraîchir le statut
        await checkStatus()
      } else {
        setResult({
          success: false,
          message: data.error || 'Erreur lors de la création'
        })
      }
    } catch (error) {
      setResult({
        success: false,
        message: 'Erreur de connexion au serveur'
      })
    } finally {
      setSettingUp(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-orange-900 flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-500 rounded-2xl mb-4 shadow-lg shadow-orange-500/30">
            <ShieldCheck className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">
            e-OSCS Installation
          </h1>
          <p className="text-slate-400">
            Configuration initiale du Super Administrateur
          </p>
        </div>

        {/* Carte principale */}
        <Card className="bg-white/10 backdrop-blur-md border-white/20 text-white">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserPlus className="w-5 h-5 text-orange-400" />
              Super Admin
            </CardTitle>
            <CardDescription className="text-slate-400">
              Compte administrateur principal avec tous les privilèges
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Identifiants */}
            <div className="p-4 bg-slate-800/50 rounded-xl border border-slate-700">
              <p className="text-sm font-medium text-slate-300 mb-3">Identifiants par défaut :</p>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-400">Email :</span>
                  <code className="px-2 py-1 bg-slate-900 rounded text-orange-300 text-sm">
                    omouitsi@gmail.com
                  </code>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-400">Mot de passe :</span>
                  <code className="px-2 py-1 bg-slate-900 rounded text-green-300 text-sm">
                    Ogou1987
                  </code>
                </div>
              </div>
            </div>

            {/* Statut actuel */}
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-orange-400" />
                <span className="ml-2 text-slate-300">Vérification en cours...</span>
              </div>
            ) : status ? (
              <div className={`p-4 rounded-xl border ${
                status.exists 
                  ? 'bg-green-500/10 border-green-500/30' 
                  : 'bg-amber-500/10 border-amber-500/30'
              }`}>
                <div className="flex items-start gap-3">
                  {status.exists ? (
                    <CheckCircle2 className="w-5 h-5 text-green-400 mt-0.5" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-amber-400 mt-0.5" />
                  )}
                  <div>
                    <p className={`font-medium ${status.exists ? 'text-green-300' : 'text-amber-300'}`}>
                      {status.exists ? 'Super Admin configuré' : 'Super Admin non initialisé'}
                    </p>
                    {status.user && (
                      <p className="text-sm text-slate-400 mt-1">
                        {status.user.nom_complet} ({status.user.email})
                        <Badge variant="outline" className="ml-2 text-xs border-green-500 text-green-400">
                          Actif
                        </Badge>
                      </p>
                    )}
                    {status.error && (
                      <p className="text-sm text-red-400 mt-1">{status.error}</p>
                    )}
                  </div>
                </div>
              </div>
            ) : null}

            {/* Résultat de l'action */}
            {result && (
              <div className={`p-4 rounded-xl border ${
                result.success 
                  ? 'bg-green-500/10 border-green-500/30' 
                  : 'bg-red-500/10 border-red-500/30'
              }`}>
                <p className={result.success ? 'text-green-300' : 'text-red-300'}>
                  {result.message}
                </p>
              </div>
            )}

            {/* Bouton d'action */}
            {!status?.exists && (
              <Button 
                onClick={initializeSuperAdmin}
                disabled={settingUp}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3"
                size="lg"
              >
                {settingUp ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Création en cours...
                  </>
                ) : (
                  <>
                    <UserPlus className="w-4 h-4 mr-2" />
                    Initialiser le Super Admin
                  </>
                )}
              </Button>
            )}

            {/* Lien vers connexion */}
            {status?.exists && (
              <a
                href="/connexion"
                className="flex items-center justify-center w-full py-3 px-4 bg-slate-700 hover:bg-slate-600 rounded-xl text-white font-medium transition-colors"
              >
                Aller à la page de connexion
                <ArrowRight className="w-4 h-4 ml-2" />
              </a>
            )}
          </CardContent>
        </Card>

        {/* Info */}
        <p className="text-center text-xs text-slate-500 mt-6">
          Cette page est uniquement accessible lors de l'installation initiale.
          <br />
          Le Super Admin a accès à toutes les fonctionnalités du système.
        </p>
      </div>
    </div>
  )
}
