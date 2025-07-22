import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useCalendar } from '@/contexts/CalendarContext';
import { TipoEvento, EventoCalendario } from '@/types/calendar';
import { format, startOfWeek, endOfWeek, eachDayOfInterval, addDays, isSameDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Plus, Filter } from 'lucide-react';

interface CalendarDisplayProps {
  eventos: EventoCalendario[];
  dataAtual: Date;
  onChangeData: (data: Date) => void;
  onAddEvento: () => void;
}

const CalendarDisplay: React.FC<CalendarDisplayProps> = ({
  eventos,
  dataAtual,
  onChangeData,
  onAddEvento
}) => {
  const diasSemana = eachDayOfInterval({
    start: startOfWeek(dataAtual, { locale: ptBR }),
    end: endOfWeek(dataAtual, { locale: ptBR })
  });

  const cores = {
    treino: 'bg-blue-100 text-blue-800',
    refeicao: 'bg-green-100 text-green-800',
    medida: 'bg-purple-100 text-purple-800',
    meta: 'bg-yellow-100 text-yellow-800',
    descanso: 'bg-gray-100 text-gray-800'
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Calendário</h2>
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={() => {}}>
            <Filter className="h-4 w-4 mr-2" />
            Filtrar
          </Button>
          <Button onClick={onAddEvento}>
            <Plus className="h-4 w-4 mr-2" />
            Novo Evento
          </Button>
        </div>
      </div>

      {/* Navegação do Calendário */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={() => onChangeData(addDays(dataAtual, -7))}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <CardTitle className="flex items-center gap-2">
              <CalendarIcon className="h-5 w-5" />
              {format(dataAtual, "MMMM 'de' yyyy", { locale: ptBR })}
            </CardTitle>
            <Button
              variant="ghost"
              onClick={() => onChangeData(addDays(dataAtual, 7))}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Cabeçalho dos Dias */}
          <div className="grid grid-cols-7 gap-px bg-muted rounded-lg overflow-hidden">
            {diasSemana.map((dia) => (
              <div
                key={dia.toString()}
                className="bg-background p-3 text-center"
              >
                <span className="text-sm font-medium">
                  {format(dia, 'EEE', { locale: ptBR })}
                </span>
                <p className="mt-1 text-2xl">
                  {format(dia, 'd')}
                </p>
              </div>
            ))}
          </div>

          {/* Grade de Eventos */}
          <div className="mt-6 space-y-4">
            {eventos.map((evento) => (
              <div
                key={evento.id}
                className="flex items-center gap-4 p-4 rounded-lg border"
              >
                <div className={`w-2 h-2 rounded-full ${cores[evento.tipo]}`} />
                <div className="flex-1">
                  <h3 className="font-medium">{evento.titulo}</h3>
                  <p className="text-sm text-muted-foreground">
                    {format(evento.dataInicio, "HH:mm")} - {format(evento.dataFim, "HH:mm")}
                  </p>
                </div>
                <div className={`px-2 py-1 rounded text-xs ${cores[evento.tipo]}`}>
                  {evento.tipo}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

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

  const eventosHoje = filtrarEventos(
    new Date(dataAtual.setHours(0, 0, 0, 0)),
    new Date(dataAtual.setHours(23, 59, 59, 999))
  );

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <CalendarDisplay
          eventos={eventosHoje}
          dataAtual={dataAtual}
          onChangeData={setDataAtual}
          onAddEvento={handleSubmit}
        />
      </div>
    </DashboardLayout>
  );
};

export default Calendar; 