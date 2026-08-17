/**
 * API Codes d'Activation [code] - e-OSCS
 * 
 * Gestion individuelle des codes d'activation
 * Utilise le stockage global partagé avec /api/admin/codes/route.ts
 */

import { NextRequest, NextResponse } from 'next/server'

// ============================================
// TYPES (copiés pour éviter imports circulaires)
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
// STOCKAGE GLOBAL PARTAGÉ (même instance que route.ts)
// ============================================

declare global {
  var __codesStore__: Map<string, ActivationCode> | undefined
}

function getCodesStore(): Map<string, ActivationCode> {
  if (!global.__codesStore__) {
    global.__codesStore__ = new Map()
  }
  return global.__codesStore__
}

// ============================================
// HANDLERS
// ============================================

// GET /api/admin/codes/[code] - Récupérer un code spécifique
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  try {
    const { code } = await params
    const store = getCodesStore()
    
    // Chercher par ID ou par code
    let foundCode = store.get(code)
    
    if (!foundCode) {
      for (const c of store.values()) {
        if (c.code === code) {
          foundCode = c
          break
        }
      }
    }

    if (!foundCode) {
      return NextResponse.json(
        { error: 'Code non trouvé' },
        { status: 404 }
      )
    }

    return NextResponse.json(foundCode)

  } catch (error) {
    console.error('Erreur récupération code:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération du code' },
      { status: 500 }
    )
  }
}

// PATCH /api/admin/codes/[code] - Révoquer ou modifier un code
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  try {
    const { code } = await params
    const body = await request.json()
    const { action } = body

    const store = getCodesStore()
    
    // Chercher le code (par ID ou par valeur du code)
    let foundEntry: [string, ActivationCode] | null = null
    
    for (const [id, c] of store.entries()) {
      if (id === code || c.code === code) {
        foundEntry = [id, c]
        break
      }
    }

    if (!foundEntry) {
      return NextResponse.json(
        { error: 'Code non trouvé' },
        { status: 404 }
      )
    }

    const [codeId, foundCode] = foundEntry

    switch (action) {
      case 'revoke':
        // Révoquer le code (marquer comme expiré)
        foundCode.expire_le = new Date(0).toISOString()
        store.set(codeId, foundCode)
        
        console.log(`🚫 Code révoqué: ${foundCode.code}`)
        
        return NextResponse.json({
          success: true,
          message: 'Code révoqué avec succès',
          code: foundCode
        })

      case 'mark-used':
        // Marquer comme utilisé
        if (foundCode.utilise) {
          return NextResponse.json(
            { error: 'Ce code est déjà utilisé' },
            { status: 400 }
          )
        }
        
        foundCode.utilise = true
        foundCode.utilise_le = new Date().toISOString()
        store.set(codeId, foundCode)
        
        console.log(`✅ Code utilisé: ${foundCode.code}`)
        
        return NextResponse.json({
          success: true,
          message: 'Code marqué comme utilisé',
          code: foundCode
        })

      default:
        return NextResponse.json(
          { error: `Action "${action}" non reconnue` },
          { status: 400 }
        )
    }

  } catch (error) {
    console.error('Erreur modification code:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la modification du code' },
      { status: 500 }
    )
  }
}

// POST /api/admin/codes/[code] - Actions supplémentaires (envoyer email, etc.)
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  try {
    const { code } = await params
    const body = await request.json()
    const { action } = body

    const store = getCodesStore()
    
    // Chercher le code
    let foundCode: ActivationCode | null = null
    
    for (const c of store.values()) {
      if (c.id === code || c.code === code) {
        foundCode = c
        break
      }
    }

    if (!foundCode) {
      return NextResponse.json(
        { error: 'Code non trouvé' },
        { status: 404 }
      )
    }

    switch (action) {
      case 'send-email':
        // Simuler l'envoi d'email (en production, intégrer avec un service email réel)
        console.log(`📧 Email envoyé pour le code ${foundCode.code} à ${foundCode.email_proprietaire}`)
        
        return NextResponse.json({
          success: true,
          message: `Email envoyé à ${foundCode.email_proprietaire}`,
          info: "En mode démo: l'email n'est pas réellement envoyé"
        })

      default:
        return NextResponse.json(
          { error: `Action "${action}" non reconnue` },
          { status: 400 }
        )
    }

  } catch (error) {
    console.error('Erreur action code:', error)
    return NextResponse.json(
      { error: 'Erreur lors de l\'action sur le code' },
      { status: 500 }
    )
  }
}

// DELETE /api/admin/codes/[code] - Supprimer un code
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  try {
    const { code } = await params
    const store = getCodesStore()
    
    // Chercher et supprimer
    let deleted = false
    let deletedCodeValue = ''
    
    for (const [id, c] of store.entries()) {
      if (id === code || c.code === code) {
        deletedCodeValue = c.code
        store.delete(id)
        deleted = true
        break
      }
    }

    if (!deleted) {
      return NextResponse.json(
        { error: 'Code non trouvé' },
        { status: 404 }
      )
    }

    console.log(`🗑️ Code supprimé: ${deletedCodeValue}`)

    return NextResponse.json({
      success: true,
      message: 'Code supprimé avec succès'
    })

  } catch (error) {
    console.error('Erreur suppression code:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la suppression du code' },
      { status: 500 }
    )
  }
}
