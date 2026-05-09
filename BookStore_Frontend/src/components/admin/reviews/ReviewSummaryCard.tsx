import { Star, TrendingUp } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { type ReviewSummaryResponse } from '../../../types';

interface ReviewSummaryCardProps {
    summary: ReviewSummaryResponse;
}

export default function ReviewSummaryCard({ summary }: ReviewSummaryCardProps) {
    const { t } = useTranslation();

    const getRatingBarColor = (rating: number) => {
        if (rating >= 4) return 'bg-green-500';
        if (rating >= 3) return 'bg-yellow-500';
        return 'bg-red-500';
    };

    return (
        <div className="card animate-fadeInUp">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
                <TrendingUp className="w-5 h-5 text-amber-500 animate-pulse" />
                <span>{t('admin.reviewSummary')}</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Average Rating */}
                <div className="text-center animate-scaleIn">
                    <div className="text-5xl font-bold text-gray-900 dark:text-white mb-2">
                        {summary.averageRating.toFixed(1)}
                    </div>
                    <div className="flex items-center justify-center space-x-1 mb-2">
                        {[...Array(5)].map((_, index) => (
                            <Star
                                key={index}
                                className={`w-5 h-5 transition-smooth hover-scale ${index < Math.round(summary.averageRating)
                                        ? 'fill-amber-400 text-amber-400'
                                        : 'fill-gray-300 text-gray-300 dark:fill-gray-600 dark:text-gray-600'
                                    }`}
                            />
                        ))}
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        {summary.totalReviews.toLocaleString()} {t('admin.reviews')}
                    </p>
                </div>

                {/* Rating Distribution */}
                <div className="space-y-2">
                    {[5, 4, 3, 2, 1].map((rating, index) => {
                        const count = summary.ratingDistribution[rating] || 0;
                        const percentage = summary.ratingPercentages[rating] || 0;

                        return (
                            <div
                                key={rating}
                                className="flex items-center space-x-3 stagger-item"
                                style={{ animationDelay: `${index * 0.1}s` }}
                            >
                                <div className="flex items-center space-x-1 w-16">
                                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                        {rating}
                                    </span>
                                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                                </div>
                                <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                    <div
                                        className={`h-full ${getRatingBarColor(rating)} transition-smooth`}
                                        style={{ width: `${percentage}%` }}
                                    />
                                </div>
                                <div className="flex items-center space-x-2 w-20 justify-end">
                                    <span className="text-sm text-gray-600 dark:text-gray-400">
                                        {percentage.toFixed(0)}%
                                    </span>
                                    <span className="text-xs text-gray-500 dark:text-gray-500">
                                        ({count})
                                    </span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}