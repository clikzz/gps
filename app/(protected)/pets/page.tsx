"use client";

import React from "react";
import { useUserProfile } from "@/stores/userProfile";
import NewPetCard from "./NewPetCard";
import PetCard from "./PetCard";

function Pets() {
  const pets = useUserProfile((state) => state?.user?.pets);
  return (
    <div>
      <h2 className="font-bold text-2xl mb-4">Tus mascotas</h2>
      <p className="text-sm text-gray-500 mb-4">
        Aquí puedes ver y gestionar tus mascotas.
      </p>
      <NewPetCard />
      <div className="flex">
        {pets && pets.length > 0 ? (
          <div className="flex">
            {pets.map((pet) => (
              <PetCard pet={pet} key={pet.id} />
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500">
            No tienes mascotas registradas.
          </p>
        )}
      </div>
    </div>
  );
}

export default Pets;
