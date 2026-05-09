import apiClient from './api.client';
import { type PageResponse } from '../types';
import {
    type NotificationResponse,
    type NotificationSummaryResponse,
} from '../types/notification.types';

class NotificationService {
    private readonly BASE_URL = '/notifications';

    async getUserNotifications(
        page: number = 0,
        size: number = 20
    ): Promise<PageResponse<NotificationResponse>> {
        const response = await apiClient.get<PageResponse<NotificationResponse>>(
            this.BASE_URL,
            { params: { page, size } }
        );
        return response.result!;
    }

    async getUnreadNotifications(
        page: number = 0,
        size: number = 20
    ): Promise<PageResponse<NotificationResponse>> {
        const response = await apiClient.get<PageResponse<NotificationResponse>>(
            `${this.BASE_URL}/unread`,
            { params: { page, size } }
        );
        return response.result!;
    }

    async getNotificationSummary(): Promise<NotificationSummaryResponse> {
        const response = await apiClient.get<NotificationSummaryResponse>(
            `${this.BASE_URL}/summary`
        );
        return response.result!;
    }

    async markAsRead(notificationId: string): Promise<void> {
        await apiClient.patch<void>(`${this.BASE_URL}/${notificationId}/read`);
    }

    async markAllAsRead(): Promise<void> {
        await apiClient.patch<void>(`${this.BASE_URL}/read-all`);
    }

    async deleteNotification(notificationId: string): Promise<void> {
        await apiClient.delete<void>(`${this.BASE_URL}/${notificationId}`);
    }

    async deleteAllNotifications(): Promise<void> {
        await apiClient.delete<void>(`${this.BASE_URL}/all`);
    }
}

export const notificationService = new NotificationService();
export default notificationService;