import { z } from "zod";

export const createTopicSchema = z.object({
  subforumId: z.coerce.number().int().positive(),
  title:     z.string().min(3, "El título debe tener al menos 3 caracteres"),
  content:   z.string().min(1, "El contenido no puede estar vacío"),
});

export const createPostSchema = z.object({
  topicId: z.coerce.number().int().positive(),
  content: z.string().min(1, "El contenido no puede estar vacío"),
});
