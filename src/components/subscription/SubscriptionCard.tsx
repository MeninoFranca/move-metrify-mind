import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useStripe } from '@/hooks/useStripe';
import { stripeProducts } from '@/stripe-config';
import { Check, Crown, Zap, Loader2 } from 'lucide-react';

export const SubscriptionCard = () => {
  const { subscription, isLoading, createCheckoutSession, getActiveSubscription } = useStripe();
  const [loadingPriceId, setLoadingPriceId] = React.useState<string | null>(null);

  const activeSubscription = getActiveSubscription();

  const handleSubscribe = async (priceId: string) => {
    try {
      setLoadingPriceId(priceId);
      await createCheckoutSession(priceId, 'subscription');
    } catch (error) {
      console.error('Error creating checkout session:', error);
      setLoadingPriceId(null);
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center p-6">
          <Loader2 className="h-6 w-6 animate-spin" />
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {activeSubscription && (
        <Card className="border-primary">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Crown className="h-5 w-5 text-primary" />
                Plano Ativo
              </CardTitle>
              <Badge variant="default">{activeSubscription.status}</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <h3 className="text-xl font-semibold">{activeSubscription.name}</h3>
              <p className="text-muted-foreground">{activeSubscription.description}</p>
              {activeSubscription.current_period_end && (
                <p className="text-sm text-muted-foreground">
                  Próxima cobrança: {new Date(activeSubscription.current_period_end * 1000).toLocaleDateString('pt-BR')}
                </p>
              )}
              {activeSubscription.payment_method && (
                <p className="text-sm text-muted-foreground">
                  Método de pagamento: {activeSubscription.payment_method}
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        {stripeProducts.map((product) => {
          const isActive = activeSubscription?.priceId === product.priceId;
          const isLoading = loadingPriceId === product.priceId;
          
          return (
            <Card key={product.id} className={isActive ? 'border-primary bg-primary/5' : ''}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    {product.name === 'Fit Premium' ? (
                      <Crown className="h-5 w-5 text-yellow-500" />
                    ) : (
                      <Zap className="h-5 w-5 text-blue-500" />
                    )}
                    {product.name}
                  </CardTitle>
                  {product.name === 'Fit Premium' && (
                    <Badge variant="secondary">Mais Popular</Badge>
                  )}
                </div>
                <CardDescription>{product.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="text-2xl font-bold">
                    {product.name === 'Fit Pro' ? 'R$ 29' : 'R$ 49'}
                    <span className="text-sm font-normal text-muted-foreground">/mês</span>
                  </div>
                </div>

                <ul className="space-y-2 text-sm">
                  {product.name === 'Fit Pro' ? (
                    <>
                      <li className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-green-500" />
                        Treinos personalizados por IA
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-green-500" />
                        Planos nutricionais básicos
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-green-500" />
                        Tracking de progresso
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-green-500" />
                        Suporte por email
                      </li>
                    </>
                  ) : (
                    <>
                      <li className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-green-500" />
                        Tudo do Fit Pro
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-green-500" />
                        Consultoria nutricional avançada
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-green-500" />
                        Analytics detalhados
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-green-500" />
                        Suporte prioritário 24/7
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-green-500" />
                        Acesso antecipado a features
                      </li>
                    </>
                  )}
                </ul>

                <Button
                  className="w-full"
                  variant={isActive ? 'secondary' : 'default'}
                  disabled={isActive || isLoading}
                  onClick={() => handleSubscribe(product.priceId)}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processando...
                    </>
                  ) : isActive ? (
                    'Plano Atual'
                  ) : (
                    'Assinar Agora'
                  )}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};