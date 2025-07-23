import React from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useNutrition } from '@/contexts/NutritionContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

const Nutrition = () => {
  const { plans, meals, isLoading } = useNutrition();

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
        <h1 className="text-3xl font-bold">Nutrição</h1>
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader><CardTitle>Meus Planos Nutricionais</CardTitle></CardHeader>
            <CardContent>
              {plans.length > 0 ? (
                <ul>
                  {plans.map(plan => (
                    <li key={plan.id} className="border-b py-2">{plan.name} - {plan.daily_calories} kcal</li>
                  ))}
                </ul>
              ) : (
                <p className="text-muted-foreground">Nenhum plano nutricional encontrado.</p>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>Últimas Refeições</CardTitle></CardHeader>
            <CardContent>
              {meals.length > 0 ? (
                <ul>
                  {meals.slice(0, 5).map(meal => (
                    <li key={meal.id} className="border-b py-2">{meal.name} - {new Date(meal.planned_date).toLocaleDateString()}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-muted-foreground">Nenhuma refeição registrada.</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Nutrition;