import { useTranslation } from 'react-i18next';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useTheme } from 'next-themes';
import { useAppContext } from '../../../context/AppContext';
import { type MonthlySpendingData } from '../../../types/user_statistics.types';

interface SpendingChartProps {
  data: MonthlySpendingData[];
  chartType: 'line' | 'bar';
}

export const SpendingChart = ({ data, chartType }: SpendingChartProps) => {
  const { t } = useTranslation();
  const { language } = useAppContext();
  const { resolvedTheme } = useTheme();

  const formatPrice = (value: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      notation: 'compact',
      maximumFractionDigits: 1
    }).format(value);
  };

  const formatMonth = (month: string) => {
    const [year, monthNum] = month.split('-');
    const date = new Date(parseInt(year), parseInt(monthNum) - 1);
    return new Intl.DateTimeFormat(language === 'vi' ? 'vi-VN' : 'en-US', {
      month: 'short',
      year: 'numeric'
    }).format(date);
  };

  const chartData = data.map((item) => ({
    month: formatMonth(item.month),
    [language === 'vi' ? t("Common.chiTieu") : 'Spending']: item.totalSpent,
    [language === 'vi' ? t("Common.donHang") : 'Orders']: item.orderCount
  }));

  const isDark = resolvedTheme === 'dark';
  const gridColor = isDark ? '#374151' : '#e5e7eb';
  const textColor = isDark ? '#9ca3af' : '#6b7280';

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                {language === 'vi' ? t("Common.bieuDoChiTieuTheo") : 'Monthly Spending Chart'}
            </h3>

            {data.length === 0 ?
      <div className="flex items-center justify-center h-80 text-gray-500 dark:text-gray-400">
                    {language === 'vi' ? t("Common.chuaCoDuLieu") : 'No data available'}
                </div> :

      <ResponsiveContainer width="100%" height={400}>
                    {chartType === 'line' ?
        <LineChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                            <XAxis
            dataKey="month"
            stroke={textColor}
            style={{ fontSize: '12px' }} />
          
                            <YAxis
            stroke={textColor}
            tickFormatter={formatPrice}
            style={{ fontSize: '12px' }} />
          
                            <Tooltip
            contentStyle={{
              backgroundColor: isDark ? '#1f2937' : '#ffffff',
              border: `1px solid ${gridColor}`,
              borderRadius: '8px',
              color: textColor
            }}
            formatter={(value: any) => formatPrice(value)} />
          
                            <Legend
            wrapperStyle={{ color: textColor }} />
          
                            <Line
            type="monotone"
            dataKey={language === 'vi' ? t("Common.chiTieu") : 'Spending'}
            stroke="#10b981"
            strokeWidth={3}
            dot={{ fill: '#10b981', r: 4 }}
            activeDot={{ r: 6 }} />
          
                        </LineChart> :

        <BarChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                            <XAxis
            dataKey="month"
            stroke={textColor}
            style={{ fontSize: '12px' }} />
          
                            <YAxis
            stroke={textColor}
            tickFormatter={formatPrice}
            style={{ fontSize: '12px' }} />
          
                            <Tooltip
            contentStyle={{
              backgroundColor: isDark ? '#1f2937' : '#ffffff',
              border: `1px solid ${gridColor}`,
              borderRadius: '8px',
              color: textColor
            }}
            formatter={(value: any, name: any) => {
              if (name === (language === 'vi' ? t("Common.chiTieu") : 'Spending')) {
                return formatPrice(value);
              }
              return value;
            }} />
          
                            <Legend
            wrapperStyle={{ color: textColor }} />
          
                            <Bar
            dataKey={language === 'vi' ? t("Common.chiTieu") : 'Spending'}
            fill="#10b981"
            radius={[8, 8, 0, 0]} />
          
                        </BarChart>
        }
                </ResponsiveContainer>
      }
        </div>);

};