import React, { useState } from 'react';
import ModernLayout from '@/components/layout/ModernLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { Dumbbell, Play, Target, Search, Star, BarChart3, ChevronLeft, ChevronRight, XCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import { Progress } from '@/components/ui/progress';

// --- INTERFACES PARA O PLANO DE TREINO DA IA ---
interface Exercicio {
  exercicio: string;
  series: number;
  repeticoes: number | string;
  descanso: string;
  instrucoes: string;
}

interface WorkoutPlan {
  nome: string;
  duracao: number;
  aquecimento: string[];
  exercicios: Exercicio[];
  alongamento: string[];
  dicas: string[];
}

// --- DADOS CONSTANTES PARA OS FORMULÁRIOS ---
const workoutTypes = [
  { value: 'Força', label: 'Força', icon: '💪' },
  { value: 'Cardio', label: 'Cardio', icon: '❤️' },
  { value: 'HIIT', label: 'HIIT', icon: '⚡' },
  { value: 'Flexibilidade', label: 'Flexibilidade', icon: '🧘' },
];

const equipmentOptions = [
  'Nenhum',
  'Peso Corporal', 
  'Halteres',
  'Faixas Elásticas',
  'Academia'
];

const muscleGroups = [
  'Peito',
  'Costas', 
  'Pernas',
  'Ombros',
  'Braços',
  'Core',
  'Corpo Inteiro'
];

const difficultyLevels = [
  { value: 'Iniciante', label: 'Iniciante' },
  { value: 'Intermediário', label: 'Intermediário' },
  { value: 'Avançado', label: 'Avançado' },
];


// --- COMPONENTE DO PLAYER DE TREINO (Adicionado dentro do mesmo arquivo) ---
const WorkoutPlayer = ({ workout, onFinish }: { workout: WorkoutPlan, onFinish: () => void }) => {
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const exercises = workout.exercicios;
  const currentExercise = exercises[currentExerciseIndex];

  const handleNext = () => {
    if (currentExerciseIndex < exercises.length - 1) {
      setCurrentExerciseIndex(prev => prev + 1);
    } else {
      toast({ title: "Treino Concluído!", description: "Parabéns por finalizar seu treino de hoje." });
      onFinish();
    }
  };

  const handlePrevious = () => {
    if (currentExerciseIndex > 0) {
      setCurrentExerciseIndex(prev => prev - 1);
    }
  };

  return (
    <Card className="bg-gradient-to-br from-background to-secondary/30 flex-grow flex flex-col">
        <CardHeader>
            <div className="flex justify-between items-center">
                <CardTitle className="text-xl">{workout.nome}</CardTitle>
                <Button variant="ghost" size="icon" onClick={onFinish}>
                    <XCircle className="h-5 w-5" />
                </Button>
            </div>
            <p className="text-muted-foreground">Exercício {currentExerciseIndex + 1} de {exercises.length}</p>
            <Progress value={((currentExerciseIndex + 1) / exercises.length) * 100} className="mt-2" />
        </CardHeader>
        <CardContent className="text-center space-y-6 flex-grow flex flex-col justify-between">
            <div>
                <div className="p-6 rounded-lg">
                    <p className="text-sm text-primary font-semibold">FOCO DO EXERCÍCIO</p>
                    <h2 className="text-3xl font-bold mt-1 mb-4">{currentExercise.exercicio}</h2>
                    
                    <div className="grid grid-cols-2 gap-4 text-center">
                        <div>
                            <p className="text-sm text-muted-foreground">Séries</p>
                            <p className="text-2xl font-bold">{currentExercise.series}</p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Repetições</p>
                            <p className="text-2xl font-bold">{currentExercise.repeticoes}</p>
                        </div>
                    </div>
                </div>
              
                <div className="text-left text-sm bg-background/50 p-4 rounded-md">
                    <strong>Instruções:</strong> {currentExercise.instrucoes}
                </div>

                <div className="text-center mt-4">
                    <p className="text-sm text-muted-foreground">Descanso recomendado</p>
                    <p className="text-lg font-semibold">⏱️ {currentExercise.descanso}</p>
                </div>
            </div>
            
            <div className="flex justify-between items-center pt-4">
                <Button variant="outline" onClick={handlePrevious} disabled={currentExerciseIndex === 0}>
                    <ChevronLeft className="mr-2 h-4 w-4" />
                    Anterior
                </Button>
                <Button onClick={handleNext} size="lg">
                    {currentExerciseIndex === exercises.length - 1 ? 'Finalizar Treino' : 'Próximo'}
                    <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
            </div>
        </CardContent>
    </Card>
  )
}


