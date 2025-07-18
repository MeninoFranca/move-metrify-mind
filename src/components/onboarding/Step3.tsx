import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { onboardingStep3Schema } from '@/lib/onboardingSchemas';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';

type Step3Data = z.infer<typeof onboardingStep3Schema>;

interface Step3Props {
  onNext: (data: Step3Data) => void;
  onPrev: () => void;
}

const equipmentOptions = [
  { id: 'gym', label: 'Gym' },
  { id: 'home', label: 'Home' },
  { id: 'none', label: 'None' },
] as const;

const Step3: React.FC<Step3Props> = ({ onNext, onPrev }) => {
  const form = useForm<Step3Data>({
    resolver: zodResolver(onboardingStep3Schema),
    defaultValues: {
      mainGoal: 'lose_weight',
      availableEquipment: ['home'],
      timePerWorkout: 45,
    },
  });

  const onSubmit = (data: Step3Data) => {
    onNext(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="mainGoal"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Main Goal</FormLabel>
              <FormControl>
                <select {...field} className="w-full p-2 border rounded">
                  <option value="lose_weight">Lose Weight</option>
                  <option value="gain_muscle">Gain Muscle</option>
                  <option value="maintain_shape">Maintain Shape</option>
                </select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="availableEquipment"
          render={() => (
            <FormItem>
              <FormLabel>Available Equipment</FormLabel>
              {equipmentOptions.map((item) => (
                <FormField
                  key={item.id}
                  control={form.control}
                  name="availableEquipment"
                  render={({ field }) => {
                    return (
                      <FormItem
                        key={item.id}
                        className="flex flex-row items-start space-x-3 space-y-0"
                      >
                        <FormControl>
                          <Checkbox
                            checked={field.value?.includes(item.id)}
                            onCheckedChange={(checked) => {
                              return checked
                                ? field.onChange([...field.value, item.id])
                                : field.onChange(
                                    field.value?.filter(
                                      (value) => value !== item.id
                                    )
                                  );
                            }}
                          />
                        </FormControl>
                        <FormLabel className="font-normal">
                          {item.label}
                        </FormLabel>
                      </FormItem>
                    );
                  }}
                />
              ))}
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="timePerWorkout"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Time per Workout (minutes)</FormLabel>
              <FormControl>
                <Input type="number" placeholder="45" {...field} onChange={e => field.onChange(parseInt(e.target.value, 10))} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-between">
          <Button type="button" onClick={onPrev} variant="outline">Previous</Button>
          <Button type="submit">Next</Button>
        </div>
      </form>
    </Form>
  );
};

export default Step3; 