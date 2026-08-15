'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Edit, Send, Printer, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'
import { submitActivity } from '@/lib/actions/activities'

interface ActivityDetailActionsProps {
  activityId: string
  statut: string
}

export function ActivityDetailActions({ activityId, statut }: ActivityDetailActionsProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const canEdit = ['BROUILLON', 'CORRECTION'].includes(statut)
  const canSubmit = statut === 'BROUILLON'

  const handleEdit = () => {
    router.push(`/app/activites/${activityId}/modifier`)
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    
    try {
      const result = await submitActivity(activityId)
      
      if (result.success) {
        toast({
          title: 'Activité soumise',
          description: "L'activité a été soumise pour validation avec succès.",
        })
        // Recharger la page pour voir le nouveau statut
        router.refresh()
      } else {
        toast({
          title: 'Erreur',
          description: result.error || "Une erreur est survenue lors de la soumission.",
          variant: 'destructive',
        })
      }
    } catch (error) {
      console.error('Error submitting activity:', error)
      toast({
        title: 'Erreur',
        description: "Une erreur inattendue est survenue.",
        variant: 'destructive',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handlePrint = () => {
    window.print()
    toast({
      title: 'Impression',
      description: "Préparation de l'impression en cours...",
    })
  }

  // Ne pas afficher si aucune action possible
  if (!canEdit && !canSubmit && statut !== 'VALIDE') {
    return null
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 shadow-lg z-40 print:hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center justify-end gap-3">
          {/* Bouton Imprimer (toujours visible pour les activités validées) */}
          {(statut === 'VALIDE' || statut === 'CONSOLIDE') && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handlePrint}
              className="gap-2"
            >
              <Printer className="w-4 h-4" />
              Imprimer / PDF
            </Button>
          )}
          
          {/* Bouton Modifier */}
          {canEdit && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleEdit}
              className="gap-2"
            >
              <Edit className="w-4 h-4" />
              Modifier
            </Button>
          )}
          
          {/* Bouton Soumettre */}
          {canSubmit && (
            <Button 
              size="sm" 
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="gap-2 bg-green-600 hover:bg-green-700"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Soumission...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Soumettre pour validation
                </>
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
