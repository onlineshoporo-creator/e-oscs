import Link from 'next/link'
import {
  CheckCircle2,
  Clock,
  XCircle,
  Eye,
  Calendar,
  MapPin,
  RefreshCw,
  PlusCircle,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

// Données mockées des activités soumises
const mockSoumises = [
  {
    id: '1',
    intitule: 'Sensibilisation sur l\'hygiène communautaire',
    date: '2025-01-15',
    lieu: 'Abidjan, Yopougon',
    statut: 'VALIDEE',
    dateValidation: '2025-01-17',
    validateur: 'Mme Kouadio Marie',
  },
  {
    id: '2',
    intitule: 'Distribution de kits scolaires',
    date: '2025-01-12',
    lieu: 'Bouaké',
    statut: 'EN_ATTENTE',
    dateSoumission: '2025-01-13',
  },
  {
    id: '4',
    intitule: 'Visite aux personnes âgées',
    date: '2025-01-08',
    lieu: 'San-Pedro',
    statut: 'VALIDEE',
    dateValidation: '2025-01-10',
    validateur: 'M. Yao Serge',
  },
  {
    id: '6',
    intitule: 'Réunion de coordination mensuelle',
    date: '2025-01-03',
    lieu: 'Abidjan, Plateau',
    statut: 'REJETEE',
    dateRejet: '2025-01-05',
    motifRejet: 'Informations manquantes sur les bénéficiaires. Veuillez compléter la section bénéficiaires.',
  },
]

function getStatutConfig(statut: string) {
  switch (statut) {
    case 'VALIDEE':
      return {
        badge: <Badge className="bg-green-100 text-green-700 border-green-200">Validée</Badge>,
        icon: <CheckCircle2 className="w-5 h-5 text-green-500" />,
        bgColor: 'bg-green-50 border-green-200',
      }
    case 'EN_ATTENTE':
      return {
        badge: <Badge className="bg-yellow-100 text-yellow-700 border-yellow-200">En attente</Badge>,
        icon: <Clock className="w-5 h-5 text-yellow-500" />,
        bgColor: 'bg-yellow-50 border-yellow-200',
      }
    case 'REJETEE':
      return {
        badge: <Badge className="bg-red-100 text-red-700 border-red-200">Rejetée</Badge>,
        icon: <XCircle className="w-5 h-5 text-red-500" />,
        bgColor: 'bg-red-50 border-red-200',
      }
    default:
      return {
        badge: <Badge variant="secondary">{statut}</Badge>,
        icon: null,
        bgColor: '',
      }
  }
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr)
  return date.toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

export default function SoumisesPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* En-tête */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-slate-900">Activités soumises</h1>
          <p className="text-slate-500 mt-1">
            Suivez le statut de vos activités envoyées pour validation.
          </p>
        </div>
        
        <Link href="/agent/activites/nouvelle">
          <Button className="bg-orange-500 hover:bg-orange-600 text-white">
            <PlusCircle className="w-4 h-4 mr-2" />
            Nouvelle activité
          </Button>
        </Link>
      </div>

      {/* Filtre */}
      <Card className="border-slate-200">
        <CardContent className="p-4">
          <Select defaultValue="tous">
            <SelectTrigger className="w-full sm:w-[250px]">
              <SelectValue placeholder="Filtrer par statut" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="tous">Tous les statuts</SelectItem>
              <SelectItem value="en_attente">En attente de validation</SelectItem>
              <SelectItem value="validees">Validées</SelectItem>
              <SelectItem value="rejetees">Rejetées</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Statistiques rapides */}
      <div className="grid grid-cols-3 gap-3">
        <Card className="border-yellow-200 bg-yellow-50/50">
          <CardContent className="p-4 text-center">
            <Clock className="w-6 h-6 mx-auto text-yellow-600 mb-1" />
            <p className="text-2xl font-bold text-yellow-700">
              {mockSoumises.filter(a => a.statut === 'EN_ATTENTE').length}
            </p>
            <p className="text-xs text-yellow-600">En attente</p>
          </CardContent>
        </Card>

        <Card className="border-green-200 bg-green-50/50">
          <CardContent className="p-4 text-center">
            <CheckCircle2 className="w-6 h-6 mx-auto text-green-600 mb-1" />
            <p className="text-2xl font-bold text-green-700">
              {mockSoumises.filter(a => a.statut === 'VALIDEE').length}
            </p>
            <p className="text-xs text-green-600">Validées</p>
          </CardContent>
        </Card>

        <Card className="border-red-200 bg-red-50/50">
          <CardContent className="p-4 text-center">
            <XCircle className="w-6 h-6 mx-auto text-red-600 mb-1" />
            <p className="text-2xl font-bold text-red-700">
              {mockSoumises.filter(a => a.statut === 'REJETEE').length}
            </p>
            <p className="text-xs text-red-600">Rejetées</p>
          </CardContent>
        </Card>
      </div>

      {/* Liste des activités soumises */}
      <div className="space-y-4">
        {mockSoumises.map((activite) => {
          const config = getStatutConfig(activite.statut)
          
          return (
            <Card key={activite.id} className={`border ${config.bgColor}`}>
              <CardContent className="p-4 lg:p-5">
                <div className="flex flex-col gap-4">
                  {/* En-tête de la carte */}
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center flex-shrink-0 shadow-sm">
                      {config.icon}
                    </div>
                    
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-semibold text-slate-900">
                          {activite.intitule}
                        </h3>
                        {config.badge}
                      </div>
                      
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-sm text-slate-500">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" />
                          Activité le {formatDate(activite.date)}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5" />
                          {activite.lieu}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Détails selon le statut */}
                  {activite.statut === 'EN_ATTENTE' && (
                    <div className="ml-16 p-3 bg-white/70 rounded-lg border border-yellow-200">
                      <p className="text-sm text-yellow-800">
                        ⏳ Soumise le {formatDate(activite.dateSoumission!)} — En attente de validation par votre responsable.
                      </p>
                    </div>
                  )}

                  {activite.statut === 'VALIDEE' && (
                    <div className="ml-16 p-3 bg-white/70 rounded-lg border border-green-200">
                      <p className="text-sm text-green-800">
                        ✅ Validée le {formatDate(activite.dateValidation!)} par {activite.validateur}.
                      </p>
                    </div>
                  )}

                  {activite.statut === 'REJETEE' && (
                    <div className="ml-16 p-3 bg-white/70 rounded-lg border border-red-200">
                      <p className="text-sm font-medium text-red-800 mb-1">
                        ❌ Rejetée le {formatDate(activite.dateRejet!)} :
                      </p>
                      <p className="text-sm text-red-700 italic">
                        &quot;{activite.motifRejet}&quot;
                      </p>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="mt-3 text-red-600 border-red-300 hover:bg-red-50"
                      >
                        <RefreshCw className="w-3.5 h-3.5 mr-1" />
                        Corriger et resoumettre
                      </Button>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="ml-16 flex items-center gap-2">
                    <Link href={`/app/activites/${activite.id}`}>
                      <Button variant="ghost" size="sm" className="gap-1">
                        <Eye className="w-3.5 h-3.5" />
                        Voir les détails
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}

        {mockSoumises.length === 0 && (
          <Card className="border-dashed border-2 border-slate-200">
            <CardContent className="p-8 text-center">
              <CheckCircle2 className="w-12 h-12 mx-auto text-slate-300 mb-3" />
              <p className="text-slate-500 font-medium">Aucune activité soumise</p>
              <p className="text-sm text-slate-400 mt-1">
                Vos activités soumises apparaîtront ici.
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
    </div>
  )
}
