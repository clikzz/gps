import prisma from "@/lib/db";

export const getPets = async (user_id: string) => {
  return await prisma.pets.findMany({
    where: { user_id },
  });
};

export const getPetById = async (id: number) => {
  return await prisma.pets.findUnique({
    where: { id: id },
  });
};

export const createPet = async ({
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
  const activePetsCount = await prisma.pets.count({
    where: {
      user_id: user.id,
      deleted: false,
    },
  });

  if (activePetsCount >= 10) {
    return new Response(
      JSON.stringify({
        error:
          "Solo puedes tener 10 mascotas activas, elimina una e inténtalo nuevamente",
      }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  return await prisma.pets.create({
    data: {
      user_id: user.id,
      name: pet.name,
      species: pet.species,
      ...(pet.active !== undefined && { active: pet.active }),
      ...(pet.date_of_adoption && { date_of_adoption: pet.date_of_adoption }),
      ...(pet.date_of_birth && { date_of_birth: pet.date_of_birth }),
      ...(pet.fixed !== undefined && { fixed: pet.fixed }),
      ...(pet.sex && { sex: pet.sex }),
      ...(pet.photo_url && { photo_url: pet.photo_url }),
    },
  });
};

export const putPetById = async ({
  id,
  name,
  species,
  active,
  date_of_adoption,
  date_of_birth,
  fixed,
  sex,
  photo_url,
}: {
  id: number;
  name: string;
  species: string;
  active: boolean;
  date_of_adoption: Date;
  date_of_birth: Date;
  fixed: boolean;
  sex: string;
  photo_url: string;
}) => {
  return await prisma.pets.update({
    where: { id },
    data: {
      name,
      species,
      active,
      date_of_adoption,
      date_of_birth,
      fixed,
      sex,
      photo_url,
    },
  });
};

export const softDeletePetById = async (id: number) => {
  return await prisma.pets.update({
    where: { id },
    data: {
      deleted: true,
    },
  });
};
