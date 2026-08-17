/**
 * API Codes d'Activation - e-OSCS
 * 
 * Gestion des codes d'activation avec stockage en mémoire (fallback Vercel)
 * Utilise un stockage global partagé entre toutes les routes
 */

import { NextRequest, NextResponse } from 'next/server'
import { inMemoryStore } from '@/lib/in-memory-store'

// ============================================
// TYPES
// ============================================

interface ActivationCode {
  id: string
  code: string
  email_proprietaire: string
  plan_id?: string
  duree_mois: number
  expire_le: string
  utilise: boolean
  utilise_le?: string
  cree_par: string
  created_at: string
}

// ============================================
// STOCKAGE GLOBAL PARTAGÉ
// ============================================

declare global {
  var __codesStore__: Map<string, ActivationCode> | undefined
  var __codesCounter__: number | undefined
}

function getCodesStore(): Map<string, ActivationCode> {
  if (!global.__codesStore__) {
    global.__codesStore__ = new Map()
    // Initialiser avec quelques codes de démo si vide
    if (global.__codesStore__.size === 0) {
      seedDemoCodes()
    }
  }
  return global.__codesStore__
}

function getNextCodeId(): string {
  if (!global.__codesCounter__) {
    global.__codesCounter__ = 1
    // Compter les codes existants pour éviter les doublons
    const store = getCodesStore()
    global.__codesCounter__ = store.size + 1
  }
  return `code-${global.__codesCounter__++}`
}

// ============================================
// GÉNÉRATEUR DE CODES
// ============================================

function generateActivationCode(): string {
  const prefix = 'EOSC'
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let result = prefix + '-'
  
  // Format: EOSC-XXXX-XXXX-XXXX (4 groupes de 4)
  for (let i = 0; i < 4; i++) {
    if (i > 0) result += '-'
    for (let j = 0; j < 4; j++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length))
    }
  }
  
  return result
}

// ============================================
// DONNÉES DE DÉMO
// ============================================

function seedDemoCodes() {
  const store = getCodesStore()
  
  // Code démo 1 - Disponible
  const now = new Date()
  store.set('code-demo-1', {
    id: 'code-demo-1',
    code: 'EOSC-ABCD-1234-EF56',
    email_proprietaire: 'demo@organisation.ci',
    plan_id: undefined,
    duree_mois: 12,
    expire_le: new Date(now.getTime() + 365 * 24 * 60 * 60 * 1000).toISOString(),
    utilise: false,
    cree_par: 'admin',
    created_at: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString()
  })
  
  // Code démo 2 - Utilisé
  store.set('code-demo-2', {
    id: 'code-demo-2',
    code: 'EOSC-GHIJ-7890-KLMN',
    email_proprietaire: 'client@dr-lagunes.ci',
    plan_id: 'plan-pro',
    duree_mois: 24,
    expire_le: new Date(now.getTime() + 730 * 24 * 60 * 60 * 1000).toISOString(),
    utilise: true,
    utilise_le: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    cree_par: 'admin',
    created_at: new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000).toISOString()
  })

  global.__codesCounter__ = 3
  
  console.log('✅ Codes de démonstration initialisés')
}

// ============================================
// FONCTIONS DU STORE
// ============================================

function createCode(data: {
  email_proprietaire: string
  plan_id?: string
  duree_mois: number
  expire_le?: string
  cree_par?: string
}): ActivationCode {
  const store = getCodesStore()
  const id = getNextCodeId()
  const code = generateActivationCode()
  
  // Calculer la date d'expiration si non fournie
  const expireDate = data.expire_le 
    ? new Date(data.expire_le)
    : new Date(Date.now() + data.duree_mois * 30 * 24 * 60 * 60 * 1000)
  
  const activationCode: ActivationCode = {
    id,
    code,
    email_proprietaire: data.email_proprietaire.toLowerCase().trim(),
    plan_id: data.plan_id,
    duree_mois: data.duree_mois,
    expire_le: expireDate.toISOString(),
    utilise: false,
    cree_par: data.cree_par || 'admin',
    created_at: new Date().toISOString()
  }
  
  store.set(id, activationCode)
  
  console.log(`✅ Code d'activation généré: ${code} pour ${data.email_proprietaire}`)
  
  return activationCode
}

