'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import {
  Building2,
  Users,
  TrendingUp,
  Plus,
  MoreVertical,
  MapPin,
  Edit3,
  Eye,
  Phone,
  Mail,
  Shield,
  Search,
  Filter
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Input } from '@/components/ui/input'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { organisations, ORGANISATION_TYPES } from '@/lib/mock/activites'

// Configuration des types d'organisations
const orgTypeConfig = {
  DR: { label: 'Direction Régionale', color: 'bg-purple-100 text-purple-700 border-purple-200', icon: '🏛️' },
  DD: { label: 'Direction Départementale', color: 'bg-blue-100 text-blue-700 border-blue-200', icon: '🏢' },
  ministere: { label: 'Ministère', color: 'bg-indigo-100 text-indigo-700 border-indigo-200', icon: '⭐' },
  direction: { label: 'Direction', color: 'bg-cyan-100 text-cyan-700 border-cyan-200', icon: '📋' },
  service: { label: 'Service', color: 'bg-green-100 text-green-700 border-green-200', icon: '🔧' },
  division: { label: 'Division', color: 'bg-orange-100 text-orange-700 border-orange-200', icon: '📁' },
}

// Statuts d'abonnement
const subscriptionStatusConfig = {
  ACTIF: { label: 'Actif', color: 'bg-green-100 text-green-700' },
  EXPIRANT_BIENTOT: { label: 'Expire bientôt', color: 'bg-amber-100 text-amber-700' },
  EXPIRE: { label: 'Expiré', color: 'bg-red-100 text-red-700' },
  SUSPENDU: { label: 'Suspendu', color: 'bg-slate-100 text-slate-700' },
  EN_TRAITEMENT: { label: 'En traitement', color: 'bg-blue-100 text-blue-700' },
}

