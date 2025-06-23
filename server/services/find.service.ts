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
    const exists = await tx.missingPets.findFirst({
      where: {
        pet_id: data.pet_id,
        reporter_id: reporterId,
        resolved: false,
      }
    });
    if (exists) {
      throw new Error("Ya tienes un reporte activo para esta mascota.");
    }

    const missing = await tx.missingPets.create({
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
 * Marca una mascota como encontrada y resuelve su reporte activos. Solo el usuario que reportó la desaparición puede marcarla como encontrada.
 */
export const markPetAsFound = async (petId: number, userId: string) => {
  return prisma.$transaction(async (tx) => {
    const updatePet = await tx.pets.updateMany({
      where: { id: petId, user_id: userId },
      data: { is_lost: false },
    });

    if (updatePet.count === 0) {
      throw new Error("No tienes permiso para marcar esta mascota como encontrada.");
    }

    await tx.missingPets.updateMany({
      where: {
        pet_id: petId,
        reporter_id: userId,
        resolved: false,
      },
      data: { resolved: true },
    });

    return true;
  });
};

/**
 * Listar todos los reportes de mascotas desaparecidas.
 */
export const listAllMissingPets = async () => {
  return prisma.missingPets.findMany({
    where: {
      resolved: false,
      Pets: { is_lost: true },
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
 * Listar los reportes de mascotas desaparecidas de otros usuarios.
 */
export const listOtherMissingPets = async (userId: string) => {
  return prisma.missingPets.findMany({
    where: {
      reporter_id: { not: userId },
      resolved: false,
      Pets: { is_lost: true },
    },
    include: {
      Pets: {
        select: { id: true, name: true, photo_url: true, is_lost: true },
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
      resolved: false,
      Pets: { is_lost: true },
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
    where: {
      reporter_id: userId,
      resolved: false,
      Pets: { is_lost: true },
    },
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
    where: {
      user_id: userId,
      is_lost: false,
    },
    orderBy: { name: "asc" },
  });
};

/**
 * Reportar a otro usuario que su mascota posiblemente fué encontrada.
 */
export const createFoundReport = async (
  helperId: string,
  missingPetId: number,
  data: {
    photo_urls?: string[];
    description?: string;
    latitude: number;
    longitude: number; 
  }
) => {
  return prisma.foundReports.create({
    data: {
      helperId,
      missingPetId,
      photo_urls: data.photo_urls ?? [],
      description: data.description,
      latitude: data.latitude,
      longitude: data.longitude,
    },
  });
};