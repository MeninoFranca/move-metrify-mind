import React, { useState } from 'react';
import { OnboardingData } from '@/pages/Onboarding';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';

interface Step1Props {
  onNext: (data: Partial<OnboardingData>) => void;
  userName?: string | null;
}

const Step1: React.FC<Step1Props> = ({ onNext, userName }) => {
  const [age, setAge] = useState(25);

  const handleSubmit = () => {
    onNext({ age });
  };

  return (
    <div className="flex flex-col items-center justify-center h-full text-center space-y-8 animate-fade-in-up">
        <div className="space-y-2">
            <h2 className="text-2xl font-bold">Bem-vindo(a), {userName || 'Usuário'}!</h2>
            <p className="text-muted-foreground">Para começar, qual é a sua idade?</p>
        </div>
        
        <Card className="w-full max-w-md">
            <CardContent className="pt-8 pb-6">
                 <div className="space-y-6">
                    <div className="text-5xl font-bold text-primary">{age}</div>
                    <Slider
                        defaultValue={[25]}
                        value={[age]}
                        max={100}
                        min={13}
                        step={1}
                        onValueChange={(value) => setAge(value[0])}
                    />
                </div>
            </CardContent>
        </Card>
      
        <Button onClick={handleSubmit} size="lg">Próximo</Button>
    </div>
  );
};

export default Step1;