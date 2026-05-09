import { useState, useEffect } from 'react';
import { statisticsService } from '../../services/statistics.service';
import type { StatisticsResponse } from '../../types/statistics.types';

export const useAdminStats = () => {
    const [stats, setStats] = useState<StatisticsResponse | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                setIsLoading(true);
                const data = await statisticsService.getStatistics();
                setStats(data);
                setError(null);
            } catch (err: any) {
                setError(err.message || 'Failed to fetch statistics');
                console.error('Error fetching admin stats:', err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchStats();
    }, []);

    return { stats, isLoading, error };
};