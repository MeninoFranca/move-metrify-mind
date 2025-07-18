import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useReminder } from '@/contexts/ReminderContext';
import { TipoLembrete, FrequenciaLembrete, HorarioLembrete } from '@/types/reminder';

const Reminders = () => {
  const {
    lembretes,
    configuracoes,
    adicionarLembrete,
    removerLembrete,
    atualizarLembrete,
    atualizarConfiguracoes,
    ativarLembrete,
    desativarLembrete
  } = useReminder();

  const [novoLembrete, setNovoLembrete] = useState({
    tipo: 'hidratacao' as TipoLembrete,
    titulo: '',
    descricao: '',
    frequencia: 'diaria' as FrequenciaLembrete,
    horarios: [{ hora: 8, minuto: 0 }] as HorarioLembrete[],
    ativo: true,
    userId: 'user123' // Temporário - será integrado com autenticação
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    adicionarLembrete(novoLembrete);
    setNovoLembrete({
      ...novoLembrete,
      titulo: '',
      descricao: ''
    });
  };

  const formatarHorario = (hora: number, minuto: number) => {
    return `${hora.toString().padStart(2, '0')}:${minuto.toString().padStart(2, '0')}`;
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Lembretes e Notificações</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Configurações Gerais */}
        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-4">Configurações</h2>
          
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Hidratação</h3>
              <div className="space-y-2">
                <div>
                  <Label htmlFor="intervaloHidratacao">Intervalo (minutos)</Label>
                  <Input
                    id="intervaloHidratacao"
                    type="number"
                    value={configuracoes.hidratacao.intervalo}
                    onChange={(e) => atualizarConfiguracoes({
                      hidratacao: {
                        ...configuracoes.hidratacao,
                        intervalo: Number(e.target.value)
                      }
                    })}
                  />
                </div>
                <div>
                  <Label htmlFor="metaHidratacao">Meta Diária (ml)</Label>
                  <Input
                    id="metaHidratacao"
                    type="number"
                    value={configuracoes.hidratacao.meta}
                    onChange={(e) => atualizarConfiguracoes({
                      hidratacao: {
                        ...configuracoes.hidratacao,
                        meta: Number(e.target.value)
                      }
                    })}
                  />
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Treinos</h3>
              <div className="space-y-2">
                <div>
                  <Label htmlFor="antecedenciaTreino">Antecedência (minutos)</Label>
                  <Input
                    id="antecedenciaTreino"
                    type="number"
                    value={configuracoes.treino.antecedencia}
                    onChange={(e) => atualizarConfiguracoes({
                      treino: {
                        ...configuracoes.treino,
                        antecedencia: Number(e.target.value)
                      }
                    })}
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={configuracoes.treino.lembreteRecorrente}
                    onCheckedChange={(checked) => atualizarConfiguracoes({
                      treino: {
                        ...configuracoes.treino,
                        lembreteRecorrente: checked
                      }
                    })}
                  />
                  <Label>Lembrete Recorrente</Label>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Refeições</h3>
              <div className="space-y-2">
                <div>
                  <Label htmlFor="antecedenciaRefeicao">Antecedência (minutos)</Label>
                  <Input
                    id="antecedenciaRefeicao"
                    type="number"
                    value={configuracoes.refeicao.antecedencia}
                    onChange={(e) => atualizarConfiguracoes({
                      refeicao: {
                        ...configuracoes.refeicao,
                        antecedencia: Number(e.target.value)
                      }
                    })}
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={configuracoes.refeicao.lembretePreparacao}
                    onCheckedChange={(checked) => atualizarConfiguracoes({
                      refeicao: {
                        ...configuracoes.refeicao,
                        lembretePreparacao: checked
                      }
                    })}
                  />
                  <Label>Lembrete de Preparação</Label>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Novo Lembrete */}
        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-4">Novo Lembrete</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="tipo">Tipo</Label>
              <Select
                value={novoLembrete.tipo}
                onChange={(e) => setNovoLembrete({
                  ...novoLembrete,
                  tipo: e.target.value as TipoLembrete
                })}
              >
                <option value="hidratacao">Hidratação</option>
                <option value="treino">Treino</option>
                <option value="refeicao">Refeição</option>
                <option value="suplemento">Suplemento</option>
                <option value="sono">Sono</option>
              </Select>
            </div>

            <div>
              <Label htmlFor="titulo">Título</Label>
              <Input
                id="titulo"
                value={novoLembrete.titulo}
                onChange={(e) => setNovoLembrete({
                  ...novoLembrete,
                  titulo: e.target.value
                })}
                required
              />
            </div>

            <div>
              <Label htmlFor="descricao">Descrição</Label>
              <Input
                id="descricao"
                value={novoLembrete.descricao}
                onChange={(e) => setNovoLembrete({
                  ...novoLembrete,
                  descricao: e.target.value
                })}
              />
            </div>

            <div>
              <Label htmlFor="frequencia">Frequência</Label>
              <Select
                value={novoLembrete.frequencia}
                onChange={(e) => setNovoLembrete({
                  ...novoLembrete,
                  frequencia: e.target.value as FrequenciaLembrete
                })}
              >
                <option value="diaria">Diária</option>
                <option value="semanal">Semanal</option>
                <option value="personalizada">Personalizada</option>
              </Select>
            </div>

            <div>
              <Label>Horário</Label>
              <div className="flex space-x-2">
                <Input
                  type="number"
                  min="0"
                  max="23"
                  value={novoLembrete.horarios[0].hora}
                  onChange={(e) => setNovoLembrete({
                    ...novoLembrete,
                    horarios: [{
                      ...novoLembrete.horarios[0],
                      hora: Number(e.target.value)
                    }]
                  })}
                  placeholder="Hora"
                />
                <Input
                  type="number"
                  min="0"
                  max="59"
                  value={novoLembrete.horarios[0].minuto}
                  onChange={(e) => setNovoLembrete({
                    ...novoLembrete,
                    horarios: [{
                      ...novoLembrete.horarios[0],
                      minuto: Number(e.target.value)
                    }]
                  })}
                  placeholder="Minuto"
                />
              </div>
            </div>

            <Button type="submit" className="w-full">
              Adicionar Lembrete
            </Button>
          </form>
        </Card>
      </div>

      {/* Lista de Lembretes */}
      <div className="mt-8">
        <h2 className="text-2xl font-semibold mb-4">Seus Lembretes</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {lembretes.map((lembrete) => (
            <Card key={lembrete.id} className="p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-semibold">{lembrete.titulo}</h3>
                  <p className="text-sm text-gray-500">{lembrete.descricao}</p>
                </div>
                <Switch
                  checked={lembrete.ativo}
                  onCheckedChange={(checked) => 
                    checked ? ativarLembrete(lembrete.id) : desativarLembrete(lembrete.id)
                  }
                />
              </div>
              
              <div className="text-sm">
                <p>Tipo: <span className="capitalize">{lembrete.tipo}</span></p>
                <p>Frequência: <span className="capitalize">{lembrete.frequencia}</span></p>
                <p>Horários: {lembrete.horarios.map(h => 
                  formatarHorario(h.hora, h.minuto)
                ).join(', ')}</p>
              </div>

              <Button
                variant="destructive"
                size="sm"
                className="mt-2"
                onClick={() => removerLembrete(lembrete.id)}
              >
                Remover
              </Button>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Reminders; 