import { z } from "zod/v4"

export const serviceCategories = [
  "veterinaria",
  "peluqueria",
  "tienda",
  "guarderia",
  "adiestramiento",
  "adopcion",
  "otro",
] as const

export type ServiceCategory = (typeof serviceCategories)[number]

export const serviceSchema = z.object({
  id: z.string().optional(),
  name: z
    .string()
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .max(100, "El nombre no puede exceder 100 caracteres"),
  latitude: z.number().min(-90, "Latitud inválida").max(90, "Latitud inválida"),
  longitude: z.number().min(-180, "Longitud inválida").max(180, "Longitud inválida"),
  description: z
    .string()
    .min(5, "La descripción debe tener al menos 5 caracteres")
    .max(500, "La descripción no puede exceder 500 caracteres"),
  categories: z
    .array(z.enum(serviceCategories))
    .min(1, "Debe seleccionar al menos una categoría")
    .max(3, "Máximo 3 categorías permitidas"),
  phone: z
    .string()
    .min(8, "El teléfono debe tener al menos 8 dígitos")
    .max(15, "El teléfono no puede exceder 15 dígitos")
    .regex(/^[+]?[\d\s\-()]+$/, "Formato de teléfono inválido"),
})

export const createServiceSchema = serviceSchema.omit({ id: true })

export const getServicesSchema = z.object({
  latitude: z.number().min(-90).max(90).optional(),
  longitude: z.number().min(-180).max(180).optional(),
  radius: z.number().min(0.1).max(100).default(10).optional(),
  category: z.enum(serviceCategories).optional(),
})

export type ServiceInput = z.infer<typeof serviceSchema>
export type CreateServiceInput = z.infer<typeof createServiceSchema>
export type GetServicesInput = z.infer<typeof getServicesSchema>
