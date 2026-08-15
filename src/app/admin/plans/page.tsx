'use client'

import React, { useState, useEffect } from 'react'
import { 
  Package, 
  Edit, 
  Save, 
  X, 
  Users, 
  Check,
  Star,
  TrendingUp,
  RefreshCw,
  Plus,
  HardDrive,
  Shield
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Skeleton } from '@/components/ui/skeleton'
import { toast } from 'sonner'

// Types
interface SubscriptionPlan {
  id: string
  code: string
  nom: string
  prix_mensuel: number
  max_users?: number
  storage_gb: number
  features: Record<string, boolean>
  ordre: number
  actif: boolean
  subscribers_count?: number
}

interface PlanFormData {
  nom: string
  code: string
  prix_mensuel: number
  max_users: number | null
  storage_gb: number
  features: Record<string, boolean>
  actif: boolean
}

const defaultFeatures = {
  activites_illimitees: true,
  rapports_automatiques: false,
  export_word: false,
  export_powerpoint: false,
  utilisateurs_multiples: false,
  support_prioritaire: false,
  api_acces: false,
  personnalisation_avancee: false,
}

const featureLabels: Record<string, string> = {
  activites_illimitees: 'Activités illimitées',
  rapports_automatiques: 'Rapports automatiques',
  export_word: 'Export Word',
  export_powerpoint: 'Export PowerPoint',
  utilisateurs_multiples: 'Utilisateurs multiples',
  support_prioritaire: 'Support prioritaire',
  api_acces: "Accès API",
  personnalisation_avancee: 'Personnalisation avancée',
}

