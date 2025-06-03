import prisma from "@/lib/db";

export interface MissingPetInput {
  pet_id: number;
  latitude: number;
  longitude: number;
  photo_url?: string;
  description?: string;
}

/**
 * Crea un reporte de mascota desaparecida.
 */
export const createMissingPet = async (
  reporterId: string,
  data: MissingPetInput
) => {
  return prisma.missingPet.create({
    data: {
      reporter_id: reporterId,
      pet_id: data.pet_id,
      latitude: data.latitude,
      longitude: data.longitude,
      photo_url: data.photo_url ?? null,
      description: data.description,
    },
  });
};

/**
 * Listar todos los reportes de mascotas desaparecidas.
 */
export const listAllMissingPets = async () => {
  return prisma.missingPet.findMany({
    include: {
      pet: {
        select: { id: true, name: true },
      },
      reporter: {
        select: { id: true, name: true },
      },
    },
    orderBy: { reported_at: "desc" },
  });
}

/**
 * Lista reportes del último mes para mostrar en el mapa.
 */
export const listRecentMissingPets = async () => {
  const oneMonthAgo = new Date();
  oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

  return prisma.missingPet.findMany({
    where: {
      reported_at: { gte: oneMonthAgo },
    },
    include: {
      pet: {
        select: { id: true, name: true },
      },
      reporter: {
        select: { id: true, name: true },
      },
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