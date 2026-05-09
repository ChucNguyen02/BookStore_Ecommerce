import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, Search, Filter, TrendingUp } from 'lucide-react';
import { useAdminVouchers } from '../../../hooks/admin/useAdminVouchers';
import VoucherTable from '../../../components/admin/vouchers/VoucherTable';
import VoucherFormModal from '../../../components/admin/vouchers/VoucherFormModal';
import VoucherDetailModal from '../../../components/admin/vouchers/VoucherDetailModal';
import VoucherStatsCard from '../../../components/admin/vouchers/VoucherStatsCard';
import Pagination from '../../../components/admin/common/Pagination';
import LoadingSpinner from '../../../components/admin/common/LoadingSpinner';

export default function AdminVouchers() {
    const { t } = useTranslation();
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [editingVoucher, setEditingVoucher] = useState<string | null>(null);
    const [viewingVoucher, setViewingVoucher] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');

    const {
        vouchers,
        statistics,
        pagination,
        isLoading,
        error,
        currentPage,
        handlePageChange,
        handleToggleActive,
        handleDeleteVoucher,
        refetch,
    } = useAdminVouchers();

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        // Implement search functionality
    };

    const handleCreateSuccess = () => {
        setShowCreateModal(false);
        refetch();
    };

    const handleEditSuccess = () => {
        setEditingVoucher(null);
        refetch();
    };

    if (isLoading && !vouchers.length) {
        return <LoadingSpinner fullScreen message={t('common.loading')} />;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-amber-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
            {/* Header với animation */}
            <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-white animate-fadeInDown">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div className="animate-fadeInLeft">
                            <h1 className="text-3xl md:text-4xl font-bold mb-2">
                                {t('admin.vouchers')}
                            </h1>
                            <p className="text-amber-100">
                                {t('admin.manageVouchersAndPromotions')}
                            </p>
                        </div>
                        <button
                            onClick={() => setShowCreateModal(true)}
                            className="btn-primary animate-fadeInRight flex items-center space-x-2 whitespace-nowrap"
                        >
                            <Plus className="w-5 h-5" />
                            <span>{t('admin.createVoucher')}</span>
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Statistics Cards với stagger animation */}
                {statistics && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        <div className="stagger-item">
                            <VoucherStatsCard
                                label={t('admin.totalVouchers')}
                                value={statistics.totalVouchers}
                                icon={TrendingUp}
                                color="blue"
                            />
                        </div>
                        <div className="stagger-item">
                            <VoucherStatsCard
                                label={t('admin.activeVouchers')}
                                value={statistics.activeVouchers}
                                icon={TrendingUp}
                                color="green"
                            />
                        </div>
                        <div className="stagger-item">
                            <VoucherStatsCard
                                label={t('admin.totalUsed')}
                                value={statistics.totalUsed}
                                icon={TrendingUp}
                                color="purple"
                            />
                        </div>
                        <div className="stagger-item">
                            <VoucherStatsCard
                                label={t('admin.expiringVouchers')}
                                value={statistics.expiringVouchers}
                                icon={TrendingUp}
                                color="orange"
                            />
                        </div>
                    </div>
                )}

                {/* Search Bar với card style */}
                <div className="card mb-6 animate-fadeInUp">
                    <form onSubmit={handleSearch} className="flex gap-4">
                        <div className="flex-1 relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder={t('admin.searchVouchers')}
                                className="input-field pl-12"
                            />
                        </div>
                        <button
                            type="submit"
                            className="btn-secondary flex items-center space-x-2"
                        >
                            <Filter className="w-5 h-5" />
                            <span className="hidden sm:inline">{t('common.filter')}</span>
                        </button>
                    </form>
                </div>

                {/* Error State với badge style */}
                {error && (
                    <div className="card mb-6 border-l-4 border-red-500 dark:border-red-600 animate-fadeInUp">
                        <div className="flex items-start space-x-3">
                            <div className="badge badge-danger">
                                {t('common.error')}
                            </div>
                            <p className="text-gray-700 dark:text-gray-300 flex-1">{error}</p>
                        </div>
                    </div>
                )}

                {/* Vouchers Table */}
                {isLoading ? (
                    <div className="card p-12 animate-fadeIn">
                        <LoadingSpinner />
                    </div>
                ) : vouchers.length === 0 ? (
                    <div className="card p-12 text-center animate-scaleIn">
                        <div className="max-w-md mx-auto">
                            <div className="w-20 h-20 bg-gradient-to-br from-amber-100 to-amber-200 dark:from-amber-900/40 dark:to-amber-800/40 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Plus className="w-10 h-10 text-amber-600 dark:text-amber-400" />
                            </div>
                            <p className="text-gray-600 dark:text-gray-300 mb-4 text-lg">
                                {t('admin.noVouchersFound')}
                            </p>
                            <button
                                onClick={() => setShowCreateModal(true)}
                                className="btn-primary"
                            >
                                {t('admin.createFirstVoucher')}
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="animate-fadeInUp">
                        <div className="card overflow-hidden p-0">
                            <VoucherTable
                                vouchers={vouchers}
                                onEdit={setEditingVoucher}
                                onView={setViewingVoucher}
                                onToggleActive={handleToggleActive}
                                onDelete={handleDeleteVoucher}
                            />
                        </div>

                        {/* Pagination */}
                        {pagination && pagination.totalPages > 1 && (
                            <div className="mt-6 flex justify-center animate-fadeIn">
                                <Pagination
                                    currentPage={currentPage}
                                    totalPages={pagination.totalPages}
                                    onPageChange={handlePageChange}
                                />
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Modals */}
            {showCreateModal && (
                <VoucherFormModal
                    onClose={() => setShowCreateModal(false)}
                    onSuccess={handleCreateSuccess}
                />
            )}

            {editingVoucher && (
                <VoucherFormModal
                    voucherId={editingVoucher}
                    onClose={() => setEditingVoucher(null)}
                    onSuccess={handleEditSuccess}
                />
            )}

            {viewingVoucher && (
                <VoucherDetailModal
                    voucherId={viewingVoucher}
                    onClose={() => setViewingVoucher(null)}
                />
            )}
        </div>
    );
}