'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, Calendar, FileText } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/hooks/use-toast'
import { createAnnualPlan } from '@/lib/actions/activities'

interface CreatePlanFormClientProps {
  organizationId: string
  annee: number
}

export default function CreatePlanFormClient({ organizationId, annee }: CreatePlanFormClientProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [titre, setTitre] = useState(`Plan annuel ${annee}`)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!titre.trim()) {
      toast({
        title: 'Champ obligatoire',
        description: "Veuillez entrer un titre pour le plan.",
        variant: 'destructive',
      })
      return
    }

    setIsSubmitting(true)

    try {
      const result = await createAnnualPlan({
        organization_id: organizationId,
        annee,
        titre: titre.trim(),
      })

      if (result.success && result.plan) {
        toast({
          title: 'Plan créé',
          description: `Le plan annuel ${annee} a été créé avec succès.`,
        })
        
        // Rediriger vers le détail du plan
        router.push(`/app/planification/${annee}`)
        router.refresh()
      } else {
        toast({
          title: 'Erreur',
          description: result.error || "Une erreur est survenue lors de la création.",
          variant: 'destructive',
        })
      }
    } catch (error) {
      console.error('Error creating plan:', error)
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
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card className="border-slate-200">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-50 rounded-lg">
              <Calendar className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <CardTitle>Informations du plan</CardTitle>
              <CardDescription>
                Définissez les informations de base de votre plan annuel
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Année (lecture seule) */}
          <div className="space-y-2">
            <Label htmlFor="annee">Année</Label>
            <Input
              id="annee"
              value={annee.toString()}
              disabled
              className="bg-slate-50"
            />
            <p className="text-xs text-slate-500">
              L&apos;année ne peut pas être modifiée après la création.
            </p>
          </div>

          {/* Titre */}
          <div className="space-y-2">
            <Label htmlFor="titre">
              Titre du plan <span className="text-red-500">*</span>
            </Label>
            <Input
              id="titre"
              value={titre}
              onChange={(e) => setTitre(e.target.value)}
              placeholder="Ex: Plan opérationnel 2025 - DR Abidjan"
              required
            />
          </div>

          {/* Informations complémentaires */}
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
            <div className="flex gap-3">
              <FileText className="w-5 h-5 text-blue-600 mt-0.5 shrink-0" />
              <div className="text-sm text-blue-800">
                <p className="font-medium mb-1">Après création</p>
                <p className="text-blue-600">
                  Une fois le plan créé, vous pourrez ajouter des activités planifiées 
                  avec leurs objectifs, indicateurs et budgets.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex justify-end gap-3 print:hidden">
        <Button 
          type="button" 
          variant="outline"
          onClick={() => router.push('/app/planification')}
        >
          Annuler
        </Button>
        <Button 
          type="submit"
          disabled={isSubmitting || !titre.trim()}
          className="gap-2 bg-green-600 hover:bg-green-700 min-w-[160px]"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Création...
            </>
          ) : (
            <>
              <Calendar className="w-4 h-4" />
              Créer le plan
            </>
          )}
        </Button>
      </div>
    </form>
  )
}
