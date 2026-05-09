import apiClient from './api.client';
import { type PageResponse } from '../types';
import { type WishlistResponse } from '../types';
import { type UserProfileResponse } from '../types';
import { eventEmitter, EVENTS } from '../utils/eventEmitter';

class WishlistService {
    private readonly BASE_URL = '/wishlist';

    async getUserWishlist(
        page: number = 0,
        size: number = 20
    ): Promise<PageResponse<WishlistResponse>> {
        const response = await apiClient.get<PageResponse<WishlistResponse>>(
            this.BASE_URL,
            { params: { page, size } }
        );
        return response.result!;
    }

    async addToWishlist(bookId: string): Promise<WishlistResponse> {
        const response = await apiClient.post<WishlistResponse>(
            `${this.BASE_URL}/${bookId}`
        );

        // Emit event để notify Header
        eventEmitter.emit(EVENTS.WISHLIST_UPDATED);

        return response.result!;
    }

    async removeFromWishlist(bookId: string): Promise<void> {
        await apiClient.delete<void>(`${this.BASE_URL}/${bookId}`);

        // Emit event
        eventEmitter.emit(EVENTS.WISHLIST_UPDATED);
    }

    async isInWishlist(bookId: string): Promise<boolean> {
        const response = await apiClient.get<boolean>(
            `${this.BASE_URL}/check/${bookId}`
        );
        return response.result!;
    }

    async getWishlistItem(bookId: string): Promise<WishlistResponse> {
        const response = await apiClient.get<WishlistResponse>(
            `${this.BASE_URL}/item/${bookId}`
        );
        return response.result!;
    }

    async countWishlistItems(): Promise<number> {
        const response = await apiClient.get<number>(
            `${this.BASE_URL}/count`
        );
        return response.result!;
    }

    async clearWishlist(): Promise<void> {
        await apiClient.delete<void>(`${this.BASE_URL}/clear`);

        // Emit event
        eventEmitter.emit(EVENTS.WISHLIST_UPDATED);
    }

    async getUsersWhoWishlistedBook(bookId: string): Promise<UserProfileResponse[]> {
        const response = await apiClient.get<UserProfileResponse[]>(
            `/admin/wishlist/book/${bookId}/users`
        );
        return response.result!;
    }
}

export const wishlistService = new WishlistService();
export default wishlistService;