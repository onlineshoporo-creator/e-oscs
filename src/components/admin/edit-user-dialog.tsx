'use client'

import React, { useState, useEffect } from 'react'
import { Edit2, Loader2, Save, Building2, Shield, Phone, User } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Separator } from '@/components/ui/separator'
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
  organization?: { id: string; nom: string }
  email?: string
}

interface OrganizationOption {
  id: string
  nom: string
}

interface EditUserDialogProps {
  user: UserProfile | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
  organizations: OrganizationOption[]
}

export function EditUserDialog({ user, open, onOpenChange, onSuccess, organizations }: EditUserDialogProps) {
  // États du formulaire
  const [nomComplet, setNomComplet] = useState('')
  const [telephone, setTelephone] = useState('')
  const [organizationId, setOrganizationId] = useState<string>('')
  const [role, setRole] = useState<string>('AGENT')
  const [actif, setActif] = useState(true)
  
  // États UI
  const [loading, setLoading] = useState(false)

  // Charger les données de l'utilisateur quand le dialog s'ouvre
  useEffect(() => {
    if (open && user) {
      setNomComplet(user.nom_complet || '')
      setTelephone(user.telephone || '')
      setOrganizationId(user.organization_id || '')
      setRole(user.org_role || 'AGENT')
      setActif(user.actif !== false)
    }
  }, [open, user])

  // Sauvegarder les modifications
  const handleSave = async () => {
    if (!user) return

    // Validation minimale
    if (!nomComplet.trim()) {
      toast.error('Le nom complet est requis')
      return
    }

    setLoading(true)
    try {
      const res = await fetch(`/api/admin/users/${user.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nom_complet: nomComplet,
          telephone: telephone || undefined,
          organization_id: organizationId || null,
          role: role as any,
          actif: actif
        })
      })

      const data = await res.json()

      if (res.ok) {
        toast.success('Utilisateur mis à jour avec succès')
        onOpenChange(false)
        onSuccess()
      } else {
        toast.error(data.error || "Erreur lors de la mise à jour")
      }
    } catch (error) {
      console.error('Erreur mise à jour:', error)
      toast.error("Erreur lors de la mise à jour")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <div className="p-2 rounded-lg bg-blue-100 text-blue-600">
              <Edit2 className="w-5 h-5" />
            </div>
            Modifier l&apos;utilisateur
          </DialogTitle>
          <DialogDescription>
            Modifiez les informations de {user?.nom_complet}
          </DialogDescription>
        </DialogHeader>

        {!user ? (
          <div className="py-8 text-center text-slate-500">
            Aucun utilisateur sélectionné
          </div>
        ) : (
          <div className="space-y-6 py-4">
            {/* Info utilisateur */}
            <div className="p-3 rounded-lg bg-slate-50 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center font-semibold">
                {user.nom_complet.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)}
              </div>
              <div>
                <p className="font-medium text-slate-800">{user.nom_complet}</p>
                <p className="text-sm text-slate-500">{user.email}</p>
              </div>
            </div>

            <Separator />

            {/* Nom complet */}
            <div className="space-y-2">
              <Label htmlFor="edit-nom" className="flex items-center gap-2">
                <User className="w-4 h-4" />
                Nom complet *
              </Label>
              <Input
                id="edit-nom"
                value={nomComplet}
                onChange={(e) => setNomComplet(e.target.value)}
              />
            </div>

            {/* Téléphone */}
            <div className="space-y-2">
              <Label htmlFor="edit-tel" className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                Téléphone
              </Label>
              <Input
                id="edit-tel"
                placeholder="+225 00 00 00 00"
                value={telephone}
                onChange={(e) => setTelephone(e.target.value)}
              />
            </div>

            {/* Organisation */}
            <div className="space-y-2">
              <Label htmlFor="edit-org" className="flex items-center gap-2">
                <Building2 className="w-4 h-4" />
                Organisation
              </Label>
              <Select value={organizationId} onValueChange={setOrganizationId}>
                <SelectTrigger id="edit-org">
                  <SelectValue placeholder="Aucune organisation" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Aucune organisation</SelectItem>
                  {organizations.map((org) => (
                    <SelectItem key={org.id} value={org.id}>
                      {org.nom}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Rôle */}
            <div className="space-y-2">
              <Label htmlFor="edit-role" className="flex items-center gap-2">
                <Shield className="w-4 h-4" />
                Rôle
              </Label>
              <Select value={role} onValueChange={setRole} disabled={user.is_super_admin}>
                <SelectTrigger id="edit-role">
                  <SelectValue placeholder="Sélectionner un rôle" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PROPRIETAIRE">Propriétaire</SelectItem>
                  <SelectItem value="AGENT">Agent</SelectItem>
                  <SelectItem value="LECTEUR">Lecteur</SelectItem>
                </SelectContent>
              </Select>
              {user.is_super_admin && (
                <p className="text-xs text-amber-600 bg-amber-50 p-2 rounded">
                  ⚠️ Cet utilisateur est Super Admin. Son rôle ne peut pas être modifié ici.
                </p>
              )}
            </div>

            <Separator />

            {/* Toggle Actif/Inactif */}
            <div className="flex items-center justify-between p-3 rounded-lg border border-slate-200">
              <div>
                <p className="font-medium text-slate-700">Statut du compte</p>
                <p className="text-xs text-slate-500">
                  {actif ? 'Utilisateur actif' : 'Utilisateur désactivé'}
                </p>
              </div>
              <Switch 
                checked={actif} 
                onCheckedChange={setActif}
                disabled={user.is_super_admin}
              />
            </div>

            {user.is_super_admin && !actif && (
              <p className="text-xs text-red-500 bg-red-50 p-2 rounded">
                ⚠️ Attention : désactiver un Super Admin peut bloquer l&apos;accès à l&apos;administration.
              </p>
            )}

            {/* Boutons d'action */}
            <div className="flex gap-3 pt-4">
              <Button
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="flex-1"
              >
                Annuler
              </Button>
              <Button
                onClick={handleSave}
                disabled={loading || !nomComplet.trim()}
                className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Enregistrement...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Enregistrer
                  </>
                )}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
