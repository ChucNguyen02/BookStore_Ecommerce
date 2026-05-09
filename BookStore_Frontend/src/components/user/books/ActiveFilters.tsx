import { X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAppContext } from '../../../context/AppContext';
import { useCategories } from '../../../hooks/user/useCategories';
import { useAuthorsPaginated } from '../../../hooks/user/useAuthor';
import type { BookFilterRequest } from '../../../types/book.types';

interface ActiveFiltersProps {
  filters: BookFilterRequest;
  onRemoveFilter: (key: keyof BookFilterRequest) => void;
  onClearAll: () => void;
}

export const ActiveFilters = ({ filters, onRemoveFilter, onClearAll }: ActiveFiltersProps) => {
  const { t } = useTranslation();
  const { language } = useAppContext();
  const { useParentCategories } = useCategories();

  const languageDisplay: Record<string, { vi: string; en: string; }> = {
    vi: { vi: t('Common.tiengViet'), en: 'Vietnamese' },
    en: { vi: t('Common.tiengAnh'), en: 'English' },
    fr: { vi: t('Common.tiengPhap'), en: 'French' },
    ja: { vi: t('Common.tiengNhat'), en: 'Japanese' },
    zh: { vi: t('Common.tiengTrung'), en: 'Chinese' },
    ko: { vi: t('Common.tiengHan'), en: 'Korean' },
    de: { vi: t('Common.tiengDuc'), en: 'German' },
    es: { vi: t('Common.tiengTayBanNha'), en: 'Spanish' },
    it: { vi: t('Common.tiengY'), en: 'Italian' },
    ru: { vi: t('Common.tiengNga'), en: 'Russian' },
    th: { vi: t('Common.tiengThai'), en: 'Thai' }
  };

  const { data: categories } = useParentCategories();
  const { data: authorsData } = useAuthorsPaginated(0, 100);

  const categoryName = categories?.find((c) => c.id === filters.categoryId)?.name ?? '';
  const authorName = authorsData?.content.find((a) => a.id === filters.authorId)?.name ?? '';

  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const getLanguageName = (code: string): string => {
    const langMap = languageDisplay[code];
    if (!langMap) return code.toUpperCase();
    return language === 'vi' ? langMap.vi : langMap.en;
  };

  const activeFilters: Array<{
    key: keyof BookFilterRequest;
    labelKey: string;
    value?: string;
  }> = [];

  if (filters.keyword) {
    activeFilters.push({
      key: 'keyword',
      labelKey: 'keyword',
      value: filters.keyword
    });
  }

  if (filters.categoryId && categoryName) {
    activeFilters.push({
      key: 'categoryId',
      labelKey: 'category',
      value: categoryName
    });
  }

  if (filters.authorId && authorName) {
    activeFilters.push({
      key: 'authorId',
      labelKey: 'author',
      value: authorName
    });
  }

  if (filters.minPrice !== undefined) {
    activeFilters.push({
      key: 'minPrice',
      labelKey: 'minPrice',
      value: formatPrice(filters.minPrice)
    });
  }

  if (filters.maxPrice !== undefined) {
    activeFilters.push({
      key: 'maxPrice',
      labelKey: 'maxPrice',
      value: formatPrice(filters.maxPrice)
    });
  }

  if (filters.language) {
    activeFilters.push({
      key: 'language',
      labelKey: 'language',
      value: getLanguageName(filters.language)
    });
  }

  if (filters.minRating !== undefined) {
    activeFilters.push({
      key: 'minRating',
      labelKey: 'rating',
      value: `${filters.minRating}+ ⭐`
    });
  }

  if (filters.isFeatured) {
    activeFilters.push({
      key: 'isFeatured',
      labelKey: 'featured',
      value: ''
    });
  }

  if (filters.onSale) {
    activeFilters.push({
      key: 'onSale',
      labelKey: 'onSale',
      value: ''
    });
  }

  if (activeFilters.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-wrap items-center gap-3 p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-200 dark:border-amber-800">
      <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
        {t('activeFilters.filteringBy')}
      </span>

      <div className="flex flex-wrap gap-2">
        {activeFilters.map((filter) =>
          <button
            key={filter.key}
            onClick={() => onRemoveFilter(filter.key)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full text-sm font-medium hover:bg-red-50 dark:hover:bg-red-900/30 hover:text-red-600 dark:hover:text-red-400 transition-all group border border-gray-300 dark:border-gray-700 shadow-sm"
            aria-label={t('activeFilters.removeFilter', { label: t(`activeFilters.labels.${filter.labelKey}`) })}>

            <span>
              {t(`activeFilters.labels.${filter.labelKey}`)}
              {filter.value && `: ${filter.value}`}
            </span>
            <X className="w-4 h-4 transition-transform group-hover:scale-110" />
          </button>
        )}
      </div>

      <button
        onClick={onClearAll}
        className="ml-2 px-5 py-2 text-sm font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-full transition-all"
        aria-label={t('activeFilters.clearAll')}>

        {t('activeFilters.clearAll')}
      </button>
    </div>);

};