import { Link } from 'react-router-dom';
import { Layers, BookOpen, ChevronRight } from 'lucide-react';
import type { CategoryResponse } from '../../../types/category.types';
import { useTranslation } from 'react-i18next';

interface CategoryListViewProps {
  category: CategoryResponse;
  childCategories: CategoryResponse[];
}

export const CategoryListView = ({ category, childCategories }: CategoryListViewProps) => {
  const { t } = useTranslation();

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group">
      <div className="flex flex-col sm:flex-row items-stretch">
        {/* Image */}
        <Link to={`/categories/${category.slug}`} className="flex-shrink-0">
          <div className="w-full sm:w-48 h-48 sm:h-full relative bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20">
            {category.imageUrl ? (
              <img
                src={category.imageUrl}
                alt={category.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                loading="lazy"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Layers className="w-12 h-12 text-amber-400 dark:text-amber-600" />
              </div>
            )}

            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            {/* Status Badge */}
            {!category.isActive && (
              <div className="absolute top-3 left-3 px-2 py-1 bg-red-500/90 backdrop-blur-sm text-white text-xs font-semibold rounded-full">
                {t('categoryListView.inactive')}
              </div>
            )}
          </div>
        </Link>

        {/* Content */}
        <div className="flex-1 p-6 flex flex-col">
          <div className="flex flex-col sm:flex-row items-start justify-between mb-3 gap-3">
            <div className="flex-1">
              <Link to={`/categories/${category.slug}`}>
                <h3 className="font-serif font-bold text-2xl text-gray-900 dark:text-white mb-1 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                  {category.name}
                </h3>
              </Link>
              <p className="text-xs text-gray-400 dark:text-gray-500 font-mono mb-2">
                /{category.slug}
              </p>
            </div>

            {/* Book Count Badge */}
            {category.bookCount !== undefined && category.bookCount > 0 && (
              <div className="px-4 py-2 bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-400 font-bold rounded-full flex items-center gap-2 self-start">
                <BookOpen className="w-4 h-4" />
                {category.bookCount}
              </div>
            )}
          </div>

          {/* Description */}
          {category.description && (
            <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-4 leading-relaxed">
              {category.description}
            </p>
          )}

          {/* Meta Info */}
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xs px-3 py-1 bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-400 rounded-full font-semibold">
              {t('categoryListView.order', { order: category.displayOrder })}
            </span>
            {category.isActive && (
              <span className="text-xs px-3 py-1 bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-400 rounded-full font-semibold">
                {t('categoryListView.active')}
              </span>
            )}
          </div>

          {/* Subcategories */}
          {childCategories.length > 0 && (
            <div className="mb-4">
              <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-2">
                {t('categoryListView.subcategories')}
              </p>
              <div className="flex flex-wrap gap-2">
                {childCategories.slice(0, 8).map((child) => (
                  <Link
                    key={child.id}
                    to={`/categories/${child.slug}`}
                    className="text-xs px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full hover:bg-amber-100 dark:hover:bg-amber-900/40 hover:text-amber-700 dark:hover:text-amber-400 transition-colors"
                  >
                    {child.name}
                  </Link>
                ))}
                {childCategories.length > 8 && (
                  <span className="text-xs px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-full">
                    +{childCategories.length - 8}
                  </span>
                )}
              </div>
            </div>
          )}

          {/* View Button */}
          <div className="mt-auto pt-4">
            <Link
              to={`/categories/${category.slug}`}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 dark:from-amber-600 dark:to-orange-600 text-white rounded-lg font-semibold hover:from-amber-600 hover:to-orange-600 dark:hover:from-amber-700 dark:hover:to-orange-700 transition-all shadow-md hover:shadow-lg group"
            >
              <span>{t('categoryListView.viewBooks')}</span>
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};