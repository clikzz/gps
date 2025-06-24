"use client";

import React from "react";
import { useActivePet } from "@/stores/activePet";
import { Hospital } from "lucide-react";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";

function HealthPage() {
  const pet = useActivePet((state) => state.activePet);
  const resetActivePet = useActivePet((state) => state.resetActivePet);
  const PetSelector = dynamic(() => import("@/components/PetSelector"), {
    ssr: false,
  });

  return (
    <div>
      {!pet && <PetSelector />}
      {pet && (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Hospital className="h-6 w-6 text-primary" />
            <h1 className="font-bold text-2xl md:text-3xl">
              Resumen de Salud de {pet.name}
            </h1>
          </div>
          <Button onClick={resetActivePet}>Cambiar mascota</Button>
        </div>
      )}
    </div>
  );
}

export default HealthPage;
