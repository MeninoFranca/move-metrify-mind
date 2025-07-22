import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { useNutrition } from '@/contexts/NutritionContext';
import { PreferenciasNutricionais, Refeicao } from '@/types/nutrition';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { 
  Apple, 
  ShoppingCart, 
  Share2, 
  Camera,
  Search,
  Plus,
  ChevronRight,
  Scale,
  Target,
  Droplets
} from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Progress } from '@/components/ui/progress';
import MealRegistration from '@/components/nutrition/MealRegistration';
import ShoppingList from '@/components/nutrition/ShoppingList';

interface NutritionDisplayProps {
  plano: any;
  tracking: any;
  listaCompras: any;
  onRegistrarRefeicao: (refeicao: Refeicao) => void;
  onMarcarItemComprado: (itemId: string) => void;
  onCompartilharLista: () => void;
}

const NutritionDisplay: React.FC<NutritionDisplayProps> = ({
  plano,
  tracking,
  listaCompras,
  onRegistrarRefeicao,
  onMarcarItemComprado,
  onCompartilharLista
}) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Plano Nutricional</h2>
        <div className="flex items-center gap-4">
          <ShoppingList
            lista={listaCompras}
            onMarcarItem={onMarcarItemComprado}
            onCompartilhar={onCompartilharLista}
          />
          <MealRegistration onRegistrar={onRegistrarRefeicao} />
        </div>
      </div>

      {/* Cards de Resumo */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Apple className="h-5 w-5" />
              Calorias
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Consumido</span>
                <span>{Math.round(tracking.caloriasTotal)} kcal</span>
              </div>
              <Progress 
                value={(tracking.caloriasTotal / tracking.meta.calorias) * 100} 
                className="h-2"
              />
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Meta</span>
                <span>{Math.round(tracking.meta.calorias)} kcal</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Macronutrientes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div>
                <div className="flex justify-between text-sm">
                  <span>Proteínas</span>
                  <span>{Math.round(tracking.macrosTotal.proteinas)}g</span>
                </div>
                <Progress 
                  value={(tracking.macrosTotal.proteinas / tracking.meta.macros.proteinas) * 100}
                  className="h-1.5 mt-1"
                />
              </div>
              <div>
                <div className="flex justify-between text-sm">
                  <span>Carboidratos</span>
                  <span>{Math.round(tracking.macrosTotal.carboidratos)}g</span>
                </div>
                <Progress 
                  value={(tracking.macrosTotal.carboidratos / tracking.meta.macros.carboidratos) * 100}
                  className="h-1.5 mt-1"
                />
              </div>
              <div>
                <div className="flex justify-between text-sm">
                  <span>Gorduras</span>
                  <span>{Math.round(tracking.macrosTotal.gorduras)}g</span>
                </div>
                <Progress 
                  value={(tracking.macrosTotal.gorduras / tracking.meta.macros.gorduras) * 100}
                  className="h-1.5 mt-1"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Droplets className="h-5 w-5" />
              Hidratação
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Consumido</span>
                <span>{tracking.agua}ml</span>
              </div>
              <Progress 
                value={(tracking.agua / tracking.meta.agua) * 100} 
                className="h-2"
              />
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Meta</span>
                <span>{tracking.meta.agua}ml</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Lista de Refeições */}
      <Card>
        <CardHeader>
          <CardTitle>Refeições do Dia</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {plano.refeicoes.map((refeicao: Refeicao, index: number) => (
              <div
                key={refeicao.id}
                className="flex items-start gap-4 p-4 rounded-lg border"
              >
                <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-full bg-primary/10">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <h3 className="font-medium">{refeicao.nome}</h3>
                  <p className="text-sm text-muted-foreground">{refeicao.horario}</p>
                  <div className="mt-2">
                    <p>{refeicao.calorias} kcal</p>
                    <p className="text-sm text-muted-foreground">
                      P: {Math.round(refeicao.macros.proteinas)}g • 
                      C: {Math.round(refeicao.macros.carboidratos)}g • 
                      G: {Math.round(refeicao.macros.gorduras)}g
                    </p>
                  </div>
                  <div className="mt-2 text-sm">
                    {refeicao.alimentos.map((item, i) => (
                      <p key={i} className="text-muted-foreground">
                        • {item.quantidade}{item.alimento.unidade} {item.alimento.nome}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const Nutrition = () => {
  const {
    preferencias,
    planoAtual,
    tracking,
    listaCompras,
    salvarPreferencias,
    gerarPlanoAlimentar,
    registrarRefeicao,
    marcarItemComprado,
    compartilharListaCompras
  } = useNutrition();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    
    const novasPreferencias: PreferenciasNutricionais = {
      peso: Number(formData.get('peso')),
      altura: Number(formData.get('altura')),
      idade: Number(formData.get('idade')),
      genero: formData.get('genero') as 'masculino' | 'feminino',
      objetivo: formData.get('objetivo') as PreferenciasNutricionais['objetivo'],
      nivelAtividade: formData.get('nivelAtividade') as PreferenciasNutricionais['nivelAtividade'],
      numeroRefeicoes: Number(formData.get('numeroRefeicoes')),
      restricoes: [],
      preferencias: []
    };

    salvarPreferencias(novasPreferencias);
    gerarPlanoAlimentar();
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {planoAtual && tracking && listaCompras ? (
          <NutritionDisplay
            plano={planoAtual}
            tracking={tracking}
            listaCompras={listaCompras}
            onRegistrarRefeicao={registrarRefeicao}
            onMarcarItemComprado={marcarItemComprado}
            onCompartilharLista={compartilharListaCompras}
          />
        ) : (
          <>
            <h1 className="text-3xl font-bold">Plano Nutricional</h1>
            
            {/* Informações Básicas */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Scale className="h-5 w-5" />
                  Informações Básicas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <Label htmlFor="peso">Peso (kg)</Label>
                      <Input
                        id="peso"
                        name="peso"
                        type="number"
                        defaultValue={preferencias?.peso}
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="altura">Altura (cm)</Label>
                      <Input
                        id="altura"
                        name="altura"
                        type="number"
                        defaultValue={preferencias?.altura}
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="idade">Idade</Label>
                      <Input
                        id="idade"
                        name="idade"
                        type="number"
                        defaultValue={preferencias?.idade}
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="genero">Gênero</Label>
                      <Select name="genero" defaultValue={preferencias?.genero}>
                        <option value="masculino">Masculino</option>
                        <option value="feminino">Feminino</option>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="objetivo">Objetivo</Label>
                    <Select name="objetivo" defaultValue={preferencias?.objetivo}>
                      <option value="perda_peso">Perda de Peso</option>
                      <option value="ganho_massa">Ganho de Massa</option>
                      <option value="manutencao">Manutenção</option>
                      <option value="saude">Saúde Geral</option>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="nivelAtividade">Nível de Atividade</Label>
                    <Select name="nivelAtividade" defaultValue={preferencias?.nivelAtividade}>
                      <option value="sedentario">Sedentário</option>
                      <option value="leve">Levemente Ativo</option>
                      <option value="moderado">Moderadamente Ativo</option>
                      <option value="muito_ativo">Muito Ativo</option>
                      <option value="extremamente_ativo">Extremamente Ativo</option>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="numeroRefeicoes">Número de Refeições</Label>
                    <Select name="numeroRefeicoes" defaultValue={preferencias?.numeroRefeicoes}>
                      <option value="3">3 refeições</option>
                      <option value="4">4 refeições</option>
                      <option value="5">5 refeições</option>
                      <option value="6">6 refeições</option>
                    </Select>
                  </div>

                  <Button type="submit" className="w-full">
                    Gerar Plano Nutricional
                  </Button>
                </form>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Nutrition; 