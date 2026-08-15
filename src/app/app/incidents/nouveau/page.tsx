'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { IncidentForm } from '@/components/metier/incidents/incident-form'
import { createIncident, getIncidentTypes } from '@/lib/actions/incidents'
import type { IncidentFormData, IncidentType } from '@/types'

export default function NouvelIncidentPage() {
  const router = useRouter()
  const [incidentTypes, setIncidentTypes] = useState<IncidentType[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      const types = await getIncidentTypes()
      setIncidentTypes(types)
      setLoading(false)
    }
    fetchData()
  }, [])

  const handleSubmit = async (data: IncidentFormData) => {
    // Récupérer l'organisation
    const { getCurrentUserWithOrg } = await import('@/lib/actions/app')
    const userWithOrg = await getCurrentUserWithOrg()
    
    if (!userWithOrg?.profile?.organization_id) {
      return { success: false, error: 'Organisation non trouvée' }
    }

    return await createIncident(
      userWithOrg.profile.organization_id,
      data,
      userWithOrg.id
    )
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/app/incidents">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold">Déclarer un incident</h1>
          <p className="text-muted-foreground">Remplissez le formulaire pour signaler un sinistre</p>
        </div>
      </div>

      {/* Formulaire */}
      {loading ? (
        <div className="space-y-6 animate-pulse">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-48 bg-slate-100 rounded-lg" />
          ))}
        </div>
      ) : (
        <IncidentForm
          incidentTypes={incidentTypes}
          onSubmit={handleSubmit}
          submitLabel="Déclarer l'incident"
          draftLabel="Sauvegarder brouillon"
        />
      )}
    </div>
  )
}
