import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Utensils, Calculator, ShoppingCart, Camera, Search, Plus, CheckCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { nutritionService, MacroTargets, NutritionStats } from '@/services/nutritionService';
import { toast } from '@/hooks/use-toast';
import { useUser } from '@/contexts/UserContext';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';

const mealTypes = [
  { value: 'breakfast', label: 'Café da Manhã', icon: '🌅', time: '07:00' },
  { value: 'morning_snack', label: 'Lanche Manhã', icon: '🥪', time: '10:00' },
  { value: 'lunch', label: 'Almoço', icon: '🍽️', time: '12:30' },
  { value: 'afternoon_snack', label: 'Lanche Tarde', icon: '🍎', time: '15:30' },
  { value: 'dinner', label: 'Jantar', icon: '🌙', time: '19:00' },
  { value: 'evening_snack', label: 'Ceia', icon: '🥛', time: '21:30' },
];

import ModernLayout from '@/components/layout/ModernLayout';

// Componente de Chatbot Nutricionista
function NutritionChatbot() {
  const [messages, setMessages] = useState([
    { from: 'bot', text: 'Olá! Sou sua nutricionista virtual. Como posso te ajudar hoje?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  async function sendMessage(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim()) return;
    const userMsg = { from: 'user', text: input };
    setMessages((msgs) => [...msgs, userMsg]);
    setInput('');
    setLoading(true);
    try {
      const res = await fetch('https://eoz9dvmo1ewuj61.m.pipedream.net', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input })
      });
      const data = await res.json();
      let botMsg = (data.message || 'Desculpe, não entendi. Pode reformular?').replace(/[\#\*]/g, '');
      setMessages((msgs) => [...msgs, { from: 'bot', text: botMsg }]);
    } catch {
      setMessages((msgs) => [...msgs, { from: 'bot', text: 'Erro ao conectar com a IA.' }]);
    }
    setLoading(false);
  }

  // Animação de digitando
  function TypingIndicator() {
    return (
      <div className="flex items-end gap-2">
        <div className="bg-muted px-4 py-2 rounded-2xl rounded-bl-none max-w-xs text-sm text-muted-foreground animate-pulse">
          Digitando<span className="inline-block animate-bounce">...</span>
        </div>
      </div>
    );
  }

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Chat com Nutricionista Virtual</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64 overflow-y-auto flex flex-col gap-2 mb-2 bg-muted/50 rounded p-2">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={
                msg.from === 'user'
                  ? 'flex justify-end'
                  : 'flex justify-start'
              }
            >
              <div
                className={
                  'whitespace-pre-line break-words px-4 py-2 rounded-2xl max-w-[75%] shadow ' +
                  (msg.from === 'user'
                    ? 'bg-primary text-primary-foreground rounded-br-none'
                    : 'bg-muted text-muted-foreground rounded-bl-none')
                }
                style={{ wordBreak: 'break-word' }}
              >
                {msg.text}
              </div>
            </div>
          ))}
          {loading && <TypingIndicator />}
        </div>
        <form onSubmit={sendMessage} className="flex gap-2">
          <Textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Digite sua dúvida nutricional..."
            rows={1}
            className="flex-1 resize-none"
            disabled={loading}
            style={{ minHeight: 40 }}
          />
          <Button type="submit" disabled={loading || !input.trim()}>Enviar</Button>
        </form>
      </CardContent>
    </Card>
  );
}

