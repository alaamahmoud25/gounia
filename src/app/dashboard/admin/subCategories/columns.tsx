'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

import CustomModal from '@/components/dashboard/shared/custom-modal';
import SubCategoryDetails from '@/components/dashboard/forms/subCategory-details';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import { useModal } from '@/providers/modal-provider';
import { toast } from 'sonner'; // ✅ استيراد مكتبة sonner

import {
  BadgeCheck,
  BadgeMinus,
  Edit,
  MoreHorizontal,
  Trash,
} from 'lucide-react';

import { getAllCategories } from '@/queries/category';
import { deleteSubCategory, getSubCategory } from '@/queries/subCategory';

import { ColumnDef } from '@tanstack/react-table';
import { Category } from '@prisma/client';
import { SubCategoryWithCategoryType } from '@/lib/types';

export const columns: ColumnDef<SubCategoryWithCategoryType>[] = [
  {
    accessorKey: 'image',
    header: '',
    cell: ({ row }) => (
      <div className="relative h-44 min-w-64 rounded-xl overflow-hidden">
        <Image
          src={row.original.image}
          alt=""
          width={1000}
          height={1000}
          className="w-40 h-40 rounded-full object-cover shadow-2xl"
        />
      </div>
    ),
  },
  {
    accessorKey: 'name',
    header: 'Name',
    cell: ({ row }) => (
      <span className="font-extrabold text-lg capitalize">
        {row.original.name}
      </span>
    ),
  },
  {
    accessorKey: 'url',
    header: 'URL',
    cell: ({ row }) => <span>/{row.original.url}</span>,
  },
  {
    accessorKey: 'category',
    header: 'Category',
    cell: ({ row }) => <span>{row.original.category.name}</span>,
  },
  {
    accessorKey: 'featured',
    header: 'Featured',
    cell: ({ row }) => (
      <span className="text-muted-foreground flex justify-center">
        {row.original.featured ? (
          <BadgeCheck className="stroke-green-300" />
        ) : (
          <BadgeMinus />
        )}
      </span>
    ),
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const rowData = row.original;
      return <CellActions rowData={rowData} />;
    },
  },
];

interface CellActionsProps {
  rowData: SubCategoryWithCategoryType;
}

const CellActions: React.FC<CellActionsProps> = ({ rowData }) => {
  const { setOpen, setClose } = useModal();
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  if (!rowData || !rowData.id) return null;

  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      const categories = await getAllCategories();
      setCategories(categories);
    };
    fetchCategories();
  }, []);

  return (
    <AlertDialog>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem
            className="flex gap-2"
            onClick={() => {
              setOpen(
                <CustomModal>
                  <SubCategoryDetails
                    categories={categories}
                    data={{ ...rowData }}
                  />
                </CustomModal>,
                async () => {
                  return {
                    rowData: await getSubCategory(rowData?.id),
                  };
                }
              );
            }}
          >
            <Edit size={15} />
            Edit Details
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <AlertDialogTrigger asChild>
            <DropdownMenuItem className="flex gap-2">
              <Trash size={15} /> Delete subCategory
            </DropdownMenuItem>
          </AlertDialogTrigger>
        </DropdownMenuContent>
      </DropdownMenu>
      <AlertDialogContent className="max-w-lg">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-left">
            Are you absolutely sure?
          </AlertDialogTitle>
          <AlertDialogDescription className="text-left">
            This action cannot be undone. This will permanently delete the
            subCategory and related data.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex items-center">
          <AlertDialogCancel className="mb-2">Cancel</AlertDialogCancel>
          <AlertDialogAction
            disabled={loading}
            className="bg-destructive hover:bg-destructive mb-2 text-white"
            onClick={async () => {
              try {
                setLoading(true);
                await deleteSubCategory(rowData.id);
                toast.success('The subCategory has been deleted.');
                router.refresh();
                setClose();
              } catch (err) {
                toast.error('Something went wrong while deleting.');
              } finally {
                setLoading(false);
              }
            }}
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
