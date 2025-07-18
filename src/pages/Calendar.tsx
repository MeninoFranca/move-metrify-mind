import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useCalendar } from '@/contexts/CalendarContext';
import { TipoEvento, EventoCalendario } from '@/types/calendar';
import { format, startOfWeek, endOfWeek, eachDayOfInterval, addDays, isSameDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const Calendar = () => {
  const {
    eventos,
    configuracoes,
    estatisticas,
    adicionarEvento,
    marcarConcluido,
    marcarPendente,
    atualizarConfiguracoes,
    filtrarEventos
  } = useCalendar();

  const [dataAtual, setDataAtual] = useState(new Date());
  const [novoEvento, setNovoEvento] = useState<Omit<EventoCalendario, 'id'>>({
    userId: 'user123', // Temporário
    tipo: 'treino',
    titulo: '',
    descricao: '',
    dataInicio: new Date(),
    dataFim: new Date(),
    recorrente: false,
    cor: '#3B82F6',
    concluido: false
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    adicionarEvento(novoEvento);
    setNovoEvento({
      ...novoEvento,
      titulo: '',
      descricao: ''
    });
  };

  const diasSemana = eachDayOfInterval({
    start: startOfWeek(dataAtual, { locale: ptBR }),
    end: endOfWeek(dataAtual, { locale: ptBR })
  });

  const eventosHoje = filtrarEventos(
    new Date(dataAtual.setHours(0, 0, 0, 0)),
    new Date(dataAtual.setHours(23, 59, 59, 999))
  );

  const cores = {
    treino: 'bg-blue-100 text-blue-800',
    refeicao: 'bg-green-100 text-green-800',
    medida: 'bg-purple-100 text-purple-800',
    meta: 'bg-yellow-100 text-yellow-800',
    descanso: 'bg-gray-100 text-gray-800'
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Calendário de Treinos</h1>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="p-4">
          <h3 className="font-semibold text-sm text-gray-500">Eventos Planejados</h3>
          <p className="text-2xl font-bold">{estatisticas.eventosPlanejados}</p>
        </Card>
        <Card className="p-4">
          <h3 className="font-semibold text-sm text-gray-500">Eventos Concluídos</h3>
          <p className="text-2xl font-bold">{estatisticas.eventosConcluidos}</p>
        </Card>
        <Card className="p-4">
          <h3 className="font-semibold text-sm text-gray-500">Treinos Semanais</h3>
          <p className="text-2xl font-bold">{estatisticas.treinosSemanais}</p>
        </Card>
        <Card className="p-4">
          <h3 className="font-semibold text-sm text-gray-500">Dias Consecutivos</h3>
          <p className="text-2xl font-bold">{estatisticas.diasConsecutivos}</p>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Calendário Semanal */}
        <Card className="md:col-span-2 p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold">
              {format(dataAtual, "MMMM 'de' yyyy", { locale: ptBR })}
            </h2>
            <div className="space-x-2">
              <Button
                onClick={() => setDataAtual(addDays(dataAtual, -7))}
                variant="outline"
              >
                Anterior
              </Button>
              <Button
                onClick={() => setDataAtual(new Date())}
                variant="outline"
              >
                Hoje
              </Button>
              <Button
                onClick={() => setDataAtual(addDays(dataAtual, 7))}
                variant="outline"
              >
                Próxima
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-4">
            {diasSemana.map((dia) => (
              <div key={dia.toISOString()} className="text-center">
                <div className="font-semibold mb-2">
                  {format(dia, 'EEEEEE', { locale: ptBR })}
                </div>
                <div className={`rounded-full w-8 h-8 mx-auto flex items-center justify-center ${
                  isSameDay(dia, new Date()) ? 'bg-blue-500 text-white' : ''
                }`}>
                  {format(dia, 'd')}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 space-y-2">
            {eventosHoje.map((evento) => (
              <div
                key={evento.id}
                className={`p-3 rounded-lg ${cores[evento.tipo]} flex justify-between items-center`}
              >
                <div>
                  <h3 className="font-semibold">{evento.titulo}</h3>
                  <p className="text-sm">{evento.descricao}</p>
                  <p className="text-sm">
                    {format(new Date(evento.dataInicio), 'HH:mm')} - 
                    {format(new Date(evento.dataFim), 'HH:mm')}
                  </p>
                </div>
                <Switch
                  checked={evento.concluido}
                  onCheckedChange={(checked) => 
                    checked ? marcarConcluido(evento.id) : marcarPendente(evento.id)
                  }
                />
              </div>
            ))}
          </div>
        </Card>

        {/* Formulário de Novo Evento */}
        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-4">Novo Evento</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="tipo">Tipo</Label>
              <Select
                value={novoEvento.tipo}
                onChange={(e) => setNovoEvento({
                  ...novoEvento,
                  tipo: e.target.value as TipoEvento
                })}
              >
                <option value="treino">Treino</option>
                <option value="refeicao">Refeição</option>
                <option value="medida">Medida</option>
                <option value="meta">Meta</option>
                <option value="descanso">Descanso</option>
              </Select>
            </div>

            <div>
              <Label htmlFor="titulo">Título</Label>
              <Input
                id="titulo"
                value={novoEvento.titulo}
                onChange={(e) => setNovoEvento({
                  ...novoEvento,
                  titulo: e.target.value
                })}
                required
              />
            </div>

            <div>
              <Label htmlFor="descricao">Descrição</Label>
              <Input
                id="descricao"
                value={novoEvento.descricao}
                onChange={(e) => setNovoEvento({
                  ...novoEvento,
                  descricao: e.target.value
                })}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="dataInicio">Data Início</Label>
                <Input
                  id="dataInicio"
                  type="datetime-local"
                  value={novoEvento.dataInicio.toISOString().slice(0, 16)}
                  onChange={(e) => setNovoEvento({
                    ...novoEvento,
                    dataInicio: new Date(e.target.value)
                  })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="dataFim">Data Fim</Label>
                <Input
                  id="dataFim"
                  type="datetime-local"
                  value={novoEvento.dataFim.toISOString().slice(0, 16)}
                  onChange={(e) => setNovoEvento({
                    ...novoEvento,
                    dataFim: new Date(e.target.value)
                  })}
                  required
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                checked={novoEvento.recorrente}
                onCheckedChange={(checked) => setNovoEvento({
                  ...novoEvento,
                  recorrente: checked
                })}
              />
              <Label>Evento Recorrente</Label>
            </div>

            <Button type="submit" className="w-full">
              Adicionar Evento
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default Calendar; 