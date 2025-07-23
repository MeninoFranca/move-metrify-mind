// src/services/nutritionService.ts
import { supabase } from '@/integrations/supabase/client';
import { Tables, TablesInsert } from '@/integrations/supabase/types';

export type NutritionPlan = Tables<'nutrition_plans'>;
export type Meal = Tables<'meals'>;
export type FoodItem = Tables<'food_items'>;

export const nutritionService = {
  /**
   * Busca a biblioteca pública de alimentos.
   */
  async getFoodLibrary(): Promise<FoodItem[]> {
    const { data, error } = await supabase.from('food_items').select('*');
    if (error) {
      console.error('Erro ao buscar alimentos:', error);
      throw error;
    }
    return data;
  },

  /**
   * Busca os planos nutricionais do usuário.
   */
  async getNutritionPlans(userId: string): Promise<NutritionPlan[]> {
    const { data, error } = await supabase
      .from('nutrition_plans')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Erro ao buscar planos nutricionais:', error);
      throw error;
    }
    return data;
  },

  /**
   * Salva um novo plano nutricional para o usuário.
   */
  async saveNutritionPlan(plan: TablesInsert<'nutrition_plans'>): Promise<NutritionPlan> {
    const { data, error } = await supabase
      .from('nutrition_plans')
      .insert(plan)
      .select()
      .single();

    if (error) {
      console.error('Erro ao salvar plano nutricional:', error);
      throw error;
    }
    return data;
  },
  
  /**
   * Busca as refeições de um usuário.
   */
  async getMeals(userId: string): Promise<Meal[]> {
    const { data, error } = await supabase
      .from('meals')
      .select('*')
      .eq('user_id', userId)
      .order('planned_date', { ascending: false });

    if (error) {
      console.error('Erro ao buscar refeições:', error);
      throw error;
    }
    return data;
  },

  /**
   * Salva uma nova refeição.
   */
  async saveMeal(meal: TablesInsert<'meals'>): Promise<Meal> {
     const { data, error } = await supabase
      .from('meals')
      .insert(meal)
      .select()
      .single();

    if (error) {
      console.error('Erro ao salvar refeição:', error);
      throw error;
    }
    // Aqui, você também salvaria os `meal_foods` associados.
    // Esta parte pode ser expandida conforme a necessidade.
    return data;
  }
};
