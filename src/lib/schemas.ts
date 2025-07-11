import * as z from 'zod';

// Catgeory form schema
export const CategoryFormSchema = z.object({
  name: z
    .string({
      required_error: 'Category name is required.',
      invalid_type_error: 'Category name must be a string.',
    })
    .min(2, { message: 'Category name must be at least 2 characters long.' })
    .max(50, { message: 'Category name cannot exceed 50 characters.' })
    .regex(/^[a-zA-Z0-9\s]+$/, {
      message:
        'Only letters, numbers, and spaces are allowed in the category name.',
    }),
  image: z
    .object({
      url: z.string(),
    })
    .array()
    .optional(),
  url: z
    .string({
      required_error: 'Category url is required',
      invalid_type_error: 'Category url must be a string',
    })
    .min(2, { message: 'Category url must be at least 2 characters long.' })
    .max(50, { message: 'Category url cannot exceed 50 characters.' })
    .regex(/^(?!.*(?:[-_ ]){2,})[a-zA-Z0-9_-]+$/, {
      message:
        'Only letters, numbers, hyphen, and underscore are allowed in the category url, and consecutive occurrences of hyphens, underscores, or spaces are not permitted.',
    }),
  featured: z.boolean(),
});

// SubCategory form schema
export const SubCategoryFormSchema = z.object({
	name: z
		.string({
			required_error: "SubCategory name is required.",
			invalid_type_error: "SubCategory name must be a string.",
		})
		.min(2, {
			message: "SubCategory name must be at least 2 characters long.",
		})
		.max(50, { message: "SubCategory name cannot exceed 50 characters." })
		.regex(/^[a-zA-Z0-9\s]+$/, {
			message:
				"Only letters, numbers, and spaces are allowed in the Subcategory name.",
		}),
	image: z
		.object({
			url: z.string(),
		})
		.array()
		.length(1, "Choose a Subcategory image."),
	url: z
		.string({
			required_error: "SubCategory url is required",
			invalid_type_error: "SubCategory url must be a string",
		})
		.min(2, {
			message: "SubCategory url must be at least 2 characters long.",
		})
		.max(50, { message: "SubCategory url cannot exceed 50 characters." })
		.regex(/^(?!.*(?:[-_ ]){2,})[a-zA-Z0-9_-]+$/, {
			message:
				"Only letters, numbers, hyphen, and underscore are allowed in the Subcategory url, and consecutive occurrences of hyphens, underscores, or spaces are not permitted.",
		}),
	featured: z.boolean().default(false),
	categoryId: z.string().uuid(),
});