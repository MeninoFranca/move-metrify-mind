import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Droplets, Plus, Target, Clock, Zap } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { hydrationService, HydrationStats } from '@/services/hydrationService';
import { toast } from '@/hooks/use-toast';

export default function Hydration() {
  const { profile } = useAuth();
  const [hydrationStats, setHydrationStats] = useState<HydrationStats | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadHydrationData();
  }, [profile]);

  const loadHydrationData = async () => {
    if (!profile?.user_id) return;
    
    try {
      const stats = await hydrationService.getDayStats(profile.user_id);
      setHydrationStats(stats);
    } catch (error) {
      console.error('Erro ao carregar dados de hidratação:', error);
    }
  };

  const addWater = async (amount: number) => {
    if (!profile?.user_id || !profile.weight) return;
    
    setIsLoading(true);
    try {
      const record = await hydrationService.getOrCreateDayRecord(profile.user_id, profile.weight);
      await hydrationService.addWaterEntry(record.id, amount);
      await loadHydrationData();
      
      toast({
        title: "Água Registrada! 💧",
        description: `${amount}ml adicionados ao seu progresso diário.`,
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível registrar o consumo de água.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const waterSuggestions = hydrationService.getAmountSuggestions();

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Droplets className="h-8 w-8 text-blue-500" />
          Hidratação
        </h1>
        <Badge variant="outline" className="flex items-center gap-1">
          <Target className="h-3 w-3" />
          Meta: {profile?.weight ? `${Math.round(profile.weight * 35)}ml` : '2000ml'}
        </Badge>
      </div>

      {/* Progresso Diário */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-blue-500" />
            Progresso de Hoje
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {hydrationStats ? (
            <>
              <div className="text-center space-y-2">
                <div className="text-4xl font-bold text-blue-600">
                  {hydrationStats.consumed}ml
                </div>
                <div className="text-muted-foreground">
                  de {hydrationStats.goal}ml
                </div>
              </div>
              
              <Progress 
                value={hydrationStats.percentage} 
                className="h-4"
              />
              
              <div className="text-center">
                <Badge 
                  variant={hydrationStats.percentage >= 100 ? "default" : "secondary"}
                  className="text-lg px-4 py-2"
                >
                  {hydrationStats.percentage.toFixed(0)}% Concluído
                </Badge>
              </div>
              
              {hydrationStats.percentage >= 100 && (
                <div className="text-center text-green-600 font-medium">
                  🎉 Meta diária atingida! Parabéns!
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-8">
              <Droplets className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">
                Comece registrando seu primeiro copo de água hoje!
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Adicionar Água */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Registrar Consumo
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {waterSuggestions.map((suggestion) => (
              <Button
                key={suggestion.amount}
                onClick={() => addWater(suggestion.amount)}
                disabled={isLoading}
                variant="outline"
                className="h-16 flex flex-col items-center gap-1"
              >
                <span className="text-2xl">{suggestion.icon}</span>
                <span className="text-xs">{suggestion.label}</span>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Histórico Recente */}
      {hydrationStats?.entries && hydrationStats.entries.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Últimos Registros
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {hydrationStats.entries.slice(0, 5).map((entry, index) => (
                <div key={index} className="flex justify-between items-center p-2 bg-muted rounded">
                  <span>{entry.amount_ml}ml</span>
                  <span className="text-sm text-muted-foreground">
                    {new Date(entry.recorded_at).toLocaleTimeString('pt-BR', { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}