import { useState, useEffect, useRef } from 'react';
import { Bell } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { notificationService } from '../../../services';
import type { NotificationResponse } from '../../../types/notification.types';
import NotificationItem from './NotificationItem';

export default function NotificationDropdown() {
    const [isOpen, setIsOpen] = useState(false);
    const [notifications, setNotifications] = useState<NotificationResponse[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const { t } = useTranslation();
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        fetchNotifications();
        fetchUnreadCount();
    }, []);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    const fetchNotifications = async () => {
        try {
            setIsLoading(true);
            const response = await notificationService.getUserNotifications(0, 10);
            setNotifications(response.content);
        } catch (error) {
            console.error('Failed to fetch notifications:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchUnreadCount = async () => {
        try {
            const summary = await notificationService.getNotificationSummary();
            setUnreadCount(summary.unreadCount);
        } catch (error) {
            console.error('Failed to fetch unread count:', error);
        }
    };

    const handleMarkAllRead = async () => {
        try {
            await notificationService.markAllAsRead();
            setNotifications(notifications.map(n => ({ ...n, isRead: true })));
            setUnreadCount(0);
        } catch (error) {
            console.error('Failed to mark all as read:', error);
        }
    };

    const handleMarkAsRead = async (id: string) => {
        try {
            await notificationService.markAsRead(id);
            setNotifications(notifications.map(n =>
                n.id === id ? { ...n, isRead: true } : n
            ));
            setUnreadCount(prev => Math.max(0, prev - 1));
        } catch (error) {
            console.error('Failed to mark as read:', error);
        }
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-all hover-scale group"
            >
                <Bell className="w-5 h-5 text-gray-600 dark:text-gray-300 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors" />
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 min-w-[1.25rem] h-5 px-1 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs font-bold rounded-full flex items-center justify-center shadow-lg animate-pulse">
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 card p-0 animate-fadeInDown shadow-2xl z-50 max-h-[80vh] flex flex-col">
                    {/* Header */}
                    <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-t-xl">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-gradient-to-br from-amber-500 to-orange-500 dark:from-amber-600 dark:to-orange-600 rounded-lg flex items-center justify-center shadow-md">
                                <Bell className="w-4 h-4 text-white" strokeWidth={2.5} />
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-900 dark:text-white text-sm">
                                    {t('notifications.title')}
                                </h3>
                                <p className="text-xs text-gray-600 dark:text-gray-400">
                                    {unreadCount > 0 ? `${unreadCount} ${t('notifications.unread')}` : t('notifications.allRead')}
                                </p>
                            </div>
                        </div>
                        {unreadCount > 0 && (
                            <button
                                onClick={handleMarkAllRead}
                                className="text-xs font-semibold text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 transition-colors hover-scale px-3 py-1.5 bg-white dark:bg-gray-800 rounded-lg border border-amber-200 dark:border-amber-800"
                            >
                                {t('notifications.markAllRead')}
                            </button>
                        )}
                    </div>

                    {/* Notifications List */}
                    <div className="flex-1 overflow-y-auto">
                        {isLoading ? (
                            <div className="p-8 flex flex-col items-center justify-center">
                                <div className="w-12 h-12 border-4 border-amber-200 dark:border-amber-800 border-t-amber-500 dark:border-t-amber-400 rounded-full animate-spin mb-4"></div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">{t('common.loading')}</p>
                            </div>
                        ) : notifications.length === 0 ? (
                            <div className="p-8 flex flex-col items-center justify-center text-center">
                                <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 rounded-full flex items-center justify-center mb-4 animate-pulse">
                                    <Bell className="w-10 h-10 text-gray-400 dark:text-gray-500" />
                                </div>
                                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                                    {t('notifications.noNotifications')}
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-500">
                                    {t('notifications.allCaughtUp')}
                                </p>
                            </div>
                        ) : (
                            <div className="divide-y divide-gray-200 dark:divide-gray-700">
                                {notifications.map((notification, index) => (
                                    <div
                                        key={notification.id}
                                        className="animate-fadeInUp"
                                        style={{ animationDelay: `${index * 0.05}s` }}
                                    >
                                        <NotificationItem
                                            notification={notification}
                                            onMarkAsRead={handleMarkAsRead}
                                        />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    {notifications.length > 0 && (
                        <div className="p-3 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 rounded-b-xl">
                            <button className="w-full text-center text-sm font-semibold text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 transition-colors py-2 hover:bg-amber-50 dark:hover:bg-amber-900/20 rounded-lg">
                                {t('notifications.viewAll')}
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}