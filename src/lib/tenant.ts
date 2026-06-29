import { NextApiRequest } from 'next'
import { verifyToken } from './auth'
import prisma from './prisma'

export async function getTenantIdFromReq(req: NextApiRequest): Promise<number | null> {
  // prefer explicit header
  const header = req.headers['x-tenant-id'] || req.headers['x-tenant']
  if (header) {
    const val = Array.isArray(header) ? header[0] : header
    const id = Number(val)
    if (!Number.isNaN(id)) return id
  }

  // fallback to Authorization: Bearer <token>
  const authHeader = (req.headers['authorization'] || req.headers['Authorization']) as string | undefined
  if (!authHeader) return null
  const match = authHeader.match(/^Bearer\s+(.+)$/i)
  if (!match) return null
  const token = match[1]
  const payload: any = verifyToken(token)
  if (!payload) return null
  const userId = payload.id || payload.userId
  if (!userId) return null

  const user = await prisma.user.findUnique({ where: { id: Number(userId) } })
  if (!user) return null
  return user.tenantId ?? null
}
