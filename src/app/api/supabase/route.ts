import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  try {
    const supabase = await createClient()
    
    // Test de connexion basique
    const { data, error } = await supabase.from('activities').select('count', { count: 'exact', head: true })
    
    if (error) {
      return NextResponse.json({
        success: false,
        error: error.message,
        code: error.code,
        details: error.details
      }, { status: 500 })
    }
    
    // Récupérer quelques infos sur le projet
    const { data: tables, error: tablesError } = await supabase
      .rpc('get_tables')
      .select('*')
    
    // Tester la liste des tables disponibles via information_schema
    const { data: schemaData, error: schemaError } = await supabase
      .rpc('get_schema_info')
    
    return NextResponse.json({
      success: true,
      message: 'Connexion Supabase établie avec succès!',
      projectUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
      activitiesCount: data?.[0]?.count || 0,
      timestamp: new Date().toISOString(),
      note: "La connexion à Supabase est opérationnelle. Vous pouvez maintenant utiliser le client Supabase dans votre application."
    })
    
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    }, { status: 500 })
  }
}
