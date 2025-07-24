import prisma from "@/lib/db";
import { Medication } from "@/types/medication";

export const getMedications = async (userId: string) => {
  return prisma.medications.findMany({
    where: { Pets: { user_id: userId } },
    orderBy: { start_date: "desc" },
  });
};

export const createMedication = async (petId: number, data: Medication) => {
  return prisma.$transaction(async (tx) => {
    const medication = await tx.medications.create({
      data: {
        pet_id: petId,
        name: data.name,
        dose: data.dose,
        duration: data.duration,
        start_date: data.start_date,
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
        badge: { key: "FIRST_MEDICATION" },
      },
    });

    if (!existing) {
      const badge = await tx.badge.findUnique({
        where: { key: "FIRST_MEDICATION" },
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

    return medication;
  });
};


export const updateMedicationById = async (
  id: number,
  data: Partial<Medication>
) => {
  return prisma.medications.update({
    where: { id },
    data: {
      name: data.name,
      dose: data.dose,
      duration: data.duration,
      start_date: data.start_date,
      next_dose_date: data.next_dose_date ?? null,
      notes: data.notes ?? null,
      active: data.active ?? undefined,
    },
  });
};

export const deleteMedication = async (id: number) => {
  return prisma.medications.delete({
    where: { id },
  });
};

export const getMedicationById = async (id: number) => {
  return prisma.medications.findUnique({
    where: { id },
  });
};

export const enableMedicationNotification = async (id: number) => {
  return prisma.medications.update({
    where: { id },
    data: { send: true },
  });
};
