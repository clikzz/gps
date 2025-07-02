import { z } from "zod";

export const vaccinationSchema = z.object({
  id: z.string().optional(),
  pet_id: z.string().optional(),
  name: z
    .string({
      required_error: "El nombre de la vacuna es requerido",
      invalid_type_error: "El nombre debe ser una cadena de texto",
    })
    .min(2, "El nombre debe contener al menos 2 caracteres")
    .max(50, "El nombre debe contener máximo 50 caracteres"),
  type: z
    .enum(
      [
        "rabies",
        "distemper",
        "parvovirus",
        "leptospirosis",
        "bordetella",
        "other",
      ],
      {
        invalid_type_error: "Tipo de vacuna no válido",
      }
    )
    .optional()
    .nullable(),
  application_date: z.date({
    invalid_type_error: "La fecha de aplicación debe ser una fecha válida",
    required_error: "La fecha de aplicación es requerida",
  }),
  next_dose_date: z
    .date({
      invalid_type_error:
        "La fecha de la próxima dosis debe ser una fecha válida",
    })
    .optional()
    .nullable(),
  notes: z
    .string()
    .max(500, "Las notas deben contener máximo 500 caracteres")
    .optional()
    .nullable(),
  active: z
    .boolean({
      invalid_type_error: "Esta opción debe ser verdadero o falso",
    })
    .optional(),
  created_at: z
    .date({
      invalid_type_error: "La fecha de creación debe ser una fecha válida",
    })
    .optional()
    .nullable(),
  updated_at: z
    .date({
      invalid_type_error: "La fecha de actualización debe ser una fecha válida",
    })
    .optional()
    .nullable(),
  global_id: z
    .string({
      invalid_type_error: "El ID global debe ser una cadena de texto",
    })
    .optional()
    .nullable(),
});
