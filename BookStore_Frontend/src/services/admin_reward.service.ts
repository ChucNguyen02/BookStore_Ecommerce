import apiClient from './api.client';
import { type PageResponse } from '../types';
import {
    type RewardItemRequest,
    type RewardItemResponse,
    type UserRewardResponse,
} from '../types/reward.types';
import { type RedemptionStatus } from '../types/enum';
import {
    type UpdateRedemptionStatusRequest,
    type RewardStatistics,
} from '../types/admin.types';

class AdminRewardService {
    private readonly BASE_URL = '/admin/rewards';

    /**
     * Tạo phần thưởng mới
     */
    async createReward(data: RewardItemRequest): Promise<RewardItemResponse> {
        const response = await apiClient.post<RewardItemResponse>(this.BASE_URL, data);
        return response.result!;
    }

    /**
     * Cập nhật thông tin phần thưởng
     */
    async updateReward(
        rewardId: string,
        data: RewardItemRequest
    ): Promise<RewardItemResponse> {
        const response = await apiClient.put<RewardItemResponse>(
            `${this.BASE_URL}/${rewardId}`,
            data
        );
        return response.result!;
    }

    /**
     * Xóa phần thưởng
     */
    async deleteReward(rewardId: string): Promise<void> {
        await apiClient.delete<void>(`${this.BASE_URL}/${rewardId}`);
    }

    /**
     * Lấy danh sách tất cả phần thưởng (phân trang)
     */
    async getAllRewards(
        page: number = 0,
        size: number = 20
    ): Promise<PageResponse<RewardItemResponse>> {
        const response = await apiClient.get<PageResponse<RewardItemResponse>>(
            this.BASE_URL,
            { params: { page, size } }
        );
        return response.result!;
    }

    /**
     * Lấy thông tin chi tiết một phần thưởng
     */
    async getRewardById(rewardId: string): Promise<RewardItemResponse> {
        const response = await apiClient.get<RewardItemResponse>(
            `${this.BASE_URL}/${rewardId}`
        );
        return response.result!;
    }

    /**
     * Bật/tắt trạng thái hoạt động của phần thưởng
     */
    async toggleRewardActive(rewardId: string): Promise<RewardItemResponse> {
        const response = await apiClient.patch<RewardItemResponse>(
            `${this.BASE_URL}/${rewardId}/toggle-active`
        );
        return response.result!;
    }

    /**
     * Cập nhật số lượng tồn kho của phần thưởng
     */
    async updateStock(rewardId: string, quantity: number): Promise<RewardItemResponse> {
        const response = await apiClient.patch<RewardItemResponse>(
            `${this.BASE_URL}/${rewardId}/stock`,
            undefined,
            { params: { quantity } }
        );
        return response.result!;
    }

    // ==================== Redemption Management ====================

    /**
     * Lấy danh sách tất cả các lượt đổi thưởng (phân trang)
     */
    async getAllRedemptions(
        page: number = 0,
        size: number = 20
    ): Promise<PageResponse<UserRewardResponse>> {
        const response = await apiClient.get<PageResponse<UserRewardResponse>>(
            `${this.BASE_URL}/redemptions`,
            { params: { page, size } }
        );
        return response.result!;
    }

    /**
     * Lấy danh sách lượt đổi thưởng theo trạng thái
     */
    async getRedemptionsByStatus(
        status: RedemptionStatus
    ): Promise<UserRewardResponse[]> {
        const response = await apiClient.get<UserRewardResponse[]>(
            `${this.BASE_URL}/redemptions/status/${status}`
        );
        return response.result!;
    }

    /**
     * Cập nhật trạng thái duyệt đổi thưởng (APPROVED / REJECTED / etc.)
     */
    async updateRedemptionStatus(
        redemptionId: string,
        data: UpdateRedemptionStatusRequest
    ): Promise<UserRewardResponse> {
        const response = await apiClient.patch<UserRewardResponse>(
            `${this.BASE_URL}/redemptions/${redemptionId}/status`,
            data
        );
        return response.result!;
    }

    /**
     * Lấy thống kê tổng quan về hệ thống phần thưởng
     */
    async getRewardStatistics(): Promise<RewardStatistics> {
        const response = await apiClient.get<RewardStatistics>(
            `${this.BASE_URL}/statistics`
        );
        return response.result!;
    }
}

export const adminRewardService = new AdminRewardService();
export default adminRewardService;