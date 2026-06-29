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

  const { id } = req.query
  const leadId = Number(id)
  if (req.method === 'GET') {
    const lead = await prisma.lead.findFirst({ where: { id: leadId, tenantId } })
    return res.json(lead)
  }
  if (req.method === 'PUT') {
    const data = req.body
    const lead = await prisma.lead.updateMany({ where: { id: leadId, tenantId }, data })
    return res.json(lead)
  }
  if (req.method === 'DELETE') {
    await prisma.lead.deleteMany({ where: { id: leadId, tenantId } })
    return res.json({ ok: true })
  }
  return res.status(405).end()
}
