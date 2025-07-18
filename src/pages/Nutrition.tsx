import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { useNutrition } from '@/contexts/NutritionContext';
import { PreferenciasNutricionais, ObjetivoNutricional } from '@/types/nutrition';

const Nutrition = () => {
  const {
    preferencias,
    planoAtual,
    salvarPreferencias,
    gerarPlanoAlimentar
  } = useNutrition();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    
    const novasPreferencias: PreferenciasNutricionais = {
      peso: Number(formData.get('peso')),
      altura: Number(formData.get('altura')),
      idade: Number(formData.get('idade')),
      genero: formData.get('genero') as 'masculino' | 'feminino',
      objetivo: formData.get('objetivo') as ObjetivoNutricional,
      nivelAtividade: formData.get('nivelAtividade') as PreferenciasNutricionais['nivelAtividade'],
      numeroRefeicoes: Number(formData.get('numeroRefeicoes')),
      restricoes: [],
      preferencias: []
    };

    salvarPreferencias(novasPreferencias);
    gerarPlanoAlimentar();
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Planner de Dieta</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Formulário de Preferências */}
        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-4">Suas Preferências</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
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

            <div>
              <Label htmlFor="objetivo">Objetivo</Label>
              <Select name="objetivo" defaultValue={preferencias?.objetivo}>
                <option value="perda_peso">Perda de Peso</option>
                <option value="ganho_massa">Ganho de Massa</option>
                <option value="manutencao">Manutenção</option>
                <option value="definicao">Definição</option>
              </Select>
            </div>

            <div>
              <Label htmlFor="nivelAtividade">Nível de Atividade</Label>
              <Select name="nivelAtividade" defaultValue={preferencias?.nivelAtividade}>
                <option value="sedentario">Sedentário</option>
                <option value="moderado">Moderado</option>
                <option value="ativo">Ativo</option>
                <option value="muito_ativo">Muito Ativo</option>
              </Select>
            </div>

            <div>
              <Label htmlFor="numeroRefeicoes">Número de Refeições</Label>
              <Input
                id="numeroRefeicoes"
                name="numeroRefeicoes"
                type="number"
                min="3"
                max="8"
                defaultValue={preferencias?.numeroRefeicoes || 4}
                required
              />
            </div>

            <Button type="submit" className="w-full">
              Gerar Plano Alimentar
            </Button>
          </form>
        </Card>

        {/* Plano Alimentar Atual */}
        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-4">Seu Plano Alimentar</h2>
          {planoAtual ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="font-semibold">Calorias Alvo</p>
                  <p>{Math.round(planoAtual.caloriasAlvo)} kcal</p>
                </div>
                <div>
                  <p className="font-semibold">Objetivo</p>
                  <p className="capitalize">{planoAtual.objetivo.replace('_', ' ')}</p>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Macronutrientes Alvo</h3>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <p>Proteínas</p>
                    <p>{Math.round(planoAtual.macrosAlvo.proteinas)}g</p>
                  </div>
                  <div>
                    <p>Carboidratos</p>
                    <p>{Math.round(planoAtual.macrosAlvo.carboidratos)}g</p>
                  </div>
                  <div>
                    <p>Gorduras</p>
                    <p>{Math.round(planoAtual.macrosAlvo.gorduras)}g</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Refeições</h3>
                {planoAtual.refeicoes.length === 0 ? (
                  <p className="text-gray-500">
                    Nenhuma refeição adicionada ainda.
                  </p>
                ) : (
                  <div className="space-y-2">
                    {planoAtual.refeicoes.map((refeicao) => (
                      <div
                        key={refeicao.id}
                        className="p-3 bg-gray-100 rounded-lg"
                      >
                        <p className="font-semibold">{refeicao.nome}</p>
                        <p className="text-sm text-gray-600">
                          Horário: {refeicao.horario}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <p className="text-gray-500">
              Preencha suas preferências para gerar um plano alimentar.
            </p>
          )}
        </Card>
      </div>
    </div>
  );
};

export default Nutrition; 