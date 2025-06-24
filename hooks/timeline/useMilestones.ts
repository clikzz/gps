import useSWR from 'swr';


export interface Milestone {
  id: string;
  name: string;
  icon_url: string | null;
}

export interface UseMilestonesResult {
  milestones: Milestone[];
  isLoading: boolean;
  error?: Error;
}

const fetcher = async <T>(url: string): Promise<T> => {
  const res = await fetch(url);
  if (!res.ok) throw new Error('Error al cargar los hitos.');
  return res.json();
};

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
