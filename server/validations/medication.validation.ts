import { z } from "zod";

export const medicationSchema = z.object({
  id: z.string().optional(),
  pet_id: z.string().optional(),
  name: z
    .string({
      required_error: "El nombre del medicamento es requerido",
      invalid_type_error: "El nombre debe ser una cadena de texto",
    })
    .min(2, "El nombre debe contener al menos 2 caracteres")
    .max(50, "El nombre debe contener máximo 50 caracteres")
    .trim(),
  dose: z
    .string({
      required_error: "La dosis es requerida",
      invalid_type_error: "La dosis debe ser una cadena de texto",
    })
    .min(1, "La dosis es requerida")
    .max(100, "La dosis debe contener máximo 100 caracteres")
    .trim(),
  duration: z
    .string({
      required_error: "La duración es requerida",
      invalid_type_error: "La duración debe ser una cadena de texto",
    })
    .min(1, "La duración es requerida")
    .max(100, "La duración debe contener máximo 100 caracteres")
    .trim(),
  start_date: z.date({
    required_error: "La fecha de inicio es requerida",
    invalid_type_error: "La fecha de inicio debe ser una fecha válida",
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
  send: z
    .boolean({
      invalid_type_error: "El estado de envío debe ser verdadero o falso",
    })
    .default(false)
    .optional(),
  active: z
    .boolean({
      invalid_type_error: "Esta opción debe ser verdadero o falso",
    })
    .default(true)
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
  global_id: z.string().optional(),
});
