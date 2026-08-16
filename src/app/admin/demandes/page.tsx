'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { 
  Search, 
  Filter, 
  Eye, 
  Phone, 
  CheckCircle2, 
  XCircle,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  Download,
  RefreshCw,
  MapPin,
  Mail,
  Calendar,
  Building2,
  User,
  MessageSquare,
  ClipboardList,
  Send,
  Clock,
  AlertCircle
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
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Textarea } from '@/components/ui/textarea'
import { Skeleton } from '@/components/ui/skeleton'
import { toast } from 'sonner'

// Types
interface SubscriptionRequest {
  id: string
  created_at: string
  nom_complet: string
  email: string
  telephone: string
  whatsapp?: string
  fonction?: string
  nom_organisation: string
  type_org: 'DR' | 'DD'
  region: string
  departement?: string
  nb_collaborateurs?: string
  message?: string
  statut: RequestStatus
  notes_admin?: string
  admin_updated_at?: string
}

type RequestStatus = 'NOUVELLE' | 'EN_CONTACT' | 'APPROUVEE' | 'REJETEE' | 'CONVERTIE'

interface Filters {
  statut: string
  region: string
  search: string
}

interface Pagination {
  page: number
  limit: number
  total: number
  totalPages: number
}

// Configuration des statuts - cohérente avec l'API
const statusConfig: Record<RequestStatus, { label: string; className: string; icon?: React.ElementType }> = {
  NOUVELLE: { 
    label: 'Nouvelle', 
    className: 'bg-slate-100 text-slate-700 border-slate-200',
    icon: Clock
  },
  EN_CONTACT: { 
    label: 'En contact', 
    className: 'bg-blue-100 text-blue-700 border-blue-200',
    icon: Send
  },
  APPROUVEE: { 
    label: 'Approuvée', 
    className: 'bg-green-100 text-green-700 border-green-200',
    icon: CheckCircle2
  },
  REJETEE: { 
    label: 'Rejetée', 
    className: 'bg-red-100 text-red-700 border-red-200',
    icon: XCircle
  },
  CONVERTIE: { 
    label: 'Convertie (Client)', 
    className: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    icon: CheckCircle2
  }
}

