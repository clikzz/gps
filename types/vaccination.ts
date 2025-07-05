import { vaccinationSchema } from "@/server/validations/vaccination.validation";
import { z } from "zod";

export type Vaccination = z.infer<typeof vaccinationSchema>;

export type NewVaccinationFormData = Omit<
  Vaccination,
  "id" | "pet_id" | "created_at" | "updated_at"
>;

export const newVaccinationFormSchema = vaccinationSchema.omit({
  id: true,
  pet_id: true,
  created_at: true,
  updated_at: true,
});
