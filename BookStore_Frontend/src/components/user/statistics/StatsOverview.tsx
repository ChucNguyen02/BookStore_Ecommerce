import { useTranslation } from 'react-i18next';import { ShoppingBag, DollarSign, BookOpen, Star, TrendingUp, Calendar } from 'lucide-react';
import { useAppContext } from '../../../context/AppContext';
import { type UserStatisticsResponse } from '../../../types/user_statistics.types';

interface StatsOverviewProps {
  statistics: UserStatisticsResponse;
}

export const StatsOverview = ({ statistics }: StatsOverviewProps) => {const { t } = useTranslation();
  const { language } = useAppContext();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return language === 'vi' ? t("Common.chuaCo") : 'N/A';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat(language === 'vi' ? 'vi-VN' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };

  const stats = [
  {
    icon: <ShoppingBag className="w-8 h-8" />,
    label: language === 'vi' ? t("Common.tongDonHang") : 'Total Orders',
    value: statistics.totalOrders.toLocaleString(),
    color: 'from-blue-500 to-cyan-500',
    bgColor: 'bg-blue-50 dark:bg-blue-900/20',
    textColor: 'text-blue-600 dark:text-blue-400'
  },
  {
    icon: <DollarSign className="w-8 h-8" />,
    label: language === 'vi' ? t("Common.tongChiTieu") : 'Total Spent',
    value: formatPrice(statistics.totalSpent),
    color: 'from-green-500 to-emerald-500',
    bgColor: 'bg-green-50 dark:bg-green-900/20',
    textColor: 'text-green-600 dark:text-green-400'
  },
  {
    icon: <BookOpen className="w-8 h-8" />,
    label: language === 'vi' ? t("Common.soSachDaMua") : 'Books Purchased',
    value: statistics.totalBooks.toLocaleString(),
    color: 'from-purple-500 to-pink-500',
    bgColor: 'bg-purple-50 dark:bg-purple-900/20',
    textColor: 'text-purple-600 dark:text-purple-400'
  },
  {
    icon: <Star className="w-8 h-8" />,
    label: language === 'vi' ? t("Common.danhGiaDaViet") : 'Reviews Written',
    value: statistics.totalReviews.toLocaleString(),
    color: 'from-amber-500 to-orange-500',
    bgColor: 'bg-amber-50 dark:bg-amber-900/20',
    textColor: 'text-amber-600 dark:text-amber-400'
  },
  {
    icon: <TrendingUp className="w-8 h-8" />,
    label: language === 'vi' ? t("Common.giaTriTbdon") : 'Avg Order Value',
    value: formatPrice(statistics.averageOrderValue),
    color: 'from-indigo-500 to-purple-500',
    bgColor: 'bg-indigo-50 dark:bg-indigo-900/20',
    textColor: 'text-indigo-600 dark:text-indigo-400'
  },
  {
    icon: <Calendar className="w-8 h-8" />,
    label: language === 'vi' ? t("Common.donDauTien") : 'First Order',
    value: formatDate(statistics.firstOrderDate),
    color: 'from-rose-500 to-red-500',
    bgColor: 'bg-rose-50 dark:bg-rose-900/20',
    textColor: 'text-rose-600 dark:text-rose-400',
    isDate: true
  }];


  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {stats.map((stat, index) =>
      <div
        key={index}
        className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all border border-gray-200 dark:border-gray-700">
        
                    <div className="flex items-start justify-between mb-4">
                        <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                            <div className={stat.textColor}>
                                {stat.icon}
                            </div>
                        </div>
                    </div>
                    <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                        {stat.label}
                    </h3>
                    <p className={`text-2xl font-bold ${stat.isDate ? 'text-base' : ''} text-gray-900 dark:text-white`}>
                        {stat.value}
                    </p>
                </div>
      )}
        </div>);

};