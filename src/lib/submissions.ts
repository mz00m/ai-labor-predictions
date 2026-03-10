import { z } from "zod/v4";

export const submissionSchema = z.object({
  url: z
    .url("Please enter a valid URL")
    .max(2048, "URL is too long"),
  note: z
    .string()
    .max(500, "Note must be 500 characters or fewer")
    .optional()
    .default(""),
  email: z
    .email("Please enter a valid email")
    .max(254, "Email is too long")
    .optional()
    .default(""),
});

export type SubmissionInput = z.infer<typeof submissionSchema>;
