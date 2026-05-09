import { NotificationType } from './enum';

export interface NotificationResponse {
    id: string;
    type: NotificationType;
    title: string;
    message: string;
    link: string | null;
    imageUrl: string | null;
    isRead: boolean;
    createdAt: string;
    readAt: string | null;
}

export interface NotificationSummaryResponse {
    unreadCount: number;
    totalCount: number;
}