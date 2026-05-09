import React from 'react';
import { Sparkles, Tag, TrendingUp, Clock } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { PromotionTab } from '../../../types/promotion.types';

interface PromotionTabsProps {
    activeTab: PromotionTab;
    onTabChange: (tab: PromotionTab) => void;
}

export const PromotionTabs: React.FC<PromotionTabsProps> = ({ activeTab, onTabChange }) => {
    const { t } = useTranslation();

    const tabs: Array<{ key: PromotionTab; label: string; icon: React.ReactNode }> = [
        { key: 'all', label: t('PromotionTabs.all'), icon: <Sparkles className="w-5 h-5" /> },
        { key: 'sale', label: t('PromotionTabs.onSale'), icon: <Tag className="w-5 h-5" /> },
        { key: 'bestseller', label: t('PromotionTabs.bestseller'), icon: <TrendingUp className="w-5 h-5" /> },
        { key: 'new', label: t('PromotionTabs.newArrival'), icon: <Clock className="w-5 h-5" /> },
    ];

    return (
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide pb-2">
            {tabs.map((tab) => (
                <button
                    key={tab.key}
                    onClick={() => onTabChange(tab.key)}
                    className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium whitespace-nowrap transition-all ${
                        activeTab === tab.key
                            ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg shadow-amber-500/50'
                            : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-amber-50 dark:hover:bg-gray-700'
                    }`}
                >
                    {tab.icon}
                    <span>{tab.label}</span>
                </button>
            ))}
        </div>
    );
};