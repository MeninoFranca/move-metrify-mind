import React, { useState } from 'react';
import ModernLayout from '@/components/layout/ModernLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { Dumbbell, Play, Target, Search, Star, BarChart3, Filter } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

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

export default function Workouts() {
  const { profile } = useAuth();
  const [activeTab, setActiveTab] = useState<'generate' | 'library'>('generate');
  const [duration, setDuration] = useState([45]);
  const [selectedWorkoutType, setSelectedWorkoutType] = useState('');
  const [selectedEquipment, setSelectedEquipment] = useState<string[]>([]);
  const [selectedMuscleGroups, setSelectedMuscleGroups] = useState<string[]>([]);
  const [selectedDifficulty, setSelectedDifficulty] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [iaResponse, setIaResponse] = useState<any>(null);

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
      let iaMsg = data.message || 'IA não respondeu.';
      
      // Tentar parsear como JSON se possível
      try {
        const workoutData = JSON.parse(iaMsg);
        setIaResponse(workoutData);
      } catch {
        // Se não for JSON válido, manter como string
        setIaResponse(iaMsg.replace(/[#*]/g, ''));
      }
      
      toast({
        title: 'Treino Gerado!',
        description: 'Resposta recebida do agente de IA.',
      });
    } catch (error) {
      setIaResponse('Não foi possível obter resposta da IA.');
      toast({
        title: 'Erro',
        description: 'Não foi possível enviar para o webhook.',
        variant: 'destructive',
      });
    } finally {
      setIsGenerating(false);
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
            {/* Gerador de Treino */}
            <Card>
              <CardHeader>
                <CardTitle>Personalizar Treino</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Tipo de Treino */}
                <div className="space-y-3">
                  <label className="text-sm font-medium">Tipo de Treino</label>
                  <div className="grid grid-cols-2 gap-2">
                    {workoutTypes.map((type) => (
                      <div key={type.value} className="flex items-center space-x-2">
                        <Checkbox
                          id={type.value}
                          checked={selectedWorkoutType === type.value}
                          onCheckedChange={(checked) => {
                            setSelectedWorkoutType(checked ? type.value : '');
                          }}
                        />
                        <label htmlFor={type.value} className="text-sm flex items-center gap-2 cursor-pointer">
                          <span>{type.icon}</span>
                          {type.label}
                        </label>
                      </div>
                    ))}
                  </div>
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

                {/* Equipamentos */}
                <div className="space-y-3">
                  <label className="text-sm font-medium">Equipamentos Disponíveis</label>
                  <div className="grid grid-cols-2 gap-2">
                    {equipmentOptions.map((equipment) => (
                      <div key={equipment} className="flex items-center space-x-2">
                        <Checkbox
                          id={equipment}
                          checked={selectedEquipment.includes(equipment)}
                          onCheckedChange={(checked) => handleEquipmentChange(equipment, checked as boolean)}
                        />
                        <label htmlFor={equipment} className="text-sm cursor-pointer">
                          {equipment}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Grupos Musculares */}
                <div className="space-y-3">
                  <label className="text-sm font-medium">Grupos Musculares</label>
                  <div className="grid grid-cols-2 gap-2">
                    {muscleGroups.map((group) => (
                      <div key={group} className="flex items-center space-x-2">
                        <Checkbox
                          id={group}
                          checked={selectedMuscleGroups.includes(group)}
                          onCheckedChange={(checked) => handleMuscleGroupChange(group, checked as boolean)}
                        />
                        <label htmlFor={group} className="text-sm cursor-pointer">
                          {group}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Nível de Dificuldade */}
                <div className="space-y-3">
                  <label className="text-sm font-medium">Nível de Dificuldade</label>
                  <div className="grid grid-cols-1 gap-2">
                    {difficultyLevels.map((level) => (
                      <div key={level.value} className="flex items-center space-x-2">
                        <Checkbox
                          id={level.value}
                          checked={selectedDifficulty === level.value}
                          onCheckedChange={(checked) => {
                            setSelectedDifficulty(checked ? level.value : '');
                          }}
                        />
                        <label htmlFor={level.value} className="text-sm cursor-pointer">
                          {level.label}
                        </label>
                      </div>
                    ))}
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

            {/* Resposta da IA */}
            {iaResponse && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5 text-primary" />
                    {typeof iaResponse === 'object' ? (iaResponse.nome || 'Treino Personalizado') : 'Treino Personalizado'}
                  </CardTitle>
                  {typeof iaResponse === 'object' && iaResponse.duracao && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span>⏱️ {iaResponse.duracao} minutos</span>
                    </div>
                  )}
                </CardHeader>
                <CardContent className="space-y-6">
                  {typeof iaResponse === 'string' ? (
                    // Exibir resposta em texto simples se não for JSON estruturado
                    <div className="whitespace-pre-line text-sm">{iaResponse}</div>
                  ) : (
                    <>
                      {/* Aquecimento */}
                      {iaResponse.aquecimento && (
                        <div className="space-y-3">
                          <h3 className="font-semibold flex items-center gap-2">
                            🔥 Aquecimento
                          </h3>
                          <ul className="space-y-2">
                            {iaResponse.aquecimento.map((item, index) => (
                              <li key={index} className="text-sm bg-secondary/50 p-3 rounded-md">
                                {item}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Exercícios */}
                      {iaResponse.exercicios && (
                        <div className="space-y-3">
                          <h3 className="font-semibold flex items-center gap-2">
                            💪 Exercícios
                          </h3>
                          <div className="space-y-4">
                            {iaResponse.exercicios.map((exercicio, index) => (
                              <div key={index} className="border rounded-lg p-4 space-y-3">
                                <div className="flex justify-between items-start">
                                  <h4 className="font-medium">{exercicio.exercicio}</h4>
                                  <Badge variant="outline">
                                    {exercicio.series} séries × {exercicio.repeticoes} reps
                                  </Badge>
                                </div>
                                <div className="text-sm text-muted-foreground">
                                  <span>⏱️ Descanso: {exercicio.descanso}</span>
                                </div>
                                <div className="text-sm bg-secondary/30 p-3 rounded">
                                  <strong>Instruções:</strong> {exercicio.instrucoes}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Alongamento */}
                      {iaResponse.alongamento && (
                        <div className="space-y-3">
                          <h3 className="font-semibold flex items-center gap-2">
                            🧘 Alongamento
                          </h3>
                          <ul className="space-y-2">
                            {iaResponse.alongamento.map((item, index) => (
                              <li key={index} className="text-sm bg-secondary/50 p-3 rounded-md">
                                {item}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Dicas */}
                      {iaResponse.dicas && (
                        <div className="space-y-3">
                          <h3 className="font-semibold flex items-center gap-2">
                            💡 Dicas Importantes
                          </h3>
                          <ul className="space-y-2">
                            {iaResponse.dicas.map((dica, index) => (
                              <li key={index} className="text-sm bg-amber-50 dark:bg-amber-950/20 p-3 rounded-md border-l-4 border-amber-500">
                                {dica}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </>
                  )}

                  <Button className="w-full mt-6" size="lg">
                    <Play className="mr-2 h-4 w-4" />
                    Iniciar Treino
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {activeTab === 'library' && (
          <div className="space-y-6">
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
                      <Badge variant="secondary">💪 Força</Badge>
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