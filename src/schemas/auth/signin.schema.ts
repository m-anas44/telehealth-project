import { z } from "zod";

export const signinSchema = z.object({
  email: z.email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
  role: z.enum(["patient", "doctor", "admin"]),
});

export type SigninSchemaType = z.infer<typeof signinSchema>;