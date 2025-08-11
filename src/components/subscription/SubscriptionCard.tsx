import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useSubscription } from '@/hooks/useSubscription';
import { planProducts } from '@/stripe-config';
import { Check, Crown, Zap, ExternalLink } from 'lucide-react';

export const SubscriptionCard = () => {
  const { subscription, subscribeToPlan } = useSubscription();

  const handleSubscribe = (planType: 'pro' | 'premium') => {
    subscribeToPlan(planType);
  };

  return (
    <div className="space-y-6">
      {subscription.isActive && (
        <Card className="border-primary">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Crown className="h-5 w-5 text-primary" />
                Plano Ativo
              </CardTitle>
              <Badge variant="default">Ativo</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <h3 className="text-xl font-semibold">
                {subscription.plan === 'pro' ? 'Fit Pro' : 'Fit Premium'}
              </h3>
              <p className="text-muted-foreground">
                {subscription.plan === 'pro' ? 'Para resultados sérios' : 'Para atletas e entusiastas'}
              </p>
              {subscription.expiresAt && (
                <p className="text-sm text-muted-foreground">
                  Expira em: {subscription.expiresAt.toLocaleDateString('pt-BR')}
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        {planProducts.map((product) => {
          const isActive = subscription.isActive && subscription.plan === product.planType;
          
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
                    R$ {product.price}
                    <span className="text-sm font-normal text-muted-foreground">/mês</span>
                  </div>
                </div>

                <ul className="space-y-2 text-sm">
                  {product.planType === 'pro' ? (
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
                  disabled={isActive}
                  onClick={() => handleSubscribe(product.planType)}
                >
                  {isActive ? (
                    'Plano Atual'
                  ) : (
                    <>
                      <ExternalLink className="mr-2 h-4 w-4" />
                      Assinar Agora
                    </>
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