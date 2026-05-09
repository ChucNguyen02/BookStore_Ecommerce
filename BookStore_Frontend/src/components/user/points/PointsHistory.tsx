import { useTranslation } from 'react-i18next';import { useState } from 'react';
import { ArrowUpCircle, ArrowDownCircle, Calendar, Package, Star, Gift, RefreshCw, Sparkles, Filter, ChevronLeft, ChevronRight } from 'lucide-react';
import { usePointsHistory } from '../../../hooks/user/usePointsHistory';
import { useAppContext } from '../../../context/AppContext';
import LoadingSpinner from '../common/LoadingSpinner';
import type { TransactionType } from '../../../types/enum';

export const PointsHistory = () => {const { t } = useTranslation();
  const { language } = useAppContext();
  const [filterType, setFilterType] = useState<TransactionType | 'ALL'>('ALL');
  const {
    transactions,
    loading,
    error,
    totalPages,
    currentPage,
    setPage
  } = usePointsHistory(filterType === 'ALL' ? undefined : filterType);

  const getTypeIcon = (type: TransactionType) => {
    switch (type) {
      case 'EARN':
        return <ArrowUpCircle className="w-5 h-5 text-green-600 dark:text-green-400" />;
      case 'REDEEM':
        return <ArrowDownCircle className="w-5 h-5 text-red-600 dark:text-red-400" />;
      case 'REFUND':
        return <RefreshCw className="w-5 h-5 text-blue-600 dark:text-blue-400" />;
      case 'EXPIRE':
        return <Calendar className="w-5 h-5 text-gray-600 dark:text-gray-400" />;
      case 'BONUS':
        return <Sparkles className="w-5 h-5 text-amber-600 dark:text-amber-400" />;
      default:
        return <Gift className="w-5 h-5 text-purple-600 dark:text-purple-400" />;
    }
  };

  const getReferenceIcon = (refType: string) => {
    switch (refType) {
      case 'ORDER':
        return <Package className="w-4 h-4" />;
      case 'REVIEW':
        return <Star className="w-4 h-4" />;
      case 'DAILY_CHECK_IN':
        return <Calendar className="w-4 h-4" />;
      case 'REWARD_REDEMPTION':
        return <Gift className="w-4 h-4" />;
      default:
        return null;
    }
  };

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

  const filters: Array<{value: TransactionType | 'ALL';label: string;}> = [
  { value: 'ALL', label: language === 'vi' ? t("Common.tatCa") : 'All' },
  { value: 'EARN', label: language === 'vi' ? t("Common.nhan") : 'Earn' },
  { value: 'REDEEM', label: language === 'vi' ? t("Common.dung") : 'Redeem' },
  { value: 'BONUS', label: language === 'vi' ? 'Bonus' : 'Bonus' },
  { value: 'REFUND', label: language === 'vi' ? t("Common.hoan") : 'Refund' },
  { value: 'EXPIRE', label: language === 'vi' ? t("Common.hetHan") : 'Expired' }];


  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="text-center py-8">
                <p className="text-red-600 dark:text-red-400">{error}</p>
            </div>);

  }

  return (
    <div className="space-y-4">
            {/* Filters */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2">
                <Filter className="w-5 h-5 text-gray-600 dark:text-gray-400 flex-shrink-0" />
                {filters.map((filter) =>
        <button
          key={filter.value}
          onClick={() => setFilterType(filter.value)}
          className={`px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${filterType === filter.value ?
          'bg-amber-500 text-white' :
          'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'}`
          }>
          
                        {filter.label}
                    </button>
        )}
            </div>

            {/* Transactions List */}
            {transactions.length > 0 ?
      <>
                    <div className="space-y-2">
                        {transactions.map((transaction) =>
          <div
            key={transaction.id}
            className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow">
            
                                <div className="flex items-start gap-4">
                                    <div className="flex-shrink-0">
                                        {getTypeIcon(transaction.type)}
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between gap-2 mb-1">
                                            <div className="flex items-center gap-2">
                                                {getReferenceIcon(transaction.referenceType)}
                                                <span className="font-medium text-gray-900 dark:text-white">
                                                    {transaction.description || transaction.referenceType}
                                                </span>
                                            </div>
                                            <span className={`text-lg font-bold whitespace-nowrap ${transaction.type === 'EARN' || transaction.type === 'BONUS' || transaction.type === 'REFUND' ?
                  'text-green-600 dark:text-green-400' :
                  'text-red-600 dark:text-red-400'}`
                  }>
                                                {transaction.type === 'EARN' || transaction.type === 'BONUS' || transaction.type === 'REFUND' ? '+' : '-'}
                                                {Math.abs(transaction.points)}
                                            </span>
                                        </div>

                                        <div className="flex items-center justify-between gap-2 text-sm text-gray-600 dark:text-gray-400">
                                            <span>{formatDate(transaction.createdAt)}</span>
                                            <span>
                                                {language === 'vi' ? t("Common.con") : 'Balance: '}
                                                <span className="font-semibold text-gray-900 dark:text-white">
                                                    {transaction.balanceAfter}
                                                </span>
                                            </span>
                                        </div>

                                        {transaction.referenceId &&
                <div className="mt-2 text-xs text-gray-500 dark:text-gray-500">
                                                ID: {transaction.referenceId}
                                            </div>
                }
                                    </div>
                                </div>
                            </div>
          )}
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 &&
        <div className="flex items-center justify-center gap-2 mt-6">
                            <button
            onClick={() => setPage(currentPage - 1)}
            disabled={currentPage === 0}
            className="px-4 py-2 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2 border border-gray-200 dark:border-gray-700">
            
                                <ChevronLeft className="w-5 h-5" />
                                {language === 'vi' ? t("Common.truoc") : 'Previous'}
                            </button>

                            <span className="px-4 py-2 text-gray-700 dark:text-gray-300">
                                {currentPage + 1} / {totalPages}
                            </span>

                            <button
            onClick={() => setPage(currentPage + 1)}
            disabled={currentPage >= totalPages - 1}
            className="px-4 py-2 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2 border border-gray-200 dark:border-gray-700">
            
                                {language === 'vi' ? 'Sau' : 'Next'}
                                <ChevronRight className="w-5 h-5" />
                            </button>
                        </div>
        }
                </> :

      <div className="text-center py-12">
                    <Calendar className="w-16 h-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-600 dark:text-gray-400">
                        {language === 'vi' ? t("Common.chuaCoGiaoDichNao") : 'No transactions yet'}
                    </p>
                </div>
      }
        </div>);

};