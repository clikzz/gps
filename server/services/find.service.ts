import prisma from "@/lib/db";

export interface MissingPetInput {
  pet_id: number;
  latitude: number;
  longitude: number;
  photo_urls?: string[];
  description?: string;
}

/**
 * Crea un reporte de mascota desaparecida.
 */
export const createMissingPet = async (
  reporterId: string,
  data: MissingPetInput
) => {
  return prisma.missingPets.create({
    data: {
      reporter_id: reporterId,
      pet_id: data.pet_id,
      latitude: data.latitude,
      longitude: data.longitude,
      photo_urls: data.photo_urls ?? [],
      description: data.description,
    },
  });
};

/**
 * Listar todos los reportes de mascotas desaparecidas.
 */
export const listAllMissingPets = async () => {
  return prisma.missingPets.findMany({
    include: {
      Pets: {
        select: { id: true, name: true, photo_url: true },
      },
      users: {
        select: { id: true, name: true },
      },
    },
    orderBy: { reported_at: "desc" },
  });
};

/**
 * Lista reportes del último mes para mostrar en el mapa.
 */
export const listRecentMissingPets = async () => {
  const oneMonthAgo = new Date();
  oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

  return prisma.missingPets.findMany({
    where: {
      reported_at: { gte: oneMonthAgo },
    },
    include: {
      Pets: {
        select: { id: true, name: true, photo_url: true },
      },
      users: {
        select: { id: true, name: true },
      },
    },
    orderBy: { reported_at: "desc" },
  });
};

/**
 * Lista reportes de mascotas desaparecidas del usuario autenticado.
 */
export const listMyMissingPets = async (userId: string) => {
  return prisma.missingPets.findMany({
    where: { reporter_id: userId },
    include: {
      Pets: { select: { id: true, name: true, photo_url: true } },
      users: { select: { id: true, name: true } },
    },
    orderBy: { reported_at: "desc" },
  });
};

/**
 * Listar mascotas del usuario autenticado.
 */
export const findPetsByUser = async (userId: string) => {
  return prisma.pets.findMany({
    where: { user_id: userId },
    orderBy: { name: "asc" },
  });
};
