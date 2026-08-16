'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { 
  Search, 
  Eye, 
  Phone, 
  CheckCircle, 
  XCircle,
  Clock,
  MapPin,
  Mail,
  Building2,
  User,
  MessageSquare,
  RefreshCw,
  AlertTriangle,
  Filter
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

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

// Configuration des statuts
const STATUT_CONFIG = {
  NOUVELLE: { label: 'Nouvelle', color: 'text-amber-700', bg: 'bg-amber-100', border: 'border-amber-300' },
  EN_CONTACT: { label: 'En contact', color: 'text-blue-700', bg: 'bg-blue-100', border: 'border-blue-300' },
  APPROUVEE: { label: 'Approuvée', color: 'text-green-700', bg: 'bg-green-100', border: 'border-green-300' },
  REJETEE: { label: 'Rejetée', color: 'text-red-700', bg: 'bg-red-100', border: 'border-red-300' },
  CONVERTIE: { label: 'Convertie', color: 'text-purple-700', bg: 'bg-purple-100', border: 'border-purple-300' }
}

// Filtres disponibles
const FILTRES_STATUT = [
  { value: '', label: 'Tous les statuts' },
  { value: 'NOUVELLE', label: 'Nouvelles' },
  { value: 'EN_CONTACT', label: 'En contact' },
  { value: 'APPROUVEE', label: 'Approuvées' },
  { value: 'REJETEE', label: 'Rejetées' },
  { value: 'CONVERTIE', label: 'Converties' }
]

