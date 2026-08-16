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
  AlertCircle,
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
import { Textarea } from '@/components/ui/textarea'
import { Skeleton } from '@/components/ui/skeleton'
import { toast } from 'sonner'

// Types
type RequestStatus = 'NOUVELLE' | 'EN_CONTACT' | 'APPROUVEE' | 'REJETEE' | 'CONVERTIE'

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

// Configuration des statuts
const STATUT_CONFIG: Record<RequestStatus, { label: string; color: string; bgColor: string; icon: React.ElementType }> = {
  NOUVELLE: { 
    label: 'Nouvelle', 
    color: 'text-amber-700', 
    bgColor: 'bg-amber-100', 
    borderColor: 'border-amber-200',
    icon: Clock 
  },
  EN_CONTACT: { 
    label: 'En contact', 
    color: 'text-blue-700', 
    bgColor: 'bg-blue-100',
    borderColor: 'border-blue-200',
    icon: Phone 
  },
  APPROUVEE: { 
    label: 'Approuvée', 
    color: 'text-green-700', 
    bgColor: 'bg-green-100',
    borderColor: 'border-green-200',
    icon: CheckCircle2 
  },
  REJETEE: { 
    label: 'Rejetée', 
    color: 'text-red-700', 
    bgColor: 'bg-red-100',
    borderColor: 'border-red-200',
    icon: XCircle 
  },
  CONVERTIE: { 
    label: 'Convertie', 
    color: 'text-purple-700', 
    bgColor: 'bg-purple-100',
    borderColor: 'border-purple-200',
    icon: CheckCircle2 
  }
}

// Régions CI
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
  "Zanzan"
]

