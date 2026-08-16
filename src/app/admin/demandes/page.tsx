'use client'

import React, { useState, useEffect } from 'react'
import { 
  Search, 
  Eye, 
  Phone, 
  CheckCircle2, 
  XCircle,
  Clock,
  MapPin,
  Mail,
  Building2,
  User,
  MessageSquare,
  RefreshCw,
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
import { Textarea } from '@/components/ui/textarea'

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
}

// Config statuts
const STATUT_CONFIG: Record<RequestStatus, { label: string; color: string; bg: string; icon: React.ElementType }> = {
  NOUVELLE: { label: 'Nouvelle', color: 'text-amber-700', bg: 'bg-amber-100', icon: Clock },
  EN_CONTACT: { label: 'En contact', color: 'text-blue-700', bg: 'bg-blue-100', icon: Phone },
  APPROUVEE: { label: 'Approuvée', color: 'text-green-700', bg: 'bg-green-100', icon: CheckCircle2 },
  REJETEE: { label: 'Rejetée', color: 'text-red-700', bg: 'bg-red-100', icon: XCircle },
  CONVERTIE: { label: 'Convertie', color: 'text-purple-700', bg: 'bg-purple-100', icon: CheckCircle2 }
}

export default function DemandesPage() {
  const [demandes, setDemandes] = useState<SubscriptionRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [statutFilter, setStatutFilter] = useState('')
  const [selectedDemande, setSelectedDemande] = useState<SubscriptionRequest | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [notes, setNotes] = useState('')
  const [actionLoading, setActionLoading] = useState(false)

  // Fetch demandes
  useEffect(() => {
    async function load() {
      try {
        setLoading(true)
        setError(null)
        const params = new URLSearchParams({ limit: '50', ...(search && { search }), ...(statutFilter && { statut: statutFilter }) })
        const res = await fetch(`/api/admin/demandes?${params}`)
        if (!res.ok) throw new Error('Erreur HTTP: ' + res.status)
        const json = await res.json()
        setDemandes(json.data || [])
      } catch (e) {
        console.error('Erreur chargement:', e)
        setError('Impossible de charger les données')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [search, statutFilter])

  // Changer statut
  const updateStatut = async (demandeId: string, nouveauStatut: RequestStatus) => {
    try {
      setActionLoading(true)
      const res = await fetch(`/api/admin/demandes/${demandeId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ statut: nouveauStatut, notes_admin: notes || undefined })
      })
      if (res.ok) {
        // Recharger
        const res2 = await fetch('/api/admin/demandes?limit=50')
        if (res2.ok) {
          const json = await res2.json()
          setDemandes(json.data || [])
        }
        setDialogOpen(false)
        setSelectedDemande(null)
        setNotes('')
      }
    } catch (e) {
      console.error('Erreur mise à jour:', e)
    } finally {
      setActionLoading(false)
    }
  }

  // Format date
  const fmtDate = (d: string) => {
    try { return new Date(d).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' }) }
    catch { return '-' }
  }

  // Stats
  const stats = {
    total: demandes.length,
    nouvelles: demandes.filter(d => d.statut === 'NOUVELLE').length,
    enContact: demandes.filter(d => d.statut === 'EN_CONTACT').length,
    approuvees: demandes.filter(d => d.statut === 'APPROUVEE').length,
    rejetees: demandes.filter(d => d.statut === 'REJETEE').length
  }

  // Badge statut
  const StatutBadge = ({ statut }: { statut: RequestStatus }) => {
    const cfg = STATUT_CONFIG[statut]
    const Icon = cfg.icon
    return (
      <Badge variant="outline" className={`${cfg.bg} ${cfg.color} gap-1 text-xs`}>
        <Icon className="w-3 h-3" />
        {cfg.label}
      </Badge>
    )
  }

  return (
    <div className="space-y-6 p-4 lg:p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Demandes d&apos;abonnement</h1>
          <p className="text-slate-500 text-sm mt-1">Gérez les demandes d&apos;inscription</p>
        </div>
        <Button variant="outline" size="sm" onClick={() => window.location.reload()}>
          <RefreshCw className="w-4 h-4 mr-2" />
          Actualiser
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <Card><CardContent className="p-3 flex items-center gap-2">
          <span className="text-lg font-bold">{stats.total}</span><span className="text-xs text-slate-500">Total</span>
        </CardContent></Card>
        <Card className="border-amber-200"><CardContent className="p-3 flex items-center gap-2">
          <Clock className="w-4 h-4 text-amber-600" />
          <span className="font-bold text-amber-700">{stats.nouvelles}</span>
          <span className="text-xs text-amber-600">Nouvelles</span>
        </CardContent></Card>
        <Card className="border-blue-200"><CardContent className="p-3 flex items-center gap-2">
          <Phone className="w-4 h-4 text-blue-600" />
          <span className="font-bold text-blue-700">{stats.enContact}</span>
          <span className="text-xs text-blue-600">Contact</span>
        </CardContent></Card>
        <Card className="border-green-200"><CardContent className="p-3 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-green-600" />
          <span className="font-bold text-green-700">{stats.approuvees}</span>
          <span className="text-xs text-green-600">Approuvées</span>
        </CardContent></Card>
        <Card className="border-red-200"><CardContent className="p-3 flex items-center gap-2">
          <XCircle className="w-4 h-4 text-red-600" />
          <span className="font-bold text-red-700">{stats.rejetees}</span>
          <span className="text-xs text-red-600">Rejetées</span>
        </CardContent></Card>
      </div>

      {/* Filtres */}
      <Card>
        <CardContent className="p-4 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input placeholder="Rechercher..." value={search} onChange={e => setSearch(e.target.value)} className="pl-10" />
          </div>
          <Select value={statutFilter} onValueChange={setStatutFilter}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Tous statuts" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Tous statuts</SelectItem>
              <SelectItem value="NOUVELLE">Nouvelles</SelectItem>
              <SelectItem value="EN_CONTACT">En contact</SelectItem>
              <SelectItem value="APPROUVEE">Approuvées</SelectItem>
              <SelectItem value="REJETEE">Rejetées</SelectItem>
              <SelectItem value="CONVERTIE">Converties</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Error */}
      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-4 flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-red-500" />
            <span className="text-red-700 text-sm">{error}</span>
            <Button size="sm" variant="outline" onClick={() => window.location.reload()} className="ml-auto">Réessayer</Button>
          </CardContent>
        </Card>
      )}

      {/* Loading */}
      {loading ? (
        <div className="space-y-3">
          {[1,2,3,4,5].map(i => (
            <Card key={i}><CardContent className="p-4 h-28 bg-slate-100 animate-pulse rounded-lg" /></Card>
          ))}
        </div>
      ) : demandes.length === 0 ? (
        /* Empty */
        <Card>
          <CardContent className="p-12 text-center">
            <MessageSquare className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="font-semibold text-slate-700">Aucune demande</h3>
            <p className="text-sm text-slate-500 mt-1">Les nouvelles demandes apparaîtront ici</p>
          </CardContent>
        </Card>
      ) : (
        /* Liste */
        <div className="space-y-3">
          {demandes.map(d => {
            const cfg = STATUT_CONFIG[d.statut]
            return (
              <Card key={d.id} className={`hover:shadow-md transition-shadow ${d.statut === 'NOUVELLE' ? 'border-l-4 border-l-amber-400' : ''}`}>
                <CardContent className="p-4 md:p-6">
                  <div className="flex flex-col lg:flex-row lg:items-start gap-4">
                    {/* Info principale */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <h3 className="font-semibold text-slate-900 truncate">{d.nom_complet}</h3>
                        <StatutBadge statut={d.statut} />
                        <Badge variant="outline" className={d.type_org === 'DR' ? 'border-blue-200 text-blue-700' : 'border-purple-200 text-purple-700'}>
                          {d.type_org}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-2 text-sm text-slate-600 mt-3">
                        <div className="flex items-center gap-2"><Mail className="w-4 h-4 text-slate-400" /><span className="truncate">{d.email}</span></div>
                        <div className="flex items-center gap-2"><Phone className="w-4 h-4 text-slate-400" /><span>{d.telephone}</span></div>
                        <div className="flex items-center gap-2"><Building2 className="w-4 h-4 text-slate-400" /><span className="truncate">{d.nom_organisation}</span></div>
                        <div className="flex items-center gap-2"><MapPin className="w-4 h-4 text-slate-400" /><span>{d.region}</span></div>
                      </div>

                      {d.message && (
                        <div className="mt-3 p-3 bg-slate-50 rounded-lg">
                          <p className="text-sm text-slate-600 line-clamp-2">&ldquo;{d.message}&rdquo;</p>
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 lg:flex-col lg:items-end">
                      <span className="text-xs text-slate-400 whitespace-nowrap">{fmtDate(d.created_at)}</span>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => { setSelectedDemande(d); setNotes(d.notes_admin || ''); setDialogOpen(true) }}>
                          <Eye className="w-4 h-4 mr-1" /> Détails
                        </Button>
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
                  <User className="w-6 h-6" />
                  <div>
                    <span>Demande de {selectedDemande.nom_complet}</span>
                    <div className="flex items-center gap-2 mt-1">
                      <StatutBadge statut={selectedDemande.statut} />
                      <span className="text-sm text-slate-500">Reçue le {fmtDate(selectedDemande.created_at)}</span>
                    </div>
                  </div>
                </DialogTitle>
                <DialogDescription>Détails complets de la demande</DialogDescription>
              </DialogHeader>

              <div className="space-y-5 mt-4">
                {/* Infos personnelles */}
                <Card>
                  <CardHeader className="pb-3"><CardTitle className="text-base">Informations personnelles</CardTitle></CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    <InfoRow label="Nom" value={selectedDemande.nom_complet} />
                    <InfoRow label="Fonction" value={selectedDemande.fonction || '-'} />
                    <InfoRow label="Email" value={selectedDemande.email} />
                    <InfoRow label="Téléphone" value={selectedDemande.telephone} />
                    {selectedDemande.whatsapp && <InfoRow label="WhatsApp" value={selectedDemande.whatsapp} />}
                  </CardContent>
                </Card>

                {/* Organisation */}
                <Card>
                  <CardHeader className="pb-3"><CardTitle className="text-base">Organisation</CardTitle></CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    <InfoRow label="Nom" value={selectedDemande.nom_organisation} />
                    <InfoRow label="Type" value={<Badge>{selectedDemande.type_org === 'DR' ? 'Direction Régionale' : 'Direction Départementale'}</Badge>} />
                    <InfoRow label="Région" value={selectedDemande.region} />
                    {selectedDemande.departement && <InfoRow label="Département" value={selectedDemande.departement} />}
                    {selectedDemande.nb_collaborateurs && <InfoRow label="Collaborateurs" value={selectedDemande.nb_collaborateurs} />}
                  </CardContent>
                </Card>

                {/* Message */}
                {selectedDemande.message && (
                  <Card>
                    <CardHeader className="pb-3"><CardTitle className="text-base">Message</CardTitle></CardHeader>
                    <CardContent>
                      <p className="text-sm text-slate-700 whitespace-pre-wrap">{selectedDemande.message}</p>
                    </CardContent>
                  </Card>
                )}

                {/* Notes admin */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Notes administrateur</label>
                  <Textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder="Ajouter des notes..." rows={3} />
                </div>

                {/* Actions */}
                <div className="flex flex-wrap gap-2 pt-4 border-t">
                  {selectedDemande.statut === 'NOUVELLE' && (
                    <>
                      <Button variant="outline" onClick={() => updateStatut(selectedDemande.id, 'EN_CONTACT')} disabled={actionLoading}>
                        <Phone className="w-4 h-4 mr-1" /> En contact
                      </Button>
                      <Button onClick={() => updateStatut(selectedDemande.id, 'APPROUVEE')} disabled={actionLoading} className="bg-green-600 hover:bg-green-700">
                        <CheckCircle2 className="w-4 h-4 mr-1" /> Approuver
                      </Button>
                      <Button variant="destructive" onClick={() => updateStatut(selectedDemande.id, 'REJETEE')} disabled={actionLoading}>
                        <XCircle className="w-4 h-4 mr-1" /> Rejeter
                      </Button>
                    </>
                  )}
                  {(selectedDemande.statut === 'EN_CONTACT' || selectedDemande.statut === 'APPROUVEE') && (
                    <>
                      <Button onClick={() => updateStatut(selectedDemande.id, 'CONVERTIE')} disabled={actionLoading} className="bg-purple-600 hover:bg-purple-700">
                        <CheckCircle2 className="w-4 h-4 mr-1" /> Convertir en client
                      </Button>
                      <Button variant="destructive" onClick={() => updateStatut(selectedDemande.id, 'REJETEE')} disabled={actionLoading}>
                        <XCircle className="w-4 h-4 mr-1" /> Rejeter
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

// Composant info row
function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-start gap-2">
      <span className="text-slate-500 min-w-[80px]">{label}:</span>
      <span className="text-slate-900">{value}</span>
    </div>
  )
}
