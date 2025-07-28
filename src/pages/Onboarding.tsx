import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowRight, 
  ArrowLeft,
  Dumbbell, 
  Target, 
  Clock, 
  Zap,
  Calendar,
  CheckCircle,
  Sparkles,
  User,
  Scale,
  Ruler,
  Trophy,
  Activity
} from "lucide-react";
import { cn } from '@/lib/utils';

export interface OnboardingData {
  age?: number;
  weight?: number;
  height?: number;
  fitness_goal?: 'lose_weight' | 'gain_muscle' | 'maintain_weight' | 'increase_endurance';
  experience_level?: 'beginner' | 'intermediate' | 'advanced';
  available_equipment?: string[];
  weekly_availability?: {
    [key: string]: {
      available: boolean;
      hours: number;
    };
  };
}

export default function Onboarding() {
  const navigate = useNavigate();
  const { user, updateProfile } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [onboardingData, setOnboardingData] = useState<OnboardingData>({});
  const [isLoading, setIsLoading] = useState(false);

  const totalSteps = 6;
  const progress = (currentStep / totalSteps) * 100;

  const goals = [
    { 
      id: 'lose_weight', 
      label: 'Perder Peso', 
      icon: <Scale className="h-8 w-8" />,
      description: 'Queimar gordura e definir o corpo',
      color: 'text-red-500'
    },
    { 
      id: 'gain_muscle', 
      label: 'Ganhar Músculo', 
      icon: <Dumbbell className="h-8 w-8" />,
      description: 'Aumentar massa muscular',
      color: 'text-blue-500'
    },
    { 
      id: 'increase_endurance', 
      label: 'Aumentar Resistência', 
      icon: <Zap className="h-8 w-8" />,
      description: 'Melhorar condicionamento físico',
      color: 'text-green-500'
    },
    { 
      id: 'maintain_weight', 
      label: 'Manter a Forma', 
      icon: <Target className="h-8 w-8" />,
      description: 'Manter peso e saúde atual',
      color: 'text-purple-500'
    },
  ];

  const experienceLevels = [
    {
      id: 'beginner',
      label: 'Iniciante',
      description: 'Pouca ou nenhuma experiência',
      icon: <User className="h-6 w-6" />,
      level: 1
    },
    {
      id: 'intermediate',
      label: 'Intermediário',
      description: '6 meses a 2 anos de experiência',
      icon: <Activity className="h-6 w-6" />,
      level: 2
    },
    {
      id: 'advanced',
      label: 'Avançado',
      description: 'Mais de 2 anos de experiência',
      icon: <Trophy className="h-6 w-6" />,
      level: 3
    },
  ];

  const equipmentOptions = [
    { id: 'none', label: 'Nenhum', emoji: '🚫' },
    { id: 'bodyweight', label: 'Peso Corporal', emoji: '🤸' },
    { id: 'dumbbells', label: 'Halteres', emoji: '🏋️' },
    { id: 'resistance_bands', label: 'Faixas Elásticas', emoji: '🎗️' },
    { id: 'full_gym', label: 'Academia Completa', emoji: '🏢' },
  ];

  const weekDays = [
    { id: 'monday', label: 'Seg', fullName: 'Segunda-feira' },
    { id: 'tuesday', label: 'Ter', fullName: 'Terça-feira' },
    { id: 'wednesday', label: 'Qua', fullName: 'Quarta-feira' },
    { id: 'thursday', label: 'Qui', fullName: 'Quinta-feira' },
    { id: 'friday', label: 'Sex', fullName: 'Sexta-feira' },
    { id: 'saturday', label: 'Sáb', fullName: 'Sábado' },
    { id: 'sunday', label: 'Dom', fullName: 'Domingo' },
  ];

  const updateData = (newData: Partial<OnboardingData>) => {
    setOnboardingData(prev => ({ ...prev, ...newData }));
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleFinish = async () => {
    setIsLoading(true);
    try {
      await updateProfile({
        ...onboardingData,
        available_equipment: onboardingData.available_equipment as any
      });
      navigate('/dashboard');
    } catch (error) {
      console.error('Erro ao salvar perfil:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1: return onboardingData.age;
      case 2: return onboardingData.weight && onboardingData.height;
      case 3: return onboardingData.fitness_goal;
      case 4: return onboardingData.experience_level;
      case 5: return onboardingData.available_equipment?.length;
      case 6: return true;
      default: return false;
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="text-center space-y-8">
            <div className="space-y-4">
              <div className="flex justify-center">
                <div className="p-4 rounded-full bg-primary/10">
                  <User className="h-8 w-8 text-primary" />
                </div>
              </div>
              <h2 className="text-3xl font-bold">Olá, {user?.email?.split('@')[0]}! 👋</h2>
              <p className="text-muted-foreground text-lg">Vamos personalizar sua experiência. Qual é a sua idade?</p>
            </div>
            
            <Card className="max-w-md mx-auto">
              <CardContent className="pt-8 pb-6">
                <div className="space-y-6">
                  <div className="text-6xl font-bold text-primary">{onboardingData.age || 25}</div>
                  <div className="space-y-2">
                    <Slider
                      value={[onboardingData.age || 25]}
                      onValueChange={(value) => updateData({ age: value[0] })}
                      max={80}
                      min={16}
                      step={1}
                      className="w-full"
                    />
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>16</span>
                      <span>80</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 2:
        return (
          <div className="text-center space-y-8">
            <div className="space-y-4">
              <div className="flex justify-center">
                <div className="p-4 rounded-full bg-secondary/10">
                  <Scale className="h-8 w-8 text-secondary" />
                </div>
              </div>
              <h2 className="text-3xl font-bold">Suas Medidas</h2>
              <p className="text-muted-foreground text-lg">Isso nos ajuda a calcular suas necessidades calóricas</p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6 max-w-md mx-auto">
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-center">
                      <Scale className="h-6 w-6 text-secondary mr-2" />
                      <Label className="text-lg font-medium">Peso (kg)</Label>
                    </div>
                    <Input
                      type="number"
                      placeholder="70"
                      value={onboardingData.weight || ''}
                      onChange={(e) => updateData({ weight: parseFloat(e.target.value) })}
                      className="text-center text-xl h-12"
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-center">
                      <Ruler className="h-6 w-6 text-secondary mr-2" />
                      <Label className="text-lg font-medium">Altura (cm)</Label>
                    </div>
                    <Input
                      type="number"
                      placeholder="170"
                      value={onboardingData.height || ''}
                      onChange={(e) => updateData({ height: parseFloat(e.target.value) })}
                      className="text-center text-xl h-12"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="text-center space-y-8">
            <div className="space-y-4">
              <div className="flex justify-center">
                <div className="p-4 rounded-full bg-accent/10">
                  <Target className="h-8 w-8 text-accent" />
                </div>
              </div>
              <h2 className="text-3xl font-bold">Qual é seu objetivo?</h2>
              <p className="text-muted-foreground text-lg">Escolha seu objetivo principal para personalizar seus treinos</p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-4 max-w-2xl mx-auto">
              {goals.map((goal) => (
                <Card 
                  key={goal.id}
                  onClick={() => updateData({ fitness_goal: goal.id as any })}
                  className={cn(
                    "p-6 cursor-pointer transition-all duration-300 hover:scale-105",
                    onboardingData.fitness_goal === goal.id 
                      ? "ring-2 ring-primary bg-primary/5 shadow-glow" 
                      : "hover:bg-muted/50"
                  )}
                >
                  <CardContent className="flex flex-col items-center space-y-4 p-0">
                    <div className={goal.color}>
                      {goal.icon}
                    </div>
                    <div className="text-center">
                      <h3 className="font-semibold text-lg">{goal.label}</h3>
                      <p className="text-sm text-muted-foreground">{goal.description}</p>
                    </div>
                    {onboardingData.fitness_goal === goal.id && (
                      <CheckCircle className="h-6 w-6 text-primary" />
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        );

      case 4:
        return (
          <div className="text-center space-y-8">
            <div className="space-y-4">
              <div className="flex justify-center">
                <div className="p-4 rounded-full bg-primary/10">
                  <Activity className="h-8 w-8 text-primary" />
                </div>
              </div>
              <h2 className="text-3xl font-bold">Qual seu nível de experiência?</h2>
              <p className="text-muted-foreground text-lg">Isso nos ajuda a ajustar a intensidade dos treinos</p>
            </div>
            
            <div className="space-y-4 max-w-md mx-auto">
              {experienceLevels.map((level) => (
                <Card 
                  key={level.id}
                  onClick={() => updateData({ experience_level: level.id as any })}
                  className={cn(
                    "p-4 cursor-pointer transition-all duration-300",
                    onboardingData.experience_level === level.id 
                      ? "ring-2 ring-primary bg-primary/5" 
                      : "hover:bg-muted/50"
                  )}
                >
                  <CardContent className="flex items-center space-x-4 p-0">
                    <div className="p-3 rounded-full bg-primary/10">
                      {level.icon}
                    </div>
                    <div className="flex-1 text-left">
                      <h3 className="font-semibold">{level.label}</h3>
                      <p className="text-sm text-muted-foreground">{level.description}</p>
                    </div>
                    <div className="flex space-x-1">
                      {[...Array(3)].map((_, i) => (
                        <div 
                          key={i}
                          className={cn(
                            "w-2 h-6 rounded-full",
                            i < level.level ? "bg-primary" : "bg-muted"
                          )}
                        />
                      ))}
                    </div>
                    {onboardingData.experience_level === level.id && (
                      <CheckCircle className="h-6 w-6 text-primary" />
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        );

      case 5:
        return (
          <div className="text-center space-y-8">
            <div className="space-y-4">
              <div className="flex justify-center">
                <div className="p-4 rounded-full bg-secondary/10">
                  <Dumbbell className="h-8 w-8 text-secondary" />
                </div>
              </div>
              <h2 className="text-3xl font-bold">Equipamentos Disponíveis</h2>
              <p className="text-muted-foreground text-lg">Selecione os equipamentos que você tem acesso</p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-4 max-w-3xl mx-auto">
              {equipmentOptions.map((equipment) => {
                const isSelected = onboardingData.available_equipment?.includes(equipment.id);
                return (
                  <Card 
                    key={equipment.id}
                    onClick={() => {
                      const current = onboardingData.available_equipment || [];
                      const updated = isSelected 
                        ? current.filter(id => id !== equipment.id)
                        : [...current, equipment.id];
                      updateData({ available_equipment: updated });
                    }}
                    className={cn(
                      "p-6 cursor-pointer transition-all duration-300 hover:scale-105",
                      isSelected 
                        ? "ring-2 ring-primary bg-primary/5 shadow-glow" 
                        : "hover:bg-muted/50"
                    )}
                  >
                    <CardContent className="flex flex-col items-center space-y-4 p-0">
                      <div className="text-4xl">{equipment.emoji}</div>
                      <h3 className="font-semibold">{equipment.label}</h3>
                      {isSelected && (
                        <CheckCircle className="h-6 w-6 text-primary" />
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        );

      case 6:
        return (
          <div className="text-center space-y-8">
            <div className="space-y-4">
              <div className="flex justify-center">
                <div className="p-4 rounded-full bg-accent/10">
                  <Calendar className="h-8 w-8 text-accent" />
                </div>
              </div>
              <h2 className="text-3xl font-bold">Disponibilidade Semanal</h2>
              <p className="text-muted-foreground text-lg">Quando você prefere treinar? (opcional)</p>
            </div>
            
            <div className="space-y-4 max-w-2xl mx-auto">
              {weekDays.map((day) => {
                const dayData = onboardingData.weekly_availability?.[day.id] || { available: false, hours: 1 };
                return (
                  <Card key={day.id} className="p-4">
                    <CardContent className="flex items-center justify-between p-0">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 text-center">
                          <div className="font-semibold">{day.label}</div>
                          <div className="text-xs text-muted-foreground">{day.fullName}</div>
                        </div>
                        <Button
                          variant={dayData.available ? "default" : "outline"}
                          size="sm"
                          onClick={() => {
                            const updated = {
                              ...onboardingData.weekly_availability,
                              [day.id]: { ...dayData, available: !dayData.available }
                            };
                            updateData({ weekly_availability: updated });
                          }}
                        >
                          {dayData.available ? 'Disponível' : 'Indisponível'}
                        </Button>
                      </div>
                      
                      {dayData.available && (
                        <div className="flex items-center space-x-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <Slider
                            value={[dayData.hours]}
                            onValueChange={(value) => {
                              const updated = {
                                ...onboardingData.weekly_availability,
                                [day.id]: { ...dayData, hours: value[0] }
                              };
                              updateData({ weekly_availability: updated });
                            }}
                            max={3}
                            min={0.5}
                            step={0.5}
                            className="w-24"
                          />
                          <span className="text-sm font-medium w-12">{dayData.hours}h</span>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background p-4">
      {/* Header */}
      <div className="container mx-auto max-w-4xl">
        <div className="flex items-center justify-between mb-8 pt-8">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg gradient-primary">
              <Dumbbell className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">FitPro</h1>
              <Badge variant="secondary" className="text-xs">Configuração Inicial</Badge>
            </div>
          </div>
          
          <div className="text-right">
            <div className="text-sm text-muted-foreground">Passo {currentStep} de {totalSteps}</div>
            <div className="text-lg font-semibold">{Math.round(progress)}% completo</div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-12">
          <Progress value={progress} className="h-3" />
          <div className="flex justify-between mt-2 text-xs text-muted-foreground">
            <span>Início</span>
            <span>Configuração Completa</span>
          </div>
        </div>

        {/* Step Content */}
        <div className="mb-12">
          {renderStep()}
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <Button 
            variant="outline" 
            onClick={prevStep} 
            disabled={currentStep === 1}
            className="flex items-center"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Anterior
          </Button>

          <div className="flex space-x-2">
            {[...Array(totalSteps)].map((_, index) => (
              <div
                key={index}
                className={cn(
                  "w-3 h-3 rounded-full transition-all",
                  index + 1 === currentStep ? "bg-primary scale-125" :
                  index + 1 < currentStep ? "bg-primary" : "bg-muted"
                )}
              />
            ))}
          </div>

          {currentStep === totalSteps ? (
            <Button 
              onClick={handleFinish} 
              disabled={!canProceed() || isLoading}
              className="gradient-primary"
            >
              {isLoading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Finalizando...
                </div>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Finalizar Configuração
                  <CheckCircle className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          ) : (
            <Button 
              onClick={nextStep} 
              disabled={!canProceed()}
              className="flex items-center"
            >
              Próximo
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}