import React from 'react';
import { TrendingUp, Star, Package } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface BestsellerStatsProps {
    totalBooks: number;
    averageRating: number;
    totalSold: number;
}

export const BestsellerStats: React.FC<BestsellerStatsProps> = ({
    totalBooks,
    averageRating,
    totalSold,
}) => {
    const { t, i18n } = useTranslation();
    const locale = i18n.language === 'vi' ? 'vi-VN' : 'en-US';

    const stats = [
        {
            icon: <Package className="w-6 h-6" />,
            label: t('BestsellerStats.totalBooks'),
            value: totalBooks.toLocaleString(locale),
            color: 'text-blue-600 dark:text-blue-400',
            bg: 'bg-blue-100 dark:bg-blue-900/30',
        },
        {
            icon: <Star className="w-6 h-6" />,
            label: t('BestsellerStats.avgRating'),
            value: averageRating.toFixed(1),
            color: 'text-amber-600 dark:text-amber-400',
            bg: 'bg-amber-100 dark:bg-amber-900/30',
        },
        {
            icon: <TrendingUp className="w-6 h-6" />,
            label: t('BestsellerStats.totalSold'),
            value: totalSold.toLocaleString(locale),
            color: 'text-green-600 dark:text-green-400',
            bg: 'bg-green-100 dark:bg-green-900/30',
        },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {stats.map((stat, index) => (
                <div
                    key={index}
                    className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700"
                >
                    <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-xl ${stat.bg}`}>
                            <div className={stat.color}>{stat.icon}</div>
                        </div>
                        <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</p>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};