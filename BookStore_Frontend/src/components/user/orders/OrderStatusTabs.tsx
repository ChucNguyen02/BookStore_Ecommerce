import { useTranslation } from 'react-i18next';import {
  List,
  Clock,
  CheckCircle,
  Truck,
  Package,
  XCircle,
  RotateCcw,
  CreditCard } from
'lucide-react';

interface OrderStatusTabsProps {
  activeStatus: string;
  onStatusChange: (status: string) => void;
  counts?: Record<string, number>;
  language?: 'vi' | 'en';
}

export const OrderStatusTabs = ({
  activeStatus,
  onStatusChange,
  counts = {},
  language = 'vi'
}: OrderStatusTabsProps) => {const { t } = useTranslation();
  const tabs = [
  {
    id: 'ALL' as const,
    label: language === 'vi' ? t("Common.tatCa") : 'All',
    icon: List
  },
  {
    id: 'PAYMENT_PENDING' as const,
    label: language === 'vi' ? t("Common.choThanhToan") : 'Awaiting Payment',
    icon: CreditCard,
    highlight: true // Đánh dấu để highlight tab này
  },
  {
    id: 'PENDING' as const,
    label: language === 'vi' ? t("Common.choXacNhan") : 'Pending',
    icon: Clock
  },
  {
    id: 'CONFIRMED' as const,
    label: language === 'vi' ? t("Common.daXacNhan") : 'Confirmed',
    icon: CheckCircle
  },
  {
    id: 'SHIPPING' as const,
    label: language === 'vi' ? t("Common.dangGiao") : 'Shipping',
    icon: Truck
  },
  {
    id: 'DELIVERED' as const,
    label: language === 'vi' ? t("Common.daGiao") : 'Delivered',
    icon: Package
  },
  {
    id: 'CANCELLED' as const,
    label: language === 'vi' ? t("Common.daHuy") : 'Cancelled',
    icon: XCircle
  },
  {
    id: 'RETURNED' as const,
    label: language === 'vi' ? t("Common.traHang") : 'Returned',
    icon: RotateCcw
  }];


  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-2 overflow-x-auto">
            <div className="flex gap-2 min-w-max">
                {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeStatus === tab.id;
          const count = counts[tab.id] || 0;

          return (
            <button
              key={tab.id}
              onClick={() => onStatusChange(tab.id)}
              className={`
                                flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-all whitespace-nowrap relative
                                ${isActive ?
              tab.highlight ?
              'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg shadow-orange-500/50' :
              'bg-amber-500 dark:bg-amber-600 text-white shadow-md' :
              'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}
                            `
              }>
              
                            <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-gray-500 dark:text-gray-400'}`} />
                            <span>{tab.label}</span>
                            {count > 0 &&
              <span className={`
                                    px-2 py-0.5 rounded-full text-xs font-bold
                                    ${isActive ?
              'bg-white/20 text-white' :
              tab.highlight ?
              'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400' :
              'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400'}
                                `
              }>
                                    {count}
                                </span>
              }
                            {/* Pulse animation cho tab chờ thanh toán */}
                            {tab.highlight && count > 0 && !isActive &&
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                                </span>
              }
                        </button>);

        })}
            </div>
        </div>);

};