import { useState, useCallback, useEffect } from 'react';
import { reviewService, authService, orderService } from '../../services';
import { useAppContext } from '../../context/AppContext';
import toast from 'react-hot-toast';
import type {
    ReviewResponse,
    ReviewSummaryResponse,
    ReviewFilterRequest,
    CreateReviewRequest,
    UpdateReviewRequest,
    PageResponse,
} from '../../types';
import { useQuery } from '@tanstack/react-query';

export const useReviews = (bookId: string) => {
    const { language } = useAppContext();

    const [reviews, setReviews] = useState<ReviewResponse[]>([]);
    const [summary, setSummary] = useState<ReviewSummaryResponse | null>(null);
    const [loading, setLoading] = useState(false);
    const [loadingMore, setLoadingMore] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [currentPage, setCurrentPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [hasPurchased, setHasPurchased] = useState(false);

    const [filter, setFilter] = useState<ReviewFilterRequest>({
        page: 0,
        size: 10,
        sortBy: 'createdAt',
        sortDirection: 'DESC',
    });

    const currentUser = authService.getStoredUser();
    const isAdmin = currentUser?.role === 'ADMIN';

    // Kiểm tra người dùng đã mua sách chưa
    const checkPurchaseStatus = useCallback(async () => {
        if (!currentUser) {
            setHasPurchased(false);
            return;
        }

        try {
            const purchased = await orderService.hasUserPurchasedBook(bookId);
            setHasPurchased(purchased);
        } catch (err: unknown) {
            console.error('Cannot check purchase status:', err);
            setHasPurchased(false);
        }
    }, [bookId, currentUser]);

    // Tải danh sách đánh giá
    const loadReviews = useCallback(
        async (resetPage = true) => {
            try {
                setLoading(true);
                const pageToLoad = resetPage ? 0 : currentPage;
                const response = await reviewService.getBookReviews(bookId, {
                    ...filter,
                    page: pageToLoad,
                });

                if (resetPage) {
                    setReviews(response.content);
                    setCurrentPage(0);
                } else {
                    setReviews((prev) => [...prev, ...response.content]);
                }

                setHasMore(!response.last);
                setCurrentPage(pageToLoad);
            } catch (err: unknown) {
                const message =
                    err instanceof Error
                        ? err.message
                        : language === 'vi'
                          ? 'Không thể tải đánh giá'
                          : 'Cannot load reviews';
                toast.error(message);
            } finally {
                setLoading(false);
            }
        },
        [bookId, filter, currentPage, language]
    );

    // Tải thêm đánh giá
    const loadMore = useCallback(async () => {
        if (loadingMore || !hasMore) return;

        try {
            setLoadingMore(true);
            const nextPage = currentPage + 1;
            const response = await reviewService.getBookReviews(bookId, {
                ...filter,
                page: nextPage,
            });

            setReviews((prev) => [...prev, ...response.content]);
            setCurrentPage(nextPage);
            setHasMore(!response.last);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : '';
            if (message) toast.error(message);
        } finally {
            setLoadingMore(false);
        }
    }, [bookId, filter, currentPage, hasMore, loadingMore]);

    // Tải tóm tắt đánh giá (rating trung bình, số lượng theo sao,...)
    const loadSummary = useCallback(async () => {
        try {
            const data = await reviewService.getReviewSummary(bookId);
            setSummary(data);
        } catch (err: unknown) {
            console.error('Cannot load review summary:', err);
        }
    }, [bookId]);

    // Cập nhật bộ lọc (ví dụ: sort theo sao, có ảnh,...)
    const updateFilter = useCallback((newFilter: Partial<ReviewFilterRequest>) => {
        setFilter((prev) => ({ ...prev, ...newFilter, page: 0 }));
        setCurrentPage(0);
    }, []);

    // Tạo đánh giá mới
    const createReview = useCallback(
        async (data: CreateReviewRequest): Promise<boolean> => {
            if (!hasPurchased) {
                toast.error(
                    language === 'vi'
                        ? 'Bạn cần mua sản phẩm này trước khi đánh giá'
                        : 'You need to purchase this product before reviewing'
                );
                return false;
            }

            try {
                setSubmitting(true);
                await reviewService.createReview(data);
                toast.success(
                    language === 'vi' ? 'Gửi đánh giá thành công' : 'Review submitted successfully'
                );
                await Promise.all([loadReviews(true), loadSummary()]);
                return true;
            } catch (err: unknown) {
                const message =
                    err instanceof Error
                        ? err.message
                        : language === 'vi'
                          ? 'Có lỗi xảy ra'
                          : 'An error occurred';
                toast.error(message);
                return false;
            } finally {
                setSubmitting(false);
            }
        },
        [hasPurchased, language, loadReviews, loadSummary]
    );

    // Cập nhật đánh giá
    const updateReview = useCallback(
        async (reviewId: string, data: UpdateReviewRequest): Promise<boolean> => {
            try {
                setSubmitting(true);
                await reviewService.updateReview(reviewId, data);
                toast.success(
                    language === 'vi' ? 'Cập nhật đánh giá thành công' : 'Review updated successfully'
                );
                await Promise.all([loadReviews(true), loadSummary()]);
                return true;
            } catch (err: unknown) {
                const message =
                    err instanceof Error
                        ? err.message
                        : language === 'vi'
                          ? 'Có lỗi xảy ra'
                          : 'An error occurred';
                toast.error(message);
                return false;
            } finally {
                setSubmitting(false);
            }
        },
        [language, loadReviews, loadSummary]
    );

    // Xóa đánh giá
    const deleteReview = useCallback(
        async (reviewId: string): Promise<boolean> => {
            const confirmMsg =
                language === 'vi'
                    ? 'Bạn có chắc muốn xóa đánh giá này?'
                    : 'Are you sure you want to delete this review?';

            if (!window.confirm(confirmMsg)) return false;

            try {
                await reviewService.deleteReview(reviewId);
                toast.success(language === 'vi' ? 'Đã xóa đánh giá' : 'Review deleted');
                await Promise.all([loadReviews(true), loadSummary()]);
                return true;
            } catch (err: unknown) {
                const message = err instanceof Error ? err.message : '';
                if (message) toast.error(message);
                return false;
            }
        },
        [language, loadReviews, loadSummary]
    );

    // Vote (helpful / not helpful)
    const voteReview = useCallback(
        async (reviewId: string, voteType: 'UP' | 'DOWN'): Promise<boolean> => {
            try {
                await reviewService.voteReview(reviewId, voteType);
                await loadReviews(false);
                return true;
            } catch (err: unknown) {
                const message = err instanceof Error ? err.message : '';
                if (message) toast.error(message);
                return false;
            }
        },
        [loadReviews]
    );

    // Xóa vote
    const removeVote = useCallback(
        async (reviewId: string): Promise<boolean> => {
            try {
                await reviewService.removeVote(reviewId);
                await loadReviews(false);
                return true;
            } catch (err: unknown) {
                const message = err instanceof Error ? err.message : '';
                if (message) toast.error(message);
                return false;
            }
        },
        [loadReviews]
    );

    // Admin trả lời đánh giá
    const replyToReview = useCallback(
        async (reviewId: string, replyText: string): Promise<boolean> => {
            if (!isAdmin) {
                toast.error(
                    language === 'vi'
                        ? 'Chỉ admin mới có thể phản hồi đánh giá'
                        : 'Only admins can reply to reviews'
                );
                return false;
            }

            if (!replyText.trim()) return false;

            try {
                await reviewService.replyToReview(reviewId, { replyText: replyText.trim() });
                toast.success(language === 'vi' ? 'Đã gửi phản hồi' : 'Reply sent');
                await loadReviews(false);
                return true;
            } catch (err: unknown) {
                const message = err instanceof Error ? err.message : '';
                if (message) toast.error(message);
                return false;
            }
        },
        [isAdmin, language, loadReviews]
    );

    // Tự động kiểm tra trạng thái mua hàng và tải dữ liệu khi mount hoặc bookId thay đổi
    useEffect(() => {
        checkPurchaseStatus();
        loadReviews(true);
        loadSummary();
    }, [bookId]);

    return {
        // State
        reviews,
        summary,
        loading,
        loadingMore,
        submitting,
        hasMore,
        filter,
        currentUser,
        hasPurchased,
        isAdmin,

        // Actions
        checkPurchaseStatus,
        loadReviews,
        loadMore,
        loadSummary,
        updateFilter,
        createReview,
        updateReview,
        deleteReview,
        voteReview,
        removeVote,
        replyToReview,
    };
};

/**
 * Hook để lấy top helpful reviews từ tất cả sách (global)
 */
export const useGlobalTopHelpfulReviews = (page: number = 0, size: number = 6) => {
    return useQuery<PageResponse<ReviewResponse>>({
        queryKey: ['reviews', 'global', 'top-helpful', page, size],
        queryFn: () => reviewService.getGlobalTopHelpfulReviews(page, size),
        staleTime: 10 * 60 * 1000, // 10 minutes
        gcTime: 30 * 60 * 1000, // 30 minutes
    });
};

/**
 * Hook để lấy featured reviews (có ảnh, rating cao) từ tất cả sách
 * Dùng cho testimonials section
 */
export const useGlobalFeaturedReviews = (page: number = 0, size: number = 3) => {
    return useQuery<PageResponse<ReviewResponse>>({
        queryKey: ['reviews', 'global', 'featured', page, size],
        queryFn: () => reviewService.getGlobalFeaturedReviews(page, size),
        staleTime: 10 * 60 * 1000, // 10 minutes
        gcTime: 30 * 60 * 1000,
    });
};

/**
 * Hook để lấy recent high-rated reviews từ tất cả sách
 */
export const useGlobalRecentReviews = (page: number = 0, size: number = 10) => {
    return useQuery<PageResponse<ReviewResponse>>({
        queryKey: ['reviews', 'global', 'recent', page, size],
        queryFn: () => reviewService.getGlobalRecentReviews(page, size),
        staleTime: 5 * 60 * 1000, // 5 minutes
        gcTime: 15 * 60 * 1000,
    });
};

/**
 * Hook kết hợp để lấy testimonials
 * Ưu tiên featured reviews, fallback sang top helpful nếu không có
 */
export const useTestimonials = (size: number = 3) => {
    // Lấy featured reviews
    const { 
        data: featuredData, 
        isLoading: featuredLoading,
        error: featuredError 
    } = useGlobalFeaturedReviews(0, size);

    // Lấy top helpful reviews làm fallback
    const { 
        data: helpfulData, 
        isLoading: helpfulLoading,
        error: helpfulError 
    } = useGlobalTopHelpfulReviews(0, size);

    // Quyết định dùng data nào
    const testimonials = featuredData?.content && featuredData.content.length > 0
        ? featuredData.content
        : helpfulData?.content || [];

    const loading = featuredLoading || helpfulLoading;
    const error = featuredError || helpfulError;

    return {
        testimonials,
        loading,
        error: error ? (error as Error).message : null,
        hasFeatured: (featuredData?.content?.length || 0) > 0,
    };
};