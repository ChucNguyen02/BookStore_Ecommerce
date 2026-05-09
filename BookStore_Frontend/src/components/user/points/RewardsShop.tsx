import { useTranslation } from 'react-i18next';import { useState } from 'react';
import { Gift, Book, Tag, Sparkles, Star, Package, ChevronLeft, ChevronRight } from 'lucide-react';
import { useRewards } from '../../../hooks/user/useRewards';
import { useAppContext } from '../../../context/AppContext';
import { RewardRedeemModal } from './RewardRedeemModal';
import LoadingSpinner from '../common/LoadingSpinner';
import type { RewardItemResponse } from '../../../types/reward.types';
import type { RewardType } from '../../../types/enum';

interface RewardsShopProps {
  currentPoints: number;
}

export const RewardsShop = ({ currentPoints }: RewardsShopProps) => {const { t } = useTranslation();
  const { language } = useAppContext();
  const [filterType, setFilterType] = useState<RewardType | 'ALL'>('ALL');
  const [selectedReward, setSelectedReward] = useState<RewardItemResponse | null>(null);

  const {
    rewards,
    redemptionHistory,
    loading,
    error,
    redeeming,
    redeemReward,
    historyPage,
    historyTotalPages,
    setHistoryPage
  } = useRewards();

  const getTypeIcon = (type: RewardType) => {
    switch (type) {
      case 'BOOK':
        return <Book className="w-5 h-5" />;
      case 'VOUCHER':
        return <Tag className="w-5 h-5" />;
      case 'GIFT':
        return <Gift className="w-5 h-5" />;
      default:
        return <Sparkles className="w-5 h-5" />;
    }
  };

  const getTypeColor = (type: RewardType) => {
    switch (type) {
      case 'BOOK':
        return 'from-blue-500 to-cyan-500';
      case 'VOUCHER':
        return 'from-purple-500 to-pink-500';
      case 'GIFT':
        return 'from-green-500 to-emerald-500';
      default:
        return 'from-gray-500 to-gray-600';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat(language === 'vi' ? 'vi-VN' : 'en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  };

  const filteredRewards = filterType === 'ALL' ?
  rewards :
  rewards.filter((r) => r.type === filterType);

  const filters: Array<{value: RewardType | 'ALL';label: string;}> = [
  { value: 'ALL', label: language === 'vi' ? t("Common.tatCa") : 'All' },
  { value: 'BOOK', label: language === 'vi' ? t("Common.sach") : 'Books' },
  { value: 'VOUCHER', label: language === 'vi' ? 'Voucher' : 'Vouchers' },
  { value: 'GIFT', label: language === 'vi' ? t("Common.quaTang") : 'Gifts' }];


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
    <div className="space-y-6">
            {/* Current Points Banner */}
            <div className="bg-gradient-to-r from-amber-500 to-orange-500 dark:from-amber-600 dark:to-orange-600 text-white rounded-xl p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm opacity-90 mb-1">
                            {language === 'vi' ? t("Common.diemCuaBan") : 'Your Points'}
                        </p>
                        <p className="text-4xl font-bold">
                            {currentPoints.toLocaleString()}
                        </p>
                    </div>
                    <Star className="w-16 h-16 opacity-20" />
                </div>
            </div>

            {/* Filters */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2">
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

            {/* Rewards Grid */}
            {filteredRewards.length > 0 ?
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredRewards.map((reward) => {

          const canAfford = currentPoints >= reward.pointsRequired;
          const isAvailable = reward.isAvailable && reward.stockQuantity > 0;

          return (
            <div
              key={reward.id}
              className={`bg-white dark:bg-gray-800 rounded-xl overflow-hidden border-2 transition-all ${canAfford && isAvailable ?
              'border-amber-500 hover:shadow-xl cursor-pointer' :
              'border-gray-200 dark:border-gray-700 opacity-75'}`
              }
              onClick={() => canAfford && isAvailable && setSelectedReward(reward)}>
              
                                {/* Image */}
                                {reward.imageUrl ?
              <div className="relative aspect-[4/3] bg-gray-100 dark:bg-gray-700">
                                        <img
                  src={reward.imageUrl}
                  alt={reward.name}
                  className="w-full h-full object-cover" />
                
                                        <div className={`absolute top-2 right-2 px-3 py-1 bg-gradient-to-r ${getTypeColor(reward.type)} text-white rounded-full text-xs font-semibold flex items-center gap-1`}>
                                            {getTypeIcon(reward.type)}
                                            {reward.type}
                                        </div>
                                    </div> :

              <div className={`aspect-[4/3] bg-gradient-to-br ${getTypeColor(reward.type)} flex items-center justify-center`}>
                                        {getTypeIcon(reward.type)}
                                    </div>
              }

                                {/* Info */}
                                <div className="p-4">
                                    <h3 className="font-bold text-gray-900 dark:text-white mb-1 line-clamp-1">
                                        {reward.name}
                                    </h3>
                                    {reward.description &&
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                                            {reward.description}
                                        </p>
                }

                                    {/* Points & Stock */}
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="flex items-center gap-1">
                                            <Star className="w-5 h-5 text-amber-500" />
                                            <span className="text-lg font-bold text-gray-900 dark:text-white">
                                                {reward.pointsRequired.toLocaleString()}
                                            </span>
                                        </div>
                                        <span className="text-sm text-gray-600 dark:text-gray-400">
                                            {language === 'vi' ? t("Common.con") : 'Stock: '}
                                            <span className="font-semibold">{reward.stockQuantity}</span>
                                        </span>
                                    </div>

                                    {/* Button */}
                                    <button
                  disabled={!canAfford || !isAvailable}
                  className={`w-full py-2 rounded-lg font-semibold transition-colors ${canAfford && isAvailable ?
                  'bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-600 hover:to-orange-600' :
                  'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-500 cursor-not-allowed'}`
                  }>
                  
                                        {!canAfford ?
                  language === 'vi' ? t("Common.chuaDuDiem") : 'Not Enough Points' :
                  !isAvailable ?
                  language === 'vi' ? t("Common.hetHang") : 'Out of Stock' :
                  language === 'vi' ? t("Common.doiNgay") : 'Redeem Now'}
                                    </button>

                                    {/* Claimed Count */}
                                    {reward.claimedCount > 0 &&
                <p className="text-xs text-gray-500 dark:text-gray-500 mt-2 text-center">
                                            {reward.claimedCount} {language === 'vi' ? t("Common.nguoiDaDoi") : 'claimed'}
                                        </p>
                }
                                </div>
                            </div>);

        })}
                </div> :

      <div className="text-center py-12">
                    <Gift className="w-16 h-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-600 dark:text-gray-400">
                        {language === 'vi' ? t("Common.chuaCoPhanThuongNao") : 'No rewards available'}
                    </p>
                </div>
      }

            {/* Redemption History */}
            {redemptionHistory.length > 0 &&
      <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                        {language === 'vi' ? t("Common.lichSuDoiQua") : 'Redemption History'}
                    </h3>
                    <div className="space-y-2">
                        {redemptionHistory.map((item) =>
          <div
            key={item.id}
            className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
            
                                <div className="flex items-start gap-4">
                                    {item.reward.imageUrl &&
              <img
                src={item.reward.imageUrl}
                alt={item.reward.name}
                className="w-16 h-16 rounded-lg object-cover flex-shrink-0" />

              }
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between gap-2 mb-1">
                                            <h4 className="font-medium text-gray-900 dark:text-white">
                                                {item.reward.name}
                                            </h4>
                                            <span className={`px-2 py-1 text-xs font-semibold rounded-full whitespace-nowrap ${item.status === 'COMPLETED' ?
                  'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' :
                  item.status === 'PROCESSING' ?
                  'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400' :
                  item.status === 'CANCELLED' ?
                  'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400' :
                  'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-400'}`
                  }>
                                                {item.status}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                                            <span className="flex items-center gap-1">
                                                <Star className="w-4 h-4" />
                                                -{item.pointsSpent}
                                            </span>
                                            <span>{formatDate(item.redeemedAt)}</span>
                                        </div>
                                        {item.voucherCode &&
                <div className="mt-2 px-3 py-2 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
                                                <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                                                    {language === 'vi' ? t("Common.maVoucher") : 'Voucher code:'}
                                                </p>
                                                <p className="font-mono font-bold text-amber-600 dark:text-amber-400">
                                                    {item.voucherCode}
                                                </p>
                                            </div>
                }
                                    </div>
                                </div>
                            </div>
          )}
                    </div>

                    {/* History Pagination */}
                    {historyTotalPages > 1 &&
        <div className="flex items-center justify-center gap-2 mt-4">
                            <button
            onClick={() => setHistoryPage(historyPage - 1)}
            disabled={historyPage === 0}
            className="px-4 py-2 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2 border border-gray-200 dark:border-gray-700">
            
                                <ChevronLeft className="w-5 h-5" />
                            </button>
                            <span className="px-4 py-2 text-gray-700 dark:text-gray-300">
                                {historyPage + 1} / {historyTotalPages}
                            </span>
                            <button
            onClick={() => setHistoryPage(historyPage + 1)}
            disabled={historyPage >= historyTotalPages - 1}
            className="px-4 py-2 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2 border border-gray-200 dark:border-gray-700">
            
                                <ChevronRight className="w-5 h-5" />
                            </button>
                        </div>
        }
                </div>
      }

            {/* Redeem Modal */}
            {selectedReward &&
      <RewardRedeemModal
        reward={selectedReward}
        currentPoints={currentPoints}
        redeeming={redeeming}
        onConfirm={redeemReward}
        onClose={() => setSelectedReward(null)} />

      }
        </div>);

};