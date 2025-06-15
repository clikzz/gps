import { z } from "zod";
import { petSchema } from "@/server/validations/pets.validation";

export type Pet = z.infer<typeof petSchema>;

export type NewPetFormData = Omit<Pet, "id" | "user_id">;

export const newPetFormSchema = petSchema.omit({
  id: true,
  user_id: true,
  is_lost: true,
});

export type NewPetFormInput = z.infer<typeof newPetFormSchema>;

export interface SelectOption {
  value: string;
  label: string;
}

export const SPECIES_OPTIONS: SelectOption[] = [
  { value: "dog", label: "Perro" },
  { value: "cat", label: "Gato" },
  { value: "rabbit", label: "Conejo" },
  { value: "hamster", label: "Hámster" },
  { value: "turtle", label: "Tortuga" },
  { value: "bird", label: "Ave" },
  { value: "fish", label: "Pez" },
  { value: "guineaPig", label: "Cobaya" },
  { value: "ferret", label: "Hurón" },
  { value: "mouse", label: "Ratón" },
  { value: "chinchilla", label: "Chinchilla" },
  { value: "hedgehog", label: "Erizo" },
  { value: "snake", label: "Serpiente" },
  { value: "frog", label: "Rana" },
  { value: "lizard", label: "Lagarto" },
  { value: "other", label: "Otro" },
];

export const SEX_OPTIONS: SelectOption[] = [
  { value: "male", label: "Macho" },
  { value: "female", label: "Hembra" },
  { value: "unknown", label: "Desconocido" },
];

export interface ImageUploadResult {
  url: string | null;
  error?: string;
}

export const FILE_CONSTRAINTS = {
  MAX_SIZE: 5 * 1024 * 1024, // 5MB
  ACCEPTED_TYPES: ["image/jpeg", "image/png", "image/gif", "image/webp"],
} as const;
