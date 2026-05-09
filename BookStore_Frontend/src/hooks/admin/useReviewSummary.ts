import { useState, useEffect, useCallback } from 'react';
import { reviewService } from '../../services';
import { toast } from 'react-hot-toast';
import { type ReviewSummaryResponse } from '../../types';

export function useReviewSummary(bookId: string | null) {
    const [summary, setSummary] = useState<ReviewSummaryResponse | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchSummary = useCallback(async (id: string) => {
        try {
            setIsLoading(true);
            setError(null);
            const data = await reviewService.getReviewSummary(id);
            setSummary(data);
        } catch (err: any) {
            const message = err.message || 'Failed to load review summary';
            setError(message);
            toast.error(message);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        if (bookId) {
            fetchSummary(bookId);
        }
    }, [bookId, fetchSummary]);

    return {
        summary,
        isLoading,
        error,
        refetch: () => bookId && fetchSummary(bookId)
    };
}