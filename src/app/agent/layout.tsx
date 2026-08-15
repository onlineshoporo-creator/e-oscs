import { AgentSidebar } from '@/components/agent/agent-sidebar'
import { AgentHeader } from '@/components/agent/agent-header'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

// Métadonnées pour l'espace agent
export const metadata = {
  title: 'Espace Agent — e-OSCS',
  description: 'Espace simplifié pour les agents de terrain. Saisissez vos activités facilement.',
}

interface UserData {
  id: string
  name: string
  email: string
  role: string
  avatar?: string
  organization?: string | null
  organizationId?: string | null
}

export default async function AgentLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  
  // Vérifier la session utilisateur
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    redirect('/connexion')
  }

  // Récupérer le profil utilisateur avec son organisation
  const { data: profile } = await supabase
    .from('profiles')
    .select(`
      *,
      organizations (*)
    `)
    .eq('id', user.id)
    .single()

  // Vérifier que l'utilisateur a le rôle AGENT ou supérieur
  const userRole = profile?.role
  if (!userRole || !['AGENT', 'PROPRIETAIRE', 'SUPER_ADMIN'].includes(userRole)) {
    redirect('/connexion')
  }

  // Construire l'objet utilisateur pour le header
  const userData: UserData = {
    id: user.id,
    name: profile?.full_name || user.user_metadata?.full_name || 'Utilisateur',
    email: user.email || '',
    role: getRoleLabel(profile?.role),
    avatar: profile?.avatar_url,
    organization: profile?.organizations?.nom || null,
    organizationId: profile?.organization_id || null,
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Sidebar */}
      <AgentSidebar />
      
      {/* Contenu principal */}
      <div className="lg:ml-72 min-h-screen flex flex-col">
        {/* Header */}
        <AgentHeader user={userData} />
        
        {/* Page content - avec padding top pour mobile à cause du header fixe */}
        <main className="flex-1 p-4 lg:p-6 pt-20 lg:pt-6">
          {children}
        </main>
      </div>
    </div>
  )
}

// Helper pour convertir le rôle en label lisible
function getRoleLabel(role?: string): string {
  switch (role) {
    case 'PROPRIETAIRE':
      return 'Propriétaire'
    case 'AGENT':
      return 'Agent'
    case 'LECTEUR':
      return 'Lecteur'
    case 'SUPER_ADMIN':
      return 'Super Admin'
    default:
      return 'Utilisateur'
  }
}
