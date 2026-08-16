'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { 
  Activity,
  TrendingUp,
  BarChart3,
  MapPin,
  Calendar,
  ArrowLeft,
  Shield,
  AlertCircle,
  Users,
  CheckCircle2
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

// Données mock ANONYMES - Aucune donnée personnelle ou identifiable
const mockAnonymousStats = {
  totalActivities: 2847,
  thisMonthActivities: 342,
  avgActivitiesPerOrg: 118,
  validationRate: 87,
  peakDay: 'Mardi',
  peakHour: '10h-11h',
}

// Taux d'utilisation par région (nombres uniquement, pas de contenu)
const regionUsageData = [
  { region: 'Région 1', activities: 487, organizations: 4, avgPerOrg: 122 },
  { region: 'Région 2', activities: 398, organizations: 3, avgPerOrg: 133 },
  { region: 'Région 3', activities: 356, organizations: 3, avgPerOrg: 119 },
  { region: 'Région 4', activities: 312, organizations: 3, avgPerOrg: 104 },
  { region: 'Région 5', activities: 278, organizations: 2, avgPerOrg: 139 },
  { region: 'Région 6', plugins: 245, organizations: 2, avgPerOrg: 123 },
  { region: 'Région 7', activities: 198, organizations: 2, avgPerOrg: 99 },
  { region: 'Région 8', activities: 156, organizations: 2, avgPerOrg: 78 },
  { region: 'Région 9', activities: 134, organizations: 1, avgPerOrg: 134 },
  { region: 'Région 10', activities: 98, organizations: 1, avgPerOrg: 98 },
  { region: 'Région 11', activities: 87, organizations: 1, avgPerOrg: 87 },
  { region: 'Autres régions', activities: 198, organizations: 0, avgPerOrg: 0 },
]

// Évolution mensuelle (nombres uniquement)
const monthlyEvolution = [
  { month: 'Sept', total: 185, validated: 160, orgsActive: 16 },
  { month: 'Oct', total: 220, validated: 195, orgsActive: 17 },
  { month: 'Nov', total: 195, validated: 170, orgsActive: 18 },
  { month: 'Déc', total: 280, validated: 245, orgsActive: 19 },
  { month: 'Jan', total: 310, validated: 278, orgsActive: 22 },
  { month: 'Fév', total: 342, validated: 298, orgsActive: 24 },
]

// Répartition par jour de la semaine
const dayOfWeekData = [
  { day: 'Lundi', count: 385, percentage: 13.5 },
  { day: 'Mardi', count: 498, percentage: 17.5 },
  { day: 'Mercredi', count: 456, percentage: 16.0 },
  { day: 'Jeudi', count: 423, percentage: 14.9 },
  { day: 'Vendredi', count: 367, percentage: 12.9 },
  { day: 'Samedi', count: 445, percentage: 15.6 },
  { day: 'Dimanche', count: 273, percentage: 9.6 },
]

