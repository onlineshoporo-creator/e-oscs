'use client'

import React, { useState } from 'react'
import {
  Settings,
  User,
  Bell,
  Shield,
  Palette,
  Database,
  Save,
  Camera,
  Lock,
  Globe,
  Building2,
  CheckCircle2
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Switch } from '@/components/ui/switch'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/hooks/use-toast'

export default function SettingsPage() {
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    rapports: false,
    validation: true,
    activites: false,
  })
  
  const [isSaving, setIsSaving] = useState(false)
  const { toast } = useToast()

  // Données utilisateur simulées (seront remplacées par les vraies données Supabase)
  const userData = {
    name: 'Admin MCNSLP',
    email: 'admin@mcnslp.ci',
    role: 'SUPER_ADMIN',
    avatar: null,
    organization: 'Ministère MCNSLP',
    organizationType: 'DR',
    createdAt: '2025-01-01',
    lastLogin: '2026-02-03T10:30:00Z',
  }

  const handleSave = async (section: string) => {
    setIsSaving(true)
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      toast({
        title: '✅ Modifications sauvegardées',
        description: `Les paramètres de ${section} ont été mis à jour.`,
      })
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Une erreur est survenue lors de la sauvegarde.',
        variant: 'destructive',
      })
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Paramètres</h1>
        <p className="text-slate-500 mt-1">
          Gérez votre profil et les préférences du système
        </p>
      </div>

      <Tabs defaultValue="profil" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 lg:w-auto lg:inline-grid lg:grid-cols-4">
          <TabsTrigger value="profil" className="gap-2">
            <User className="w-4 h-4" />
            Profil
          </TabsTrigger>
          <TabsTrigger value="notifications" className="gap-2">
            <Bell className="w-4 h-4" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="securite" className="gap-2">
            <Shield className="w-4 h-4" />
            Sécurité
          </TabsTrigger>
          <TabsTrigger value="systeme" className="gap-2">
            <Database className="w-4 h-4" />
            Système
          </TabsTrigger>
        </TabsList>

        {/* Onglet Profil */}
        <TabsContent value="profil" className="space-y-6">
          {/* Carte profil principale */}
          <Card className="border-slate-200">
            <CardHeader>
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <User className="w-5 h-5 text-orange-500" />
                Informations personnelles
              </CardTitle>
              <CardDescription>
                Mettez à jour vos informations de profil
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Avatar */}
              <div className="flex items-center gap-6 p-4 bg-slate-50 rounded-xl">
                <Avatar className="w-24 h-24 ring-4 ring-white shadow-lg">
                  <AvatarImage src={userData.avatar || ''} alt={userData.name} />
                  <AvatarFallback className="bg-gradient-to-br from-orange-400 to-orange-600 text-white text-2xl font-bold">
                    {userData.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg text-slate-900">{userData.name}</h3>
                  <p className="text-sm text-slate-500">{userData.email}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant="secondary" className="bg-purple-100 text-purple-700">
                      {userData.role === 'SUPER_ADMIN' ? 'Super Admin' : 
                       userData.role === 'PROPRIETAIRE' ? 'Propriétaire' : userData.role}
                    </Badge>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="gap-2">
                  <Camera className="w-4 h-4" />
                  Changer
                </Button>
              </div>

              <Separator />

              {/* Formulaire profil */}
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="nom">Nom complet</Label>
                  <Input id="nom" defaultValue={userData.name} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" defaultValue={userData.email} disabled 
                    className="bg-slate-50 cursor-not-allowed" />
                  <p className="text-xs text-slate-400">L&apos;email ne peut pas être modifié</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="telephone">Téléphone</Label>
                  <Input id="telephone" type="tel" placeholder="+225 XX XX XX XX" defaultValue="+225 0712345678" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role">Rôle</Label>
                  <Select defaultValue={userData.role}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="SUPER_ADMIN">Super Administrateur</SelectItem>
                      <SelectItem value="PROPRIETAIRE">Propriétaire</SelectItem>
                      <SelectItem value="AGENT">Agent</SelectItem>
                      <SelectItem value="LECTEUR">Lecteur</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex justify-end pt-4 border-t border-slate-100">
                <Button 
                  className="gap-2 bg-orange-500 hover:bg-orange-600"
                  onClick={() => handleSave('profil')}
                  disabled={isSaving}
                >
                  {isSaving ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Sauvegarde...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      Sauvegarder
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Organisation */}
          <Card className="border-slate-200">
            <CardHeader>
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <Building2 className="w-5 h-5 text-blue-500" />
                Mon organisation
              </CardTitle>
              <CardDescription>
                Informations de votre organisation (lecture seule)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="p-4 bg-blue-50/50 rounded-xl border border-blue-100 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-xs text-slate-500">Organisation</Label>
                    <p className="font-medium text-slate-900 mt-0.5">{userData.organization}</p>
                  </div>
                  <div>
                    <Label className="text-xs text-slate-500">Type</Label>
                    <Badge variant="outline" className="mt-0.5 bg-white">
                      {userData.organizationType === 'DR' ? 'Direction Régionale' : 'Direction Départementale'}
                    </Badge>
                  </div>
                  <div>
                    <Label className="text-xs text-slate-500">Membre depuis</Label>
                    <p className="font-medium text-slate-900 mt-0.5">
                      {new Date(userData.createdAt).toLocaleDateString('fr-FR', { 
                        day: 'numeric', month: 'long', year: 'numeric' 
                      })}
                    </p>
                  </div>
                  <div>
                    <Label className="text-xs text-slate-500">Dernière connexion</Label>
                    <p className="font-medium text-slate-900 mt-0.5">
                      {new Date(userData.lastLogin).toLocaleDateString('fr-FR', { 
                        day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' 
                      })}
                    </p>
                  </div>
                </div>

                <div className="pt-3 border-t border-blue-100">
                  <div className="flex items-center gap-2 text-sm text-green-700 bg-green-50 p-3 rounded-lg">
                    <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                    <span>Abonnement actif • Plan Professionnel</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Onglet Notifications */}
        <TabsContent value="notifications" className="space-y-6">
          <Card className="border-slate-200">
            <CardHeader>
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <Bell className="w-5 h-5 text-purple-500" />
                Préférences de notification
              </CardTitle>
              <CardDescription>
                Choisissez comment vous souhaitez être notifié
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors">
                  <div className="space-y-0.5 flex-1 mr-4">
                    <p className="font-medium text-slate-900">Notifications par email</p>
                    <p className="text-sm text-slate-500">
                      Recevez les notifications importantes par email
                    </p>
                  </div>
                  <Switch 
                    checked={notifications.email}
                    onCheckedChange={(checked) => setNotifications({...notifications, email: checked})}
                  />
                </div>

                <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors">
                  <div className="space-y-0.5 flex-1 mr-4">
                    <p className="font-medium text-slate-900">Notifications push</p>
                    <p className="text-sm text-slate-500">
                      Recevez les notifications en temps réel dans le navigateur
                    </p>
                  </div>
                  <Switch 
                    checked={notifications.push}
                    onCheckedChange={(checked) => setNotifications({...notifications, push: checked})}
                  />
                </div>

                <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors">
                  <div className="space-y-0.5 flex-1 mr-4">
                    <p className="font-medium text-slate-900">Rapports automatiques</p>
                    <p className="text-sm text-slate-500">
                      Recevez les rapports générés automatiquement
                    </p>
                  </div>
                  <Switch 
                    checked={notifications.rapports}
                    onCheckedChange={(checked) => setNotifications({...notifications, rapports: checked})}
                  />
                </div>

                <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors">
                  <div className="space-y-0.5 flex-1 mr-4">
                    <p className="font-medium text-slate-900">Alertes de validation</p>
                    <p className="text-sm text-slate-500">
                      Soyez alerté lorsqu&apos;une activité attend votre validation
                    </p>
                  </div>
                  <Switch 
                    checked={notifications.validation}
                    onCheckedChange={(checked) => setNotifications({...notifications, validation: checked})}
                  />
                </div>

                <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors">
                  <div className="space-y-0.5 flex-1 mr-4">
                    <p className="font-medium text-slate-900">Nouvelles activités</p>
                    <p className="text-sm text-slate-500">
                      Soyez informé des nouvelles activités créées
                    </p>
                  </div>
                  <Switch 
                    checked={notifications.activites}
                    onCheckedChange={(checked) => setNotifications({...notifications, activites: checked})}
                  />
                </div>
              </div>

              <Separator />

              <div className="flex justify-end">
                <Button 
                  className="gap-2 bg-orange-500 hover:bg-orange-600"
                  onClick={() => handleSave('notifications')}
                  disabled={isSaving}
                >
                  <Save className="w-4 h-4" />
                  Sauvegarder
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Onglet Sécurité */}
        <TabsContent value="securite" className="space-y-6">
          <Card className="border-slate-200">
            <CardHeader>
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <Lock className="w-5 h-5 text-green-500" />
                Changer le mot de passe
              </CardTitle>
              <CardDescription>
                Assurez-vous que votre mot de passe est sécurisé
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="current-password">Mot de passe actuel</Label>
                <Input id="current-password" type="password" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-password">Nouveau mot de passe</Label>
                <Input id="new-password" type="password" />
                <p className="text-xs text-slate-400">
                  Minimum 8 caractères, une majuscule, un chiffre et un caractère spécial
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirmer le mot de passe</Label>
                <Input id="confirm-password" type="password" />
              </div>

              <div className="flex justify-end pt-4 border-t border-slate-100">
                <Button 
                  className="gap-2 bg-green-600 hover:bg-green-700"
                  onClick={() => handleSave('mot de passe')}
                  disabled={isSaving}
                >
                  <Lock className="w-4 h-4" />
                  Mettre à jour
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-200">
            <CardHeader>
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <Shield className="w-5 h-5 text-red-500" />
                Sessions actives
              </CardTitle>
              <CardDescription>
                Gérez vos sessions connectées
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-4 rounded-xl bg-green-50 border border-green-200">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                      <CheckCircle2 className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium text-sm text-slate-900">Session actuelle</p>
                      <p className="text-xs text-slate-500">Abidjan, Côte d&apos;Ivoire • Chrome • Maintenant</p>
                    </div>
                  </div>
                  <Badge variant="secondary" className="bg-green-100 text-green-700">
                    Actif
                  </Badge>
                </div>
              </div>
              
              <Button variant="destructive" size="sm" className="mt-4 gap-2">
                <Shield className="w-4 h-4" />
                Déconnecter toutes les autres sessions
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Onglet Système */}
        <TabsContent value="systeme" className="space-y-6">
          <Card className="border-slate-200">
            <CardHeader>
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <Palette className="w-5 h-5 text-indigo-500" />
                Configuration système
              </CardTitle>
              <CardDescription>
                Paramètres avancés de la plateforme
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label className="flex items-center gap-1.5">
                    <Globe className="w-4 h-4" />
                    Langue de l&apos;interface
                  </Label>
                  <Select defaultValue="fr">
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
                  <Select defaultValue="abidjan">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="abidjan">🇨🇮 Abidjan (GMT+0)</SelectItem>
                      <SelectItem value="paris">🇫🇷 Paris (GMT+1)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Format de date</Label>
                  <Select defaultValue="ddmmyyyy">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ddmmyyyy">DD/MM/YYYY</SelectItem>
                      <SelectItem value="mmddyyyy">MM/DD/YYYY</SelectItem>
                      <SelectItem value="yyyymmdd">YYYY-MM-DD</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Devise</Label>
                  <Select defaultValue="xof">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="xof">XOF (FCFA)</SelectItem>
                      <SelectItem value="eur">EUR (€)</SelectItem>
                      <SelectItem value="usd">USD ($)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Separator />

              <div className="p-4 rounded-xl bg-indigo-50 border border-indigo-200">
                <p className="text-sm font-medium text-indigo-800 flex items-center gap-2">
                  <Database className="w-4 h-4" />
                  Connexion Base de Données
                </p>
                <p className="text-xs text-indigo-600 mt-1">
                  Projet Supabase: csxmenqbajhxjxezcjee
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                  <span className="text-xs text-green-700 font-medium">Connecté</span>
                </div>
              </div>

              <div className="flex justify-end pt-4 border-t border-slate-100">
                <Button 
                  className="gap-2 bg-orange-500 hover:bg-orange-600"
                  onClick={() => handleSave('système')}
                  disabled={isSaving}
                >
                  <Save className="w-4 h-4" />
                  Sauvegarder
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
