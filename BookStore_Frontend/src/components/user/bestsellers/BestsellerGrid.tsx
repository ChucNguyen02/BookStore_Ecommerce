import React from 'react';
import { TrendingUp, Award } from 'lucide-react';
import LoadingSpinner from '../../user/common/LoadingSpinner';
import { BookCard } from '../books/BookCard';
import { useTranslation } from 'react-i18next';
import type { BestsellerBook } from '../../../types/bestseller.types';
import type { BookResponse } from '../../../types/book.types';

interface BestsellerGridProps {
  books: BestsellerBook[];
  isLoading: boolean;
  hasMore: boolean;
  onLoadMore: () => void;
}

export const BestsellerGrid: React.FC<BestsellerGridProps> = ({
  books,
  isLoading,
  hasMore,
  onLoadMore,
}) => {
  const { t } = useTranslation();
  const prefix = 'BestsellerGrid';

  const convertToBookResponse = (book: BestsellerBook, index: number): BookResponse => {
    return {
      ...book,
      authors: book.authors || [],
      isFeatured: index < 3,
      isOnSale: !!book.discountPrice,
      categorySlug: book.categoryName.toLowerCase().replace(/\s+/g, '-'),
    } as BookResponse;
  };

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
        <TrendingUp className="w-16 h-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          {t(`${prefix}.noResults.title`)}
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          {t(`${prefix}.noResults.description`)}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {books.map((book, index) => {
          const isTopThree = index < 3;
          const bookData = convertToBookResponse(book, index);

          return (
            <div key={book.id} className="relative">
              {/* Top Badge Overlay */}
              {isTopThree && (
                <div className="absolute top-2 left-2 z-10">
                  <div
                    className={`px-3 py-1 rounded-lg font-bold text-white flex items-center gap-1 shadow-lg ${
                      index === 0
                        ? 'bg-gradient-to-r from-yellow-400 to-yellow-600'
                        : index === 1
                        ? 'bg-gradient-to-r from-gray-300 to-gray-500'
                        : 'bg-gradient-to-r from-orange-400 to-orange-600'
                    }`}
                  >
                    <Award className="w-4 h-4" />
                    <span>
                      {t(`${prefix}.top`)} {index + 1}
                    </span>
                  </div>
                </div>
              )}

              {/* Reuse BookCard component */}
              <BookCard book={bookData} viewMode="grid" />
            </div>
          );
        })}
      </div>

      {hasMore && (
        <div className="flex justify-center pt-6">
          <button
            onClick={onLoadMore}
            disabled={isLoading}
            className="px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isLoading ? (
              <>
                <LoadingSpinner size="sm" />
                <span>{t(`${prefix}.loading`)}</span>
              </>
            ) : (
              <span>{t(`${prefix}.loadMore`)}</span>
            )}
          </button>
        </div>
      )}
    </div>
  );
};