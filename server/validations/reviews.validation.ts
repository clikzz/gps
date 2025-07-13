import { z } from "zod"

export const createReviewSchema = z.object({
  service_id: z.string().min(1, "ID del servicio es requerido"),
  rating: z
    .number()
    .int("La calificación debe ser un número entero")
    .min(1, "La calificación mínima es 1")
    .max(5, "La calificación máxima es 5"),
  comment: z.string().max(500, "El comentario no puede exceder 500 caracteres").optional().nullable(),
})

export const getReviewsSchema = z.object({
  service_id: z.string().min(1, "ID del servicio es requerido"),
})

export type CreateReviewInput = z.infer<typeof createReviewSchema>
export type GetReviewsInput = z.infer<typeof getReviewsSchema>
