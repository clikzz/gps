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
  return prisma.$transaction(async (tx) => {
    const missing = await prisma.missingPet.create({
      data: {
        reporter_id: reporterId,
        pet_id: data.pet_id,
        latitude: data.latitude,
        longitude: data.longitude,
        photo_urls: data.photo_urls ?? [],
        description: data.description,
      },
    });

    await tx.pets.update({
      where: { id: data.pet_id },
      data: { is_lost: true },
    });

    return missing;
  });
};

/**
 * Marca una mascota como encontrada. Solo el usuario que reportó la desaparición puede marcarla como encontrada.
 */
export const markPetAsFound = async (petId: number, userId: string) => {
  const result = await prisma.pets.updateMany({
    where: { id: petId, user_id: userId },
    data: { is_lost: false },
  });
  return result.count > 0;
};

/**
 * Listar todos los reportes de mascotas desaparecidas.
 */
export const listAllMissingPets = async () => {
  return prisma.missingPet.findMany({
    include: {
      pet: {
        select: { id: true, name: true, photo_url: true },
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
        select: { id: true, name: true, photo_url: true },
      },
      reporter: {
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
  return prisma.missingPet.findMany({
    where: { reporter_id: userId },
    include: {
      pet: { select: { id: true, name: true, photo_url: true } },
      reporter: { select: { id: true, name: true } },
    },
    orderBy: { reported_at: "desc" },
  });
};

/**
 * Listar mascotas del usuario autenticado.
 */
export const findPetsByUser = async (userId: string) => {
  return prisma.pet.findMany({
    where: { user_id: userId },
    orderBy: { name: "asc" },
  });
};