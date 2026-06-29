import { Worker } from 'bullmq'
import IORedis from 'ioredis'
import sgMail from '@sendgrid/mail'

const REDIS_URL = process.env.REDIS_URL || 'redis://127.0.0.1:6379'
const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY || ''

sgMail.setApiKey(SENDGRID_API_KEY)

const connection = new IORedis(REDIS_URL)

const worker = new Worker('emails', async job => {
  const { to, subject, text, html } = job.data
  if (!to) throw new Error('Missing to')

  const msg: any = { to, from: 'noreply@comerci.ai', subject }
  if (html) msg.html = html
  if (text) msg.text = text

  await sgMail.send(msg)
  return { ok: true }
}, { connection })

worker.on('completed', job => {
  console.log('Email job completed', job.id)
})
worker.on('failed', (job, err) => {
  console.error('Email job failed', job?.id, err)
})

console.log('Worker started (emails)')
