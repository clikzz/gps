// server/validations/timelineValidation.ts

import { z } from 'zod';

export const NewTimelineEntrySchema = z.object({
  title: z.string().max(100, 'El título no puede exceder los 100 caracteres.').optional(),
  
  description: z.string().max(1000, 'La descripción es demasiado larga.').optional(),
  
  eventDate: z.string()
    .refine((date) => date && !isNaN(new Date(date).getTime()), {
      message: 'La fecha del evento es requerida y debe ser válida.',
    })
    .refine((date) => {
      const inputDate = new Date(date);
      const today = new Date();
      // Ignoramos la hora para la comparación, permitiendo el día de hoy.
      today.setHours(23, 59, 59, 999); 
      return inputDate <= today;
    }, {
      message: 'La fecha del evento no puede ser futura.',
    }),
  
  photoUrls: z.array(z.string().url('Cada foto debe tener una URL válida.')).optional(),

}).superRefine((data, ctx) => {
  // RF-006: La descripción es obligatoria si no hay fotos.
  const hasPhotos = data.photoUrls && data.photoUrls.length > 0;
  const hasDescription = data.description && data.description.trim() !== '';

  if (!hasPhotos && !hasDescription) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Debes proporcionar una descripción si no incluyes fotos.',
      path: ['description'],
    });
  }
});