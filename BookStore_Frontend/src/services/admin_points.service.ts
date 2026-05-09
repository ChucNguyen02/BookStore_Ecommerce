import apiClient from './api.client';
import { type PageResponse } from '../types';
import { type UserPoints } from '../types';
import { type Tier } from '../types';

class AdminPointsService {
    private readonly BASE_URL = '/admin/points';

    /**
     * Lấy danh sách người dùng có số ngày check-in liên tục cao nhất (phân trang)
     */
    async getTopCheckInUsers(
        page: number = 0,
        size: number = 20
    ): Promise<PageResponse<UserPoints>> {
        const response = await apiClient.get<PageResponse<UserPoints>>(
            `${this.BASE_URL}/top-users`,
            { params: { page, size } }
        );
        return response.result!;
    }

    /**
     * Lấy danh sách người dùng theo tier
     */
    async getUsersByTier(tier: Tier): Promise<UserPoints[]> {
        const response = await apiClient.get<UserPoints[]>(
            `${this.BASE_URL}/tier/${tier}`
        );
        return response.result!;
    }

    /**
     * Kiểm tra xem user có đủ points hay không (dùng cho admin thao tác thủ công)
     */
    async userHasEnoughPoints(userId: string, points: number): Promise<boolean> {
        const response = await apiClient.get<boolean>(
            `${this.BASE_URL}/user/${userId}/check-points`,
            { params: { points } }
        );
        return response.result!;
    }
}

export const adminPointsService = new AdminPointsService();
export default adminPointsService;