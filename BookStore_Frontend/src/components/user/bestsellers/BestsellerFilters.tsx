import React, { useState } from 'react';
import { Filter, X, ChevronDown } from 'lucide-react';
import { useCategories } from '../../../hooks/user/useCategories';
import { useTranslation } from 'react-i18next';
import type { BestsellerFilters } from '../../../types/bestseller.types';

interface BestsellerFiltersProps {
  filters: BestsellerFilters;
  onFiltersChange: (filters: BestsellerFilters) => void;
}

export const BestsellerFilters: React.FC<BestsellerFiltersProps> = ({
  filters,
  onFiltersChange
}) => {
  const { t } = useTranslation();
  const prefix = 'BestsellerFilters';
  const { useAllCategories } = useCategories();
  const { data: categories = [], isLoading: loadingCategories } = useAllCategories();

  const [showFilters, setShowFilters] = useState(false);
  const [localFilters, setLocalFilters] = useState(filters);

  const handleApplyFilters = () => {
    onFiltersChange(localFilters);
    setShowFilters(false);
  };

  const handleResetFilters = () => {
    const resetFilters: BestsellerFilters = {
      sortBy: 'soldCount',
      sortDirection: 'DESC'
    };
    setLocalFilters(resetFilters);
    onFiltersChange(resetFilters);
  };

  const activeFilterCount = [
  localFilters.categoryId,
  localFilters.minPrice,
  localFilters.maxPrice,
  localFilters.minRating].
  filter(Boolean).length;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
          
          <Filter className="w-5 h-5" />
          <span className="font-medium">{t(`${prefix}.filterButton`)}</span>
          {activeFilterCount > 0 &&
          <span className="px-2 py-0.5 bg-amber-500 text-white text-xs rounded-full">
              {activeFilterCount}
            </span>
          }
          <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
        </button>

        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-600 dark:text-gray-400">
            {t(`${prefix}.sortLabel`)}
          </label>
          <select
            value={`${filters.sortBy}-${filters.sortDirection}`}
            onChange={(e) => {
              const [sortBy, sortDirection] = e.target.value.split('-') as [BestsellerFilters['sortBy'], 'ASC' | 'DESC'];
              onFiltersChange({ ...filters, sortBy, sortDirection });
            }}
            className="px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500">
            
            <option value="soldCount-DESC">{t(`${prefix}.sortOptions.soldCount-DESC`)}</option>
            <option value="rating-DESC">{t(`${prefix}.sortOptions.rating-DESC`)}</option>
            <option value="price-ASC">{t(`${prefix}.sortOptions.price-ASC`)}</option>
            <option value="price-DESC">{t(`${prefix}.sortOptions.price-DESC`)}</option>
            <option value="newest-DESC">{t(`${prefix}.sortOptions.newest-DESC`)}</option>
          </select>
        </div>
      </div>

      {showFilters &&
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Category Filter */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                {t(`${prefix}.category`)}
              </label>
              <select
              value={localFilters.categoryId || ''}
              onChange={(e) => setLocalFilters({ ...localFilters, categoryId: e.target.value || undefined })}
              disabled={loadingCategories}
              className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 disabled:opacity-50 disabled:cursor-not-allowed">
              
                <option value="">
                  {loadingCategories ? t(`${prefix}.loadingCategories`) : t(`${prefix}.allCategories`)}
                </option>
                {categories.map((category) =>
              <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
              )}
              </select>
            </div>

            {/* Min Price Filter */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                {t(`${prefix}.minPrice`)}
              </label>
              <input
              type="number"
              value={localFilters.minPrice || ''}
              onChange={(e) => setLocalFilters({ ...localFilters, minPrice: e.target.value ? Number(e.target.value) : undefined })}
              placeholder={t("Common.0d")}
              min="0"
              className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500" />
            
            </div>

            {/* Max Price Filter */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                {t(`${prefix}.maxPrice`)}
              </label>
              <input
              type="number"
              value={localFilters.maxPrice || ''}
              onChange={(e) => setLocalFilters({ ...localFilters, maxPrice: e.target.value ? Number(e.target.value) : undefined })}
              placeholder={t("Common.1000000d")}
              min="0"
              className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500" />
            
            </div>

            {/* Min Rating Filter */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                {t(`${prefix}.minRating`)}
              </label>
              <select
              value={localFilters.minRating || ''}
              onChange={(e) => setLocalFilters({ ...localFilters, minRating: e.target.value ? Number(e.target.value) : undefined })}
              className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500">
              
                <option value="">{t(`${prefix}.allRatings`)}</option>
                <option value="4">{t(`${prefix}.ratingOptions.4`)}</option>
                <option value="3">{t(`${prefix}.ratingOptions.3`)}</option>
                <option value="2">{t(`${prefix}.ratingOptions.2`)}</option>
              </select>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
            onClick={handleResetFilters}
            className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors flex items-center gap-2">
            
              <X className="w-4 h-4" />
              {t(`${prefix}.reset`)}
            </button>
            <button
            onClick={handleApplyFilters}
            className="px-6 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg transition-colors font-medium">
            
              {t(`${prefix}.apply`)}
            </button>
          </div>
        </div>
      }
    </div>);

};