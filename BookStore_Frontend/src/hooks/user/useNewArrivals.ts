import { useState, useEffect, useCallback } from 'react';
import { bookService } from '../../services';
import type { NewArrivalBook, NewArrivalFilters, NewArrivalTimePeriod } from '../../types/new_arrivals.types';
import type { PageResponse } from '../../types/base.types';

interface UseNewArrivalsReturn {
    books: NewArrivalBook[];
    isLoading: boolean;
    error: string | null;
    hasMore: boolean;
    currentPage: number;
    totalPages: number;
    totalElements: number;
    loadMore: () => void;
    refresh: () => void;
}

export const useNewArrivals = (
    filters: NewArrivalFilters,
    period: NewArrivalTimePeriod = 'all'
): UseNewArrivalsReturn => {
    const [books, setBooks] = useState<NewArrivalBook[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);
    const [hasMore, setHasMore] = useState(true);

    const fetchNewArrivals = useCallback(async (page: number, append: boolean = false) => {
        try {
            setIsLoading(true);
            setError(null);

            const response: PageResponse<NewArrivalBook> = await bookService.getNewArrivals(page, 20);

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
            setError(err?.message || 'Không thể tải danh sách sách mới về');
            console.error('Error fetching new arrivals:', err);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        setCurrentPage(0);
        setBooks([]);
        fetchNewArrivals(0, false);
    }, [filters, period, fetchNewArrivals]);

    const loadMore = useCallback(() => {
        if (!isLoading && hasMore) {
            fetchNewArrivals(currentPage + 1, true);
        }
    }, [isLoading, hasMore, currentPage, fetchNewArrivals]);

    const refresh = useCallback(() => {
        setCurrentPage(0);
        setBooks([]);
        fetchNewArrivals(0, false);
    }, [fetchNewArrivals]);

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