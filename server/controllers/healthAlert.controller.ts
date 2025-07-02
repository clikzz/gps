import {
  createHealthAlert,
  deleteHealthAlert,
  updateHealthAlert,
} from "../services/healthAlert.service";
import { healthAlertSchema } from "../validations/healthAlert.validation";
import { HealthAlert } from "../../types/healthAlert";

export const addHealthAlert = async (user_id: string, data: HealthAlert) => {
  const parsedData = healthAlertSchema.safeParse({
    ...data,
    user_id: user_id,
    pet_id: parseInt(data.pet_id),
    alert_date: data.alert_date ? new Date(data.alert_date) : undefined,
  });

  if (!parsedData.success) {
    return new Response(JSON.stringify(parsedData.error), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const newAlert = await createHealthAlert(user_id, parsedData.data);
    return new Response(JSON.stringify(newAlert), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error creating health alert:", error);
    return new Response(
      JSON.stringify({ error: "Failed to create health alert" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
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
