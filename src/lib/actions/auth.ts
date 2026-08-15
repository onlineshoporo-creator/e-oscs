/**
 * Server Actions d'Authentification e-OSCS
 * 
 * Ces actions sont exécutées côté serveur et utilisent le client Supabase
 * pour gérer l'authentification des utilisateurs.
 */

'use server'

import { createClient } from '@/lib/supabase/server'
import { supabaseAdmin } from '@/lib/supabase/admin'
import type { OrgType } from '@/types'

/**
 * Résultat d'une action d'authentification
 */
export interface AuthResult {
  success: boolean
  error?: string
  message?: string
  data?: Record<string, unknown>
}

/**
 * Connexion utilisateur avec email et mot de passe
 * @param email Email de l'utilisateur
 * @param password Mot de passe
 * @returns Résultat de la connexion
 */
export async function signInAction(email: string, password: string): Promise<AuthResult> {
  try {
    const supabase = await createClient()
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.toLowerCase().trim(),
      password,
    })

    if (error) {
      // Messages d'erreur personnalisés en français
      if (error.message.includes('Invalid login credentials')) {
        return { success: false, error: 'Email ou mot de passe incorrect.' }
      }
      if (error.message.includes('Email not confirmed')) {
        return { success: false, error: 'Veuillez confirmer votre email avant de vous connecter.' }
      }
      return { success: false, error: error.message }
    }

    return { 
      success: true, 
      message: 'Connexion réussie !',
      data: { user: data.user, session: data.session }
    }
  } catch (error) {
    console.error('Erreur signInAction:', error)
    return { success: false, error: 'Une erreur est survenue lors de la connexion.' }
  }
}

/**
 * Inscription nouvel utilisateur
 * @param email Email de l'utilisateur
 * @param password Mot de passe
 * @param metadata Métadonnées utilisateur (nom complet, etc.)
 * @returns Résultat de l'inscription
 */
