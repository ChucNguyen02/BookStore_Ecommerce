import { useTranslation } from 'react-i18next';import { Link } from 'react-router-dom';
import {
  Package,
  Tag,
  Heart,
  MessageCircle,
  Star,
  Award,
  Bell,
  X,
  ExternalLink } from
'lucide-react';
import { useAppContext } from '../../../context/AppContext';
import type { NotificationResponse } from '../../../types/notification.types';
import { NotificationType } from '../../../types/enum';

interface NotificationCardProps {
  notification: NotificationResponse;
  onMarkRead?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export const NotificationCard = ({ notification, onMarkRead, onDelete }: NotificationCardProps) => {const { t } = useTranslation();
  const { language } = useAppContext();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return language === 'vi' ? t("Common.vuaXong") : 'Just now';
    if (diffMins < 60) return `${diffMins} ${language === 'vi' ? t("Common.phutTruoc") : 'minutes ago'}`;
    if (diffHours < 24) return `${diffHours} ${language === 'vi' ? t("Common.gioTruoc") : 'hours ago'}`;
    if (diffDays < 7) return `${diffDays} ${language === 'vi' ? t("Common.ngayTruoc") : 'days ago'}`;

    return date.toLocaleDateString(language === 'vi' ? 'vi-VN' : 'en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getIcon = () => {
    switch (notification.type) {
      case NotificationType.ORDER:
        return <Package className="w-6 h-6" />;
      case NotificationType.PROMOTION:
        return <Tag className="w-6 h-6" />;
      case NotificationType.WISHLIST:
        return <Heart className="w-6 h-6" />;
      case NotificationType.QUESTION:
        return <MessageCircle className="w-6 h-6" />;
      case NotificationType.REVIEW:
        return <Star className="w-6 h-6" />;
      case NotificationType.POINTS:
        return <Award className="w-6 h-6" />;
      case NotificationType.SYSTEM:
        return <Bell className="w-6 h-6" />;
      default:
        return <Bell className="w-6 h-6" />;
    }
  };

  const getColorClasses = () => {
    const base = notification.isRead ?
    'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700' :
    'bg-white dark:bg-gray-750 border-amber-200 dark:border-amber-800 shadow-md';

    const iconBg = {
      [NotificationType.ORDER]: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
      [NotificationType.PROMOTION]: 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400',
      [NotificationType.WISHLIST]: 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400',
      [NotificationType.QUESTION]: 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400',
      [NotificationType.REVIEW]: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400',
      [NotificationType.POINTS]: 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400',
      [NotificationType.SYSTEM]: 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
    };

    return {
      base,
      icon: iconBg[notification.type] || iconBg[NotificationType.SYSTEM]
    };
  };

  const colors = getColorClasses();

  const handleClick = () => {
    if (!notification.isRead && onMarkRead) {
      onMarkRead(notification.id);
    }
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onDelete) {
      onDelete(notification.id);
    }
  };

  const content =
  <div
    className={`relative rounded-xl border-2 p-4 transition-all hover:shadow-lg ${colors.base}`}
    onClick={handleClick}>
    
            {!notification.isRead &&
    <div className="absolute top-4 right-4">
                    <div className="w-3 h-3 bg-amber-500 rounded-full animate-pulse" />
                </div>
    }

            <div className="flex gap-4">
                {/* Icon */}
                <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center ${colors.icon}`}>
                    {getIcon()}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4 mb-2">
                        <h3 className={`text-lg font-semibold ${notification.isRead ?
          'text-gray-700 dark:text-gray-300' :
          'text-gray-900 dark:text-white'}`
          }>
                            {notification.title}
                        </h3>

                        <button
            onClick={handleDelete}
            className="flex-shrink-0 p-1 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors">
            
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <p className="text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                        {notification.message}
                    </p>

                    {/* Image */}
                    {notification.imageUrl &&
        <img
          src={notification.imageUrl}
          alt={notification.title}
          className="w-full h-48 object-cover rounded-lg mb-3" />

        }

                    <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                            {formatDate(notification.createdAt)}
                        </span>

                        {notification.link &&
          <span className="flex items-center gap-1 text-sm text-amber-600 dark:text-amber-400 font-medium">
                                {language === 'vi' ? t("Common.xemChiTiet") : 'View details'}
                                <ExternalLink className="w-4 h-4" />
                            </span>
          }
                    </div>
                </div>
            </div>
        </div>;


  if (notification.link) {
    return <Link to={notification.link}>{content}</Link>;
  }

  return content;
};