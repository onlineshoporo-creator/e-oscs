import Link from 'next/link'
import {
  FileText,
  Download,
  Calendar,
  Eye,
  BarChart3,
  PlusCircle,
  TrendingUp,
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

// Données mockées des rapports
const mockRapports = [
  {
    id: 'rap-1',
    titre: 'Rapport mensuel - Janvier 2025',
    type: 'MENSUEL',
    periode: 'Janvier 2025',
    dateGeneration: '2025-01-31',
    statut: 'DISPONIBLE',
    nbActivites: 12,
    totalBeneficiaires: 450,
  },
  {
    id: 'rap-2',
    titre: 'Rapport mensuel - Décembre 2024',
    type: 'MENSUEL',
    periode: 'Décembre 2024',
    dateGeneration: '2024-12-31',
    statut: 'DISPONIBLE',
    nbActivites: 18,
    totalBeneficiaires: 620,
  },
  {
    id: 'rap-3',
    titre: 'Rapport trimestriel - T4 2024',
    type: 'TRIMESTRIEL',
    periode: 'Octobre - Décembre 2024',
    dateGeneration: '2025-01-02',
    statut: 'DISPONIBLE',
    nbActivites: 52,
    totalBeneficiaires: 1850,
  },
]

// Statistiques pour le résumé
const mockStats = {
  totalAnnee: 85,
  beneficiairesAnnee: 3200,
  tauxValidation: 94,
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
          <h1 className="text-2xl lg:text-3xl font-bold text-slate-900">Mes rapports</h1>
          <p className="text-slate-500 mt-1">
            Consultez et téléchargez vos rapports d&apos;activités.
          </p>
        </div>
        
        <Link href="/agent/activites/nouvelle">
          <Button className="bg-orange-500 hover:bg-orange-600 text-white">
            <PlusCircle className="w-4 h-4 mr-2" />
            Nouvelle activité
          </Button>
        </Link>
      </div>

      {/* Résumé de l'année */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-orange-200 bg-gradient-to-br from-orange-50 to-white">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-orange-100 flex items-center justify-center flex-shrink-0">
              <BarChart3 className="w-7 h-7 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500 font-medium">Activités en 2025</p>
              <p className="text-3xl font-bold text-slate-900">{mockStats.totalAnnee}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-green-200 bg-gradient-to-br from-green-50 to-white">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-green-100 flex items-center justify-center flex-shrink-0">
              <TrendingUp className="w-7 h-7 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500 font-medium">Bénéficiaires atteints</p>
              <p className="text-3xl font-bold text-slate-900">{mockStats.beneficiairesAnnee.toLocaleString()}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-white">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0">
              <FileText className="w-7 h-7 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500 font-medium">Taux de validation</p>
              <p className="text-3xl font-bold text-slate-900">{mockStats.tauxValidation}%</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtre par période */}
      <Card className="border-slate-200">
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
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
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Liste des rapports */}
      <div className="space-y-4">
        {mockRapports.map((rapport) => (
          <Card key={rapport.id} className="border-slate-200 hover:shadow-md transition-shadow">
            <CardContent className="p-4 lg:p-5">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="flex items-start gap-4 flex-1 min-w-0">
                  <div className={`w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0 ${
                    rapport.type === 'TRIMESTRIEL' 
                      ? 'bg-purple-100' 
                      : 'bg-blue-100'
                  }`}>
                    <FileText className={`w-7 h-7 ${
                      rapport.type === 'TRIMESTRIEL' 
                        ? 'text-purple-600' 
                        : 'text-blue-600'
                    }`} />
                  </div>
                  
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-semibold text-slate-900">
                        {rapport.titre}
                      </h3>
                      <Badge variant="secondary" className={rapport.type === 'TRIMESTRIEL' ? 'bg-purple-100 text-purple-700 border-purple-200' : ''}>
                        {rapport.type === 'TRIMESTRIEL' ? 'Trimestriel' : 'Mensuel'}
                      </Badge>
                    </div>
                    
                    <p className="text-sm text-slate-500 mt-1">
                      Période : {rapport.periode}
                    </p>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-sm text-slate-600">
                      <span>📊 {rapport.nbActivites} activités</span>
                      <span>👥 {rapport.totalBeneficiaires.toLocaleString()} bénéficiaires</span>
                      <span>Généré le {formatDate(rapport.dateGeneration)}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <Button variant="outline" size="sm" className="gap-1">
                    <Eye className="w-3.5 h-3.5" />
                    Aperçu
                  </Button>
                  
                  <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white gap-1">
                    <Download className="w-3.5 h-3.5" />
                    Télécharger
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {mockRapports.length === 0 && (
          <Card className="border-dashed border-2 border-slate-200">
            <CardContent className="p-8 text-center">
              <FileText className="w-12 h-12 mx-auto text-slate-300 mb-3" />
              <p className="text-slate-500 font-medium">Aucun rapport disponible</p>
              <p className="text-sm text-slate-400 mt-1">
                Les rapports seront générés automatiquement à la fin de chaque période.
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Info sur les rapports */}
      <Card className="bg-slate-50 border-slate-200">
        <CardContent className="p-5">
          <div className="flex items-start gap-3">
            <Calendar className="w-5 h-5 text-slate-500 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="font-medium text-slate-800">À propos des rapports</h4>
              <ul className="text-sm text-slate-600 mt-2 space-y-1">
                <li>• Les rapports mensuels sont générés automatiquement à la fin de chaque mois.</li>
                <li>• Les rapports trimestriels regroupent les données de 3 mois.</li>
                <li>• Vous pouvez télécharger les rapports en format Word ou PowerPoint.</li>
                <li>• Contactez votre responsable si vous avez besoin d&apos;un rapport personnalisé.</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
