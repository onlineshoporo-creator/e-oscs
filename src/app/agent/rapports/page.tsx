'use client'

import React from 'react'
import Link from 'next/link'
import {
  FileText,
  Download,
  Calendar,
  Eye,
  BarChart3,
  PlusCircle,
  TrendingUp,
  Users,
  Award,
  Filter,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Progress } from '@/components/ui/progress'

// Données mockées des rapports
const mockRapports = [
  {
    id: 'rap-1',
    titre: 'Rapport mensuel - Janvier 2025',
    type: 'MENSUEL',
    periode: 'Janvier 2025',
    dateGeneration: '2025-01-31',
    statut: 'DISPONIBLE' as const,
    nbActivites: 12,
    totalBeneficiaires: 450,
    progression: 100,
  },
  {
    id: 'rap-2',
    titre: 'Rapport mensuel - Décembre 2024',
    type: 'MENSUEL',
    periode: 'Décembre 2024',
    dateGeneration: '2024-12-31',
    statut: 'DISPONIBLE' as const,
    nbActivites: 18,
    totalBeneficiaires: 620,
    progression: 100,
  },
  {
    id: 'rap-3',
    titre: 'Rapport trimestriel - T4 2024',
    type: 'TRIMESTRIEL',
    periode: 'Octobre - Décembre 2024',
    dateGeneration: '2025-01-02',
    statut: 'DISPONIBLE' as const,
    nbActivites: 52,
    totalBeneficiaires: 1850,
    progression: 100,
  },
]

// Statistiques pour le résumé
const mockStats = {
  totalAnnee: 85,
  beneficiairesAnnee: 3200,
  tauxValidation: 94,
  rangNational: 15,
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr)
  return date.toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

