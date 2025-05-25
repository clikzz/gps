import { z } from "zod/v4";

export const petSchema = z.object({
  id: z.string().optional(),
  user_id: z.string().optional(),
  name: z.string().min(2).max(15),
  species: z.enum([
    "dog",
    "cat",
    "rabbit",
    "hamster",
    "turtle",
    "bird",
    "other",
  ]),
  active: z.boolean().optional(),
  date_of_adoption: z
    .string()
    .optional()
    .refine((date) => {
      if (!date) return true;
      const parsedDate = new Date(date);
      return !isNaN(parsedDate.getTime());
    }, "Invalid date format"),
  date_of_birth: z
    .string()
    .optional()
    .refine((date) => {
      if (!date) return true;
      const parsedDate = new Date(date);
      return !isNaN(parsedDate.getTime());
    }, "Invalid date format"),
  fixed: z.boolean().optional(),
  sex: z.enum(["male", "female"]).optional(),
  photo_url: z.string().optional(),
});