export default function RapportsActivitesPage() {
  const [selectedView, setSelectedView] = useState<'overview' | 'regions' | 'time'>('overview')

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" asChild>
              <Link href="/admin/rapports">
                <ArrowLeft className="w-4 h-4" />
              </Link>
            </Button>
            <div>
              <h1 className="text-2xl lg:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                Statistiques d&apos;utilisation
              </h1>
              <p className="text-slate-500 text-sm mt-1">
                Données agrégées anonymes — Aucune information personnelle
              </p>
            </div>
          </div>
        </div>
        <Badge variant="outline" className="gap-1 border-emerald-200 text-emerald-700 bg-emerald-50 self-start sm:self-auto">
          <Shield className="w-3 h-3" />
          Données anonymisées
        </Badge>
      </div>

      {/* Privacy Notice */}
      <Card className="border-blue-200 bg-blue-50/50">
        <CardContent className="p-4 flex items-start gap-3">
          <div className="p-2 rounded-lg bg-blue-100 shrink-0">
            <Shield className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-blue-800">Respect de la vie privée</p>
            <p className="text-xs text-blue-600 mt-1">
              Cette page affiche uniquement des données agrégées et anonymes. 
              Aucune activité individuelle, aucun contenu saisie par les utilisateurs n&apos;est visible. 
              Les identifiants des organisations sont masqués.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* KPI Cards - Anonymous Stats Only */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-slate-200/80 hover:shadow-lg transition-shadow">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Total activités</span>
              <div className="p-2 rounded-lg bg-blue-100 text-blue-600">
                <Activity className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl font-bold text-slate-900">{mockAnonymousStats.totalActivities.toLocaleString()}</p>
            <p className="text-xs text-slate-400 mt-1">Depuis le lancement</p>
          </CardContent>
        </Card>

        <Card className="border-slate-200/80 hover:shadow-lg transition-shadow">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Ce mois-ci</span>
              <div className="p-2 rounded-lg bg-emerald-100 text-emerald-600">
                <Calendar className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl font-bold text-slate-900">{mockAnonymousStats.thisMonthActivities}</p>
            <p className="text-xs text-emerald-600 mt-1 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              +10.3% vs mois dernier
            </p>
          </CardContent>
        </Card>

        <Card className="border-slate-200/80 hover:shadow-lg transition-shadow">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Moyenne/org</span>
              <div className="p-2 rounded-lg bg-orange-100 text-orange-600">
                <BarChart3 className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl font-bold text-slate-900">{mockAnonymousStats.avgActivitiesPerOrg}</p>
            <p className="text-xs text-slate-400 mt-1">Activités par organisation (moyenne)</p>
          </CardContent>
        </Card>

        <Card className="border-slate-200/80 hover:shadow-lg transition-shadow">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Taux validation</span>
              <div className="p-2 rounded-lg bg-purple-100 text-purple-600">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl font-bold text-slate-900">{mockAnonymousStats.validationRate}%</p>
            <p className="text-xs text-slate-400 mt-1">Des activités sont validées</p>
          </CardContent>
        </Card>
      </div>

      {/* View Tabs */}
      <div className="flex bg-slate-100 rounded-lg p-1 w-fit">
        {[
          { value: 'overview' as const, label: 'Vue d\'ensemble' },
          { value: 'regions' as const, label: 'Par région' },
          { value: 'time' as const, label: 'Temps d\'utilisation' },
        ].map((tab) => (
          <button
            key={tab.value}
            onClick={() => setSelectedView(tab.value)}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
              selectedView === tab.value
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Main Content based on selected view */}
      {selectedView === 'overview' && (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          
          {/* Monthly Evolution Chart */}
          <Card className="border-slate-200/80 hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold text-slate-900 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-[#009E60]" />
                Évolution mensuelle
              </CardTitle>
              <CardDescription>Nombre d&apos;activités (données agrégées)</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {monthlyEvolution.map((data, index) => {
                  const maxTotal = Math.max(...monthlyEvolution.map(d => d.total))
                  return (
                    <div key={data.month} className="group flex items-center gap-3">
                      <span className="text-xs font-medium text-slate-500 w-10 text-right">{data.month}</span>
                      <div className="flex-1 relative h-8 bg-slate-100 rounded-lg overflow-hidden">
                        <div 
                          className="absolute inset-y-0 left-0 bg-gradient-to-r from-[#009E60] to-[#34D399] rounded-lg transition-all duration-500"
                          style={{ 
                            width: `${(data.total / maxTotal) * 100}%`,
                          }}
                        >
                          <div className="absolute inset-0 bg-white/10 rounded-lg" />
                        </div>
                        <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs font-bold text-white drop-shadow-sm">
                          {data.total}
                        </span>
                      </div>
                      <Badge variant="secondary" className="bg-blue-50 text-blue-700 border-blue-200 text-[10px] shrink-0">
                        {data.orgsActive} orgs
                      </Badge>
                    </div>
                  )
                })}
              </div>
              
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-4 text-xs text-slate-500">
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded bg-gradient-to-r from-[#009E60] to-[#34D399]" />
                  <span>Total activités</span>
                </div>
                <div className="ml-auto">
                  <span className="font-medium text-slate-700">{monthlyEvolution.reduce((a, b) => a + b.total, 0).toLocaleString()} au total</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Day of Week Distribution */}
          <Card className="border-slate-200/80 hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold text-slate-900 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-[#F77F00]" />
                Répartition par jour
              </CardTitle>
              <CardDescription>Quel jour les utilisateurs sont les plus actifs</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {dayOfWeekData.sort((a, b) => b.count - a.count).map((data) => {
                  const maxCount = Math.max(...dayOfWeekData.map(d => d.count))
                  return (
                    <div key={data.day} className="group flex items-center gap-3">
                      <span className="text-xs font-medium text-slate-600 w-16 text-right">{data.day}</span>
                      <div className="flex-1 relative h-7 bg-slate-100 rounded-md overflow-hidden">
                        <div 
                          className={`absolute inset-y-0 left-0 rounded-md transition-all duration-500 ${
                            data.day === mockAnonymousStats.peakDay 
                              ? 'bg-gradient-to-r from-[#F77F00] to-[#FFA940]' 
                              : 'bg-gradient-to-r from-slate-400 to-slate-300'
                          }`}
                          style={{ 
                            width: `${(data.count / maxCount) * 100}%`,
                          }}
                        />
                        <span className={`absolute right-2 top-1/2 -translate-y-1/2 text-xs font-bold ${
                          data.day === mockAnonymousStats.peakDay ? 'text-white' : 'text-slate-600'
                        }`}>
                          {data.count}
                        </span>
                      </div>
                      <span className="text-xs text-slate-400 w-12 text-right">{data.percentage}%</span>
                    </div>
                  )
                })}
              </div>
              
              <div className="mt-4 p-3 rounded-lg bg-orange-50 border border-orange-100">
                <p className="text-xs font-medium text-orange-800 flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5" />
                  Jour le plus actif : <strong>{mockAnonymousStats.peakDay}</strong> ({mockAnonymousStats.peakHour})
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {selectedView === 'regions' && (
        <Card className="border-slate-200/80 hover:shadow-lg transition-shadow">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold text-slate-900 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-[#009E60]" />
              Taux d&apos;utilisation par région
            </CardTitle>
            <CardDescription>
              Nombres uniquement — Les noms des régions sont anonymisés pour protéger la vie privée
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="text-left text-xs font-semibold text-slate-500 uppercase pb-3 pr-4">Région</th>
                    <th className="text-right text-xs font-semibold text-slate-500 uppercase pb-3 px-4">Activités totales</th>
                    <th className="text-right text-xs font-semibold text-slate-500 uppercase pb-3 px-4">Organisations</th>
                    <th className="text-right text-xs font-semibold text-slate-500 uppercase pb-3 px-4">Moyenne/org</th>
                    <th className="text-left text-xs font-semibold text-slate-500 uppercase pb-3 pl-4">Participation</th>
                  </tr>
                </thead>
                <tbody>
                  {regionUsageData.sort((a, b) => b.activities - a.activities).map((region, index) => {
                    const maxActivities = Math.max(...regionUsageData.map(r => r.activities))
                    return (
                      <tr key={region.region} className="border-b border-slate-50 last:border-0 group hover:bg-slate-50/50">
                        <td className="py-3 pr-4">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-slate-700">{region.region}</span>
                            {index < 3 && (
                              <Badge variant="secondary" className="text-[10px] bg-amber-50 text-amber-700 border-amber-200">
                                Top {index + 1}
                              </Badge>
                            )}
                          </div>
                        </td>
                        <td className="py-3 px-4 text-sm font-bold text-slate-900 text-right">
                          {region.activities.toLocaleString()}
                        </td>
                        <td className="py-3 px-4 text-sm text-slate-600 text-right">
                          {region.organizations}
                        </td>
                        <td className="py-3 px-4 text-sm text-slate-600 text-right">
                          {region.avgPerOrg}
                        </td>
                        <td className="py-3 pl-4">
                          <div className="w-24 h-2 bg-slate-100 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-gradient-to-r from-[#009E60] to-[#34D399] rounded-full"
                              style={{ width: `${(region.activities / maxActivities) * 100}%` }}
                            />
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
            
            <div className="mt-4 p-3 rounded-lg bg-emerald-50 border border-emerald-100">
              <p className="text-xs font-medium text-emerald-800 flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5" />
                Note : Aucune donnée personnelle ou identifiable n&apos;est affichée dans ce tableau.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {selectedView === 'time' && (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          
          {/* Peak Hours */}
          <Card className="border-slate-200/80 hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold text-slate-900 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-[#F77F00]" />
                Heures de pointe
              </CardTitle>
              <CardDescription>Distribution horaire (données agrégées)</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {[
                  { hour: '6h-8h', count: 45, label: 'Matin tôt' },
                  { hour: '8h-10h', count: 89, label: 'Début matinée' },
                  { hour: '10h-12h', count: 124, label: 'Fin matinée' },
                  { hour: '12h-14h', count: 56, label: 'Pause déjeuner' },
                  { hour: '14h-16h', count: 112, label: 'Début après-midi' },
                  { hour: '16h-18h', count: 78, label: 'Fin après-midi' },
                  { hour: '18h-20h', count: 34, label: 'Soirée' },
                  { hour: '20h-22h', count: 18, label: 'Nuit' },
                ].map((slot) => {
                  const maxCount = Math.max(...[89, 124, 56, 112, 78])
                  const isPeak = slot.hour === '10h-12h'
                  return (
                    <div key={slot.hour} className="flex items-center gap-3">
                      <span className="text-xs font-medium text-slate-500 w-20 text-right">{slot.hour}</span>
                      <div className="flex-1 relative h-6 bg-slate-100 rounded overflow-hidden">
                        <div 
                          className={`absolute inset-y-0 left-0 rounded transition-all ${
                            isPeak 
                              ? 'bg-gradient-to-r from-[#F77F00] to-[#FFA940]' 
                              : 'bg-gradient-to-r from-slate-400 to-slate-300'
                          }`}
                          style={{ width: `${(slot.count / maxCount) * 100}%` }}
                        />
                        <span className={`absolute right-2 top-1/2 -translate-y-1/2 text-xs font-bold ${
                          isPeak ? 'text-white' : 'text-slate-600'
                        }`}>
                          {slot.count}
                        </span>
                      </div>
                    </div>
                  )
                })}
              </div>
              
              <div className="mt-4 p-3 rounded-lg bg-orange-50 border border-orange-100">
                <p className="text-xs font-medium text-orange-800 flex items-center gap-1.5">
                  <TrendingUp className="w-3.5 h-3.5" />
                  Créneau le plus actif : <strong>10h-12h</strong> (36% des activités)
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Usage Patterns */}
          <Card className="border-slate-200/80 hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold text-slate-900 flex items-center gap-2">
                <Activity className="w-5 h-5 text-[#009E60]" />
                Patterns d&apos;utilisation
              </CardTitle>
              <CardDescription>Insights sur l&apos;adoption de la plateforme</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-50 space-y-3">
                <h4 className="text-sm font-semibold text-slate-800">Statistiques clés</h4>
                
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-lg bg-white border border-slate-200">
                    <p className="text-xs text-slate-500">Jours actifs/mois</p>
                    <p className="text-xl font-bold text-slate-900">22.4</p>
                    <p className="text-xs text-emerald-600">moyenne par organisation</p>
                  </div>
                  
                  <div className="p-3 rounded-lg bg-white border border-slate-200">
                    <p className="text-xs text-slate-500">Sessions/jour</p>
                    <p className="text-xl font-bold text-slate-900">2.8</p>
                    <p className="text-xs text-slate-400">par organisation active</p>
                  </div>
                  
                  <div className="p-3 rounded-lg bg-white border border-slate-200">
                    <p className="text-xs text-slate-500">Activités/session</p>
                    <p className="text-xl font-bold text-slate-900">5.2</p>
                    <p className="text-xs text-slate-400">moyenne</p>
                  </div>
                  
                  <div className="p-3 rounded-lg bg-white border border-slate-200">
                    <p className="text-xs text-slate-500">Organisations actives</p>
                    <p className="text-xl font-bold text-slate-900">96%</p>
                    <p className="text-xs text-emerald-600">ce mois-ci</p>
                  </div>
                </div>
              </div>
              
              <div className="p-4 rounded-xl bg-blue-50 border border-blue-100 space-y-2">
                <h4 className="text-sm font-semibold text-blue-800 flex items-center gap-1.5">
                  <Users className="w-4 h-4" />
                  Adoption
                </h4>
                <p className="text-xs text-blue-700">
                  En moyenne, chaque organisation utilise la plateforme plusieurs fois par semaine, 
                  avec un pic d&apos;activité en milieu de matinée.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
