import { Heart, Trash2, ShoppingBag, ChevronLeft, ChevronRight } from 'lucide-react';
import { WishlistItemCard } from '../../../components/user/wishlist/WishlistItemCard';
import LoadingSpinner from '../../../components/user/common/LoadingSpinner';
import { useWishlist } from '../../../hooks/user/useWishlist';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

const Wishlist = () => {
  const { t } = useTranslation();
  const {
    wishlist,
    loading,
    error,
    updating,
    totalElements,
    totalPages,
    currentPage,
    removeFromWishlist,
    clearWishlist,
    addToCart,
    addToCartAndRemove,
    loadMore,
  } = useWishlist();

  const prefix = 'Wishlist';

  const handleClearAll = async () => {
    if (window.confirm(t(`${prefix}.header.confirmClear`))) {
      await clearWishlist();
    }
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 0 && newPage < totalPages) {
      loadMore(newPage);
    }
  };

  const getPaginationNumbers = () => {
    const delta = 2;
    const range: number[] = [];

    for (
      let i = Math.max(0, currentPage - delta);
      i <= Math.min(totalPages - 1, currentPage + delta);
      i++
    ) {
      range.push(i);
    }

    return range;
  };

  if (loading) {
    return <LoadingSpinner fullScreen />;
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-xl text-red-600 dark:text-red-400">{error}</p>
          <Link
            to="/books"
            className="inline-block px-6 py-3 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors"
          >
            {t(`${prefix}.error.exploreBooks`)}
          </Link>
        </div>
      </div>
    );
  }

  if (wishlist.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center space-y-6">
            <Heart className="w-24 h-24 text-gray-400 dark:text-gray-600 mx-auto" />
            <h2 className="text-3xl font-serif font-bold text-gray-900 dark:text-white">
              {t(`${prefix}.empty.title`)}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
              {t(`${prefix}.empty.description`)}
            </p>
            <Link
              to="/books"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-500 dark:from-amber-600 dark:to-orange-600 text-white rounded-xl font-bold text-lg hover:from-amber-600 hover:to-orange-600 dark:hover:from-amber-700 dark:hover:to-orange-700 transition-all shadow-md hover:shadow-lg"
            >
              <ShoppingBag className="w-6 h-6" />
              {t(`${prefix}.empty.exploreNow`)}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
          <div>
            <h1 className="text-4xl font-serif font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-3">
              <Heart className="w-10 h-10 text-red-500 fill-red-500" />
              {t(`${prefix}.title`)}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {t(`${prefix}.header.itemsCount`, { count: totalElements })}
            </p>
          </div>

          <div className="flex items-center gap-4">
            <Link
              to="/books"
              className="flex items-center gap-2 px-6 py-3 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium"
            >
              <ShoppingBag className="w-5 h-5" />
              {t(`${prefix}.header.continueShopping`)}
            </Link>

            {wishlist.length > 0 && (
              <button
                onClick={handleClearAll}
                disabled={updating}
                className="flex items-center gap-2 px-6 py-3 border-2 border-red-300 dark:border-red-700 text-red-600 dark:text-red-400 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors font-medium disabled:opacity-50"
              >
                <Trash2 className="w-5 h-5" />
                {t(`${prefix}.header.clearAll`)}
              </button>
            )}
          </div>
        </div>

        {/* Wishlist Items */}
        <div className="space-y-4 mb-8">
          {wishlist.map((item) => (
            <WishlistItemCard
              key={item.id}
              item={item}
              updating={updating}
              onRemove={removeFromWishlist}
              onAddToCart={addToCart}
              onAddToCartAndRemove={addToCartAndRemove}
            />
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-8 flex items-center justify-center gap-2 flex-wrap">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 0}
              className="px-4 py-2 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-amber-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
            >
              <ChevronLeft className="w-5 h-5" />
              {t(`${prefix}.pagination.previous`)}
            </button>

            <div className="flex items-center gap-2">
              {getPaginationNumbers().map((pageNum) => (
                <button
                  key={pageNum}
                  onClick={() => handlePageChange(pageNum)}
                  className={`w-10 h-10 rounded-lg font-medium transition-colors ${
                    currentPage === pageNum
                      ? 'bg-amber-500 text-white'
                      : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-amber-50 dark:hover:bg-gray-700'
                  }`}
                >
                  {pageNum + 1}
                </button>
              ))}
            </div>

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage >= totalPages - 1}
              className="px-4 py-2 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-amber-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
            >
              {t(`${prefix}.pagination.next`)}
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;