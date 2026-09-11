import * as z from "zod";

export const formSchema = z.object({
  name: z
    .string()
    .min(2, "Bug title must be at least 2 characters.")
    .max(32, "Bug title must be at most 32 characters."),
  email: z.email("Invalid email address"),
  phone: z
    .string()
    .refine(
      (phone) => /^\+?[1-9][0-9]{7,14}$/.test(phone),
      "Invalid Phone Number",
    ),
});
