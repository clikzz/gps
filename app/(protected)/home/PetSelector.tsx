import React from "react";
import { useUserProfile } from "@/stores/userProfile";
import { useActivePet } from "@/stores/activePet";

function PetSelector() {
  const pets = useUserProfile((state) => state.user?.pets);
  const setActivePet = useActivePet((state) => state.setActivePet);

  return (
    <div className="absolute flex-col gap-4 top-0 left-0 w-screen h-screen bg-black/90 flex items-center justify-center">
      <p className="font-bold">Selecciona tu mascota</p>
      <div className="flex gap-4">
        {pets?.map((pet) => (
          <button
            key={pet.id}
            className="bg-white text-black p-2 rounded"
            onClick={() => setActivePet(pet)}
          >
            {pet.name}
          </button>
        ))}
      </div>
    </div>
  );
}

export default PetSelector;
