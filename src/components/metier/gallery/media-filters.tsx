'use client'

import React from 'react'
import { Search, Filter, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'

export interface MediaFilters {
  kind: 'PHOTO' | 'DOCUMENT' | 'ALL'
  lien: 'all' | 'activites' | 'incidents' | 'aucun'
  search: string
}

interface MediaFiltersProps {
  filters: MediaFilters
  onFiltersChange: (filters: MediaFilters) => void
  stats?: {
    totalPhotos: number
    totalDocuments: number
    tailleTotale: number
    selectionneesPresentation: number
  }
}

// Formater la taille en KB/MB
function formatTaille(taille: number): string {
  if (taille < 1024) return `${taille} o`
  if (taille < 1024 * 1024) return `${(taille / 1024).toFixed(1)} Ko`
  return `${(taille / (1024 * 1024)).toFixed(1)} Mo`
}

export function MediaFilters({ filters, onFiltersChange, stats }: MediaFiltersProps) {
  const hasActiveFilters = filters.kind !== 'ALL' || filters.lien !== 'all' || filters.search

  const resetFilters = () => {
    onFiltersChange({
      kind: 'ALL',
      lien: 'all',
      search: '',
    })
  }

  return (
    <div className="space-y-4">
      {/* Barre de recherche et filtres principaux */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Recherche */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            placeholder="Rechercher par nom ou légende..."
            value={filters.search}
            onChange={(e) => onFiltersChange({ ...filters, search: e.target.value })}
            className="pl-10"
          />
          {filters.search && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
              onClick={() => onFiltersChange({ ...filters, search: '' })}
            >
              <X className="w-3 h-3" />
            </Button>
          )}
        </div>

        {/* Filtre type */}
        <Select
          value={filters.kind}
          onValueChange={(value) =>
            onFiltersChange({ ...filters, kind: value as MediaFilters['kind'] })
          }
        >
          <SelectTrigger className="w-full sm:w-[150px]">
            <Filter className="w-4 h-4 mr-2 text-slate-400" />
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">Tous</SelectItem>
            <SelectItem value="PHOTO">📷 Photos</SelectItem>
            <SelectItem value="DOCUMENT">📄 Documents</SelectItem>
          </SelectContent>
        </Select>

        {/* Filtre liaison */}
        <Select
          value={filters.lien}
          onValueChange={(value) =>
            onFiltersChange({ ...filters, lien: value as MediaFilters['lien'] })
          }
        >
          <SelectTrigger className="w-full sm:w-[160px]">
            <SelectValue placeholder="Lien" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les liens</SelectItem>
            <SelectItem value="activites">Activités</SelectItem>
            <SelectItem value="incidents">Incidents</SelectItem>
            <SelectItem value="aucun">Non liés</SelectItem>
          </SelectContent>
        </Select>

        {/* Reset filtres */}
        {hasActiveFilters && (
          <Button variant="outline" size="sm" onClick={resetFilters}>
            <X className="w-4 h-4 mr-1" />
            Réinitialiser
          </Button>
        )}
      </div>

      {/* Stats et badges actifs */}
      <div className="flex flex-wrap items-center gap-2">
        {stats && (
          <>
            <Badge variant="secondary" className="gap-1">
              📷 {stats.totalPhotos} photo{stats.totalPhotos > 1 ? 's' : ''}
            </Badge>
            <Badge variant="secondary" className="gap-1">
              📄 {stats.totalDocuments} document{stats.totalDocuments > 1 ? 's' : ''}
            </Badge>
            <Badge variant="secondary" className="gap-1">
              💾 {formatTaille(stats.tailleTotale)}
            </Badge>
            {stats.selectionneesPresentation > 0 && (
              <Badge className="bg-orange-100 text-orange-700 border-orange-200 gap-1">
                ⭐ {stats.selectionneesPresentation} sélectionnée{stats.selectionneesPresentation > 1 ? 's' : ''}
              </Badge>
            )}
          </>
        )}
        
        {/* Badges des filtres actifs */}
        {filters.kind !== 'ALL' && (
          <Badge variant="outline" className="text-orange-600 border-orange-300">
            {filters.kind === 'PHOTO' ? 'Photos' : 'Documents'}
          </Badge>
        )}
        {filters.lien !== 'all' && (
          <Badge variant="outline" className="text-orange-600 border-orange-300">
            {filters.lien === 'activites' ? 'Activités' : filters.lien === 'incidents' ? 'Incidents' : 'Non liés'}
          </Badge>
        )}
      </div>
    </div>
  )
}