// --- COMPONENTE PRINCIPAL WORKOUTS ---
export default function Workouts() {
  const { profile } = useAuth();
  const [activeTab, setActiveTab] = useState<'generate' | 'library'>('generate');
  const [duration, setDuration] = useState([45]);
  const [selectedWorkoutType, setSelectedWorkoutType] = useState('');
  const [selectedEquipment, setSelectedEquipment] = useState<string[]>([]);
  const [selectedMuscleGroups, setSelectedMuscleGroups] = useState<string[]>([]);
  const [selectedDifficulty, setSelectedDifficulty] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [iaResponse, setIaResponse] = useState<WorkoutPlan | string | null>(null);
  const [isWorkoutActive, setIsWorkoutActive] = useState(false);

  const handleEquipmentChange = (equipment: string, checked: boolean) => {
    if (checked) {
      setSelectedEquipment(prev => [...prev, equipment]);
    } else {
      setSelectedEquipment(prev => prev.filter(item => item !== equipment));
    }
  };

  const handleMuscleGroupChange = (muscleGroup: string, checked: boolean) => {
    if (checked) {
      setSelectedMuscleGroups(prev => [...prev, muscleGroup]);
    } else {
      setSelectedMuscleGroups(prev => prev.filter(item => item !== muscleGroup));
    }
  };

  const generateWorkout = async () => {
    setIsGenerating(true);
    setIaResponse(null);
    setIsWorkoutActive(false);

    const payload = {
      tipo_treino: selectedWorkoutType,
      duracao: duration[0],
      equipamentos: selectedEquipment,
      grupos_musculares: selectedMuscleGroups,
      nivel_dificuldade: selectedDifficulty
    };

    try {
      const res = await fetch('https://eo79vrb7n8f87mj.m.pipedream.net', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      if (!res.ok) throw new Error('Erro ao enviar para o webhook');
      
      const data = await res.json();
      
      let workoutData: WorkoutPlan | string;

      if (typeof data === 'object' && data.nome && data.exercicios) {
        workoutData = data;
      } 
      else if (typeof data.message === 'string') {
        try {
          workoutData = JSON.parse(data.message);
        } catch {
          workoutData = data.message.replace(/[#*]/g, '');
        }
      }
      else if (typeof data.message === 'object' && data.message.nome) {
          workoutData = data.message;
      }
      else {
        workoutData = 'A IA retornou uma resposta em um formato inesperado.';
      }

      setIaResponse(workoutData);
      
      toast({
        title: 'Treino Gerado!',
        description: 'Seu plano de treino personalizado está pronto.',
      });
    } catch (error) {
      setIaResponse('Não foi possível obter resposta da IA.');
      toast({
        title: 'Erro',
        description: 'Não foi possível conectar com o agente de IA.',
        variant: 'destructive',
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleStartWorkout = () => {
    if (typeof iaResponse === 'object' && iaResponse !== null) {
        setIsWorkoutActive(true);
    } else {
        toast({
            title: "Erro",
            description: "Não há um treino válido para iniciar.",
            variant: "destructive",
        });
    }
  };

  return (
    <ModernLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Dumbbell className="h-8 w-8 text-primary" />
            Treinos
          </h1>
          <div className="flex gap-2">
            <Button
              variant={activeTab === 'generate' ? 'default' : 'outline'}
              onClick={() => setActiveTab('generate')}
            >
              <Target className="mr-2 h-4 w-4" />
              Gerar Treino
            </Button>
            <Button
              variant={activeTab === 'library' ? 'default' : 'outline'}
              onClick={() => setActiveTab('library')}
            >
              <Search className="mr-2 h-4 w-4" />
              Biblioteca
            </Button>
          </div>
        </div>

        {activeTab === 'generate' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Personalizar Treino</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <label className="text-sm font-medium">Tipo de Treino</label>
                  <div className="grid grid-cols-2 gap-2">
                    {workoutTypes.map((type) => (
                      <div key={type.value} className="flex items-center space-x-2">
                        <Checkbox id={type.value} checked={selectedWorkoutType === type.value} onCheckedChange={(checked) => setSelectedWorkoutType(checked ? type.value : '')} />
                        <label htmlFor={type.value} className="text-sm flex items-center gap-2 cursor-pointer"><span>{type.icon}</span>{type.label}</label>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="text-sm font-medium">Duração: {duration[0]} minutos</label>
                  <Slider value={duration} onValueChange={setDuration} min={15} max={90} step={5} className="w-full" />
                  <div className="flex justify-between text-xs text-muted-foreground"><span>15min</span><span>90min</span></div>
                </div>
                <div className="space-y-3">
                  <label className="text-sm font-medium">Equipamentos Disponíveis</label>
                  <div className="grid grid-cols-2 gap-2">
                    {equipmentOptions.map((equipment) => (
                      <div key={equipment} className="flex items-center space-x-2">
                        <Checkbox id={equipment} checked={selectedEquipment.includes(equipment)} onCheckedChange={(checked) => handleEquipmentChange(equipment, checked as boolean)} />
                        <label htmlFor={equipment} className="text-sm cursor-pointer">{equipment}</label>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="text-sm font-medium">Grupos Musculares</label>
                  <div className="grid grid-cols-2 gap-2">
                    {muscleGroups.map((group) => (
                      <div key={group} className="flex items-center space-x-2">
                        <Checkbox id={group} checked={selectedMuscleGroups.includes(group)} onCheckedChange={(checked) => handleMuscleGroupChange(group, checked as boolean)} />
                        <label htmlFor={group} className="text-sm cursor-pointer">{group}</label>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="text-sm font-medium">Nível de Dificuldade</label>
                  <div className="grid grid-cols-1 gap-2">
                    {difficultyLevels.map((level) => (
                      <div key={level.value} className="flex items-center space-x-2">
                        <Checkbox id={level.value} checked={selectedDifficulty === level.value} onCheckedChange={(checked) => setSelectedDifficulty(checked ? level.value : '')} />
                        <label htmlFor={level.value} className="text-sm cursor-pointer">{level.label}</label>
                      </div>
                    ))}
                  </div>
                </div>
                <Button onClick={generateWorkout} disabled={isGenerating} className="w-full" size="lg">
                  {isGenerating ? (<div className="flex items-center gap-2"><div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full" />Gerando Treino...</div>) : (<><Target className="mr-2 h-4 w-4" />Gerar Treino Personalizado</>)}
                </Button>
              </CardContent>
            </Card>

            <div className="flex flex-col">
              {isGenerating ? (
                <Card className="flex-grow flex items-center justify-center">
                  <div className="text-center space-y-3"><div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto" /><p className="text-muted-foreground">Aguarde, a IA está preparando seu treino...</p></div>
                </Card>
              ) : isWorkoutActive && typeof iaResponse === 'object' ? (
                <WorkoutPlayer workout={iaResponse} onFinish={() => setIsWorkoutActive(false)} />
              ) : iaResponse ? (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-xl"><Target className="h-6 w-6 text-primary" />{typeof iaResponse === 'object' ? (iaResponse.nome || 'Treino Personalizado') : 'Treino Personalizado'}</CardTitle>
                    {typeof iaResponse === 'object' && iaResponse.duracao && (<div className="flex items-center gap-2 text-sm text-muted-foreground"><span>⏱️ {iaResponse.duracao} minutos</span></div>)}
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {typeof iaResponse === 'string' ? (<div className="whitespace-pre-line text-sm">{iaResponse}</div>) : (
                      <>
                        {iaResponse.aquecimento?.length > 0 && (<div className="space-y-3"><h3 className="font-semibold flex items-center gap-2 text-md">🔥 Aquecimento</h3><ul className="space-y-2">{iaResponse.aquecimento.map((item, index) => (<li key={index} className="text-sm bg-secondary/50 p-3 rounded-md">{item}</li>))}</ul></div>)}
                        {iaResponse.exercicios?.length > 0 && (<div className="space-y-3"><h3 className="font-semibold flex items-center gap-2 text-md">💪 Exercícios</h3><div className="space-y-4">{iaResponse.exercicios.map((ex, index) => (<div key={index} className="border rounded-lg p-4 space-y-3"><div className="flex justify-between items-start"><h4 className="font-medium">{ex.exercicio}</h4><Badge variant="outline">{ex.series} séries × {ex.repeticoes} reps</Badge></div><div className="text-sm text-muted-foreground"><span>⏱️ Descanso: {ex.descanso}</span></div><div className="text-sm bg-secondary/30 p-3 rounded"><strong>Instruções:</strong> {ex.instrucoes}</div></div>))}</div></div>)}
                        {iaResponse.alongamento?.length > 0 && (<div className="space-y-3"><h3 className="font-semibold flex items-center gap-2 text-md">🧘 Alongamento</h3><ul className="space-y-2">{iaResponse.alongamento.map((item, index) => (<li key={index} className="text-sm bg-secondary/50 p-3 rounded-md">{item}</li>))}</ul></div>)}
                        {iaResponse.dicas?.length > 0 && (<div className="space-y-3"><h3 className="font-semibold flex items-center gap-2 text-md">💡 Dicas Importantes</h3><ul className="space-y-2">{iaResponse.dicas.map((dica, index) => (<li key={index} className="text-sm bg-amber-50 dark:bg-amber-950/20 p-3 rounded-md border-l-4 border-amber-500">{dica}</li>))}</ul></div>)}
                        <Button onClick={handleStartWorkout} className="w-full mt-6" size="lg"><Play className="mr-2 h-4 w-4" />Iniciar Treino</Button>
                      </>
                    )}
                  </CardContent>
                </Card>
              ) : (
                <Card className="flex-grow flex items-center justify-center bg-secondary/20 border-dashed">
                  <div className="text-center text-muted-foreground"><p>Seu treino personalizado por IA aparecerá aqui.</p></div>
                </Card>
              )}
            </div>
          </div>
        )}

        {activeTab === 'library' && (
          <div className="text-center text-muted-foreground p-8">
            <p>(A biblioteca de treinos será implementada aqui)</p>
          </div>
        )}
      </div>
    </ModernLayout>
  );
}
