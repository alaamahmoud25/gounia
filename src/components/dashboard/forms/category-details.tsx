"use client";

// React
import { FC, useEffect } from "react";

// Prisma model
import { Category } from "@prisma/client";

// Form handling utilities
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

// Schema
import { CategoryFormSchema } from "@/lib/schemas";

// UI Components
import { AlertDialog } from "@/components/ui/alert-dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ImageUpload from "../shared/image-upload";

// Queries
import { upsertCategory } from "@/queries/category";

// Utils
import { v4 } from "uuid";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface CategoryDetailsProps {
  data?: Category;
  cloudinary_key: string;
}

const CategoryDetails: FC<CategoryDetailsProps> = ({
  data,
  cloudinary_key,
}) => {
  const router = useRouter();

  // Form setup
  const form = useForm<z.infer<typeof CategoryFormSchema>>({
    resolver: zodResolver(CategoryFormSchema),
    defaultValues: {
      name: data?.name || "",
      image: data?.image ? [{ url: data.image }] : [],
      url: data?.url || "",
      featured: data?.featured || false,
    },
  });

  const isLoading = form.formState.isSubmitting;

  // Submit handler
  const handleSubmit = async (values: z.infer<typeof CategoryFormSchema>) => {
    try {
      console.log("Form values:", values);

      const response = await upsertCategory({
        id: data?.id || v4(),
        name: values.name,
        image: values.image?.[0]?.url || null,
        url: values.url,
        featured: values.featured,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      toast.success(
        data?.id
          ? "Category updated successfully!"
          : "Category created successfully!"
      );

      if (data?.id) {
        router.refresh();
      } else {
        router.push("/dashboard/admin/categories");
      }
    } catch (error: any) {
      console.error("Error:", error);
      toast.error(error.message || "Something went wrong");
    }
  };

  return (
    <AlertDialog>
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Category Information</CardTitle>
          <CardDescription>
            {data?.id ? "Update category" : "Create a new category"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
              {/* Image Field */}
              <FormField
                control={form.control}
                name="image"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <ImageUpload
                        type="profile"
                        cloudinary_key={cloudinary_key}
                        value={(field.value || []).map((image) => image.url)}
                        disabled={isLoading}
                        onChange={(url) => field.onChange([{ url }])}
                        onRemove={() => field.onChange([])}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Name Field */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category Name *</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter category name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* URL Field */}
              <FormField
                control={form.control}
                name="url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category URL *</FormLabel>
                    <FormControl>
                      <Input placeholder="category-url" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Featured Field */}
              <FormField
                control={form.control}
                name="featured"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Featured</FormLabel>
                      <FormDescription>
                        This category will appear on the home page
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />

              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Creating..." : data?.id ? "Update Category" : "Create Category"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </AlertDialog>
  );
};

export default CategoryDetails;