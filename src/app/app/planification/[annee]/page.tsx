import { Suspense } from 'react'
import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Calendar, Lock, Unlock, Download, Loader2 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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
import { PlanStats } from '@/components/metier/planning/plan-stats'
import { PlanTable } from '@/components/metier/planning/plan-table'
import { 
  getPlanDetail, 
  createAnnualPlan, 
  addPlanActivity, 
  updatePlanActivity, 
  deletePlanActivity,
  closeAnnualPlan
} from '@/lib/actions/activities'
import { getCurrentUserWithOrg } from '@/lib/actions/app'

// Composant de loading
function PlanDetailSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 bg-slate-200 rounded-lg" />
        <div className="space-y-2 flex-1">
          <div className="h-7 bg-slate-200 rounded w-1/2" />
          <div className="h-4 bg-slate-200 rounded w-1/3" />
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-28 bg-slate-200 rounded-xl" />
        ))}
      </div>
      <div className="h-64 bg-slate-200 rounded-xl" />
    </div>
  )
}

// Contenu principal du plan
async function PlanDetailContent({ annee, searchParams }: { annee: number; searchParams?: { action?: string } }) {
  // Récupérer l'utilisateur et son organisation
  const userWithOrg = await getCurrentUserWithOrg()
  
  if (!userWithOrg?.profile?.organization_id) {
    redirect('/app/planification')
  }

  const organizationId = userWithOrg.profile.organization_id
  const yearNum = typeof annee === 'string' ? parseInt(annee, 10) : annee
  
  // Récupérer le plan et ses activités
  const { plan, activities } = await getPlanDetail(organizationId, yearNum)
  
  // Si le plan n'existe pas et on demande la création
  if (!plan && searchParams?.action === 'create') {
    return <CreatePlanForm organizationId={organizationId} annee={yearNum} />
  }

  // Si le plan n'existe pas
  if (!plan) {
    return (
      <div className="max-w-lg mx-auto text-center py-12">
        <Calendar className="w-16 h-16 mx-auto mb-4 text-slate-300" />
        <h2 className="text-xl font-semibold text-slate-900 mb-2">Plan non trouvé</h2>
        <p className="text-slate-500 mb-6">
          Aucun plan annuel n&apos;existe pour l&apos;année {yearNum}.
        </p>
        <Link href={`/app/planification/${yearNum}?action=create`}>
          <Button className="gap-2 bg-green-600 hover:bg-green-700">
            Créer le plan {yearNum}
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link href="/app/planification">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          
          <div>
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-2xl font-bold text-slate-900">
                {plan.titre || `Plan annuel ${yearNum}`}
              </h1>
              <Badge 
                variant="secondary"
                className={
                  plan.statut === 'OUVERT' 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-slate-100 text-slate-600'
                }
              >
                {plan.statut === 'OUVERT' ? (
                  <>
                    <Unlock className="w-3.5 h-3.5 mr-1" />
                    Ouvert
                  </>
                ) : (
                  <>
                    <Lock className="w-3.5 h-3.5 mr-1" />
                    Clôturé
                  </>
                )}
              </Badge>
            </div>
            <p className="text-slate-500 mt-1">
              Année {yearNum} • {activities.length} activité{activities.length > 1 ? 's' : ''} planifiée{activities.length > 1 ? 's' : ''}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 print:hidden">
          {plan.statut === 'OUVERT' && activities.length > 0 && (
            <ClosePlanDialog planId={plan.id} planAnnee={yearNum} />
          )}
          
          <Button variant="outline" size="sm" className="gap-2">
            <Download className="w-4 h-4" />
            Exporter
          </Button>
        </div>
      </div>

      {/* Statistiques */}
      <PlanStats 
        annee={yearNum} 
        titre={plan.titre || ''} 
        statut={plan.statut}
        activities={activities}
      />

      {/* Tableau des activités */}
      <PlanTableClientWrapper 
        planId={plan.id}
        activities={activities}
        isPlanClosed={plan.statut === 'CLOTURE'}
      />

      {/* Informations supplémentaires */}
      {plan.statut === 'CLOTURE' && (
        <Card className="bg-green-50 border-green-200">
          <CardContent className="p-4 flex items-start gap-3">
            <Lock className="w-5 h-5 text-green-600 mt-0.5 shrink-0" />
            <div className="text-sm text-green-800">
              <p className="font-medium">Plan clôturé</p>
              <p className="text-green-600 mt-1">
                Ce plan a été clôturé. Les activités ne peuvent plus être modifiées.
                Vous pouvez consulter les données mais pas les éditer.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

// Formulaire de création de plan (Server Component avec form action)
async function CreatePlanForm({ organizationId, annee }: { organizationId: string; annee: number }) {
  return (
    <div className="max-w-lg mx-auto space-y-6 pb-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/app/planification">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Créer un plan annuel</h1>
          <p className="text-slate-500 mt-1">Année {annee}</p>
        </div>
      </div>

      {/* Formulaire */}
      <CreatePlanFormClient organizationId={organizationId} annee={annee} />
    </div>
  )
}

// Dialogue pour clôturer un plan
function ClosePlanDialog({ planId, planAnnee }: { planId: string; planAnnee: number }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2 text-amber-700 border-amber-300 hover:bg-amber-50">
          <Lock className="w-4 h-4" />
          Clôturer le plan
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Clôturer le plan annuel</DialogTitle>
          <DialogDescription>
            Êtes-vous sûr de vouloir clôturer le plan {planAnnee} ? 
            Cette action est irréversible et empêchera toute modification ultérieure des activités.
          </DialogDescription>
        </DialogHeader>
        
        <form action={async () => {
          'use server'
          await closeAnnualPlan(planId)
        }}>
          <DialogFooter>
            <DialogTrigger asChild>
              <Button type="button" variant="outline">Annuler</Button>
            </DialogTrigger>
            <Button type="submit" className="bg-amber-600 hover:bg-amber-700">
              Confirmer la clôture
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

// Wrapper client pour le tableau d'activités
import PlanTableClientWrapper from './plan-table-client'
import CreatePlanFormClient from './create-plan-form-client'

export default async function PlanDetailPage({ 
  params, 
  searchParams 
}: { 
  params: Promise<{ annee: string }>
  searchParams?: Promise<{ action?: string }>
}) {
  const resolvedParams = await params
  const resolvedSearchParams = await searchParams
  const annee = parseInt(resolvedParams.annee, 10)
  
  if (isNaN(annee)) {
    notFound()
  }
  
  return (
    <Suspense fallback={<PlanDetailSkeleton />}>
      <PlanDetailContent 
        annee={annee} 
        searchParams={resolvedSearchParams}
      />
    </Suspense>
  )
}
