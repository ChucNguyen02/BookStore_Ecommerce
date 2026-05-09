import { memo } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Layers } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { CategoryResponse } from '../../../types/category.types';

interface TopCategoriesSectionProps {
    categories: CategoryResponse[];
}

export const TopCategoriesSection = memo(({ categories }: TopCategoriesSectionProps) => {
    const { t } = useTranslation();

    // Get top 8 parent categories
    const topCategories = categories
        .filter(cat => !cat.parentId && cat.isActive)
        .slice(0, 8);

    if (topCategories.length === 0) return null;

    return (
        <section className="py-16 bg-white dark:bg-gray-900">
            <div className="container mx-auto px-4">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                        <div className="p-4 bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-2xl shadow-lg">
                            <Layers className="w-8 h-8" />
                        </div>
                        <div>
                            <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 dark:text-white">
                                {t('TopCategories.title')}
                            </h2>
                            <p className="text-gray-600 dark:text-gray-400 mt-1">
                                {t('TopCategories.subtitle')}
                            </p>
                        </div>
                    </div>

                    <Link
                        to="/categories"
                        className="hidden md:flex items-center gap-2 px-6 py-3 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full font-semibold hover:bg-gray-200 dark:hover:bg-gray-700 transition-all group"
                    >
                        <span>{t('TopCategories.allCategories')}</span>
                        <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>

                {/* Categories Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                    {topCategories.map((category, index) => (
                        <Link
                            key={category.id}
                            to={`/categories/${category.slug}`}
                            className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
                            style={{ animationDelay: `${index * 0.05}s` }}
                        >
                            {/* Image */}
                            <div className="relative aspect-[4/3] overflow-hidden">
                                {category.imageUrl ? (
                                    <img
                                        src={category.imageUrl}
                                        alt={category.name}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/20 dark:to-purple-900/20 flex items-center justify-center">
                                        <Layers className="w-16 h-16 text-indigo-400 dark:text-indigo-600" />
                                    </div>
                                )}

                                {/* Overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                                {/* Book Count */}
                                {category.bookCount !== undefined && (
                                    <div className="absolute top-3 right-3 px-3 py-1.5 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm text-gray-900 dark:text-white text-sm font-bold rounded-full shadow-lg">
                                        {category.bookCount} {t('TopCategories.books')}
                                    </div>
                                )}
                            </div>

                            {/* Content */}
                            <div className="p-5">
                                <h3 className="font-serif font-bold text-gray-900 dark:text-white text-lg group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-2 min-h-[3.5rem]">
                                    {category.name}
                                </h3>
                                {category.description && (
                                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mt-2">
                                        {category.description}
                                    </p>
                                )}
                            </div>

                            {/* Arrow indicator */}
                            <div className="absolute bottom-5 right-5 w-10 h-10 bg-indigo-500 dark:bg-indigo-600 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:scale-110">
                                <ChevronRight className="w-5 h-5" />
                            </div>
                        </Link>
                    ))}
                </div>

                {/* Mobile View All Button */}
                <div className="mt-8 text-center md:hidden">
                    <Link
                        to="/categories"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full font-semibold hover:bg-gray-200 dark:hover:bg-gray-700 transition-all"
                    >
                        <span>{t('TopCategories.viewAllMobile')}</span>
                        <ChevronRight className="w-5 h-5" />
                    </Link>
                </div>
            </div>
        </section>
    );
});

TopCategoriesSection.displayName = 'TopCategoriesSection';