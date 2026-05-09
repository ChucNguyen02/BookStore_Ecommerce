import { useState, useMemo } from 'react';
import { Bell, Trash2, CheckCheck, ChevronLeft, ChevronRight } from 'lucide-react';
import { NotificationCard, NotificationFilter } from '../../../components/user/notifications';
import LoadingSpinner from '../../../components/user/common/LoadingSpinner';
import { useNotifications } from '../../../hooks/user/useNotifications';
import { NotificationType } from '../../../types/enum';
import { useTranslation } from 'react-i18next';

const Notifications = () => {
    const { t } = useTranslation();
    const {
        notifications,
        summary,
        loading,
        error,
        updating,
        currentPage,
        totalPages,
        totalElements,
        markAsRead,
        markAllAsRead,
        deleteNotification,
        deleteAllNotifications,
        loadPage,
        fetchUnreadNotifications,
        refetch,
    } = useNotifications();

    const [activeFilter, setActiveFilter] = useState<NotificationType | 'all' | 'unread'>('all');

    const filteredNotifications = useMemo(() => {
        if (activeFilter === 'all') return notifications;
        if (activeFilter === 'unread') return notifications.filter(n => !n.isRead);
        return notifications.filter(n => n.type === activeFilter);
    }, [notifications, activeFilter]);

    const handleFilterChange = (filter: NotificationType | 'all' | 'unread') => {
        setActiveFilter(filter);
        if (filter === 'unread') {
            fetchUnreadNotifications(0);
        } else if (filter === 'all') {
            refetch();
        }
    };

    const handleDeleteAll = async () => {
        if (window.confirm(t('Notifications.confirmDeleteAll'))) {
            await deleteAllNotifications();
        }
    };

    const handlePageChange = (newPage: number) => {
        loadPage(newPage);
    };

    const getPaginationNumbers = () => {
        const delta = 2;
        const range: number[] = [];

        for (
            let i = Math.max(0, currentPage - delta);
            i <= Math.min(totalPages - 1, currentPage + delta);
            i++
        ) {
            range.push(i);
        }

        return range;
    };

    if (loading) {
        return <LoadingSpinner fullScreen />;
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center space-y-4">
                    <p className="text-xl text-red-600 dark:text-red-400">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="px-6 py-3 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors"
                    >
                        {t('Notifications.error.tryAgain')}
                    </button>
                </div>
            </div>
        );
    }

    if (notifications.length === 0 && activeFilter === 'all') {
        return (
            <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
                <div className="container mx-auto px-4 py-16">
                    <div className="text-center space-y-6">
                        <Bell className="w-24 h-24 text-gray-400 dark:text-gray-600 mx-auto" />
                        <h2 className="text-3xl font-serif font-bold text-gray-900 dark:text-white">
                            {t('Notifications.empty.title')}
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
                            {t('Notifications.empty.description')}
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
            <div className="container mx-auto px-4 py-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
                    <div>
                        <h1 className="text-4xl font-serif font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-3">
                            <Bell className="w-10 h-10 text-blue-600 dark:text-blue-400" />
                            {t('Notifications.title')}
                        </h1>
                        {summary && (
                            <p className="text-gray-600 dark:text-gray-400">
                                {t('Notifications.total', { count: totalElements })}
                                {summary.unreadCount > 0 && (
                                    <span className="ml-2 px-2 py-0.5 bg-red-500 text-white text-xs font-semibold rounded-full">
                                        {t('Notifications.unreadBadge', { count: summary.unreadCount })}
                                    </span>
                                )}
                            </p>
                        )}
                    </div>

                    <div className="flex items-center gap-4">
                        {summary && summary.unreadCount > 0 && (
                            <button
                                onClick={markAllAsRead}
                                disabled={updating}
                                className="flex items-center gap-2 px-6 py-3 border-2 border-green-300 dark:border-green-700 text-green-600 dark:text-green-400 rounded-xl hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors font-medium disabled:opacity-50"
                            >
                                <CheckCheck className="w-5 h-5" />
                                {t('Notifications.actions.readAll')}
                            </button>
                        )}

                        {notifications.length > 0 && (
                            <button
                                onClick={handleDeleteAll}
                                disabled={updating}
                                className="flex items-center gap-2 px-6 py-3 border-2 border-red-300 dark:border-red-700 text-red-600 dark:text-red-400 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors font-medium disabled:opacity-50"
                            >
                                <Trash2 className="w-5 h-5" />
                                {t('Notifications.actions.deleteAll')}
                            </button>
                        )}
                    </div>
                </div>

                {/* Statistics */}
                {summary && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        <div className="bg-gradient-to-br from-blue-500 to-cyan-500 text-white rounded-2xl p-6 shadow-lg">
                            <div className="flex items-center justify-between mb-2">
                                <Bell className="w-8 h-8" />
                                <span className="text-2xl font-bold">{summary.totalCount}</span>
                            </div>
                            <p className="text-sm opacity-90">
                                {t('Notifications.stats.total')}
                            </p>
                        </div>

                        <div className="bg-gradient-to-br from-red-500 to-pink-500 text-white rounded-2xl p-6 shadow-lg">
                            <div className="flex items-center justify-between mb-2">
                                <Bell className="w-8 h-8" />
                                <span className="text-2xl font-bold">{summary.unreadCount}</span>
                            </div>
                            <p className="text-sm opacity-90">
                                {t('Notifications.stats.unread')}
                            </p>
                        </div>
                    </div>
                )}

                {/* Main Content */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    {/* Filter Sidebar */}
                    <div className="lg:col-span-1">
                        <NotificationFilter
                            activeFilter={activeFilter}
                            onFilterChange={handleFilterChange}
                        />
                    </div>

                    {/* Notifications List */}
                    <div className="lg:col-span-3">
                        {filteredNotifications.length > 0 ? (
                            <>
                                <div className="space-y-4">
                                    {filteredNotifications.map((notification) => (
                                        <NotificationCard
                                            key={notification.id}
                                            notification={notification}
                                            onMarkRead={markAsRead}
                                            onDelete={deleteNotification}
                                        />
                                    ))}
                                </div>

                                {/* Pagination */}
                                {totalPages > 1 && (
                                    <div className="mt-8 flex items-center justify-center gap-2 flex-wrap">
                                        <button
                                            onClick={() => handlePageChange(currentPage - 1)}
                                            disabled={currentPage === 0}
                                            className="px-4 py-2 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-amber-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                                        >
                                            <ChevronLeft className="w-5 h-5" />
                                            {t('Notifications.pagination.previous')}
                                        </button>

                                        <div className="flex items-center gap-2">
                                            {getPaginationNumbers().map((pageNum) => (
                                                <button
                                                    key={pageNum}
                                                    onClick={() => handlePageChange(pageNum)}
                                                    className={`w-10 h-10 rounded-lg font-medium transition-colors ${
                                                        currentPage === pageNum
                                                            ? 'bg-amber-500 text-white'
                                                            : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-amber-50 dark:hover:bg-gray-700'
                                                    }`}
                                                >
                                                    {pageNum + 1}
                                                </button>
                                            ))}
                                        </div>

                                        <button
                                            onClick={() => handlePageChange(currentPage + 1)}
                                            disabled={currentPage >= totalPages - 1}
                                            className="px-4 py-2 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-amber-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                                        >
                                            {t('Notifications.pagination.next')}
                                            <ChevronRight className="w-5 h-5" />
                                        </button>
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-2xl">
                                <Bell className="w-16 h-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
                                <p className="text-gray-500 dark:text-gray-400 text-lg">
                                    {t('Notifications.emptyFiltered')}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Notifications;