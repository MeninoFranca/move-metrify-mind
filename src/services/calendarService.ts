// src/services/calendarService.ts
import { supabase } from '@/integrations/supabase/client';
import { Tables, TablesInsert } from '@/integrations/supabase/types';

export type CalendarEvent = Tables<'calendar_events'>;

export const calendarService = {
  /**
   * Busca todos os eventos do calendário para um usuário.
   */
  async getEvents(userId: string): Promise<CalendarEvent[]> {
    const { data, error } = await supabase
      .from('calendar_events')
      .select('*')
      .eq('user_id', userId);

    if (error) {
      console.error('Erro ao buscar eventos do calendário:', error);
      throw error;
    }
    return data;
  },

  /**
   * Adiciona um novo evento ao calendário.
   */
  async addEvent(event: TablesInsert<'calendar_events'>): Promise<CalendarEvent> {
    const { data, error } = await supabase
      .from('calendar_events')
      .insert(event)
      .select()
      .single();

    if (error) {
      console.error('Erro ao adicionar evento:', error);
      throw error;
    }
    return data;
  },
};