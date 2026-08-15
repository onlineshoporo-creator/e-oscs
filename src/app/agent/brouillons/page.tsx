'use client'

import React from 'react'
import Link from 'next/link'
import {
  FileEdit,
  PlusCircle,
  Trash2,
  ExternalLink,
  Clock,
  AlertCircle,
  Sparkles,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
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

// Données mockées des brouillons
const mockBrouillons = [
  {
    id: 'draft-1',
    intitule: 'Formation en techniques agricoles',
    dateCreation: '2025-01-10',
    dateDerniereModif: '2025-01-14',
    progression: 75, // pourcentage de complétion
    type: 'FORMATION',
  },
  {
    id: 'draft-2',
    intitule: 'Campagne de vaccination',
    dateCreation: '2025-01-08',
    dateDerniereModif: '2025-01-08',
    progression: 25,
    type: 'CAMPAGNE',
  },
  {
    id: 'draft-3',
    intitule: 'Atelier d\'alphabétisation',
    dateCreation: '2025-01-05',
    dateDerniereModif: '2025-01-06',
    progression: 50,
    type: 'ATELIER',
  },
]

function formatDate(dateStr: string): string {
  const date = new Date(dateStr)
  return date.toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

function getProgressionColor(progression: number): string {
  if (progression >= 75) return 'bg-[#009E60]'
  if (progression >= 50) return 'bg-[#F77F00]'
  return 'bg-slate-400'
}

function getTypeBadge(type: string) {
  const config: Record<string, { emoji: string; label: string; className: string }> = {
    FORMATION: { emoji: '🎓', label: 'Formation', className: 'bg-purple-100 text-purple-700' },
    CAMPAGNE: { emoji: '📣', label: 'Campagne', className: 'bg-teal-100 text-teal-700' }
  }
  const c = config[type] || { emoji: '📋', label: type, className: 'bg-slate-100 text-slate-700' }
  return (
    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${c.className}`}>
      {c.emoji} {c.label}
    </span>
  )
}

export default function BrouillonsPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* En-tête */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-slate-900 flex items-center gap-2">
            <FileEdit className="w-7 h-7 text-[#F77F00]" />
            Mes brouillons
          </h1>
          <p className="text-slate-500 mt-1">
            Reprenez et finalisez vos activités inachevées.
          </p>
        </div>
        
        <Link href="/agent/activites/nouvelle">
          <Button className="bg-[#F77F00] hover:bg-[#E67300] text-white gap-2">
            <PlusCircle className="w-4 h-4" />
            Nouvelle activité
          </Button>
        </Link>
      </div>

      {/* Info banner */}
      <Card className="bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-200">
        <CardContent className="p-4 flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0">
            <Clock className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <p className="text-sm font-semibold text-blue-800">
              Les brouillons sont sauvegardés automatiquement ✨
            </p>
            <p className="text-sm text-blue-600 mt-1">
              Vous pouvez revenir sur vos brouillons à tout moment pour les compléter et les soumettre. 
              Ils sont conservés pendant 30 jours.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Statistiques rapides */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="border-slate-200 bg-slate-50/50">
          <CardContent className="p-4 text-center">
            <p className="text-3xl font-bold text-slate-900">{mockBrouillons.length}</p>
            <p className="text-sm text-slate-500">Total brouillons</p>
          </CardContent>
        </Card>
        <Card className="border-orange-200 bg-orange-50/30">
          <CardContent className="p-4 text-center">
            <p className="text-3xl font-bold text-orange-600">
              {mockBrouillons.filter(b => b.progression > 0 && b.progression < 75).length}
            </p>
            <p className="text-sm text-orange-600">En cours</p>
          </CardContent>
        </Card>
        <Card className="border-green-200 bg-green-50/30">
          <CardContent className="p-4 text-center">
            <p className="text-3xl font-bold text-green-600">
              {mockBrouillons.filter(b => b.progression >= 75).length}
            </p>
            <p className="text-sm text-green-600">Prêts à soumettre</p>
          </CardContent>
        </Card>
      </div>

      {/* Liste des brouillons */}
      <div className="space-y-4">
        {mockBrouillons.map((brouillon) => (
          <Card key={brouillon.id} className="border-slate-200 hover:shadow-lg transition-all duration-300 group overflow-hidden">
            <CardContent className="p-0">
              <div className="flex flex-col lg:flex-row">
                {/* Barre latérale colorée selon progression */}
                <div 
                  className={`w-2 ${getProgressionColor(brouillon.progression)} transition-all duration-300 group-hover:w-3`}
                />
                
                <div className="flex-1 p-4 lg:p-5">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="flex items-start gap-4 flex-1 min-w-0">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                        brouillon.progression >= 75 ? 'bg-green-100' : brouillon.progression >= 50 ? 'bg-orange-100' : 'bg-slate-100'
                      }`}>
                        <FileEdit className={`w-6 h-6 ${
                          brouillon.progression >= 75 ? 'text-green-600' : brouillon.progression >= 50 ? 'text-orange-600' : 'text-slate-500'
                        }`} />
                      </div>
                      
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <h3 className="font-semibold text-slate-900 truncate group-hover:text-[#F77F00] transition-colors">
                            {brouillon.intitule}
                          </h3>
                          {getTypeBadge(brouillon.type)}
                        </div>
                        
                        <p className="text-sm text-slate-500 mt-1">
                          Créé le {formatDate(brouillon.dateCreation)}
                          {brouillon.dateDerniereModif !== brouillon.dateCreation && (
                            <> · Modifié le {formatDate(brouillon.dateDerniereModif)}</>
                          )}
                        </p>

                        {/* Barre de progression */}
                        <div className="mt-3 max-w-[250px]">
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="text-xs text-slate-500">Progression</span>
                            <span className={`text-xs font-semibold ${
                              brouillon.progression >= 75 ? 'text-green-600' : brouillon.progression >= 50 ? 'text-orange-600' : 'text-slate-600'
                            }`}>
                              {brouillon.progression}%
                            </span>
                          </div>
                          <Progress value={brouillon.progression} className="h-2" />
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">
                      <Badge variant={brouillon.progression > 50 ? "default" : "secondary"} className={
                        brouillon.progression === 100 
                          ? "bg-green-100 text-green-700 border-green-200" 
                          : brouillon.progression >= 75 
                            ? "bg-green-50 text-green-600"
                            : ""
                      }>
                        {brouillon.progression === 100 ? '✓ Prêt à soumettre' : brouillon.progression >= 75 ? 'Presque terminé' : 'En cours'}
                      </Badge>
                      
                      <Link href={`/agent/activites/nouvelle?id=${brouillon.id}`}>
                        <Button variant="outline" size="sm" className="gap-1.5 hover:bg-[#F77F00] hover:text-white hover:border-[#F77F00] transition-colors">
                          <ExternalLink className="w-3.5 h-3.5" />
                          Continuer
                        </Button>
                      </Link>

                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="icon" className="text-red-400 hover:text-red-600 hover:bg-red-50 h-9 w-9">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle className="flex items-center gap-2">
                              <AlertCircle className="w-5 h-5 text-red-500" />
                              Supprimer ce brouillon ?
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              Cette action est irréversible. Le brouillon &quot;{brouillon.intitule}&quot; sera définitivement supprimé avec toutes ses données.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Annuler</AlertDialogCancel>
                            <AlertDialogAction className="bg-red-600 hover:bg-red-700">
                              Supprimer
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {mockBrouillons.length === 0 && (
          <Card className="border-dashed border-2 border-slate-200">
            <CardContent className="p-12 text-center">
              <div className="w-20 h-20 mx-auto rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
                <FileEdit className="w-10 h-10 text-slate-400" />
              </div>
              <h3 className="text-lg font-semibold text-slate-700 mb-2">Aucun brouillon</h3>
              <p className="text-sm text-slate-500 max-w-md mx-auto mb-6">
                Vous n&apos;avez pas d&apos;activité en cours de rédaction. Commencez une nouvelle activité et elle apparaîtra ici si vous l&apos;enregistrez comme brouillon.
              </p>
              <Link href="/agent/activites/nouvelle">
                <Button className="bg-[#F77F00] hover:bg-[#E67300] text-white gap-2">
                  <Sparkles className="w-4 h-4" />
                  Créer ma première activité
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
