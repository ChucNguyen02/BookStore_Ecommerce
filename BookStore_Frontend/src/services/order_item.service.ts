import apiClient from './api.client';
import { type PageResponse } from '../types';
import { type BookResponse } from '../types';

class OrderItemService {
    private readonly BASE_URL = '/admin/order-items';

    async getBestSellingBooks(
        page: number = 0,
        size: number = 20
    ): Promise<PageResponse<BookResponse>> {
        const response = await apiClient.get<PageResponse<BookResponse>>(
            `${this.BASE_URL}/best-selling`,
            { params: { page, size } }
        );
        return response.result!;
    }

    async getBookRevenue(bookId: string): Promise<number> {
        const response = await apiClient.get<number>(
            `${this.BASE_URL}/book/${bookId}/revenue`
        );
        return response.result!;
    }

    async getBookQuantitySold(bookId: string): Promise<number> {
        const response = await apiClient.get<number>(
            `${this.BASE_URL}/book/${bookId}/quantity-sold`
        );
        return response.result!;
    }
}

export const orderItemService = new OrderItemService();
export default orderItemService;