import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
    BarChart3,
    TrendingUp,
    Calendar,
    DollarSign,
    Package,
    Users,
    Star
} from 'lucide-react';
import { useAdminReports } from '../../../hooks/admin/useAdminReports';
import LoadingSpinner from '../../../components/admin/common/LoadingSpinner';
import RevenueReport from '../../../components/admin/reports/RevenueReport';
import ProductReport from '../../../components/admin/reports/ProductReport';
import CustomerReport from '../../../components/admin/reports/CustomerReport';
import ReviewReport from '../../../components/admin/reports/ReviewReport';
import DateRangePicker from '../../../components/admin/reports/DateRangePicker';
import ExportButtons from '../../../components/admin/reports/ExportButtons';

type ReportTab = 'revenue' | 'product' | 'customer' | 'review';

export default function AdminReports() {
    const { t } = useTranslation();
    const [activeTab, setActiveTab] = useState<ReportTab>('revenue');
    const [dateRange, setDateRange] = useState({
        startDate: new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().split('T')[0],
        endDate: new Date().toISOString().split('T')[0]
    });

    const {
        revenueData,
        productData,
        customerData,
        reviewData,
        isLoading,
        error,
        exportExcel,
        exportPDF,
        refetch
    } = useAdminReports(dateRange);

    const handleDateRangeChange = (start: string, end: string) => {
        setDateRange({ startDate: start, endDate: end });
        refetch();
    };

    const handleExport = async (format: 'excel' | 'pdf') => {
        if (format === 'excel') {
            await exportExcel(activeTab);
        } else {
            await exportPDF(activeTab);
        }
    };

    if (isLoading && !revenueData) {
        return <LoadingSpinner fullScreen message={t('common.loading')} />;
    }

    const tabs = [
        {
            id: 'revenue' as const,
            label: t('admin.revenueReport'),
            icon: DollarSign,
            color: 'from-green-500 to-emerald-500'
        },
        {
            id: 'product' as const,
            label: t('admin.productReport'),
            icon: Package,
            color: 'from-blue-500 to-cyan-500'
        },
        {
            id: 'customer' as const,
            label: t('admin.customerReport'),
            icon: Users,
            color: 'from-purple-500 to-pink-500'
        },
        {
            id: 'review' as const,
            label: t('admin.reviewReport'),
            icon: Star,
            color: 'from-amber-500 to-orange-500'
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-amber-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
            {/* Header với gradient animation và shimmer effect */}
            <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white shadow-2xl animate-fadeInDown relative overflow-hidden">
                {/* Animated background pattern */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent animate-shimmer"></div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative">
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center animate-pulse shadow-lg">
                                    <BarChart3 className="w-7 h-7" />
                                </div>
                                <h1 className="text-3xl font-bold">
                                    {t('admin.reportsAnalytics')}
                                </h1>
                            </div>
                            <p className="text-blue-100 animate-fadeIn">
                                {t('admin.detailedBusinessInsights')}
                            </p>
                        </div>
                        <div className="hidden md:block">
                            <div className="relative">
                                <TrendingUp className="w-20 h-20 opacity-20 animate-pulse" />
                                <div className="absolute inset-0 bg-gradient-to-t from-transparent to-white/10 rounded-full blur-xl"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
                {/* Date Range & Export Controls */}
                <div className="card stagger-item hover-lift">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                                <Calendar className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <p className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                                    {t('admin.dateRange')}
                                </p>
                                <DateRangePicker
                                    startDate={dateRange.startDate}
                                    endDate={dateRange.endDate}
                                    onChange={handleDateRangeChange}
                                />
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-600 dark:text-gray-400 mr-2">
                                {t('admin.exportAs')}:
                            </span>
                            <ExportButtons onExport={handleExport} />
                        </div>
                    </div>
                </div>

                {/* Tabs với enhanced styling */}
                <div className="stagger-item">
                    <div className="card overflow-hidden">
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 p-2">
                            {tabs.map((tab, index) => {
                                const Icon = tab.icon;
                                const isActive = activeTab === tab.id;

                                return (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`relative p-4 rounded-xl transition-smooth hover-scale ${isActive
                                                ? `bg-gradient-to-r ${tab.color} text-white shadow-lg`
                                                : 'bg-gray-50 dark:bg-gray-700/50 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                                            }`}
                                        style={{ animationDelay: `${index * 0.1}s` }}
                                    >
                                        <div className="flex flex-col items-center space-y-2">
                                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-smooth ${isActive
                                                    ? 'bg-white/20 backdrop-blur-sm'
                                                    : 'bg-gray-200 dark:bg-gray-600'
                                                }`}>
                                                <Icon className="w-6 h-6" />
                                            </div>
                                            <span className="text-sm font-semibold text-center">
                                                {tab.label}
                                            </span>
                                        </div>

                                        {/* Active indicator */}
                                        {isActive && (
                                            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-1 bg-white rounded-t-full animate-fadeIn"></div>
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Quick Stats Overview */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 stagger-item">
                    <div className="card hover-lift">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600 dark:text-gray-400 font-medium mb-1">
                                    {t('admin.totalRevenue')}
                                </p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                    {revenueData?.totalRevenue
                                        ? new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(revenueData.totalRevenue)
                                        : '---'
                                    }
                                </p>
                            </div>
                            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg animate-pulse">
                                <DollarSign className="w-6 h-6 text-white" />
                            </div>
                        </div>
                    </div>

                    <div className="card hover-lift">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600 dark:text-gray-400 font-medium mb-1">
                                    {t('admin.totalOrders')}
                                </p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                    {revenueData?.totalOrders || '---'}
                                </p>
                            </div>
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center shadow-lg">
                                <Package className="w-6 h-6 text-white" />
                            </div>
                        </div>
                    </div>

                    <div className="card hover-lift">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600 dark:text-gray-400 font-medium mb-1">
                                    {t('admin.totalCustomers')}
                                </p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                    {customerData?.totalCustomers || '---'}
                                </p>
                            </div>
                            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg">
                                <Users className="w-6 h-6 text-white" />
                            </div>
                        </div>
                    </div>

                    <div className="card hover-lift">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600 dark:text-gray-400 font-medium mb-1">
                                    {t('admin.averageRating')}
                                </p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                    {reviewData?.averageRating
                                        ? reviewData.averageRating.toFixed(1)
                                        : '---'
                                    }
                                </p>
                            </div>
                            <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
                                <Star className="w-6 h-6 text-white" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Error State */}
                {error && (
                    <div className="card stagger-item border-2 border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20 animate-fadeIn">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-red-100 dark:bg-red-900/50 rounded-xl flex items-center justify-center">
                                <TrendingUp className="w-5 h-5 text-red-600 dark:text-red-400" />
                            </div>
                            <div>
                                <p className="font-semibold text-red-900 dark:text-red-300">
                                    {t('admin.reportError')}
                                </p>
                                <p className="text-sm text-red-700 dark:text-red-400">{error}</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Report Content với animations */}
                <div className="stagger-item">
                    {isLoading ? (
                        <div className="card">
                            <div className="py-16">
                                <LoadingSpinner />
                                <p className="text-center text-gray-600 dark:text-gray-400 mt-4">
                                    {t('admin.loadingReportData')}
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div className="animate-fadeIn">
                            {activeTab === 'revenue' && revenueData && (
                                <div className="space-y-6">
                                    {/* Report Header */}
                                    <div className="card border-l-4 border-green-500">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                                                <DollarSign className="w-6 h-6 text-white" />
                                            </div>
                                            <div>
                                                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                                                    {t('admin.revenueReport')}
                                                </h2>
                                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                                    {dateRange.startDate} - {dateRange.endDate}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    <RevenueReport data={revenueData} dateRange={dateRange} />
                                </div>
                            )}

                            {activeTab === 'product' && productData && (
                                <div className="space-y-6">
                                    <div className="card border-l-4 border-blue-500">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center shadow-lg">
                                                <Package className="w-6 h-6 text-white" />
                                            </div>
                                            <div>
                                                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                                                    {t('admin.productReport')}
                                                </h2>
                                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                                    {t('admin.productPerformanceAnalysis')}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    <ProductReport data={productData} />
                                </div>
                            )}

                            {activeTab === 'customer' && customerData && (
                                <div className="space-y-6">
                                    <div className="card border-l-4 border-purple-500">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg">
                                                <Users className="w-6 h-6 text-white" />
                                            </div>
                                            <div>
                                                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                                                    {t('admin.customerReport')}
                                                </h2>
                                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                                    {t('admin.customerBehaviorInsights')}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    <CustomerReport data={customerData} />
                                </div>
                            )}

                            {activeTab === 'review' && reviewData && (
                                <div className="space-y-6">
                                    <div className="card border-l-4 border-amber-500">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
                                                <Star className="w-6 h-6 text-white" />
                                            </div>
                                            <div>
                                                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                                                    {t('admin.reviewReport')}
                                                </h2>
                                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                                    {t('admin.customerFeedbackAnalysis')}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    <ReviewReport data={reviewData} />
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Report Footer Info */}
                {!isLoading && (
                    <div className="card stagger-item bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-800 border-2 border-blue-200 dark:border-blue-800">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                                    <BarChart3 className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-gray-900 dark:text-white">
                                        {t('admin.reportGenerated')}
                                    </p>
                                    <p className="text-xs text-gray-600 dark:text-gray-400">
                                        {new Date().toLocaleString('vi-VN')}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-2">
                                <span className="badge badge-primary">
                                    {tabs.find(tab => tab.id === activeTab)?.label}
                                </span>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}