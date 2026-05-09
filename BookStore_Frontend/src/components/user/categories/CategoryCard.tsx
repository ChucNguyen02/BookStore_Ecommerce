import { Link } from 'react-router-dom';
import { Layers, BookOpen, ChevronRight } from 'lucide-react';
import type { CategoryResponse } from '../../../types/category.types';
import { useTranslation } from 'react-i18next';

interface CategoryCardProps {
  category: CategoryResponse;
  childCategories: CategoryResponse[];
  index: number;
}

export const CategoryCard = ({ category, childCategories, index }: CategoryCardProps) => {
  const { t } = useTranslation();

  return (
    <div
      className="group bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden hover-lift animate-fadeInUp"
      style={{ animationDelay: `${index * 0.05}s` }}
    >
      {/* Image Section */}
      <Link to={`/categories/${category.slug}`}>
        <div className="relative aspect-[16/9] overflow-hidden bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20">
          {category.imageUrl ? (
            <img
              src={category.imageUrl}
              alt={category.name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Layers className="w-16 h-16 text-amber-400 dark:text-amber-600" />
            </div>
          )}

          {/* Hover Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Book Count Badge */}
          {category.bookCount !== undefined && category.bookCount > 0 && (
            <div className="absolute top-4 right-4 px-4 py-2 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm text-gray-900 dark:text-white font-bold rounded-full shadow-lg flex items-center gap-2 animate-scaleIn">
              <BookOpen className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              {category.bookCount}
            </div>
          )}

          {/* Status Badge */}
          {!category.isActive && (
            <div className="absolute top-4 left-4 px-3 py-1 bg-red-500/90 backdrop-blur-sm text-white text-xs font-semibold rounded-full">
              {t('categoryCard.inactive')}
            </div>
          )}
        </div>
      </Link>

      {/* Content Section */}
      <div className="p-6">
        {/* Category Title */}
        <Link to={`/categories/${category.slug}`}>
          <h3 className="font-serif font-bold text-xl text-gray-900 dark:text-white mb-2 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors line-clamp-2 min-h-[3.5rem]">
            {category.name}
          </h3>
        </Link>

        {/* Slug */}
        <p className="text-xs text-gray-400 dark:text-gray-500 mb-3 font-mono">
          /{category.slug}
        </p>

        {/* Description */}
        {category.description && (
          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-4 leading-relaxed">
            {category.description}
          </p>
        )}

        {/* Meta Info */}
        <div className="flex items-center gap-2 mb-4">
          <span className="text-xs px-3 py-1 bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-400 rounded-full font-semibold">
            {t('categoryCard.order', { order: category.displayOrder })}
          </span>
          {category.isActive && (
            <span className="text-xs px-3 py-1 bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-400 rounded-full font-semibold">
              {t('categoryCard.active')}
            </span>
          )}
        </div>

        {/* Subcategories */}
        {childCategories.length > 0 && (
          <div className="space-y-2 pt-4 border-t border-gray-200 dark:border-gray-700">
            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-2">
              {t('categoryCard.subcategories')}
            </p>
            <div className="flex flex-wrap gap-2">
              {childCategories.slice(0, 5).map((child) => (
                <Link
                  key={child.id}
                  to={`/categories/${child.slug}`}
                  className="text-xs px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full hover:bg-amber-100 dark:hover:bg-amber-900/40 hover:text-amber-700 dark:hover:text-amber-400 transition-colors"
                >
                  {child.name}
                </Link>
              ))}
              {childCategories.length > 5 && (
                <span className="text-xs px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-full">
                  +{childCategories.length - 5}
                </span>
              )}
            </div>
          </div>
        )}

        {/* View Button */}
        <Link
          to={`/categories/${category.slug}`}
          className="mt-4 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-amber-500 to-orange-500 dark:from-amber-600 dark:to-orange-600 text-white rounded-lg font-semibold hover:from-amber-600 hover:to-orange-600 dark:hover:from-amber-700 dark:hover:to-orange-700 transition-all shadow-md hover:shadow-lg group"
        >
          <span>{t('categoryCard.viewBooks')}</span>
          <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </div>
  );
};