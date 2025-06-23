// server/validations/timelineValidation.ts

import { z } from 'zod';

export const NewTimelineEntrySchema = z.object({
  title: z.string().max(50, 'El título no puede exceder los 50 caracteres.').optional(),
  
  description: z.string().max(200, 'La descripción no puede exceder los 200 caracteres.').optional(),
  
  eventDate: z.string()
    .refine((date) => {
      const inputDate = new Date(date);
      const nowUTC = new Date();
      // Compara solo la parte de la fecha (no la hora) en UTC
      const inputYMD = [
        inputDate.getUTCFullYear(),
        inputDate.getUTCMonth(),
        inputDate.getUTCDate(),
      ];
      const nowYMD = [
        nowUTC.getUTCFullYear(),
        nowUTC.getUTCMonth(),
        nowUTC.getUTCDate(),
      ];
      // Permite hoy o días anteriores (en UTC)
      if (inputYMD[0] < nowYMD[0]) return true;
      if (inputYMD[0] > nowYMD[0]) return false;
      if (inputYMD[1] < nowYMD[1]) return true;
      if (inputYMD[1] > nowYMD[1]) return false;
      if (inputYMD[2] <= nowYMD[2]) return true;
      return false;
    }, {
      message: 'La fecha del evento no puede ser futura.',
    }),

  
  photoUrls: z.array(z.string().url('Cada foto debe tener una URL válida.')).optional(),

  milestoneIds: z.array(z.string()).max(4, 'Máximo 4 hitos por recuerdo.').optional(),

}).superRefine((data, ctx) => {
  // RF-006: La descripción es obligatoria si no hay fotos.
  const hasPhotos = data.photoUrls && data.photoUrls.length > 0;
  const hasDescription = data.description && data.description.trim() !== '';

  if (!hasPhotos && !hasDescription) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Debes proporcionar una descripción si no incluyes fotos o cargar al menos una foto.',
      path: ['description'],
    });
  }
});