export default function Nutrition() {
  const { profile } = useAuth();
  const { usuario } = useUser();
  const [activeTab, setActiveTab] = useState('overview');
  const [macroTargets, setMacroTargets] = useState<MacroTargets | null>(null);
  const [nutritionStats, setNutritionStats] = useState<NutritionStats | null>(null);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [shoppingList, setShoppingList] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);

  useEffect(() => {
    if (profile) {
      const targets = nutritionService.calculateMacroTargets(profile);
      setMacroTargets(targets);
      loadNutritionStats(targets);
    }
  }, [profile, selectedDate]);

  const loadNutritionStats = async (targets: MacroTargets) => {
    if (!profile?.user_id) return;
    
    try {
      const stats = await nutritionService.getDayNutritionStats(
        profile.user_id, 
        selectedDate, 
        targets
      );
      setNutritionStats(stats);
    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error);
    }
  };

  const generateMealPlan = async () => {
    if (!profile?.user_id || !macroTargets) return;

    try {
      const meals = await nutritionService.generateMealPlan(
        profile.user_id,
        macroTargets,
        selectedDate
      );

      const shopping = nutritionService.generateShoppingList(meals);
      setShoppingList(shopping);

      toast({
        title: "Plano Gerado!",
        description: "Seu plano alimentar personalizado foi criado com sucesso.",
      });

      // Recarregar estatísticas
      loadNutritionStats(macroTargets);
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível gerar o plano alimentar.",
        variant: "destructive",
      });
    }
  };

  const searchFoods = async () => {
    if (!searchQuery.trim()) return;

    try {
      const results = await nutritionService.searchFoods(searchQuery);
      setSearchResults(results);
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao buscar alimentos.",
        variant: "destructive",
      });
    }
  };

  const MacroCard = ({ label, current, target, unit, color }: any) => {
    const percentage = target > 0 ? (current / target) * 100 : 0;
    
    return (
      <Card>
        <CardContent className="p-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium">{label}</span>
            <span className="text-xs text-muted-foreground">
              {current.toFixed(1)}/{target}{unit}
            </span>
          </div>
          <Progress value={Math.min(percentage, 100)} className="h-2" />
          <span className="text-xs text-muted-foreground mt-1">
            {percentage.toFixed(0)}%
          </span>
        </CardContent>
      </Card>
    );
  };

  return (
    <ModernLayout>
      <div className="space-y-6">
        {/* Perfil do Usuário */}
        {usuario && (
          <Card className="mb-4">
            <CardContent className="flex flex-col md:flex-row gap-4 items-center md:items-end justify-between p-4">
              <div className="flex items-center gap-4">
                {usuario.foto && (
                  <Avatar>
                    <AvatarImage src={usuario.foto} alt={usuario.nome} />
                    <AvatarFallback>{usuario.nome[0]}</AvatarFallback>
                  </Avatar>
                )}
                <div>
                  <div className="font-bold text-lg">{usuario.nome}</div>
                  <div className="text-sm text-muted-foreground">
                    Idade: {Math.floor((new Date().getTime() - new Date(usuario.dataNascimento).getTime()) / (365.25*24*60*60*1000))} anos | Gênero: {usuario.genero}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Altura: {usuario.altura} cm | Peso: {usuario.peso} kg
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Nível de Atividade: {usuario.nivelAtividade} | Objetivo: {usuario.objetivo}
                  </div>
                  {usuario.restricoesAlimentares.length > 0 && (
                    <div className="text-xs text-muted-foreground">Restrições: {usuario.restricoesAlimentares.join(', ')}</div>
                  )}
                  {usuario.preferenciasAlimentares.length > 0 && (
                    <div className="text-xs text-muted-foreground">Preferências: {usuario.preferenciasAlimentares.join(', ')}</div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )}
        {/* Chatbot */}
        <NutritionChatbot />
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Utensils className="h-8 w-8 text-primary" />
            Nutrição
          </h1>
          <div className="flex gap-2">
            <Input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-auto"
            />
            <Button onClick={generateMealPlan}>
              <Plus className="mr-2 h-4 w-4" />
              Gerar Plano
            </Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">
              <Calculator className="mr-2 h-4 w-4" />
              Resumo
            </TabsTrigger>
            <TabsTrigger value="meals">
              <Utensils className="mr-2 h-4 w-4" />
              Refeições
            </TabsTrigger>
            <TabsTrigger value="tracking">
              <Camera className="mr-2 h-4 w-4" />
              Registro
            </TabsTrigger>
            <TabsTrigger value="shopping">
              <ShoppingCart className="mr-2 h-4 w-4" />
              Compras
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Metas Nutricionais */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="h-5 w-5" />
                  Metas Diárias Personalizadas
                </CardTitle>
              </CardHeader>
              <CardContent>
                {macroTargets && nutritionStats && (
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <MacroCard
                      label="Calorias"
                      current={nutritionStats.consumed.calories}
                      target={nutritionStats.target.calories}
                      unit=" kcal"
                      color="blue"
                    />
                    <MacroCard
                      label="Proteínas"
                      current={nutritionStats.consumed.protein}
                      target={nutritionStats.target.protein}
                      unit="g"
                      color="red"
                    />
                    <MacroCard
                      label="Carboidratos"
                      current={nutritionStats.consumed.carbs}
                      target={nutritionStats.target.carbs}
                      unit="g"
                      color="green"
                    />
                    <MacroCard
                      label="Gorduras"
                      current={nutritionStats.consumed.fat}
                      target={nutritionStats.target.fat}
                      unit="g"
                      color="yellow"
                    />
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Distribuição de Macros */}
            <Card>
              <CardHeader>
                <CardTitle>Distribuição de Macronutrientes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center text-muted-foreground">
                    Gráfico de distribuição será implementado aqui
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="meals" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {mealTypes.map((meal) => (
                <Card key={meal.value} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <span className="text-2xl">{meal.icon}</span>
                        {meal.label}
                      </CardTitle>
                      <Badge variant="outline">{meal.time}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-3">
                      <div className="text-sm text-muted-foreground">
                        Planejar refeição personalizada
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="flex-1">
                          <Plus className="mr-2 h-3 w-3" />
                          Adicionar
                        </Button>
                        <Button variant="outline" size="sm">
                          <Camera className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="tracking" className="space-y-6">
            {/* Busca de Alimentos */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Search className="h-5 w-5" />
                  Buscar Alimentos
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="Digite o nome do alimento..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1"
                  />
                  <Button onClick={searchFoods}>
                    <Search className="h-4 w-4" />
                  </Button>
                </div>

                {searchResults.length > 0 && (
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {searchResults.map((food) => (
                      <div key={food.id} className="flex justify-between items-center p-3 bg-muted rounded-lg">
                        <div>
                          <p className="font-medium">{food.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {food.calories_per_100g} kcal/100g
                          </p>
                        </div>
                        <Button size="sm">
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Upload de Foto */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Camera className="h-5 w-5" />
                  Registrar com Foto
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
                  <Camera className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground mb-4">
                    Clique para tirar uma foto da sua refeição
                  </p>
                  <Button>
                    <Camera className="mr-2 h-4 w-4" />
                    Capturar Foto
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="shopping" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShoppingCart className="h-5 w-5" />
                  Lista de Compras Automática
                </CardTitle>
              </CardHeader>
              <CardContent>
                {shoppingList.length > 0 ? (
                  <div className="space-y-6">
                    {shoppingList.map((category, index) => (
                      <div key={index}>
                        <h3 className="font-medium mb-3">{category.category}</h3>
                        <div className="space-y-2">
                          {category.items.map((item: string, itemIndex: number) => (
                            <div key={itemIndex} className="flex items-center gap-3">
                              <input type="checkbox" className="rounded" />
                              <span className="flex-1">{item}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                    <Button className="w-full">
                      <ShoppingCart className="mr-2 h-4 w-4" />
                      Compartilhar Lista
                    </Button>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <ShoppingCart className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground mb-4">
                      Gere um plano alimentar para criar sua lista de compras automaticamente
                    </p>
                    <Button onClick={generateMealPlan}>
                      Gerar Lista de Compras
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </ModernLayout>
  );
}