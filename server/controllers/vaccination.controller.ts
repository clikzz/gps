import {
  createVaccination,
  updateVaccinationById,
  deleteVaccination,
  getVaccinations as getVaccinationsByUserId,
} from "@/server/services/vaccination.service";
import { vaccinationSchema } from "../validations/vaccination.validation";
import { Vaccination } from "@/types/vaccination";

export const getVaccinations = async (userId: string) => {
  const vaccinations = await getVaccinationsByUserId(userId);
  return new Response(JSON.stringify(vaccinations), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
};

export const addVaccination = async (petId: number, data: Vaccination) => {
  try {
    const newData = {
      ...data,
      application_date: data.application_date
        ? new Date(data.application_date)
        : undefined,
      next_dose_date: data.next_dose_date
        ? new Date(data.next_dose_date)
        : undefined,
    };

    console.log("Adding vaccination with data:", newData);

    const parsedData = vaccinationSchema.parse(newData);
    if (!petId || !parsedData) {
      return new Response(
        JSON.stringify({ error: "Invalid pet ID or vaccination data" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const newVaccination = await createVaccination(petId, data);
    console.log("New vaccination created:", newVaccination);

    const fixedVaccination = {
      ...newVaccination,
      id: Number(newVaccination.id),
      pet_id: Number(newVaccination.pet_id),
    };

    return new Response(JSON.stringify(fixedVaccination), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error creating vaccination:", error);
    return new Response(
      JSON.stringify({ error: "Failed to create vaccination" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
};

export const updateVaccination = async (
  vaccinationId: number,
  data: Vaccination
) => {
  try {
    const newData = {
      ...data,
      date: data.application_date ? new Date(data.application_date) : undefined,
    };

    console.log("Updating vaccination with data:", newData);

    const parsedData = vaccinationSchema.parse(newData);
    if (!vaccinationId || !parsedData) {
      return new Response(
        JSON.stringify({ error: "Invalid vaccination ID or data" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const updatedVaccination = await updateVaccinationById(vaccinationId, data);
    console.log("Vaccination updated:", updatedVaccination);

    return new Response(JSON.stringify(updatedVaccination), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error updating vaccination:", error);
    return new Response(
      JSON.stringify({ error: "Failed to update vaccination" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
};

export const removeVaccination = async (vaccinationId: number) => {
  try {
    if (!vaccinationId) {
      return new Response(JSON.stringify({ error: "Invalid vaccination ID" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    await deleteVaccination(vaccinationId);
    return new Response(JSON.stringify({ message: "Vaccination deleted" }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error deleting vaccination:", error);
    return new Response(
      JSON.stringify({ error: "Failed to delete vaccination" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
};
