import prisma from "@/lib/db";
import { Vaccination } from "@/types/vaccination";

export const getVaccinations = async (userId: string) => {
  return prisma.vaccinations.findMany({
    where: { Pets: { user_id: userId } },
    orderBy: { application_date: "desc" },
  });
};

export const createVaccination = async (petId: number, data: Vaccination) => {
  return prisma.vaccinations.create({
    data: {
      pet_id: petId,
      name: data.name,
      type: data.type ?? null,
      application_date: data.application_date,
      next_dose_date: data.next_dose_date ?? null,
      notes: data.notes ?? null,
    },
  });
};

export const updateVaccination = async (
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
