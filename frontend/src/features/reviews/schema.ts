import { z } from "zod";

export const REVIEW_MAX_LENGTH = 5000;

export const reviewFormSchema = z.object({
  content: z
    .string()
    .trim()
    .min(1, "Review content is required")
    .max(REVIEW_MAX_LENGTH, `Must be ${REVIEW_MAX_LENGTH} characters or fewer`),

  book_id: z
    .number({ error: "Book is required" })
    .int()
    .min(1, "Book is required"),
});

export type ReviewFormValues = z.infer<typeof reviewFormSchema>;
