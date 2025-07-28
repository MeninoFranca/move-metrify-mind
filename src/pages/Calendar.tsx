// src/pages/Calendar.tsx
import React, { useMemo } from 'react';
import { Calendar, dateFnsLocalizer, EventProps } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { ptBR } from 'date-fns/locale/pt-BR';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { useCalendar } from '@/contexts/CalendarContext';
import { CalendarEvent } from '@/services/calendarService';
import DashboardLayout from '@/components/layout/DashboardLayout';
import AddEventSheet from '@/components/calendar/AddEventSheet';
import { Loader2 } from 'lucide-react';

// Configuração do localizador para date-fns com português do Brasil
const locales = {
  'pt-BR': ptBR,
};
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

// Componente customizado para o evento no calendário
const CustomEvent = (props: EventProps<CalendarEvent>) => {
    const { event } = props;
    return (
        <div className="text-xs p-1">
            <strong>{event.title}</strong>
            {event.description && <p>{event.description}</p>}
        </div>
    );
};

const CalendarPage = () => {
  const { events, isLoading } = useCalendar();

  // Mapeia os eventos do Supabase para o formato que react-big-calendar espera
  const formattedEvents = useMemo(() => {
    return events.map(event => ({
      ...event,
      title: event.title,
      start: new Date(event.event_date),
      end: new Date(event.event_date), // Para eventos de dia inteiro
      allDay: !event.event_time, // Se não tiver hora, é o dia todo
    }));
  }, [events]);

  if (isLoading) {
    return (
        <DashboardLayout>
            <div className="flex justify-center items-center h-full">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Calendário</h1>
          <AddEventSheet />
        </div>
        <div className="h-[75vh] bg-white p-4 rounded-lg shadow">
          <Calendar
            localizer={localizer}
            events={formattedEvents}
            startAccessor={(event: any) => event.start}
            endAccessor={(event: any) => event.end}
            style={{ height: '100%' }}
            culture='pt-BR'
            messages={{
                next: "Próximo",
                previous: "Anterior",
                today: "Hoje",
                month: "Mês",
                week: "Semana",
                day: "Dia",
                agenda: "Agenda",
                date: "Data",
                time: "Hora",
                event: "Evento",
            }}
            components={{
                event: CustomEvent
            }}
          />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CalendarPage;