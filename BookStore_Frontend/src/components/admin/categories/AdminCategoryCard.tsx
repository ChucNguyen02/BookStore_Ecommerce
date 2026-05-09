import { Edit2, Trash2, Package, Eye, EyeOff } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { type CategoryResponse } from '../../../types/category.types';

interface AdminCategoryCardProps {
    category: CategoryResponse;
    onEdit: (category: CategoryResponse) => void;
    onDelete: (categoryId: string) => void;
}

export default function AdminCategoryCard({
    category,
    onEdit,
    onDelete,
}: AdminCategoryCardProps) {
    const { t } = useTranslation();

    return (
        <div className="card card-hover overflow-hidden group animate-fadeInUp">
            {/* Image với hover effect */}
            <div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 overflow-hidden">
                {category.imageUrl ? (
                    <img
                        src={category.imageUrl}
                        alt={category.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 hover-brightness"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center">
                        <div className="w-20 h-20 bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/40 dark:to-orange-900/40 rounded-full flex items-center justify-center animate-pulse">
                            <Package className="w-10 h-10 text-amber-600 dark:text-amber-400" />
                        </div>
                    </div>
                )}

                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* Status Badge */}
                <div className="absolute top-3 right-3 animate-fadeIn">
                    {category.isActive ? (
                        <span className="badge badge-success flex items-center space-x-1 shadow-lg">
                            <Eye className="w-3 h-3" />
                            <span>{t('admin.active')}</span>
                        </span>
                    ) : (
                        <span className="badge bg-gray-500 dark:bg-gray-600 text-white flex items-center space-x-1 shadow-lg">
                            <EyeOff className="w-3 h-3" />
                            <span>{t('admin.inactive')}</span>
                        </span>
                    )}
                </div>
            </div>

            {/* Content */}
            <div className="p-5 space-y-4">
                {/* Category Name & Slug */}
                <div className="animate-fadeInUp">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white line-clamp-1 hover:text-amber-600 dark:hover:text-amber-400 transition-colors cursor-pointer">
                        {category.name}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 font-mono">
                        /{category.slug}
                    </p>
                </div>

                {/* Description */}
                {category.description && (
                    <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2 animate-fadeInUp" style={{ animationDelay: '0.1s' }}>
                        {category.description}
                    </p>
                )}

                {/* Meta Info với badges */}
                <div className="flex items-center justify-between pt-2 animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
                    <div className="flex items-center gap-3 flex-wrap">
                        {category.parentName && (
                            <span className="badge bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 flex items-center space-x-1">
                                <Package className="w-3 h-3" />
                                <span>{category.parentName}</span>
                            </span>
                        )}
                        <span className="badge badge-primary">
                            📚 {category.bookCount || 0} {t('admin.books')}
                        </span>
                    </div>
                    <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs font-bold rounded">
                        #{category.displayOrder}
                    </span>
                </div>

                {/* Children Categories */}
                {category.children && category.children.length > 0 && (
                    <div className="pt-3 border-t border-gray-200 dark:border-gray-700 animate-fadeInUp" style={{ animationDelay: '0.3s' }}>
                        <p className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">
                            🏷️ {t('admin.subCategories')} ({category.children.length}):
                        </p>
                        <div className="flex flex-wrap gap-2">
                            {category.children.slice(0, 5).map((child, index) => (
                                <span
                                    key={child.id}
                                    className="badge badge-primary animate-fadeIn hover-scale cursor-pointer"
                                    style={{ animationDelay: `${index * 0.05}s` }}
                                >
                                    {child.name}
                                </span>
                            ))}
                            {category.children.length > 5 && (
                                <span className="badge bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400">
                                    +{category.children.length - 5}
                                </span>
                            )}
                        </div>
                    </div>
                )}

                {/* Action Buttons */}
                <div className="flex items-center gap-2 pt-3 border-t border-gray-200 dark:border-gray-700 animate-fadeInUp" style={{ animationDelay: '0.4s' }}>
                    <button
                        onClick={() => onEdit(category)}
                        className="flex-1 flex items-center justify-center space-x-2 px-4 py-2.5 bg-amber-50 dark:bg-amber-900/20 hover:bg-amber-100 dark:hover:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-lg transition-all hover-lift"
                    >
                        <Edit2 className="w-4 h-4" />
                        <span className="font-medium">{t('common.edit')}</span>
                    </button>
                    <button
                        onClick={() => onDelete(category.id)}
                        className="flex-1 flex items-center justify-center space-x-2 px-4 py-2.5 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg transition-all hover-lift"
                    >
                        <Trash2 className="w-4 h-4" />
                        <span className="font-medium">{t('common.delete')}</span>
                    </button>
                </div>
            </div>
        </div>
    );
}