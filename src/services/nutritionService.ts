// src/services/nutritionService.ts
import { supabase } from '@/integrations/supabase/client';
import { Tables, TablesInsert } from '@/integrations/supabase/types';

export type NutritionPlan = Tables<'nutrition_plans'>;
export type Meal = Tables<'meals'> & { meal_foods: MealFood[] };
export type FoodItem = Tables<'food_items'>;
export type MealFood = Tables<'meal_foods'> & { food_items: FoodItem };

interface NutritionTargets {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export const nutritionService = {
  /**
   * Busca a biblioteca pública de alimentos com base em um termo de busca.
   */
  async searchFoodLibrary(searchTerm: string): Promise<FoodItem[]> {
    if (!searchTerm) return [];
    
    const { data, error } = await supabase
      .from('food_items')
      .select('*')
      .ilike('name', `%${searchTerm}%`)
      .limit(10);

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
      .select(`
        *,
        meal_foods (
            *,
            food_items (*)
        )
      `)
      .eq('user_id', userId)
      .order('planned_date', { ascending: false });

    if (error) {
      console.error('Erro ao buscar refeições:', error);
      throw error;
    }
    return data as any;
  },

  /**
   * Salva uma nova refeição e seus alimentos associados.
   */
  async saveMeal(meal: TablesInsert<'meals'>, foods: { food_item_id: string; quantity_grams: number }[]): Promise<Meal> {
     // 1. Insere a refeição principal
     const { data: mealData, error: mealError } = await supabase
      .from('meals')
      .insert(meal)
      .select()
      .single();

    if (mealError) {
      console.error('Erro ao salvar refeição:', mealError);
      throw mealError;
    }

    if (!mealData) {
        throw new Error("Falha ao criar a refeição.");
    }

    // 2. Busca os dados completos dos alimentos para calcular macros/calorias
    const foodIds = foods.map(f => f.food_item_id);
    const { data: foodItemsData, error: foodItemsError } = await supabase
        .from('food_items')
        .select('*')
        .in('id', foodIds);

    if(foodItemsError) {
        console.error('Erro ao buscar detalhes dos alimentos:', foodItemsError);
        throw foodItemsError;
    }

    // 3. Prepara os dados para a tabela `meal_foods`
    const mealFoodsToInsert = foods.map(f => {
        const foodDetails = foodItemsData.find(item => item.id === f.food_item_id);
        if (!foodDetails) return null;

        const factor = f.quantity_grams / 100;
        
        return {
            meal_id: mealData.id,
            food_item_id: f.food_item_id,
            quantity_grams: f.quantity_grams,
            calories: (foodDetails.calories_per_100g || 0) * factor,
            protein: (foodDetails.protein_per_100g || 0) * factor,
            carbs: (foodDetails.carbs_per_100g || 0) * factor,
            fat: (foodDetails.fat_per_100g || 0) * factor,
        };
    }).filter(Boolean) as TablesInsert<'meal_foods'>[];

    // 4. Insere os alimentos na tabela de junção
    const { error: mealFoodsError } = await supabase
      .from('meal_foods')
      .insert(mealFoodsToInsert);

    if (mealFoodsError) {
      console.error('Erro ao salvar alimentos da refeição:', mealFoodsError);
      await supabase.from('meals').delete().eq('id', mealData.id);
      throw mealFoodsError;
    }

    // 5. Retorna a refeição completa recém-criada
    const { data: finalMealData, error: finalMealError } = await supabase
        .from('meals')
        .select('*, meal_foods(*, food_items(*))')
        .eq('id', mealData.id)
        .single();
    
    if (finalMealError) throw finalMealError;

    return finalMealData as any;
  },

  /**
   * Gera um plano nutricional completo baseado nas metas do usuário
   */
  async generateAndSaveFullDayPlan(userId: string, targets: NutritionTargets): Promise<NutritionPlan> {
    // 1. Criar o plano nutricional
    const planData: TablesInsert<'nutrition_plans'> = {
      user_id: userId,
      name: `Plano Personalizado - ${new Date().toLocaleDateString('pt-BR')}`,
      daily_calories: targets.calories,
      daily_protein: targets.protein,
      daily_carbs: targets.carbs,
      daily_fat: targets.fat,
      start_date: new Date().toISOString().split('T')[0],
      is_active: true
    };

    const plan = await this.saveNutritionPlan(planData);

    // 2. Buscar alimentos disponíveis
    const { data: availableFoods, error: foodsError } = await supabase
      .from('food_items')
      .select('*')
      .limit(50);

    if (foodsError) throw foodsError;

    // 3. Gerar refeições baseadas nas metas
    const mealTypes: Array<{ type: any; calorieRatio: number; name: string }> = [
      { type: 'breakfast', calorieRatio: 0.25, name: 'Café da Manhã Energético' },
      { type: 'morning_snack', calorieRatio: 0.10, name: 'Lanche da Manhã' },
      { type: 'lunch', calorieRatio: 0.35, name: 'Almoço Balanceado' },
      { type: 'afternoon_snack', calorieRatio: 0.10, name: 'Lanche da Tarde' },
      { type: 'dinner', calorieRatio: 0.20, name: 'Jantar Leve' }
    ];

    for (const mealType of mealTypes) {
      const mealCalories = targets.calories * mealType.calorieRatio;
      
      // Selecionar alimentos aleatórios para a refeição
      const selectedFoods = availableFoods
        .sort(() => 0.5 - Math.random())
        .slice(0, Math.floor(Math.random() * 3) + 2); // 2-4 alimentos por refeição

      const mealData: TablesInsert<'meals'> = {
        user_id: userId,
        nutrition_plan_id: plan.id,
        meal_type: mealType.type,
        name: mealType.name,
        planned_date: new Date().toISOString().split('T')[0]
      };

      const foodsData = selectedFoods.map(food => ({
        food_item_id: food.id,
        quantity_grams: Math.floor(Math.random() * 100) + 50 // 50-150g
      }));

      await this.saveMeal(mealData, foodsData);
    }

    return plan;
  }
};