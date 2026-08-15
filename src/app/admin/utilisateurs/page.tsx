'use client'

import React, { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { 
  Users, 
  Plus, 
  Search, 
  Filter,
  Eye,
  Edit,
  UserCheck,
  UserX,
  KeyRound,
  LogIn,
  MoreHorizontal,
  RefreshCw,
  Shield,
  Building2,
  UserCog,
  BookOpen
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Skeleton } from '@/components/ui/skeleton'
import { toast } from 'sonner'
import { InviteUserDialog } from '@/components/admin/invite-user-dialog'
import { EditUserDialog } from '@/components/admin/edit-user-dialog'
import { UserProfileDialog } from '@/components/admin/user-profile-dialog'

// Types
interface UserProfile {
  id: string
  nom_complet: string
  telephone?: string
  organization_id?: string
  org_role: 'SUPER_ADMIN' | 'PROPRIETAIRE' | 'AGENT' | 'LECTEUR'
  is_super_admin: boolean
  actif: boolean
  avatar_url?: string
  created_at: string
  organization?: { id: string; nom: string; type_org?: string }
  email?: string
}

interface UserStats {
  total: number
  superAdmins: number
  actifs: number
  inactifs: number
}

type RoleFilter = 'all' | 'SUPER_ADMIN' | 'PROPRIETAIRE' | 'AGENT' | 'LECTEUR'
type StatusFilter = 'all' | 'actif' | 'inactif'

// Configuration des badges de rôle
const roleConfig = {
  SUPER_ADMIN: {
    label: 'Super Admin',
    className: 'bg-red-100 text-red-700 border-red-200',
    icon: Shield
  },
  PROPRIETAIRE: {
    label: 'Propriétaire',
    className: 'bg-orange-100 text-orange-700 border-orange-200',
    icon: UserCog
  },
  AGENT: {
    label: 'Agent',
    className: 'bg-blue-100 text-blue-700 border-blue-200',
    icon: Users
  },
  LECTEUR: {
    label: 'Lecteur',
    className: 'bg-gray-100 text-gray-600 border-gray-200',
    icon: BookOpen
  }
}

// Composant Badge Rôle
function RoleBadge({ role }: { role: keyof typeof roleConfig }) {
  const config = roleConfig[role] || roleConfig.LECTEUR
  const Icon = config.icon
  
  return (
    <Badge variant="outline" className={`gap-1 ${config.className}`}>
      <Icon className="w-3 h-3" />
      {config.label}
    </Badge>
  )
}

// Obtenir les initiales du nom
function getInitials(nom: string): string {
  return nom
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

export default function UtilisateursPage() {
  // États
  const [users, setUsers] = useState<UserProfile[]>([])
  const [stats, setStats] = useState<UserStats>({ total: 0, superAdmins: 0, actifs: 0, inactifs: 0 })
  const [organizations, setOrganizations] = useState<{ id: string; nom: string }[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState<RoleFilter>('all')
  const [orgFilter, setOrgFilter] = useState<string>('all')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [total, setTotal] = useState(0)
  
  // Dialogs
  const [showInviteDialog, setShowInviteDialog] = useState(false)
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [showProfileDialog, setShowProfileDialog] = useState(false)
  const [confirmToggleId, setConfirmToggleId] = useState<string | null>(null)

  // Charger les données
  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (search) params.set('search', search)
      if (roleFilter !== 'all') params.set('role', roleFilter)
      if (orgFilter !== 'all') params.set('organization_id', orgFilter)
      if (statusFilter !== 'all') params.set('actif', statusFilter === 'actif' ? 'true' : 'false')
      params.set('page', page.toString())
      params.set('limit', '10')

      const [usersRes, statsRes, orgsRes] = await Promise.all([
        fetch(`/api/admin/users?${params.toString()}`),
        fetch('/api/admin/users?stats=true'),
        fetch('/api/admin/organisations')
      ])

      if (usersRes.ok) {
        const data = await usersRes.json()
        setUsers(data.data || [])
        setTotal(data.total || 0)
        setTotalPages(data.totalPages || 1)
      }

      if (statsRes.ok) {
        const statsData = await statsRes.json()
        setStats(statsData)
      }

      if (orgsRes.ok) {
        const data = await orgsRes.json()
        setOrganizations((data.data || []).map((o: { id: string; nom: string }) => ({ id: o.id, nom: o.nom })))
      }
    } catch (error) {
      console.error('Erreur lors du chargement:', error)
      toast.error('Erreur lors du chargement des utilisateurs')
    } finally {
      setLoading(false)
    }
  }, [search, roleFilter, orgFilter, statusFilter, page])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  // Toggle statut utilisateur
  const handleToggleStatus = async (userId: string) => {
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'toggle-status' })
      })

      if (res.ok) {
        toast.success('Statut mis à jour avec succès')
        fetchData()
      } else {
        const data = await res.json()
        toast.error(data.error || 'Erreur lors de la mise à jour')
      }
    } catch {
      toast.error('Erreur lors de la mise à jour')
    }
    setConfirmToggleId(null)
  }

  // Reset mot de passe
  const handleResetPassword = async (user: UserProfile) => {
    try {
      const res = await fetch(`/api/admin/users/${user.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'reset-password' })
      })

      if (res.ok) {
        toast.success(`Email de réinitialisation envoyé à ${user.email || user.nom_complet}`)
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
      month: 'short',
      year: 'numeric'
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-slate-900">Utilisateurs</h1>
          <p className="text-slate-500 mt-1">Gérez les comptes utilisateurs de la plateforme</p>
        </div>
        <Button 
          onClick={() => setShowInviteDialog(true)}
          className="gap-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700"
        >
          <Plus className="w-4 h-4" />
          Inviter un utilisateur
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-slate-200">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 rounded-xl bg-slate-100 text-slate-600">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">{loading ? '--' : stats.total}</p>
              <p className="text-xs text-slate-500">Total utilisateurs</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 rounded-xl bg-red-100 text-red-600">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">{loading ? '--' : stats.superAdmins}</p>
              <p className="text-xs text-slate-500">Super admins</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 rounded-xl bg-green-100 text-green-600">
              <UserCheck className="w-6 h-6" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">{loading ? '--' : stats.actifs}</p>
              <p className="text-xs text-slate-500">Actifs</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 rounded-xl bg-gray-100 text-gray-500">
              <UserX className="w-6 h-6" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">{loading ? '--' : stats.inactifs}</p>
              <p className="text-xs text-slate-500">Inactifs</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtres */}
      <Card className="border-slate-200">
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                placeholder="Rechercher par nom..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1) }}
                className="pl-10"
              />
            </div>
            
            <Select value={roleFilter} onValueChange={(v) => { setRoleFilter(v as RoleFilter); setPage(1) }}>
              <SelectTrigger className="w-full lg:w-[180px]">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Rôle" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les rôles</SelectItem>
                <SelectItem value="SUPER_ADMIN">Super Admin</SelectItem>
                <SelectItem value="PROPRIETAIRE">Propriétaire</SelectItem>
                <SelectItem value="AGENT">Agent</SelectItem>
                <SelectItem value="LECTEUR">Lecteur</SelectItem>
              </SelectContent>
            </Select>

            <Select value={orgFilter} onValueChange={(v) => { setOrgFilter(v); setPage(1) }}>
              <SelectTrigger className="w-full lg:w-[180px]">
                <Building2 className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Organisation" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes</SelectItem>
                {organizations.map(org => (
                  <SelectItem key={org.id} value={org.id}>{org.nom}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v as StatusFilter); setPage(1) }}>
              <SelectTrigger className="w-full lg:w-[150px]">
                <SelectValue placeholder="Statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous</SelectItem>
                <SelectItem value="actif">Actif</SelectItem>
                <SelectItem value="inactif">Inactif</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline" onClick={fetchData} className="gap-2">
              <RefreshCw className="w-4 h-4" />
              Actualiser
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Tableau des utilisateurs */}
      <Card className="border-slate-200">
        <CardContent className="p-0">
          {loading ? (
            <div className="p-6 space-y-4">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          ) : users.length === 0 ? (
            <div className="py-16 text-center">
              <Users className="w-12 h-12 text-slate-200 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-slate-700 mb-2">Aucun utilisateur trouvé</h3>
              <p className="text-slate-500 max-w-md mx-auto">
                Commencez par inviter le premier utilisateur sur la plateforme.
              </p>
              <Button 
                onClick={() => setShowInviteDialog(true)}
                className="mt-4 gap-2 bg-gradient-to-r from-orange-500 to-orange-600"
              >
                <Plus className="w-4 h-4" />
                Inviter un utilisateur
              </Button>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-slate-50 border-b border-slate-200">
                      <TableHead className="font-semibold text-slate-700">Utilisateur</TableHead>
                      <TableHead className="font-semibold text-slate-700 hidden md:table-cell">Email</TableHead>
                      <TableHead className="font-semibold text-slate-700 hidden lg:table-cell">Organisation</TableHead>
                      <TableHead className="font-semibold text-slate-700">Rôle</TableHead>
                      <TableHead className="font-semibold text-slate-700">Statut</TableHead>
                      <TableHead className="font-semibold text-slate-700 hidden xl:table-cell">Inscription</TableHead>
                      <TableHead className="text-right font-semibold text-slate-700">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user.id} className={`hover:bg-slate-50 transition-colors ${!user.actif ? 'opacity-60' : ''}`}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-9 w-9">
                              <AvatarFallback className={
                                user.is_super_admin 
                                  ? 'bg-red-100 text-red-600' 
                                  : user.org_role === 'PROPRIETAIRE' 
                                    ? 'bg-orange-100 text-orange-600'
                                    : 'bg-slate-100 text-slate-600'
                              }>
                                {getInitials(user.nom_complet)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium text-slate-800 text-sm">{user.nom_complet}</p>
                              <p className="text-xs text-slate-500 md:hidden truncate max-w-[120px]">
                                {user.email}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          <span className="text-sm text-slate-600">{user.email || '-'}</span>
                        </TableCell>
                        <TableCell className="hidden lg:table-cell">
                          {user.organization ? (
                            <span className="text-sm text-slate-700">{user.organization.nom}</span>
                          ) : (
                            <span className="text-slate-400 text-sm">-</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <RoleBadge role={user.org_role} />
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant="outline"
                            className={user.actif 
                              ? 'bg-green-50 text-green-700 border-green-200' 
                              : 'bg-gray-100 text-gray-500 border-gray-200'
                            }
                          >
                            {user.actif ? 'Actif' : 'Inactif'}
                          </Badge>
                        </TableCell>
                        <TableCell className="hidden xl:table-cell">
                          <span className="text-sm text-slate-500">
                            {formatDate(user.created_at)}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreHorizontal className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => { setSelectedUser(user); setShowProfileDialog(true) }}>
                                <Eye className="w-4 h-4 mr-2" />
                                Voir le profil
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => { setSelectedUser(user); setShowEditDialog(true) }}>
                                <Edit className="w-4 h-4 mr-2" />
                                Modifier
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleResetPassword(user)}>
                                <KeyRound className="w-4 h-4 mr-2" />
                                Réinitialiser MDP
                              </DropdownMenuItem>
                              <DropdownMenuItem asChild>
                                <Link href={`/admin/utilisateurs/${user.id}`} className="flex items-center">
                                  <LogIn className="w-4 h-4 mr-2" />
                                  Page détail
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem 
                                onClick={() => setConfirmToggleId(user.id)}
                                className={user.actif ? 'text-amber-600 focus:text-amber-600' : 'text-green-600 focus:text-green-600'}
                              >
                                {user.actif ? (
                                  <>
                                    <UserX className="w-4 h-4 mr-2" />
                                    Désactiver
                                  </>
                                ) : (
                                  <>
                                    <UserCheck className="w-4 h-4 mr-2" />
                                    Réactiver
                                  </>
                                )}
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
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

      {/* Dialog Invitation */}
      <InviteUserDialog
        open={showInviteDialog}
        onOpenChange={setShowInviteDialog}
        onSuccess={fetchData}
        organizations={organizations}
      />

      {/* Dialog Édition */}
      <EditUserDialog
        user={selectedUser}
        open={showEditDialog}
        onOpenChange={(open) => { setShowEditDialog(open); if (!open) setSelectedUser(null) }}
        onSuccess={fetchData}
        organizations={organizations}
      />

      {/* Dialog Profil */}
      <UserProfileDialog
        user={selectedUser}
        open={showProfileDialog}
        onOpenChange={(open) => { setShowProfileDialog(open); if (!open) setSelectedUser(null) }}
      />

      {/* Confirmation toggle statut */}
      <AlertDialog open={!!confirmToggleId} onOpenChange={() => setConfirmToggleId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {users.find(u => u.id === confirmToggleId)?.actif ? 'Désactiver l\'utilisateur ?' : 'Réactiver l\'utilisateur ?'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {users.find(u => u.id === confirmToggleId)?.actif 
                ? 'Cet utilisateur ne pourra plus se connecter à la plateforme.'
                : 'Cet utilisateur pourra à nouveau se connecter à la plateforme.'
              }
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => confirmToggleId && handleToggleStatus(confirmToggleId)}
              className={users.find(u => u.id === confirmToggleId)?.actif ? 'bg-amber-500 hover:bg-amber-600' : ''}
            >
              Confirmer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
