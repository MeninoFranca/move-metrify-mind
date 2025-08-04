// src/contexts/ProgressContext.tsx
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { EstatisticasProgresso } from '@/types/progress';
import { progressService, UserGoal, WeightProgress, HydrationRecord } from '@/services/progressService';
import { useAuth } from './AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { TablesInsert } from '@/integrations/supabase/types';

interface ProgressContextType {
  registros: WeightProgress[];
  metas: UserGoal[];
  hydrationToday: HydrationRecord | null;
  estatisticas: EstatisticasProgresso;
  isLoading: boolean;
  adicionarRegistro: (registro: Omit<TablesInsert<'weight_progress'>, 'user_id' | 'id'>) => Promise<void>;
  adicionarMeta: (meta: Omit<TablesInsert<'user_goals'>, 'user_id' | 'id'>) => Promise<void>;
  addWater: (amountMl: number) => Promise<void>;
}

const ProgressContext = createContext<ProgressContextType | undefined>(undefined);

export const useProgress = () => {
  const context = useContext(ProgressContext);
  if (!context) {
    throw new Error('useProgress deve ser usado dentro de um ProgressProvider');
  }
  return context;
};

export const ProgressProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, profile } = useAuth();
  const { toast } = useToast();

  const [registros, setRegistros] = useState<WeightProgress[]>([]);
  const [metas, setMetas] = useState<UserGoal[]>([]);
  const [hydrationToday, setHydrationToday] = useState<HydrationRecord | null>(null);
  const [estatisticas, setEstatisticas] = useState<EstatisticasProgresso>({} as EstatisticasProgresso);
  const [isLoading, setIsLoading] = useState(true);

  const calcularEstatisticas = (registros: WeightProgress[], metas: UserGoal[]): EstatisticasProgresso => {
    if (registros.length === 0) {
      return {
        tempo_medio_treino: 0,
        calorias_queimadas_semana: 0,
        treinos_semana: 0,
        mediaPeso: 0,
        variacaoPeso: 0,
        diasTreinados: 0,
        metasConcluidas: 0,
        metasEmAndamento: 0,
        diasConsecutivos: 0,
        melhorSequencia: 0,
      };
    }

    const pesos = registros.map(r => r.weight_kg);
    const mediaPeso = pesos.reduce((a, b) => a + b, 0) / pesos.length;
    const variacaoPeso = Math.max(...pesos) - Math.min(...pesos);

    return {
      tempo_medio_treino: 45, // Valor padrão
      calorias_queimadas_semana: 1200, // Valor padrão
      treinos_semana: 3, // Valor padrão
      mediaPeso,
      variacaoPeso,
      diasTreinados: registros.length,
      metasConcluidas: metas.filter(m => m.current_value && m.current_value >= m.target_value).length,
      metasEmAndamento: metas.filter(m => !m.current_value || m.current_value < m.target_value).length,
      diasConsecutivos: 0, // Lógica futura
      melhorSequencia: 0, // Lógica futura
    };
  };

  const fetchData = useCallback(async () => {
    if (!user || !profile?.weight) return;
    setIsLoading(true);
    try {
      const [registrosData, metasData, hydrationData] = await Promise.all([
        progressService.getWeightProgress(user.id),
        progressService.getGoals(user.id),
        progressService.getOrCreateHydrationRecord(user.id, profile.weight),
      ]);
      setRegistros(registrosData);
      setMetas(metasData);
      setHydrationToday(hydrationData);
      setEstatisticas(calcularEstatisticas(registrosData, metasData));
    } catch (error) {
      toast({ variant: 'destructive', title: 'Erro ao carregar dados de progresso.' });
    } finally {
      setIsLoading(false);
    }
  }, [user, profile, toast]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const adicionarRegistro = async (registro: Omit<TablesInsert<'weight_progress'>, 'user_id' | 'id'>) => {
    if (!user) return;
    try {
      const novoRegistro = await progressService.addWeightProgress({ ...registro, user_id: user.id });
      const atualizados = [...registros, novoRegistro].sort(
        (a, b) => new Date(a.recorded_date).getTime() - new Date(b.recorded_date).getTime()
      );
      setRegistros(atualizados);
      toast({ title: 'Registro de peso adicionado!' });
    } catch (error) {
      toast({ variant: 'destructive', title: 'Erro ao salvar registro.' });
    }
  };

  const adicionarMeta = async (meta: Omit<TablesInsert<'user_goals'>, 'user_id' | 'id'>) => {
    if (!user) return;
    try {
      const novaMeta = await progressService.addGoal({ ...meta, user_id: user.id });
      setMetas(prev => [novaMeta, ...prev]);
      toast({ title: 'Nova meta adicionada!' });
    } catch (error) {
      toast({ variant: 'destructive', title: 'Erro ao salvar meta.' });
    }
  };

  const addWater = async (amountMl: number) => {
    if (!hydrationToday) return;
    try {
      const updated = await progressService.addHydrationEntry(hydrationToday.id, amountMl);
      setHydrationToday(updated);
      toast({ title: `${amountMl}ml de água registrados!` });
    } catch (error) {
      toast({ variant: 'destructive', title: 'Erro ao registrar água.' });
    }
  };

  useEffect(() => {
    setEstatisticas(calcularEstatisticas(registros, metas));
  }, [registros, metas]);

  return (
    <ProgressContext.Provider
      value={{
        registros,
        metas,
        hydrationToday,
        estatisticas,
        isLoading,
        adicionarRegistro,
        adicionarMeta,
        addWater,
      }}
    >
      {children}
    </ProgressContext.Provider>
  );
};
