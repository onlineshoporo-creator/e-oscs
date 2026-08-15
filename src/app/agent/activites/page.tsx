import Link from 'next/link'
import {
  ClipboardList,
  PlusCircle,
  Search,
  Filter,
  Calendar,
  MapPin,
  Eye,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

// Données mockées des activités
const mockActivities = [
  {
    id: '1',
    intitule: 'Sensibilisation sur l\'hygiène communautaire',
    date: '2025-01-15',
    lieu: 'Abidjan, Yopougon',
    statut: 'VALIDEE',
    type: 'SENSIBILISATION',
    beneficiaires: 45,
  },
  {
    id: '2',
    intitule: 'Distribution de kits scolaires',
    date: '2025-01-12',
    lieu: 'Bouaké',
    statut: 'EN_ATTENTE',
    type: 'DISTRIBUTION',
    beneficiaires: 120,
  },
  {
    id: '3',
    intitule: 'Formation en techniques agricoles',
    date: '2025-01-10',
    lieu: 'Yamoussoukro',
    statut: 'BROUILLON',
    type: 'FORMATION',
    beneficiaires: 30,
  },
  {
    id: '4',
    intitule: 'Visite aux personnes âgées',
    date: '2025-01-08',
    lieu: 'San-Pedro',
    statut: 'VALIDEE',
    type: 'VISITE',
    beneficiaires: 25,
  },
  {
    id: '5',
    intitule: 'Atelier de sensibilisation VIH/SIDA',
    date: '2025-01-05',
    lieu: 'Abidjan, Treichville',
    statut: 'VALIDEE',
    type: 'ATELIER',
    beneficiaires: 60,
  },
  {
    id: '6',
    intitule: 'Réunion de coordination mensuelle',
    date: '2025-01-03',
    lieu: 'Abidjan, Plateau',
    statut: 'REJETEE',
    type: 'REUNION',
    beneficiaires: 15,
  },
]

function getStatutBadge(statut: string) {
  switch (statut) {
    case 'VALIDEE':
      return <Badge className="bg-green-100 text-green-700 border-green-200">Validée</Badge>
    case 'EN_ATTENTE':
      return <Badge className="bg-yellow-100 text-yellow-700 border-yellow-200">En attente</Badge>
    case 'BROUILLON':
      return <Badge className="bg-slate-100 text-slate-600 border-slate-200">Brouillon</Badge>
    case 'REJETEE':
      return <Badge className="bg-red-100 text-red-700 border-red-200">Rejetée</Badge>
    default:
      return <Badge variant="secondary">{statut}</Badge>
  }
}

function getTypeLabel(type: string) {
  const types: Record<string, string> = {
    SENSIBILISATION: 'Sensibilisation',
    FORMATION: 'Formation',
    DISTRIBUTION: 'Distribution',
    VISITE: 'Visite',
    REUNION: 'Réunion',
    ATELIER: 'Atelier',
    CAMPAGNE: 'Campagne',
  }
  return types[type] || type
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr)
  return date.toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

export default function MesActivitesPage() {
  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* En-tête */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-slate-900">Mes activités</h1>
          <p className="text-slate-500 mt-1">
            Consultez et gérez toutes vos activités déclarées.
          </p>
        </div>
        
        <Link href="/agent/activites/nouvelle">
          <Button className="bg-orange-500 hover:bg-orange-600 text-white">
            <PlusCircle className="w-4 h-4 mr-2" />
            Nouvelle activité
          </Button>
        </Link>
      </div>

      {/* Filtres et recherche */}
      <Card className="border-slate-200">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input 
                placeholder="Rechercher une activité..." 
                className="pl-10"
              />
            </div>
            
            <Select defaultValue="tous">
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="tous">Tous les statuts</SelectItem>
                <SelectItem value="brouillon">Brouillons</SelectItem>
                <SelectItem value="en_attente">En attente</SelectItem>
                <SelectItem value="validees">Validées</SelectItem>
                <SelectItem value="rejetees">Rejetées</SelectItem>
              </SelectContent>
            </Select>

            <Select defaultValue="tous">
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="tous">Tous les types</SelectItem>
                <SelectItem value="sensibilisation">Sensibilisation</SelectItem>
                <SelectItem value="formation">Formation</SelectItem>
                <SelectItem value="distribution">Distribution</SelectItem>
                <SelectItem value="visite">Visite</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Liste des activités */}
      <div className="space-y-3">
        {mockActivities.map((activity) => (
          <Card key={activity.id} className="border-slate-200 hover:shadow-md transition-shadow cursor-pointer">
            <Link href={`/app/activites/${activity.id}`}>
              <CardContent className="p-4 lg:p-5">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="flex items-start gap-4 flex-1 min-w-0">
                    <div className="w-12 h-12 rounded-xl bg-orange-50 flex items-center justify-center flex-shrink-0">
                      <ClipboardList className="w-6 h-6 text-orange-500" />
                    </div>
                    
                    <div className="min-w-0 flex-1">
                      <h3 className="font-semibold text-slate-900 truncate pr-4">
                        {activity.intitule}
                      </h3>
                      
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-sm text-slate-500">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" />
                          {formatDate(activity.date)}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5" />
                          {activity.lieu}
                        </span>
                        <span className="hidden sm:inline">
                          {getTypeLabel(activity.type)}
                        </span>
                        <span className="font-medium text-slate-700">
                          {activity.bénéficiaires || activity.beneficiaires} bénéficiaires
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 flex-shrink-0">
                    {getStatutBadge(activity.statut)}
                    <Button variant="ghost" size="icon" className="text-slate-400 hover:text-orange-500">
                      <Eye className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Link>
          </Card>
        ))}

        {mockActivities.length === 0 && (
          <Card className="border-dashed border-2 border-slate-200">
            <CardContent className="p-8 text-center">
              <ClipboardList className="w-12 h-12 mx-auto text-slate-300 mb-3" />
              <p className="text-slate-500 font-medium">Aucune activité trouvée</p>
              <p className="text-sm text-slate-400 mt-1">
                Commencez par créer votre première activité !
              </p>
              <Link href="/agent/activites/nouvelle" className="mt-4 inline-block">
                <Button className="bg-orange-500 hover:bg-orange-600 text-white">
                  Créer une activité
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Pagination (simulée) */}
      <div className="flex justify-center pt-4">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" disabled>
            Précédent
          </Button>
          <div className="flex items-center gap-1">
            <Button size="sm" className="bg-orange-500 text-white">1</Button>
            <Button variant="outline" size="sm">2</Button>
            <Button variant="outline" size="sm">3</Button>
          </div>
          <Button variant="outline" size="sm">
            Suivant
          </Button>
        </div>
      </div>
    </div>
  )
}
