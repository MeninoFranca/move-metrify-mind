import React from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useCalendar } from '@/contexts/CalendarContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar as CalendarIcon, Loader2 } from 'lucide-react';
import { Calendar as ShadcnCalendar } from "@/components/ui/calendar"


const CalendarPage = () => {
  const { events, isLoading } = useCalendar();
  const [date, setDate] = React.useState<Date | undefined>(new Date())

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
        <h1 className="text-3xl font-bold">Calendário</h1>
        <div className="grid gap-6 md:grid-cols-3">
            <div className="md:col-span-1">
                 <Card>
                    <CardContent className="p-0">
                        <ShadcnCalendar
                            mode="single"
                            selected={date}
                            onSelect={setDate}
                            className="rounded-md border"
                        />
                    </CardContent>
                 </Card>
            </div>
            <div className="md:col-span-2">
                <Card>
                    <CardHeader><CardTitle>Eventos</CardTitle></CardHeader>
                    <CardContent>
                    {events.length > 0 ? (
                        <ul>
                        {events.map(event => (
                            <li key={event.id} className="border-b py-2">
                                <strong>{new Date(event.event_date).toLocaleDateString()}:</strong> {event.title}
                            </li>
                        ))}
                        </ul>
                    ) : (
                        <p className="text-muted-foreground">Nenhum evento no calendário.</p>
                    )}
                    </CardContent>
                </Card>
            </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CalendarPage;
