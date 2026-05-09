import { useState, useEffect, useCallback } from 'react';
import { categoryService } from '../../services';
import { type CategoryResponse } from '../../types/category.types';
import { toast } from 'react-hot-toast';

export const useAdminCategories = () => {
    const [categories, setCategories] = useState<CategoryResponse[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const loadCategories = useCallback(async () => {
        try {
            setIsLoading(true);
            setError(null);
            const data = await categoryService.getAllCategories();
            setCategories(data);
        } catch (err: any) {
            const errorMessage = err.message || 'Failed to load categories';
            setError(errorMessage);
            toast.error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        loadCategories();
    }, [loadCategories]);

    const createCategory = async (data: any) => {
        try {
            await categoryService.createCategory(data);
            toast.success('Category created successfully');
            await loadCategories();
            return true;
        } catch (err: any) {
            toast.error(err.message || 'Failed to create category');
            return false;
        }
    };

    const updateCategory = async (categoryId: string, data: any) => {
        try {
            await categoryService.updateCategory(categoryId, data);
            toast.success('Category updated successfully');
            await loadCategories();
            return true;
        } catch (err: any) {
            toast.error(err.message || 'Failed to update category');
            return false;
        }
    };

    const deleteCategory = async (categoryId: string) => {
        try {
            await categoryService.deleteCategory(categoryId);
            toast.success('Category deleted successfully');
            await loadCategories();
            return true;
        } catch (err: any) {
            toast.error(err.message || 'Failed to delete category');
            return false;
        }
    };

    const searchCategories = async (keyword: string) => {
        try {
            const data = await categoryService.searchCategories(keyword);
            setCategories(data);
        } catch (err: any) {
            toast.error(err.message || 'Failed to search categories');
        }
    };

    const checkSlugExists = async (slug: string): Promise<boolean> => {
        try {
            return await categoryService.isSlugExists(slug);
        } catch (err) {
            return false;
        }
    };

    return {
        categories,
        isLoading,
        error,
        loadCategories,
        createCategory,
        updateCategory,
        deleteCategory,
        searchCategories,
        checkSlugExists,
    };
};