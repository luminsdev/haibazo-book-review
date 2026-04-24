import { z } from "zod";

export const authorFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Name is required")
    .max(255, "Name must be 255 characters or fewer"),
});

export type AuthorFormValues = z.infer<typeof authorFormSchema>;
