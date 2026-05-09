import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
    Layers,
    ChevronLeft,
    ChevronRight,
    BookOpen,
    LayoutGrid,
    LayoutList,
    AlertCircle,
    Home,
} from 'lucide-react';
import { BookCard } from '../../../components/user/books/BookCard';
import { BookSort } from '../../../components/user/books/BookSort';
import { useCategories } from '../../../hooks/user';
import type { BookFilterRequest } from '../../../types/book.types';
import { useTranslation } from 'react-i18next';

const CategoryDetail = () => {
    const { t } = useTranslation();
    const { slug } = useParams<{ slug: string }>();

    const [sortBy, setSortBy] = useState<string>('createdAt');
    const [sortDirection, setSortDirection] = useState<'ASC' | 'DESC'>('DESC');
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

    const size = 20;
    const [page, setPage] = useState(0);

    const { useCategoryBySlug, useBooksByCategory } = useCategories();

    const { data: category, isLoading: categoryLoading, error: categoryError } = useCategoryBySlug(slug);

    const { data: booksData, isLoading: booksLoading } = useBooksByCategory(category?.id, page, size);

    const error = categoryError ? (categoryError as Error).message : null;
    const books = booksData?.content ?? [];
    const totalPages = booksData?.totalPages ?? 0;
    const totalElements = booksData?.totalElements ?? 0;

    // Reset page về 0 khi thay đổi sort
    useEffect(() => {
        setPage(0);
    }, [sortBy, sortDirection]);

    const handlePageChange = (newPage: number) => {
        setPage(newPage);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleSortChange = (updates: Partial<BookFilterRequest>) => {
        if (updates.sortBy !== undefined) setSortBy(updates.sortBy);
        if (updates.sortDirection !== undefined) setSortDirection(updates.sortDirection);
    };

    // Generate pagination numbers
    const getPaginationNumbers = () => {
        const delta = 2;
        const range: number[] = [];

        for (
            let i = Math.max(0, page - delta);
            i <= Math.min(totalPages - 1, page + delta);
            i++
        ) {
            range.push(i);
        }

        return range;
    };

    if (categoryLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
                <div className="container mx-auto px-4 py-8">
                    <div className="flex items-center gap-2 mb-8 animate-pulse">
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20" />
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24" />
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 mb-8 shadow-lg animate-pulse">
                        <div className="flex items-start gap-6">
                            <div className="w-32 h-32 bg-gray-200 dark:bg-gray-700 rounded-xl" />
                            <div className="flex-1 space-y-4">
                                <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
                                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full" />
                                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                        {[...Array(10)].map((_, i) => (
                            <div key={i} className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden animate-pulse">
                                <div className="aspect-[2/3] bg-gray-200 dark:bg-gray-700" />
                                <div className="p-4 space-y-2">
                                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded" />
                                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-2/3" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    if (error || !category) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
                <div className="text-center space-y-6 px-4">
                    <div className="inline-flex p-6 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-full">
                        <AlertCircle className="w-16 h-16" />
                    </div>
                    <div className="space-y-2">
                        <h2 className="text-2xl font-serif font-bold text-gray-900 dark:text-white">
                            {t('CategoryDetail.notFound.title')}
                        </h2>
                        <p className="text-xl text-red-600 dark:text-red-400">
                            {error || t('CategoryDetail.notFound.description')}
                        </p>
                    </div>
                    <div className="flex gap-4 justify-center">
                        <Link
                            to="/categories"
                            className="px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-lg hover:from-amber-600 hover:to-orange-600 transition-all shadow-md hover:shadow-lg font-semibold inline-flex items-center gap-2"
                        >
                            <ChevronLeft className="w-5 h-5" />
                            {t('CategoryDetail.notFound.backToCategories')}
                        </Link>
                        <Link
                            to="/"
                            className="px-6 py-3 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-2 border-gray-300 dark:border-gray-600 rounded-lg hover:border-amber-500 dark:hover:border-amber-400 transition-all font-semibold inline-flex items-center gap-2"
                        >
                            <Home className="w-5 h-5" />
                            {t('CategoryDetail.notFound.home')}
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
            <div className="container mx-auto px-4 py-8">
                {/* Breadcrumb */}
                <nav className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-8">
                    <Link to="/" className="hover:text-amber-600 dark:hover:text-amber-400 transition-colors flex items-center gap-1">
                        <Home className="w-4 h-4" />
                        {t('CategoryDetail.breadcrumb.home')}
                    </Link>
                    <ChevronRight className="w-4 h-4" />
                    <Link to="/categories" className="hover:text-amber-600 dark:hover:text-amber-400 transition-colors">
                        {t('CategoryDetail.breadcrumb.categories')}
                    </Link>
                    {category.parentName && (
                        <>
                            <ChevronRight className="w-4 h-4" />
                            <span className="text-gray-500 dark:text-gray-500">
                                {category.parentName}
                            </span>
                        </>
                    )}
                    <ChevronRight className="w-4 h-4" />
                    <span className="text-gray-900 dark:text-white font-medium">{category.name}</span>
                </nav>

                {/* Category Header */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 mb-8 shadow-lg hover:shadow-xl transition-shadow">
                    <div className="flex flex-col md:flex-row items-start gap-6">
                        {category.imageUrl && (
                            <div className="w-full md:w-40 h-40 rounded-xl overflow-hidden flex-shrink-0 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 shadow-md">
                                <img
                                    src={category.imageUrl}
                                    alt={category.name}
                                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                                />
                            </div>
                        )}

                        <div className="flex-1 w-full">
                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-gradient-to-br from-amber-500 to-orange-500 text-white rounded-lg">
                                        <Layers className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h1 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 dark:text-white">
                                            {category.name}
                                        </h1>
                                        <p className="text-sm text-gray-400 dark:text-gray-500 font-mono mt-1">
                                            /{category.slug}
                                        </p>
                                    </div>
                                </div>

                                {category.bookCount !== undefined && (
                                    <div className="px-5 py-3 bg-gradient-to-r from-amber-100 to-orange-100 dark:from-amber-900/40 dark:to-orange-900/40 text-amber-700 dark:text-amber-400 font-bold rounded-xl flex items-center gap-2 shadow-sm">
                                        <BookOpen className="w-5 h-5" />
                                        <span className="text-lg">{category.bookCount}</span>
                                        <span className="text-sm">{t('CategoryDetail.booksUnit')}</span>
                                    </div>
                                )}
                            </div>

                            {category.description && (
                                <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
                                    {category.description}
                                </p>
                            )}

                            <div className="flex flex-wrap items-center gap-3 mb-4">
                                <span className="text-xs px-3 py-1.5 bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-400 rounded-full font-semibold">
                                    {t('CategoryDetail.orderLabel')} {category.displayOrder}
                                </span>
                                {category.isActive ? (
                                    <span className="text-xs px-3 py-1.5 bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-400 rounded-full font-semibold flex items-center gap-1">
                                        <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                                        {t('CategoryDetail.status.active')}
                                    </span>
                                ) : (
                                    <span className="text-xs px-3 py-1.5 bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-400 rounded-full font-semibold">
                                        {t('CategoryDetail.status.inactive')}
                                    </span>
                                )}
                            </div>

                            {category.children && category.children.length > 0 && (
                                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                                    <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                                        <Layers className="w-4 h-4" />
                                        {t('CategoryDetail.subcategories')}
                                    </p>
                                    <div className="flex flex-wrap gap-2">
                                        {category.children.map((child) => (
                                            <Link
                                                key={child.id}
                                                to={`/categories/${child.slug}`}
                                                className="px-4 py-2 bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 rounded-lg hover:bg-amber-100 dark:hover:bg-amber-900/40 transition-colors font-medium text-sm border border-amber-200 dark:border-amber-800"
                                            >
                                                {child.name}
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Books Section */}
                <div className="space-y-6">
                    {booksLoading ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                            {[...Array(10)].map((_, i) => (
                                <div key={i} className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden animate-pulse">
                                    <div className="aspect-[2/3] bg-gray-200 dark:bg-gray-700" />
                                    <div className="p-4 space-y-2">
                                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded" />
                                        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-2/3" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <>
                            {/* Toolbar */}
                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg">
                                <p className="text-gray-600 dark:text-gray-400 font-medium">
                                    {t('CategoryDetail.showingBooks', {
                                        shown: books.length,
                                        total: totalElements,
                                    })}
                                </p>

                                <div className="flex items-center gap-4 w-full sm:w-auto">
                                    <BookSort
                                        currentSort={{ sortBy, sortDirection }}
                                        onSortChange={handleSortChange}
                                    />

                                    <div className="hidden md:flex items-center gap-2 border border-gray-300 dark:border-gray-700 rounded-lg p-1">
                                        <button
                                            onClick={() => setViewMode('grid')}
                                            className={`p-2 rounded transition-colors ${
                                                viewMode === 'grid'
                                                    ? 'bg-amber-500 text-white'
                                                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                                            }`}
                                        >
                                            <LayoutGrid className="w-5 h-5" />
                                        </button>
                                        <button
                                            onClick={() => setViewMode('list')}
                                            className={`p-2 rounded transition-colors ${
                                                viewMode === 'list'
                                                    ? 'bg-amber-500 text-white'
                                                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                                            }`}
                                        >
                                            <LayoutList className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Books Grid/List */}
                            {books.length > 0 ? (
                                <>
                                    <div
                                        className={
                                            viewMode === 'grid'
                                                ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6'
                                                : 'space-y-4'
                                        }
                                    >
                                        {books.map((book) => (
                                            <BookCard key={book.id} book={book} viewMode={viewMode} />
                                        ))}
                                    </div>

                                    {/* Pagination */}
                                    {totalPages > 1 && (
                                        <div className="flex items-center justify-center gap-2 pt-8">
                                            <button
                                                onClick={() => handlePageChange(page - 1)}
                                                disabled={page === 0}
                                                className="px-4 py-2 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-amber-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md flex items-center gap-2 font-medium"
                                            >
                                                <ChevronLeft className="w-5 h-5" />
                                                <span className="hidden sm:inline">{t('CategoryDetail.pagination.previous')}</span>
                                            </button>

                                            <div className="flex items-center gap-2">
                                                {getPaginationNumbers().map((pageNum) => (
                                                    <button
                                                        key={pageNum}
                                                        onClick={() => handlePageChange(pageNum)}
                                                        className={`w-10 h-10 rounded-lg font-medium transition-all shadow-md ${
                                                            page === pageNum
                                                                ? 'bg-amber-500 text-white'
                                                                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-amber-50 dark:hover:bg-gray-700'
                                                        }`}
                                                    >
                                                        {pageNum + 1}
                                                    </button>
                                                ))}
                                            </div>

                                            <button
                                                onClick={() => handlePageChange(page + 1)}
                                                disabled={page >= totalPages - 1}
                                                className="px-4 py-2 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-amber-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md flex items-center gap-2 font-medium"
                                            >
                                                <span className="hidden sm:inline">{t('CategoryDetail.pagination.next')}</span>
                                                <ChevronRight className="w-5 h-5" />
                                            </button>
                                        </div>
                                    )}
                                </>
                            ) : (
                                <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-2xl shadow-lg">
                                    <BookOpen className="w-20 h-20 text-gray-400 dark:text-gray-600 mx-auto mb-6" />
                                    <h3 className="text-2xl font-serif font-bold text-gray-700 dark:text-gray-300 mb-3">
                                        {t('CategoryDetail.noBooks.title')}
                                    </h3>
                                    <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md mx-auto">
                                        {t('CategoryDetail.noBooks.description')}
                                    </p>
                                    <div className="flex gap-4 justify-center">
                                        <Link
                                            to="/books"
                                            className="px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-lg hover:from-amber-600 hover:to-orange-600 transition-all shadow-md hover:shadow-lg font-semibold"
                                        >
                                            {t('CategoryDetail.noBooks.viewAllBooks')}
                                        </Link>
                                        <Link
                                            to="/categories"
                                            className="px-6 py-3 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-2 border-gray-300 dark:border-gray-600 rounded-lg hover:border-amber-500 dark:hover:border-amber-400 transition-all font-semibold"
                                        >
                                            {t('CategoryDetail.noBooks.otherCategories')}
                                        </Link>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CategoryDetail;