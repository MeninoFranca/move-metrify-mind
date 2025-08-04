import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, ArrowRight, Crown, Sparkles } from 'lucide-react';
import { useStripe } from '@/hooks/useStripe';

export default function SubscriptionSuccess() {
  const { refetch } = useStripe();

  useEffect(() => {
    // Refetch subscription data after successful payment
    const timer = setTimeout(() => {
      refetch();
    }, 2000);

    return () => clearTimeout(timer);
  }, [refetch]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader className="space-y-4">
          <div className="flex justify-center">
            <div className="p-4 rounded-full bg-green-100 dark:bg-green-900/20">
              <CheckCircle className="h-12 w-12 text-green-600" />
            </div>
          </div>
          <div>
            <CardTitle className="text-2xl">Pagamento Confirmado!</CardTitle>
            <CardDescription className="text-lg mt-2">
              Bem-vindo ao FitPro Premium
            </CardDescription>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <Badge variant="secondary" className="px-4 py-2">
              <Crown className="mr-2 h-4 w-4" />
              Acesso Premium Ativado
            </Badge>
            
            <div className="text-left space-y-2 bg-muted/50 p-4 rounded-lg">
              <h3 className="font-semibold flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary" />
                Agora você tem acesso a:
              </h3>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• Treinos ilimitados personalizados por IA</li>
                <li>• Planos nutricionais completos</li>
                <li>• Analytics avançados de progresso</li>
                <li>• Suporte prioritário</li>
                <li>• Todas as funcionalidades premium</li>
              </ul>
            </div>
          </div>

          <div className="space-y-3">
            <Button asChild className="w-full" size="lg">
              <Link to="/dashboard">
                Ir para o Dashboard
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            
            <Button asChild variant="outline" className="w-full">
              <Link to="/subscription">
                Gerenciar Assinatura
              </Link>
            </Button>
          </div>

          <p className="text-xs text-muted-foreground">
            Você receberá um email de confirmação em breve com os detalhes da sua assinatura.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}