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