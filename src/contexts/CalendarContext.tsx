import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { calendarService, CalendarEvent } from '@/services/calendarService';
import { useAuth } from './AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { TablesInsert } from '@/integrations/supabase/types';

interface CalendarContextType {
  events: CalendarEvent[];
  isLoading: boolean;
  addEvent: (event: Omit<TablesInsert<'calendar_events'>, 'user_id' | 'id'>) => Promise<void>;
}

const CalendarContext = createContext<CalendarContextType | undefined>(undefined);

export const useCalendar = () => {
  const context = useContext(CalendarContext);
  if (!context) throw new Error('useCalendar must be used within a CalendarProvider');
  return context;
};

export const CalendarProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = useCallback(async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      const eventsData = await calendarService.getCalendarEvents(user.id);
      setEvents(eventsData);
    } catch (error) {
      toast({ variant: "destructive", title: "Erro ao carregar eventos do calendário." });
    } finally {
      setIsLoading(false);
    }
  }, [user, toast]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const addEvent = async (event: Omit<TablesInsert<'calendar_events'>, 'user_id' | 'id'>) => {
    if (!user) return;
    try {
      const newEvent = await calendarService.addCalendarEvent({ ...event, user_id: user.id });
      setEvents(prev => [...prev, newEvent].sort((a, b) => new Date(a.event_date).getTime() - new Date(b.event_date).getTime()));
      toast({ title: "Evento adicionado ao calendário!" });
    } catch (error) {
      toast({ variant: "destructive", title: "Erro ao salvar evento." });
    }
  };

  return (
    <CalendarContext.Provider value={{ events, isLoading, addEvent }}>
      {children}
    </CalendarContext.Provider>
  );
};
