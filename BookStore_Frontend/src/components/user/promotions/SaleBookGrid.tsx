import { useTranslation } from 'react-i18next';import { useNavigate } from 'react-router-dom';
import { ShoppingCart, Eye } from 'lucide-react';
import type { BookResponse } from '../../../types/book.types';
import { formatCurrency } from '../../../utils/format';
import LoadingSpinner from '../../user/common/LoadingSpinner';

interface SaleBookGridProps {
  books: BookResponse[];
  isLoading: boolean;
  hasMore: boolean;
  onLoadMore: () => void;
}

export const SaleBookGrid: React.FC<SaleBookGridProps> = ({
  books,
  isLoading,
  hasMore,
  onLoadMore
}) => {const { t } = useTranslation();
  const navigate = useNavigate();

  if (books.length === 0 && !isLoading) {
    return (
      <div className="text-center py-12">
                <p className="text-gray-500 dark:text-gray-400">{t("Common.khongCoSanPhamKhuyen")}</p>
            </div>);

  }

  return (
    <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {books.map((book) =>
        <div
          key={book.id}
          className="group bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer"
          onClick={() => navigate(`/books/${book.slug}`)}>
          
                        {/* Image */}
                        <div className="relative aspect-[3/4] overflow-hidden bg-gray-100 dark:bg-gray-700">
                            <img
              src={book.coverImageUrl || '/placeholder-book.jpg'}
              alt={book.title}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
            

                            {/* Discount Badge */}
                            {book.discountPercentage &&
            <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-lg text-xs font-bold">
                                    -{book.discountPercentage}%
                                </div>
            }

                            {/* Quick Actions */}
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                <button className="p-2 bg-white text-gray-900 rounded-full hover:bg-amber-500 hover:text-white transition-colors">
                                    <Eye className="w-5 h-5" />
                                </button>
                                <button
                onClick={(e) => {
                  e.stopPropagation();
                  // Add to cart logic
                }}
                className="p-2 bg-white text-gray-900 rounded-full hover:bg-amber-500 hover:text-white transition-colors">
                
                                    <ShoppingCart className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        {/* Info */}
                        <div className="p-3 space-y-2">
                            <h3 className="font-medium text-sm text-gray-900 dark:text-white line-clamp-2 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                                {book.title}
                            </h3>

                            <div className="flex items-center gap-2">
                                <span className="text-lg font-bold text-red-600">
                                    {formatCurrency(book.discountPrice || book.price)}
                                </span>
                                {book.discountPrice &&
              <span className="text-xs text-gray-500 line-through">
                                        {formatCurrency(book.price)}
                                    </span>
              }
                            </div>

                            {book.stockQuantity > 0 ?
            <div className="text-xs text-green-600 dark:text-green-400">{t("Common.con")}
              {book.stockQuantity}{t("Common.sanPham")}
            </div> :

            <div className="text-xs text-red-600">{t("Common.hetHang")}</div>
            }
                        </div>
                    </div>
        )}
            </div>

            {/* Load More */}
            {hasMore &&
      <div className="flex justify-center">
                    <button
          onClick={onLoadMore}
          disabled={isLoading}
          className="px-8 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl font-medium hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all">
          
                        {isLoading ? <LoadingSpinner size="sm" /> : t("Common.xemThem")}
                    </button>
                </div>
      }
        </div>);

};