import React from 'react';
import ModernLayout from '@/components/layout/ModernLayout';
import { SubscriptionCard } from '@/components/subscription/SubscriptionCard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Crown, Sparkles, Shield, Headphones } from 'lucide-react';

export default function Subscription() {
  return (
    <ModernLayout>
      <div className="space-y-8">
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <Badge variant="outline" className="px-4 py-2">
              <Sparkles className="mr-2 h-4 w-4" />
              Planos Premium
            </Badge>
          </div>
          <h1 className="text-3xl font-bold">Escolha seu Plano</h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Desbloqueie todo o potencial do FitPro com nossos planos premium. 
            Treinos personalizados, nutrição avançada e suporte especializado.
          </p>
        </div>

        <SubscriptionCard />

        <div className="grid md:grid-cols-3 gap-6 mt-12">
          <Card>
            <CardHeader className="text-center">
              <Crown className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
              <CardTitle>Qualidade Premium</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-center">
                Algoritmos de IA de última geração para resultados superiores
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="text-center">
              <Shield className="h-8 w-8 text-green-500 mx-auto mb-2" />
              <CardTitle>Dados Seguros</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-center">
                Seus dados pessoais e de saúde protegidos com criptografia avançada
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="text-center">
              <Headphones className="h-8 w-8 text-blue-500 mx-auto mb-2" />
              <CardTitle>Suporte Especializado</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-center">
                Equipe de especialistas em fitness e nutrição disponível para ajudar
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </div>
    </ModernLayout>
  );
}