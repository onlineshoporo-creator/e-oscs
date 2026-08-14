'use client'

import React from 'react'
import Link from 'next/link'
import {
  Building2,
  Users,
  TrendingUp,
  Plus,
  MoreVertical,
  MapPin,
  Edit3
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { organisations, ORGANISATION_TYPES } from '@/lib/mock/activites'

export default function OrganisationsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Organisations</h1>
          <p className="text-slate-500 mt-1">
            Gestion des structures et directions
          </p>
        </div>
        <Button className="gap-2 bg-orange-500 hover:bg-orange-600">
          <Plus className="w-4 h-4" />
          Nouvelle organisation
        </Button>
      </div>

      {/* Stats globales */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-purple-100">
              <Building2 className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-xl font-bold text-slate-900">{organisations.length}</p>
              <p className="text-xs text-slate-500">Organisations</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-100">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-xl font-bold text-slate-900">
                {organisations.reduce((sum, o) => sum + o.activitesCount, 0)}
              </p>
              <p className="text-xs text-slate-500">Activités totales</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-green-100">
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-xl font-bold text-slate-900">
                {Math.round(organisations.reduce((sum, o) => sum + o.tauxExecution, 0) / organisations.length)}%
              </p>
              <p className="text-xs text-slate-500">Exécution moyenne</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-orange-100">
              <MapPin className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <p className="text-xl font-bold text-slate-900">CI</p>
              <p className="text-xs text-slate-500">Pays</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Liste des organisations */}
      <div className="space-y-4">
        {organisations.map((org) => (
          <Card key={org.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between gap-4">
                {/* Contenu principal */}
                <div className="flex items-start gap-4 flex-1 min-w-0">
                  {/* Icône */}
                  <div className={`p-4 rounded-xl ${
                    ORGANISATION_TYPES[org.type]?.color || 'bg-slate-100'
                  }`}>
                    <Building2 className="w-8 h-8" />
                  </div>

                  {/* Infos */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-lg text-slate-900">{org.nom}</h3>
                      <Badge variant="secondary" className={
                        ORGANISATION_TYPES[org.type]?.color
                      }>
                        {ORGANISATION_TYPES[org.type]?.label}
                      </Badge>
                    </div>
                    <p className="text-sm text-slate-500 mb-3 line-clamp-2">
                      {org.description}
                    </p>

                    {org.parentNom && (
                      <p className="text-xs text-slate-400 mb-3">
                        Rattaché à : {org.parentNom}
                      </p>
                    )}

                    {/* Métriques */}
                    <div className="flex items-center gap-6">
                      <div>
                        <span className="text-sm text-slate-500">Activités</span>
                        <p className="font-semibold text-slate-900">{org.activitesCount}</p>
                      </div>
                      <div className="flex-1 max-w-[200px]">
                        <div className="flex items-center justify-between text-sm mb-1">
                          <span className="text-slate-500">Taux exécution</span>
                          <span className="font-medium text-slate-700">{org.tauxExecution}%</span>
                        </div>
                        <Progress value={org.tauxExecution} className="h-2" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <Link href={`/app/organisations/${org.id}`}>
                        <Edit3 className="w-4 h-4 mr-2" />
                        Modifier
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>Voir les activités</DropdownMenuItem>
                    <DropdownMenuItem>Voir l'équipe</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
