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
    // 7 days free trial - card required upfront, auto-charge after trial
    subscription_data: {
      trial_period_days: product.trialDays,
      trial_settings: {
        end_behavior: {
          missing_payment_method: 'cancel', // Cancel if no payment method
        },
      },
    },
    // Require payment method upfront for trial
    payment_method_collection: 'always',
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
