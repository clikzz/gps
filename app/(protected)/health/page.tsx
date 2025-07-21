"use client";

import React from "react";
import { useActivePet } from "@/stores/activePet";
import { Hospital, Heart, HeartPulse } from "lucide-react";
import { TabSelector } from "@/components/health/tab-selector";
import { useHealth } from "@/stores/health";
import { handleGetHealth } from "@/hooks/health/useHealth";
import dynamic from "next/dynamic";
import { AddMedicationDrawer } from "@/components/health/medications/add-medication-drawer";
import { AddVaccinationDrawer } from "@/components/health/vaccinations/add-vaccination-drawer";
import LoadingScreen from "@/components/LoadingScreen";

function HealthPage() {
  const pet = useActivePet((state) => state.activePet);
  const setHealthResume = useHealth((state) => state.setHealthResume);
  const [isLoading, setIsLoading] = React.useState(false);
  const PetSelector = dynamic(() => import("@/components/PetSelector"), {
    ssr: false,
  });

  React.useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const data = await handleGetHealth();
        setHealthResume({
          medications: data.medications,
          vaccinations: data.vaccinations,
          nextDoses: data.nextDoses,
        });
      } catch (error) {
        console.error("Error fetching health data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (pet) {
      fetchData();
    }
  }, [pet, setHealthResume]);

  if (isLoading) {
    return (
      <LoadingScreen
        title="Cargando"
        subtext="Obteniendo información de salud"
        icon={HeartPulse}
        accentIcon={Heart}
      />
    );
  }

  return (
    <div>
      {!pet && <PetSelector opened={true} />}
      {pet && (
        <div className="max-w-7xl mx-auto p-6">
          <div className="flex items-center gap-2 mb-6">
            <HeartPulse className="h-6 w-6 text-primary" />
            <h1 className="font-bold text-2xl md:text-3xl">
              Salud de {pet.name}
            </h1>
          </div>

          <TabSelector />

          <div className="mt-6 flex flex-col gap-4 justify-center">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <AddMedicationDrawer />
              <AddVaccinationDrawer />
            </div>
            <PetSelector />
          </div>
        </div>
      )}
    </div>
  );
}

export default HealthPage;
