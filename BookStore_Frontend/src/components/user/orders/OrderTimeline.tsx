import { useTranslation } from 'react-i18next';import {
  Clock,
  CheckCircle,
  Truck,
  Package,
  XCircle } from
'lucide-react';
import { useAppContext } from '../../../context/AppContext';
import type { OrderDetailResponse } from '../../../types/order_detail.types';

interface OrderTimelineProps {
  order: OrderDetailResponse;
}

export const OrderTimeline = ({ order }: OrderTimelineProps) => {const { t } = useTranslation();
  const { language } = useAppContext();

  const formatDate = (dateString: string | null) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return new Intl.DateTimeFormat(language === 'vi' ? 'vi-VN' : 'en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const getTimelineSteps = () => {
    if (order.status === 'CANCELLED') {
      return [
      {
        label: language === 'vi' ? t("Common.donHangDaTao") : 'Order Created',
        date: formatDate(order.createdAt),
        icon: Clock,
        completed: true,
        active: false
      },
      {
        label: language === 'vi' ? t("Common.daHuy") : 'Cancelled',
        date: formatDate(order.cancelledAt),
        reason: order.cancelledReason,
        icon: XCircle,
        completed: true,
        active: true,
        color: 'text-red-600 dark:text-red-400',
        bgColor: 'bg-red-100 dark:bg-red-900/20'
      }];

    }

    return [
    {
      label: language === 'vi' ? t("Common.donHangDaTao") : 'Order Created',
      date: formatDate(order.createdAt),
      icon: Clock,
      completed: true,
      active: order.status === 'PENDING'
    },
    {
      label: language === 'vi' ? t("Common.daXacNhan") : 'Confirmed',
      date: formatDate(order.confirmedAt),
      icon: CheckCircle,
      completed: !!order.confirmedAt,
      active: order.status === 'CONFIRMED'
    },
    {
      label: language === 'vi' ? t("Common.dangGiaoHang") : 'Shipping',
      date: formatDate(order.shippedAt),
      icon: Truck,
      completed: !!order.shippedAt,
      active: order.status === 'SHIPPING'
    },
    {
      label: language === 'vi' ? t("Common.daGiaoHang") : 'Delivered',
      date: formatDate(order.deliveredAt),
      icon: Package,
      completed: !!order.deliveredAt,
      active: order.status === 'DELIVERED'
    }];

  };

  const steps = getTimelineSteps();

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                {language === 'vi' ? t("Common.trangThaiDonHang") : 'Order Timeline'}
            </h3>

            <div className="space-y-6">
                {steps.map((step, index) => {
          const Icon = step.icon;
          const isLast = index === steps.length - 1;
          const colorClass = step.color || (step.completed ? 'text-green-600 dark:text-green-400' : 'text-gray-400 dark:text-gray-600');
          const bgClass = step.bgColor || (step.completed ? 'bg-green-100 dark:bg-green-900/20' : 'bg-gray-100 dark:bg-gray-800');

          return (
            <div key={index} className="relative">
                            <div className="flex gap-4">
                                {/* Icon */}
                                <div className="flex-shrink-0">
                                    <div className={`
                                        w-12 h-12 rounded-full flex items-center justify-center
                                        ${bgClass}
                                        ${step.active ? 'ring-4 ring-offset-2 ring-amber-300 dark:ring-amber-700 ring-offset-white dark:ring-offset-gray-800' : ''}
                                    `}>
                                        <Icon className={`w-6 h-6 ${colorClass}`} />
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="flex-1 pb-6">
                                    <div className="flex items-start justify-between gap-4">
                                        <div>
                                            <p className={`
                                                font-semibold text-lg
                                                ${step.completed ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'}
                                            `}>
                                                {step.label}
                                            </p>
                                            {step.date &&
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                                    {step.date}
                                                </p>
                      }
                                            {step.reason &&
                      <div className="mt-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                                                    <p className="text-sm font-medium text-red-800 dark:text-red-300">
                                                        {language === 'vi' ? t("Common.lyDo") : 'Reason: '}
                                                        {step.reason}
                                                    </p>
                                                </div>
                      }
                                        </div>
                                        {step.active &&
                    <span className="px-3 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 text-xs font-semibold rounded-full">
                                                {language === 'vi' ? t("Common.hienTai") : 'Current'}
                                            </span>
                    }
                                    </div>
                                </div>
                            </div>

                            {/* Connector Line */}
                            {!isLast &&
              <div className={`
                                    absolute left-6 top-12 w-0.5 h-6
                                    ${step.completed ? 'bg-green-400 dark:bg-green-700' : 'bg-gray-200 dark:bg-gray-700'}
                                `} />
              }
                        </div>);

        })}
            </div>
        </div>);

};