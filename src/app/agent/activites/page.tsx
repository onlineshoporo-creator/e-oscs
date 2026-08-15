'use client'

import React, { useState, useMemo } from 'react'
import Link from 'next/link'
import {
  ClipboardList,
  PlusCircle,
  Search,
  Filter,
  Calendar,
  MapPin,
  Eye,
  Edit3,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Download,
  SlidersHorizontal,
  X,
  CheckSquare,
  Square,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

// Types
interface Activity {
  id: string
  intitule: string
  date: string
  lieu: string
  statut: 'VALIDEE' | 'EN_ATTENTE' | 'BROUILLON' | 'REJETEE'
  type: string
  beneficiaires: number
}

// Données mockées des activités
const mockActivities: Activity[] = [
  {
    id: '1',
    intitule: 'Sensibilisation sur l\'hygiène communautaire',
    date: '2025-01-15',
    lieu: 'Abidjan, Yopougon',
    statut: 'VALIDEE',
    type: 'SENSIBILISATION',
    beneficiaires: 45,
  },
  {
    id: '2',
    intitule: 'Distribution de kits scolaires',
    date: '2025-01-12',
    lieu: 'Bouaké',
    statut: 'EN_ATTENTE',
    type: 'DISTRIBUTION',
    beneficiaires: 120,
  },
  {
    id: '3',
    intitule: 'Formation en techniques agricoles',
    date: '2025-01-10',
    lieu: 'Yamoussoukro',
    statut: 'BROUILLON',
    type: 'FORMATION',
    beneficiaires: 30,
  },
  {
    id: '4',
    intitule: 'Visite aux personnes âgées',
    date: '2025-01-08',
    lieu: 'San-Pedro',
    statut: 'VALIDEE',
    type: 'VISITE',
    beneficiaires: 25,
  },
  {
    id: '5',
    intitule: 'Atelier de sensibilisation VIH/SIDA',
    date: '2025-01-05',
    lieu: 'Abidjan, Treichville',
    statut: 'VALIDEE',
    type: 'ATELIER',
    beneficiaires: 60,
  },
  {
    id: '6',
    intitule: 'Réunion de coordination mensuelle',
    date: '2025-01-03',
    lieu: 'Abidjan, Plateau',
    statut: 'REJETEE',
    type: 'REUNION',
    beneficiaires: 15,
  },
  {
    id: '7',
    intitule: 'Campagne de vaccination',
    date: '2024-12-28',
    lieu: 'Korhogo',
    statut: 'VALIDEE',
    type: 'CAMPAGNE',
    beneficiaires: 200,
  },
  {
    id: '8',
    intitule: 'Formation gestion de projet',
    date: '2024-12-20',
    lieu: 'Abidjan, Cocody',
    statut: 'VALIDEE',
    type: 'FORMATION',
    beneficiaires: 35,
  },
  {
    id: '9',
    intitule: 'Distribution vivres fêtes',
    date: '2024-12-15',
    lieu: 'Daloa',
    statut: 'EN_ATTENTE',
    type: 'DISTRIBUTION',
    beneficiaires: 80,
  },
  {
    id: '10',
    intitule: 'Sensibilisation planning familial',
    date: '2024-12-10',
    lieu: 'Man',
    statut: 'BROUILLON',
    type: 'SENSIBILISATION',
    beneficiaires: 55,
  },
]

// Configuration des filtres
const STATUT_OPTIONS = [
  { value: 'all', label: 'Tous les statuts' },
  { value: 'BROUILLON', label: 'Brouillons' },
  { value: 'EN_ATTENTE', label: 'En attente' },
  { value: 'VALIDEE', label: 'Validées' },
  { value: 'REJETEE', label: 'Rejetées' },
]

const TYPE_OPTIONS = [
  { value: 'all', label: 'Tous les types' },
  { value: 'SENSIBILISATION', label: 'Sensibilisation' },
  { value: 'FORMATION', label: 'Formation' },
  { value: 'DISTRIBUTION', label: 'Distribution' },
  { value: 'VISITE', label: 'Visite' },
  { value: 'ATELIER', label: 'Atelier' },
  { value: 'REUNION', label: 'Réunion' },
  { value: 'CAMPAGNE', label: 'Campagne' },
]

const ITEMS_PER_PAGE = 8

// Helpers
function getStatutBadge(statut: string) {
  const config = {
    VALIDEE: { className: 'bg-green-100 text-green-700 border-green-200 hover:bg-green-200', label: 'Validée' },
    EN_ATTENTE: { className: 'bg-orange-100 text-orange-700 border-orange-200 hover:bg-orange-200', label: 'En attente' },
    BROUILLON: { className: 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200', label: 'Brouillon' },
    REJETEE: { className: 'bg-red-100 text-red-700 border-red-200 hover:bg-red-200', label: 'Rejetée' },
  }
  const c = config[statut as keyof typeof config] || { className: '', label: statut }
  return <Badge className={c.className}>{c.label}</Badge>
}

function getTypeLabel(type: string) {
  const types: Record<string, string> = {
    SENSIBILISATION: 'Sensibilisation',
    FORMATION: 'Formation',
    DISTRIBUTION: 'Distribution',
    VISITE: 'Visite',
    REUNION: 'Réunion',
    ATELIER: 'Atelier',
    CAMPAGNE: 'Campagne',
  }
  return types[type] || type
}

function getTypeBadge(type: string) {
  const colors: Record<string, string> = {
    SENSIBILISATION: 'bg-blue-100 text-blue-700',
    FORMATION: 'bg-purple-100 text-purple-700',
    DISTRIBUTION: 'bg-amber-100 text-amber-700',
    VISITE: 'bg-pink-100 text-pink-700',
    REUNION: 'bg-cyan-100 text-cyan-700',
    ATELIER: 'bg-indigo-100 text-indigo-700',
    CAMPAGNE: 'bg-teal-100 text-teal-700',
  }
  return (
    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${colors[type] || 'bg-gray-100 text-gray-700'}`}>
      {getTypeLabel(type)}
    </span>
  )
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr)
  return date.toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

export default function MesActivitesPage() {
  // États pour les filtres
  const [searchQuery, setSearchQuery] = useState('')
  const [statutFilter, setStatutFilter] = useState('all')
  const [typeFilter, setTypeFilter] = useState('all')
  const [dateFilter, setDateFilter] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table')
  const [showFilters, setShowFilters] = useState(false)

  // Filtrer les activités
  const filteredActivities = useMemo(() => {
    return mockActivities.filter((activity) => {
      // Recherche
      if (searchQuery && !activity.intitule.toLowerCase().includes(searchQuery.toLowerCase()) &&
          !activity.lieu.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false
      }

      // Filtre statut
      if (statutFilter !== 'all' && activity.statut !== statutFilter) {
        return false
      }

      // Filtre type
      if (typeFilter !== 'all' && activity.type !== typeFilter) {
        return false
      }

      // Filtre date
      if (dateFilter !== 'all') {
        const activityDate = new Date(activity.date)
        const now = new Date()
        
        if (dateFilter === 'this_month') {
          if (activityDate.getMonth() !== now.getMonth() || activityDate.getFullYear() !== now.getFullYear()) {
            return false
          }
        } else if (dateFilter === 'last_month') {
          const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1)
          if (activityDate.getMonth() !== lastMonth.getMonth() || activityDate.getFullYear() !== lastMonth.getFullYear()) {
            return false
          }
        } else if (dateFilter === 'this_year') {
          if (activityDate.getFullYear() !== now.getFullYear()) {
            return false
          }
        }
      }

      return true
    })
  }, [searchQuery, statutFilter, typeFilter, dateFilter])

  // Pagination
  const totalPages = Math.ceil(filteredActivities.length / ITEMS_PER_PAGE)
  const paginatedActivities = filteredActivities.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  )

  // Gestion sélection
  const toggleSelect = (id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  const toggleSelectAll = () => {
    if (selectedIds.size === paginatedActivities.length) {
      setSelectedIds(new Set())
    } else {
      setSelectedIds(new Set(paginatedActivities.map(a => a.id)))
    }
  }

  // Reset pagination quand les filtres changent
  React.useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery, statutFilter, typeFilter, dateFilter])

  // Compteurs pour les stats
  const stats = useMemo(() => ({
    total: mockActivities.length,
    brouillons: mockActivities.filter(a => a.statut === 'BROUILLON').length,
    enAttente: mockActivities.filter(a => a.statut === 'EN_ATTENTE').length,
    validees: mockActivities.filter(a => a.statut === 'VALIDEE').length,
    rejetees: mockActivities.filter(a => a.statut === 'REJETEE').length,
  }), [])

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* En-tête */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-slate-900">Mes activités</h1>
          <p className="text-slate-500 mt-1">
            Consultez et gérez toutes vos activités déclarées.
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          {/* Actions bulk */}
          {selectedIds.size > 0 && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                  <CheckSquare className="w-4 h-4" />
                  {selectedIds.size} sélectionnée(s)
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem className="text-[#F77F00]">
                  <Edit3 className="w-4 h-4 mr-2" />
                  Modifier en lot
                </DropdownMenuItem>
                <DropdownMenuItem className="text-green-600">
                  <Download className="w-4 h-4 mr-2" />
                  Exporter
                </DropdownMenuItem>
                <DropdownMenuItem className="text-red-600">
                  <Trash2 className="w-4 h-4 mr-2" />
                  Supprimer
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
          
          <Link href="/agent/activites/nouvelle">
            <Button className="bg-[#F77F00] hover:bg-[#E67300] text-white">
              <PlusCircle className="w-4 h-4 mr-2" />
              Nouvelle activité
            </Button>
          </Link>
        </div>
      </div>

      {/* Cartes statistiques rapides */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <Card 
          className={`cursor-pointer transition-all duration-200 ${statutFilter === 'all' ? 'ring-2 ring-[#F77F00]' : 'hover:shadow-md'}`}
          onClick={() => setStatutFilter('all')}
        >
          <CardContent className="p-3 text-center">
            <p className="text-2xl font-bold text-slate-900">{stats.total}</p>
            <p className="text-xs text-slate-500">Total</p>
          </CardContent>
        </Card>
        <Card 
          className={`cursor-pointer transition-all duration-200 ${statutFilter === 'BROUILLON' ? 'ring-2 ring-slate-400' : 'hover:shadow-md'}`}
          onClick={() => setStatutFilter(statutFilter === 'BROUILLON' ? 'all' : 'BROUILLON')}
        >
          <CardContent className="p-3 text-center">
            <p className="text-2xl font-bold text-slate-600">{stats.brouillons}</p>
            <p className="text-xs text-slate-500">Brouillons</p>
          </CardContent>
        </Card>
        <Card 
          className={`cursor-pointer transition-all duration-200 ${statutFilter === 'EN_ATTENTE' ? 'ring-2 ring-orange-400' : 'hover:shadow-md'}`}
          onClick={() => setStatutFilter(statutFilter === 'EN_ATTENTE' ? 'all' : 'EN_ATTENTE')}
        >
          <CardContent className="p-3 text-center">
            <p className="text-2xl font-bold text-orange-600">{stats.enAttente}</p>
            <p className="text-xs text-slate-500">En attente</p>
          </CardContent>
        </Card>
        <Card 
          className={`cursor-pointer transition-all duration-200 ${statutFilter === 'VALIDEE' ? 'ring-2 ring-green-500' : 'hover:shadow-md'}`}
          onClick={() => setStatutFilter(statutFilter === 'VALIDEE' ? 'all' : 'VALIDEE')}
        >
          <CardContent className="p-3 text-center">
            <p className="text-2xl font-bold text-green-600">{stats.validees}</p>
            <p className="text-xs text-slate-500">Validées</p>
          </CardContent>
        </Card>
        <Card 
          className={`cursor-pointer transition-all duration-200 ${statutFilter === 'REJETEE' ? 'ring-2 ring-red-400' : 'hover:shadow-md'}`}
          onClick={() => setStatutFilter(statutFilter === 'REJETEE' ? 'all' : 'REJETEE')}
        >
          <CardContent className="p-3 text-center">
            <p className="text-2xl font-bold text-red-600">{stats.rejetees}</p>
            <p className="text-xs text-slate-500">Rejetées</p>
          </CardContent>
        </Card>
      </div>

      {/* Filtres et recherche */}
      <Card className="border-slate-200">
        <CardContent className="p-4">
          {/* Recherche principale + bouton filtres */}
          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input 
                placeholder="Rechercher par titre ou lieu..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-10"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
            
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="gap-2"
            >
              <SlidersHorizontal className="w-4 h-4" />
              Filtres
              {(statutFilter !== 'all' || typeFilter !== 'all' || dateFilter !== 'all') && (
                <span className="w-5 h-5 bg-[#F77F00] text-white text-xs rounded-full flex items-center justify-center">
                  {[statutFilter !== 'all', typeFilter !== 'all', dateFilter !== 'all'].filter(Boolean).length}
                </span>
              )}
            </Button>

            <Select value={viewMode} onValueChange={(v) => setViewMode(v as 'table' | 'cards')}>
              <SelectTrigger className="w-[130px]">
                <SelectValue placeholder="Vue" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="table">Tableau</SelectItem>
                <SelectItem value="cards">Cartes</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Filtres étendus */}
          {showFilters && (
            <div className="pt-4 border-t border-slate-100">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Statut</label>
                  <Select value={statutFilter} onValueChange={setStatutFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Statut" />
                    </SelectTrigger>
                    <SelectContent>
                      {STATUT_OPTIONS.map(opt => (
                        <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Type d&apos;activité</label>
                  <Select value={typeFilter} onValueChange={setTypeFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Type" />
                    </SelectTrigger>
                    <SelectContent>
                      {TYPE_OPTIONS.map(opt => (
                        <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Période</label>
                  <Select value={dateFilter} onValueChange={setDateFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Période" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Toutes les dates</SelectItem>
                      <SelectItem value="this_month">Ce mois-ci</SelectItem>
                      <SelectItem value="last_month">Le mois dernier</SelectItem>
                      <SelectItem value="this_year">Cette année</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {(statutFilter !== 'all' || typeFilter !== 'all' || dateFilter !== 'all') && (
                <div className="flex justify-end mt-4">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => {
                      setStatutFilter('all')
                      setTypeFilter('all')
                      setDateFilter('all')
                    }}
                    className="text-slate-500"
                  >
                    Réinitialiser les filtres
                  </Button>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Résultats */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-500">
          {filteredActivities.length} activité(s) trouvée(s)
          {selectedIds.size > 0 && ` · ${selectedIds.size} sélectionnée(s)`}
        </p>
      </div>

      {/* Vue tableau */}
      {viewMode === 'table' ? (
        <Card className="border-slate-200 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50 hover:bg-slate-50">
                <TableHead className="w-12">
                  <Checkbox
                    checked={selectedIds.size === paginatedActivities.length && paginatedActivities.length > 0}
                    onCheckedChange={toggleSelectAll}
                  />
                </TableHead>
                <TableHead>Activité</TableHead>
                <TableHead className="hidden md:table-cell">Type</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="hidden lg:table-cell">Lieu</TableHead>
                <TableHead className="hidden sm:table-cell">Bénéf.</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead className="w-20">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedActivities.map((activity) => (
                <TableRow key={activity.id} className={`group ${selectedIds.has(activity.id) ? 'bg-orange-50/50' : ''}`}>
                  <TableCell>
                    <Checkbox
                      checked={selectedIds.has(activity.id)}
                      onCheckedChange={() => toggleSelect(activity.id)}
                    />
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium text-slate-900 truncate max-w-[250px]">
                        {activity.intitule}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {getTypeBadge(activity.type)}
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-slate-600">{formatDate(activity.date)}</span>
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">
                    <span className="text-sm text-slate-500 flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {activity.lieu}
                    </span>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">
                    <span className="font-medium text-slate-700">{activity.beneficiaires}</span>
                  </TableCell>
                  <TableCell>{getStatutBadge(activity.statut)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-[#F77F00]">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-blue-600">
                        <Edit3 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {paginatedActivities.length === 0 && (
            <div className="p-10 text-center">
              <ClipboardList className="w-12 h-12 mx-auto text-slate-300 mb-3" />
              <p className="text-slate-500 font-medium">Aucune activité trouvée</p>
              <p className="text-sm text-slate-400 mt-1">
                Essayez de modifier vos critères de recherche ou de filtre.
              </p>
              {(searchQuery || statutFilter !== 'all' || typeFilter !== 'all') && (
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={() => {
                    setSearchQuery('')
                    setStatutFilter('all')
                    setTypeFilter('all')
                    setDateFilter('all')
                  }}
                >
                  Effacer tous les filtres
                </Button>
              )}
            </div>
          )}
        </Card>
      ) : (
        /* Vue cartes */
        <div className="space-y-3">
          {paginatedActivities.map((activity) => (
            <Card key={activity.id} className={`border-slate-200 hover:shadow-md transition-all cursor-pointer ${selectedIds.has(activity.id) ? 'ring-2 ring-[#F77F00]' : ''}`}>
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <Checkbox
                    checked={selectedIds.has(activity.id)}
                    onCheckedChange={() => toggleSelect(activity.id)}
                    className="mt-1"
                  />
                  
                  <div className="flex items-start gap-4 flex-1 min-w-0">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-50 to-orange-100 flex items-center justify-center flex-shrink-0">
                      <ClipboardList className="w-6 h-6 text-[#F77F00]" />
                    </div>
                    
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-semibold text-slate-900 truncate">
                          {activity.intitule}
                        </h3>
                        {getStatutBadge(activity.statut)}
                      </div>
                      
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-sm text-slate-500">
                        <span>{getTypeBadge(activity.type)}</span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" />
                          {formatDate(activity.date)}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5" />
                          {activity.lieu}
                        </span>
                        <span className="font-medium text-slate-700">
                          👥 {activity.beneficiaires} bénéficiaires
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button variant="ghost" size="icon" className="text-slate-400 hover:text-[#F77F00]">
                      <Eye className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {paginatedActivities.length === 0 && (
            <Card className="border-dashed border-2 border-slate-200">
              <CardContent className="p-8 text-center">
                <ClipboardList className="w-12 h-12 mx-auto text-slate-300 mb-3" />
                <p className="text-slate-500 font-medium">Aucune activité trouvée</p>
                <p className="text-sm text-slate-400 mt-1">
                  Essayez de modifier vos critères de recherche.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
          <p className="text-sm text-slate-500">
            Affichage de {(currentPage - 1) * ITEMS_PER_PAGE + 1}-{Math.min(currentPage * ITEMS_PER_PAGE, filteredActivities.length)} sur {filteredActivities.length}
          </p>
          
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(p => p - 1)}
            >
              <ChevronLeft className="w-4 h-4" />
              Précédent
            </Button>
            
            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum: number
                if (totalPages <= 5) {
                  pageNum = i + 1
                } else if (currentPage <= 3) {
                  pageNum = i + 1
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i
                } else {
                  pageNum = currentPage - 2 + i
                }
                
                return (
                  <Button
                    key={pageNum}
                    size="sm"
                    variant={currentPage === pageNum ? "default" : "outline"}
                    className={currentPage === pageNum ? "bg-[#F77F00] hover:bg-[#E67300]" : ""}
                    onClick={() => setCurrentPage(pageNum)}
                  >
                    {pageNum}
                  </Button>
                )
              })}
            </div>
            
            <Button 
              variant="outline" 
              size="sm"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(p => p + 1)}
            >
              Suivant
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
