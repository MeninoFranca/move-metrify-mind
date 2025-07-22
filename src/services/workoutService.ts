// src/services/workoutService.ts
import { supabase } from '@/integrations/supabase/client';
import { Tables, TablesInsert, Enums } from '@/integrations/supabase/types';

// Tipos para facilitar
export type Workout = Tables<'workouts'>;
export type Exercise = Tables<'exercises'>;
export type WorkoutWithExercises = Workout & {
  workout_exercises: Array<{
    sets: number;
    reps: number;
    exercises: Exercise;
  }>;
};

export const workoutService = {
  /**
   * Busca todos os exercícios da biblioteca pública.
   */
  async getExerciseLibrary(): Promise<Exercise[]> {
    const { data, error } = await supabase.from('exercises').select('*');
    if (error) {
      console.error('Erro ao buscar biblioteca de exercícios:', error);
      throw error;
    }
    return data;
  },

  /**
   * Busca os treinos de um usuário específico.
   */
  async getUserWorkouts(userId: string): Promise<WorkoutWithExercises[]> {
    const { data, error } = await supabase
      .from('workouts')
      .select(`
        *,
        workout_exercises (
          sets,
          reps,
          exercises (*)
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Erro ao buscar treinos do usuário:', error);
      throw error;
    }
    return data as any;
  },

  /**
   * Salva um novo treino e seus exercícios associados.
   */
  async saveWorkout(
    workout: Omit<TablesInsert<'workouts'>, 'user_id' | 'id'>, 
    exercises: Array<Omit<TablesInsert<'workout_exercises'>, 'workout_id'>>
  ): Promise<Workout> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Usuário não autenticado");

    // 1. Insere o treino principal
    const { data: workoutData, error: workoutError } = await supabase
      .from('workouts')
      .insert({ ...workout, user_id: user.id })
      .select()
      .single();

    if (workoutError) {
      console.error('Erro ao salvar o treino:', workoutError);
      throw workoutError;
    }

    // 2. Associa os exercícios ao treino recém-criado
    const workoutExercisesToInsert = exercises.map(e => ({
      ...e,
      workout_id: workoutData.id,
    }));

    const { error: exercisesError } = await supabase
      .from('workout_exercises')
      .insert(workoutExercisesToInsert);

    if (exercisesError) {
      console.error('Erro ao salvar os exercícios do treino:', exercisesError);
      // Idealmente, aqui você deletaria o 'workout' criado para evitar dados órfãos
      throw exercisesError;
    }

    return workoutData;
  }
};