import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { OnboardingData } from '@/pages/Onboarding';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Dumbbell, Target, Clock, Zap } from 'lucide-react';
import { Slider } from '../ui/slider';

interface Step3Props {
  onFinish: (data: Partial<OnboardingData>) => void;
  onPrev: () => void;
}

const goals = [
  { id: 'lose_weight', label: 'Perder Peso', icon: <Target className="h-8 w-8" /> },
  { id: 'gain_muscle', label: 'Ganhar Músculo', icon: <Dumbbell className="h-8 w-8" /> },
  { id: 'increase_endurance', label: 'Aumentar Resistência', icon: <Zap className="h-8 w-8" /> },
  { id: 'maintain_weight', label: 'Manter a Forma', icon: <Clock className="h-8 w-8" /> },
];

const equipmentOptions = [
  { id: 'none', label: 'Nenhum' },
  { id: 'bodyweight', label: 'Peso Corporal' },
  { id: 'dumbbells', label: 'Halteres' },
  { id: 'resistance_bands', label: 'Faixas Elásticas' },
  { id: 'full_gym', label: 'Academia' },
];


const Step3: React.FC<Step3Props> = ({ onFinish, onPrev }) => {
  const { control, handleSubmit, watch, setValue } = useForm<OnboardingData>({
      defaultValues: {
          fitness_goal: 'lose_weight',
          experience_level: 'beginner',
          available_equipment: ['bodyweight'],
      }
  });

  const selectedEquipment = watch('available_equipment') || [];

  const handleEquipmentToggle = (equipmentId: string) => {
    const isSelected = selectedEquipment.includes(equipmentId);
    if (isSelected) {
        setValue('available_equipment', selectedEquipment.filter(id => id !== equipmentId));
    } else {
        setValue('available_equipment', [...selectedEquipment, equipmentId]);
    }
  };

  const onSubmit = (data: OnboardingData) => {
    onFinish(data);
  };

  return (
    <div className="flex flex-col items-center justify-center h-full space-y-6 animate-fade-in-up">
        <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold">Quais são seus objetivos?</h2>
            <p className="text-muted-foreground">Selecione seu objetivo principal e os equipamentos que possui.</p>
        </div>
        
        <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-2xl space-y-8">
            {/* Seletor de Objetivos */}
            <Controller
                name="fitness_goal"
                control={control}
                render={({ field }) => (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {goals.map((goal) => (
                            <Card 
                                key={goal.id}
                                onClick={() => field.onChange(goal.id)}
                                className={cn(
                                    "p-4 flex flex-col items-center justify-center space-y-3 cursor-pointer transition-all",
                                    field.value === goal.id ? "ring-2 ring-primary bg-primary/10" : "hover:bg-muted"
                                )}
                            >
                                {goal.icon}
                                <span className="text-sm font-medium text-center">{goal.label}</span>
                            </Card>
                        ))}
                    </div>
                )}
            />

            {/* Seletor de Equipamentos */}
            <div>
                 <h3 className="text-lg font-semibold mb-4 text-center">Equipamentos Disponíveis</h3>
                 <div className="flex flex-wrap justify-center gap-3">
                     {equipmentOptions.map((option) => (
                        <Button 
                            key={option.id}
                            type="button"
                            variant={selectedEquipment.includes(option.id) ? 'default' : 'outline'}
                            onClick={() => handleEquipmentToggle(option.id)}
                        >
                            {option.label}
                        </Button>
                     ))}
                 </div>
            </div>

            <div className="flex justify-between items-center pt-6">
                <Button type="button" onClick={onPrev} variant="outline" size="lg">Anterior</Button>
                <Button type="submit" size="lg">Finalizar e Criar Perfil</Button>
            </div>
        </form>
    </div>
  );
};

export default Step3;