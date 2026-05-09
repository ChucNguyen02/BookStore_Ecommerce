import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { bookService } from '../../services';
import type { BookResponse, BookFilterRequest } from '../../types';


export const useBookFilters = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [books, setBooks] = useState<BookResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);

    const currentFilters: BookFilterRequest = {
        keyword: searchParams.get('keyword') || undefined,
        categoryId: searchParams.get('categoryId') || undefined,
        authorId: searchParams.get('authorId') || undefined,
        minPrice: searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : undefined,
        maxPrice: searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : undefined,
        language: searchParams.get('language') || undefined,
        // FIX: Map từ 'featured' và 'sale' trong URL
        isFeatured: searchParams.get('featured') === 'true' ? true : undefined,
        onSale: searchParams.get('sale') === 'true' ? true : undefined,
        minRating: searchParams.get('rating') ? Number(searchParams.get('rating')) : undefined,
        sortBy: searchParams.get('sortBy') || 'createdAt',
        sortDirection: (searchParams.get('sortDirection') as 'ASC' | 'DESC') || 'DESC',
        page: Number(searchParams.get('page') || '0'),
        size: Number(searchParams.get('size') || '20'),
    };

    const hasActiveFilters = Boolean(
        currentFilters.keyword ||
        currentFilters.categoryId ||
        currentFilters.authorId ||
        currentFilters.minPrice !== undefined ||
        currentFilters.maxPrice !== undefined ||
        currentFilters.language ||
        currentFilters.isFeatured !== undefined ||
        currentFilters.onSale !== undefined ||
        currentFilters.minRating !== undefined
    );

    useEffect(() => {
        const fetchBooks = async () => {
            try {
                setLoading(true);
                setError(null);



                let result = await bookService.filterBooks(currentFilters);

                if (!hasActiveFilters && result.totalElements === 0 && result.content.length === 0) {
                    result = await bookService.getAllBooks(currentFilters.page ?? 0, currentFilters.size ?? 20);
                }

                setBooks(result.content);
                setTotalPages(result.totalPages);
                setTotalElements(result.totalElements);
            } catch (err: unknown) {
                console.error('❌ API Error:', err);
                if (err instanceof Error) {
                    setError(err.message || 'Không thể tải danh sách sách');
                } else {
                    setError('Không thể tải danh sách sách');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchBooks();
    }, [searchParams, hasActiveFilters, currentFilters.page, currentFilters.size]);

    const updateFilters = (newFilters: Partial<BookFilterRequest>) => {
        const params = new URLSearchParams(searchParams);

        Object.entries(newFilters).forEach(([key, value]) => {
            // FIX: Map isFeatured -> featured, onSale -> sale
            let paramKey = key;
            if (key === 'isFeatured') paramKey = 'featured';
            if (key === 'onSale') paramKey = 'sale';
            if (key === 'minRating') paramKey = 'rating';

            if (value !== undefined && value !== null && value !== '') {
                params.set(paramKey, String(value));
            } else {
                params.delete(paramKey);
            }
        });

        // Reset page when filters change (unless page is explicitly set)
        if (newFilters.page === undefined) {
            params.set('page', '0');
        }

        setSearchParams(params);
    };

    const clearFilters = () => {
        setSearchParams({});
    };

    const setPage = (page: number) => {
        updateFilters({ page });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return {
        books,
        loading,
        error,
        totalPages,
        totalElements,
        currentFilters,
        updateFilters,
        clearFilters,
        setPage,
    };
};