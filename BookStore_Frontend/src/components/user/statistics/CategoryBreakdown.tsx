import { useTranslation } from 'react-i18next';import { BookOpen, TrendingUp } from 'lucide-react';
import { useAppContext } from '../../../context/AppContext';
import { type CategorySpendingData } from '../../../types/user_statistics.types';

interface CategoryBreakdownProps {
  data: CategorySpendingData[];
}

export const CategoryBreakdown = ({ data }: CategoryBreakdownProps) => {const { t } = useTranslation();
  const { language } = useAppContext();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const totalSpent = data.reduce((sum, item) => sum + item.totalSpent, 0);

  const sortedData = [...data].sort((a, b) => b.totalSpent - a.totalSpent);
  const topCategories = sortedData.slice(0, 5);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    {language === 'vi' ? t("Common.topDanhMucYeuThich") : 'Top Favorite Categories'}
                </h3>
                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                    <TrendingUp className="w-4 h-4" />
                    <span>{language === 'vi' ? t("Common.theoChiTieu") : 'By spending'}</span>
                </div>
            </div>

            {topCategories.length === 0 ?
      <div className="flex flex-col items-center justify-center py-12 text-gray-500 dark:text-gray-400">
                    <BookOpen className="w-16 h-16 mb-4 opacity-50" />
                    <p>{language === 'vi' ? t("Common.chuaCoDuLieu") : 'No data available'}</p>
                </div> :

      <div className="space-y-4">
                    {topCategories.map((category, index) => {
          const percentage = totalSpent > 0 ? category.totalSpent / totalSpent * 100 : 0;

          return (
            <div
              key={category.categoryId}
              className="group hover:bg-gray-50 dark:hover:bg-gray-700 p-4 rounded-xl transition-all">
              
                                <div className="flex items-center gap-4 mb-3">
                                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold text-sm">
                                        #{index + 1}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="font-semibold text-gray-900 dark:text-white truncate group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                                            {category.categoryName}
                                        </h4>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            {category.bookCount} {language === 'vi' ? t("Common.cuonSach") : 'books'}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold text-lg text-gray-900 dark:text-white">
                                            {formatPrice(category.totalSpent)}
                                        </p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                            {percentage.toFixed(1)}% {language === 'vi' ? t("Common.tongChi") : 'of total'}
                                        </p>
                                    </div>
                                </div>

                                {/* Progress Bar */}
                                <div className="relative h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                    <div
                  className="absolute inset-y-0 left-0 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full transition-all duration-500"
                  style={{ width: `${percentage}%` }} />
                
                                </div>
                            </div>);

        })}
                </div>
      }

            {sortedData.length > 5 &&
      <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700 text-center">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        {language === 'vi' ?
          `+ ${sortedData.length - 5} danh mục khác` :
          `+ ${sortedData.length - 5} more categories`}
                    </p>
                </div>
      }
        </div>);

};