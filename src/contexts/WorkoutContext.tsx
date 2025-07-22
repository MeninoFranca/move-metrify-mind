// src/contexts/WorkoutContext.tsx
import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { WorkoutPlan, WorkoutPreferences, Exercise } from '@/types/workout';
import { workoutService } from '@/services/workoutService';
import { useAuth } from './AuthContext';

interface WorkoutContextType {
  workouts: WorkoutPlan[];
  preferences: WorkoutPreferences | null;
  currentWorkout: WorkoutPlan | null;
  setPreferences: (preferences: WorkoutPreferences) => void;
  generateWorkout: (preferences: WorkoutPreferences) => Promise<WorkoutPlan | null>;
  saveCurrentWorkout: () => Promise<void>;
  setCurrentWorkout: (workout: WorkoutPlan | null) => void;
}

const WorkoutContext = createContext<WorkoutContextType | undefined>(undefined);

export const WorkoutProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [workouts, setWorkouts] = useState<WorkoutPlan[]>([]);
  const [preferences, setPreferences] = useState<WorkoutPreferences | null>(null);
  const [currentWorkout, setCurrentWorkout] = useState<WorkoutPlan | null>(null);
  const [allExercises, setAllExercises] = useState<Exercise[]>([]);

  useEffect(() => {
    // Carrega todos os exercícios do banco de dados quando o componente é montado
    const loadExercises = async () => {
      const exercises = await workoutService.getExercises();
      setAllExercises(exercises);
    };
    loadExercises();
  }, []);

  const generateWorkout = useCallback(async (prefs: WorkoutPreferences): Promise<WorkoutPlan | null> => {
    // Filtra exercícios baseados nas preferências
    const availableExercises = allExercises.filter(exercise => {
        const hasEquipment = exercise.equipment.some(eq => prefs.availableEquipment.includes(eq));
        const matchesDifficulty = exercise.difficulty === prefs.fitnessLevel;
        const matchesMuscleGroup = !prefs.targetMuscleGroups?.length || prefs.targetMuscleGroups.includes(exercise.muscleGroup);
        return hasEquipment && matchesDifficulty && matchesMuscleGroup;
    });

    if (availableExercises.length < 5) {
        // Não há exercícios suficientes para gerar um treino
        return null;
    }

    // Seleciona exercícios aleatoriamente
    const selectedExercises = availableExercises
      .sort(() => Math.random() - 0.5)
      .slice(0, 5)
      .map(exercise => ({
        exercise,
        sets: exercise.sets,
        reps: exercise.reps,
        duration: exercise.duration,
        restTime: exercise.restTime,
      }));

    // Cria um novo plano de treino
    const newWorkout: WorkoutPlan = {
      id: Date.now().toString(), // ID temporário
      name: `Treino ${new Date().toLocaleDateString()}`,
      type: prefs.preferredTypes[0],
      difficulty: prefs.fitnessLevel,
      duration: prefs.timePerWorkout,
      exercises: selectedExercises,
      equipment: prefs.availableEquipment,
      description: 'Treino personalizado baseado nas suas preferências',
      targetMuscleGroups: prefs.targetMuscleGroups || [],
    };

    setCurrentWorkout(newWorkout);
    return newWorkout;
  }, [allExercises]);

  const saveCurrentWorkout = useCallback(async () => {
    if (!currentWorkout || !user) return;

    try {
      const workoutToSave = {
        name: currentWorkout.name,
        workout_type: currentWorkout.type,
        duration_minutes: currentWorkout.duration,
        // ... outros campos da tabela workouts
      };

      const exercisesToSave = currentWorkout.exercises.map((e, index) => ({
        exercise_id: e.exercise.id,
        sets: e.sets || 0,
        reps: e.reps || 0,
        order_index: index,
      }));

      const savedWorkout = await workoutService.saveWorkout(workoutToSave, exercisesToSave);
      // Atualiza a lista de treinos com o que foi salvo
      // setWorkouts(prev => [...prev, savedWorkout]);
    } catch (error) {
      console.error("Failed to save workout", error);
    }
  }, [currentWorkout, user]);

  return (
    <WorkoutContext.Provider
      value={{
        workouts,
        preferences,
        currentWorkout,
        setPreferences,
        generateWorkout,
        saveCurrentWorkout,
        setCurrentWorkout,
      }}
    >
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