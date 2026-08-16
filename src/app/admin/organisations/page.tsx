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
  Calendar,
  AlertTriangle
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
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

// Régions de Côte d'Ivoire
const regionsCI = [
  "Toutes régions",
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
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('')
  const [regionFilter, setRegionFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedOrg, setSelectedOrg] = useState<Organization | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [actionLoading, setActionLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const itemsPerPage = 12

  // Fetch organizations
  const fetchOrganizations = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: itemsPerPage.toString(),
        ...(search && { search }),
        ...(typeFilter && { type_org: typeFilter }),
        ...(regionFilter && regionFilter !== 'Toutes régions' && { region: regionFilter }),
        ...(statusFilter !== '' && { actif: statusFilter === 'actif' ? 'true' : 'false' })
      })

      const response = await fetch(`/api/admin/organisations?${params}`)
      if (response.ok) {
        const data = await response.json()
        setOrganizations(data.data || [])
      } else {
        throw new Error('Erreur lors du chargement')
      }
    } catch (err) {
      console.error('Erreur:', err)
      setError('Impossible de charger les organisations')
      toast.error('Erreur de connexion au serveur')
    } finally {
      setLoading(false)
    }
  }, [currentPage, search, typeFilter, regionFilter, statusFilter])

  useEffect(() => {
    fetchOrganizations()
  }, [fetchOrganizations])

  // Toggle organization status
  const toggleOrgStatus = async (orgId: string, currentStatus: boolean) => {
    setActionLoading(true)
    try {
      const response = await fetch(`/api/admin/organisations/${orgId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ toggleStatus: true })
      })

      if (response.ok) {
        toast.success(currentStatus ? 'Organisation suspendue' : 'Organisation réactivée')
        fetchOrganizations()
        if (selectedOrg?.id === orgId) {
          setSelectedOrg(prev => prev ? { ...prev, actif: !currentStatus } : null)
        }
      } else {
        throw new Error('Erreur lors de la mise à jour')
      }
    } catch (err) {
      console.error(err)
      toast.error('Erreur lors de la modification')
    } finally {
      setActionLoading(false)
    }
  }

  // Format date
  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      })
    } catch {
      return 'Date invalide'
    }
  }

  // Stats calculées
  const stats = {
    total: organizations.length,
    actives: organizations.filter(o => o.actif).length,
    dr: organizations.filter(o => o.type_org === 'DR').length,
    dd: organizations.filter(o => o.type_org === 'DD').length
  }

  // Open detail dialog
  const openDetail = (org: Organization) => {
    setSelectedOrg(org)
    setDialogOpen(true)
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
              <p className="text-xs text-slate-500">Total</p>
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
              <p className="text-xs text-slate-500">DR</p>
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
              <p className="text-xs text-slate-500">DD</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="border-slate-200">
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                placeholder="Rechercher une organisation..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full lg:w-[150px]">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Tous types</SelectItem>
                <SelectItem value="DR">Direction Régionale</SelectItem>
                <SelectItem value="DD">Direction Départementale</SelectItem>
              </SelectContent>
            </Select>
            <Select value={regionFilter} onValueChange={setRegionFilter}>
              <SelectTrigger className="w-full lg:w-[180px]">
                <SelectValue placeholder="Région" />
              </SelectTrigger>
              <SelectContent>
                {regionsCI.map(region => (
                  <SelectItem key={region} value={region}>{region}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full lg:w-[140px]">
                <SelectValue placeholder="Statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Tous</SelectItem>
                <SelectItem value="actif">Actives</SelectItem>
                <SelectItem value="inactif">Inactives</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex gap-2">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="icon"
                onClick={() => setViewMode('grid')}
              >
                <Grid3X3 className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="icon"
                onClick={() => setViewMode('list')}
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Error state */}
      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-4 flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-red-500" />
            <p className="text-red-700">{error}</p>
            <Button variant="outline" size="sm" onClick={fetchOrganizations} className="ml-auto">
              Réessayer
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Loading state */}
      {loading ? (
        <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4' : 'space-y-3'}>
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className={`h-${viewMode === 'grid' ? '48' : '20'} w-full rounded-lg`} />
          ))}
        </div>
      ) : organizations.length === 0 ? (
        <Card className="border-slate-200">
          <CardContent className="p-12 text-center">
            <Building2 className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-700 mb-2">Aucune organisation trouvée</h3>
            <p className="text-slate-500 text-sm">
              {search || typeFilter || regionFilter || statusFilter 
                ? 'Essayez de modifier vos filtres' 
                : 'Commencez par ajouter une organisation'}
            </p>
          </CardContent>
        </Card>
      ) : viewMode === 'grid' ? (
        /* Grid view */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {organizations.map((org) => (
            <Card 
              key={org.id} 
              className="border-slate-200 hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => openDetail(org)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className={
                        org.type_org === 'DR' 
                          ? 'bg-blue-100 text-blue-600' 
                          : 'bg-purple-100 text-purple-600'
                      }>
                        {org.nom.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-base font-semibold line-clamp-1">
                        {org.nom}
                      </CardTitle>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge 
                          variant="outline" 
                          className={`text-xs ${
                            org.type_org === 'DR' 
                              ? 'border-blue-200 text-blue-700' 
                              : 'border-purple-200 text-purple-700'
                          }`}
                        >
                          {org.type_org}
                        </Badge>
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                          org.actif 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-red-100 text-red-700'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${org.actif ? 'bg-green-500' : 'bg-red-500'}`} />
                          {org.actif ? 'Actif' : 'Inactif'}
                        </span>
                      </div>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={(e) => { e.stopPropagation(); openDetail(org) }}>
                        <Eye className="mr-2 h-4 w-4" /> Voir détails
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={(e) => { e.stopPropagation(); toggleOrgStatus(org.id, org.actif) }}>
                        {org.actif ? (
                          <>
                            <PowerOff className="mr-2 h-4 w-4" /> Suspendre
                          </>
                        ) : (
                          <>
                            <Power className="mr-2 h-4 w-4" /> Réactiver
                          </>
                        )}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent className="pt-0 space-y-3">
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <MapPin className="w-4 h-4 flex-shrink-0" />
                  <span className="truncate">{[org.departement, org.region].filter(Boolean).join(', ') || '-'}</span>
                </div>
                {org.email && (
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Mail className="w-4 h-4 flex-shrink-0" />
                    <span className="truncate">{org.email}</span>
                  </div>
                )}
                {org.subscription && (
                  <div className="pt-2 border-t border-slate-100">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-500">{org.subscription.plan_nom}</span>
                      <Badge variant="outline" className="text-xs border-green-200 text-green-700">
                        Actif
                      </Badge>
                    </div>
                  </div>
                )}
                <div className="flex items-center justify-between pt-2 text-xs text-slate-400">
                  <span>{org.members_count || 0} membre(s)</span>
                  <span>{formatDate(org.created_at)}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        /* List view */
        <Card className="border-slate-200">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50">
                    <th className="text-left px-4 py-3 text-sm font-semibold text-slate-700">Organisation</th>
                    <th className="text-left px-4 py-3 text-sm font-semibold text-slate-700 hidden sm:table-cell">Type</th>
                    <th className="text-left px-4 py-3 text-sm font-semibold text-slate-700 hidden md:table-cell">Région</th>
                    <th className="text-left px-4 py-3 text-sm font-semibold text-slate-700 hidden lg:table-cell">Membres</th>
                    <th className="text-left px-4 py-3 text-sm font-semibold text-slate-700">Statut</th>
                    <th className="text-right px-4 py-3 text-sm font-semibold text-slate-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {organizations.map((org) => (
                    <tr key={org.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-9 w-9">
                            <AvatarFallback className={
                              org.type_org === 'DR' 
                                ? 'bg-blue-100 text-blue-600 text-sm' 
                                : 'bg-purple-100 text-purple-600 text-sm'
                            }>
                              {org.nom.slice(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium text-slate-900">{org.nom}</p>
                            {org.email && (
                              <p className="text-xs text-slate-500 sm:hidden">{org.email}</p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 hidden sm:table-cell">
                        <Badge variant="outline" className={
                          org.type_org === 'DR' 
                            ? 'border-blue-200 text-blue-700' 
                            : 'border-purple-200 text-purple-700'
                        }>
                          {org.type_org}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-600 hidden md:table-cell">
                        {[org.departement, org.region].filter(Boolean).join(', ') || '-'}
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-600 hidden lg:table-cell">
                        {org.members_count || 0}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium ${
                          org.actif 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-red-100 text-red-700'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${org.actif ? 'bg-green-500' : 'bg-red-500'}`} />
                          {org.actif ? 'Actif' : 'Inactif'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => openDetail(org)}>
                              <Eye className="mr-2 h-4 w-4" /> Voir détails
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => toggleOrgStatus(org.id, org.actif)}>
                              {org.actif ? (
                                <>
                                  <PowerOff className="mr-2 h-4 w-4" /> Suspendre
                                </>
                              ) : (
                                <>
                                  <Power className="mr-2 h-4 w-4" /> Réactiver
                                </>
                              )}
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Detail Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          {selectedOrg && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-3">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback className={
                      selectedOrg.type_org === 'DR' 
                        ? 'bg-blue-100 text-blue-600 text-lg' 
                        : 'bg-purple-100 text-purple-600 text-lg'
                    }>
                      {selectedOrg.nom.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold text-lg text-slate-900">{selectedOrg.nom}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className={
                        selectedOrg.type_org === 'DR' 
                          ? 'border-blue-200 text-blue-700 bg-blue-50' 
                          : 'border-purple-200 text-purple-700 bg-purple-50'
                      }>
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
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-4 mt-4">
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
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
