import { useState, useEffect, useCallback } from 'react';
import { notificationService, authService } from '../../services';
import type { NotificationResponse, NotificationSummaryResponse } from '../../types';
import type { PageResponse } from '../../types';
import toast from 'react-hot-toast';
import { useAppContext } from '../../context/AppContext';

export const useNotifications = (pageSize: number = 20) => {
    const { language } = useAppContext();
    const [notifications, setNotifications] = useState<NotificationResponse[]>([]);
    const [summary, setSummary] = useState<NotificationSummaryResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [updating, setUpdating] = useState(false);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);

    const fetchNotifications = useCallback(async (page: number = 0) => {

        if (!authService.isAuthenticated()) {
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            setError(null);
            const data: PageResponse<NotificationResponse> = await notificationService.getUserNotifications(page, pageSize);
            setNotifications(data.content);
            setCurrentPage(data.pageNumber);
            setTotalPages(data.totalPages);
            setTotalElements(data.totalElements);
        } catch (err: unknown) {
            const errorMsg = err instanceof Error
                ? err.message
                : (language === 'vi' ? 'Không thể tải thông báo' : 'Cannot load notifications');

            setError(errorMsg);

            if (authService.isAuthenticated()) {
                toast.error(errorMsg);
            }
        } finally {
            setLoading(false);
        }
    }, [language, pageSize]);

    const fetchUnreadNotifications = useCallback(async (page: number = 0) => {
        if (!authService.isAuthenticated()) {
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            setError(null);
            const data: PageResponse<NotificationResponse> = await notificationService.getUnreadNotifications(page, pageSize);
            setNotifications(data.content);
            setCurrentPage(data.pageNumber);
            setTotalPages(data.totalPages);
            setTotalElements(data.totalElements);
        } catch (err: unknown) {
            const errorMsg = err instanceof Error
                ? err.message
                : (language === 'vi' ? 'Không thể tải thông báo' : 'Cannot load notifications');

            setError(errorMsg);

            if (authService.isAuthenticated()) {
                toast.error(errorMsg);
            }
        } finally {
            setLoading(false);
        }
    }, [language, pageSize]);

    const fetchSummary = useCallback(async () => {
        if (!authService.isAuthenticated()) {
            return;
        }

        try {
            const data = await notificationService.getNotificationSummary();
            setSummary(data);
        } catch (err: unknown) {
            console.error('Failed to fetch notification summary:', err);
        }
    }, []);

    useEffect(() => {
        fetchNotifications();
        fetchSummary();
    }, [fetchNotifications, fetchSummary]);

    const markAsRead = async (notificationId: string) => {
        try {
            setUpdating(true);
            await notificationService.markAsRead(notificationId);

            setNotifications(prev =>
                prev.map(n =>
                    n.id === notificationId ? { ...n, isRead: true, readAt: new Date().toISOString() } : n
                )
            );

            if (summary) {
                setSummary({
                    ...summary,
                    unreadCount: Math.max(0, summary.unreadCount - 1)
                });
            }

            toast.success(language === 'vi'
                ? 'Đã đánh dấu đã đọc'
                : 'Marked as read');
        } catch (err: unknown) {
            toast.error(err instanceof Error ? err.message : (language === 'vi'
                ? 'Không thể đánh dấu đã đọc'
                : 'Cannot mark as read'));
        } finally {
            setUpdating(false);
        }
    };

    const markAllAsRead = async () => {
        try {
            setUpdating(true);
            await notificationService.markAllAsRead();

            setNotifications(prev =>
                prev.map(n => ({ ...n, isRead: true, readAt: new Date().toISOString() }))
            );

            if (summary) {
                setSummary({
                    ...summary,
                    unreadCount: 0
                });
            }

            toast.success(language === 'vi'
                ? 'Đã đánh dấu tất cả đã đọc'
                : 'All marked as read');
        } catch (err: unknown) {
            toast.error(err instanceof Error ? err.message : (language === 'vi'
                ? 'Không thể đánh dấu tất cả đã đọc'
                : 'Cannot mark all as read'));
        } finally {
            setUpdating(false);
        }
    };

    const deleteNotification = async (notificationId: string) => {
        try {
            setUpdating(true);
            await notificationService.deleteNotification(notificationId);

            const deletedNotif = notifications.find(n => n.id === notificationId);
            setNotifications(prev => prev.filter(n => n.id !== notificationId));

            if (summary) {
                setSummary({
                    totalCount: summary.totalCount - 1,
                    unreadCount: deletedNotif && !deletedNotif.isRead
                        ? Math.max(0, summary.unreadCount - 1)
                        : summary.unreadCount
                });
            }

            toast.success(language === 'vi'
                ? 'Đã xóa thông báo'
                : 'Notification deleted');
        } catch (err: unknown) {
            toast.error(err instanceof Error ? err.message : (language === 'vi'
                ? 'Không thể xóa thông báo'
                : 'Cannot delete notification'));
        } finally {
            setUpdating(false);
        }
    };

    const deleteAllNotifications = async () => {
        try {
            setUpdating(true);
            await notificationService.deleteAllNotifications();

            setNotifications([]);
            setSummary({
                totalCount: 0,
                unreadCount: 0
            });

            toast.success(language === 'vi'
                ? 'Đã xóa tất cả thông báo'
                : 'All notifications deleted');
        } catch (err: unknown) {
            toast.error(err instanceof Error ? err.message : (language === 'vi'
                ? 'Không thể xóa tất cả thông báo'
                : 'Cannot delete all notifications'));
        } finally {
            setUpdating(false);
        }
    };

    const loadPage = (page: number) => {
        setCurrentPage(page);
        fetchNotifications(page);
    };

    return {
        notifications,
        summary,
        loading,
        error,
        updating,
        currentPage,
        totalPages,
        totalElements,
        markAsRead,
        markAllAsRead,
        deleteNotification,
        deleteAllNotifications,
        loadPage,
        fetchUnreadNotifications,
        refetch: fetchNotifications,
    };
};