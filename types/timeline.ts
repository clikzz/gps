import { TimelineEntries, TimelineEntryPhotos } from '@prisma/client';

export type TimelineEntryWithPhotos = TimelineEntries & {
  TimelineEntryPhotos: TimelineEntryPhotos[];
};

export interface NewTimelineEntryPayload {
  title?: string;
  description?: string;
  eventDate: string;
  // Añadimos el '?' para indicar que este campo es opcional.
  // Ahora coincide con el esquema de validación de Zod.
  photoUrls?: string[]; 
}