import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { useProgress } from '@/contexts/ProgressContext';
import { Medidas, MetaProgresso } from '@/types/progress';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Scale, Target, Activity, Trophy, Calendar, ChevronRight } from 'lucide-react';

interface ProgressDisplayProps {
  registros: any[];
  metas: any[];
  estatisticas: any;
}

const ProgressDisplay: React.FC<ProgressDisplayProps> = ({ registros, metas, estatisticas }) => {
  const dadosGrafico = registros.map(registro => ({
    data: new Date(registro.data).toLocaleDateString(),
    peso: registro.peso,
    imc: registro.imc
  }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Seu Progresso</h2>
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={() => {}}>
            Ver Histórico
          </Button>
          <Button onClick={() => {}}>
            Adicionar Registro
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Cards de Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Scale className="h-5 w-5" />
              Média de Peso
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{estatisticas.mediaPeso.toFixed(1)} kg</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Dias Treinados
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{estatisticas.diasTreinados}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5" />
              Metas Concluídas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{estatisticas.metasConcluidas}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Sequência Atual
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{estatisticas.diasConsecutivos} dias</p>
          </CardContent>
        </Card>
      </div>

      {/* Gráfico de Evolução */}
      <Card>
        <CardHeader>
          <CardTitle>Evolução de Peso</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] w-full">
            <LineChart
              width={800}
              height={300}
              data={dadosGrafico}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
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
          </div>
        </CardContent>
      </Card>

      {/* Metas Ativas */}
      <Card>
        <CardHeader>
          <CardTitle>Metas Ativas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {metas.filter(meta => !meta.concluida).map((meta, index) => (
              <div
                key={meta.id}
                className="flex items-start gap-4 p-4 rounded-lg border"
              >
                <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-full bg-primary/10">
                  <Target className="h-6 w-6" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium">{meta.descricao}</h3>
                  <div className="mt-2 flex items-center gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Valor Inicial</p>
                      <p className="font-medium">{meta.valorInicial} {meta.unidade}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Valor Atual</p>
                      <p className="font-medium">{meta.valorAtual} {meta.unidade}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Meta</p>
                      <p className="font-medium">{meta.valorAlvo} {meta.unidade}</p>
                    </div>
                  </div>
                  <div className="mt-2">
                    <div className="h-2 bg-muted rounded-full">
                      <div
                        className="h-full bg-primary rounded-full"
                        style={{
                          width: `${Math.min(100, (meta.valorAtual - meta.valorInicial) / (meta.valorAlvo - meta.valorInicial) * 100)}%`
                        }}
                      />
                    </div>
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

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <ProgressDisplay
          registros={registros}
          metas={metas}
          estatisticas={estatisticas}
        />
      </div>
    </DashboardLayout>
  );
};

export default Progress; 