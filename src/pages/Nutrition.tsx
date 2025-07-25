import React from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useNutrition } from '@/contexts/NutritionContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, Sparkles } from 'lucide-react';
import MealRegistration from '@/components/nutrition/MealRegistration';
import MealPlanDisplay from '@/components/nutrition/MealPlanDisplay';

const Nutrition = () => {
  const { plans, meals, isLoading, addMeal, generatePlan } = useNutrition();

  const latestPlan = plans.length > 0 ? { ...plans[0], meals: meals.filter(m => m.nutrition_plan_id === plans[0].id) } : null;

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-full">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold">Nutrição</h1>
            <div className="flex gap-2">
                <MealRegistration />
                <Button onClick={generatePlan} disabled={isLoading}>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Gerar Novo Plano
                </Button>
            </div>
        </div>

        {latestPlan ? (
             <MealPlanDisplay plan={latestPlan} />
        ) : (
            <Card className="text-center p-8">
                 <CardContent>
                    <p className="text-muted-foreground">Você ainda não tem um plano nutricional.</p>
                    <p className="text-muted-foreground">Clique em "Gerar Novo Plano" para começar!</p>
                 </CardContent>
            </Card>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Nutrition;