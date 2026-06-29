import { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../src/lib/prisma'
import { verifyToken } from '../../../src/lib/auth'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') return res.status(405).end()

  // admin only: require Bearer token
  const auth = req.headers['authorization'] as string | undefined
  if (!auth) return res.status(401).json({ error: 'Missing authorization' })
  const match = auth.match(/^Bearer\s+(.+)$/i)
  if (!match) return res.status(401).json({ error: 'Invalid authorization format' })
  const payload: any = verifyToken(match[1])
  if (!payload) return res.status(401).json({ error: 'Invalid token' })

  // verify user role
  const user = await prisma.user.findUnique({ where: { id: Number(payload.id) } })
  if (!user || user.role !== 'admin') return res.status(403).json({ error: 'Forbidden' })

  const tenants = await prisma.tenant.findMany({ orderBy: { createdAt: 'desc' } })
  return res.json(tenants)
}
