import apiClient from './api.client';
import { eventEmitter, EVENTS } from '../utils/eventEmitter';

import {
    type CartResponse,
    type CartItemResponse,
    type AddToCartRequest,
    type UpdateCartItemRequest,
} from '../types/cart.types';

class CartService {
    private readonly BASE_URL = '/cart';

    async getCart(): Promise<CartResponse> {
        const response = await apiClient.get<CartResponse>(this.BASE_URL);
        return response.result!;
    }

    async addToCart(data: AddToCartRequest): Promise<CartResponse> {
        const response = await apiClient.post<CartResponse>(this.BASE_URL, data);

        eventEmitter.emit(EVENTS.CART_UPDATED);

        return response.result!;
    }

    async updateCartItem(
        cartItemId: string,
        data: UpdateCartItemRequest
    ): Promise<CartItemResponse> {
        const response = await apiClient.put<CartItemResponse>(
            `${this.BASE_URL}/${cartItemId}`,
            data
        );

        eventEmitter.emit(EVENTS.CART_UPDATED);

        return response.result!;
    }

    async removeFromCart(cartItemId: string): Promise<void> {
        await apiClient.delete<void>(`${this.BASE_URL}/${cartItemId}`);

        eventEmitter.emit(EVENTS.CART_UPDATED);
    }

    async clearCart(): Promise<void> {
        await apiClient.delete<void>(`${this.BASE_URL}/clear`);

        eventEmitter.emit(EVENTS.CART_UPDATED);
    }

    async isBookInCart(bookId: string): Promise<boolean> {
        const response = await apiClient.get<boolean>(
            `${this.BASE_URL}/check/${bookId}`
        );
        return response.result!;
    }

    async countCartItems(): Promise<number> {
        const response = await apiClient.get<number>(`${this.BASE_URL}/count`);
        return response.result!;
    }
}

export const cartService = new CartService();
export default cartService;