function getCodes(): ActivationCode[] {
  const store = getCodesStore()
  return Array.from(store.values())
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
}

function getCodeStats(): { total: number; utilises: number; expires: number; disponibles: number } {
  const all = getCodes()
  const now = new Date()
  
  let utilises = 0
  let expires = 0
  let disponibles = 0
  
  for (const code of all) {
    if (code.utilise) {
      utilises++
    } else if (new Date(code.expire_le) < now) {
      expires++
    } else {
      disponibles++
    }
  }
  
  return {
    total: all.length,
    utilises,
    expires,
    disponibles
  }
}

// ============================================
// HANDLERS API
// ============================================

// GET - Récupérer les codes et/ou les stats
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const statsOnly = searchParams.get('stats') === 'true'
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const search = searchParams.get('search')
    const statut = searchParams.get('statut')

    // Si seulement les stats
    if (statsOnly) {
      return NextResponse.json(getCodeStats())
    }

    // Récupérer tous les codes
    let codes = getCodes()

    // Appliquer les filtres
    if (search) {
      const searchLower = search.toLowerCase()
      codes = codes.filter(c => 
        c.code.toLowerCase().includes(searchLower) ||
        c.email_proprietaire.toLowerCase().includes(searchLower)
      )
    }

    if (statut && statut !== 'all') {
      const now = new Date()
      codes = codes.filter(c => {
        switch (statut) {
          case 'DISPONIBLE': return !c.utilise && new Date(c.expire_le) >= now
          case 'UTILISE': return c.utilise
          case 'EXPIRE': return !c.utilise && new Date(c.expire_le) < now
          default: return true
        }
      })
    }

    // Pagination
    const total = codes.length
    const totalPages = Math.ceil(total / limit)
    const start = (page - 1) * limit
    const paginatedCodes = codes.slice(start, start + limit)

    return NextResponse.json({
      data: paginatedCodes,
      total,
      page,
      limit,
      totalPages,
      ...getCodeStats()
    })

  } catch (error) {
    console.error('Erreur récupération codes:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des codes' },
      { status: 500 }
    )
  }
}

// POST - Générer un nouveau code
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const { 
      email_proprietaire, 
      plan_id, 
      duree_mois = 12, 
      expire_le,
      cree_par = 'admin'
    } = body

    // Validation
    if (!email_proprietaire?.trim()) {
      return NextResponse.json(
        { error: "L'email du propriétaire est requis" },
        { status: 400 }
      )
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email_proprietaire)) {
      return NextResponse.json(
        { error: "L'email est invalide" },
        { status: 400 }
      )
    }

    if (!duree_mois || duree_mois < 1) {
      return NextResponse.json(
        { error: "La durée doit être d'au moins 1 mois" },
        { status: 400 }
      )
    }

    // Créer le code
    const code = createCode({
      email_proprietaire,
      plan_id,
      duree_mois: parseInt(duree_mois),
      expire_le,
      cree_par
    })

    // Créer une notification pour le super admin
    try {
      inMemoryStore.createNotification({
        type: 'systeme',
        titre: 'Code d\'activation généré',
        description: `Nouveau code ${code.code} généré pour ${email_proprietaire}`,
        lue: false,
        lien: '/admin/codes-activation'
      })
    } catch (notifError) {
      console.log('⚠️ Impossible de créer la notification:', notifError)
    }

    return NextResponse.json(code, { status: 201 })

  } catch (error) {
    console.error('Erreur création code:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la génération du code' },
      { status: 500 }
    )
  }
}
