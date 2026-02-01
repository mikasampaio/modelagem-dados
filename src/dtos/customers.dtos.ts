import z, { email } from "zod";

export const createCustomerSchema = {
  name: z.string().min(1, "Name is required"),
  email: email("Invalid email address"),
  phone: z
    .string()
    .min(1, "Phone is required")
    .regex(
      /^\+?[1-9]\d{9,14}$/,
      "Invalid phone number format. Must have 10-15 digits (e.g., +5511999999999 or 5511999999999)",
    ),
};

const createCustomerDTO = z.object(createCustomerSchema);

export type CreateCustomerDTO = z.infer<typeof createCustomerDTO>;

export const updateCustomerSchema = {
  name: z.string().min(1, "Name is required").optional(),
  email: email("Invalid email address").optional(),
  phone: z
    .string()
    .min(1, "Phone is required")
    .regex(
      /^\+?[1-9]\d{9,14}$/,
      "Invalid phone number format. Must have 10-15 digits (e.g., +5511999999999 or 5511999999999)",
    )
    .optional(),
};

export const updateCustomerDTO = z.object(updateCustomerSchema);

export type UpdateCustomerDTO = z.infer<typeof updateCustomerDTO>;
