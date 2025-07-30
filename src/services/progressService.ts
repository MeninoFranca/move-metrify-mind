import { supabase } from '@/integrations/supabase/client';
import { Tables, TablesInsert } from '@/integrations/supabase/types';

export type WeightProgress = Tables<'weight_progress'>;
export type BodyMeasurements = Tables<'body_measurements'>;
export type ProgressPhoto = Tables<'progress_photos'>;
export type Achievement = Tables<'achievements'>;
export type UserAchievement = Tables<'user_achievements'>;
export type UserGoal = Tables<'user_goals'>;
export type HydrationRecord = Tables<'hydration_records'>;

export interface ProgressStats {
  currentWeight?: number;
  weightChange?: number;
  totalWorkouts: number;
  totalAchievements: number;
  streakDays: number;
  averageWeight?: number;
}

export interface WeightTrend {
  date: string;
  weight: number;
}

export interface MeasurementComparison {
  current: BodyMeasurements | null;
  previous: BodyMeasurements | null;
  changes: {
    waist?: number;
    hip?: number;
    chest?: number;
    arm?: number;
    thigh?: number;
  };
}

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

  // Adicionar registro de peso
  async addWeightEntry(userId: string, weight: number, date?: string): Promise<WeightProgress> {
    const recordDate = date || new Date().toISOString().split('T')[0];
    
    const { data, error } = await supabase
      .from('weight_progress')
      .upsert({
        user_id: userId,
        weight_kg: weight,
        recorded_date: recordDate,
      }, {
        onConflict: 'user_id,recorded_date'
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Buscar histórico de peso
  async getWeightHistory(userId: string, days = 90): Promise<WeightTrend[]> {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const { data, error } = await supabase
      .from('weight_progress')
      .select('recorded_date, weight_kg')
      .eq('user_id', userId)
      .gte('recorded_date', startDate.toISOString().split('T')[0])
      .order('recorded_date');

    if (error) throw error;

    return data.map(record => ({
      date: record.recorded_date,
      weight: record.weight_kg,
    }));
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

  // Adicionar medidas corporais
  async addBodyMeasurements(userId: string, measurements: Partial<TablesInsert<'body_measurements'>>, date?: string): Promise<BodyMeasurements> {
    const recordDate = date || new Date().toISOString().split('T')[0];
    
    const { data, error } = await supabase
      .from('body_measurements')
      .upsert({
        user_id: userId,
        recorded_date: recordDate,
        ...measurements,
      }, {
        onConflict: 'user_id,recorded_date'
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Comparar medidas corporais
  async getMeasurementComparison(userId: string): Promise<MeasurementComparison> {
    const { data, error } = await supabase
      .from('body_measurements')
      .select('*')
      .eq('user_id', userId)
      .order('recorded_date', { ascending: false })
      .limit(2);

    if (error) throw error;

    const current = data[0] || null;
    const previous = data[1] || null;
    
    const changes: any = {};
    if (current && previous) {
      const fields = ['waist_cm', 'hip_cm', 'chest_cm', 'arm_cm', 'thigh_cm'];
      fields.forEach(field => {
        const currentVal = current[field];
        const previousVal = previous[field];
        if (currentVal && previousVal) {
          changes[field.replace('_cm', '')] = currentVal - previousVal;
        }
      });
    }

    return { current, previous, changes };
  },

  // Adicionar foto de progresso
  async addProgressPhoto(userId: string, photoUrl: string, photoType: 'front' | 'side' | 'back', notes?: string): Promise<ProgressPhoto> {
    const { data, error } = await supabase
      .from('progress_photos')
      .insert({
        user_id: userId,
        photo_url: photoUrl,
        photo_type: photoType,
        recorded_date: new Date().toISOString().split('T')[0],
        notes,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Buscar fotos de progresso
  async getProgressPhotos(userId: string): Promise<ProgressPhoto[]> {
    const { data, error } = await supabase
      .from('progress_photos')
      .select('*')
      .eq('user_id', userId)
      .order('recorded_date', { ascending: false });

    if (error) throw error;
    return data;
  },

  // Buscar conquistas disponíveis
  async getAvailableAchievements(): Promise<Achievement[]> {
    const { data, error } = await supabase
      .from('achievements')
      .select('*')
      .order('points');

    if (error) throw error;
    return data;
  },

  // Buscar conquistas do usuário
  async getUserAchievements(userId: string): Promise<UserAchievement[]> {
    const { data, error } = await supabase
      .from('user_achievements')
      .select(`
        *,
        achievements (*)
      `)
      .eq('user_id', userId)
      .order('earned_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  // Verificar e conceder conquistas
  async checkAndAwardAchievements(userId: string): Promise<UserAchievement[]> {
    // Buscar estatísticas do usuário
    const stats = await this.getProgressStats(userId);
    const achievements = await this.getAvailableAchievements();
    const userAchievements = await this.getUserAchievements(userId);
    
    const earnedIds = userAchievements.map(ua => ua.achievement_id);
    const newAchievements: UserAchievement[] = [];

    for (const achievement of achievements) {
      if (earnedIds.includes(achievement.id)) continue;

      let shouldAward = false;

      switch (achievement.achievement_type) {
        case 'workout_count':
          if (achievement.name.includes('First') && stats.totalWorkouts >= 1) shouldAward = true;
          if (achievement.name.includes('10') && stats.totalWorkouts >= 10) shouldAward = true;
          if (achievement.name.includes('50') && stats.totalWorkouts >= 50) shouldAward = true;
          break;
        case 'workout_streak':
          if (stats.streakDays >= 7) shouldAward = true;
          break;
        case 'consistency':
          if (stats.streakDays >= 30) shouldAward = true;
          break;
      }

      if (shouldAward) {
        const { data, error } = await supabase
          .from('user_achievements')
          .insert({
            user_id: userId,
            achievement_id: achievement.id,
          })
          .select(`
            *,
            achievements (*)
          `)
          .single();

        if (!error) {
          newAchievements.push(data);
        }
      }
    }

    return newAchievements;
  },

  // Calcular estatísticas de progresso
  async getProgressStats(userId: string): Promise<ProgressStats> {
    // Peso atual e mudança
    const weightHistory = await this.getWeightHistory(userId, 30);
    const currentWeight = weightHistory[weightHistory.length - 1]?.weight;
    const weightChange = weightHistory.length > 1 
      ? currentWeight - weightHistory[0].weight 
      : 0;
    const averageWeight = weightHistory.length > 0
      ? weightHistory.reduce((sum, w) => sum + w.weight, 0) / weightHistory.length
      : undefined;

    // Total de treinos (simulado por enquanto)
    const totalWorkouts = Math.floor(Math.random() * 25) + 5;
    
    // Total de conquistas
    const userAchievements = await this.getUserAchievements(userId);
    const totalAchievements = userAchievements.length;
    
    // Streak de dias (simulado)
    const streakDays = Math.floor(Math.random() * 15) + 1;

    return {
      currentWeight,
      weightChange,
      totalWorkouts,
      totalAchievements,
      streakDays,
      averageWeight,
    };
  },

  // Calcular nível do usuário baseado em XP
  calculateUserLevel(totalXP: number): { level: number; currentXP: number; nextLevelXP: number } {
    const level = Math.floor(totalXP / 1000) + 1;
    const currentXP = totalXP % 1000;
    const nextLevelXP = 1000;
    
    return { level, currentXP, nextLevelXP };
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
  },

  // Gerar relatório de progresso
  async generateProgressReport(userId: string): Promise<{
    weightTrend: WeightTrend[];
    measurements: MeasurementComparison;
    photos: ProgressPhoto[];
    achievements: UserAchievement[];
    stats: ProgressStats;
  }> {
    const [weightTrend, measurements, photos, achievements, stats] = await Promise.all([
      this.getWeightHistory(userId),
      this.getMeasurementComparison(userId),
      this.getProgressPhotos(userId),
      this.getUserAchievements(userId),
      this.getProgressStats(userId),
    ]);

    return {
      weightTrend,
      measurements,
      photos,
      achievements,
      stats,
    };
  }
};