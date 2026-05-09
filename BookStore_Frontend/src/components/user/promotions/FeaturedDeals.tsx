import { useTranslation } from 'react-i18next';import { useNavigate } from 'react-router-dom';
import { Star, ShoppingCart } from 'lucide-react';
import type { FeaturedDeal } from '../../../types/promotion.types';
import { formatCurrency } from '../../../utils/format';

interface FeaturedDealsProps {
  deals: FeaturedDeal[];
  isLoading: boolean;
}

export const FeaturedDeals: React.FC<FeaturedDealsProps> = ({ deals, isLoading }) => {const { t } = useTranslation();
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="space-y-4">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{t("Common.dealNoiBat")}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {[...Array(4)].map((_, i) =>
          <div key={i} className="h-80 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse" />
          )}
                </div>
            </div>);

  }

  if (deals.length === 0) return null;

  return (
    <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Star className="w-6 h-6 text-amber-600 fill-amber-600" />
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{t("Common.dealNoiBat")}</h2>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {deals.map((deal) =>
        <div
          key={deal.id}
          onClick={() => navigate(`/books/${deal.slug}`)}
          className="group bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all cursor-pointer">
          
                        {/* Image */}
                        <div className="relative aspect-[3/4] overflow-hidden bg-gray-100 dark:bg-gray-700">
                            <img
              src={deal.imageUrl || '/placeholder-book.jpg'}
              alt={deal.title}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
            

                            {/* Badge */}
                            {deal.badge &&
            <div className="absolute top-2 left-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                                    {deal.badge}
                                </div>
            }

                            {/* Discount */}
                            <div className="absolute top-2 right-2 bg-red-500 text-white px-3 py-1 rounded-lg text-sm font-bold">
                                -{deal.discountPercentage}%
                            </div>

                            {/* Add to Cart */}
                            <button
              onClick={(e) => {
                e.stopPropagation();
                // Add to cart logic
              }}
              className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 bg-amber-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2 hover:bg-amber-600">
              
                                <ShoppingCart className="w-4 h-4" />
                                <span className="text-sm font-medium">{t("Common.themVaoGio")}</span>
                            </button>
                        </div>

                        {/* Info */}
                        <div className="p-4 space-y-2">
                            <h3 className="font-medium text-gray-900 dark:text-white line-clamp-2 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                                {deal.title}
                            </h3>

                            <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                    <span className="text-xl font-bold text-red-600">
                                        {formatCurrency(deal.discountPrice)}
                                    </span>
                                    <span className="text-sm text-gray-500 line-through">
                                        {formatCurrency(deal.originalPrice)}
                                    </span>
                                </div>

                                <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                                    <span>{t("Common.daBan")}{deal.soldCount}</span>
                                    <span>{t("Common.con")}{deal.stockQuantity}</span>
                                </div>
                            </div>
                        </div>
                    </div>
        )}
            </div>
        </div>);

};