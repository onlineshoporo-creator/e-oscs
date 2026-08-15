'use client'

import React from 'react'
import { Users, User, UserPlus, Baby, UserCheck, Users2 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'

// Types
interface BeneficiaryData {
  hommes?: number
  femmes?: number
  enfants?: number
  adultes?: number
  personnes_agees?: number
  vulnerables?: number
  total?: number
}

interface BeneficiariesCardProps {
  beneficiaries: BeneficiaryData | null
  showChart?: boolean
}

// Configuration des catégories de bénéficiaires
const BENEFICIARY_CATEGORIES = [
  { key: 'total', label: 'Total', icon: Users, color: 'text-slate-700', bgColor: 'bg-slate-100', accentColor: '#475569' },
  { key: 'hommes', label: 'Hommes', icon: User, color: 'text-blue-700', bgColor: 'bg-blue-100', accentColor: '#1d4ed8' },
  { key: 'femmes', label: 'Femmes', icon: UserPlus, color: 'text-pink-700', bgColor: 'bg-pink-100', accentColor: '#be185d' },
  { key: 'enfants', label: 'Enfants', icon: Baby, color: 'text-amber-700', bgColor: 'bg-amber-100', accentColor: '#b45309' },
  { key: 'vulnerables', label: 'Vulnérables', icon: UserCheck, color: 'text-orange-700', bgColor: 'bg-orange-100', accentColor: '#c2410c' },
]

export function BeneficiariesCard({ beneficiaries, showChart = true }: BeneficiariesCardProps) {
  const data = beneficiaries || {}
  const total = data.total || (data.hommes || 0) + (data.femmes || 0)
  
  // Calculer les pourcentages pour le graphique
  const hommesCount = data.hommes || 0
  const femmesCount = data.femmes || 0
  const hommesPercent = total > 0 ? Math.round((hommesCount / total) * 100) : 50
  const femmesPercent = total > 0 ? Math.round((femmesCount / total) * 100) : 50

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {BENEFICIARY_CATEGORIES.map((cat) => {
          const value = data[cat.key as keyof BeneficiaryData] || 0
          const Icon = cat.icon
          
          return (
            <Card key={cat.key} className="border-slate-200 overflow-hidden">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className={`p-2 rounded-lg ${cat.bgColor}`}>
                    <Icon className={`w-4 h-4 ${cat.color}`} />
                  </div>
                  {cat.key === 'total' && (
                    <span className="text-xs font-medium text-slate-500">KPI</span>
                  )}
                </div>
                <p className="text-xl sm:text-2xl font-bold text-slate-900">
                  {value.toLocaleString('fr-FR')}
                </p>
                <p className="text-xs text-slate-500 mt-1">{cat.label}</p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Graphique de répartition H/F */}
      {showChart && total > 0 && (
        <Card className="border-slate-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold text-slate-700 flex items-center gap-2">
              <Users2 className="w-4 h-4" />
              Répartition Hommes / Femmes
            </CardTitle>
          </CardHeader>
          <CardContent>
            {/* Barre de progression */}
            <div className="mb-4">
              <div className="flex h-6 rounded-full overflow-hidden bg-slate-100">
                <div 
                  className="bg-blue-500 transition-all duration-500 flex items-center justify-center"
                  style={{ width: `${hommesPercent}%` }}
                >
                  {hommesPercent >= 15 && (
                    <span className="text-white text-xs font-medium">{hommesCount}</span>
                  )}
                </div>
                <div 
                  className="bg-pink-500 transition-all duration-500 flex items-center justify-center"
                  style={{ width: `${femmesPercent}%` }}
                >
                  {femmesPercent >= 15 && (
                    <span className="text-white text-xs font-medium">{femmesCount}</span>
                  )}
                </div>
              </div>
            </div>

            {/* Légende */}
            <div className="flex flex-wrap gap-6">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-500" />
                <span className="text-sm text-slate-600">
                  Hommes : <strong>{hommesCount.toLocaleString('fr-FR')}</strong> ({hommesPercent}%)
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-pink-500" />
                <span className="text-sm text-slate-600">
                  Femmes : <strong>{femmesCount.toLocaleString('fr-FR')}</strong> ({femmesPercent}%)
                </span>
              </div>
            </div>

            {/* Donut Chart CSS */}
            <div className="mt-6 flex justify-center">
              <div className="relative w-40 h-40">
                <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90">
                  {/* Cercle fond */}
                  <circle
                    cx="18"
                    cy="18"
                    r="15.91549430918954"
                    fill="none"
                    stroke="#e2e8f0"
                    strokeWidth="3"
                  />
                  {/* Arc Hommes */}
                  <circle
                    cx="18"
                    cy="18"
                    r="15.91549430918954"
                    fill="none"
                    stroke="#3b82f6"
                    strokeWidth="3"
                    strokeDasharray={`${hommesPercent} ${100 - hommesPercent}`}
                    strokeLinecap="round"
                  />
                  {/* Arc Femmes */}
                  <circle
                    cx="18"
                    cy="18"
                    r="15.91549430918954"
                    fill="none"
                    stroke="#ec4899"
                    strokeWidth="3"
                    strokeDasharray={`${femmesPercent} ${100 - femmesPercent}`}
                    strokeDashoffset={`-${hommesPercent}`}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-2xl font-bold text-slate-900">{total}</span>
                  <span className="text-xs text-slate-500">Total</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tableau détaillé */}
      <Card className="border-slate-200">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold text-slate-700">
            Détail démographique
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left py-3 px-4 font-medium text-slate-600">Catégorie</th>
                  <th className="text-right py-3 px-4 font-medium text-slate-600">Nombre</th>
                  <th className="text-right py-3 px-4 font-medium text-slate-600">Pourcentage</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { label: 'Hommes', value: data.hommes || 0 },
                  { label: 'Femmes', value: data.femmes || 0 },
                  { label: 'Enfants', value: data.enfants || 0 },
                  { label: 'Adultes', value: data.adultes || 0 },
                  { label: 'Personnes âgées', value: data.persones_agees || 0 },
                  { label: 'Personnes vulnérables', value: data.vulnerables || 0 },
                ].map((row) => (
                  <tr key={row.label} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="py-3 px-4 text-slate-900">{row.label}</td>
                    <td className="py-3 px-4 text-right font-medium text-slate-900">
                      {row.value.toLocaleString('fr-FR')}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span className="inline-flex items-center gap-2">
                        <Progress 
                          value={total > 0 ? (row.value / total) * 100 : 0} 
                          className="h-2 w-16"
                        />
                        <span className="text-slate-500 w-12 text-right">
                          {total > 0 ? Math.round((row.value / total) * 100) : 0}%
                        </span>
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="bg-slate-50 font-medium">
                  <td className="py-3 px-4 text-slate-900">Total</td>
                  <td className="py-3 px-4 text-right text-slate-900">
                    {total.toLocaleString('fr-FR')}
                  </td>
                  <td className="py-3 px-4 text-right text-slate-900">100%</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Message si pas de données */}
      {!beneficiaries && (
        <Card className="border-dashed border-slate-300">
          <CardContent className="p-8 text-center">
            <Users className="w-12 h-12 mx-auto mb-3 text-slate-300" />
            <h3 className="font-medium text-slate-700 mb-1">Aucune donnée bénéficiaire</h3>
            <p className="text-sm text-slate-500">
              Les données sur les bénéficiaires n&apos;ont pas encore été renseignées.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
