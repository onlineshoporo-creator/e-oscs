'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { 
  Key, 
  Plus, 
  Search, 
  Filter,
  Eye,
  Copy,
  Mail,
  Ban,
  RefreshCw,
  Calendar,
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
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
import { toast } from 'sonner'
import { GenerateCodeDialog } from '@/components/admin/generate-code-dialog'
import { CodeDetailDialog } from '@/components/admin/code-detail-dialog'

// Types
interface ActivationCode {
  id: string
  code: string
  organization_id?: string
  plan_id?: string
  email_proprietaire: string
  duree_mois: number
  expire_le: string
  utilise: boolean
  utilise_le?: string
  cree_par: string
  created_at: string
  plan?: { id: string; code: string; nom: string; prix_mensuel: number }
  organization?: { id: string; nom: string }
}

interface CodeStats {
  total: number
  utilises: number
  expires: number
  disponibles: number
}

type CodeStatusFilter = 'all' | 'DISPONIBLE' | 'UTILISE' | 'EXPIRE' | 'EN_ATTENTE'

// Helper pour déterminer le statut d'un code
function getCodeStatus(code: ActivationCode): { status: CodeStatusFilter; label: string } {
  const now = new Date()
  const expireDate = new Date(code.expire_le)
  
  if (code.utilise) return { status: 'UTILISE', label: 'Utilisé' }
  if (expireDate < now) return { status: 'EXPIRE', label: 'Expiré' }
  return { status: 'DISPONIBLE', label: 'Disponible' }
}

// Composant badge de statut
function StatusBadge({ status }: { status: CodeStatusFilter }) {
  const variants: Record<CodeStatusFilter, { className: string; icon: React.ReactNode }> = {
    DISPONIBLE: {
      className: 'bg-green-100 text-green-700 border-green-200',
      icon: <CheckCircle2 className="w-3 h-3" />
    },
    UTILISE: {
      className: 'bg-blue-100 text-blue-700 border-blue-200',
      icon: <CheckCircle2 className="w-3 h-3" />
    },
    EXPIRE: {
      className: 'bg-gray-100 text-gray-500 border-gray-200 line-through',
      icon: <XCircle className="w-3 h-3" />
    },
    EN_ATTENTE: {
      className: 'bg-amber-100 text-amber-700 border-amber-200',
      icon: <AlertTriangle className="w-3 h-3" />
    },
    all: {
      className: 'bg-slate-100 text-slate-600 border-slate-200',
      icon: null
    }
  }

  const variant = variants[status] || variants.all

  return (
    <Badge variant="outline" className={`gap-1 ${variant.className}`}>
      {variant.icon}
      {status === 'all' ? 'Tous' : 
       status === 'DISPONIBLE' ? 'Disponible' :
       status === 'UTILISE' ? 'Utilisé' :
       status === 'EXPIRE' ? 'Expiré' : 'En attente'}
    </Badge>
  )
}

