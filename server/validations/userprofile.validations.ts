import { z } from "zod"
import { email } from "zod/v4"

export const UpdateUserProfileSchema = z.object({
  name: z.string().max(50, "El nombre debe tener como máximo 50 caracteres").optional(),
  avatar_url: z.string().url().nullable().optional(),
  selectedBadgeIds: z.array(z.string()).optional().default([]),
  email: z.string().email("Correo inválido"),
  
  instagram: z
    .union([
      z.string().max(30, "Máximo 30 caracteres"),
      z.literal(""),
      z.undefined(),
      z.null()
    ])
    .optional()
    .transform((val) => {
      if (!val || val === "" || val === "@") return undefined;
      if (!/^@?[a-zA-Z0-9._]+$/.test(val)) {
        throw new z.ZodError([{
          code: "custom",
          message: "Solo letras, números, puntos o guión bajo permitidos",
          path: ["instagram"]
        }]);
      }
      return val;
    }),

  phone: z
    .union([
      z.string().max(15, "Máximo 15 caracteres"),
      z.literal(""),
      z.undefined(),
      z.null()
    ])
    .optional()
    .transform((val) => {
      if (!val || val === "") return undefined;
      if (!/^[+]?[\d\s-]+$/.test(val)) {
        throw new z.ZodError([{
          code: "custom",
          message: "Formato de teléfono inválido",
          path: ["phone"]
        }]);
      }
      return val;
    }),
})

export type UpdateUserProfileInput = z.infer<typeof UpdateUserProfileSchema>
