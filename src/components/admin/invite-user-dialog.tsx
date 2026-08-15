'use client'

import React, { useState } from 'react'
import { UserPlus, Loader2, Mail, Building2, Shield } from 'lucide-react'
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
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { toast } from 'sonner'

interface OrganizationOption {
  id: string
  nom: string
}

interface InviteUserDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
  organizations: OrganizationOption[]
}

export function InviteUserDialog({ open, onOpenChange, onSuccess, organizations }: InviteUserDialogProps) {
  // États du formulaire
  const [email, setEmail] = useState('')
  const [nomComplet, setNomComplet] = useState('')
  const [organizationId, setOrganizationId] = useState<string>('')
  const [role, setRole] = useState<string>('AGENT')
  const [messageAccueil, setMessageAccueil] = useState('')
  
  // États UI
  const [loading, setLoading] = useState(false)

  // Reset à l'ouverture/fermeture
  React.useEffect(() => {
    if (open) {
      // Reset form
      setEmail('')
      setNomComplet('')
      setOrganizationId('')
      setRole('AGENT')
      setMessageAccueil('')
    }
  }, [open])

  // Validation email
  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  }

  // Inviter l'utilisateur
  const handleInvite = async () => {
    // Validation
    if (!email || !isValidEmail(email)) {
      toast.error('Veuillez entrer un email valide')
      return
    }
    
    if (!nomComplet.trim()) {
      toast.error('Veuillez entrer le nom complet de l\'utilisateur')
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          nom_complet: nomComplet,
          organization_id: organizationId || undefined,
          role,
          message_accueil: messageAccueil || undefined,
          invitedBy: 'admin'
        })
      })

      const data = await res.json()

      if (res.ok) {
        toast.success(`Invitation envoyée à ${email}`)
        onOpenChange(false)
        onSuccess()
      } else {
        toast.error(data.error || "Erreur lors de l'invitation")
      }
    } catch (error) {
      console.error('Erreur invitation:', error)
      toast.error("Erreur lors de l'invitation")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <div className="p-2 rounded-lg bg-orange-100 text-orange-600">
              <UserPlus className="w-5 h-5" />
            </div>
            Inviter un utilisateur
          </DialogTitle>
          <DialogDescription>
            Envoyez une invitation à un nouvel utilisateur pour qu&apos;il rejoigne la plateforme.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="invite-email" className="flex items-center gap-2">
              <Mail className="w-4 h-4" />
              Email *
            </Label>
            <Input
              id="invite-email"
              type="email"
              placeholder="utilisateur@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={!email || isValidEmail(email) ? '' : 'border-red-300 focus:border-red-500'}
            />
            {email && !isValidEmail(email) && (
              <p className="text-sm text-red-500">Format d&apos;email invalide</p>
            )}
          </div>

          {/* Nom complet */}
          <div className="space-y-2">
            <Label htmlFor="invite-nom">Nom complet *</Label>
            <Input
              id="invite-nom"
              placeholder="Jean Dupont"
              value={nomComplet}
              onChange={(e) => setNomComplet(e.target.value)}
            />
          </div>

          {/* Organisation */}
          <div className="space-y-2">
            <Label htmlFor="invite-org" className="flex items-center gap-2">
              <Building2 className="w-4 h-4" />
              Organisation
            </Label>
            <Select value={organizationId} onValueChange={setOrganizationId}>
              <SelectTrigger id="invite-org">
                <SelectValue placeholder="Sélectionner (optionnel)" />
              </SelectTrigger>
              <SelectContent>
                {organizations.map((org) => (
                  <SelectItem key={org.id} value={org.id}>
                    {org.nom}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-slate-500">
              Optionnel : peut être assigné plus tard
            </p>
          </div>

          {/* Rôle */}
          <div className="space-y-2">
            <Label htmlFor="invite-role" className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              Rôle dans l&apos;organisation
            </Label>
            <Select value={role} onValueChange={setRole}>
              <SelectTrigger id="invite-role">
                <SelectValue placeholder="Sélectionner un rôle" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="PROPRIETAIRE">
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-orange-500"></span>
                    Propriétaire
                  </span>
                </SelectItem>
                <SelectItem value="AGENT">
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                    Agent
                  </span>
                </SelectItem>
                <SelectItem value="LECTEUR">
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-gray-400"></span>
                    Lecteur
                  </span>
                </SelectItem>
              </SelectContent>
            </Select>
            
            {/* Description des rôles */}
            <div className="grid grid-cols-3 gap-2 mt-2">
              <div className="p-2 rounded-md bg-orange-50 border border-orange-100">
                <p className="text-[10px] font-semibold text-orange-700">Propriétaire</p>
                <p className="text-[9px] text-orange-600">Accès complet</p>
              </div>
              <div className="p-2 rounded-md bg-blue-50 border border-blue-100">
                <p className="text-[10px] font-semibold text-blue-700">Agent</p>
                <p className="text-[9px] text-blue-600">Gestion activités</p>
              </div>
              <div className="p-2 rounded-md bg-gray-50 border border-gray-200">
                <p className="text-[10px] font-semibold text-gray-600">Lecteur</p>
                <p className="text-[9px] text-gray-500">Lecture seule</p>
              </div>
            </div>
          </div>

          {/* Message d'accueil */}
          <div className="space-y-2">
            <Label htmlFor="invite-message">Message d&apos;accueil (optionnel)</Label>
            <Textarea
              id="invite-message"
              placeholder="Personnalisez le message d'invitation..."
              value={messageAccueil}
              onChange={(e) => setMessageAccueil(e.target.value)}
              rows={3}
            />
          </div>

          {/* Bouton inviter */}
          <Button
            onClick={handleInvite}
            disabled={loading || !email || !isValidEmail(email) || !nomComplet.trim()}
            className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Envoi en cours...
              </>
            ) : (
              <>
                <Mail className="w-4 h-4" />
                Envoyer l&apos;invitation
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
