import apiClient from './api.client';
import { type UserProfileResponse } from '../types';

class AdminWishlistService {
    private readonly BASE_URL = '/admin/wishlist';

    /**
     * Lấy danh sách người dùng đã thêm sách vào wishlist
     */
    async getUsersWhoWishlistedBook(bookId: string): Promise<UserProfileResponse[]> {
        const response = await apiClient.get<UserProfileResponse[]>(
            `${this.BASE_URL}/book/${bookId}/users`
        );
        return response.result!;
    }
}

export const adminWishlistService = new AdminWishlistService();
export default adminWishlistService;