export async function signUpAction(
  email: string, 
  password: string, 
  metadata?: Record<string, string>
): Promise<AuthResult> {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase.auth.signUp({
      email: email.toLowerCase().trim(),
      password,
      options: {
        data: metadata,
        emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL || ''}/connexion`,
      },
    })

    if (error) {
      // Messages d'erreur personnalisés
      if (error.message.includes('already registered')) {
        return { success: false, error: 'Cet email est déjà utilisé.' }
      }
      if (error.message.includes('password')) {
        return { success: false, error: 'Le mot de passe doit contenir au moins 6 caractères.' }
      }
      return { success: false, error: error.message }
    }

    // Si l'utilisateur existe déjà mais n'est pas confirmé
    if (data.user && !data.session) {
      return {
        success: true,
        message: 'Compte existant. Un email de confirmation a été envoyé.',
        data: { user: data.user, needsConfirmation: true }
      }
    }

    return {
      success: true,
      message: 'Compte créé avec succès ! Vérifiez votre email pour confirmer.',
      data: { user: data.user, session: data.session }
    }
  } catch (error) {
    console.error('Erreur signUpAction:', error)
    return { success: false, error: 'Une erreur est survenue lors de l\'inscription.' }
  }
}

/**
 * Déconnexion utilisateur
 * @returns Résultat de la déconnexion
 */
export async function signOutAction(): Promise<AuthResult> {
  try {
    const supabase = await createClient()
    
    const { error } = await supabase.auth.signOut()

    if (error) {
      return { success: false, error: error.message }
    }

    return { success: true, message: 'Déconnexion réussie.' }
  } catch (error) {
    console.error('Erreur signOutAction:', error)
    return { success: false, error: 'Une erreur est survenue lors de la déconnexion.' }
  }
}

/**
 * Demande d'accès / inscription organisation
 * Insère une demande dans la table subscription_requests
 */
export interface RequestAccessData {
  nom_complet: string
  email: string
  telephone: string
  nom_organisation: string
  type_org: OrgType
  region: string
  departement?: string
  message?: string
}

export async function requestAccessAction(data: RequestAccessData): Promise<AuthResult> {
  try {
    // Validation des champs requis
    if (!data.nom_complet?.trim()) {
      return { success: false, error: 'Le nom complet est requis.' }
    }
    if (!data.email?.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      return { success: false, error: 'L\'email est invalide.' }
    }
    if (!data.telephone?.trim()) {
      return { success: false, error: 'Le numéro de téléphone est requis.' }
    }
    if (!data.nom_organisation?.trim()) {
      return { success: false, error: 'Le nom de l\'organisation est requis.' }
    }
    if (!data.type_org || !['DR', 'DD'].includes(data.type_org)) {
      return { success: false, error: 'Le type d\'organisation doit être DR ou DD.' }
    }
    if (!data.region?.trim()) {
      return { success: false, error: 'La région est requise.' }
    }

    // Insertion via admin client (bypass RLS)
    const { error } = await supabaseAdmin
      .from('subscription_requests')
      .insert({
        nom_complet: data.nom_complet.trim(),
        email: data.email.toLowerCase().trim(),
        telephone: data.telephone.trim(),
        nom_organisation: data.nom_organisation.trim(),
        type_org: data.type_org,
        region: data.region.trim(),
        departement: data.departement?.trim() || null,
        message: data.message?.trim() || null,
        statut: 'NOUVELLE',
      })
      .select()
      .single()

    if (error) {
      console.error('Erreur insertion subscription_requests:', error)
      
      // Vérifier si c'est une contrainte unique (email déjà utilisé)
      if (error.code === '23505') {
        return { success: false, error: 'Vous avez déjà soumis une demande avec cet email.' }
      }
      return { success: false, error: 'Erreur lors de l\'enregistrement de la demande.' }
    }

    return {
      success: true,
      message: 'Votre demande a été enregistrée avec succès ! Nous vous contacterons sous 48h.'
    }
  } catch (error) {
    console.error('Erreur requestAccessAction:', error)
    return { success: false, error: 'Une erreur est survenue lors de la soumission.' }
  }
}

/**
 * Demande de réinitialisation du mot de passe
 * @param email Email de l'utilisateur
 * @returns Résultat de la demande
 */
export async function resetPasswordAction(email: string): Promise<AuthResult> {
  try {
    const supabase = await createClient()

    const { error } = await supabase.auth.resetPasswordForEmail(email.toLowerCase().trim(), {
      redirectTo: `${process.env.NEXT_PUBLIC_APP_URL || ''}/reset-password`,
    })

    if (error) {
      return { success: false, error: error.message }
    }

    return {
      success: true,
      message: 'Si cet email existe, un lien de réinitialisation a été envoyé.'
    }
  } catch (error) {
    console.error('Erreur resetPasswordAction:', error)
    return { success: false, error: 'Une erreur est survenue.' }
  }
}

/**
 * Mise à jour du mot de passe (après réinitialisation)
 * @param newPassword Nouveau mot de passe
 * @returns Résultat de la mise à jour
 */
export async function updatePasswordAction(newPassword: string): Promise<AuthResult> {
  try {
    const supabase = await createClient()

    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    })

    if (error) {
      if (error.message.includes('password')) {
        return { success: false, error: 'Le mot de passe doit contenir au moins 6 caractères.' }
      }
      return { success: false, error: error.message }
    }

    return {
      success: true,
      message: 'Mot de passe mis à jour avec succès !'
    }
  } catch (error) {
    console.error('Erreur updatePasswordAction:', error)
    return { success: false, error: 'Une erreur est survenue.' }
  }
}

/**
 * Récupération de la session utilisateur actuelle (côté serveur)
 * @returns L'utilisateur connecté ou null
 */
export async function getCurrentUserAction() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    return user
  } catch (error) {
    console.error('Erreur getCurrentUserAction:', error)
    return null
  }
}
