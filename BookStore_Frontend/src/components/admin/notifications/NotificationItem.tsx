import type { NotificationResponse } from '../../../types/notification.types';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';
import { Check, Bell, Package, ShoppingCart, Gift } from 'lucide-react';

interface NotificationItemProps {
    notification: NotificationResponse;
    onMarkAsRead: (id: string) => void;
}

export default function NotificationItem({ notification, onMarkAsRead }: NotificationItemProps) {
    const getNotificationIcon = () => {
        const type = notification.type?.toLowerCase() || '';
        if (type.includes('order')) return ShoppingCart;
        if (type.includes('voucher')) return Gift;
        if (type.includes('product') || type.includes('book')) return Package;
        return Bell;
    };

    const Icon = getNotificationIcon();

    return (
        <button
            onClick={() => !notification.isRead && onMarkAsRead(notification.id)}
            className={`w-full p-4 text-left hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all group relative ${
                !notification.isRead ? 'bg-amber-50/50 dark:bg-amber-900/10' : ''
            }`}
        >
            {/* Unread indicator line */}
            {!notification.isRead && (
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-amber-500 to-orange-500 animate-fadeIn"></div>
            )}

            <div className="flex items-start gap-3">
                {/* Icon/Image */}
                {notification.imageUrl ? (
                    <div className="relative">
                        <img
                            src={notification.imageUrl}
                            alt=""
                            className="w-12 h-12 rounded-lg object-cover ring-2 ring-gray-200 dark:ring-gray-700 group-hover:ring-amber-500 dark:group-hover:ring-amber-400 transition-all"
                        />
                        {!notification.isRead && (
                            <div className="absolute -top-1 -right-1 w-3 h-3 bg-amber-500 rounded-full animate-pulse ring-2 ring-white dark:ring-gray-800"></div>
                        )}
                    </div>
                ) : (
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 ${
                        !notification.isRead
                            ? 'bg-gradient-to-br from-amber-500 to-orange-500 dark:from-amber-600 dark:to-orange-600 text-white'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                    } group-hover:scale-110 transition-transform`}>
                        <Icon className="w-6 h-6" strokeWidth={2} />
                    </div>
                )}

                {/* Content */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                        <p className={`font-semibold text-sm leading-snug ${
                            !notification.isRead 
                                ? 'text-gray-900 dark:text-white' 
                                : 'text-gray-700 dark:text-gray-300'
                        }`}>
                            {notification.title}
                        </p>
                        {!notification.isRead && (
                            <div className="w-2 h-2 bg-amber-500 rounded-full flex-shrink-0 mt-1 animate-pulse"></div>
                        )}
                    </div>

                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-2">
                        {notification.message}
                    </p>

                    <div className="flex items-center gap-3 text-xs">
                        <span className="text-gray-500 dark:text-gray-500 flex items-center gap-1">
                            <span className="inline-block w-1 h-1 bg-gray-400 rounded-full"></span>
                            {formatDistanceToNow(new Date(notification.createdAt), {
                                addSuffix: true,
                                locale: vi,
                            })}
                        </span>
                        {notification.isRead && (
                            <span className="flex items-center gap-1 text-green-600 dark:text-green-400">
                                <Check className="w-3 h-3" />
                                <span className="font-medium">Read</span>
                            </span>
                        )}
                    </div>
                </div>
            </div>

            {/* Hover overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-amber-500/0 via-amber-500/5 to-amber-500/0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
        </button>
    );
}