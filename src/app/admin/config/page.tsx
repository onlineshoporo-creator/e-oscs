'use client'

import React from 'react'
import { Settings, Database, Bell, Shield, Palette, Globe } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'

export default function ConfigPage() {
  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-slate-900">Configuration</h1>
          <p className="text-slate-500 mt-1">Paramètres généraux de la plateforme e-OSCS</p>
        </div>
        <Button className="gap-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700">
          Sauvegarder les changements
        </Button>
      </div>

      {/* Configuration sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Informations plateforme */}
        <Card className="border-slate-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Globe className="w-5 h-5 text-blue-500" />
              Informations plateforme
            </CardTitle>
            <CardDescription>Informations de base affichées sur la plateforme</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="platform-name">Nom de la plateforme</Label>
              <Input id="platform-name" defaultValue="e-OSCS" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="platform-description">Description</Label>
              <Textarea 
                id="platform-description" 
                defaultValue="Plateforme nationale de suivi des activités de solidarité et de cohésion sociale"
                rows={3}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="admin-email">Email admin</Label>
                <Input id="admin-email" type="email" defaultValue="admin@mcnslp.ci" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="support-phone">Téléphone support</Label>
                <Input id="support-phone" defaultValue="+225 27 22 XX XX XX" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card className="border-slate-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Bell className="w-5 h-5 text-orange-500" />
              Notifications
            </CardTitle>
            <CardDescription>Gestion des notifications automatiques</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50">
              <div>
                <p className="font-medium text-sm text-slate-700">Nouvelles demandes</p>
                <p className="text-xs text-slate-500">Notifier quand une nouvelle demande est reçue</p>
              </div>
              <Switch defaultChecked />
            </div>
            <Separator />
            <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50">
              <div>
                <p className="font-medium text-sm text-slate-700">Abonnements expirant</p>
                <p className="text-xs text-slate-500">Alerte 7 jours avant expiration</p>
              </div>
              <Switch defaultChecked />
            </div>
            <Separator />
            <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50">
              <div>
                <p className="font-medium text-sm text-slate-700">Rapports hebdomadaires</p>
                <p className="text-xs text-slate-500">Résumé par email chaque lundi</p>
              </div>
              <Switch />
            </div>
            <Separator />
            <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50">
              <div>
                <p className="font-medium text-sm text-slate-700">Notifications WhatsApp</p>
                <p className="text-xs text-slate-500">Intégration WhatsApp Business</p>
              </div>
              <Switch />
            </div>
          </CardContent>
        </Card>

        {/* Sécurité */}
        <Card className="border-slate-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Shield className="w-5 h-5 text-green-500" />
              Sécurité
            </CardTitle>
            <CardDescription>Paramètres de sécurité et authentification</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50">
              <div>
                <p className="font-medium text-sm text-slate-700">Authentification à deux facteurs</p>
                <p className="text-xs text-slate-500">Obligatoire pour les admins</p>
              </div>
              <Switch defaultChecked />
            </div>
            <Separator />
            <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50">
              <div>
                <p className="font-medium text-sm text-slate-700">Session timeout</p>
                <p className="text-xs text-slate-500">Déconnexion après inactivité</p>
              </div>
              <select className="rounded-md border border-slate-200 px-3 py-1.5 text-sm">
                <option value="30">30 minutes</option>
                <option value="60" selected>1 heure</option>
                <option value="120">2 heures</option>
                <option value="480">8 heures</option>
              </select>
            </div>
            <Separator />
            <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50">
              <div>
                <p className="font-medium text-sm text-slate-700">Journal d&apos;audit</p>
                <p className="text-xs text-slate-500">Enregistrer toutes les actions admin</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="space-y-2 pt-2">
              <Label htmlFor="allowed-ips">IPs autorisées (optionnel)</Label>
              <Textarea 
                id="allowed-ips" 
                placeholder="Une IP par ligne..."
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* Base de données */}
        <Card className="border-slate-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Database className="w-5 h-5 text-purple-500" />
              Base de données
            </CardTitle>
            <CardDescription>Informations et maintenance de la BDD</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 rounded-lg bg-slate-50 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">Statut connexion</span>
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                  ● Connectée
                </Badge>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">Dernière sauvegarde</span>
                <span className="text-sm font-medium text-slate-900">--</span>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">Taille estimée</span>
                <span className="text-sm font-medium text-slate-900">-- Mo</span>
              </div>
            </div>
            
            <div className="space-y-2">
              <Button variant="outline" className="w-full gap-2">
                <Database className="w-4 h-4" />
                Créer une sauvegarde
              </Button>
              <Button variant="outline" className="w-full gap-2 text-red-600 hover:bg-red-50">
                Réinitialiser les données démo
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Footer */}
      <Card className="border-slate-200 bg-slate-900 text-white">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="font-semibold flex items-center gap-2">
                <Settings className="w-5 h-5 text-orange-400" />
                Zone dangereuse
              </h3>
              <p className="text-sm text-slate-400 mt-1">
                Actions irréversibles sur la plateforme
              </p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" className="border-slate-600 text-white hover:bg-white/10">
                Vider le cache
              </Button>
              <Button variant="destructive" className="bg-red-600 hover:bg-red-700">
                Réinitialiser la plateforme
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
