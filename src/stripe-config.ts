export interface PlanProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  checkoutUrl: string;
  planType: 'pro' | 'premium';
}

export const planProducts: PlanProduct[] = [
  {
    id: 'fit-pro',
    name: 'Fit Pro',
    description: 'Para resultados sérios',
    price: 29,
    checkoutUrl: 'https://go.tribopay.com.br/6rifaenkhz',
    planType: 'pro'
  },
  {
    id: 'fit-premium',
    name: 'Fit Premium',
    description: 'Para atletas e entusiastas',
    price: 49,
    checkoutUrl: 'https://go.tribopay.com.br/xz6mpkudii',
    planType: 'premium'
  }
];