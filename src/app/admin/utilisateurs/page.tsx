'use client'

import React from 'react'
import { Users, Settings, Wrench } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'

export default function UtilisateursPage() {
  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-slate-900">Utilisateurs</h1>
          <p className="text-slate-500 mt-1">Gérez les comptes utilisateurs de la plateforme</p>
        </div>
        <Button className="gap-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700">
          <Users className="w-4 h-4" />
          Nouvel utilisateur
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card className="border-slate-200">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 rounded-xl bg-blue-100 text-blue-600">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">--</p>
              <p className="text-xs text-slate-500">Total utilisateurs</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-slate-200">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 rounded-xl bg-green-100 text-green-600">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">--</p>
              <p className="text-xs text-slate-500">Actifs</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-slate-200">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 rounded-xl bg-purple-100 text-purple-600">
              <Settings className="w-6 h-6" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">--</p>
              <p className="text-xs text-slate-500">Admins</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-slate-200">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 rounded-xl bg-amber-100 text-amber-600">
              <Wrench className="w-6 h-6" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">--</p>
              <p className="text-xs text-slate-500">En attente</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Coming soon */}
      <Card className="border-slate-200">
        <CardContent className="py-16 text-center">
          <Users className="w-16 h-16 text-slate-200 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-700 mb-2">Bientôt disponible</h3>
          <p className="text-slate-500 max-w-md mx-auto">
            La gestion des utilisateurs sera disponible dans une prochaine mise à jour. 
            Pour l&apos;instant, vous pouvez gérer les utilisateurs via le dashboard Supabase.
          </p>
          <Badge variant="secondary" className="mt-4">v1.1.0 prévu</Badge>
        </CardContent>
      </Card>
    </div>
  )
}
