import {
    Users,
    BookOpen,
    ShoppingCart,
    TrendingUp,
    Calendar,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAdminStats } from '../../hooks/admin/useAdminStats';
import { useAdmin } from '../../context/AdminContext';
import StatsCard from '../../components/admin/dashboard/StatsCard';
import RecentActivity from '../../components/admin/dashboard/RecentActivity';
import QuickActions from '../../components/admin/dashboard/QuickActions';
import RevenueChart from '../../components/admin/dashboard/RevenueChart';
import TopBooks from '../../components/admin/dashboard/TopBooks';
import LoadingSpinner from '../../components/admin/common/LoadingSpinner';

export default function AdminDashboard() {
    const { user } = useAdmin();
    const { stats, isLoading, error } = useAdminStats();
    const { t, i18n } = useTranslation();

    // Loading state - chỉ hiển thị trong content area
    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-amber-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
                <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 h-32 animate-fadeInDown"></div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="card p-12 text-center animate-pulse">
                        <LoadingSpinner />
                        <p className="mt-4 text-gray-600 dark:text-gray-400">
                            {t('common.loading')}
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    // Error state
    if (error || !stats) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-amber-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
                <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 h-32 animate-fadeInDown"></div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="card p-8 text-center animate-scaleIn border-l-4 border-red-500 dark:border-red-600">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 dark:bg-red-900/40 rounded-full mb-4">
                            <span className="text-3xl">⚠️</span>
                        </div>
                        <p className="text-xl text-red-600 dark:text-red-400 font-semibold mb-2">
                            {t('common.error')}
                        </p>
                        <p className="text-gray-600 dark:text-gray-300">{error}</p>
                        <button
                            onClick={() => window.location.reload()}
                            className="btn-primary mt-6"
                        >
                            {t('common.retry')}
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // Tính % tăng trưởng (giả định so với tháng trước)
    const calculateGrowth = (current: number, previous: number) => {
        if (previous === 0) return '+100%';
        const growth = ((current - previous) / previous) * 100;
        return `${growth >= 0 ? '+' : ''}${growth.toFixed(1)}%`;
    };

    const statsCards = [
        {
            label: t('admin.totalUsers'),
            value: stats.totalUsers.toLocaleString(),
            change: calculateGrowth(stats.totalUsers, Math.floor(stats.totalUsers * 0.9)),
            changeType: 'increase' as const,
            icon: Users,
            colorClass: 'from-blue-500 to-cyan-500',
            description: t('admin.newUsersThisMonth')
        },
        {
            label: t('admin.totalBooks'),
            value: stats.totalBooks.toLocaleString(),
            change: calculateGrowth(stats.totalBooks, Math.floor(stats.totalBooks * 0.95)),
            changeType: 'increase' as const,
            icon: BookOpen,
            colorClass: 'from-amber-500 to-orange-500',
            description: t('admin.booksInStock')
        },
        {
            label: t('admin.totalOrders'),
            value: stats.totalOrders.toLocaleString(),
            change: calculateGrowth(stats.monthlyOrders, Math.floor(stats.monthlyOrders * 0.92)),
            changeType: 'increase' as const,
            icon: ShoppingCart,
            colorClass: 'from-green-500 to-emerald-500',
            description: `${stats.monthlyOrders} ${t('admin.ordersThisMonth')}`
        },
        {
            label: t('admin.revenue'),
            value: `$${stats.totalRevenue.toLocaleString()}`,
            change: calculateGrowth(stats.monthlyRevenue, Math.floor(stats.monthlyRevenue * 0.85)),
            changeType: 'increase' as const,
            icon: TrendingUp,
            colorClass: 'from-purple-500 to-pink-500',
            description: `$${stats.monthlyRevenue.toLocaleString()} ${t('admin.thisMonth')}`
        }
    ];

    const firstName = user?.fullName?.split(' ')[0] || 'Admin';

    // Lấy locale từ i18n.language: 'vi' hoặc 'en'
    const locale = i18n.language === 'vi' ? 'vi-VN' : 'en-US';
    const currentDate = new Date().toLocaleDateString(locale, {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    return (
        <div className="min-h-screen bg-gradient-to-br from-amber-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
            {/* Welcome Header với gradient animation */}
            <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-white animate-fadeInDown">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
                    <div className="animate-fadeInLeft">
                        <div className="flex items-center space-x-2 text-amber-100 mb-2">
                            <Calendar className="w-4 h-4" />
                            <span className="text-sm font-medium">{currentDate}</span>
                        </div>
                        <h1 className="text-3xl md:text-4xl font-bold mb-2">
                            {t('admin.welcomeBack', { name: firstName })} 👋
                        </h1>
                        <p className="text-amber-100 text-lg">
                            {t('admin.storeOverview')}
                        </p>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
                {/* Stats Grid với stagger animation */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {statsCards.map((stat, index) => (
                        <div
                            key={stat.label}
                            className="stagger-item"
                        >
                            <StatsCard {...stat} />
                        </div>
                    ))}
                </div>

                {/* Charts Section với fade in */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 animate-fadeInUp">
                        <RevenueChart dailyRevenue={stats.dailyRevenue} />
                    </div>
                    <div className="animate-fadeInUp" style={{ animationDelay: '0.1s' }}>
                        <TopBooks topBooks={stats.topSellingBooks || []} />
                    </div>
                </div>

                {/* Activity & Actions với fade in */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
                        <RecentActivity ordersByStatus={stats.ordersByStatus} />
                    </div>
                    <div className="animate-fadeInUp" style={{ animationDelay: '0.3s' }}>
                        <QuickActions />
                    </div>
                </div>
            </div>
        </div>
    );
}