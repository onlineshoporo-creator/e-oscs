'use client'

import React, { useState, useEffect, useCallback } from 'react'
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  FileText,
  Loader2,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import {
  PeriodCard,
  PeriodTimeline,
  ClosePeriodDialog,
  ReopenPeriodDialog,
} from '@/components/metier/periods'
import type { Periode, PeriodeStats } from '@/lib/actions/periods'

// Données mock pour la démo
const MOCK_PERIODS: Periode[] = [
  {
    id: 'p1',
    organization_id: 'org-1',
    annee: 2024,
    trimestre: 1,
    statut: 'CLOTURE',
    cloture_le: '2024-04-02T10:00:00Z',
    cloture_par: 'user-1',
    rouverte_le: null,
    rouverte_par: null,
    motif_reouverture: null,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-04-02T10:00:00Z',
  },
  {
    id: 'p2',
    organization_id: 'org-1',
    annee: 2024,
    trimestre: 2,
    statut: 'CLOTURE',
    cloture_le: '2024-07-05T14:30:00Z',
    cloture_par: 'user-1',
    rouverte_le: null,
    rouverte_par: null,
    motif_reouverture: null,
    created_at: '2024-04-01T00:00:00Z',
    updated_at: '2024-07-05T14:30:00Z',
  },
  {
    id: 'p3',
    organization_id: 'org-1',
    annee: 2024,
    trimestre: 3,
    statut: 'OUVERT',
    cloture_le: null,
    cloture_par: null,
    rouverte_le: '2024-09-15T09:00:00Z',
    rouverte_par: 'user-2',
    motif_reouverture:
      "Ajout d'activités complémentaires suite à demande de la direction régionale",
    created_at: '2024-07-01T00:00:00Z',
    updated_at: '2024-09-15T09:00:00Z',
  },
  {
    id: 'p4',
    organization_id: 'org-1',
    annee: 2024,
    trimestre: 4,
    statut: 'OUVERT',
    cloture_le: null,
    cloture_par: null,
    rouverte_le: null,
    rouverte_par: null,
    motif_reouverture: null,
    created_at: '2024-10-01T00:00:00Z',
    updated_at: '2024-10-01T00:00:00Z',
  },
]

// Stats mock
const MOCK_STATS: Record<string, PeriodeStats> = {
  p1: {
    totalActivites: 12,
    activitesBrouillon: 0,
    activitesSoumises: 0,
    activitesValidees: 10,
    tauxValidation: 83,
    budgetTotal: 5000000,
    beneficiairesTotal: 450,
  },
  p2: {
    totalActivites: 15,
    activitesBrouillon: 0,
    activitesSoumises: 0,
    activitesValidees: 13,
    tauxValidation: 87,
    budgetTotal: 6500000,
    beneficiairesTotal: 620,
  },
  p3: {
    totalActivites: 8,
    activitesBrouillon: 2,
    activitesSoumises: 3,
    activitesValidees: 3,
    tauxValidation: 38,
    budgetTotal: 3200000,
    beneficiairesTotal: 280,
  },
  p4: {
    totalActivites: 5,
    activitesBrouillon: 3,
    activitesSoumises: 1,
    activitesValidees: 1,
    tauxValidation: 20,
    budgetTotal: 1500000,
    beneficiairesTotal: 120,
  },
}

// Historique des clôtures/réouvertures
const MOCK_HISTORIQUE = [
  {
    date: '2024-09-15T09:00:00Z',
    action: 'REOUVERTURE',
    periode: 'T3 - 2024',
    utilisateur: 'Marie Kouassi',
    motif: "Ajout d'activités complémentaires",
  },
  {
    date: '2024-07-05T14:30:00Z',
    action: 'CLOTURE',
    periode: 'T2 - 2024',
    utilisateur: 'Jean Yao',
    motif: 'Fin de période normale',
  },
  {
    date: '2024-04-02T10:00:00Z',
    action: 'CLOTURE',
    periode: 'T1 - 2024',
    utilisateur: 'Jean Yao',
    motif: 'Fin de période normale',
  },
]

