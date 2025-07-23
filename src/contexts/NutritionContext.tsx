import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { nutritionService, NutritionPlan, Meal, FoodItem } from '@/services/nutritionService';
import { useAuth } from './AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { TablesInsert } from '@/integrations/supabase/types';

interface NutritionContextType {
  plans: NutritionPlan[];
  meals: Meal[];
  foodLibrary: FoodItem[];
  isLoading: boolean;
  addPlan: (plan: Omit<TablesInsert<'nutrition_plans'>, 'user_id' | 'id'>) => Promise<void>;
}

const NutritionContext = createContext<NutritionContextType | undefined>(undefined);

export const useNutrition = () => {
  const context = useContext(NutritionContext);
  if (!context) throw new Error('useNutrition must be used within a NutritionProvider');
  return context;
};

export const NutritionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [plans, setPlans] = useState<NutritionPlan[]>([]);
  const [meals, setMeals] = useState<Meal[]>([]);
  const [foodLibrary, setFoodLibrary] = useState<FoodItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = useCallback(async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      const [plansData, mealsData, foodData] = await Promise.all([
        nutritionService.getNutritionPlans(user.id),
        nutritionService.getMeals(user.id),
        nutritionService.getFoodLibrary(),
      ]);
      setPlans(plansData);
      setMeals(mealsData);
      setFoodLibrary(foodData);
    } catch (error) {
      toast({ variant: "destructive", title: "Erro ao carregar dados de nutrição." });
    } finally {
      setIsLoading(false);
    }
  }, [user, toast]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const addPlan = async (plan: Omit<TablesInsert<'nutrition_plans'>, 'user_id' | 'id'>) => {
    if (!user) return;
    try {
      const newPlan = await nutritionService.saveNutritionPlan({ ...plan, user_id: user.id });
      setPlans(prev => [newPlan, ...prev]);
      toast({ title: "Plano nutricional salvo com sucesso!" });
    } catch (error) {
      toast({ variant: "destructive", title: "Erro ao salvar plano." });
    }
  };

  return (
    <NutritionContext.Provider value={{ plans, meals, foodLibrary, isLoading, addPlan }}>
      {children}
    </NutritionContext.Provider>
  );
};