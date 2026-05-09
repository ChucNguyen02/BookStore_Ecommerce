import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Plus, Search, Eye } from 'lucide-react';
import { useAdminBooks } from '../../../hooks/admin/useAdminBooks';
import LoadingSpinner from '../../../components/admin/common/LoadingSpinner';
import BookTableRow from '../../../components/admin/books/BookTableRow';
import Pagination from '../../../components/admin/common/Pagination';
import ConfirmDialog from '../../../components/admin/common/ConfirmDialog';

export default function AdminBooksList() {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const { books, isLoading, error, fetchBooks, searchBooks, deleteBook } = useAdminBooks();

    const [searchKeyword, setSearchKeyword] = useState('');
    const [currentPage, setCurrentPage] = useState(0);
    const [deleteConfirm, setDeleteConfirm] = useState<{ open: boolean; bookId: string; title: string }>({
        open: false,
        bookId: '',
        title: ''
    });

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchKeyword.trim()) {
            searchBooks(searchKeyword, 0, 20);
        } else {
            fetchBooks(0, 20);
        }
        setCurrentPage(0);
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        if (searchKeyword.trim()) {
            searchBooks(searchKeyword, page, 20);
        } else {
            fetchBooks(page, 20);
        }
    };

    const handleDelete = async () => {
        try {
            await deleteBook(deleteConfirm.bookId);
            setDeleteConfirm({ open: false, bookId: '', title: '' });
            fetchBooks(currentPage, 20);
        } catch (err: any) {
            console.log(err);
        }
    };

    if (isLoading) {
        return <LoadingSpinner />;
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
                <div className="text-center space-y-4 bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg">
                    <p className="text-xl text-red-600 dark:text-red-400">{t('common.error')}</p>
                    <p className="text-gray-600 dark:text-gray-400">{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-amber-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 p-6">
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Header với animation */}
                <div className="flex items-center justify-between animate-fadeInDown">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                            {t('admin.books')}
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400 mt-1">
                            {t('admin.manageBooksDescription')}
                        </p>
                    </div>
                    <button
                        onClick={() => navigate('/admin/books/create')}
                        className="btn-primary hover-scale flex items-center space-x-2 flex-shrink-0"
                    >
                        <Plus className="w-5 h-5" />
                        <span className="font-medium">{t('admin.addBook')}</span>
                    </button>
                </div>

                {/* Search với glass effect */}
                <div className="card stagger-item hover-lift">
                    <form onSubmit={handleSearch} className="flex space-x-4">
                        <div className="flex-1 relative">
                            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 transition-colors" />
                            <input
                                type="text"
                                value={searchKeyword}
                                onChange={(e) => setSearchKeyword(e.target.value)}
                                placeholder={t('admin.searchBooks')}
                                className="input-field pl-12 transition-smooth"
                            />
                        </div>
                        <button
                            type="submit"
                            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-smooth hover-scale"
                        >
                            {t('common.search')}
                        </button>
                        {searchKeyword && (
                            <button
                                type="button"
                                onClick={() => {
                                    setSearchKeyword('');
                                    fetchBooks(0, 20);
                                    setCurrentPage(0);
                                }}
                                className="btn-secondary hover-scale animate-fadeIn"
                            >
                                {t('common.clear')}
                            </button>
                        )}
                    </form>
                </div>

                {/* Table */}
                <div className="card stagger-item overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[1000px]">
                            <thead className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700/50 dark:to-gray-700/30 border-b-2 border-amber-500/20">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider whitespace-nowrap">
                                        <div className="flex items-center space-x-2">
                                            <span className="w-1 h-4 bg-gradient-to-b from-amber-500 to-orange-500 rounded-full"></span>
                                            <span>{t('admin.book')}</span>
                                        </div>
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider whitespace-nowrap">
                                        {t('admin.category')}
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider whitespace-nowrap">
                                        {t('admin.price')}
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider whitespace-nowrap">
                                        {t('admin.stock')}
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider whitespace-nowrap">
                                        {t('admin.status')}
                                    </th>
                                    <th className="px-6 py-4 text-right text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider whitespace-nowrap">
                                        {t('admin.actions')}
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                {books?.content.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-12 text-center">
                                            <div className="flex flex-col items-center justify-center space-y-3 animate-fadeIn">
                                                <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                                                    <Search className="w-8 h-8 text-gray-400" />
                                                </div>
                                                <p className="text-gray-500 dark:text-gray-400 font-medium">
                                                    {searchKeyword ? t('admin.noResultsFound') : t('admin.noBooksYet')}
                                                </p>
                                                {!searchKeyword && (
                                                    <button
                                                        onClick={() => navigate('/admin/books/create')}
                                                        className="btn-primary hover-scale mt-2"
                                                    >
                                                        <Plus className="w-4 h-4 inline mr-2" />
                                                        {t('admin.addFirstBook')}
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    books?.content.map((book, index) => (
                                        <BookTableRow
                                            key={book.id}
                                            book={book}
                                            index={index}
                                            onEdit={(id) => navigate(`/admin/books/edit/${id}`)}
                                            onDelete={(id, title) => setDeleteConfirm({ open: true, bookId: id, title })}
                                            onView={(slug) => navigate(`/books/${slug}`)}
                                        />
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Stats Bar */}
                    {books && books.content.length > 0 && (
                        <div className="border-t border-gray-200 dark:border-gray-700 bg-gradient-to-r from-gray-50 to-amber-50/30 dark:from-gray-700/30 dark:to-gray-700/50 px-6 py-4">
                            <div className="flex items-center justify-between text-sm">
                                <div className="flex items-center space-x-6">
                                    <div className="flex items-center space-x-2">
                                        <span className="text-gray-600 dark:text-gray-400">{t('admin.totalBooks')}:</span>
                                        <span className="font-bold text-gray-900 dark:text-white badge badge-primary">
                                            {books.totalElements}
                                        </span>
                                    </div>
                                    <div className="h-4 w-px bg-gray-300 dark:bg-gray-600"></div>
                                    <div className="flex items-center space-x-2">
                                        <span className="text-gray-600 dark:text-gray-400">{t('admin.showing')}:</span>
                                        <span className="font-semibold text-gray-900 dark:text-white">
                                            {books.content.length} {t('admin.of')} {books.totalElements}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Pagination */}
                    {books && books.totalPages > 1 && (
                        <div className="border-t border-gray-200 dark:border-gray-700 p-4 bg-gray-50 dark:bg-gray-800/50">
                            <Pagination
                                currentPage={currentPage}
                                totalPages={books.totalPages}
                                onPageChange={handlePageChange}
                            />
                        </div>
                    )}
                </div>

                {/* Quick Stats Cards */}
                {books && books.content.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 stagger-item">
                        <div className="card hover-lift">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                                        {t('admin.totalBooks')}
                                    </p>
                                    <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                                        {books.totalElements}
                                    </p>
                                </div>
                                <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl flex items-center justify-center shadow-lg">
                                    <Eye className="w-6 h-6 text-white" />
                                </div>
                            </div>
                        </div>

                        <div className="card hover-lift">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                                        {t('admin.currentPage')}
                                    </p>
                                    <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                                        {currentPage + 1} / {books.totalPages}
                                    </p>
                                </div>
                                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg">
                                    <Search className="w-6 h-6 text-white" />
                                </div>
                            </div>
                        </div>

                        <div className="card hover-lift">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                                        {t('admin.itemsPerPage')}
                                    </p>
                                    <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                                        {books.content.length}
                                    </p>
                                </div>
                                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg">
                                    <Plus className="w-6 h-6 text-white" />
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Delete Confirmation Dialog với backdrop blur */}
            <ConfirmDialog
                open={deleteConfirm.open}
                title={t('admin.deleteBook')}
                message={t('admin.deleteBookConfirm', { title: deleteConfirm.title })}
                onConfirm={handleDelete}
                onCancel={() => setDeleteConfirm({ open: false, bookId: '', title: '' })}
            />
        </div>
    );
}