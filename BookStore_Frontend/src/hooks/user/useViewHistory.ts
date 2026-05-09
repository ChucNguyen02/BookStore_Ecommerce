import { useState, useEffect, useCallback } from 'react';
import { viewHistoryService, authService } from '../../services';
import type { ViewHistoryResponse } from '../../types';
import type { PageResponse } from '../../types';
import toast from 'react-hot-toast';
import { useAppContext } from '../../context/AppContext';

export const useViewHistory = () => {
    const { language } = useAppContext();
    const [history, setHistory] = useState<ViewHistoryResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [updating, setUpdating] = useState(false);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);

    const fetchHistory = useCallback(async (page: number = 0, size: number = 20) => {
        if (!authService.isAuthenticated()) {
            setLoading(false);
            setHistory([]);
            return;
        }

        try {
            setLoading(true);
            setError(null);
            const response: PageResponse<ViewHistoryResponse> = await viewHistoryService.getViewHistory(page, size);
            setHistory(response.content);
            setCurrentPage(response.pageNumber);
            setTotalPages(response.totalPages);
            setTotalElements(response.totalElements);
        } catch (err: unknown) {
            console.error('View history fetch error:', err);
            setError(err instanceof Error ? err.message : (language === 'vi' ? 'Không thể tải lịch sử' : 'Cannot load history'));
            setHistory([]);
        } finally {
            setLoading(false);
        }
    }, [language]);

    useEffect(() => {
        fetchHistory();

        const handleUserUpdated = (event: unknown) => {
            if (event !== null) {
                fetchHistory();
            } else {
                setHistory([]);
                setLoading(false);
            }
        };

        window.addEventListener('userUpdated', handleUserUpdated);

        return () => {
            window.removeEventListener('userUpdated', handleUserUpdated);
        };
    }, [fetchHistory]);

    const recordView = useCallback(async (bookId: string): Promise<number | undefined> => {
        try {
            
            return await viewHistoryService.recordView(bookId);
        } catch (err) {
            console.error('Failed to record view:', err);
            return undefined;
        }
    }, []);

    const clearHistory = async (): Promise<boolean> => {
        try {
            setUpdating(true);
            await viewHistoryService.clearViewHistory();
            setHistory([]);
            setTotalElements(0);
            toast.success(language === 'vi' ? 'Đã xóa lịch sử xem' : 'View history cleared');
            return true;
        } catch (err: unknown) {
            console.error('Clear history error:', err);
            toast.error(err instanceof Error ? err.message : (language === 'vi' ? 'Không thể xóa lịch sử' : 'Cannot clear history'));
            return false;
        } finally {
            setUpdating(false);
        }
    };

    const loadMore = (page: number) => {
        fetchHistory(page, 20);
    };

    return {
        history,
        loading,
        error,
        updating,
        totalElements,
        totalPages,
        currentPage,
        recordView,
        clearHistory,
        loadMore,
        refresh: fetchHistory,
    };
};