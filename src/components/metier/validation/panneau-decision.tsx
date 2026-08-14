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
  Clock
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
  onDecision: (activiteId: string, decision: 'valide' | 'rejete', motif?: string) => void
  isLoading?: boolean
}

export function PanneauDecision({ activite, onDecision, isLoading }: PanneauDecisionProps) {
  const [motifRejet, setMotifRejet] = useState('')
  const [dialogOpen, setDialogOpen] = useState<'valide' | 'rejete' | null>(null)
  const [showDetails, setShowDetails] = useState(false)

  if (!activite) {
    return (
      <div className="h-full flex items-center justify-center bg-slate-50 rounded-lg border-2 border-dashed border-slate-200">
        <div className="text-center p-6">
          <Eye className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="font-medium text-slate-600">Sélectionnez une activité</h3>
          <p className="text-sm text-slate-400 mt-1">
            Cliquez sur une activité pour voir ses détails et la valider
          </p>
        </div>
      </div>
    )
  }

  const indicateurs = getIndicateursByActivite(activite.id)
  const statutConfig = STATUT_CONFIG[activite.statut]

  const handleConfirm = () => {
    if (dialogOpen === 'rejete') {
      onDecision(activite.id, 'rejete', motifRejet)
      setMotifRejet('')
    } else if (dialogOpen === 'valide') {
      onDecision(activite.id, 'valide')
    }
    setDialogOpen(null)
  }

  return (
    <div className="space-y-4 h-full overflow-y-auto">
      {/* En-tête activité */}
      <Card className="border-orange-200">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <Badge variant="secondary" className={`${statutConfig?.color} mb-2`}>
                {statutConfig?.label}
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
              <span>{new Date(activite.dateActivite).toLocaleDateString('fr-FR', { 
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
              <Progress value={activite.progression} className="h-2" />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Budget */}
      <Card>
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
              className="h-2" 
            />
          </div>
        </CardContent>
      </Card>

      {/* Indicateurs */}
      {indicateurs.length > 0 && (
        <Card>
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
      <Card>
        <CardContent className="pt-4">
          <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
            <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
              <Users className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-900">{activite.responsable}</p>
              <p className="text-xs text-slate-500">{activite.organisationNom}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Actions de décision */}
      <Card className="border-blue-200 bg-blue-50/30">
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
            
            <div className="grid grid-cols-2 gap-3">
              {/* Bouton Valider */}
              <Dialog open={dialogOpen === 'valide'} onOpenChange={(open) => setDialogOpen(open ? 'valide' : null)}>
                <DialogTrigger asChild>
                  <Button 
                    className="gap-2 bg-green-600 hover:bg-green-700 w-full"
                    disabled={isLoading}
                  >
                    <CheckCircle2 className="w-5 h-5" />
                    Valider
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Confirmer la validation</DialogTitle>
                    <DialogDescription>
                      Êtes-vous sûr de vouloir valider l&apos;activité &quot;{activite.nom}&quot; ?
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setDialogOpen(null)}>
                      Annuler
                    </Button>
                    <Button 
                      onClick={handleConfirm}
                      className="bg-green-600 hover:bg-green-700"
                      disabled={isLoading}
                    >
                      Confirmer la validation
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              {/* Bouton Rejeter */}
              <Dialog open={dialogOpen === 'rejete'} onOpenChange={(open) => setDialogOpen(open ? 'rejete' : null)}>
                <DialogTrigger asChild>
                  <Button 
                    variant="destructive"
                    className="gap-2 w-full"
                    disabled={isLoading}
                  >
                    <XCircle className="w-5 h-5" />
                    Rejeter
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Rejeter l&apos;activité</DialogTitle>
                    <DialogDescription>
                      Veuillez indiquer le motif du rejet de l&apos;activité &quot;{activite.nom}&quot;
                    </DialogDescription>
                  </DialogHeader>
                  <Textarea
                    placeholder="Expliquez le motif du rejet..."
                    value={motifRejet}
                    onChange={(e) => setMotifRejet(e.target.value)}
                    rows={4}
                  />
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setDialogOpen(null)}>
                      Annuler
                    </Button>
                    <Button 
                      variant="destructive"
                      onClick={handleConfirm}
                      disabled={isLoading || !motifRejet.trim()}
                    >
                      Confirmer le rejet
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            {/* Bouton vérification */}
            <Button 
              variant="outline" 
              className="w-full gap-2"
              disabled={isLoading}
            >
              <Clock className="w-4 h-4" />
              Demander des modifications
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
