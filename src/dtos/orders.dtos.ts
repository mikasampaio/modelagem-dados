import z from "zod";

export const orderParamsSchema = z.object({
  customerId: z.string().optional(),
  orderDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format, expected YYYY-MM-DD")
    .optional(),
});

export type OrderParamsDTO = z.infer<typeof orderParamsSchema>;

export const createOrderSchema = {
  customerId: z.string().min(1, "Customer ID is required"),
  items: z.array(
    z.object({
      productId: z.string().min(1, "Product ID is required"),
      quantity: z.number().min(1, "Quantity must be at least 1"),
    }),
  ),
};

const createOrderSchemaObject = z.object(createOrderSchema);

export type CreateOrderDTO = z.infer<typeof createOrderSchemaObject>;

export const updateOrderSchema = {
  customerId: z.string().min(1, "Customer ID is required").optional(),
  items: z
    .array(
      z.object({
        productId: z.string().min(1, "Product ID is required"),
        quantity: z.number().min(1, "Quantity must be at least 1"),
      }),
    )
    .optional(),
};

const updateOrderSchemaObject = z.object(updateOrderSchema);

export type UpdateOrderDTO = z.infer<typeof updateOrderSchemaObject>;
