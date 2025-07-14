import prisma from "@/lib/db";
import { Medication } from "@/types/medication";

export const getMedications = async (userId: string) => {
  return prisma.medications.findMany({
    where: { Pets: { user_id: userId } },
    orderBy: { start_date: "desc" },
  });
};

export const createMedication = async (petId: number, data: Medication) => {
  return prisma.medications.create({
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
