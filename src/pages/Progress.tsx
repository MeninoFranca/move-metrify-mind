import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { useProgress } from '@/contexts/ProgressContext';
import { Medidas, MetaProgresso } from '@/types/progress';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const Progress = () => {
  const {
    registros,
    metas,
    estatisticas,
    adicionarRegistro,
    adicionarMeta,
    calcularIMC
  } = useProgress();

  const [novasMedidas, setNovasMedidas] = useState<Medidas>({
    peso: 0,
    altura: 0
  });

  const [novaMeta, setNovaMeta] = useState<Omit<MetaProgresso, 'id' | 'progresso'>>({
    userId: 'user123', // Temporário
    tipo: 'peso',
    descricao: '',
    valorInicial: 0,
    valorAlvo: 0,
    valorAtual: 0,
    unidade: 'kg',
    dataInicio: new Date(),
    dataAlvo: new Date(),
    concluida: false
  });

  const handleSubmitMedidas = (e: React.FormEvent) => {
    e.preventDefault();
    adicionarRegistro({
      userId: 'user123', // Temporário
      data: new Date(),
      medidas: novasMedidas,
      peso: novasMedidas.peso,
      humor: 'bom',
      energia: 'media',
      sono: 8,
      hidratacao: 2000
    });
  };

  const handleSubmitMeta = (e: React.FormEvent) => {
    e.preventDefault();
    adicionarMeta(novaMeta);
  };

  const dadosGrafico = registros.map(registro => ({
    data: new Date(registro.data).toLocaleDateString(),
    peso: registro.peso,
    imc: calcularIMC(registro.peso, registro.medidas.altura)
  }));

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Tracking de Progresso</h1>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="p-4">
          <h3 className="font-semibold text-sm text-gray-500">Média de Peso</h3>
          <p className="text-2xl font-bold">{estatisticas.mediaPeso.toFixed(1)} kg</p>
        </Card>
        <Card className="p-4">
          <h3 className="font-semibold text-sm text-gray-500">Dias Treinados</h3>
          <p className="text-2xl font-bold">{estatisticas.diasTreinados}</p>
        </Card>
        <Card className="p-4">
          <h3 className="font-semibold text-sm text-gray-500">Metas Concluídas</h3>
          <p className="text-2xl font-bold">{estatisticas.metasConcluidas}</p>
        </Card>
        <Card className="p-4">
          <h3 className="font-semibold text-sm text-gray-500">Sequência Atual</h3>
          <p className="text-2xl font-bold">{estatisticas.diasConsecutivos} dias</p>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Gráfico de Progresso */}
        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-4">Evolução</h2>
          <LineChart width={500} height={300} data={dadosGrafico}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="data" />
            <YAxis yAxisId="left" />
            <YAxis yAxisId="right" orientation="right" />
            <Tooltip />
            <Legend />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="peso"
              stroke="#8884d8"
              name="Peso (kg)"
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="imc"
              stroke="#82ca9d"
              name="IMC"
            />
          </LineChart>
        </Card>

        {/* Formulário de Medidas */}
        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-4">Registrar Medidas</h2>
          <form onSubmit={handleSubmitMedidas} className="space-y-4">
            <div>
              <Label htmlFor="peso">Peso (kg)</Label>
              <Input
                id="peso"
                type="number"
                step="0.1"
                value={novasMedidas.peso}
                onChange={(e) => setNovasMedidas({
                  ...novasMedidas,
                  peso: Number(e.target.value)
                })}
                required
              />
            </div>

            <div>
              <Label htmlFor="altura">Altura (cm)</Label>
              <Input
                id="altura"
                type="number"
                value={novasMedidas.altura}
                onChange={(e) => setNovasMedidas({
                  ...novasMedidas,
                  altura: Number(e.target.value)
                })}
                required
              />
            </div>

            <div>
              <Label htmlFor="pescoco">Pescoço (cm)</Label>
              <Input
                id="pescoco"
                type="number"
                step="0.1"
                value={novasMedidas.pescoco || ''}
                onChange={(e) => setNovasMedidas({
                  ...novasMedidas,
                  pescoco: Number(e.target.value)
                })}
              />
            </div>

            <div>
              <Label htmlFor="cintura">Cintura (cm)</Label>
              <Input
                id="cintura"
                type="number"
                step="0.1"
                value={novasMedidas.cintura || ''}
                onChange={(e) => setNovasMedidas({
                  ...novasMedidas,
                  cintura: Number(e.target.value)
                })}
              />
            </div>

            <Button type="submit" className="w-full">
              Salvar Medidas
            </Button>
          </form>
        </Card>

        {/* Formulário de Meta */}
        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-4">Nova Meta</h2>
          <form onSubmit={handleSubmitMeta} className="space-y-4">
            <div>
              <Label htmlFor="tipo">Tipo de Meta</Label>
              <Select
                value={novaMeta.tipo}
                onChange={(e) => setNovaMeta({
                  ...novaMeta,
                  tipo: e.target.value as MetaProgresso['tipo']
                })}
              >
                <option value="peso">Peso</option>
                <option value="medida">Medida</option>
                <option value="treino">Treino</option>
                <option value="nutricao">Nutrição</option>
              </Select>
            </div>

            <div>
              <Label htmlFor="descricao">Descrição</Label>
              <Input
                id="descricao"
                value={novaMeta.descricao}
                onChange={(e) => setNovaMeta({
                  ...novaMeta,
                  descricao: e.target.value
                })}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="valorInicial">Valor Inicial</Label>
                <Input
                  id="valorInicial"
                  type="number"
                  step="0.1"
                  value={novaMeta.valorInicial}
                  onChange={(e) => setNovaMeta({
                    ...novaMeta,
                    valorInicial: Number(e.target.value)
                  })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="valorAlvo">Valor Alvo</Label>
                <Input
                  id="valorAlvo"
                  type="number"
                  step="0.1"
                  value={novaMeta.valorAlvo}
                  onChange={(e) => setNovaMeta({
                    ...novaMeta,
                    valorAlvo: Number(e.target.value)
                  })}
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="unidade">Unidade</Label>
              <Input
                id="unidade"
                value={novaMeta.unidade}
                onChange={(e) => setNovaMeta({
                  ...novaMeta,
                  unidade: e.target.value
                })}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="dataInicio">Data Início</Label>
                <Input
                  id="dataInicio"
                  type="date"
                  value={novaMeta.dataInicio.toISOString().split('T')[0]}
                  onChange={(e) => setNovaMeta({
                    ...novaMeta,
                    dataInicio: new Date(e.target.value)
                  })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="dataAlvo">Data Alvo</Label>
                <Input
                  id="dataAlvo"
                  type="date"
                  value={novaMeta.dataAlvo.toISOString().split('T')[0]}
                  onChange={(e) => setNovaMeta({
                    ...novaMeta,
                    dataAlvo: new Date(e.target.value)
                  })}
                  required
                />
              </div>
            </div>

            <Button type="submit" className="w-full">
              Criar Meta
            </Button>
          </form>
        </Card>

        {/* Lista de Metas */}
        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-4">Suas Metas</h2>
          <div className="space-y-4">
            {metas.map((meta) => (
              <div
                key={meta.id}
                className="p-4 border rounded-lg"
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-semibold">{meta.descricao}</h3>
                    <p className="text-sm text-gray-500">
                      {meta.valorAtual} / {meta.valorAlvo} {meta.unidade}
                    </p>
                  </div>
                  <span className={`px-2 py-1 rounded text-sm ${
                    meta.concluida ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                  }`}>
                    {meta.concluida ? 'Concluída' : 'Em Progresso'}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-blue-600 h-2.5 rounded-full"
                    style={{ width: `${meta.progresso}%` }}
                  ></div>
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  Meta para {new Date(meta.dataAlvo).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Progress; 