import { z } from "zod";

export const ProfessionalSchema = z
  .object({
    name: z.string().min(1).optional(),
    email: z.email().optional(),
    phone: z.string().optional(),
    specialization: z.array(z.string()).optional(),
    experienceYears: z.number().int().min(0).optional(),
    bio: z.string().optional(),
    clinicalAddress: z.string().optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "Provide at least one field to update",
  });

export type ProfessionalInput = z.infer<typeof ProfessionalSchema>;