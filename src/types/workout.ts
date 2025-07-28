export type Equipment = 'none' | 'full_gym' | 'dumbbells' | 'bodyweight' | 'resistance_bands';
export type MuscleGroup = 'chest' | 'back' | 'legs' | 'shoulders' | 'arms' | 'core' | 'full_body';
export type WorkoutType = 'strength' | 'cardio' | 'hiit' | 'flexibility';
export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced';

export interface Exercise {
  id: string;
  name: string;
  description: string;
  muscleGroup: MuscleGroup;
  equipment: Equipment[];
  difficulty: DifficultyLevel;
  instructions: string[];
  videoUrl?: string;
  imageUrl?: string;
  duration?: number; // em minutos (para exercícios cardio/HIIT)
  sets?: number;
  reps?: number;
  restTime?: number; // em segundos
}

export interface WorkoutPlan {
  id: string;
  name: string;
  type: WorkoutType;
  difficulty: DifficultyLevel;
  duration: number; // em minutos
  exercises: {
    exercise: Exercise;
    sets?: number;
    reps?: number;
    duration?: number;
    restTime?: number;
  }[];
  equipment: Equipment[];
  description: string;
  targetMuscleGroups: MuscleGroup[];
}

export interface WorkoutPreferences {
  preferredTypes: WorkoutType[];
  availableEquipment: Equipment[];
  timePerWorkout: number;
  fitnessLevel: DifficultyLevel;
  targetMuscleGroups?: MuscleGroup[];
} 