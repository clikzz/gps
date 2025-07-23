import prisma from "@/lib/db";
import { Vaccination } from "@/types/vaccination";

export const getVaccinations = async (userId: string) => {
  return prisma.vaccinations.findMany({
    where: { Pets: { user_id: userId } },
    orderBy: { application_date: "desc" },
  });
};

export const createVaccination = async (petId: number, data: Vaccination) => {
  return prisma.$transaction(async (tx) => {
    const vaccination = await tx.vaccinations.create({
      data: {
        pet_id: petId,
        name: data.name,
        type: data.type ?? null,
        application_date: data.application_date,
        next_dose_date: data.next_dose_date ?? null,
        notes: data.notes ?? null,
      },
    });

    const pet = await tx.pets.findUnique({
      where: { id: petId },
      select: { user_id: true },
    });

    if (!pet) throw new Error("Mascota no encontrada");

    const existing = await tx.userBadge.findFirst({
      where: {
        userId: pet.user_id,
        badge: { key: "FIRST_VACCINE" },
      },
    });

    if (!existing) {
      const badge = await tx.badge.findUnique({
        where: { key: "FIRST_VACCINE" },
      });

      if (badge) {
        await tx.userBadge.create({
          data: {
            userId: pet.user_id,
            badgeId: badge.id,
          },
        });
      }
    }

    return vaccination;
  });
};

export const updateVaccinationById = async (
  id: number,
  data: Partial<Vaccination>
) => {
  return prisma.vaccinations.update({
    where: { id },
    data: {
      name: data.name,
      type: data.type ?? null,
      application_date: data.application_date,
      next_dose_date: data.next_dose_date ?? null,
      notes: data.notes ?? null,
      active: data.active ?? undefined,
    },
  });
};

export const deleteVaccination = async (id: number) => {
  return prisma.vaccinations.delete({
    where: { id },
  });
};

export const getVaccinationById = async (id: number) => {
  return prisma.vaccinations.findUnique({
    where: { id },
  });
};

export const enableVaccinationNotification = async (id: number) => {
  return prisma.vaccinations.update({
    where: { id },
    data: { send: true },
  });
};
