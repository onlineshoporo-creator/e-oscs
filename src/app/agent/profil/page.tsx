'use client'

import React, { useState, useRef } from 'react'
import {
  User,
  Mail,
  Building2,
  Shield,
  Phone,
  MapPin,
  Save,
  Camera,
  Bell,
  Globe,
  Clock,
  Award,
  TrendingUp,
  CheckCircle2,
  Activity,
  LogOut,
  Lock,
  Eye,
  EyeOff,
  Loader2,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useToast } from '@/hooks/use-toast'

// Types
interface ProfileData {
  fullName: string
  email: string
  phone: string
  organization: string
  role: string
  bio: string
  address: string
}

interface Preferences {
  emailNotifications: boolean
  pushNotifications: boolean
  weeklyReport: boolean
  language: string
  timezone: string
}

interface LoginHistory {
  id: string
  date: string
  ip: string
  location: string
  device: string
  success: boolean
}

// Données mockées du profil
const initialProfileData: ProfileData = {
  fullName: 'Kouamé Jean-Baptiste',
  email: 'jean-baptiste.kouame@exemple.ci',
  phone: '+225 07 12 34 56 78',
  organization: 'Direction Régionale d\'Abidjan',
  role: 'Agent de terrain',
  bio: 'Agent de terrain spécialisé dans les activités de sensibilisation communautaire. Plus de 5 ans d\'expérience dans le domaine.',
  address: 'Abidjan, Yopougon',
}

// Statistiques mockées
const statsData = {
  totalActivites: 47,
  activitesMoisEnCours: 12,
  tauxValidation: 94,
  beneficiairesTotal: 1850,
  rang: 'Top 10%',
  badges: [
    { name: 'Agent actif', icon: '🔥', description: 'Plus de 30 activités' },
    { name: 'Validation rapide', icon: '⚡', description: 'Taux > 90%' },
    { name: 'Sensibilisateur', icon: '📢', label: 'SENSIBILISATION' },
  ],
}

// Historique des connexions
const loginHistory: LoginHistory[] = [
  {
    id: '1',
    date: "2025-01-15T09:30:00",
    ip: '192.168.1.xxx',
    location: 'Abidjan, Côte d\'Ivoire',
    device: 'Chrome / Windows',
    success: true,
  },
  {
    id: '2',
    date: "2025-01-14T14:22:00",
    ip: '192.168.1.xxx',
    location: 'Abidjan, Côte d\'Ivoire',
    device: 'Chrome / Android',
    success: true,
  },
  {
    id: '3',
    date: "2025-01-13T08:15:00",
    ip: '41.82.xxx.xxx',
    location: 'Abidjan, Côte d\'Ivoire',
    device: 'Safari / iOS',
    success: true,
  },
  {
    id: '4',
    date: "2025-01-12T16:45:00",
    ip: '41.82.xxx.xxx',
    location: 'Abidjan, Côte d\'Ivoire',
    device: 'Firefox / Windows',
    success: false,
  },
  {
    id: '5',
    date: "2025-01-11T10:00:00",
    ip: '192.168.1.xxx',
    location: 'Abidjan, Côte d\'Ivoire',
    device: 'Chrome / Windows',
    success: true,
  },
]

