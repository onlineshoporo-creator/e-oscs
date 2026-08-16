import Link from 'next/link'
import {
  PlusCircle,
  ClipboardList,
  Clock,
  CheckCircle2,
  ArrowRight,
  Calendar,
  MapPin,
  FileEdit,
  Send,
  TrendingUp,
  BarChart3,
  AlertCircle,
  Sparkles,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'

// Données mockées pour les statistiques (seront remplacées par l'API)
const mockStats = {
  totalMois: 12,
  brouillons: 2,
  soumises: 3,
  validees: 9,
  tauxValidation: 75,
}

// Données mockées pour les activités récentes (seront remplacées par l'API)
const recentActivities = [
  {
    id: '1',
    intitule: 'Sensibilisation sur l\'hygiène communautaire',
    date: '2025-01-15',
    lieu: 'Abidjan, Yopougon',
    statut: 'VALIDEE' as const,
    type: 'SENSIBILISATION',
    beneficiaires: 45,
  },
  {
    id: '2',
    intitule: 'Distribution de kits scolaires',
    date: '2025-01-12',
    lieu: 'Bouaké',
    statut: 'EN_ATTENTE' as const,
    type: 'DISTRIBUTION',
    beneficiaires: 120,
  },
  {
    id: '3',
    intitule: 'Formation en techniques agricoles',
    date: '2025-01-10',
    lieu: 'Yamoussoukro',
    statut: 'BROUILLON' as const,
    type: 'FORMATION',
    beneficiaires: 30,
  },
  {
    id: '4',
    intitule: 'Visite aux personnes âgées',
    date: '2025-01-08',
    lieu: 'San-Pedro',
    statut: 'VALIDEE' as const,
    type: 'VISITE',
    beneficiaires: 25,
  },
  {
    id: '5',
    intitule: 'Atelier de sensibilisation VIH/SIDA',
    date: '2025-01-05',
    lieu: 'Abidjan, Treichville',
    statut: 'VALIDEE' as const,
    type: 'ATELIER',
    beneficiaires: 60,
  },
]

// Distribution pour le graphique
const statusDistribution = [
  { label: 'Validées', value: mockStats.validees, color: '#009E60', percentage: Math.round((mockStats.validees / mockStats.totalMois) * 100) },
  { label: 'En attente', value: mockStats.soumises - mockStats.validees > 0 ? mockStats.soumises - mockStats.validees : mockStats.soumises, color: '#F77F00', percentage: Math.round(((mockStats.soumises - mockStats.validees > 0 ? mockStats.soumises - mockStats.validees : mockStats.soumises) / mockStats.totalMois) * 100) || 0 },
  { label: 'Brouillons', value: mockStats.brouillons, color: '#94A3B8', percentage: Math.round((mockStats.brouillons / mockStats.totalMois) * 100) },
]

// Helper pour obtenir le badge du statut
function getStatutBadge(statut: string) {
  switch (statut) {
    case 'VALIDEE':
      return <Badge className="bg-green-100 text-green-700 border-green-200 hover:bg-green-200">Validée</Badge>
    case 'EN_ATTENTE':
      return <Badge className="bg-orange-100 text-orange-700 border-orange-200 hover:bg-orange-200">En attente</Badge>
    case 'BROUILLON':
      return <Badge className="bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200">Brouillon</Badge>
    case 'REJETEE':
      return <Badge className="bg-red-100 text-red-700 border-red-200 hover:bg-red-200">Rejetée</Badge>
    default:
      return <Badge variant="secondary">{statut}</Badge>
  }
}

// Helper pour obtenir l'icône de type
function getTypeIcon(type: string) {
  switch (type) {
    case 'SENSIBILISATION':
      return '📢'
    case 'FORMATION':
      return '🎓'
    case 'DISTRIBUTION':
      return '📦'
    case 'VISITE':
      return '🏠'
    case 'ATELIER':
      return '🔧'
    case 'REUNION':
      return '👥'
    default:
      return '📋'
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

// Helper pour formater la date relative
function getRelativeDate(dateStr: string): string {
  const date = new Date(dateStr)
  const now = new Date()
  const diffTime = now.getTime() - date.getTime()
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
  
  if (diffDays === 0) return "Aujourd'hui"
  if (diffDays === 1) return "Hier"
  if (diffDays < 7) return `Il y a ${diffDays} jours`
  if (diffDays < 30) return `Il y a ${Math.floor(diffDays / 7)} semaine(s)`
  return formatDate(dateStr)
}

export default async function AgentHomePage() {
  // Nom par défaut (sera personnalisé quand Supabase sera configuré)
  const userName = 'Agent'

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Section Bienvenue Améliorée */}
      <section className="relative overflow-hidden bg-gradient-to-r from-[#F77F00] via-[#E67300] to-[#009E60] rounded-2xl p-6 lg:p-8 text-white shadow-xl shadow-orange-500/20">
        {/* Décorations d'arrière-plan */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/4" />
        <div className="absolute bottom-0 left-1/3 w-40 h-40 bg-white/5 rounded-full translate-y-1/2" />
        
        <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold mb-2 flex items-center gap-2">
              Bonjour, {userName} ! 
              <Sparkles className="w-6 h-6 text-yellow-300 animate-pulse" />
            </h1>
            <p className="text-orange-100 text-lg max-w-xl">
              Bienvenue dans votre espace agent. Saisissez facilement vos activités 
              et suivez leur progression en temps réel.
            </p>
            
            {/* Indicateur rapide */}
            <div className="flex items-center gap-4 mt-4">
              <div className="flex items-center gap-2 bg-white/15 backdrop-blur-sm px-3 py-1.5 rounded-full text-sm">
                <CheckCircle2 className="w-4 h-4 text-green-300" />
                <span>{mockStats.validees} validées</span>
              </div>
              {mockStats.soumises > mockStats.validees && (
                <div className="flex items-center gap-2 bg-white/15 backdrop-blur-sm px-3 py-1.5 rounded-full text-sm">
                  <Clock className="w-4 h-4 text-yellow-300" />
                  <span>{mockStats.soumises - mockStats.validees} en attente</span>
                </div>
              )}
              {mockStats.brouillons > 0 && (
                <div className="flex items-center gap-2 bg-white/15 backdrop-blur-sm px-3 py-1.5 rounded-full text-sm">
                  <FileEdit className="w-4 h-4 text-blue-300" />
                  <span>{mockStats.brouillons} brouillon(s)</span>
                </div>
              )}
            </div>
          </div>
          
          {/* CTA Principal */}
          <Link href="/agent/activites/nouvelle">
            <Button 
              size="lg" 
              className="bg-white text-[#F77F00] hover:bg-orange-50 font-semibold text-lg px-8 py-6 h-auto shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-0.5"
            >
              <PlusCircle className="w-6 h-6 mr-2" />
              Nouvelle activité
            </Button>
          </Link>
        </div>
      </section>

      {/* Cartes KPIs Améliorées */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Activités ce mois */}
        <Card className="border-slate-200 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#F77F00] to-[#E67300] flex items-center justify-center shadow-lg shadow-orange-500/30 group-hover:scale-110 transition-transform">
                <ClipboardList className="w-6 h-6 text-white" />
              </div>
              <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                +20%
              </span>
            </div>
            <p className="text-sm text-slate-500 font-medium">Activités ce mois</p>
            <p className="text-3xl font-bold text-slate-900 mt-1">{mockStats.totalMois}</p>
            <Progress value={75} className="mt-3 h-1.5" />
          </CardContent>
        </Card>

        {/* KPI 2: Brouillons */}
        <Card className="border-slate-200 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-slate-400 to-slate-500 flex items-center justify-center shadow-lg shadow-slate-500/30 group-hover:scale-110 transition-transform">
                <FileEdit className="w-6 h-6 text-white" />
              </div>
              {mockStats.brouillons > 0 && (
                <span className="text-xs font-medium text-slate-600 bg-slate-100 px-2 py-1 rounded-full">
                  À compléter
                </span>
              )}
            </div>
            <p className="text-sm text-slate-500 font-medium">Brouillons</p>
            <p className="text-3xl font-bold text-slate-900 mt-1">{mockStats.brouillons}</p>
            <div className="flex items-center gap-2 mt-3">
              <Link href="/agent/brouillons" className="text-xs text-[#F77F00] hover:text-[#E67300] font-medium">
                Voir →
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* KPI 3: Soumises */}
        <Card className="border-slate-200 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#F77F00] to-yellow-500 flex items-center justify-center shadow-lg shadow-orange-500/30 group-hover:scale-110 transition-transform">
                <Send className="w-6 h-6 text-white" />
              </div>
              <span className="text-xs font-medium text-orange-600 bg-orange-50 px-2 py-1 rounded-full">
                En cours
              </span>
            </div>
            <p className="text-sm text-slate-500 font-medium">Soumises</p>
            <p className="text-3xl font-bold text-slate-900 mt-1">{mockStats.soumises}</p>
            <div className="flex items-center gap-2 mt-3">
              <Link href="/agent/soumises" className="text-xs text-[#F77F00] hover:text-[#E67300] font-medium">
                Suivre →
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* KPI 4: Taux validation */}
        <Card className="border-slate-200 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#009E60] to-emerald-600 flex items-center justify-center shadow-lg shadow-green-500/30 group-hover:scale-110 transition-transform">
                <CheckCircle2 className="w-6 h-6 text-white" />
              </div>
              <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                mockStats.tauxValidation >= 80 ? 'text-green-600 bg-green-50' : 'text-orange-600 bg-orange-50'
              }`}>
                {mockStats.tauxValidation >= 80 ? 'Excellent' : 'À améliorer'}
              </span>
            </div>
            <p className="text-sm text-slate-500 font-medium">Taux validation</p>
            <p className="text-3xl font-bold text-slate-900 mt-1">{mockStats.tauxValidation}%</p>
            <Progress value={mockStats.tauxValidation} className="mt-3 h-1.5 [&>div]:bg-[#009E60]" />
          </CardContent>
        </Card>
      </section>

      {/* Contenu principal: Activités récentes + Graphique + Actions rapides */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Activités récentes - prend 2 colonnes */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Clock className="w-5 h-5 text-[#F77F00]" />
              Activités récentes
            </h2>
            <Link href="/agent/activites">
              <Button variant="ghost" className="text-[#F77F00] hover:text-[#E67300] hover:bg-orange-50 font-medium">
                Voir toutes
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </div>

          <Card className="border-slate-200 overflow-hidden">
            <div className="divide-y divide-slate-100">
              {recentActivities.slice(0, 5).map((activity, index) => (
                <Link 
                  key={activity.id}
                  href={`/app/activites/${activity.id}`}
                  className="flex items-center gap-4 p-4 hover:bg-slate-50/80 transition-all duration-200 group"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  {/* Icône type */}
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-orange-50 to-orange-100 flex items-center justify-center flex-shrink-0 text-lg group-hover:scale-105 transition-transform">
                    {getTypeIcon(activity.type)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-slate-900 truncate group-hover:text-[#F77F00] transition-colors">
                      {activity.intitule}
                    </h3>
                    <div className="flex items-center gap-3 mt-1 text-sm text-slate-500">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {getRelativeDate(activity.date)}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5" />
                        {activity.lieu}
                      </span>
                      <span className="hidden sm:inline-flex items-center gap-1 text-slate-400">
                        👥 {activity.beneficiaires}
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
              <div className="p-10 text-center">
                <div className="w-16 h-16 mx-auto rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
                  <ClipboardList className="w-8 h-8 text-slate-400" />
                </div>
                <p className="text-slate-600 font-semibold text-lg">Aucune activité pour le moment</p>
                <p className="text-slate-400 mt-1 mb-4">
                  Commencez par créer votre première activité !
                </p>
                <Link href="/agent/activites/nouvelle">
                  <Button className="bg-[#F77F00] hover:bg-[#E67300] text-white">
                    <PlusCircle className="w-4 h-4 mr-2" />
                    Créer une activité
                  </Button>
                </Link>
              </div>
            )}
          </Card>
        </div>

        {/* Colonne latérale: Graphique + Actions rapides */}
        <div className="space-y-6">
          {/* Graphique de répartition CSS pur */}
          <Card className="border-slate-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold text-slate-900 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-[#009E60]" />
                Répartition ce mois
              </CardTitle>
            </CardHeader>
            <CardContent>
              {/* Graphique donut CSS */}
              <div className="relative w-40 h-40 mx-auto mb-4">
                <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                  {/* Cercle de fond */}
                  <circle
                    cx="18"
                    cy="18"
                    r="14"
                    fill="none"
                    stroke="#f1f5f9"
                    strokeWidth="4"
                  />
                  {/* Segment Validées (vert) */}
                  <circle
                    cx="18"
                    cy="18"
                    r="14"
                    fill="none"
                    stroke="#009E60"
                    strokeWidth="4"
                    strokeDasharray={`${statusDistribution[0].percentage} ${100 - statusDistribution[0].percentage}`}
                    strokeDashoffset="0"
                    strokeLinecap="round"
                    className="transition-all duration-500"
                  />
                  {/* Segment En attente (orange) */}
                  <circle
                    cx="18"
                    cy="18"
                    r="14"
                    fill="none"
                    stroke="#F77F00"
                    strokeWidth="4"
                    strokeDasharray={`${statusDistribution[1].percentage} ${100 - statusDistribution[1].percentage}`}
                    strokeDashoffset={`-${statusDistribution[0].percentage}`}
                    strokeLinecap="round"
                    className="transition-all duration-500"
                  />
                  {/* Segment Brouillons (gris) */}
                  <circle
                    cx="18"
                    cy="18"
                    r="14"
                    fill="none"
                    stroke="#94A3B8"
                    strokeWidth="4"
                    strokeDasharray={`${statusDistribution[2].percentage} ${100 - statusDistribution[2].percentage}`}
                    strokeDashoffset={`-${statusDistribution[0].percentage + statusDistribution[1].percentage}`}
                    strokeLinecap="round"
                    className="transition-all duration-500"
                  />
                </svg>
                {/* Centre du donut */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-2xl font-bold text-slate-900">{mockStats.totalMois}</span>
                  <span className="text-xs text-slate-500">total</span>
                </div>
              </div>
              
              {/* Légende */}
              <div className="space-y-2">
                {statusDistribution.map((item) => (
                  <div key={item.label} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <span 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="text-slate-600">{item.label}</span>
                    </div>
                    <span className="font-medium text-slate-900">{item.value}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Actions rapides */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider px-1">
              Actions rapides
            </h3>
            
            <Link href="/agent/activites/nouvelle">
              <Card className="border-dashed border-2 border-[#F77F00]/30 bg-gradient-to-br from-orange-50/50 to-transparent hover:border-[#F77F00] hover:from-orange-100/50 transition-all duration-300 cursor-pointer group">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#F77F00] flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg shadow-orange-500/30">
                      <PlusCircle className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900 text-sm">Nouvelle activité</h3>
                      <p className="text-xs text-slate-500">Démarrer une saisie</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link href="/agent/rapports">
              <Card className="border-dashed border-2 border-slate-200 bg-slate-50/30 hover:border-[#009E60]/50 hover:bg-green-50/30 transition-all duration-300 cursor-pointer group">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#009E60] flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg shadow-green-500/30">
                      <BarChart3 className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900 text-sm">Mes rapports</h3>
                      <p className="text-xs text-slate-500">Consulter les statistiques</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link href="/agent/brouillons">
              <Card className="border-dashed border-2 border-slate-200 bg-slate-50/30 hover:border-slate-400 hover:bg-slate-100/50 transition-all duration-300 cursor-pointer group">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-500 flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg shadow-slate-500/30">
                      <FileEdit className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900 text-sm">Mes brouillons</h3>
                      <p className="text-xs text-slate-500">{mockStats.brouillons} à finaliser</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>
      </div>

      {/* Alerte info si activités en attente */}
      {(mockStats.soumises - mockStats.validees > 0 || mockStats.brouillons > 0) && (
        <Card className="border-blue-200 bg-blue-50/50">
          <CardContent className="p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-blue-800">
                Vous avez des actions en attente
              </p>
              <p className="text-sm text-blue-600 mt-1">
                {mockStats.brouillons > 0 && `${mockStats.brouillons} brouillon(s) à compléter. `}
                {mockStats.soumises > mockStats.validees && `${mockStats.soumises - mockStats.validees} activité(s) en attente de validation.`}
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
