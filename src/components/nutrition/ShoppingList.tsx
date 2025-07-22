import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Checkbox } from '@/components/ui/checkbox';
import { ListaCompras } from '@/types/nutrition';
import { ShoppingCart, Share2, Check } from 'lucide-react';

interface ShoppingListProps {
  lista: ListaCompras;
  onMarcarItem: (itemId: string) => void;
  onCompartilhar: () => void;
}

const ShoppingList: React.FC<ShoppingListProps> = ({
  lista,
  onMarcarItem,
  onCompartilhar
}) => {
  // Agrupa itens por categoria
  const itensPorCategoria = lista.itens.reduce((acc, item) => {
    const categoria = item.alimento.categoria;
    if (!acc[categoria]) {
      acc[categoria] = [];
    }
    acc[categoria].push(item);
    return acc;
  }, {} as Record<string, typeof lista.itens>);

  // Calcula progresso
  const totalItens = lista.itens.length;
  const itensComprados = lista.itens.filter(item => item.comprado).length;
  const progresso = Math.round((itensComprados / totalItens) * 100);

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">
          <ShoppingCart className="h-4 w-4 mr-2" />
          Lista de Compras
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[400px] sm:w-[540px]">
        <SheetHeader>
          <SheetTitle>Lista de Compras</SheetTitle>
        </SheetHeader>
        <div className="mt-6 space-y-6">
          {/* Progresso */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h3 className="font-medium">Progresso</h3>
                  <p className="text-sm text-muted-foreground">
                    {itensComprados} de {totalItens} itens comprados
                  </p>
                </div>
                <div className="text-2xl font-bold">
                  {progresso}%
                </div>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary transition-all"
                  style={{ width: `${progresso}%` }}
                />
              </div>
            </CardContent>
          </Card>

          {/* Lista por Categoria */}
          {Object.entries(itensPorCategoria).map(([categoria, itens]) => (
            <Card key={categoria}>
              <CardHeader>
                <CardTitle className="capitalize">{categoria}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {itens.map((item) => (
                    <div
                      key={item.alimento.id}
                      className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted"
                    >
                      <Checkbox
                        checked={item.comprado}
                        onCheckedChange={() => onMarcarItem(item.alimento.id)}
                      />
                      <div className="flex-1">
                        <p className={item.comprado ? 'line-through text-muted-foreground' : ''}>
                          {item.alimento.nome}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {item.quantidade}{item.alimento.unidade}
                        </p>
                      </div>
                      {item.comprado && (
                        <Check className="h-4 w-4 text-primary" />
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}

          {/* Botão Compartilhar */}
          <Button
            className="w-full"
            variant="outline"
            onClick={onCompartilhar}
          >
            <Share2 className="h-4 w-4 mr-2" />
            Compartilhar Lista
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default ShoppingList; 