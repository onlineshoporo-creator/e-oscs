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
  ClipboardList
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
  nom_organisation: string
  type_org: 'DR' | 'DD'
  region: string
  departement?: string
  message?: string
  statut: RequestStatus
  notes_admin?: string
}

type RequestStatus = 
  | 'NOUVELLE' 
  | 'EN_CONTACT' 
  | 'EN_ATTENTE_PAIEMENT' 
  | 'AYEE' 
  | 'REFUSEE' 
  | 'CLOTUREE'

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

// Configuration des statuts
const statusConfig: Record<RequestStatus, { label: string; className: string; icon?: React.ElementType }> = {
  NOUVELLE: { 
    label: 'Nouvelle', 
    className: 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200' 
  },
  EN_CONTACT: { 
    label: 'En contact', 
    className: 'bg-blue-100 text-blue-700 border-blue-200 hover:bg-blue-200' 
  },
  EN_ATTENTE_PAIEMENT: { 
    label: 'Attente paiement', 
    className: 'bg-amber-100 text-amber-700 border-amber-200 hover:bg-amber-200' 
  },
  AYEE: { 
    label: 'Approuvée', 
    className: 'bg-green-100 text-green-700 border-green-200 hover:bg-green-200',
    icon: CheckCircle2 
  },
  REFUSEE: { 
    label: 'Refusée', 
    className: 'bg-red-100 text-red-700 border-red-200 hover:bg-red-200',
    icon: XCircle 
  },
  CLOTUREE: { 
    label: 'Clôturée', 
    className: 'bg-slate-100 text-slate-500 border-slate-200 hover:bg-slate-200' 
  },
}

