import React from 'react';
import { TrendingUp, Award, Zap } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export const BestsellerHero: React.FC = () => {
  const { t } = useTranslation();
  const prefix = 'bestsellerHero';

  return (
    <div className="relative bg-gradient-to-r from-purple-600 via-pink-500 to-red-500 dark:from-purple-900 dark:via-pink-900 dark:to-red-900 overflow-hidden">
      <div className="absolute inset-0 bg-black/10" />
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="text-center space-y-6">
          <div className="flex items-center justify-center gap-3">
            <div className="p-3 bg-white/20 backdrop-blur-sm rounded-2xl">
              <TrendingUp className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl lg:text-6xl font-bold text-white">
              {t(`${prefix}.title`)}
            </h1>
          </div>

          <p className="text-xl text-white/90 max-w-2xl mx-auto">
            {t(`${prefix}.subtitle`)}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-6 pt-4">
            <div className="flex items-center gap-3 px-6 py-3 bg-white/20 backdrop-blur-sm rounded-full">
              <Award className="w-5 h-5 text-yellow-300" />
              <span className="text-white font-medium">
                {t(`${prefix}.topRated`)}
              </span>
            </div>
            <div className="flex items-center gap-3 px-6 py-3 bg-white/20 backdrop-blur-sm rounded-full">
              <Zap className="w-5 h-5 text-yellow-300" />
              <span className="text-white font-medium">
                {t(`${prefix}.bestSeller`)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};