import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useSubscription } from '@/hooks/useSubscription';
import { useToast } from '@/hooks/use-toast';
import { Shield, UserCheck } from 'lucide-react';
import ModernLayout from '@/components/layout/ModernLayout';

export default function AdminSubscription() {
  const { activateSubscription } = useSubscription();
  const { toast } = useToast();
  const [planType, setPlanType] = useState<'pro' | 'premium'>('pro');
  const [duration, setDuration] = useState(30);
  const [isLoading, setIsLoading] = useState(false);

  const handleActivate = async () => {
    setIsLoading(true);
    try {
      await activateSubscription(planType, duration);
      toast({
        title: "Assinatura ativada!",
        description: `Plano ${planType === 'pro' ? 'Fit Pro' : 'Fit Premium'} ativado por ${duration} dias.`,
      });
    } catch (error) {
      toast({
        title: "Erro ao ativar assinatura",
        description: "Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ModernLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <Shield className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold">Administração de Assinaturas</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserCheck className="h-5 w-5" />
              Ativar Assinatura Manual
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="plan">Tipo de Plano</Label>
                <Select value={planType} onValueChange={(value: 'pro' | 'premium') => setPlanType(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pro">Fit Pro</SelectItem>
                    <SelectItem value="premium">Fit Premium</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="duration">Duração (dias)</Label>
                <Input
                  id="duration"
                  type="number"
                  value={duration}
                  onChange={(e) => setDuration(Number(e.target.value))}
                  min={1}
                  max={365}
                />
              </div>
            </div>

            <Button 
              onClick={handleActivate} 
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? 'Ativando...' : 'Ativar Assinatura'}
            </Button>

            <div className="text-sm text-muted-foreground">
              <p><strong>Nota:</strong> Esta funcionalidade é para administradores ativarem assinaturas manualmente após confirmação de pagamento.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </ModernLayout>
  );
}