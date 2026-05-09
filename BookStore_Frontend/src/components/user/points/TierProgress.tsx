import { useTranslation } from 'react-i18next';import { Award, TrendingUp } from 'lucide-react';
import { useAppContext } from '../../../context/AppContext';
import type { Tier } from '../../../types/enum';

interface TierProgressProps {
  currentTier: Tier;
  nextTier: string;
  currentPoints: number;
  pointsToNextTier: number;
}

export const TierProgress = ({ currentTier, nextTier, currentPoints, pointsToNextTier }: TierProgressProps) => {const { t } = useTranslation();
  const { language } = useAppContext();

  const tiers: Record<Tier, {color: string;bg: string;label: string;}> = {
    BRONZE: {
      color: 'text-orange-600 dark:text-orange-400',
      bg: 'bg-gradient-to-r from-orange-400 to-orange-600',
      label: language === 'vi' ? t("Common.dong") : 'Bronze'
    },
    SILVER: {
      color: 'text-gray-600 dark:text-gray-400',
      bg: 'bg-gradient-to-r from-gray-400 to-gray-600',
      label: language === 'vi' ? t("Common.bac") : 'Silver'
    },
    GOLD: {
      color: 'text-yellow-600 dark:text-yellow-400',
      bg: 'bg-gradient-to-r from-yellow-400 to-yellow-600',
      label: language === 'vi' ? t("Common.vang") : 'Gold'
    },
    PLATINUM: {
      color: 'text-purple-600 dark:text-purple-400',
      bg: 'bg-gradient-to-r from-purple-400 to-purple-600',
      label: language === 'vi' ? t("Common.bachKim") : 'Platinum'
    }
  };

  const tierRequirements: Record<Tier, number> = {
    BRONZE: 0,
    SILVER: 1000,
    GOLD: 5000,
    PLATINUM: 10000
  };

  const currentTierPoints = tierRequirements[currentTier];
  const nextTierPoints = currentTierPoints + pointsToNextTier;
  const progress = (currentPoints - currentTierPoints) / pointsToNextTier * 100;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                    <Award className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                    {language === 'vi' ? t("Common.tienDoLenHang") : 'Tier Progress'}
                </h3>
                <div className="flex items-center gap-2">
                    <span className={`font-bold ${tiers[currentTier].color}`}>
                        {tiers[currentTier].label}
                    </span>
                    <TrendingUp className="w-4 h-4 text-gray-400" />
                    <span className="font-bold text-gray-900 dark:text-white">
                        {nextTier}
                    </span>
                </div>
            </div>

            {/* Progress Bar */}
            <div className="relative">
                <div className="w-full h-4 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div
            className={`h-full ${tiers[currentTier].bg} transition-all duration-500 relative`}
            style={{ width: `${Math.min(progress, 100)}%` }}>
            
                        <div className="absolute inset-0 bg-white/20 animate-pulse" />
                    </div>
                </div>

                {/* Points Labels */}
                <div className="flex items-center justify-between mt-2 text-sm">
                    <span className="text-gray-600 dark:text-gray-400">
                        {currentPoints.toLocaleString()}
                    </span>
                    <span className="font-semibold text-amber-600 dark:text-amber-400">
                        {pointsToNextTier.toLocaleString()} {language === 'vi' ? t("Common.diemNua") : 'more points'}
                    </span>
                    <span className="text-gray-600 dark:text-gray-400">
                        {nextTierPoints.toLocaleString()}
                    </span>
                </div>
            </div>

            {/* Percentage */}
            <div className="mt-4 text-center">
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {Math.round(progress)}%
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                    {language === 'vi' ? t("Common.hoanThanh") : 'Complete'}
                </p>
            </div>
        </div>);

};