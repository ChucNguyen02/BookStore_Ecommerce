import React from 'react';
import { Clock, Sparkles, Package } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export const NewArrivalsHero: React.FC = () => {
    const { t } = useTranslation();

    return (
        <div className="relative bg-gradient-to-r from-teal-600 via-cyan-500 to-blue-500 dark:from-teal-900 dark:via-cyan-900 dark:to-blue-900 overflow-hidden">
            <div className="absolute inset-0 bg-black/10" />
            <div className="absolute inset-0">
                <div className="absolute top-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
                <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
                <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-white/5 rounded-full blur-2xl -translate-x-1/2 -translate-y-1/2" />
            </div>

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
                <div className="text-center space-y-6">
                    <div className="flex items-center justify-center gap-3">
                        <div className="p-3 bg-white/20 backdrop-blur-sm rounded-2xl animate-pulse">
                            <Clock className="w-8 h-8 text-white" />
                        </div>
                        <h1 className="text-4xl lg:text-6xl font-bold text-white">
                            {t('NewArrivalsHero.title')}
                        </h1>
                    </div>

                    <p className="text-xl text-white/90 max-w-2xl mx-auto">
                        {t('NewArrivalsHero.subtitle')}
                    </p>

                    <div className="flex flex-wrap items-center justify-center gap-6 pt-4">
                        <div className="flex items-center gap-3 px-6 py-3 bg-white/20 backdrop-blur-sm rounded-full">
                            <Sparkles className="w-5 h-5 text-yellow-300" />
                            <span className="text-white font-medium">{t('NewArrivalsHero.newlyUpdated')}</span>
                        </div>
                        <div className="flex items-center gap-3 px-6 py-3 bg-white/20 backdrop-blur-sm rounded-full">
                            <Package className="w-5 h-5 text-yellow-300" />
                            <span className="text-white font-medium">{t('NewArrivalsHero.exclusive')}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};