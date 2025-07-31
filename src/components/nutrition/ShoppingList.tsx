import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Checkbox } from '@/components/ui/checkbox';
import { Meal, FoodItem } from '@/services/nutritionService';
import { ShoppingCart, Share2, Check } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface ShoppingListItem {
    id: string;
    name: string;
    quantity: number;
    unit: string;
    category: string;
}

interface ShoppingListProps {
  meals: Meal[];
}

const ShoppingList: React.FC<ShoppingListProps> = ({ meals }) => {
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());

  // Gera e agrupa a lista de compras a partir das refeições
  const shoppingList = useMemo(() => {
    const itemsMap = new Map<string, ShoppingListItem>();

    meals.forEach(meal => {
        meal.meal_foods?.forEach(foodEntry => {
            const itemId = foodEntry.food_item_id;
            const existingItem = itemsMap.get(itemId);
            if (existingItem) {
                existingItem.quantity += foodEntry.quantity_grams;
            } else {
                itemsMap.set(itemId, {
                    id: itemId,
                    name: `Item #${itemId}`,
                    quantity: foodEntry.quantity_grams,
                    unit: 'g',
                    category: 'outros'
                });
            }
        });
    });

    return Array.from(itemsMap.values());
  }, [meals]);
  
   const itemsByCategory = useMemo(() => {
    return shoppingList.reduce((acc, item) => {
      const category = item.category;
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(item);
      return acc;
    }, {} as Record<string, typeof shoppingList>);
  }, [shoppingList]);

  const handleToggleItem = (itemId: string) => {
    setCheckedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(itemId)) {
        newSet.delete(itemId);
      } else {
        newSet.add(itemId);
      }
      return newSet;
    });
  };

  const totalItems = shoppingList.length;
  const itemsChecked = checkedItems.size;
  const progress = totalItems > 0 ? Math.round((itemsChecked / totalItems) * 100) : 0;

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">
          <ShoppingCart className="h-4 w-4 mr-2" />
          Lista de Compras
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[400px] sm:w-[540px] flex flex-col">
        <SheetHeader>
          <SheetTitle>Lista de Compras</SheetTitle>
        </SheetHeader>
        <div className="mt-6 space-y-6 flex-1 overflow-y-auto pr-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h3 className="font-medium">Progresso</h3>
                  <p className="text-sm text-muted-foreground">
                    {itemsChecked} de {totalItems} itens
                  </p>
                </div>
                <div className="text-2xl font-bold">{progress}%</div>
              </div>
              <Progress value={progress} />
            </CardContent>
          </Card>

          {Object.entries(itemsByCategory).map(([category, items]) => (
            <Card key={category}>
              <CardHeader>
                <CardTitle className="capitalize text-lg">{category}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted"
                    >
                      <Checkbox
                        id={item.id}
                        checked={checkedItems.has(item.id)}
                        onCheckedChange={() => handleToggleItem(item.id)}
                      />
                      <label htmlFor={item.id} className="flex-1 cursor-pointer">
                        <p className={checkedItems.has(item.id) ? 'line-through text-muted-foreground' : ''}>
                          {item.name}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {item.quantity}{item.unit}
                        </p>
                      </label>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="mt-auto pt-6 border-t">
             <Button className="w-full" variant="outline">
                <Share2 className="h-4 w-4 mr-2" />
                Compartilhar Lista
            </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default ShoppingList;