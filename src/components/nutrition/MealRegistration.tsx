import React, { useState, useCallback } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { FoodItem } from '@/services/nutritionService';
import { Search, Plus, X } from 'lucide-react';
import { nutritionService } from '@/services/nutritionService';
import { useNutrition } from '@/contexts/NutritionContext';
import { TablesInsert } from '@/integrations/supabase/types';
import { debounce } from 'lodash';

const MealRegistration: React.FC = () => {
  const { addMeal } = useNutrition();
  const [isOpen, setIsOpen] = useState(false);
  const [termoBusca, setTermoBusca] = useState('');
  const [resultadosBusca, setResultadosBusca] = useState<FoodItem[]>([]);
  const [alimentosSelecionados, setAlimentosSelecionados] = useState<FoodItem[]>([]);
  
  const debouncedSearch = useCallback(
    debounce(async (term: string) => {
      const results = await nutritionService.searchFoodLibrary(term);
      setResultadosBusca(results);
    }, 300),
    []
  );

  const handleBuscarAlimentos = (term: string) => {
    setTermoBusca(term);
    debouncedSearch(term);
  };

  const handleAdicionarAlimento = (alimento: FoodItem) => {
    setAlimentosSelecionados(prev => [...prev, alimento]);
    setResultadosBusca([]);
    setTermoBusca('');
  };

  const handleRemoverAlimento = (id: string) => {
    setAlimentosSelecionados(prev => prev.filter(item => item.id !== id));
  };
  
  const resetForm = () => {
      setTermoBusca('');
      setResultadosBusca([]);
      setAlimentosSelecionados([]);
      setIsOpen(false);
  }

  const handleRegistrar = async () => {
    if (alimentosSelecionados.length === 0) return;

    const mealData: Omit<TablesInsert<'meals'>, 'id' | 'user_id'> = {
        name: `Refeição de ${new Date().toLocaleDateString()}`,
        meal_type: 'lunch', // Poderia ser selecionável
        planned_date: new Date().toISOString(),
    };

    const foodsData = alimentosSelecionados.map(food => ({
        food_item_id: food.id,
        quantity_grams: 100, // Valor padrão, poderia ser ajustável
    }));

    await addMeal(mealData, foodsData);
    resetForm();
  };
  

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Registrar Refeição
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[400px] sm:w-[540px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Registrar Refeição</SheetTitle>
        </SheetHeader>
        <div className="mt-6 space-y-6 pb-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5" />
                Adicionar Alimentos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Input
                    placeholder="Buscar por frango, arroz, etc..."
                    value={termoBusca}
                    onChange={(e) => handleBuscarAlimentos(e.target.value)}
                />

                {resultadosBusca.length > 0 && (
                  <div className="border rounded-lg divide-y max-h-48 overflow-y-auto">
                    {resultadosBusca.map((alimento) => (
                      <div
                        key={alimento.id}
                        className="p-2 hover:bg-muted cursor-pointer flex justify-between items-center"
                        onClick={() => handleAdicionarAlimento(alimento)}
                      >
                        <div>
                            <p className="font-medium">{alimento.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {alimento.calories_per_100g} kcal / 100g
                            </p>
                        </div>
                        <Plus className="h-4 w-4" />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {alimentosSelecionados.length > 0 && (
            <Card>
                <CardHeader><CardTitle>Sua Refeição</CardTitle></CardHeader>
                <CardContent className="space-y-2">
                    {alimentosSelecionados.map((item) => (
                        <div key={item.id} className="flex justify-between items-center p-2 border-b">
                           <p className="font-medium">{item.name}</p>
                           <Button variant="ghost" size="icon" onClick={() => handleRemoverAlimento(item.id)}>
                               <X className="h-4 w-4" />
                           </Button>
                        </div>
                    ))}
                </CardContent>
            </Card>
          )}

          <Button
            className="w-full"
            disabled={alimentosSelecionados.length === 0}
            onClick={handleRegistrar}
          >
            Salvar Refeição
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MealRegistration;