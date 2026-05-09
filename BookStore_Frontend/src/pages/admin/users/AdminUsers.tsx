import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Search, Filter, UserPlus, Download } from 'lucide-react';
import { useAdminUsers } from '../../../hooks/admin/useAdminUsers';
import { Role, Tier } from '../../../types/enum';
import UserTable from '../../../components/admin/users/UserTable';
import UserDetailModal from '../../../components/admin/users/UserDetailModal';
import UserFilters from '../../../components/admin/users/UserFilters';
import Pagination from '../../../components/admin/common/Pagination';
import LoadingSpinner from '../../../components/admin/common/LoadingSpinner';

export default function AdminUsers() {
    const { t } = useTranslation();
    const [searchQuery, setSearchQuery] = useState('');
    const [showFilters, setShowFilters] = useState(false);
    const [selectedUser, setSelectedUser] = useState<string | null>(null);

    const [filters, setFilters] = useState({
        role: '' as Role | '',
        isActive: '',
        tier: '' as Tier | '',
    });

    const {
        users,
        pagination,
        isLoading,
        error,
        currentPage,
        handlePageChange,
        handleSearch,
        handleFilter,
        handleToggleActive,
        handleChangeRole,
        handleDeleteUser,
        refetch,
    } = useAdminUsers();

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        handleSearch(searchQuery);
    };

    const handleApplyFilters = () => {
        handleFilter(filters);
        setShowFilters(false);
    };

    const handleResetFilters = () => {
        setFilters({
            role: '',
            isActive: '',
            tier: '',
        });
        handleFilter({
            role: '',
            isActive: '',
            tier: '',
        });
    };

    const handleExportUsers = () => {
        // TODO: Implement export functionality
        console.log('Export users');
    };

    if (isLoading && !users.length) {
        return <LoadingSpinner fullScreen message={t('common.loading')} />;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-amber-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
            {/* Header với gradient animation */}
            <div className="bg-gradient-to-r from-blue-500 via-cyan-500 to-teal-500 text-white shadow-2xl animate-fadeInDown relative overflow-hidden">
                {/* Animated background pattern */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent animate-shimmer"></div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative">
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="flex items-center space-x-3 mb-2">
                                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center animate-pulse shadow-lg">
                                    <UserPlus className="w-7 h-7" />
                                </div>
                                <h1 className="text-3xl md:text-4xl font-bold">
                                    {t('admin.users')}
                                </h1>
                            </div>
                            <p className="text-blue-100 animate-fadeIn">
                                {t('admin.manageAllUsers')}
                            </p>
                        </div>
                        <button
                            onClick={handleExportUsers}
                            className="flex items-center space-x-2 px-6 py-3 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-xl transition-smooth shadow-lg hover:shadow-xl hover-scale"
                        >
                            <Download className="w-5 h-5" />
                            <span className="font-medium hidden sm:inline">{t('admin.export')}</span>
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Stats Cards */}
                {pagination && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        <div className="card hover-lift stagger-item">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 font-medium mb-1">
                                        {t('admin.totalUsers')}
                                    </p>
                                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                        {pagination.totalElements}
                                    </p>
                                </div>
                                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center shadow-lg">
                                    <UserPlus className="w-6 h-6 text-white" />
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
                                        {t('admin.currentPage')}
                                    </p>
                                    <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                                        {currentPage + 1} / {pagination.totalPages}
                                    </p>
                                </div>
                                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                                    <Search className="w-6 h-6 text-white" />
                                </div>
                            </div>
                            <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                                <div className="flex items-center text-xs text-purple-600 dark:text-purple-400">
                                    <div className="flex space-x-1 mr-2">
                                        <div className="w-1 h-3 bg-purple-500 rounded-full"></div>
                                        <div className="w-1 h-3 bg-purple-500 rounded-full opacity-75"></div>
                                        <div className="w-1 h-3 bg-purple-500 rounded-full opacity-50"></div>
                                    </div>
                                    {t('admin.pagination')}
                                </div>
                            </div>
                        </div>

                        <div className="card hover-lift stagger-item">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 font-medium mb-1">
                                        {t('admin.showing')}
                                    </p>
                                    <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                                        {users.length}
                                    </p>
                                </div>
                                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                                    <Filter className="w-6 h-6 text-white" />
                                </div>
                            </div>
                            <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                                <div className="flex items-center text-xs text-green-600 dark:text-green-400">
                                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                                    {t('admin.onThisPage')}
                                </div>
                            </div>
                        </div>

                        <div className="card hover-lift stagger-item">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 font-medium mb-1">
                                        {t('admin.activeFilters')}
                                    </p>
                                    <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                                        {Object.values(filters).filter(v => v !== '').length}
                                    </p>
                                </div>
                                <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
                                    <Filter className="w-6 h-6 text-white" />
                                </div>
                            </div>
                            <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                                <div className="flex items-center text-xs text-amber-600 dark:text-amber-400">
                                    {Object.values(filters).filter(v => v !== '').length > 0 ? (
                                        <>
                                            <div className="w-2 h-2 bg-amber-500 rounded-full mr-2 animate-pulse"></div>
                                            {t('admin.filtersApplied')}
                                        </>
                                    ) : (
                                        <>
                                            <div className="w-2 h-2 bg-gray-400 rounded-full mr-2"></div>
                                            {t('admin.noFilters')}
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Search & Filters */}
                <div className="card stagger-item hover-lift mb-6">
                    <div className="flex flex-col lg:flex-row gap-4">
                        <form onSubmit={handleSearchSubmit} className="flex-1">
                            <div className="relative">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 transition-colors" />
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder={t('admin.searchUsers')}
                                    className="input-field pl-12 transition-smooth"
                                />
                            </div>
                        </form>

                        <button
                            type="submit"
                            onClick={handleSearchSubmit}
                            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-smooth hover-scale"
                        >
                            <Search className="w-5 h-5" />
                        </button>

                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className={`flex items-center justify-center space-x-2 px-6 py-3 rounded-xl font-medium transition-smooth hover-scale ${showFilters
                                    ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg'
                                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                                }`}
                        >
                            <Filter className="w-5 h-5" />
                            <span>{t('admin.filters')}</span>
                        </button>
                    </div>

                    {showFilters && (
                        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700 animate-fadeInDown">
                            <UserFilters
                                filters={filters}
                                onFiltersChange={setFilters}
                                onApply={handleApplyFilters}
                                onReset={handleResetFilters}
                            />
                        </div>
                    )}

                    {/* Active Filters Display */}
                    {Object.values(filters).filter(v => v !== '').length > 0 && (
                        <div className="mt-4 flex items-center gap-2 flex-wrap animate-fadeIn">
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                                {t('admin.activeFilters')}:
                            </span>
                            {filters.role && (
                                <span className="badge badge-primary">
                                    {t('admin.role')}: {filters.role}
                                </span>
                            )}
                            {filters.isActive !== '' && (
                                <span className={`badge ${filters.isActive === 'true'
                                        ? 'badge-success'
                                        : 'bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-400'
                                    }`}>
                                    {filters.isActive === 'true' ? t('admin.active') : t('admin.inactive')}
                                </span>
                            )}
                            {filters.tier && (
                                <span className="badge badge-primary">
                                    {t('admin.tier')}: {filters.tier}
                                </span>
                            )}
                            <button
                                onClick={handleResetFilters}
                                className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors hover-scale ml-2"
                            >
                                {t('admin.clearAll')}
                            </button>
                        </div>
                    )}
                </div>

                {/* Error State */}
                {error && (
                    <div className="card stagger-item border-2 border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20 mb-6 animate-fadeIn">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-red-100 dark:bg-red-900/50 rounded-xl flex items-center justify-center">
                                <UserPlus className="w-5 h-5 text-red-600 dark:text-red-400" />
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

                {/* Users Table */}
                {isLoading ? (
                    <div className="card stagger-item">
                        <div className="py-16">
                            <LoadingSpinner />
                            <p className="text-center text-gray-600 dark:text-gray-400 mt-4">
                                {t('admin.loadingUsers')}
                            </p>
                        </div>
                    </div>
                ) : users.length === 0 ? (
                    <div className="card text-center stagger-item hover-lift">
                        <div className="py-16">
                            <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-cyan-100 dark:from-blue-900/30 dark:to-cyan-900/30 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse shadow-lg">
                                <UserPlus className="w-12 h-12 text-blue-400 dark:text-blue-500" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                                {t('admin.noUsersFound')}
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto mb-6">
                                {searchQuery || Object.values(filters).filter(v => v !== '').length > 0
                                    ? t('admin.noUsersMatchFilter')
                                    : t('admin.noUsersDesc')
                                }
                            </p>
                            {(searchQuery || Object.values(filters).filter(v => v !== '').length > 0) && (
                                <button
                                    onClick={() => {
                                        setSearchQuery('');
                                        handleResetFilters();
                                    }}
                                    className="btn-primary hover-scale inline-flex items-center space-x-2"
                                >
                                    <span>{t('admin.clearFilters')}</span>
                                </button>
                            )}
                        </div>
                    </div>
                ) : (
                    <>
                        {/* Results Summary */}
                        <div className="card stagger-item mb-6">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                    <span className="w-1 h-6 bg-gradient-to-b from-blue-500 to-cyan-500 rounded-full"></span>
                                    <div>
                                        <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                                            {t('admin.usersList')}
                                        </h2>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                            {t('admin.showing')} <span className="font-semibold text-gray-900 dark:text-white">{users.length}</span> {t('admin.of')} {pagination?.totalElements || 0}
                                        </p>
                                    </div>
                                </div>
                                {searchQuery && (
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm text-gray-600 dark:text-gray-400">
                                            {t('admin.searchResults')}
                                        </span>
                                        <span className="badge badge-primary">
                                            "{searchQuery}"
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="stagger-item animate-fadeIn">
                            <UserTable
                                users={users}
                                onViewDetail={setSelectedUser}
                                onToggleActive={handleToggleActive}
                                onChangeRole={handleChangeRole}
                                onDelete={handleDeleteUser}
                            />
                        </div>

                        {/* Pagination */}
                        {pagination && pagination.totalPages > 1 && (
                            <div className="mt-6 flex justify-center stagger-item">
                                <div className="card inline-block">
                                    <Pagination
                                        currentPage={currentPage}
                                        totalPages={pagination.totalPages}
                                        onPageChange={handlePageChange}
                                    />
                                </div>
                            </div>
                        )}

                        {/* Bottom Stats */}
                        <div className="card stagger-item bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-gray-800 dark:to-gray-800 border-2 border-blue-200 dark:border-blue-800 mt-6">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center shadow-lg">
                                        <UserPlus className="w-5 h-5 text-white" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-gray-900 dark:text-white">
                                            {t('admin.usersOverview')}
                                        </p>
                                        <p className="text-xs text-gray-600 dark:text-gray-400">
                                            {pagination?.totalElements || 0} {t('admin.totalUsers')}
                                        </p>
                                    </div>
                                </div>
                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                    {t('admin.page')} <span className="font-semibold text-gray-900 dark:text-white">{currentPage + 1}</span> {t('admin.of')} {pagination?.totalPages || 1}
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>

            {/* User Detail Modal với backdrop blur */}
            {selectedUser && (
                <div className="fixed inset-0 z-50 overflow-y-auto animate-fadeIn">
                    <div className="flex min-h-screen items-center justify-center p-4">
                        <div
                            className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
                            onClick={() => setSelectedUser(null)}
                        ></div>
                        <div className="relative animate-scaleIn w-full max-w-4xl">
                            <UserDetailModal
                                userId={selectedUser}
                                onClose={() => setSelectedUser(null)}
                                onUpdate={refetch}
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}