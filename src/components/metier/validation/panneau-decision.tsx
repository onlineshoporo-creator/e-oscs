'use client'

import React, { useState } from 'react'
import { 
  CheckCircle2,
  XCircle,
  Eye,
  Calendar,
  MapPin,
  Users,
  TrendingUp,
  DollarSign,
  FileText,
  AlertTriangle,
  Clock,
  MessageSquare
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { 
  formatMontant, 
  STATUT_CONFIG, 
  getIndicateursByActivite,
  type Activite 
} from '@/lib/mock/activites'

interface PanneauDecisionProps {
  activite: Activite | null
  onValider: (activiteId: string, motif?: string) => void
  onRejeter: (activiteId: string, motif?: string) => void
  onDemandeCorrection?: (activiteId: string, motif?: string) => void
  isLoading?: boolean
}

export function PanneauDecision({ 
  activite, 
  onValider, 
  onRejeter, 
  onDemandeCorrection,
  isLoading 
}: PanneauDecisionProps) {
  const [motifRejet, setMotifRejet] = useState('')
  const [motifCorrection, setMotifCorrection] = useState('')
  const [dialogOpen, setDialogOpen] = useState<'valide' | 'rejete' | 'correction' | null>(null)
  const [showDetails, setShowDetails] = useState(false)

  if (!activite) {
    return (
      <div className="h-full flex items-center justify-center bg-slate-50 rounded-xl border-2 border-dashed border-slate-200">
        <div className="text-center p-6">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-100 flex items-center justify-center">
            <Eye className="w-8 h-8 text-slate-300" />
          </div>
          <h3 className="font-semibold text-slate-600 text-lg">Sélectionnez une activité</h3>
          <p className="text-sm text-slate-400 mt-2 max-w-xs mx-auto">
            Cliquez sur une activité dans la liste pour voir ses détails et prendre une décision
          </p>
        </div>
      </div>
    )
  }

  const indicateurs = getIndicateursByActivite(activite.id)
  const statutConfig = STATUT_CONFIG[activite.statut]

  const handleConfirmValider = () => {
    onValider(activite.id)
    setDialogOpen(null)
  }

  const handleConfirmRejeter = () => {
    if (motifRejet.trim()) {
      onRejeter(activite.id, motifRejet)
      setMotifRejet('')
    }
    setDialogOpen(null)
  }

  const handleConfirmCorrection = () => {
    if (motifCorrection.trim() && onDemandeCorrection) {
      onDemandeCorrection(activite.id, motifCorrection)
      setMotifCorrection('')
    }
    setDialogOpen(null)
  }

  return (
    <div className="space-y-4 h-full overflow-y-auto custom-scrollbar">
      {/* En-tête activité */}
      <Card className="border-orange-200 shadow-sm">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <Badge variant="secondary" className={`${statutConfig?.color || 'bg-slate-100'} mb-2`}>
                {statutConfig?.label || activite.statut}
              </Badge>
              <CardTitle className="text-lg leading-tight">{activite.nom}</CardTitle>
              <p className="text-sm text-slate-500 mt-1 line-clamp-2">
                {activite.description}
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Informations clés */}
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="flex items-center gap-2 text-slate-600">
              <Calendar className="w-4 h-4 text-slate-400" />
              <span className="truncate">{new Date(activite.dateActivite).toLocaleDateString('fr-FR', { 
                day: 'numeric', 
                month: 'long', 
                year: 'numeric' 
              })}</span>
            </div>
            <div className="flex items-center gap-2 text-slate-600">
              <MapPin className="w-4 h-4 text-slate-400" />
              <span className="truncate">{activite.lieu}</span>
            </div>
            <div className="flex items-center gap-2 text-slate-600">
              <Users className="w-4 h-4 text-slate-400" />
              <span>{activite.beneficiairesCount} bénéficiaires</span>
            </div>
            <div className="flex items-center gap-2 text-slate-600">
              <FileText className="w-4 h-4 text-slate-400" />
              <span>{activite.categorie}</span>
            </div>
          </div>

          {/* Progression */}
          {activite.progression > 0 && (
            <div className="mt-4 pt-3 border-t border-slate-100">
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="flex items-center gap-1.5 text-slate-600">
                  <TrendingUp className="w-4 h-4" />
                  Progression actuelle
                </span>
                <span className="font-semibold text-slate-900">{activite.progression}%</span>
              </div>
              <Progress value={activite.progression} className="h-2.5 [&>div]:rounded-full" />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Budget */}
      <Card className="border-slate-200 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-green-600" />
            Budget
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-600">Budget alloué</span>
              <span className="font-semibold text-slate-900">
                {formatMontant(activite.budgetAlloue)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-600">Budget dépensé</span>
              <span className={`font-semibold ${
                activite.budgetDepense > activite.budgetAlloue ? 'text-red-600' : 'text-green-600'
              }`}>
                {formatMontant(activite.budgetDepense)}
              </span>
            </div>
            <Separator />
            <div className="flex justify-between items-center pt-1">
              <span className="text-sm font-medium text-slate-700">Taux d&apos;utilisation</span>
              <span className="font-bold text-lg text-slate-900">
                {Math.round((activite.budgetDepense / activite.budgetAlloue) * 100)}%
              </span>
            </div>
            <Progress 
              value={(activite.budgetDepense / activite.budgetAlloue) * 100} 
              className="h-2.5 [&>div]:rounded-full" 
            />
          </div>
        </CardContent>
      </Card>

      {/* Indicateurs */}
      {indicateurs.length > 0 && (
        <Card className="border-slate-200 shadow-sm">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-blue-600" />
                Indicateurs ({indicateurs.length})
              </CardTitle>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setShowDetails(!showDetails)}
                className="text-xs"
              >
                {showDetails ? 'Réduire' : 'Voir tout'}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className={`space-y-3 ${!showDetails && 'max-h-40 overflow-hidden'}`}>
              {indicateurs.map((ind) => (
                <div key={ind.id} className="p-3 bg-slate-50 rounded-lg">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-slate-800">{ind.nom}</span>
                    <span className="text-xs text-slate-500">
                      {ind.valeurActuelle ?? 0}/{ind.cibleValeur ?? '-'} {ind.unite}
                    </span>
                  </div>
                  <Progress value={ind.progression} className="h-1.5" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Responsable */}
      <Card className="border-slate-200 shadow-sm">
        <CardContent className="pt-4">
          <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white font-medium">
              {activite.responsable.split(' ').map(n => n[0]).join('')}
            </div>
            <div>
              <p className="text-sm font-medium text-slate-900">{activite.responsable}</p>
              <p className="text-xs text-slate-500">{activite.organisationNom}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Actions de décision */}
      <Card className="border-blue-200 bg-gradient-to-br from-blue-50/50 to-white shadow-md">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-blue-600" />
            Décision de validation
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <p className="text-sm text-slate-600">
              Après vérification des informations ci-dessus, prenez votre décision :
            </p>
            
            <div className="space-y-2.5">
              {/* Bouton Valider */}
              <Dialog open={dialogOpen === 'valide'} onOpenChange={(open) => setDialogOpen(open ? 'valide' : null)}>
                <DialogTrigger asChild>
                  <Button 
                    className="gap-2 w-full bg-green-600 hover:bg-green-700 shadow-sm shadow-green-200"
                    disabled={isLoading}
                  >
                    <CheckCircle2 className="w-5 h-5" />
                    Valider l&apos;activité
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-green-600" />
                      Confirmer la validation
                    </DialogTitle>
                    <DialogDescription>
                      Êtes-vous sûr de vouloir valider l&apos;activité &quot;{activite.nom}&quot; ?
                      <br />
                      <span className="text-slate-500 mt-2 block text-xs">
                        Cette action rendra l&apos;activité visible et pourra être exécutée.
                      </span>
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setDialogOpen(null)}>
                      Annuler
                    </Button>
                    <Button 
                      onClick={handleConfirmValider}
                      className="bg-green-600 hover:bg-green-700"
                      disabled={isLoading}
                    >
                      Confirmer la validation
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              {/* Bouton Demander correction */}
              {onDemandeCorrection && (
                <Dialog open={dialogOpen === 'correction'} onOpenChange={(open) => setDialogOpen(open ? 'correction' : null)}>
                  <DialogTrigger asChild>
                    <Button 
                      variant="outline" 
                      className="w-full gap-2 border-amber-300 text-amber-700 hover:bg-amber-50"
                      disabled={isLoading}
                    >
                      <MessageSquare className="w-4 h-4" />
                      Demander des corrections
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle className="flex items-center gap-2">
                        <MessageSquare className="w-5 h-5 text-amber-600" />
                        Demander des corrections
                      </DialogTitle>
                      <DialogDescription>
                        Décrivez les corrections nécessaires pour l&apos;activité &quot;{activite.nom}&quot;
                      </DialogDescription>
                    </DialogHeader>
                    <Textarea
                      placeholder="Décrivez les corrections demandées..."
                      value={motifCorrection}
                      onChange={(e) => setMotifCorrection(e.target.value)}
                      rows={4}
                      className="mt-3"
                    />
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setDialogOpen(null)}>
                        Annuler
                      </Button>
                      <Button 
                        onClick={handleConfirmCorrection}
                        className="bg-amber-600 hover:bg-amber-700"
                        disabled={isLoading || !motifCorrection.trim()}
                      >
                        Envoyer la demande
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              )}

              {/* Bouton Rejeter */}
              <Dialog open={dialogOpen === 'rejete'} onOpenChange={(open) => setDialogOpen(open ? 'rejete' : null)}>
                <DialogTrigger asChild>
                  <Button 
                    variant="destructive"
                    className="gap-2 w-full"
                    disabled={isLoading}
                  >
                    <XCircle className="w-5 h-5" />
                    Rejeter l&apos;activité
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                      <XCircle className="w-5 h-5 text-red-600" />
                      Rejeter l&apos;activité
                    </DialogTitle>
                    <DialogDescription>
                      Veuillez indiquer le motif du rejet de l&apos;activité &quot;{activite.nom}&quot;
                    </DialogDescription>
                  </DialogHeader>
                  <Textarea
                    placeholder="Expliquez le motif du rejet..."
                    value={motifRejet}
                    onChange={(e) => setMotifRejet(e.target.value)}
                    rows={4}
                    className="mt-3"
                  />
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setDialogOpen(null)}>
                      Annuler
                    </Button>
                    <Button 
                      variant="destructive"
                      onClick={handleConfirmRejeter}
                      disabled={isLoading || !motifRejet.trim()}
                    >
                      Confirmer le rejet
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
