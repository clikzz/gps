import {
  createHealthAlert,
  deleteHealthAlert,
  updateHealthAlert,
  getHealthAlertById,
} from "../services/healthAlert.service";
import {
  getMedicationById,
  updateMedicationById,
  enableMedicationNotification,
} from "../services/medication.service";
import {
  getVaccinationById,
  updateVaccinationById,
  enableVaccinationNotification,
} from "../services/vaccination.service";
import { getPetById } from "../services/pets.service";
import { healthAlertSchema } from "../validations/healthAlert.validation";
import { HealthAlert } from "../../types/healthAlert";

export const addHealthAlert = async (user_id: string, data: any) => {
  console.log(data);

  if (data.entry_type === "Medicamento") {
    const medication = await getMedicationById(data.id);
    if (!medication) {
      return new Response(JSON.stringify({ error: "Medication not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    const pet = await getPetById(Number(medication.pet_id));
    if (!pet) {
      return new Response(JSON.stringify({ error: "Pet not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    const alertData = {
      user_id,
      pet_id: medication.pet_id.toString(),
      alert_type: "Medicamento",
      medication_id: data.id.toString(),
      vaccination_id: null,
      title: `Recordatorio de medicamento: ${medication.name}`,
      message: `Es hora de administrar ${medication.name} a tu mascota`,
      alert_date: new Date(
        new Date(data.next_dose_date).getTime() - 3 * 24 * 60 * 60 * 1000
      ),
      sent: false,
    };

    const parsedData = healthAlertSchema.safeParse(alertData);
    if (!parsedData.success) {
      return new Response(JSON.stringify(parsedData.error), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const newAlert = await createHealthAlert(user_id, parsedData.data);

    const fixedAlert = {
      ...newAlert,
      id: newAlert.id.toString(),
      pet_id: newAlert.pet_id.toString(),
    };

    const notsEnabled = await enableMedicationNotification(
      Number(medication.id)
    );

    if (!notsEnabled) {
      return new Response(
        JSON.stringify({ error: "Failed to enable medication notification" }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    return new Response(JSON.stringify(fixedAlert), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  }

  if (data.entry_type === "Vacuna") {
    const vaccination = await getVaccinationById(data.id);
    if (!vaccination) {
      return new Response(JSON.stringify({ error: "Vaccination not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    const pet = await getPetById(Number(vaccination.pet_id));
    if (!pet) {
      return new Response(JSON.stringify({ error: "Pet not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    const alertData = {
      user_id,
      pet_id: vaccination.pet_id.toString(),
      alert_type: "Vacuna",
      medication_id: null,
      vaccination_id: data.id.toString(),
      title: `Recordatorio de vacuna: ${vaccination.name}`,
      message: `Es hora de administrar la vacuna ${vaccination.name} a tu mascota`,
      alert_date: new Date(
        new Date(data.next_dose_date).getTime() - 3 * 24 * 60 * 60 * 1000
      ),
      sent: false,
    };

    console.log("Alert Data:", alertData);

    const parsedData = healthAlertSchema.safeParse(alertData);
    if (!parsedData.success) {
      console.error("Validation Error:", parsedData.error);
      return new Response(JSON.stringify(parsedData.error), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const newAlert = await createHealthAlert(user_id, parsedData.data);

    const fixedAlert = {
      ...newAlert,
      id: newAlert.id.toString(),
      pet_id: newAlert.pet_id.toString(),
    };

    const notsEnabled = await enableVaccinationNotification(
      Number(vaccination.id)
    );
    if (!notsEnabled) {
      return new Response(
        JSON.stringify({ error: "Failed to enable vaccination notification" }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    return new Response(JSON.stringify(fixedAlert), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  }

  return new Response(JSON.stringify({ error: "Invalid entry type" }), {
    status: 400,
    headers: { "Content-Type": "application/json" },
  });
};

export const editHealthAlert = async (
  id: number,
  data: Partial<HealthAlert>
) => {
  const parsedData = healthAlertSchema.partial().safeParse(data);

  if (!parsedData.success) {
    return new Response(JSON.stringify(parsedData.error), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const updatedAlert = await updateHealthAlert(id, parsedData.data);
    return new Response(JSON.stringify(updatedAlert), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error updating health alert:", error);
    return new Response(
      JSON.stringify({ error: "Failed to update health alert" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
};

export const removeHealthAlert = async (id: number) => {
  try {
    await deleteHealthAlert(id);
    return new Response(JSON.stringify({ message: "Health alert deleted" }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error deleting health alert:", error);
    return new Response(
      JSON.stringify({ error: "Failed to delete health alert" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
};
