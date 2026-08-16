/**
 * In-Memory Store pour e-OSCS
 * 
 * Solution temporaire pour Vercel (serverless) en attendant Supabase
 * Stocke: demandes d'abonnement, organisations, notifications
 */

// ============================================
// TYPES
// ============================================

export interface SubscriptionRequest {
  id: string
  created_at: string
  nom_complet: string
  email: string
  telephone: string
  whatsapp?: string
  fonction?: string
  nom_organisation: string
  type_org: 'DR' | 'DD'
  region: string
  departement?: string
  nb_collaborateurs?: string
  message?: string
  statut: 'NOUVELLE' | 'EN_CONTACT' | 'APPROUVEE' | 'REJETEE' | 'CONVERTIE'
  notes_admin?: string
  admin_updated_at?: string
}

export interface Organization {
  id: string
  created_at: string
  nom: string
  type_org: 'DR' | 'DD'
  region: string
  departement?: string
  telephone?: string
  email?: string
  logo_url?: string
  actif: boolean
  members_count?: number
  subscription?: {
    statut: string
    plan_nom: string
    date_fin: string
  }
}

export interface Notification {
  id: string
  type: 'demande_abonnement' | 'organisation_activee' | 'paiement_recu' | 'systeme'
  titre: string
  description: string
  lue: boolean
  created_at: string
  lien?: string
  donnees?: Record<string, unknown>
}

// ============================================
// STORE EN MÉMOIRE
// ============================================

class InMemoryStore {
  private demandes: Map<string, SubscriptionRequest> = new Map()
  private organisations: Map<string, Organization> = new Map()
  private notifications: Map<string, Notification> = new Map()
  
  // Compteurs pour générer des IDs uniques
  private demandeCounter = 1
  private orgCounter = 1
  private notifCounter = 1

  constructor() {
    // Initialiser avec quelques données de démonstration
    this.seedDemoData()
  }

  private seedDemoData() {
    const now = new Date().toISOString()
    
    // Demande démo 1 - NOUVELLE
    this.createDemande({
      nom_complet: 'Dr Lagune',
      email: 'dr.lagune@example.com',
      telephone: '+225 07 12 34 56 78',
      whatsapp: '+225 07 12 34 56 78',
      fonction: 'Directeur Régional',
      nom_organisation: 'DR des Lagunes',
      type_org: 'DR',
      region: 'Lagunes',
      nb_collaborateurs: '11-20',
      message: 'Souhaite rejoindre la plateforme e-OSCS pour gérer nos activités.',
      statut: 'NOUVELLE'
    })

    // Demande démo 2 - EN_CONTACT
    this.createDemande({
      nom_complet: 'Mme Kouassi Adjo',
      email: 'kouassi.adjo@example.com',
      telephone: '+225 05 67 89 01 23',
      nom_organisation: 'DD d\'Abidjan',
      type_org: 'DD',
      region: 'District d\'Abidjan',
      departement: 'Abidjan',
      nb_collaborateurs: '6-10',
      message: 'Nous sommes intéressés par le plan Pro.',
      statut: 'EN_CONTACT',
      notes_admin: 'Appel téléphonique effectué le 15/01 - très intéressé'
    })

    // Demande démo 3 - APPROUVEE
    this.createDemande({
      nom_complet: 'Mr Yao Konan',
      email: 'yao.konan@example.com',
      telephone: '+225 01 23 45 67 89',
      nom_organisation: 'DR Comoé',
      type_org: 'DR',
      region: 'Comoé',
      nb_collaborateurs: '21-50',
      message: '',
      statut: 'APPROUVEE',
      notes_admin: 'Contrat envoyé - en attente de signature'
    })

    // Organisation démo 1
    const org1Id = `org-${this.orgCounter++}`
    this.organisations.set(org1Id, {
      id: org1Id,
      created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      nom: 'DR DÉMO Abidjan',
      type_org: 'DR',
      region: 'District d\'Abidjan',
      telephone: '+225 07 00 00 00 00',
      email: 'demo-abidjan@eoscs.ci',
      actif: true,
      members_count: 5,
      subscription: {
        statut: 'ACTIF',
        plan_nom: 'Plan Pro',
        date_fin: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString()
      }
    })

    // Organisation démo 2
    const org2Id = `org-${this.orgCounter++}`
    this.organisations.set(org2Id, {
      id: org2Id,
      created_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
      nom: 'DD San-Pédro',
      type_org: 'DD',
      region: 'San-Pédro',
      departement: 'San-Pédro',
      telephone: '+225 07 99 88 77 66',
      email: 'dd-sanpedro@eoscs.ci',
      actif: true,
      members_count: 3,
      subscription: {
        statut: 'ACTIF',
        plan_nom: 'Plan Starter',
        date_fin: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
      }
    })

    // Notifications démo
    this.createNotification({
      type: 'demande_abonnement',
      titre: 'Nouvelle demande d\'abonnement',
      description: 'DR Lagune - Abidjan souhaite rejoindre la plateforme',
      lue: false,
      lien: '/admin/demandes'
    })
    
    this.createNotification({
      type: 'organisation_activee',
      titre: 'Organisation activée',
      description: 'DR DÉMO Abidjan est maintenant active',
      lue: false,
      lien: '/admin/organisations'
    })
    
    this.createNotification({
      type: 'paiement_recu',
      titre: 'Paiement reçu',
      description: 'Plan Pro - DR Bas-Sassandra (25 000 FCFA)',
      lue: true,
      lien: '/admin/plans'
    })
    
    this.createNotification({
      type: 'systeme',
      titre: 'Système mis à jour',
      description: 'Migration de base de données terminée avec succès',
      lue: true
    })
  }

