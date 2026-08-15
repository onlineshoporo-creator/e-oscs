'use client'

import React, { useState } from 'react'
import {
  User,
  Mail,
  Building2,
  Shield,
  Phone,
  MapPin,
  Save,
  Camera,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { useToast } from '@/hooks/use-toast'

// Données mockées du profil
const initialProfileData = {
  fullName: 'Kouamé Jean-Baptiste',
  email: 'jean-baptiste.kouame@exemple.ci',
  phone: '+225 07 12 34 56 78',
  organization: 'Direction Régionale d\'Abidjan',
  role: 'Agent',
  bio: '',
  address: 'Abidjan, Yopougon',
}

export default function ProfilPage() {
  const [profileData, setProfileData] = useState(initialProfileData)
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const { toast } = useToast()

  // Générer les initiales pour l'avatar
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  const handleSave = async () => {
    setIsSaving(true)
    
    try {
      // Simuler la sauvegarde - en production, appel API
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      toast({
        title: 'Profil mis à jour',
        description: 'Vos informations ont été enregistrées avec succès.',
      })
      
      setIsEditing(false)
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Une erreur est survenue lors de la mise à jour.',
        variant: 'destructive',
      })
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* En-tête */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-slate-900">Mon profil</h1>
          <p className="text-slate-500 mt-1">
            Gérez vos informations personnelles.
          </p>
        </div>
        
        {!isEditing ? (
          <Button 
            onClick={() => setIsEditing(true)}
            className="bg-orange-500 hover:bg-orange-600 text-white"
          >
            Modifier le profil
          </Button>
        ) : (
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              onClick={() => {
                setIsEditing(false)
                setProfileData(initialProfileData) // Reset
              }}
            >
              Annuler
            </Button>
            <Button 
              onClick={handleSave}
              disabled={isSaving}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              {isSaving ? (
                <>
                  <span className="animate-spin mr-2">⏳</span>
                  Enregistrement...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Enregistrer
                </>
              )}
            </Button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Carte principale - Informations */}
        <Card className="lg:col-span-2 border-slate-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5 text-orange-500" />
              Informations personnelles
            </CardTitle>
            <CardDescription>
              Vos coordonnées et informations de base
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Avatar section */}
            <div className="flex items-center gap-6 pb-6 border-b border-slate-100">
              <div className="relative group">
                <Avatar className="w-24 h-24">
                  <AvatarImage src="" alt={profileData.fullName} />
                  <AvatarFallback className="bg-orange-100 text-orange-700 text-2xl font-bold">
                    {getInitials(profileData.fullName)}
                  </AvatarFallback>
                </Avatar>
                
                {isEditing && (
                  <button className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                    <Camera className="w-8 h-8 text-white" />
                  </button>
                )}
              </div>
              
              <div>
                <h3 className="text-xl font-semibold text-slate-900">{profileData.fullName}</h3>
                <Badge variant="secondary" className="mt-1">{profileData.role}</Badge>
                {isEditing && (
                  <p className="text-sm text-slate-500 mt-2">
                    Cliquez sur l&apos;avatar pour changer votre photo
                  </p>
                )}
              </div>
            </div>

            {/* Formulaire */}
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName" className="text-base font-medium">
                    Nom complet
                  </Label>
                  <Input
                    id="fullName"
                    value={profileData.fullName}
                    onChange={(e) => setProfileData(prev => ({ ...prev, fullName: e.target.value }))}
                    disabled={!isEditing}
                    className={`h-11 ${!isEditing ? 'bg-slate-50' : ''}`}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-base font-medium">
                    Email professionnel
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input
                      id="email"
                      type="email"
                      value={profileData.email}
                      onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                      disabled={!isEditing}
                      className={`h-11 pl-10 ${!isEditing ? 'bg-slate-50' : ''}`}
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-base font-medium">
                    Téléphone
                  </Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input
                      id="phone"
                      type="tel"
                      value={profileData.phone}
                      onChange={(e) => setProfileData(prev => ({ ...prev, phone: e.target.value }))}
                      disabled={!isEditing}
                      className={`h-11 pl-10 ${!isEditing ? 'bg-slate-50' : ''}`}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address" className="text-base font-medium">
                    Adresse
                  </Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input
                      id="address"
                      value={profileData.address}
                      onChange={(e) => setProfileData(prev => ({ ...prev, address: e.target.value }))}
                      disabled={!isEditing}
                      className={`h-11 pl-10 ${!isEditing ? 'bg-slate-50' : ''}`}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio" className="text-base font-medium">
                  Bio (optionnel)
                </Label>
                <Textarea
                  id="bio"
                  placeholder="Décrivez brièvement votre rôle et vos responsabilités..."
                  value={profileData.bio}
                  onChange={(e) => setProfileData(prev => ({ ...prev, bio: e.target.value }))}
                  disabled={!isEditing}
                  rows={3}
                  className={`resize-none ${!isEditing ? 'bg-slate-50' : ''}`}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Colonne latérale */}
        <div className="space-y-6">
          {/* Carte Organisation */}
          <Card className="border-slate-200">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Building2 className="w-5 h-5 text-orange-500" />
                Organisation
              </CardTitle>
            </CardHeader>
            
            <CardContent>
              <div className="bg-orange-50 rounded-xl p-4 text-center">
                <Building2 className="w-10 h-10 mx-auto text-orange-500 mb-2" />
                <p className="font-medium text-slate-900">{profileData.organization}</p>
                <p className="text-sm text-slate-500 mt-1">Structure de rattachement</p>
              </div>
              
              <Separator className="my-4" />
              
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-500">Rôle</span>
                  <span className="font-medium text-slate-700">{profileData.role}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Statut du compte</span>
                  <Badge className="bg-green-100 text-green-700 border-green-200">Actif</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Carte Sécurité */}
          <Card className="border-slate-200">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Shield className="w-5 h-5 text-orange-500" />
                Sécurité
              </CardTitle>
            </CardHeader>
            
            <CardContent className="space-y-3">
              <Button 
                variant="outline" 
                className="w-full justify-start gap-2"
                disabled
              >
                🔒 Changer le mot de passe
              </Button>
              
              <Button 
                variant="outline" 
                className="w-full justify-start gap-2 text-red-600 border-red-200 hover:bg-red-50"
              >
                🚪 Déconnexion
              </Button>
            </CardContent>
          </Card>

          {/* Info contact */}
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-4">
              <p className="text-sm text-blue-800 font-medium mb-1">
                Besoin d&apos;aide ?
              </p>
              <p className="text-sm text-blue-600">
                Contactez le support technique ou votre responsable administratif pour toute modification de votre organisation ou de votre rôle.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
