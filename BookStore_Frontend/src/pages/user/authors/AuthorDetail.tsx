import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { User, Book, Calendar, Globe, ChevronLeft, ChevronRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { BookCard } from '../../../components/user/books/BookCard';
import LoadingSpinner from '../../../components/user/common/LoadingSpinner';
import { useAuthorDetail } from '../../../hooks/user/useAuthor';
import { useBooksByAuthor } from '../../../hooks/user/useBooks';
import { useAppContext } from '../../../context/AppContext';
import toast from 'react-hot-toast';

const AuthorDetail = () => {
    const { t } = useTranslation();
    const { language } = useAppContext();
    const { id } = useParams<{ id: string }>();
    const [page, setPage] = useState(0);
    const size = 20;

    const {
        data: author,
        isLoading: authorLoading,
        error: authorError
    } = useAuthorDetail(id);

    const {
        data: booksData,
        isLoading: booksLoading,
        error: booksError
    } = useBooksByAuthor(id, page, size);

    const loading = authorLoading || booksLoading;
    const error = authorError || booksError;

    if (error) {
        toast.error((error as Error).message);
    }

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat(language === 'vi' ? 'vi-VN' : 'en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        }).format(date);
    };

    const handlePageChange = (newPage: number) => {
        setPage(newPage);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    if (loading) {
        return <LoadingSpinner fullScreen />;
    }

    if (error || !author) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center space-y-4">
                    <p className="text-xl text-red-600 dark:text-red-400">
                        {(error as Error)?.message || t('AuthorDetail.notFound')}
                    </p>
                    <Link to="/books" className="text-amber-600 dark:text-amber-400 hover:underline">
                        {t('AuthorDetail.backToBooks')}
                    </Link>
                </div>
            </div>
        );
    }

    const books = booksData?.content || [];
    const totalPages = booksData?.totalPages || 0;

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
            <div className="container mx-auto px-4 py-8">
                {/* Breadcrumb */}
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-8">
                    <Link to="/" className="hover:text-amber-600 dark:hover:text-amber-400">
                        {t('AuthorDetail.home')}
                    </Link>
                    <span>/</span>
                    <Link to="/books" className="hover:text-amber-600 dark:hover:text-amber-400">
                        {t('AuthorDetail.books')}
                    </Link>
                    <span>/</span>
                    <span className="text-gray-900 dark:text-white">{author.name}</span>
                </div>

                {/* Author Info */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 mb-8 shadow-lg">
                    <div className="flex flex-col md:flex-row gap-8">
                        {/* Avatar */}
                        <div className="flex-shrink-0">
                            {author.avatarUrl ? (
                                <img
                                    src={author.avatarUrl}
                                    alt={author.name}
                                    className="w-48 h-48 rounded-2xl object-cover ring-4 ring-blue-200 dark:ring-blue-800 shadow-xl"
                                />
                            ) : (
                                <div className="w-48 h-48 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-6xl font-bold shadow-xl">
                                    {author.name.charAt(0).toUpperCase()}
                                </div>
                            )}
                        </div>

                        {/* Info */}
                        <div className="flex-1 space-y-4">
                            <div className="flex items-center gap-3">
                                <User className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                                <h1 className="text-4xl font-serif font-bold text-gray-900 dark:text-white">
                                    {author.name}
                                </h1>
                            </div>

                            {/* Stats */}
                            <div className="flex flex-wrap gap-6">
                                {author.birthDate && (
                                    <div className="flex items-center gap-2">
                                        <Calendar className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                                        <span className="text-gray-700 dark:text-gray-300">
                                            {formatDate(author.birthDate)}
                                        </span>
                                    </div>
                                )}

                                {author.nationality && (
                                    <div className="flex items-center gap-2">
                                        <Globe className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                                        <span className="text-gray-700 dark:text-gray-300">
                                            {author.nationality}
                                        </span>
                                    </div>
                                )}

                                {author.bookCount !== null && (
                                    <div className="flex items-center gap-2">
                                        <Book className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                                        <span className="text-gray-700 dark:text-gray-300">
                                            {t('AuthorDetail.bookCount', { count: author.bookCount })}
                                        </span>
                                    </div>
                                )}
                            </div>

                            {/* Bio */}
                            {author.bio && (
                                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                                        {t('AuthorDetail.biography')}
                                    </h3>
                                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                                        {author.bio}
                                    </p>
                                </div>
                            )}

                            {/* Created Date */}
                            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    {t('AuthorDetail.added')}: {formatDate(author.createdAt)}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Books Section */}
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-3xl font-serif font-bold text-gray-900 dark:text-white flex items-center gap-3">
                            <Book className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                            {t('AuthorDetail.booksTitle')}
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400">
                            {t('AuthorDetail.displayedBooks', { count: books.length })}
                        </p>
                    </div>

                    {books.length > 0 ? (
                        <>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                                {books.map((book) => (
                                    <BookCard key={book.id} book={book} />
                                ))}
                            </div>

                            {/* Pagination */}
                            {totalPages > 1 && (
                                <div className="flex items-center justify-center gap-2">
                                    <button
                                        onClick={() => handlePageChange(page - 1)}
                                        disabled={page === 0}
                                        className="px-4 py-2 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-blue-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                                    >
                                        <ChevronLeft className="w-5 h-5" />
                                        {t('AuthorDetail.previous')}
                                    </button>

                                    <div className="flex items-center gap-2">
                                        {[...Array(Math.min(5, totalPages))].map((_, i) => {
                                            let pageNum;
                                            if (totalPages <= 5) {
                                                pageNum = i;
                                            } else if (page < 3) {
                                                pageNum = i;
                                            } else if (page > totalPages - 3) {
                                                pageNum = totalPages - 5 + i;
                                            } else {
                                                pageNum = page - 2 + i;
                                            }

                                            return (
                                                <button
                                                    key={i}
                                                    onClick={() => handlePageChange(pageNum)}
                                                    className={`w-10 h-10 rounded-lg font-medium transition-colors ${
                                                        page === pageNum
                                                            ? 'bg-blue-500 text-white'
                                                            : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-gray-700'
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
                                        className="px-4 py-2 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-blue-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                                    >
                                        {t('AuthorDetail.next')}
                                        <ChevronRight className="w-5 h-5" />
                                    </button>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-2xl">
                            <Book className="w-16 h-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
                            <p className="text-gray-500 dark:text-gray-400 text-lg">
                                {t('AuthorDetail.noBooks')}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AuthorDetail;