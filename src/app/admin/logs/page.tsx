'use client'

import React, { useState } from 'react'
import { 
  Search,
  Filter,
  RefreshCw,
  Clock,
  Users,
  Key,
  Shield,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Settings,
  Database,
  Mail,
  UserPlus,
  Download,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal
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

// Types pour les logs système
interface SystemLog {
  id: string
  timestamp: string
  type: 'connexion' | 'code' | 'demande' | 'admin' | 'system' | 'erreur' | 'securite'
  action: string
  description: string
  user?: string
  ipAddress?: string
  status: 'success' | 'warning' | 'error' | 'info'
}

// Configuration des types de log
const logTypeConfig = {
  connexion: { 
    icon: Users, 
    label: 'Connexion', 
    colorClass: 'bg-blue-100 text-blue-600 border-blue-200',
    badgeClass: 'bg-blue-50 text-blue-700 border-blue-200'
  },
  code: { 
    icon: Key, 
    label: 'Code', 
    colorClass: 'bg-cyan-100 text-cyan-600 border-cyan-200',
    badgeClass: 'bg-cyan-50 text-cyan-700 border-cyan-200'
  },
  demande: { 
    icon: Mail, 
    label: 'Demande', 
    colorClass: 'bg-orange-100 text-orange-600 border-orange-200',
    badgeClass: 'bg-orange-50 text-orange-700 border-orange-200'
  },
  admin: { 
    icon: Shield, 
    label: 'Admin', 
    colorClass: 'bg-purple-100 text-purple-600 border-purple-200',
    badgeClass: 'bg-purple-50 text-purple-700 border-purple-200'
  },
  system: { 
    icon: Settings, 
    label: 'Système', 
    colorClass: 'bg-slate-100 text-slate-600 border-slate-200',
    badgeClass: 'bg-slate-50 text-slate-700 border-slate-200'
  },
  erreur: { 
    icon: XCircle, 
    label: 'Erreur', 
    colorClass: 'bg-red-100 text-red-600 border-red-200',
    badgeClass: 'bg-red-50 text-red-700 border-red-200'
  },
  securite: { 
    icon: Shield, 
    label: 'Sécurité', 
    colorClass: 'bg-red-100 text-red-700 border-red-300',
    badgeClass: 'bg-red-50 text-red-800 border-red-200'
  },
}

const statusConfig = {
  success: { 
    icon: CheckCircle2, 
    label: 'Succès', 
    dotClass: 'bg-emerald-500',
    textClass: 'text-emerald-600' 
  },
  warning: { 
    icon: AlertTriangle, 
    label: 'Attention', 
    dotClass: 'bg-amber-500',
    textClass: 'text-amber-600' 
  },
  error: { 
    icon: XCircle, 
    label: 'Erreur', 
    dotClass: 'bg-red-500',
    textClass: 'text-red-600' 
  },
  info: { 
    icon: Clock, 
    label: 'Info', 
    dotClass: 'bg-blue-500',
    textClass: 'text-blue-600' 
  },
}

// Données mock pour les logs
const mockLogs: SystemLog[] = [
  {
    id: '1',
    timestamp: '2025-02-15T10:32:15',
    type: 'connexion',
    action: 'Connexion réussie',
    description: 'Utilisateur connecté depuis Abidjan',
    user: 'admin@eos-ci.org',
    ipAddress: '196.xxx.xxx.xxx',
    status: 'success',
  },
  {
    id: '2',
    timestamp: '2025-02-15T09:45:30',
    type: 'code',
    action: 'Code généré',
    description: "Code d'activation PRO créé",
    user: 'Super Admin',
    status: 'success',
  },
  {
    id: '3',
    timestamp: '2025-02-15T08:20:45',
    type: 'demande',
    action: 'Nouvelle demande reçue',
    description: "Demande d'abonnement soumise",
    user: null,
    status: 'info',
  },
  {
    id: '4',
    timestamp: '2025-02-14T17:35:22',
    type: 'code',
    action: 'Code activé',
    description: "Code ESSENTIEL-789 activé par une organisation",
    user: null,
    status: 'success',
  },
  {
    id: '5',
    timestamp: '2025-02-14T16:18:10',
    type: 'connexion',
    action: 'Échec de connexion',
    description: '3 tentatives échouées - compte verrouillé temporairement',
    user: 'inconnu@xxx.com',
    ipAddress: '41.xxx.xxx.xxx',
    status: 'warning',
  },
  {
    id: '6',
    timestamp: '2025-02-14T14:12:33',
    type: 'admin',
    action: 'Plan modifié',
    description: 'Tarif plan INSTITUTIONNEL mis à jour (50 000 → 55 000 FCFA)',
    user: 'Super Admin',
    status: 'success',
  },
  {
    id: '7',
    timestamp: '2025-02-13T11:45:00',
    type: 'demande',
    action: 'Demande approuvée',
    description: "Abonnement approuvé pour une organisation",
    user: 'Super Admin',
    status: 'success',
  },
  {
    id: '8',
    timestamp: '2025-02-13T10:05:18',
    type: 'system',
    action: 'Sauvegarde automatique',
    description: 'Sauvegarde de la base de données terminée (2.3 Go)',
    user: null,
    status: 'success',
  },
  {
    id: '9',
    timestamp: '2025-02-12T23:59:00',
    type: 'system',
    action: 'Rapport quotidien généré',
    description: 'Rapport statistiques du 12/02 envoyé',
    user: null,
    status: 'success',
  },
  {
    id: '10',
    timestamp: '2025-02-12T15:30:45',
    type: 'securite',
    action: 'Tentative d\'accès bloquée',
    description: 'IP suspecte bloquée après 5 échecs',
    ipAddress: '197.xxx.xxx.xxx',
    status: 'error',
  },
  {
    id: '11',
    timestamp: '2025-02-12T09:15:22',
    type: 'connexion',
    action: 'Nouvel utilisateur inscrit',
    description: 'Compte créé avec email vérifié',
    user: 'nouveau.user@email.ci',
    status: 'success',
  },
  {
    id: '12',
    timestamp: '2025-02-11T18:42:10',
    type: 'erreur',
    action: 'Erreur API détectée',
    description: 'Timeout sur endpoint /api/activities (résolu automatiquement)',
    user: null,
    status: 'warning',
  },
  {
    id: '13',
    timestamp: '2025-02-11T14:28:55',
    type: 'admin',
    action: 'Code révoqué',
    description: 'Code EXPIRE-123 révoqué manuellement',
    user: 'Super Admin',
    status: 'success',
  },
  {
    id: '14',
    timestamp: '2025-02-10T11:10:00',
    type: 'system',
    action: 'Mise à jour système',
    description: 'Mise à jour v2.4.0 → v2.4.1 appliquée',
    user: null,
    status: 'success',
  },
  {
    id: '15',
    timestamp: '2025-02-09T08:00:00',
    type: 'system',
    action: 'Nettoyage automatique',
    description: 'Sessions expirées purgées (127 sessions)',
    user: null,
    status: 'info',
  },
]

export default function LogsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [typeFilter, setTypeFilter] = useState<string>('all')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  // Filtrer les logs
  const filteredLogs = mockLogs.filter(log => {
    const matchesSearch = searchQuery === '' || 
      log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (log.user && log.user.toLowerCase().includes(searchQuery.toLowerCase()))
    
    const matchesType = typeFilter === 'all' || log.type === typeFilter
    const matchesStatus = statusFilter === 'all' || log.status === statusFilter
    
    return matchesSearch && matchesType && matchesStatus
  })

  // Pagination
  const totalPages = Math.ceil(filteredLogs.length / itemsPerPage)
  const paginatedLogs = filteredLogs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  // Format date relative
  const formatRelativeTime = (dateStr: string) => {
    const date = new Date(dateStr)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
    
    if (diffMinutes < 1) return 'À l\'instant'
    if (diffMinutes < 60) return `Il y a ${diffMinutes}min`
    if (diffHours < 24) return `Il y a ${diffHours}h`
    if (diffDays < 7) return `Il y a ${diffDays}j`
    
    return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })
  }
  
  // Calculate diff in minutes for display
  const diffMinutes = Math.floor((Date.now() - new Date(mockLogs[0].timestamp).getTime()) / (1000 * 60))

  // Format full date
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    })
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl lg:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
            <Clock className="w-7 h-7 text-[#F77F00]" />
            Journal d&apos;activité
          </h1>
          <p className="text-slate-500 text-sm">
            Historique complet des actions et événements système
          </p>
        </div>
        <Button variant="outline" className="gap-2">
          <Download className="w-4 h-4" />
          Exporter les logs
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-slate-200/80">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 rounded-xl bg-blue-100 text-blue-600">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">1,247</p>
              <p className="text-xs text-slate-500">Connexions ce mois</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200/80">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 rounded-xl bg-emerald-100 text-emerald-600">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">98.2%</p>
              <p className="text-xs text-slate-500">Opérations réussies</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200/80">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 rounded-xl bg-orange-100 text-orange-600">
              <Key className="w-6 h-6" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">{mockLogs.filter(l => l.type === 'code').length}</p>
              <p className="text-xs text-slate-500">Codes générés</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200/80">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 rounded-xl bg-red-100 text-red-600">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">{mockLogs.filter(l => l.status === 'error').length}</p>
              <p className="text-xs text-slate-500">Alertes ce mois</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="border-slate-200/80">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                placeholder="Rechercher dans les logs..."
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1) }}
                className="pl-10"
              />
            </div>
            
            <Select value={typeFilter} onValueChange={(v) => { setTypeFilter(v); setCurrentPage(1) }}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Type d'événement" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les types</SelectItem>
                <SelectItem value="connexion">Connexions</SelectItem>
                <SelectItem value="code">Codes</SelectItem>
                <SelectItem value="demande">Demandes</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="system">Système</SelectItem>
                <SelectItem value="erreur">Erreurs</SelectItem>
                <SelectItem value="securité">Sécurité</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setCurrentPage(1) }}>
              <SelectTrigger className="w-full sm:w-[160px]">
                <SelectValue placeholder="Statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les statuts</SelectItem>
                <SelectItem value="success">Succès</SelectItem>
                <SelectItem value="warning">Attention</SelectItem>
                <SelectItem value="error">Erreur</SelectItem>
                <SelectItem value="info">Info</SelectItem>
              </SelectContent>
            </Select>
            
            <Button variant="outline" onClick={() => {
              setSearchQuery('')
              setTypeFilter('all')
              setStatusFilter('all')
            }} className="gap-2">
              <RefreshCw className="w-4 h-4" />
              Réinitialiser
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Logs Table */}
      <Card className="border-slate-200/80">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base font-semibold text-slate-900 flex items-center gap-2">
                <Database className="w-5 h-5 text-[#009E60]" />
                Événements système
              </CardTitle>
              <CardDescription>
                {filteredLogs.length} événement(s) trouvé(s)
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {paginatedLogs.length > 0 ? (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50/50">
                      <th className="text-left text-xs font-semibold text-slate-500 uppercase px-6 py-3 w-40">Date & Heure</th>
                      <th className="text-left text-xs font-semibold text-slate-500 uppercase px-6 py-3 w-28">Type</th>
                      <th className="text-left text-xs font-semibold text-slate-500 uppercase px-6 py-3">Action</th>
                      <th className="text-left text-xs font-semibold text-slate-500 uppercase px-6 py-3 hidden lg:table-cell">Description</th>
                      <th className="text-left text-xs font-semibold text-slate-500 uppercase px-6 py-3 hidden xl:table-cell">Utilisateur</th>
                      <th className="text-left text-xs font-semibold text-slate-500 uppercase px-6 py-3 w-24">Statut</th>
                      <th className="text-right text-xs font-semibold text-slate-500 uppercase px-6 py-3 w-16"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedLogs.map((log) => {
                      const typeConfig = logTypeConfig[log.type]
                      const statusCfg = statusConfig[log.status]
                      const TypeIcon = typeConfig.icon
                      const StatusIcon = statusCfg.icon
                      
                      return (
                        <tr key={log.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors group">
                          <td className="px-6 py-4">
                            <div className="flex flex-col">
                              <span className="text-sm text-slate-900 font-medium">
                                {new Date(log.timestamp).toLocaleDateString('fr-FR', { 
                                  day: 'numeric', 
                                  month: 'short',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </span>
                              <span className="text-xs text-slate-400">
                                {formatRelativeTime(log.timestamp)}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <Badge variant="outline" className={`gap-1.5 ${typeConfig.badgeClass}`}>
                              <TypeIcon className="w-3 h-3" />
                              {typeConfig.label}
                            </Badge>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-sm font-medium text-slate-800 group-hover:text-[#F77F00] transition-colors">
                              {log.action}
                            </span>
                          </td>
                          <td className="px-6 py-4 hidden lg:table-cell">
                            <span className="text-sm text-slate-600 truncate max-w-[250px] block">
                              {log.description}
                            </span>
                          </td>
                          <td className="px-6 py-4 hidden xl:table-cell">
                            {log.user ? (
                              <span className="text-sm text-slate-600 font-mono bg-slate-100 px-2 py-0.5 rounded">
                                {log.user}
                              </span>
                            ) : log.ipAddress ? (
                              <span className="text-sm text-slate-400 font-mono">
                                {log.ipAddress}
                              </span>
                            ) : (
                              <span className="text-sm text-slate-400">—</span>
                            )}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-1.5">
                              <div className={`w-2 h-2 rounded-full ${statusCfg.dotClass}`} />
                              <StatusIcon className={`w-3.5 h-3.5 ${statusCfg.textClass}`} />
                            </div>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
                              <MoreHorizontal className="w-4 h-4 text-slate-400" />
                            </Button>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
              
              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100">
                  <p className="text-sm text-slate-500">
                    Affichage {(currentPage - 1) * itemsPerPage + 1}-{Math.min(currentPage * itemsPerPage, filteredLogs.length)} sur {filteredLogs.length}
                  </p>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </Button>
                    
                    {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
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
                          variant={currentPage === pageNum ? "default" : "outline"}
                          size="icon"
                          className={`h-8 w-8 ${currentPage === pageNum ? 'bg-[#F77F00] hover:bg-[#e67300]' : ''}`}
                          onClick={() => setCurrentPage(pageNum)}
                        >
                          {pageNum}
                        </Button>
                      )
                    })}
                    
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                    >
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="py-16 text-center">
              <Search className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-slate-700 mb-2">Aucun résultat trouvé</h3>
              <p className="text-slate-500 max-w-md mx-auto">
                Aucun log ne correspond à vos critères de recherche.
              </p>
              <Button 
                variant="outline" 
                className="mt-4 gap-2"
                onClick={() => {
                  setSearchQuery('')
                  setTypeFilter('all')
                  setStatusFilter('all')
                }}
              >
                <RefreshCw className="w-4 h-4" />
                Effacer les filtres
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
