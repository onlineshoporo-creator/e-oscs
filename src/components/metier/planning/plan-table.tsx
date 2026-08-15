'use client'

import React, { useState } from 'react'
import { 
  Plus, 
  Pencil, 
  Trash2, 
  CheckCircle2,
  Circle,
  MoreHorizontal
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'

// Types
interface PlanActivity {
  id: string
  axe_strategique: string
  objectif: string
  activite_prevue: string
  indicateur?: string
  cible?: string
  responsable?: string
  periode_prevue?: string
  budget?: number
  observations?: string
  realise: boolean
}

interface PlanTableProps {
  activities: PlanActivity[]
  isPlanClosed?: boolean
  onAdd?: (data: Omit<PlanActivity, 'id' | 'realise'>) => void
  onUpdate?: (id: string, data: Partial<PlanActivity>) => void
  onDelete?: (id: string) => void
  onToggleRealise?: (id: string, realised: boolean) => void
}

// Formulaire vide pour ajout/édition
const emptyFormData = {
  axe_strategique: '',
  objectif: '',
  activite_prevue: '',
  indicateur: '',
  cible: '',
  responsable: '',
  periode_prevue: '',
  budget: '',
  observations: '',
}

export function PlanTable({ 
  activities, 
  isPlanClosed = false,
  onAdd, 
  onUpdate, 
  onDelete,
  onToggleRealise 
}: PlanTableProps) {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingActivity, setEditingActivity] = useState<PlanActivity | null>(null)
  const [formData, setFormData] = useState(emptyFormData)

  // Ouvrir le dialogue d'édition
  const handleEdit = (activity: PlanActivity) => {
    setEditingActivity(activity)
    setFormData({
      axe_strategique: activity.axe_strategique,
      objectif: activity.objectif,
      activite_prevue: activity.activite_prevue,
      indicateur: activity.indicateur || '',
      cible: activity.cible || '',
      responsable: activity.responsable || '',
      periode_prevue: activity.periode_prevue || '',
      budget: activity.budget?.toString() || '',
      observations: activity.observations || '',
    })
    setIsEditDialogOpen(true)
  }

  // Soumettre le formulaire d'ajout
  const handleAddSubmit = () => {
    if (!formData.axe_strategique || !formData.objectif || !formData.activite_prevue) return
    
    onAdd?.({
      axe_strategique: formData.axe_strategique,
      objectif: formData.objectif,
      activite_prevue: formData.activite_prevue,
      indicateur: formData.indicateur || undefined,
      cible: formData.cible || undefined,
      responsable: formData.responsable || undefined,
      periode_prevue: formData.periode_prevue || undefined,
      budget: formData.budget ? parseFloat(formData.budget) : undefined,
      observations: formData.observations || undefined,
    })
    
    setFormData(emptyFormData)
    setIsAddDialogOpen(false)
  }

  // Soumettre le formulaire d'édition
  const handleEditSubmit = () => {
    if (!editingActivity || !formData.axe_strategique || !formData.objectif || !formData.activite_prevue) return
    
    onUpdate?.(editingActivity.id, {
      axe_strategique: formData.axe_strategique,
      objectif: formData.objectif,
      activite_prevue: formData.activite_prevue,
      indicateur: formData.indicateur || undefined,
      cible: formData.cible || undefined,
      responsable: formData.responsable || undefined,
      periode_prevue: formData.periode_prevue || undefined,
      budget: formData.budget ? parseFloat(formData.budget) : undefined,
      observations: formData.observations || undefined,
    })
    
    setEditingActivity(null)
    setFormData(emptyFormData)
    setIsEditDialogOpen(false)
  }

  // Formater le budget
  const formatBudget = (amount?: number) => {
    if (!amount) return '-'
    return new Intl.NumberFormat('fr-FR').format(amount) + ' FCFA'
  }

  // Calculer les statistiques
  const totalActivities = activities.length
  const realisedActivities = activities.filter(a => a.realise).length
  const progressPercent = totalActivities > 0 ? Math.round((realisedActivities / totalActivities) * 100) : 0

  return (
    <Card className="border-slate-200">
      <CardHeader className="pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <CardTitle className="text-base font-semibold">Activités planifiées</CardTitle>
            <Badge variant="secondary" className="bg-slate-100">
              {totalActivities} activité{totalActivities > 1 ? 's' : ''}
            </Badge>
            {totalActivities > 0 && (
              <Badge 
                variant="secondary" 
                className={progressPercent === 100 ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}
              >
                {progressPercent}% réalisé
              </Badge>
            )}
          </div>

          {!isPlanClosed && onAdd && (
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className="gap-2 bg-green-600 hover:bg-green-700">
                  <Plus className="w-4 h-4" />
                  Ajouter une activité
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Ajouter une activité au plan</DialogTitle>
                  <DialogDescription>
                    Remplissez les informations pour ajouter une nouvelle activité au plan annuel.
                  </DialogDescription>
                </DialogHeader>
                
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="axe">Axe stratégique *</Label>
                      <Input
                        id="axe"
                        value={formData.axe_strategique}
                        onChange={(e) => setFormData(prev => ({ ...prev, axe_strategique: e.target.value }))}
                        placeholder="Ex: Renforcement des capacités"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="objectif">Objectif *</Label>
                      <Input
                        id="objectif"
                        value={formData.objectif}
                        onChange={(e) => setFormData(prev => ({ ...prev, objectif: e.target.value }))}
                        placeholder="Ex: Former 50 agents"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="activite">Activité prévue *</Label>
                    <Textarea
                      id="activite"
                      value={formData.activite_prevue}
                      onChange={(e) => setFormData(prev => ({ ...prev, activite_prevue: e.target.value }))}
                      placeholder="Décrivez l'activité prévue..."
                      rows={3}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="indicateur">Indicateur</Label>
                      <Input
                        id="indicateur"
                        value={formData.indicateur}
                        onChange={(e) => setFormData(prev => ({ ...prev, indicateur: e.target.value }))}
                        placeholder="Ex: Taux de participation"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cible">Cible</Label>
                      <Input
                        id="cible"
                        value={formData.cible}
                        onChange={(e) => setFormData(prev => ({ ...prev, cible: e.target.value }))}
                        placeholder="Ex: 80%"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="budget">Budget (FCFA)</Label>
                      <Input
                        id="budget"
                        type="number"
                        value={formData.budget}
                        onChange={(e) => setFormData(prev => ({ ...prev, budget: e.target.value }))}
                        placeholder="Ex: 500000"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="responsable">Responsable</Label>
                      <Input
                        id="responsable"
                        value={formData.responsable}
                        onChange={(e) => setFormData(prev => ({ ...prev, responsable: e.target.value }))}
                        placeholder="Nom du responsable"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="periode">Période prévue</Label>
                      <Input
                        id="periode"
                        value={formData.periode_prevue}
                        onChange={(e) => setFormData(prev => ({ ...prev, periode_prevue: e.target.value }))}
                        placeholder="Ex: Q1 2025"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="observations">Observations</Label>
                    <Textarea
                      id="observations"
                      value={formData.observations}
                      onChange={(e) => setFormData(prev => ({ ...prev, observations: e.target.value }))}
                      placeholder="Notes ou observations supplémentaires..."
                      rows={2}
                    />
                  </div>
                </div>

                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                    Annuler
                  </Button>
                  <Button 
                    onClick={handleAddSubmit}
                    disabled={!formData.axe_strategique || !formData.objectif || !formData.activite_prevue}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    Ajouter
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </CardHeader>
      
      <CardContent>
        {/* Barre de progression */}
        {totalActivities > 0 && (
          <div className="mb-6 p-4 bg-slate-50 rounded-lg">
            <div className="flex items-center justify-between mb-2 text-sm">
              <span className="text-slate-600">Progression globale</span>
              <span className="font-medium text-slate-900">{realisedActivities}/{totalActivities} activités réalisées</span>
            </div>
            <div className="h-3 bg-slate-200 rounded-full overflow-hidden">
              <div 
                className={`h-full transition-all duration-500 rounded-full ${
                  progressPercent === 100 ? 'bg-green-500' : 'bg-orange-500'
                }`}
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        )}

        {/* Tableau */}
        {activities.length > 0 ? (
          <div className="overflow-x-auto -mx-6 px-6">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-10"></TableHead>
                  <TableHead>Axe stratégique</TableHead>
                  <TableHead>Objectif</TableHead>
                  <TableHead className="hidden lg:table-cell">Activité prévue</TableHead>
                  <TableHead className="hidden xl:table-cell">Indicateur / Cible</TableHead>
                  <TableHead className="hidden md:table-cell">Responsable</TableHead>
                  <TableHead className="hidden sm:table-cell">Période</TableHead>
                  <TableHead className="hidden md:table-cell text-right">Budget</TableHead>
                  {!isPlanClosed && <TableHead className="w-24"></TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {activities.map((activity) => (
                  <TableRow key={activity.id} className={`${activity.realise ? 'bg-green-50/50' : ''}`}>
                    <TableCell>
                      <button
                        onClick={() => onToggleRealise?.(activity.id, !activity.realise)}
                        className="p-1 hover:bg-slate-100 rounded transition-colors"
                        title={activity.realise ? 'Marquer comme non réalisé' : 'Marquer comme réalisé'}
                      >
                        {activity.realise ? (
                          <CheckCircle2 className="w-5 h-5 text-green-600" />
                        ) : (
                          <Circle className="w-5 h-5 text-slate-300" />
                        )}
                      </button>
                    </TableCell>
                    <TableCell>
                      <span className={`font-medium ${activity.realise ? 'line-through text-slate-500' : 'text-slate-900'}`}>
                        {activity.axe_strategique}
                      </span>
                    </TableCell>
                    <TableCell className={activity.realise ? 'text-slate-500' : ''}>
                      {activity.objectif}
                    </TableCell>
                    <TableCell className={`hidden lg:table-cell max-w-xs truncate ${activity.realise ? 'text-slate-500' : ''}`}>
                      {activity.activite_prevue}
                    </TableCell>
                    <TableCell className="hidden xl:table-cell">
                      {activity.indicateur && (
                        <span className="text-sm">
                          {activity.indicateur}
                          {activity.cible && (
                            <span className="text-slate-500 ml-1">({activity.cible})</span>
                          )}
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-sm">
                      {activity.responsable || '-'}
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      {activity.periode_prevue && (
                        <Badge variant="outline" className="font-normal">
                          {activity.periode_prevue}
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-right text-sm font-medium">
                      {formatBudget(activity.budget)}
                    </TableCell>
                    {!isPlanClosed && (
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => handleEdit(activity)}
                          >
                            <Pencil className="w-4 h-4" />
                          </Button>
                          
                          {onDelete && (
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 text-slate-400 hover:text-red-600"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Êtes-vous sûr de vouloir supprimer cette activité du plan ? Cette action est irréversible.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Annuler</AlertDialogCancel>
                                  <AlertDialogAction 
                                    onClick={() => onDelete(activity.id)}
                                    className="bg-red-600 hover:bg-red-700"
                                  >
                                    Supprimer
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          )}
                        </div>
                      </TableCell>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="text-center py-12">
            <Circle className="w-12 h-12 mx-auto mb-3 text-slate-300" />
            <h3 className="font-medium text-slate-700 mb-1">Aucune activité planifiée</h3>
            <p className="text-sm text-slate-500 mb-4">
              Commencez par ajouter des activités à votre plan annuel.
            </p>
            {!isPlanClosed && onAdd && (
              <Button onClick={() => setIsAddDialogOpen(true)} className="gap-2 bg-green-600 hover:bg-green-700">
                <Plus className="w-4 h-4" />
                Ajouter la première activité
              </Button>
            )}
          </div>
        )}

        {/* Dialogue d'édition */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Modifier l&apos;activité</DialogTitle>
              <DialogDescription>
                Modifiez les informations de l&apos;activité planifiée.
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Axe stratégique *</Label>
                  <Input
                    value={formData.axe_strategique}
                    onChange={(e) => setFormData(prev => ({ ...prev, axe_strategique: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Objectif *</Label>
                  <Input
                    value={formData.objectif}
                    onChange={(e) => setFormData(prev => ({ ...prev, objectif: e.target.value }))}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Activité prévue *</Label>
                <Textarea
                  value={formData.activite_prevue}
                  onChange={(e) => setFormData(prev => ({ ...prev, activite_prevue: e.target.value }))}
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Indicateur</Label>
                  <Input
                    value={formData.indicateur}
                    onChange={(e) => setFormData(prev => ({ ...prev, indicateur: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Cible</Label>
                  <Input
                    value={formData.cible}
                    onChange={(e) => setFormData(prev => ({ ...prev, cible: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Budget (FCFA)</Label>
                  <Input
                    type="number"
                    value={formData.budget}
                    onChange={(e) => setFormData(prev => ({ ...prev, budget: e.target.value }))}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Responsable</Label>
                  <Input
                    value={formData.responsable}
                    onChange={(e) => setFormData(prev => ({ ...prev, responsable: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Période prévue</Label>
                  <Input
                    value={formData.periode_prevue}
                    onChange={(e) => setFormData(prev => ({ ...prev, periode_prevue: e.target.value }))}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Observations</Label>
                <Textarea
                  value={formData.observations}
                  onChange={(e) => setFormData(prev => ({ ...prev, observations: e.target.value }))}
                  rows={2}
                />
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Annuler
              </Button>
              <Button 
                onClick={handleEditSubmit}
                disabled={!formData.axe_strategique || !formData.objectif || !formData.activite_prevue}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Enregistrer
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  )
}
