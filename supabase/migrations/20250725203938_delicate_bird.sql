/*
  # Sistema Fitness Completo - Schema Principal

  1. Estrutura Completa
    - Todos os enums necessários para o sistema
    - Tabelas principais com relacionamentos otimizados
    - Sistema de conquistas e gamificação
    - Histórico completo de atividades
    
  2. Segurança
    - RLS habilitado em todas as tabelas
    - Políticas específicas para cada tipo de acesso
    - Triggers automáticos para criação de perfil
    
  3. Funcionalidades
    - Sistema de hidratação inteligente
    - Tracking completo de progresso
    - Calendário de eventos fitness
    - Planos nutricionais personalizados
*/

-- Extensões necessárias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enums para tipagem forte
CREATE TYPE public.fitness_goal AS ENUM (
  'lose_weight', 
  'gain_muscle', 
  'maintain_weight', 
  'increase_endurance'
);

CREATE TYPE public.experience_level AS ENUM (
  'beginner', 
  'intermediate', 
  'advanced'
);

CREATE TYPE public.equipment_type AS ENUM (
  'full_gym', 
  'dumbbells', 
  'bodyweight', 
  'resistance_bands', 
  'none'
);

CREATE TYPE public.workout_type AS ENUM (
  'strength', 
  'cardio', 
  'hiit', 
  'flexibility'
);

CREATE TYPE public.meal_type AS ENUM (
  'breakfast', 
  'morning_snack', 
  'lunch', 
  'afternoon_snack', 
  'dinner', 
  'evening_snack'
);

CREATE TYPE public.achievement_type AS ENUM (
  'workout_streak', 
  'weight_goal', 
  'hydration_goal', 
  'workout_count', 
  'consistency'
);

-- Tabela de perfis de usuário
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  age INTEGER,
  weight DECIMAL(5,2),
  height DECIMAL(5,2),
  fitness_goal fitness_goal,
  experience_level experience_level,
  available_equipment equipment_type[],
  weekly_availability JSONB,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela de exercícios (biblioteca pública)
