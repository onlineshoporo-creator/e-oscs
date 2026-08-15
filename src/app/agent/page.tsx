import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import {
  PlusCircle,
  ClipboardList,
  Clock,
  CheckCircle2,
  ArrowRight,
  Calendar,
  MapPin,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

// Données mockées pour les statistiques (seront remplacées par l'API)
const mockStats = {
  totalMois: 12,
  enAttente: 3,
  validees: 9,
}

// Données mockées pour les activités récentes (seront remplacées par l'API)
const recentActivities = [
  {
    id: '1',
    intitule: 'Sensibilisation sur l\'hygiène communautaire',
    date: '2025-01-15',
    lieu: 'Abidjan, Yopougon',
    statut: 'VALIDEE',
    type: 'SENSIBILISATION',
  },
  {
    id: '2',
    intitule: 'Distribution de kits scolaires',
    date: '2025-01-12',
    lieu: 'Bouaké',
    statut: 'EN_ATTENTE',
    type: 'DISTRIBUTION',
  },
  {
    id: '3',
    intitule: 'Formation en techniques agricoles',
    date: '2025-01-10',
    lieu: 'Yamoussoukro',
    statut: 'BROUILLON',
    type: 'FORMATION',
  },
  {
    id: '4',
    intitule: 'Visite aux personnes âgées',
    date: '2025-01-08',
    lieu: 'San-Pedro',
    statut: 'VALIDEE',
    type: 'VISITE',
  },
]

// Helper pour obtenir le label du statut
function getStatutBadge(statut: string) {
  switch (statut) {
    case 'VALIDEE':
      return <Badge className="bg-green-100 text-green-700 border-green-200">Validée</Badge>
    case 'EN_ATTENTE':
      return <Badge className="bg-yellow-100 text-yellow-700 border-yellow-200">En attente</Badge>
    case 'BROUILLON':
      return <Badge className="bg-slate-100 text-slate-600 border-slate-200">Brouillon</Badge>
    default:
      return <Badge variant="secondary">{statut}</Badge>
  }
}

// Helper pour formater la date
function formatDate(dateStr: string): string {
  const date = new Date(dateStr)
  return date.toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

export default async function AgentHomePage() {
  // Récupérer les infos utilisateur pour personnaliser l'accueil
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  let userName = 'Agent'
  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('full_name')
      .eq('id', user.id)
      .single()
    
    if (profile?.full_name) {
      // Prendre seulement le prénom
      userName = profile.full_name.split(' ')[0]
    }
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Section Bienvenue */}
      <section className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl p-6 lg:p-8 text-white shadow-lg shadow-orange-500/20">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold mb-2">
              Bonjour, {userName} ! 👋
            </h1>
            <p className="text-orange-100 text-lg max-w-xl">
              Bienvenue dans votre espace simplifié. Saisissez facilement vos activités 
              et suivez leur progression.
            </p>
          </div>
          
          {/* CTA Principal - Grand bouton orange */}
          <Link href="/agent/activites/nouvelle">
            <Button 
              size="lg" 
              className="bg-white text-orange-600 hover:bg-orange-50 font-semibold text-lg px-8 py-6 h-auto shadow-xl hover:shadow-2xl transition-all duration-200"
            >
              <PlusCircle className="w-6 h-6 mr-2" />
              Nouvelle activité
            </Button>
          </Link>
        </div>
      </section>

      {/* Statistiques Rapides */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="border-slate-200 hover:shadow-md transition-shadow">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
              <ClipboardList className="w-7 h-7 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500 font-medium">Ce mois-ci</p>
              <p className="text-3xl font-bold text-slate-900">{mockStats.totalMois}</p>
              <p className="text-xs text-slate-400">activités créées</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200 hover:shadow-md transition-shadow">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-yellow-50 flex items-center justify-center flex-shrink-0">
              <Clock className="w-7 h-7 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500 font-medium">En attente</p>
              <p className="text-3xl font-bold text-slate-900">{mockStats.enAttente}</p>
              <p className="text-xs text-slate-400">de validation</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200 hover:shadow-md transition-shadow">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-green-50 flex items-center justify-center flex-shrink-0">
              <CheckCircle2 className="w-7 h-7 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500 font-medium">Validées</p>
              <p className="text-3xl font-bold text-slate-900">{mockStats.validees}</p>
              <p className="text-xs text-slate-400">ce mois-ci</p>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Dernières Activités */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-slate-900">Mes dernières activités</h2>
          <Link href="/agent/activites">
            <Button variant="ghost" className="text-orange-600 hover:text-orange-700 hover:bg-orange-50">
              Voir toutes
              <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </Link>
        </div>

        <Card className="border-slate-200 overflow-hidden">
          <div className="divide-y divide-slate-100">
            {recentActivities.map((activity) => (
              <Link 
                key={activity.id}
                href={`/app/activites/${activity.id}`}
                className="flex items-center gap-4 p-4 hover:bg-slate-50 transition-colors"
              >
                <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0">
                  <ClipboardList className="w-5 h-5 text-slate-500" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-slate-900 truncate">
                    {activity.intitule}
                  </h3>
                  <div className="flex items-center gap-3 mt-1 text-sm text-slate-500">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {formatDate(activity.date)}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5" />
                      {activity.lieu}
                    </span>
                  </div>
                </div>

                <div className="flex-shrink-0">
                  {getStatutBadge(activity.statut)}
                </div>
              </Link>
            ))}
          </div>
          
          {recentActivities.length === 0 && (
            <div className="p-8 text-center">
              <ClipboardList className="w-12 h-12 mx-auto text-slate-300 mb-3" />
              <p className="text-slate-500 font-medium">Aucune activité pour le moment</p>
              <p className="text-sm text-slate-400 mt-1">
                Commencez par créer votre première activité !
              </p>
              <Link href="/agent/activites/nouvelle" className="mt-4 inline-block">
                <Button className="bg-orange-500 hover:bg-orange-600 text-white">
                  <PlusCircle className="w-4 h-4 mr-2" />
                  Créer une activité
                </Button>
              </Link>
            </div>
          )}
        </Card>
      </section>

      {/* Actions rapides */}
      <section className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card className="border-dashed border-2 border-orange-200 bg-orange-50/30 hover:bg-orange-50 transition-colors cursor-pointer">
          <Link href="/agent/activites/nouvelle" className="block p-5">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center">
                <PlusCircle className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900">Démarrer une nouvelle activité</h3>
                <p className="text-sm text-slate-500 mt-0.5">
                  Suivez le guide étape par étape
                </p>
              </div>
            </div>
          </Link>
        </Card>

        <Card className="border-dashed border-2 border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition-colors cursor-pointer">
          <Link href="/agent/brouillons" className="block p-5">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center">
                <ClipboardList className="w-6 h-6 text-slate-600" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900">Mes brouillons</h3>
                <p className="text-sm text-slate-500 mt-0.5">
                  Reprenez vos activités inachevées
                </p>
              </div>
            </div>
          </Link>
        </Card>
      </section>
    </div>
  )
}
