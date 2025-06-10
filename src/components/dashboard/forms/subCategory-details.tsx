"use client";
import { FC, useEffect } from 'react';
import { Category, SubCategory } from '@prisma/client';
import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { SubCategoryFormSchema } from '@/lib/schemas';
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import ImageUpload from '../shared/image-upload';
import { upsertSubCategory } from '@/queries/subCategory';
import { v4 } from 'uuid';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

interface SubCategoryDetailsProps {
  data?: SubCategory;
  categories: Category[];
}

const SubCategoryDetails: FC<SubCategoryDetailsProps> = ({ data, categories }) => {
  const router = useRouter();
  type SubCategoryFormValues = z.infer<typeof SubCategoryFormSchema>;

  const form = useForm<SubCategoryFormValues>({
    mode: 'onChange',
    resolver: zodResolver(SubCategoryFormSchema),
    defaultValues: {
      name: data?.name ?? '',
      image: data?.image ? [{ url: data.image }] : [],
      url: data?.url ?? '',
      featured: data?.featured ?? false,
      categoryId: data?.categoryId ?? '',
    },
  });

  const isLoading = form.formState.isSubmitting;

  useEffect(() => {
    if (data) {
      form.reset({
        name: data.name,
        image: data.image ? [{ url: data.image }] : [],
        url: data.url,
        featured: data.featured ?? false,
        categoryId: data.categoryId,
      });
    }
  }, [data, form]);

  const handleSubmit = async (values: SubCategoryFormValues) => {
    try {
      await upsertSubCategory({
        id: data?.id ?? v4(),
        name: values.name,
        image: values.image[0]?.url || '',
        url: values.url,
        featured: values.featured,
        categoryId: values.categoryId,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      toast.success(data?.id ? 'Category updated successfully!' : 'Category created successfully!');

      data?.id ? router.refresh() : router.push('/dashboard/admin/subCategories');
    } catch (error: any) {
      toast.error(error.message || 'Something went wrong');
    }
  };

  return (
    <AlertDialog>
      <Card className="w-full">
        <CardHeader>
          <CardTitle>{data?.id ? 'Edit SubCategory' : 'Create SubCategory'}</CardTitle>
          <CardDescription>
            {data?.id
              ? `Update ${data.name} subcategory information.`
              : 'Create a new subcategory. You can edit this later.'}
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="image"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Image</FormLabel>
                    <FormControl>
                      <ImageUpload
                        type="profile"
                        value={field.value.map((image) => image.url)}
                        disabled={isLoading}
                        onChange={(url) => field.onChange([{ url }])}
                        onRemove={(url) =>
                          field.onChange(field.value.filter((img) => img.url !== url))
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="SubCategory name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>URL</FormLabel>
                    <FormControl>
                      <Input placeholder="/subCategory-url" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="categoryId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select
                      disabled={isLoading || categories.length === 0}
                      onValueChange={field.onChange}
                      value={field.value}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="featured"
                render={({ field }) => (
                  <FormItem className="flex items-start gap-2 border p-4 rounded-md">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1">
                      <FormLabel>Featured</FormLabel>
                      <FormDescription>This subcategory will appear on the homepage.</FormDescription>
                    </div>
                  </FormItem>
                )}
              />

              <Button type="submit" disabled={isLoading}>
                {isLoading
                  ? 'Loading...'
                  : data?.id
                  ? 'Save Changes'
                  : 'Create SubCategory'}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </AlertDialog>
  );
};

export default SubCategoryDetails;
