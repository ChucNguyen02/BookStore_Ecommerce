import { memo, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Zap, ChevronRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { BookCard } from '../books/BookCard';
import type { BookResponse } from '../../../types/book.types';

interface FlashSaleSectionProps {
    books: BookResponse[];
}

export const FlashSaleSection = memo(({ books }: FlashSaleSectionProps) => {
    const { t } = useTranslation();
    const [timeLeft, setTimeLeft] = useState({
        hours: 0,
        minutes: 0,
        seconds: 0
    });

    useEffect(() => {
        const calculateTimeLeft = () => {
            const now = new Date();
            const endOfDay = new Date();
            endOfDay.setHours(23, 59, 59, 999);

            const difference = endOfDay.getTime() - now.getTime();

            if (difference > 0) {
                setTimeLeft({
                    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                    minutes: Math.floor((difference / 1000 / 60) % 60),
                    seconds: Math.floor((difference / 1000) % 60)
                });
            }
        };

        calculateTimeLeft();
        const timer = setInterval(calculateTimeLeft, 1000);
        return () => clearInterval(timer);
    }, []);

    if (books.length === 0) return null;

    const formatNumber = (num: number) => num.toString().padStart(2, '0');

    return (
        <section className="py-16 bg-gradient-to-br from-red-50 via-orange-50 to-amber-50 dark:from-red-900/10 dark:via-orange-900/10 dark:to-amber-900/10">
            <div className="container mx-auto px-4">
                {/* Header */}
                <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
                    <div className="flex items-center gap-4">
                        <div className="p-4 bg-gradient-to-br from-red-500 to-orange-500 text-white rounded-2xl shadow-lg animate-pulse">
                            <Zap className="w-8 h-8" />
                        </div>
                        <div>
                            <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 dark:text-white flex items-center gap-3">
                                <span className="relative">
                                    {t('FlashSale.title')}
                                    <span className="absolute -top-2 -right-12 text-xs bg-red-500 text-white px-2 py-1 rounded-full">
                                        HOT
                                    </span>
                                </span>
                            </h2>
                            <p className="text-gray-600 dark:text-gray-400 mt-1">
                                {t('FlashSale.subtitle')}
                            </p>
                        </div>
                    </div>

                    {/* Countdown */}
                    <div className="flex items-center gap-2">
                        <span className="text-gray-700 dark:text-gray-300 font-medium">
                            {t('FlashSale.endsIn')}
                        </span>
                        <div className="flex gap-2">
                            {[
                                { value: timeLeft.hours, label: t('FlashSale.hours') },
                                { value: timeLeft.minutes, label: t('FlashSale.minutes') },
                                { value: timeLeft.seconds, label: t('FlashSale.seconds') }
                            ].map((item, index) => (
                                <div key={index} className="flex flex-col items-center bg-white dark:bg-gray-800 rounded-lg px-3 py-2 shadow-lg">
                                    <span className="text-2xl font-bold text-red-600 dark:text-red-400">
                                        {formatNumber(item.value)}
                                    </span>
                                    <span className="text-xs text-gray-600 dark:text-gray-400">
                                        {item.label}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Books Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
                    {books.slice(0, 10).map((book) => (
                        <BookCard key={book.id} book={book} />
                    ))}
                </div>

                {/* View All Button */}
                <div className="text-center">
                    <Link
                        to="/books?sale=true"
                        className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-full font-bold text-lg hover:from-red-600 hover:to-orange-600 transition-all shadow-lg hover:shadow-xl group"
                    >
                        <span>{t('FlashSale.viewAll')}</span>
                        <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>
            </div>
        </section>
    );
});

FlashSaleSection.displayName = 'FlashSaleSection';