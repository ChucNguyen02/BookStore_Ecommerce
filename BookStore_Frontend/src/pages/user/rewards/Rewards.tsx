import { useState } from 'react';
import { Gift, Star, Package, Lock, AlertCircle, CheckCircle, Clock, X, ShoppingBag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useRewards } from '../../../hooks/user/useRewards';
import { useAuth } from '../../../hooks/user/useAuth';
import toast from 'react-hot-toast';
import type { RewardItemResponse } from '../../../types';

export default function Rewards() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { user: currentUser, isAuthenticated } = useAuth();

    const {
        rewards,
        redemptionHistory,
        loading,
        error,
        redeeming,
        historyPage,
        historyTotalPages,
        redeemReward,
        setHistoryPage,
    } = useRewards();

    const [selectedReward, setSelectedReward] = useState<RewardItemResponse | null>(null);
    const [showRedeemModal, setShowRedeemModal] = useState(false);
    const [shippingAddress, setShippingAddress] = useState('');
    const [note, setNote] = useState('');
    const [filterType, setFilterType] = useState<string>('ALL');

    const handleRedeemClick = (reward: RewardItemResponse) => {
        if (!isAuthenticated) {
            toast.error(t('Rewards.loginRequired'));
            navigate('/login');
            return;
        }

        setSelectedReward(reward);
        setShowRedeemModal(true);
    };

    const handleRedeemConfirm = async () => {
        if (!selectedReward) return;

        try {
            await redeemReward(
                selectedReward.id,
                selectedReward.type === 'BOOK' || selectedReward.type === 'GIFT' ? shippingAddress : undefined,
                note || undefined
            );
            setShowRedeemModal(false);
            setShippingAddress('');
            setNote('');
            setSelectedReward(null);
        } catch (err) {
            // Error handled in hook
        }
    };

    const getRewardTypeColor = (type: string) => {
        switch (type) {
            case 'BOOK': return 'from-blue-500 to-cyan-500';
            case 'VOUCHER': return 'from-purple-500 to-pink-500';
            case 'GIFT': return 'from-amber-500 to-orange-500';
            default: return 'from-gray-500 to-gray-600';
        }
    };

    const getRewardTypeIcon = (type: string) => {
        switch (type) {
            case 'BOOK': return <ShoppingBag className="w-5 h-5" />;
            case 'VOUCHER': return <Gift className="w-5 h-5" />;
            case 'GIFT': return <Package className="w-5 h-5" />;
            default: return <Gift className="w-5 h-5" />;
        }
    };

    const getStatusBadge = (status: string) => {
        const badges = {
            PENDING: { color: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400', icon: <Clock className="w-4 h-4" />, text: t('Rewards.status.pending') },
            PROCESSING: { color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400', icon: <AlertCircle className="w-4 h-4" />, text: t('Rewards.status.processing') },
            COMPLETED: { color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400', icon: <CheckCircle className="w-4 h-4" />, text: t('Rewards.status.completed') },
            CANCELLED: { color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400', icon: <X className="w-4 h-4" />, text: t('Rewards.status.cancelled') },
        };
        return badges[status as keyof typeof badges] || badges.PENDING;
    };

    const filteredRewards = filterType === 'ALL'
        ? rewards
        : rewards.filter(r => r.type === filterType);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                    <p className="text-gray-600 dark:text-gray-400">{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
            <div className="container mx-auto px-4">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-3 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl">
                            <Gift className="w-8 h-8 text-white" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                                {t('Rewards.title')}
                            </h1>
                            <p className="text-gray-600 dark:text-gray-400">
                                {t('Rewards.subtitle')}
                            </p>
                        </div>
                    </div>

                    {/* User Points Display */}
                    {isAuthenticated && currentUser?.totalPoints !== null && (
                        <div className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl p-6 text-white">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm opacity-90 mb-1">{t('Rewards.yourPoints')}</p>
                                    <div className="flex items-center gap-2">
                                        <Star className="w-8 h-8 fill-white" />
                                        <span className="text-4xl font-bold">{currentUser.totalPoints}</span>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm opacity-90 mb-1">{t('Rewards.tier')}</p>
                                    <span className="text-2xl font-bold">{currentUser.tier || 'BRONZE'}</span>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Guest Notice */}
                    {!isAuthenticated && (
                        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-6">
                            <div className="flex items-start gap-4">
                                <Lock className="w-6 h-6 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-1" />
                                <div className="flex-1">
                                    <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                                        {t('Rewards.guestNotice.title')}
                                    </h3>
                                    <p className="text-blue-700 dark:text-blue-300 mb-4">
                                        {t('Rewards.guestNotice.description')}
                                    </p>
                                    <button
                                        onClick={() => navigate('/login')}
                                        className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
                                    >
                                        {t('Rewards.guestNotice.login')}
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Filter Tabs */}
                <div className="mb-6 flex flex-wrap gap-2">
                    {['ALL', 'BOOK', 'VOUCHER', 'GIFT'].map((type) => (
                        <button
                            key={type}
                            onClick={() => setFilterType(type)}
                            className={`px-6 py-2 rounded-lg font-medium transition-all ${filterType === type
                                    ? 'bg-amber-500 text-white shadow-lg'
                                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                                }`}
                        >
                            {t(`Rewards.types.${type.toLowerCase()}`)}
                        </button>
                    ))}
                </div>

                {/* Rewards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                    {filteredRewards.map((reward) => {
                        const canAfford = isAuthenticated && currentUser?.totalPoints !== null
                            ? currentUser.totalPoints >= reward.pointsRequired
                            : false;
                        const isAvailable = reward.isAvailable && reward.stockQuantity > 0;

                        return (
                            <div
                                key={reward.id}
                                className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all group"
                            >
                                {/* Image */}
                                <div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800">
                                    {reward.imageUrl ? (
                                        <img
                                            src={reward.imageUrl}
                                            alt={reward.name}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            {getRewardTypeIcon(reward.type)}
                                        </div>
                                    )}
                                    {/* Type Badge */}
                                    <div className={`absolute top-3 right-3 px-3 py-1 bg-gradient-to-r ${getRewardTypeColor(reward.type)} text-white rounded-full text-xs font-bold flex items-center gap-1`}>
                                        {getRewardTypeIcon(reward.type)}
                                        {t(`Rewards.types.${reward.type.toLowerCase()}`)}
                                    </div>
                                    {/* Stock Badge */}
                                    {!isAvailable && (
                                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                                            <span className="text-white font-bold text-lg">
                                                {t('Rewards.outOfStock')}
                                            </span>
                                        </div>
                                    )}
                                </div>

                                {/* Content */}
                                <div className="p-6">
                                    <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2 line-clamp-2">
                                        {reward.name}
                                    </h3>
                                    {reward.description && (
                                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                                            {reward.description}
                                        </p>
                                    )}

                                    {/* Points Required */}
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center gap-2">
                                            <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
                                            <span className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                                                {reward.pointsRequired}
                                            </span>
                                        </div>
                                        <span className="text-sm text-gray-500 dark:text-gray-400">
                                            {reward.stockQuantity} {t('Rewards.inStock')}
                                        </span>
                                    </div>

                                    {/* Redeem Button */}
                                    <button
                                        onClick={() => handleRedeemClick(reward)}
                                        disabled={!isAvailable || (!isAuthenticated ? false : !canAfford)}
                                        className={`w-full py-3 rounded-lg font-semibold transition-all ${!isAvailable
                                                ? 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                                                : isAuthenticated && !canAfford
                                                    ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 cursor-not-allowed'
                                                    : 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-lg hover:shadow-xl'
                                            }`}
                                    >
                                        {!isAuthenticated
                                            ? t('Rewards.loginToRedeem')
                                            : !isAvailable
                                                ? t('Rewards.outOfStock')
                                                : !canAfford
                                                    ? t('Rewards.notEnoughPoints')
                                                    : t('Rewards.redeem')}
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Redemption History (Only for authenticated users) */}
                {isAuthenticated && redemptionHistory.length > 0 && (
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                            {t('Rewards.history.title')}
                        </h2>

                        <div className="space-y-4">
                            {redemptionHistory.map((redemption) => {
                                const statusBadge = getStatusBadge(redemption.status);
                                return (
                                    <div
                                        key={redemption.id}
                                        className="border border-gray-200 dark:border-gray-700 rounded-xl p-4 hover:border-amber-500 transition-colors"
                                    >
                                        <div className="flex items-center justify-between mb-3">
                                            <h3 className="font-semibold text-gray-900 dark:text-white">
                                                {redemption.reward.name}
                                            </h3>
                                            <span className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 ${statusBadge.color}`}>
                                                {statusBadge.icon}
                                                {statusBadge.text}
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between text-sm">
                                            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                                                <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                                                <span>{redemption.pointsSpent} {t('Rewards.pointsSpent')}</span>
                                            </div>
                                            <span className="text-gray-500 dark:text-gray-400">
                                                {new Date(redemption.redeemedAt).toLocaleDateString()}
                                            </span>
                                        </div>
                                        {redemption.trackingNumber && (
                                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                                                {t('Rewards.trackingNumber')}: {redemption.trackingNumber}
                                            </p>
                                        )}
                                    </div>
                                );
                            })}
                        </div>

                        {/* Pagination */}
                        {historyTotalPages > 1 && (
                            <div className="flex justify-center gap-2 mt-6">
                                <button
                                    onClick={() => setHistoryPage(Math.max(0, historyPage - 1))}
                                    disabled={historyPage === 0}
                                    className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 disabled:opacity-50"
                                >
                                    {t('Rewards.previous')}
                                </button>
                                <span className="px-4 py-2 text-gray-700 dark:text-gray-300">
                                    {historyPage + 1} / {historyTotalPages}
                                </span>
                                <button
                                    onClick={() => setHistoryPage(Math.min(historyTotalPages - 1, historyPage + 1))}
                                    disabled={historyPage >= historyTotalPages - 1}
                                    className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 disabled:opacity-50"
                                >
                                    {t('Rewards.next')}
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Redeem Modal */}
            {showRedeemModal && selectedReward && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-md w-full p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                                {t('Rewards.confirmRedeem')}
                            </h3>
                            <button
                                onClick={() => setShowRedeemModal(false)}
                                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="mb-6">
                            <p className="text-gray-600 dark:text-gray-400 mb-2">
                                {selectedReward.name}
                            </p>
                            <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400">
                                <Star className="w-5 h-5 fill-current" />
                                <span className="text-2xl font-bold">{selectedReward.pointsRequired}</span>
                            </div>
                        </div>

                        {(selectedReward.type === 'BOOK' || selectedReward.type === 'GIFT') && (
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    {t('Rewards.shippingAddress')} *
                                </label>
                                <textarea
                                    value={shippingAddress}
                                    onChange={(e) => setShippingAddress(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-amber-500 dark:bg-gray-700 dark:text-white"
                                    rows={3}
                                    required
                                />
                            </div>
                        )}

                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                {t('Rewards.note')}
                            </label>
                            <textarea
                                value={note}
                                onChange={(e) => setNote(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-amber-500 dark:bg-gray-700 dark:text-white"
                                rows={2}
                            />
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowRedeemModal(false)}
                                className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg font-semibold hover:bg-gray-50 dark:hover:bg-gray-700"
                            >
                                {t('Rewards.cancel')}
                            </button>
                            <button
                                onClick={handleRedeemConfirm}
                                disabled={redeeming || ((selectedReward.type === 'BOOK' || selectedReward.type === 'GIFT') && !shippingAddress.trim())}
                                className="flex-1 px-4 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-lg font-semibold hover:from-amber-600 hover:to-orange-600 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {redeeming ? t('Rewards.redeeming') : t('Rewards.confirm')}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}