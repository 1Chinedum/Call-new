const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')
const axios = require('axios')
dotenv.config()

const app = express()
app.use(express.json())
app.use(cors({ origin: true }))

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY
const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY
let stripe
try { stripe = require('stripe')(STRIPE_SECRET_KEY || '') } catch (_) {}

app.get('/health', (_req, res) => res.json({ ok: true }))

app.get('/rates', async (_req, res) => {
  try {
    const r = await axios.get('https://api.exchangerate.host/latest?base=USD&symbols=NGN')
    const rate = r.data?.rates?.NGN
    if (!rate) throw new Error('rate missing')
    res.json({ USD_NGN: rate })
  } catch (e) {
    res.status(500).json({ error: 'rate_fetch_failed' })
  }
})

app.post('/create-checkout-session', async (req, res) => {
  try {
    if (!stripe || !STRIPE_SECRET_KEY) return res.status(500).json({ error: 'Stripe not configured' })
    const { amount, service, customer } = req.body || {}
    if (!amount || !service) return res.status(400).json({ error: 'Missing amount or service' })

    const origin = req.headers.origin || req.body.origin || 'http://localhost:8000'
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: { name: service },
            unit_amount: amount,
          },
          quantity: 1,
        },
      ],
      success_url: origin + '?payment=success',
      cancel_url: origin + '?payment=cancel',
      metadata: customer || {},
  })
  res.json({ url: session.url })
})
  } catch (err) {
    res.status(500).json({ error: 'Failed to create session' })
  }
})

const port = process.env.PORT || 4242
app.listen(port, () => console.log(`Payment server running on :${port}`))
app.post('/paystack/initialize', async (req, res) => {
  try {
    if (!PAYSTACK_SECRET_KEY) return res.status(500).json({ error: 'Paystack not configured' })
    const { amount, service, customer } = req.body || {}
    const email = (customer && customer.email) || 'booking@callnbarb.com'
    if (!amount || !service) return res.status(400).json({ error: 'Missing amount or service' })
    const resp = await axios.post('https://api.paystack.co/transaction/initialize', {
      amount, // kobo
      email,
      metadata: { service },
      currency: 'NGN',
    }, {
      headers: { Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`, 'Content-Type': 'application/json' }
    })
    const url = resp.data?.data?.authorization_url
    if (!url) return res.status(500).json({ error: 'initialize_failed' })
    res.json({ url })
  } catch (err) {
    res.status(500).json({ error: 'paystack_error' })
  }
})
