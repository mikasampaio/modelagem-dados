import z from "zod";

export const querySchema = z.object({
  id: z.string().optional(),
  page: z.number().or(z.string()).default(1).optional(),
  pageSize: z.number().or(z.string()).default(10).optional(),
  search: z.string().optional(),
});

export type QueryDTO = z.infer<typeof querySchema>;
