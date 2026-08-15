import { Suspense } from 'react'
import { notFound } from 'next/navigation'
import { getActivityDetail, submitActivity } from '@/lib/actions/activities'
import { ActivityDetailHeader } from '@/components/metier/activities/activity-detail-header'
import { ActivityTabs } from '@/components/metier/activities/activity-tabs'
import { ActivityDetailActions } from './activity-actions'

// Metadata pour SEO
export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  try {
    const { activity } = await getActivityDetail(id)
    if (!activity) return { title: 'Activité non trouvée - e-OSCS' }
    return {
      title: `${activity.intitule} - e-OSCS`,
      description: activity.description?.substring(0, 160) || `Détail de l'activité ${activity.reference}`,
    }
  } catch {
    return { title: 'Activité - e-OSCS' }
  }
}

// Composant de loading pour Suspense
function ActivityDetailSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 bg-slate-200 rounded-lg" />
        <div className="space-y-2 flex-1">
          <div className="h-7 bg-slate-200 rounded w-2/3" />
          <div className="h-4 bg-slate-200 rounded w-1/3" />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-24 bg-slate-200 rounded-xl" />
        ))}
      </div>
      <div className="h-64 bg-slate-200 rounded-xl" />
    </div>
  )
}

// Page principale du détail activité
async function ActivityDetailContent({ id }: { id: string }) {
  const { activity, beneficiaries, actors } = await getActivityDetail(id)

  if (!activity) {
    notFound()
  }

  return (
    <div className="space-y-6 pb-20">
      {/* Header avec actions */}
      <ActivityDetailHeader 
        activity={activity}
        onEdit={() => {}} // Géré par le composant client Actions
        onSubmit={() => {}} // Géré par le composant client Actions
      />

      {/* Onglets */}
      <ActivityTabs
        activity={activity}
        beneficiaries={beneficiaries}
        actors={actors}
        onDeleteActor={() => {}}
      />

      {/* Barre d'actions sticky (client component) */}
      <ActivityDetailActions 
        activityId={id}
        statut={activity.statut}
      />
    </div>
  )
}

export default async function ActivityDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  
  return (
    <Suspense fallback={<ActivityDetailSkeleton />}>
      <ActivityDetailContent id={id} />
    </Suspense>
  )
}
