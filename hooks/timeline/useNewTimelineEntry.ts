import { useState } from 'react';
import { toast } from 'sonner';
import { NewTimelineEntrySchema } from '@/server/validations/timeline.validation';
import { useTimelineData } from './useTimelineData';
import { useTimelineImageUpload } from './useTimelineImageUpload';
import { TimelineEntryWithPhotos } from '@/types/timeline';

export interface NewEntryParams {
  title?: string;
  description?: string;
  eventDate: string;
  photos?: FileList;
  milestoneIds: string[];
}

export interface UseNewTimelineEntryResult {
  isSubmitting: boolean;
  error?: Error;
  createEntry: (params: NewEntryParams) => Promise<void>;
}


export const useNewTimelineEntry = (
  petId: string
): UseNewTimelineEntryResult => {
  const { mutateEntries } = useTimelineData(petId);
  const { isUploading, uploadTimelinePhotos } = useTimelineImageUpload();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<Error>();

  const createEntry = async ({ title, description, eventDate, photos, milestoneIds }: NewEntryParams) => {
    setIsSubmitting(true);
    setError(undefined);
    toast.info('Creando nueva entrada...');

    try {
      const uploadedUrls: string[] =
        photos && photos.length > 0
          ? await uploadTimelinePhotos(photos)
          : [];

      const payload = NewTimelineEntrySchema.parse({
        title,
        description,
        eventDate,
        photoUrls: uploadedUrls,
        milestoneIds,
      });

      const res = await fetch(`/api/timeline/${petId}/entries`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => null);
        throw new Error(errData?.error || 'Error al crear la entrada.');
      }


      await mutateEntries();
      toast.success('¡Recuerdo añadido con éxito!');
    } catch (err: any) {
      console.error('[useNewTimelineEntry] Error:', err);
      const message = err instanceof Error
        ? err.message
        : 'Error inesperado al crear la entrada.';
      setError(err instanceof Error ? err : new Error(message));
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return { isSubmitting: isSubmitting || isUploading, error, createEntry };
};
