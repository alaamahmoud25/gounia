import * as z from 'zod';

// Catgeory form schema - مبسط
export const CategoryFormSchema = z.object({
  name: z.string().min(1, "Category name is required"),
  image: z.array(z.object({ url: z.string() })).optional().default([]),
  url: z.string().min(1, "Category URL is required"),
  featured: z.boolean().default(false),
});
