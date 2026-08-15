'use client'

import React, { useState } from 'react'
import {
  Unlock,
  AlertTriangle,
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

interface ReopenPeriodDialogProps {
  isOpen: boolean
  onClose: () => void
  annee: number
  trimestre: number
  onConfirm: (motif: string) => void
  isLoading?: boolean
}

export function ReopenPeriodDialog({
  isOpen,
  onClose,
  annee,
  trimestre,
  onConfirm,
  isLoading = false,
}: ReopenPeriodDialogProps) {
  const [motif, setMotif] = useState('')

  // Noms des mois par trimestre
  const moisTrimestre = [
    ['Janvier', 'Février', 'Mars'],
    ['Avril', 'Mai', 'Juin'],
    ['Juillet', 'Août', 'Septembre'],
    ['Octobre', 'Novembre', 'Décembre'],
  ][trimestre - 1]

  const isMotifValid = motif.trim().length >= 10

  const handleConfirm = () => {
    if (!isMotifValid) return
    onConfirm(motif.trim())
    // Reset
    setMotif('')
  }

  const handleClose = () => {
    setMotif('')
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-blue-600">
            <Unlock className="w-5 h-5" />
            Rouvrir le Trimestre {trimestre}
          </DialogTitle>
          <DialogDescription>
            Vous souhaitez rouvrir la période{' '}
            <strong>{moisTrimestre.join(' - ')} {annee}</strong>.
          </DialogDescription>
        </DialogHeader>

        {/* Avertissement */}
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-6 h-6 text-amber-500 flex-shrink-0 mt-0.5" />
            <div className="space-y-2">
              <h4 className="font-medium text-amber-800">
                Réouverture de période
              </h4>
              <ul className="text-sm text-amber-700 space-y-1">
                <li>• Les activités redevront modifiables</li>
                <li>• Les validateurs pourront à nouveau intervenir</li>
                <li>• Cette action sera tracée dans l'historique</li>
                <li>• Un motif obligatoire sera demandé et conservé</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Champ motif obligatoire */}
        <div className="space-y-2">
          <Label htmlFor="motif-reouverture">
            Motif de réouverture <span className="text-red-500">*</span>
          </Label>
          <Textarea
            id="motif-reouverture"
            placeholder="Veuillez décrire en détail la raison de cette réouverture (minimum 10 caractères)..."
            value={motif}
            onChange={(e) => setMotif(e.target.value)}
            rows={4}
            className={!motif || isMotifValid ? '' : 'border-red-300 focus:border-red-500'}
          />
          
          {/* Compteur de caractètres */}
          <div className="flex justify-between items-center">
            <p className={`text-xs ${
              motif.length === 0 
                ? 'text-slate-400' 
                : isMotifValid 
                  ? 'text-green-600' 
                  : 'text-red-500'
            }`}>
              {motif.length < 10 && motif.length > 0 && (
                <>Encore {10 - motif.length} caractère(s) requis(s)</>
              )}
              {isMotifValid && (
                <>✓ Motif valide</>
              )}
              {motif.length === 0 && (
                <>Minimum 10 caractères requis</>
              )}
            </p>
            <p className={`text-xs font-medium ${
              isMotifValid ? 'text-green-600' : 'text-slate-500'
            }`}>
              {motif.length}/10 min.
            </p>
          </div>
        </div>

        {/* Exemples de motifs */}
        <div className="p-3 bg-slate-50 rounded-lg">
          <p className="text-xs font-medium text-slate-600 mb-2">Exemples de motifs :</p>
          <ul className="text-xs text-slate-500 space-y-1">
            <li>• "Correction d'activités oubliées lors de la saisie"</li>
            <li>• "Demande de modification suite à contrôle qualité"</li>
            <li>• "Ajout d'activités complémentaires validées par la direction"</li>
          </ul>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={handleClose} disabled={isLoading}>
            Annuler
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={!isMotifValid || isLoading}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {isLoading ? (
              'Traitement...'
            ) : (
              <>
                <Unlock className="w-4 h-4 mr-1" />
                Confirmer la réouverture
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
