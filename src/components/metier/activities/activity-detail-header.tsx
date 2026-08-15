'use client'

import React from 'react'
import Link from 'next/link'
import { 
  ArrowLeft, 
  Edit, 
  Send, 
  Printer, 
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Loader2
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { useToast } from '@/hooks/use-toast'

// Types
interface ActivityDetailHeaderProps {
  activity: {
    id: string
    reference: string
    intitule: string
    statut: string
    date_activite: string
    created_at: string
    soumis_le?: string
    valide_le?: string
    categories?: { nom: string }
    types_activite?: { nom: string }
    region: string
    departement?: string
    structure_responsable?: string
    budget_alloue?: number
  }
  onEdit?: () => void
  onSubmit?: () => void
  isSubmitting?: boolean
}

// Configuration des statuts
const STATUT_CONFIG: Record<string, { label: string; color: string; bgColor: string; icon: React.ReactNode }> = {
  BROUILLON: {
    label: 'Brouillon',
    color: 'text-slate-700',
    bgColor: 'bg-slate-100',
    icon: <Clock className="w-3.5 h-3.5" />
  },
  SOUMIS: {
    label: 'Soumis',
    color: 'text-blue-700',
    bgColor: 'bg-blue-100',
    icon: <Send className="w-3.5 h-3.5" />
  },
  EN_VERIFICATION: {
    label: 'En vérification',
    color: 'text-amber-700',
    bgColor: 'bg-amber-100',
    icon: <Loader2 className="w-3.5 h-3.5 animate-spin" />
  },
  VALIDE: {
    label: 'Validé',
    color: 'text-green-700',
    bgColor: 'bg-green-100',
    icon: <CheckCircle2 className="w-3.5 h-3.5" />
  },
  REJETE: {
    label: 'Rejeté',
    color: 'text-red-700',
    bgColor: 'bg-red-100',
    icon: <XCircle className="w-3.5 h-3.5" />
  },
  CORRECTION: {
    label: 'Correction requise',
    color: 'text-orange-700',
    bgColor: 'bg-orange-100',
    icon: <AlertCircle className="w-3.5 h-3.5" />
  },
  CONSOLIDE: {
    label: 'Consolidé',
    color: 'text-emerald-700',
    bgColor: 'bg-emerald-100',
    icon: <CheckCircle2 className="w-3.5 h-3.5" />
  }
}

// Formater une date en français
function formatDateFR(dateStr: string): string {
  if (!dateStr) return '-'
  const date = new Date(dateStr)
  return date.toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })
}

// Formater le budget en FCFA
function formatBudget(amount?: number): string {
  if (!amount) return '-'
  return new Intl.NumberFormat('fr-FR').format(amount) + ' FCFA'
}

export function ActivityDetailHeader({ 
  activity, 
  onEdit, 
  onSubmit,
  isSubmitting = false 
}: ActivityDetailHeaderProps) {
  const { toast } = useToast()
  
  const statutConfig = STATUT_CONFIG[activity.statut] || STATUT_CONFIG.BROUILLON
  const canEdit = ['BROUILLON', 'CORRECTION'].includes(activity.statut)
  const canSubmit = activity.statut === 'BROUILLON'

  const handlePrint = () => {
    window.print()
    toast({
      title: 'Impression',
      description: 'Préparation de l\'impression en cours...',
    })
  }

  return (
    <>
      {/* Header principal */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
        <div className="flex items-start gap-4">
          <Link href="/app/activites">
            <Button variant="ghost" size="icon" className="mt-1">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          
          <div>
            <div className="flex items-center gap-3 mb-2 flex-wrap">
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
                {activity.intitule}
              </h1>
              <Badge 
                variant="secondary" 
                className={`${statutConfig.bgColor} ${statutColor} font-medium gap-1.5`}
              >
                {statutConfig.icon}
                {statutConfig.label}
              </Badge>
            </div>
            
            <p className="text-sm text-slate-500 font-mono">
              Référence : {activity.reference}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 print:hidden">
          {canEdit && onEdit && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onEdit}
              className="gap-2"
            >
              <Edit className="w-4 h-4" />
              Modifier
            </Button>
          )}
          
          {canSubmit && onSubmit && (
            <Button 
              size="sm" 
              onClick={onSubmit}
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
                  Soumettre
                </>
              )}
            </Button>
          )}

          <Button 
            variant="outline" 
            size="sm" 
            onClick={handlePrint}
            className="gap-2"
          >
            <Printer className="w-4 h-4" />
            Imprimer
          </Button>
        </div>
      </div>

      {/* Cartes d'information */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card className="border-slate-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-50 rounded-lg">
                <Calendar className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <p className="text-xs text-slate-500">Date d'activité</p>
                <p className="font-medium text-slate-900 text-sm">
                  {formatDateFR(activity.date_activite)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-50 rounded-lg">
                <Calendar className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-xs text-slate-500">Créée le</p>
                <p className="font-medium text-slate-900 text-sm">
                  {formatDateFR(activity.created_at)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-50 rounded-lg">
                <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div>
                <p className="text-xs text-slate-500">Localisation</p>
                <p className="font-medium text-slate-900 text-sm">
                  {activity.region}{activity.departement ? ` - ${activity.departement}` : ''}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-50 rounded-lg">
                <svg className="w-5 h-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-xs text-slate-500">Budget</p>
                <p className="font-medium text-slate-900 text-sm">
                  {formatBudget(activity.budget_alloue)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Informations supplémentaires */}
      {(activity.categories || activity.types_activite || activity.structure_responsable) && (
        <Card className="border-slate-200 mb-6">
          <CardContent className="p-4">
            <div className="flex flex-wrap gap-x-6 gap-y-3 text-sm">
              {activity.categories && (
                <div>
                  <span className="text-slate-500">Catégorie :</span>{' '}
                  <span className="font-medium text-slate-900">{activity.categories.nom}</span>
                </div>
              )}
              {activity.types_activite && (
                <div>
                  <span className="text-slate-500">Type :</span>{' '}
                  <span className="font-medium text-slate-900">{activity.types_activite.nom}</span>
                </div>
              )}
              {activity.structure_responsable && (
                <div>
                  <span className="text-slate-500">Structure responsable :</span>{' '}
                  <span className="font-medium text-slate-900">{activity.structure_responsable}</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </>
  )
}

// Helper pour la couleur du badge statut (défini ici car utilisé dans le composant)
const statutColor = ''
