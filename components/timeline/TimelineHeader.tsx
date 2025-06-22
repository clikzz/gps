// components/timeline/TimelineHeader.tsx
"use client";

import { Pets as Pet } from "@prisma/client";
import { calculateAge } from "@/utils/calculateAge";
import { PawPrint, Info } from "lucide-react";
import Image from "next/image";
import React from "react";

interface PetTimelineHeaderProps {
  petData: Pet;
  startDate: string;
  endDate: string;
  onStartDateChange: (date: string) => void;
  onEndDateChange: (date: string) => void;
  milestones: { id: string; name: string; icon_url: string | null }[];
  selectedMilestone: string;
  onMilestoneChange: (id: string) => void;
}

export default function PetTimelineHeader({
  petData,
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  milestones,
  selectedMilestone,
  onMilestoneChange,
  children,
}: PetTimelineHeaderProps & { children?: React.ReactNode }) {
  const age = petData.date_of_birth
    ? calculateAge(petData.date_of_birth)
    : null;
  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="w-full flex flex-col gap-4 py-4">
      {/* Fila 1: foto + nombre y botón */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {petData.photo_url ? (
            <Image
              src={petData.photo_url}
              alt={`Foto de ${petData.name}`}
              width={80}
              height={80}
              className="rounded-full object-cover w-20 h-20 border-2"
            />
          ) : (
            <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center">
              <PawPrint className="w-10 h-10 text-muted-foreground" />
            </div>
          )}
          <div>
            <h1 className="text-2xl font-bold">
              Timeline de {petData.name}
            </h1>
            <p className="text-md text-muted-foreground">
              {age !== null ? `${age} años` : "Edad no especificada"}
            </p>
          </div>
        </div>
        <div className="flex-shrink-0">{children}</div>
      </div>

      {/* Fila 2: filtros */}
      <div className="border-b pb-4">
        <div className="flex flex-wrap items-start gap-6">
          {/* Fecha Desde */}
          <div className="flex flex-col">
            <label htmlFor="startDate" className="text-xs font-medium">
              Desde
            </label>
            <input
              type="date"
              id="startDate"
              value={startDate}
              onChange={(e) => onStartDateChange(e.target.value)}
              max={endDate || undefined}
              className="mt-1 block w-full rounded border px-2 py-1 bg-background"
            />
          </div>

          {/* Fecha Hasta */}
          <div className="flex flex-col">
            <label htmlFor="endDate" className="text-xs font-medium">
              Hasta
            </label>
            <input
              type="date"
              id="endDate"
              value={endDate}
              onChange={(e) => onEndDateChange(e.target.value)}
              min={startDate || undefined}
              max={today}
              className="mt-1 block w-full rounded border px-2 py-1 bg-background"
            />
          </div>

          {/* Selector de Hito con tooltip */}
          <div className="flex flex-col">
            <label
              htmlFor="milestones"
              className="flex items-center text-xs font-medium"
            >
              Hito
              <span
                className="ml-1 cursor-pointer"
                title="Si seleccionas un hito, solo verás los recuerdos que lo incluyan."
              >
                <Info className="w-4 h-4 text-muted-foreground" />
              </span>
            </label>
            <select
              id="milestones"
              value={selectedMilestone}
              onChange={(e) => onMilestoneChange(e.target.value)}
              className="mt-1 block w-full rounded border px-2 py-1 bg-background"
            >
              <option value="">Todos los hitos</option>
              {milestones.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
