'use client'

import React from 'react'
import Link from 'next/link'
import {
  CheckCircle2,
  Clock,
  XCircle,
  Eye,
  Calendar,
  MapPin,
  RefreshCw,
  PlusCircle,
  AlertTriangle,
  Filter,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

// Données mockées des activités soumises
const mockSoumises = [
  {
    id: '1',
    intitule: 'Sensibilisation sur l\'hygiène communautaire',
    date: '2025-01-15',
    lieu: 'Abidjan, Yopougon',
    statut: 'VALIDEE' as const,
    dateValidation: '2025-01-17',
    validateur: 'Mme Kouadio Marie',
    beneficiaires: 45,
  },
  {
    id: '2',
    intitule: 'Distribution de kits scolaires',
    date: '2025-01-12',
    lieu: 'Bouaké',
    statut: 'EN_ATTENTE' as const,
    dateSoumission: '2025-01-13',
    beneficiaires: 120,
  },
  {
    id: '4',
    intitule: 'Visite aux personnes âgées',
    date: '2025-01-08',
    lieu: 'San-Pedro',
    statut: 'VALIDEE' as const,
    dateValidation: '2025-01-10',
    validateur: 'M. Yao Serge',
    beneficiaires: 25,
  },
  {
    id: '6',
    intitule: 'Réunion de coordination mensuelle',
    date: '2025-01-03',
    lieu: 'Abidjan, Plateau',
    statut: 'REJETEE' as const,
    dateRejet: '2025-01-05',
    motifRejet: 'Informations manquantes sur les bénéficiaires. Veuillez compléter la section bénéficiares avec le nombre exact de personnes touchées.',
    beneficiaires: 15,
  },
]

function getStatutConfig(statut: string) {
  switch (statut) {
    case 'VALIDEE':
      return {
        badge: <Badge className="bg-green-100 text-green-700 border-green-200 hover:bg-green-200">Validée ✓</Badge>,
        icon: <CheckCircle2 className="w-6 h-6 text-green-500" />,
        bgColor: 'bg-green-50/50 border-green-100',
        headerBg: 'from-green-500 to-emerald-600',
      }
    case 'EN_ATTENTE':
      return {
        badge: <Badge className="bg-orange-100 text-orange-700 border-orange-200 hover:bg-orange-200 animate-pulse">En attente ⏳</Badge>,
        icon: <Clock className="w-6 h-6 text-orange-500" />,
        bgColor: 'bg-orange-50/50 border-orange-100',
        headerBg: 'from-[#F77F00] to-[#E67300]',
      }
    case 'REJETEE':
      return {
        badge: <Badge className="bg-red-100 text-red-700 border-red-200 hover:bg-red-200">Rejetée ✗</Badge>,
        icon: <XCircle className="w-6 h-6 text-red-500" />,
        bgColor: 'bg-red-50/50 border-red-100',
        headerBg: 'from-red-500 to-rose-600',
      }
    default:
      return {
        badge: <Badge variant="secondary">{statut}</Badge>,
        icon: null,
        bgColor: '',
        headerBg: 'from-slate-400 to-slate-600',
      }
  }
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr)
  return date.toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

export default function SoumisesPage() {
  // Compter par statut
  const stats = {
    enAttente: mockSoumises.filter(a => a.statut === 'EN_ATTENTE').length,
    validees: mockSoumises.filter(a => a.statut === 'VALIDEE').length,
    rejetees: mockSoumises.filter(a => a.statut === 'REJETEE').length,
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* En-tête */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-slate-900 flex items-center gap-2">
            <Eye className="w-7 h-7 text-[#009E60]" />
            Activités soumises
          </h1>
          <p className="text-slate-500 mt-1">
            Suivez le statut de vos activités envoyées pour validation.
          </p>
        </div>
        
        <Link href="/agent/activites/nouvelle">
          <Button className="bg-[#F77F00] hover:bg-[#E67300] text-white gap-2">
            <PlusCircle className="w-4 h-4" />
            Nouvelle activité
          </Button>
        </Link>
      </div>

      {/* Statistiques rapides */}
      <div className="grid grid-cols-3 gap-4">
        <Card 
          className={`border-orange-200 bg-gradient-to-br from-orange-50 to-white cursor-pointer transition-all hover:shadow-md ${stats.enAttente > 0 ? 'ring-2 ring-orange-200' : ''}`}
        >
          <CardContent className="p-4 text-center">
            <Clock className="w-8 h-8 mx-auto text-orange-500 mb-2" />
            <p className="text-3xl font-bold text-orange-700">{stats.enAttente}</p>
            <p className="text-sm text-orange-600">En attente</p>
            {stats.enAttente > 0 && (
              <p className="text-xs text-orange-500 mt-1">En cours de validation</p>
            )}
          </CardContent>
        </Card>

        <Card className="border-green-200 bg-gradient-to-br from-green-50 to-white cursor-pointer transition-all hover:shadow-md">
          <CardContent className="p-4 text-center">
            <CheckCircle2 className="w-8 h-8 mx-auto text-green-500 mb-2" />
            <p className="text-3xl font-bold text-green-700">{stats.validees}</p>
            <p className="text-sm text-green-600">Validées</p>
            <p className="text-xs text-green-500 mt-1">Approuvées par votre responsable</p>
          </CardContent>
        </Card>

        <Card className={`border-red-200 bg-gradient-to-br from-red-50 to-white cursor-pointer transition-all hover:shadow-md ${stats.rejetees > 0 ? 'ring-2 ring-red-200' : ''}`}>
          <CardContent className="p-4 text-center">
            <XCircle className="w-8 h-8 mx-auto text-red-500 mb-2" />
            <p className="text-3xl font-bold text-red-700">{stats.rejetees}</p>
            <p className="text-sm text-red-600">Rejetées</p>
            {stats.rejetees > 0 && (
              <p className="text-xs text-red-500 mt-1">Corrections requises</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Liste des activités avec onglets optionnels */}
      <Tabs defaultValue="all" className="space-y-4">
        <TabsList className="bg-slate-100 p-1 rounded-xl w-full">
          <TabsTrigger value="all" className="gap-2 data-[state=active]:bg-white rounded-lg">
            Toutes ({mockSoumises.length})
          </TabsTrigger>
          <TabsTrigger value="en_attente" className="gap-2 data-[state=active]:bg-white rounded-lg">
            En attente ({stats.enAttente})
          </TabsTrigger>
          <TabsTrigger value="validees" className="gap-2 data-[state=active]:bg-white rounded-lg">
            Validées ({stats.validees})
          </TabsTrigger>
          <TabsTrigger value="rejetees" className="gap-2 data-[state=active]:bg-white rounded-lg">
            Rejetées ({stats.rejetees})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <ActivitiesList activities={mockSoumises} />
        </TabsContent>
        
        <TabsContent value="en_attente">
          <ActivitiesList activities={mockSoumises.filter(a => a.statut === 'EN_ATTENTE')} />
        </TabsContent>
        
        <TabsContent value="validees">
          <ActivitiesList activities={mockSoumises.filter(a => a.statut === 'VALIDEE')} />
        </TabsContent>
        
        <TabsContent value="rejetees">
          <ActivitiesList activities={mockSoumises.filter(a => a.statut === 'REJETEE')} />
        </TabsContent>
      </Tabs>
    </div>
  )
}

// Composant liste d'activités
function ActivitiesList({ activities }: { activities: typeof mockSoumises }) {
  if (activities.length === 0) {
    return (
      <Card className="border-dashed border-2 border-slate-200">
        <CardContent className="p-12 text-center">
          <Filter className="w-12 h-12 mx-auto text-slate-300 mb-4" />
          <h3 className="text-lg font-semibold text-slate-700 mb-2">Aucune activité dans cette catégorie</h3>
          <p className="text-sm text-slate-500 max-w-md mx-auto">
            Il n&apos;y a pas d&apos;activité correspondant à ce filtre.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {activities.map((activite) => {
        const config = getStatutConfig(activite.statut)
        
        return (
          <Card key={activite.id} className={`border overflow-hidden transition-all duration-300 hover:shadow-lg ${config.bgColor}`}>
            <CardContent className="p-0">
              <div className="flex">
                {/* Bandeau latérale colorée */}
                <div className={`w-1.5 bg-gradient-to-b ${config.headerBg}`} />
                
                <div className="flex-1 p-4 lg:p-5">
                  <div className="flex flex-col gap-4">
                    {/* En-tête de la carte */}
                    <div className="flex items-start gap-4">
                      <div className={`w-14 h-14 rounded-xl bg-white flex items-center justify-center flex-shrink-0 shadow-sm`}>
                        {config.icon}
                      </div>
                      
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-start justify-between gap-2">
                          <h3 className="font-semibold text-slate-900 text-lg">
                            {activite.intitule}
                          </h3>
                          {config.badge}
                        </div>
                        
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-sm text-slate-500">
                          <span className="flex items-center gap-1 font-medium">
                            <Calendar className="w-4 h-4 text-[#F77F00]" />
                            Activité le {formatDate(activite.date)}
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            {activite.lieu}
                          </span>
                          <span className="flex items-center gap-1">
                            👥 {activite.beneficiaires} bénéficiaires
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Détails selon le statut */}
                    {activite.statut === 'EN_ATTENTE' && (
                      <div className="ml-18 lg:ml-[72px] p-4 bg-white/80 rounded-xl border border-orange-200 shadow-sm">
                        <div className="flex items-start gap-3">
                          <Clock className="w-5 h-5 text-orange-500 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="text-sm font-medium text-orange-800">
                              En attente de validation
                            </p>
                            <p className="text-sm text-orange-600 mt-1">
                              Soumise le <strong>{formatDate(activite.dateSoumission!)}</strong> — Votre responsable examinera cette activité sous peu.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {activite.statut === 'VALIDEE' && (
                      <div className="ml-18 lg:ml-[72px] p-4 bg-white/80 rounded-xl border border-green-200 shadow-sm">
                        <div className="flex items-start gap-3">
                          <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="text-sm font-medium text-green-800">
                              Validée avec succès ! 🎉
                            </p>
                            <p className="text-sm text-green-600 mt-1">
                              Validée le <strong>{formatDate(activite.dateValidation!)}</strong> par <strong>{activite.validateur}</strong>.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {activite.statut === 'REJETEE' && (
                      <div className="ml-18 lg:ml-[72px] p-4 bg-white/80 rounded-xl border border-red-200 shadow-sm">
                        <div className="flex items-start gap-3">
                          <AlertTriangle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                          <div className="flex-1">
                            <p className="text-sm font-semibold text-red-800 mb-1">
                              Cette activité nécessite des corrections
                            </p>
                            <p className="text-sm text-red-700 italic bg-red-50 p-3 rounded-lg border border-red-100">
                              &quot;{activite.motifRejet}&quot;
                            </p>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="mt-3 text-red-600 border-red-300 hover:bg-red-50 gap-2"
                            >
                              <RefreshCw className="w-3.5 h-3.5" />
                              Corriger et resoumettre
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="ml-18 lg:ml-[72px] flex items-center gap-3 pt-2">
                      <Link href={`/app/activites/${activite.id}`}>
                        <Button variant="ghost" size="sm" className="gap-2 text-slate-600 hover:text-[#F77F00]">
                          <Eye className="w-4 h-4" />
                          Voir les détails
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