export default function DemandesPage() {
  const [demandes, setDemandes] = useState<SubscriptionRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [statutFilter, setStatutFilter] = useState<string>('')
  const [selectedDemande, setSelectedDemande] = useState<SubscriptionRequest | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [notes, setNotes] = useState('')
  const [actionLoading, setActionLoading] = useState(false)

  // Fonction de chargement des données
  const loadDemandes = useCallback(async (search?: string, statut?: string) => {
    try {
      setLoading(true)
      setError(null)
      
      const params = new URLSearchParams()
      params.append('limit', '50')
      if (search) params.append('search', search)
      if (statut) params.append('statut', statut)
      
      const response = await fetch(`/api/admin/demandes?${params.toString()}`)
      
      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`)
      }
      
      const data = await response.json()
      setDemandes(data.data || [])
    } catch (err) {
      console.error('Erreur chargement demandes:', err)
      setError('Impossible de charger les demandes. Veuillez réessayer.')
    } finally {
      setLoading(false)
    }
  }, [])

  // Chargement initial + lors du changement de filtre
  useEffect(() => {
    // Petit délai pour éviter les problèmes de hydration
    const timer = setTimeout(() => {
      loadDemandes(searchTerm || undefined, statutFilter || undefined)
    }, 100)
    
    return () => clearTimeout(timer)
  }, [loadDemandes, searchTerm, statutFilter])

  // Mise à jour du statut
  const handleUpdateStatut = async (demandeId: string, nouveauStatut: RequestStatus) => {
    if (actionLoading) return
    
    try {
      setActionLoading(true)
      
      const response = await fetch(`/api/admin/demandes/${demandeId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          statut: nouveauStatut,
          notes_admin: notes || undefined 
        })
      })
      
      if (response.ok) {
        // Recharger la liste
        await loadDemandes(searchTerm || undefined, statutFilter || undefined)
        setDialogOpen(false)
        setSelectedDemande(null)
        setNotes('')
      } else {
        console.error('Erreur mise à jour statut')
      }
    } catch (err) {
      console.error('Erreur update statut:', err)
    } finally {
      setActionLoading(false)
    }
  }

  // Ouvrir le dialog de détail
  const openDetailDialog = (demande: SubscriptionRequest) => {
    setSelectedDemande(demande)
    setNotes(demande.notes_admin || '')
    setDialogOpen(true)
  }

  // Formatage de date
  const formatDate = (dateStr: string): string => {
    try {
      return new Date(dateStr).toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      })
    } catch {
      return '-'
    }
  }

  // Calcul des statistiques
  const stats = {
    total: demandes.length,
    nouvelles: demandes.filter(d => d.statut === 'NOUVELLE').length,
    enContact: demandes.filter(d => d.statut === 'EN_CONTACT').length,
    approuvees: demandes.filter(d => d.statut === 'APPROUVEE').length,
    rejetees: demandes.filter(d => d.statut === 'REJETEE').length
  }

  // Rendu du badge de statut
  const renderStatutBadge = (statut: RequestStatus) => {
    const config = STATUT_CONFIG[statut]
    if (!config) return <Badge variant="outline">{statut}</Badge>
    
    return (
      <Badge 
        variant="outline" 
        className={`${config.bg} ${config.color} ${config.border} text-xs font-medium`}
      >
        {config.label}
      </Badge>
    )
  }

  // Gestionnaire de recherche avec debounce simple
  const handleSearchChange = (value: string) => {
    setSearchTerm(value)
  }

  return (
    <div className="space-y-6 p-4 lg:p-6 min-h-screen">
      {/* En-tête de la page */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Demandes d&apos;abonnement
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Gérez les demandes d&apos;inscription des organisations
          </p>
        </div>
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => loadDemandes(searchTerm || undefined, statutFilter || undefined)}
          disabled={loading}
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Actualiser
        </Button>
      </div>

      {/* Cartes de statistiques */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <Card>
          <CardContent className="p-4 flex flex-col items-center">
            <span className="text-2xl font-bold text-slate-900">{stats.total}</span>
            <span className="text-xs text-slate-500">Total</span>
          </CardContent>
        </Card>
        
        <Card className="border-amber-200 bg-amber-50/30">
          <CardContent className="p-4 flex items-center gap-3">
            <Clock className="w-5 h-5 text-amber-600" />
            <div>
              <span className="text-lg font-bold text-amber-700">{stats.nouvelles}</span>
              <span className="block text-xs text-amber-600">Nouvelles</span>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-blue-200 bg-blue-50/30">
          <CardContent className="p-4 flex items-center gap-3">
            <Phone className="w-5 h-5 text-blue-600" />
            <div>
              <span className="text-lg font-bold text-blue-700">{stats.enContact}</span>
              <span className="block text-xs text-blue-600">En contact</span>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-green-200 bg-green-50/30">
          <CardContent className="p-4 flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <div>
              <span className="text-lg font-bold text-green-700">{stats.approuvees}</span>
              <span className="block text-xs text-green-600">Approuvées</span>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-red-200 bg-red-50/30">
          <CardContent className="p-4 flex items-center gap-3">
            <XCircle className="w-5 h-5 text-red-600" />
            <div>
              <span className="text-lg font-bold text-red-700">{stats.rejetees}</span>
              <span className="block text-xs text-red-600">Rejetées</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtres */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Recherche */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              <Input
                placeholder="Rechercher par nom, email ou organisation..."
                value={searchTerm}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="pl-10"
              />
            </div>
            
            {/* Filtre par statut - Boutons simples au lieu de Select */}
            <div className="flex gap-2 overflow-x-auto pb-1">
              {FILTRES_STATUT.map((filtre) => (
                <Button
                  key={filtre.value}
                  variant={statutFilter === filtre.value ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setStatutFilter(filtre.value)}
                  className={`whitespace-nowrap text-xs ${
                    statutFilter === filtre.value 
                      ? 'bg-[#009E60] hover:bg-[#007a4c]' 
                      : ''
                  }`}
                >
                  <Filter className="w-3 h-3 mr-1" />
                  {filtre.label}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Message d'erreur */}
      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-4 flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0" />
            <p className="text-red-700 text-sm flex-1">{error}</p>
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => loadDemandes(searchTerm || undefined, statutFilter || undefined)}
            >
              Réessayer
            </Button>
          </CardContent>
        </Card>
      )}

      {/* État de chargement */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="animate-pulse space-y-3">
                  <div className="h-4 bg-slate-200 rounded w-1/3"></div>
                  <div className="h-3 bg-slate-200 rounded w-1/2"></div>
                  <div className="h-16 bg-slate-100 rounded"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : demandes.length === 0 ? (
        /* État vide */
        <Card>
          <CardContent className="p-12 text-center">
            <MessageSquare className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-700 mb-2">
              Aucune demande trouvée
            </h3>
            <p className="text-slate-500 text-sm max-w-md mx-auto">
              {searchTerm || statutFilter 
                ? 'Aucune demande ne correspond à vos critères de recherche.'
                : 'Les nouvelles demandes d\'abonnement apparaîtront ici.'
              }
            </p>
            {(searchTerm || statutFilter) && (
              <Button 
                variant="outline" 
                size="sm" 
                className="mt-4"
                onClick={() => {
                  setSearchTerm('')
                  setStatutFilter('')
                }}
              >
                Effacer les filtres
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        /* Liste des demandes */
        <div className="space-y-3">
          {demandes.map((demande) => {
            const config = STATUT_CONFIG[demande.statut]
            const isNouvelle = demande.statut === 'NOUVELLE'
            
            return (
              <Card 
                key={demande.id} 
                className={`hover:shadow-md transition-all duration-200 ${
                  isNouvelle ? 'border-l-4 border-l-amber-500' : ''
                }`}
              >
                <CardContent className="p-4 md:p-6">
                  <div className="flex flex-col lg:flex-row lg:items-start gap-4">
                    
                    {/* Informations principales */}
                    <div className="flex-1 min-w-0 space-y-3">
                      {/* En-tête de la carte */}
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-semibold text-slate-900 truncate">
                          {demande.nom_complet}
                        </h3>
                        {renderStatutBadge(demande.statut)}
                        <Badge 
                          variant="outline" 
                          className={
                            demande.type_org === 'DR' 
                              ? 'border-blue-200 text-blue-700 bg-blue-50/50' 
                              : 'border-purple-200 text-purple-700 bg-purple-50/50'
                          }
                        >
                          {demande.type_org === 'DR' ? 'Direction Régionale' : 'Direction Départementale'}
                        </Badge>
                      </div>

                      {/* Détails de contact */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-2 text-sm">
                        <div className="flex items-center gap-2 text-slate-600">
                          <Mail className="w-4 h-4 text-slate-400 flex-shrink-0" />
                          <span className="truncate">{demande.email}</span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-600">
                          <Phone className="w-4 h-4 text-slate-400 flex-shrink-0" />
                          <span>{demande.telephone}</span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-600">
                          <Building2 className="w-4 h-4 text-slate-400 flex-shrink-0" />
                          <span className="truncate">{demande.nom_organisation}</span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-600">
                          <MapPin className="w-4 h-4 text-slate-400 flex-shrink-0" />
                          <span>{demande.region}</span>
                        </div>
                      </div>

                      {/* Message si présent */}
                      {demande.message && (
                        <div className="mt-2 p-3 bg-slate-50 rounded-lg border border-slate-100">
                          <p className="text-sm text-slate-600 italic line-clamp-2">
                            &ldquo;{demande.message}&rdquo;
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-between lg:flex-col lg:items-end gap-3 lg:border-l lg:pl-4 lg:border-slate-100">
                      <span className="text-xs text-slate-400 whitespace-nowrap">
                        {formatDate(demande.created_at)}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openDetailDialog(demande)}
                        className="whitespace-nowrap"
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        Détails & Actions
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}

      {/* Dialog de détail et d'actions */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          {selectedDemande && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-start gap-3">
                  <div className="p-2 rounded-full bg-[#F77F00]/10">
                    <User className="w-5 h-5 text-[#F77F00]" />
                  </div>
                  <div className="flex-1">
                    <span className="text-lg font-semibold">
                      Demande de {selectedDemande.nom_complet}
                    </span>
                    <div className="flex flex-wrap items-center gap-2 mt-2">
                      {renderStatutBadge(selectedDemande.statut)}
                      <span className="text-sm text-slate-500">
                        Reçue le {formatDate(selectedDemande.created_at)}
                      </span>
                    </div>
                  </div>
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-5 mt-2">
                
                {/* Informations personnelles */}
                <Card>
                  <CardHeader className="pb-3 pt-4 px-4">
                    <CardTitle className="text-base font-medium text-slate-800">
                      Informations personnelles
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="px-4 pb-4 space-y-3">
                    <InfoRow label="Nom complet" value={selectedDemande.nom_complet} />
                    <InfoRow label="Fonction" value={selectedDemande.fonction || 'Non renseigné'} />
                    <InfoRow label="Email" value={selectedDemande.email} />
                    <InfoRow label="Téléphone" value={selectedDemande.telephone} />
                    {selectedDemande.whatsapp && (
                      <InfoRow label="WhatsApp" value={selectedDemande.whatsapp} />
                    )}
                  </CardContent>
                </Card>

                {/* Organisation */}
                <Card>
                  <CardHeader className="pb-3 pt-4 px-4">
                    <CardTitle className="text-base font-medium text-slate-800">
                      Organisation
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="px-4 pb-4 space-y-3">
                    <InfoRow label="Organisation" value={selectedDemande.nom_organisation} />
                    <InfoRow 
                      label="Type" 
                      value={
                        <Badge variant="outline" className={
                          selectedDemande.type_org === 'DR' 
                            ? 'border-blue-200 text-blue-700' 
                            : 'border-purple-200 text-purple-700'
                        }>
                          {selectedDemande.type_org === 'DR' ? 'Direction Régionale' : 'Direction Départementale'}
                        </Badge>
                      } 
                    />
                    <InfoRow label="Région" value={selectedDemande.region} />
                    {selectedDemande.departement && (
                      <InfoRow label="Département" value={selectedDemande.departement} />
                    )}
                    {selectedDemande.nb_collaborateurs && (
                      <InfoRow label="Collaborateurs" value={`${selectedDemande.nb_collaborateurs} personnes`} />
                    )}
                  </CardContent>
                </Card>

                {/* Message */}
                {selectedDemande.message && (
                  <Card>
                    <CardHeader className="pb-3 pt-4 px-4">
                      <CardTitle className="text-base font-medium text-slate-800">
                        Message
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="px-4 pb-4">
                      <p className="text-sm text-slate-700 whitespace-pre-wrap bg-slate-50 p-3 rounded-lg">
                        {selectedDemande.message}
                      </p>
                    </CardContent>
                  </Card>
                )}

                {/* Notes administrateur */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">
                    Notes internes (optionnel)
                  </label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Ajoutez des notes internes sur cette demande..."
                    rows={3}
                    className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#009E60]/50 focus-visible:border-[#009E60] disabled:cursor-not-allowed disabled:opacity-50 resize-none"
                  />
                </div>

                {/* Actions rapides */}
                <div className="pt-4 border-t border-slate-200">
                  <p className="text-sm font-medium text-slate-700 mb-3">Actions rapides</p>
                  
                  {selectedDemande.statut === 'NOUVELLE' && (
                    <div className="flex flex-wrap gap-2">
                      <Button
                        variant="outline"
                        onClick={() => handleUpdateStatut(selectedDemande.id, 'EN_CONTACT')}
                        disabled={actionLoading}
                      >
                        <Phone className="w-4 h-4 mr-1" />
                        Marquer en contact
                      </Button>
                      <Button
                        onClick={() => handleUpdateStatut(selectedDemande.id, 'APPROUVEE')}
                        disabled={actionLoading}
                        className="bg-green-600 hover:bg-green-700 text-white"
                      >
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Approuver
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={() => handleUpdateStatut(selectedDemande.id, 'REJETEE')}
                        disabled={actionLoading}
                      >
                        <XCircle className="w-4 h-4 mr-1" />
                        Rejeter
                      </Button>
                    </div>
                  )}

                  {(selectedDemande.statut === 'EN_CONTACT' || selectedDemande.statut === 'APPROUVEE') && (
                    <div className="flex flex-wrap gap-2">
                      <Button
                        onClick={() => handleUpdateStatut(selectedDemande.id, 'CONVERTIE')}
                        disabled={actionLoading}
                        className="bg-[#F77F00] hover:bg-[#e67300] text-white"
                      >
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Convertir en client
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={() => handleUpdateStatut(selectedDemande.id, 'REJETEE')}
                        disabled={actionLoading}
                      >
                        <XCircle className="w-4 h-4 mr-1" />
                        Rejeter
                      </Button>
                    </div>
                  )}

                  {(selectedDemande.statut === 'REJETEE' || selectedDemande.statut === 'CONVERTIE') && (
                    <p className="text-sm text-slate-500 italic">
                      Cette demande est {selectedDemande.statut === 'CONVERTIE' ? 'convertie en client' : 'rejetée'}.
                      Aucune action supplémentaire requise.
                    </p>
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

// Composant utilitaire pour afficher une ligne d'information
function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-2 text-sm">
      <span className="text-slate-500 font-medium min-w-[120px] sm:min-w-[140px]">
        {label}:
      </span>
      <span className="text-slate-900">{value}</span>
    </div>
  )
}
