import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { categoryService } from '../../services';
import { bookService } from '../../services';
import type { CategoryRequest, CategoryResponse } from '../../types';

export const categoryKeys = {
    all: ['categories'] as const,
    detail: (slug: string) => ['categories', 'detail', slug] as const,
};

export const useCategories = () => {
    const queryClient = useQueryClient();


    const useAllCategories = () =>
        useQuery<CategoryResponse[]>({
            queryKey: categoryKeys.all,
            queryFn: () => categoryService.getAllCategories(),
            staleTime: 10 * 60 * 1000,
            gcTime: 30 * 60 * 1000,
        });

    const useCategoryBySlug = (slug?: string) =>
        useQuery<CategoryResponse | null>({
            queryKey: slug ? categoryKeys.detail(slug) : ['categories', 'detail', 'empty'],
            queryFn: async () => {
                if (!slug) throw new Error('Slug is required');
                return await categoryService.getCategoryBySlug(slug);
            },
            enabled: !!slug,
            staleTime: 10 * 60 * 1000,
            gcTime: 30 * 60 * 1000,
            
        });

    const useParentCategories = () => {
        const query = useAllCategories();
        const parentCategories = query.data?.filter((cat) => !cat.parentId) ?? [];

        return {
            ...query,
            data: parentCategories,
        };
    };

    const useChildCategories = (parentId?: string) => {
        const query = useAllCategories();
        const childCategories = parentId
            ? query.data?.filter((cat) => cat.parentId === parentId) ?? []
            : [];

        return {
            ...query,
            data: childCategories,
        };
    };

    const useSearchCategories = (keyword: string) => {
        const query = useAllCategories();
        const searchResults =
            query.data?.filter((cat) => {
                if (!keyword.trim()) return true;
                const q = keyword.toLowerCase();
                return (
                    cat.name.toLowerCase().includes(q) ||
                    cat.slug.toLowerCase().includes(q) ||
                    cat.description?.toLowerCase().includes(q)
                );
            }) ?? [];

        return {
            ...query,
            data: searchResults,
        };
    };

    const checkSlugExists = async (slug: string): Promise<boolean> => {
        try {
            await queryClient.fetchQuery({
                queryKey: categoryKeys.detail(slug),
                queryFn: () => categoryService.getCategoryBySlug(slug),
            });
            return true;
        } catch {
            return false;
        }
    };


    const useCreateCategory = () =>
        useMutation<CategoryResponse, Error, CategoryRequest>({
            mutationFn: categoryService.createCategory,
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: categoryKeys.all });
            },
        });

    const useUpdateCategory = () =>
        useMutation<
            CategoryResponse,
            Error,
            { id: string; data: CategoryRequest }
        >({
            mutationFn: ({ id, data }) => categoryService.updateCategory(id, data),
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: categoryKeys.all });
            },
        });

    const useDeleteCategory = () =>
        useMutation<void, Error, string>({
            mutationFn: (id: string) => categoryService.deleteCategory(id),
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: categoryKeys.all });
            },
        });

    const useBooksByCategory = (
        categoryId: string | undefined,
        page: number = 0,
        size: number = 20
    ) => {
        return useQuery({
            queryKey: ['books', 'category', categoryId, page, size],
            queryFn: () => bookService.getBooksByCategory(categoryId!, page, size),
            enabled: !!categoryId,
            staleTime: 5 * 60 * 1000,
        });
    };

    return {
        useAllCategories,
        useCategoryBySlug,
        useParentCategories,
        useChildCategories,
        useSearchCategories,
        checkSlugExists,
        useCreateCategory,
        useUpdateCategory,
        useDeleteCategory,
        useBooksByCategory,
    };
};