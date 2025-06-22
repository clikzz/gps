import useSWR from 'swr';
import { Pets as Pet } from '@prisma/client';
import { TimelineEntryWithPhotos } from '@/types/timeline';

// Genérico fetcher para llamadas a la API
const fetcher = async <T>(url: string): Promise<T> => {
  const res = await fetch(url);
  if (!res.ok) throw new Error('Error al cargar los datos.');
  return res.json();
};

// Resultado expuesto por el hook
export interface UseTimelineDataResult {
  pet?: Pet;
  entries: TimelineEntryWithPhotos[];
  isLoading: boolean;
  error?: Error;
  mutateEntries: () => Promise<TimelineEntryWithPhotos[] | undefined>;
}

/**
 * Carga los datos de la mascota y sus entradas de timeline.
 * @param petId ID de la mascota a consultar.
 */
export const useTimelineData = (petId: string): UseTimelineDataResult => {
  // Mascota
  const {
    data: pet,
    error: petError,
    isLoading: isLoadingPet,
  } = useSWR<Pet>(
    petId ? `/api/pets?mode=id&id=${petId}` : null,
    fetcher
  );

  // Entradas del timeline
  const {
    data: entries,
    error: entriesError,
    isLoading: isLoadingEntries,
    mutate: mutateEntries,
  } = useSWR<TimelineEntryWithPhotos[]>(
    petId ? `/api/timeline/${petId}/entries` : null,
    fetcher
  );

  return {
    pet,
    entries: entries ?? [],
    isLoading: isLoadingPet || isLoadingEntries,
    error: petError || entriesError,
    mutateEntries: mutateEntries as () => Promise<TimelineEntryWithPhotos[] | undefined>,
  };
};