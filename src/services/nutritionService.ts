import { supabase } from '@/integrations/supabase/client';
import { Tables, TablesInsert } from '@/integrations/supabase/types';

export type FoodItem = Tables<'food_items'>;
export type Meal = Tables<'meals'> & { meal_foods?: MealFood[] };
export type MealFood = Tables<'meal_foods'>;
export type NutritionPlan = Tables<'nutrition_plans'>;

export interface MacroTargets {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface NutritionStats {
  consumed: MacroTargets;
  target: MacroTargets;
  percentage: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
}

// Interface para compatibilidade
interface NutritionTargets {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export const nutritionService = {
  // Calcular metas nutricionais baseadas no perfil
  calculateMacroTargets(profile: any): MacroTargets {
    if (!profile.weight || !profile.height || !profile.age) {
      return { calories: 2000, protein: 150, carbs: 200, fat: 60 };
    }

    // Fórmula Mifflin-St Jeor
    let bmr = 10 * profile.weight + 6.25 * profile.height - 5 * profile.age + 5;
    
    // Fator de atividade baseado no nível de experiência
    const activityFactors = {
      beginner: 1.375,
      intermediate: 1.55,
      advanced: 1.725,
    };
    
    const tdee = bmr * (activityFactors[profile.experience_level] || 1.375);
    
    // Ajustar calorias baseado no objetivo
    let targetCalories = tdee;
    switch (profile.fitness_goal) {
      case 'lose_weight':
        targetCalories = tdee - 500;
        break;
      case 'gain_muscle':
        targetCalories = tdee + 300;
        break;
      default:
        targetCalories = tdee;
    }

    // Calcular macros
    const protein = profile.weight * 2; // 2g por kg
    const fat = (targetCalories * 0.25) / 9; // 25% das calorias
    const carbs = (targetCalories - (protein * 4) - (fat * 9)) / 4;

    return {
      calories: Math.round(targetCalories),
      protein: Math.round(protein),
      carbs: Math.round(carbs),
      fat: Math.round(fat),
    };
  },

  // Buscar alimentos
  async searchFoods(query: string): Promise<FoodItem[]> {
    const { data, error } = await supabase
      .from('food_items')
      .select('*')
      .ilike('name', `%${query}%`)
      .limit(20);

    if (error) throw error;
    return data;
  },

  // Buscar biblioteca de alimentos (mantendo compatibilidade)
  async searchFoodLibrary(searchTerm: string): Promise<FoodItem[]> {
    return this.searchFoods(searchTerm);
  },

  // Criar refeição
  async createMeal(meal: TablesInsert<'meals'>): Promise<Meal> {
    const { data, error } = await supabase
      .from('meals')
      .insert(meal)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Buscar refeições do dia
  async getDayMeals(userId: string, date: string): Promise<Meal[]> {
    const { data, error } = await supabase
      .from('meals')
      .select('*')
      .eq('user_id', userId)
      .eq('planned_date', date)
      .order('meal_type');

    if (error) throw error;
    return data;
  },

  // Calcular estatísticas nutricionais do dia
  async getDayNutritionStats(userId: string, date: string, targets: MacroTargets): Promise<NutritionStats> {
    const meals = await this.getDayMeals(userId, date);
    
    const consumed = meals.reduce(
      (acc, meal) => ({
        calories: acc.calories + (meal.total_calories || 0),
        protein: acc.protein + (meal.total_protein || 0),
        carbs: acc.carbs + (meal.total_carbs || 0),
        fat: acc.fat + (meal.total_fat || 0),
      }),
      { calories: 0, protein: 0, carbs: 0, fat: 0 }
    );

    const percentage = {
      calories: targets.calories > 0 ? (consumed.calories / targets.calories) * 100 : 0,
      protein: targets.protein > 0 ? (consumed.protein / targets.protein) * 100 : 0,
      carbs: targets.carbs > 0 ? (consumed.carbs / targets.carbs) * 100 : 0,
      fat: targets.fat > 0 ? (consumed.fat / targets.fat) * 100 : 0,
    };

    return {
      consumed,
      target: targets,
      percentage,
    };
  },

  // Gerar plano alimentar automático
  async generateMealPlan(userId: string, targets: MacroTargets, date: string): Promise<Meal[]> {
    // Distribuição básica dos macros por refeição
    const mealDistribution = {
      breakfast: 0.25,
      morning_snack: 0.1,
      lunch: 0.3,
      afternoon_snack: 0.1,
      dinner: 0.2,
      evening_snack: 0.05,
    };

    const meals: TablesInsert<'meals'>[] = [];

    for (const [mealType, percentage] of Object.entries(mealDistribution)) {
      const mealCalories = targets.calories * percentage;
      const mealProtein = targets.protein * percentage;
      const mealCarbs = targets.carbs * percentage;
      const mealFat = targets.fat * percentage;

      meals.push({
        user_id: userId,
        meal_type: mealType as any,
        name: this.getMealName(mealType as any),
        planned_date: date,
        total_calories: mealCalories,
        total_protein: mealProtein,
        total_carbs: mealCarbs,
        total_fat: mealFat,
      });
    }

    // Inserir todas as refeições
    const { data, error } = await supabase
      .from('meals')
      .insert(meals)
      .select();

    if (error) throw error;
    return data;
  },

  // Gerar e salvar plano completo (mantendo compatibilidade)
  async generateAndSaveFullDayPlan(userId: string, targets: NutritionTargets): Promise<void> {
    const today = new Date().toISOString().split('T')[0];
    await this.generateMealPlan(userId, targets, today);
  },

  // Adicionar refeição (mantendo compatibilidade)
  async addMeal(userId: string, mealData: any): Promise<void> {
    await this.createMeal({
      user_id: userId,
      ...mealData,
      planned_date: mealData.planned_date || new Date().toISOString().split('T')[0],
    });
  },

  // Buscar planos nutricionais
  async getNutritionPlans(userId: string): Promise<NutritionPlan[]> {
    const { data, error } = await supabase
      .from('nutrition_plans')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  // Buscar refeições do usuário
  async getMeals(userId: string): Promise<Meal[]> {
    const { data, error } = await supabase
      .from('meals')
      .select('*')
      .eq('user_id', userId)
      .order('planned_date', { ascending: false });

    if (error) throw error;
    return data;
  },

  getMealName(mealType: string): string {
    const names = {
      breakfast: 'Café da Manhã',
      morning_snack: 'Lanche da Manhã',
      lunch: 'Almoço',
      afternoon_snack: 'Lanche da Tarde',
      dinner: 'Jantar',
      evening_snack: 'Ceia',
    };
    return names[mealType] || 'Refeição';
  },

  // Gerar lista de compras baseada no plano
  generateShoppingList(meals: Meal[]): { category: string; items: string[] }[] {
    // Lista básica por categoria
    return [
      {
        category: 'Proteínas',
        items: ['Frango', 'Peixe', 'Ovos', 'Iogurte Grego']
      },
      {
        category: 'Carboidratos',
        items: ['Arroz Integral', 'Aveia', 'Batata Doce', 'Banana']
      },
      {
        category: 'Vegetais',
        items: ['Brócolis', 'Espinafre', 'Tomate', 'Cenoura']
      },
      {
        category: 'Gorduras Saudáveis',
        items: ['Abacate', 'Azeite', 'Castanhas', 'Sementes']
      }
    ];
  }
};