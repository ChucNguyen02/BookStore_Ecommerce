import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { BookCard } from '../../../components/user/books/BookCard';
import { BookSort } from '../../../components/user/books/BookSort';
import LoadingSpinner from '../../../components/user/common/LoadingSpinner';
import { useSearchBooks } from '../../../hooks/user/useBooks';
import { useTranslation } from 'react-i18next';

const SearchBooks = () => {
    const { t } = useTranslation();
    const [searchParams, setSearchParams] = useSearchParams();

    const [searchQuery, setSearchQuery] = useState(searchParams.get('q') ?? '');
    const keyword = searchParams.get('q') ?? '';
    const page = Number(searchParams.get('page')) || 0;
    const size = Number(searchParams.get('size')) || 20;
    const sortBy = searchParams.get('sortBy') ?? 'createdAt';
    const sortDir = (searchParams.get('sortDir') ?? 'DESC') as 'ASC' | 'DESC';

    // Use search hook
    const { data: result, isLoading: loading, error } = useSearchBooks(keyword, page, size);
    const books = result?.content ?? [];
    const totalPages = result?.totalPages ?? 0;
    const totalElements = result?.totalElements ?? 0;

    useEffect(() => {
        setSearchQuery(keyword);
    }, [keyword]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        const trimmed = searchQuery.trim();
        if (trimmed) {
            const params = new URLSearchParams();
            params.set('q', trimmed);
            params.set('page', '0');
            setSearchParams(params);
        }
    };

    const handlePageChange = (newPage: number) => {
        const params = new URLSearchParams(searchParams);
        params.set('page', newPage.toString());
        setSearchParams(params);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleSortChange = (updates: { sortBy?: string; sortDirection?: 'ASC' | 'DESC' }) => {
        const params = new URLSearchParams(searchParams);
        if (updates.sortBy !== undefined) params.set('sortBy', updates.sortBy);
        if (updates.sortDirection !== undefined) params.set('sortDir', updates.sortDirection);
        params.set('page', '0');
        setSearchParams(params);
    };

    if (loading) {
        return <LoadingSpinner fullScreen />;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
            <div className="container mx-auto px-4 py-8">
                {/* Search Form */}
                <form onSubmit={handleSearch} className="max-w-4xl mx-auto mb-10">
                    <div className="relative shadow-2xl">
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder={t('SearchBooks.searchPlaceholder')}
                            className="w-full px-6 py-5 pr-16 text-lg rounded-2xl border-2 border-gray-200 dark:border-gray-700 focus:border-amber-500 dark:focus:border-amber-400 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 transition-all"
                        />
                        <button
                            type="submit"
                            className="absolute right-3 top-1/2 -translate-y-1/2 bg-gradient-to-r from-amber-500 to-orange-500 dark:from-amber-600 dark:to-orange-600 text-white p-4 rounded-xl hover:from-amber-600 hover:to-orange-600 transition-all shadow-lg"
                            aria-label={t('SearchBooks.searchButtonAria')}
                        >
                            <Search className="w-7 h-7" />
                        </button>
                    </div>
                </form>

                {/* No query */}
                {!keyword && (
                    <div className="text-center py-20">
                        <p className="text-2xl text-gray-500 dark:text-gray-400 mb-6">
                            {t('SearchBooks.noQueryMessage')}
                        </p>
                    </div>
                )}

                {/* Results */}
                {keyword && (
                    <>
                        <div className="mb-8 text-center lg:text-left">
                            <h1 className="text-4xl font-serif font-bold text-gray-900 dark:text-white mb-3">
                                {t('SearchBooks.resultsTitle')} <span className="text-amber-600 dark:text-amber-400">"{keyword}"</span>
                            </h1>
                            <p className="text-lg text-gray-600 dark:text-gray-400">
                                {t('SearchBooks.foundBooks', { count: totalElements })}
                            </p>
                        </div>

                        {error ? (
                            <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-2xl shadow-lg">
                                <p className="text-xl text-red-600 dark:text-red-400 mb-6">{error}</p>
                                <button
                                    onClick={() => window.location.reload()}
                                    className="px-8 py-4 bg-amber-500 text-white rounded-xl hover:bg-amber-600 transition-all font-semibold"
                                >
                                    {t('SearchBooks.tryAgain')}
                                </button>
                            </div>
                        ) : books.length > 0 ? (
                            <>
                                {/* Sort Toolbar */}
                                <div className="flex justify-end mb-8 bg-white dark:bg-gray-800 rounded-xl p-5 shadow-lg">
                                    <BookSort
                                        currentSort={{ sortBy, sortDirection: sortDir }}
                                        onSortChange={handleSortChange}
                                    />
                                </div>

                                {/* Book Grid */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-8 mb-12">
                                    {books.map((book) => (
                                        <BookCard key={book.id} book={book} viewMode="grid" />
                                    ))}
                                </div>

                                {/* Pagination */}
                                {totalPages > 1 && (
                                    <div className="flex items-center justify-center gap-3">
                                        <button
                                            onClick={() => handlePageChange(page - 1)}
                                            disabled={page === 0}
                                            className="px-6 py-3 bg-white dark:bg-gray-800 rounded-xl shadow-md hover:bg-amber-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2 font-medium"
                                        >
                                            <ChevronLeft className="w-5 h-5" />
                                            {t('SearchBooks.previous')}
                                        </button>

                                        <div className="flex gap-2">
                                            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                                let pageNum: number;
                                                if (totalPages <= 5) pageNum = i;
                                                else if (page < 3) pageNum = i;
                                                else if (page > totalPages - 3) pageNum = totalPages - 5 + i;
                                                else pageNum = page - 2 + i;

                                                return (
                                                    <button
                                                        key={pageNum}
                                                        onClick={() => handlePageChange(pageNum)}
                                                        className={`w-12 h-12 rounded-xl font-semibold transition-all shadow-md ${page === pageNum
                                                                ? 'bg-amber-500 text-white'
                                                                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-amber-50 dark:hover:bg-gray-700'
                                                            }`}
                                                    >
                                                        {pageNum + 1}
                                                    </button>
                                                );
                                            })}
                                        </div>

                                        <button
                                            onClick={() => handlePageChange(page + 1)}
                                            disabled={page >= totalPages - 1}
                                            className="px-6 py-3 bg-white dark:bg-gray-800 rounded-xl shadow-md hover:bg-amber-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2 font-medium"
                                        >
                                            {t('SearchBooks.next')}
                                            <ChevronRight className="w-5 h-5" />
                                        </button>
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-2xl shadow-lg">
                                <p className="text-2xl text-gray-500 dark:text-gray-400 mb-8">
                                    {t('SearchBooks.noResults')}
                                </p>
                                <Link
                                    to="/books"
                                    className="inline-block px-8 py-4 bg-amber-500 text-white rounded-xl hover:bg-amber-600 transition-all font-semibold shadow-lg"
                                >
                                    {t('SearchBooks.browseAllBooks')}
                                </Link>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default SearchBooks;