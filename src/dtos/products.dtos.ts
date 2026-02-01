import z from "zod";

export const createProductSchema = {
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  price: z.number().min(0, "Price must be a positive number"),
  categoryId: z.string().min(1, "Category ID is required"),
  stock: z.number().min(0, "Stock must be a positive number").default(0),
};

const createProductSchemaObject = z.object(createProductSchema);

export type CreateProductDTO = z.infer<typeof createProductSchemaObject>;

export const updateProductSchema = {
  name: z.string().min(1, "Name is required").optional(),
  description: z.string().optional(),
  price: z.number().min(0, "Price must be a positive number").optional(),
  categoryId: z.string().min(1, "Category ID is required").optional(),
  stock: z
    .number()
    .min(0, "Stock must be a positive number")
    .optional()
    .default(0),
};

export const updateProductSchemaObject = z.object(updateProductSchema);

export type UpdateProductDTO = z.infer<typeof updateProductSchemaObject>;
