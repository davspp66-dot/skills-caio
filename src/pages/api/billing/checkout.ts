import Stripe from 'stripe'
import { NextApiRequest, NextApiResponse } from 'next'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', { apiVersion: '2024-08-01' })

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end()

  const { priceId, successUrl, cancelUrl } = req.body
  if (!priceId) return res.status(400).json({ error: 'Missing priceId' })

  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    payment_method_types: ['card'],
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: successUrl || 'https://example.com/success',
    cancel_url: cancelUrl || 'https://example.com/cancel',
    subscription_data: { trial_period_days: 14 }
  })

  return res.json({ url: session.url })
}
