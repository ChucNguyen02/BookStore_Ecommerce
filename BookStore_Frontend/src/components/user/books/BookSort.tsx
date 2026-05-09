import { ArrowUpDown } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { BookFilterRequest } from '../../../types/book.types';

interface BookSortProps {
  currentSort: {
    sortBy: string;
    sortDirection: 'ASC' | 'DESC';
  };
  onSortChange: (filters: Partial<BookFilterRequest>) => void;
}

const SORT_OPTIONS = [
  { value: 'createdAt-DESC', key: 'newest' },
  { value: 'createdAt-ASC', key: 'oldest' },
  { value: 'price-ASC', key: 'priceLowToHigh' },
  { value: 'price-DESC', key: 'priceHighToLow' },
  { value: 'averageRating-DESC', key: 'highestRated' },
  { value: 'soldCount-DESC', key: 'bestSelling' },
  { value: 'title-ASC', key: 'nameAZ' },
  { value: 'title-DESC', key: 'nameZA' },
] as const;

type SortValue = typeof SORT_OPTIONS[number]['value'];

export const BookSort = ({ currentSort, onSortChange }: BookSortProps) => {
  const { t } = useTranslation();

  const handleSortChange = (value: SortValue) => {
    const [sortBy, sortDirection] = value.split('-') as [string, 'ASC' | 'DESC'];

    onSortChange({
      sortBy,
      sortDirection,
      page: 0,
    });
  };

  const currentValue = `${currentSort.sortBy}-${currentSort.sortDirection}` as SortValue;

  // Fallback nếu currentValue không hợp lệ
  const selectedValue = SORT_OPTIONS.some((opt) => opt.value === currentValue)
    ? currentValue
    : SORT_OPTIONS[0].value;

  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
        <ArrowUpDown className="w-5 h-5" />
        <span className="text-sm font-medium hidden sm:inline">
          {t('bookSort.sortBy')}
        </span>
      </div>

      <select
        value={selectedValue}
        onChange={(e) => handleSortChange(e.target.value as SortValue)}
        className="px-5 py-2.5 border border-gray-300 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-medium focus:outline-none focus:ring-2 focus:ring-amber-500 dark:focus:ring-amber-400 transition-all cursor-pointer shadow-sm hover:border-amber-400 dark:hover:border-amber-500"
        aria-label={t('bookSort.ariaLabel')}
      >
        {SORT_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {t(`bookSort.options.${option.key}`)}
          </option>
        ))}
      </select>
    </div>
  );
};

export default BookSort;