export default function DemandesPage() {
  const [demandes, setDemandes] = useState<SubscriptionRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statutFilter, setStatutFilter] = useState('')
  const [regionFilter, setRegionFilter] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedDemande, setSelectedDemande] = useState<SubscriptionRequest | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [actionLoading, setActionLoading] = useState(false)
  const [notes, setNotes] = useState('')
  const [error, setError] = useState<string | null>(null)
  
  const itemsPerPage = 10

  // Fetch demandes
  const fetchDemandes = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: itemsPerPage.toString(),
        ...(search && { search }),
        ...(statutFilter && { statut: statutFilter }),
        ...(regionFilter && regionFilter !== 'Toutes régions' && { region: regionFilter })
      })

      const response = await fetch(`/api/admin/demandes?${params}`)
      if (response.ok) {
        const data = await response.json()
        setDemandes(data.data || [])
      } else {
        throw new Error('Erreur lors du chargement')
      }
    } catch (err) {
      console.error('Erreur:', err)
      setError('Impossible de charger les demandes')
      toast.error('Erreur de connexion au serveur')
    } finally {
      setLoading(false)
    }
  }, [currentPage, search, statutFilter, regionFilter])

  useEffect(() => {
    fetchDemandes()
  }, [fetchDemandes])

  // Changer le statut d'une demande
  const updateStatut = async (demandeId: string, nouveauStatut: RequestStatus) => {
    setActionLoading(true)
    try {
      const response = await fetch(`/api/admin/demandes/${demandeId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          statut: nouveauStatut,
          notes_admin: notes || undefined 
        })
      })

      if (response.ok) {
        const labels = {
          EN_CONTACT: 'marquée en contact',
          APPROUVEE: 'approuvée',
          REJETEE: 'rejetée',
          CONVERTIE: 'convertie en client'
        }
        toast.success(`Demande ${labels[nouveauStatut] || 'mise à jour'}`)
        
        fetchDemandes()
        setDialogOpen(false)
        setSelectedDemande(null)
        setNotes('')
      } else {
        throw new Error('Erreur lors de la mise à jour')
      }
    } catch (err) {
      console.error(err)
      toast.error('Erreur lors de la mise à jour du statut')
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
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    } catch {
      return 'Date invalide'
    }
  }

  // Ouvrir le détail
  const openDetail = (demande: SubscriptionRequest) => {
    setSelectedDemande(demande)
    setNotes(demande.notes_admin || '')
    setDialogOpen(true)
  }

  // Stats calculées
  const stats = {
    total: demandes.length,
    nouvelles: demandes.filter(d => d.statut === 'NOUVELLE').length,
    enContact: demandes.filter(d => d.statut === 'EN_CONTACT').length,
    approuvees: demandes.filter(d => d.statut === 'APPROUVEE').length,
    rejetees: demandes.filter(d => d.statut === 'REJETEE').length
  }

  // Composant Badge de statut
  const StatutBadge = ({ statut }: { statut: RequestStatus }) => {
    const config = STATUT_CONFIG[statut]
    const Icon = config.icon
    return (
      <Badge variant="outline" className={`${config.bgColor} ${config.color} ${config.borderColor} gap-1`}>
        <Icon className="w-3 h-3" />
        {config.label}
      </Badge>
    )
  }

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-slate-900">Demandes d&apos;abonnement</h1>
          <p className="text-slate-500 mt-1">Gérez les demandes d&apos;inscription des organisations</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={fetchDemandes} disabled={loading} className="gap-2">
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Actualiser
          </Button>
        </div>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card className="border-slate-200">
          <CardContent className="p-4 flex items-center gap-3">
            <ClipboardList className="w-5 h-5 text-slate-400" />
            <div>
              <p className="text-xl font-bold text-slate-900">{stats.total}</p>
              <p className="text-xs text-slate-500">Total</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-amber-200 bg-amber-50/50">
          <CardContent className="p-4 flex items-center gap-3">
            <Clock className="w-5 h-5 text-amber-600" />
            <div>
              <p className="text-xl font-bold text-amber-700">{stats.nouvelles}</p>
              <p className="text-xs text-amber-600">Nouvelles</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-blue-200 bg-blue-50/50">
          <CardContent className="p-4 flex items-center gap-3">
            <Phone className="w-5 h-5 text-blue-600" />
            <div>
              <p className="text-xl font-bold text-blue-700">{stats.enContact}</p>
              <p className="text-xs text-blue-600">En contact</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-green-200 bg-green-50/50">
          <CardContent className="p-4 flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-green-600" />
            <div>
              <p className="text-xl font-bold text-green-700">{stats.approuvees}</p>
              <p className="text-xs text-green-600">Approuvées</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-red-200 bg-red-50/50">
          <CardContent className="p-4 flex items-center gap-3">
            <XCircle className="w-5 h-5 text-red-600" />
            <div>
              <p className="text-xl font-bold text-red-700">{stats.rejetees}</p>
              <p className="text-xs text-red-600">Rejetées</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="border-slate-200">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                placeholder="Rechercher par nom, email, organisation..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statutFilter} onValueChange={setStatutFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Tous statuts</SelectItem>
                <SelectItem value="NOUVELLE">Nouvelle</SelectItem>
                <SelectItem value="EN_CONTACT">En contact</SelectItem>
                <SelectItem value="APPROUVEE">Approuvée</SelectItem>
                <SelectItem value="REJETEE">Rejetée</SelectItem>
                <SelectItem value="CONVERTIE">Convertie</SelectItem>
              </SelectContent>
            </Select>
            <Select value={regionFilter} onValueChange={setRegionFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
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

      {/* Error state */}
      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-4 flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-red-500" />
            <p className="text-red-700">{error}</p>
            <Button variant="outline" size="sm" onClick={fetchDemandes} className="ml-auto">
              Réessayer
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Loading state */}
      {loading ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-24 w-full rounded-lg" />
          ))}
        </div>
      ) : demandes.length === 0 ? (
        <Card className="border-slate-200">
          <CardContent className="p-12 text-center">
            <ClipboardList className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-700 mb-2">Aucune demande trouvée</h3>
            <p className="text-slate-500 text-sm">
              {search || statutFilter || regionFilter 
                ? 'Essayez de modifier vos filtres' 
                : 'Les nouvelles demandes apparaîtront ici'}
            </p>
          </CardContent>
        </Card>
      ) : (
        /* Liste des demandes */
        <div className="space-y-3">
          {demandes.map((demande) => {
            const statutConfig = STATUT_CONFIG[demande.statut]
            return (
              <Card key={demande.id} className={`border-slate-200 hover:shadow-md transition-all ${
                demande.statut === 'NOUVELLE' ? 'border-l-4 border-l-amber-500' : ''
              }`}>
                <CardContent className="p-4 md:p-6">
                  <div className="flex flex-col lg:flex-row lg:items-start gap-4">
                    {/* Main info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <h3 className="font-semibold text-slate-900 truncate">
                          {demande.nom_complet}
                        </h3>
                        <StatutBadge statut={demande.statut} />
                        <Badge variant="outline" className={
                          demande.type_org === 'DR' 
                            ? 'border-blue-200 text-blue-700' 
                            : 'border-purple-200 text-purple-700'
                        }>
                          {demande.type_org}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-2 text-sm text-slate-600 mt-3">
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4 text-slate-400 flex-shrink-0" />
                          <span className="truncate">{demande.email}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4 text-slate-400 flex-shrink-0" />
                          <span>{demande.telephone}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Building2 className="w-4 h-4 text-slate-400 flex-shrink-0" />
                          <span className="truncate">{demande.nom_organisation}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-slate-400 flex-shrink-0" />
                          <span>{demande.region}</span>
                        </div>
                      </div>

                      {/* Message si présent */}
                      {demande.message && (
                        <div className="mt-3 p-3 bg-slate-50 rounded-lg">
                          <p className="text-sm text-slate-600 line-clamp-2">
                            &ldquo;{demande.message}&rdquo;
                          </p>
                        </div>
                      )}

                      {/* Notes admin si présentes */}
                      {demande.notes_admin && (
                        <div className="mt-2 p-2 bg-orange-50 rounded-lg border border-orange-200">
                          <p className="text-xs text-orange-700">
                            <strong>Note:</strong> {demande.notes_admin}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 lg:flex-col lg:items-end">
                      <span className="text-xs text-slate-400 whitespace-nowrap">
                        {formatDate(demande.created_at)}
                      </span>
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => openDetail(demande)}
                          className="gap-1"
                        >
                          <Eye className="w-4 h-4" />
                          Détails
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => updateStatut(demande.id, 'EN_CONTACT')}>
                              <Phone className="mr-2 h-4 w-4" /> Marquer en contact
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => updateStatut(demande.id, 'APPROUVEE')} className="text-green-600">
                              <CheckCircle2 className="mr-2 h-4 w-4" /> Approuver
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => updateStatut(demande.id, 'REJETEE')} className="text-red-600">
                              <XCircle className="mr-2 h-4 w-4" /> Rejeter
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => updateStatut(demande.id, 'CONVERTIE')} className="text-purple-600">
                              <CheckCircle2 className="mr-2 h-4 w-4" /> Convertir en client
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}

      {/* Dialog détail */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          {selectedDemande && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-3">
                  <User className="w-6 h-6 text-slate-700" />
                  <div>
                    <span>Demande de {selectedDemande.nom_complet}</span>
                    <div className="flex items-center gap-2 mt-1">
                      <StatutBadge statut={selectedDemande.statut} />
                      <span className="text-sm text-slate-500">
                        Reçue le {formatDate(selectedDemande.created_at)}
                      </span>
                    </div>
                  </div>
                </DialogTitle>
                <DialogDescription>
                  Détails complets de la demande d&apos;abonnement
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-6 mt-4">
                {/* Infos personnelles */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card className="border-slate-200">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base flex items-center gap-2">
                        <User className="w-4 h-4" /> Informations personnelles
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <InfoRow label="Nom complet" value={selectedDemande.nom_complet} />
                      <InfoRow label="Fonction" value={selectedDemande.fonction} />
                      <InfoRow label="Email" value={selectedDemande.email} icon={<Mail className="w-4 h-4" />} />
                      <InfoRow label="Téléphone" value={selectedDemande.telephone} icon={<Phone className="w-4 h-4" />} />
                      {selectedDemande.whatsapp && (
                        <InfoRow label="WhatsApp" value={selectedDemande.whatsapp} icon={<Phone className="w-4 h-4" />} />
                      )}
                    </CardContent>
                  </Card>

                  <Card className="border-slate-200">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base flex items-center gap-2">
                        <Building2 className="w-4 h-4" /> Organisation
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <InfoRow label="Nom" value={selectedDemande.nom_organisation} />
                      <InfoRow label="Type" value={
                        <Badge variant="outline" className={
                          selectedDemande.type_org === 'DR' 
                            ? 'border-blue-200 text-blue-700' 
                            : 'border-purple-200 text-purple-700'
                        }>
                          {selectedDemande.type_org === 'DR' ? 'Direction Régionale' : 'Direction Départementale'}
                        </Badge>
                      } />
                      <InfoRow label="Région" value={selectedDemande.region} icon={<MapPin className="w-4 h-4" />} />
                      {selectedDemande.departement && (
                        <InfoRow label="Département" value={selectedDemande.departement} />
                      )}
                      {selectedDemande.nb_collaborateurs && (
                        <InfoRow label="Collaborateurs" value={selectedDemande.nb_collaborateurs} />
                      )}
                    </CardContent>
                  </Card>
                </div>

                {/* Message */}
                {selectedDemande.message && (
                  <Card className="border-slate-200 bg-slate-50/50">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base flex items-center gap-2">
                        <MessageSquare className="w-4 h-4" /> Message
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-slate-700 whitespace-pre-wrap">{selectedDemande.message}</p>
                    </CardContent>
                  </Card>
                )}

                {/* Notes admin */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Notes administrateur</label>
                  <Textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Ajoutez des notes internes sur cette demande..."
                    rows={3}
                  />
                </div>

                {/* Actions rapides */}
                <div className="flex flex-wrap gap-2 pt-4 border-t border-slate-200">
                  {selectedDemande.statut === 'NOUVELLE' && (
                    <>
                      <Button 
                        onClick={() => updateStatut(selectedDemande.id, 'EN_CONTACT')}
                        disabled={actionLoading}
                        variant="outline"
                        className="gap-2"
                      >
                        <Phone className="w-4 h-4" /> En contact
                      </Button>
                      <Button 
                        onClick={() => updateStatut(selectedDemande.id, 'APPROUVEE')}
                        disabled={actionLoading}
                        className="gap-2 bg-green-600 hover:bg-green-700"
                      >
                        <CheckCircle2 className="w-4 h-4" /> Approuver
                      </Button>
                      <Button 
                        onClick={() => updateStatut(selectedDemande.id, 'REJETEE')}
                        disabled={actionLoading}
                        variant="destructive"
                        className="gap-2"
                      >
                        <XCircle className="w-4 h-4" /> Rejeter
                      </Button>
                    </>
                  )}
                  {(selectedDemande.statut === 'EN_CONTACT' || selectedDemande.statut === 'APPROUVEE') && (
                    <>
                      <Button 
                        onClick={() => updateStatut(selectedDemande.id, 'CONVERTIE')}
                        disabled={actionLoading}
                        className="gap-2 bg-purple-600 hover:bg-purple-700"
                      >
                        <CheckCircle2 className="w-4 h-4" /> Convertir en client
                      </Button>
                      <Button 
                        onClick={() => updateStatut(selectedDemande.id, 'REJETEE')}
                        disabled={actionLoading}
                        variant="destructive"
                        className="gap-2"
                      >
                        <XCircle className="w-4 h-4" /> Rejeter
                      </Button>
                    </>
                  )}
                  <Button 
                    onClick={() => {
                      navigator.clipboard.writeText(`mailto:${selectedDemande.email}`)
                      toast.success('Email copié dans le presse-papier')
                    }}
                    variant="outline"
                    className="gap-2 ml-auto"
                  >
                    <Send className="w-4 h-4" /> Contacter par email
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

// Composant pour afficher une ligne d'info
function InfoRow({ label, value, icon }: { label: string; value: React.ReactNode; icon?: React.ReactNode }) {
  return (
    <div className="flex items-start gap-2">
      <span className="text-xs text-slate-500 min-w-[80px] pt-0.5">{label}:</span>
      <div className="flex items-center gap-1.5 text-sm text-slate-900">
        {icon}
        {value || '-'}
      </div>
    </div>
  )
}
