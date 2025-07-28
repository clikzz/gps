import prisma from "@/lib/db";
import { reverseGeocode } from "@/utils/geocode";

export interface MissingPetInput {
  pet_id: number;
  latitude: number;
  longitude: number;
  photo_urls?: string[];
  description?: string;
};

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

    const addr = await reverseGeocode(data.latitude, data.longitude);

    const missing = await tx.missingPets.create({
      data: {
        reporter_id: reporterId,
        pet_id: data.pet_id,
        latitude: data.latitude,
        longitude: data.longitude,
        photo_urls: data.photo_urls ?? [],
        description: data.description,
        full_address: addr.full_address,
        address: addr.address,
        street: addr.street,
        city: addr.city,
        region: addr.region,
        postcode: addr.postcode,
        country: addr.country,
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
 * Actualiza un reporte de mascota desaparecida.
 */
export const updateMissingPet = async (
  reportId: number,
  userId: string,
  data: Partial<{
    latitude: number
    longitude: number
    description: string
    photo_urls: string[]
  }>
) => {
  return prisma.$transaction(async (tx) => {
    const rpt = await tx.missingPets.findFirst({
      where: { id: reportId, reporter_id: userId, resolved: false },
    })
    if (!rpt) throw new Error("No autorizado o reporte ya resuelto")

    let addr = {}
    if (data.latitude !== undefined && data.longitude !== undefined) {
      addr = await reverseGeocode(data.latitude, data.longitude)
    }

    const updated = await tx.missingPets.update({
      where: { id: reportId },
      data: {
        ...data,
        ...addr,
      },
    })

    return updated
  })
}

/**
 * Elimina un reporte de mascota desaparecida. Solo el usuario que lo creó puede eliminarlo
 * y solo si no ha sido resuelto.
 */
export const deleteMissingPet = async (reportId: number, userId: string) => {
  return prisma.$transaction(async (tx) => {
    const rpt = await tx.missingPets.findFirst({
      where: { id: reportId, reporter_id: userId },
      include: { Pets: true },
    })
    if (!rpt) throw new Error("No autorizado o no existe")

    await tx.missingPets.delete({ where: { id: reportId } })

    await tx.pets.update({
      where: { id: rpt.pet_id },
      data: { is_lost: false },
    })

    return true
  })
}

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
        select: { id: true, name: true, photo_url: true, species: true },
      },
      users: {
        select: { id: true, name: true, phone: true, instagram: true, email: true},
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
        select: { id: true, name: true, photo_url: true, is_lost: true, species: true },
      },
      users: {
        select: { id: true, name: true, phone: true, instagram: true, email: true },
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
        select: { id: true, name: true, photo_url: true, species: true },
      },
      users: {
        select: { id: true, name: true, phone: true, instagram: true, email: true },
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
      Pets: { select: { id: true, name: true, photo_url: true, species: true } },
      users: { select: { id: true, name: true, phone: true, instagram: true, email: true } },
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
      active: true,
      deleted: false,
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
  const addr = await reverseGeocode(data.latitude, data.longitude);

  return prisma.foundReports.create({
    data: {
      helperId,
      missingPetId,
      photo_urls: data.photo_urls ?? [],
      description: data.description,
      latitude: data.latitude,
      longitude: data.longitude,
      full_address: addr.full_address,
      address: addr.address,
      street: addr.street,
      city: addr.city,
      region: addr.region,
      postcode: addr.postcode,
      country: addr.country,
    },
  });
};

/**
 * Rechazar un reporte de hallazgo. Solo el dueño de la mascota desaparecida puede rechazarlo.
 */
export const rejectFoundReport = async (foundId: number, ownerId: string) => {
  return prisma.$transaction(async (tx) => {
    const fr = await tx.foundReports.findUnique({
      where: { id: foundId },
      include: { MissingPets: { select: { reporter_id: true } } },
    });

    if (!fr || fr.MissingPets.reporter_id !== ownerId) {
      throw new Error("No autorizado o reporte inexistente");
    }

    await tx.foundReports.delete({ where: { id: foundId } });
    return true;
  });
};

/**
 * Listar reportes de hallazgo a la mascota desaparecida.
 */
export const listFoundReportsForUser = async (userId: string) => {
  return prisma.foundReports.findMany({
    where: {
      MissingPets: {
        reporter_id: userId,
        resolved: false,
      },
    },
    include: {
      MissingPets: {
        select: {
          id: true,
          pet_id: true,
          reporter_id: true,
          latitude: true,
          longitude: true,
          reported_at: true,
          Pets: {
            select: {
              name: true,
              photo_url: true,
              species: true,
            },
          },
        },
      },
      users: {
        select: {
          id: true,
          name: true,
          phone: true,
          instagram: true,
          email: true,
        },
      },
    },
    orderBy: {
      created_at: "desc",
    },
  });
};