export default function ProfilPage() {
  const [profileData, setProfileData] = useState<ProfileData>(initialProfileData)
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [preferences, setPreferences] = useState<Preferences>({
    emailNotifications: true,
    pushNotifications: true,
    weeklyReport: false,
    language: 'fr',
    timezone: 'Africa/Abidjan',
  })
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
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

  // Gestion avatar upload
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: 'Fichier trop volumineux',
        description: 'L\'image ne doit pas dépasser 5MB.',
        variant: 'destructive',
      })
      return
    }

    const reader = new FileReader()
    reader.onloadend = () => {
      setAvatarPreview(reader.result as string)
      toast({
        title: 'Photo mise à jour',
        description: 'Votre photo de profil a été changée.',
      })
    }
    reader.readAsDataURL(file)
  }

  // Sauvegarder le profil
  const handleSave = async () => {
    setIsSaving(true)
    
    try {
      // Simuler la sauvegarde - en production, appel API
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      toast({
        title: 'Profil mis à jour ✅',
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

  // Sauvegarder les préférences
  const handleSavePreferences = async () => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      toast({
        title: 'Préférences enregistrées',
        description: 'Vos préférences ont été mises à jour.',
      })
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Impossible de sauvegarder les préférences.',
        variant: 'destructive',
      })
    }
  }

  // Formater la date relative
  function formatRelativeDate(dateStr: string): string {
    const date = new Date(dateStr)
    const now = new Date()
    const diffTime = now.getTime() - date.getTime()
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays === 0) return "Aujourd'hui"
    if (diffDays === 1) return "Hier"
    if (diffDays < 7) return `Il y a ${diffDays} jours`
    return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })
  }

  // Formater l'heure
  function formatTime(dateStr: string): string {
    return new Date(dateStr).toLocaleTimeString('fr-FR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    })
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* En-tête */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-slate-900">Mon profil</h1>
          <p className="text-slate-500 mt-1">
            Gérez vos informations et préférences.
          </p>
        </div>
        
        {!isEditing ? (
          <Button 
            onClick={() => setIsEditing(true)}
            className="bg-[#F77F00] hover:bg-[#E67300] text-white gap-2"
          >
            <User className="w-4 h-4" />
            Modifier le profil
          </Button>
        ) : (
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              onClick={() => {
                setIsEditing(false)
                setAvatarPreview(null)
              }}
            >
              Annuler
            </Button>
            <Button 
              onClick={handleSave}
              disabled={isSaving}
              className="bg-[#009E60] hover:bg-green-700 text-white gap-2"
            >
              {isSaving ? (
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
        )}
      </div>

      {/* Onglets principaux */}
      <Tabs defaultValue="informations" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 bg-slate-100 p-1 rounded-xl">
          <TabsTrigger value="informations" className="gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-lg">
            <User className="w-4 h-4" />
            <span className="hidden sm:inline">Informations</span>
          </TabsTrigger>
          <TabsTrigger value="statistiques" className="gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-lg">
            <Activity className="w-4 h-4" />
            <span className="hidden sm:inline">Statistiques</span>
          </TabsTrigger>
          <TabsTrigger value="preferences" className="gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-lg">
            <Bell className="w-4 h-4" />
            <span className="hidden sm:inline">Préférences</span>
          </TabsTrigger>
          <TabsTrigger value="securite" className="gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-lg">
            <Shield className="w-4 h-4" />
            <span className="hidden sm:inline">Sécurité</span>
          </TabsTrigger>
        </TabsList>

        {/* Onglet Informations */}
        <TabsContent value="informations" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Carte principale - Informations */}
            <Card className="lg:col-span-2 border-slate-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5 text-[#F77F00]" />
                  Informations personnelles
                </CardTitle>
                <CardDescription>
                  Vos coordonnées et informations de base
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-6">
                {/* Avatar section */}
                <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-slate-100">
                  <div className="relative group">
                    <Avatar className="w-28 h-28 ring-4 ring-orange-100">
                      <AvatarImage src={avatarPreview || undefined} alt={profileData.fullName} />
                      <AvatarFallback className="bg-gradient-to-br from-[#F77F00] to-[#E67300] text-white text-3xl font-bold">
                        {getInitials(profileData.fullName)}
                      </AvatarFallback>
                    </Avatar>
                    
                    {(isEditing || !avatarPreview) && (
                      <>
                        <input
                          type="file"
                          ref={fileInputRef}
                          onChange={handleAvatarChange}
                          accept="image/*"
                          className="hidden"
                        />
                        <button
                          onClick={() => fileInputRef.current?.click()}
                          className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                        >
                          <Camera className="w-8 h-8 text-white" />
                        </button>
                      </>
                    )}
                    
                    {avatarPreview && isEditing && (
                      <button
                        onClick={() => setAvatarPreview(null)}
                        className="absolute -top-2 -right-2 w-7 h-7 bg-red-500 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-red-600 transition-colors"
                      >
                        ×
                      </button>
                    )}
                  </div>
                  
                  <div className="text-center sm:text-left">
                    <h3 className="text-xl font-semibold text-slate-900">{profileData.fullName}</h3>
                    <Badge variant="secondary" className="mt-2 bg-[#F77F00]/10 text-[#F77F00] border-[#F77F00]/20">
                      {profileData.role}
                    </Badge>
                    {isEditing && (
                      <p className="text-sm text-slate-500 mt-3">
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
                    <Building2 className="w-5 h-5 text-[#F77F00]" />
                    Organisation
                  </CardTitle>
                </CardHeader>
                
                <CardContent>
                  <div className="bg-gradient-to-br from-[#F77F00]/10 to-orange-50 rounded-xl p-4 text-center">
                    <Building2 className="w-12 h-12 mx-auto text-[#F77F00] mb-3" />
                    <p className="font-semibold text-slate-900">{profileData.organization}</p>
                    <p className="text-sm text-slate-500 mt-1">Structure de rattachement</p>
                  </div>
                  
                  <Separator className="my-4" />
                  
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Rôle</span>
                      <span className="font-medium text-slate-700">{profileData.role}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Statut compte</span>
                      <Badge className="bg-green-100 text-green-700 border-green-200">
                        <CheckCircle2 className="w-3 h-3 mr-1" />
                        Actif
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Membre depuis</span>
                      <span className="font-medium text-slate-700">Jan. 2023</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Badges */}
              <Card className="border-slate-200">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Award className="w-5 h-5 text-yellow-500" />
                    Badges
                  </CardTitle>
                </CardHeader>
                
                <CardContent className="space-y-3">
                  {statsData.badges.map((badge, index) => (
                    <div key={index} className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 transition-colors">
                      <span className="text-2xl">{badge.icon}</span>
                      <div>
                        <p className="font-medium text-sm text-slate-900">{badge.name}</p>
                        <p className="text-xs text-slate-500">{badge.description}</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Onglet Statistiques */}
        <TabsContent value="statistiques" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="border-slate-200">
              <CardContent className="p-5 text-center">
                <div className="w-12 h-12 mx-auto rounded-xl bg-[#F77F00]/10 flex items-center justify-center mb-3">
                  <Activity className="w-6 h-6 text-[#F77F00]" />
                </div>
                <p className="text-3xl font-bold text-slate-900">{statsData.totalActivites}</p>
                <p className="text-sm text-slate-500">Total activités</p>
              </CardContent>
            </Card>

            <Card className="border-slate-200">
              <CardContent className="p-5 text-center">
                <div className="w-12 h-12 mx-auto rounded-xl bg-blue-100 flex items-center justify-center mb-3">
                  <Clock className="w-6 h-6 text-blue-600" />
                </div>
                <p className="text-3xl font-bold text-slate-900">{statsData.activitesMoisEnCours}</p>
                <p className="text-sm text-slate-500">Ce mois-ci</p>
              </CardContent>
            </Card>

            <Card className="border-slate-200">
              <CardContent className="p-5 text-center">
                <div className="w-12 h-12 mx-auto rounded-xl bg-green-100 flex items-center justify-center mb-3">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                </div>
                <p className="text-3xl font-bold text-slate-900">{statsData.tauxValidation}%</p>
                <p className="text-sm text-slate-500">Taux validation</p>
              </CardContent>
            </Card>

            <Card className="border-slate-200">
              <CardContent className="p-5 text-center">
                <div className="w-12 h-12 mx-auto rounded-xl bg-purple-100 flex items-center justify-center mb-3">
                  <Users className="w-6 h-6 text-purple-600" />
                </div>
                <p className="text-3xl font-bold text-slate-900">{statsData.beneficiairesTotal.toLocaleString()}</p>
                <p className="text-sm text-slate-500">Bénéficiaires</p>
              </CardContent>
            </Card>
          </div>

          {/* Graphiques et détails */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Performance */}
            <Card className="border-slate-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-[#009E60]" />
                  Performance mensuelle
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { month: 'Janvier', value: 12, max: 15 },
                  { month: 'Décembre', value: 18, max: 20 },
                  { month: 'Novembre', value: 15, max: 20 },
                  { month: 'Octobre', value: 10, max: 15 },
                  { month: 'Septembre', value: 8, max: 12 },
                ].map((item, index) => (
                  <div key={index} className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">{item.month}</span>
                      <span className="font-medium text-slate-900">{item.value} activités</span>
                    </div>
                    <Progress value={(item.value / item.max) * 100} className="h-2" />
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Classement */}
            <Card className="border-slate-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-yellow-500" />
                  Mon classement
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center py-6">
                  <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 text-white text-3xl font-bold shadow-lg shadow-orange-500/30 mb-4">
                    🏆
                  </div>
                  <p className="text-3xl font-bold text-slate-900">{statsData.rang}</p>
                  <p className="text-sm text-slate-500 mt-1">parmi tous les agents</p>
                </div>

                <Separator />

                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                    <div className="flex items-center gap-3">
                      <span className="text-lg">🥇</span>
                      <div>
                        <p className="font-medium text-sm">Koné Ibrahim</p>
                        <p className="text-xs text-slate-500">52 activités ce mois</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-200">
                    <div className="flex items-center gap-3">
                      <span className="text-lg">🥈</span>
                      <div>
                        <p className="font-medium text-sm">Yao Aminata</p>
                        <p className="text-xs text-slate-500">48 activités ce mois</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg border border-[#F77F00]/30">
                    <div className="flex items-center gap-3">
                      <span className="text-lg">🥉</span>
                      <div>
                        <p className="font-medium text-sm text-[#F77F00]">Vous</p>
                        <p className="text-xs text-slate-500">{statsData.activitesMoisEnCours} activités ce mois</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Onglet Préférences */}
        <TabsContent value="preferences" className="space-y-6">
          <Card className="border-slate-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-[#F77F00]" />
                Notifications
              </CardTitle>
              <CardDescription>
                Gérez comment vous recevez les notifications
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-slate-500" />
                  <div>
                    <p className="font-medium text-slate-900">Notifications par email</p>
                    <p className="text-sm text-slate-500">Recevoir un email pour chaque notification importante</p>
                  </div>
                </div>
                <Switch
                  checked={preferences.emailNotifications}
                  onCheckedChange={(checked) => setPreferences(p => ({ ...p, emailNotifications: checked }))}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <Bell className="w-5 h-5 text-slate-500" />
                  <div>
                    <p className="font-medium text-slate-900">Notifications push</p>
                    <p className="text-sm text-slate-500">Recevoir des notifications dans le navigateur</p>
                  </div>
                </div>
                <Switch
                  checked={preferences.pushNotifications}
                  onCheckedChange={(checked) => setPreferences(p => ({ ...p, pushNotifications: checked }))}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <Activity className="w-5 h-5 text-slate-500" />
                  <div>
                    <p className="font-medium text-slate-900">Rapport hebdomadaire</p>
                    <p className="text-sm text-slate-500">Récapitulatif de vos activités chaque lundi</p>
                  </div>
                </div>
                <Switch
                  checked={preferences.weeklyReport}
                  onCheckedChange={(checked) => setPreferences(p => ({ ...p, weeklyReport: checked }))}
                />
              </div>

              <div className="pt-4">
                <Button onClick={handleSavePreferences} className="bg-[#009E60] hover:bg-green-700">
                  Sauvegarder les préférences
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="w-5 h-5 text-blue-500" />
                Langue & Régionalisation
              </CardTitle>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Langue de l&apos;interface</Label>
                  <Select value={preferences.language} onValueChange={(v) => setPreferences(p => ({ ...p, language: v }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fr">🇫🇷 Français</SelectItem>
                      <SelectItem value="en">🇬🇧 English</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Fuseau horaire</Label>
                  <Select value={preferences.timezone} onValueChange={(v) => setPreferences(p => ({ ...p, timezone: v }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Africa/Abidjan">🇨🇵 GMT+00:00 Abidjan</SelectItem>
                      <SelectItem value="Africa/Dakar">🇸🇳 GMT+00:00 Dakar</SelectItem>
                      <SelectItem value="Europe/Paris">🇫🇷 GMT+01:00 Paris</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Onglet Sécurité */}
        <TabsContent value="securite" className="space-y-6">
          <Card className="border-slate-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="w-5 h-5 text-red-500" />
                Mot de passe
              </CardTitle>
              <CardDescription>
                Changez votre mot de passe régulièrement pour sécuriser votre compte
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Mot de passe actuel</Label>
                  <Input type="password" placeholder="••••••••" />
                </div>
                <div className="space-y-2">
                  <Label>Nouveau mot de passe</Label>
                  <Input type="password" placeholder="••••••••" />
                </div>
                <div className="space-y-2">
                  <Label>Confirmer le mot de passe</Label>
                  <Input type="password" placeholder="••••••••" />
                </div>
              </div>
              
              <Button className="bg-blue-600 hover:bg-blue-700">
                Mettre à jour le mot de passe
              </Button>
            </CardContent>
          </Card>

          <Card className="border-slate-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-slate-500" />
                Historique des connexions
              </CardTitle>
              <CardDescription>
                Consultez vos dernières connexions à votre compte
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <div className="space-y-3">
                {loginHistory.map((login) => (
                  <div 
                    key={login.id} 
                    className={`flex items-center justify-between p-4 rounded-xl ${
                      login.success ? 'bg-slate-50' : 'bg-red-50 border border-red-200'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        login.success ? 'bg-green-100' : 'bg-red-100'
                      }`}>
                        {login.success ? (
                          <CheckCircle2 className="w-5 h-5 text-green-600" />
                        ) : (
                          <X className="w-5 h-5 text-red-600" />
                        )}
                      </div>
                      
                      <div>
                        <p className={`font-medium ${login.success ? 'text-slate-900' : 'text-red-700'}`}>
                          {formatRelativeDate(login.date)} à {formatTime(login.date)}
                        </p>
                        <p className="text-sm text-slate-500">
                          {login.device} · {login.location}
                        </p>
                      </div>
                    </div>
                    
                    {!login.success && (
                      <Badge variant="destructive" className="text-xs">Échec</Badge>
                    )}
                  </div>
                ))}
              </div>
              
              <p className="text-xs text-slate-400 mt-4 text-center">
                Les adresses IP sont partiellement masquées pour protéger votre vie privée.
              </p>
            </CardContent>
          </Card>

          <Card className="border-red-200 bg-red-50/50">
            <CardContent className="p-4 flex items-start gap-3">
              <LogOut className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium text-red-800">Zone dangereuse</p>
                <p className="text-sm text-red-600 mt-1">
                  La suppression de votre compte est irréversible. Toutes vos données seront perdues définitivement.
                </p>
                <Button variant="destructive" size="sm" className="mt-3">
                  Supprimer mon compte
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

// Import Users icon for statistics
function Users(props: React.SVGProps<SVGSVGElement> & { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
      <circle cx="9" cy="7" r="4"/>
      <path d="M22 21v-2a4 4 0 0 0-3-3.87"/>
      <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
    </svg>
  )
}

// X icon for failed logins
function X(props: React.SVGProps<SVGSVGElement> & { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <line x1="18" y1="6" x2="6" y2="18"/>
      <line x1="6" y1="6" x2="18" y2="18"/>
    </svg>
  )
}
