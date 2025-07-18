import React from 'react';
import { WorkoutPlan } from '@/types/workout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dumbbell, Clock, Target, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface WorkoutDisplayProps {
  workout: WorkoutPlan;
  onStartWorkout?: () => void;
}

const WorkoutDisplay: React.FC<WorkoutDisplayProps> = ({ workout, onStartWorkout }) => {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">{workout.name}</h2>
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={() => navigate('/workouts/history')}>
            Ver Histórico
          </Button>
          <Button onClick={onStartWorkout}>
            Começar Treino
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Informações do Treino */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Dumbbell className="h-5 w-5" />
              Tipo de Treino
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg">{workout.type === 'strength' ? 'Força' : 
              workout.type === 'cardio' ? 'Cardio' : 
              workout.type === 'hiit' ? 'HIIT' : 'Flexibilidade'}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Duração
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg">{workout.duration} minutos</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Dificuldade
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg">
              {workout.difficulty === 'beginner' ? 'Iniciante' :
               workout.difficulty === 'intermediate' ? 'Intermediário' : 'Avançado'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Lista de Exercícios */}
      <Card>
        <CardHeader>
          <CardTitle>Exercícios</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {workout.exercises.map((exercise, index) => (
              <div
                key={exercise.exercise.id}
                className="flex items-start gap-4 p-4 rounded-lg border"
              >
                <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-full bg-primary/10">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <h3 className="font-medium">{exercise.exercise.name}</h3>
                  <p className="text-sm text-muted-foreground">{exercise.exercise.description}</p>
                  <div className="mt-2 text-sm">
                    {exercise.sets && exercise.reps ? (
                      <p>{exercise.sets} séries x {exercise.reps} repetições</p>
                    ) : exercise.duration ? (
                      <p>{exercise.duration} minutos</p>
                    ) : null}
                    {exercise.restTime && (
                      <p className="text-muted-foreground">
                        Descanso: {exercise.restTime} segundos
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WorkoutDisplay; 