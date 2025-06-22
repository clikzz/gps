"use client";

import { useState } from "react";
import { useParams } from "next/navigation";

import PetTimelineHeader from "./TimelineHeader";
import NewTimelineDrawer from "@/components/timeline/NewTimelineDrawer";
import TimelineEntriesList from "./TimelineEntriesList";

import { useTimelineData } from "@/hooks/timeline/useTimelineData";
import { useMilestones } from "@/hooks/timeline/useMilestones";
import { useTimelineFilters } from "@/hooks/timeline/useTimelineFilters";

export default function PetTimelinePage() {
  const { petId } = useParams() as { petId: string };

  // Carga datos principales
  const {
    pet,
    entries,
    isLoading: isLoadingData,
    error: dataError,
    mutateEntries,
  } = useTimelineData(petId);

  // Carga hitos
  const {
    milestones,
    isLoading: isLoadingMilestones,
    error: milestonesError,
  } = useMilestones();

  // Estados de filtro
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [selectedMilestone, setSelectedMilestone] = useState<string>("");

  // Aplicar filtros
  const { filteredEntries } = useTimelineFilters(entries, {
    startDate,
    endDate,
    selectedMilestone,
  });

  // Estado combinado
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
    <div className="w-full max-w-4xl mx-auto px-4">
      <PetTimelineHeader
        petData={pet}
        startDate={startDate}
        endDate={endDate}
        onStartDateChange={setStartDate}
        onEndDateChange={setEndDate}
        milestones={milestones}
        selectedMilestone={selectedMilestone}
        onMilestoneChange={setSelectedMilestone}
      />

      {/* Botón para crear nueva entrada en Drawer */}
      <NewTimelineDrawer petId={pet.id.toString()} />

      <hr className="my-6 border-border" />

      <TimelineEntriesList
        entries={filteredEntries}
        onEntryDeleted={mutateEntries}
      />
    </div>
  );
}
