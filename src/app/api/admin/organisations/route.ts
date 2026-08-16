/**
 * API Organisations - e-OSCS
 * 
 * Gestion des organisations avec stockage en mémoire (fallback Vercel)
 */

import { NextRequest, NextResponse } from 'next/server'
import { inMemoryStore } from '@/lib/in-memory-store'

// GET - Récupérer toutes les organisations
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '12')
    const search = searchParams.get('search')
    const type_org = searchParams.get('type_org')
    const region = searchParams.get('region')
    const actif = searchParams.get('actif')

    // Récupérer toutes les organisations
    let orgs = inMemoryStore.getOrganisations()

    // Appliquer les filtres
    if (search) {
      const searchLower = search.toLowerCase()
      orgs = orgs.filter(o => 
        o.nom.toLowerCase().includes(searchLower) ||
        (o.email && o.email.toLowerCase().includes(searchLower))
      )
    }
    if (type_org) {
      orgs = orgs.filter(o => o.type_org === type_org)
    }
    if (region) {
      orgs = orgs.filter(o => 
        o.region.toLowerCase().includes(region.toLowerCase())
      )
    }
    if (actif !== null && actif !== undefined && actif !== '') {
      orgs = orgs.filter(o => o.actif === (actif === 'true'))
    }

    // Pagination
    const total = orgs.length
    const totalPages = Math.ceil(total / limit)
    const start = (page - 1) * limit
    const paginatedOrgs = orgs.slice(start, start + limit)

    return NextResponse.json({
      data: paginatedOrgs,
      total,
      page,
      limit,
      totalPages
    })

  } catch (error) {
    console.error('Erreur récupération organisations:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des organisations' },
      { status: 500 }
    )
  }
}

// POST - Créer une nouvelle organisation
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const { nom, type_org, region, departement, telephone, email } = body

    // Validation
    if (!nom?.trim()) {
      return NextResponse.json(
        { error: 'Le nom est requis' },
        { status: 400 }
      )
    }
    if (!type_org || !['DR', 'DD'].includes(type_org)) {
      return NextResponse.json(
        { error: "Le type d'organisation doit être DR ou DD" },
        { status: 400 }
      )
    }
    if (!region?.trim()) {
      return NextResponse.json(
        { error: 'La région est requise' },
        { status: 400 }
      )
    }

    // Créer l'organisation
    const org = inMemoryStore.createOrganisation({
      nom: nom.trim(),
      type_org,
      region: region.trim(),
      departement: departement?.trim(),
      telephone: telephone?.trim(),
      email: email?.trim(),
      actif: true
    })

    console.log(`✅ Nouvelle organisation créée: ${nom} (${type_org})`)

    return NextResponse.json(org, { status: 201 })

  } catch (error) {
    console.error('Erreur création organisation:', error)
    return NextResponse.json(
      { error: "Erreur lors de la création de l'organisation" },
      { status: 500 }
    )
  }
}
