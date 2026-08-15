'use client'

import React, { useState, useEffect } from 'react'
import { Key, Loader2, Copy, Check, Mail, Calendar } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { toast } from 'sonner'

// Types
interface SubscriptionPlan {
  id: string
  code: string
  nom: string
  prix_mensuel: number
}

interface GeneratedCode {
  id: string
  code: string
  email_proprietaire: string
  duree_mois: number
  expire_le: string
  plan?: { nom: string }
}

interface GenerateCodeDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

export function GenerateCodeDialog({ open, onOpenChange, onSuccess }: GenerateCodeDialogProps) {
  // États du formulaire
  const [email, setEmail] = useState('')
  const [planId, setPlanId] = useState<string>('')
  const [dureeMois, setDureeMois] = useState(12)
  const [expireLe, setExpireLe] = useState('')
  
  // États UI
  const [loading, setLoading] = useState(false)
  const [generating, setGenerating] = useState(false)
  const [plans, setPlans] = useState<SubscriptionPlan[]>([])
  const [generatedCode, setGeneratedCode] = useState<GeneratedCode | null>(null)
  const [copied, setCopied] = useState(false)

  // Charger les plans disponibles
  useEffect(() => {
    if (open) {
      fetchPlans()
      // Calculer date d'expiration par défaut (30 jours)
      const defaultExpire = new Date()
      defaultExpire.setDate(defaultExpire.getDate() + 30)
      setExpireLe(defaultExpire.toISOString().split('T')[0])
    }
  }, [open])

  // Reset à la fermeture
  useEffect(() => {
    if (!open && !generatedCode) {
      resetForm()
    }
  }, [open])

  const resetForm = () => {
    setEmail('')
    setPlanId('')
    setDureeMois(12)
    setExpireLe('')
    setGeneratedCode(null)
    setCopied(false)
  }

  const fetchPlans = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/plans')
      if (res.ok) {
        const data = await res.json()
        setPlans(data.data || data || [])
      }
    } catch (error) {
      console.error('Erreur chargement plans:', error)
    } finally {
      setLoading(false)
    }
  }

  // Validation email
  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  }

  // Générer le code
  const handleGenerate = async () => {
    if (!email || !isValidEmail(email)) {
      toast.error('Veuillez entrer un email valide')
      return
    }

    setGenerating(true)
    try {
      const res = await fetch('/api/admin/codes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email_proprietaire: email,
          plan_id: planId || undefined,
          duree_mois: dureeMois,
          expire_le: expireLe ? new Date(expireLe).toISOString() : undefined,
          cree_par: 'admin'
        })
      })

      const data = await res.json()

      if (res.ok) {
        setGeneratedCode(data)
        toast.success('Code généré avec succès !')
      } else {
        toast.error(data.error || 'Erreur lors de la génération')
      }
    } catch (error) {
      console.error('Erreur génération:', error)
      toast.error('Erreur lors de la génération du code')
    } finally {
      setGenerating(false)
    }
  }

  // Copier le code
  const handleCopy = async () => {
    if (generatedCode) {
      try {
        await navigator.clipboard.writeText(generatedCode.code)
        setCopied(true)
        toast.success('Code copié !')
        setTimeout(() => setCopied(false), 2000)
      } catch {
        toast.error('Erreur lors de la copie')
      }
    }
  }

  // Fermer après succès
  const handleClose = () => {
    onOpenChange(false)
    setTimeout(() => {
      resetForm()
      onSuccess()
    }, 100)
  }

  // Formater la date pour l'affichage
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <div className="p-2 rounded-lg bg-orange-100 text-orange-600">
              <Key className="w-5 h-5" />
            </div>
            {generatedCode ? 'Code généré' : 'Nouveau code d\'activation'}
          </DialogTitle>
          <DialogDescription>
            {generatedCode 
              ? 'Votre code a été généré avec succès. Copiez-le et envoyez-le au propriétaire.'
              : 'Générez un nouveau code d\'activation pour une organisation.'
            }
          </DialogDescription>
        </DialogHeader>

        {!generatedCode ? (
          /* Formulaire de génération */
          <div className="space-y-6 py-4">
            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">Email du propriétaire *</Label>
              <Input
                id="email"
                type="email"
                placeholder="proprietaire@organisation.ci"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={!email || isValidEmail(email) ? '' : 'border-red-300 focus:border-red-500'}
              />
              {email && !isValidEmail(email) && (
                <p className="text-sm text-red-500">Format d&apos;email invalide</p>
              )}
            </div>

            {/* Plan */}
            <div className="space-y-2">
              <Label>Plan d&apos;abonnement</Label>
              <Select value={planId} onValueChange={setPlanId}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un plan (optionnel)" />
                </SelectTrigger>
                <SelectContent>
                  {plans.map((plan) => (
                    <SelectItem key={plan.id} value={plan.id}>
                      {plan.nom} - {(plan.prix_mensuel).toLocaleString('fr-FR')} FCFA/mois
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-slate-500">
                Laissez vide si le plan n&apos;est pas encore déterminé
              </p>
            </div>

            {/* Durée */}
            <div className="space-y-2">
              <Label>Durée offerte (mois)</Label>
              <div className="flex gap-2">
                {[6, 12, 24, 36].map((mois) => (
                  <Button
                    key={mois}
                    type="button"
                    variant={dureeMois === mois ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setDureeMois(mois)}
                    className={dureeMois === mois ? 'bg-orange-500 hover:bg-orange-600' : ''}
                  >
                    {mois} mois
                  </Button>
                ))}
              </div>
            </div>

            {/* Date expiration */}
            <div className="space-y-2">
              <Label htmlFor="expire">Date d&apos;expiration</Label>
              <Input
                id="expire"
                type="date"
                value={expireLe}
                onChange={(e) => setExpireLe(e.target.value)}
              />
            </div>

            {/* Bouton générer */}
            <Button
              onClick={handleGenerate}
              disabled={generating || !email || !isValidEmail(email)}
              className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 gap-2"
            >
              {generating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Génération en cours...
                </>
              ) : (
                <>
                  <Key className="w-4 h-4" />
                  Générer le code
                </>
              )}
            </Button>
          </div>
        ) : (
          /* Résultat de génération */
          <div className="space-y-6 py-4">
            {/* Code affiché en grand */}
            <Card className="border-2 border-orange-200 bg-gradient-to-br from-orange-50 to-white">
              <CardContent className="p-6 text-center space-y-4">
                <p className="text-sm font-medium text-slate-600 uppercase tracking-wider">
                  Code d&apos;activation
                </p>
                <div className="relative">
                  <p className="text-3xl md:text-4xl font-mono font-bold tracking-wider text-orange-600">
                    {generatedCode.code}
                  </p>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleCopy}
                    className="absolute -right-2 -top-2 h-8 w-8 bg-white border shadow-sm hover:bg-slate-50"
                  >
                    {copied ? (
                      <Check className="w-4 h-4 text-green-500" />
                    ) : (
                      <Copy className="w-4 h-4 text-slate-400" />
                    )}
                  </Button>
                </div>
                
                {/* Actions rapides */}
                <div className="flex justify-center gap-3 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCopy}
                    className="gap-2"
                  >
                    <Copy className="w-4 h-4" />
                    Copier
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-2"
                  >
                    <Mail className="w-4 h-4" />
                    Envoyer par email
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Separator />

            {/* Détails du code */}
            <div className="space-y-4">
              <h4 className="font-semibold text-slate-700">Informations du code</h4>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-xs text-slate-500 uppercase tracking-wider">Destinataire</p>
                  <p className="text-sm font-medium text-slate-800">{generatedCode.email_proprietaire}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-slate-500 uppercase tracking-wider">Durée</p>
                  <Badge variant="secondary" className="bg-green-50 text-green-700 border-green-200">
                    {generatedCode.duree_mois} mois
                  </Badge>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-slate-500 uppercase tracking-wider">Plan associé</p>
                  <p className="text-sm font-medium text-slate-800">
                    {generatedCode.plan?.nom || 'Non défini'}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-slate-500 uppercase tracking-wider">Expire le</p>
                  <div className="flex items-center gap-1.5 text-sm text-slate-800">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    {formatDate(generatedCode.expire_le)}
                  </div>
                </div>
              </div>
            </div>

            {/* Boutons finaux */}
            <div className="flex gap-3 pt-4">
              <Button
                variant="outline"
                onClick={() => {
                  setGeneratedCode(null)
                }}
                className="flex-1"
              >
                Générer un autre
              </Button>
              <Button
                onClick={handleClose}
                className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
              >
                Terminer
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
