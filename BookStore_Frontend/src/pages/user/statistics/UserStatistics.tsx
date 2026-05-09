import { useState } from 'react';
import { BarChart3, LineChart as LineChartIcon, RefreshCw, Download } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { StatsOverview } from '../../../components/user/statistics/StatsOverview';
import { SpendingChart } from '../../../components/user/statistics/SpendingChart';
import { OrderStatusBreakdown } from '../../../components/user/statistics/OrderStatusBreakdown';
import { CategoryBreakdown } from '../../../components/user/statistics/CategoryBreakdown';
import LoadingSpinner from '../../../components/user/common/LoadingSpinner';
import { useUserStatistics } from '../../../hooks/user/useUserStatistics';
import type { SpendingPeriod } from '../../../types/user_statistics.types';

const UserStatistics = () => {
    const { t } = useTranslation();
    const [selectedPeriod, setSelectedPeriod] = useState<SpendingPeriod['value']>('all');
    const [chartType, setChartType] = useState<'line' | 'bar'>('line');

    const periodInMonths = selectedPeriod === 'all' ? null :
        selectedPeriod === '3months' ? 3 :
            selectedPeriod === '6months' ? 6 : 12;

    const {
        statistics,
        loading,
        error,
        refetch,
    } = useUserStatistics(periodInMonths);

    const periods: SpendingPeriod[] = [
        { label: t('UserStatistics.periods.all'), value: 'all' },
        { label: t('UserStatistics.periods.3months'), value: '3months' },
        { label: t('UserStatistics.periods.6months'), value: '6months' },
        { label: t('UserStatistics.periods.12months'), value: '12months' },
    ];

    const handleExport = () => {
        if (!statistics) return;

        const data = {
            exportDate: new Date().toISOString(),
            period: selectedPeriod,
            summary: {
                totalOrders: statistics.totalOrders,
                totalSpent: statistics.totalSpent,
                totalBooks: statistics.totalBooks,
                totalReviews: statistics.totalReviews,
                averageOrderValue: statistics.averageOrderValue,
            },
            monthlySpending: statistics.monthlySpending,
            ordersByStatus: statistics.ordersByStatus,
            topCategories: statistics.topCategories,
        };

        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `statistics-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    if (loading) {
        return <LoadingSpinner fullScreen />;
    }

    if (error || !statistics) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center space-y-4">
                    <p className="text-xl text-red-600 dark:text-red-400">
                        {error || t('UserStatistics.loadError')}
                    </p>
                    <button
                        onClick={() => refetch()}
                        className="px-6 py-3 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors"
                    >
                        {t('UserStatistics.tryAgain')}
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
            <div className="container mx-auto px-4 py-8">
                {/* Header */}
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-4xl font-serif font-bold text-gray-900 dark:text-white mb-2">
                            {t('UserStatistics.title')}
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400">
                            {t('UserStatistics.subtitle')}
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                        {/* Period Filter */}
                        <div className="flex items-center gap-2 bg-white dark:bg-gray-800 rounded-xl p-1 shadow-lg border border-gray-200 dark:border-gray-700">
                            {periods.map((period) => (
                                <button
                                    key={period.value}
                                    onClick={() => setSelectedPeriod(period.value)}
                                    className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${selectedPeriod === period.value
                                        ? 'bg-amber-500 text-white shadow-md'
                                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                                        }`}
                                >
                                    {period.label}
                                </button>
                            ))}
                        </div>

                        {/* Chart Type Toggle */}
                        <div className="flex items-center gap-2 bg-white dark:bg-gray-800 rounded-xl p-1 shadow-lg border border-gray-200 dark:border-gray-700">
                            <button
                                onClick={() => setChartType('line')}
                                className={`p-2 rounded-lg transition-all ${chartType === 'line'
                                    ? 'bg-amber-500 text-white'
                                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                                    }`}
                                title={t('UserStatistics.chart.line')}
                            >
                                <LineChartIcon className="w-5 h-5" />
                            </button>
                            <button
                                onClick={() => setChartType('bar')}
                                className={`p-2 rounded-lg transition-all ${chartType === 'bar'
                                    ? 'bg-amber-500 text-white'
                                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                                    }`}
                                title={t('UserStatistics.chart.bar')}
                            >
                                <BarChart3 className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Actions */}
                        <button
                            onClick={() => refetch()}
                            className="p-2.5 bg-white dark:bg-gray-800 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors shadow-lg border border-gray-200 dark:border-gray-700"
                            title={t('UserStatistics.refresh')}
                        >
                            <RefreshCw className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                        </button>

                        <button
                            onClick={handleExport}
                            className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all shadow-lg font-medium"
                        >
                            <Download className="w-5 h-5" />
                            <span className="hidden sm:inline">
                                {t('UserStatistics.export')}
                            </span>
                        </button>
                    </div>
                </div>

                {/* Stats Overview */}
                <div className="mb-8">
                    <StatsOverview statistics={statistics} />
                </div>

                {/* Charts Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                    <div className="lg:col-span-2">
                        <SpendingChart
                            data={statistics.monthlySpending}
                            chartType={chartType}
                        />
                    </div>

                    <div className="lg:col-span-1">
                        <OrderStatusBreakdown data={statistics.ordersByStatus} />
                    </div>
                </div>

                {/* Category Breakdown */}
                <div className="mb-8">
                    <CategoryBreakdown data={statistics.topCategories} />
                </div>

                {/* About Section */}
                <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-gray-800 dark:to-gray-700 rounded-2xl p-6 border border-amber-200 dark:border-amber-800">
                    <div className="flex items-start gap-4">
                        <div className="p-3 bg-amber-500 rounded-xl">
                            <BarChart3 className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                                {t('UserStatistics.about.title')}
                            </h3>
                            <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                                {t('UserStatistics.about.description')}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserStatistics;