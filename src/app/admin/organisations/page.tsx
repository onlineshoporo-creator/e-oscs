'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { 
  Search, 
  Building2, 
  Users, 
  MapPin,
  Phone,
  Mail,
  MoreHorizontal,
  Eye,
  Power,
  PowerOff,
  Filter,
  Grid3X3,
  List,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Calendar
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Skeleton } from '@/components/ui/skeleton'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { toast } from 'sonner'

// Types
interface Organization {
  id: string
  created_at: string
  nom: string
  type_org: 'DR' | 'DD'
  region: string
  departement?: string
  telephone?: string
  email?: string
  logo_url?: string
  actif: boolean
  members_count?: number
  subscription?: {
    statut: string
    plan_nom: string
    date_fin: string
  }
}

type ViewMode = 'grid' | 'list'

interface Filters {
  search: string
  type: string
  region: string
  status: string
}

interface Pagination {
  page: number
  limit: number
  total: number
  totalPages: number
}

// Régions de Côte d'Ivoire
const regionsCI = [
  "Toutes régions",
  "Abidjan",
  "Lagunes",
  "District d'Abidjan",
  "Comoé",
  "Denguélé",
  "Gôh-Djiboua",
  "Lacs",
  "Montagnes",
  "Sassandra-Marahoué",
  "Vallée du Bandama",
  "Worodougou",
  "Zanzan",
  "San-Pédro",
  "Yamoussoukro"
]

