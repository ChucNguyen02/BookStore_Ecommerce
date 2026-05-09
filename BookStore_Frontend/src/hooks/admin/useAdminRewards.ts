import { useState, useEffect, useCallback } from 'react';
import { adminRewardService } from '../../services';
import { type RewardItemResponse, type UserRewardResponse } from '../../types/reward.types';
import { type RewardStatistics } from '../../types/admin.types';
import { type PageResponse } from '../../types/base.types';
import toast from 'react-hot-toast';

export const useAdminRewards = () => {
    const [rewards, setRewards] = useState<RewardItemResponse[]>([]);
    const [redemptions, setRedemptions] = useState<UserRewardResponse[]>([]);
    const [statistics, setStatistics] = useState<RewardStatistics | null>(null);
    const [rewardsPagination, setRewardsPagination] = useState<PageResponse<RewardItemResponse> | null>(null);
    const [redemptionsPagination, setRedemptionsPagination] = useState<PageResponse<UserRewardResponse> | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [currentRewardsPage, setCurrentRewardsPage] = useState(0);
    const [currentRedemptionsPage, setCurrentRedemptionsPage] = useState(0);

    const fetchData = useCallback(async () => {
        try {
            setIsLoading(true);
            setError(null);

            const [rewardsData, redemptionsData, statsData] = await Promise.all([
                adminRewardService.getAllRewards(currentRewardsPage, 20),
                adminRewardService.getAllRedemptions(currentRedemptionsPage, 20),
                adminRewardService.getRewardStatistics(),
            ]);

            setRewards(rewardsData.content);
            setRewardsPagination(rewardsData);
            setRedemptions(redemptionsData.content);
            setRedemptionsPagination(redemptionsData);
            setStatistics(statsData);
        } catch (err: any) {
            setError(err.message || 'Failed to fetch rewards data');
            toast.error(err.message || 'Failed to fetch rewards data');
        } finally {
            setIsLoading(false);
        }
    }, [currentRewardsPage, currentRedemptionsPage]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleRewardsPageChange = (page: number) => {
        setCurrentRewardsPage(page);
    };

    const handleRedemptionsPageChange = (page: number) => {
        setCurrentRedemptionsPage(page);
    };

    const handleToggleActive = async (rewardId: string) => {
        try {
            await adminRewardService.toggleRewardActive(rewardId);
            toast.success('Reward status updated successfully');
            await fetchData();
        } catch (err: any) {
            toast.error(err.message || 'Failed to update reward status');
        }
    };

    const handleDeleteReward = async (rewardId: string) => {
        try {
            await adminRewardService.deleteReward(rewardId);
            toast.success('Reward deleted successfully');
            await fetchData();
        } catch (err: any) {
            toast.error(err.message || 'Failed to delete reward');
        }
    };

    const handleUpdateStock = async (rewardId: string, quantity: number) => {
        try {
            await adminRewardService.updateStock(rewardId, quantity);
            toast.success('Stock updated successfully');
            await fetchData();
        } catch (err: any) {
            toast.error(err.message || 'Failed to update stock');
        }
    };

    const refetch = () => {
        fetchData();
    };

    return {
        rewards,
        redemptions,
        statistics,
        rewardsPagination,
        redemptionsPagination,
        isLoading,
        error,
        currentRewardsPage,
        currentRedemptionsPage,
        handleRewardsPageChange,
        handleRedemptionsPageChange,
        handleToggleActive,
        handleDeleteReward,
        handleUpdateStock,
        refetch,
    };
};