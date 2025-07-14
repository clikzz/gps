import { Medication } from "@/types/medication";
import { Vaccination } from "@/types/vaccination";

export type DoseEntry = (Medication | Vaccination) & {
  entry_type: "medication" | "vaccination";
};
