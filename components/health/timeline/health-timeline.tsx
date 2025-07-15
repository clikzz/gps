"use client";

import type React from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useHealth } from "@/stores/health";
import { useActivePet } from "@/stores/activePet";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { motion } from "framer-motion";
import { Syringe, Pill, Calendar } from "lucide-react";
import { useMemo } from "react";

interface TimelineEvent {
  id: string;
  type: "medication" | "vaccination";
  name: string;
  date: Date;
  nextDate?: Date;
  details: string;
  icon: React.ReactNode;
}

export function HealthTimeline() {
  const activePet = useActivePet((state) => state.activePet);
  const { medications, vaccinations } = useHealth();

  const timelineEvents = useMemo(() => {
    if (!activePet) return [];

    const events: TimelineEvent[] = [];

    medications
      .filter((med) => med.pet_id.toString() == activePet.id && med.active)
      .forEach((med) => {
        events.push({
          id: `med-${med.id}`,
          type: "medication",
          name: med.name,
          date: new Date(med.start_date),
          nextDate: med.next_dose_date
            ? new Date(med.next_dose_date)
            : undefined,
          details: `Dosis: ${med.dose} - Duración: ${med.duration}`,
          icon: <Pill className="h-4 w-4" />,
        });
      });

    vaccinations
      .filter((vac) => vac.pet_id.toString() == activePet.id && vac.active)
      .forEach((vac) => {
        events.push({
          id: `vac-${vac.id}`,
          type: "vaccination",
          name: vac.name,
          date: new Date(vac.application_date),
          nextDate: vac.next_dose_date
            ? new Date(vac.next_dose_date)
            : undefined,
          details: vac.type ? `Tipo: ${vac.type}` : "",
          icon: <Syringe className="h-4 w-4" />,
        });
      });

    return events.sort((a, b) => b.date.getTime() - a.date.getTime());
  }, [activePet, medications, vaccinations]);

  if (!activePet) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Historial de Salud
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {timelineEvents.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              No hay registros de salud para mostrar
            </p>
          ) : (
            timelineEvents.map((event, index) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex gap-4 p-4 rounded-lg border bg-card hover:bg-muted/50 transition-colors"
              >
                <div className="flex-shrink-0">
                  <div
                    className={`p-2 rounded-full ${
                      event.type === "medication"
                        ? "bg-blue-100 text-blue-600"
                        : "bg-green-100 text-green-600"
                    }`}
                  >
                    {event.icon}
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium">{event.name}</h4>
                    <Badge
                      variant={
                        event.type === "medication" ? "default" : "secondary"
                      }
                    >
                      {event.type === "medication" ? "Medicamento" : "Vacuna"}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    {event.details}
                  </p>
                  <div className="flex flex-col gap-1 text-xs text-muted-foreground">
                    <span>
                      Aplicado: {format(event.date, "PPP", { locale: es })}
                    </span>
                    {event.nextDate && (
                      <span>
                        Próxima dosis:{" "}
                        {format(event.nextDate, "PPP", { locale: es })}
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
