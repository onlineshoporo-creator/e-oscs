'use client'

import React, { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  ArrowLeft,
  User,
  Mail,
  Phone,
  Building2,
  Shield,
  Calendar,
  CheckCircle2,
  XCircle,
  KeyRound,
  Edit,
  UserCheck,
  UserX,
  Activity
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Separator } from '@/components/ui/separator'
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
  updated_at?: string
  organization?: { id: string; nom: string; type_org?: string; region?: string }
  email?: string
}

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
    icon: User
  },
  AGENT: {
    label: 'Agent',
    className: 'bg-blue-100 text-blue-700 border-blue-200',
    icon: User
  },
  LECTEUR: {
    label: 'Lecteur',
    className: 'bg-gray-100 text-gray-600 border-gray-200',
    icon: User
  }
}

export default function UserDetailPage() {
  const params = useParams()
  const router = useRouter()
  const userId = params.id as string

  // États
  const [user, setUser] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [confirmToggle, setConfirmToggle] = useState(false)

  // Charger les données utilisateur
  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch(`/api/admin/users/${userId}`)
        if (res.ok) {
          const data = await res.json()
          setUser(data)
        } else {
          toast.error('Utilisateur non trouvé')
          router.push('/admin/utilisateurs')
        }
      } catch (error) {
        console.error('Erreur:', error)
        toast.error('Erreur lors du chargement')
      } finally {
        setLoading(false)
      }
    }

    if (userId) {
      fetchUser()
    }
  }, [userId, router])

  // Toggle statut
  const handleToggleStatus = async () => {
    if (!user) return

    try {
      const res = await fetch(`/api/admin/users/${user.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'toggle-status' })
      })

      if (res.ok) {
        toast.success('Statut mis à jour')
        // Recharger les données
        const dataRes = await fetch(`/api/admin/users/${userId}`)
        if (dataRes.ok) {
          const data = await dataRes.json()
          setUser(data)
        }
      } else {
        const data = await res.json()
        toast.error(data.error || 'Erreur')
      }
    } catch {
      toast.error('Erreur')
    }
    setConfirmToggle(false)
  }

  // Reset mot de passe
  const handleResetPassword = async () => {
    if (!user) return

    try {
      const res = await fetch(`/api/admin/users/${user.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'reset-password' })
      })

      if (res.ok) {
        toast.success('Email de réinitialisation envoyé')
      } else {
        const data = await res.json()
        toast.error(data.error || 'Erreur')
      }
    } catch {
      toast.error('Erreur')
    }
  }

  // Formater la date
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatDateShort = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    })
  }

  // Obtenir les initiales
  const getInitials = (nom: string): string => {
    return nom.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-10" />
          <Skeleton className="h-8 w-48" />
        </div>
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    )
  }

  if (!user) {
    return (
      <div className="text-center py-16">
        <p className="text-slate-500">Utilisateur non trouvé</p>
        <Button variant="link" onClick={() => router.push('/admin/utilisateurs')}>
          Retour à la liste
        </Button>
      </div>
    )
  }

  const config = roleConfig[user.org_role] || roleConfig.LECTEUR
  const RoleIcon = config.icon

  return (
    <div className="space-y-6">
      {/* Header navigation */}
      <div className="flex items-center gap-4">
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => router.push('/admin/utilisateurs')}
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Détail utilisateur</h1>
          <p className="text-slate-500 text-sm">Gestion du compte et historique</p>
        </div>
      </div>

      {/* Carte profil principale */}
      <Card className="border-slate-200 overflow-hidden">
        <div className="h-24 bg-gradient-to-r from-orange-500 via-orange-400 to-green-500" />
        <CardContent className="p-6 -mt-12 relative">
          <div className="flex flex-col md:flex-row gap-6">
            <Avatar className="h-24 w-24 border-4 border-white shadow-lg flex-shrink-0">
              <AvatarFallback className={
                user.is_super_admin 
                  ? 'bg-red-100 text-red-600 text-2xl' 
                  : user.org_role === 'PROPRIETAIRE' 
                    ? 'bg-orange-100 text-orange-600 text-2xl'
                    : 'bg-slate-100 text-slate-600 text-2xl'
              }>
                {getInitials(user.nom_complet)}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-slate-800">{user.nom_complet}</h2>
                  <div className="flex flex-wrap items-center gap-2 mt-1">
                    <Badge variant="outline" className={`gap-1 ${config.className}`}>
                      <RoleIcon className="w-3 h-3" />
                      {config.label}
                    </Badge>
                    <Badge 
                      variant="outline"
                      className={user.actif 
                        ? 'bg-green-50 text-green-700 border-green-200' 
                        : 'bg-gray-100 text-gray-500 border-gray-200'
                      }
                    >
                      {user.actif ? (
                        <>
                          <CheckCircle2 className="w-3 h-3 mr-1" />
                          Actif
                        </>
                      ) : (
                        <>
                          <XCircle className="w-3 h-3 mr-1" />
                          Inactif
                        </>
                      )}
                    </Badge>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={handleResetPassword} className="gap-2">
                    <KeyRound className="w-4 h-4" />
                    Reset MDP
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setConfirmToggle(true)}
                    className={`gap-2 ${user.actif ? 'text-amber-600 hover:text-amber-700' : 'text-green-600 hover:text-green-700'}`}
                  >
                    {user.actif ? (
                      <>
                        <UserX className="w-4 h-4" />
                        Désactiver
                      </>
                    ) : (
                      <>
                        <UserCheck className="w-4 h-4" />
                        Réactiver
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Onglets */}
      <Tabs defaultValue="profil" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:inline-grid">
          <TabsTrigger value="profil" className="gap-2">
            <User className="w-4 h-4" />
            Profil
          </TabsTrigger>
          <TabsTrigger value="organisation" className="gap-2">
            <Building2 className="w-4 h-4" />
            Organisation
          </TabsTrigger>
          <TabsTrigger value="activites" className="gap-2">
            <Activity className="w-4 h-4" />
            Activités
          </TabsTrigger>
          <TabsTrigger value="journal" className="gap-2">
            <Calendar className="w-4 h-4" />
            Journal
          </TabsTrigger>
        </TabsList>

        {/* Onglet Profil */}
        <TabsContent value="profil" className="space-y-6">
          <Card className="border-slate-200">
            <CardHeader>
              <CardTitle className="text-lg">Informations personnelles</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Email */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-500 flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    Email
                  </label>
                  <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
                    <p className="font-medium text-slate-800">{user.email || '-'}</p>
                  </div>
                </div>

                {/* Téléphone */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-500 flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    Téléphone
                  </label>
                  <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
                    <p className="font-medium text-slate-800">{user.telephone || '-'}</p>
                  </div>
                </div>

                {/* Rôle */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-500 flex items-center gap-2">
                    <Shield className="w-4 h-4" />
                    Rôle
                  </label>
                  <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
                    <Badge variant="outline" className={`${config.className}`}>
                      {config.label}
                    </Badge>
                  </div>
                </div>

                {/* Statut */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-500 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" />
                    Statut du compte
                  </label>
                  <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
                    <Badge 
                      variant="outline"
                      className={user.actif 
                        ? 'bg-green-50 text-green-700 border-green-200' 
                        : 'bg-gray-100 text-gray-500 border-gray-200'
                      }
                    >
                      {user.actif ? 'Actif' : 'Inactif'}
                    </Badge>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Dates */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-500 flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Date d&apos;inscription
                  </label>
                  <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
                    <p className="font-medium text-slate-800">{formatDate(user.created_at)}</p>
                  </div>
                </div>

                {user.updated_at && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-500 flex items-center gap-2">
                      <Edit className="w-4 h-4" />
                      Dernière modification
                    </label>
                    <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
                      <p className="font-medium text-slate-800">{formatDate(user.updated_at)}</p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Onglet Organisation */}
        <TabsContent value="organisation" className="space-y-6">
          <Card className="border-slate-200">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Building2 className="w-5 h-5" />
                Organisation assignée
              </CardTitle>
            </CardHeader>
            <CardContent>
              {user.organization ? (
                <div className="space-y-4">
                  <div className="p-4 rounded-lg bg-gradient-to-br from-orange-50 to-white border border-orange-100">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-lg text-slate-800">{user.organization.nom}</h3>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge variant="secondary" className="bg-slate-100">
                            {user.organization.type_org || 'N/A'}
                          </Badge>
                        </div>
                      </div>
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/admin/organisations`}>
                          Voir l&apos;org
                        </Link>
                      </Button>
                    </div>
                    
                    {user.organization.region && (
                      <p className="text-sm text-slate-500 mt-3">
                        Région : {user.organization.region}
                      </p>
                    )}
                  </div>
                  
                  <Separator />
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="p-3 rounded-lg bg-slate-50 text-center">
                      <p className="text-2xl font-bold text-slate-800">-</p>
                      <p className="text-xs text-slate-500 mt-1">Membres</p>
                    </div>
                    <div className="p-3 rounded-lg bg-slate-50 text-center">
                      <p className="text-2xl font-bold text-slate-800">-</p>
                      <p className="text-xs text-slate-500 mt-1">Activités</p>
                    </div>
                    <div className="p-3 rounded-lg bg-slate-50 text-center">
                      <p className="text-2xl font-bold text-green-600">Actif</p>
                      <p className="text-xs text-slate-500 mt-1">Statut</p>
                    </div>
                    <div className="p-3 rounded-lg bg-slate-50 text-center">
                      <p className="text-2xl font-bold text-slate-800">-</p>
                      <p className="text-xs text-slate-500 mt-1">Abonnement</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="py-12 text-center">
                  <Building2 className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                  <h3 className="font-semibold text-slate-700 mb-2">Aucune organisation</h3>
                  <p className="text-slate-500 max-w-md mx-auto">
                    Cet utilisateur n&apos;est pas encore assigné à une organisation.
                  </p>
                  <Button 
                    variant="outline" 
                    className="mt-4"
                    onClick={() => document.querySelector('[value="organisation"]')?.click()}
                  >
                    Modifier le profil pour assigner
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Onglet Activités */}
        <TabsContent value="activites" className="space-y-6">
          <Card className="border-slate-200">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Activity className="w-5 h-5" />
                Activités récentes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="py-12 text-center">
                <Activity className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                <h3 className="font-semibold text-slate-700 mb-2">Aucune activité récente</h3>
                <p className="text-slate-500 max-w-md mx-auto">
                  Les activités de cet utilisateur apparaîtront ici.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Onglet Journal */}
        <TabsContent value="journal" className="space-y-6">
          <Card className="border-slate-200">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Journal d&apos;audit
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Création du compte */}
                <div className="flex items-start gap-4 p-4 rounded-lg bg-slate-50">
                  <div className="p-2 rounded-full bg-blue-100 text-blue-600">
                    <User className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-slate-700">Compte créé</p>
                    <p className="text-sm text-slate-500">
                      Le compte de {user.nom_complet} a été créé.
                    </p>
                    <p className="text-xs text-slate-400 mt-1">
                      {formatDate(user.created_at)}
                    </p>
                  </div>
                </div>

                {/* Placeholder pour futurs événements */}
                <div className="py-8 text-center border-t border-dashed border-slate-200">
                  <Calendar className="w-8 h-8 text-slate-200 mx-auto mb-2" />
                  <p className="text-sm text-slate-400">
                    Les futures actions sur ce compte apparaîtront ici
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Confirmation toggle statut */}
      <AlertDialog open={confirmToggle} onOpenChange={setConfirmToggle}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {user.actif ? 'Désactiver cet utilisateur ?' : 'Réactiver cet utilisateur ?'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {user.actif 
                ? "Cet utilisateur ne pourra plus se connecter à la plateforme tant qu'il n'est pas réactivé."
                : "Cet utilisateur pourra à nouveau se connecter à la plateforme."
              }
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleToggleStatus}
              className={user.actif ? 'bg-amber-500 hover:bg-amber-600' : ''}
            >
              Confirmer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
