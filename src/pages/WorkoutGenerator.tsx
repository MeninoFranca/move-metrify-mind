import React, { useState } from 'react';
import { useWorkout } from '@/contexts/WorkoutContext';
import { WorkoutPreferences, WorkoutType, Equipment, MuscleGroup, DifficultyLevel } from '@/types/workout';
import DashboardLayout from '@/components/layout/DashboardLayout';
import WorkoutDisplay from '@/components/workout/WorkoutDisplay';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Dumbbell, Clock, Target, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const WorkoutGenerator = () => {
  const { generateWorkout, saveCurrentWorkout, currentGeneratedWorkout, isLoading } = useWorkout();
  const navigate = useNavigate();
  const [preferences, setPreferences] = useState<WorkoutPreferences>({
    preferredTypes: ['strength'],
    availableEquipment: ['bodyweight', 'none'],
    timePerWorkout: 45,
    fitnessLevel: 'beginner',
    targetMuscleGroups: [],
  });

  const workoutTypes: { value: WorkoutType; label: string }[] = [
    { value: 'strength', label: 'Força' },
    { value: 'cardio', label: 'Cardio' },
    { value: 'hiit', label: 'HIIT' },
    { value: 'flexibility', label: 'Flexibilidade' },
  ];

  const equipmentOptions: { value: Equipment; label: string }[] = [
    { value: 'none', label: 'Nenhum' },
    { value: 'bodyweight', label: 'Peso Corporal' },
    { value: 'dumbbells', label: 'Halteres' },
    { value: 'resistance_bands', label: 'Faixas Elásticas' },
    { value: 'full_gym', label: 'Academia' },
  ];

  const muscleGroups: { value: MuscleGroup; label: string }[] = [
    { value: 'chest', label: 'Peito' },
    { value: 'back', label: 'Costas' },
    { value: 'legs', label: 'Pernas' },
    { value: 'shoulders', label: 'Ombros' },
    { value: 'arms', label: 'Braços' },
    { value: 'core', label: 'Core' },
    { value: 'full_body', label: 'Corpo Inteiro' },
  ];

  const difficultyLevels: { value: DifficultyLevel; label: string }[] = [
    { value: 'beginner', label: 'Iniciante' },
    { value: 'intermediate', label: 'Intermediário' },
    { value: 'advanced', label: 'Avançado' },
  ];

  const handleGenerateWorkout = () => {
    generateWorkout(preferences);
  };
  
  const handleSaveAndStart = async () => {
      await saveCurrentWorkout();
      // Navega para uma página de "meus treinos" após salvar
      navigate('/workouts'); 
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {currentGeneratedWorkout ? (
          <div>
            <WorkoutDisplay
              workout={currentGeneratedWorkout}
            />
            <div className="mt-6 flex justify-center gap-4">
                <Button size="lg" onClick={handleSaveAndStart} disabled={isLoading}>
                    {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                    Salvar Treino
                </Button>
                <Button size="lg" variant="outline" onClick={handleGenerateWorkout} disabled={isLoading}>
                    Gerar Outro
                </Button>
            </div>
          </div>
        ) : (
          <>
            <h1 className="text-3xl font-bold">Gerador de Treinos</h1>
            
            <div className="grid gap-6 md:grid-cols-2">
              {/* Tipo de Treino */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Dumbbell className="h-5 w-5" />
                    Tipo de Treino
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {workoutTypes.map((type) => (
                    <div key={type.value} className="flex items-center space-x-2">
                      <Checkbox
                        id={type.value}
                        checked={preferences.preferredTypes.includes(type.value)}
                        onCheckedChange={(checked) => {
                          setPreferences(prev => ({
                            ...prev,
                            preferredTypes: checked
                              ? [...prev.preferredTypes, type.value]
                              : prev.preferredTypes.filter(t => t !== type.value),
                          }));
                        }}
                      />
                      <Label htmlFor={type.value}>{type.label}</Label>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Equipamento Disponível */}
              <Card>
                <CardHeader>
                  <CardTitle>Equipamento Disponível</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {equipmentOptions.map((equipment) => (
                    <div key={equipment.value} className="flex items-center space-x-2">
                      <Checkbox
                        id={equipment.value}
                        checked={preferences.availableEquipment.includes(equipment.value)}
                        onCheckedChange={(checked) => {
                          setPreferences(prev => ({
                            ...prev,
                            availableEquipment: checked
                              ? [...prev.availableEquipment, equipment.value]
                              : prev.availableEquipment.filter(e => e !== equipment.value),
                          }));
                        }}
                      />
                      <Label htmlFor={equipment.value}>{equipment.label}</Label>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Duração do Treino */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Duração do Treino
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <Slider
                      value={[preferences.timePerWorkout]}
                      onValueChange={(value) => {
                        setPreferences(prev => ({
                          ...prev,
                          timePerWorkout: value[0],
                        }));
                      }}
                      min={15}
                      max={120}
                      step={5}
                    />
                    <div className="text-center font-medium">
                      {preferences.timePerWorkout} minutos
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Grupos Musculares */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    Grupos Musculares
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {muscleGroups.map((group) => (
                    <div key={group.value} className="flex items-center space-x-2">
                      <Checkbox
                        id={group.value}
                        checked={preferences.targetMuscleGroups?.includes(group.value)}
                        onCheckedChange={(checked) => {
                          setPreferences(prev => ({
                            ...prev,
                            targetMuscleGroups: checked
                              ? [...(prev.targetMuscleGroups || []), group.value]
                              : prev.targetMuscleGroups?.filter(g => g !== group.value) || [],
                          }));
                        }}
                      />
                      <Label htmlFor={group.value}>{group.label}</Label>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Nível de Dificuldade */}
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>Nível de Dificuldade</CardTitle>
                </CardHeader>
                <CardContent className="flex gap-4">
                  {difficultyLevels.map((level) => (
                    <Button
                      key={level.value}
                      variant={preferences.fitnessLevel === level.value ? 'default' : 'outline'}
                      onClick={() => {
                        setPreferences(prev => ({
                          ...prev,
                          fitnessLevel: level.value,
                        }));
                      }}
                    >
                      {level.label}
                    </Button>
                  ))}
                </CardContent>
              </Card>
            </div>

            <div className="flex justify-center mt-8">
              <Button
                size="lg"
                onClick={handleGenerateWorkout}
                className="w-full max-w-md"
                disabled={isLoading}
              >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Gerar Treino Personalizado
              </Button>
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
};

export default WorkoutGenerator;
