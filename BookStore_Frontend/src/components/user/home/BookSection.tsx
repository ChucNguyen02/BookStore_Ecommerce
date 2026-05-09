import { memo } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { BookCard } from '../books/BookCard';
import type { BookResponse } from '../../../types/book.types';

interface BookSectionProps {
    title: string;
    books: BookResponse[];
    viewAllLink?: string;
    icon?: React.ReactNode;
    bgColor?: string;
}

export const BookSection = memo(({
    title,
    books,
    viewAllLink = '/books',
    icon,
    bgColor = 'from-amber-500 to-orange-500'
}: BookSectionProps) => {
    const { t } = useTranslation();

    return (
        <section className="py-16">
            <div className="container mx-auto px-4">
                {/* Section Header */}
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                        {icon && (
                            <div className={`p-3 bg-gradient-to-r ${bgColor} text-white rounded-xl shadow-lg`}>
                                {icon}
                            </div>
                        )}
                        <div>
                            <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 dark:text-white">
                                {title}
                            </h2>
                            <div className={`h-1 w-20 bg-gradient-to-r ${bgColor} rounded-full mt-2`} />
                        </div>
                    </div>

                    <Link
                        to={viewAllLink}
                        className="flex items-center gap-2 px-6 py-3 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full font-semibold hover:bg-amber-50 dark:hover:bg-gray-700 hover:text-amber-600 dark:hover:text-amber-400 transition-all shadow-md hover:shadow-lg group"
                    >
                        <span>{t('BookSection.viewAll')}</span>
                        <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>

                {/* Books Grid */}
                {books.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {books.map((book) => (
                            <BookCard key={book.id} book={book} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-16">
                        <p className="text-gray-500 dark:text-gray-400 text-lg">
                            {t('BookSection.noBooks')}
                        </p>
                    </div>
                )}
            </div>
        </section>
    );
});

BookSection.displayName = 'BookSection';