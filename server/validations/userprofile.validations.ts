import { z } from "zod"
import { email } from "zod/v4"

export const UpdateUserProfileSchema = z.object({
  name: z.string().max(50, "El nombre debe tener como máximo 50 caracteres").optional(),
  avatar_url: z.string().url().nullable().optional(),
  selectedBadgeIds: z.array(z.string()).optional(),
  email: z.string().email("Correo inválido"),
  
  instagram: z
    .string()
    .max(30, "Máximo 30 caracteres")
    .regex(/^@?[a-zA-Z0-9._]+$/, "Solo letras, números, puntos o guión bajo")
    .optional()
    .or(z.literal("").transform(() => undefined)),

  phone: z
    .string()
    .regex(/^\+?56\d{9}$/, "Número de teléfono chileno inválido")
    .optional()
    .or(z.literal("").transform(() => undefined)),
})

export type UpdateUserProfileInput = z.infer<typeof UpdateUserProfileSchema>
