import React, { createContext, useContext, useState, useCallback } from 'react';
import { WorkoutPlan, WorkoutPreferences, Exercise } from '@/types/workout';
import { mockExercises, filterExercises } from '@/data/mockExercises';

interface WorkoutContextType {
  workouts: WorkoutPlan[];
  preferences: WorkoutPreferences | null;
  currentWorkout: WorkoutPlan | null;
  setPreferences: (preferences: WorkoutPreferences) => void;
  generateWorkout: (preferences: WorkoutPreferences) => WorkoutPlan;
  saveWorkout: (workout: WorkoutPlan) => void;
  setCurrentWorkout: (workout: WorkoutPlan | null) => void;
}

const WorkoutContext = createContext<WorkoutContextType | undefined>(undefined);

export const WorkoutProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [workouts, setWorkouts] = useState<WorkoutPlan[]>([]);
  const [preferences, setPreferences] = useState<WorkoutPreferences | null>(null);
  const [currentWorkout, setCurrentWorkout] = useState<WorkoutPlan | null>(null);

  const generateWorkout = useCallback((prefs: WorkoutPreferences): WorkoutPlan => {
    // Filtra exercícios baseados nas preferências
    const availableExercises = filterExercises(
      mockExercises,
      prefs.availableEquipment,
      prefs.fitnessLevel,
      prefs.targetMuscleGroups
    );

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
      id: Date.now().toString(),
      name: `Treino ${workouts.length + 1}`,
      type: prefs.preferredTypes[0],
      difficulty: prefs.fitnessLevel,
      duration: prefs.timePerWorkout,
      exercises: selectedExercises,
      equipment: prefs.availableEquipment,
      description: 'Treino personalizado baseado nas suas preferências',
      targetMuscleGroups: prefs.targetMuscleGroups || [],
    };

    return newWorkout;
  }, [workouts]);

  const saveWorkout = useCallback((workout: WorkoutPlan) => {
    setWorkouts(prev => [...prev, workout]);
    // Salva no localStorage
    const savedWorkouts = JSON.parse(localStorage.getItem('workouts') || '[]');
    localStorage.setItem('workouts', JSON.stringify([...savedWorkouts, workout]));
  }, []);

  return (
    <WorkoutContext.Provider
      value={{
        workouts,
        preferences,
        currentWorkout,
        setPreferences,
        generateWorkout,
        saveWorkout,
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