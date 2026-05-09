import React, { useState } from 'react';
import { Filter, X, ChevronDown } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useCategories } from '../../../hooks/user/useCategories';
import type { NewArrivalFilters } from '../../../types/new_arrivals.types';

interface NewArrivalsFiltersProps {
  filters: NewArrivalFilters;
  onFiltersChange: (filters: NewArrivalFilters) => void;
}

export const NewArrivalsFilters: React.FC<NewArrivalsFiltersProps> = ({
  filters,
  onFiltersChange
}) => {
  const { t } = useTranslation();
  const { useAllCategories } = useCategories();
  const { data: categories = [], isLoading: loadingCategories } = useAllCategories();

  const [showFilters, setShowFilters] = useState(false);
  const [localFilters, setLocalFilters] = useState(filters);

  const LANGUAGES = [
  { value: 'Vietnamese', label: t('NewArrivalsFilters.langVietnamese') },
  { value: 'English', label: t('NewArrivalsFilters.langEnglish') },
  { value: 'Chinese', label: t('NewArrivalsFilters.langChinese') },
  { value: 'Japanese', label: t('NewArrivalsFilters.langJapanese') },
  { value: 'Korean', label: t('NewArrivalsFilters.langKorean') },
  { value: 'French', label: t('NewArrivalsFilters.langFrench') }];


  const handleApplyFilters = () => {
    onFiltersChange(localFilters);
    setShowFilters(false);
  };

  const handleResetFilters = () => {
    const resetFilters: NewArrivalFilters = {
      sortBy: 'newest',
      sortDirection: 'DESC'
    };
    setLocalFilters(resetFilters);
    onFiltersChange(resetFilters);
  };

  const activeFilterCount = [
  localFilters.categoryId,
  localFilters.minPrice,
  localFilters.maxPrice,
  localFilters.language].
  filter(Boolean).length;

  return (
    <div className="space-y-4">
            <div className="flex items-center justify-between">
                <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">

                    <Filter className="w-5 h-5" />
                    <span className="font-medium">{t('NewArrivalsFilters.filter')}</span>
                    {activeFilterCount > 0 &&
          <span className="px-2 py-0.5 bg-teal-500 text-white text-xs rounded-full">
                            {activeFilterCount}
                        </span>
          }
                    <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
                </button>

                <div className="flex items-center gap-2">
                    <label className="text-sm text-gray-600 dark:text-gray-400">{t('NewArrivalsFilters.sortLabel')}</label>
                    <select
            value={`${filters.sortBy}-${filters.sortDirection}`}
            onChange={(e) => {
              const [sortBy, sortDirection] = e.target.value.split('-') as [NewArrivalFilters['sortBy'], 'ASC' | 'DESC'];
              onFiltersChange({ ...filters, sortBy, sortDirection });
            }}
            className="px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500">

                        <option value="newest-DESC">{t('NewArrivalsFilters.sortNewest')}</option>
                        <option value="price-ASC">{t('NewArrivalsFilters.sortPriceLow')}</option>
                        <option value="price-DESC">{t('NewArrivalsFilters.sortPriceHigh')}</option>
                        <option value="rating-DESC">{t('NewArrivalsFilters.sortRating')}</option>
                        <option value="popular-DESC">{t('NewArrivalsFilters.sortPopular')}</option>
                    </select>
                </div>
            </div>

            {showFilters &&
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 space-y-6 animate-fadeInDown">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                {t('NewArrivalsFilters.category')}
                            </label>
                            <select
              value={localFilters.categoryId || ''}
              onChange={(e) => setLocalFilters({ ...localFilters, categoryId: e.target.value || undefined })}
              disabled={loadingCategories}
              className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 disabled:opacity-50 disabled:cursor-not-allowed">

                                <option value="">
                                    {loadingCategories ? t('NewArrivalsFilters.loading') : t('NewArrivalsFilters.allCategories')}
                                </option>
                                {categories.map((category) =>
              <option key={category.id} value={category.id}>
                                        {category.name}
                                    </option>
              )}
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                {t('NewArrivalsFilters.language')}
                            </label>
                            <select
              value={localFilters.language || ''}
              onChange={(e) => setLocalFilters({ ...localFilters, language: e.target.value || undefined })}
              className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500">

                                <option value="">{t('NewArrivalsFilters.allLanguages')}</option>
                                {LANGUAGES.map((lang) =>
              <option key={lang.value} value={lang.value}>
                                        {lang.label}
                                    </option>
              )}
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                {t('NewArrivalsFilters.minPrice')}
                            </label>
                            <input
              type="number"
              value={localFilters.minPrice || ''}
              onChange={(e) => setLocalFilters({ ...localFilters, minPrice: e.target.value ? Number(e.target.value) : undefined })}
              placeholder={t("Common.0d")}
              className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500" />

                        </div>

                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                {t('NewArrivalsFilters.maxPrice')}
                            </label>
                            <input
              type="number"
              value={localFilters.maxPrice || ''}
              onChange={(e) => setLocalFilters({ ...localFilters, maxPrice: e.target.value ? Number(e.target.value) : undefined })}
              placeholder={t("Common.1000000d")}
              className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500" />

                        </div>
                    </div>

                    <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                        <button
            onClick={handleResetFilters}
            className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors flex items-center gap-2">

                            <X className="w-4 h-4" />
                            {t('NewArrivalsFilters.reset')}
                        </button>
                        <button
            onClick={handleApplyFilters}
            className="px-6 py-2 bg-teal-500 hover:bg-teal-600 text-white rounded-lg transition-colors font-medium">

                            {t('NewArrivalsFilters.apply')}
                        </button>
                    </div>
                </div>
      }
        </div>);

};