export default function RapportsPage() {
  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* En-tête */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-slate-900 flex items-center gap-2">
            <BarChart3 className="w-7 h-7 text-[#009E60]" />
            Mes rapports
          </h1>
          <p className="text-slate-500 mt-1">
            Consultez et téléchargez vos rapports d&apos;activités.
          </p>
        </div>
        
        <Link href="/agent/activites/nouvelle">
          <Button className="bg-[#F77F00] hover:bg-[#E67300] text-white gap-2">
            <PlusCircle className="w-4 h-4" />
            Nouvelle activité
          </Button>
        </Link>
      </div>

      {/* Résumé de l'année avec cartes améliorées */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-[#F77F00]/20 bg-gradient-to-br from-orange-50 to-white hover:shadow-lg transition-all duration-300 group">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#F77F00] to-[#E67300] flex items-center justify-center shadow-lg shadow-orange-500/30 group-hover:scale-110 transition-transform">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                +15%
              </span>
            </div>
            <p className="text-sm text-slate-500 font-medium">Activités en 2025</p>
            <p className="text-3xl font-bold text-slate-900 mt-1">{mockStats.totalAnnee}</p>
          </CardContent>
        </Card>

        <Card className="border-green-200 bg-gradient-to-br from-green-50 to-white hover:shadow-lg transition-all duration-300 group">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#009E60] to-emerald-600 flex items-center justify-center shadow-lg shadow-green-500/30 group-hover:scale-110 transition-transform">
                <Users className="w-6 h-6 text-white" />
              </div>
            </div>
            <p className="text-sm text-slate-500 font-medium">Bénéficiaires atteints</p>
            <p className="text-3xl font-bold text-slate-900 mt-1">{mockStats.beneficiairesAnnee.toLocaleString()}</p>
          </CardContent>
        </Card>

        <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-white hover:shadow-lg transition-all duration-300 group">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/30 group-hover:scale-110 transition-transform">
                <FileText className="w-6 h-6 text-white" />
              </div>
            </div>
            <p className="text-sm text-slate-500 font-medium">Taux de validation</p>
            <div className="flex items-end gap-2 mt-1">
              <p className="text-3xl font-bold text-slate-900">{mockStats.tauxValidation}%</p>
            </div>
            <Progress value={mockStats.tauxValidation} className="mt-2 h-1.5 [&>div]:bg-[#009E60]" />
          </CardContent>
        </Card>

        <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-white hover:shadow-lg transition-all duration-300 group">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center shadow-lg shadow-purple-500/30 group-hover:scale-110 transition-transform">
                <Award className="w-6 h-6 text-white" />
              </div>
            </div>
            <p className="text-sm text-slate-500 font-medium">Classement national</p>
            <p className="text-3xl font-bold text-slate-900 mt-1">#{mockStats.rangNational}</p>
            <p className="text-xs text-purple-600 mt-1">parmi tous les agents</p>
          </CardContent>
        </Card>
      </div>

      {/* Filtre par période */}
      <Card className="border-slate-200">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <Filter className="w-5 h-5 text-slate-400" />
            <span className="text-sm font-medium text-slate-700">Afficher :</span>
            
            <Select defaultValue="tous">
              <SelectTrigger className="w-full sm:w-[200px]">
                <SelectValue placeholder="Type de rapport" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="tous">Tous les rapports</SelectItem>
                <SelectItem value="mensuel">Rapports mensuels</SelectItem>
                <SelectItem value="trimestriel">Rapports trimestriels</SelectItem>
                <SelectItem value="annuel">Rapport annuel</SelectItem>
              </SelectContent>
            </Select>
            
            <Select defaultValue="2025">
              <SelectTrigger className="w-full sm:w-[150px]">
                <SelectValue placeholder="Année" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2025">2025</SelectItem>
                <SelectItem value="2024">2024</SelectItem>
                <SelectItem value="2023">2023</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Liste des rapports */}
      <div className="space-y-4">
        {mockRapports.map((rapport) => (
          <Card key={rapport.id} className="border-slate-200 hover:shadow-lg transition-all duration-300 overflow-hidden group">
            <CardContent className="p-0">
              <div className="flex">
                {/* Bandeau latérale */}
                <div className={`w-1.5 ${
                  rapport.type === 'TRIMESTRIEL' 
                    ? 'bg-gradient-to-b from-purple-500 to-violet-600' 
                    : 'bg-gradient-to-b from-blue-500 to-cyan-600'
                }`} />
                
                <div className="flex-1 p-4 lg:p-5">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="flex items-start gap-4 flex-1 min-w-0">
                      <div className={`w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0 ${
                        rapport.type === 'TRIMESTRIEL' 
                          ? 'bg-purple-100' 
                          : 'bg-blue-100'
                      } group-hover:scale-105 transition-transform`}>
                        <FileText className={`w-7 h-7 ${
                          rapport.type === 'TRIMESTRIEL' 
                            ? 'text-purple-600' 
                            : 'text-blue-600'
                        }`} />
                      </div>
                      
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <h3 className="font-semibold text-slate-900 text-lg group-hover:text-[#009E60] transition-colors">
                            {rapport.titre}
                          </h3>
                          <Badge 
                            variant="secondary" 
                            className={
                              rapport.type === 'TRIMESTRIEL' 
                                ? 'bg-purple-100 text-purple-700 border-purple-200' 
                                : 'bg-blue-100 text-blue-700 border-blue-200'
                            }
                          >
                            {rapport.type === 'TRIMESTRIEL' ? 'Trimestriel' : 'Mensuel'}
                          </Badge>
                        </div>
                        
                        <p className="text-sm text-slate-500 font-medium">
                          Période : {rapport.periode}
                        </p>

                        <div className="flex flex-wrap items-center gap-x-5 gap-y-2 mt-3 text-sm">
                          <span className="flex items-center gap-1.5 font-medium text-slate-700">
                            <BarChart3 className="w-4 h-4 text-[#F77F00]" />
                            {rapport.nbActivites} activités
                          </span>
                          <span className="flex items-center gap-1.5 font-medium text-slate-700">
                            <Users className="w-4 h-4 text-[#009E60]" />
                            {rapport.totalBeneficiaires.toLocaleString()} bénéficiaires
                          </span>
                          <span className="flex items-center gap-1.5 text-slate-500">
                            <Calendar className="w-4 h-4" />
                            Généré le {formatDate(rapport.dateGeneration)}
                          </span>
                        </div>

                        {/* Progression */}
                        <div className="mt-3 max-w-[200px]">
                          <Progress value={rapport.progression} className="h-1.5" />
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">
                      <Button variant="outline" size="sm" className="gap-1.5 hover:bg-[#009E60] hover:text-white hover:border-[#009E60] transition-colors">
                        <Eye className="w-4 h-4" />
                        Aperçu
                      </Button>
                      
                      <Button size="sm" className="bg-[#009E60] hover:bg-green-700 text-white gap-1.5 shadow-lg shadow-green-500/25">
                        <Download className="w-4 h-4" />
                        Télécharger
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {mockRapports.length === 0 && (
          <Card className="border-dashed border-2 border-slate-200">
            <CardContent className="p-12 text-center">
              <FileText className="w-16 h-16 mx-auto text-slate-300 mb-4" />
              <h3 className="text-lg font-semibold text-slate-700 mb-2">Aucun rapport disponible</h3>
              <p className="text-sm text-slate-500 max-w-md mx-auto">
                Les rapports seront générés automatiquement à la fin de chaque période. 
                Continuez à saisir vos activités pour accumuler des données.
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Info sur les rapports */}
      <Card className="bg-gradient-to-r from-slate-50 to-slate-100 border-slate-200">
        <CardContent className="p-5">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center flex-shrink-0 shadow-sm">
              <Calendar className="w-5 h-5 text-[#F77F00]" />
            </div>
            <div>
              <h4 className="font-semibold text-slate-800 flex items-center gap-2">
                À propos des rapports
                <Badge variant="secondary" className="text-xs">Info</Badge>
              </h4>
              <ul className="text-sm text-slate-600 mt-3 space-y-2">
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#F77F00] mt-1.5 flex-shrink-0"></span>
                  Les rapports mensuels sont générés automatiquement à la fin de chaque mois.
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#009E60] mt-1.5 flex-shrink-0"></span>
                  Les rapports trimestriels regroupent les données de 3 mois consécutifs.
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 flex-shrink-0"></span>
                  Vous pouvez télécharger les rapports en format PDF ou Excel.
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-500 mt-1.5 flex-shrink-0"></span>
                  Contactez votre responsable si vous avez besoin d&apos;un rapport personnalisé.
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