CREATE TABLE IF NOT EXISTS public.exercises (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  muscle_groups TEXT[],
  equipment_required equipment_type[],
  difficulty_level experience_level NOT NULL,
  instructions TEXT,
  duration_seconds INTEGER,
  rest_seconds INTEGER,
  calories_per_minute DECIMAL(4,2),
  video_url TEXT,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela de treinos
CREATE TABLE IF NOT EXISTS public.workouts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  workout_type workout_type NOT NULL,
  duration_minutes INTEGER NOT NULL,
  intensity_level INTEGER CHECK (intensity_level BETWEEN 1 AND 10),
  equipment_used equipment_type[],
  calories_burned DECIMAL(6,2),
  is_template BOOLEAN DEFAULT false,
  is_favorite BOOLEAN DEFAULT false,
  generated_automatically BOOLEAN DEFAULT true,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela de exercícios do treino
CREATE TABLE IF NOT EXISTS public.workout_exercises (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  workout_id UUID NOT NULL REFERENCES public.workouts(id) ON DELETE CASCADE,
  exercise_id UUID NOT NULL REFERENCES public.exercises(id) ON DELETE CASCADE,
  sets INTEGER,
  reps INTEGER,
  weight_kg DECIMAL(5,2),
  duration_seconds INTEGER,
  rest_seconds INTEGER,
  notes TEXT,
  completed BOOLEAN DEFAULT false,
  order_index INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela de alimentos
CREATE TABLE IF NOT EXISTS public.food_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  brand TEXT,
  calories_per_100g DECIMAL(6,2) NOT NULL,
  protein_per_100g DECIMAL(5,2) NOT NULL,
  carbs_per_100g DECIMAL(5,2) NOT NULL,
  fat_per_100g DECIMAL(5,2) NOT NULL,
  fiber_per_100g DECIMAL(5,2),
  sodium_per_100g DECIMAL(6,2),
  barcode TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela de planos nutricionais
CREATE TABLE IF NOT EXISTS public.nutrition_plans (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  daily_calories DECIMAL(6,2) NOT NULL,
  daily_protein DECIMAL(5,2) NOT NULL,
  daily_carbs DECIMAL(5,2) NOT NULL,
  daily_fat DECIMAL(5,2) NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela de refeições
CREATE TABLE IF NOT EXISTS public.meals (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  nutrition_plan_id UUID REFERENCES public.nutrition_plans(id) ON DELETE SET NULL,
  meal_type meal_type NOT NULL,
  name TEXT NOT NULL,
  planned_date DATE NOT NULL,
  consumed_at TIMESTAMP WITH TIME ZONE,
  total_calories DECIMAL(6,2),
  total_protein DECIMAL(5,2),
  total_carbs DECIMAL(5,2),
  total_fat DECIMAL(5,2),
  notes TEXT,
  photo_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela de alimentos da refeição
CREATE TABLE IF NOT EXISTS public.meal_foods (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  meal_id UUID NOT NULL REFERENCES public.meals(id) ON DELETE CASCADE,
  food_item_id UUID NOT NULL REFERENCES public.food_items(id) ON DELETE CASCADE,
  quantity_grams DECIMAL(6,2) NOT NULL,
  calories DECIMAL(6,2) NOT NULL,
  protein DECIMAL(5,2) NOT NULL,
  carbs DECIMAL(5,2) NOT NULL,
  fat DECIMAL(5,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela de registros de hidratação
CREATE TABLE IF NOT EXISTS public.hydration_records (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  daily_goal_ml INTEGER NOT NULL,
  consumed_ml INTEGER DEFAULT 0,
  reminder_interval_minutes INTEGER DEFAULT 60,
  silent_hours_start TIME,
  silent_hours_end TIME,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, date)
);

-- Tabela de entradas de hidratação
CREATE TABLE IF NOT EXISTS public.hydration_entries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  hydration_record_id UUID NOT NULL REFERENCES public.hydration_records(id) ON DELETE CASCADE,
  amount_ml INTEGER NOT NULL,
  recorded_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela de progresso de peso
CREATE TABLE IF NOT EXISTS public.weight_progress (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  weight_kg DECIMAL(5,2) NOT NULL,
  recorded_date DATE NOT NULL,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, recorded_date)
);

-- Tabela de medidas corporais
CREATE TABLE IF NOT EXISTS public.body_measurements (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  recorded_date DATE NOT NULL,
  waist_cm DECIMAL(5,2),
  hip_cm DECIMAL(5,2),
  chest_cm DECIMAL(5,2),
  arm_cm DECIMAL(5,2),
  thigh_cm DECIMAL(5,2),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, recorded_date)
);

-- Tabela de fotos de progresso
CREATE TABLE IF NOT EXISTS public.progress_photos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  photo_url TEXT NOT NULL,
  photo_type TEXT CHECK (photo_type IN ('front', 'side', 'back')),
  recorded_date DATE NOT NULL,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela de metas pessoais
CREATE TABLE IF NOT EXISTS public.user_goals (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  goal_type TEXT NOT NULL,
  target_value DECIMAL(10,2) NOT NULL,
  current_value DECIMAL(10,2) DEFAULT 0,
  target_date DATE,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela de conquistas
CREATE TABLE IF NOT EXISTS public.achievements (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  achievement_type achievement_type NOT NULL,
  icon TEXT,
  points INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela de conquistas do usuário
CREATE TABLE IF NOT EXISTS public.user_achievements (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  achievement_id UUID NOT NULL REFERENCES public.achievements(id) ON DELETE CASCADE,
  earned_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, achievement_id)
);

-- Tabela de eventos do calendário
CREATE TABLE IF NOT EXISTS public.calendar_events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  event_type TEXT NOT NULL,
  event_date DATE NOT NULL,
  event_time TIME,
  duration_minutes INTEGER,
  description TEXT,
  reminder_minutes INTEGER,
  completed BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela de configurações do usuário
CREATE TABLE IF NOT EXISTS public.user_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  theme_preference TEXT DEFAULT 'light',
  notification_workout BOOLEAN DEFAULT true,
  notification_meal BOOLEAN DEFAULT true,
  notification_hydration BOOLEAN DEFAULT true,
  notification_progress BOOLEAN DEFAULT true,
  notification_email BOOLEAN DEFAULT false,
  timezone TEXT DEFAULT 'UTC',
  units_weight TEXT DEFAULT 'kg',
  units_distance TEXT DEFAULT 'km',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela de histórico de atividades
CREATE TABLE IF NOT EXISTS public.activity_history (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  activity_type TEXT NOT NULL,
  activity_data JSONB NOT NULL,
  points_earned INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Função para atualizar updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers para updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_exercises_updated_at
  BEFORE UPDATE ON public.exercises
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_workouts_updated_at
  BEFORE UPDATE ON public.workouts
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_food_items_updated_at
  BEFORE UPDATE ON public.food_items
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_nutrition_plans_updated_at
  BEFORE UPDATE ON public.nutrition_plans
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_meals_updated_at
  BEFORE UPDATE ON public.meals
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_hydration_records_updated_at
  BEFORE UPDATE ON public.hydration_records
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_user_goals_updated_at
  BEFORE UPDATE ON public.user_goals
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_calendar_events_updated_at
  BEFORE UPDATE ON public.calendar_events
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_user_settings_updated_at
  BEFORE UPDATE ON public.user_settings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Habilitar RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workout_exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.food_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.nutrition_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meal_foods ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hydration_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hydration_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.weight_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.body_measurements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.progress_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.calendar_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_history ENABLE ROW LEVEL SECURITY;

-- Políticas RLS
CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Exercises are viewable by everyone"
  ON public.exercises FOR SELECT
  USING (true);

CREATE POLICY "Users can view their own workouts"
  ON public.workouts FOR ALL
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their workout exercises"
  ON public.workout_exercises FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.workouts 
      WHERE workouts.id = workout_exercises.workout_id 
      AND workouts.user_id = auth.uid()
    )
  );

CREATE POLICY "Food items are viewable by everyone"
  ON public.food_items FOR SELECT
  USING (true);

CREATE POLICY "Users can manage their nutrition plans"
  ON public.nutrition_plans FOR ALL
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their meals"
  ON public.meals FOR ALL
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their meal foods"
  ON public.meal_foods FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.meals 
      WHERE meals.id = meal_foods.meal_id 
      AND meals.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can manage their hydration records"
  ON public.hydration_records FOR ALL
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their hydration entries"
  ON public.hydration_entries FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.hydration_records 
      WHERE hydration_records.id = hydration_entries.hydration_record_id 
      AND hydration_records.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can manage their weight progress"
  ON public.weight_progress FOR ALL
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their body measurements"
  ON public.body_measurements FOR ALL
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their progress photos"
  ON public.progress_photos FOR ALL
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their goals"
  ON public.user_goals FOR ALL
  USING (auth.uid() = user_id);

CREATE POLICY "Achievements are viewable by everyone"
  ON public.achievements FOR SELECT
  USING (true);

CREATE POLICY "Users can view their achievements"
  ON public.user_achievements FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can earn achievements"
  ON public.user_achievements FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can manage their calendar events"
  ON public.calendar_events FOR ALL
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their settings"
  ON public.user_settings FOR ALL
  USING (auth.uid() = user_id);

CREATE POLICY "Users can view their activity history"
  ON public.activity_history FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert activity history"
  ON public.activity_history FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Função para criar perfil automaticamente
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data ->> 'full_name', ''));
  
  INSERT INTO public.user_settings (user_id)
  VALUES (NEW.id);
  
  RETURN NEW;
END;
$$;

-- Trigger para criar perfil automaticamente
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Função para adicionar água
CREATE OR REPLACE FUNCTION public.add_water(record_id uuid, amount integer)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE public.hydration_records
  SET consumed_ml = consumed_ml + amount
  WHERE id = record_id;
END;
$$;