import React, { useState, useMemo } from 'react';
import { useNewArrivals } from '../../../hooks/user/useNewArrivals';
import { NewArrivalsHero } from '../../../components/user/new-arrivals/NewArrivalsHero';
import { NewArrivalsTimeline } from '../../../components/user/new-arrivals/NewArrivalsTimeline';
import { NewArrivalsFilters } from '../../../components/user/new-arrivals/NewArrivalsFilters';
import { NewArrivalsHighlights } from '../../../components/user/new-arrivals/NewArrivalsHighlights';
import { NewArrivalsGrid } from '../../../components/user/new-arrivals/NewArrivalsGrid';
import { Container } from '../../../components/user/common/Container';
import { ErrorMessage } from '../../../components/user/common/ErrorMessage';
import { useTranslation } from 'react-i18next';
import type { NewArrivalFilters, NewArrivalTimePeriod, NewArrivalHighlight } from '../../../types/new_arrivals.types';

const NewArrivals: React.FC = () => {
    const { t } = useTranslation();

    const [filters, setFilters] = useState<NewArrivalFilters>({
        sortBy: 'newest',
        sortDirection: 'DESC',
    });
    const [period, setPeriod] = useState<NewArrivalTimePeriod>('all');

    const {
        books,
        isLoading,
        error,
        hasMore,
        totalElements,
        loadMore,
        refresh,
    } = useNewArrivals(filters, period);

    const highlights = useMemo((): NewArrivalHighlight[] => {
        if (books.length === 0) return [];

        return books.slice(0, 3).map(book => ({
            id: book.id,
            title: book.title,
            slug: book.slug,
            coverImageUrl: book.coverImageUrl,
            price: book.price,
            discountPrice: book.discountPrice,
            categoryName: book.categoryName,
            authors: book.authors.map(a => a.name),
            isNew: true,
        }));
    }, [books]);

    if (error) {
        return (
            <Container className="py-8">
                <ErrorMessage
                    title={t('NewArrivals.error.title')}
                    message={error}
                    onRetry={refresh}
                />
            </Container>
        );
    }

    return (
        <>
            <title>{t('NewArrivals.meta.title')}</title>
            <meta
                name="description"
                content={t('NewArrivals.meta.description')}
            />

            <div className="min-h-screen bg-gradient-to-b from-teal-50 to-white dark:from-gray-900 dark:to-gray-800">
                <NewArrivalsHero />

                <Container className="py-8 space-y-8">
                    <NewArrivalsTimeline
                        activePeriod={period}
                        onPeriodChange={setPeriod}
                    />

                    <NewArrivalsHighlights
                        highlights={highlights}
                        isLoading={isLoading && books.length === 0}
                    />

                    <NewArrivalsFilters
                        filters={filters}
                        onFiltersChange={setFilters}
                    />

                    <div>
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                                {t('NewArrivals.allNewBooks')}
                            </h2>
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                                {t('NewArrivals.totalBooks', { count: totalElements })}
                            </span>
                        </div>

                        <NewArrivalsGrid
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

export default NewArrivals;