"use client";

import { useState } from 'react';
import { useParams } from 'next/navigation';
import useSWR from 'swr';
import PetTimelineHeader from './TimelineHeader';
import NewTimelineEntryCard from './NewTimelineEntryCard';
import TimelineEntriesList from './TimelineEntriesList';
import { TimelineEntryWithPhotos } from '@/types/timeline';
import { Pets as Pet } from "@prisma/client";

const fetcher = (url: string) => fetch(url).then((res) => {
  if (!res.ok) throw new Error('Error al cargar los datos.');
  return res.json();
});

export default function PetTimelinePage() {
  const params = useParams();
  const petId = params.petId as string;

  const [startDate, setStartDate] = useState<string>('');
  const [endDate,   setEndDate]   = useState<string>('');
  const [selectedMilestone, setSelectedMilestone] = useState<string>(''); // ← acá

  const { 
    data: petDetails, 
    error: petError, 
    isLoading: isLoadingPet 
  } = useSWR<Pet>(petId ? `/api/pets/${petId}` : null, fetcher);

  const { 
    data: entries, 
    error: entriesError, 
    isLoading: isLoadingEntries, 
    mutate: mutateEntries 
  } = useSWR<TimelineEntryWithPhotos[]>(
    petId ? `/api/timeline/${petId}/entries` : null,
    fetcher
  );

  const handleNewEntrySaved = () => mutateEntries();

  if (isLoadingPet || isLoadingEntries) {
    return <div className="text-center p-8">Cargando timeline...</div>;
  }

  if (petError || entriesError || !petDetails) {
    return (
      <div className="text-center p-8 text-destructive">
        Error al cargar el timeline o la mascota no fue encontrada.
      </div>
    );
  }

  // — Filtrado según rango de fechas —
  const filteredByDate = (entries || []).filter(entry => {
    const d = new Date(entry.event_date);
    const afterStart = startDate ? d >= new Date(startDate) : true;
    const beforeEnd  = endDate   ? d <= new Date(endDate)   : true;
    return afterStart && beforeEnd;
  });

  // — Lista única de hitos —
  const allMilestones = Array.from(
    new Map(
      filteredByDate
        .flatMap(e => e.Milestones || [])
        .map(m => [m.id, m] as [string, typeof m])
    ).values()
  );

  // — Filtrado por un único hito (OR) —
  const filteredEntries = filteredByDate.filter(entry => {
    if (!selectedMilestone) return true;
    return entry.Milestones?.some(m => m.id === selectedMilestone);
  });

  return (
    <div className="w-full max-w-4xl mx-auto px-4">
      <PetTimelineHeader
        petData={petDetails}
        startDate={startDate}
        endDate={endDate}
        onStartDateChange={setStartDate}
        onEndDateChange={setEndDate}
        milestones={allMilestones}
        selectedMilestone={selectedMilestone}               // ← acá
        onMilestoneChange={setSelectedMilestone}             // ← y acá
      />
      <NewTimelineEntryCard petId={petId} onEntrySaved={handleNewEntrySaved} />
      <hr className="my-6 border-border" />
      <TimelineEntriesList entries={filteredEntries} />
    </div>
  );
}
