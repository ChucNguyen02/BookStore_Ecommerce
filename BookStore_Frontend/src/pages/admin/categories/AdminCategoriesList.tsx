import { useState, useMemo } from 'react';
import { Plus, Search, Grid, List } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAdminCategories } from '../../../hooks/admin/useAdminCategories';
import { type CategoryResponse } from '../../../types/category.types';
import LoadingSpinner from '../../../components/admin/common/LoadingSpinner';
import ConfirmDialog from '../../../components/admin/common/ConfirmDialog';
import AdminCategoryCard from '../../../components/admin/categories/AdminCategoryCard';
import AdminCategoryForm from '../../../components/admin/categories/AdminCategoryForm';

export default function AdminCategoriesList() {
    const { t } = useTranslation();
    const {
        categories,
        isLoading,
        createCategory,
        updateCategory,
        deleteCategory,
    } = useAdminCategories();

    const [searchTerm, setSearchTerm] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [editingCategory, setEditingCategory] = useState<CategoryResponse | null>(null);
    const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; id: string | null }>({
        open: false,
        id: null,
    });
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all');

    // Filter and search categories
    const filteredCategories = useMemo(() => {
        return categories.filter(cat => {
            const matchesSearch = cat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                cat.slug.toLowerCase().includes(searchTerm.toLowerCase());

            const matchesStatus = filterStatus === 'all' ||
                (filterStatus === 'active' && cat.isActive) ||
                (filterStatus === 'inactive' && !cat.isActive);

            return matchesSearch && matchesStatus;
        });
    }, [categories, searchTerm, filterStatus]);

    // Get parent categories for form
    const parentCategories = useMemo(() => {
        return categories.filter(cat => cat.parentId === null);
    }, [categories]);

    // Stats
    const stats = useMemo(() => {
        return {
            total: categories.length,
            active: categories.filter(c => c.isActive).length,
            inactive: categories.filter(c => !c.isActive).length,
            parents: categories.filter(c => c.parentId === null).length,
            children: categories.filter(c => c.parentId !== null).length,
        };
    }, [categories]);

    const handleCreate = () => {
        setEditingCategory(null);
        setShowForm(true);
    };

    const handleEdit = (category: CategoryResponse) => {
        setEditingCategory(category);
        setShowForm(true);
    };

    const handleDelete = (categoryId: string) => {
        setDeleteDialog({ open: true, id: categoryId });
    };

    const confirmDelete = async () => {
        if (deleteDialog.id) {
            await deleteCategory(deleteDialog.id);
        }
        setDeleteDialog({ open: false, id: null });
    };

    const handleFormSubmit = async (data: any) => {
        if (editingCategory) {
            return await updateCategory(editingCategory.id, data);
        } else {
            return await createCategory(data);
        }
    };

    if (isLoading) {
        return <LoadingSpinner fullScreen message={t('admin.loadingCategories')} />;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-amber-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
            {/* Header với gradient animation */}
            <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 text-white py-8 shadow-2xl animate-fadeInDown">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold flex items-center">
                                <span className="w-2 h-8 bg-white rounded-full mr-3 animate-pulse"></span>
                                {t('admin.categories')}
                            </h1>
                            <p className="text-amber-100 mt-2 animate-fadeIn">
                                {t('admin.manageCategoriesDesc')}
                            </p>
                        </div>
                        <button
                            onClick={handleCreate}
                            className="flex items-center space-x-2 px-6 py-3 bg-white text-amber-600 hover:bg-amber-50 rounded-xl font-medium shadow-lg hover:shadow-2xl transition-smooth hover-scale"
                        >
                            <Plus className="w-5 h-5" />
                            <span>{t('admin.createCategory')}</span>
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Stats Cards với stagger animation */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
                    <div className="card hover-lift stagger-item">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                                    {t('admin.total')}
                                </p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                                    {stats.total}
                                </p>
                            </div>
                            <div className="w-10 h-10 bg-gradient-to-br from-gray-500 to-gray-600 rounded-lg flex items-center justify-center shadow-lg">
                                <Grid className="w-5 h-5 text-white" />
                            </div>
                        </div>
                    </div>

                    <div className="card hover-lift stagger-item">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                                    {t('admin.active')}
                                </p>
                                <p className="text-2xl font-bold text-green-600 dark:text-green-400 mt-1">
                                    {stats.active}
                                </p>
                            </div>
                            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center shadow-lg animate-pulse">
                                <div className="w-2 h-2 bg-white rounded-full"></div>
                            </div>
                        </div>
                    </div>

                    <div className="card hover-lift stagger-item">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                                    {t('admin.inactive')}
                                </p>
                                <p className="text-2xl font-bold text-gray-600 dark:text-gray-400 mt-1">
                                    {stats.inactive}
                                </p>
                            </div>
                            <div className="w-10 h-10 bg-gradient-to-br from-gray-400 to-gray-500 rounded-lg flex items-center justify-center shadow-lg">
                                <div className="w-2 h-2 bg-white rounded-full opacity-50"></div>
                            </div>
                        </div>
                    </div>

                    <div className="card hover-lift stagger-item">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                                    {t('admin.parents')}
                                </p>
                                <p className="text-2xl font-bold text-amber-600 dark:text-amber-400 mt-1">
                                    {stats.parents}
                                </p>
                            </div>
                            <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-600 rounded-lg flex items-center justify-center shadow-lg">
                                <List className="w-5 h-5 text-white" />
                            </div>
                        </div>
                    </div>

                    <div className="card hover-lift stagger-item">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                                    {t('admin.children')}
                                </p>
                                <p className="text-2xl font-bold text-orange-600 dark:text-orange-400 mt-1">
                                    {stats.children}
                                </p>
                            </div>
                            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center shadow-lg">
                                <div className="flex space-x-1">
                                    <div className="w-1 h-3 bg-white rounded-full"></div>
                                    <div className="w-1 h-3 bg-white rounded-full opacity-75"></div>
                                    <div className="w-1 h-3 bg-white rounded-full opacity-50"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Filters & Search với glass effect */}
                <div className="card stagger-item mb-8 hover-lift">
                    <div className="flex flex-col md:flex-row gap-4">
                        {/* Search */}
                        <div className="relative flex-1">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 transition-colors" />
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder={t('admin.searchCategories')}
                                className="input-field pl-12 transition-smooth"
                            />
                        </div>

                        {/* Filter Status */}
                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value as any)}
                            className="input-field transition-smooth min-w-[150px]"
                        >
                            <option value="all">{t('admin.allStatus')}</option>
                            <option value="active">{t('admin.active')}</option>
                            <option value="inactive">{t('admin.inactive')}</option>
                        </select>

                        {/* View Mode Toggle */}
                        <div className="flex items-center space-x-2 bg-gray-50 dark:bg-gray-700 p-1 rounded-xl border border-gray-200 dark:border-gray-600">
                            <button
                                onClick={() => setViewMode('grid')}
                                className={`p-2 rounded-lg transition-smooth hover-scale ${viewMode === 'grid'
                                        ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg'
                                        : 'text-gray-600 dark:text-gray-400 hover:text-amber-600 hover:bg-white/50'
                                    }`}
                                title="Grid View"
                            >
                                <Grid className="w-5 h-5" />
                            </button>
                            <button
                                onClick={() => setViewMode('list')}
                                className={`p-2 rounded-lg transition-smooth hover-scale ${viewMode === 'list'
                                        ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg'
                                        : 'text-gray-600 dark:text-gray-400 hover:text-amber-600 hover:bg-white/50'
                                    }`}
                                title="List View"
                            >
                                <List className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    {/* Results Count với badge */}
                    <div className="mt-4 flex items-center space-x-2">
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                            {t('admin.showing')}
                        </span>
                        <span className="badge badge-primary animate-fadeIn">
                            {filteredCategories.length}
                        </span>
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                            {t('admin.categories')}
                        </span>
                        {searchTerm && (
                            <button
                                onClick={() => setSearchTerm('')}
                                className="ml-auto text-sm text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 font-medium transition-colors hover-scale"
                            >
                                {t('admin.clearSearch')}
                            </button>
                        )}
                    </div>
                </div>

                {/* Categories Grid/List */}
                {filteredCategories.length === 0 ? (
                    <div className="card text-center stagger-item hover-lift">
                        <div className="py-12">
                            <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse shadow-lg">
                                <Search className="w-10 h-10 text-gray-400" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                                {searchTerm ? t('admin.noResultsFound') : t('admin.noCategoriesFound')}
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
                                {searchTerm
                                    ? t('admin.tryDifferentSearch')
                                    : t('admin.noCategoriesFoundDesc')
                                }
                            </p>
                            {!searchTerm && (
                                <button
                                    onClick={handleCreate}
                                    className="btn-primary hover-scale inline-flex items-center space-x-2"
                                >
                                    <Plus className="w-5 h-5" />
                                    <span>{t('admin.createFirstCategory')}</span>
                                </button>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className={
                        viewMode === 'grid'
                            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
                            : 'space-y-4'
                    }>
                        {filteredCategories.map((category, index) => (
                            <div
                                key={category.id}
                                className="animate-fadeInUp"
                                style={{ animationDelay: `${index * 0.05}s` }}
                            >
                                <AdminCategoryCard
                                    category={category}
                                    onEdit={handleEdit}
                                    onDelete={handleDelete}
                                />
                            </div>
                        ))}
                    </div>
                )}

                {/* Bottom Stats Summary */}
                {filteredCategories.length > 0 && (
                    <div className="mt-8 card stagger-item">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-6">
                                <div className="flex items-center space-x-2">
                                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                    <span className="text-sm text-gray-600 dark:text-gray-400">
                                        {stats.active} {t('admin.active')}
                                    </span>
                                </div>
                                <div className="h-4 w-px bg-gray-300 dark:bg-gray-600"></div>
                                <div className="flex items-center space-x-2">
                                    <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                                    <span className="text-sm text-gray-600 dark:text-gray-400">
                                        {stats.inactive} {t('admin.inactive')}
                                    </span>
                                </div>
                                <div className="h-4 w-px bg-gray-300 dark:bg-gray-600"></div>
                                <div className="flex items-center space-x-2">
                                    <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                                    <span className="text-sm text-gray-600 dark:text-gray-400">
                                        {stats.parents} {t('admin.parents')}
                                    </span>
                                </div>
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                                {t('admin.viewMode')}: <span className="font-semibold text-gray-900 dark:text-white capitalize">{viewMode}</span>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Form Modal với backdrop blur animation */}
            {showForm && (
                <div className="fixed inset-0 z-50 overflow-y-auto animate-fadeIn">
                    <div className="flex min-h-screen items-center justify-center p-4">
                        <div
                            className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
                            onClick={() => {
                                setShowForm(false);
                                setEditingCategory(null);
                            }}
                        ></div>
                        <div className="relative animate-scaleIn">
                            <AdminCategoryForm
                                category={editingCategory}
                                parentCategories={parentCategories}
                                onSubmit={handleFormSubmit}
                                onClose={() => {
                                    setShowForm(false);
                                    setEditingCategory(null);
                                }}
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Dialog */}
            <ConfirmDialog
                open={deleteDialog.open}
                title={t('admin.deleteCategory')}
                message={t('admin.deleteCategoryConfirm')}
                onConfirm={confirmDelete}
                onCancel={() => setDeleteDialog({ open: false, id: null })}
            />
        </div>
    );
}