'use client'

import React, { useState } from 'react'
import { useToast } from '@/hooks/use-toast'
import { 
  addPlanActivity, 
  updatePlanActivity, 
  deletePlanActivity 
} from '@/lib/actions/activities'
import { PlanTable } from '@/components/metier/planning/plan-table'

// Types
interface PlanActivity {
  id: string
  axe_strategique: string
  objectif: string
  activite_prevue: string
  indicateur?: string
  cible?: string
  responsable?: string
  periode_prevue?: string
  budget?: number
  observations?: string
  realise: boolean
}

interface PlanTableClientWrapperProps {
  planId: string
  activities: PlanActivity[]
  isPlanClosed: boolean
}

export default function PlanTableClientWrapper({ 
  planId, 
  activities: initialActivities, 
  isPlanClosed 
}: PlanTableClientWrapperProps) {
  const { toast } = useToast()
  const [activities, setActivities] = useState<PlanActivity[]>(initialActivities)

  const handleAdd = async (data: Omit<PlanActivity, 'id' | 'realise'>) => {
    try {
      const result = await addPlanActivity(planId, data)
      
      if (result.success && result.activity) {
        setActivities(prev => [...prev, result.activity!])
        toast({
          title: 'Activité ajoutée',
          description: "L'activité a été ajoutée au plan avec succès.",
        })
      } else {
        toast({
          title: 'Erreur',
          description: result.error || "Une erreur est survenue.",
          variant: 'destructive',
        })
      }
    } catch (error) {
      console.error('Error adding activity:', error)
      toast({
        title: 'Erreur',
        description: "Une erreur inattendue est survenue.",
        variant: 'destructive',
      })
    }
  }

  const handleUpdate = async (id: string, data: Partial<PlanActivity>) => {
    try {
      const result = await updatePlanActivity(id, data)
      
      if (result.success && result.activity) {
        setActivities(prev => prev.map(a => a.id === id ? result.activity! : a))
        toast({
          title: 'Activité mise à jour',
          description: "Les modifications ont été enregistrées.",
        })
      } else {
        toast({
          title: 'Erreur',
          description: result.error || "Une erreur est survenue.",
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
    }
  }

  const handleDelete = async (id: string) => {
    try {
      const result = await deletePlanActivity(id)
      
      if (result.success) {
        setActivities(prev => prev.filter(a => a.id !== id))
        toast({
          title: 'Activité supprimée',
          description: "L'activité a été supprimée du plan.",
        })
      } else {
        toast({
          title: 'Erreur',
          description: result.error || "Une erreur est survenue.",
          variant: 'destructive',
        })
      }
    } catch (error) {
      console.error('Error deleting activity:', error)
      toast({
        title: 'Erreur',
        description: "Une erreur inattendue est survenue.",
        variant: 'destructive',
      })
    }
  }

  const handleToggleRealise = async (id: string, realised: boolean) => {
    await handleUpdate(id, { realise: realised })
  }

  return (
    <PlanTable
      activities={activities}
      isPlanClosed={isPlanClosed}
      onAdd={handleAdd}
      onUpdate={handleUpdate}
      onDelete={handleDelete}
      onToggleRealise={handleToggleRealise}
    />
  )
}
