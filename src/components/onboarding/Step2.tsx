import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { OnboardingData } from '@/pages/Onboarding';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const step2Schema = z.object({
  height: z.number({ required_error: "Altura é obrigatória." }).min(100, "Altura mínima de 100cm.").max(250, "Altura máxima de 250cm."),
  weight: z.number({ required_error: "Peso é obrigatório." }).min(30, "Peso mínimo de 30kg.").max(300, "Peso máximo de 300kg."),
});

type Step2Data = z.infer<typeof step2Schema>;

interface Step2Props {
  onNext: (data: Partial<OnboardingData>) => void;
  onPrev: () => void;
}

const Step2: React.FC<Step2Props> = ({ onNext, onPrev }) => {
  const form = useForm<Step2Data>({
    resolver: zodResolver(step2Schema),
    defaultValues: {
        height: 170,
        weight: 70,
    }
  });

  const onSubmit = (data: Step2Data) => {
    onNext(data);
  };

  return (
    <div className="flex flex-col items-center justify-center h-full text-center space-y-8 animate-fade-in-up">
        <div className="space-y-2">
            <h2 className="text-2xl font-bold">Suas Medidas</h2>
            <p className="text-muted-foreground">Isso nos ajuda a calcular suas necessidades diárias.</p>
        </div>
        <Card className="w-full max-w-md">
            <CardContent className="pt-6">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                        control={form.control}
                        name="height"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Altura (cm)</FormLabel>
                            <FormControl>
                                <Input type="number" placeholder="170" {...field} onChange={e => field.onChange(parseInt(e.target.value, 10))}/>
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                         <FormField
                        control={form.control}
                        name="weight"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Peso (kg)</FormLabel>
                            <FormControl>
                                <Input type="number" placeholder="70" {...field} onChange={e => field.onChange(parseFloat(e.target.value))}/>
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                        <div className="flex justify-between pt-4">
                            <Button type="button" onClick={onPrev} variant="outline">Anterior</Button>
                            <Button type="submit">Próximo</Button>
                        </div>
                    </form>
                </Form>
            </CardContent>
        </Card>
    </div>
  );
};

export default Step2;