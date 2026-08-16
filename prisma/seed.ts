/**
 * Seed e-OSCS - Création du Super Admin
 * 
 * Ce script crée le compte super administrateur initial
 * avec les identifiants : omouitsi@gmail.com / Ogou1987
 */

import { PrismaClient } from '@prisma/client'
import { hash } from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seed e-OSCS - Création du Super Admin...')
  
  const email = 'omouitsi@gmail.com'
  const password = 'Ogou1987'
  
  // Vérifier si le super admin existe déjà
  const existingAdmin = await prisma.user.findUnique({
    where: { email }
  })
  
  if (existingAdmin) {
    console.log(`✅ Super Admin existe déjà: ${email}`)
    // Mettre à jour le mot de passe au cas où
    const passwordHash = await hash(password, 12)
    await prisma.user.update({
      where: { email },
      data: { 
        passwordHash,
        role: 'super_admin',
        isActive: true,
        nomComplet: 'Super Administrateur',
        emailVerified: true
      }
    })
    console.log('🔑 Mot de passe mis à jour')
    return
  }
  
  // Hasher le mot de passe
  const passwordHash = await hash(password, 12)
  
  // Créer le super admin
  const superAdmin = await prisma.user.create({
    data: {
      email,
      passwordHash,
      nomComplet: 'Super Administrateur',
      role: 'super_admin',
      isActive: true,
      emailVerified: true
    }
  })
  
  console.log(`✅ Super Admin créé avec succès:`)
  console.log(`   Email: ${superAdmin.email}`)
  console.log(`   Rôle: ${superAdmin.role}`)
  console.log(`   ID: ${superAdmin.id}`)
}

main()
  .catch((e) => {
    console.error('❌ Erreur seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
