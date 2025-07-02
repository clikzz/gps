import { medicationSchema } from "@/server/validations/medication.validation";
import { z } from "zod";

export type Medication = z.infer<typeof medicationSchema>;