  // ============================================
  // DEMANDES D'ABONNEMENT
  // ============================================

  createDemande(data: Omit<SubscriptionRequest, 'id' | 'created_at'>): SubscriptionRequest {
    const id = `demande-${this.demandeCounter++}`
    const demande: SubscriptionRequest = {
      ...data,
      id,
      created_at: new Date().toISOString()
    }
    this.demandes.set(id, demande)
    
    // Créer une notification automatiquement
    if (data.statut === 'NOUVELLE') {
      this.createNotification({
        type: 'demande_abonnement',
        titre: 'Nouvelle demande d\'abonnement',
        description: `${data.nom_complet} - ${data.nom_organisation}`,
        lue: false,
        lien: '/admin/demandes',
        donnees: { demandeId: id }
      })
    }
    
    return demande
  }

  getDemandes(): SubscriptionRequest[] {
    return Array.from(this.demandes.values())
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
  }

  getDemande(id: string): SubscriptionRequest | undefined {
    return this.demandes.get(id)
  }

  updateDemande(id: string, data: Partial<SubscriptionRequest>): SubscriptionRequest | null {
    const existing = this.demandes.get(id)
    if (!existing) return null
    
    const updated = {
      ...existing,
      ...data,
      admin_updated_at: new Date().toISOString()
    }
    this.demandes.set(id, updated)
    
    // Notification si changement de statut important
    if (data.statut && data.statut !== existing.statut) {
      let titre = ''
      let desc = ''
      
      switch (data.statut) {
        case 'APPROUVEE':
          titre = 'Demande approuvée'
          desc = `${existing.nom_complet} a été approuvé`
          break
        case 'REJETEE':
          titre = 'Demande rejetée'
          desc = `${existing.nom_complet} a été rejetée`
          break
        case 'CONVERTIE':
          titre = 'Demande convertie'
          desc = `${existing.nom_complet} est devenu client`
          break
      }
      
      if (titre) {
        this.createNotification({
          type: data.statut === 'CONVERTIE' ? 'paiement_recu' : 'demande_abonnement',
          titre,
          description: desc,
          lue: false,
          lien: '/admin/demandes'
        })
      }
    }
    
    return updated
  }

  getDemandesStats() {
    const all = this.getDemandes()
    return {
      total: all.length,
      nouvelles: all.filter(d => d.statut === 'NOUVELLE').length,
      en_contact: all.filter(d => d.statut === 'EN_CONTACT').length,
      approuvees: all.filter(d => d.statut === 'APPROUVEE').length,
      rejetees: all.filter(d => d.statut === 'REJETEE').length,
      converties: all.filter(d => d.statut === 'CONVERTIE').length
    }
  }

  // ============================================
  // ORGANISATIONS
  // ============================================

  createOrganisation(data: Omit<Organization, 'id' | 'created_at'>): Organization {
    const id = `org-${this.orgCounter++}`
    const org: Organization = {
      ...data,
      id,
      created_at: new Date().toISOString()
    }
    this.organisations.set(id, org)
    
    // Notification
    this.createNotification({
      type: 'organisation_activee',
      titre: 'Nouvelle organisation créée',
      description: `${data.nom} a été ajoutée`,
      lue: false,
      lien: '/admin/organisations',
      donnees: { orgId: id }
    })
    
    return org
  }

  getOrganisations(): Organization[] {
    return Array.from(this.organisations.values())
      .sort((a, b) => a.nom.localeCompare(b.nom))
  }

  getOrganisation(id: string): Organization | undefined {
    return this.organisations.get(id)
  }

  updateOrganisation(id: string, data: Partial<Organization>): Organization | null {
    const existing = this.organisations.get(id)
    if (!existing) return null
    
    const updated = { ...existing, ...data }
    this.organisations.set(id, updated)
    return updated
  }

  deleteOrganisation(id: string): boolean {
    return this.organisations.delete(id)
  }

  getOrganisationsStats() {
    const all = this.getOrganisations()
    return {
      total: all.length,
      actives: all.filter(o => o.actif).length,
      inactives: all.filter(o => !o.actif).length,
      dr: all.filter(o => o.type_org === 'DR').length,
      dd: all.filter(o => o.type_org === 'DD').length
    }
  }

  // ============================================
  // NOTIFICATIONS
  // ============================================

  createNotification(data: Omit<Notification, 'id' | 'created_at'>): Notification {
    const id = `notif-${this.notifCounter++}`
    const notification: Notification = {
      ...data,
      id,
      created_at: new Date().toISOString()
    }
    this.notifications.set(id, notification)
    return notification
  }

  getNotifications(): Notification[] {
    return Array.from(this.notifications.values())
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
  }

  getUnreadCount(): number {
    return Array.from(this.notifications.values()).filter(n => !n.lue).length
  }

  markAsRead(id: string): boolean {
    const notif = this.notifications.get(id)
    if (!notif) return false
    notif.lue = true
    this.notifications.set(id, notif)
    return true
  }

  markAllAsRead(): void {
    for (const [id, notif] of this.notifications.entries()) {
      notif.lue = true
      this.notifications.set(id, notif)
    }
  }

  deleteNotification(id: string): boolean {
    return this.notifications.delete(id)
  }

  clearAllNotifications(): void {
    this.notifications.clear()
  }
}

// Singleton du store
export const inMemoryStore = new InMemoryStore()

// Export pour utilisation dans les API routes
export default inMemoryStore
