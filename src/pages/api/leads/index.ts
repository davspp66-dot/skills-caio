import { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../src/lib/prisma'
import { getTenantIdFromReq } from '../../../src/lib/tenant'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const tenantId = await getTenantIdFromReq(req)
  if (!tenantId) return res.status(401).json({ error: 'Missing or invalid tenant (provide x-tenant-id or Authorization Bearer token)' })

  if (req.method === 'GET') {
    const leads = await prisma.lead.findMany({ where: { tenantId }, orderBy: { createdAt: 'desc' } })
    return res.json(leads)
  }
  if (req.method === 'POST') {
    const data = req.body
    const lead = await prisma.lead.create({ data: { ...data, tenantId } })
    return res.json(lead)
  }
  return res.status(405).end()
}
