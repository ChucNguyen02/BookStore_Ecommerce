import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Users, AlertCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAuthors } from '../../../hooks/user';
import { AuthorCard } from '../../../components/user/authors/AuthorCard';
import { AuthorList } from '../../../components/user/authors/AuthorList';
import { AuthorFilters } from '../../../components/user/authors/AuthorFilters';
import { AuthorSkeleton } from '../../../components/user/authors/AuthorSkeleton';

const Authors = () => {
    const { t } = useTranslation();
    const { topAuthors, allAuthors, loading, error } = useAuthors();

    const [searchQuery, setSearchQuery] = useState('');
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [sortBy, setSortBy] = useState('bookCount');
    const [filterMode, setFilterMode] = useState<'all' | 'top'>('all');

    // Combine all authors
    const authors = useMemo(() => {
        return filterMode === 'top' ? topAuthors : allAuthors;
    }, [filterMode, topAuthors, allAuthors]);

    // Filter and sort authors
    const filteredAuthors = useMemo(() => {
        let filtered = [...authors];

        // Filter by search query
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(author =>
                author.name.toLowerCase().includes(query) ||
                author.bio?.toLowerCase().includes(query) ||
                author.nationality?.toLowerCase().includes(query)
            );
        }

        // Sort authors
        const sorted = [...filtered].sort((a, b) => {
            switch (sortBy) {
                case 'name':
                    return a.name.localeCompare(b.name);
                case 'name-desc':
                    return b.name.localeCompare(a.name);
                case 'bookCount':
                    return (b.bookCount || 0) - (a.bookCount || 0);
                case 'createdAt':
                    return b.createdAt.localeCompare(a.createdAt);
                default:
                    return 0;
            }
        });

        return sorted;
    }, [authors, searchQuery, sortBy]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
                <div className="container mx-auto px-4 py-8">
                    {/* Header Skeleton */}
                    <div className="mb-12 animate-pulse">
                        <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded w-64 mb-4" />
                        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-96" />
                    </div>

                    {/* Filters Skeleton */}
                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg mb-8 animate-pulse">
                        <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-xl mb-4" />
                        <div className="flex gap-4">
                            <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-32" />
                            <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-40" />
                        </div>
                    </div>

                    {/* Authors Skeleton */}
                    <AuthorSkeleton viewMode={viewMode} count={8} />
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
                <div className="text-center space-y-6 px-4">
                    <div className="inline-flex p-6 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-full">
                        <AlertCircle className="w-16 h-16" />
                    </div>
                    <div className="space-y-2">
                        <h2 className="text-2xl font-serif font-bold text-gray-900 dark:text-white">
                            {t('Authors.errorTitle')}
                        </h2>
                        <p className="text-xl text-red-600 dark:text-red-400">{error}</p>
                    </div>
                    <div className="flex gap-4 justify-center">
                        <button
                            onClick={() => window.location.reload()}
                            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all shadow-md hover:shadow-lg font-semibold"
                        >
                            {t('Authors.tryAgain')}
                        </button>
                        <Link
                            to="/"
                            className="px-6 py-3 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-2 border-gray-300 dark:border-gray-600 rounded-lg hover:border-blue-500 dark:hover:border-blue-400 transition-all font-semibold"
                        >
                            {t('Authors.goHome')}
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
            <div className="container mx-auto px-4 py-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-serif font-bold text-gray-900 dark:text-white mb-2">
                        {t('Authors.title')}
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        {t('Authors.subtitle')}
                    </p>
                </div>

                {/* Filters */}
                <div className="mb-8">
                    <AuthorFilters
                        
                        searchQuery={searchQuery}
                        onSearchChange={setSearchQuery}
                        viewMode={viewMode}
                        onViewModeChange={setViewMode}
                        sortBy={sortBy}
                        onSortChange={setSortBy}
                        filterMode={filterMode}
                        onFilterModeChange={setFilterMode}
                        totalCount={authors.length}
                        filteredCount={filteredAuthors.length}
                    />
                </div>

                {/* Authors Grid/List */}
                {filteredAuthors.length > 0 ? (
                    viewMode === 'grid' ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {filteredAuthors.map((author, index) => (
                                <AuthorCard
                                    key={author.id}
                                    author={author}
                                    index={index}
                                    
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {filteredAuthors.map((author) => (
                                <AuthorList
                                    key={author.id}
                                    author={author}
                                   
                                />
                            ))}
                        </div>
                    )
                ) : (
                    <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-2xl shadow-lg">
                        <Users className="w-16 h-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
                        <h3 className="text-xl font-serif font-bold text-gray-700 dark:text-gray-300 mb-2">
                            {t('Authors.noAuthorsFound')}
                        </h3>
                        <p className="text-gray-500 dark:text-gray-400 mb-6">
                            {searchQuery
                                ? t('Authors.noResultsFor', { query: searchQuery })
                                : t('Authors.noAuthorsAvailable')}
                        </p>
                        {searchQuery && (
                            <button
                                onClick={() => setSearchQuery('')}
                                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all shadow-md hover:shadow-lg font-semibold"
                            >
                                {t('Authors.clearFilters')}
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Authors;