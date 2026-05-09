import { useState, useCallback } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { rewardService } from '../../services';
import { authService } from '../../services';
import { useAppContext } from '../../context/AppContext';
import toast from 'react-hot-toast';
import type {
    RewardItemResponse,
    UserRewardResponse,
    PageResponse,
    RedeemRewardRequest
} from '../../types';

export const useRewards = () => {
    const { language } = useAppContext();
    const [redeeming, setRedeeming] = useState(false);
    const [historyPage, setHistoryPage] = useState(0);

    const isAuthenticated = authService.isAuthenticated();

    const queryClient = useQueryClient();

    // Load rewards - KHÔNG CẦN LOGIN
    const { data: rewards = [], isLoading: loadingRewards, error: rewardsQueryError, refetch: refreshRewards } = useQuery<RewardItemResponse[]>({
        queryKey: ['rewards', 'available'],
        queryFn: () => rewardService.getAvailableRewards(),
        staleTime: 5 * 60 * 1000,
    });

    // Load redemption history - CẦN LOGIN
    const { data: historyData, isLoading: loadingHistory, error: historyQueryError } = useQuery<PageResponse<UserRewardResponse>>({
        queryKey: ['rewards', 'history', historyPage],
        queryFn: () => rewardService.getRedemptionHistory(historyPage, 10),
        enabled: isAuthenticated,
        staleTime: 2 * 60 * 1000,
    });

    const redemptionHistory = historyData?.content || [];
    const historyTotalPages = historyData?.totalPages || 0;

    const loading = loadingRewards || loadingHistory;
    const error = rewardsQueryError
        ? (rewardsQueryError as Error).message
        : historyQueryError
            ? (historyQueryError as Error).message
            : null;

    if (rewardsQueryError) {
        console.error('Fetch rewards error:', rewardsQueryError);
    }

    if (historyQueryError) {
        console.error('Fetch redemption history error:', historyQueryError);
    }

    // Redeem reward - CẦN LOGIN
    const redeemReward = useCallback(async (
        rewardId: string,
        shippingAddress?: string,
        note?: string
    ): Promise<boolean> => {
        if (!isAuthenticated) {
            toast.error(language === 'vi' ? 'Vui lòng đăng nhập để đổi quà' : 'Please login to redeem');
            return false;
        }

        try {
            setRedeeming(true);

            const request: RedeemRewardRequest = {
                rewardId,
                shippingAddress,
                note
            };

            await rewardService.redeemReward(request);
            toast.success(language === 'vi' ? 'Đổi quà thành công!' : 'Reward redeemed successfully!');

            await Promise.all([
                queryClient.invalidateQueries({ queryKey: ['rewards', 'available'] }),
                queryClient.invalidateQueries({ queryKey: ['rewards', 'history'] })
            ]);

            return true;
        } catch (err: unknown) {
            const errorMsg = err instanceof Error ? err.message : (language === 'vi' ? 'Đổi quà thất bại' : 'Failed to redeem');
            toast.error(errorMsg);
            return false;
        } finally {
            setRedeeming(false);
        }
    }, [isAuthenticated, language, queryClient]);

    return {
        rewards,
        redemptionHistory,
        loading,
        error,
        redeeming,
        historyPage,
        historyTotalPages,
        isAuthenticated,
        redeemReward,
        setHistoryPage,
        refreshRewards,
    };
};