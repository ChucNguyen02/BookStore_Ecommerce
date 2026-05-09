import { useQuery } from '@tanstack/react-query';
import { userStatisticsService } from '../../services';

import toast from 'react-hot-toast';
import { useAppContext } from '../../context/AppContext';

export const useUserStatistics = (period: number | null = null) => {
    const { language } = useAppContext();
    const { data: statistics = null, isLoading: loading, error: queryError, refetch } = useQuery({
        queryKey: ['userStatistics', period],
        queryFn: async () => {
            if (period) {
                return await userStatisticsService.getStatisticsByPeriod(period);
            } else {
                return await userStatisticsService.getUserStatistics();
            }
        },
        staleTime: 5 * 60 * 1000,
    });

    const error = queryError ? (queryError as Error).message : null;

    if (queryError) {
        const errorMsg = (queryError as Error).message || (language === 'vi'
            ? 'Không thể tải thống kê'
            : 'Failed to load statistics');
        toast.error(errorMsg);
    }

    return {
        statistics,
        loading,
        error,
        refetch,
    };
};