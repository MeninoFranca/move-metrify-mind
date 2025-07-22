// src/services/progressService.ts
import { supabase } from '@/integrations/supabase/client';
import { Tables, TablesInsert } from '@/integrations/supabase/types';

// Tipos para facilitar a manipulação dos dados
export type WeightProgress = Tables<'weight_progress'>;
export type BodyMeasurements = Tables<'body_measurements'>;
export type UserGoal = Tables<'user_goals'>;

export const progressService = {
  // --- Funções de Progresso de Peso ---
  async getWeightProgress(userId: string): Promise<WeightProgress[]> {
    const { data, error } = await supabase
      .from('weight_progress')
      .select('*')
      .eq('user_id', userId)
      .order('recorded_date', { ascending: true });

    if (error) {
      console.error('Erro ao buscar progresso de peso:', error);
      throw error;
    }
    return data;
  },

  async addWeightProgress(progress: TablesInsert<'weight_progress'>): Promise<WeightProgress> {
    const { data, error } = await supabase
      .from('weight_progress')
      .insert(progress)
      .select()
      .single();
      
    if (error) {
      console.error('Erro ao adicionar progresso de peso:', error);
      throw error;
    }
    return data;
  },

  // --- Funções de Metas ---
  async getGoals(userId: string): Promise<UserGoal[]> {
    const { data, error } = await supabase
      .from('user_goals')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
      
    if (error) {
      console.error('Erro ao buscar metas:', error);
      throw error;
    }
    return data;
  },

  async addGoal(goal: TablesInsert<'user_goals'>): Promise<UserGoal> {
    const { data, error } = await supabase
      .from('user_goals')
      .insert(goal)
      .select()
      .single();

    if (error) {
      console.error('Erro ao adicionar meta:', error);
      throw error;
    }
    return data;
  },
  
  // Você pode adicionar funções para `body_measurements` e `progress_photos` aqui, seguindo o mesmo padrão.
};