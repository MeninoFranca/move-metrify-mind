import { supabase } from '@/integrations/supabase/client';
import { Tables, TablesInsert } from '@/integrations/supabase/types';

export type CalendarEvent = Tables<'calendar_events'>;

export const calendarService = {
  async getCalendarEvents(userId: string): Promise<CalendarEvent[]> {
    const { data, error } = await supabase
      .from('calendar_events')
      .select('*')
      .eq('user_id', userId)
      .order('event_date', { ascending: true });

    if (error) {
      console.error('Erro ao buscar eventos do calendário:', error);
      throw error;
    }
    return data;
  },

  async addCalendarEvent(event: TablesInsert<'calendar_events'>): Promise<CalendarEvent> {
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
