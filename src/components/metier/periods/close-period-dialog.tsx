'use client'

import React, { useState } from 'react'
import {
  AlertTriangle,
  Lock,
  FileText,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'

interface ClosePeriodDialogProps {
  isOpen: boolean
  onClose: () => void
  annee: number
  trimestre: number
  periodeStats?: {
    totalActivites: number
    activitesBrouillon: number
    activitesSoumises: number
    activitesValidees: number
    activitiesEnCours?: Array<{
      id: string
      titre: string
      statut: string
    }>
  }
  onConfirm: (motif?: string) => void
  isLoading?: boolean
}

export function ClosePeriodDialog({
  isOpen,
  onClose,
  annee,
  trimestre,
  periodeStats,
  onConfirm,
  isLoading = false,
}: ClosePeriodDialogProps) {
  const [motif, setMotif] = useState('')
  const [confirmed, setConfirmed] = useState(false)

  // Noms des mois par trimestre
  const moisTrimestre = [
    ['Janvier', 'Février', 'Mars'],
    ['Avril', 'Mai', 'Juin'],
    ['Juillet', 'Août', 'Septembre'],
    ['Octobre', 'Novembre', 'Décembre'],
  ][trimestre - 1]

  const handleConfirm = () => {
    if (!confirmed) {
      setConfirmed(true)
      return
    }
    onConfirm(motif || undefined)
    // Reset
    setConfirmed(false)
    setMotif('')
  }

  const handleClose = () => {
    setConfirmed(false)
    setMotif('')
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="w-5 h-5" />
            Clôturer le Trimestre {trimestre}
          </DialogTitle>
          <DialogDescription>
            Vous êtes sur le point de clôturer la période{' '}
            <strong>{moisTrimestre.join(' - ')} {annee}</strong>.
          </DialogDescription>
        </DialogHeader>

        {!confirmed ? (
          <>
            {/* Avertissement principal */}
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-6 h-6 text-red-500 flex-shrink-0 mt-0.5" />
                <div className="space-y-2">
                  <h4 className="font-medium text-red-800">
                    Attention : Action irréversible pour les validateurs
                  </h4>
                  <ul className="text-sm text-red-700 space-y-1">
                    <li>• Les validateurs ne pourront plus modifier les activités</li>
                    <li>• Les activités en brouillon resteront modifiables</li>
                    <li>• Un bilan pourra être généré après clôture</li>
                    <li>• La réouverture nécessitera un motif obligatoire</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Résumé de la période */}
            {periodeStats && (
              <div className="space-y-3 p-4 bg-slate-50 rounded-lg">
                <h4 className="font-medium text-slate-800 flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  État actuel du trimestre
                </h4>

                <div className="grid grid-cols-3 gap-3">
                  <div className="text-center">
                    <p className="text-xl font-bold text-slate-800">
                      {periodeStats.totalActivites}
                    </p>
                    <p className="text-xs text-slate-500">Total activités</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xl font-bold text-green-600">
                      {periodeStats.activitesValidees}
                    </p>
                    <p className="text-xs text-slate-500">Validées</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xl font-bold text-yellow-600">
                      {periodeStats.activitesSoumises + periodeStats.activitesBrouillon}
                    </p>
                    <p className="text-xs text-slate-500">En cours</p>
                  </div>
                </div>

                {/* Activités en cours */}
                {(periodeStats.activitesBrouillon > 0 ||
                  periodeStats.activitesSoumises > 0) && (
                  <div className="pt-2 border-t border-slate-200 space-y-2">
                    {periodeStats.activitesBrouillon > 0 && (
                      <div className="flex items-center gap-2 text-sm">
                        <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                          {periodeStats.activitesBrouillon} brouillon(s)
                        </Badge>
                        <span className="text-slate-500">ne seront pas affectées</span>
                      </div>
                    )}
                    {periodeStats.activitesSoumises > 0 && (
                      <div className="flex items-center gap-2 text-sm">
                        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                          {periodeStats.activitesSoumises} soumise(s)
                        </Badge>
                        <span className="text-slate-500">seront figées</span>
                      </div>
                    )}
                  </div>
                )}

                {/* Liste des activités si fournie */}
                {periodeStats.activitiesEnCours &&
                  periodeStats.activitiesEnCours.length > 0 && (
                    <div className="mt-3 max-h-32 overflow-y-auto space-y-1">
                      {periodeStats.activitiesEnCours.map((act) => (
                        <div
                          key={act.id}
                          className="flex items-center justify-between p-2 bg-white rounded text-sm"
                        >
                          <span className="truncate flex-1">{act.titre}</span>
                          <Badge
                            variant="outline"
                            className={`ml-2 ${
                              act.statut === 'BROUILLON'
                                ? 'bg-yellow-50 text-yellow-700 border-yellow-200'
                                : 'bg-blue-50 text-blue-700 border-blue-200'
                            }`}
                          >
                            {act.statut === 'BROUILLON' ? 'Brouillon' : 'Soumise'}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  )}
              </div>
            )}
          </>
        ) : (
          <>
            {/* Confirmation finale */}
            <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
              <div className="flex items-start gap-3">
                <Lock className="w-6 h-6 text-orange-500 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-medium text-orange-800">
                    Confirmation définitive
                  </h4>
                  <p className="text-sm text-orange-700 mt-1">
                    Cette action va clôturer le T{trimestre} de {annee}. 
                    Voulez-vous ajouter un motif de clôture (optionnel) ?
                  </p>
                </div>
              </div>
            </div>

            {/* Champ motif */}
            <div className="space-y-2">
              <Label htmlFor="motif-cloture">
                Motif de clôture <span className="text-slate-400">(optionnel)</span>
              </Label>
              <Textarea
                id="motif-cloture"
                placeholder="Décrivez la raison de cette clôture..."
                value={motif}
                onChange={(e) => setMotif(e.target.value)}
                rows={3}
              />
            </div>
          </>
        )}

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={handleClose} disabled={isLoading}>
            Annuler
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={isLoading}
            className={
              confirmed
                ? 'bg-red-600 hover:bg-red-700'
                : 'bg-orange-500 hover:bg-orange-600'
            }
          >
            {isLoading ? (
              'Traitement...'
            ) : confirmed ? (
              <>
                <Lock className="w-4 h-4 mr-1" />
                Confirmer la clôture
              </>
            ) : (
              'Continuer'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
