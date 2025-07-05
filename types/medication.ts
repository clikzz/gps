import { medicationSchema } from "@/server/validations/medication.validation";
import { z } from "zod";

export type Medication = z.infer<typeof medicationSchema>;

export type NewMedicationFormData = Omit<
  Medication,
  "id" | "pet_id" | "created_at" | "updated_at"
>;

export const newMedicationFormSchema = medicationSchema.omit({
  id: true,
  pet_id: true,
  created_at: true,
  updated_at: true,
});
