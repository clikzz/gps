import {
  getPets,
  getPetById,
  createPet,
  putPetById,
} from "../services/petsService";
import { Pets as Pet } from "@prisma/client";
import { petSchema } from "@/server/validations/petsValidation";

export const fetchPets = async (userId: string) => {
  const pets = await getPets(userId);
  console.log(pets);

  const formattedPets = pets.map((pet: Pet) => ({
    ...pet,
    id: pet.id.toString(),
  }));
  return new Response(JSON.stringify(formattedPets), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
};

export const addPet = async ({
  user,
  pet,
}: {
  user: {
    id: string;
  };
  pet: {
    name: string;
    species: string;
    active?: boolean;
    date_of_adoption?: Date;
    date_of_birth?: Date;
    fixed?: boolean;
    sex?: string;
    photo_url?: string;
  };
}) => {
  const parsedPet = petSchema.safeParse({
    ...pet,
    user_id: user.id,
  });

  if (!parsedPet.success) {
    return new Response(JSON.stringify(parsedPet.error), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const newPet = await createPet({
    user,
    pet,
  });
  const formattedPet = {
    ...newPet,
    id: newPet.id.toString(),
  };
  return new Response(JSON.stringify(formattedPet), {
    status: 201,
    headers: { "Content-Type": "application/json" },
  });
};

// BY ID

export const fetchPetById = async (petId: string) => {
  const pet = await getPetById(parseInt(petId));
  if (!pet) {
    return new Response(JSON.stringify({ error: "Pet not found" }), {
      status: 404,
      headers: { "Content-Type": "application/json" },
    });
  }

  const petFetched = {
    ...pet,
    id: pet?.id.toString(),
  };

  return new Response(JSON.stringify(petFetched), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
};

export const updatePetById = async (
  petId: string,
  {
    name,
    species,
    active,
    date_of_adoption,
    date_of_birth,
    fixed,
    sex,
    photo_url,
  }: {
    name: string;
    species: string;
    active: boolean;
    date_of_adoption: Date;
    date_of_birth: Date;
    fixed: boolean;
    sex: string;
    photo_url: string;
  }
) => {
  const pet = await getPetById(parseInt(petId));

  if (!pet) {
    return new Response(JSON.stringify({ error: "Pet not found" }), {
      status: 404,
      headers: { "Content-Type": "application/json" },
    });
  }

  const updatedPet = await putPetById({
    id: parseInt(petId),
    name,
    species,
    active,
    date_of_adoption,
    date_of_birth,
    fixed,
    sex,
    photo_url,
  });
  if (!updatedPet) {
    return new Response(JSON.stringify({ error: "Failed to update pet" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
  const formattedPet = {
    ...updatedPet,
    id: updatedPet.id.toString(),
  };
  return new Response(JSON.stringify(formattedPet), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
};
