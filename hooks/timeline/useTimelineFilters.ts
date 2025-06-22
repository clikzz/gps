import { useMemo } from 'react';
import { TimelineEntryWithPhotos } from '@/types/timeline';

export interface TimelineFilterParams {
  startDate?: string;
  endDate?: string;
  selectedMilestone?: string;
}

export interface UseTimelineFiltersResult {
  filteredEntries: TimelineEntryWithPhotos[];
}

/**
 * Hook para filtrar entradas de timeline por rango de fechas y por hito seleccionado.
 * @param entries Lista completa de entradas.
 * @param params Parámetros de filtrado: startDate, endDate, selectedMilestone.
 */
export const useTimelineFilters = (
  entries: TimelineEntryWithPhotos[],
  params: TimelineFilterParams
): UseTimelineFiltersResult => {
  const { startDate, endDate, selectedMilestone } = params;

  const filteredEntries = useMemo(() => {
    // Filtrado por fecha
    const byDate = entries.filter((entry) => {
      const date = new Date(entry.event_date);
      const afterStart = startDate ? date >= new Date(startDate) : true;
      const beforeEnd = endDate ? date <= new Date(endDate) : true;
      return afterStart && beforeEnd;
    });

    // Filtrado por hito
    if (selectedMilestone) {
      return byDate.filter((entry) =>
        entry.Milestones?.some((m) => m.id === selectedMilestone)
      );
    }

    return byDate;
  }, [entries, startDate, endDate, selectedMilestone]);

  return { filteredEntries };
};
