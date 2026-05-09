import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
    DollarSign,
    TrendingUp,
    ShoppingCart,
    CreditCard,
    PieChart
} from 'lucide-react';
import {
    LineChart,
    Line,
    BarChart,
    Bar,
    PieChart as RechartsPieChart,
    Pie,
    Cell,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer
} from 'recharts';

interface RevenueReportProps {
    data: {
        summary: {
            totalRevenue: number;
            totalOrders: number;
            averageOrderValue: number;
            revenueGrowth: number;
        };
        dailyRevenue: Record<string, number>;
        categoryRevenue: Array<{
            categoryId: string;
            categoryName: string;
            revenue: number;
            orderCount: number;
        }>;
        paymentMethodRevenue: Array<{
            method: string;
            revenue: number;
            orderCount: number;
            percentage: number;
        }>;
        comparison: {
            previousPeriod: number;
            currentPeriod: number;
            growthRate: number;
        };
    };
    dateRange: { startDate: string; endDate: string };
}

export default function RevenueReport({ data }: RevenueReportProps) {
    const { t } = useTranslation();
    const [chartView, setChartView] = useState<'daily' | 'category'>('daily');

    const { summary, dailyRevenue, categoryRevenue, paymentMethodRevenue, comparison } = data;

    // Format daily revenue for chart
    const dailyChartData = Object.entries(dailyRevenue).map(([date, revenue]) => ({
        date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        revenue: revenue,
        orders: Math.floor(revenue / summary.averageOrderValue)
    }));

    // Colors for charts
    const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];


    const StatCard = ({ label, value, change, icon: Icon, colorClass }: any) => (
        <div className="card hover-lift">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 font-medium mb-1">
                        {label}
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        {value}
                    </p>
                </div>
                <div className={`w-12 h-12 bg-gradient-to-br ${colorClass} rounded-xl flex items-center justify-center shadow-lg`}>
                    <Icon className="w-6 h-6 text-white" />
                </div>
            </div>
            {change !== undefined && (
                <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-2">
                        <TrendingUp className={`w-4 h-4 ${change >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`} />
                        <span className={`text-sm font-semibold ${change >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                            {change >= 0 ? '+' : ''}{change.toFixed(1)}%
                        </span>
                    </div>
                </div>
            )}
        </div>
    );

    return (
        <div className="space-y-6">
            {/* Summary Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="stagger-item">
                    <StatCard
                        label={t('admin.totalRevenue')}
                        value={`$${summary.totalRevenue.toLocaleString()}`}
                        change={summary.revenueGrowth}
                        icon={DollarSign}
                        colorClass="from-green-500 to-emerald-600"
                    />
                </div>
                <div className="stagger-item">
                    <StatCard
                        label={t('admin.totalOrders')}
                        value={summary.totalOrders.toLocaleString()}
                        icon={ShoppingCart}
                        colorClass="from-blue-500 to-cyan-600"
                    />
                </div>
                <div className="stagger-item">
                    <StatCard
                        label={t('admin.avgOrderValue')}
                        value={`$${summary.averageOrderValue.toFixed(2)}`}
                        icon={CreditCard}
                        colorClass="from-purple-500 to-pink-600"
                    />
                </div>
                <div className="stagger-item">
                    <StatCard
                        label={t('admin.growthRate')}
                        value={`${comparison.growthRate.toFixed(1)}%`}
                        change={comparison.growthRate}
                        icon={TrendingUp}
                        colorClass="from-amber-500 to-orange-600"
                    />
                </div>
            </div>

            {/* Main Chart */}
            <div className="card stagger-item hover-lift border-l-4 border-blue-500">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center shadow-lg">
                            <TrendingUp className="w-5 h-5 text-white" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                            {t('admin.revenueOverTime')}
                        </h3>
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setChartView('daily')}
                            className={`px-4 py-2 rounded-xl font-semibold transition-smooth hover-scale ${chartView === 'daily'
                                    ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg'
                                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                                }`}
                        >
                            {t('admin.daily')}
                        </button>
                        <button
                            onClick={() => setChartView('category')}
                            className={`px-4 py-2 rounded-xl font-semibold transition-smooth hover-scale ${chartView === 'category'
                                    ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg'
                                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                                }`}
                        >
                            {t('admin.byCategory')}
                        </button>
                    </div>
                </div>

                <ResponsiveContainer width="100%" height={400}>
                    {chartView === 'daily' ? (
                        <LineChart data={dailyChartData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
                            <XAxis dataKey="date" stroke="#9CA3AF" style={{ fontSize: '12px' }} />
                            <YAxis stroke="#9CA3AF" style={{ fontSize: '12px' }} tickFormatter={(value) => `$${value}`} />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: '#1F2937',
                                    border: 'none',
                                    borderRadius: '0.75rem',
                                    color: '#fff',
                                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                                }}
                                formatter={(value: any) => [`$${value}`, 'Revenue']}
                            />
                            <Legend />
                            <Line
                                type="monotone"
                                dataKey="revenue"
                                stroke="url(#blueGradient)"
                                strokeWidth={3}
                                dot={{ fill: '#3B82F6', r: 5, strokeWidth: 2, stroke: '#fff' }}
                                activeDot={{ r: 7, strokeWidth: 3, stroke: '#fff' }}
                            />
                            <defs>
                                <linearGradient id="blueGradient" x1="0" y1="0" x2="1" y2="0">
                                    <stop offset="0%" stopColor="#3B82F6" />
                                    <stop offset="100%" stopColor="#06B6D4" />
                                </linearGradient>
                            </defs>
                        </LineChart>
                    ) : (
                        <BarChart data={categoryRevenue}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
                            <XAxis dataKey="categoryName" stroke="#9CA3AF" style={{ fontSize: '12px' }} />
                            <YAxis stroke="#9CA3AF" style={{ fontSize: '12px' }} tickFormatter={(value) => `$${value}`} />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: '#1F2937',
                                    border: 'none',
                                    borderRadius: '0.75rem',
                                    color: '#fff',
                                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                                }}
                                formatter={(value: any) => [`$${value}`, 'Revenue']}
                            />
                            <Legend />
                            <Bar dataKey="revenue" fill="url(#barGradient)" radius={[8, 8, 0, 0]} />
                            <defs>
                                <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#3B82F6" />
                                    <stop offset="100%" stopColor="#06B6D4" />
                                </linearGradient>
                            </defs>
                        </BarChart>
                    )}
                </ResponsiveContainer>
            </div>

            {/* Revenue by Category & Payment Method */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Category Breakdown */}
                <div className="card stagger-item hover-lift border-l-4 border-purple-500">
                    <div className="flex items-center space-x-3 mb-6">
                        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg">
                            <PieChart className="w-5 h-5 text-white" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                            {t('admin.revenueByCategory')}
                        </h3>
                    </div>
                    <div className="space-y-4">
                        {categoryRevenue.slice(0, 5).map((cat, index) => (
                            <div key={cat.categoryId} className="space-y-2 animate-fadeInUp" style={{ animationDelay: `${index * 0.1}s` }}>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-semibold text-gray-900 dark:text-white">
                                        {cat.categoryName}
                                    </span>
                                    <span className="text-sm font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                                        ${cat.revenue.toLocaleString()}
                                    </span>
                                </div>
                                <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                    <div
                                        className="h-full rounded-full transition-all duration-500"
                                        style={{
                                            width: `${(cat.revenue / categoryRevenue[0].revenue) * 100}%`,
                                            backgroundColor: COLORS[index % COLORS.length]
                                        }}
                                    />
                                </div>
                                <p className="text-xs text-gray-600 dark:text-gray-400 flex items-center gap-1">
                                    <ShoppingCart className="w-3 h-3" />
                                    {cat.orderCount} {t('admin.orders')}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Payment Method Breakdown */}
                <div className="card stagger-item hover-lift border-l-4 border-amber-500">
                    <div className="flex items-center space-x-3 mb-6">
                        <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
                            <CreditCard className="w-5 h-5 text-white" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                            {t('admin.revenueByPaymentMethod')}
                        </h3>
                    </div>
                    <ResponsiveContainer width="100%" height={250}>
                        <RechartsPieChart>
                            <Pie
                                data={paymentMethodRevenue}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={(props: any) => `${props.method} (${props.percentage.toFixed(1)}%)`}
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="revenue"
                            >
                                {paymentMethodRevenue.map((_entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: '#1F2937',
                                    border: 'none',
                                    borderRadius: '0.75rem',
                                    color: '#fff',
                                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                                }}
                                formatter={(value: any) => `$${value.toLocaleString()}`}
                            />
                        </RechartsPieChart>
                    </ResponsiveContainer>
                    <div className="mt-4 space-y-2">
                        {paymentMethodRevenue.map((method, index) => (
                            <div key={method.method} className="flex items-center justify-between p-2 bg-gradient-to-r from-gray-50 to-white dark:from-gray-700/50 dark:to-gray-700/30 rounded-lg hover-scale animate-fadeInUp" style={{ animationDelay: `${index * 0.1}s` }}>
                                <div className="flex items-center gap-2">
                                    <div
                                        className="w-4 h-4 rounded-lg shadow-lg"
                                        style={{ backgroundColor: COLORS[index % COLORS.length] }}
                                    />
                                    <span className="text-sm font-semibold text-gray-900 dark:text-white">{method.method}</span>
                                </div>
                                <div className="flex items-center gap-4">
                                    <span className="text-xs text-gray-600 dark:text-gray-400">
                                        {method.orderCount} {t('admin.orders')}
                                    </span>
                                    <span className="text-sm font-bold text-gray-900 dark:text-white">
                                        ${method.revenue.toLocaleString()}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Period Comparison */}
            <div className="card stagger-item hover-lift border-l-4 border-green-500">
                <div className="flex items-center space-x-3 mb-6">
                    <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                        <TrendingUp className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                        {t('admin.periodComparison')}
                    </h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center p-4 bg-gradient-to-br from-gray-50 to-white dark:from-gray-700/50 dark:to-gray-700/30 rounded-xl border border-gray-200 dark:border-gray-700">
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 font-medium">
                            {t('admin.previousPeriod')}
                        </p>
                        <p className="text-3xl font-bold text-gray-900 dark:text-white">
                            ${comparison.previousPeriod.toLocaleString()}
                        </p>
                    </div>
                    <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 font-medium">
                            {t('admin.currentPeriod')}
                        </p>
                        <p className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                            ${comparison.currentPeriod.toLocaleString()}
                        </p>
                    </div>
                    <div className="text-center p-4 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl border border-green-200 dark:border-green-800">
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 font-medium">
                            {t('admin.growth')}
                        </p>
                        <div className="flex items-center justify-center gap-2">
                            <TrendingUp className={`w-6 h-6 ${comparison.growthRate >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`} />
                            <p className={`text-3xl font-bold ${comparison.growthRate >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                                {comparison.growthRate >= 0 ? '+' : ''}{comparison.growthRate.toFixed(1)}%
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}