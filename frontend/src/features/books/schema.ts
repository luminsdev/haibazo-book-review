import { z } from "zod";

export const bookFormSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Title is required")
    .max(255, "Title must be 255 characters or fewer"),

  author_id: z
    .number({ error: "Author is required" })
    .int()
    .min(1, "Author is required"),
});

export type BookFormValues = z.infer<typeof bookFormSchema>;
