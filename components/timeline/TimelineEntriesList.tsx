"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import ConfirmationButton from "@/components/ConfirmationButton";
import { useDeleteTimelineEntry } from "@/hooks/timeline/useDeleteTimeline";
import { useTimelineData } from "@/hooks/timeline/useTimelineData";
import TimelineMemoryCard from "@/components/timeline/TimelineMemoryCard";

interface TimelineEntriesListProps {
  startDate?: string;
  endDate?: string;
  milestoneId?: string;
  reloadSignal?: number;
}

const TAKE = 10;
function parseEventDateLocal(input: string | Date): Date {
  if (typeof input === "string") {
    const [y, m, d] = input.split("T")[0].split("-").map(Number);
    return new Date(y, m - 1, d);
  }
  return new Date(input);
}

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

  useEffect(() => {
    if (reloadSignal !== undefined) mutateEntries();
  }, [reloadSignal, mutateEntries]);

  const handleDelete = async (entryId: string) => {
    await deleteEntry(entryId);
    mutateEntries();
  };

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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-1 gap-6">
            {entries.map((entry) => (
              <TimelineMemoryCard
                key={entry.id}
                entry={entry}
                onDelete={() => handleDelete(entry.id)}
                isDeleting={isDeleting}
              />
            ))}
          </div>

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
              onClick={() =>
                setPage((p) => (p + 1 < totalPages ? p + 1 : p))
              }
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
