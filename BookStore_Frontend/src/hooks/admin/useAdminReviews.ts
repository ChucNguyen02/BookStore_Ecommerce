import { useState, useEffect, useCallback } from 'react';
import { reviewService } from '../../services';
import { toast } from 'react-hot-toast';
import { 
    type ReviewResponse, 
    type PageResponse,
    type ReviewFilterRequest,
    type ReplyReviewRequest
} from '../../types';

export function useAdminReviews() {
    const [reviews, setReviews] = useState<PageResponse<ReviewResponse> | null>(null);
    const [pendingReviews, setPendingReviews] = useState<PageResponse<ReviewResponse> | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchPendingReviews = useCallback(async (page = 0, size = 20) => {
        try {
            setIsLoading(true);
            setError(null);
            const data = await reviewService.getPendingReviews(page, size);
            setPendingReviews(data);
        } catch (err: any) {
            const message = err.message || 'Failed to load pending reviews';
            setError(message);
            toast.error(message);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const fetchBookReviews = useCallback(async (
        bookId: string,
        filter?: ReviewFilterRequest
    ) => {
        try {
            setIsLoading(true);
            setError(null);
            const data = await reviewService.getBookReviews(bookId, filter);
            setReviews(data);
        } catch (err: any) {
            const message = err.message || 'Failed to load reviews';
            setError(message);
            toast.error(message);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const deleteReview = useCallback(async (reviewId: string) => {
        try {
            await reviewService.deleteReview(reviewId);
            toast.success('Review deleted successfully');
            return true;
        } catch (err: any) {
            const message = err.message || 'Failed to delete review';
            toast.error(message);
            return false;
        }
    }, []);

    const replyToReview = useCallback(async (
        reviewId: string,
        data: ReplyReviewRequest
    ) => {
        try {
            await reviewService.replyToReview(reviewId, data);
            toast.success('Reply posted successfully');
            return true;
        } catch (err: any) {
            const message = err.message || 'Failed to post reply';
            toast.error(message);
            return false;
        }
    }, []);

    const getTopHelpfulReviews = useCallback(async (
        bookId: string,
        page = 0,
        size = 20
    ) => {
        try {
            const data = await reviewService.getTopHelpfulReviews(bookId, page, size);
            return data;
        } catch (err: any) {
            toast.error(err.message || 'Failed to fetch top reviews');
            return null;
        }
    }, []);

    const getReviewReplies = useCallback(async (reviewId: string) => {
        try {
            return await reviewService.getReviewReplies(reviewId);
        } catch (err: any) {
            toast.error(err.message || 'Failed to fetch replies');
            return [];
        }
    }, []);

    const hasSellerReply = useCallback(async (reviewId: string) => {
        try {
            return await reviewService.hasSellerReply(reviewId);
        } catch (err: any) {
            return false;
        }
    }, []);

    useEffect(() => {
        fetchPendingReviews();
    }, [fetchPendingReviews]);

    return {
        reviews,
        pendingReviews,
        isLoading,
        error,
        fetchPendingReviews,
        fetchBookReviews,
        deleteReview,
        replyToReview,
        getTopHelpfulReviews,
        getReviewReplies,
        hasSellerReply,
        refetch: fetchPendingReviews
    };
}