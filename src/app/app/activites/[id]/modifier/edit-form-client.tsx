'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import { ActivityForm, ActivityFormData } from '@/components/metier/activities/activity-form'
import { updateActivity } from '@/lib/actions/activities'
import { useToast } from '@/hooks/use-toast'

interface EditActivityFormClientProps {
  activityId: string
  initialData: Partial<ActivityFormData>
}

export default function EditActivityFormClient({ 
  activityId, 
  initialData 
}: EditActivityFormClientProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (data: ActivityFormData, action: 'draft' | 'submit') => {
    setIsSubmitting(true)

    try {
      // Préparer les données pour la mise à jour
      const updateData = {
        intitule: data.intitule,
        description: data.description,
        objectif: data.objectif,
        category_id: data.category_id,
        type_id: data.type_id,
        date_activite: data.date_activite,
        region: data.region,
        departement: data.departement,
        sous_prefecture: data.sous_prefecture,
        structure_responsable: data.structure_responsable,
        responsables: data.responsables,
        budget_alloue: data.budget_alloue ? parseFloat(data.budget_alloue) : undefined,
        resultats: data.resultats,
        difficultes: data.difficultes,
        recommandations: data.recommandations,
        perspectives: data.perspectives,
        observations: data.observations,
      }

      // Mettre à jour l'activité
      const result = await updateActivity(activityId, updateData)

      if (result.success) {
        toast({
          title: action === 'draft' ? 'Brouillon sauvegardé' : 'Activité mise à jour',
          description: action === 'draft' 
            ? "Les modifications ont été sauvegardées en brouillon."
            : "Les modifications ont été enregistrées avec succès.",
        })
        
        // Rediriger vers le détail
        router.push(`/app/activites/${activityId}`)
        router.refresh()
      } else {
        toast({
          title: 'Erreur',
          description: result.error || "Une erreur est survenue lors de la mise à jour.",
          variant: 'destructive',
        })
      }
    } catch (error) {
      console.error('Error updating activity:', error)
      toast({
        title: 'Erreur',
        description: "Une erreur inattendue est survenue.",
        variant: 'destructive',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <ActivityForm
      initialData={initialData}
      onSubmit={handleSubmit}
      isSubmitting={isSubmitting}
      submitLabel="Enregistrer les modifications"
      draftLabel="Sauvegarder le brouillon"
      showSubmitButton={true}
    />
  )
}
