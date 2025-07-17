import { z } from "zod";

export const createTopicSchema = z.object({
  subforumId: z.coerce.number().int().positive(),
  title: z.string().min(3, "El título debe tener al menos 3 caracteres"),
  content: z.string().min(1, "El contenido no puede estar vacío"),
});

export const createPostSchema = z.object({
  topicId: z.coerce.number().int().positive(),
  content: z.string().min(1, "El contenido no puede estar vacío"),
});

export const editTopicSchema = z.object({
  title: z.string().min(3, "El título debe tener al menos 3 caracteres"),
});
export const editPostSchema = z.object({
  content: z.string().min(1, "El contenido no puede estar vacío"),
});

export const changeUserStatusSchema = z.object({
  targetUserId: z.string().uuid(),
  status: z.enum(["ACTIVE", "SUSPENDED", "BANNED"]),
  suspensionReason: z.string().min(1).optional(),
  suspensionUntil: z.string().datetime().optional(),
})
  .refine((data) => {
    if (data.status === "ACTIVE") return true;
    return typeof data.suspensionReason === "string" && data.suspensionReason.trim() !== "";
  }, {
    message: "Debes indicar un motivo para la sanción",
    path: ["suspensionReason"],
  })
  .refine((data) => {
    if (data.status !== "SUSPENDED") return true;
    if (!data.suspensionUntil) return false;
    return new Date(data.suspensionUntil) > new Date();
  }, {
    message: "Debes indicar una fecha futura de fin de suspensión",
    path: ["suspensionUntil"],
  });
