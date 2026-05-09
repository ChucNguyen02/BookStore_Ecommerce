import apiClient from './api.client';
import { type PageResponse } from '../types/base.types';
import { type OrderResponse } from '../types/order.types';
import { type Order } from '../types/order.types';
import { type OrderStatus, type PaymentMethod } from '../types/enum';

class AdminOrderService {
    private readonly BASE_URL = '/admin/orders';

    async getAllOrders(
        page: number = 0,
        size: number = 20
    ): Promise<PageResponse<OrderResponse>> {
        const response = await apiClient.get<PageResponse<OrderResponse>>(
            this.BASE_URL,
            { params: { page, size } }
        );
        return response.result!;
    }

    async searchOrders(
        keyword: string,
        page: number = 0,
        size: number = 20
    ): Promise<PageResponse<OrderResponse>> {
        const response = await apiClient.get<PageResponse<OrderResponse>>(
            `${this.BASE_URL}/search`,
            { params: { keyword, page, size } }
        );
        return response.result!;
    }

    async getOrdersByCustomer(
        customerId: string,
        page: number = 0,
        size: number = 20
    ): Promise<PageResponse<OrderResponse>> {
        const response = await apiClient.get<PageResponse<OrderResponse>>(
            `${this.BASE_URL}/customer/${customerId}`,
            { params: { page, size } }
        );
        return response.result!;
    }

    async getOrdersByPhone(
        phone: string,
        page: number = 0,
        size: number = 20
    ): Promise<PageResponse<OrderResponse>> {
        const response = await apiClient.get<PageResponse<OrderResponse>>(
            `${this.BASE_URL}/phone/${phone}`,
            { params: { page, size } }
        );
        return response.result!;
    }

    async getOrdersByEmail(
        email: string,
        page: number = 0,
        size: number = 20
    ): Promise<PageResponse<OrderResponse>> {
        const response = await apiClient.get<PageResponse<OrderResponse>>(
            `${this.BASE_URL}/email/${email}`,
            { params: { page, size } }
        );
        return response.result!;
    }

    async getOrdersByPaymentMethod(
        paymentMethod: PaymentMethod,
        page: number = 0,
        size: number = 20
    ): Promise<PageResponse<OrderResponse>> {
        const response = await apiClient.get<PageResponse<OrderResponse>>(
            `${this.BASE_URL}/payment-method/${paymentMethod}`,
            { params: { page, size } }
        );
        return response.result!;
    }

    async getOrdersToAutoComplete(daysAfterDelivery: number = 7): Promise<Order[]> {
        const response = await apiClient.get<Order[]>(
            `${this.BASE_URL}/auto-complete`,
            { params: { daysAfterDelivery } }
        );
        return response.result!;
    }

    async getExpiredPendingOrders(hoursTimeout: number = 24): Promise<Order[]> {
        const response = await apiClient.get<Order[]>(
            `${this.BASE_URL}/expired-pending`,
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
            `${this.BASE_URL}/status/${status}`,
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
            `${this.BASE_URL}/date-range`,
            { params: { startDate, endDate, page, size } }
        );
        return response.result!;
    }

    async addOrderNote(orderCode: string, note: string): Promise<void> {
        await apiClient.post(
            `${this.BASE_URL}/${orderCode}/note`,
            { note }
        );
    }

    async updateTrackingNumber(orderCode: string, trackingNumber: string): Promise<void> {
        await apiClient.patch(
            `${this.BASE_URL}/${orderCode}/tracking`,
            { trackingNumber }
        );
    }

    async getOrderStatistics(): Promise<{
        totalOrders: number;
        pendingOrders: number;
        processingOrders: number;
        deliveredOrders: number;
        cancelledOrders: number;
        totalRevenue: number;
    }> {
        const response = await apiClient.get<any>(
            `${this.BASE_URL}/statistics`
        );
        return response.result!;
    }
}

export const adminOrderService = new AdminOrderService();
export default adminOrderService;