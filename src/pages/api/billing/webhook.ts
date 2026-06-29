import Stripe from 'stripe'
import { buffer } from 'micro'
import type { NextApiRequest, NextApiResponse } from 'next'

export const config = { api: { bodyParser: false } }

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', { apiVersion: '2024-08-01' })

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end()
  const sig = req.headers['stripe-signature'] as string | undefined
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || ''
  const buf = await buffer(req as any)
  let event
  try {
    event = stripe.webhooks.constructEvent(buf, sig || '', webhookSecret)
  } catch (err) {
    console.error('Webhook signature verification failed.', err)
    return res.status(400).send(`Webhook Error: ${err}`)
  }

  // handle events
  switch (event.type) {
    case 'checkout.session.completed':
      // provision tenant / mark subscription active
      break
    case 'invoice.paid':
      break
    case 'customer.subscription.deleted':
      break
    default:
      console.log(`Unhandled event type ${event.type}`)
  }

  res.json({ received: true })
}
