import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { nutritionService, NutritionPlan, Meal, FoodItem } from '@/services/nutritionService';
import { useAuth } from './AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { TablesInsert } from '@/integrations/supabase/types';
import { calculateNutritionTargets } from '@/services/nutritionCalculator';

interface NutritionContextType {
  plans: NutritionPlan[];
  meals: Meal[];
  isLoading: boolean;
  addMeal: (meal: Omit<TablesInsert<'meals'>, 'id' | 'user_id'>, foods: { food_item_id: string; quantity_grams: number }[]) => Promise<void>;
  generatePlan: () => Promise<void>;
}

const NutritionContext = createContext<NutritionContextType | undefined>(undefined);

export const useNutrition = () => {
  const context = useContext(NutritionContext);
  if (!context) throw new Error('useNutrition must be used within a NutritionProvider');
  return context;
};

export const NutritionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, profile } = useAuth();
  const { toast } = useToast();
  
  const [plans, setPlans] = useState<NutritionPlan[]>([]);
  const [meals, setMeals] = useState<Meal[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = useCallback(async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      const [plansData, mealsData] = await Promise.all([
        nutritionService.getNutritionPlans(user.id),
        nutritionService.getMeals(user.id),
      ]);
      setPlans(plansData);
      setMeals(mealsData);
    } catch (error) {
      toast({ variant: "destructive", title: "Erro ao carregar dados de nutrição." });
    } finally {
      setIsLoading(false);
    }
  }, [user, toast]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const addMeal = async (meal: Omit<TablesInsert<'meals'>, 'id' | 'user_id'>, foods: { food_item_id: string; quantity_grams: number }[]) => {
    // ... (função addMeal inalterada)
  };
  
  const generatePlan = async () => {
      if(!user || !profile) {
          toast({ variant: "destructive", title: "Perfil do usuário não encontrado." });
          return;
      }
      setIsLoading(true);
      try {
          // 1. Calcular metas
          const targets = calculateNutritionTargets(profile);

          // 2. Criar o plano no banco
          const newPlan = await nutritionService.generateAndSaveFullDayPlan(user.id, targets);

          // 3. Atualizar o estado local
          await fetchData();

          toast({ title: "Plano nutricional gerado com sucesso!" });
      } catch (error: any) {
          console.error("Erro ao gerar plano:", error);
          toast({ variant: "destructive", title: "Erro ao gerar plano.", description: error.message });
      } finally {
          setIsLoading(false);
      }
  }

  return (
    <NutritionContext.Provider value={{ plans, meals, isLoading, addMeal, generatePlan }}>
      {children}
    </NutritionContext.Provider>
  );
};