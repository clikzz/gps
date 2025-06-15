"use client";

import React from "react";
import { TimelineEntryWithPhotos } from "@/app/types/timeline";

interface TimelineEntriesListProps {
  entries: TimelineEntryWithPhotos[];
}

export default function TimelineEntriesList({ entries }: TimelineEntriesListProps) {
  return (
    <div>
      <h3 className="text-xl font-semibold mt-6 mb-4">Recuerdos</h3>
      {entries.length === 0 ? (
        <div className="text-center py-10 px-4 border border-dashed rounded-lg">
          <p className="text-muted-foreground">Aún no hay recuerdos para esta mascota.</p>
          <p className="text-sm text-muted-foreground/80">¡Añade el primero para empezar a construir su historia!</p>
        </div>
      ) : (
        <ul className="space-y-4 list-none p-0">
          {entries.map((entry) => (
            <li key={entry.id.toString()} className="p-4 border rounded-lg shadow-sm bg-card">
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
              {entry.description && (
                <p className="text-sm mb-3">{entry.description}</p>
              )}

              {/* ——— Fotitos ——— */}
              <div className="flex flex-wrap gap-2 mb-3">
                {entry.TimelineEntryPhotos?.map((photo) => (
                  <img
                    key={photo.id.toString()}
                    src={photo.photo_url}
                    alt={entry.title || "Foto del recuerdo"}
                    className="w-24 h-24 object-cover rounded-md border"
                  />
                ))}
              </div>

              {/* ——— Hitos ——— */}
              {entry.Milestones && entry.Milestones.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {entry.Milestones.map((m) => (
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
                  ))}
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
