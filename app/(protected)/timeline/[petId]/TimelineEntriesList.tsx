"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import ConfirmationButton from "@/components/ConfirmationButton";
import { TimelineEntryWithPhotos } from "@/types/timeline";
import { FormMessage, Message } from "@/components/form-message";

interface TimelineEntriesListProps {
  entries: TimelineEntryWithPhotos[];
  onEntryDeleted: () => void;
}

export default function TimelineEntriesList({ entries, onEntryDeleted }: TimelineEntriesListProps) {
  const { petId } = useParams() as { petId: string };
  const [message, setMessage] = useState<Message | null>(null);

  const handleDelete = async (entryId: string) => {
    try {
      const res = await fetch(
        `/api/timeline/${petId}/entries?id=${entryId}`,
        { method: "DELETE" }
      );
      if (res.ok) {
        setMessage({ success: "Recuerdo eliminado correctamente." });
        onEntryDeleted();
      } else {
        const errorData = await res.json().catch(() => null);
        const errMsg = errorData?.error || (await res.text()) || "No se pudo eliminar el recuerdo.";
        setMessage({ error: errMsg });
      }
    } catch (error) {
      console.error("Network error deleting entry:", error);
      setMessage({ error: "Error de red. Revisa tu conexión e inténtalo de nuevo." });
    }
  };

  return (
    <div>
      <h3 className="text-xl font-semibold mt-6 mb-4">Recuerdos</h3>
      {message && <FormMessage message={message} />}
      {entries.length === 0 ? (
        <div className="text-center py-10 px-4 border border-dashed rounded-lg">
          <p className="text-muted-foreground">Aún no hay recuerdos para esta mascota.</p>
          <p className="text-sm text-muted-foreground/80">¡Añade el primero para empezar a construir su historia!</p>
        </div>
      ) : (
        <ul className="space-y-4 list-none p-0">
          {entries.map((entry) => (
            <li key={entry.id} className="p-4 border rounded-lg shadow-sm bg-card">
              {entry.title && (
                <h4 className="font-bold text-lg mb-1">{entry.title}</h4>
              )}
              <p className="text-xs text-muted-foreground mb-2">
                {new Date(entry.event_date).toLocaleDateString("es-CL", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
              {entry.description && <p className="text-sm mb-3">{entry.description}</p>}

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
                      <span key={m.id} className="px-2 py-1 bg-muted rounded text-xs">{m.name}</span>
                    )
                  )}
                </div>
              )}

              <ConfirmationButton
                onConfirm={() => handleDelete(entry.id)}
                triggerText="Eliminar"
                dialogTitle="Confirmar eliminación"
                dialogDescription="¿Estás seguro de que quieres eliminar este recuerdo? Esta acción no se puede deshacer."
                confirmText="Eliminar"
                cancelText="Cancelar"
                variant="destructive"
                size="sm"
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
