'use client'

import { useState, useEffect, Suspense } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
import {
  Plus,
  Search,
  BarChart3,
  Eye,
  Edit,
  Trash2,
  AlertCircle,
  TrendingUp,
  Hash,
  FileText,
} from 'lucide-react'
import { IndicatorTypeBadge } from '@/components/metier/indicators/indicator-type-badge'
import { IndicatorsGrid } from '@/components/metier/indicators/indicators-grid'
import { getIndicators, getIndicatorAxes } from '@/lib/actions/indicators'
import type { Indicator, IndicatorKind } from '@/types'

function IndicatorsContent() {
  const [indicators, setIndicators] = useState<Indicator[]>([])
  const [axes, setAxes] = useState<string[]>([])
  const [count, setCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table')
  
  // Filtres
  const [axe, setAxe] = useState<string>('all')
  const [kind, setKind] = useState<IndicatorKind | 'all'>('all')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const limit = 50

  // Charger les données au montage et quand les filtres changent
  useEffect(() => {
    let cancelled = false
    
    async function loadData() {
      setLoading(true)
      
      const [indicatorsResult, axesResult] = await Promise.all([
        getIndicators({ axe: axe !== 'all' ? axe : undefined, kind: kind !== 'all' ? kind : undefined, search: search || undefined, page, limit }),
        getIndicatorAxes(),
      ])

      if (!cancelled) {
        setIndicators(indicatorsResult.indicators)
        setCount(indicatorsResult.count)
        setAxes(axesResult)
        setLoading(false)
      }
    }
    
    loadData()
    
    return () => { cancelled = true }
  }, [axe, kind, search, page])

  const totalPages = Math.ceil(count / limit)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Tableau de Bord des Indicateurs</h1>
          <p className="text-muted-foreground">Suivi et saisie des indicateurs de performance</p>
        </div>
        <div className="flex gap-2">
          <Link href="/app/indicateurs/saisie">
            <Button variant="outline">
              <Edit className="h-4 w-4 mr-2" />
              Saisie rapide
            </Button>
          </Link>
          <Link href="/app/indicateurs/nouveau">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Nouvel indicateur
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Hash className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total indicateurs</p>
                <p className="text-2xl font-bold">{count}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <BarChart3 className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Quantitatifs</p>
                <p className="text-2xl font-bold text-orange-700">
                  {indicators.filter(i => i.kind === 'QUANTITATIF').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <FileText className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Qualitatifs</p>
                <p className="text-2xl font-bold text-purple-700">
                  {indicators.filter(i => i.kind === 'QUALITATIF').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <TrendingUp className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Axes stratégiques</p>
                <p className="text-2xl font-bold text-green-700">{axes.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtres */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-base flex items-center gap-2">
            <Search className="h-4 w-4" />
            Filtres
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Recherche */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher un indicateur..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>

            {/* Axe stratégique */}
            <Select value={axe} onValueChange={(v) => { setAxe(v); setPage(1) }}>
              <SelectTrigger>
                <SelectValue placeholder="Tous les axes" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les axes</SelectItem>
                {axes.map((a) => (
                  <SelectItem key={a} value={a}>{a}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Type */}
            <Select value={kind} onValueChange={(v) => { setKind(v as any); setPage(1) }}>
              <SelectTrigger>
                <SelectValue placeholder="Tous les types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les types</SelectItem>
                <SelectItem value="QUANTITATIF">Quantitatif</SelectItem>
                <SelectItem value="QUALITATIF">Qualitatif</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Toggle vue + Résultats */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {count} indicateur{count > 1 ? 's' : ''} trouvé{count > 1 ? 's' : ''}
        </p>
        <div className="flex items-center gap-2">
          <Button
            variant={viewMode === 'table' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('table')}
          >
            Tableau
          </Button>
          <Button
            variant={viewMode === 'grid' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('grid')}
          >
            Grille
          </Button>
        </div>
      </div>

      {/* Contenu principal */}
      {loading ? (
        <div className="space-y-4 animate-pulse">
          {[...Array(5)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-4">
                <div className="h-12 bg-slate-100 rounded" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : indicators.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-medium text-lg">Aucun indicateur trouvé</h3>
            <p className="text-muted-foreground mt-1">
              Essayez de modifier vos filtres ou créez un nouvel indicateur.
            </p>
            <div className="mt-4 flex justify-center gap-2">
              <Link href="/app/indicateurs/nouveau">
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Créer un indicateur
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      ) : viewMode === 'table' ? (
        /* Vue tableau */
        <Card>
          <CardContent className="p-0 overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Code</TableHead>
                  <TableHead>Nom</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Unité</TableHead>
                  <TableHead>Axe stratégique</TableHead>
                  <TableHead className="w-[150px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {indicators.map((indicator) => (
                  <TableRow key={indicator.id}>
                    <TableCell>
                      <span className="font-mono text-sm">{indicator.code}</span>
                    </TableCell>
                    <TableCell>
                      <span className="font-medium">{indicator.nom}</span>
                      {indicator.description && (
                        <span className="block text-xs text-muted-foreground truncate max-w-[200px]">
                          {indicator.description}
                        </span>
                      )}
                    </TableCell>
                    <TableCell>
                      <IndicatorTypeBadge kind={indicator.kind} size="sm" />
                    </TableCell>
                    <TableCell>{indicator.unite || '-'}</TableCell>
                    <TableCell>
                      {indicator.axe ? (
                        <span className="text-sm">{indicator.axe}</span>
                      ) : (
                        <span className="text-muted-foreground text-sm">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Link href={`/app/indicateurs/${indicator.id}`}>
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4 mr-1" />
                            Voir
                          </Button>
                        </Link>
                        {indicator.organization_id && (
                          <>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <Edit className="h-3.5 w-3.5" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive">
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      ) : (
        /* Vue grille */
        <IndicatorsGrid indicators={indicators} columns={3} />
      )}

      {/* Pagination */}
      {!loading && totalPages > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious 
                onClick={() => setPage(Math.max(1, page - 1))}
                className={page <= 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
              />
            </PaginationItem>
            
            {[...Array(Math.min(totalPages, 5))].map((_, i) => {
              const pageNum = i + 1
              return (
                <PaginationItem key={i}>
                  <PaginationLink
                    onClick={() => setPage(pageNum)}
                    isActive={page === pageNum}
                    className="cursor-pointer"
                  >
                    {pageNum}
                  </PaginationLink>
                </PaginationItem>
              )
            })}
            
            {totalPages > 5 && <PaginationItem>...</PaginationItem>}
            
            <PaginationItem>
              <PaginationNext 
                onClick={() => setPage(Math.min(totalPages, page + 1))}
                className={page >= totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  )
}

export default function IndicatorsPage() {
  return (
    <Suspense fallback={<div className="animate-pulse space-y-4 p-8">
      <div className="h-8 bg-slate-100 rounded w-64" />
      <div className="grid grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => <div key={i} className="h-24 bg-slate-100 rounded" />)}
      </div>
      <div className="h-48 bg-slate-100 rounded" />
    </div>}>
      <IndicatorsContent />
    </Suspense>
  )
}
