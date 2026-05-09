import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { usePromotions } from '../../../hooks/user/usePromotions';
import { PromotionHero } from '../../../components/user/promotions/PromotionHero';
import { PromotionFilters } from '../../../components/user/promotions/PromotionFilters';
import { PromotionTabs } from '../../../components/user/promotions/PromotionTabs';
import { SaleBookGrid } from '../../../components/user/promotions/SaleBookGrid';
import { VoucherSection } from '../../../components/user/promotions/VoucherSection';
import { FeaturedDeals } from '../../../components/user/promotions/FeaturedDeals';
import { FlashSaleSection } from '../../../components/user/promotions/FlashSaleSection';
import LoadingSpinner from '../../../components/user/common/LoadingSpinner';
import { ErrorMessage } from '../../../components/user/common/ErrorMessage';
import { Container } from '../../../components/user/common/Container';
import type { PromotionTab, PromotionFiltersType } from '../../../types/promotion.types';

const Promotions: React.FC = () => {
    const { t } = useTranslation();
    const [activeTab, setActiveTab] = useState<PromotionTab>('all');
    const [filters, setFilters] = useState<PromotionFiltersType>({
        minDiscount: undefined,
        maxPrice: undefined,
        categoryId: undefined,
        sortBy: 'discount',
    });

    const {
        books,
        vouchers,
        featuredDeals,
        flashSale,
        isLoading,
        error,
        hasMore,
        loadMore,
    } = usePromotions({ activeTab, filters });

    if (error) {
        return (
            <Container className="py-8">
                <ErrorMessage
                    title={t('Promotions.errorTitle')}
                    message={error}
                    onRetry={() => window.location.reload()}
                />
            </Container>
        );
    }

    return (
        <>
            <title>{t('Promotions.pageTitle')} - BookStore</title>
            <meta
                name="description"
                content={t('Promotions.pageDescription')}
            />

            <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white dark:from-gray-900 dark:to-gray-800">
                {/* Hero Section */}
                <PromotionHero />

                <Container className="py-8 space-y-8">
                    {/* Flash Sale - Show if active */}
                    {flashSale && (
                        <FlashSaleSection
                            flashSale={flashSale}
                            isLoading={isLoading}
                        />
                    )}

                    {/* Featured Deals */}
                    <FeaturedDeals
                        deals={featuredDeals}
                        isLoading={isLoading}
                    />

                    {/* Vouchers Section */}
                    <VoucherSection
                        vouchers={vouchers}
                        isLoading={isLoading}
                    />

                    {/* Main Content */}
                    <div className="space-y-6">
                        {/* Tabs */}
                        <PromotionTabs
                            activeTab={activeTab}
                            onTabChange={setActiveTab}
                        />

                        {/* Filters */}
                        <PromotionFilters
                            filters={filters}
                            onFiltersChange={setFilters}
                        />

                        {/* Books Grid */}
                        {isLoading && books.length === 0 ? (
                            <div className="flex justify-center py-12">
                                <LoadingSpinner size="large" />
                            </div>
                        ) : (
                            <SaleBookGrid
                                books={books}
                                isLoading={isLoading}
                                hasMore={hasMore}
                                onLoadMore={loadMore}
                            />
                        )}
                    </div>
                </Container>
            </div>
        </>
    );
};

export default Promotions;