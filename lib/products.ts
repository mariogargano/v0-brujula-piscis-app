export interface SubscriptionProduct {
  id: string;
  name: string;
  description: string;
  priceInCents: number;
  interval: 'month' | 'year';
  features: string[];
  popular?: boolean;
  trialDays?: number;
}

// Precios en centavos MXN
export const SUBSCRIPTION_PRODUCTS: SubscriptionProduct[] = [
  {
    id: 'brujula-pro-monthly',
    name: 'Brújula Pro Mensual',
    description: 'Acceso completo a Brújula Piscis por un mes',
    priceInCents: 9900, // $99 MXN
    interval: 'month',
    features: [
      'Decisiones ilimitadas',
      'Recordatorios personalizados',
      'Reportes semanales',
      'Todos los rituales',
      'Acceso a comunidad completa',
      'Historial ilimitado',
    ],
  },
  {
    id: 'brujula-pro-annual',
    name: 'Brújula Pro Anual',
    description: 'Acceso completo a Brújula Piscis por un año',
    priceInCents: 70800, // $708 MXN/año = $59/mes
    interval: 'year',
    features: [
      'Decisiones ilimitadas',
      'Recordatorios personalizados', 
      'Reportes semanales y mensuales',
      'Todos los rituales',
      'Acceso a comunidad completa',
      'Historial ilimitado',
      '40% de descuento vs mensual',
    ],
    popular: true,
    trialDays: 7,
  },
];

export function getProductById(productId: string): SubscriptionProduct | undefined {
  return SUBSCRIPTION_PRODUCTS.find(p => p.id === productId);
}
