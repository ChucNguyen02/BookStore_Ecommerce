import { useState, useEffect, useRef, useMemo } from 'react';
import { X, SlidersHorizontal, Star, Search } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAppContext } from '../../../context/AppContext';
import { useCategories } from '../../../hooks/user/useCategories';
import { useAuthorsPaginated } from '../../../hooks/user/useAuthor';
import { useAvailableLanguages } from '../../../hooks/user/useBooks';
import type { BookFilterRequest } from '../../../types/book.types';
import type { CategoryResponse } from '../../../types/category.types';
import type { AuthorResponse } from '../../../types/author.types';

interface BookFiltersProps {
  currentFilters: BookFilterRequest;
  onFilterChange: (filters: Partial<BookFilterRequest>) => void;
  onClearFilters: () => void;
}

export const BookFilters = ({ currentFilters, onFilterChange, onClearFilters }: BookFiltersProps) => {
  const { t } = useTranslation();
  const { language: appLanguage } = useAppContext();

  const languageDisplay: Record<string, { vi: string; en: string; }> = {
    'vi': { vi: t('Common.tiengViet'), en: 'Vietnamese' },
    'en': { vi: t('Common.tiengAnh'), en: 'English' },
    'fr': { vi: t('Common.tiengPhap'), en: 'French' },
    'ja': { vi: t('Common.tiengNhat'), en: 'Japanese' },
    'zh': { vi: t('Common.tiengTrung'), en: 'Chinese' },
    'ko': { vi: t('Common.tiengHan'), en: 'Korean' },
    'de': { vi: t('Common.tiengDuc'), en: 'German' },
    'es': { vi: t('Common.tiengTayBanNha'), en: 'Spanish' },
    'it': { vi: t('Common.tiengY'), en: 'Italian' },
    'ru': { vi: t('Common.tiengNga'), en: 'Russian' },
    'th': { vi: t('Common.tiengThai'), en: 'Thai' }
  };

  const { useParentCategories } = useCategories();
  const { data: categories = [] } = useParentCategories();
  const { data: authorsData } = useAuthorsPaginated(0, 100);
  const { data: availableLanguages = [] } = useAvailableLanguages();

  const authors = authorsData?.content || [];

  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Autocomplete states
  const [categorySearch, setCategorySearch] = useState('');
  const [authorSearch, setAuthorSearch] = useState('');
  const [languageSearch, setLanguageSearch] = useState('');
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [showAuthorDropdown, setShowAuthorDropdown] = useState(false);
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);

  const categoryRef = useRef<HTMLDivElement>(null);
  const authorRef = useRef<HTMLDivElement>(null);
  const languageRef = useRef<HTMLDivElement>(null);

  const [localFilters, setLocalFilters] = useState({
    keyword: currentFilters.keyword || '',
    categoryId: currentFilters.categoryId || '',
    categoryName: '',
    authorId: currentFilters.authorId || '',
    authorName: '',
    minPrice: currentFilters.minPrice?.toString() || '',
    maxPrice: currentFilters.maxPrice?.toString() || '',
    language: currentFilters.language || '',
    languageName: '',
    minRating: currentFilters.minRating || 0,
    isFeatured: currentFilters.isFeatured || false,
    onSale: currentFilters.onSale || false
  });

  const getLanguageDisplayName = (code: string): string => {
    const langMap = languageDisplay[code];
    if (langMap) {
      return appLanguage === 'vi' ? langMap.vi : langMap.en;
    }
    return code.toUpperCase();
  };

  useEffect(() => {
    if (currentFilters.categoryId && categories.length > 0) {
      const cat = categories.find((c) => c.id === currentFilters.categoryId);
      if (cat) {
        setLocalFilters((prev) => ({ ...prev, categoryName: cat.name }));
        setCategorySearch(cat.name);
      }
    }

    if (currentFilters.authorId && authors.length > 0) {
      const auth = authors.find((a) => a.id === currentFilters.authorId);
      if (auth) {
        setLocalFilters((prev) => ({ ...prev, authorName: auth.name }));
        setAuthorSearch(auth.name);
      }
    }

    if (currentFilters.language) {
      const langName = getLanguageDisplayName(currentFilters.language);
      setLocalFilters((prev) => ({ ...prev, languageName: langName }));
      setLanguageSearch(langName);
    }
  }, [currentFilters.categoryId, currentFilters.authorId, currentFilters.language, categories, authors, appLanguage]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (categoryRef.current && !categoryRef.current.contains(event.target as Node)) {
        setShowCategoryDropdown(false);
      }
      if (authorRef.current && !authorRef.current.contains(event.target as Node)) {
        setShowAuthorDropdown(false);
      }
      if (languageRef.current && !languageRef.current.contains(event.target as Node)) {
        setShowLanguageDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredCategories = useMemo(() =>
    categories.filter((cat) => cat.name.toLowerCase().includes(categorySearch.toLowerCase())),
    [categories, categorySearch]
  );

  const filteredAuthors = useMemo(() =>
    authors.filter((author) => author.name.toLowerCase().includes(authorSearch.toLowerCase())),
    [authors, authorSearch]
  );

  const filteredLanguages = useMemo(() =>
    availableLanguages.filter((langCode) => {
      const name = getLanguageDisplayName(langCode);
      return name.toLowerCase().includes(languageSearch.toLowerCase());
    }),
    [availableLanguages, languageSearch, appLanguage]
  );

  const handleSelectCategory = (cat: CategoryResponse) => {
    setLocalFilters({ ...localFilters, categoryId: cat.id, categoryName: cat.name });
    setCategorySearch(cat.name);
    setShowCategoryDropdown(false);
  };

  const handleSelectAuthor = (author: AuthorResponse) => {
    setLocalFilters({ ...localFilters, authorId: author.id, authorName: author.name });
    setAuthorSearch(author.name);
    setShowAuthorDropdown(false);
  };

  const handleSelectLanguage = (langCode: string) => {
    const name = getLanguageDisplayName(langCode);
    setLocalFilters({ ...localFilters, language: langCode, languageName: name });
    setLanguageSearch(name);
    setShowLanguageDropdown(false);
  };

  const handleApplyFilters = () => {
    const filters: Partial<BookFilterRequest> = {};

    if (localFilters.keyword) filters.keyword = localFilters.keyword;
    if (localFilters.categoryId) filters.categoryId = localFilters.categoryId;
    if (localFilters.authorId) filters.authorId = localFilters.authorId;
    if (localFilters.minPrice) filters.minPrice = Number(localFilters.minPrice);
    if (localFilters.maxPrice) filters.maxPrice = Number(localFilters.maxPrice);
    if (localFilters.language) filters.language = localFilters.language;
    if (localFilters.minRating > 0) filters.minRating = localFilters.minRating;
    if (localFilters.isFeatured) filters.isFeatured = true;
    if (localFilters.onSale) filters.onSale = true;

    onFilterChange(filters);
    setShowMobileFilters(false);
  };

  const handleClearFilters = () => {
    setLocalFilters({
      keyword: '',
      categoryId: '',
      categoryName: '',
      authorId: '',
      authorName: '',
      minPrice: '',
      maxPrice: '',
      language: '',
      languageName: '',
      minRating: 0,
      isFeatured: false,
      onSale: false
    });
    setCategorySearch('');
    setAuthorSearch('');
    setLanguageSearch('');
    onClearFilters();
    setShowMobileFilters(false);
  };

  const activeFiltersCount = useMemo(() => [
    localFilters.keyword,
    localFilters.categoryId,
    localFilters.authorId,
    localFilters.minPrice,
    localFilters.maxPrice,
    localFilters.language,
    localFilters.minRating,
    localFilters.isFeatured,
    localFilters.onSale].
    filter(Boolean).length, [localFilters]);

  const bf = 'bookFilters';

  const filterFields = useMemo(() =>
    <>
      {/* Keyword */}
      <div>
        <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-3">
          {t(`${bf}.keyword`)}
        </label>
        <input
          type="text"
          placeholder={t(`${bf}.keywordPlaceholder`)}
          value={localFilters.keyword}
          onChange={(e) => setLocalFilters({ ...localFilters, keyword: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-amber-500 dark:focus:ring-amber-400 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white" />

      </div>

      {/* Category Autocomplete */}
      <div ref={categoryRef} className="relative">
        <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-3">
          {t(`${bf}.category`)}
        </label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder={t(`${bf}.categoryPlaceholder`)}
            value={categorySearch}
            onChange={(e) => {
              setCategorySearch(e.target.value);
              setShowCategoryDropdown(true);
              if (!e.target.value) {
                setLocalFilters({ ...localFilters, categoryId: '', categoryName: '' });
              }
            }}
            onFocus={() => setShowCategoryDropdown(true)}
            className="w-full pl-10 pr-10 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-amber-500 dark:focus:ring-amber-400 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white" />

          {localFilters.categoryId &&
            <button
              onClick={() => {
                setLocalFilters({ ...localFilters, categoryId: '', categoryName: '' });
                setCategorySearch('');
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">

              <X className="w-4 h-4" />
            </button>
          }
        </div>
        {showCategoryDropdown && filteredCategories.length > 0 &&
          <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg shadow-lg max-h-60 overflow-auto">
            {filteredCategories.map((cat) =>
              <button
                key={cat.id}
                onClick={() => handleSelectCategory(cat)}
                className="w-full text-left px-4 py-2 hover:bg-amber-50 dark:hover:bg-gray-700 text-gray-900 dark:text-white transition-colors">

                {cat.name}
              </button>
            )}
          </div>
        }
      </div>

      {/* Author Autocomplete */}
      <div ref={authorRef} className="relative">
        <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-3">
          {t(`${bf}.author`)}
        </label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder={t(`${bf}.authorPlaceholder`)}
            value={authorSearch}
            onChange={(e) => {
              setAuthorSearch(e.target.value);
              setShowAuthorDropdown(true);
              if (!e.target.value) {
                setLocalFilters({ ...localFilters, authorId: '', authorName: '' });
              }
            }}
            onFocus={() => setShowAuthorDropdown(true)}
            className="w-full pl-10 pr-10 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-amber-500 dark:focus:ring-amber-400 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white" />

          {localFilters.authorId &&
            <button
              onClick={() => {
                setLocalFilters({ ...localFilters, authorId: '', authorName: '' });
                setAuthorSearch('');
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">

              <X className="w-4 h-4" />
            </button>
          }
        </div>
        {showAuthorDropdown && filteredAuthors.length > 0 &&
          <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg shadow-lg max-h-60 overflow-auto">
            {filteredAuthors.map((author) =>
              <button
                key={author.id}
                onClick={() => handleSelectAuthor(author)}
                className="w-full text-left px-4 py-2 hover:bg-amber-50 dark:hover:bg-gray-700 text-gray-900 dark:text-white transition-colors">

                {author.name}
              </button>
            )}
          </div>
        }
      </div>

      {/* Price Range */}
      <div>
        <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-3">
          {t(`${bf}.priceRange`)}
        </label>
        <div className="flex flex-wrap gap-2 mb-3">
          {[
            { key: 'under100k', min: 0, max: 100000 },
            { key: '100kTo300k', min: 100000, max: 300000 },
            { key: '300kTo500k', min: 300000, max: 500000 },
            { key: 'over500k', min: 500000, max: undefined }].
            map((range) =>
              <button
                key={range.key}
                onClick={() => {
                  setLocalFilters({
                    ...localFilters,
                    minPrice: range.min.toString(),
                    maxPrice: range.max?.toString() || ''
                  });
                }}
                className="px-3 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded-full hover:bg-amber-50 dark:hover:bg-amber-900/20 hover:border-amber-400 dark:hover:border-amber-500 transition-colors text-gray-700 dark:text-gray-300">

                {t(`${bf}.priceQuick.${range.key}`)}
              </button>
            )}
        </div>
        <div className="grid grid-cols-2 gap-3">
          <input
            type="number"
            placeholder={t(`${bf}.priceFrom`)}
            value={localFilters.minPrice}
            onChange={(e) => setLocalFilters({ ...localFilters, minPrice: e.target.value })}
            className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-amber-500 dark:focus:ring-amber-400 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            min="0"
            step="1000" />

          <input
            type="number"
            placeholder={t(`${bf}.priceTo`)}
            value={localFilters.maxPrice}
            onChange={(e) => setLocalFilters({ ...localFilters, maxPrice: e.target.value })}
            className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-amber-500 dark:focus:ring-amber-400 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            min="0"
            step="1000" />

        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
          {t(`${bf}.priceNote`)}
        </p>
      </div>

      {/* Language */}
      <div ref={languageRef} className="relative">
        <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-3">
          {t(`${bf}.language`)}
        </label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder={t(`${bf}.languagePlaceholder`)}
            value={languageSearch}
            onChange={(e) => {
              setLanguageSearch(e.target.value);
              setShowLanguageDropdown(true);
              if (!e.target.value) {
                setLocalFilters({ ...localFilters, language: '', languageName: '' });
              }
            }}
            onFocus={() => setShowLanguageDropdown(true)}
            className="w-full pl-10 pr-10 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-amber-500 dark:focus:ring-amber-400 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white" />

          {localFilters.language &&
            <button
              onClick={() => {
                setLocalFilters({ ...localFilters, language: '', languageName: '' });
                setLanguageSearch('');
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">

              <X className="w-4 h-4" />
            </button>
          }
        </div>
        {showLanguageDropdown && filteredLanguages.length > 0 &&
          <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg shadow-lg max-h-60 overflow-auto">
            {filteredLanguages.map((langCode) =>
              <button
                key={langCode}
                onClick={() => handleSelectLanguage(langCode)}
                className="w-full text-left px-4 py-2 hover:bg-amber-50 dark:hover:bg-gray-700 text-gray-900 dark:text-white transition-colors">

                {getLanguageDisplayName(langCode)}
              </button>
            )}
          </div>
        }
      </div>

      {/* Rating */}
      <div>
        <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-3">
          {t(`${bf}.minRating`)}
        </label>
        <div className="space-y-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="rating"
              checked={localFilters.minRating === 0}
              onChange={() => setLocalFilters({ ...localFilters, minRating: 0 })}
              className="w-4 h-4 text-amber-600 dark:text-amber-400" />

            <span className="text-sm text-gray-600 dark:text-gray-400">
              {t(`${bf}.ratingAll`)}
            </span>
          </label>
          {[5, 4, 3].map((rating) =>
            <label key={rating} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="rating"
                checked={localFilters.minRating === rating}
                onChange={() => setLocalFilters({ ...localFilters, minRating: rating })}
                className="w-4 h-4 text-amber-600 dark:text-amber-400" />

              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) =>
                  <Star
                    key={i}
                    className={`w-4 h-4 ${i < rating ? 'fill-amber-400 text-amber-400' : 'text-gray-300 dark:text-gray-600'}`} />

                )}
                <span className="text-sm text-gray-600 dark:text-gray-400 ml-1">
                  {t(`${bf}.ratingUp`)}
                </span>
              </div>
            </label>
          )}
        </div>
      </div>

      {/* Special */}
      <div>
        <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-3">
          {t(`${bf}.special`)}
        </label>
        <div className="space-y-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={localFilters.isFeatured}
              onChange={(e) => setLocalFilters({ ...localFilters, isFeatured: e.target.checked })}
              className="w-4 h-4 text-amber-600 dark:text-amber-400 rounded" />

            <span className="text-sm text-gray-700 dark:text-gray-300">
              {t(`${bf}.featured`)}
            </span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={localFilters.onSale}
              onChange={(e) => setLocalFilters({ ...localFilters, onSale: e.target.checked })}
              className="w-4 h-4 text-amber-600 dark:text-amber-400 rounded" />

            <span className="text-sm text-gray-700 dark:text-gray-300">
              {t(`${bf}.onSale`)}
            </span>
          </label>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
        <button
          onClick={handleClearFilters}
          className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">

          {t(`${bf}.clear`)}
        </button>
        <button
          onClick={handleApplyFilters}
          className="flex-1 px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 dark:from-amber-600 dark:to-orange-600 text-white rounded-lg hover:from-amber-600 hover:to-orange-600 dark:hover:from-amber-700 dark:hover:to-orange-700 transition-all font-medium">

          {t(`${bf}.apply`)}
        </button>
      </div>
    </>,
    [
      t, localFilters, categorySearch, authorSearch, languageSearch,
      showCategoryDropdown, showAuthorDropdown, showLanguageDropdown,
      filteredCategories, filteredAuthors, filteredLanguages]
  );

  return (
    <>
      {/* Desktop */}
      <div className="hidden lg:block bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">
            {t(`${bf}.title`)}
          </h3>
          {activeFiltersCount > 0 &&
            <span className="px-2 py-1 bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-400 text-xs font-semibold rounded-full">
              {activeFiltersCount}
            </span>
          }
        </div>
        <div className="space-y-6">
          {filterFields}
        </div>
      </div>

      {/* Mobile Button */}
      <button
        onClick={() => setShowMobileFilters(true)}
        className="lg:hidden fixed bottom-6 right-6 z-40 w-14 h-14 bg-gradient-to-r from-amber-500 to-orange-500 dark:from-amber-600 dark:to-orange-600 text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-transform">

        <SlidersHorizontal className="w-6 h-6" />
        {activeFiltersCount > 0 &&
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
            {activeFiltersCount}
          </span>
        }
      </button>

      {/* Mobile Modal */}
      {showMobileFilters &&
        <div className="lg:hidden fixed inset-0 z-50 bg-black/50 backdrop-blur-sm">
          <div className="absolute right-0 top-0 bottom-0 w-full max-w-sm bg-white dark:bg-gray-800 shadow-2xl overflow-y-auto">
            <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4 flex items-center justify-between z-10">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                {t(`${bf}.title`)}
              </h3>
              <button
                onClick={() => setShowMobileFilters(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">

                <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </button>
            </div>
            <div className="p-6">
              <div className="space-y-6">
                {filterFields}
              </div>
            </div>
          </div>
        </div>
      }
    </>);

};