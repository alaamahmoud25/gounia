'use server';

// Clerk
import { currentUser } from '@clerk/nextjs/server';
import { db } from '@/lib/db';
import { Category } from '@prisma/client';

// Helper: Generate slug from text
const generateSlug = (text: string) => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special chars
    .replace(/[\s_-]+/g, '-') // Replace spaces/underscores with dashes
    .replace(/^-+|-+$/g, ''); // Trim dashes
};

export const upsertCategory = async (category: Partial<Category>) => {
  try {
    // Debug logging
    console.log("🔥 upsertCategory called with:", category);
    console.log("📋 Category name:", category.name);
    console.log("🆔 Category ID:", category.id);
    
    const user = await currentUser();

    if (!user) throw new Error('Unauthenticated.');
    if (user.privateMetadata.role !== 'ADMIN') {
      throw new Error(
        'Unauthorized Access: Admin Privileges Required for Entry.'
      );
    }

    // ✅ Ensure name is provided
    if (!category || !category.name) {
      console.log("❌ Name validation failed:", { category, name: category?.name });
      throw new Error('Missing required field: name.');
    }

    // ✅ Generate URL if not provided
    const urlSlug = category.url?.trim() || generateSlug(category.name);

    // Check for duplicates
    const existingCategory = await db.category.findFirst({
      where: {
        AND: [
          {
            OR: [{ name: category.name }, { url: urlSlug }],
          },
          {
            NOT: { id: category.id },
          },
        ],
      },
    });

    if (existingCategory) {
      if (existingCategory.name === category.name) {
        throw new Error('A category with the same name already exists');
      } else if (existingCategory.url === urlSlug) {
        throw new Error('A category with the same URL already exists');
      }
    }

    // Perform upsert
    const categoryDetails = await db.category.upsert({
      where: { id: category.id || '' }, // empty string ensures upsert falls to create
      update: {
        name: category.name,
        url: urlSlug,
        image: category.image ?? null,
        featured: category.featured ?? false,
      },
      create: {
        name: category.name,
        url: urlSlug,
        image: category.image ?? null,
        featured: category.featured ?? false,
      },
    });

    return categoryDetails;
  } catch (error) {
    console.error('[UPSERT_CATEGORY_ERROR]', error);
    throw error;
  }
};

export const getAllCategories = async () => {
  //retrieve all categories from the databas
  const categories = await db.category.findMany({
    orderBy: {
      updatedAt: "desc",
    },
  });
  return categories;
};


// Function: getCategory
// Description: Retrieves a category from the database by its ID.
// Permission Level: Public
// Parameters:
// - categoryId: ID of the category to retrieve.
// Returns: Category details if found, otherwise undefined.

export const getCategory = async (categoryId: string) => {
	try {
		if (!categoryId) throw new Error("Please provide a category ID.");

		// Retrieve category from the database
		const category = await db.category.findUnique({
			where: {
				id: categoryId,
			},
		});
		return category;
	} catch (error) {
		// Log and re-throw any errors
		console.log(error);
		throw error;
	}
};

// Function: deleteCategory
// Description: Deletes a category from the database by its ID.
// Permission Level: Admin only
// Parameters:
// - categoryId: ID of the category to delete.
// Returns: Boolean indicating whether the category was deleted successfully.

export const deleteCategory = async (categoryId: string) => {
	try {
		// Get current user
		const user = await currentUser();

		// Ensure user is authenticated
		if (!user) throw new Error("Unauthenticated.");

		// Verify admin permission
		if (user.privateMetadata.role !== "ADMIN")
			throw new Error(
				"Unauthorized Access: Admin Privileges Required for Entry."
			);

		if (!categoryId) throw new Error("Please provide a category ID.");

		// Delete category from the database
		const response = await db.category.delete({
			where: {
				id: categoryId,
			},
		});
		return response;
	} catch (error) {
		// Log and re-throw any errors
		console.log(error);
		throw error;
	}
};