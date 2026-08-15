import { AppLayout } from '@/components/layout/app-layout'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function AppRootLayout({
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

  // Construire l'objet utilisateur pour le header
  const userData = {
    id: user.id,
    name: profile?.full_name || user.user_metadata?.full_name || 'Utilisateur',
    email: user.email || '',
    role: getRoleLabel(profile?.role),
    avatar: profile?.avatar_url,
    organization: profile?.organizations?.nom || null,
    organizationId: profile?.organization_id || null,
  }

  return <AppLayout user={userData}>{children}</AppLayout>
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
