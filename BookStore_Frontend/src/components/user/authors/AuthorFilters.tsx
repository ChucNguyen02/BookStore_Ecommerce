import { Search, Grid, List, TrendingUp, Users } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface AuthorFiltersProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  viewMode: 'grid' | 'list';
  onViewModeChange: (mode: 'grid' | 'list') => void;
  sortBy: string;
  onSortChange: (value: string) => void;
  filterMode: 'all' | 'top';
  onFilterModeChange: (mode: 'all' | 'top') => void;
  totalCount: number;
  filteredCount: number;
}

export const AuthorFilters = ({
  searchQuery,
  onSearchChange,
  viewMode,
  onViewModeChange,
  sortBy,
  onSortChange,
  filterMode,
  onFilterModeChange,
  totalCount,
  filteredCount,
}: AuthorFiltersProps) => {
  const { t } = useTranslation();
  const prefix = 'AuthorFilters';

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg space-y-4">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={t(`${prefix}.searchPlaceholder`)}
          className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:border-amber-500 dark:focus:border-amber-400 focus:ring-2 focus:ring-amber-500/20 dark:focus:ring-amber-400/20 bg-white dark:bg-gray-900 text-gray-900 dark:text-white outline-none transition-all placeholder:text-gray-400 dark:placeholder:text-gray-500"
        />
      </div>

      {/* Filter and View Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2">
          {/* Filter Mode */}
          <button
            onClick={() => onFilterModeChange('all')}
            className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
              filterMode === 'all'
                ? 'bg-amber-500 text-white shadow-lg'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            <Users className="w-4 h-4" />
            {t(`${prefix}.filter.all`)}
          </button>

          <button
            onClick={() => onFilterModeChange('top')}
            className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
              filterMode === 'top'
                ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            {t(`${prefix}.filter.top`)}
          </button>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            className="px-4 py-2 border-2 border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 focus:border-amber-500 dark:focus:border-amber-400 focus:ring-2 focus:ring-amber-500/20 dark:focus:ring-amber-400/20 outline-none transition-all cursor-pointer"
          >
            <option value="bookCount">{t(`${prefix}.sort.bookCount`)}</option>
            <option value="name">{t(`${prefix}.sort.name`)}</option>
            <option value="name-desc">{t(`${prefix}.sort.nameDesc`)}</option>
            <option value="createdAt">{t(`${prefix}.sort.newest`)}</option>
          </select>
        </div>

        {/* View Mode */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => onViewModeChange('grid')}
            className={`p-2 rounded-lg transition-all ${
              viewMode === 'grid'
                ? 'bg-amber-500 text-white shadow-md'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
            title="Grid view"
          >
            <Grid className="w-5 h-5" />
          </button>
          <button
            onClick={() => onViewModeChange('list')}
            className={`p-2 rounded-lg transition-all ${
              viewMode === 'list'
                ? 'bg-amber-500 text-white shadow-md'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
            title="List view"
          >
            <List className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Results Count */}
      {searchQuery && (
        <div className="text-sm text-gray-600 dark:text-gray-400 bg-amber-50 dark:bg-amber-900/20 px-4 py-2 rounded-lg">
          {t(`${prefix}.showing`)}{' '}
          <strong className="text-amber-600 dark:text-amber-400">{filteredCount}</strong>{' '}
          {t(`${prefix}.of`)} {totalCount} {t(`${prefix}.authors`)}
        </div>
      )}
    </div>
  );
};