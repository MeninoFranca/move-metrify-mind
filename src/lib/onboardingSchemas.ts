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

// Esquema para o formulário de registro completo
export const registrationSchema = z.object({
  fullName: z.string().min(3, { message: "O nome completo é obrigatório." }),
  email: z.string().email({ message: "Por favor, insira um email válido." }),
  password: z.string().min(6, { message: "A senha deve ter pelo menos 6 caracteres." }),
  confirmPassword: z.string(),
  terms: z.boolean().refine(val => val === true, {
    message: "Você deve aceitar os termos e condições."
  }),
  age: z.number().min(13).max(100).optional(),
  experienceLevel: z.enum(['beginner', 'intermediate', 'advanced']).optional(),
  height: z.number().min(100).max(250).optional(),
  weight: z.number().min(30).max(300).optional(),
  fitnessGoal: z.enum(['lose_weight', 'gain_muscle', 'maintain_weight', 'increase_endurance']).optional(),
  availableEquipment: z.array(z.string()).optional(),
}).refine(data => data.password === data.confirmPassword, {
  message: "As senhas não coincidem.",
  path: ["confirmPassword"], // Onde o erro será exibido
});

export type RegistrationData = z.infer<typeof registrationSchema>;