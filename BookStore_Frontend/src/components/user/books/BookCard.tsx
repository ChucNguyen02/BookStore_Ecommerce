import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Heart, Star, TrendingUp, Sparkles, Tag } from 'lucide-react';
import type { BookResponse } from '../../../types/book.types';
import { useCartWishlist } from '../../../context/CartWishlistProvider';
import { useAuth } from '../../../hooks/user/useAuth';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';

interface BookCardProps {
  book: BookResponse;
  viewMode?: 'grid' | 'list';
}

export const BookCard = ({ book, viewMode = 'grid' }: BookCardProps) => {
  const { t, i18n } = useTranslation();
  const { isAuthenticated } = useAuth();
  const {
    addToCart,
    addToWishlist,
    removeFromWishlist,
    isInWishlist: checkInWishlist,
    isCartLoading,
    isWishlistLoading,
  } = useCartWishlist();

  const [isInWish, setIsInWish] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      setIsInWish(checkInWishlist(book.id));
    }
  }, [book.id, checkInWishlist, isAuthenticated]);

  const isThisCartLoading = isCartLoading(book.id);
  const isThisWishlistLoading = isWishlistLoading(book.id);

  const formatPrice = (price: number) =>
    new Intl.NumberFormat(i18n.language === 'vi' ? 'vi-VN' : 'en-US', {
      style: 'currency',
      currency: i18n.language === 'vi' ? 'VND' : 'USD',
    }).format(price);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat(i18n.language, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date);
  };

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      toast.error(t('bookCard.pleaseLoginToAddCart'));
      window.location.href = '/login';
      return;
    }

    if (!book.inStock) {
      toast.error(t('bookCard.outOfStock'));
      return;
    }

    await addToCart({ bookId: book.id, quantity: 1 });
  };

  const handleToggleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      toast.error(t('bookCard.pleaseLoginToWishlist'));
      window.location.href = '/login';
      return;
    }

    if (isInWish) {
      const success = await removeFromWishlist(book.id);
      if (success) {
        setIsInWish(false);
        toast.success(t('bookCard.removedFromWishlist'));
      }
    } else {
      const success = await addToWishlist(book.id);
      if (success) {
        setIsInWish(true);
        toast.success(t('bookCard.addedToWishlist'));
      }
    }
  };

  const effectivePrice = book.discountPrice || book.price;
  const hasDiscount = book.discountPrice && book.discountPrice < book.price;

  if (viewMode === 'list') {
    return (
      <div className="group bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden hover-lift flex">
        <div className="relative w-48 flex-shrink-0 overflow-hidden bg-gray-100 dark:bg-gray-700">
          <Link to={`/books/${book.slug}`}>
            <img
              src={book.coverImageUrl || '/placeholder-book.jpg'}
              alt={book.title}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
          </Link>

          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {hasDiscount && (
              <span className="px-3 py-1 bg-red-500 text-white text-xs font-bold rounded-full shadow-lg flex items-center gap-1">
                <Tag className="w-3 h-3" />-{book.discountPercentage}%
              </span>
            )}
            {book.isFeatured && (
              <span className="px-3 py-1 bg-amber-500 text-white text-xs font-bold rounded-full shadow-lg flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                {t('bookCard.featured')}
              </span>
            )}
            {book.isOnSale && (
              <span className="px-3 py-1 bg-green-500 text-white text-xs font-bold rounded-full shadow-lg">
                {t('bookCard.onSale')}
              </span>
            )}
          </div>

          {!book.inStock && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <span className="px-4 py-2 bg-gray-900 text-white text-sm font-bold rounded-lg">
                {t('bookCard.outOfStock')}
              </span>
            </div>
          )}
        </div>

        <div className="flex-1 p-6 flex flex-col">
          <Link
            to={`/categories/${book.categorySlug}`}
            className="text-xs text-amber-600 dark:text-amber-400 font-semibold hover:underline mb-2"
          >
            {book.categoryName}
          </Link>

          <Link to={`/books/${book.slug}`}>
            <h3 className="font-serif font-bold text-xl text-gray-900 dark:text-white hover:text-amber-600 dark:hover:text-amber-400 transition-colors mb-2 line-clamp-2">
              {book.title}
            </h3>
          </Link>

          {book.isbn && (
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
              {t('bookCard.isbn')}: {book.isbn}
            </p>
          )}

          <div className="mb-3">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {t('bookCard.author')}: <span className="text-gray-900 dark:text-white font-medium">{book.authors.map(a => a.name).join(', ')}</span>
            </p>
          </div>

          <div className="flex items-center gap-4 mb-3 flex-wrap">
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              <span className="text-sm font-semibold text-gray-900 dark:text-white">{book.averageRating.toFixed(1)}</span>
              <span className="text-xs text-gray-500 dark:text-gray-400">({book.reviewCount})</span>
            </div>

            <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
              <TrendingUp className="w-4 h-4" />
              <span>{book.soldCount} {t('bookCard.sold')}</span>
            </div>

            <div className="text-sm text-gray-600 dark:text-gray-400">
              {t('bookCard.stock')}: <span className={book.inStock ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}>{book.stockQuantity}</span>
            </div>
          </div>

          <p className="text-xs text-gray-500 dark:text-gray-400 mb-auto">
            {t('bookCard.added')}: {formatDate(book.createdAt)}
          </p>

          <div className="flex items-center justify-between pt-4 mt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-amber-600 dark:text-amber-400">{formatPrice(effectivePrice)}</span>
              {hasDiscount && (
                <span className="text-sm text-gray-400 dark:text-gray-500 line-through">{formatPrice(book.price)}</span>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleToggleWishlist}
                disabled={isThisWishlistLoading}
                className={`p-2 rounded-lg transition-all ${
                  isInWish
                    ? 'bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-amber-500 dark:hover:bg-amber-600 hover:text-white'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {isThisWishlistLoading ? (
                  <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Heart className={`w-5 h-5 ${isInWish ? 'fill-current' : ''}`} />
                )}
              </button>

              <button
                onClick={handleAddToCart}
                disabled={!book.inStock || isThisCartLoading}
                className="px-6 py-2 bg-gradient-to-r from-amber-500 to-orange-500 dark:from-amber-600 dark:to-orange-600 text-white rounded-lg font-semibold hover:from-amber-600 hover:to-orange-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg flex items-center gap-2"
              >
                {isThisCartLoading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <ShoppingCart className="w-5 h-5" />
                )}
                {isThisCartLoading ? '...' : t('bookCard.add')}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Grid view
  return (
    <div className="group bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden hover-lift">
      <div className="relative aspect-[3/4] overflow-hidden bg-gray-100 dark:bg-gray-700">
        <Link to={`/books/${book.slug}`}>
          <img
            src={book.coverImageUrl || '/placeholder-book.jpg'}
            alt={book.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
        </Link>

        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {hasDiscount && (
            <span className="px-3 py-1 bg-red-500 text-white text-xs font-bold rounded-full shadow-lg flex items-center gap-1">
              <Tag className="w-3 h-3" />-{book.discountPercentage}%
            </span>
          )}
          {book.isFeatured && (
            <span className="px-3 py-1 bg-amber-500 text-white text-xs font-bold rounded-full shadow-lg flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              {t('bookCard.featured')}
            </span>
          )}
          {book.isOnSale && (
            <span className="px-3 py-1 bg-green-500 text-white text-xs font-bold rounded-full shadow-lg">
              {t('bookCard.onSale')}
            </span>
          )}
        </div>

        <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
          <button
            onClick={handleToggleWishlist}
            disabled={isThisWishlistLoading}
            className={`p-2 rounded-full shadow-lg transition-all ${
              isInWish
                ? 'bg-red-500 text-white'
                : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-amber-500 hover:text-white'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {isThisWishlistLoading ? (
              <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
            ) : (
              <Heart className={`w-5 h-5 ${isInWish ? 'fill-current' : ''}`} />
            )}
          </button>

          <button
            onClick={handleAddToCart}
            disabled={!book.inStock || isThisCartLoading}
            className="p-2 bg-white dark:bg-gray-800 rounded-full shadow-lg hover:bg-amber-500 hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isThisCartLoading ? (
              <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
            ) : (
              <ShoppingCart className="w-5 h-5" />
            )}
          </button>
        </div>

        {!book.inStock && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="px-4 py-2 bg-gray-900 text-white text-sm font-bold rounded-lg">
              {t('bookCard.outOfStock')}
            </span>
          </div>
        )}
      </div>

      <div className="p-4 space-y-3">
        <Link
          to={`/categories/${book.categorySlug}`}
          className="text-xs text-amber-600 dark:text-amber-400 font-semibold hover:underline"
        >
          {book.categoryName}
        </Link>

        <Link to={`/books/${book.slug}`}>
          <h3 className="font-serif font-bold text-gray-900 dark:text-white line-clamp-2 hover:text-amber-600 dark:hover:text-amber-400 transition-colors min-h-[3rem]">
            {book.title}
          </h3>
        </Link>

        {book.isbn && (
          <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
            {t('bookCard.isbn')}: {book.isbn}
          </p>
        )}

        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-1">
          {book.authors.map(a => a.name).join(', ')}
        </p>

        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
            <span className="font-semibold text-gray-900 dark:text-white">{book.averageRating.toFixed(1)}</span>
            <span className="text-xs text-gray-500 dark:text-gray-400">({book.reviewCount})</span>
          </div>
          <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
            <TrendingUp className="w-4 h-4" />
            <span className="text-xs">{book.soldCount}</span>
          </div>
        </div>

        <div className="text-xs text-gray-500 dark:text-gray-400">
          {t('bookCard.stock')}: <span className={book.inStock ? 'text-green-600 dark:text-green-400 font-medium' : 'text-red-600 dark:text-red-400 font-medium'}>{book.stockQuantity}</span>
        </div>

        <div className="flex items-center gap-2 pt-2 border-t border-gray-200 dark:border-gray-700">
          <span className="text-xl font-bold text-amber-600 dark:text-amber-400">{formatPrice(effectivePrice)}</span>
          {hasDiscount && (
            <span className="text-sm text-gray-400 dark:text-gray-500 line-through">{formatPrice(book.price)}</span>
          )}
        </div>

        <button
          onClick={handleAddToCart}
          disabled={!book.inStock || isThisCartLoading}
          className="w-full py-3 bg-gradient-to-r from-amber-500 to-orange-500 dark:from-amber-600 dark:to-orange-600 text-white rounded-lg font-semibold hover:from-amber-600 hover:to-orange-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg flex items-center justify-center gap-2"
        >
          {isThisCartLoading ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              {t('bookCard.processing')}
            </>
          ) : (
            <>
              <ShoppingCart className="w-5 h-5" />
              {book.inStock ? t('bookCard.addToCart') : t('bookCard.outOfStockShort')}
            </>
          )}
        </button>

        <p className="text-xs text-gray-400 dark:text-gray-500 text-center">{formatDate(book.createdAt)}</p>
      </div>
    </div>
  );
};