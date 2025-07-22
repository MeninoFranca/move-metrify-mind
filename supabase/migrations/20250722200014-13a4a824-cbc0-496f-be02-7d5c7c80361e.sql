-- Extensões necessárias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enum para objetivos fitness
CREATE TYPE public.fitness_goal AS ENUM (
  'lose_weight', 
  'gain_muscle', 
  'maintain_weight', 
  'increase_endurance'
);

-- Enum para níveis de experiência
CREATE TYPE public.experience_level AS ENUM (
  'beginner', 
  'intermediate', 
  'advanced'
);

-- Enum para tipos de equipamento
CREATE TYPE public.equipment_type AS ENUM (
  'full_gym', 
  'dumbbells', 
  'bodyweight', 
  'resistance_bands', 
  'none'
);

-- Enum para tipos de treino
CREATE TYPE public.workout_type AS ENUM (
  'strength', 
  'cardio', 
  'hiit', 
  'flexibility'
);

-- Enum para tipos de refeição
CREATE TYPE public.meal_type AS ENUM (
  'breakfast', 
  'morning_snack', 
  'lunch', 
  'afternoon_snack', 
  'dinner', 
  'evening_snack'
);

-- Enum para tipos de achievement
CREATE TYPE public.achievement_type AS ENUM (
  'workout_streak', 
  'weight_goal', 
  'hydration_goal', 
  'workout_count', 
  'consistency'
);

-- Função para atualizar updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Função para criar perfil automaticamente quando usuário se registra
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