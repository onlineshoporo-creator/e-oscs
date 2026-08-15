import { Suspense } from 'react'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Save, Send } from 'lucide-react'
import { getActivityDetail, updateActivity } from '@/lib/actions/activities'
import { ActivityForm, ActivityFormData } from '@/components/metier/activities/activity-form'
import { Button } from '@/components/ui/button'

// Composant de loading
function EditActivitySkeleton() {
  return (
    <div className="space-y-6 animate-pulse max-w-4xl mx-auto">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 bg-slate-200 rounded-lg" />
        <div className="space-y-2 flex-1">
          <div className="h-7 bg-slate-200 rounded w-1/2" />
          <div className="h-4 bg-slate-200 rounded w-1/3" />
        </div>
      </div>
      {[...Array(5)].map((_, i) => (
        <div key={i} className="h-48 bg-slate-200 rounded-xl" />
      ))}
    </div>
  )
}

// Contenu principal de la page d'édition
async function EditActivityContent({ id }: { id: string }) {
  const { activity, beneficiaries, actors } = await getActivityDetail(id)

  if (!activity) {
    notFound()
  }

  // Vérifier que l'activité peut être modifiée
  const canEdit = ['BROUILLON', 'CORRECTION'].includes(activity.statut)
  
  if (!canEdit) {
    return (
      <div className="max-w-4xl mx-auto text-center py-12">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h1 className="text-xl font-bold text-slate-900 mb-2">Modification impossible</h1>
        <p className="text-slate-500 mb-6">
          Cette activité est actuellement en statut &laquo;{activity.statut}&raquo; et ne peut pas être modifiée.
        </p>
        <Link href={`/app/activites/${id}`}>
          <Button variant="outline">Retour au détail</Button>
        </Link>
      </div>
    )
  }

  // Préparer les données initiales pour le formulaire
  const initialData: Partial<ActivityFormData> = {
    intitule: activity.intitule,
    description: activity.description || '',
    objectif: activity.objectif || '',
    category_id: activity.category_id || '',
    type_id: activity.type_id || '',
    date_activite: activity.date_activite ? new Date(activity.date_activite).toISOString().split('T')[0] : '',
    region: activity.region || '',
    departement: activity.departement || '',
    sous_prefecture: activity.sous_prefecture || '',
    structure_responsable: activity.structure_responsable || '',
    responsables: activity.responsables || [],
    budget_alloue: activity.budget_alloue?.toString() || '',
    // Bénéficiaires
    hommes: beneficiaries?.hommes?.toString() || '0',
    femmes: beneficiaries?.femmes?.toString() || '0',
    enfants: beneficiaries?.enfants?.toString() || '0',
    adultes: beneficiaries?.adultes?.toString() || '0',
    personnes_agees: beneficiaries?.persones_agees?.toString() || '0',
    vulnerables: beneficiaries?.vulnerables?.toString() || '0',
    // Résultats
    resultats: activity.resultats || '',
    difficultes: activity.difficultes || '',
    recommandations: activity.recommandations || '',
    perspectives: activity.perspectives || '',
    observations: activity.observations || '',
  }

  // Handler de soumission du formulaire (sera passé au composant client)
  const handleFormSubmit = async () => {
    // Cette fonction sera gérée côté client via un server action wrapper
    // Le composant ActivityForm appelle onSubmit qui doit être une fonction async
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href={`/app/activites/${id}`}>
          <Button variant="ghost" size="icon">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Modifier l&apos;activité</h1>
          <p className="text-slate-500 mt-1">
            Référence : {activity.reference} • Statut : {activity.statut}
          </p>
        </div>
      </div>

      {/* Formulaire */}
      <EditActivityForm 
        activityId={id}
        initialData={initialData}
      />
    </div>
  )
}

// Composant client pour gérer le formulaire
import EditActivityFormClient from './edit-form-client'

// Wrapper server component
function EditActivityForm({ 
  activityId, 
  initialData 
}: { 
  activityId: string
  initialData: Partial<ActivityFormData>
}) {
  return (
    <EditActivityFormClient 
      activityId={activityId}
      initialData={initialData}
    />
  )
}

export default async function EditActivityPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  
  return (
    <Suspense fallback={<EditActivitySkeleton />}>
      <EditActivityContent id={id} />
    </Suspense>
  )
}
