// src/contexts/CalendarContext.tsx
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { calendarService, CalendarEvent } from '@/services/calendarService';
import { useAuth } from './AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { TablesInsert } from '@/integrations/supabase/types';

interface CalendarContextType {
  events: CalendarEvent[];
  isLoading: boolean;
  addEvent: (event: Omit<TablesInsert<'calendar_events'>, 'id' | 'user_id'>) => Promise<void>;
}

const CalendarContext = createContext<CalendarContextType | undefined>(undefined);

export const useCalendar = () => {
  const context = useContext(CalendarContext);
  if (!context) {
    throw new Error('useCalendar deve ser usado dentro de um CalendarProvider');
  }
  return context;
};

export const CalendarProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchEvents = useCallback(async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      const eventsData = await calendarService.getEvents(user.id);
      setEvents(eventsData);
    } catch (error) {
      toast({ variant: "destructive", title: "Erro ao carregar eventos do calendário." });
    } finally {
      setIsLoading(false);
    }
  }, [user, toast]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const addEvent = async (event: Omit<TablesInsert<'calendar_events'>, 'id' | 'user_id'>) => {
    if (!user) {
        toast({ variant: "destructive", title: "Você precisa estar logado para adicionar eventos." });
        return;
    };
    try {
      const newEvent = await calendarService.addEvent({ ...event, user_id: user.id });
      setEvents(prev => [...prev, newEvent]);
      toast({ title: "Evento adicionado com sucesso!" });
    } catch (error) {
      console.error(error);
      toast({ variant: "destructive", title: "Erro ao adicionar evento." });
    }
  };

  return (
    <CalendarContext.Provider value={{ events, isLoading, addEvent }}>
      {children}
    </CalendarContext.Provider>
  );
};