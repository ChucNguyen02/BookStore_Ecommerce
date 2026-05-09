import { ChevronLeft, ChevronRight, LayoutGrid, LayoutList } from 'lucide-react';
import { useState } from 'react';
import { BookCard } from '../../../components/user/books/BookCard';
import { BookFilters } from '../../../components/user/books/BookFilters';
import { BookSort } from '../../../components/user/books/BookSort';
import { ActiveFilters } from '../../../components/user/books/ActiveFilters';
import LoadingSpinner from '../../../components/user/common/LoadingSpinner';
import { useBookFilters } from '../../../hooks/user/useBookFilters';
import { useTranslation } from 'react-i18next';

const Books = () => {
    const { t } = useTranslation();
    const {
        books,
        loading,
        error,
        totalPages,
        totalElements,
        currentFilters,
        updateFilters,
        clearFilters,
        setPage,
    } = useBookFilters();

    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

    // Xử lý xóa một filter cụ thể
    const handleRemoveFilter = (key: keyof typeof currentFilters) => {
        updateFilters({ [key]: undefined } as Partial<typeof currentFilters>);
    };

    const handlePageChange = (newPage: number) => {
        setPage(newPage);
    };

    const currentPage = currentFilters.page ?? 0;

    // Tạo danh sách số trang hiển thị trong pagination
    const getPaginationNumbers = () => {
        const delta = 2;
        const range: number[] = [];
        const left = Math.max(0, currentPage - delta);
        const right = Math.min(totalPages - 1, currentPage + delta);

        for (let i = left; i <= right; i++) {
            range.push(i);
        }

        return range;
    };

    if (loading) {
        return <LoadingSpinner fullScreen />;
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
                <div className="text-center space-y-4">
                    <p className="text-xl text-red-600 dark:text-red-400">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="px-6 py-3 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors"
                    >
                        {t('Books.tryAgain')}
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
            <div className="container mx-auto px-4 py-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-serif font-bold text-gray-900 dark:text-white mb-2">
                        {currentFilters.keyword
                            ? t('Books.searchResults')
                            : t('Books.allBooks')}
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        {t('Books.foundBooks', { count: totalElements })}
                    </p>
                </div>

                {/* Active Filters */}
                <ActiveFilters
                    filters={currentFilters}
                    onRemoveFilter={handleRemoveFilter}
                    onClearAll={clearFilters}
                />

                {/* Main Content */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mt-6">
                    {/* Filters Sidebar */}
                    <div className="lg:col-span-1">
                        <BookFilters
                            currentFilters={currentFilters}
                            onFilterChange={updateFilters}
                            onClearFilters={clearFilters}
                        />
                    </div>

                    {/* Books List */}
                    <div className="lg:col-span-3">
                        {/* Toolbar */}
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4 bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg">
                            <BookSort
                                currentSort={{
                                    sortBy: currentFilters.sortBy ?? 'createdAt',
                                    sortDirection: currentFilters.sortDirection ?? 'DESC',
                                }}
                                onSortChange={updateFilters}
                            />

                            {/* View Mode Toggle */}
                            <div className="flex items-center gap-2 border border-gray-300 dark:border-gray-700 rounded-lg p-1 bg-gray-50 dark:bg-gray-900">
                                <button
                                    onClick={() => setViewMode('grid')}
                                    className={`p-2 rounded transition-all ${
                                        viewMode === 'grid'
                                            ? 'bg-amber-500 text-white shadow-sm'
                                            : 'text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                                    }`}
                                    aria-label={t('Books.gridView')}
                                >
                                    <LayoutGrid className="w-5 h-5" />
                                </button>
                                <button
                                    onClick={() => setViewMode('list')}
                                    className={`p-2 rounded transition-all ${
                                        viewMode === 'list'
                                            ? 'bg-amber-500 text-white shadow-sm'
                                            : 'text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                                    }`}
                                    aria-label={t('Books.listView')}
                                >
                                    <LayoutList className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        {/* Books Grid/List */}
                        {books.length > 0 ? (
                            <>
                                <div
                                    className={
                                        viewMode === 'grid'
                                            ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
                                            : 'space-y-6'
                                    }
                                >
                                    {books.map((book) => (
                                        <BookCard key={book.id} book={book} viewMode={viewMode} />
                                    ))}
                                </div>

                                {/* Pagination */}
                                {totalPages > 1 && (
                                    <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
                                        <button
                                            onClick={() => handlePageChange(currentPage - 1)}
                                            disabled={currentPage === 0}
                                            className="px-5 py-3 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-amber-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2 shadow-md"
                                        >
                                            <ChevronLeft className="w-5 h-5" />
                                            {t('Books.previous')}
                                        </button>

                                        <div className="flex items-center gap-2">
                                            {getPaginationNumbers().map((pageNum) => (
                                                <button
                                                    key={pageNum}
                                                    onClick={() => handlePageChange(pageNum)}
                                                    className={`w-11 h-11 rounded-lg font-medium transition-all shadow-sm ${
                                                        currentPage === pageNum
                                                            ? 'bg-amber-500 text-white'
                                                            : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-amber-50 dark:hover:bg-gray-700'
                                                    }`}
                                                >
                                                    {pageNum + 1}
                                                </button>
                                            ))}
                                        </div>

                                        <button
                                            onClick={() => handlePageChange(currentPage + 1)}
                                            disabled={currentPage >= totalPages - 1}
                                            className="px-5 py-3 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-amber-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2 shadow-md"
                                        >
                                            {t('Books.next')}
                                            <ChevronRight className="w-5 h-5" />
                                        </button>
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-2xl shadow-lg">
                                <p className="text-xl text-gray-500 dark:text-gray-400 mb-6">
                                    {t('Books.noBooksFound')}
                                </p>
                                <button
                                    onClick={clearFilters}
                                    className="px-8 py-4 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-all shadow-md font-semibold"
                                >
                                    {t('Books.clearFilters')}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Books;