'use client'

import { useCallback, useState, useMemo, useRef, useEffect } from 'react'
import {
  EmbeddedCheckout,
  EmbeddedCheckoutProvider,
} from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import { createCheckoutSession } from '@/app/actions/stripe'
import { Loader2 } from 'lucide-react'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

interface StripeCheckoutProps {
  productId: string
  onComplete?: () => void
}

export function StripeCheckout({ productId, onComplete }: StripeCheckoutProps) {
  const [isLoading, setIsLoading] = useState(true)
  const onCompleteRef = useRef(onComplete)
  
  // Keep the ref updated
  useEffect(() => {
    onCompleteRef.current = onComplete
  }, [onComplete])

  const fetchClientSecret = useCallback(async () => {
    const clientSecret = await createCheckoutSession(productId)
    setIsLoading(false)
    return clientSecret
  }, [productId])

  // Memoize options to prevent re-renders
  const options = useMemo(() => ({
    fetchClientSecret,
    onComplete: () => {
      onCompleteRef.current?.()
    }
  }), [fetchClientSecret])

  return (
    <div className="w-full min-h-[400px] relative">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/80 z-10">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">Preparando pago seguro...</p>
          </div>
        </div>
      )}
      <EmbeddedCheckoutProvider
        stripe={stripePromise}
        options={options}
      >
        <EmbeddedCheckout className="w-full" />
      </EmbeddedCheckoutProvider>
    </div>
  )
}
