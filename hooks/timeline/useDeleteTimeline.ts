import { useState } from 'react';
import { toast } from 'sonner';
import { useTimelineData } from './useTimelineData';

export interface UseDeleteTimelineEntryResult {
  isDeleting: boolean;
  error?: Error;
  deleteEntry: (entryId: string) => Promise<void>;
}

/**
 * Hook para eliminar una entrada del timeline con revalidación automática.
 * @param petId ID de la mascota.
 */
export const useDeleteTimelineEntry = (
  petId: string
): UseDeleteTimelineEntryResult => {
  const { mutateEntries } = useTimelineData(petId);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<Error>();

  const deleteEntry = async (entryId: string) => {
    setIsDeleting(true);
    setError(undefined);

    try {
      const res = await fetch(
        `/api/timeline/${petId}/entries?id=${entryId}`,
        { method: 'DELETE' }
      );

      if (!res.ok) {
        const errData = await res.json().catch(() => null);
        throw new Error(errData?.error || 'Error al eliminar la entrada.');
      }

      // Revalidación automática de entradas
      await mutateEntries();
      toast.success('Recuerdo eliminado correctamente.');
    } catch (err: any) {
      console.error('[useDeleteTimelineEntry] Error:', err);
      const message = err instanceof Error
        ? err.message
        : 'Error inesperado al eliminar la entrada.';
      setError(err instanceof Error ? err : new Error(message));
      toast.error(message);
    } finally {
      setIsDeleting(false);
    }
  };

  return { isDeleting, error, deleteEntry };
};
