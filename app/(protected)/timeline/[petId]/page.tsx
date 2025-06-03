
"use client";
import { useParams } from 'next/navigation';
import PetTimelineHeader from './TimelineHeader';
import NewTimelineEntryCard from './NewTimelineEntryCard';
import TimelineEntriesList from './TimelineEntriesList';
import { useState } from 'react'; 

export default function PetTimelinePage() {
  const params = useParams();
  const petId = params.petId as string;

  
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleNewEntrySaved = () => {
    setRefreshTrigger(prev => prev + 1); 
  };

  if (!petId) return <p>Cargando...</p>; 

  return (
    <div>
      <PetTimelineHeader petId={petId} />
      <NewTimelineEntryCard petId={petId} onEntrySaved={handleNewEntrySaved} />
      <hr style={{ margin: '20px 0' }} />
      <TimelineEntriesList petId={petId} key={refreshTrigger} /> {/* key para forzar re-render y re-fetch */}
    </div>
  );
}