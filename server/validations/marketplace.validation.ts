import { z } from "zod";
import { ItemCategory, ItemCondition, PetCategory } from "@prisma/client";

export const createItemSchema = z.object({
  title: z
    .string()
    .min(1, { message: "El título es obligatorio." }),
  description: z
    .string()
    .optional(),
  category: z
    .nativeEnum(ItemCategory, {
      errorMap: () => ({ message: "Categoría inválida." }),
    }),
  pet_category: z
    .nativeEnum(PetCategory, {
      errorMap: () => ({ message: "Categoría de mascota inválida." }),
    }),
  condition: z
    .nativeEnum(ItemCondition, {
      errorMap: () => ({ message: "Condición inválida." }),
    }),
  price: z
    .number()
    .min(0, { message: "El precio no puede ser negativo." }),
  photo_urls: z
    .array(z.string().url({ message: "Cada URL de imagen debe ser válida." })),
  latitude: z
    .number()
    .min(-90, { message: "Latitud inválida." })
    .max(90, { message: "Latitud inválida." }),
  longitude: z
    .number()
    .min(-180, { message: "Longitud inválida." })
    .max(180, { message: "Longitud inválida." }),
  city: z
    .string()
    .optional(),
  region: z
    .string()
    .optional(),
  country: z
    .string()
    .optional(),
});

export const listFiltersSchema = z.object({
  category: z
    .nativeEnum(ItemCategory)
    .optional(),
  minPrice: z
    .number()
    .min(0)
    .optional(),
  maxPrice: z
    .number()
    .min(0)
    .optional(),
  lat: z
    .number()
    .min(-90)
    .max(90)
    .optional(),
  lng: z
    .number()
    .min(-180)
    .max(180)
    .optional(),
  radiusKm: z
    .number()
    .min(0, { message: "El radio debe ser positivo." })
    .optional(),
  order: z
    .enum(["recent", "priceAsc", "priceDesc"], {
      errorMap: () => ({ message: "Orden inválido." }),
    })
    .optional(),
  page: z
    .number()
    .int()
    .min(0)
    .optional(),
  pageSize: z
    .number()
    .int()
    .min(1)
    .optional(),
});

export const deleteItemSchema = z.object({
  id: z.string().regex(/^\d+$/, { message: "ID inválido." }),
});

export const markSoldSchema = z.object({
  id: z.string(),
  sold_price: z.number().min(0, { message: "El precio de venta no puede ser negativo." }),
  sold_at: z.string().refine((s) => !Number.isNaN(Date.parse(s)), "Fecha inválida"),
  notes: z.string().optional(),
});

export type CreateItemInput = z.infer<typeof createItemSchema>;

export const updateItemSchema = createItemSchema.partial().extend({
  id: z.string().regex(/^\d+$/, "ID inválido"),
})

export type UpdateItem = z.infer<typeof updateItemSchema>