// Régions de Côte d'Ivoire
const regionsCI = [
  'Toutes les régions',
  "Abidjan",
  "Lagune",
  "Denguele",
  "Folou",
  "Fromager",
  "Gôh",
  "Guémon",
  "Haut-Sassandra",
  "Iffou",
  "Lôh-Djiboua",
  "Marahoué",
  "Nawa",
  "Nzi",
  "San-Pedro",
  "Savanes",
  "Tonkpi",
  "Worodougou",
  "Bélier",
  "Bounkani",
  "Cavally",
  "Gbêkè",
  "Gboklè",
  "Indénié-Djuablin",
  "Kabadougou",
  "Moronou",
  "Potou",
  "San-Pédro",
  "Sud-Bandama",
  "Sud-Comoé",
  "Tchologo",
  "Yamoussoukro",
  "Zanzan",
  "Zikisso"
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
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des demandes:', error)
      toast.error('Erreur lors du chargement des demandes')
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

  // Approve request (create org + user + subscription)
  const handleApproveRequest = async (requestId: string) => {
    setActionLoading(true)
    try {
      const response = await fetch(`/api/admin/demandes/${requestId}/approve`, {
        method: 'POST'
      })

      if (response.ok) {
        toast.success('Organisation créée et abonnement activé avec succès')
        setDialogOpen(false)
        fetchRequests()
      } else {
        const error = await response.json()
        throw new Error(error.message || 'Erreur lors de l\'approbation')
      }
    } catch (error) {
      console.error(error)
      toast.error(error instanceof Error ? error.message : 'Erreur lors de l\'approbation')
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
          <Button variant="outline" className="gap-2">
            <Download className="w-4 h-4" />
            Exporter
          </Button>
        </div>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {Object.entries(statusConfig).map(([key, config]) => (
          <Card key={key} className={`border-slate-200 ${filters.statut === key ? 'ring-2 ring-orange-500' : ''}`}>
            <CardContent className="p-4 cursor-pointer hover:bg-slate-50 transition-colors" 
              onClick={() => setFilters(prev => ({ ...prev, statut: prev.statut === key ? '' : key }))}>
              <p className="text-xs text-slate-500 mb-1">{config.label}s</p>
              <p className="text-2xl font-bold text-slate-900">--</p>
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
                              {formatDate(request.created_at)}
                            </div>
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
                            <Badge variant="outline" className="font-mono text-xs">
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
                              <Dialog open={dialogOpen && selectedRequest?.id === request.id} onOpenChange={(open) => {
                                setDialogOpen(open)
                                if (open) {
                                  setSelectedRequest(request)
                                  setNotesValue(request.notes_admin || '')
                                }
                              }}>
                                <DialogTrigger asChild>
                                  <Button variant="ghost" size="icon" className="h-8 w-8">
                                    <Eye className="w-4 h-4 text-slate-400" />
                                  </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                                  <DialogHeader>
                                    <DialogTitle>Détails de la demande</DialogTitle>
                                    <DialogDescription>
                                      Demande #{request.id.slice(0, 8)}...
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
                                              <p className="text-xs text-slate-500">Localisation</p>
                                              <p className="font-medium text-slate-900">
                                                {selectedRequest.departement}, {selectedRequest.region}
                                              </p>
                                            </div>
                                          </div>
                                          <div className="flex items-start gap-3">
                                            <Building2 className="w-5 h-5 text-slate-400 mt-0.5" />
                                            <div>
                                              <p className="text-xs text-slate-500">Type</p>
                                              <Badge variant="outline" className="font-mono">
                                                {selectedRequest.type_org}
                                              </Badge>
                                            </div>
                                          </div>
                                        </div>
                                      </div>

                                      {/* Message */}
                                      {selectedRequest.message && (
                                        <div className="space-y-2">
                                          <label className="text-xs font-medium text-slate-500 flex items-center gap-2">
                                            <MessageSquare className="w-4 h-4" />
                                            Message
                                          </label>
                                          <div className="p-3 rounded-lg bg-slate-50 text-sm text-slate-700 whitespace-pre-wrap">
                                            {selectedRequest.message}
                                          </div>
                                        </div>
                                      )}

                                      {/* Admin Notes */}
                                      <div className="space-y-2">
                                        <label className="text-xs font-medium text-slate-500">
                                          Notes administrateur
                                        </label>
                                        <Textarea
                                          value={notesValue}
                                          onChange={(e) => setNotesValue(e.target.value)}
                                          placeholder="Ajoutez des notes internes..."
                                          rows={3}
                                        />
                                      </div>

                                      {/* Actions */}
                                      <div className="flex flex-wrap gap-3 pt-4 border-t border-slate-200">
                                        <Button 
                                          variant="outline" 
                                          size="sm" 
                                          className="gap-2"
                                          onClick={() => window.open(`tel:${selectedRequest.telephone}`, '_self')}
                                        >
                                          <Phone className="w-4 h-4" />
                                          Contacter
                                        </Button>
                                        <Button 
                                          variant="outline" 
                                          size="sm" 
                                          className="gap-2 text-blue-600 border-blue-200 hover:bg-blue-50"
                                          onClick={() => handleStatusUpdate(selectedRequest.id, 'EN_CONTACT', notesValue)}
                                          disabled={actionLoading}
                                        >
                                          Marquer en contact
                                        </Button>
                                        <Button 
                                          size="sm" 
                                          className="gap-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
                                          onClick={() => handleApproveRequest(selectedRequest.id)}
                                          disabled={actionLoading || selectedRequest.statut === 'AYEE'}
                                        >
                                          <CheckCircle2 className="w-4 h-4" />
                                          Approuver & Créer
                                        </Button>
                                        <Button 
                                          variant="destructive" 
                                          size="sm" 
                  className="gap-2"
                                          onClick={() => handleStatusUpdate(selectedRequest.id, 'REFUSEE', notesValue)}
                                          disabled={actionLoading || selectedRequest.statut === 'REFUSEE'}
                                        >
                                          <XCircle className="w-4 h-4" />
                                          Refuser
                                        </Button>
                                      </div>
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
                                    <Eye className="mr-2 h-4 w-4" />
                                    Voir détails
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => window.open(`mailto:${request.email}`)}>
                                    <Mail className="mr-2 h-4 w-4" />
                                    Envoyer un email
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => window.open(`tel:${request.telephone}`)}>
                                    <Phone className="mr-2 h-4 w-4" />
                                    Appeler
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem 
                                    className="text-blue-600"
                                    onClick={() => handleStatusUpdate(request.id, 'EN_CONTACT')}
                                    disabled={request.statut === 'AYEE'}
                                  >
                                    Marquer en contact
                                  </DropdownMenuItem>
                                  <DropdownMenuItem 
                                    className="text-green-600"
                                    onClick={() => handleApproveRequest(request.id)}
                                    disabled={request.statut === 'AYEE' || actionLoading}
                                  >
                                    <CheckCircle2 className="mr-2 h-4 w-4" />
                                    Approuver
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem 
                                    className="text-red-600 focus:text-red-600"
                                    onClick={() => handleStatusUpdate(request.id, 'REFUSEE')}
                                    disabled={request.statut === 'REFUSEE'}
                                  >
                                    <XCircle className="mr-2 h-4 w-4" />
                                    Refuser
                                  </DropdownMenuItem>
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

              {/* Mobile Cards */}
              <div className="md:hidden space-y-3">
                {requests.map((request) => {
                  const status = statusConfig[request.statut]
                  return (
                    <div key={request.id} className="p-4 rounded-xl bg-white border border-slate-200 space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
                            <Building2 className="w-5 h-5 text-orange-600" />
                          </div>
                          <div>
                            <p className="font-medium text-slate-900">{request.nom_organisation}</p>
                            <p className="text-xs text-slate-500">{request.nom_complet}</p>
                          </div>
                        </div>
                        <Badge variant="outline" className={`${status.className} text-[10px]`}>
                          {status.label}
                        </Badge>
                      </div>
                      
                      <div className="flex flex-wrap gap-2 text-xs text-slate-500">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {request.region}
                        </span>
                        <Badge variant="secondary" className="text-[10px]">{request.type_org}</Badge>
                        <span>{formatDate(request.created_at)}</span>
                      </div>

                      <div className="flex gap-2 pt-2 border-t border-slate-100">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="flex-1 text-xs"
                          onClick={() => {
                            setSelectedRequest(request)
                            setNotesValue(request.notes_admin || '')
                            setDialogOpen(true)
                          }}
                        >
                          <Eye className="w-3 h-3 mr-1" />
                          Détails
                        </Button>
                        <Button 
                          size="sm" 
                          className="flex-1 text-xs bg-green-600 hover:bg-green-700"
                          onClick={() => handleApproveRequest(request.id)}
                          disabled={request.statut === 'AYEE'}
                        >
                          <CheckCircle2 className="w-3 h-3 mr-1" />
                          Approuver
                        </Button>
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <div className="flex items-center justify-between pt-4 mt-4 border-t border-slate-200">
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
                          className="w-8 h-8"
                          onClick={() => setPagination(prev => ({ ...prev, page: pageNum }))}
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
            <div className="text-center py-16">
              <ClipboardList className="w-16 h-16 text-slate-200 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-slate-700 mb-2">Aucune demande trouvée</h3>
              <p className="text-slate-500 mb-4">
                {filters.search || filters.statut || filters.region 
                  ? 'Essayez de modifier vos filtres' 
                  : 'Les nouvelles demandes apparaîtront ici'}
              </p>
              {(filters.search || filters.statut || filters.region) && (
                <Button 
                  variant="outline" 
                  onClick={() => setFilters({ statut: '', region: '', search: '' })}
                >
                  Réinitialiser les filtres
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
