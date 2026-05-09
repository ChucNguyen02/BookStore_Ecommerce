import { useTranslation } from 'react-i18next';import {
  Clock,
  CheckCircle,
  Truck,
  Package,
  XCircle,
  RotateCcw,
  CreditCard } from
'lucide-react';
import { useAppContext } from '../../../context/AppContext';
import type { OrderStatus } from '../../../types/enum';

interface OrderStatusBadgeProps {
  status: OrderStatus;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
}

export const OrderStatusBadge = ({
  status,
  size = 'md',
  showIcon = true
}: OrderStatusBadgeProps) => {const { t } = useTranslation();
  const { language } = useAppContext();

  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
    lg: 'px-4 py-2 text-base'
  };

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5'
  };

  const statusConfig: Record<OrderStatus, {
    label: {vi: string;en: string;};
    className: string;
    icon: any;
  }> = {
    PAYMENT_PENDING: {
      label: { vi: t("Common.choThanhToan"), en: 'Awaiting Payment' },
      className: 'bg-gradient-to-r from-orange-100 to-red-100 text-orange-800 dark:from-orange-900/40 dark:to-red-900/40 dark:text-orange-300 border-2 border-orange-300 dark:border-orange-700 shadow-sm',
      icon: CreditCard
    },
    PENDING: {
      label: { vi: t("Common.choXacNhan"), en: 'Pending' },
      className: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
      icon: Clock
    },
    CONFIRMED: {
      label: { vi: t("Common.daXacNhan"), en: 'Confirmed' },
      className: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
      icon: CheckCircle
    },
    SHIPPING: {
      label: { vi: t("Common.dangGiao"), en: 'Shipping' },
      className: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
      icon: Truck
    },
    DELIVERED: {
      label: { vi: t("Common.daGiao"), en: 'Delivered' },
      className: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
      icon: Package
    },
    CANCELLED: {
      label: { vi: t("Common.daHuy"), en: 'Cancelled' },
      className: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
      icon: XCircle
    },
    RETURNED: {
      label: { vi: t("Common.traHang"), en: 'Returned' },
      className: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
      icon: RotateCcw
    }
  };

  const config = statusConfig[status] || statusConfig.PENDING;
  const Icon = config.icon;
  const label = config.label[language];

  return (
    <div className={`inline-flex items-center gap-1.5 rounded-full font-semibold ${sizeClasses[size]} ${config.className}`}>
            {showIcon && <Icon className={iconSizes[size]} />}
            {label}
        </div>);

};