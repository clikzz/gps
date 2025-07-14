import prisma from "@/lib/db";
import { HealthAlert } from "@/types/healthAlert";

export const createHealthAlert = async (user_id: string, data: HealthAlert) => {
  return prisma.healthAlerts.create({
    data: {
      user_id: user_id,
      pet_id: parseInt(data.pet_id),
      alert_type: data.alert_type,
      title: data.title,
      message: data.message,
      alert_date: data.alert_date,
      sent: data.sent ?? false,
    },
  });
};

export const updateHealthAlert = async (
  id: number,
  data: Partial<HealthAlert>
) => {
  return prisma.healthAlerts.update({
    where: { id },
    data: {
      pet_id: data.pet_id ? parseInt(data.pet_id) : undefined,
      alert_type: data.alert_type,
      title: data.title,
      message: data.message,
      alert_date: data.alert_date,
      sent: data.sent ?? undefined,
    },
  });
};

export const deleteHealthAlert = async (id: number) => {
  return prisma.healthAlerts.delete({
    where: { id },
  });
};