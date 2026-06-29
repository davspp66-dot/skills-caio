import { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../src/lib/prisma'
import { getTenantIdFromReq } from '../../../src/lib/tenant'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const tenantId = await getTenantIdFromReq(req)
  if (!tenantId) return res.status(401).json({ error: 'Missing or invalid tenant (provide x-tenant-id or Authorization Bearer token)' })

  const { id } = req.query
  const leadId = Number(id)
  if (Number.isNaN(leadId)) return res.status(400).json({ error: 'Invalid id' })

  if (req.method === 'GET') {
    const lead = await prisma.lead.findFirst({ where: { id: leadId, tenantId } })
    return res.json(lead)
  }
  if (req.method === 'PUT') {
    const data = req.body
    // updateMany used earlier; use update with where to ensure ownership
    const lead = await prisma.lead.updateMany({ where: { id: leadId, tenantId }, data })
    return res.json(lead)
  }
  if (req.method === 'DELETE') {
    await prisma.lead.deleteMany({ where: { id: leadId, tenantId } })
    return res.json({ ok: true })
  }
  return res.status(405).end()
}
