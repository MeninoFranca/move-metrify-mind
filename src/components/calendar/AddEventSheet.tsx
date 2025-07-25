// src/components/calendar/AddEventSheet.tsx
import React, { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useCalendar } from '@/contexts/CalendarContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus } from 'lucide-react';
import { TablesInsert } from '@/integrations/supabase/types';

type EventFormInput = Omit<TablesInsert<'calendar_events'>, 'id' | 'user_id'>;

const AddEventSheet = () => {
  const { addEvent } = useCalendar();
  const [isOpen, setIsOpen] = useState(false);
  const { register, handleSubmit, reset, formState: { errors } } = useForm<EventFormInput>();

  const onSubmit: SubmitHandler<EventFormInput> = async (data) => {
    await addEvent({
        ...data,
        event_date: new Date(data.event_date).toISOString(), // Garante o formato correto
    });
    reset();
    setIsOpen(false);
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Adicionar Evento
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Adicionar Novo Evento</SheetTitle>
        </SheetHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 mt-6">
          <div className="space-y-2">
            <Label htmlFor="title">Título do Evento</Label>
            <Input id="title" {...register("title", { required: true })} />
            {errors.title && <p className="text-sm text-destructive">Título é obrigatório.</p>}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="event_type">Tipo de Evento</Label>
             <select id="event_type" {...register("event_type", { required: true })} className="w-full p-2 border rounded">
                <option value="weigh_in">Dia de Pesagem</option>
                <option value="measurement">Dia de Medição</option>
                <option value="appointment">Consulta</option>
                <option value="other">Outro</option>
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="event_date">Data</Label>
            <Input id="event_date" type="date" {...register("event_date", { required: true })} defaultValue={new Date().toISOString().split('T')[0]} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="event_time">Hora (Opcional)</Label>
            <Input id="event_time" type="time" {...register("event_time")} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrição (Opcional)</Label>
            <Input id="description" {...register("description")} />
          </div>

          <Button type="submit" className="w-full">Salvar Evento</Button>
        </form>
      </SheetContent>
    </Sheet>
  );
};

export default AddEventSheet;