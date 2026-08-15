'use client'

import React, { useState, useMemo } from 'react'
import { 
  CheckCircle2,
  XCircle,
  Clock,
  Search,
  AlertTriangle,
  RefreshCw
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { useToast } from '@/hooks/use-toast'
import { PanneauDecision } from '@/components/metier/validation/panneau-decision'
import { 
  activites, 
  formatMontant, 
  STATUT_CONFIG,
  type Activite 
} from '@/lib/mock/activites'

// Configuration des statuts pour la validation
const STATUT_VALIDATION = {
  SOUMIS: { label: 'Soumis', color: 'bg-blue-100 text-blue-700 border-blue-200', dotColor: 'bg-blue-500' },
  EN_VERIFICATION: { label: 'En vérification', color: 'bg-amber-100 text-amber-700 border-amber-200', dotColor: 'bg-amber-500' },
  VALIDE: { label: 'Validé', color: 'bg-green-100 text-green-700 border-green-200', dotColor: 'bg-green-500' },
  REJETE: { label: 'Rejeté', color: 'bg-red-100 text-red-700 border-red-200', dotColor: 'bg-red-500' },
  CORRECTION: { label: 'Correction demandée', color: 'bg-orange-100 text-orange-700 border-orange-200', dotColor: 'bg-orange-500' },
  // Legacy pour compatibilité mock
  en_attente: { label: 'En attente', color: 'bg-orange-100 text-orange-700 border-orange-200', dotColor: 'bg-orange-500' },
  planifie: { label: 'Planifié', color: 'bg-slate-100 text-slate-700 border-slate-200', dotColor: 'bg-slate-400' },
  valide: { label: 'Validée', color: 'bg-green-100 text-green-700 border-green-200', dotColor: 'bg-green-500' },
  rejete: { label: 'Rejetée', color: 'bg-red-100 text-red-700 border-red-200', dotColor: 'bg-red-500' },
}

export default function ValidationPage() {
  const [selectedActiviteId, setSelectedActiviteId] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [activitesListe, setActivitesListe] = useState<Activite[]>(activites)
  const { toast } = useToast()

  // Filtrer les activités en attente de validation (SOUMIS ou legacy en_attente/planifie)
  const activitesEnAttente = useMemo(() => {
    return activitesListe.filter(a => 
      ['SOUMIS', 'en_attente', 'planifie', 'EN_VERIFICATION'].includes(a.statut) &&
      (searchTerm === '' || 
        a.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.organisationNom.toLowerCase().includes(searchTerm.toLowerCase()))
    )
  }, [activitesListe, searchTerm])

  // Statistiques
  const stats = {
    enAttente: activitesListe.filter(a => ['SOUMIS', 'en_attente'].includes(a.statut)).length,
    enVerification: activitesListe.filter(a => ['EN_VERIFICATION'].includes(a.statut)).length,
    validees: activitesListe.filter(a => ['VALIDE', 'valide'].includes(a.statut)).length,
    rejetees: activitesListe.filter(a => ['REJETE', 'rejete'].includes(a.statut)).length,
  }

  // Activité sélectionnée
  const selectedActivite = selectedActiviteId 
    ? activitesListe.find(a => a.id === selectedActiviteId) || null 
    : null

  // Auto-sélectionner la première activité au chargement
  React.useEffect(() => {
    if (!selectedActiviteId && activitesEnAttente.length > 0) {
      setSelectedActiviteId(activitesEnAttente[0].id)
    }
  }, [activitesEnAttente, selectedActiviteId])

  // Gestionnaire de décision - Valider
  const handleValider = async (activiteId: string, motif?: string) => {
    setIsLoading(true)
    
    try {
      // Simuler appel API
      await new Promise(resolve => setTimeout(resolve, 1200))
      
      setActivitesListe(prev => prev.map(a => 
        a.id === activiteId ? { ...a, statut: 'valide' } : a
      ))

      toast({
        title: '✅ Activité validée',
        description: `L'activité a été validée avec succès.`,
      })

      // Sélectionner l'activité suivante
      const remaining = activitesListe.filter(a => 
        a.id !== activiteId && ['SOUMIS', 'en_attente', 'planifie', 'EN_VERIFICATION'].includes(a.statut)
      )
      setSelectedActiviteId(remaining.length > 0 ? remaining[0].id : null)
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Une erreur est survenue lors de la validation.',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Gestionnaire de décision - Rejeter
  const handleRejeter = async (activiteId: string, motif?: string) => {
    if (!motif?.trim()) {
      toast({
        title: 'Motif requis',
        description: 'Veuillez indiquer le motif du rejet.',
        variant: 'destructive',
      })
      return
    }

    setIsLoading(true)
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1200))
      
      setActivitesListe(prev => prev.map(a => 
        a.id === activiteId ? { ...a, statut: 'rejete', motifRejet: motif } : a
      ))

      toast({
        title: '❌ Activité rejetée',
        description: `L'activité a été rejetée.`,
        variant: 'destructive',
      })

      const remaining = activitesListe.filter(a => 
        a.id !== activiteId && ['SOUMIS', 'en_attente', 'planifie', 'EN_VERIFICATION'].includes(a.statut)
      )
      setSelectedActiviteId(remaining.length > 0 ? remaining[0].id : null)
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Une erreur est survenue.',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Gestionnaire de demande de correction
  const handleDemandeCorrection = async (activiteId: string, motif?: string) => {
    if (!motif?.trim()) {
      toast({
        title: 'Motif requis',
        description: 'Veuillez indiquer les corrections demandées.',
        variant: 'destructive',
      })
      return
    }

    setIsLoading(true)
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1200))
      
      setActivitesListe(prev => prev.map(a => 
        a.id === activiteId ? { ...a, statut: 'CORRECTION', motifRejet: motif } : a
      ))

      toast({
        title: '📝 Correction demandée',
        description: `Une demande de correction a été envoyée.`,
      })

      const remaining = activitesListe.filter(a => 
        a.id !== activiteId && ['SOUMIS', 'en_attente', 'planifie', 'EN_VERIFICATION'].includes(a.statut)
      )
      setSelectedActiviteId(remaining.length > 0 ? remaining[0].id : null)
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Une erreur est survenue.',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Validation des activités</h1>
          <p className="text-slate-500 mt-1">
            Examinez et prenez des décisions sur les activités soumises
          </p>
        </div>
        
        {/* Badges de statistiques */}
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="outline" className="gap-1.5 px-3 py-1.5 bg-orange-50 border-orange-200 text-orange-700">
            <Clock className="w-3.5 h-3.5" />
            En attente: {stats.enAttente}
          </Badge>
          <Badge variant="outline" className="gap-1.5 px-3 py-1.5 bg-amber-50 border-amber-200 text-amber-700">
            <RefreshCw className="w-3.5 h-3.5" />
            Vérification: {stats.enVerification}
          </Badge>
          <Badge variant="outline" className="gap-1.5 px-3 py-1.5 bg-green-50 border-green-200 text-green-700">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Validées: {stats.validees}
          </Badge>
          <Badge variant="outline" className="gap-1.5 px-3 py-1.5 bg-red-50 border-red-200 text-red-700">
            <XCircle className="w-3.5 h-3.5" />
            Rejetées: {stats.rejetees}
          </Badge>
        </div>
      </div>

      {/* Grille principale */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Liste des activités à valider */}
        <div className="lg:col-span-2 space-y-4">
          {/* Barre de recherche */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              placeholder="Rechercher une activité à valider..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-white"
            />
          </div>

          {/* Liste des activités */}
          <div className="space-y-3 max-h-[calc(100vh-280px)] overflow-y-auto pr-2 custom-scrollbar">
            {activitesEnAttente.length === 0 ? (
              <Card className="border-green-200 bg-gradient-to-br from-green-50/50 to-white">
                <CardContent className="py-12 text-center">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 flex items-center justify-center">
                    <CheckCircle2 className="w-8 h-8 text-green-500" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">Tout est à jour !</h3>
                  <p className="text-slate-500 max-w-sm mx-auto">
                    Aucune activité en attente de validation. Toutes les activités ont été traitées.
                  </p>
                </CardContent>
              </Card>
            ) : (
              activitesEnAttente.map((activite) => {
                const statutConfig = STATUT_VALIDATION[activite.statut] || STATUT_VALIDATION.en_attente
                
                return (
                  <Card 
                    key={activite.id}
                    className={`cursor-pointer transition-all duration-200 hover:shadow-md hover:border-orange-200 ${
                      selectedActiviteId === activite.id 
                        ? 'ring-2 ring-orange-500 border-orange-200 bg-orange-50/30 shadow-md' 
                        : 'border-slate-200'
                    }`}
                    onClick={() => setSelectedActiviteId(activite.id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-3 flex-1 min-w-0">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                            selectedActiviteId === activite.id ? 'bg-orange-100' : 'bg-slate-100'
                          }`}>
                            <AlertTriangle className={`w-5 h-5 ${
                              selectedActiviteId === activite.id ? 'text-orange-600' : 'text-slate-400'
                            }`} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className={`font-medium truncate transition-colors ${
                              selectedActiviteId === activite.id ? 'text-orange-800' : 'text-slate-900'
                            }`}>
                              {activite.nom}
                            </h3>
                            <p className="text-sm text-slate-500 mt-0.5 line-clamp-1">
                              {activite.organisationNom}
                            </p>
                            
                            <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-slate-500">
                              <span className="flex items-center gap-1">
                                📅 {new Date(activite.dateActivite).toLocaleDateString('fr-FR')}
                              </span>
                              <span>•</span>
                              <span>{formatMontant(activite.budgetAlloue)}</span>
                              <span>•</span>
                              <span>{activite.beneficiairesCount} bénéf.</span>
                            </div>

                            {activite.progression > 0 && (
                              <div className="mt-2">
                                <Progress value={activite.progression} className="h-1.5" />
                                <span className="text-xs text-slate-400 mt-0.5 block">{activite.progression}%</span>
                              </div>
                            )}
                          </div>
                        </div>

                        <Badge 
                          variant="secondary" 
                          className={`${statutConfig.color} flex-shrink-0`}
                        >
                          {statutConfig.label}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                )
              })
            )}
          </div>
        </div>

        {/* Panneau de décision */}
        <div className="lg:col-span-1">
          <div className="sticky top-24">
            <PanneauDecision 
              activite={selectedActivite}
              onValider={handleValider}
              onRejeter={handleRejeter}
              onDemandeCorrection={handleDemandeCorrection}
              isLoading={isLoading}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
