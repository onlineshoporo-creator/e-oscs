import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

/**
 * GET /api/app/dashboard/stats
 * Récupère les statistiques pour le dashboard
 * 
 * Retourne:
 * - totalActivites: Nombre total d'activités
 * - activitesEnCours: Activités en cours (EN_VERIFICATION, CONSOLIDE)
 * - activitesEnAttente: Activités en attente de validation (SOUMIS)
 * - activitesValidees: Activités validées
 * - tauxExecutionGlobal: Taux d'exécution global (%)
 * - budgetTotal: Budget total alloué
 * - budgetDepense: Budget dépensé
 * - beneficiairesTotal: Total des bénéficiaires
 * - repartitionStatut: Répartition par statut
 * - activitesRecentes: 5 dernières activités
 */
export async function GET() {
  try {
    const supabase = await createClient()
    
    // Vérifier l'authentification
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    }

    // Récupérer l'organisation de l'utilisateur
    const { data: profile } = await supabase
      .from('profiles')
      .select('organization_id, role')
      .eq('id', user.id)
      .single()

    const organizationId = profile?.organization_id

    // Construire la requête de base
    let activitiesQuery = supabase.from('activites').select('*')
    
    if (organizationId) {
      activitiesQuery = activitiesQuery.eq('organization_id', organizationId)
    }

    const { data: activites, error: activitiesError } = await activitiesQuery

    if (activitiesError) {
      console.error('Error fetching activities for stats:', activitiesError)
      return NextResponse.json({ error: activitiesError.message }, { status: 500 })
    }

    const activities = activites || []

    // Calculer les statistiques
    const totalActivites = activities.length
    const activitesEnCours = activities.filter(a => 
      ['EN_VERIFICATION', 'CONSOLIDE'].includes(a.statut)
    ).length
    const activitesEnAttente = activities.filter(a => a.statut === 'SOUMIS').length
    const activitesValidees = activities.filter(a => a.statut === 'VALIDE').length
    const tauxExecutionGlobal = totalActivites > 0 ? Math.round((activitesValidees / totalActivites) * 100) : 0
    
    const budgetTotal = activities.reduce((sum, a) => sum + (a.budget_alloue || 0), 0)
    const budgetDepense = activities.reduce((sum, a) => sum + (a.budget_depense || 0), 0)
    const beneficiairesTotal = activities.reduce((sum, a) => sum + (a.beneficiaires_count || 0), 0)

    // Répartition par statut
    const repartitionStatut: Record<string, number> = {}
    activities.forEach(a => {
      repartitionStatut[a.statut] = (repartitionStatut[a.statut] || 0) + 1
    })

    // Activités récentes (5 dernières)
    const activitesRecentes = activities
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, 5)
      .map(a => ({
        id: a.id,
        titre: a.titre,
        statut: a.statut,
        date_debut: a.date_debut,
        budget_alloue: a.budget_alloue,
        beneficiaires_count: a.beneficiaires_count,
      }))

    // Statistiques mensuelles simplifiées (derniers 6 mois)
    const sixMoisAgo = new Date()
    sixMoisAgo.setMonth(sixMoisAgo.getMonth() - 6)

    const { data: statsMensuelles } = await supabase
      .from('activites')
      .select('created_at, statut, budget_alloue, budget_depense, beneficiaires_count')
      .gte('created_at', sixMoisAgo.toISOString())
      .order('created_at', { ascending: true })

    // Calculer les tendances mensuelles
    const monthlyStats = []
    if (statsMensuelles) {
      const monthsMap: Record<string, any> = {}
      
      statsMensuelles.forEach(act => {
        const monthKey = new Date(act.created_at).toISOString().slice(0, 7) // YYYY-MM
        
        if (!monthsMap[monthKey]) {
          monthsMap[monthKey] = {
            mois: monthKey,
            planifiees: 0,
            realisees: 0,
            budgetAlloue: 0,
            budgetDepense: 0,
            beneficiaires: 0,
          }
        }
        
        monthsMap[monthKey].planifiees++
        monthsMap[monthKey].budgetAlloue += act.budget_alloue || 0
        monthsMap[monthKey].budgetDepense += act.budget_depense || 0
        monthsMap[monthKey].beneficiaires += act.beneficiaires_count || 0
        
        if (['VALIDE', 'CONSOLIDE'].includes(act.statut)) {
          monthsMap[monthKey].realisees++
        }
      })

      // Convertir en tableau et calculer les taux
      Object.entries(monthsMap).forEach(([key, value]) => {
        monthlyStats.push({
          ...value,
          tauxExecution: value.planifiees > 0 ? Math.round((value.realisees / value.planifiees) * 100) : 0,
        })
      })
    }

    return NextResponse.json({
      success: true,
      stats: {
        totalActivites,
        activitesEnCours,
        activitesEnAttente,
        activitesValidees,
        tauxExecutionGlobal,
        budgetTotal,
        budgetDepense,
        beneficiairesTotal,
        repartitionStatut,
        activitesRecentes,
        tendancesMensuelles: monthlyStats.slice(-6), // Derniers 6 mois
      },
    })
  } catch (error) {
    console.error('Unexpected error in dashboard stats:', error)
    return NextResponse.json({ error: 'Erreur interne' }, { status: 500 })
  }
}