export default function PeriodesPage() {
  // État
  const [selectedAnnee, setSelectedAnnee] = useState(new Date().getFullYear())
  const [periods, setPeriods] = useState<Periode[]>([])
  const [isLoading, setIsLoading] = useState(true)
  
  // Dialogs
  const [closeDialogOpen, setCloseDialogOpen] = useState(false)
  const [reopenDialogOpen, setReopenDialogOpen] = useState(false)
  const [selectedPeriod, setSelectedPeriod] = useState<{
    annee: number
    trimestre: number
  } | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)

  // Années disponibles
  const availableYears = [2025, 2024, 2023]
  const currentTrimestre = {
    annee: new Date().getFullYear(),
    trimestre: Math.ceil((new Date().getMonth() + 1) / 3),
  }

  // Charger les données
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true)
      await new Promise((resolve) => setTimeout(resolve, 400))
      
      // Utiliser données mock
      setPeriods(MOCK_PERIODS)
      setIsLoading(false)
    }
    
    loadData()
  }, [selectedAnnee])

  // Filtrer périodes pour l'année sélectionnée
  const filteredPeriods = periods.filter(
    (p) => p.annee === selectedAnnee
  )

  // Handlers
  const handleViewActivities = (annee: number, trimestre: number) => {
    console.log('Voir activités:', annee, trimestre)
    // Rediriger vers /app/activites avec filtres période
  }

  const handleViewBilan = (annee: number, trimestre: number) => {
    console.log('Voir bilan:', annee, trimestre)
    // Rediriger vers /app/periodes/[annee]/[trimestre]
    window.location.href = `/app/periodes/${annee}/${trimestre}`
  }

  const handleClosePeriod = (annee: number, trimestre: number) => {
    setSelectedPeriod({ annee, trimestre })
    setCloseDialogOpen(true)
  }

  const handleReopenPeriod = (annee: number, trimestre: number) => {
    setSelectedPeriod({ annee, trimestre })
    setReopenDialogOpen(true)
  }

  const handleConfirmClose = async (motif?: string) => {
    if (!selectedPeriod) return
    
    setIsProcessing(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    
    // Simuler la clôture
    setPeriods((prev) =>
      prev.map((p) =>
        p.annee === selectedPeriod.annee && p.trimestre === selectedPeriod.trimestre
          ? {
              ...p,
              statut: 'CLOTURE' as const,
              cloture_le: new Date().toISOString(),
              cloture_par: 'current-user',
            }
          : p
      )
    )
    
    setIsProcessing(false)
    setCloseDialogOpen(false)
    setSelectedPeriod(null)
  }

  const handleConfirmReopen = async (motif: string) => {
    if (!selectedPeriod) return
    
    setIsProcessing(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    
    // Simuler la réouverture
    setPeriods((prev) =>
      prev.map((p) =>
        p.annee === selectedPeriod.annee && p.trimestre === selectedPeriod.trimestre
          ? {
              ...p,
              statut: 'OUVERT' as const,
              rouverte_le: new Date().toISOString(),
              rouverte_par: 'current-user',
              motif_reouverture: motif,
            }
          : p
      )
    )
    
    setIsProcessing(false)
    setReopenDialogOpen(false)
    setSelectedPeriod(null)
  }

  // Formater la date pour l'historique
  function formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 w-48 bg-slate-200 rounded mb-6" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-64 bg-slate-100 rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Périodes de Déclaration</h1>
          <p className="text-sm text-slate-500 mt-1">
            Gérez vos trimestres de déclaration d'activités
          </p>
        </div>

        {/* Sélecteur d'année */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() =>
              setSelectedAnnee((a) => a - 1)
            }
            disabled={!availableYears.includes(selectedAnnee - 1)}
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          
          <div className="flex items-center gap-2 px-4 py-2 border rounded-lg bg-white min-w-[120px] justify-center">
            <Calendar className="w-4 h-4 text-orange-500" />
            <span className="font-semibold">{selectedAnnee}</span>
          </div>
          
          <Button
            variant="outline"
            size="icon"
            onClick={() =>
              setSelectedAnnee((a) => a + 1)
            }
            disabled={!availableYears.includes(selectedAnnee + 1)}
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Vue Timeline alternative */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Calendar className="w-5 h-5 text-orange-500" />
            Vue timeline - {selectedAnnee}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <PeriodTimeline
            periods={periods}
            currentTrimestre={currentTrimestre}
            onSelectPeriod={(annee, trimestre) => {
              // Scroll vers la card correspondante ou ouvrir le bilan
              handleViewBilan(annee, trimestre)
            }}
            selectedAnnee={selectedAnnee}
          />
        </CardContent>
      </Card>

      {/* Cards des trimestres */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((trimestre) => {
          const period = filteredPeriods.find(
            (p) => p.trimestre === trimestre
          )
          const stats = period ? MOCK_STATS[period.id] : undefined
          const isCurrent =
            selectedAnnee === currentTrimestre.annee &&
            trimestre === currentTrimestre.trimestre

          // Créer une période vide si elle n'existe pas encore
          const displayPeriod: Periode =
            period || {
              id: `new-${trimestre}`,
              organization_id: '',
              annee: selectedAnnee,
              trimestre,
              statut: 'OUVERT',
              cloture_le: null,
              cloture_par: null,
              rouverte_le: null,
              rouverte_par: null,
              motif_reouverture: null,
              created_at: '',
              updated_at: '',
            }

          return (
            <PeriodCard
              key={`${selectedAnnee}-T${trimestre}`}
              periode={displayPeriod}
              stats={stats}
              isCurrentTrimestre={isCurrent}
              onViewActivities={handleViewActivities}
              onViewBilan={handleViewBilan}
              onClosePeriod={
                displayPeriod.statut === 'OUVERT' &&
                period
                  ? handleClosePeriod
                  : undefined
              }
              onReopenPeriod={
                displayPeriod.statut === 'CLOTURE'
                  ? handleReopenPeriod
                  : undefined
              }
            />
          )
        })}
      </div>

      {/* Historique des clôtures/réouvertures */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <FileText className="w-5 h-5 text-slate-500" />
            Historique des opérations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="historique">
              <AccordionTrigger className="text-sm">
                Voir l'historique complet ({MOCK_HISTORIQUE.length} opérations)
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-3 pt-2">
                  {MOCK_HISTORIQUE.map((entry, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-4 p-3 bg-slate-50 rounded-lg"
                    >
                      <Badge
                        variant="outline"
                        className={`mt-0.5 ${
                          entry.action === 'CLOTURE'
                            ? 'bg-red-50 text-red-700 border-red-200'
                            : 'bg-blue-50 text-blue-700 border-blue-200'
                        }`}
                      >
                        {entry.action === 'CLOTURE' ? (
                          <>
                            🔒 Clôturé
                          </>
                        ) : (
                          <>
                            🔓 Rouvert
                          </>
                        )}
                      </Badge>
                      
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm">
                          {entry.periode} - par {entry.utilisateur}
                        </p>
                        {entry.motif && (
                          <p className="text-xs text-slate-600 mt-0.5">
                            {entry.motif}
                          </p>
                        )}
                        <p className="text-xs text-slate-400 mt-1">
                          {formatDate(entry.date)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>

      {/* Dialog Clôture */}
      <ClosePeriodDialog
        isOpen={closeDialogOpen}
        onClose={() => setCloseDialogOpen(false)}
        annee={selectedPeriod?.annee || 0}
        trimestre={selectedPeriod?.trimestre || 0}
        periodeStats={{
          totalActivites: 8,
          activitesBrouillon: 3,
          activitesSoumises: 1,
          activitesValidees: 4,
        }}
        onConfirm={handleConfirmClose}
        isLoading={isProcessing}
      />

      {/* Dialog Réouverture */}
      <ReopenPeriodDialog
        isOpen={reopenDialogOpen}
        onClose={() => setReopenDialogOpen(false)}
        annee={selectedPeriod?.annee || 0}
        trimestre={selectedPeriod?.trimestre || 0}
        onConfirm={handleConfirmReopen}
        isLoading={isProcessing}
      />
    </div>
  )
}