// Régions de Côte d'Ivoire
const regionsCI = [
  'Toutes les régions',
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

export default function DemandesPage() {
  const [requests, setRequests] = useState<SubscriptionRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState<Filters>({
    statut: '',
    region: '',
    search: ''
  })
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  })
  const [selectedRequest, setSelectedRequest] = useState<SubscriptionRequest | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [actionLoading, setActionLoading] = useState(false)
  const [notesValue, setNotesValue] = useState('')
  const [stats, setStats] = useState<Record<string, number>>({})

  // Fetch requests
  const fetchRequests = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
        ...(filters.statut && { statut: filters.statut }),
        ...(filters.region && filters.region !== 'Toutes les régions' && { region: filters.region }),
        ...(filters.search && { search: filters.search })
      })

      const response = await fetch(`/api/admin/demandes?${params}`)
      if (response.ok) {
        const data = await response.json()
        setRequests(data.data || [])
        setPagination(prev => ({
          ...prev,
          total: data.total || 0,
          totalPages: Math.ceil((data.total || 0) / prev.limit)
        }))
        
        // Calculer les stats localement
        const allRequests = data.data || []
        const statsObj: Record<string, number> = {}
        Object.keys(statusConfig).forEach(key => {
          statsObj[key] = allRequests.filter((r: SubscriptionRequest) => r.statut === key).length
        })
        statsObj['total'] = data.total || 0
        setStats(statsObj)
      } else {
        toast.error('Erreur lors du chargement des demandes')
      }
    } catch (error) {
      console.error('Erreur:', error)
      toast.error('Erreur de connexion au serveur')
    } finally {
      setLoading(false)
    }
  }, [pagination.page, pagination.limit, filters])

  useEffect(() => {
    fetchRequests()
  }, [fetchRequests])

  // Actions sur une demande
  const handleStatusUpdate = async (requestId: string, newStatus: RequestStatus, notes?: string) => {
    setActionLoading(true)
    try {
      const response = await fetch(`/api/admin/demandes/${requestId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ statut: newStatus, notes_admin: notes || '' })
      })

      if (response.ok) {
        toast.success(`Demande ${statusConfig[newStatus].label.toLowerCase()} avec succès`)
        fetchRequests()
        if (selectedRequest?.id === requestId) {
          setSelectedRequest(prev => prev ? { ...prev, statut: newStatus, notes_admin: notes } : null)
        }
      } else {
        throw new Error('Erreur lors de la mise à jour')
      }
    } catch (error) {
      console.error(error)
      toast.error('Erreur lors de la mise à jour du statut')
    } finally {
      setActionLoading(false)
    }
  }

  // Approve request (create org + subscription)
  const handleApproveRequest = async (requestId: string) => {
    setActionLoading(true)
    try {
      const response = await fetch(`/api/admin/demandes/${requestId}`, {
        method: 'POST'
      })

      if (response.ok) {
        toast.success('Organisation créée et abonnement activé avec succès !')
        setDialogOpen(false)
        fetchRequests()
      } else {
        const error = await response.json()
        throw new Error(error.message || "Erreur lors de l'approbation")
      }
    } catch (error) {
      console.error(error)
      toast.error(error instanceof Error ? error.message : "Erreur lors de l'approbation")
    } finally {
      setActionLoading(false)
    }
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getRelativeTime = (dateStr: string) => {
    const now = new Date()
    const date = new Date(dateStr)
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 60) return `Il y a ${diffMins} min`
    if (diffHours < 24) return `Il y a ${diffHours}h`
    return `Il y a ${diffDays}j`
  }

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-slate-900">Demandes d&apos;abonnement</h1>
          <p className="text-slate-500 mt-1">Gérez les demandes d&apos;accès à la plateforme e-OSCS</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={fetchRequests} disabled={loading} className="gap-2">
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Actualiser
          </Button>
          <Button variant="outline" className="gap-2" onClick={() => toast.info('Export CSV bientôt disponible')}>
            <Download className="w-4 h-4" />
            Exporter
          </Button>
        </div>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 md:gap-4">
        {/* Total */}
        <Card className={`border-slate-200 ${!filters.statut ? 'ring-2 ring-orange-500' : ''}`}>
          <CardContent 
            className="p-4 cursor-pointer hover:bg-slate-50 transition-colors"
            onClick={() => setFilters(prev => ({ ...prev, statut: '' }))}
          >
            <p className="text-xs text-slate-500 mb-1">Total</p>
            <p className="text-2xl font-bold text-slate-900">{stats['total'] ?? '--'}</p>
          </CardContent>
        </Card>
        
        {Object.entries(statusConfig).map(([key, config]) => (
          <Card key={key} className={`border-slate-200 ${filters.statut === key ? 'ring-2 ring-orange-500' : ''}`}>
            <CardContent 
              className="p-4 cursor-pointer hover:bg-slate-50 transition-colors"
              onClick={() => setFilters(prev => ({ ...prev, statut: prev.statut === key ? '' : key }))}
            >
              <p className="text-xs text-slate-500 mb-1 flex items-center gap-1">
                {config.icon && <config.icon className="w-3 h-3" />}
                {config.label}s
              </p>
              <p className="text-2xl font-bold text-slate-900">{stats[key] ?? '--'}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <Card className="border-slate-200">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                placeholder="Rechercher par nom, email ou organisation..."
                value={filters.search}
                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                className="pl-10 bg-white"
              />
            </div>

            {/* Status filter */}
            <Select value={filters.statut} onValueChange={(value) => setFilters(prev => ({ ...prev, statut: value }))}>
              <SelectTrigger className="w-full md:w-[180px]">
                <Filter className="w-4 h-4 mr-2 text-slate-400" />
                <SelectValue placeholder="Statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Tous les statuts</SelectItem>
                {Object.entries(statusConfig).map(([key, config]) => (
                  <SelectItem key={key} value={key}>{config.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Region filter */}
            <Select value={filters.region} onValueChange={(value) => setFilters(prev => ({ ...prev, region: value }))}>
              <SelectTrigger className="w-full md:w-[200px]">
                <MapPin className="w-4 h-4 mr-2 text-slate-400" />
                <SelectValue placeholder="Région" />
              </SelectTrigger>
              <SelectContent>
                {regionsCI.map(region => (
                  <SelectItem key={region} value={region}>{region}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card className="border-slate-200">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg font-semibold text-slate-900">
                Liste des demandes
              </CardTitle>
              <CardDescription>
                {pagination.total} demande(s) trouvée(s)
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-20 w-full" />
              ))}
            </div>
          ) : requests.length > 0 ? (
            <>
              {/* Desktop Table */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-200">
                      <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Date</th>
                      <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Demandeur</th>
                      <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Organisation</th>
                      <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Type</th>
                      <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Région</th>
                      <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Statut</th>
                      <th className="text-right py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {requests.map((request, index) => {
                      const status = statusConfig[request.statut]
                      return (
                        <tr 
                          key={request.id} 
                          className={`border-b border-slate-100 hover:bg-slate-50 transition-colors ${
                            index % 2 === 0 ? 'bg-white' : 'bg-slate-50/30'
                          }`}
                        >
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-2 text-sm text-slate-600">
                              <Calendar className="w-4 h-4 text-slate-400" />
                              <span>{formatDate(request.created_at)}</span>
                            </div>
                            <span className="text-xs text-slate-400 ml-6">{getRelativeTime(request.created_at)}</span>
                          </td>
                          <td className="py-4 px-4">
                            <div>
                              <p className="font-medium text-slate-900 flex items-center gap-2">
                                <User className="w-4 h-4 text-slate-400" />
                                {request.nom_complet}
                              </p>
                              <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1">
                                <Mail className="w-3 h-3" />
                                {request.email}
                              </p>
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <p className="font-medium text-slate-900 flex items-center gap-2">
                              <Building2 className="w-4 h-4 text-slate-400" />
                              {request.nom_organisation}
                            </p>
                          </td>
                          <td className="py-4 px-4">
                            <Badge variant="outline" className="font-mono text-xs bg-orange-50 text-orange-700 border-orange-200">
                              {request.type_org}
                            </Badge>
                          </td>
                          <td className="py-4 px-4">
                            <span className="text-sm text-slate-600 flex items-center gap-1">
                              <MapPin className="w-4 h-4 text-slate-400" />
                              {request.region}
                            </span>
                          </td>
                          <td className="py-4 px-4">
                            <Badge variant="outline" className={`${status.className} text-xs`}>
                              {status.icon && <status.icon className="w-3 h-3 mr-1" />}
                              {status.label}
                            </Badge>
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex items-center justify-end gap-1">
                              {/* View details */}
                              <Dialog open={dialogOpen && selectedRequest?.id === request.id} onOpenChange={(open) => {
                                setDialogOpen(open)
                                if (open) {
                                  setSelectedRequest(request)
                                  setNotesValue(request.notes_admin || '')
                                }
                              }}>
                                <DialogTrigger asChild>
                                  <Button variant="ghost" size="icon" className="h-8 w-8">
                                    <Eye className="w-4 h-4 text-slate-400 hover:text-orange-600" />
                                  </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                                  <DialogHeader>
                                    <DialogTitle>Détails de la demande</DialogTitle>
                                    <DialogDescription>
                                      Demande #{request.id.slice(-8)}
                                    </DialogDescription>
                                  </DialogHeader>
                                  
                                  {selectedRequest && (
                                    <div className="space-y-6 mt-4">
                                      {/* Status badge */}
                                      <div className="flex items-center justify-between p-4 rounded-lg bg-slate-50">
                                        <span className="text-sm text-slate-600">Statut actuel</span>
                                        <Badge variant="outline" className={statusConfig[selectedRequest.statut].className}>
                                          {statusConfig[selectedRequest.statut].label}
                                        </Badge>
                                      </div>

                                      {/* Info grid */}
                                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-3">
                                          <div className="flex items-start gap-3">
                                            <User className="w-5 h-5 text-slate-400 mt-0.5" />
                                            <div>
                                              <p className="text-xs text-slate-500">Demandeur</p>
                                              <p className="font-medium text-slate-900">{selectedRequest.nom_complet}</p>
                                            </div>
                                          </div>
                                          <div className="flex items-start gap-3">
                                            <Mail className="w-5 h-5 text-slate-400 mt-0.5" />
                                            <div>
                                              <p className="text-xs text-slate-500">Email</p>
                                              <p className="font-medium text-slate-900">{selectedRequest.email}</p>
                                            </div>
                                          </div>
                                          <div className="flex items-start gap-3">
                                            <Phone className="w-5 h-5 text-slate-400 mt-0.5" />
                                            <div>
                                              <p className="text-xs text-slate-500">Téléphone</p>
                                              <p className="font-medium text-slate-900">{selectedRequest.telephone}</p>
                                            </div>
                                          </div>
                                          {selectedRequest.whatsapp && (
                                            <div className="flex items-start gap-3">
                                              <Phone className="w-5 h-5 text-green-500 mt-0.5" />
                                              <div>
                                                <p className="text-xs text-slate-500">WhatsApp</p>
                                                <p className="font-medium text-slate-900">{selectedRequest.whatsapp}</p>
                                              </div>
                                            </div>
                                          )}
                                          {selectedRequest.fonction && (
                                            <div className="flex items-start gap-3">
                                              <ClipboardList className="w-5 h-5 text-slate-400 mt-0.5" />
                                              <div>
                                                <p className="text-xs text-slate-500">Fonction</p>
                                                <p className="font-medium text-slate-900">{selectedRequest.fonction}</p>
                                              </div>
                                            </div>
                                          )}
                                        </div>
                                        
                                        <div className="space-y-3">
                                          <div className="flex items-start gap-3">
                                            <Building2 className="w-5 h-5 text-slate-400 mt-0.5" />
                                            <div>
                                              <p className="text-xs text-slate-500">Organisation</p>
                                              <p className="font-medium text-slate-900">{selectedRequest.nom_organisation}</p>
                                            </div>
                                          </div>
                                          <div className="flex items-start gap-3">
                                            <MapPin className="w-5 h-5 text-slate-400 mt-0.5" />
                                            <div>
                                              <p className="text-xs text-slate-500">Type / Région</p>
                                              <p className="font-medium text-slate-900">
                                                <Badge variant="outline" className="mr-2 bg-orange-50 text-orange-700 border-orange-200">
                                                  {selectedRequest.type_org}
                                                </Badge>
                                                {selectedRequest.region}
                                                {selectedRequest.departement && ` - ${selectedRequest.departement}`}
                                              </p>
                                            </div>
                                          </div>
                                          {selectedRequest.nb_collaborateurs && (
                                            <div className="flex items-start gap-3">
                                              <UsersIcon className="w-5 h-5 text-slate-400 mt-0.5" />
                                              <div>
                                                <p className="text-xs text-slate-500">Collaborateurs</p>
                                                <p className="font-medium text-slate-900">{selectedRequest.nb_collaborateurs}</p>
                                              </div>
                                            </div>
                                          )}
                                          <div className="flex items-start gap-3">
                                            <Calendar className="w-5 h-5 text-slate-400 mt-0.5" />
                                            <div>
                                              <p className="text-xs text-slate-500">Reçue le</p>
                                              <p className="font-medium text-slate-900">{formatDate(selectedRequest.created_at)}</p>
                                            </div>
                                          </div>
                                        </div>
                                      </div>

                                      {/* Message */}
                                      {selectedRequest.message && (
                                        <div className="p-4 rounded-lg bg-blue-50 border border-blue-200">
                                          <p className="text-xs text-blue-600 mb-1 flex items-center gap-1">
                                            <MessageSquare className="w-3 h-3" />
                                            Message du demandeur
                                          </p>
                                          <p className="text-sm text-blue-900">{selectedRequest.message}</p>
                                        </div>
                                      )}

                                      {/* Admin notes */}
                                      <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-700">Notes administrateur</label>
                                        <Textarea
                                          value={notesValue}
                                          onChange={(e) => setNotesValue(e.target.value)}
                                          placeholder="Ajoutez des notes internes..."
                                          rows={3}
                                        />
                                      </div>

                                      {/* Actions */}
                                      <div className="flex flex-wrap gap-2 pt-4 border-t border-slate-200">
                                        {selectedRequest.statut === 'NOUVELLE' && (
                                          <>
                                            <Button 
                                              onClick={() => handleStatusUpdate(selectedRequest.id, 'EN_CONTACT', notesValue)}
                                              disabled={actionLoading}
                                              size="sm"
                                              className="bg-blue-600 hover:bg-blue-700"
                                            >
                                              <Send className="w-4 h-4 mr-1" />
                                              Contacter
                                            </Button>
                                            <Button 
                                              onClick={() => handleApproveRequest(selectedRequest.id)}
                                              disabled={actionLoading}
                                              size="sm"
                                              className="bg-green-600 hover:bg-green-700"
                                            >
                                              <CheckCircle2 className="w-4 h-4 mr-1" />
                                              Approuver & Créer org.
                                            </Button>
                                            <Button 
                                              onClick={() => handleStatusUpdate(selectedRequest.id, 'REJETEE', notesValue)}
                                              disabled={actionLoading}
                                              variant="destructive"
                                              size="sm"
                                            >
                                              <XCircle className="w-4 h-4 mr-1" />
                                              Rejeter
                                            </Button>
                                          </>
                                        )}
                                        
                                        {selectedRequest.statut === 'EN_CONTACT' && (
                                          <>
                                            <Button 
                                              onClick={() => handleApproveRequest(selectedRequest.id)}
                                              disabled={actionLoading}
                                              size="sm"
                                              className="bg-green-600 hover:bg-green-700"
                                            >
                                              <CheckCircle2 className="w-4 h-4 mr-1" />
                                              Approuver
                                            </Button>
                                            <Button 
                                              onClick={() => handleStatusUpdate(selectedRequest.id, 'APPROUVEE', notesValue)}
                                              disabled={actionLoading}
                                              size="sm"
                                            >
                                              Approuver (en attente)
                                            </Button>
                                            <Button 
                                              onClick={() => handleStatusUpdate(selectedRequest.id, 'REJETEE', notesValue)}
                                              disabled={actionLoading}
                                              variant="destructive"
                                              size="sm"
                                            >
                                              <XCircle className="w-4 h-4 mr-1" />
                                              Rejeter
                                            </Button>
                                          </>
                                        )}

                                        {(selectedRequest.statut === 'APPROUVEE' || selectedRequest.statut === 'REJETEE') && (
                                          <Button 
                                            onClick={() => handleStatusUpdate(selectedRequest.id, 'NOUVELLE', notesValue)}
                                            disabled={actionLoading}
                                            variant="outline"
                                            size="sm"
                                          >
                                            Réouvrir
                                          </Button>
                                        )}

                                        {selectedRequest.statut === 'CONVERTIE' && (
                                          <div className="text-sm text-green-600 flex items-center gap-1">
                                            <CheckCircle2 className="w-4 h-4" />
                                            Cette demande a été convertie en organisation active
                                          </div>
                                        )}

                                        <Button 
                                          onClick={() => handleStatusUpdate(selectedRequest.id, selectedRequest.statut, notesValue)}
                                          disabled={actionLoading}
                                          variant="outline"
                                          size="sm"
                                          className="ml-auto"
                                        >
                                          Sauvegarder les notes
                                        </Button>
                                      </div>

                                      {/* Existing admin notes */}
                                      {selectedRequest.notes_admin && (
                                        <div className="mt-4 p-3 rounded bg-amber-50 border border-amber-200">
                                          <p className="text-xs text-amber-600 mb-1">Notes précédentes:</p>
                                          <p className="text-sm text-amber-900">{selectedRequest.notes_admin}</p>
                                          {selectedRequest.admin_updated_at && (
                                            <p className="text-xs text-amber-500 mt-1">
                                              Mis à jour: {formatDate(selectedRequest.admin_updated_at)}
                                            </p>
                                          )}
                                        </div>
                                      )}
                                    </div>
                                  )}
                                </DialogContent>
                              </Dialog>

                              {/* Quick actions dropdown */}
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon" className="h-8 w-8">
                                    <MoreHorizontal className="w-4 h-4 text-slate-400" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem onClick={() => {
                                    setSelectedRequest(request)
                                    setNotesValue(request.notes_admin || '')
                                    setDialogOpen(true)
                                  }}>
                                    <Eye className="w-4 h-4 mr-2" />
                                    Voir détails
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  {request.statut === 'NOUVELLE' && (
                                    <>
                                      <DropdownMenuItem onClick={() => handleStatusUpdate(request.id, 'EN_CONTACT')}>
                                        <Send className="w-4 h-4 mr-2 text-blue-600" />
                                        Marquer en contact
                                      </DropdownMenuItem>
                                      <DropdownMenuItem onClick={() => handleApproveRequest(request.id)} className="text-green-600">
                                        <CheckCircle2 className="w-4 h-4 mr-2" />
                                        Approuver
                                      </DropdownMenuItem>
                                      <DropdownMenuItem onClick={() => handleStatusUpdate(request.id, 'REJETEE')} className="text-red-600">
                                        <XCircle className="w-4 h-4 mr-2" />
                                        Rejeter
                                      </DropdownMenuItem>
                                    </>
                                  )}
                                  {request.statut === 'EN_CONTACT' && (
                                    <>
                                      <DropdownMenuItem onClick={() => handleApproveRequest(request.id)} className="text-green-600">
                                        <CheckCircle2 className="w-4 h-4 mr-2" />
                                        Approuver
                                      </DropdownMenuItem>
                                      <DropdownMenuItem onClick={() => handleStatusUpdate(request.id, 'REJETEE')} className="text-red-600">
                                        <XCircle className="w-4 h-4 mr-2" />
                                        Rejeter
                                      </DropdownMenuItem>
                                    </>
                                  )}
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>

              {/* Mobile cards */}
              <div className="md:hidden space-y-3">
                {requests.map((request) => {
                  const status = statusConfig[request.statut]
                  return (
                    <Card key={request.id} className="border-slate-200">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <p className="font-medium text-slate-900">{request.nom_complet}</p>
                            <p className="text-sm text-slate-500">{request.nom_organisation}</p>
                          </div>
                          <Badge variant="outline" className={`${status.className} text-xs`}>
                            {status.label}
                          </Badge>
                        </div>
                        <div className="space-y-1 text-sm text-slate-600">
                          <p className="flex items-center gap-1">
                            <Mail className="w-3 h-3" />{request.email}
                          </p>
                          <p className="flex items-center gap-1">
                            <Phone className="w-3 h-3" />{request.telephone}
                          </p>
                          <p className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />{request.region}
                          </p>
                        </div>
                        <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-100">
                          <span className="text-xs text-slate-400">{getRelativeTime(request.created_at)}</span>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => {
                              setSelectedRequest(request)
                              setNotesValue(request.notes_admin || '')
                              setDialogOpen(true)
                            }}
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            Détails
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-200">
                  <p className="text-sm text-slate-500">
                    Page {pagination.page} sur {pagination.totalPages}
                  </p>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setPagination(p => ({ ...p, page: p.page - 1 }))}
                      disabled={pagination.page <= 1}
                      className="h-8 w-8"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </Button>
                    {[...Array(Math.min(5, pagination.totalPages))].map((_, i) => {
                      const pageNum = i + 1
                      return (
                        <Button
                          key={pageNum}
                          variant={pagination.page === pageNum ? 'default' : 'outline'}
                          size="icon"
                          onClick={() => setPagination(p => ({ ...p, page: pageNum }))}
                          className={`h-8 w-8 ${pagination.page === pageNum ? 'bg-orange-600 hover:bg-orange-700' : ''}`}
                        >
                          {pageNum}
                        </Button>
                      )
                    })}
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setPagination(p => ({ ...p, page: p.page + 1 }))}
                      disabled={pagination.page >= pagination.totalPages}
                      className="h-8 w-8"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          ) : (
            /* Empty state */
            <div className="text-center py-12">
              <ClipboardList className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-900 mb-1">Aucune demande trouvée</h3>
              <p className="text-slate-500 mb-4">
                {filters.statut || filters.search || (filters.region && filters.region !== 'Toutes les régions')
                  ? 'Essayez de modifier vos filtres'
                  : 'Les nouvelles demandes d\'abonnement apparaîtront ici'}
              </p>
              {(filters.statut || filters.search || (filters.region && filters.region !== 'Toutes les régions')) && (
                <Button variant="outline" onClick={() => setFilters({ statut: '', region: '', search: '' })}>
                  Effacer les filtres
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

// Icon component for users count
function UsersIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
      <circle cx="9" cy="7" r="4"/>
      <path d="M22 21v-2a4 4 0 0 0-3-3.87"/>
      <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
    </svg>
  )
}
