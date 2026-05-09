import { useTranslation } from 'react-i18next';
import {
    Users,
    UserPlus,
    Activity,
    Crown,
    TrendingUp
} from 'lucide-react';
import {
    LineChart,
    Line,
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer
} from 'recharts';

interface CustomerReportProps {
    data: {
        summary: {
            totalUsers: number;
            newUsersThisMonth: number;
            activeUsers: number;
            inactiveUsers: number;
            userGrowthRate: number;
        };
        newUsersOverTime: Array<{
            date: string;
            count: number;
        }>;
        topSpenders: Array<{
            userId: string;
            fullName: string;
            email: string;
            avatarUrl: string | null;
            totalSpent: number;
            orderCount: number;
            tier: string;
        }>;
        tierDistribution: Array<{
            tier: string;
            count: number;
            percentage: number;
        }>;
        activityMetrics: {
            avgOrdersPerUser: number;
            avgSpendingPerUser: number;
            repeatCustomerRate: number;
        };
    };
}

export default function CustomerReport({ data }: CustomerReportProps) {
    const { t } = useTranslation();

    const { summary, newUsersOverTime, topSpenders, tierDistribution, activityMetrics } = data;

    const TIER_COLORS: Record<string, string> = {
        BRONZE: '#CD7F32',
        SILVER: '#C0C0C0',
        GOLD: '#FFD700',
        PLATINUM: '#E5E4E2'
    };



    // Format new users data for chart
    const newUsersChartData = newUsersOverTime.map(item => ({
        date: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        users: item.count
    }));

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
                        <span className={`text-sm font-semibold ${change >= 0
                                ? 'text-green-600 dark:text-green-400'
                                : 'text-red-600 dark:text-red-400'
                            }`}>
                            {change >= 0 ? '+' : ''}{change.toFixed(1)}% {t('admin.growth')}
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
                        label={t('admin.totalUsers')}
                        value={summary.totalUsers.toLocaleString()}
                        icon={Users}
                        colorClass="from-blue-500 to-cyan-600"
                    />
                </div>
                <div className="stagger-item">
                    <StatCard
                        label={t('admin.newUsersThisMonth')}
                        value={summary.newUsersThisMonth.toLocaleString()}
                        change={summary.userGrowthRate}
                        icon={UserPlus}
                        colorClass="from-green-500 to-emerald-600"
                    />
                </div>
                <div className="stagger-item">
                    <StatCard
                        label={t('admin.activeUsers')}
                        value={summary.activeUsers.toLocaleString()}
                        icon={Activity}
                        colorClass="from-purple-500 to-pink-600"
                    />
                </div>
                <div className="stagger-item">
                    <StatCard
                        label={t('admin.repeatCustomerRate')}
                        value={`${activityMetrics.repeatCustomerRate.toFixed(1)}%`}
                        icon={TrendingUp}
                        colorClass="from-amber-500 to-orange-600"
                    />
                </div>
            </div>

            {/* Activity Metrics */}
            <div className="card stagger-item hover-lift border-l-4 border-purple-500">
                <div className="flex items-center space-x-3 mb-6">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg">
                        <Activity className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                        {t('admin.customerActivityMetrics')}
                    </h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 font-medium">
                            {t('admin.avgOrdersPerUser')}
                        </p>
                        <p className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                            {activityMetrics.avgOrdersPerUser.toFixed(1)}
                        </p>
                    </div>
                    <div className="text-center p-4 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl border border-green-200 dark:border-green-800">
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 font-medium">
                            {t('admin.avgSpendingPerUser')}
                        </p>
                        <p className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                            ${activityMetrics.avgSpendingPerUser.toFixed(2)}
                        </p>
                    </div>
                    <div className="text-center p-4 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-xl border border-amber-200 dark:border-amber-800">
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 font-medium">
                            {t('admin.repeatCustomerRate')}
                        </p>
                        <p className="text-3xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                            {activityMetrics.repeatCustomerRate.toFixed(1)}%
                        </p>
                    </div>
                </div>
            </div>

            {/* New Users Over Time */}
            <div className="card stagger-item hover-lift border-l-4 border-green-500">
                <div className="flex items-center space-x-3 mb-6">
                    <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                        <TrendingUp className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                        {t('admin.newUsersGrowth')}
                    </h3>
                </div>
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={newUsersChartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
                        <XAxis
                            dataKey="date"
                            stroke="#9CA3AF"
                            style={{ fontSize: '12px' }}
                        />
                        <YAxis
                            stroke="#9CA3AF"
                            style={{ fontSize: '12px' }}
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: '#1F2937',
                                border: 'none',
                                borderRadius: '0.75rem',
                                color: '#fff',
                                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                            }}
                        />
                        <Legend />
                        <Line
                            type="monotone"
                            dataKey="users"
                            stroke="url(#greenGradient)"
                            strokeWidth={3}
                            dot={{ fill: '#10B981', r: 5, strokeWidth: 2, stroke: '#fff' }}
                            activeDot={{ r: 7, strokeWidth: 3, stroke: '#fff' }}
                            name="New Users"
                        />
                        <defs>
                            <linearGradient id="greenGradient" x1="0" y1="0" x2="1" y2="0">
                                <stop offset="0%" stopColor="#10B981" />
                                <stop offset="100%" stopColor="#059669" />
                            </linearGradient>
                        </defs>
                    </LineChart>
                </ResponsiveContainer>
            </div>

            {/* Top Spenders & Tier Distribution */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Top Spenders */}
                <div className="card stagger-item hover-lift border-l-4 border-amber-500">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg animate-pulse">
                            <Crown className="w-5 h-5 text-white" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                            {t('admin.topSpenders')}
                        </h3>
                    </div>
                    <div className="space-y-2">
                        {topSpenders.slice(0, 10).map((user, index) => (
                            <div
                                key={user.userId}
                                className="flex items-center gap-4 p-4 bg-gradient-to-r from-gray-50 to-white dark:from-gray-700/50 dark:to-gray-700/30 rounded-xl hover:from-amber-50 hover:to-orange-50 dark:hover:from-amber-900/20 dark:hover:to-orange-900/20 transition-smooth hover-scale border border-gray-200 dark:border-gray-700 animate-fadeInUp"
                                style={{ animationDelay: `${index * 0.05}s` }}
                            >
                                <div className={`flex items-center justify-center w-8 h-8 rounded-lg font-bold text-white shadow-lg ${index === 0 ? 'bg-gradient-to-br from-amber-500 to-yellow-600' :
                                        index === 1 ? 'bg-gradient-to-br from-gray-400 to-gray-500' :
                                            index === 2 ? 'bg-gradient-to-br from-orange-600 to-amber-700' :
                                                'bg-gradient-to-br from-gray-500 to-gray-600'
                                    }`}>
                                    #{index + 1}
                                </div>

                                <div className="relative">
                                    {user.avatarUrl ? (
                                        <img
                                            src={user.avatarUrl}
                                            alt={user.fullName}
                                            className="w-12 h-12 rounded-full object-cover border-2 border-white dark:border-gray-700 shadow-lg"
                                        />
                                    ) : (
                                        <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center shadow-lg">
                                            <Users className="w-6 h-6 text-white" />
                                        </div>
                                    )}
                                    <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white dark:border-gray-800"
                                        style={{ backgroundColor: TIER_COLORS[user.tier] }}>
                                    </div>
                                </div>

                                <div className="flex-1 min-w-0">
                                    <h4 className="font-semibold text-gray-900 dark:text-white truncate">
                                        {user.fullName}
                                    </h4>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                                        {user.email}
                                    </p>
                                </div>

                                <div className="text-right">
                                    <p className="font-bold text-gray-900 dark:text-white">
                                        ${user.totalSpent.toLocaleString()}
                                    </p>
                                    <p className="text-xs text-gray-600 dark:text-gray-400">
                                        {user.orderCount} {t('admin.orders')}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Tier Distribution */}
                <div className="card stagger-item hover-lift border-l-4 border-purple-500">
                    <div className="flex items-center space-x-3 mb-6">
                        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg">
                            <Crown className="w-5 h-5 text-white" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                            {t('admin.tierDistribution')}
                        </h3>
                    </div>
                    <ResponsiveContainer width="100%" height={250}>
                        <PieChart>
                            <Pie
                                data={tierDistribution}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={({ tier, percentage }) => `${tier} (${percentage.toFixed(1)}%)`}
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="count"
                            >
                                {tierDistribution.map((entry) => (
                                    <Cell key={`cell-${entry.tier}`} fill={TIER_COLORS[entry.tier]} />
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
                            />
                        </PieChart>
                    </ResponsiveContainer>
                    <div className="mt-6 space-y-2">
                        {tierDistribution.map((tier, index) => (
                            <div
                                key={tier.tier}
                                className="flex items-center justify-between p-3 bg-gradient-to-r from-gray-50 to-white dark:from-gray-700/50 dark:to-gray-700/30 rounded-xl border border-gray-200 dark:border-gray-700 hover-scale animate-fadeInUp"
                                style={{ animationDelay: `${index * 0.1}s` }}
                            >
                                <div className="flex items-center gap-3">
                                    <div
                                        className="w-5 h-5 rounded-lg shadow-lg"
                                        style={{ backgroundColor: TIER_COLORS[tier.tier] }}
                                    />
                                    <span className="text-sm font-semibold text-gray-900 dark:text-white">
                                        {tier.tier}
                                    </span>
                                </div>
                                <div className="flex items-center gap-4">
                                    <span className="text-sm text-gray-600 dark:text-gray-400">
                                        {tier.count} {t('admin.users')}
                                    </span>
                                    <span className="text-sm font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent min-w-[60px] text-right">
                                        {tier.percentage.toFixed(1)}%
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}