"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "./calendar";
import { Badge } from "@/components/ui/badge";
import { useHealth } from "@/stores/health";
import { useActivePet } from "@/stores/activePet";
import { useState, useMemo } from "react";
import { format, isSameDay } from "date-fns";
import { es } from "date-fns/locale";
import { CalendarIcon, Pill, Syringe, AlertTriangle } from "lucide-react";
import { motion } from "framer-motion";

interface CalendarEvent {
  id: string;
  type: "medication" | "vaccination";
  name: string;
  date: Date;
  isOverdue: boolean;
}

export function HealthCalendar() {
  const activePet = useActivePet((state) => state.activePet);
  const { medications, vaccinations } = useHealth();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date()
  );

  const calendarEvents = useMemo(() => {
    if (!activePet) return [];

    const events: CalendarEvent[] = [];
    const today = new Date();

    medications
      .filter((med) => med.active && med.next_dose_date)
      .forEach((med) => {
        const nextDate = new Date(med.next_dose_date!);
        events.push({
          id: `med-${med.id}`,
          type: "medication",
          name: med.name,
          date: nextDate,
          isOverdue: nextDate < today,
        });
      });

    vaccinations
      .filter((vac) => vac.active && vac.next_dose_date)
      .forEach((vac) => {
        const nextDate = new Date(vac.next_dose_date!);
        events.push({
          id: `vac-${vac.id}`,
          type: "vaccination",
          name: vac.name,
          date: nextDate,
          isOverdue: nextDate < today,
        });
      });

    return events;
  }, [activePet, medications, vaccinations]);

  const eventsForSelectedDate = useMemo(() => {
    if (!selectedDate) return [];
    return calendarEvents.filter((event) =>
      isSameDay(event.date, selectedDate)
    );
  }, [calendarEvents, selectedDate]);

  const eventDates = useMemo(() => {
    return calendarEvents.map((event) => event.date);
  }, [calendarEvents]);

  const modifiers = {
    hasEvent: eventDates,
    overdue: calendarEvents.filter((e) => e.isOverdue).map((e) => e.date),
  };

  const modifiersStyles = {
    hasEvent: {
      backgroundColor: "hsl(var(--primary))",
      color: "hsl(var(--primary-foreground))",
    },
    overdue: {
      backgroundColor: "hsl(var(--destructive))",
      color: "hsl(var(--destructive-foreground))",
    },
  };

  if (!activePet) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarIcon className="h-5 w-5" />
            Calendario de Salud
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            modifiers={modifiers}
            modifiersStyles={modifiersStyles}
            locale={es}
            className="rounded-md border"
          />
          <div className="mt-4 space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <div className="w-3 h-3 rounded-full bg-primary"></div>
              <span>Días con citas programadas</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <div className="w-3 h-3 rounded-full bg-destructive"></div>
              <span>Citas vencidas</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>
            {selectedDate
              ? `Eventos para ${format(selectedDate, "PPP", { locale: es })}`
              : "Selecciona una fecha"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {eventsForSelectedDate.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">
                No hay eventos programados para esta fecha
              </p>
            ) : (
              eventsForSelectedDate.map((event, index) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`p-3 rounded-lg border ${
                    event.isOverdue
                      ? "border-destructive bg-destructive/5"
                      : "border-border bg-card"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-2 rounded-full ${
                        event.type === "medication"
                          ? "bg-blue-100 text-blue-600"
                          : "bg-green-100 text-green-600"
                      }`}
                    >
                      {event.type === "medication" ? (
                        <Pill className="h-4 w-4" />
                      ) : (
                        <Syringe className="h-4 w-4" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium">{event.name}</h4>
                        {event.isOverdue && (
                          <AlertTriangle className="h-4 w-4 text-destructive" />
                        )}
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge
                          variant={
                            event.type === "medication"
                              ? "default"
                              : "secondary"
                          }
                        >
                          {event.type === "medication"
                            ? "Medicamento"
                            : "Vacuna"}
                        </Badge>
                        {event.isOverdue && (
                          <Badge variant="destructive">Vencido</Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
