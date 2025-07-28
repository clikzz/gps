import { z } from "zod";

export const healthAlertSchema = z.object({
  id: z.string().optional(),
  user_id: z.string(),
  pet_id: z.string(),
  alert_type: z
    .string({
      required_error: "El tipo de alerta es requerido",
      invalid_type_error: "El tipo de alerta debe ser una cadena de texto",
    })
    .min(2, "El tipo de alerta debe contener al menos 2 caracteres")
    .max(50, "El tipo de alerta debe contener máximo 50 caracteres"),
  medication_id: z
    .string({
      invalid_type_error: "El ID del medicamento debe ser una cadena de texto",
    })
    .optional()
    .nullable(),
  vaccination_id: z
    .string({
      invalid_type_error: "El ID de la vacunación debe ser una cadena de texto",
    })
    .optional()
    .nullable(),
  title: z
    .string({
      required_error: "El título es requerido",
      invalid_type_error: "El título debe ser una cadena de texto",
    })
    .min(2, "El título debe contener al menos 2 caracteres")
    .max(100, "El título debe contener máximo 100 caracteres"),
  message: z
    .string({
      required_error: "El mensaje es requerido",
      invalid_type_error: "El mensaje debe ser una cadena de texto",
    })
    .min(2, "El mensaje debe contener al menos 2 caracteres")
    .max(500, "El mensaje debe contener máximo 500 caracteres"),
  alert_date: z.date({
    invalid_type_error: "La fecha de la alerta debe ser una fecha válida",
  }),
  sent: z
    .boolean({
      invalid_type_error: "Esta opción debe ser verdadero o falso",
    })
    .optional()
    .default(false),
  next_dose_date: z
    .date({
      invalid_type_error:
        "La fecha de la próxima dosis debe ser una fecha válida",
    })
    .optional()
    .nullable(),
  created_at: z
    .date({
      invalid_type_error: "La fecha de creación debe ser una fecha válida",
    })
    .optional()
    .nullable(),
});
