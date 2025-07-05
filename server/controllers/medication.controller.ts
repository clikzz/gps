import {
  createMedication,
  updateMedicationById as updateMedicationService,
  deleteMedication,
  getMedicationById,
} from "@/server/services/medication.service";
import { medicationSchema } from "@/server/validations/medication.validation";
import { Medication } from "@/types/medication";

export const fetchMedications = async (petId: number) => {
  const medications = await getMedicationById(petId);
  return new Response(JSON.stringify(medications), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
};

export const addMedication = async (petId: number, data: Medication) => {
  try {
    const newData = {
      ...data,
      start_date: data.start_date ? new Date(data.start_date) : undefined,
      next_dose_date: data.next_dose_date
        ? new Date(data.next_dose_date)
        : undefined,
    };

    console.log("Adding medication with data:", newData);

    const parsedData = medicationSchema.parse(newData);
    if (!petId || !parsedData) {
      return new Response(
        JSON.stringify({ error: "Invalid pet ID or medication data" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const newMedication = await createMedication(petId, data);
    console.log("New medication created:", newMedication);

    const fixedMedication = {
      ...newMedication,
      id: Number(newMedication.id),
      pet_id: Number(newMedication.pet_id),
    };

    return new Response(JSON.stringify(fixedMedication), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error creating medication:", error);
    return new Response(
      JSON.stringify({ error: "Failed to create medication" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
};

export const updateMedication = async (
  id: number,
  data: Partial<Medication>
) => {
  try {
    const parsedData = medicationSchema.parse(data);
    if (!id || !parsedData) {
      return new Response(
        JSON.stringify({ error: "Invalid pet ID or medication data" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }
    const updatedMedication = await updateMedicationService(id, data);
    return new Response(JSON.stringify(updatedMedication), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error updating medication:", error);
    return new Response(
      JSON.stringify({ error: "Failed to update medication" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
};

export const removeMedication = async (id: number) => {
  try {
    if (!id) {
      return new Response(JSON.stringify({ error: "Invalid medication ID" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }
    await deleteMedication(id);
    return new Response(null, { status: 204 });
  } catch (error) {
    console.error("Error deleting medication:", error);
    return new Response(
      JSON.stringify({ error: "Failed to delete medication" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
};
