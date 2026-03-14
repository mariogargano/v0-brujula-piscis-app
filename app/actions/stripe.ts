'use server'

import { stripe } from '@/lib/stripe'
import { SUBSCRIPTION_PRODUCTS } from '@/lib/products'

export async function createCheckoutSession(productId: string) {
  const product = SUBSCRIPTION_PRODUCTS.find((p) => p.id === productId)
  
  if (!product) {
    throw new Error(`Product with id "${productId}" not found`)
  }

  const session = await stripe.checkout.sessions.create({
    ui_mode: 'embedded',
    redirect_on_completion: 'never',
    line_items: [
      {
        price_data: {
          currency: 'mxn',
          product_data: {
            name: product.name,
            description: product.description,
          },
          unit_amount: product.priceInCents,
          recurring: {
            interval: product.interval,
          },
        },
        quantity: 1,
      },
    ],
    mode: 'subscription',
    subscription_data: product.trialDays ? {
      trial_period_days: product.trialDays,
    } : undefined,
  })

  return session.client_secret
}

export async function getCheckoutSessionStatus(sessionId: string) {
  const session = await stripe.checkout.sessions.retrieve(sessionId)
  
  return {
    status: session.status,
    customerEmail: session.customer_details?.email,
    subscriptionId: session.subscription as string | null,
  }
}