export default function CodesActivationPage() {
  // États
  const [codes, setCodes] = useState<ActivationCode[]>([])
  const [stats, setStats] = useState<CodeStats>({ total: 0, utilises: 0, expires: 0, disponibles: 0 })
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<CodeStatusFilter>('all')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [total, setTotal] = useState(0)
  
  // Dialogs
  const [showGenerateDialog, setShowGenerateDialog] = useState(false)
  const [selectedCode, setSelectedCode] = useState<ActivationCode | null>(null)

  // Charger les données
  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (search) params.set('search', search)
      if (statusFilter !== 'all') params.set('statut', statusFilter)
      params.set('page', page.toString())
      params.set('limit', '10')

      const [codesRes, statsRes] = await Promise.all([
        fetch(`/api/admin/codes?${params.toString()}`),
        fetch('/api/admin/codes?stats=true')
      ])

      if (codesRes.ok) {
        const data = await codesRes.json()
        setCodes(data.data || [])
        setTotal(data.total || 0)
        setTotalPages(data.totalPages || 1)
      }

      if (statsRes.ok) {
        const statsData = await statsRes.json()
        setStats(statsData)
      }
    } catch (error) {
      console.error('Erreur lors du chargement:', error)
      toast.error('Erreur lors du chargement des codes')
    } finally {
      setLoading(false)
    }
  }, [search, statusFilter, page])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  // Copier le code dans le presse-papier
  const copyToClipboard = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code)
      toast.success('Code copié dans le presse-papier')
    } catch {
      toast.error('Erreur lors de la copie')
    }
  }

  // Révoquer un code
  const handleRevoke = async (code: ActivationCode) => {
    try {
      const res = await fetch(`/api/admin/codes/${code.code}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'revoke' })
      })

      if (res.ok) {
        toast.success('Code révoqué avec succès')
        fetchData()
      } else {
        const data = await res.json()
        toast.error(data.error || 'Erreur lors de la révocation')
      }
    } catch {
      toast.error('Erreur lors de la révocation')
    }
  }

  // Envoyer email
  const handleSendEmail = async (code: ActivationCode) => {
    try {
      const res = await fetch(`/api/admin/codes/${code.code}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'send-email' })
      })

      if (res.ok) {
        toast.success('Email envoyé avec succès')
      } else {
        const data = await res.json()
        toast.error(data.error || "Erreur lors de l'envoi")
      }
    } catch {
      toast.error("Erreur lors de l'envoi")
    }
  }

  // Formater la date
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-slate-900">Codes d&apos;activation</h1>
          <p className="text-slate-500 mt-1">Générez et gérez les codes d&apos;activation des organisations</p>
        </div>
        <Button 
          onClick={() => setShowGenerateDialog(true)}
          className="gap-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700"
        >
          <Plus className="w-4 h-4" />
          Générer un code
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-slate-200">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 rounded-xl bg-slate-100 text-slate-600">
              <Key className="w-6 h-6" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">{loading ? '--' : stats.total}</p>
              <p className="text-xs text-slate-500">Total générés</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 rounded-xl bg-blue-100 text-blue-600">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">{loading ? '--' : stats.utilises}</p>
              <p className="text-xs text-slate-500">Utilisés</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 rounded-xl bg-gray-100 text-gray-500">
              <XCircle className="w-6 h-6" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">{loading ? '--' : stats.expires}</p>
              <p className="text-xs text-slate-500">Expirés</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 rounded-xl bg-green-100 text-green-600">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">{loading ? '--' : stats.disponibles}</p>
              <p className="text-xs text-slate-500">Disponibles</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtres */}
      <Card className="border-slate-200">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                placeholder="Rechercher un code ou email..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1) }}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v as CodeStatusFilter); setPage(1) }}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les statuts</SelectItem>
                <SelectItem value="DISPONIBLE">Disponible</SelectItem>
                <SelectItem value="UTILISE">Utilisé</SelectItem>
                <SelectItem value="EXPIRE">Expiré</SelectItem>
                <SelectItem value="EN_ATTENTE">En attente</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" onClick={fetchData} className="gap-2">
              <RefreshCw className="w-4 h-4" />
              Actualiser
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Tableau des codes */}
      <Card className="border-slate-200">
        <CardContent className="p-0">
          {loading ? (
            <div className="p-6 space-y-4">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          ) : codes.length === 0 ? (
            <div className="py-16 text-center">
              <Key className="w-12 h-12 text-slate-200 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-slate-700 mb-2">Aucun code trouvé</h3>
              <p className="text-slate-500 max-w-md mx-auto">
                Commencez par générer votre premier code d&apos;activation.
              </p>
              <Button 
                onClick={() => setShowGenerateDialog(true)}
                className="mt-4 gap-2 bg-gradient-to-r from-orange-500 to-orange-600"
              >
                <Plus className="w-4 h-4" />
                Générer un code
              </Button>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-slate-50 border-b border-slate-200">
                      <TableHead className="font-semibold text-slate-700">Code</TableHead>
                      <TableHead className="font-semibold text-slate-700">Email propriétaire</TableHead>
                      <TableHead className="font-semibold text-slate-700">Plan</TableHead>
                      <TableHead className="font-semibold text-slate-700">Durée</TableHead>
                      <TableHead className="font-semibold text-slate-700">Expire le</TableHead>
                      <TableHead className="font-semibold text-slate-700">Statut</TableHead>
                      <TableHead className="font-semibold text-slate-700">Utilisé le</TableHead>
                      <TableHead className="text-right font-semibold text-slate-700">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {codes.map((code) => {
                      const statusInfo = getCodeStatus(code)
                      return (
                        <TableRow key={code.id} className="hover:bg-slate-50 transition-colors">
                          <TableCell>
                            <span className="font-mono text-sm font-bold text-orange-600 bg-orange-50 px-2 py-1 rounded">
                              {code.code}
                            </span>
                          </TableCell>
                          <TableCell>
                            <span className="text-sm text-slate-700">{code.email_proprietaire}</span>
                          </TableCell>
                          <TableCell>
                            {code.plan ? (
                              <Badge variant="secondary" className="bg-slate-100">
                                {code.plan.nom}
                              </Badge>
                            ) : (
                              <span className="text-slate-400 text-sm">-</span>
                            )}
                          </TableCell>
                          <TableCell>
                            <span className="text-sm text-slate-600">{code.duree_mois} mois</span>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1.5 text-sm text-slate-600">
                              <Calendar className="w-3.5 h-3.5 text-slate-400" />
                              {formatDate(code.expire_le)}
                            </div>
                          </TableCell>
                          <TableCell>
                            <StatusBadge status={statusInfo.status} />
                          </TableCell>
                          <TableCell>
                            {code.utilise_le ? (
                              <span className="text-sm text-slate-500">
                                {formatDate(code.utilise_le)}
                              </span>
                            ) : (
                              <span className="text-slate-300 text-sm">-</span>
                            )}
                          </TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <MoreHorizontal className="w-4 h-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => setSelectedCode(code)}>
                                  <Eye className="w-4 h-4 mr-2" />
                                  Voir détails
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => copyToClipboard(code.code)}>
                                  <Copy className="w-4 h-4 mr-2" />
                                  Copier le code
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleSendEmail(code)}>
                                  <Mail className="w-4 h-4 mr-2" />
                                  Envoyer par email
                                </DropdownMenuItem>
                                {!code.utilise && (
                                  <>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem 
                                      onClick={() => handleRevoke(code)}
                                      className="text-red-600 focus:text-red-600"
                                    >
                                      <Ban className="w-4 h-4 mr-2" />
                                      Révoquer ce code
                                    </DropdownMenuItem>
                                  </>
                                )}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between px-6 py-4 border-t border-slate-200">
                  <p className="text-sm text-slate-500">
                    Affichage de {(page - 1) * 10 + 1}-{Math.min(page * 10, total)} sur {total}
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={page <= 1}
                      onClick={() => setPage(p => p - 1)}
                    >
                      Précédent
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={page >= totalPages}
                      onClick={() => setPage(p => p + 1)}
                    >
                      Suivant
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Dialog Génération Code */}
      <GenerateCodeDialog
        open={showGenerateDialog}
        onOpenChange={setShowGenerateDialog}
        onSuccess={fetchData}
      />

      {/* Dialog Détails Code */}
      <CodeDetailDialog
        code={selectedCode}
        open={!!selectedCode}
        onOpenChange={(open) => !open && setSelectedCode(null)}
      />
    </div>
  )
}

// Import manquant pour MoreHorizontal
import { MoreHorizontal } from 'lucide-react'
