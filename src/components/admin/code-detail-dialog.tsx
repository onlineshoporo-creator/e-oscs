'use client'

import React, { useState } from 'react'
import { 
  Key, 
  Copy, 
  Check, 
  Mail, 
  Calendar, 
  Clock, 
  User,
  Building2,
  Package,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Ban,
  X
} from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { toast } from 'sonner'

// Types
interface ActivationCode {
  id: string
  code: string
  organization_id?: string
  plan_id?: string
  email_proprietaire: string
  duree_mois: number
  expire_le: string
  utilise: boolean
  utilise_le?: string
  cree_par: string
  created_at: string
  plan?: { id: string; code: string; nom: string; prix_mensuel: number; features?: Record<string, boolean>; storage_gb?: number }
  organization?: { id: string; nom: string; type_org?: string }
}

interface CodeDetailDialogProps {
  code: ActivationCode | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CodeDetailDialog({ code, open, onOpenChange }: CodeDetailDialogProps) {
  const [copied, setCopied] = useState(false)
  const [revoking, setRevoking] = useState(false)

  if (!code) return null

  // Déterminer le statut du code
  const now = new Date()
  const expireDate = new Date(code.expire_le)
  
  let statusConfig: { label: string; className: string; icon: React.ReactNode }
  
  if (code.utilise) {
    statusConfig = {
      label: 'Utilisé',
      className: 'bg-blue-100 text-blue-700 border-blue-200',
      icon: <CheckCircle2 className="w-4 h-4" />
    }
  } else if (expireDate < now) {
    statusConfig = {
      label: 'Expiré',
      className: 'bg-gray-100 text-gray-500 border-gray-200',
      icon: <XCircle className="w-4 h-4" />
    }
  } else {
    statusConfig = {
      label: 'Disponible',
      className: 'bg-green-100 text-green-700 border-green-200',
      icon: <Clock className="w-4 h-4" />
    }
  }

  // Copier le code
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code.code)
      setCopied(true)
      toast.success('Code copié !')
      setTimeout(() => setCopied(false), 2000)
    } catch {
      toast.error('Erreur lors de la copie')
    }
  }

  // Révoquer le code
  const handleRevoke = async () => {
    if (!confirm('Êtes-vous sûr de vouloir révoquer ce code ? Cette action est irréversible.')) {
      return
    }

    setRevoking(true)
    try {
      const res = await fetch(`/api/admin/codes/${code.code}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'revoke' })
      })

      if (res.ok) {
        toast.success('Code révoqué avec succès')
        onOpenChange(false)
      } else {
        const data = await res.json()
        toast.error(data.error || 'Erreur lors de la révocation')
      }
    } catch {
      toast.error('Erreur lors de la révocation')
    } finally {
      setRevoking(false)
    }
  }

  // Formater les dates
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatDateShort = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2 text-xl">
              <div className={`p-2 rounded-lg ${statusConfig.className}`}>
                <Key className="w-5 h-5" />
              </div>
              Détails du code
            </span>
            <Badge variant="outline" className={`gap-1.5 ${statusConfig.className}`}>
              {statusConfig.icon}
              {statusConfig.label}
            </Badge>
          </DialogTitle>
          <DialogDescription>
            Informations complètes sur ce code d&apos;activation
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Code en grand */}
          <Card className="border-2 border-orange-200 bg-gradient-to-br from-orange-50 to-white">
            <CardContent className="p-6 text-center space-y-3">
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                Code d&apos;activation
              </p>
              <div className="relative inline-block">
                <p className="text-3xl md:text-4xl font-mono font-bold tracking-wider text-orange-600">
                  {code.code}
                </p>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleCopy}
                  className="absolute -right-10 top-1/2 -translate-y-1/2 h-8 w-8 bg-white border shadow-sm hover:bg-slate-50 hidden sm:flex"
                >
                  {copied ? (
                    <Check className="w-4 h-4 text-green-500" />
                  ) : (
                    <Copy className="w-4 h-4 text-slate-400" />
                  )}
                </Button>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopy}
                className="gap-2 sm:hidden"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 text-green-500" />
                    Copié !
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    Copier le code
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Informations principales */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Card className="border-slate-200">
              <CardContent className="p-4 space-y-3">
                <div className="flex items-center gap-2 text-slate-600">
                  <User className="w-4 h-4" />
                  <span className="text-xs font-medium uppercase tracking-wider">Propriétaire</span>
                </div>
                <p className="font-medium text-slate-800">{code.email_proprietaire}</p>
              </CardContent>
            </Card>

            <Card className="border-slate-200">
              <CardContent className="p-4 space-y-3">
                <div className="flex items-center gap-2 text-slate-600">
                  <Package className="w-4 h-4" />
                  <span className="text-xs font-medium uppercase tracking-wider">Durée offerte</span>
                </div>
                <p className="font-semibold text-lg text-slate-800">
                  {code.duree_mois} <span className="text-sm font-normal">mois</span>
                </p>
              </CardContent>
            </Card>

            <Card className="border-slate-200">
              <CardContent className="p-4 space-y-3">
                <div className="flex items-center gap-2 text-slate-600">
                  <Calendar className="w-4 h-4" />
                  <span className="text-xs font-medium uppercase tracking-wider">Date d&apos;expiration</span>
                </div>
                <p className="font-medium text-slate-800 flex items-center gap-2">
                  {formatDateShort(code.expire_le)}
                  {expireDate < now && !code.utilise && (
                    <Badge variant="outline" className="bg-red-50 text-red-600 border-red-200 text-[10px]">
                      Expiré
                    </Badge>
                  )}
                </p>
              </CardContent>
            </Card>

            <Card className="border-slate-200">
              <CardContent className="p-4 space-y-3">
                <div className="flex items-center gap-2 text-slate-600">
                  <Building2 className="w-4 h-4" />
                  <span className="text-xs font-medium uppercase tracking-wider">Plan associé</span>
                </div>
                {code.plan ? (
                  <div className="space-y-1">
                    <p className="font-medium text-slate-800">{code.plan.nom}</p>
                    <p className="text-xs text-slate-500">
                      {(code.plan.prix_mensuel || 0).toLocaleString('fr-FR')} FCFA/mois
                    </p>
                  </div>
                ) : (
                  <p className="text-slate-400 italic">Non défini</p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Organisation créée (si utilisé) */}
          {code.utilise && code.organization && (
            <>
              <Separator />
              <div className="space-y-3">
                <h4 className="font-semibold text-slate-700 flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-green-600" />
                  Organisation créée
                </h4>
                <Card className="border-green-200 bg-green-50/50">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-semibold text-slate-800">{code.organization.nom}</p>
                        <p className="text-sm text-slate-500 mt-1">
                          Type : {code.organization.type_org || 'N/A'}
                        </p>
                      </div>
                      <Badge className="bg-green-100 text-green-700 border-green-200">
                        Activée
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </>
          )}

          {/* Historique */}
          <Separator />
          <div className="space-y-4">
            <h4 className="font-semibold text-slate-700">Historique</h4>
            
            <div className="space-y-3">
              {/* Création */}
              <div className="flex items-start gap-3 p-3 rounded-lg bg-slate-50">
                <div className="p-1.5 rounded-full bg-blue-100 text-blue-600 mt-0.5">
                  <Key className="w-3.5 h-3.5" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-700">Code créé</p>
                  <p className="text-xs text-slate-500">
                    Par {code.cree_par} • {formatDate(code.created_at)}
                  </p>
                </div>
              </div>

              {/* Utilisation */}
              {code.utilise && code.utilise_le && (
                <div className="flex items-start gap-3 p-3 rounded-lg bg-green-50">
                  <div className="p-1.5 rounded-full bg-green-100 text-green-600 mt-0.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-slate-700">Code utilisé</p>
                    <p className="text-xs text-slate-500">
                      {formatDate(code.utilise_le)}
                    </p>
                  </div>
                </div>
              )}

              {/* Expiration */}
              {expireDate < now && !code.utilise && (
                <div className="flex items-start gap-3 p-3 rounded-lg bg-red-50">
                  <div className="p-1.5 rounded-full bg-red-100 text-red-600 mt-0.5">
                    <XCircle className="w-3.5 h-3.5" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-slate-700">Code expiré</p>
                    <p className="text-xs text-slate-500">
                      Le {formatDate(code.expire_le)} sans avoir été utilisé
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          {!code.utilise && expireDate >= now && (
            <>
              <Separator />
              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  variant="outline"
                  onClick={handleCopy}
                  className="flex-1 gap-2"
                >
                  <Copy className="w-4 h-4" />
                  Copier le code
                </Button>
                <Button
                  variant="outline"
                  className="flex-1 gap-2"
                >
                  <Mail className="w-4 h-4" />
                  Renvoyer l&apos;email
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleRevoke}
                  disabled={revoking}
                  className="flex-1 gap-2"
                >
                  {revoking ? (
                    <>...</>
                  ) : (
                    <>
                      <Ban className="w-4 h-4" />
                      Révoquer
                    </>
                  )}
                </Button>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
