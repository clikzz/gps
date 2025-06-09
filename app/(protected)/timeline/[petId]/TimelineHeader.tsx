"use client";

import { Pets as Pet } from '@prisma/client';
import { calculateAge } from '@/utils/calculateAge';
import { PawPrint } from 'lucide-react';
import Image from 'next/image';

interface PetTimelineHeaderProps {
  petData: Pet;
}

export default function PetTimelineHeader({ petData }: PetTimelineHeaderProps) {
  const age = petData.date_of_birth ? calculateAge(petData.date_of_birth) : null;

  return (
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
  );
}