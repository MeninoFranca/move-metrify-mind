import { supabase } from '@/integrations/supabase/client';
import { Tables, TablesInsert } from '@/integrations/supabase/types';

export type HydrationRecord = Tables<'hydration_records'>;
export type HydrationEntry = Tables<'hydration_entries'>;

export interface HydrationStats {
  consumed: number;
  goal: number;
  percentage: number;
  entries: HydrationEntry[];
}

export const hydrationService = {
  // Calcular meta diária de hidratação (35ml por kg de peso)
  calculateDailyGoal(weight: number, hasWorkout = false, climate = 'normal'): number {
    let baseGoal = weight * 35; // 35ml por kg
    
    // Ajustes por atividade
    if (hasWorkout) {
      baseGoal += 500; // +500ml se treinou
    }
    
    // Ajustes por clima
    if (climate === 'hot') {
      baseGoal += 300; // +300ml em clima quente
    }
    
    return Math.round(baseGoal);
  },

  // Buscar ou criar registro de hidratação do dia
  async getOrCreateDayRecord(userId: string, weight: number, date?: string): Promise<HydrationRecord> {
    const today = date || new Date().toISOString().split('T')[0];
    
    // Tentar buscar registro existente
    const { data: existing, error: fetchError } = await supabase
      .from('hydration_records')
      .select('*')
      .eq('user_id', userId)
      .eq('date', today)
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') {
      throw fetchError;
    }

    if (existing) {
      return existing;
    }

    // Criar novo registro
    const dailyGoal = this.calculateDailyGoal(weight);
    const { data: newRecord, error: insertError } = await supabase
      .from('hydration_records')
      .insert({
        user_id: userId,
        date: today,
        daily_goal_ml: dailyGoal,
        consumed_ml: 0,
      })
      .select()
      .single();

    if (insertError) throw insertError;
    return newRecord;
  },

  // Adicionar entrada de água
  async addWaterEntry(recordId: string, amountMl: number): Promise<HydrationRecord> {
    // Adicionar entrada
    const { error: entryError } = await supabase
      .from('hydration_entries')
      .insert({
        hydration_record_id: recordId,
        amount_ml: amountMl,
      });

    if (entryError) throw entryError;

    // Atualizar total consumido
    const { data: currentRecord } = await supabase
      .from('hydration_records')
      .select('consumed_ml')
      .eq('id', recordId)
      .single();

    const newTotal = (currentRecord?.consumed_ml || 0) + amountMl;
    
    const { data: updatedRecord, error: updateError } = await supabase
      .from('hydration_records')
      .update({ consumed_ml: newTotal })
      .eq('id', recordId)
      .select()
      .single();

    if (updateError) throw updateError;
    return updatedRecord;
  },

  // Buscar estatísticas de hidratação do dia
  async getDayStats(userId: string, date?: string): Promise<HydrationStats> {
    const today = date || new Date().toISOString().split('T')[0];
    
    const { data: record } = await supabase
      .from('hydration_records')
      .select('*')
      .eq('user_id', userId)
      .eq('date', today)
      .single();

    const { data: entries } = await supabase
      .from('hydration_entries')
      .select('*')
      .eq('hydration_record_id', record?.id || '')
      .order('recorded_at', { ascending: false });

    const consumed = record?.consumed_ml || 0;
    const goal = record?.daily_goal_ml || 2000;
    const percentage = goal > 0 ? (consumed / goal) * 100 : 0;

    return {
      consumed,
      goal,
      percentage: Math.min(percentage, 100),
      entries: entries || [],
    };
  },

  // Buscar histórico semanal
  async getWeeklyHistory(userId: string): Promise<{ date: string; consumed: number; goal: number }[]> {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - 6);

    const { data, error } = await supabase
      .from('hydration_records')
      .select('date, consumed_ml, daily_goal_ml')
      .eq('user_id', userId)
      .gte('date', startDate.toISOString().split('T')[0])
      .lte('date', endDate.toISOString().split('T')[0])
      .order('date');

    if (error) throw error;

    return data.map(record => ({
      date: record.date,
      consumed: record.consumed_ml,
      goal: record.daily_goal_ml,
    }));
  },

  // Configurar lembretes
  async updateReminderSettings(recordId: string, intervalMinutes: number, silentStart?: string, silentEnd?: string): Promise<void> {
    const updates: any = { reminder_interval_minutes: intervalMinutes };
    
    if (silentStart) updates.silent_hours_start = silentStart;
    if (silentEnd) updates.silent_hours_end = silentEnd;

    const { error } = await supabase
      .from('hydration_records')
      .update(updates)
      .eq('id', recordId);

    if (error) throw error;
  },

  // Sugestões de quantidade por tipo de bebida
  getAmountSuggestions(): { label: string; amount: number; icon: string }[] {
    return [
      { label: 'Copo (200ml)', amount: 200, icon: '🥛' },
      { label: 'Garrafa Pequena (330ml)', amount: 330, icon: '🍼' },
      { label: 'Garrafa Grande (500ml)', amount: 500, icon: '🚰' },
      { label: 'Garrafa 1L', amount: 1000, icon: '🍶' },
    ];
  },

  // Verificar se deve mostrar lembrete
  shouldShowReminder(lastEntry: Date | null, intervalMinutes: number, silentStart?: string, silentEnd?: string): boolean {
    const now = new Date();
    
    // Verificar horário silencioso
    if (silentStart && silentEnd) {
      const currentTime = now.toTimeString().slice(0, 5);
      if (currentTime >= silentStart && currentTime <= silentEnd) {
        return false;
      }
    }
    
    // Verificar intervalo
    if (!lastEntry) return true;
    
    const timeDiff = (now.getTime() - lastEntry.getTime()) / (1000 * 60);
    return timeDiff >= intervalMinutes;
  }
};