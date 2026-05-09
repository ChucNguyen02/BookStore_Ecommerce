import { Star, Quote } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useMemo } from 'react';
import { useTestimonials } from '../../../hooks/user/useReviews';

export const TestimonialsSection = () => {
    const { t } = useTranslation();

    const { testimonials, loading } = useTestimonials(3);

    const stats = useMemo(() => ({
        totalCustomers: t('TestimonialsSection.stats.customersValue', '50,000+'),
        avgRating: t('TestimonialsSection.stats.ratingValue', '4.8★'),
        satisfaction: t('TestimonialsSection.stats.satisfactionValue', '98%'),
        support: t('TestimonialsSection.stats.supportValue', '24/7')
    }), [t]);

    // Format date
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('vi-VN');
    };

    // Get avatar based on user
    const getAvatarUrl = (userId: string | undefined, index: number) => {
        if (!userId) return `https://i.pravatar.cc/150?img=${index + 1}`;
        return `https://i.pravatar.cc/150?u=${userId}`;
    };

    if (loading) {
        return (
            <section className="py-16 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-blue-950/20 dark:via-purple-950/20 dark:to-pink-950/20">
                <div className="container mx-auto px-4">
                    <div className="text-center">
                        <div className="animate-pulse">
                            <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded w-64 mx-auto mb-4"></div>
                            <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-96 mx-auto"></div>
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="py-16 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-blue-950/20 dark:via-purple-950/20 dark:to-pink-950/20">
            <div className="container mx-auto px-4">
                {/* Header */}
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 dark:text-white mb-4">
                        {t('TestimonialsSection.title')}
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 text-lg max-w-2xl mx-auto">
                        {t('TestimonialsSection.subtitle')}
                    </p>
                </div>

                {/* Testimonials Grid */}
                {testimonials.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {testimonials.map((testimonial, index) => (
                            <div
                                key={testimonial.id}
                                className="group bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
                                style={{ animationDelay: `${index * 0.1}s` }}
                            >
                                {/* Quote Icon */}
                                <div className="inline-flex p-3 bg-gradient-to-br from-blue-500 to-purple-600 text-white rounded-xl mb-4 group-hover:scale-110 transition-transform">
                                    <Quote className="w-6 h-6" />
                                </div>

                                {/* Rating */}
                                <div className="flex gap-1 mb-4">
                                    {[...Array(5)].map((_, i) => (
                                        <Star
                                            key={i}
                                            className={`w-5 h-5 ${
                                                i < testimonial.rating
                                                    ? 'fill-amber-400 text-amber-400'
                                                    : 'text-gray-300 dark:text-gray-600'
                                            }`}
                                        />
                                    ))}
                                </div>

                                {/* Comment */}
                                <p className="text-gray-700 dark:text-gray-300 mb-6 line-clamp-4">
                                    "{testimonial.comment}"
                                </p>

                                {/* Author */}
                                <div className="flex items-center gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                                    <img
                                        src={getAvatarUrl(testimonial.userId, index)}
                                        alt={testimonial.userName || t('TestimonialsSection.anonymous')}
                                        className="w-12 h-12 rounded-full object-cover ring-2 ring-blue-500"
                                    />
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2">
                                            <h4 className="font-bold text-gray-900 dark:text-white">
                                                {testimonial.userName || t('TestimonialsSection.anonymous')}
                                            </h4>
                                            {testimonial.isVerifiedPurchase && (
                                                <span className="px-2 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-semibold rounded-full">
                                                    ✓ {t('TestimonialsSection.verified')}
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            {formatDate(testimonial.createdAt)}
                                        </p>
                                    </div>
                                </div>

                                {/* Helpful votes */}
                                {testimonial.helpfulCount > 0 && (
                                    <div className="mt-3 text-xs text-gray-500 dark:text-gray-400">
                                        {testimonial.helpfulCount} {t('TestimonialsSection.foundHelpful')}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center text-gray-500 dark:text-gray-400 py-12">
                        {t('TestimonialsSection.noReviews')}
                    </div>
                )}

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12">
                    {[
                        {
                            value: stats.totalCustomers,
                            label: t('TestimonialsSection.stats.customers'),
                            color: 'from-blue-500 to-cyan-500'
                        },
                        {
                            value: stats.avgRating,
                            label: t('TestimonialsSection.stats.rating'),
                            color: 'from-amber-500 to-orange-500'
                        },
                        {
                            value: stats.satisfaction,
                            label: t('TestimonialsSection.stats.satisfaction'),
                            color: 'from-green-500 to-emerald-500'
                        },
                        {
                            value: stats.support,
                            label: t('TestimonialsSection.stats.support'),
                            color: 'from-purple-500 to-pink-500'
                        }
                    ].map((stat, index) => (
                        <div
                            key={index}
                            className="text-center p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg"
                        >
                            <div className={`text-3xl md:text-4xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent mb-2`}>
                                {stat.value}
                            </div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">
                                {stat.label}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};