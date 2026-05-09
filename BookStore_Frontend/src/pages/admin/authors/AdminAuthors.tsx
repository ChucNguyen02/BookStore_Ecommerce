import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
    Plus,
    Search,
    Edit2,
    Trash2,
    BookOpen,
    Calendar,
    MapPin,
    Users,
} from 'lucide-react';
import { useAuthors } from '../../../hooks/admin/useAdminAuthors';
import { type AuthorResponse, type AuthorRequest } from '../../../types';
import LoadingSpinner from '../../../components/admin/common/LoadingSpinner';
import Pagination from '../../../components/admin/common/Pagination';
import ConfirmDialog from '../../../components/admin/common/ConfirmDialog';
import AuthorFormModal from '../../../components/admin/authors/AuthorFormModal';

export default function AdminAuthors() {
    const { t } = useTranslation();
    const {
        authors,
        isLoading,
        error,
        loadAuthors,
        searchAuthors,
        createAuthor,
        updateAuthor,
        deleteAuthor,
    } = useAuthors();

    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(0);
    const [isFormModalOpen, setIsFormModalOpen] = useState(false);
    const [selectedAuthor, setSelectedAuthor] = useState<AuthorResponse | null>(null);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [authorToDelete, setAuthorToDelete] = useState<AuthorResponse | null>(null);

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        setCurrentPage(0);
        if (searchQuery.trim()) {
            await searchAuthors(searchQuery.trim(), 0);
        } else {
            await loadAuthors(0);
        }
    };

    const handlePageChange = async (page: number) => {
        setCurrentPage(page);
        if (searchQuery.trim()) {
            await searchAuthors(searchQuery.trim(), page);
        } else {
            await loadAuthors(page);
        }
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleCreateClick = () => {
        setSelectedAuthor(null);
        setIsFormModalOpen(true);
    };

    const handleEditClick = (author: AuthorResponse) => {
        setSelectedAuthor(author);
        setIsFormModalOpen(true);
    };

    const handleDeleteClick = (author: AuthorResponse) => {
        setAuthorToDelete(author);
        setIsDeleteDialogOpen(true);
    };

    const handleFormSubmit = async (data: AuthorRequest) => {
        if (selectedAuthor) {
            await updateAuthor(selectedAuthor.id, data);
        } else {
            await createAuthor(data);
        }
    };

    const handleDeleteConfirm = async () => {
        if (authorToDelete) {
            await deleteAuthor(authorToDelete.id);
            setIsDeleteDialogOpen(false);
            setAuthorToDelete(null);
        }
    };

    if (isLoading && !authors) {
        return <LoadingSpinner fullScreen message={t('common.loading')} />;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-amber-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
            {/* Header với animation */}
            <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 text-white animate-fadeInDown">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="flex items-center space-x-3 mb-2">
                                <Users className="w-8 h-8 animate-pulse" />
                                <h1 className="text-3xl font-bold">{t('admin.authors')}</h1>
                            </div>
                            <p className="text-amber-100">
                                {t('admin.manageAuthors')}
                            </p>
                        </div>
                        <button
                            onClick={handleCreateClick}
                            className="btn-primary flex items-center space-x-2"
                        >
                            <Plus className="w-5 h-5" />
                            <span>{t('admin.createAuthor')}</span>
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Search Bar với animation */}
                <div className="card animate-fadeInUp mb-6">
                    <form onSubmit={handleSearch} className="flex items-center space-x-4">
                        <div className="flex-1 relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder={t('admin.searchAuthors')}
                                className="input-field pl-12"
                            />
                        </div>
                        <button
                            type="submit"
                            className="btn-primary"
                        >
                            {t('common.search')}
                        </button>
                    </form>
                </div>

                {/* Error State */}
                {error && (
                    <div className="card animate-fadeInUp bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 mb-6">
                        <p className="text-red-600 dark:text-red-400">{error}</p>
                    </div>
                )}

                {/* Authors Grid với stagger animation */}
                {authors && authors.content.length > 0 ? (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                            {authors.content.map((author, index) => (
                                <div
                                    key={author.id}
                                    className="card card-hover stagger-item overflow-hidden"
                                    style={{ animationDelay: `${index * 0.1}s` }}
                                >
                                    <div className="flex items-start space-x-4 mb-4">
                                        {author.avatarUrl ? (
                                            <img
                                                src={author.avatarUrl}
                                                alt={author.name}
                                                className="w-16 h-16 rounded-full object-cover hover-scale"
                                            />
                                        ) : (
                                            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white font-bold text-xl hover-scale">
                                                {author.name.charAt(0)}
                                            </div>
                                        )}
                                        <div className="flex-1 min-w-0">
                                            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1 truncate">
                                                {author.name}
                                            </h3>
                                            {author.nationality && (
                                                <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                                                    <MapPin className="w-4 h-4 mr-1" />
                                                    {author.nationality}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {author.bio && (
                                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">
                                            {author.bio}
                                        </p>
                                    )}

                                    <div className="flex items-center justify-between mb-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                                        <div className="flex items-center">
                                            <span className="badge badge-primary flex items-center space-x-1">
                                                <BookOpen className="w-3 h-3" />
                                                <span>{author.bookCount || 0}</span>
                                            </span>
                                        </div>
                                        {author.birthDate && (
                                            <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                                                <Calendar className="w-4 h-4 mr-1" />
                                                <span>{new Date(author.birthDate).getFullYear()}</span>
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex items-center space-x-2">
                                        <button
                                            onClick={() => handleEditClick(author)}
                                            className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-smooth"
                                        >
                                            <Edit2 className="w-4 h-4" />
                                            <span>{t('common.edit')}</span>
                                        </button>
                                        <button
                                            onClick={() => handleDeleteClick(author)}
                                            className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-smooth"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                            <span>{t('common.delete')}</span>
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Pagination */}
                        {authors.totalPages > 1 && (
                            <div className="card animate-fadeInUp">
                                <Pagination
                                    currentPage={currentPage}
                                    totalPages={authors.totalPages}
                                    onPageChange={handlePageChange}
                                />
                                <div className="mt-4 text-center text-sm text-gray-600 dark:text-gray-400">
                                    {t('admin.showing')} {authors.content.length} {t('admin.of')} {authors.totalElements} {t('admin.authors')}
                                </div>
                            </div>
                        )}
                    </>
                ) : (
                    <div className="card animate-scaleIn text-center">
                        <Users className="w-16 h-16 text-gray-400 mx-auto mb-4 animate-bounce" />
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                            {t('admin.noAuthorsFound')}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-6">
                            {searchQuery
                                ? t('admin.tryDifferentSearch')
                                : t('admin.createFirstAuthor')}
                        </p>
                        {!searchQuery && (
                            <button
                                onClick={handleCreateClick}
                                className="btn-primary inline-flex items-center space-x-2"
                            >
                                <Plus className="w-5 h-5" />
                                <span>{t('admin.createAuthor')}</span>
                            </button>
                        )}
                    </div>
                )}
            </div>

            {/* Form Modal */}
            <AuthorFormModal
                isOpen={isFormModalOpen}
                author={selectedAuthor}
                onClose={() => setIsFormModalOpen(false)}
                onSubmit={handleFormSubmit}
            />

            {/* Delete Confirmation Dialog */}
            <ConfirmDialog
                open={isDeleteDialogOpen}
                title={t('admin.deleteAuthor')}
                message={t('admin.deleteAuthorConfirm', { name: authorToDelete?.name })}
                onConfirm={handleDeleteConfirm}
                onCancel={() => {
                    setIsDeleteDialogOpen(false);
                    setAuthorToDelete(null);
                }}
            />
        </div>
    );
}