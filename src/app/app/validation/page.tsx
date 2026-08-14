'use client'

import React, { useState, useMemo } from 'react'
import { 
  CheckCircle2,
  XCircle,
  Clock,
  Search,
  Filter,
  AlertCircle
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import { useToast } from '@/hooks/use-toast'
import { PanneauDecision } from '@/components/metier/validation/panneau-decision'
import { 
  activites, 
  formatMontant, 
  STATUT_CONFIG,
  type Activite 
} from '@/lib/mock/activites'

export default function ValidationPage() {
  const [selectedActiviteId, setSelectedActiviteId] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [activitesListe, setActivitesListe] = useState<Activite[]>(activites)
  const { toast } = useToast()

  // Filtrer les activités en attente de validation
  const activitesEnAttente = useMemo(() => {
    return activitesListe.filter(a => 
      (a.statut === 'en_attente' || a.statut === 'planifie') &&
      (searchTerm === '' || 
        a.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.organisationNom.toLowerCase().includes(searchTerm.toLowerCase()))
    )
  }, [activitesListe, searchTerm])

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

  // Gestionnaire de décision
  const handleDecision = async (activiteId: string, decision: 'valide' | 'rejete', motif?: string) => {
    setIsLoading(true)

    // Simuler un appel API
    await new Promise(resolve => setTimeout(resolve, 1000))

    // Mettre à jour l'activité localement
    setActivitesListe(prev => prev.map(a => 
      a.id === activiteId 
        ? { ...a, statut: decision, motifRejet: motif }
        : a
    ))

    // Notification
    toast({
      title: decision === 'valide' ? 'Activité validée' : 'Activité rejetée',
      description: `L'activité a été ${decision}e avec succès.`,
      variant: decision === 'valide' ? 'default' : 'destructive',
    })

    // Sélectionner l'activité suivante
    const remaining = activitesListe.filter(a => 
      a.id !== activiteId && (a.statut === 'en_attente' || a.statut === 'planifie')
    )
    
    setSelectedActiviteId(remaining.length > 0 ? remaining[0].id : null)
    setIsLoading(false)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Validation des activités</h1>
          <p className="text-slate-500 mt-1">
            {activitesEnAttente.length} activité(s) en attente de validation
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Badge variant="outline" className="gap-1">
            <Clock className="w-3 h-3" />
            En attente: {activitesEnAttente.length}
          </Badge>
          <Badge variant="outline" className="gap-1 text-green-600 border-green-200 bg-green-50">
            <CheckCircle2 className="w-3 h-3" />
            Validées: {activitesListe.filter(a => a.statut === 'valide').length}
          </Badge>
          <Badge variant="outline" className="gap-1 text-red-600 border-red-200 bg-red-50">
            <XCircle className="w-3 h-3" />
            Rejetées: {activitesListe.filter(a => a.statut === 'rejete').length}
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
              className="pl-10"
            />
          </div>

          {/* Liste des activités */}
          <div className="space-y-3 max-h-[calc(100vh-280px)] overflow-y-auto pr-2">
            {activitesEnAttente.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <CheckCircle2 className="w-16 h-16 text-green-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-slate-900 mb-2">Tout est à jour !</h3>
                  <p className="text-slate-500">
                    Aucune activité en attente de validation.
                  </p>
                </CardContent>
              </Card>
            ) : (
              activitesEnAttente.map((activite) => (
                <Card 
                  key={activite.id}
                  className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                    selectedActiviteId === activite.id 
                      ? 'ring-2 ring-orange-500 border-orange-200 bg-orange-50/30' 
                      : ''
                  }`}
                  onClick={() => setSelectedActiviteId(activite.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3 flex-1 min-w-0">
                        <AlertCircle className={`w-5 h-5 mt-0.5 flex-shrink-0 ${
                          selectedActiviteId === activite.id ? 'text-orange-500' : 'text-slate-400'
                        }`} />
                        <div className="flex-1 min-w-0">
                          <h3 className={`font-medium truncate ${
                            selectedActiviteId === activite.id ? 'text-orange-700' : 'text-slate-900'
                          }`}>
                            {activite.nom}
                          </h3>
                          <p className="text-sm text-slate-500 mt-0.5 line-clamp-1">
                            {activite.organisationNom}
                          </p>
                          
                          <div className="flex items-center gap-4 mt-2 text-xs text-slate-500">
                            <span>{new Date(activite.dateActivite).toLocaleDateString('fr-FR')}</span>
                                    <span>{formatMontant(activite.budgetAlloue)}</span>
                                    <span>{activite.beneficiairesCount} bénéf.</span>
                          </div>

                          {activite.progression > 0 && (
                            <div className="mt-2">
                              <Progress value={activite.progression} className="h-1" />
                              <span className="text-xs text-slate-400 mt-0.5">{activite.progression}%</span>
                            </div>
                          )}
                        </div>
                      </div>

                      <Badge 
                        variant="secondary" 
                        className={`${STATUT_CONFIG[activite.statut]?.color} flex-shrink-0`}
                      >
                        {STATUT_CONFIG[activite.statut]?.label}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>

        {/* Panneau de décision */}
        <div className="lg:col-span-1">
          <div className="sticky top-24">
            <PanneauDecision 
              activite={selectedActivite}
              onDecision={handleDecision}
              isLoading={isLoading}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
