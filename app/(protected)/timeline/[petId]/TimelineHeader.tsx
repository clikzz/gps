"use client";

import { Pets as Pet } from '@prisma/client';
import { calculateAge } from '@/utils/calculateAge';
import { PawPrint } from 'lucide-react';
import Image from 'next/image';
import React from 'react';

interface PetTimelineHeaderProps {
  petData: Pet;
  startDate: string;
  endDate: string;
  onStartDateChange: (date: string) => void;
  onEndDateChange: (date: string) => void;
  milestones: { id: string; name: string; icon_url: string | null }[];  // ← añadido
  selectedMilestone: string;                                      // ← añadido
  onMilestoneChange: (id: string) => void;                        // ← añadido
}

export default function PetTimelineHeader({
  petData,
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  milestones,
  selectedMilestone,    // ← añadido
  onMilestoneChange     // ← añadido
}: PetTimelineHeaderProps) {
  const age = petData.date_of_birth ? calculateAge(petData.date_of_birth) : null;
  const today = new Date().toISOString().split("T")[0];

  return (
    <>
      {/* ——— Header original sin cambios ——— */}
      <div className="flex items-center gap-4 p-4 border-b">
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
          <h1 className="text-2xl font-bold">Timeline de {petData.name}</h1>
          <p className="text-md text-muted-foreground">
            {age !== null ? `${age} años` : 'Edad no especificada'}
          </p>
        </div>
      </div>

      {/* ——— Filtros de fecha ——— */}
      <div className="flex flex-wrap gap-4 p-4 border-b">
        <div>
          <label htmlFor="startDate" className="block text-sm font-medium">
            Desde
          </label>
          <input
            type="date"
            id="startDate"
            value={startDate}
            onChange={e => onStartDateChange(e.target.value)}
            max={endDate || undefined}
            className="mt-1 block w-full rounded border px-2 py-1"
          />
        </div>
        <div>
          <label htmlFor="endDate" className="block text-sm font-medium">
            Hasta
          </label>
          <input
            type="date"
            id="endDate"
            value={endDate}
            onChange={e => onEndDateChange(e.target.value)}
            min={startDate || undefined}
            max={today}
            className="mt-1 block w-full rounded border px-2 py-1"
          />
        </div>
      </div>

      {/* ——— Filtro de un solo hito ——— */}
      <div className="flex flex-col gap-1 p-4 border-b">
        <label htmlFor="milestones" className="block text-sm font-medium">
          Hito
        </label>
        <select
          id="milestones"
          value={selectedMilestone}
          onChange={e => onMilestoneChange(e.target.value)}
          className="mt-1 block w-full rounded border px-2 py-1"
        >
          <option value="">Todos los hitos</option>  {/* ← para limpiar filtro */}
          {milestones.map(m => (
            <option key={m.id} value={m.id}>
              {m.name}
            </option>
          ))}
        </select>
        <p className="text-xs text-muted-foreground">
          Si seleccionas un hito, solo verás los recuerdos que lo incluyan.
        </p>
      </div>
    </>
  );
}
