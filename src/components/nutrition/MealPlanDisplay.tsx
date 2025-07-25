import React from 'react';
import { NutritionPlan, Meal } from '@/services/nutritionService';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion';
import ShoppingList from './ShoppingList'; // <-- Importação

interface MealPlanDisplayProps {
  plan: NutritionPlan & { meals: Meal[] };
}

const MealPlanDisplay: React.FC<MealPlanDisplayProps> = ({ plan }) => {
  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-center">
            <div>
                <CardTitle>{plan.name}</CardTitle>
                <CardDescription>
                Meta: {plan.daily_calories} kcal (P: {plan.daily_protein}g, C: {plan.daily_carbs}g, G: {plan.daily_fat}g)
                </CardDescription>
            </div>
            {/* Botão da Lista de Compras */}
            <ShoppingList meals={plan.meals} />
        </div>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible className="w-full">
          {plan.meals.map((meal, index) => (
            <AccordionItem value={`item-${index}`} key={meal.id}>
              <AccordionTrigger>
                <div className="flex justify-between w-full pr-4">
                  <span>{meal.name} ({meal.meal_type})</span>
                  <span className="text-sm text-muted-foreground">{meal.total_calories?.toFixed(0)} kcal</span>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <ul className="list-disc pl-5 space-y-1">
                  {meal.meal_foods.map(food => (
                     <li key={food.id} className="text-muted-foreground">
                        {food.quantity_grams}g de {food.food_items.name}
                     </li>
                  ))}
                </ul>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>
    </Card>
  );
};

export default MealPlanDisplay;