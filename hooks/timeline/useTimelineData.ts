import useSWR from 'swr';
import { Pets as Pet } from '@prisma/client';
import { TimelineEntryWithPhotos } from '@/types/timeline';

const fetcher = async <T>(url: string): Promise<T> => {
  const res = await fetch(url);
  if (!res.ok) throw new Error('Error al cargar los datos.');
  return res.json();
};

export interface UseTimelineDataFilters {
  startDate?: string;
  endDate?: string;
  milestoneId?: string;
  skip?: number;
  take?: number;
}

export interface UseTimelineDataResult {
  pet?: Pet;
  entries: TimelineEntryWithPhotos[];
  total: number;
  isLoading: boolean;
  error?: Error;
  mutateEntries: () => Promise<any>;
}

// Convierte fecha local a UTC ISO puro
function toUtcIso(dateStr?: string): string | undefined {
  if (!dateStr) return undefined;
  const d = new Date(dateStr + "T00:00:00");
  return new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate())).toISOString();
}

export const useTimelineData = (
  petId: string,
  filters: UseTimelineDataFilters = {}
): UseTimelineDataResult => {
  // Mascota
  const {
    data: pet,
    error: petError,
    isLoading: isLoadingPet,
  } = useSWR<Pet>(
    petId ? `/api/pets?mode=id&id=${petId}` : null,
    fetcher
  );

  // Entradas del timeline (con filtros y paginación)
  const queryParams = new URLSearchParams({
    ...(filters.startDate && { startDate: toUtcIso(filters.startDate) }),
    ...(filters.endDate && { endDate: toUtcIso(filters.endDate) }),
    ...(filters.milestoneId && { milestoneId: filters.milestoneId }),
    ...(typeof filters.skip === "number" ? { skip: filters.skip.toString() } : {}),
    ...(typeof filters.take === "number" ? { take: filters.take.toString() } : {}),
  }).toString();

  const {
    data,
    error: entriesError,
    isLoading: isLoadingEntries,
    mutate: mutateEntries,
  } = useSWR<{ entries: TimelineEntryWithPhotos[]; total: number }>(
    petId ? `/api/timeline/${petId}/entries?${queryParams}` : null,
    fetcher
  );

  return {
    pet,
    entries: data?.entries ?? [],
    total: data?.total ?? 0,
    isLoading: isLoadingPet || isLoadingEntries,
    error: petError || entriesError,
    mutateEntries,
  };
};