export default function PlansPage() {
  const [plans, setPlans] = useState<SubscriptionPlan[]>([])
  const [loading, setLoading] = useState(true)
  const [editingPlan, setEditingPlan] = useState<SubscriptionPlan | null>(null)
  const [editForm, setEditForm] = useState<PlanFormData | null>(null)
  const [saving, setSaving] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)

  // Fetch plans
  useEffect(() => {
    async function fetchPlans() {
      try {
        const response = await fetch('/api/admin/plans')
        if (response.ok) {
          const data = await response.json()
          setPlans(data.plans || [])
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des plans:', error)
        toast.error('Erreur lors du chargement des plans')
      } finally {
        setLoading(false)
      }
    }
    fetchPlans()
  }, [])

  // Start editing a plan
  const startEdit = (plan: SubscriptionPlan) => {
    setEditingPlan(plan)
    setEditForm({
      nom: plan.nom,
      code: plan.code,
      prix_mensuel: plan.prix_mensuel,
      max_users: plan.max_users || null,
      storage_gb: plan.storage_gb,
      features: { ...defaultFeatures, ...plan.features },
      actif: plan.actif,
    })
    setDialogOpen(true)
  }

  // Save plan changes
  const savePlan = async () => {
    if (!editingPlan || !editForm) return
    
    setSaving(true)
    try {
      const response = await fetch(`/api/admin/plans/${editingPlan.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editForm)
      })

      if (response.ok) {
        toast.success('Plan mis à jour avec succès')
        setPlans(prev => prev.map(p => 
          p.id === editingPlan.id 
            ? { ...p, ...editForm }
            : p
        ))
        setDialogOpen(false)
        setEditingPlan(null)
        setEditForm(null)
      } else {
        throw new Error('Erreur lors de la mise à jour')
      }
    } catch (error) {
      console.error(error)
      toast.error('Erreur lors de la mise à jour du plan')
    } finally {
      setSaving(false)
    }
  }

  // Toggle plan active status
  const togglePlanStatus = async (planId: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/admin/plans/${planId}/toggle`, {
        method: 'PATCH'
      })

      if (response.ok) {
        toast.success(currentStatus ? 'Plan désactivé' : 'Plan activé')
        setPlans(prev => prev.map(p => 
          p.id === planId 
            ? { ...p, actif: !currentStatus }
            : p
        ))
      }
    } catch (error) {
      console.error(error)
      toast.error('Erreur lors de la modification')
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-CI', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0,
    }).format(amount)
  }

  // Get plan color based on order/type
  const getPlanStyle = (plan: SubscriptionPlan) => {
    switch (plan.code) {
      case 'ESSENTIEL':
        return {
          gradient: 'from-slate-500 to-slate-600',
          bgLight: 'bg-slate-50',
          border: 'border-slate-200',
          badge: 'bg-slate-100 text-slate-700'
        }
      case 'PRO':
        return {
          gradient: 'from-orange-500 to-orange-600',
          bgLight: 'bg-orange-50',
          border: 'border-orange-200',
          badge: 'bg-orange-100 text-orange-700'
        }
      case 'INSTITUTIONNEL':
        return {
          gradient: 'from-green-500 to-green-600',
          bgLight: 'bg-green-50',
          border: 'border-green-200',
          badge: 'bg-green-100 text-green-700'
        }
      default:
        return {
          gradient: 'from-blue-500 to-blue-600',
          bgLight: 'bg-blue-50',
          border: 'border-blue-200',
          badge: 'bg-blue-100 text-blue-700'
        }
    }
  }

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-slate-900">Plans & Tarifs</h1>
          <p className="text-slate-500 mt-1">Gérez les plans d&apos;abonnement et leurs tarifs</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={() => window.location.reload()} disabled={loading} className="gap-2">
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Actualiser
          </Button>
          <Button className="gap-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700">
            <Plus className="w-4 h-4" />
            Nouveau plan
          </Button>
        </div>
      </div>

      {/* Stats overview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="border-slate-200">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 rounded-xl bg-blue-100 text-blue-600">
              <Package className="w-6 h-6" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">{plans.length}</p>
              <p className="text-xs text-slate-500">Plans disponibles</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-slate-200">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 rounded-xl bg-green-100 text-green-600">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">
                {plans.reduce((sum, p) => sum + (p.subscribers_count || 0), 0)}
              </p>
              <p className="text-xs text-slate-500">Abonnés totaux</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-slate-200">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 rounded-xl bg-purple-100 text-purple-600">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">
                {formatCurrency(plans.reduce((sum, p) => sum + (p.prix_mensuel * (p.subscribers_count || 0)), 0))}
              </p>
              <p className="text-xs text-slate-500">Revenu mensuel estimé</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Plans list */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="border-slate-200">
              <CardContent className="p-6">
                <Skeleton className="h-8 w-3/4 mb-4" />
                <Skeleton className="h-12 w-1/2 mb-6" />
                <div className="space-y-3">
                  {[...Array(5)].map((_, j) => (
                    <Skeleton key={j} className="h-5 w-full" />
                  ))}
                </div>
                <Skeleton className="h-10 w-full mt-6" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.sort((a, b) => a.ordre - b.ordre).map((plan) => {
            const style = getPlanStyle(plan)
            const isPopular = plan.code === 'PRO'
            
            return (
              <Card key={plan.id} className={`relative border-2 ${style.border} ${!plan.actif ? 'opacity-60' : ''}`}>
                {isPopular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge className={`px-3 py-1 ${style.badge} font-medium`}>
                      <Star className="w-3 h-3 mr-1 fill-current" />
                      Populaire
                    </Badge>
                  </div>
                )}
                
                <CardHeader className="pb-4 text-center">
                  <div className={`inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br ${style.gradient} text-white mb-3 mx-auto`}>
                    <Package className="w-7 h-7" />
                  </div>
                  <CardTitle className="text-xl">{plan.nom}</CardTitle>
                  <CardDescription>{plan.code}</CardDescription>
                  
                  <div className="pt-4">
                    <span className="text-4xl font-bold text-slate-900">
                      {formatCurrency(plan.prix_mensuel)}
                    </span>
                    <span className="text-slate-500 text-sm">/mois</span>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  {/* Subscribers count */}
                  <div className={`p-3 rounded-lg ${style.bgLight} text-center`}>
                    <span className="text-sm font-medium text-slate-700">
                      <Users className="w-4 h-4 inline mr-1" />
                      {plan.subscribers_count || 0} abonné(s)
                    </span>
                  </div>

                  {/* Features */}
                  <ul className="space-y-3">
                    {Object.entries({ ...defaultFeatures, ...plan.features }).map(([key, value]) => (
                      <li key={key} className="flex items-start gap-3">
                        <Check className={`w-5 h-5 mt-0.5 flex-shrink-0 ${
                          value ? 'text-green-500' : 'text-slate-300'
                        }`} />
                        <span className={`text-sm ${value ? 'text-slate-700' : 'text-slate-400 line-through'}`}>
                          {featureLabels[key] || key}
                        </span>
                      </li>
                    ))}
                    
                    <li className="flex items-start gap-3">
                      <HardDrive className="w-5 h-5 mt-0.5 flex-shrink-0 text-slate-400" />
                      <span className="text-sm text-slate-700">{plan.storage_gb} Go stockage</span>
                    </li>
                    
                    {plan.max_users && (
                      <li className="flex items-start gap-3">
                        <Users className="w-5 h-5 mt-0.5 flex-shrink-0 text-slate-400" />
                        <span className="text-sm text-slate-700">Jusqu&apos;à {plan.max_users} utilisateurs</span>
                      </li>
                    )}
                  </ul>

                  {/* Status toggle */}
                  <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                    <span className="text-sm text-slate-600">Statut</span>
                    <Switch
                      checked={plan.actif}
                      onCheckedChange={() => togglePlanStatus(plan.id, plan.activ)}
                    />
                  </div>

                  {/* Actions */}
                  <Button 
                    variant="outline" 
                    className="w-full gap-2"
                    onClick={() => startEdit(plan)}
                  >
                    <Edit className="w-4 h-4" />
                    Modifier le plan
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}

      {/* Edit Plan Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Modifier le plan</DialogTitle>
            <DialogDescription>
              {editingPlan?.nom} ({editingPlan?.code})
            </DialogDescription>
          </DialogHeader>
          
          {editForm && (
            <div className="space-y-6 mt-4">
              {/* Basic info */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Nom du plan</label>
                  <Input
                    value={editForm.nom}
                    onChange={(e) => setEditForm(prev => prev ? { ...prev, nom: e.target.value } : null)}
                    placeholder="Ex: Plan Pro"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Code</label>
                  <Input
                    value={editForm.code}
                    onChange={(e) => setEditForm(prev => prev ? { ...prev, code: e.target.value.toUpperCase() } : null)}
                    placeholder="Ex: PRO"
                    className="font-mono uppercase"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Prix mensuel (FCFA)</label>
                    <Input
                      type="number"
                      value={editForm.prix_mensuel}
                      onChange={(e) => setEditForm(prev => prev ? { ...prev, prix_mensuel: Number(e.target.value) } : null)}
                      min={0}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Stockage (Go)</label>
                    <Input
                      type="number"
                      value={editForm.storage_gb}
                      onChange={(e) => setEditForm(prev => prev ? { ...prev, storage_gb: Number(e.target.value) } : null)}
                      min={1}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Max utilisateurs (vide = illimité)</label>
                  <Input
                    type="number"
                    value={editForm.max_users || ''}
                    onChange={(e) => setEditForm(prev => prev ? { 
                      ...prev, 
                      max_users: e.target.value ? Number(e.target.value) : null 
                    } : null)}
                    min={1}
                    placeholder="Illimité"
                  />
                </div>
              </div>

              {/* Features */}
              <div className="space-y-3">
                <label className="text-sm font-medium text-slate-700">Fonctionnalités</label>
                <div className="space-y-2 p-4 rounded-lg bg-slate-50">
                  {Object.entries(featureLabels).map(([key, label]) => (
                    <div key={key} className="flex items-center justify-between py-1">
                      <span className="text-sm text-slate-700">{label}</span>
                      <Switch
                        checked={editForm.features[key]}
                        onCheckedChange={(checked) => setEditForm(prev => prev ? {
                          ...prev,
                          features: { ...prev.features, [key]: checked }
                        } : null)}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Active status */}
              <div className="flex items-center justify-between p-4 rounded-lg bg-slate-50">
                <div>
                  <span className="text-sm font-medium text-slate-700">Plan actif</span>
                  <p className="text-xs text-slate-500">Les utilisateurs peuvent s&apos;y abonner</p>
                </div>
                <Switch
                  checked={editForm.actif}
                  onCheckedChange={(checked) => setEditForm(prev => prev ? { ...prev, actif: checked } : null)}
                />
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4 border-t border-slate-200">
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => setDialogOpen(false)}
                >
                  Annuler
                </Button>
                <Button 
                  className="flex-1 gap-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700"
                  onClick={savePlan}
                  disabled={saving}
                >
                  <Save className="w-4 h-4" />
                  {saving ? 'Enregistrement...' : 'Enregistrer'}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
