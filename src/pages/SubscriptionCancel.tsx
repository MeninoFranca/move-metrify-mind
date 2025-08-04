import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { XCircle, ArrowLeft, HelpCircle } from 'lucide-react';

export default function SubscriptionCancel() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader className="space-y-4">
          <div className="flex justify-center">
            <div className="p-4 rounded-full bg-orange-100 dark:bg-orange-900/20">
              <XCircle className="h-12 w-12 text-orange-600" />
            </div>
          </div>
          <div>
            <CardTitle className="text-2xl">Pagamento Cancelado</CardTitle>
            <CardDescription className="text-lg mt-2">
              Nenhuma cobrança foi realizada
            </CardDescription>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="text-muted-foreground">
            <p>
              Você cancelou o processo de pagamento. Não se preocupe, 
              nenhuma cobrança foi realizada em seu cartão.
            </p>
          </div>

          <div className="space-y-3">
            <Button asChild className="w-full" size="lg">
              <Link to="/subscription">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Voltar aos Planos
              </Link>
            </Button>
            
            <Button asChild variant="outline" className="w-full">
              <Link to="/dashboard">
                Ir para o Dashboard
              </Link>
            </Button>
          </div>

          <div className="pt-4 border-t">
            <p className="text-sm text-muted-foreground mb-3">
              Precisa de ajuda para escolher o plano ideal?
            </p>
            <Button variant="ghost" size="sm" className="text-primary">
              <HelpCircle className="mr-2 h-4 w-4" />
              Falar com Suporte
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}