/**
 * Seed e-OSCS - Initialisation du Super Admin
 * 
 * Exécute avec: bunx prisma db seed
 */

import { PrismaClient } from '@prisma/client'
import { hash } from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seed e-OSCS - Initialisation...\n')

  // ============================================
  // 1. CRÉATION DU SUPER ADMIN
  // ============================================
  const SUPER_ADMIN = {
    email: 'omouitsi@gmail.com',
    password: 'Ogou1987',
    nomComplet: 'Super Administrateur MCNSLP',
    telephone: '+2250576103277',
    role: 'super_admin'
  }

  console.log(`📧 Vérification du Super Admin: ${SUPER_ADMIN.email}`)

  // Vérifier si le super admin existe déjà
  const existingAdmin = await prisma.user.findUnique({
    where: { email: SUPER_ADMIN.email }
  })

  if (existingAdmin) {
    console.log('✅ Super Admin existe déjà, mise à jour du mot de passe...')
    
    // Mettre à jour le mot de passe au cas où
    const passwordHash = await hash(SUPER_ADMIN.password, 12)
    await prisma.user.update({
      where: { email: SUPER_ADMIN.email },
      data: { 
        passwordHash,
        role: 'super_admin',
        isActive: true
      }
    })
  } else {
    console.log('🆕 Création du Super Admin...')
    
    const passwordHash = await hash(SUPER_ADMIN.password, 12)
    
    await prisma.user.create({
      data: {
        email: SUPER_ADMIN.email,
        passwordHash,
        nomComplet: SUPER_ADMIN.nomComplet,
        telephone: SUPER_ADMIN.telephone,
        role: SUPER_ADMIN.role,
        isActive: true,
        emailVerified: true
      }
    })
    
    console.log('✅ Super Admin créé avec succès!')
  }

  // ============================================
  // 2. CRÉATION D'UTILISATEURS DE TEST (optionnel)
  // ============================================
  
  const testUsers = [
    {
      email: 'admin@eoscs.ci',
      password: 'Admin123!',
      nomComplet: 'Admin Direction Régionale',
      telephone: '+2250700000001',
      role: 'admin',
      organisationNom: 'DR Solidarité Abidjan',
      typeOrg: 'DR',
      region: 'Abidjan'
    },
    {
      email: 'agent@eoscs.ci',
      password: 'Agent123!',
      nomComplet: 'Agent Terrain Kouassi',
      telephone: '+2250700000002',
      role: 'user',
      organisationNom: 'DD Solidarité Yopougon',
      typeOrg: 'DD',
      region: 'Abidjan',
      departement: 'Abidjan'
    }
  ]

  for (const testUser of testUsers) {
    const exists = await prisma.user.findUnique({
      where: { email: testUser.email }
    })

    if (!exists) {
      const passwordHash = await hash(testUser.password, 12)
      await prisma.user.create({
        data: {
          email: testUser.email,
          passwordHash,
          nomComplet: testUser.nomComplet,
          telephone: testUser.telephone,
          role: testUser.role,
          organisationNom: testUser.organisationNom,
          typeOrg: testUser.typeOrg as any,
          region: testUser.region,
          departement: testUser.departement || null,
          isActive: true,
          emailVerified: true
        }
      })
      console.log(`✅ Utilisateur de test créé: ${testUser.email}`)
    }
  }

  // ============================================
  // 3. RÉSUMÉ
  // ============================================
  const totalUsers = await prisma.user.count()
  
  console.log('\n' + '='.repeat(50))
  console.log('✅ Seed terminé avec succès!')
  console.log('='.repeat(50))
  console.log(`\n📊 Statistiques:`)
  console.log(`   - Total utilisateurs: ${totalUsers}`)
  console.log(`\n🔑 Identifiants de connexion:`)
  console.log(`   Super Admin: ${SUPER_ADMIN.email} / ${SUPER_ADMIN.password}`)
  console.log(`   Admin Test: admin@eoscs.ci / Admin123!`)
  console.log(`   Agent Test: agent@eoscs.ci / Agent123!`)
}

main()
  .catch((e) => {
    console.error('❌ Erreur lors du seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
