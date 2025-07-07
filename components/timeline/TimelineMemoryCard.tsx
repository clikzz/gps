"use client";

import React from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import ConfirmationButton from "@/components/ConfirmationButton";
import CarouselStack from "@/components/ui/CarouselStack";
import { Calendar, Tag } from "lucide-react";
import type { TimelineEntryWithPhotos } from "@/types/timeline";

function parseEventDateLocal(input: string | Date): Date {
  if (typeof input === "string") {
    const [y, m, d] = input.split("T")[0].split("-").map(Number);
    return new Date(y, m - 1, d);
  }
  return new Date(input);
}

export interface TimelineMemoryCardProps {
  entry: TimelineEntryWithPhotos;
  onDelete: () => void;
  isDeleting: boolean;
}

export default function TimelineMemoryCard({
  entry,
  onDelete,
  isDeleting,
}: TimelineMemoryCardProps) {
  const localDate = parseEventDateLocal(entry.event_date);
  const date = localDate.toLocaleDateString("es-CL", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <Card className="bg-card rounded-xl shadow-lg overflow-hidden mb-6">
      {/* Cabecera */}
      <div className="p-6 border-b">
        <div className="flex items-start justify-between gap-x-4">
          <div>
            {entry.title && (
              <h3
                className="
                  text-xl font-bold text-foreground
                  max-w-[50ch]
                  whitespace-normal
                  break-all
                "
              >
                {entry.title}
              </h3>
            )}
            <div className="flex items-center text-muted-foreground mt-1">
              <Calendar className="w-4 h-4 mr-1" />
              <span className="text-sm">{date}</span>
            </div>
          </div>

          {/* Grid de badges */}
          <div dir="rtl" className="grid grid-cols-2 gap-2 justify-items-start">
            {entry.Milestones?.map((tag) => (
              <span
                key={tag.id}
                dir="ltr"
                className="
                  inline-flex items-center space-x-1
                  px-3 py-1 bg-muted rounded-full text-xs
                  max-w-[10rem] whitespace-normal break-words
                "
              >
                <Tag className="w-3 h-3 text-foreground" />
                <span className="text-foreground">{tag.name}</span>
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Contenido: descripción + carrusel */}
      <CardContent className="p-6">
        {entry.description && (
          <p className="text-foreground mb-6 break-words">
            {entry.description}
          </p>
        )}
        <CarouselStack
          images={entry.TimelineEntryPhotos?.map((p) => p.photo_url) ?? []}
        />
      </CardContent>

      {/* Footer: botón eliminar */}
      <CardFooter className="justify-end">
        <ConfirmationButton
          onConfirm={async () => onDelete()}
          triggerText={isDeleting ? "Eliminando…" : "Eliminar"}
          dialogTitle="Confirmar eliminación"
          dialogDescription="¿Estás seguro? Esta acción no se puede deshacer."
          confirmText="Eliminar"
          cancelText="Cancelar"
          variant="destructive"
          size="sm"
        />
      </CardFooter>
    </Card>
  );
}
