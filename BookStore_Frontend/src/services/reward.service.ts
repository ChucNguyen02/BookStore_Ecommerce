import apiClient from './api.client';
import { type PageResponse } from '../types';
import { type RewardType, type RedemptionStatus } from '../types';
import {
    type RewardItemResponse,
    type UserRewardResponse,
    type RedeemRewardRequest,
} from '../types/reward.types';

class RewardService {
    private readonly BASE_URL = '/rewards';

    async getAvailableRewards(): Promise<RewardItemResponse[]> {
        const response = await apiClient.get<RewardItemResponse[]>(this.BASE_URL);
        return response.result!;
    }

    async getRewardDetail(rewardId: string): Promise<RewardItemResponse> {
        const response = await apiClient.get<RewardItemResponse>(
            `${this.BASE_URL}/${rewardId}`
        );
        return response.result!;
    }

    async redeemReward(data: RedeemRewardRequest): Promise<UserRewardResponse> {
        const response = await apiClient.post<UserRewardResponse>(
            `${this.BASE_URL}/redeem`,
            data
        );
        return response.result!;
    }

    async getRedemptionHistory(
        page: number = 0,
        size: number = 20
    ): Promise<PageResponse<UserRewardResponse>> {
        const response = await apiClient.get<PageResponse<UserRewardResponse>>(
            `${this.BASE_URL}/history`,
            { params: { page, size } }
        );
        return response.result!;
    }

    async getRedemptionDetail(redemptionId: string): Promise<UserRewardResponse> {
        const response = await apiClient.get<UserRewardResponse>(
            `${this.BASE_URL}/history/${redemptionId}`
        );
        return response.result!;
    }

    async getRewardsByType(type: RewardType): Promise<RewardItemResponse[]> {
        const response = await apiClient.get<RewardItemResponse[]>(
            `${this.BASE_URL}/type/${type}`
        );
        return response.result!;
    }

    async getAffordableRewards(): Promise<RewardItemResponse[]> {
        const response = await apiClient.get<RewardItemResponse[]>(
            `${this.BASE_URL}/affordable`
        );
        return response.result!;
    }

    async getRewardsInStock(): Promise<RewardItemResponse[]> {
        const response = await apiClient.get<RewardItemResponse[]>(
            `${this.BASE_URL}/in-stock`
        );
        return response.result!;
    }

    async getRewardsByPointsRange(
        minPoints: number,
        maxPoints: number
    ): Promise<RewardItemResponse[]> {
        const response = await apiClient.get<RewardItemResponse[]>(
            `${this.BASE_URL}/points-range`,
            { params: { minPoints, maxPoints } }
        );
        return response.result!;
    }

    async getTopClaimedRewards(
        page: number = 0,
        size: number = 20
    ): Promise<PageResponse<RewardItemResponse>> {
        const response = await apiClient.get<PageResponse<RewardItemResponse>>(
            `${this.BASE_URL}/top-claimed`,
            { params: { page, size } }
        );
        return response.result!;
    }

    async checkRewardStock(rewardId: string): Promise<boolean> {
        const response = await apiClient.get<boolean>(
            `${this.BASE_URL}/${rewardId}/check-stock`
        );
        return response.result!;
    }

    async getRedemptionsByStatus(
        status: RedemptionStatus,
        page: number = 0,
        size: number = 20
    ): Promise<PageResponse<UserRewardResponse>> {
        const response = await apiClient.get<PageResponse<UserRewardResponse>>(
            `${this.BASE_URL}/history/status/${status}`,
            { params: { page, size } }
        );
        return response.result!;
    }

    async countRewardRedemptions(rewardId: string): Promise<number> {
        const response = await apiClient.get<number>(
            `${this.BASE_URL}/${rewardId}/redemption-count`
        );
        return response.result!;
    }

    async countUserRedemptions(): Promise<number> {
        const response = await apiClient.get<number>(
            `${this.BASE_URL}/my-redemptions/count`
        );
        return response.result!;
    }

    async getTotalPointsSpent(): Promise<number> {
        const response = await apiClient.get<number>(
            `${this.BASE_URL}/total-spent`
        );
        return response.result!;
    }

    async hasRedeemedReward(rewardId: string): Promise<boolean> {
        const response = await apiClient.get<boolean>(
            `${this.BASE_URL}/${rewardId}/has-redeemed`
        );
        return response.result!;
    }

    async getUserVouchers(): Promise<UserRewardResponse[]> {
        const response = await apiClient.get<UserRewardResponse[]>(
            `${this.BASE_URL}/vouchers`
        );
        return response.result!;
    }
}

export const rewardService = new RewardService();
export default rewardService;