import { useState, useEffect } from 'react';
import { pointsService } from '../../services';
import { useAppContext } from '../../context/AppContext';
import type { PointTransactionResponse } from '../../types';
import type { TransactionType } from '../../types';

export const usePointsHistory = (filterType?: TransactionType) => {
    const { language } = useAppContext();
    const [transactions, setTransactions] = useState<PointTransactionResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);

    const fetchHistory = async (page: number) => {
        try {
            setLoading(true);
            setError(null);

            const response = filterType
                ? await pointsService.getPointHistoryByType(filterType, page, 20)
                : await pointsService.getPointHistory(page, 20);

            setTransactions(response.content);
            setTotalPages(response.totalPages);
            setTotalElements(response.totalElements);
            setCurrentPage(page);
        } catch (err: unknown) {
            const errorMsg = err instanceof Error ? err.message : (language === 'vi' ? 'Không thể tải lịch sử' : 'Failed to load history');
            setError(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchHistory(0);
    }, [filterType]);

    const setPage = (page: number) => {
        if (page >= 0 && page < totalPages) {
            fetchHistory(page);
        }
    };

    return {
        transactions,
        loading,
        error,
        currentPage,
        totalPages,
        totalElements,
        setPage,
        refetch: () => fetchHistory(currentPage),
    };
};