'use client'

import React, { useState } from 'react'
import {
  Settings,
  User,
  Bell,
  Shield,
  Palette,
  Database,
  Save
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

export default function SettingsPage() {
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    rapports: false,
    validation: true,
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Paramètres</h1>
        <p className="text-slate-500 mt-1">
          Gérez vos préférences et la configuration du système
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
          <Card>
            <CardHeader>
              <CardTitle>Informations personnelles</CardTitle>
              <CardDescription>
                Mettez à jour vos informations de profil
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Avatar */}
              <div className="flex items-center gap-4">
                <Avatar className="w-20 h-20">
                  <AvatarImage src="" alt="Avatar" />
                  <AvatarFallback className="bg-orange-100 text-orange-700 text-xl font-medium">
                    AM
                  </AvatarFallback>
                </Avatar>
                <div>
                  <Button variant="outline" size="sm">Changer l'avatar</Button>
                  <p className="text-xs text-slate-500 mt-1">JPG, PNG. Max 2MB.</p>
                </div>
              </div>

              <Separator />

              {/* Formulaire */}
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="nom">Nom complet</Label>
                  <Input id="nom" defaultValue="Admin MCNSLP" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" defaultValue="admin@mcnslp.ci" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="telephone">Téléphone</Label>
                  <Input id="telephone" type="tel" defaultValue="+225 0576103277" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role">Rôle</Label>
                  <Select defaultValue="admin">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Administrateur</SelectItem>
                      <SelectItem value="gestionnaire">Gestionnaire</SelectItem>
                      <SelectItem value="validateur">Validateur</SelectItem>
                      <SelectItem value="observateur">Observateur</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="organisation">Organisation</Label>
                  <Select defaultValue="org-001">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="org-001">Ministère MCNSLP</SelectItem>
                      <SelectItem value="org-002">Direction de la Planification</SelectItem>
                      <SelectItem value="org-003">Direction des Programmes Sociaux</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex justify-end">
                <Button className="gap-2 bg-orange-500 hover:bg-orange-600">
                  <Save className="w-4 h-4" />
                  Sauvegarder
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Onglet Notifications */}
        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Préférences de notification</CardTitle>
              <CardDescription>
                Choisissez comment vous souhaitez être notifié
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-lg bg-slate-50">
                  <div className="space-y-0.5">
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

                <div className="flex items-center justify-between p-4 rounded-lg bg-slate-50">
                  <div className="space-y-0.5">
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

                <div className="flex items-center justify-between p-4 rounded-lg bg-slate-50">
                  <div className="space-y-0.5">
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

                <div className="flex items-center justify-between p-4 rounded-lg bg-slate-50">
                  <div className="space-y-0.5">
                    <p className="font-medium text-slate-900">Alertes de validation</p>
                    <p className="text-sm text-slate-500">
                      Soyez alerté lorsqu'une activité attend votre validation
                    </p>
                  </div>
                  <Switch 
                    checked={notifications.validation}
                    onCheckedChange={(checked) => setNotifications({...notifications, validation: checked})}
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <Button className="gap-2 bg-orange-500 hover:bg-orange-600">
                  <Save className="w-4 h-4" />
                  Sauvegarder
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Onglet Sécurité */}
        <TabsContent value="securite" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Changer le mot de passe</CardTitle>
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
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirmer le mot de passe</Label>
                <Input id="confirm-password" type="password" />
              </div>

              <div className="flex justify-end">
                <Button className="gap-2 bg-orange-500 hover:bg-orange-600">
                  <Save className="w-4 h-4" />
                  Mettre à jour
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Sessions actives</CardTitle>
              <CardDescription>
                Gérez vos sessions connectées
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-lg bg-green-50 border border-green-200">
                  <div>
                    <p className="font-medium text-sm">Session actuelle - Abidjan, CI</p>
                    <p className="text-xs text-slate-500">Chrome • Maintenant</p>
                  </div>
                  <Badge variant="secondary" className="bg-green-100 text-green-700">
                    Actif
                  </Badge>
                </div>
              </div>
              <Button variant="destructive" size="sm" className="mt-4">
                Déconnecter toutes les autres sessions
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Onglet Système */}
        <TabsContent value="systeme" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Configuration système</CardTitle>
              <CardDescription>
                Paramètres avancés de la plateforme
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Langue de l'interface</Label>
                  <Select defaultValue="fr">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fr">Français</SelectItem>
                      <SelectItem value="en">English</SelectItem>
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
                      <SelectItem value="abidjan">Abidjan (GMT+0)</SelectItem>
                      <SelectItem value="paris">Paris (GMT+1)</SelectItem>
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

              <div className="p-4 rounded-lg bg-blue-50 border border-blue-200">
                <p className="text-sm font-medium text-blue-800">Connexion Supabase</p>
                <p className="text-xs text-blue-600 mt-1">
                  Projet: csxmenqbajhxjxezcjee • Statut: Connecté
                </p>
              </div>

              <div className="flex justify-end">
                <Button className="gap-2 bg-orange-500 hover:bg-orange-600">
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