export default function OrganisationsPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [typeFilter, setTypeFilter] = useState<string>('all')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list')

  // Filtrer les organisations
  const filteredOrgs = organisations.filter(org => {
    const matchSearch = searchTerm === '' || 
      org.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      org.description.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchType = typeFilter === 'all' || org.type === typeFilter
    
    return matchSearch && matchType
  })

  // Stats globales
  const totalOrganisations = organisations.length
  const totalActivites = organisations.reduce((sum, o) => sum + o.activitesCount, 0)
  const avgExecution = Math.round(
    organisations.reduce((sum, o) => sum + o.tauxExecution, 0) / organisations.length
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Organisations</h1>
          <p className="text-slate-500 mt-1">
            Gestion des structures et directions rattachées
          </p>
        </div>
        <Button className="gap-2 bg-orange-500 hover:bg-orange-600 shadow-sm shadow-orange-200">
          <Plus className="w-4 h-4" />
          Nouvelle organisation
        </Button>
      </div>

      {/* Stats globales */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-slate-200">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 rounded-xl bg-purple-100">
              <Building2 className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">{totalOrganisations}</p>
              <p className="text-xs text-slate-500">Organisations</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-slate-200">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 rounded-xl bg-blue-100">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">{totalActivites}</p>
              <p className="text-xs text-slate-500">Activités totales</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-slate-200">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 rounded-xl bg-green-100">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">{avgExecution}%</p>
              <p className="text-xs text-slate-500">Exécution moyenne</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-slate-200">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 rounded-xl bg-orange-100">
              <MapPin className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">CI</p>
              <p className="text-xs text-slate-500">Côte d&apos;Ivoire</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtres */}
      <Card className="border-slate-200">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Recherche */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                placeholder="Rechercher une organisation..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Filtre Type */}
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full md:w-[200px]">
                <Filter className="w-4 h-4 mr-2 text-slate-400" />
                <SelectValue placeholder="Type d'organisation" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les types</SelectItem>
                <SelectItem value="ministere">Ministères</SelectItem>
                <SelectItem value="direction">Directions</SelectItem>
                <SelectItem value="service">Services</SelectItem>
                <SelectItem value="division">Divisions</SelectItem>
              </SelectContent>
            </Select>

            {/* Compteur */}
            <div className="hidden lg:flex items-center gap-2 text-sm text-slate-500 px-4 py-2 bg-slate-50 rounded-lg border border-slate-200">
              <span className="font-medium text-slate-900">{filteredOrgs.length}</span>
              résultat(s)
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Liste des organisations */}
      {filteredOrgs.length === 0 ? (
        <Card className="border-dashed border-slate-300">
          <CardContent className="py-16 text-center">
            <Building2 className="w-12 h-12 mx-auto mb-3 text-slate-300" />
            <h3 className="font-semibold text-slate-900 mb-1">Aucune organisation trouvée</h3>
            <p className="text-sm text-slate-500">
              Essayez de modifier vos critères de recherche.
            </p>
          </CardContent>
        </Card>
      ) : viewMode === 'list' ? (
        /* Vue Liste */
        <div className="space-y-4">
          {filteredOrgs.map((org) => {
            const typeConf = orgTypeConfig[org.type as keyof typeof orgTypeConfig] || orgTypeConfig.service
            
            return (
              <Card key={org.id} className="hover:shadow-lg transition-all duration-200 border-slate-200 group">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    {/* Contenu principal */}
                    <div className="flex items-start gap-5 flex-1 min-w-0">
                      {/* Icône type */}
                      <div className={`p-4 rounded-2xl ${typeConf.color} flex-shrink-0 text-2xl`}>
                        {typeConf.icon}
                      </div>

                      {/* Infos */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2 flex-wrap">
                          <h3 className="font-semibold text-lg text-slate-900 group-hover:text-orange-600 transition-colors">
                            {org.nom}
                          </h3>
                          <Badge variant="outline" className={typeConf.color}>
                            {typeConf.label}
                          </Badge>
                          
                          {/* Badge abonnement (simulé) */}
                          <Badge 
                            variant="secondary" 
                            className={`${subscriptionStatusConfig.ACTIF?.color}`}
                          >
                            Abonnement actif
                          </Badge>
                        </div>
                        
                        <p className="text-sm text-slate-500 mb-3 line-clamp-2">
                          {org.description}
                        </p>

                        {org.parentNom && (
                          <p className="text-xs text-slate-400 mb-3 flex items-center gap-1">
                            <Shield className="w-3.5 h-3.5" />
                            Rattaché à : <span className="font-medium">{org.parentNom}</span>
                          </p>
                        )}

                        {/* Métadonnées et métriques */}
                        <div className="flex flex-wrap items-center gap-6 mt-4 pt-4 border-t border-slate-100">
                          <div className="flex items-center gap-2 text-sm text-slate-600">
                            <Users className="w-4 h-4 text-slate-400" />
                            <span className="font-medium">{org.activitesCount} activités</span>
                          </div>
                          
                          <div className="flex-1 max-w-[220px]">
                            <div className="flex items-center justify-between text-sm mb-1.5">
                              <span className="text-slate-500">Taux exécution</span>
                              <span className={`font-bold ${
                                org.tauxExecution >= 80 ? 'text-green-600' : 
                                org.tauxExecution >= 60 ? 'text-orange-600' : 'text-red-600'
                              }`}>
                                {org.tauxExecution}%
                              </span>
                            </div>
                            <Progress 
                              value={org.tauxExecution} 
                              className={`h-2 [&>div]:rounded-full ${
                                org.tauxExecution >= 80 ? '[&>div]:bg-green-500' :
                                org.tauxExecution >= 60 ? '[&>div]:bg-orange-500' : '[&>div]:bg-red-500'
                              }`} 
                            />
                          </div>

                          <div className="flex items-center gap-2 text-sm text-slate-500">
                            <MapPin className="w-4 h-4" />
                            <span>Côte d&apos;Ivoire</span>
                          </div>

                          <div className="flex items-center gap-2 text-sm text-slate-500">
                            <Phone className="w-4 h-4" />
                            <span>+225 XX XX XX XX</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          className="opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link href={`/app/organisations/${org.id}`} className="flex items-center">
                            <Eye className="w-4 h-4 mr-2" />
                            Voir détails
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href={`/app/organisations/${org.id}/edit`} className="flex items-center">
                            <Edit3 className="w-4 h-4 mr-2" />
                            Modifier
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Users className="w-4 h-4 mr-2" />
                          Voir les activités ({org.activitesCount})
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Mail className="w-4 h-4 mr-2" />
                          Contacter
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      ) : (
        /* Vue Grille */
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filteredOrgs.map((org) => {
            const typeConf = orgTypeConfig[org.type as keyof typeof orgTypeConfig] || orgTypeConfig.service
            
            return (
              <Card key={org.id} className="hover:shadow-lg transition-all duration-200 border-slate-200 group cursor-pointer">
                <Link href={`/app/organisations/${org.id}`}>
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className={`p-3 rounded-xl ${typeConf.color} text-2xl`}>
                        {typeConf.icon}
                      </div>
                      <Badge variant="outline" className={typeConf.color}>
                        {typeConf.label}
                      </Badge>
                    </div>
                    <CardTitle className="text-base mt-3 group-hover:text-orange-600 transition-colors line-clamp-1">
                      {org.nom}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-slate-500 line-clamp-2 mb-4">
                      {org.description}
                    </p>
                    
                    <div className="space-y-3 pt-3 border-t border-slate-100">
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-500">Activités</span>
                        <span className="font-medium">{org.activitesCount}</span>
                      </div>
                      
                      <div>
                        <div className="flex justify-between text-sm mb-1.5">
                          <span className="text-slate-500">Exécution</span>
                          <span className={`font-medium ${
                            org.tauxExecution >= 80 ? 'text-green-600' : 'text-orange-600'
                          }`}>
                            {org.tauxExecution}%
                          </span>
                        </div>
                        <Progress value={org.tauxExecution} className="h-1.5" />
                      </div>
                    </div>
                  </CardContent>
                </Link>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
