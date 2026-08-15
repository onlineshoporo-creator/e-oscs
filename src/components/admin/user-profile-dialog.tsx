'use client'

import React from 'react'
import Link from 'next/link'
import { 
  User, 
  Mail, 
  Phone, 
  Building2, 
  Shield, 
  Calendar,
  CheckCircle2,
  XCircle,
  ExternalLink,
  KeyRound,
  Edit
} from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'

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
  organization?: { id: string; nom: string; type_org?: string }
  email?: string
}

interface UserProfileDialogProps {
  user: UserProfile | null
  open: boolean
  onOpenChange: (open: boolean) => void
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
    icon: Shield
  },
  AGENT: {
    label: 'Agent',
    className: 'bg-blue-100 text-blue-700 border-blue-200',
    icon: Shield
  },
  LECTEUR: {
    label: 'Lecteur',
    className: 'bg-gray-100 text-gray-600 border-gray-200',
    icon: Shield
  }
}

export function UserProfileDialog({ user, open, onOpenChange }: UserProfileDialogProps) {
  if (!user) return null

  // Obtenir les initiales du nom
  const getInitials = (nom: string): string => {
    return nom
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
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

  const config = roleConfig[user.org_role] || roleConfig.LECTEUR
  const RoleIcon = config.icon

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <div className={`p-2 rounded-lg ${config.className}`}>
              <User className="w-5 h-5" />
            </div>
            Profil utilisateur
          </DialogTitle>
          <DialogDescription>
            Informations complètes sur cet utilisateur
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Header profil */}
          <Card className="border-slate-200 overflow-hidden">
            <div className="h-16 bg-gradient-to-r from-orange-500 to-green-500" />
            <CardContent className="p-6 -mt-10 relative">
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <Avatar className="h-20 w-20 border-4 border-white shadow-lg">
                  <AvatarFallback className={
                    user.is_super_admin 
                      ? 'bg-red-100 text-red-600 text-xl' 
                      : user.org_role === 'PROPRIETAIRE' 
                        ? 'bg-orange-100 text-orange-600 text-xl'
                        : 'bg-slate-100 text-slate-600 text-xl'
                  }>
                    {getInitials(user.nom_complet)}
                  </AvatarFallback>
                </Avatar>
                <div className="text-center sm:text-left flex-1">
                  <h3 className="font-bold text-lg text-slate-800">{user.nom_complet}</h3>
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mt-1">
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
              </div>
            </CardContent>
          </Card>

          {/* Informations de contact */}
          <div className="space-y-4">
            <h4 className="font-semibold text-slate-700 text-sm uppercase tracking-wider">
              Informations de contact
            </h4>
            
            <div className="grid gap-3">
              {/* Email */}
              <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-50">
                <div className="p-2 rounded-lg bg-white shadow-sm">
                  <Mail className="w-4 h-4 text-slate-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-slate-500">Email</p>
                  <p className="text-sm font-medium text-slate-800 truncate">{user.email || '-'}</p>
                </div>
              </div>

              {/* Téléphone */}
              <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-50">
                <div className="p-2 rounded-lg bg-white shadow-sm">
                  <Phone className="w-4 h-4 text-slate-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-slate-500">Téléphone</p>
                  <p className="text-sm font-medium text-slate-800">{user.telephone || '-'}</p>
                </div>
              </div>

              {/* Organisation */}
              <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-50">
                <div className="p-2 rounded-lg bg-white shadow-sm">
                  <Building2 className="w-4 h-4 text-slate-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-slate-500">Organisation</p>
                  {user.organization ? (
                    <Link 
                      href={`/admin/organisations`}
                      className="text-sm font-medium text-orange-600 hover:text-orange-700 hover:underline flex items-center gap-1"
                    >
                      {user.organization.nom}
                      <ExternalLink className="w-3 h-3" />
                    </Link>
                  ) : (
                    <span className="text-sm text-slate-400 italic">Aucune organisation assignée</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Dates */}
          <div className="space-y-4">
            <h4 className="font-semibold text-slate-700 text-sm uppercase tracking-wider">
              Historique du compte
            </h4>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3 rounded-lg bg-slate-50 space-y-1">
                <div className="flex items-center gap-1.5 text-xs text-slate-500">
                  <Calendar className="w-3 h-3" />
                  Inscrit le
                </div>
                <p className="text-sm font-medium text-slate-800">{formatDateShort(user.created_at)}</p>
              </div>
              
              {user.updated_at && (
                <div className="p-3 rounded-lg bg-slate-50 space-y-1">
                  <div className="flex items-center gap-1.5 text-xs text-slate-500">
                    <Calendar className="w-3 h-3" />
                    Dernière MAJ
                  </div>
                  <p className="text-sm font-medium text-slate-800">{formatDateShort(user.updated_at)}</p>
                </div>
              )}
            </div>
          </div>

          <Separator />

          {/* Actions rapides */}
          <div className="space-y-4">
            <h4 className="font-semibold text-slate-700 text-sm uppercase tracking-wider">
              Actions administrateur
            </h4>
            
            <div className="grid grid-cols-2 gap-3">
              <Button variant="outline" asChild className="gap-2">
                <Link href={`/admin/utilisateurs/${user.id}`}>
                  <ExternalLink className="w-4 h-4" />
                  Page détail
                </Link>
              </Button>
              <Button variant="outline" className="gap-2">
                <KeyRound className="w-4 h-4" />
                Reset MDP
              </Button>
            </div>
          </div>

          {/* Lien vers page détail complète */}
          <div className="pt-4 text-center">
            <Button variant="link" asChild className="text-orange-600 hover:text-orange-700">
              <Link href={`/admin/utilisateurs/${user.id}`} className="gap-1">
                Voir la page complète avec onglets
                <ExternalLink className="w-4 h-4" />
              </Link>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
