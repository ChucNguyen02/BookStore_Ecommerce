import apiClient from './api.client';
import { type PageResponse } from '../types';
import { type UserPoints } from '../types';

class AdminUserPointsService {
    private readonly BASE_URL = '/admin/user-points';

    /**
     * Top người dùng theo số điểm hiện tại (currentPoints)
     */
    async getTopUsersByPoints(
        page: number = 0,
        size: number = 20
    ): Promise<PageResponse<UserPoints>> {
        const response = await apiClient.get<PageResponse<UserPoints>>(
            `${this.BASE_URL}/top-by-points`,
            { params: { page, size } }
        );
        return response.result!;
    }

    /**
     * Top người dùng theo tổng điểm tích lũy suốt đời (lifetimePoints)
     */
    async getTopUsersByLifetimePoints(
        page: number = 0,
        size: number = 20
    ): Promise<PageResponse<UserPoints>> {
        const response = await apiClient.get<PageResponse<UserPoints>>(
            `${this.BASE_URL}/top-by-lifetime`,
            { params: { page, size } }
        );
        return response.result!;
    }

    /**
     * Phân bố số lượng người dùng theo từng tier (BRONZE, SILVER, GOLD, ...)
     * Trả về: { "BRONZE": 123, "SILVER": 85, "GOLD": 42, ... }
     */
    async getUserCountByTier(): Promise<Record<string, number>> {
        const response = await apiClient.get<Record<string, number>>(
            `${this.BASE_URL}/tier-distribution`
        );
        return response.result!;
    }

    /**
     * Tổng điểm hiện tại của toàn bộ người dùng trong hệ thống
     */
    async getTotalPoints(): Promise<number> {
        const response = await apiClient.get<number>(
            `${this.BASE_URL}/total-points`
        );
        return response.result!;
    }
}

export const adminUserPointsService = new AdminUserPointsService();
export default adminUserPointsService;