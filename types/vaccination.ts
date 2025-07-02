import { vaccinationSchema } from "@/server/validations/vaccination.validation";
import { z } from "zod";

export type Vaccination = z.infer<typeof vaccinationSchema>;