export default function OrganisationsPage() {
  const [organizations, setOrganizations] = useState<Organization[]>([])
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState<ViewMode>('grid')
  const [filters, setFilters] = useState<Filters>({
    search: '',
    type: '',
    region: '',
    status: ''
  })
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 0
  })
  const [selectedOrg, setSelectedOrg] = useState<Organization | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [actionLoading, setActionLoading] = useState(false)
  const [stats, setStats] = useState({ total: 0, actives: 0, dr: 0, dd: 0 })

  // Fetch organizations
  const fetchOrganizations = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
        ...(filters.search && { search: filters.search }),
        ...(filters.type && { type_org: filters.type }),
        ...(filters.region && filters.region !== 'Toutes régions' && { region: filters.region }),
        ...(filters.status !== '' && { actif: filters.status === 'actif' ? 'true' : 'false' })
      })

      const response = await fetch(`/api/admin/organisations?${params}`)
      if (response.ok) {
        const data = await response.json()
        const orgs = data.data || []
        setOrganizations(orgs)
        setPagination(prev => ({
          ...prev,
          total: data.total || 0,
          totalPages: Math.ceil((data.total || 0) / prev.limit)
        }))
        
        // Calculer les stats localement
        setStats({
          total: orgs.length,
          actives: orgs.filter((o: Organization) => o.actif).length,
          dr: orgs.filter((o: Organization) => o.type_org === 'DR').length,
          dd: orgs.filter((o: Organization) => o.type_org === 'DD').length
        })
      } else {
        toast.error('Erreur lors du chargement des organisations')
      }
    } catch (error) {
      console.error('Erreur:', error)
      toast.error('Erreur de connexion au serveur')
    } finally {
      setLoading(false)
    }
  }, [pagination.page, pagination.limit, filters])

  useEffect(() => {
    fetchOrganizations()
  }, [fetchOrganizations])

  // Toggle organization status - utiliser le bon endpoint
  const toggleOrgStatus = async (orgId: string, currentStatus: boolean) => {
    setActionLoading(true)
    try {
      const response = await fetch(`/api/admin/organisations/${orgId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ toggleStatus: true })
      })

      if (response.ok) {
        toast.success(currentStatus 
          ? 'Organisation suspendue avec succès' 
          : 'Organisation réactivée avec succès'
        )
        fetchOrganizations()
        if (selectedOrg?.id === orgId) {
          setSelectedOrg(prev => prev ? { ...prev, actif: !currentStatus } : null)
        }
      } else {
        throw new Error('Erreur lors de la mise à jour')
      }
    } catch (error) {
      console.error(error)
      toast.error('Erreur lors de la modification du statut')
    } finally {
      setActionLoading(false)
    }
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    })
  }

  const getSubscriptionStatus = (org: Organization) => {
    if (!org.subscription) return null
    
    const now = new Date()
    const endDate = new Date(org.subscription.date_fin)
    const daysLeft = Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
    
    if (daysLeft <= 0) return { label: 'Expiré', className: 'bg-red-100 text-red-700 border-red-200' }
    if (daysLeft <= 7) return { label: `Expire ${daysLeft}j`, className: 'bg-amber-100 text-amber-700 border-amber-200' }
    return { label: org.subscription.plan_nom, className: 'bg-green-100 text-green-700 border-green-200' }
  }

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-slate-900">Organisations</h1>
          <p className="text-slate-500 mt-1">Gérez les Directions Régionales et Départementales</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={fetchOrganizations} disabled={loading} className="gap-2">
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Actualiser
          </Button>
        </div>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="border-slate-200">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 rounded-xl bg-blue-100 text-blue-600">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">{stats.total}</p>
              <p className="text-xs text-slate-500">Total organisations</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-slate-200">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 rounded-xl bg-green-100 text-green-600">
              <Power className="w-6 h-6" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">{stats.actives}</p>
              <p className="text-xs text-slate-500">Actives</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-slate-200">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 rounded-xl bg-orange-100 text-orange-600">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">{stats.dr}</p>
              <p className="text-xs text-slate-500">Directions Régionales</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-slate-200">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 rounded-xl bg-purple-100 text-purple-600">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">{stats.dd}</p>
              <p className="text-xs text-slate-500">Directions Départementales</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters & View toggle */}
      <Card className="border-slate-200">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                placeholder="Rechercher une organisation..."
                value={filters.search}
                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                className="pl-10 bg-white"
              />
            </div>

            {/* Type filter */}
            <Select value={filters.type} onValueChange={(value) => setFilters(prev => ({ ...prev, type: value }))}>
              <SelectTrigger className="w-full md:w-[160px]">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Tous types</SelectItem>
                <SelectItem value="DR">Direction Régionale</SelectItem>
                <SelectItem value="DD">Direction Départementale</SelectItem>
              </SelectContent>
            </Select>

            {/* Region filter */}
            <Select value={filters.region} onValueChange={(value) => setFilters(prev => ({ ...prev, region: value }))}>
              <SelectTrigger className="w-full md:w-[180px]">
                <MapPin className="w-4 h-4 mr-2 text-slate-400" />
                <SelectValue placeholder="Région" />
              </SelectTrigger>
              <SelectContent>
                {regionsCI.map(region => (
                  <SelectItem key={region} value={region}>{region}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Status filter */}
            <Select value={filters.status} onValueChange={(value) => setFilters(prev => ({ ...prev, status: value }))}>
              <SelectTrigger className="w-full md:w-[140px]">
                <SelectValue placeholder="Statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Tous statuts</SelectItem>
                <SelectItem value="actif">Actives</SelectItem>
                <SelectItem value="inactif">Inactives</SelectItem>
              </SelectContent>
            </Select>

            {/* View mode toggle */}
            <div className="hidden md:flex items-center border border-slate-200 rounded-lg p-1">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="icon"
                className={`h-8 w-8 ${viewMode === 'grid' ? 'bg-orange-600 hover:bg-orange-700' : ''}`}
                onClick={() => setViewMode('grid')}
              >
                <Grid3X3 className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size="icon"
                className={`h-8 w-8 ${viewMode === 'list' ? 'bg-orange-600 hover:bg-orange-700' : ''}`}
                onClick={() => setViewMode('list')}
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Content */}
      {loading ? (
        viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="border-slate-200">
                <CardContent className="p-6">
                  <Skeleton className="h-6 w-3/4 mb-4" />
                  <Skeleton className="h-4 w-1/2 mb-2" />
                  <Skeleton className="h-4 w-full mb-4" />
                  <div className="flex justify-between">
                    <Skeleton className="h-8 w-20" />
                    <Skeleton className="h-8 w-20" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-20 w-full" />
            ))}
          </div>
        )
      ) : organizations.length > 0 ? (
        <>
          {viewMode === 'grid' ? (
            /* Grid View */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {organizations.map((org) => (
                <Card key={org.id} className={`border-slate-200 hover:shadow-lg transition-all duration-300 group ${!org.actif ? 'opacity-60' : ''}`}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-12 w-12 ring-2 ring-offset-2 ring-orange-100">
                          <AvatarFallback className={`${
                            org.type_org === 'DR' 
                              ? 'bg-gradient-to-br from-blue-500 to-blue-600' 
                              : 'bg-gradient-to-br from-purple-500 to-purple-600'
                          } text-white font-bold`}>
                            {org.nom.slice(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-semibold text-slate-900 group-hover:text-orange-600 transition-colors line-clamp-1">
                            {org.nom}
                          </h3>
                          <Badge variant="outline" className={`text-[10px] mt-1 ${
                            org.type_org === 'DR' 
                              ? 'border-blue-200 text-blue-700 bg-blue-50' 
                              : 'border-purple-200 text-purple-700 bg-purple-50'
                          }`}>
                            {org.type_org}
                          </Badge>
                        </div>
                      </div>
                      
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
                            <MoreHorizontal className="w-4 h-4 text-slate-400" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => { setSelectedOrg(org); setDialogOpen(true); }}>
                            <Eye className="mr-2 h-4 w-4" />
                            Voir détails
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            onClick={() => toggleOrgStatus(org.id, org.actif)}
                            disabled={actionLoading}
                            className={org.actif ? 'text-amber-600 focus:text-amber-600' : 'text-green-600 focus:text-green-600'}
                          >
                            {org.actif ? (
                              <>
                                <PowerOff className="mr-2 h-4 w-4" />
                                Suspendre
                              </>
                            ) : (
                              <>
                                <Power className="mr-2 h-4 w-4" />
                                Réactiver
                              </>
                            )}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <MapPin className="w-4 h-4 text-slate-400" />
                        <span>{[org.departement, org.region].filter(Boolean).join(', ') || 'Non spécifié'}</span>
                      </div>
                      {org.email && (
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                          <Mail className="w-4 h-4 text-slate-400" />
                          <span className="truncate">{org.email}</span>
                        </div>
                      )}
                      {org.telephone && (
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                          <Phone className="w-4 h-4 text-slate-400" />
                          <span>{org.telephone}</span>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                      <div className="flex items-center gap-2">
                        <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium ${
                          org.actif 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-red-100 text-red-700'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${org.actif ? 'bg-green-500' : 'bg-red-500'}`} />
                          {org.actif ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                      
                      {(() => {
                        const subStatus = getSubscriptionStatus(org)
                        return subStatus ? (
                          <Badge variant="outline" className={`text-[10px] ${subStatus.className}`}>
                            {subStatus.label}
                          </Badge>
                        ) : null
                      })()}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            /* List View */
            <Card className="border-slate-200">
              <CardContent className="p-0">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-200">
                      <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Organisation</th>
                      <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Type</th>
                      <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Localisation</th>
                      <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Membres</th>
                      <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Abonnement</th>
                      <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Statut</th>
                      <th className="text-right py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {organizations.map((org, index) => (
                      <tr 
                        key={org.id}
                        className={`border-b border-slate-100 hover:bg-slate-50 transition-colors ${
                          index % 2 === 0 ? 'bg-white' : 'bg-slate-50/30'
                        } ${!org.actif ? 'opacity-60' : ''}`}
                      >
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-9 w-9">
                              <AvatarFallback className={`${
                                org.type_org === 'DR' 
                                  ? 'bg-gradient-to-br from-blue-500 to-blue-600' 
                                  : 'bg-gradient-to-br from-purple-500 to-purple-600'
                              } text-white text-xs font-bold`}>
                                {org.nom.slice(0, 2).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium text-slate-900">{org.nom}</p>
                              {org.email && (
                                <p className="text-xs text-slate-500">{org.email}</p>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <Badge variant="outline" className={`${
                            org.type_org === 'DR' 
                              ? 'border-blue-200 text-blue-700 bg-blue-50' 
                              : 'border-purple-200 text-purple-700 bg-purple-50'
                          }`}>
                            {org.type_org}
                          </Badge>
                        </td>
                        <td className="py-4 px-4">
                          <span className="text-sm text-slate-600 flex items-center gap-1">
                            <MapPin className="w-4 h-4 text-slate-400" />
                            {[org.departement, org.region].filter(Boolean).join(', ') || '-'}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <span className="text-sm text-slate-600 flex items-center gap-1">
                            <Users className="w-4 h-4 text-slate-400" />
                            {org.members_count || '--'}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          {(() => {
                            const subStatus = getSubscriptionStatus(org)
                            return subStatus ? (
                              <Badge variant="outline" className={`text-xs ${subStatus.className}`}>
                                {subStatus.label}
                              </Badge>
                            ) : (
                              <span className="text-xs text-slate-400">-</span>
                            )
                          })()}
                        </td>
                        <td className="py-4 px-4">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                            org.actif 
                              ? 'bg-green-100 text-green-700' 
                              : 'bg-red-100 text-red-700'
                          }`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${org.actif ? 'bg-green-500' : 'bg-red-500'}`} />
                            {org.actif ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center justify-end gap-1">
                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => { setSelectedOrg(org); setDialogOpen(true); }}>
                              <Eye className="w-4 h-4 text-slate-400" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className={`h-8 w-8 ${org.actif ? 'text-amber-500 hover:text-amber-600 hover:bg-amber-50' : 'text-green-500 hover:text-green-600 hover:bg-green-50'}`}
                              onClick={() => toggleOrgStatus(org.id, org.actif)}
                              disabled={actionLoading}
                            >
                              {org.actif ? <PowerOff className="w-4 h-4" /> : <Power className="w-4 h-4" />}
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </CardContent>
            </Card>
          )}

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-between pt-4">
              <p className="text-sm text-slate-500">
                Affichage {(pagination.page - 1) * pagination.limit + 1}-{Math.min(pagination.page * pagination.limit, pagination.total)} sur {pagination.total}
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                  disabled={pagination.page <= 1}
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                
                {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                  let pageNum: number
                  if (pagination.totalPages <= 5) {
                    pageNum = i + 1
                  } else if (pagination.page <= 3) {
                    pageNum = i + 1
                  } else if (pagination.page >= pagination.totalPages - 2) {
                    pageNum = pagination.totalPages - 4 + i
                  } else {
                    pageNum = pagination.page - 2 + i
                  }
                  
                  return (
                    <Button
                      key={pageNum}
                      variant={pagination.page === pageNum ? 'default' : 'outline'}
                      size="icon"
                      onClick={() => setPagination(prev => ({ ...prev, page: pageNum }))}
                      className={`h-8 w-8 ${pagination.page === pageNum ? 'bg-orange-600 hover:bg-orange-700' : ''}`}
                    >
                      {pageNum}
                    </Button>
                  )
                })}
                
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                  disabled={pagination.page >= pagination.totalPages}
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
        </>
      ) : (
        /* Empty state */
        <Card className="border-slate-200">
          <CardContent className="py-12 text-center">
            <Building2 className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-900 mb-1">Aucune organisation trouvée</h3>
            <p className="text-slate-500 mb-4">
              {filters.search || filters.type || (filters.region && filters.region !== 'Toutes régions') || filters.status
                ? 'Essayez de modifier vos filtres'
                : 'Les organisations créées apparaîtront ici'}
            </p>
            {(filters.search || filters.type || (filters.region && filters.region !== 'Toutes régions') || filters.status) && (
              <Button variant="outline" onClick={() => setFilters({ search: '', type: '', region: '', status: '' })}>
                Effacer les filtres
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {/* Detail dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Détails de l&apos;organisation</DialogTitle>
            <DialogDescription>
              {selectedOrg?.nom}
            </DialogDescription>
          </DialogHeader>
          
          {selectedOrg && (
            <div className="space-y-6 mt-4">
              {/* Header info */}
              <div className="flex items-center gap-4 p-4 rounded-lg bg-slate-50">
                <Avatar className="h-16 w-16 ring-2 ring-offset-2 ring-orange-100">
                  <AvatarFallback className={`${
                    selectedOrg.type_org === 'DR' 
                      ? 'bg-gradient-to-br from-blue-500 to-blue-600' 
                      : 'bg-gradient-to-br from-purple-500 to-purple-600'
                  } text-white text-lg font-bold`}>
                    {selectedOrg.nom.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg text-slate-900">{selectedOrg.nom}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="outline" className={`${
                      selectedOrg.type_org === 'DR' 
                        ? 'border-blue-200 text-blue-700 bg-blue-50' 
                        : 'border-purple-200 text-purple-700 bg-purple-50'
                    }`}>
                      {selectedOrg.type_org}
                    </Badge>
                    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium ${
                      selectedOrg.actif 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-red-100 text-red-700'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${selectedOrg.actif ? 'bg-green-500' : 'bg-red-500'}`} />
                      {selectedOrg.actif ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Info grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-slate-400 mt-0.5" />
                    <div>
                      <p className="text-xs text-slate-500">Localisation</p>
                      <p className="font-medium text-slate-900">
                        {[selectedOrg.departement, selectedOrg.region].filter(Boolean).join(', ') || '-'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Mail className="w-5 h-5 text-slate-400 mt-0.5" />
                    <div>
                      <p className="text-xs text-slate-500">Email</p>
                      <p className="font-medium text-slate-900">{selectedOrg.email || '-'}</p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <Phone className="w-5 h-5 text-slate-400 mt-0.5" />
                    <div>
                      <p className="text-xs text-slate-500">Téléphone</p>
                      <p className="font-medium text-slate-900">{selectedOrg.telephone || '-'}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Calendar className="w-5 h-5 text-slate-400 mt-0.5" />
                    <div>
                      <p className="text-xs text-slate-500">Créée le</p>
                      <p className="font-medium text-slate-900">{formatDate(selectedOrg.created_at)}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Subscription info */}
              {selectedOrg.subscription && (
                <div className="p-4 rounded-lg bg-green-50 border border-green-200">
                  <p className="text-sm font-medium text-green-800 mb-2">Abonnement actif</p>
                  <div className="flex items-center justify-between">
                    <span className="text-green-700">{selectedOrg.subscription.plan_nom}</span>
                    <span className="text-sm text-green-600">
                      Jusqu&apos;au {formatDate(selectedOrg.subscription.date_fin)}
                    </span>
                  </div>
                </div>
              )}

              {/* Members count */}
              <div className="flex items-center gap-4 p-4 rounded-lg bg-slate-50">
                <Users className="w-5 h-5 text-slate-400" />
                <div>
                  <p className="text-xs text-slate-500">Nombre de membres</p>
                  <p className="font-semibold text-slate-900">{selectedOrg.members_count || 0} membre(s)</p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-4 border-t border-slate-200">
                <Button 
                  onClick={() => toggleOrgStatus(selectedOrg.id, selectedOrg.actif)}
                  disabled={actionLoading}
                  variant={selectedOrg.actif ? 'destructive' : 'default'}
                  className={selectedOrg.actif ? '' : 'bg-green-600 hover:bg-green-700'}
                >
                  {selectedOrg.actif ? (
                    <>
                      <PowerOff className="w-4 h-4 mr-2" />
                      Suspendre
                    </>
                  ) : (
                    <>
                      <Power className="w-4 h-4 mr-2" />
                      Réactiver
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
