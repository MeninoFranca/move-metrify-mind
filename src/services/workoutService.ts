// src/services/workoutService.ts
import { supabase } from '@/integrations/supabase/client';
import { Exercise, WorkoutPlan } from '@/types/workout';
import { TablesInsert } from '@/integrations/supabase/types';

export const workoutService = {
  async getExercises(): Promise<Exercise[]> {
    const { data, error } = await supabase.from('exercises').select('*');
    if (error) {
      console.error('Error fetching exercises:', error);
      return [];
    }
    // É importante garantir que o tipo 'Exercise' em '@/types/workout'
    // seja compatível com a estrutura da tabela 'exercises' do seu banco de dados.
    return data as any as Exercise[];
  },

  async saveWorkout(workout: Omit<TablesInsert<'workouts'>, 'user_id'>, exercises: { exercise_id: string, sets: number, reps: number, order_index: number }[]) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("User not authenticated");

    // Insere o treino
    const { data: workoutData, error: workoutError } = await supabase
      .from('workouts')
      .insert({ ...workout, user_id: user.id })
      .select()
      .single();

    if (workoutError) {
      console.error('Error saving workout:', workoutError);
      throw workoutError;
    }

    // Insere os exercícios do treino
    const workoutExercises = exercises.map(e => ({
      workout_id: workoutData.id,
      exercise_id: e.exercise_id,
      sets: e.sets,
      reps: e.reps,
      order_index: e.order_index,
    }));

    const { error: exercisesError } = await supabase
      .from('workout_exercises')
      .insert(workoutExercises);

    if (exercisesError) {
      console.error('Error saving workout exercises:', exercisesError);
      // Aqui você poderia adicionar uma lógica para deletar o workout que foi criado
      // para manter a consistência dos dados.
      throw exercisesError;
    }

    return workoutData;
  }
};