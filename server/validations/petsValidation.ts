import { z } from "zod/v4";

export const petSchema = z.object({
  id: z.string("El id debe ser una cadena de texto").optional(),
  user_id: z.string("El id del usuario debe ser una cadena de texto"),
  name: z
    .string("El nombre debe ser una cadena de texto")
    .min(2, "El nombre debe contener al menos 2 caracteres")
    .max(15, "El nombre debe contener máximo 15 caracteres")
    .regex(/^[^\d]*$/, "El nombre no debe contener números"),
  species: z.enum(
    [
      "dog",
      "cat",
      "rabbit",
      "hamster",
      "turtle",
      "bird",
      "fish",
      "guineaPig",
      "ferret",
      "mouse",
      "chinchilla",
      "hedgehog",
      "snake",
      "frog",
      "lizard",
      "other",
    ],
    "Especie no válida"
  ),
  active: z.boolean("Esta opción debe ser verdadero o falso").optional(),
  date_of_adoption: z
    .string("La fecha de adopción debe ser una cadena de texto")
    .optional()
    .refine((date) => {
      if (!date) return true;
      const parsedDate = new Date(date);
      return !isNaN(parsedDate.getTime());
    }, "Formato de fecha inválido"),
  date_of_birth: z
    .string()
    .optional()
    .refine((date) => {
      if (!date) return true;
      const parsedDate = new Date(date);
      return !isNaN(parsedDate.getTime());
    }, "Formato de fecha inválido"),
  fixed: z.boolean("Esta opción debe ser verdadero o falso").optional(),
  sex: z
    .enum(["male", "female"], "El sexo debe ser masculino o femenino")
    .optional(),
  photo_url: z.string("La URL de la imagen debe ser un string").optional(),
});
