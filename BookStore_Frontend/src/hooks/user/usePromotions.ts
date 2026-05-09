import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { bookService, voucherService } from '../../services';
import type { BookResponse } from '../../types/book.types';
import type { VoucherResponse } from '../../types/voucher.types';
import type {
    PromotionTab,
    PromotionFiltersType,
    FeaturedDeal,
    FlashSaleData,
} from '../../types/promotion.types';

interface UsePromotionsParams {
    activeTab: PromotionTab;
    filters: PromotionFiltersType;
}

interface UsePromotionsReturn {
    books: BookResponse[];
    vouchers: VoucherResponse[];
    featuredDeals: FeaturedDeal[];
    flashSale: FlashSaleData | null;
    isLoading: boolean;
    error: string | null;
    hasMore: boolean;
    loadMore: () => void;
}

export const usePromotions = ({
    activeTab,
    filters,
}: UsePromotionsParams): UsePromotionsReturn => {
    const { t, i18n } = useTranslation();
    const [books, setBooks] = useState<BookResponse[]>([]);
    const [vouchers, setVouchers] = useState<VoucherResponse[]>([]);
    const [featuredDeals, setFeaturedDeals] = useState<FeaturedDeal[]>([]);
    const [flashSale, setFlashSale] = useState<FlashSaleData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);

    // Fetch books based on tab and filters
    const fetchBooks = useCallback(
        async (pageNum: number = 0) => {
            try {
                setIsLoading(true);
                setError(null);

                let response;

                switch (activeTab) {
                    case 'sale':
                        response = await bookService.filterBooks({
                            onSale: true,
                            minPrice: filters.maxPrice ? 0 : undefined,
                            maxPrice: filters.maxPrice,
                            categoryId: filters.categoryId,
                            page: pageNum,
                            size: 20,
                            sortBy: filters.sortBy === 'discount' ? 'discountPrice' : 'createdAt',
                            sortDirection: 'DESC',
                        });
                        break;

                    case 'bestseller':
                        response = await bookService.getBestSellers(pageNum, 20);
                        break;

                    case 'new':
                        response = await bookService.getNewArrivals(pageNum, 20);
                        break;

                    default: // 'all'
                        response = await bookService.getBooksOnSale(pageNum, 20);
                        break;
                }

                if (pageNum === 0) {
                    setBooks(response.content);
                } else {
                    setBooks((prev) => [...prev, ...response.content]);
                }

                setHasMore(!response.last);
                setPage(pageNum);
            } catch (err) {
                setError(err instanceof Error ? err.message : t('Promotions.loadBooksError'));
            } finally {
                setIsLoading(false);
            }
        },
        [activeTab, filters, t]
    );

    // Fetch vouchers
    const fetchVouchers = useCallback(async () => {
        try {
            const data = await voucherService.getAllAvailableVouchers();
            setVouchers(data.slice(0, 6)); // Limit to 6 vouchers
        } catch (err) {
            console.error('Failed to fetch vouchers:', err);
        }
    }, []);

    // Fetch featured deals
    const fetchFeaturedDeals = useCallback(async () => {
        try {
            const featured = await bookService.getFeaturedBooks(8);
            const deals: FeaturedDeal[] = featured
                .filter((book) => book.isOnSale)
                .map((book) => ({
                    id: book.id,
                    title: book.title,
                    slug: book.slug,
                    originalPrice: book.price,
                    discountPrice: book.discountPrice!,
                    discountPercentage: book.discountPercentage!,
                    imageUrl: book.coverImageUrl!,
                    stockQuantity: book.stockQuantity,
                    soldCount: book.soldCount,
                    badge: book.isFeatured ? t('Promotions.featuredBadge') : undefined,
                }));

            setFeaturedDeals(deals);
        } catch (err) {
            console.error('Failed to fetch featured deals:', err);
        }
    }, [t, i18n.language]);

    // Mock flash sale data (you can replace with real API)
    const fetchFlashSale = useCallback(async () => {
        try {
            const saleBooks = await bookService.getBooksOnSale(0, 10);

            if (saleBooks.content.length > 0) {
                const endTime = new Date();
                endTime.setHours(endTime.getHours() + 2); // 2 hours from now

                setFlashSale({
                    title: t('Promotions.flashSale.title'),
                    endTime: endTime.toISOString(),
                    books: saleBooks.content.slice(0, 6),
                    description: t('Promotions.flashSale.description'),
                });
            }
        } catch (err) {
            console.error('Failed to fetch flash sale:', err);
        }
    }, [t, i18n.language]);

    // Initial load
    useEffect(() => {
        fetchBooks(0);
        fetchVouchers();
        fetchFeaturedDeals();
        fetchFlashSale();
    }, [fetchBooks, fetchVouchers, fetchFeaturedDeals, fetchFlashSale, i18n.language]);

    // Load more
    const loadMore = useCallback(() => {
        if (!isLoading && hasMore) {
            fetchBooks(page + 1);
        }
    }, [fetchBooks, isLoading, hasMore, page]);

    return {
        books,
        vouchers,
        featuredDeals,
        flashSale,
        isLoading,
        error,
        hasMore,
        loadMore,
    };
};