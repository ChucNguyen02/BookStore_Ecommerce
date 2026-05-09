import apiClient from './api.client';
import { type PageResponse } from '../types';
import { type OrderStatus } from '../types';

import {
    type OrderResponse,
    type CreateOrderRequest,
    type CancelOrderRequest,
    type UpdateOrderStatusRequest,
} from '../types/order.types';
import { type OrderDetailResponse } from '../types/order_detail.types';

class OrderService {
    private readonly BASE_URL = '/orders';

    async createOrder(data: CreateOrderRequest): Promise<OrderDetailResponse> {
        const response = await apiClient.post<OrderDetailResponse>(this.BASE_URL, data);
        return response.result!;
    }

    async getUserOrders(
        page: number = 0,
        size: number = 20
    ): Promise<PageResponse<OrderResponse>> {
        const response = await apiClient.get<PageResponse<OrderResponse>>(
            this.BASE_URL,
            { params: { page, size } }
        );
        return response.result!;
    }

    async getOrderDetail(orderCode: string): Promise<OrderDetailResponse> {
        const response = await apiClient.get<OrderDetailResponse>(
            `${this.BASE_URL}/${orderCode}`
        );
        return response.result!;
    }

    async cancelOrder(orderCode: string, data: CancelOrderRequest): Promise<void> {
        await apiClient.post<void>(`${this.BASE_URL}/${orderCode}/cancel`, data);
    }

    async getUserOrdersByStatus(
        status: OrderStatus,
        page: number = 0,
        size: number = 20
    ): Promise<PageResponse<OrderResponse>> {
        const response = await apiClient.get<PageResponse<OrderResponse>>(
            `${this.BASE_URL}/status/${status}`,
            { params: { page, size } }
        );
        return response.result!;
    }

    async getUserOrdersWithBook(bookId: string): Promise<OrderResponse[]> {
        const response = await apiClient.get<OrderResponse[]>(
            `${this.BASE_URL}/book/${bookId}`
        );
        return response.result!;
    }

    async updateOrderStatus(
        orderCode: string,
        data: UpdateOrderStatusRequest
    ): Promise<void> {
        await apiClient.patch<void>(`${this.BASE_URL}/${orderCode}/status`, data);
    }

    async getOrdersToAutoComplete(daysAfterDelivery: number = 7): Promise<OrderResponse[]> {
        const response = await apiClient.get<OrderResponse[]>(
            '/admin/orders/auto-complete',
            { params: { daysAfterDelivery } }
        );
        return response.result!;
    }

    async getExpiredPendingOrders(hoursTimeout: number = 24): Promise<OrderResponse[]> {
        const response = await apiClient.get<OrderResponse[]>(
            '/admin/orders/expired-pending',
            { params: { hoursTimeout } }
        );
        return response.result!;
    }

    async getAllOrdersByStatus(
        status: OrderStatus,
        page: number = 0,
        size: number = 20
    ): Promise<PageResponse<OrderResponse>> {
        const response = await apiClient.get<PageResponse<OrderResponse>>(
            `/admin/orders/status/${status}`,
            { params: { page, size } }
        );
        return response.result!;
    }

    async getOrdersBetweenDates(
        startDate: string,
        endDate: string,
        page: number = 0,
        size: number = 20
    ): Promise<PageResponse<OrderResponse>> {
        const response = await apiClient.get<PageResponse<OrderResponse>>(
            '/admin/orders/date-range',
            { params: { startDate, endDate, page, size } }
        );
        return response.result!;
    }

    async getOrderByCode(orderCode: string): Promise<OrderDetailResponse> {
        const response = await apiClient.get<OrderDetailResponse>(
            `${this.BASE_URL}/public/${orderCode}`
        );
        return response.result!;
    }

    async hasUserPurchasedBook(bookId: string): Promise<boolean> {
        try {
            const orders = await this.getUserOrdersWithBook(bookId);
            return orders.length > 0;
        } catch (error) {
            console.error('Error checking purchase status:', error);
            return false;
        }
    }
}

export const orderService = new OrderService();
export default orderService;