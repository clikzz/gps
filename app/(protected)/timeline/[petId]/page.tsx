"use client";

import { useParams } from 'next/navigation';
import useSWR from 'swr';
import PetTimelineHeader from './TimelineHeader';
import NewTimelineEntryCard from './NewTimelineEntryCard';
import TimelineEntriesList from './TimelineEntriesList';
import { TimelineEntryWithPhotos } from '@/app/types/timeline';
import { Pets as Pet } from "@prisma/client";

const fetcher = (url: string) => fetch(url).then((res) => {
  if (!res.ok) throw new Error('Error al cargar los datos.');
  return res.json();
});

export default function PetTimelinePage() {
  const params = useParams();
  const petId = params.petId as string;

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
  } = useSWR<TimelineEntryWithPhotos[]>(petId ? `/api/timeline/${petId}/entries` : null, fetcher);

  const handleNewEntrySaved = () => {
    mutateEntries();
  };

  if (isLoadingPet || isLoadingEntries) {
    return <div className="text-center p-8">Cargando timeline...</div>;
  }

  if (petError || entriesError || !petDetails) {
    return <div className="text-center p-8 text-destructive">Error al cargar el timeline o la mascota no fue encontrada.</div>;
  }

  return (
    <div className="w-full max-w-4xl mx-auto px-4">
      <PetTimelineHeader petData={petDetails} />
      <NewTimelineEntryCard petId={petId} onEntrySaved={handleNewEntrySaved} />
      <hr className="my-6 border-border" />
      <TimelineEntriesList entries={entries || []} />
    </div>
  );
}