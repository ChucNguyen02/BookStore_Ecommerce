
import { Search, Filter, X, LayoutGrid, List } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface CategoryFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  viewMode: 'grid' | 'list';
  onViewModeChange: (mode: 'grid' | 'list') => void;
  sortBy: 'order' | 'name' | 'name-desc' | 'bookCount' | 'createdAt';
  onSortChange: (sort: 'order' | 'name' | 'name-desc' | 'bookCount' | 'createdAt') => void;
  showInactive: boolean;
  onShowInactiveChange: (show: boolean) => void;
  totalCount: number;
  filteredCount: number;
}

export const CategoryFilters = ({
  searchQuery,
  onSearchChange,
  viewMode,
  onViewModeChange,
  sortBy,
  onSortChange,
  showInactive,
  onShowInactiveChange,
  totalCount,
  filteredCount,
}: CategoryFiltersProps) => {
  const { t } = useTranslation();

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg space-y-4">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
        <input
          type="text"
          placeholder={t('categoryFilters.searchPlaceholder')}
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-12 pr-12 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 dark:focus:ring-amber-400 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 transition-all"
        />
        {searchQuery && (
          <button
            onClick={() => onSearchChange('')}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors"
            aria-label={t('categoryFilters.clearSearch')}
          >
            <X className="w-4 h-4 text-gray-500 dark:text-gray-400" />
          </button>
        )}
      </div>

      {/* Filters Row */}
      <div className="flex flex-wrap items-center gap-4">
        {/* Sort Dropdown */}
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-500 dark:text-gray-400" />
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value as typeof sortBy)}
            className="px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-500 dark:focus:ring-amber-400 transition-all cursor-pointer"
          >
            <option value="order">{t('categoryFilters.sort.order')}</option>
            <option value="name">{t('categoryFilters.sort.nameAZ')}</option>
            <option value="name-desc">{t('categoryFilters.sort.nameZA')}</option>
            <option value="bookCount">{t('categoryFilters.sort.bookCount')}</option>
            <option value="createdAt">{t('categoryFilters.sort.newest')}</option>
          </select>
        </div>

        {/* Show Inactive Toggle */}
        <label className="flex items-center gap-2 cursor-pointer group">
          <div className="relative">
            <input
              type="checkbox"
              checked={showInactive}
              onChange={(e) => onShowInactiveChange(e.target.checked)}
              className="sr-only"
            />
            <div
              className={`w-11 h-6 rounded-full transition-colors ${
                showInactive ? 'bg-amber-500 dark:bg-amber-600' : 'bg-gray-300 dark:bg-gray-600'
              }`}
            >
              <div
                className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                  showInactive ? 'translate-x-5' : ''
                }`}
              />
            </div>
          </div>
          <span className="text-sm text-gray-700 dark:text-gray-300 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
            {t('categoryFilters.showInactive')}
          </span>
        </label>

        {/* View Mode Toggle (Desktop only) */}
        <div className="hidden md:flex items-center gap-1 ml-auto border border-gray-300 dark:border-gray-700 rounded-lg p-1 bg-gray-50 dark:bg-gray-900">
          <button
            onClick={() => onViewModeChange('grid')}
            className={`p-2 rounded transition-all ${
              viewMode === 'grid' ? 'bg-amber-500 text-white shadow-sm' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
            aria-label={t('categoryFilters.gridView')}
          >
            <LayoutGrid className="w-5 h-5" />
          </button>
          <button
            onClick={() => onViewModeChange('list')}
            className={`p-2 rounded transition-all ${
              viewMode === 'list' ? 'bg-amber-500 text-white shadow-sm' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
            aria-label={t('categoryFilters.listView')}
          >
            <List className="w-5 h-5" />
          </button>
        </div>

        {/* Results Count */}
        <div className="text-sm text-gray-600 dark:text-gray-400">
          {t('categoryFilters.resultsCount', { filtered: filteredCount, total: totalCount })}
        </div>
      </div>

      {/* Active Filters Tags */}
      {(searchQuery || showInactive) && (
        <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-200 dark:border-gray-700">
          {searchQuery && (
            <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-400 rounded-full text-sm font-medium">
              {t('categoryFilters.searchLabel')}: "{searchQuery}"
              <button
                onClick={() => onSearchChange('')}
                className="ml-1 hover:bg-amber-200 dark:hover:bg-amber-800/60 rounded-full p-0.5 transition-colors"
                aria-label={t('categoryFilters.clearSearch')}
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </span>
          )}
          {showInactive && (
            <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-400 rounded-full text-sm font-medium">
              {t('categoryFilters.includingInactive')}
              <button
                onClick={() => onShowInactiveChange(false)}
                className="ml-1 hover:bg-amber-200 dark:hover:bg-amber-800/60 rounded-full p-0.5 transition-colors"
                aria-label={t('categoryFilters.hideInactive')}
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </span>
          )}
        </div>
      )}
    </div>
  );
};