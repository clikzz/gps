import { z } from "zod";

export const reportMissingPetSchema = z.object({
  pet_id: z
    .number({
      required_error: "El campo pet_id es obligatorio y debe ser un número",
      invalid_type_error: "pet_id debe ser un número entero",
    })
    .int("pet_id debe ser un entero"),
  latitude: z
    .number({
      required_error: "El campo latitude es obligatorio y debe ser un número",
      invalid_type_error: "latitude debe ser un número",
    })
    .refine((val) => val >= -90 && val <= 90, {
      message: "latitude debe estar entre -90 y 90",
    }),
  longitude: z
    .number({
      required_error: "El campo longitude es obligatorio y debe ser un número",
      invalid_type_error: "longitude debe ser un número",
    })
    .refine((val) => val >= -180 && val <= 180, {
      message: "longitude debe estar entre -180 y 180",
    }),
  photo_urls: z
    .array(z.string().url("Cada URL debe ser válida"))
    .max(3, "Máximo 3 fotos de respaldo")
    .optional(),
  description: z
    .string({
      invalid_type_error: "description debe ser un string",
    })
    .max(500, "La descripción puede tener como máximo 500 caracteres")
    .optional(),
});