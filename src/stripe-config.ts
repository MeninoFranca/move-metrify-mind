export interface StripeProduct {
  id: string;
  priceId: string;
  name: string;
  description: string;
  mode: 'subscription' | 'payment';
}

export const stripeProducts: StripeProduct[] = [
  {
    id: 'prod_So5VBWa4SOoRl6',
    priceId: 'price_1RsTKyH8N4z8pVLBAdFCkPwG',
    name: 'Fit Pro',
    description: 'Para resultados sérios',
    mode: 'subscription'
  },
  {
    id: 'prod_So5Wi4VMLsxSfB',
    priceId: 'price_1RsTLVH8N4z8pVLBh8NfRTUb',
    name: 'Fit Premium',
    description: 'Para atletas e entusiastas',
    mode: 'subscription'
  }
];