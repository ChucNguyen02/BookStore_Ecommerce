import { useQuery } from '@tanstack/react-query';
import { bookService } from '../../services';
import type { BookResponse } from '../../types';

export const useBooks = () => {
    const { data: featuredBooks = [], isLoading: featuredLoading, error: featuredError } = useQuery({
        queryKey: ['books', 'featured'],
        queryFn: async () => {
            const featured = await bookService.getFeaturedBooks(8);
            if (featured.length > 0) {
                return featured;
            }

            const fallback = await bookService.getAllBooks(0, 8);
            return fallback.content;
        },
        staleTime: 5 * 60 * 1000,
    });

    const { data: bestSellersData, isLoading: bestsellersLoading, error: bestsellersError } = useQuery({
        queryKey: ['books', 'bestsellers'],
        queryFn: async () => {
            const bestSellers = await bookService.getBestSellers(0, 8);
            if (bestSellers.content.length > 0) {
                return bestSellers;
            }

            return bookService.getAllBooks(0, 8);
        },
        staleTime: 5 * 60 * 1000,
    });

    const { data: newArrivalsData, isLoading: newArrivalsLoading, error: newArrivalsError } = useQuery({
        queryKey: ['books', 'newarrivals'],
        queryFn: async () => {
            const newArrivals = await bookService.getNewArrivals(0, 8);
            if (newArrivals.content.length > 0) {
                return newArrivals;
            }

            return bookService.getAllBooks(0, 8);
        },
        staleTime: 5 * 60 * 1000,
    });

    const { data: onSaleBooksData, isLoading: onSaleLoading, error: onSaleError } = useQuery({
        queryKey: ['books', 'onsale'],
        queryFn: async () => {
            const data = await bookService.getBooksOnSale(0, 8);
            return data;
        },
        staleTime: 5 * 60 * 1000,
    });

    const loading = featuredLoading || bestsellersLoading || newArrivalsLoading || onSaleLoading;
    const error = featuredError || bestsellersError || newArrivalsError || onSaleError;

    return {
        featuredBooks: featuredBooks as BookResponse[],
        bestSellers: bestSellersData?.content || [],
        newArrivals: newArrivalsData?.content || [],
        onSaleBooks: onSaleBooksData?.content || [],
        loading,
        error: error ? (error as Error).message : null
    };
};

// Tách ra thành hook riêng
export const useBooksByAuthor = (
    authorId: string | undefined,
    page: number = 0,
    size: number = 20
) => {
    return useQuery({
        queryKey: ['books', 'author', authorId, page, size],
        queryFn: () => bookService.getBooksByAuthor(authorId!, page, size),
        enabled: !!authorId,
        staleTime: 5 * 60 * 1000,
    });
};

// Hook để search books
export const useSearchBooks = (
    keyword: string,
    page: number = 0,
    size: number = 20
) => {
    return useQuery({
        queryKey: ['books', 'search', keyword, page, size],
        queryFn: () => bookService.searchBooks(keyword, page, size),
        enabled: keyword.trim().length > 0,
        staleTime: 2 * 60 * 1000,
    });
};

export const useAvailableLanguages = () => {
    return useQuery<string[]>({
        queryKey: ['books', 'languages'],
        queryFn: () => bookService.getAvailableLanguages(),
        staleTime: 30 * 60 * 1000,
        gcTime: 60 * 60 * 1000,
    });
};