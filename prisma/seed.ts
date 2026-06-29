import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
  // create a default tenant
  const tenant = await prisma.tenant.upsert({
    where: { slug: 'comerci-ai' },
    update: {},
    create: { name: 'comerci.ai', slug: 'comerci-ai' }
  })

  const hashed = await bcrypt.hash('ChangeMe123!', 10)
  await prisma.user.upsert({
    where: { email: 'davspp66@gmail.com' },
    update: {},
    create: {
      email: 'davspp66@gmail.com',
      password: hashed,
      name: 'Felipe',
      role: 'admin',
      tenantId: tenant.id
    }
  })

  await prisma.lead.createMany({
    data: [
      { name: 'Empresa A', email: 'lead1@ex.com', phone: '11999990001', company: 'Empresa A', city: 'São Paulo', origin: 'Site', score: 78, stage: 'Prospecção', priority: 'alta', tags: ['vip'], value: 12000, tenantId: tenant.id },
      { name: 'Empresa B', email: 'lead2@ex.com', phone: '11999990002', company: 'Empresa B', city: 'Rio de Janeiro', origin: 'Indicação', score: 42, stage: 'Qualificação', priority: 'normal', tags: [], value: 3500, tenantId: tenant.id },
      { name: 'Empresa C', email: 'lead3@ex.com', phone: '11999990003', company: 'Empresa C', city: 'Curitiba', origin: 'Evento', score: 56, stage: 'Proposta', priority: 'baixa', tags: [], tenantId: tenant.id }
    ]
  })
  console.log('Seed completed for tenant', tenant.slug)
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
