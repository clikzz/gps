import { z } from "zod";

export const petSchema = z.object({
  id: z.string().optional(),
  user_id: z.string(),
  name: z
    .string({
      required_error: "El nombre es requerido",
      invalid_type_error: "El nombre debe ser una cadena de texto",
    })
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
    {
      required_error: "La especie es requerida",
      invalid_type_error: "Especie no válida",
    }
  ),
  active: z
    .boolean({
      invalid_type_error: "Esta opción debe ser verdadero o falso",
    })
    .optional(),
  date_of_adoption: z
    .string({
      invalid_type_error: "La fecha de adopción debe ser una cadena de texto",
    })
    .optional()
    .nullable()
    .refine((date) => {
      if (!date || date === "") return true;
      const parsedDate = new Date(date);
      return !isNaN(parsedDate.getTime());
    }, "Formato de fecha inválido"),
  date_of_birth: z
    .string({
      invalid_type_error: "La fecha de nacimiento debe ser una cadena de texto",
    })
    .optional()
    .nullable()
    .refine((date) => {
      if (!date || date === "") return true;
      const parsedDate = new Date(date);
      return !isNaN(parsedDate.getTime());
    }, "Formato de fecha inválido"),
  fixed: z
    .boolean({
      invalid_type_error: "Esta opción debe ser verdadero o falso",
    })
    .optional(),
  sex: z
    .enum(["male", "female", "unknown"], {
      invalid_type_error: "El sexo debe ser masculino o femenino",
    })
    .optional(),
  photo_url: z
    .string({
      invalid_type_error: "La URL de la imagen debe ser un string",
    })
    .optional(),
});
