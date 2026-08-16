'use client'

import React, { useState, useEffect } from 'react'
import { 
  Building2, 
  Users, 
  MapPin,
  Phone,
  Mail,
  Eye,
  Power,
  PowerOff,
  RefreshCw,
  Calendar,
  AlertTriangle,
  Grid3X3,
  List,
  Search
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
import { Avatar, AvatarFallback } from '@/components/ui/avatar'

// Types simplifiés
interface Organization {
  id: string
  created_at: string
  nom: string
  type_org: 'DR' | 'DD'
  region: string
  departement?: string
  telephone?: string
  email?: string
  actif: boolean
  members_count?: number
}

export default function OrganisationsPage() {
  const [organizations, setOrganizations] = useState<Organization[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [selectedOrg, setSelectedOrg] = useState<Organization | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)

  // Fetch organisations
  useEffect(() => {
    async function load() {
      try {
        setLoading(true)
        setError(null)
        const res = await fetch('/api/admin/organisations?limit=50')
        if (!res.ok) throw new Error('Erreur HTTP: ' + res.status)
        const json = await res.json()
        setOrganizations(json.data || [])
      } catch (e) {
        console.error('Erreur chargement:', e)
        setError('Impossible de charger les données')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  // Toggle statut
  const toggleStatus = async (orgId: string, currentStatus: boolean) => {
    try {
      const res = await fetch(`/api/admin/organisations/${orgId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ toggleStatus: true })
      })
      if (res.ok) {
        // Recharger la liste
        const res2 = await fetch('/api/admin/organisations?limit=50')
        if (res2.ok) {
          const json = await res2.json()
          setOrganizations(json.data || [])
        }
      }
    } catch (e) {
      console.error('Erreur toggle:', e)
    }
  }

  // Format date simple
  const fmtDate = (d: string) => {
    try { return new Date(d).toLocaleDateString('fr-FR') }
    catch { return '-' }
  }

  // Stats
  const stats = {
    total: organizations.length,
    actives: organizations.filter(o => o.actif).length,
    dr: organizations.filter(o => o.type_org === 'DR').length,
    dd: organizations.filter(o => o.type_org === 'DD').length
  }

  return (
    <div className="space-y-6 p-4 lg:p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Organisations</h1>
          <p className="text-slate-500 text-sm mt-1">Gérez les Directions Régionales et Départementales</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => window.location.reload()}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Actualiser
          </Button>
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

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card><CardContent className="p-4 flex items-center gap-3">
          <Building2 className="w-5 h-5 text-blue-600" />
          <div><p className="text-xl font-bold">{stats.total}</p><p className="text-xs text-slate-500">Total</p></div>
        </CardContent></Card>
        <Card><CardContent className="p-4 flex items-center gap-3">
          <Power className="w-5 h-5 text-green-600" />
          <div><p className="text-xl font-bold">{stats.actives}</p><p className="text-xs text-slate-500">Actives</p></div>
        </CardContent></Card>
        <Card><CardContent className="p-4 flex items-center gap-3">
          <Building2 className="w-5 h-5 text-orange-600" />
          <div><p className="text-xl font-bold">{stats.dr}</p><p className="text-xs text-slate-500">DR</p></div>
        </CardContent></Card>
        <Card><CardContent className="p-4 flex items-center gap-3">
          <Building2 className="w-5 h-5 text-purple-600" />
          <div><p className="text-xl font-bold">{stats.dd}</p><p className="text-xs text-slate-500">DD</p></div>
        </CardContent></Card>
      </div>

      {/* Error */}
      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-4 flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-red-500" />
            <span className="text-red-700 text-sm">{error}</span>
            <Button size="sm" variant="outline" onClick={() => window.location.reload()} className="ml-auto">
              Réessayer
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Loading */}
      {loading ? (
        <div className="space-y-3">
          {[1,2,3,4,5,6].map(i => (
            <Card key={i}><CardContent className="p-4 h-24 bg-slate-100 animate-pulse rounded-lg" /></Card>
          ))}
        </div>
      ) : organizations.length === 0 ? (
        /* Empty */
        <Card>
          <CardContent className="p-12 text-center">
            <Building2 className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="font-semibold text-slate-700">Aucune organisation</h3>
            <p className="text-sm text-slate-500 mt-1">Les organisations apparaîtront ici</p>
          </CardContent>
        </Card>
      ) : viewMode === 'grid' ? (
        /* Grid View */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {organizations.map(org => (
            <Card key={org.id} className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => { setSelectedOrg(org); setDialogOpen(true) }}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className={org.type_org === 'DR' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'}>
                        {org.nom.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-base line-clamp-1">{org.nom}</CardTitle>
                      <div className="flex gap-2 mt-1">
                        <Badge variant="outline" className={`text-xs ${org.type_org === 'DR' ? 'border-blue-200 text-blue-700' : 'border-purple-200 text-purple-700'}`}>
                          {org.type_org}
                        </Badge>
                        <Badge variant="outline" className={`text-xs ${org.actif ? 'border-green-200 text-green-700 bg-green-50' : 'border-red-200 text-red-700 bg-red-50'}`}>
                          {org.actif ? 'Actif' : 'Inactif'}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-2 pt-0">
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <MapPin className="w-4 h-4" />
                  <span className="truncate">{[org.departement, org.region].filter(Boolean).join(', ') || '-'}</span>
                </div>
                {org.email && (
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Mail className="w-4 h-4" />
                    <span className="truncate">{org.email}</span>
                  </div>
                )}
                <div className="flex justify-between items-center pt-2 text-xs text-slate-400">
                  <span>{org.members_count || 0} membres</span>
                  <span>{fmtDate(org.created_at)}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        /* List View */
        <Card>
          <CardContent className="p-0">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-slate-50">
                  <th className="text-left p-3 text-sm font-semibold text-slate-700">Organisation</th>
                  <th className="text-left p-3 text-sm font-semibold text-slate-700 hidden sm:table-cell">Type</th>
                  <th className="text-left p-3 text-sm font-semibold text-slate-700 hidden md:table-cell">Région</th>
                  <th className="text-left p-3 text-sm font-semibold text-slate-700 hidden lg:table-cell">Membres</th>
                  <th className="text-left p-3 text-sm font-semibold text-slate-700">Statut</th>
                  <th className="text-right p-3 text-sm font-semibold text-slate-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {organizations.map(org => (
                  <tr key={org.id} className="border-b hover:bg-slate-50">
                    <td className="p-3">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className={`text-xs ${org.type_org === 'DR' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'}`}>
                            {org.nom.slice(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-medium truncate max-w-[150px]">{org.nom}</span>
                      </div>
                    </td>
                    <td className="p-3 hidden sm:table-cell">
                      <Badge variant="outline" className={org.type_org === 'DR' ? 'border-blue-200 text-blue-700' : 'border-purple-200 text-purple-700'}>
                        {org.type_org}
                      </Badge>
                    </td>
                    <td className="p-3 text-sm text-slate-600 hidden md:table-cell">{org.region}</td>
                    <td className="p-3 text-sm text-slate-600 hidden lg:table-cell">{org.members_count || 0}</td>
                    <td className="p-3">
                      <Badge variant="outline" className={org.actif ? 'border-green-200 text-green-700 bg-green-50' : 'border-red-200 text-red-700 bg-red-50'}>
                        {org.actif ? 'Actif' : 'Inactif'}
                      </Badge>
                    </td>
                    <td className="p-3 text-right">
                      <div className="flex justify-end gap-1">
                        <Button variant="ghost" size="sm" onClick={() => { setSelectedOrg(org); setDialogOpen(true) }}>
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => toggleStatus(org.id, org.actif)}
                        >
                          {org.actif ? <PowerOff className="w-4 h-4 text-red-600" /> : <Power className="w-4 h-4 text-green-600" />}
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

      {/* Dialog détail */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg">
          {selectedOrg && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className={selectedOrg.type_org === 'DR' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'}>
                      {selectedOrg.nom.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <span className="font-semibold">{selectedOrg.nom}</span>
                    <div className="flex gap-2 mt-1">
                      <Badge>{selectedOrg.type_org}</Badge>
                      <Badge variant="outline" className={selectedOrg.actif ? 'border-green-200 text-green-700' : 'border-red-200 text-red-700'}>
                        {selectedOrg.actif ? 'Actif' : 'Inactif'}
                      </Badge>
                    </div>
                  </div>
                </DialogTitle>
              </DialogHeader>
              
              <div className="space-y-4 mt-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2"><MapPin className="w-4 h-4 text-slate-400" /><span className="text-slate-600">{[selectedOrg.departement, selectedOrg.region].filter(Boolean).join(', ') || '-'}</span></div>
                  <div className="flex items-center gap-2"><Mail className="w-4 h-4 text-slate-400" /><span className="text-slate-600">{selectedOrg.email || '-'}</span></div>
                  <div className="flex items-center gap-2"><Phone className="w-4 h-4 text-slate-400" /><span className="text-slate-600">{selectedOrg.telephone || '-'}</span></div>
                  <div className="flex items-center gap-2"><Calendar className="w-4 h-4 text-slate-400" /><span className="text-slate-600">{fmtDate(selectedOrg.created_at)}</span></div>
                </div>
                
                <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-lg">
                  <Users className="w-4 h-4 text-slate-400" />
                  <span className="text-sm text-slate-600">{selectedOrg.members_count || 0} membre(s)</span>
                </div>

                <div className="flex gap-2 pt-4 border-t">
                  <Button 
                    onClick={() => toggleStatus(selectedOrg.id, selectedOrg.actif)}
                    variant={selectedOrg.actif ? 'destructive' : 'default'}
                    className={selectedOrg.actif ? '' : 'bg-green-600 hover:bg-green-700'}
                  >
                    {selectedOrg.actif ? <><PowerOff className="w-4 h-4 mr-2" /> Suspendre</> : <><Power className="w-4 h-4 mr-2" /> Réactiver</>}
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
