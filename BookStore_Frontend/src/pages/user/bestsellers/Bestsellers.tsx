import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useBestsellers } from '../../../hooks/user/useBestsellers';
import { BestsellerHero } from '../../../components/user/bestsellers/BestsellerHero';
import { BestsellerFilters } from '../../../components/user/bestsellers/BestsellerFilters';
import { BestsellerStats } from '../../../components/user/bestsellers/BestsellerStats';
import { BestsellerGrid } from '../../../components/user/bestsellers/BestsellerGrid';
import { Container } from '../../../components/user/common/Container';
import { ErrorMessage } from '../../../components/user/common/ErrorMessage';
import type { BestsellerFilters as FiltersType, BestsellerPeriod } from '../../../types/bestseller.types';

const Bestsellers: React.FC = () => {
    const { t } = useTranslation();

    const [filters, setFilters] = useState<FiltersType>({
        sortBy: 'soldCount',
        sortDirection: 'DESC',
    });
    const [period] = useState<BestsellerPeriod>('all');

    const {
        books,
        isLoading,
        error,
        hasMore,
        totalElements,
        loadMore,
        refresh,
    } = useBestsellers(filters, period);

    const stats = useMemo(() => {
        if (books.length === 0) {
            return {
                totalBooks: 0,
                averageRating: 0,
                totalSold: 0,
            };
        }

        const totalRating = books.reduce((sum, book) => sum + book.averageRating, 0);
        const totalSold = books.reduce((sum, book) => sum + book.soldCount, 0);

        return {
            totalBooks: totalElements,
            averageRating: totalRating / books.length,
            totalSold,
        };
    }, [books, totalElements]);

    if (error) {
        return (
            <Container className="py-8">
                <ErrorMessage
                    title={t('Bestsellers.errorTitle')}
                    message={error}
                    onRetry={refresh}
                />
            </Container>
        );
    }

    return (
        <>
            <title>{t('Bestsellers.pageTitle')} - BookStore</title>
            <meta
                name="description"
                content={t('Bestsellers.pageDescription')}
            />

            <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
                <BestsellerHero />

                <Container className="py-8 space-y-8">
                    <BestsellerStats
                        totalBooks={stats.totalBooks}
                        averageRating={stats.averageRating}
                        totalSold={stats.totalSold}
                    />

                    <BestsellerFilters
                        filters={filters}
                        onFiltersChange={setFilters}
                    />

                    <div>
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                                {t('Bestsellers.listTitle')}
                            </h2>
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                                {t('Bestsellers.totalBooks', { count: totalElements })}
                            </span>
                        </div>

                        <BestsellerGrid
                            books={books}
                            isLoading={isLoading}
                            hasMore={hasMore}
                            onLoadMore={loadMore}
                        />
                    </div>
                </Container>
            </div>
        </>
    );
};

export default Bestsellers;