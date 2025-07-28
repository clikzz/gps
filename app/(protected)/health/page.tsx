"use client";

import React from "react";
import { useActivePet } from "@/stores/activePet";
import { HeartPulse } from "lucide-react";
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
  const [activeTab, setActiveTab] = React.useState("nextdoses");

  const PetSelector = dynamic(() => import("@/components/PetSelector"), {
    ssr: false,
  });

  // Cargar datos una sola vez al montar el componente
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

    fetchData();
  }, [setHealthResume]);

  if (isLoading) {
    return (
      <LoadingScreen
        title="Cargando"
        subtext="Obteniendo información de salud"
        icon={HeartPulse}
        accentIcon={HeartPulse}
      />
    );
  }

  // Función para determinar si la tab actual requiere mascota
  const requiresPet = (tab: string) => {
    return ["vaccines", "medications", "timeline"].includes(tab);
  };

  // Función para determinar el título dinámico
  const getTitle = () => {
    switch (activeTab) {
      case "nextdoses":
        return "Próximas dosis - Todas las mascotas";
      case "vaccines":
        return pet ? `Vacunas de ${pet.name}` : "Vacunas";
      case "medications":
        return pet ? `Medicamentos de ${pet.name}` : "Medicamentos";
      case "timeline":
        return pet ? `Cronología de ${pet.name}` : "Cronología";
      case "calendar":
        return "Calendario de salud - Todas las mascotas";
      default:
        return "Salud";
    }
  };

  return (
    <div>
      {/* Si la tab requiere mascota y no hay una seleccionada, mostrar selector */}
      {requiresPet(activeTab) && !pet && <PetSelector opened={true} />}

      {/* Si la tab no requiere mascota O si hay mascota seleccionada, mostrar contenido */}
      {(!requiresPet(activeTab) || pet) && (
        <div className="max-w-7xl mx-auto p-6">
          <div className="flex items-center gap-2 mb-6">
            <HeartPulse className="h-6 w-6 text-primary" />
            <h1 className="font-bold text-2xl md:text-3xl">{getTitle()}</h1>
          </div>

          <TabSelector onTabChange={setActiveTab} />

          {/* Botones de acción - solo mostrar en tabs específicas */}
          {activeTab === "vaccines" && pet && (
            <div className="mt-6 flex flex-col gap-4 justify-center">
              <div className="flex justify-center">
                <AddVaccinationDrawer />
              </div>
              <div className="flex justify-center">
                <PetSelector />
              </div>
            </div>
          )}

          {activeTab === "medications" && pet && (
            <div className="mt-6 flex flex-col gap-4 justify-center">
              <div className="flex justify-center">
                <AddMedicationDrawer />
              </div>
              <div className="flex justify-center">
                <PetSelector />
              </div>
            </div>
          )}

          {/* En timeline solo mostrar selector para cambiar mascota */}
          {activeTab === "timeline" && pet && (
            <div className="mt-6 flex justify-center">
              <PetSelector />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default HealthPage;
