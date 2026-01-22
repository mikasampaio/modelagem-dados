import z from "zod";

export const querySchema = z.object({
  id: z.string().optional(),
  page: z.number().or(z.string()).optional(),
  pageSize: z.number().or(z.string()).optional(),
  search: z.string().optional(),
});

export type QueryDTO = z.infer<typeof querySchema>;
