import { z } from "zod";

export const reportMissingPetSchema = z.object({
  pet_id: z
    .number({
      required_error: "El campo pet_id es obligatorio y debe ser un número.",
      invalid_type_error: "pet_id debe ser un número entero",
    })
    .int("pet_id debe ser un entero"),
  latitude: z
    .number({
      required_error: "El campo latitude es obligatorio y debe ser un número.",
      invalid_type_error: "Latitud debe ser un número",
    })
    .refine((val) => val >= -90 && val <= 90, {
      message: "Latitud debe estar entre -90 y 90",
    }),
  longitude: z
    .number({
      required_error: "El campo longitude es obligatorio y debe ser un número.",
      invalid_type_error: "Longitud debe ser un número",
    })
    .refine((val) => val >= -180 && val <= 180, {
      message: "Longitud debe estar entre -180 y 180.",
    }),
  photo_urls: z
    .array(z.string().url("Cada URL debe ser válida."))
    .min(1, "Debes subir al menos una foto de referencia.")
    .max(3, "Máximo 3 fotos de referencia."),
  description: z
    .string({
      invalid_type_error: "Descripción debe ser un string.",
    })
    .max(250, "La descripción puede tener como máximo 250 caracteres.")
    .optional(),
});

export const reportFoundSchema = z.object({
  missingPetId: z
    .coerce
    .number({
      required_error: "El campo missingPetId es obligatorio y debe ser un número.",
      invalid_type_error: "missingPetId debe ser un número entero.",
    }),
  description: z
    .string({
      invalid_type_error: "Descripción debe ser un string.",
    })
    .max(250, "La descripción puede tener como máximo 250 caracteres.")
    .optional(),
  photo_urls: z
    .array(z.string().url("Cada URL debe ser válida."))
    .min(1, "Debes subir al menos una foto de referencia.")
    .max(3, "Máximo 3 fotos de referencia."),
  latitude: z
    .number({
      required_error: "El campo latitude es obligatorio y debe ser un número.",
      invalid_type_error: "Latitud debe ser un número.",
    })
    .refine((val) => val >= -90 && val <= 90, {
      message: "Latitud debe estar entre -90 y 90.",
    }),
  longitude: z
    .number({
      required_error: "El campo longitude es obligatorio y debe ser un número.",
      invalid_type_error: "Longitud debe ser un número.",
    })
    .refine((val) => val >= -180 && val <= 180, {
      message: "Longitud debe estar entre -180 y 180.",
    }),
});