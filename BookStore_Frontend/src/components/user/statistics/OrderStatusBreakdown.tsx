import { useTranslation } from 'react-i18next';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { useTheme } from 'next-themes';
import React from 'react';
import { useAppContext } from '../../../context/AppContext';
import { CheckCircle, Clock, Truck, XCircle, RotateCcw, Package } from 'lucide-react';

interface OrderStatusBreakdownProps {
  data: Record<string, number>;
}

export const OrderStatusBreakdown = ({ data }: OrderStatusBreakdownProps) => {
  const { t } = useTranslation();
  const { language } = useAppContext();
  const { resolvedTheme } = useTheme();

  const statusConfig: Record<string, {
    label: string;
    labelEn: string;
    color: string;
    icon: React.ReactNode;
  }> = {
    PENDING: {
      label: t("Common.choXacNhan"),
      labelEn: 'Pending',
      color: '#f59e0b',
      icon: <Clock className="w-5 h-5" />
    },
    CONFIRMED: {
      label: t("Common.daXacNhan"),
      labelEn: 'Confirmed',
      color: '#3b82f6',
      icon: <CheckCircle className="w-5 h-5" />
    },
    SHIPPING: {
      label: t("Common.dangGiao"),
      labelEn: 'Shipping',
      color: '#8b5cf6',
      icon: <Truck className="w-5 h-5" />
    },
    DELIVERED: {
      label: t("Common.daGiao"),
      labelEn: 'Delivered',
      color: '#10b981',
      icon: <Package className="w-5 h-5" />
    },
    CANCELLED: {
      label: t("Common.daHuy"),
      labelEn: 'Cancelled',
      color: '#ef4444',
      icon: <XCircle className="w-5 h-5" />
    },
    RETURNED: {
      label: t("Common.daTraHang"),
      labelEn: 'Returned',
      color: '#6b7280',
      icon: <RotateCcw className="w-5 h-5" />
    }
  };

  const chartData = Object.entries(data).
  filter(([_, value]) => value > 0).
  map(([status, value]) => ({
    name: language === 'vi' ? statusConfig[status]?.label : statusConfig[status]?.labelEn,
    value,
    color: statusConfig[status]?.color || '#gray',
    icon: statusConfig[status]?.icon
  }));

  const total = chartData.reduce((sum, item) => sum + item.value, 0);

  const isDark = resolvedTheme === 'dark';

  const CustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * (Math.PI / 180));
    const y = cy + radius * Math.sin(-midAngle * (Math.PI / 180));

    if (percent < 0.05) return null;

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? 'start' : 'end'}
        dominantBaseline="central"
        className="font-semibold"
        style={{ fontSize: '14px' }}>
        
                {`${(percent * 100).toFixed(0)}%`}
            </text>);

  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                {language === 'vi' ? t("Common.phanBoTrangThaiDon") : 'Order Status Distribution'}
            </h3>

            {chartData.length === 0 ?
      <div className="flex items-center justify-center h-80 text-gray-500 dark:text-gray-400">
                    {language === 'vi' ? t("Common.chuaCoDonHang") : 'No orders yet'}
                </div> :

      <div className="space-y-6">
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={CustomLabel}
              outerRadius={120}
              dataKey="value">
              
                                {chartData.map((entry, index) =>
              <Cell key={`cell-${index}`} fill={entry.color} />
              )}
                            </Pie>
                            <Tooltip
              contentStyle={{
                backgroundColor: isDark ? '#1f2937' : '#ffffff',
                border: `1px solid ${isDark ? '#374151' : '#e5e7eb'}`,
                borderRadius: '8px'
              }}
              formatter={(value: any) => [
              `${value} ${language === 'vi' ? t("Common.don") : 'orders'} (${(value / total * 100).toFixed(1)}%)`,
              '']
              } />
            
                        </PieChart>
                    </ResponsiveContainer>

                    <div className="grid grid-cols-2 gap-4">
                        {chartData.map((item, index) =>
          <div
            key={index}
            className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-xl">
            
                                <div
              className="w-10 h-10 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: `${item.color}20`, color: item.color }}>
              
                                    {item.icon}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                        {item.name}
                                    </p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                        {item.value} {language === 'vi' ? t("Common.don") : 'orders'}
                                    </p>
                                </div>
                                <div className="text-sm font-bold text-gray-700 dark:text-gray-300">
                                    {(item.value / total * 100).toFixed(1)}%
                                </div>
                            </div>
          )}
                    </div>
                </div>
      }
        </div>);

};