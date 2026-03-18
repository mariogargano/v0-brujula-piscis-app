export interface SubscriptionProduct {
  id: string;
  name: string;
  description: string;
  priceInCents: number;
  interval: 'month';
  features: string[];
  popular?: boolean;
  planType: 'basico' | 'pro';
  trialDays: number;
}

// Precios en centavos MXN
export const SUBSCRIPTION_PRODUCTS: SubscriptionProduct[] = [
  {
    id: 'brujula-basico',
    name: 'Brújula Básico',
    description: 'Para Piscis que quieren empezar a decidir mejor',
    priceInCents: 7900, // $79 MXN/mes
    interval: 'month',
    planType: 'basico',
    trialDays: 7,
    features: [
      '7 dias de prueba gratis',
      '10 decisiones al mes',
      '5 rituales desbloqueados',
      'Acceso a la comunidad Piscis',
      'Historial de decisiones',
    ],
  },
  {
    id: 'brujula-pro',
    name: 'Brújula Pro',
    description: 'Experiencia completa con Mentor Espiritual',
    priceInCents: 14900, // $149 MXN/mes
    interval: 'month',
    planType: 'pro',
    popular: true,
    trialDays: 7,
    features: [
      '7 dias de prueba gratis',
      'Decisiones ilimitadas',
      'Todos los rituales',
      'Chat con Mentor Espiritual',
      'Kabbalah, Tarot, Astrología y más',
      'Reportes semanales y mensuales',
      'Comunidad completa',
      'Recordatorios personalizados',
    ],
  },
];

export function getProductById(productId: string): SubscriptionProduct | undefined {
  return SUBSCRIPTION_PRODUCTS.find(p => p.id === productId);
}
