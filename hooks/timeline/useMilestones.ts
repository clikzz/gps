import useSWR from 'swr';

// Definición de un hito (Milestone)
export interface Milestone {
  id: string;
  name: string;
  icon_url: string | null;
}

// Resultado expuesto por el hook
export interface UseMilestonesResult {
  milestones: Milestone[];
  isLoading: boolean;
  error?: Error;
}

// Fetcher genérico para llamadas a la API
const fetcher = async <T>(url: string): Promise<T> => {
  const res = await fetch(url);
  if (!res.ok) throw new Error('Error al cargar los hitos.');
  return res.json();
};

/**
 * Hook para cargar los hitos desde la API.
 * Usa la ruta `/api/milestones`.
 */
export const useMilestones = (): UseMilestonesResult => {
  const { data, error, isLoading } = useSWR<Milestone[]>(
    '/api/milestones',
    fetcher
  );

  return {
    milestones: data ?? [],
    isLoading,
    error,
  };
};
