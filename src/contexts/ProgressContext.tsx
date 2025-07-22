// src/contexts/ProgressContext.tsx
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { RegistroProgresso, MetaProgresso, EstatisticasProgresso } from '@/types/progress';
import { progressService, UserGoal, WeightProgress } from '@/services/progressService';
import { useAuth } from './AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { TablesInsert } from '@/integrations/supabase/types';

interface ProgressContextType {
  registros: WeightProgress[];
  metas: UserGoal[];
  estatisticas: EstatisticasProgresso;
  isLoading: boolean;
  adicionarRegistro: (registro: Omit<TablesInsert<'weight_progress'>, 'user_id' | 'id'>) => Promise<void>;
  adicionarMeta: (meta: Omit<TablesInsert<'user_goals'>, 'user_id' | 'id'>) => Promise<void>;
  // Adicione outras funções conforme necessário (atualizar, remover, etc.)
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
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [registros, setRegistros] = useState<WeightProgress[]>([]);
  const [metas, setMetas] = useState<UserGoal[]>([]);
  const [estatisticas, setEstatisticas] = useState<EstatisticasProgresso>({} as EstatisticasProgresso);
  const [isLoading, setIsLoading] = useState(true);

  const calcularEstatisticas = (registros: WeightProgress[], metas: UserGoal[]): EstatisticasProgresso => {
    if (registros.length === 0) {
      return {
        mediaPeso: 0, variacaoPeso: 0, diasTreinados: 0, metasConcluidas: 0,
        metasEmAndamento: 0, diasConsecutivos: 0, melhorSequencia: 0
      };
    }
    const pesos = registros.map(r => r.weight_kg);
    const mediaPeso = pesos.reduce((a, b) => a + b, 0) / pesos.length;
    const variacaoPeso = Math.max(...pesos) - Math.min(...pesos);
    
    return {
      mediaPeso,
      variacaoPeso,
      diasTreinados: registros.length, // Simplificado, idealmente viria de outra tabela
      metasConcluidas: metas.filter(m => m.current_value && m.current_value >= m.target_value).length,
      metasEmAndamento: metas.filter(m => !m.current_value || m.current_value < m.target_value).length,
      diasConsecutivos: 0, // Lógica a ser implementada
      melhorSequencia: 0, // Lógica a ser implementada
    };
  };

  const fetchData = useCallback(async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      const [registrosData, metasData] = await Promise.all([
        progressService.getWeightProgress(user.id),
        progressService.getGoals(user.id),
      ]);
      setRegistros(registrosData);
      setMetas(metasData);
      setEstatisticas(calcularEstatisticas(registrosData, metasData));
    } catch (error) {
      toast({ variant: "destructive", title: "Erro ao carregar dados de progresso." });
    } finally {
      setIsLoading(false);
    }
  }, [user, toast]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const adicionarRegistro = async (registro: Omit<TablesInsert<'weight_progress'>, 'user_id' | 'id'>) => {
    if (!user) return;
    try {
      const novoRegistro = await progressService.addWeightProgress({ ...registro, user_id: user.id });
      setRegistros(prev => [...prev, novoRegistro].sort((a, b) => new Date(a.recorded_date).getTime() - new Date(b.recorded_date).getTime()));
      toast({ title: "Registro de peso adicionado!" });
    } catch (error) {
      toast({ variant: "destructive", title: "Erro ao salvar registro." });
    }
  };

  const adicionarMeta = async (meta: Omit<TablesInsert<'user_goals'>, 'user_id' | 'id'>) => {
    if (!user) return;
    try {
      const novaMeta = await progressService.addGoal({ ...meta, user_id: user.id });
      setMetas(prev => [novaMeta, ...prev]);
      toast({ title: "Nova meta adicionada!" });
    } catch (error) {
      toast({ variant: "destructive", title: "Erro ao salvar meta." });
    }
  };

  // Atualiza estatísticas quando registros ou metas mudam
  useEffect(() => {
    setEstatisticas(calcularEstatisticas(registros, metas));
  }, [registros, metas]);

  return (
    <ProgressContext.Provider value={{
      registros,
      metas,
      estatisticas,
      isLoading,
      adicionarRegistro,
      adicionarMeta
    }}>
      {children}
    </ProgressContext.Provider>
  );
};