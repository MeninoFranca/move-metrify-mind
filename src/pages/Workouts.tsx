import React, { useState } from 'react';
import ModernLayout from '@/components/layout/ModernLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dumbbell, Play, Clock, Zap, Target, Search, Star, BarChart3, Filter } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

const workoutTypes = [
  { value: 'strength', label: 'Força', icon: '💪', color: 'bg-blue-100 text-blue-800' },
  { value: 'cardio', label: 'Cardio', icon: '❤️', color: 'bg-red-100 text-red-800' },
  { value: 'hiit', label: 'HIIT', icon: '⚡', color: 'bg-orange-100 text-orange-800' },
  { value: 'flexibility', label: 'Flexibilidade', icon: '🧘', color: 'bg-green-100 text-green-800' },
];

const intensityLevels = [
  { value: 1, label: 'Muito Leve', color: 'bg-green-100 text-green-800' },
  { value: 5, label: 'Moderado', color: 'bg-yellow-100 text-yellow-800' },
  { value: 8, label: 'Intenso', color: 'bg-orange-100 text-orange-800' },
  { value: 10, label: 'Máximo', color: 'bg-red-100 text-red-800' },
];

export default function Workouts() {
  const { profile } = useAuth();
  const [activeTab, setActiveTab] = useState<'generate' | 'library'>('generate');
  const [duration, setDuration] = useState([45]);
  const [workoutType, setWorkoutType] = useState('');
  const [intensity, setIntensity] = useState([5]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedWorkout, setGeneratedWorkout] = useState<any>(null);
  const [iaResponse, setIaResponse] = useState<string | null>(null);

  const generateWorkout = async () => {
    setIsGenerating(true);
    setIaResponse(null);

    // Montar payload para o webhook
    const payload = {
      tipo_treino: workoutType || '',
      duracao: duration[0],
      equipamentos: profile?.available_equipment || [],
      grupos_musculares: [], // Se houver seleção, preencher aqui
      nivel_dificuldade: intensity[0]?.toString() || ''
    };

    try {
      // Enviar para o webhook
      const res = await fetch('https://eo79vrb7n8f87mj.m.pipedream.net', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error('Erro ao enviar para o webhook');
      const data = await res.json();
      // Tratar resposta da IA
      let iaMsg = (data.message || 'IA não respondeu.').replace(/[#*]/g, '');
      setIaResponse(iaMsg);
      toast({
        title: 'Webhook enviado!',
        description: 'Os dados do treino foram enviados para o agente de IA.',
      });
    } catch (error) {
      setIaResponse('Não foi possível obter resposta da IA.');
      toast({
        title: 'Erro',
        description: 'Não foi possível enviar para o webhook.',
        variant: 'destructive',
      });
    }

    // Simulação de geração de treino (mantido para UX)
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      const workout = {
        name: `Treino ${workoutType || 'Personalizado'}`,
        type: workoutType || 'strength',
        duration: duration[0],
        intensity: intensity[0],
        exercises: [
          { name: 'Push-ups', sets: 3, reps: 12, rest: 60 },
          { name: 'Squats', sets: 3, reps: 15, rest: 60 },
          { name: 'Plank', sets: 3, duration: 30, rest: 45 },
          { name: 'Lunges', sets: 3, reps: 10, rest: 60 },
        ]
      };
      setGeneratedWorkout(workout);
      toast({
        title: "Treino Gerado!",
        description: "Seu treino personalizado está pronto para começar.",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível gerar o treino. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const startWorkout = () => {
    toast({
      title: "Iniciando Treino",
      description: "Timer ativado! Boa sorte! 💪",
    });
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
            {/* Gerador de Treino */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  Algoritmo de Personalização
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Tipo de Treino */}
                <div className="space-y-3">
                  <label className="text-sm font-medium">Tipo de Treino</label>
                  <Select value={workoutType} onValueChange={setWorkoutType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Auto-seleção baseada no perfil" />
                    </SelectTrigger>
                    <SelectContent>
                      {workoutTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          <div className="flex items-center gap-2">
                            <span>{type.icon}</span>
                            {type.label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Duração */}
                <div className="space-y-3">
                  <label className="text-sm font-medium">
                    Duração: {duration[0]} minutos
                  </label>
                  <Slider
                    value={duration}
                    onValueChange={setDuration}
                    min={15}
                    max={90}
                    step={5}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>15min</span>
                    <span>90min</span>
                  </div>
                </div>

                {/* Intensidade */}
                <div className="space-y-3">
                  <label className="text-sm font-medium">
                    Intensidade: {intensity[0]}/10
                  </label>
                  <Slider
                    value={intensity}
                    onValueChange={setIntensity}
                    min={1}
                    max={10}
                    step={1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Leve</span>
                    <span>Máximo</span>
                  </div>
                </div>

                {/* Equipamentos */}
                <div className="space-y-3">
                  <label className="text-sm font-medium">Equipamentos Disponíveis</label>
                  <div className="flex flex-wrap gap-2">
                    {profile?.available_equipment?.map((equipment) => (
                      <Badge key={equipment} variant="secondary">
                        {equipment}
                      </Badge>
                    )) || (
                      <p className="text-sm text-muted-foreground">
                        Configure seus equipamentos no perfil
                      </p>
                    )}
                  </div>
                </div>

                <Button 
                  onClick={generateWorkout} 
                  disabled={isGenerating}
                  className="w-full"
                  size="lg"
                >
                  {isGenerating ? (
                    <div className="flex items-center gap-2">
                      <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
                      Gerando Treino...
                    </div>
                  ) : (
                    <>
                      <Target className="mr-2 h-4 w-4" />
                      Gerar Treino Personalizado
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Treino Gerado */}
            {generatedWorkout && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    {generatedWorkout.name}
                  </CardTitle>
                  <div className="flex gap-2">
                    <Badge className={workoutTypes.find(t => t.value === generatedWorkout.type)?.color}>
                      {workoutTypes.find(t => t.value === generatedWorkout.type)?.label}
                    </Badge>
                    <Badge variant="outline">
                      {generatedWorkout.duration} min
                    </Badge>
                    <Badge variant="outline">
                      Intensidade {generatedWorkout.intensity}/10
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    {generatedWorkout.exercises.map((exercise: any, index: number) => (
                      <div key={index} className="flex justify-between items-center p-3 bg-muted rounded-lg">
                        <div>
                          <p className="font-medium">{exercise.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {exercise.sets} séries × {exercise.reps || `${exercise.duration}s`}
                          </p>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {exercise.rest}s descanso
                        </div>
                      </div>
                    ))}
                  </div>

                  <Button onClick={startWorkout} className="w-full" size="lg">
                    <Play className="mr-2 h-4 w-4" />
                    Iniciar Treino
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* Resposta da IA */}
        {activeTab === 'generate' && iaResponse && (
          <Card className="mb-4">
            <CardHeader>
              <CardTitle>Resposta da IA</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="whitespace-pre-line text-muted-foreground">{iaResponse}</div>
            </CardContent>
          </Card>
        )}

        {activeTab === 'library' && (
          <div className="space-y-6">
            {/* Filtros */}
            <Card>
              <CardContent className="p-4">
                <div className="flex gap-4 items-center">
                  <div className="flex-1">
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Filtrar por tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        {workoutTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.icon} {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <Button variant="outline">
                    <Filter className="mr-2 h-4 w-4" />
                    Filtros Avançados
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Lista de Treinos */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Card key={i} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg">Treino Força #{i}</CardTitle>
                      <Button variant="ghost" size="sm">
                        <Star className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex gap-2">
                      <Badge className="bg-blue-100 text-blue-800">💪 Força</Badge>
                      <Badge variant="outline">45 min</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-sm text-muted-foreground mb-3">
                      Treino focado em força com exercícios compostos
                    </p>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="flex-1">
                        <Play className="mr-2 h-3 w-3" />
                        Iniciar
                      </Button>
                      <Button variant="outline" size="sm">
                        <BarChart3 className="h-3 w-3" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </ModernLayout>
  );
}