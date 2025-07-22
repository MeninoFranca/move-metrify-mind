import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Alimento, Refeicao } from '@/types/nutrition';
import { Camera, Search, Plus, Minus, X } from 'lucide-react';
import { buscarAlimentos, calcularMacrosRefeicao, calcularCaloriasRefeicao } from '@/services/foodService';

interface MealRegistrationProps {
  onRegistrar: (refeicao: Refeicao) => void;
}

const MealRegistration: React.FC<MealRegistrationProps> = ({ onRegistrar }) => {
  const [foto, setFoto] = useState<string | null>(null);
  const [termoBusca, setTermoBusca] = useState('');
  const [resultadosBusca, setResultadosBusca] = useState<Alimento[]>([]);
  const [alimentosSelecionados, setAlimentosSelecionados] = useState<{ alimento: Alimento; quantidade: number }[]>([]);

  const handleBuscarAlimentos = (termo: string) => {
    setTermoBusca(termo);
    const resultados = buscarAlimentos(termo);
    setResultadosBusca(resultados);
  };

  const handleAdicionarAlimento = (alimento: Alimento) => {
    setAlimentosSelecionados(prev => [
      ...prev,
      { alimento, quantidade: alimento.porcao }
    ]);
    setResultadosBusca([]);
    setTermoBusca('');
  };

  const handleRemoverAlimento = (index: number) => {
    setAlimentosSelecionados(prev => prev.filter((_, i) => i !== index));
  };

  const handleAtualizarQuantidade = (index: number, quantidade: number) => {
    setAlimentosSelecionados(prev => prev.map((item, i) => 
      i === index ? { ...item, quantidade } : item
    ));
  };

  const handleUploadFoto = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFoto(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRegistrar = () => {
    if (alimentosSelecionados.length === 0) return;

    const refeicao: Refeicao = {
      id: Date.now().toString(),
      nome: 'Refeição Registrada',
      horario: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      alimentos: alimentosSelecionados,
      calorias: calcularCaloriasRefeicao(alimentosSelecionados),
      macros: calcularMacrosRefeicao(alimentosSelecionados),
      foto
    };

    onRegistrar(refeicao);
    setAlimentosSelecionados([]);
    setFoto(null);
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Registrar Refeição
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[400px] sm:w-[540px]">
        <SheetHeader>
          <SheetTitle>Registrar Refeição</SheetTitle>
        </SheetHeader>
        <div className="mt-6 space-y-6">
          {/* Upload de Foto */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Camera className="h-5 w-5" />
                Foto da Refeição
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center gap-4">
                {foto ? (
                  <div className="relative">
                    <img
                      src={foto}
                      alt="Refeição"
                      className="w-full max-w-sm rounded-lg"
                    />
                    <Button
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2"
                      onClick={() => setFoto(null)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center gap-2 p-8 border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted/50">
                    <Camera className="h-8 w-8 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      Clique para adicionar foto
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleUploadFoto}
                    />
                  </label>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Busca de Alimentos */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5" />
                Adicionar Alimentos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="Buscar alimento..."
                    value={termoBusca}
                    onChange={(e) => handleBuscarAlimentos(e.target.value)}
                  />
                </div>

                {/* Resultados da Busca */}
                {resultadosBusca.length > 0 && (
                  <div className="border rounded-lg divide-y">
                    {resultadosBusca.map((alimento) => (
                      <div
                        key={alimento.id}
                        className="p-2 hover:bg-muted cursor-pointer"
                        onClick={() => handleAdicionarAlimento(alimento)}
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-medium">{alimento.nome}</p>
                            <p className="text-sm text-muted-foreground">
                              {alimento.calorias} kcal / {alimento.porcao}{alimento.unidade}
                            </p>
                          </div>
                          <Plus className="h-4 w-4" />
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Alimentos Selecionados */}
                {alimentosSelecionados.length > 0 && (
                  <div className="space-y-2">
                    <Label>Alimentos Selecionados</Label>
                    <div className="border rounded-lg divide-y">
                      {alimentosSelecionados.map((item, index) => (
                        <div key={index} className="p-2">
                          <div className="flex justify-between items-center">
                            <div>
                              <p className="font-medium">{item.alimento.nome}</p>
                              <p className="text-sm text-muted-foreground">
                                {Math.round(item.alimento.calorias * (item.quantidade / item.alimento.porcao))} kcal
                              </p>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button
                                variant="outline"
                                size="icon"
                                onClick={() => handleAtualizarQuantidade(index, Math.max(0, item.quantidade - item.alimento.porcao))}
                              >
                                <Minus className="h-4 w-4" />
                              </Button>
                              <Input
                                type="number"
                                value={item.quantidade}
                                onChange={(e) => handleAtualizarQuantidade(index, Number(e.target.value))}
                                className="w-20 text-center"
                              />
                              <span className="text-sm text-muted-foreground w-8">
                                {item.alimento.unidade}
                              </span>
                              <Button
                                variant="outline"
                                size="icon"
                                onClick={() => handleAtualizarQuantidade(index, item.quantidade + item.alimento.porcao)}
                              >
                                <Plus className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="destructive"
                                size="icon"
                                onClick={() => handleRemoverAlimento(index)}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Total */}
                    <div className="mt-4 p-4 bg-muted rounded-lg">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-medium">Total</p>
                          <p className="text-sm text-muted-foreground">
                            {Math.round(calcularCaloriasRefeicao(alimentosSelecionados))} kcal
                          </p>
                        </div>
                        <div className="text-sm text-right">
                          <p>P: {Math.round(calcularMacrosRefeicao(alimentosSelecionados).proteinas)}g</p>
                          <p>C: {Math.round(calcularMacrosRefeicao(alimentosSelecionados).carboidratos)}g</p>
                          <p>G: {Math.round(calcularMacrosRefeicao(alimentosSelecionados).gorduras)}g</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Button
            className="w-full"
            disabled={alimentosSelecionados.length === 0}
            onClick={handleRegistrar}
          >
            Registrar Refeição
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MealRegistration; 