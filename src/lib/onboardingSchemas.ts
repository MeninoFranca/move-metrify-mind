import { z } from 'zod';

export const onboardingStep1Schema = z.object({
  fullName: z.string().min(2, { message: 'Full name must be at least 2 characters.' }),
  dateOfBirth: z.string().refine((val) => !isNaN(Date.parse(val)), { message: 'Invalid date format.' }),
  gender: z.enum(['male', 'female', 'other']),
});

export const onboardingStep2Schema = z.object({
  weight: z.number().min(30, { message: "Weight must be at least 30kg." }),
  height: z.number().min(100, { message: "Height must be at least 100cm." }),
  activityLevel: z.enum(['sedentary', 'light', 'moderate', 'active', 'very_active']),
});

export const onboardingStep3Schema = z.object({
  mainGoal: z.enum(['lose_weight', 'gain_muscle', 'maintain_shape']),
  availableEquipment: z.array(z.enum(['gym', 'home', 'none'])),
  timePerWorkout: z.number().min(15).max(120),
});

export const onboardingStep4Schema = z.object({
  preferredExercises: z.array(z.string()),
  restrictions: z.string().optional(),
  notificationSettings: z.object({
    hydration: z.boolean(),
    workout: z.boolean(),
    meals: z.boolean(),
  }),
}); 