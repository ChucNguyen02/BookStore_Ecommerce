import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { TrendingUp } from 'lucide-react';

interface RevenueChartProps {
    dailyRevenue: Record<string, number>;
}

export default function RevenueChart({ dailyRevenue }: RevenueChartProps) {
    const { t } = useTranslation();
    const [period, setPeriod] = useState('7days');

    const chartData = Object.entries(dailyRevenue || {})
        .map(([date, revenue]) => ({
            date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            revenue: revenue
        }))
        .slice(-7);

    const totalRevenue = chartData.reduce((sum, item) => sum + item.revenue, 0);
    const avgRevenue = chartData.length > 0 ? totalRevenue / chartData.length : 0;

    return (
        <div className="card animate-fadeInUp">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        📈 {t('admin.revenueOverview')}
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {t('admin.dailyRevenueTrend')}
                    </p>
                </div>
                <select 
                    value={period}
                    onChange={(e) => setPeriod(e.target.value)}
                    className="input-field text-sm px-3 py-1.5 w-auto"
                >
                    <option value="7days">{t('admin.last7Days')}</option>
                    <option value="30days">{t('admin.last30Days')}</option>
                    <option value="3months">{t('admin.last3Months')}</option>
                </select>
            </div>

            {/* Stats Summary */}
            {chartData.length > 0 && (
                <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="p-4 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-xl border border-amber-200 dark:border-amber-800">
                        <p className="text-xs font-medium text-amber-700 dark:text-amber-400 mb-1">
                            {t('admin.totalRevenue')}
                        </p>
                        <p className="text-2xl font-bold text-amber-900 dark:text-amber-300">
                            ${totalRevenue.toLocaleString()}
                        </p>
                    </div>
                    <div className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl border border-green-200 dark:border-green-800">
                        <p className="text-xs font-medium text-green-700 dark:text-green-400 mb-1">
                            {t('admin.avgDaily')}
                        </p>
                        <p className="text-2xl font-bold text-green-900 dark:text-green-300">
                            ${avgRevenue.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                        </p>
                    </div>
                </div>
            )}
            
            {chartData.length > 0 ? (
                <div className="relative">
                    <ResponsiveContainer width="100%" height={300}>
                        <AreaChart data={chartData}>
                            <defs>
                                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.8}/>
                                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.1}/>
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" className="dark:stroke-gray-700" />
                            <XAxis 
                                dataKey="date" 
                                stroke="#6b7280"
                                className="dark:stroke-gray-400"
                                style={{ fontSize: '12px' }}
                            />
                            <YAxis 
                                stroke="#6b7280"
                                className="dark:stroke-gray-400"
                                style={{ fontSize: '12px' }}
                                tickFormatter={(value) => `$${value.toLocaleString()}`}
                            />
                            <Tooltip 
                                contentStyle={{
                                    backgroundColor: 'rgba(255, 255, 255, 0.98)',
                                    border: '2px solid #f59e0b',
                                    borderRadius: '12px',
                                    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.15)',
                                    padding: '12px'
                                }}
                                labelStyle={{ fontWeight: 'bold', color: '#1f2937', marginBottom: '4px' }}
                                formatter={(value: any) => [`$${value.toLocaleString()}`, t('admin.revenue')]}
                            />
                            <Area 
                                type="monotone" 
                                dataKey="revenue" 
                                stroke="#f59e0b"
                                strokeWidth={3}
                                fill="url(#colorRevenue)"
                                dot={{ fill: '#f59e0b', strokeWidth: 2, r: 5, className: 'hover-scale' }}
                                activeDot={{ r: 7, fill: '#d97706', strokeWidth: 0, className: 'animate-pulse' }}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            ) : (
                <div className="h-80 flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600">
                    <div className="w-20 h-20 bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/40 dark:to-orange-900/40 rounded-full flex items-center justify-center mb-4 animate-pulse">
                        <TrendingUp className="w-10 h-10 text-amber-600 dark:text-amber-400" />
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 font-medium">
                        {t('admin.noRevenueData')}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                        {t('admin.dataWillAppearHere')}
                    </p>
                </div>
            )}
        </div>
    );
}