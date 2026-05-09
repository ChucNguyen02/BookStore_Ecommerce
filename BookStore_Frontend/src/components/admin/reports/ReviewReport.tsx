import { useTranslation } from 'react-i18next';
import { Star, MessageSquare, TrendingUp, Award } from 'lucide-react';
import {
    BarChart,
    Bar,
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer
} from 'recharts';

interface ReviewReportProps {
    data: {
        summary: {
            totalReviews: number;
            averageRating: number;
            newReviewsThisMonth: number;
            verifiedPurchaseRate: number;
        };
        ratingDistribution: Array<{
            rating: number;
            count: number;
            percentage: number;
        }>;
        reviewsOverTime: Array<{
            date: string;
            count: number;
            avgRating: number;
        }>;
        topRatedBooks: Array<{
            bookId: string;
            title: string;
            slug: string;
            coverImageUrl: string | null;
            averageRating: number;
            reviewCount: number;
        }>;
        recentReviews: Array<{
            id: string;
            rating: number;
            comment: string | null;
            userName: string;
            bookTitle: string;
            isVerifiedPurchase: boolean;
            createdAt: string;
        }>;
    };
}

export default function ReviewReport({ data }: ReviewReportProps) {
    const { t } = useTranslation();

    const { summary, ratingDistribution, reviewsOverTime, topRatedBooks, recentReviews } = data;


    // Format reviews over time for chart
    const reviewsChartData = reviewsOverTime.map(item => ({
        date: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        reviews: item.count,
        avgRating: item.avgRating
    }));

    // Format rating distribution for chart
    const ratingChartData = ratingDistribution.map(item => ({
        rating: `${item.rating} ★`,
        count: item.count,
        percentage: item.percentage
    })).reverse();

    const renderStars = (rating: number) => {
        return (
            <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                        key={star}
                        className={`w-4 h-4 ${star <= rating
                            ? 'fill-amber-400 text-amber-400'
                            : 'text-gray-300 dark:text-gray-600'
                            }`}
                    />
                ))}
            </div>
        );
    };

    const StatCard = ({ label, value, icon: Icon, colorClass, description }: any) => (
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
            {description && (
                <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                    <p className="text-xs text-gray-600 dark:text-gray-400">{description}</p>
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
                        label={t('admin.totalReviews')}
                        value={summary.totalReviews.toLocaleString()}
                        icon={MessageSquare}
                        colorClass="from-blue-500 to-cyan-600"
                    />
                </div>
                <div className="stagger-item">
                    <StatCard
                        label={t('admin.averageRating')}
                        value={summary.averageRating.toFixed(2)}
                        icon={Star}
                        colorClass="from-amber-500 to-orange-600"
                        description="Out of 5.00"
                    />
                </div>
                <div className="stagger-item">
                    <StatCard
                        label={t('admin.newReviewsThisMonth')}
                        value={summary.newReviewsThisMonth.toLocaleString()}
                        icon={TrendingUp}
                        colorClass="from-green-500 to-emerald-600"
                    />
                </div>
                <div className="stagger-item">
                    <StatCard
                        label={t('admin.verifiedPurchaseRate')}
                        value={`${summary.verifiedPurchaseRate.toFixed(1)}%`}
                        icon={Award}
                        colorClass="from-purple-500 to-pink-600"
                    />
                </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Rating Distribution */}
                <div className="card stagger-item hover-lift border-l-4 border-amber-500">
                    <div className="flex items-center space-x-3 mb-6">
                        <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
                            <Star className="w-5 h-5 text-white" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                            {t('admin.ratingDistribution')}
                        </h3>
                    </div>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={ratingChartData} layout="vertical">
                            <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
                            <XAxis type="number" stroke="#9CA3AF" style={{ fontSize: '12px' }} />
                            <YAxis dataKey="rating" type="category" width={60} stroke="#9CA3AF" style={{ fontSize: '12px' }} />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: '#1F2937',
                                    border: 'none',
                                    borderRadius: '0.75rem',
                                    color: '#fff',
                                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                                }}
                            />
                            <Bar dataKey="count" fill="url(#amberGradient)" radius={[0, 8, 8, 0]} />
                            <defs>
                                <linearGradient id="amberGradient" x1="0" y1="0" x2="1" y2="0">
                                    <stop offset="0%" stopColor="#F59E0B" />
                                    <stop offset="100%" stopColor="#F97316" />
                                </linearGradient>
                            </defs>
                        </BarChart>
                    </ResponsiveContainer>
                    <div className="mt-4 space-y-2">
                        {ratingDistribution.map((item, index) => (
                            <div key={item.rating} className="flex items-center justify-between p-2 bg-gradient-to-r from-gray-50 to-white dark:from-gray-700/50 dark:to-gray-700/30 rounded-lg hover-scale animate-fadeInUp" style={{ animationDelay: `${index * 0.1}s` }}>
                                <div className="flex items-center gap-2">
                                    {renderStars(item.rating)}
                                </div>
                                <div className="flex items-center gap-4">
                                    <span className="text-xs text-gray-600 dark:text-gray-400">
                                        {item.count} {t('admin.reviews')}
                                    </span>
                                    <span className="text-sm font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent min-w-[60px] text-right">
                                        {item.percentage.toFixed(1)}%
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Reviews Over Time */}
                <div className="card stagger-item hover-lift border-l-4 border-blue-500">
                    <div className="flex items-center space-x-3 mb-6">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center shadow-lg">
                            <TrendingUp className="w-5 h-5 text-white" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                            {t('admin.reviewsOverTime')}
                        </h3>
                    </div>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={reviewsChartData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
                            <XAxis dataKey="date" stroke="#9CA3AF" style={{ fontSize: '12px' }} />
                            <YAxis yAxisId="left" stroke="#9CA3AF" style={{ fontSize: '12px' }} />
                            <YAxis yAxisId="right" orientation="right" stroke="#9CA3AF" style={{ fontSize: '12px' }} domain={[0, 5]} />
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
                                yAxisId="left"
                                type="monotone"
                                dataKey="reviews"
                                stroke="url(#blueLineGradient)"
                                strokeWidth={3}
                                dot={{ fill: '#3B82F6', r: 5, strokeWidth: 2, stroke: '#fff' }}
                                activeDot={{ r: 7, strokeWidth: 3, stroke: '#fff' }}
                                name="Review Count"
                            />
                            <Line
                                yAxisId="right"
                                type="monotone"
                                dataKey="avgRating"
                                stroke="url(#amberLineGradient)"
                                strokeWidth={3}
                                dot={{ fill: '#F59E0B', r: 5, strokeWidth: 2, stroke: '#fff' }}
                                activeDot={{ r: 7, strokeWidth: 3, stroke: '#fff' }}
                                name="Avg Rating"
                            />
                            <defs>
                                <linearGradient id="blueLineGradient" x1="0" y1="0" x2="1" y2="0">
                                    <stop offset="0%" stopColor="#3B82F6" />
                                    <stop offset="100%" stopColor="#06B6D4" />
                                </linearGradient>
                                <linearGradient id="amberLineGradient" x1="0" y1="0" x2="1" y2="0">
                                    <stop offset="0%" stopColor="#F59E0B" />
                                    <stop offset="100%" stopColor="#F97316" />
                                </linearGradient>
                            </defs>
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Top Rated Books */}
            <div className="card stagger-item hover-lift border-l-4 border-amber-500">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg animate-pulse">
                        <Award className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                        {t('admin.topRatedBooks')}
                    </h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {topRatedBooks.map((book, index) => (
                        <div
                            key={book.bookId}
                            className="flex items-center gap-4 p-4 bg-gradient-to-r from-gray-50 to-white dark:from-gray-700/50 dark:to-gray-700/30 rounded-xl hover:from-amber-50 hover:to-orange-50 dark:hover:from-amber-900/20 dark:hover:to-orange-900/20 transition-smooth hover-lift border border-gray-200 dark:border-gray-700 animate-fadeInUp"
                            style={{ animationDelay: `${index * 0.1}s` }}
                        >
                            <div className={`flex items-center justify-center w-10 h-10 rounded-lg font-bold text-white shadow-lg ${index === 0 ? 'bg-gradient-to-br from-amber-500 to-yellow-600' :
                                    index === 1 ? 'bg-gradient-to-br from-gray-400 to-gray-500' :
                                        index === 2 ? 'bg-gradient-to-br from-orange-600 to-amber-700' :
                                            'bg-gradient-to-br from-gray-500 to-gray-600'
                                }`}>
                                #{index + 1}
                            </div>

                            <div className="relative">
                                {book.coverImageUrl ? (
                                    <img
                                        src={book.coverImageUrl}
                                        alt={book.title}
                                        className="w-16 h-20 object-cover rounded-lg shadow-lg border-2 border-white dark:border-gray-700"
                                    />
                                ) : (
                                    <div className="w-16 h-20 bg-gradient-to-br from-gray-300 to-gray-400 dark:from-gray-600 dark:to-gray-700 rounded-lg flex items-center justify-center shadow-lg">
                                        <Star className="w-8 h-8 text-white" />
                                    </div>
                                )}
                                <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-amber-500 to-orange-600 rounded-full flex items-center justify-center shadow-lg border-2 border-white dark:border-gray-800">
                                    <Star className="w-4 h-4 text-white fill-white" />
                                </div>
                            </div>

                            <div className="flex-1 min-w-0">
                                <h4 className="font-semibold text-gray-900 dark:text-white truncate mb-1">
                                    {book.title}
                                </h4>
                                <div className="flex items-center gap-3">
                                    <div className="flex items-center gap-1">
                                        <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                                        <span className="font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                                            {book.averageRating.toFixed(2)}
                                        </span>
                                    </div>
                                    <span className="text-sm text-gray-600 dark:text-gray-400">
                                        ({book.reviewCount})
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Recent Reviews */}
            <div className="card stagger-item hover-lift border-l-4 border-purple-500">
                <div className="flex items-center space-x-3 mb-6">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg">
                        <MessageSquare className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                        {t('admin.recentReviews')}
                    </h3>
                </div>
                <div className="space-y-3">
                    {recentReviews.map((review, index) => (
                        <div
                            key={review.id}
                            className="p-4 bg-gradient-to-r from-gray-50 to-white dark:from-gray-700/50 dark:to-gray-700/30 rounded-xl border border-gray-200 dark:border-gray-700 hover-lift animate-fadeInUp"
                            style={{ animationDelay: `${index * 0.05}s` }}
                        >
                            <div className="flex items-start justify-between gap-4 mb-3">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2 flex-wrap">
                                        <div className="flex items-center gap-2">
                                            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center">
                                                <span className="text-white text-xs font-bold">
                                                    {review.userName.charAt(0).toUpperCase()}
                                                </span>
                                            </div>
                                            <span className="font-semibold text-gray-900 dark:text-white">
                                                {review.userName}
                                            </span>
                                        </div>
                                        {review.isVerifiedPurchase && (
                                            <span className="inline-flex items-center px-2 py-0.5 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-full text-xs font-semibold shadow-sm">
                                                <Award className="w-3 h-3 mr-1" />
                                                {t('admin.verified')}
                                            </span>
                                        )}
                                    </div>
                                    {renderStars(review.rating)}
                                </div>
                                <span className="text-sm text-gray-600 dark:text-gray-400">
                                    {new Date(review.createdAt).toLocaleDateString()}
                                </span>
                            </div>
                            <p className="text-sm font-medium text-purple-600 dark:text-purple-400 mb-2">
                                {review.bookTitle}
                            </p>
                            {review.comment && (
                                <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed pl-10">
                                    "{review.comment}"
                                </p>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}