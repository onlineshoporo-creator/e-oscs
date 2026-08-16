/**
 * API Demandes d'Abonnement - e-OSCS
 * 
 * Gestion des demandes d'abonnement avec stockage en mémoire (fallback Vercel)
 */

import { NextRequest, NextResponse } from 'next/server'
import { inMemoryStore } from '@/lib/in-memory-store'

// GET - Récupérer toutes les demandes
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const statut = searchParams.get('statut')
    const region = searchParams.get('region')
    const search = searchParams.get('search')

    // Récupérer toutes les demandes
    let demandes = inMemoryStore.getDemandes()

    // Appliquer les filtres
    if (statut) {
      demandes = demandes.filter(d => d.statut === statut)
    }
    if (region) {
      demandes = demandes.filter(d => 
        d.region.toLowerCase().includes(region.toLowerCase())
      )
    }
    if (search) {
      const searchLower = search.toLowerCase()
      demandes = demandes.filter(d => 
        d.nom_complet.toLowerCase().includes(searchLower) ||
        d.email.toLowerCase().includes(searchLower) ||
        d.nom_organisation.toLowerCase().includes(searchLower)
      )
    }

    // Pagination
    const total = demandes.length
    const totalPages = Math.ceil(total / limit)
    const start = (page - 1) * limit
    const paginatedDemandes = demandes.slice(start, start + limit)

    return NextResponse.json({
      data: paginatedDemandes,
      total,
      page,
      limit,
      totalPages
    })

  } catch (error) {
    console.error('Erreur récupération demandes:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des demandes' },
      { status: 500 }
    )
  }
}

// POST - Créer une nouvelle demande
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const { 
      nom_complet, 
      email, 
      telephone, 
      whatsapp,
      fonction,
      nom_organisation, 
      type_org, 
      region, 
      departement,
      nb_collaborateurs,
      message 
    } = body

    // Validation
    if (!nom_complet?.trim()) {
      return NextResponse.json(
        { error: 'Le nom complet est requis' },
        { status: 400 }
      )
    }
    if (!email?.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: 'L\'email est invalide' },
        { status: 400 }
      )
    }
    if (!telephone?.trim()) {
      return NextResponse.json(
        { error: 'Le téléphone est requis' },
        { status: 400 }
      )
    }
    if (!nom_organisation?.trim()) {
      return NextResponse.json(
        { error: 'Le nom de l\'organisation est requis' },
        { status: 400 }
      )
    }
    if (!type_org || !['DR', 'DD'].includes(type_org)) {
      return NextResponse.json(
        { error: 'Le type d\'organisation doit être DR ou DD' },
        { status: 400 }
      )
    }
    if (!region?.trim()) {
      return NextResponse.json(
        { error: 'La région est requise' },
        { status: 400 }
      )
    }

    // Créer la demande
    const demande = inMemoryStore.createDemande({
      nom_complet: nom_complet.trim(),
      email: email.trim(),
      telephone: telephone.trim(),
      whatsapp: whatsapp?.trim(),
      fonction: fonction?.trim(),
      nom_organisation: nom_organisation.trim(),
      type_org,
      region: region.trim(),
      departement: departement?.trim(),
      nb_collaborateurs: nb_collaborateurs,
      message: message?.trim(),
      statut: 'NOUVELLE'
    })

    console.log(`✅ Nouvelle demande d'abonnement: ${email} (${nom_organisation})`)

    return NextResponse.json(demande, { status: 201 })

  } catch (error) {
    console.error('Erreur création demande:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la création de la demande' },
      { status: 500 }
    )
  }
}
