"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import ConfirmationButton from "@/components/ConfirmationButton";
import { useDeleteTimelineEntry } from "@/hooks/timeline/useDeleteTimeline";
import { useTimelineData } from "@/hooks/timeline/useTimelineData";

interface TimelineEntriesListProps {
  startDate?: string;
  endDate?: string;
  milestoneId?: string;
  reloadSignal?: number;
}

// Helper: convierte "YYYY-MM-DDTHH:MM:SS.ZZZZ" o Date a Date local a medianoche
function parseEventDateLocal(input: string | Date): Date {
  if (typeof input === "string") {
    const [y, m, d] = input.split("T")[0].split("-").map(Number);
    return new Date(y, m - 1, d);
  } else {
    const y = input.getFullYear();
    const m = input.getMonth();
    const d = input.getDate();
    return new Date(y, m, d);
  }
}

const TAKE = 10; // Entradas por página

export default function TimelineEntriesList({
  startDate,
  endDate,
  milestoneId,
  reloadSignal,
}: TimelineEntriesListProps) {
  const { petId } = useParams() as { petId: string };
  const [page, setPage] = useState(0);

  const skip = page * TAKE;

  const {
    entries,
    total,
    isLoading,
    error,
    mutateEntries,
  } = useTimelineData(petId, {
    startDate,
    endDate,
    milestoneId,
    skip,
    take: TAKE,
  });

  const { isDeleting, deleteEntry } = useDeleteTimelineEntry(petId);

  // Al cambiar reloadSignal, forzamos SWR a recargar datos
  useEffect(() => {
    if (reloadSignal !== undefined) {
      mutateEntries();
    }
  }, [reloadSignal, mutateEntries]);

  const handleDelete = async (entryId: string) => {
    await deleteEntry(entryId);
    mutateEntries();
  };

  // Reset paginación si modifican filtros
  useEffect(() => {
    setPage(0);
  }, [startDate, endDate, milestoneId]);

  const totalPages = Math.ceil(total / TAKE);

  return (
    <div>
      <h3 className="text-xl font-semibold mt-6 mb-4">Recuerdos</h3>

      {isLoading ? (
        <div className="text-center py-10">Cargando...</div>
      ) : error ? (
        <div className="text-center py-10 text-destructive">
          Error al cargar los recuerdos.
        </div>
      ) : entries.length === 0 ? (
        <div className="text-center py-10 px-4 border border-dashed rounded-lg">
          <p className="text-muted-foreground">
            Aún no hay recuerdos para esta mascota.
          </p>
          <p className="text-sm text-muted-foreground/80">
            ¡Añade el primero para empezar a construir su historia!
          </p>
        </div>
      ) : (
        <>
          <ul className="space-y-4 list-none p-0">
            {entries.map((entry) => {
              const localDate = parseEventDateLocal(entry.event_date);
              return (
                <li
                  key={entry.id}
                  className="p-4 border rounded-lg shadow-sm bg-card"
                >
                  {entry.title && (
                    <h4 className="font-bold text-lg mb-1">{entry.title}</h4>
                  )}

                  <p className="text-xs text-muted-foreground mb-2">
                    {localDate.toLocaleDateString("es-CL", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>

                  {entry.description && (
                    <p className="text-sm mb-3">{entry.description}</p>
                  )}

                  <div className="flex flex-wrap gap-2 mb-3">
                    {entry.TimelineEntryPhotos?.map((photo) => (
                      <img
                        key={photo.id}
                        src={photo.photo_url}
                        alt={entry.title || "Foto del recuerdo"}
                        className="w-24 h-24 object-cover rounded-md border"
                      />
                    ))}
                  </div>

                  {entry.Milestones && entry.Milestones.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-3">
                      {entry.Milestones.map((m) =>
                        m.icon_url ? (
                          <img
                            key={m.id}
                            src={m.icon_url}
                            alt={m.name}
                            title={m.name}
                            className="w-6 h-6 rounded"
                          />
                        ) : (
                          <span
                            key={m.id}
                            className="px-2 py-1 bg-muted rounded text-xs"
                          >
                            {m.name}
                          </span>
                        )
                      )}
                    </div>
                  )}

                  <ConfirmationButton
                    onConfirm={() => handleDelete(entry.id)}
                    triggerText={isDeleting ? "Eliminando…" : "Eliminar"}
                    dialogTitle="Confirmar eliminación"
                    dialogDescription="¿Estás seguro de que quieres eliminar este recuerdo? Esta acción no se puede deshacer."
                    confirmText="Eliminar"
                    cancelText="Cancelar"
                    variant="destructive"
                    size="sm"
                  />
                </li>
              );
            })}
          </ul>

          {/* Paginación */}
          <div className="flex justify-center gap-2 mt-6">
            <button
              onClick={() => setPage((p) => Math.max(p - 1, 0))}
              disabled={page === 0}
              className="px-3 py-1 rounded border"
            >
              Anterior
            </button>
            <span className="px-2 py-1 text-sm">
              Página {page + 1} de {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => (p + 1 < totalPages ? p + 1 : p))}
              disabled={page + 1 >= totalPages}
              className="px-3 py-1 rounded border"
            >
              Siguiente
            </button>
          </div>
        </>
      )}
    </div>
  );
}
