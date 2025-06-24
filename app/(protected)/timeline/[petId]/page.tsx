"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import TimelineHeader from "@/components/timeline/TimelineHeader";
import NewTimelineDrawer from "@/components/timeline/NewTimelineDrawer";
import TimelineEntriesList from "@/components/timeline/TimelineEntriesList";
import { useTimelineData } from "@/hooks/timeline/useTimelineData";
import { useMilestones } from "@/hooks/timeline/useMilestones";


export default function PetTimelinePage() {
  const { petId } = useParams() as { petId: string };

  const {
    pet,
    isLoading: isLoadingData,
    error: dataError,
  } = useTimelineData(petId);

  const {
    milestones,
    isLoading: isLoadingMilestones,
    error: milestonesError,
  } = useMilestones();

  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [selectedMilestone, setSelectedMilestone] = useState<string>("");

  const [reloadSignal, setReloadSignal] = useState(0);

  const isLoading = isLoadingData || isLoadingMilestones;
  const error = dataError || milestonesError;

  if (isLoading) {
    return <div className="text-center p-8">Cargando timeline...</div>;
  }
  if (error || !pet) {
    return (
      <div className="text-center p-8 text-destructive">
        Error al cargar el timeline o la mascota no fue encontrada.
      </div>
    );
  }

  return (
    <div className="w-full px-4">
      <TimelineHeader
        petData={pet}
        startDate={startDate}
        endDate={endDate}
        onStartDateChange={setStartDate}
        onEndDateChange={setEndDate}
        milestones={milestones}
        selectedMilestone={selectedMilestone}
        onMilestoneChange={setSelectedMilestone}
      >
        <NewTimelineDrawer
          petId={pet.id.toString()}
          onSuccess={() => setReloadSignal((n) => n + 1)}
        />
      </TimelineHeader>

      <hr className="my-6 border-border" />

      <TimelineEntriesList
        startDate={startDate}
        endDate={endDate}
        milestoneId={selectedMilestone}
        reloadSignal={reloadSignal}
      />
    </div>
  );
}