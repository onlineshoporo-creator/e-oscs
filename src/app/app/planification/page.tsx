import { Suspense } from 'react'
import Link from 'next/link'
import { Plus, Calendar, FolderOpen, Lock, ChevronRight } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { getAnnualPlans, createAnnualPlan } from '@/lib/actions/activities'
import { getCurrentUserWithOrg } from '@/lib/actions/app'
import { AnnualPlan } from '@/lib/actions/activities'

// Générer les années disponibles (année courante - 2 à + 2)
function generateAvailableYears(): number[] {
  const currentYear = new Date().getFullYear()
  const years: number[] = []
  for (let y = currentYear - 2; y <= currentYear + 2; y++) {
    years.push(y)
  }
  return years
}

// Composant de loading
function PlanningSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-8 bg-slate-200 rounded w-1/3" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-40 bg-slate-200 rounded-xl" />
        ))}
      </div>
    </div>
  )
}

// Contenu principal de la page planification
async function PlanningContent() {
  // Récupérer l'utilisateur et son organisation
  const userWithOrg = await getCurrentUserWithOrg()
  
  if (!userWithOrg?.profile?.organization_id) {
    return (
      <div className="text-center py-12">
        <FolderOpen className="w-16 h-16 mx-auto mb-4 text-slate-300" />
        <h2 className="text-xl font-semibold text-slate-900 mb-2">Organisation requise</h2>
        <p className="text-slate-500">Vous devez être associé à une organisation pour accéder à la planification.</p>
      </div>
    )
  }

  const organizationId = userWithOrg.profile.organization_id
  
  // Récupérer les plans annuels
  const plans = await getAnnualPlans(organizationId)
  const availableYears = generateAvailableYears()

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Planification annuelle</h1>
          <p className="text-slate-500 mt-1">
            Gérez vos plans d&apos;activités annuels et suivez leur exécution
          </p>
        </div>

        {/* Sélection rapide d'année */}
        <Select defaultValue={new Date().getFullYear().toString()}>
          <SelectTrigger className="w-[140px]">
            <Calendar className="w-4 h-4 mr-2" />
            <SelectValue placeholder="Année" />
          </SelectTrigger>
          <SelectContent>
            {availableYears.map(year => (
              <SelectItem key={year} value={year.toString()}>
                {year}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Liste des plans existants */}
      {plans.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <Card 
              key={plan.id} 
              className={`border-slate-200 hover:border-orange-300 hover:shadow-md transition-all cursor-pointer group ${
                plan.statut === 'CLOTURE' ? 'opacity-75' : ''
              }`}
            >
              <Link href={`/app/planification/${plan.annee}`}>
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className={`p-3 rounded-xl ${
                      plan.statut === 'OUVERT' ? 'bg-green-50' : 'bg-slate-100'
                    }`}>
                      <Calendar className={`w-6 h-6 ${
                        plan.statut === 'OUVERT' ? 'text-green-600' : 'text-slate-500'
                      }`} />
                    </div>
                    <Badge 
                      variant="secondary"
                      className={
                        plan.statut === 'OUVERT' 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-slate-100 text-slate-600'
                      }
                    >
                      {plan.statut === 'OUVERT' ? 'Ouvert' : 'Clôturé'}
                    </Badge>
                  </div>
                  <CardTitle className="text-lg mt-4 group-hover:text-orange-600 transition-colors">
                    {plan.titre || `Plan ${plan.annee}`}
                  </CardTitle>
                  <CardDescription>
                    Année {plan.annee}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between text-sm text-slate-500">
                    <span className="flex items-center gap-1.5">
                      {plan.statut === 'OUVERT' ? (
                        <Lock className="w-4 h-4 text-green-500" />
                      ) : (
                        <Lock className="w-4 h-4 text-slate-400" />
                      )}
                      {plan.statut === 'OUVERT' ? 'Édition possible' : 'Clôturé'}
                    </span>
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </CardContent>
              </Link>
            </Card>
          ))}

          {/* Carte pour créer un nouveau plan */}
          <CreatePlanCard organizationId={organizationId} availableYears={availableYears} existingPlans={plans} />
        </div>
      ) : (
        /* État vide */
        <div className="text-center py-12">
          <div className="max-w-md mx-auto">
            <div className="w-20 h-20 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <Calendar className="w-10 h-10 text-orange-500" />
            </div>
            <h2 className="text-xl font-semibold text-slate-900 mb-2">
              Aucun plan annuel créé
            </h2>
            <p className="text-slate-500 mb-6">
              Commencez par créer votre premier plan annuel pour organiser vos activités.
            </p>
            
            <CreatePlanDialog 
              organizationId={organizationId} 
              availableYears={availableYears}
              existingPlans={plans}
            />
          </div>
        </div>
      )}

      {/* Informations */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-4 flex items-start gap-3">
          <svg className="w-5 h-5 text-blue-600 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div className="text-sm text-blue-800">
            <p className="font-medium mb-1">À propos de la planification</p>
            <p className="text-blue-600">
              Le plan annuel vous permet de définir vos objectifs stratégiques et les activités prévues pour l&apos;année. 
              Vous pouvez suivre la progression de chaque activité et clôturer le plan une fois toutes les réalisations effectuées.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Composant carte pour créer un nouveau plan
function CreatePlanCard({ 
  organizationId, 
  availableYears,
  existingPlans 
}: { 
  organizationId: string
  availableYears: number[]
  existingPlans: AnnualPlan[]
}) {
  // Vérifier les années déjà utilisées
  const usedYears = existingPlans.map(p => p.annee)
  const nextYear = availableYears.find(y => !usedYears.includes(y)) || new Date().getFullYear() + 1

  return (
    <CreatePlanDialog 
      organizationId={organizationId} 
      availableYears={availableYears.filter(y => !usedYears.includes(y))}
      existingPlans={existingPlans}
      defaultYear={nextYear}
    />
  )
}

// Dialogue de création de plan
interface CreatePlanDialogProps {
  organizationId: string
  availableYears: number[]
  existingPlans: AnnualPlan[]
  defaultYear?: number
}

function CreatePlanDialog(props: CreatePlanDialogProps) {
  const { organizationId, availableYears, existingPlans, defaultYear } = props
  
  // Ce composant sera rendu côté serveur mais le dialogue nécessite un état client
  // Pour simplifier, on utilise un lien vers le formulaire de création
  if (availableYears.length === 0) {
    return null
  }

  const targetYear = defaultYear || availableYears[0]

  return (
    <Card className="border-dashed border-slate-300 hover:border-orange-400 transition-colors">
      <Link href={`/app/planification/${targetYear}?action=create`}>
        <CardContent className="flex flex-col items-center justify-center py-12 text-center min-h-[200px]">
          <div className="w-14 h-14 bg-orange-50 rounded-full flex items-center justify-center mb-4 group-hover:bg-orange-100 transition-colors">
            <Plus className="w-7 h-7 text-orange-500" />
          </div>
          <p className="font-medium text-slate-900 mb-1">Créer un nouveau plan</p>
          <p className="text-sm text-slate-500">
            Plan {targetYear}
          </p>
        </CardContent>
      </Link>
    </Card>
  )
}

export default async function PlanningPage() {
  return (
    <Suspense fallback={<PlanningSkeleton />}>
      <PlanningContent />
    </Suspense>
  )
}
