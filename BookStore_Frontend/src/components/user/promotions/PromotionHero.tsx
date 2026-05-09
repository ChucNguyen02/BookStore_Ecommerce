import React from 'react';
import { Sparkles, Tag, TrendingUp, Zap } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Container } from '../../user/common/Container';

export const PromotionHero: React.FC = () => {
    const { t } = useTranslation();

    return (
        <div className="relative bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 dark:from-amber-700 dark:via-orange-700 dark:to-red-700 text-white overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute inset-0" style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                }} />
            </div>

            <Container className="relative py-16 md:py-24">
                <div className="max-w-4xl mx-auto text-center">
                    {/* Icon */}
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full mb-6">
                        <Sparkles className="w-10 h-10" />
                    </div>

                    {/* Title */}
                    <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
                        {t('PromotionHero.title')}
                    </h1>

                    {/* Description */}
                    <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-2xl mx-auto">
                        {t('PromotionHero.subtitle')}
                    </p>

                    {/* Features */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto">
                        <div className="flex items-center justify-center gap-3 bg-white/10 backdrop-blur-sm rounded-xl p-4">
                            <Zap className="w-6 h-6 flex-shrink-0" />
                            <span className="font-semibold">{t('PromotionHero.flashSale')}</span>
                        </div>

                        <div className="flex items-center justify-center gap-3 bg-white/10 backdrop-blur-sm rounded-xl p-4">
                            <Tag className="w-6 h-6 flex-shrink-0" />
                            <span className="font-semibold">{t('PromotionHero.vouchers')}</span>
                        </div>

                        <div className="flex items-center justify-center gap-3 bg-white/10 backdrop-blur-sm rounded-xl p-4">
                            <TrendingUp className="w-6 h-6 flex-shrink-0" />
                            <span className="font-semibold">{t('PromotionHero.hotDeals')}</span>
                        </div>
                    </div>
                </div>
            </Container>

            {/* Bottom Wave */}
            <div className="absolute bottom-0 left-0 right-0">
                <svg viewBox="0 0 1440 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
                    <path
                        d="M0 48h1440V0s-168 48-360 48S840 0 720 0 360 48 360 48 168 0 0 0v48z"
                        className="fill-amber-50 dark:fill-gray-900"
                    />
                </svg>
            </div>
        </div>
    );
};