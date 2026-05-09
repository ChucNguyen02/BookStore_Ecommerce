import { useTranslation } from 'react-i18next';import { Link } from 'react-router-dom';
import { ChevronRight, Layers } from 'lucide-react';
import type { CategoryResponse } from '../../../types/category.types';
import { useAppContext } from '../../../context/AppContext';

interface CategorySectionProps {
  categories: CategoryResponse[];
}

export const CategorySection = ({ categories }: CategorySectionProps) => {const { t } = useTranslation();
  const { language } = useAppContext();

  // Get parent categories only (limit to 8)
  const parentCategories = categories.
  filter((cat) => !cat.parentId && cat.isActive).
  slice(0, 8);

  return (
    <section className="py-16 bg-gradient-to-br from-gray-50 to-amber-50/30 dark:from-gray-900 dark:to-gray-800">
            <div className="container mx-auto px-4">
                {/* Section Header */}
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl shadow-lg">
                            <Layers className="w-6 h-6" />
                        </div>
                        <div>
                            <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 dark:text-white">
                                {language === 'vi' ? t("Common.danhMucSach") : 'Book Categories'}
                            </h2>
                            <div className="h-1 w-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mt-2" />
                        </div>
                    </div>

                    <Link
            to="/categories"
            className="flex items-center gap-2 px-6 py-3 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full font-semibold hover:bg-purple-50 dark:hover:bg-gray-700 hover:text-purple-600 dark:hover:text-purple-400 transition-all shadow-md hover:shadow-lg group">
            
                        <span>{language === 'vi' ? t("Common.tatCaDanhMuc") : 'All Categories'}</span>
                        <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>

                {/* Categories Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {parentCategories.map((category, index) =>
          <Link
            key={category.id}
            to={`/categories/${category.slug}`}
            className="group bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden hover-lift animate-fadeInUp"
            style={{ animationDelay: `${index * 0.05}s` }}>
            
                            {/* Image */}
                            <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/20 dark:to-pink-900/20">
                                {category.imageUrl ?
              <img
                src={category.imageUrl}
                alt={category.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" /> :


              <div className="w-full h-full flex items-center justify-center">
                                        <Layers className="w-12 h-12 text-purple-400 dark:text-purple-600" />
                                    </div>
              }
                                
                                {/* Overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                
                                {/* Book Count Badge */}
                                {category.bookCount !== undefined &&
              <span className="absolute top-3 right-3 px-3 py-1 bg-white/90 dark:bg-gray-800/90 text-gray-900 dark:text-white text-xs font-bold rounded-full shadow-lg backdrop-blur-sm">
                                        {category.bookCount} {language === 'vi' ? t("Common.sach") : 'books'}
                                    </span>
              }
                            </div>

                            {/* Content */}
                            <div className="p-4">
                                <h3 className="font-serif font-bold text-gray-900 dark:text-white text-lg group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors line-clamp-2 min-h-[3.5rem]">
                                    {category.name}
                                </h3>
                                {category.description &&
              <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mt-2">
                                        {category.description}
                                    </p>
              }
                            </div>
                        </Link>
          )}
                </div>
            </div>
        </section>);

};