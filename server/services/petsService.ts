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
  name,
  species,
}: {
  user: {
    id: string;
  };
  name: string;
  species: string;
}) => {
  return await prisma.pets.create({
    data: {
      user_id: user.id,
      name,
      species,
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
