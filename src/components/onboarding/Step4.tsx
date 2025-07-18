import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { onboardingStep4Schema } from '@/lib/onboardingSchemas';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';

type Step4Data = z.infer<typeof onboardingStep4Schema>;

interface Step4Props {
  onFinish: (data: Step4Data) => void;
  onPrev: () => void;
}

const exerciseOptions = [
    { id: 'running', label: 'Running' },
    { id: 'weightlifting', label: 'Weightlifting' },
    { id: 'yoga', label: 'Yoga' },
    { id: 'calisthenics', label: 'Calisthenics' },
];

const Step4: React.FC<Step4Props> = ({ onFinish, onPrev }) => {
  const form = useForm<Step4Data>({
    resolver: zodResolver(onboardingStep4Schema),
    defaultValues: {
      preferredExercises: ['running'],
      restrictions: '',
      notificationSettings: {
        hydration: true,
        workout: true,
        meals: false,
      },
    },
  });

  const onSubmit = (data: Step4Data) => {
    onFinish(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
            control={form.control}
            name="preferredExercises"
            render={() => (
                <FormItem>
                <FormLabel>Preferred Exercises</FormLabel>
                {exerciseOptions.map((item) => (
                    <FormField
                    key={item.id}
                    control={form.control}
                    name="preferredExercises"
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
          name="restrictions"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Restrictions / Limitations</FormLabel>
              <FormControl>
                <Textarea placeholder="e.g., knee pain, prefer low-impact exercises" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div>
            <FormLabel>Notification Settings</FormLabel>
            <FormField
                control={form.control}
                name="notificationSettings.hydration"
                render={({ field }) => (
                    <FormItem className="flex flex-row items-center space-x-3 space-y-0 mt-2">
                        <FormControl>
                            <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                        <FormLabel className="font-normal">Hydration reminders</FormLabel>
                    </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="notificationSettings.workout"
                render={({ field }) => (
                    <FormItem className="flex flex-row items-center space-x-3 space-y-0 mt-2">
                        <FormControl>
                            <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                        <FormLabel className="font-normal">Workout reminders</FormLabel>
                    </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="notificationSettings.meals"
                render={({ field }) => (
                    <FormItem className="flex flex-row items-center space-x-3 space-y-0 mt-2">
                        <FormControl>
                            <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                        <FormLabel className="font-normal">Meal reminders</FormLabel>
                    </FormItem>
                )}
            />
        </div>

        <div className="flex justify-between">
          <Button type="button" onClick={onPrev} variant="outline">Previous</Button>
          <Button type="submit">Finish</Button>
        </div>
      </form>
    </Form>
  );
};

export default Step4; 