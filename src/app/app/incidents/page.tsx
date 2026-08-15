'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
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
  AlertTriangle,
  CheckCircle,
  Clock,
  AlertCircle,
  List,
  Grid3X3,
} from 'lucide-react'
import { SeverityBadge } from '@/components/metier/incidents/severity-badge'
import { IncidentCard } from '@/components/metier/incidents/incident-card'
import { getIncidents, getIncidentStats } from '@/lib/actions/incidents'
import type { Incident, IncidentGravite, IncidentStatut } from '@/types'

function IncidentsContent() {
  const searchParams = useSearchParams()
  
  const [incidents, setIncidents] = useState<Incident[]>([])
  const [stats, setStats] = useState({
    total: 0,
    enCours: 0,
    clotures: 0,
    critiques: 0,
  })
  const [count, setCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table')
  
  // Filtres
  const [statut, setStatut] = useState<IncidentStatut | 'all'>(
    (searchParams.get('statut') as IncidentStatut | 'all') || 'all'
  )
  const [gravite, setGravite] = useState<IncidentGravite | 'all'>(
    (searchParams.get('gravite') as IncidentGravite | 'all') || 'all'
  )
  const [search, setSearch] = useState(searchParams.get('search') || '')
  const [dateDebut, setDateDebut] = useState(searchParams.get('date_debut') || '')
  const [dateFin, setDateFin] = useState(searchParams.get('date_fin') || '')
  const [page, setPage] = useState(parseInt(searchParams.get('page') || '1'))
  const limit = 20

  // Charger les données au montage et quand les filtres changent
  useEffect(() => {
    let cancelled = false
    
    async function loadData() {
      setLoading(true)
      
      // Récupérer l'organisation de l'utilisateur
      const { getCurrentUserWithOrg } = await import('@/lib/actions/app')
      const userWithOrg = await getCurrentUserWithOrg()
      const orgId = userWithOrg?.profile?.organization_id

      if (!orgId) {
        if (!cancelled) setLoading(false)
        return
      }

      const [incidentsResult, statsResult] = await Promise.all([
        getIncidents(orgId, {
          statut,
          gravite,
          search: search || undefined,
          date_debut: dateDebut || undefined,
          date_fin: dateFin || undefined,
          page,
          limit,
        }),
        getIncidentStats(orgId),
      ])

      if (!cancelled) {
        setIncidents(incidentsResult.incidents)
        setCount(incidentsResult.count)
        setStats({
          total: statsResult.total,
          enCours: statsResult.enCours,
          clotures: statsResult.clotures,
          critiques: statsResult.critiques,
        })
        setLoading(false)
      }
    }
    
    loadData()
    
    return () => { cancelled = true }
  }, [statut, gravite, search, dateDebut, dateFin, page])

  const totalPages = Math.ceil(count / limit)

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Gestion des Incidents</h1>
          <p className="text-muted-foreground">Suivi et déclaration des sinistres</p>
        </div>
        <Link href="/app/incidents/nouveau">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Déclarer un incident
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-slate-100 rounded-lg">
                <AlertCircle className="h-5 w-5 text-slate-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className={stats.enCours > 0 ? 'border-orange-200' : ''}>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${stats.enCours > 0 ? 'bg-orange-100' : 'bg-slate-100'}`}>
                <Clock className={`h-5 w-5 ${stats.enCours > 0 ? 'text-orange-600' : 'text-slate-400'}`} />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">En cours</p>
                <p className={`text-2xl font-bold ${stats.enCours > 0 ? 'text-orange-700' : ''}`}>
                  {stats.enCours}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className={stats.clotures > 0 ? 'border-green-200' : ''}>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${stats.clotures > 0 ? 'bg-green-100' : 'bg-slate-100'}`}>
                <CheckCircle className={`h-5 w-5 ${stats.clotures > 0 ? 'text-green-600' : 'text-slate-400'}`} />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Clôturés</p>
                <p className={`text-2xl font-bold ${stats.clotures > 0 ? 'text-green-700' : ''}`}>
                  {stats.clotures}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className={stats.critiques > 0 ? 'border-red-200 bg-red-50/50' : ''}>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${stats.critiques > 0 ? 'bg-red-100' : 'bg-slate-100'}`}>
                <AlertTriangle className={`h-5 w-5 ${stats.critiques > 0 ? 'text-red-600' : 'text-slate-400'}`} />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Critiques</p>
                <p className={`text-2xl font-bold ${stats.critiques > 0 ? 'text-red-700' : ''}`}>
                  {stats.critiques}
                </p>
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
            {/* Recherche */}
            <div className="lg:col-span-2 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher par lieu ou nature..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>

            {/* Statut */}
            <Select value={statut} onValueChange={(v) => { setStatut(v as any); setPage(1) }}>
              <SelectTrigger>
                <SelectValue placeholder="Statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les statuts</SelectItem>
                <SelectItem value="EN_COURS">En cours</SelectItem>
                <SelectItem value="CLOTURE">Clôturé</SelectItem>
              </SelectContent>
            </Select>

            {/* Gravité */}
            <Select value={gravite} onValueChange={(v) => { setGravite(v as any); setPage(1) }}>
              <SelectTrigger>
                <SelectValue placeholder="Gravité" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes les gravités</SelectItem>
                <SelectItem value="FAIBLE">Faible</SelectItem>
                <SelectItem value="MOYENNE">Moyenne</SelectItem>
                <SelectItem value="ELEVEE">Élevée</SelectItem>
                <SelectItem value="CRITIQUE">Critique</SelectItem>
              </SelectContent>
            </Select>

            {/* Date début */}
            <Input
              type="date"
              placeholder="Date début"
              value={dateDebut}
              onChange={(e) => setDateDebut(e.target.value)}
            />

            {/* Date fin */}
            <Input
              type="date"
              placeholder="Date fin"
              value={dateFin}
              onChange={(e) => setDateFin(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Toggle vue + Résultats */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {count} incident{count > 1 ? 's' : ''} trouvé{count > 1 ? 's' : ''}
        </p>
        <div className="flex items-center gap-2">
          <Button
            variant={viewMode === 'table' ? 'default' : 'outline'}
            size="icon"
            onClick={() => setViewMode('table')}
          >
            <List className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === 'grid' ? 'default' : 'outline'}
            size="icon"
            onClick={() => setViewMode('grid')}
          >
            <Grid3X3 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Contenu principal */}
      {loading ? (
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-4">
                <div className="h-12 bg-slate-100 rounded" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : incidents.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-medium text-lg">Aucun incident trouvé</h3>
            <p className="text-muted-foreground mt-1">
              Essayez de modifier vos filtres ou déclarez un nouvel incident.
            </p>
            <Link href="/app/incidents/nouveau" className="mt-4 inline-block">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Déclarer un incident
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : viewMode === 'table' ? (
        /* Vue tableau */
        <Card>
          <CardContent className="p-0 overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Lieu</TableHead>
                  <TableHead>Nature</TableHead>
                  <TableHead>Gravité</TableHead>
                  <TableHead>Victimes</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {incidents.map((incident) => (
                  <TableRow key={incident.id} className="cursor-pointer hover:bg-slate-50">
                    <TableCell>
                      <Link href={`/app/incidents/${incident.id}`} className="font-medium">
                        {formatDate(incident.date)}
                      </Link>
                    </TableCell>
                    <TableCell>
                      <Link href={`/app/incidents/${incident.id}`}>
                        <span>{incident.lieu}</span>
                        <span className="block text-xs text-muted-foreground">{incident.region}</span>
                      </Link>
                    </TableCell>
                    <TableCell>
                      <Link href={`/app/incidents/${incident.id}`} className="max-w-[200px] truncate block">
                        {incident.nature}
                      </Link>
                    </TableCell>
                    <TableCell>
                      <SeverityBadge gravite={incident.gravite} size="sm" />
                    </TableCell>
                    <TableCell>
                      {(incident.victimes > 0 || incident.deces > 0) ? (
                        <div className="flex flex-col gap-0.5">
                          {incident.victimes > 0 && (
                            <span className="text-orange-600 text-sm">{incident.victimes} vict.</span>
                          )}
                          {incident.deces > 0 && (
                            <span className="text-red-600 text-sm">{incident.deces} décès</span>
                          )}
                        </div>
                      ) : (
                        <span className="text-muted-foreground text-sm">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {incident.statut === 'EN_COURS' ? (
                        <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-300 text-xs">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mr-1.5 animate-pulse" />
                          En cours
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-300 text-xs">
                          ✓ Clôturé
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <Link href={`/app/incidents/${incident.id}`}>
                        <Button variant="ghost" size="sm">
                          Voir
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      ) : (
        /* Vue grille */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {incidents.map((incident) => (
            <IncidentCard key={incident.id} incident={incident} />
          ))}
        </div>
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
            
            {[...Array(totalPages)].map((_, i) => (
              <PaginationItem key={i}>
                <PaginationLink
                  onClick={() => setPage(i + 1)}
                  isActive={page === i + 1}
                  className="cursor-pointer"
                >
                  {i + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
            
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

export default function IncidentsPage() {
  return (
    <Suspense fallback={<div className="animate-pulse space-y-4 p-8">
      <div className="h-8 bg-slate-100 rounded w-64" />
      <div className="grid grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => <div key={i} className="h-24 bg-slate-100 rounded" />)}
      </div>
      <div className="h-48 bg-slate-100 rounded" />
    </div>}>
      <IncidentsContent />
    </Suspense>
  )
}
