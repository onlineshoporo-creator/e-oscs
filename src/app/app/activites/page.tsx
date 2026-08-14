'use client'

import React, { useState, useMemo } from 'react'
import Link from 'next/link'
import { 
  Plus, 
  Search, 
  Filter, 
  SlidersHorizontal,
  Eye,
  Edit3,
  Calendar,
  MapPin,
  Users,
  MoreVertical
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { 
  activites, 
  formatMontant, 
  STATUT_CONFIG, 
  CATEGORIES,
  type Activite 
} from '@/lib/mock/activites'

type ViewMode = 'grid' | 'list'

export default function ActivitesPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [statutFilter, setStatutFilter] = useState<string>('all')
  const [categorieFilter, setCategorieFilter] = useState<string>('all')
  const [viewMode, setViewMode] = useState<ViewMode>('list')

  // Filtrer les activités
  const filteredActivites = useMemo(() => {
    return activites.filter(activite => {
      const matchSearch = searchTerm === '' || 
        activite.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        activite.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        activite.organisationNom.toLowerCase().includes(searchTerm.toLowerCase())
      
      const matchStatut = statutFilter === 'all' || activite.statut === statutFilter
      const matchCategorie = categorieFilter === 'all' || activite.categorie === categorieFilter
      
      return matchSearch && matchStatut && matchCategorie
    })
  }, [searchTerm, statutFilter, categorieFilter])

  const statutsDisponibles = [...new Set(activites.map(a => a.statut))]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Activités</h1>
          <p className="text-slate-500 mt-1">
            Gestion et suivi de toutes les activités
          </p>
        </div>
        <Link href="/app/activites/nouveau">
          <Button className="gap-2 bg-orange-500 hover:bg-orange-600">
            <Plus className="w-4 h-4" />
            Nouvelle activité
          </Button>
        </Link>
      </div>

      {/* Filtres */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Recherche */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                placeholder="Rechercher une activité..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Filtre Statut */}
            <Select value={statutFilter} onValueChange={setStatutFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <Filter className="w-4 h-4 mr-2 text-slate-400" />
                <SelectValue placeholder="Statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les statuts</SelectItem>
                {statutsDisponibles.map(statut => (
                  <SelectItem key={statut} value={statut}>
                    {STATUT_CONFIG[statut]?.label || statut}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Filtre Catégorie */}
            <Select value={categorieFilter} onValueChange={setCategorieFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SlidersHorizontal className="w-4 h-4 mr-2 text-slate-400" />
                <SelectValue placeholder="Catégorie" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes catégories</SelectItem>
                {CATEGORIES.map(cat => (
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Compteur */}
            <div className="hidden lg:flex items-center gap-2 text-sm text-slate-500 px-3 py-2 bg-slate-50 rounded-md">
              <span className="font-medium text-slate-900">{filteredActivites.length}</span>
              résultat(s)
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Liste des activités */}
      {filteredActivites.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-100 flex items-center justify-center">
              <Search className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-medium text-slate-900 mb-1">Aucune activité trouvée</h3>
            <p className="text-slate-500 mb-4">
              Essayez de modifier vos critères de recherche ou créez une nouvelle activité.
            </p>
            <Link href="/app/activites/nouveau">
              <Button className="bg-orange-500 hover:bg-orange-600">
                Créer une activité
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : viewMode === 'list' ? (
        /* Vue Liste */
        <div className="space-y-3">
          {filteredActivites.map((activite) => (
            <ActiviteCard key={activite.id} activite={activite} />
          ))}
        </div>
      ) : (
        /* Vue Grille */
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filteredActivites.map((activite) => (
            <ActiviteGridCard key={activite.id} activite={activite} />
          ))}
        </div>
      )}
    </div>
  )
}

// Carte d'activité (vue liste)
function ActiviteCard({ activite }: { activite: Activite }) {
  const statutConfig = STATUT_CONFIG[activite.statut]

  return (
    <Card className="hover:shadow-md transition-all duration-200 group">
      <CardContent className="p-4 lg:p-5">
        <div className="flex items-start justify-between gap-4">
          {/* Contenu principal */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start gap-3">
              <div className={`w-3 h-3 rounded-full mt-2 flex-shrink-0 ${statutConfig?.dotColor}`} />
              <div className="flex-1 min-w-0">
                <Link href={`/app/activites/${activite.id}`}>
                  <h3 className="font-medium text-slate-900 hover:text-orange-600 transition-colors truncate group-hover:text-orange-600">
                    {activite.nom}
                  </h3>
                </Link>
                <p className="text-sm text-slate-500 mt-1 line-clamp-1">
                  {activite.description}
                </p>

                {/* Métadonnées */}
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-3 text-xs text-slate-500">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" />
                    {activite.lieu.split(',')[0]}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {new Date(activite.dateActivite).toLocaleDateString('fr-FR')}
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="w-3.5 h-3.5" />
                    {activite.beneficiairesCount} bénéf.
                  </span>
                </div>

                {/* Progression */}
                {activite.progression > 0 && (
                  <div className="mt-3">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-slate-500">Progression</span>
                      <span className="font-medium text-slate-700">{activite.progression}%</span>
                    </div>
                    <Progress value={activite.progression} className="h-1.5" />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Actions et badges */}
          <div className="flex flex-col items-end gap-2 flex-shrink-0">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link href={`/app/activites/${activite.id}`}>
                    <Eye className="w-4 h-4 mr-2" />
                    Voir détails
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Edit3 className="w-4 h-4 mr-2" />
                  Modifier
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Badge variant="secondary" className={`${statutConfig?.color} text-xs`}>
              {statutConfig?.label}
            </Badge>

            <Badge variant="outline" className="text-xs">
              {formatMontant(activite.budgetAlloue)}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Carte d'activité (vue grille)
function ActiviteGridCard({ activite }: { activite: Activite }) {
  const statutConfig = STATUT_CONFIG[activite.statut]

  return (
    <Card className="hover:shadow-md transition-all duration-200 group cursor-pointer">
      <Link href={`/app/activites/${activite.id}`}>
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-2">
            <Badge variant="secondary" className={`${statutConfig?.color} text-xs`}>
              {statutConfig?.label}
            </Badge>
            <span className="text-xs text-slate-400">{activite.categorie}</span>
          </div>
          <CardTitle className="text-base mt-2 line-clamp-2 group-hover:text-orange-600 transition-colors">
            {activite.nom}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-slate-500 line-clamp-2 mb-3">
            {activite.description}
          </p>
          
          <div className="space-y-2 text-xs text-slate-500">
            <div className="flex items-center gap-2">
              <Calendar className="w-3.5 h-3.5" />
              {new Date(activite.dateActivite).toLocaleDateString('fr-FR')}
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-3.5 h-3.5" />
              {activite.beneficiairesCount} bénéficiaires
            </div>
          </div>

          {activite.progression > 0 && (
            <div className="mt-3 pt-3 border-t border-slate-100">
              <Progress value={activite.progression} className="h-1.5" />
              <p className="text-xs text-slate-500 mt-1 text-right">{activite.progression}%</p>
            </div>
          )}
        </CardContent>
      </Link>
    </Card>
  )
}
