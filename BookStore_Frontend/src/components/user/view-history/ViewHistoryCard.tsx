import { useTranslation } from 'react-i18next';import { Link } from 'react-router-dom';
import { Eye } from 'lucide-react';
import type { ViewHistoryResponse } from '../../../types/view_history.types';
import { useAppContext } from '../../../context/AppContext';

interface ViewHistoryCardProps {
  item: ViewHistoryResponse;
}

export const ViewHistoryCard = ({ item }: ViewHistoryCardProps) => {const { t } = useTranslation();
  const { language } = useAppContext();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat(language === 'vi' ? 'vi-VN' : 'en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <Link
      to={`/books/${item.bookSlug}`}
      className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg hover:shadow-xl transition-all border border-gray-200 dark:border-gray-700 group">
      
            <div className="flex gap-4">
                {/* Image */}
                <div className="flex-shrink-0">
                    <div className="w-24 h-32 bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden">
                        {item.bookImage ?
            <img
              src={item.bookImage}
              alt={item.bookTitle}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform" /> :


            <div className="w-full h-full flex items-center justify-center">
                                <Eye className="w-8 h-8 text-gray-400 dark:text-gray-500" />
                            </div>
            }
                    </div>
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors line-clamp-2 mb-2">
                        {item.bookTitle}
                    </h3>

                    {/* View Count */}
                    <div className="flex items-center gap-2 mb-2">
                        <Eye className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                        <span className="text-sm text-gray-600 dark:text-gray-300">
                            {language === 'vi' ? t("Common.daXem") : 'Viewed '}
                            <span className="font-semibold">{item.viewCount}</span>
                            {language === 'vi' ? t("Common.lan") : ' times'}
                        </span>
                    </div>

                    {/* Last Viewed */}
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                        {language === 'vi' ? t("Common.xemLanCuoi") : 'Last viewed: '}
                        {formatDate(item.lastViewedAt)}
                    </p>
                </div>
            </div>
        </Link>);

};