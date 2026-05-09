import { useState, useEffect, useCallback } from 'react';
import { bookService } from '../../services';
import type { BestsellerBook, BestsellerFilters, BestsellerPeriod } from '../../types/bestseller.types';
import type { PageResponse } from '../../types/base.types';

interface UseBestsellersReturn {
    books: BestsellerBook[];
    isLoading: boolean;
    error: string | null;
    hasMore: boolean;
    currentPage: number;
    totalPages: number;
    totalElements: number;
    loadMore: () => void;
    refresh: () => void;
}

export const useBestsellers = (
    filters: BestsellerFilters,
    period: BestsellerPeriod = 'all'
): UseBestsellersReturn => {
    const [books, setBooks] = useState<BestsellerBook[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);
    const [hasMore, setHasMore] = useState(true);

    const fetchBestsellers = useCallback(async (page: number, append: boolean = false) => {
        try {
            setIsLoading(true);
            setError(null);

            const response: PageResponse<BestsellerBook> = await bookService.getBestSellers(page, 20);

            if (append) {
                setBooks(prev => [...prev, ...response.content]);
            } else {
                setBooks(response.content);
            }

            setTotalPages(response.totalPages);
            setTotalElements(response.totalElements);
            setHasMore(!response.last);
            setCurrentPage(response.pageNumber);
        } catch (err: any) {
            setError(err?.message || 'Không thể tải danh sách sách bán chạy');
            console.error('Error fetching bestsellers:', err);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        setCurrentPage(0);
        setBooks([]);
        fetchBestsellers(0, false);
    }, [filters, period, fetchBestsellers]);

    const loadMore = useCallback(() => {
        if (!isLoading && hasMore) {
            fetchBestsellers(currentPage + 1, true);
        }
    }, [isLoading, hasMore, currentPage, fetchBestsellers]);

    const refresh = useCallback(() => {
        setCurrentPage(0);
        setBooks([]);
        fetchBestsellers(0, false);
    }, [fetchBestsellers]);

    return {
        books,
        isLoading,
        error,
        hasMore,
        currentPage,
        totalPages,
        totalElements,
        loadMore,
        refresh,
    };
};