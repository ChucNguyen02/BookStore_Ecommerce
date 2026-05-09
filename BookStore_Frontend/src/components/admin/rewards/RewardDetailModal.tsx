import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { X, Award, Package, Gift, Calendar, TrendingUp, CheckCircle, XCircle } from 'lucide-react';
import { adminRewardService } from '../../../services';
import { type RewardItemResponse } from '../../../types/reward.types';
import LoadingSpinner from '../common/LoadingSpinner';

interface RewardDetailModalProps {
    rewardId: string;
    onClose: () => void;
}

export default function RewardDetailModal({ rewardId, onClose }: RewardDetailModalProps) {
    const { t } = useTranslation();
    const [reward, setReward] = useState<RewardItemResponse | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchRewardDetail();
    }, [rewardId]);

    const fetchRewardDetail = async () => {
        try {
            setIsLoading(true);
            setError(null);
            const data = await adminRewardService.getRewardById(rewardId);
            setReward(data);
        } catch (err: any) {
            setError(err.message || 'Failed to fetch reward details');
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-3xl p-8">
                    <LoadingSpinner />
                </div>
            </div>
        );
    }

    if (error || !reward) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-3xl p-8">
                    <p className="text-red-600 dark:text-red-400">{error || t('admin.rewardNotFound')}</p>
                    <button
                        onClick={onClose}
                        className="mt-4 px-6 py-2 bg-gray-200 dark:bg-gray-700 rounded-xl"
                    >
                        {t('common.close')}
                    </button>
                </div>
            </div>
        );
    }

    const getTypeIcon = () => {
        switch (reward.type) {
            case 'BOOK':
                return <Package className="w-8 h-8" />;
            case 'VOUCHER':
                return <Award className="w-8 h-8" />;
            case 'GIFT':
                return <Gift className="w-8 h-8" />;
            default:
                return <Gift className="w-8 h-8" />;
        }
    };

    const getTypeGradient = () => {
        switch (reward.type) {
            case 'BOOK':
                return 'from-blue-500 to-cyan-500';
            case 'VOUCHER':
                return 'from-purple-500 to-pink-500';
            case 'GIFT':
                return 'from-amber-500 to-orange-500';
            default:
                return 'from-gray-500 to-gray-600';
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn overflow-y-auto">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-3xl my-8 animate-scaleIn">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                        {t('admin.rewardDetails')}
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors"
                    >
                        <X className="w-6 h-6 text-gray-500" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6 max-h-[calc(100vh-200px)] overflow-y-auto">
                    {/* Hero Card */}
                    <div className={`bg-gradient-to-br ${getTypeGradient()} rounded-2xl p-6 text-white`}>
                        <div className="flex items-start space-x-4">
                            {reward.imageUrl ? (
                                <img
                                    src={reward.imageUrl}
                                    alt={reward.name}
                                    className="w-24 h-24 rounded-xl object-cover border-4 border-white/20"
                                />
                            ) : (
                                <div className="w-24 h-24 bg-white/20 rounded-xl flex items-center justify-center">
                                    {getTypeIcon()}
                                </div>
                            )}
                            <div className="flex-1">
                                <h3 className="text-2xl font-bold mb-2">{reward.name}</h3>
                                <p className="text-sm opacity-90 mb-3">{reward.description}</p>
                                <div className="flex items-center space-x-4">
                                    <div className="flex items-center space-x-2 bg-white/20 px-3 py-1 rounded-full">
                                        {reward.isAvailable ? (
                                            <>
                                                <CheckCircle className="w-4 h-4" />
                                                <span className="text-sm font-medium">{t('admin.active')}</span>
                                            </>
                                        ) : (
                                            <>
                                                <XCircle className="w-4 h-4" />
                                                <span className="text-sm font-medium">{t('admin.inactive')}</span>
                                            </>
                                        )}
                                    </div>
                                    <div className="bg-white/20 px-3 py-1 rounded-full">
                                        <span className="text-sm font-medium">{reward.type}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Points & Stock */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6">
                            <div className="flex items-center space-x-2 text-amber-600 dark:text-amber-400 mb-2">
                                <Award className="w-5 h-5" />
                                <span className="text-sm font-medium">{t('admin.pointsRequired')}</span>
                            </div>
                            <p className="text-3xl font-bold text-gray-900 dark:text-white">
                                {reward.pointsRequired.toLocaleString()}
                            </p>
                        </div>

                        <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6">
                            <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 mb-2">
                                <Package className="w-5 h-5" />
                                <span className="text-sm font-medium">{t('admin.stockQuantity')}</span>
                            </div>
                            <p className={`text-3xl font-bold ${reward.stockQuantity === 0 ? 'text-red-600 dark:text-red-400' : 'text-gray-900 dark:text-white'}`}>
                                {reward.stockQuantity}
                            </p>
                        </div>
                    </div>

                    {/* Statistics */}
                    <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6">
                        <div className="flex items-center space-x-2 mb-4">
                            <TrendingUp className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                {t('admin.statistics')}
                            </h3>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    {t('admin.totalClaimed')}
                                </p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                    {reward.claimedCount}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    {t('admin.remaining')}
                                </p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                    {reward.stockQuantity}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Book Info (if applicable) */}
                    {reward.bookId && reward.bookTitle && (
                        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                                {t('admin.bookInformation')}
                            </h3>
                            <p className="text-gray-900 dark:text-white font-medium">
                                {reward.bookTitle}
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                {t('admin.bookId')}: {reward.bookId}
                            </p>
                        </div>
                    )}

                    {/* Voucher Info (if applicable) */}
                    {reward.type === 'VOUCHER' && reward.voucherDiscountValue && (
                        <div className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-6">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                {t('admin.voucherInformation')}
                            </h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        {t('admin.discountType')}
                                    </p>
                                    <p className="text-lg font-semibold text-gray-900 dark:text-white">
                                        {reward.voucherDiscountType}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        {t('admin.discountValue')}
                                    </p>
                                    <p className="text-lg font-semibold text-gray-900 dark:text-white">
                                        {reward.voucherDiscountType === 'PERCENTAGE'
                                            ? `${reward.voucherDiscountValue}%`
                                            : `$${reward.voucherDiscountValue}`}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Validity Period */}
                    {(reward.startDate || reward.endDate) && (
                        <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6">
                            <div className="flex items-center space-x-2 mb-4">
                                <Calendar className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                    {t('admin.validityPeriod')}
                                </h3>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                {reward.startDate && (
                                    <div>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            {t('admin.startDate')}
                                        </p>
                                        <p className="text-lg font-semibold text-gray-900 dark:text-white">
                                            {new Date(reward.startDate).toLocaleDateString()}
                                        </p>
                                    </div>
                                )}
                                {reward.endDate && (
                                    <div>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            {t('admin.endDate')}
                                        </p>
                                        <p className="text-lg font-semibold text-gray-900 dark:text-white">
                                            {new Date(reward.endDate).toLocaleDateString()}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}