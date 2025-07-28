// src/services/progressService.ts
import { supabase } from '@/integrations/supabase/client';
import { Tables, TablesInsert } from '@/integrations/supabase/types';

// Tipos para facilitar a manipulação dos dados
export type WeightProgress = Tables<'weight_progress'>;
export type BodyMeasurements = Tables<'body_measurements'>;
export type UserGoal = Tables<'user_goals'>;
export type HydrationRecord = Tables<'hydration_records'>;

export const progressService = {
  // --- Funções de Progresso de Peso ---
  async getWeightProgress(userId: string): Promise<WeightProgress[]> {
    const { data, error } = await supabase
      .from('weight_progress')
      .select('*')
      .eq('user_id', userId)
      .order('recorded_date', { ascending: true });

    if (error) throw error;
    return data;
  },

  async addWeightProgress(progress: TablesInsert<'weight_progress'>): Promise<WeightProgress> {
    const { data, error } = await supabase
      .from('weight_progress')
      .insert(progress)
      .select()
      .single();
      
    if (error) throw error;
    return data;
  },

  // --- Funções de Metas ---
  async getGoals(userId: string): Promise<UserGoal[]> {
    const { data, error } = await supabase
      .from('user_goals')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
      
    if (error) throw error;
    return data;
  },

  async addGoal(goal: TablesInsert<'user_goals'>): Promise<UserGoal> {
    const { data, error } = await supabase
      .from('user_goals')
      .insert(goal)
      .select()
      .single();

    if (error) throw error;
    return data;
  },
  
  // --- NOVAS Funções de Hidratação ---

  /**
   * Busca ou cria o registro de hidratação para o dia atual.
   */
  async getOrCreateHydrationRecord(userId: string, userWeight: number): Promise<HydrationRecord> {
    const today = new Date().toISOString().split('T')[0];
    
    // 1. Tenta buscar o registro de hoje
    const { data: existingRecord, error: fetchError } = await supabase
      .from('hydration_records')
      .select('*')
      .eq('user_id', userId)
      .eq('date', today)
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116 = row not found
        console.error("Erro ao buscar registro de hidratação:", fetchError);
        throw fetchError;
    }

    // 2. Se o registro existe, retorna ele
    if (existingRecord) return existingRecord;

    // 3. Se não existe, cria um novo
    const dailyGoalMl = Math.round(userWeight * 35); // Cálculo da meta: 35ml por kg
    const { data: newRecord, error: insertError } = await supabase
      .from('hydration_records')
      .insert({
          user_id: userId,
          date: today,
          daily_goal_ml: dailyGoalMl,
          consumed_ml: 0
      })
      .select()
      .single();
    
    if (insertError) {
        console.error("Erro ao criar registro de hidratação:", insertError);
        throw insertError;
    }

    return newRecord;
  },

  /**
   * Adiciona uma nova entrada de água e atualiza o total consumido.
   */
  async addHydrationEntry(recordId: string, amountMl: number): Promise<HydrationRecord> {
    // 1. Adiciona a entrada individual
    const { error: entryError } = await supabase
      .from('hydration_entries')
      .insert({ hydration_record_id: recordId, amount_ml: amountMl });

    if(entryError) {
        console.error("Erro ao adicionar entrada de água:", entryError);
        throw entryError;
    }

    // 2. Busca o record atual para somar o valor
    const { data: currentRecord, error: fetchError } = await supabase
      .from('hydration_records')
      .select('consumed_ml')
      .eq('id', recordId)
      .single();

    if (fetchError) {
      console.error("Erro ao buscar registro atual:", fetchError);
      throw fetchError;
    }

    // 3. Atualiza o total consumido
    const newTotal = (currentRecord.consumed_ml || 0) + amountMl;
    const { error: updateError } = await supabase
      .from('hydration_records')
      .update({ consumed_ml: newTotal })
      .eq('id', recordId);

    if (updateError) {
      console.error("Erro ao atualizar total de água:", updateError);
      throw updateError;
    }
    
    // 4. Retorna o registro atualizado
    const { data: updatedRecord, error: finalFetchError } = await supabase
      .from('hydration_records')
      .select('*')
      .eq('id', recordId)
      .single();

    if(finalFetchError) throw finalFetchError;
    
    return updatedRecord;
  }
};