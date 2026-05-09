import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, Gift, Package } from 'lucide-react';
import { useAdminRewards } from '../../../hooks/admin/useAdminRewards';
import RewardItemsTable from '../../../components/admin/rewards/RewardItemsTable';
import RewardFormModal from '../../../components/admin/rewards/RewardFormModal';
import RewardDetailModal from '../../../components/admin/rewards/RewardDetailModal';
import RedemptionsTable from '../../../components/admin/rewards/RedemptionsTable';
import RedemptionDetailModal from '../../../components/admin/rewards/RedemptionDetailModal';
import Pagination from '../../../components/admin/common/Pagination';
import LoadingSpinner from '../../../components/admin/common/LoadingSpinner';

export default function AdminRewards() {
    const { t } = useTranslation();
    const [activeTab, setActiveTab] = useState<'items' | 'redemptions'>('items');
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [editingReward, setEditingReward] = useState<string | null>(null);
    const [viewingReward, setViewingReward] = useState<string | null>(null);
    const [viewingRedemption, setViewingRedemption] = useState<string | null>(null);

    const {
        rewards,
        redemptions,
        statistics,
        rewardsPagination,
        redemptionsPagination,
        isLoading,
        error,
        currentRewardsPage,
        currentRedemptionsPage,
        handleRewardsPageChange,
        handleRedemptionsPageChange,
        handleToggleActive,
        handleDeleteReward,
        handleUpdateStock,
        refetch,
    } = useAdminRewards();

    const handleCreateSuccess = () => {
        setShowCreateModal(false);
        refetch();
    };

    const handleEditSuccess = () => {
        setEditingReward(null);
        refetch();
    };

    if (isLoading && !rewards.length && !redemptions.length) {
        return <LoadingSpinner fullScreen message={t('common.loading')} />;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-amber-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
            {/* Header với gradient animation */}
            <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 text-white shadow-2xl animate-fadeInDown relative overflow-hidden">
                {/* Animated background pattern */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent animate-shimmer"></div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative">
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="flex items-center space-x-3 mb-2">
                                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center animate-pulse shadow-lg">
                                    <Gift className="w-7 h-7" />
                                </div>
                                <h1 className="text-3xl md:text-4xl font-bold">
                                    {t('admin.rewardsProgram')}
                                </h1>
                            </div>
                            <p className="text-amber-100 animate-fadeIn">
                                {t('admin.manageRewardsAndRedemptions')}
                            </p>
                        </div>
                        {activeTab === 'items' && (
                            <button
                                onClick={() => setShowCreateModal(true)}
                                className="flex items-center space-x-2 px-6 py-3 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-xl transition-smooth shadow-lg hover:shadow-xl hover-scale"
                            >
                                <Plus className="w-5 h-5" />
                                <span className="font-medium">{t('admin.createReward')}</span>
                            </button>
                        )}
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Statistics với enhanced design */}
                {statistics && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        <div className="card hover-lift stagger-item">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 font-medium mb-1">
                                        {t('admin.totalRewards')}
                                    </p>
                                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                        {statistics.totalRewards}
                                    </p>
                                </div>
                                <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
                                    <Gift className="w-6 h-6 text-white" />
                                </div>
                            </div>
                            <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                                <div className="flex items-center text-xs text-amber-600 dark:text-amber-400">
                                    <Gift className="w-3 h-3 mr-2" />
                                    {t('admin.availableItems')}
                                </div>
                            </div>
                        </div>

                        <div className="card hover-lift stagger-item">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 font-medium mb-1">
                                        {t('admin.totalRedemptions')}
                                    </p>
                                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                        {statistics.totalRedemptions}
                                    </p>
                                </div>
                                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center shadow-lg">
                                    <Package className="w-6 h-6 text-white" />
                                </div>
                            </div>
                            <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                                <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                                        <div className="bg-gradient-to-r from-blue-500 to-cyan-500 h-1.5 rounded-full animate-pulse" style={{ width: '100%' }}></div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="card hover-lift stagger-item">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 font-medium mb-1">
                                        {t('admin.pendingRedemptions')}
                                    </p>
                                    <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                                        {statistics.pendingRedemptions}
                                    </p>
                                </div>
                                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center shadow-lg animate-pulse">
                                    <Package className="w-6 h-6 text-white" />
                                </div>
                            </div>
                            <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                                <div className="flex items-center text-xs text-orange-600 dark:text-orange-400">
                                    <span className="w-1.5 h-1.5 bg-orange-500 rounded-full mr-2 animate-pulse"></span>
                                    {t('admin.awaitingProcessing')}
                                </div>
                            </div>
                        </div>

                        <div className="card hover-lift stagger-item">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 font-medium mb-1">
                                        {t('admin.completedRedemptions')}
                                    </p>
                                    <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                                        {statistics.completedRedemptions}
                                    </p>
                                </div>
                                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                                    <Package className="w-6 h-6 text-white" />
                                </div>
                            </div>
                            <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                                <div className="flex items-center text-xs text-green-600 dark:text-green-400">
                                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                                    {t('admin.fulfilled')}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Tabs với enhanced styling */}
                <div className="card stagger-item overflow-hidden p-2 mb-6">
                    <div className="grid grid-cols-2 gap-2">
                        <button
                            onClick={() => setActiveTab('items')}
                            className={`relative px-6 py-4 rounded-xl font-medium transition-smooth hover-scale ${activeTab === 'items'
                                    ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg'
                                    : 'bg-gray-50 dark:bg-gray-700/50 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                                }`}
                        >
                            <div className="flex flex-col items-center space-y-2">
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-smooth ${activeTab === 'items'
                                        ? 'bg-white/20 backdrop-blur-sm'
                                        : 'bg-gray-200 dark:bg-gray-600'
                                    }`}>
                                    <Gift className="w-5 h-5" />
                                </div>
                                <div>
                                    <span className="block text-sm font-semibold">
                                        {t('admin.rewardItems')}
                                    </span>
                                    <span className={`text-xs ${activeTab === 'items'
                                            ? 'text-white/90'
                                            : 'text-gray-500 dark:text-gray-400'
                                        }`}>
                                        {statistics?.totalRewards || 0} {t('admin.items')}
                                    </span>
                                </div>
                            </div>
                            {activeTab === 'items' && (
                                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-1 bg-white rounded-t-full animate-fadeIn"></div>
                            )}
                        </button>

                        <button
                            onClick={() => setActiveTab('redemptions')}
                            className={`relative px-6 py-4 rounded-xl font-medium transition-smooth hover-scale ${activeTab === 'redemptions'
                                    ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg'
                                    : 'bg-gray-50 dark:bg-gray-700/50 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                                }`}
                        >
                            <div className="flex flex-col items-center space-y-2">
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-smooth ${activeTab === 'redemptions'
                                        ? 'bg-white/20 backdrop-blur-sm'
                                        : 'bg-gray-200 dark:bg-gray-600'
                                    }`}>
                                    <Package className="w-5 h-5" />
                                </div>
                                <div>
                                    <span className="block text-sm font-semibold">
                                        {t('admin.redemptions')}
                                    </span>
                                    <span className={`text-xs ${activeTab === 'redemptions'
                                            ? 'text-white/90'
                                            : 'text-gray-500 dark:text-gray-400'
                                        }`}>
                                        {statistics?.totalRedemptions || 0} {t('admin.total')}
                                    </span>
                                </div>
                            </div>
                            {activeTab === 'redemptions' && (
                                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-1 bg-white rounded-t-full animate-fadeIn"></div>
                            )}
                        </button>
                    </div>
                </div>

                {/* Error State */}
                {error && (
                    <div className="card stagger-item border-2 border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20 mb-6 animate-fadeIn">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-red-100 dark:bg-red-900/50 rounded-xl flex items-center justify-center">
                                <Package className="w-5 h-5 text-red-600 dark:text-red-400" />
                            </div>
                            <div>
                                <p className="font-semibold text-red-900 dark:text-red-300">
                                    {t('common.error')}
                                </p>
                                <p className="text-sm text-red-700 dark:text-red-400">{error}</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Content */}
                {activeTab === 'items' ? (
                    <>
                        {isLoading ? (
                            <div className="card stagger-item">
                                <div className="py-16">
                                    <LoadingSpinner />
                                    <p className="text-center text-gray-600 dark:text-gray-400 mt-4">
                                        {t('admin.loadingRewards')}
                                    </p>
                                </div>
                            </div>
                        ) : rewards.length === 0 ? (
                            <div className="card text-center stagger-item hover-lift">
                                <div className="py-16">
                                    <div className="w-24 h-24 bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse shadow-lg">
                                        <Gift className="w-12 h-12 text-amber-400 dark:text-amber-500" />
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                                        {t('admin.noRewardsFound')}
                                    </h3>
                                    <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
                                        {t('admin.noRewardsDesc')}
                                    </p>
                                    <button
                                        onClick={() => setShowCreateModal(true)}
                                        className="btn-primary hover-scale inline-flex items-center space-x-2"
                                    >
                                        <Plus className="w-5 h-5" />
                                        <span>{t('admin.createFirstReward')}</span>
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <>
                                <div className="stagger-item animate-fadeIn">
                                    <RewardItemsTable
                                        rewards={rewards}
                                        onEdit={setEditingReward}
                                        onView={setViewingReward}
                                        onToggleActive={handleToggleActive}
                                        onDelete={handleDeleteReward}
                                        onUpdateStock={handleUpdateStock}
                                    />
                                </div>

                                {rewardsPagination && rewardsPagination.totalPages > 1 && (
                                    <div className="mt-6 flex justify-center stagger-item">
                                        <div className="card inline-block">
                                            <Pagination
                                                currentPage={currentRewardsPage}
                                                totalPages={rewardsPagination.totalPages}
                                                onPageChange={handleRewardsPageChange}
                                            />
                                        </div>
                                    </div>
                                )}
                            </>
                        )}
                    </>
                ) : (
                    <>
                        {isLoading ? (
                            <div className="card stagger-item">
                                <div className="py-16">
                                    <LoadingSpinner />
                                    <p className="text-center text-gray-600 dark:text-gray-400 mt-4">
                                        {t('admin.loadingRedemptions')}
                                    </p>
                                </div>
                            </div>
                        ) : redemptions.length === 0 ? (
                            <div className="card text-center stagger-item hover-lift">
                                <div className="py-16">
                                    <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-cyan-100 dark:from-blue-900/30 dark:to-cyan-900/30 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse shadow-lg">
                                        <Package className="w-12 h-12 text-blue-400 dark:text-blue-500" />
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                                        {t('admin.noRedemptionsFound')}
                                    </h3>
                                    <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
                                        {t('admin.noRedemptionsDesc')}
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <>
                                <div className="stagger-item animate-fadeIn">
                                    <RedemptionsTable
                                        redemptions={redemptions}
                                        onView={setViewingRedemption}
                                    />
                                </div>

                                {redemptionsPagination && redemptionsPagination.totalPages > 1 && (
                                    <div className="mt-6 flex justify-center stagger-item">
                                        <div className="card inline-block">
                                            <Pagination
                                                currentPage={currentRedemptionsPage}
                                                totalPages={redemptionsPagination.totalPages}
                                                onPageChange={handleRedemptionsPageChange}
                                            />
                                        </div>
                                    </div>
                                )}
                            </>
                        )}
                    </>
                )}

                {/* Bottom Info */}
                {((activeTab === 'items' && rewards.length > 0) || (activeTab === 'redemptions' && redemptions.length > 0)) && (
                    <div className="card stagger-item bg-gradient-to-r from-amber-50 to-orange-50 dark:from-gray-800 dark:to-gray-800 border-2 border-amber-200 dark:border-amber-800 mt-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
                                    {activeTab === 'items' ? (
                                        <Gift className="w-5 h-5 text-white" />
                                    ) : (
                                        <Package className="w-5 h-5 text-white" />
                                    )}
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-gray-900 dark:text-white">
                                        {activeTab === 'items'
                                            ? t('admin.rewardsOverview')
                                            : t('admin.redemptionsOverview')
                                        }
                                    </p>
                                    <p className="text-xs text-gray-600 dark:text-gray-400">
                                        {activeTab === 'items'
                                            ? `${rewards.length} ${t('admin.itemsDisplayed')}`
                                            : `${redemptions.length} ${t('admin.redemptionsDisplayed')}`
                                        }
                                    </p>
                                </div>
                            </div>
                            {statistics && (
                                <div className="flex items-center space-x-4">
                                    {activeTab === 'redemptions' && (
                                        <>
                                            <div className="flex items-center gap-2">
                                                <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
                                                <span className="text-sm text-gray-600 dark:text-gray-400">
                                                    {statistics.pendingRedemptions} {t('admin.pending')}
                                                </span>
                                            </div>
                                            <div className="h-4 w-px bg-gray-300 dark:bg-gray-600"></div>
                                            <div className="flex items-center gap-2">
                                                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                                <span className="text-sm text-gray-600 dark:text-gray-400">
                                                    {statistics.completedRedemptions} {t('admin.completed')}
                                                </span>
                                            </div>
                                        </>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* Modals với backdrop blur */}
            {showCreateModal && (
                <div className="fixed inset-0 z-50 overflow-y-auto animate-fadeIn">
                    <div className="flex min-h-screen items-center justify-center p-4">
                        <div
                            className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
                            onClick={() => setShowCreateModal(false)}
                        ></div>
                        <div className="relative animate-scaleIn">
                            <RewardFormModal
                                onClose={() => setShowCreateModal(false)}
                                onSuccess={handleCreateSuccess}
                            />
                        </div>
                    </div>
                </div>
            )}

            {editingReward && (
                <div className="fixed inset-0 z-50 overflow-y-auto animate-fadeIn">
                    <div className="flex min-h-screen items-center justify-center p-4">
                        <div
                            className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
                            onClick={() => setEditingReward(null)}
                        ></div>
                        <div className="relative animate-scaleIn">
                            <RewardFormModal
                                rewardId={editingReward}
                                onClose={() => setEditingReward(null)}
                                onSuccess={handleEditSuccess}
                            />
                        </div>
                    </div>
                </div>
            )}

            {viewingReward && (
                <div className="fixed inset-0 z-50 overflow-y-auto animate-fadeIn">
                    <div className="flex min-h-screen items-center justify-center p-4">
                        <div
                            className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
                            onClick={() => setViewingReward(null)}
                        ></div>
                        <div className="relative animate-scaleIn">
                            <RewardDetailModal
                                rewardId={viewingReward}
                                onClose={() => setViewingReward(null)}
                            />
                        </div>
                    </div>
                </div>
            )}

            {viewingRedemption && (
                <div className="fixed inset-0 z-50 overflow-y-auto animate-fadeIn">
                    <div className="flex min-h-screen items-center justify-center p-4">
                        <div
                            className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
                            onClick={() => setViewingRedemption(null)}
                        ></div>
                        <div className="relative animate-scaleIn">
                            <RedemptionDetailModal
                                redemptionId={viewingRedemption}
                                onClose={() => setViewingRedemption(null)}
                                onUpdate={refetch}
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}