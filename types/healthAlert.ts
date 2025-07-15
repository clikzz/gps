import { healthAlertSchema } from "@/server/validations/healthAlert.validation";
import { z } from "zod";

export type HealthAlert = z.infer<typeof healthAlertSchema>;
