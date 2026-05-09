import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { NewArrivalHighlight } from '../../../types/new_arrivals.types';

interface NewArrivalsHighlightsProps {
    highlights: NewArrivalHighlight[];
    isLoading: boolean;
}

const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
    }).format(amount);
};

export const NewArrivalsHighlights: React.FC<NewArrivalsHighlightsProps> = ({
    highlights,
    isLoading,
}) => {
    const navigate = useNavigate();
    const { t } = useTranslation();

    if (isLoading) {
        return (
            <div className="space-y-4">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <Sparkles className="w-6 h-6 text-teal-500" />
                    {t('NewArrivalsHighlights.title')}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="h-32 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse" />
                    ))}
                </div>
            </div>
        );
    }

    if (highlights.length === 0) return null;

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <Sparkles className="w-6 h-6 text-teal-500" />
                    {t('NewArrivalsHighlights.title')}
                </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {highlights.slice(0, 3).map((book) => {
                    const finalPrice = book.discountPrice || book.price;
                    const hasDiscount = book.discountPrice && book.discountPrice < book.price;

                    return (
                        <div
                            key={book.id}
                            onClick={() => navigate(`/books/${book.slug}`)}
                            className="group relative bg-gradient-to-br from-teal-500 to-cyan-500 dark:from-teal-900 dark:to-cyan-900 rounded-xl overflow-hidden cursor-pointer hover:shadow-2xl transition-all"
                        >
                            <div className="absolute inset-0 bg-black/20" />
                            
                            <div className="relative p-6 flex items-center gap-4">
                                <div className="flex-shrink-0 w-20 h-28 rounded-lg overflow-hidden shadow-lg">
                                    <img
                                        src={book.coverImageUrl || '/placeholder-book.jpg'}
                                        alt={book.title}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                    />
                                </div>

                                <div className="flex-1 space-y-2">
                                    <span className="inline-block px-2 py-1 bg-white/20 backdrop-blur-sm text-white text-xs rounded">
                                        {book.categoryName}
                                    </span>
                                    <h3 className="font-bold text-white line-clamp-2 group-hover:text-yellow-300 transition-colors">
                                        {book.title}
                                    </h3>
                                    <p className="text-sm text-white/80 line-clamp-1">
                                        {book.authors.join(', ')}
                                    </p>
                                    <div className="flex items-center gap-2">
                                        <span className="text-lg font-bold text-white">
                                            {formatCurrency(finalPrice)}
                                        </span>
                                        {hasDiscount && (
                                            <span className="text-sm text-white/60 line-through">
                                                {formatCurrency(book.price)}
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <ArrowRight className="w-5 h-5 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};