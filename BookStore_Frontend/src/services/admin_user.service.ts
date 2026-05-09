import apiClient from './api.client';
import { type PageResponse } from '../types';
import { type User } from '../types';
import { type Role } from '../types';

class AdminUserService {
    private readonly BASE_URL = '/admin/users';

    /**
     * Tìm kiếm người dùng theo từ khóa (email, tên, ...) với phân trang
     */
    async searchUsers(
        keyword: string,
        page: number = 0,
        size: number = 20
    ): Promise<PageResponse<User>> {
        const response = await apiClient.get<PageResponse<User>>(
            `${this.BASE_URL}/search`,
            { params: { keyword, page, size } }
        );
        return response.result!;
    }

    /**
     * Đếm số người dùng mới trong khoảng thời gian
     */
    async countNewUsers(startDate: string, endDate: string): Promise<number> {
        const response = await apiClient.get<number>(
            `${this.BASE_URL}/new-users-count`,
            { params: { startDate, endDate } }
        );
        return response.result!;
    }

    /**
     * Lấy danh sách người dùng đang active
     */
    async getActiveUsers(): Promise<User[]> {
        const response = await apiClient.get<User[]>(
            `${this.BASE_URL}/active`
        );
        return response.result!;
    }

    /**
     * Lấy danh sách người dùng theo vai trò (role)
     */
    async getUsersByRole(role: Role): Promise<User[]> {
        const response = await apiClient.get<User[]>(
            `${this.BASE_URL}/role/${role}`
        );
        return response.result!;
    }

    /**
     * Đếm số người dùng theo vai trò (role)
     */
    async countUsersByRole(role: Role): Promise<number> {
        const response = await apiClient.get<number>(
            `${this.BASE_URL}/role/${role}/count`
        );
        return response.result!;
    }
}

export const adminUserService = new AdminUserService();
export default adminUserService;