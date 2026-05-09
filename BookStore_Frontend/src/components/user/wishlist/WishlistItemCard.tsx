import { useTranslation } from 'react-i18next';import { Link } from 'react-router-dom';
import { X, ShoppingCart, Eye, AlertCircle } from 'lucide-react';
import type { WishlistResponse } from '../../../types/wishlist.types';
import { useAppContext } from '../../../context/AppContext';

interface WishlistItemCardProps {
  item: WishlistResponse;
  updating: boolean;
  onRemove: (bookId: string) => Promise<boolean>;
  onAddToCart: (bookId: string) => Promise<boolean>;
  onAddToCartAndRemove: (bookId: string) => Promise<boolean>;
}

export const WishlistItemCard = ({
  item,
  updating,
  onRemove,
  onAddToCart,
  onAddToCartAndRemove
}: WishlistItemCardProps) => {const { t } = useTranslation();
  const { language } = useAppContext();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat(language === 'vi' ? 'vi-VN' : 'en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  };

  const hasDiscount = item.discountPrice && item.discountPrice < item.price;
  const effectivePrice = item.discountPrice || item.price;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg hover:shadow-xl transition-all border border-gray-200 dark:border-gray-700 relative group">
            {/* Remove Button */}
            <button
        onClick={() => onRemove(item.bookId)}
        disabled={updating}
        className="absolute top-2 right-2 p-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-full hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors opacity-0 group-hover:opacity-100 disabled:opacity-50 z-10"
        title={language === 'vi' ? t("Common.xoaKhoiYeuThich") : 'Remove from wishlist'}>
        
                <X className="w-4 h-4" />
            </button>

            <div className="flex gap-4">
                {/* Image */}
                <Link to={`/books/${item.bookSlug}`} className="flex-shrink-0">
                    <div className="w-24 h-32 bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden">
                        {item.bookImage ?
            <img
              src={item.bookImage}
              alt={item.bookTitle}
              className="w-full h-full object-cover hover:scale-105 transition-transform" /> :


            <div className="w-full h-full flex items-center justify-center">
                                <Eye className="w-8 h-8 text-gray-400 dark:text-gray-500" />
                            </div>
            }
                    </div>
                </Link>

                {/* Info */}
                <div className="flex-1 min-w-0">
                    <Link
            to={`/books/${item.bookSlug}`}
            className="text-lg font-semibold text-gray-900 dark:text-white hover:text-amber-600 dark:hover:text-amber-400 transition-colors line-clamp-2 mb-2">
            
                        {item.bookTitle}
                    </Link>

                    {/* Price */}
                    <div className="flex items-center gap-2 mb-2">
                        <span className="text-xl font-bold text-amber-600 dark:text-amber-400">
                            {formatPrice(effectivePrice)}
                        </span>
                        {hasDiscount &&
            <span className="text-sm text-gray-400 dark:text-gray-500 line-through">
                                {formatPrice(item.price)}
                            </span>
            }
                    </div>

                    {/* Stock Status */}
                    <div className="mb-3">
                        {item.inStock ?
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-400 text-xs font-semibold rounded-full">
                                {language === 'vi' ? t("Common.conHang") : 'In Stock'}
                            </span> :

            <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-400 text-xs font-semibold rounded-full">
                                <AlertCircle className="w-3 h-3" />
                                {language === 'vi' ? t("Common.hetHang") : 'Out of Stock'}
                            </span>
            }
                    </div>

                    {/* Added Date */}
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
                        {language === 'vi' ? t("Common.daThem") : 'Added: '}{formatDate(item.addedAt)}
                    </p>

                    {/* Actions */}
                    <div className="flex flex-wrap gap-2">
                        <button
              onClick={() => onAddToCart(item.bookId)}
              disabled={updating || !item.inStock}
              className="flex items-center gap-2 px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium">
              
                            <ShoppingCart className="w-4 h-4" />
                            {language === 'vi' ? t("Common.themVaoGio") : 'Add to Cart'}
                        </button>

                        <button
              onClick={() => onAddToCartAndRemove(item.bookId)}
              disabled={updating || !item.inStock}
              className="px-4 py-2 border-2 border-amber-500 text-amber-600 dark:text-amber-400 rounded-lg hover:bg-amber-50 dark:hover:bg-amber-900/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium">
              
                            {language === 'vi' ? 'Mua ngay' : 'Buy Now'}
                        </button>
                    </div>
                </div>
            </div>
        </div>);

};