// src/contexts/WorkoutContext.tsx
import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { WorkoutPreferences, WorkoutPlan, Exercise as AppExercise } from '@/types/workout'; // Tipos da sua App
import { workoutService, Exercise as DbExercise, WorkoutWithExercises } from '@/services/workoutService';
import { useAuth } from './AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { TablesInsert } from '@/integrations/supabase/types';

interface WorkoutContextType {
  userWorkouts: WorkoutWithExercises[];
  currentGeneratedWorkout: WorkoutPlan | null;
  isLoading: boolean;
  generateWorkout: (prefs: WorkoutPreferences) => Promise<void>;
  saveCurrentWorkout: () => Promise<void>;
  setCurrentGeneratedWorkout: (workout: WorkoutPlan | null) => void;
}

const WorkoutContext = createContext<WorkoutContextType | undefined>(undefined);

export const WorkoutProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const { toast } = useToast();

  const [userWorkouts, setUserWorkouts] = useState<WorkoutWithExercises[]>([]);
  const [currentGeneratedWorkout, setCurrentGeneratedWorkout] = useState<WorkoutPlan | null>(null);
  const [exerciseLibrary, setExerciseLibrary] = useState<DbExercise[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Função para buscar todos os dados necessários
  const fetchData = useCallback(async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      const [library, workouts] = await Promise.all([
        workoutService.getExerciseLibrary(),
        workoutService.getUserWorkouts(user.id),
      ]);
      setExerciseLibrary(library);
      setUserWorkouts(workouts);
    } catch (error) {
      toast({ variant: "destructive", title: "Erro ao carregar dados de treino." });
    } finally {
      setIsLoading(false);
    }
  }, [user, toast]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const generateWorkout = useCallback(async (prefs: WorkoutPreferences) => {
    setIsLoading(true);
    
    const availableExercises = exerciseLibrary.filter(exercise => {
        const hasEquipment = exercise.equipment_required?.some(eq => prefs.availableEquipment.includes(eq as any));
        const matchesDifficulty = exercise.difficulty_level === prefs.fitnessLevel;
        const matchesMuscleGroup = !prefs.targetMuscleGroups?.length || prefs.targetMuscleGroups.some(mg => exercise.muscle_groups?.includes(mg));
        return hasEquipment && matchesDifficulty && matchesMuscleGroup;
    });

    if (availableExercises.length < 5) {
        toast({ variant: 'destructive', title: 'Não foi possível gerar um treino', description: 'Não há exercícios suficientes com as suas preferências.' });
        setIsLoading(false);
        return;
    }

    const selectedExercises = availableExercises.sort(() => 0.5 - Math.random()).slice(0, 5);

    const newWorkout: WorkoutPlan = {
      id: `temp-${Date.now()}`,
      name: `Treino - ${new Date().toLocaleDateString('pt-BR')}`,
      type: prefs.preferredTypes[0],
      difficulty: prefs.fitnessLevel,
      duration: prefs.timePerWorkout,
      equipment: prefs.availableEquipment,
      description: 'Treino personalizado gerado pela IA.',
      targetMuscleGroups: prefs.targetMuscleGroups || [],
      exercises: selectedExercises.map(e => ({
        exercise: e as any as AppExercise, // Adaptação de tipo
        sets: 4, // Lógica de definição de sets/reps pode ser adicionada aqui
        reps: 12,
        restTime: 60
      })),
    };

    setCurrentGeneratedWorkout(newWorkout);
    setIsLoading(false);
  }, [exerciseLibrary, toast]);

  const saveCurrentWorkout = useCallback(async () => {
    if (!currentGeneratedWorkout || !user) return;

    try {
      const workoutToSave: Omit<TablesInsert<'workouts'>, 'user_id' | 'id'> = {
        name: currentGeneratedWorkout.name,
        workout_type: currentGeneratedWorkout.type,
        duration_minutes: currentGeneratedWorkout.duration,
        equipment_used: currentGeneratedWorkout.equipment as any[],
        generated_automatically: true,
      };

      const exercisesToSave = currentGeneratedWorkout.exercises.map((e, index) => ({
        exercise_id: e.exercise.id,
        sets: e.sets,
        reps: e.reps,
        order_index: index,
        rest_seconds: e.restTime,
      }));

      await workoutService.saveWorkout(workoutToSave, exercisesToSave);
      toast({ title: "Treino salvo com sucesso!" });

      // Limpa o treino gerado e atualiza a lista de treinos do usuário
      setCurrentGeneratedWorkout(null);
      fetchData();

    } catch (error) {
      toast({ variant: 'destructive', title: 'Erro ao salvar o treino.' });
    }
  }, [currentGeneratedWorkout, user, toast, fetchData]);


  return (
    <WorkoutContext.Provider value={{
      userWorkouts,
      currentGeneratedWorkout,
      isLoading,
      generateWorkout,
      saveCurrentWorkout,
      setCurrentGeneratedWorkout,
    }}>
      {children}
    </WorkoutContext.Provider>
  );
};

export const useWorkout = () => {
  const context = useContext(WorkoutContext);
  if (context === undefined) {
    throw new Error('useWorkout must be used within a WorkoutProvider');
  }
  return context;
};