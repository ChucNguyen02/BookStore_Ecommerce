import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, ShoppingCart, Clock, Sparkles } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import LoadingSpinner from '../../user/common/LoadingSpinner';
import type { NewArrivalBook } from '../../../types/new_arrivals.types';

interface NewArrivalsGridProps {
    books: NewArrivalBook[];
    isLoading: boolean;
    hasMore: boolean;
    onLoadMore: () => void;
}

const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
    }).format(amount);
};

const getDaysAgo = (createdAt: string): number => {
    const now = new Date();
    const created = new Date(createdAt);
    const diffTime = Math.abs(now.getTime() - created.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
};

export const NewArrivalsGrid: React.FC<NewArrivalsGridProps> = ({
    books,
    isLoading,
    hasMore,
    onLoadMore,
}) => {
    const navigate = useNavigate();
    const { t } = useTranslation();

    if (isLoading && books.length === 0) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[...Array(8)].map((_, i) => (
                    <div key={i} className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700">
                        <div className="aspect-[3/4] bg-gray-200 dark:bg-gray-700 animate-pulse" />
                        <div className="p-4 space-y-3">
                            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 animate-pulse" />
                            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/2 animate-pulse" />
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    if (books.length === 0) {
        return (
            <div className="text-center py-12">
                <Clock className="w-16 h-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    {t('NewArrivalsGrid.noResults')}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                    {t('NewArrivalsGrid.adjustFilters')}
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {books.map((book) => {
                    const finalPrice = book.discountPrice || book.price;
                    const hasDiscount = book.discountPrice && book.discountPrice < book.price;
                    const daysAgo = getDaysAgo(book.createdAt);
                    const isNew = daysAgo <= 7;

                    return (
                        <div
                            key={book.id}
                            onClick={() => navigate(`/books/${book.slug}`)}
                            className="group bg-white dark:bg-gray-800 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 hover:shadow-xl hover:border-teal-500 dark:hover:border-teal-500 transition-all cursor-pointer"
                        >
                            <div className="relative aspect-[3/4] overflow-hidden bg-gray-100 dark:bg-gray-700">
                                <img
                                    src={book.coverImageUrl || '/placeholder-book.jpg'}
                                    alt={book.title}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                />

                                {isNew && (
                                    <div className="absolute top-2 left-2">
                                        <div className="px-3 py-1 bg-gradient-to-r from-teal-500 to-cyan-500 text-white rounded-lg font-bold flex items-center gap-1 shadow-lg">
                                            <Sparkles className="w-4 h-4" />
                                            <span>{t('NewArrivalsGrid.new')}</span>
                                        </div>
                                    </div>
                                )}

                                {hasDiscount && book.discountPercentage && (
                                    <div className="absolute top-2 right-2 bg-red-500 text-white px-3 py-1 rounded-lg text-sm font-bold">
                                        -{book.discountPercentage}%
                                    </div>
                                )}

                                {!book.inStock && (
                                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                        <span className="bg-gray-900 text-white px-4 py-2 rounded-lg font-medium">
                                            {t('NewArrivalsGrid.outOfStock')}
                                        </span>
                                    </div>
                                )}

                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                    }}
                                    className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 bg-teal-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2 hover:bg-teal-600"
                                >
                                    <ShoppingCart className="w-4 h-4" />
                                    <span className="text-sm font-medium">{t('NewArrivalsGrid.addToCart')}</span>
                                </button>
                            </div>

                            <div className="p-4 space-y-3">
                                <div className="flex items-center justify-between">
                                    <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-xs rounded text-gray-600 dark:text-gray-400">
                                        {book.categoryName}
                                    </span>
                                    <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                                        <Clock className="w-3 h-3" />
                                        <span>{daysAgo} {t('NewArrivalsGrid.daysAgo')}</span>
                                    </div>
                                </div>

                                <h3 className="font-medium text-gray-900 dark:text-white line-clamp-2 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                                    {book.title}
                                </h3>

                                <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-1">
                                    {book.authors.map(a => a.name).join(', ')}
                                </p>

                                <div className="flex items-center gap-2">
                                    <div className="flex items-center gap-1">
                                        <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                                            {book.averageRating.toFixed(1)}
                                        </span>
                                    </div>
                                    <span className="text-sm text-gray-500 dark:text-gray-400">
                                        ({book.reviewCount})
                                    </span>
                                </div>

                                <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                        <span className="text-xl font-bold text-red-600">
                                            {formatCurrency(finalPrice)}
                                        </span>
                                        {hasDiscount && (
                                            <span className="text-sm text-gray-500 line-through">
                                                {formatCurrency(book.price)}
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                                        <span>{t('NewArrivalsGrid.sold')}: {book.soldCount}</span>
                                        <span>{t('NewArrivalsGrid.stock')}: {book.stockQuantity}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {hasMore && (
                <div className="flex justify-center pt-6">
                    <button
                        onClick={onLoadMore}
                        disabled={isLoading}
                        className="px-6 py-3 bg-teal-500 hover:bg-teal-600 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                        {isLoading ? (
                            <>
                                <LoadingSpinner size="small" />
                                <span>{t('NewArrivalsGrid.loading')}</span>
                            </>
                        ) : (
                            <span>{t('NewArrivalsGrid.loadMore')}</span>
                        )}
                    </button>
                </div>
            )}
        </div>
    );
};