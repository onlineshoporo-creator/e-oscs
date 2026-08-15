'use client'

import { useState } from 'react'
import { useToast } from '@/hooks/use-toast'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import type { Indicator, IndicatorKind } from '@/types'

interface IndicatorValueFormProps {
  indicators: Indicator[]
  onSubmit: (values: { indicator_id: string; valeur_numerique?: number; valeur_texte?: string }[]) => Promise<{ success: boolean; error?: string }>
  submitLabel?: string
  initialValues?: Record<string, number | string>
}

export function IndicatorValueForm({
  indicators,
  onSubmit,
  submitLabel = 'Enregistrer les valeurs',
  initialValues = {},
}: IndicatorValueFormProps) {
  const { toast } = useToast()
  const [values, setValues] = useState<Record<string, number | string>>(initialValues)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleNumericChange = (indicatorId: string, value: string) => {
    const numValue = value === '' ? '' : parseFloat(value)
    setValues(prev => ({ ...prev, [indicatorId]: numValue }))
  }

  const handleTextChange = (indicatorId: string, value: string) => {
    setValues(prev => ({ ...prev, [indicatorId]: value }))
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)

    try {
      // Préparer les valeurs à envoyer
      const valuesToSubmit = indicators
        .map(indicator => ({
          indicator_id: indicator.id,
          ...(indicator.kind === 'QUANTITATIF'
            ? { valeur_numerique: typeof values[indicator.id] === 'number' ? values[indicator.id] as number : undefined }
            : { valeur_texte: values[indicator.id]?.toString() || undefined }
          ),
        }))
        .filter(v => v.valeur_numerique !== undefined || v.valeur_texte !== undefined)

      if (valuesToSubmit.length === 0) {
        toast({
          title: 'Information',
          description: 'Veuillez saisir au moins une valeur',
        })
        return
      }

      const result = await onSubmit(valuesToSubmit)

      if (result.success) {
        toast({
          title: 'Succès',
          description: 'Valeurs enregistrées avec succès',
        })
        setValues({})
      } else {
        toast({
          title: 'Erreur',
          description: result.error || 'Une erreur est survenue',
          variant: 'destructive',
        })
      }
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Une erreur inattendue est survenue',
        variant: 'destructive',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-6">
        {indicators.map((indicator) => (
          <div key={indicator.id} className="space-y-2 p-4 rounded-lg border bg-card">
            <div className="flex items-start justify-between gap-2">
              <div>
                <Label htmlFor={`indicator-${indicator.id}`} className="font-medium">
                  {indicator.nom}
                </Label>
                <p className="text-xs text-muted-foreground mt-0.5">{indicator.code}</p>
              </div>
              {indicator.unite && indicator.kind === 'QUANTITATIF' && (
                <span className="text-xs text-muted-foreground bg-slate-100 px-2 py-1 rounded">
                  {indicator.unite}
                </span>
              )}
            </div>

            {indicator.kind === 'QUANTITATIF' ? (
              <Input
                id={`indicator-${indicator.id}`}
                type="number"
                step="any"
                placeholder={`Valeur en ${indicator.unite || 'unités'}`}
                value={values[indicator.id] ?? ''}
                onChange={(e) => handleNumericChange(indicator.id, e.target.value)}
              />
            ) : (
              <Textarea
                id={`indicator-${indicator.id}`}
                placeholder="Évaluation qualitative..."
                rows={3}
                value={(values[indicator.id] as string) || ''}
                onChange={(e) => handleTextChange(indicator.id, e.target.value)}
              />
            )}

            {indicator.description && (
              <p className="text-xs text-muted-foreground italic">{indicator.description}</p>
            )}
          </div>
        ))}
      </div>

      <Button onClick={handleSubmit} disabled={isSubmitting} className="w-full">
        {submitLabel}
      </Button>
    </div>
  )
}
