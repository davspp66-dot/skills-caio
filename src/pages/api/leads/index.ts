import { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../src/lib/prisma'

function getTenantIdFromReq(req: NextApiRequest) {
  const header = req.headers['x-tenant-id'] || req.headers['x-tenant']
  if (!header) return null
  const val = Array.isArray(header) ? header[0] : header
  const id = Number(val)
  return Number.isNaN(id) ? null : id
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const tenantId = getTenantIdFromReq(req)
  if (!tenantId) return res.status(400).json({ error: 'Missing tenant id in header x-tenant-id' })

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
