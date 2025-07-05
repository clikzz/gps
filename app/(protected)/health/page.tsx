"use client";

import React from "react";
import { useActivePet } from "@/stores/activePet";
import { Hospital } from "lucide-react";
import { TabSelector } from "@/components/health/tab-selector";
import { useHealth } from "@/stores/health";
import { handleGetHealth } from "@/hooks/health/useHealth";
import dynamic from "next/dynamic";
import { AddMedicationDrawer } from "@/components/health/medications/add-medication-drawer";
import { AddVaccinationDrawer } from "@/components/health/vaccinations/add-vaccination-drawer";

function HealthPage() {
  const pet = useActivePet((state) => state.activePet);
  const setHealthResume = useHealth((state) => state.setHealthResume);
  const PetSelector = dynamic(() => import("@/components/PetSelector"), {
    ssr: false,
  });

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await handleGetHealth();
        setHealthResume({
          medications: data.medications,
          vaccinations: data.vaccinations,
          nextDoses: data.nextDoses,
        });
      } catch (error) {
        console.error("Error fetching health data:", error);
      }
    };

    if (pet) {
      fetchData();
    }
  }, [pet, setHealthResume]);

  return (
    <div>
      {!pet && <PetSelector opened={true} />}
      {pet && (
        <div className="max-w-7xl mx-auto p-6">
          <div className="flex items-center gap-2 mb-6">
            <Hospital className="h-6 w-6 text-primary" />
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

          {/* PLACEHOLDER: Email Alert System */}
          <div className="mt-8 p-6 border-2 border-dashed border-muted-foreground/25 rounded-lg bg-muted/10">
            <h3 className="font-semibold text-lg mb-3">
              🚧 Sistema de Alertas por Email
            </h3>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>
                <strong>Funcionalidades a implementar:</strong>
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>
                  Configuración de alertas automáticas por correo electrónico
                </li>
                <li>
                  Notificaciones X días antes de próximas vacunas/medicamentos
                </li>
                <li>Gestión de direcciones de correo para notificaciones</li>
                <li>Plantillas de email personalizables</li>
                <li>Historial de alertas enviadas</li>
                <li>Configuración de frecuencia de recordatorios</li>
              </ul>
              <p className="mt-3">
                <strong>Ubicaciones de implementación:</strong>
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>
                  <code>/api/health/alerts</code> - API para gestión de alertas
                </li>
                <li>
                  <code>/lib/email</code> - Servicio de envío de emails
                </li>
                <li>
                  <code>/components/health/alerts</code> - Componentes de
                  configuración
                </li>
                <li>Cron job o scheduled function para envío automático</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default HealthPage;
