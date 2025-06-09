import { z } from 'zod';

// Esquema para validar la creación de una nueva entrada del timeline.
// Cumple con los requisitos funcionales RF-004, RF-005, y RF-006.
export const NewTimelineEntrySchema = z.object({
  title: z.string().max(100, 'El título no puede exceder los 100 caracteres.').optional(),
  
  description: z.string().max(1000, 'La descripción es demasiado larga.').optional(),
  
  eventDate: z.string().refine((date) => !isNaN(new Date(date).getTime()), {
    message: 'La fecha del evento es requerida y debe ser válida.',
  }),
  
  photoUrls: z.array(z.string().url('Cada foto debe tener una URL válida.')).optional(),
}).superRefine((data, ctx) => {
  // Implementación del requisito RF-006:
  // "Permitir añadir una descripción a una entrada del Timeline. Obligatorio si no se adjuntan fotos."
  const hasPhotos = data.photoUrls && data.photoUrls.length > 0;
  const hasDescription = data.description && data.description.trim() !== '';

  if (!hasPhotos && !hasDescription) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Debes proporcionar una descripción si no incluyes fotos.',
      path: ['description'], // Asocia el error al campo 'description'
    });
  }
});