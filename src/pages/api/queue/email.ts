import { NextApiRequest, NextApiResponse } from 'next'
import { Queue } from 'bullmq'

const REDIS_URL = process.env.REDIS_URL || 'redis://127.0.0.1:6379'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end()
  const { to, subject, text, html } = req.body
  if (!to || (!text && !html)) return res.status(400).json({ error: 'Missing params' })

  const queue = new Queue('emails', { connection: { url: REDIS_URL } })
  await queue.add('send-email', { to, subject, text, html })
  return res.json({ ok: true })
}
