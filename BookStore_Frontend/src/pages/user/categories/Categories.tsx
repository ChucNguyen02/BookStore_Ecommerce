import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Layers, AlertCircle } from 'lucide-react';
import { useCategories } from '../../../hooks/user/useCategories';
import { CategoryCard } from '../../../components/user/categories/CategoryCard';
import { CategoryListView } from '../../../components/user/categories/CategoryListView';
import { CategoryFilters } from '../../../components/user/categories/CategoryFilters';
import { CategorySkeleton } from '../../../components/user/categories/CategorySkeleton';
import { useTranslation } from 'react-i18next';

const Categories = () => {
    const { t } = useTranslation();
    const { useAllCategories } = useCategories();
    const {
        data: categories = [],
        isPending: categoriesLoading,
        error: categoriesError,
    } = useAllCategories();

    const [searchQuery, setSearchQuery] = useState('');
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [sortBy, setSortBy] = useState<'order' | 'name' | 'name-desc' | 'bookCount' | 'createdAt'>('order');
    const [showInactive, setShowInactive] = useState(false);

    // Filter and sort categories
    const { parentCategories, filteredCategories } = useMemo(() => {
        const parents = categories.filter(cat => !cat.parentId);

        let filtered = showInactive ? parents : parents.filter(cat => cat.isActive);

        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(cat =>
                cat.name.toLowerCase().includes(query) ||
                cat.slug.toLowerCase().includes(query) ||
                (cat.description && cat.description.toLowerCase().includes(query))
            );
        }

        const sorted = [...filtered].sort((a, b) => {
            switch (sortBy) {
                case 'name':
                    return a.name.localeCompare(b.name);
                case 'name-desc':
                    return b.name.localeCompare(a.name);
                case 'order':
                    return a.displayOrder - b.displayOrder;
                case 'bookCount':
                    return (b.bookCount || 0) - (a.bookCount || 0);
                case 'createdAt':
                    return b.id.localeCompare(a.id);
                default:
                    return 0;
            }
        });

        return { parentCategories: parents, filteredCategories: sorted };
    }, [categories, searchQuery, sortBy, showInactive]);

    const getChildCategories = (parentId: string) => {
        return categories.filter(cat => cat.parentId === parentId && cat.isActive);
    };

    if (categoriesLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
                <div className="container mx-auto px-4 py-8">
                    {/* Header Skeleton */}
                    <div className="text-center mb-12 animate-pulse">
                        <div className="inline-flex p-4 bg-gray-200 dark:bg-gray-700 rounded-2xl mb-6 w-20 h-20 mx-auto" />
                        <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded w-64 mx-auto mb-4" />
                        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-96 mx-auto" />
                    </div>

                    {/* Filters Skeleton */}
                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg mb-8 animate-pulse">
                        <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-xl mb-4" />
                        <div className="flex gap-4">
                            <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-32" />
                            <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-40" />
                        </div>
                    </div>

                    {/* Categories Skeleton */}
                    <CategorySkeleton viewMode={viewMode} count={8} />
                </div>
            </div>
        );
    }

    if (categoriesError) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
                <div className="text-center space-y-6 px-4">
                    <div className="inline-flex p-6 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-full">
                        <AlertCircle className="w-16 h-16" />
                    </div>
                    <div className="space-y-2">
                        <h2 className="text-2xl font-serif font-bold text-gray-900 dark:text-white">
                            {t('Categories.error.title')}
                        </h2>
                        <p className="text-xl text-red-600 dark:text-red-400">
                            {categoriesError.message || t('Categories.error.unknown')}
                        </p>
                    </div>
                    <div className="flex gap-4 justify-center">
                        <button
                            onClick={() => window.location.reload()}
                            className="px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-lg hover:from-amber-600 hover:to-orange-600 transition-all shadow-md hover:shadow-lg font-semibold"
                        >
                            {t('Categories.error.tryAgain')}
                        </button>
                        <Link
                            to="/"
                            className="px-6 py-3 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-2 border-gray-300 dark:border-gray-600 rounded-lg hover:border-amber-500 dark:hover:border-amber-400 transition-all font-semibold"
                        >
                            {t('Categories.error.goHome')}
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
            <div className="container mx-auto px-4 py-8">
                {/* Header */}
                <div className="mb-8 text-center">
                    <h1 className="text-4xl font-serif font-bold text-gray-900 dark:text-white mb-2">
                        {t('Categories.title')}
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
                        {t('Categories.subtitle')}
                    </p>
                </div>

                {/* Filters */}
                <div className="mb-8">
                    <CategoryFilters
                        searchQuery={searchQuery}
                        onSearchChange={setSearchQuery}
                        viewMode={viewMode}
                        onViewModeChange={setViewMode}
                        sortBy={sortBy}
                        onSortChange={setSortBy}
                        showInactive={showInactive}
                        onShowInactiveChange={setShowInactive}
                        totalCount={parentCategories.length}
                        filteredCount={filteredCategories.length}
                    />
                </div>

                {/* Categories Grid/List */}
                {filteredCategories.length > 0 ? (
                    viewMode === 'grid' ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {filteredCategories.map((category, index) => (
                                <CategoryCard
                                    key={category.id}
                                    category={category}
                                    childCategories={getChildCategories(category.id)}
                                    index={index}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {filteredCategories.map((category) => (
                                <CategoryListView
                                    key={category.id}
                                    category={category}
                                    childCategories={getChildCategories(category.id)}
                                />
                            ))}
                        </div>
                    )
                ) : (
                    <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-2xl shadow-lg">
                        <Layers className="w-16 h-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
                        <h3 className="text-xl font-serif font-bold text-gray-700 dark:text-gray-300 mb-2">
                            {t('Categories.noCategories.title')}
                        </h3>
                        <p className="text-gray-500 dark:text-gray-400 mb-6">
                            {searchQuery
                                ? t('Categories.noCategories.withQuery', { query: searchQuery })
                                : t('Categories.noCategories.empty')}
                        </p>
                        {searchQuery && (
                            <button
                                onClick={() => setSearchQuery('')}
                                className="px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-lg hover:from-amber-600 hover:to-orange-600 transition-all shadow-md hover:shadow-lg font-semibold"
                            >
                                {t('Categories.noCategories.clearFilters')}
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Categories;