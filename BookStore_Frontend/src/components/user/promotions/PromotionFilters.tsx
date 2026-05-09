import { useState } from 'react';
import { SlidersHorizontal, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { PromotionFiltersType } from '../../../types/promotion.types';

interface PromotionFiltersProps {
    filters: PromotionFiltersType;
    onFiltersChange: (filters: PromotionFiltersType) => void;
}

export const PromotionFilters: React.FC<PromotionFiltersProps> = ({ filters, onFiltersChange }) => {
    const { t } = useTranslation();
    const [isOpen, setIsOpen] = useState(false);

    const handleReset = () => {
        onFiltersChange({
            minDiscount: undefined,
            maxPrice: undefined,
            categoryId: undefined,
            sortBy: 'discount',
        });
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm">
            <div className="flex items-center justify-between mb-4">
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-amber-600 dark:hover:text-amber-400"
                >
                    <SlidersHorizontal className="w-5 h-5" />
                    <span className="font-medium">{t('PromotionFilters.filters')}</span>
                </button>

                {(filters.minDiscount || filters.maxPrice) && (
                    <button
                        onClick={handleReset}
                        className="flex items-center gap-1 text-sm text-red-600 hover:text-red-700"
                    >
                        <X className="w-4 h-4" />
                        {t('PromotionFilters.clearFilters')}
                    </button>
                )}
            </div>

            {isOpen && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t dark:border-gray-700">
                    {/* Min Discount */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            {t('PromotionFilters.minDiscount')}
                        </label>
                        <select
                            value={filters.minDiscount || ''}
                            onChange={(e) =>
                                onFiltersChange({
                                    ...filters,
                                    minDiscount: e.target.value ? Number(e.target.value) : undefined,
                                })
                            }
                            className="w-full px-4 py-2 border dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        >
                            <option value="">{t('PromotionFilters.allOption')}</option>
                            <option value="10">10%+</option>
                            <option value="20">20%+</option>
                            <option value="30">30%+</option>
                            <option value="50">50%+</option>
                        </select>
                    </div>

                    {/* Max Price */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            {t('PromotionFilters.maxPrice')}
                        </label>
                        <select
                            value={filters.maxPrice || ''}
                            onChange={(e) =>
                                onFiltersChange({
                                    ...filters,
                                    maxPrice: e.target.value ? Number(e.target.value) : undefined,
                                })
                            }
                            className="w-full px-4 py-2 border dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        >
                            <option value="">{t('PromotionFilters.allOption')}</option>
                            <option value="100000">{t('PromotionFilters.under100k')}</option>
                            <option value="200000">{t('PromotionFilters.under200k')}</option>
                            <option value="300000">{t('PromotionFilters.under300k')}</option>
                            <option value="500000">{t('PromotionFilters.under500k')}</option>
                        </select>
                    </div>

                    {/* Sort */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            {t('PromotionFilters.sortBy')}
                        </label>
                        <select
                            value={filters.sortBy || 'discount'}
                            onChange={(e) =>
                                onFiltersChange({
                                    ...filters,
                                    sortBy: e.target.value as 'discount' | 'newest' | 'popular',
                                })
                            }
                            className="w-full px-4 py-2 border dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        >
                            <option value="discount">{t('PromotionFilters.sortDiscount')}</option>
                            <option value="newest">{t('PromotionFilters.sortNewest')}</option>
                            <option value="popular">{t('PromotionFilters.sortPopular')}</option>
                        </select>
                    </div>
                </div>
            )}
        </div>
    );
};