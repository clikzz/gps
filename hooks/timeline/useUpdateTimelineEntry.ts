import { useState } from 'react';
import { toast } from 'sonner';
import { NewTimelineEntrySchema } from '@/server/validations/timeline.validation';
import { useTimelineData } from './useTimelineData';

export interface UpdateEntryParams {
  entryId: string;
  title?: string;
  description?: string;
  eventDate: string;
  photos?: FileList;
  milestoneIds: string[];
}

export interface UseUpdateTimelineEntryResult {
  isSubmitting: boolean;
  error?: Error;
  updateEntry: (params: UpdateEntryParams) => Promise<void>;
}

export const useUpdateTimelineEntry = (
  petId: string
): UseUpdateTimelineEntryResult => {
  const { mutateEntries } = useTimelineData(petId);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<Error>();

  const updateEntry = async ({
    entryId,
    title,
    description,
    eventDate,
    photos,
    milestoneIds,
  }: UpdateEntryParams) => {
    setIsSubmitting(true);
    setError(undefined);
    toast.info('Actualizando entrada...');

    try {
      const payload = NewTimelineEntrySchema.parse({
        title,
        description,
        eventDate,
        photoUrls: [],
        milestoneIds,
      });

      const res = await fetch(
        `/api/timeline/${petId}/entries?id=${entryId}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        }
      );
      
      if (!res.ok) {
        const errData = await res.json().catch(() => null);
        throw new Error(errData?.error || 'Error al actualizar la entrada.');
      }

      await mutateEntries();
      toast.success('Recuerdo actualizado con éxito.');
    } catch (err: any) {
      console.error('[useUpdateTimelineEntry] Error:', err);
      const message =
        err instanceof Error
          ? err.message
          : 'Error inesperado al actualizar la entrada.';
      setError(err instanceof Error ? err : new Error(message));
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    isSubmitting,
    error,
    updateEntry,
  };
};