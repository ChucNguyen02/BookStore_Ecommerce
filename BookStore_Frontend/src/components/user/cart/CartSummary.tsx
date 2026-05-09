import { Link } from 'react-router-dom';
import { ShoppingBag, ArrowRight } from 'lucide-react';
import type { CartResponse, CartItemResponse } from '../../../types/cart.types';
import { useTranslation } from 'react-i18next';

interface CartSummaryProps {
  cart: CartResponse;
  selectedItems: CartItemResponse[];
}

export const CartSummary = ({ cart, selectedItems }: CartSummaryProps) => {
  const { t, i18n } = useTranslation();

  const formatPrice = (price: number) =>
    new Intl.NumberFormat(i18n.language === 'vi' ? 'vi-VN' : 'en-US', {
      style: 'currency',
      currency: i18n.language === 'vi' ? 'VND' : 'USD',
    }).format(price);

  // Tính toán cho items được chọn
  const selectedSubtotal = selectedItems.reduce((sum, item) => {
    const price = item.discountPrice || item.price;
    return sum + price * item.quantity;
  }, 0);

  const selectedQuantity = selectedItems.reduce((sum, item) => sum + item.quantity, 0);

  // Tính phí ship dựa trên items được chọn
  const selectedShippingFee = selectedSubtotal >= 200000 ? 0 : 30000;
  const selectedTotal = selectedSubtotal + selectedShippingFee;

  const hasOutOfStockItems = selectedItems.some((item) => !item.inStock);
  const noItemsSelected = selectedItems.length === 0;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border-2 border-gray-200 dark:border-gray-700 sticky top-24">
      <h3 className="text-xl font-serif font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
        <ShoppingBag className="w-6 h-6 text-amber-600 dark:text-amber-400" />
        {t('cartSummary.orderSummary')}
      </h3>

      <div className="space-y-4 mb-6">
        {/* Selected Items Info */}
        <div className="bg-amber-50 dark:bg-amber-900/20 rounded-lg p-3 border border-amber-200 dark:border-amber-800">
          <div className="text-sm text-amber-800 dark:text-amber-200 font-medium">
            {t('cartSummary.selectedItems', {
              count: selectedItems.length,
              quantity: selectedQuantity,
            })}
          </div>
        </div>

        {/* Items Count */}
        <div className="flex justify-between text-gray-600 dark:text-gray-400">
          <span>{t('cartSummary.quantity')}</span>
          <span className="font-semibold text-gray-900 dark:text-white">{selectedQuantity}</span>
        </div>

        {/* Subtotal */}
        <div className="flex justify-between text-gray-600 dark:text-gray-400">
          <span>{t('cartSummary.subtotal')}</span>
          <span className="font-semibold text-gray-900 dark:text-white">
            {formatPrice(selectedSubtotal)}
          </span>
        </div>

        {/* Shipping Fee */}
        <div className="flex justify-between text-gray-600 dark:text-gray-400">
          <span>{t('cartSummary.shipping')}</span>
          <span className="font-semibold text-gray-900 dark:text-white">
            {selectedShippingFee === 0 ? t('cartSummary.freeShipping') : formatPrice(selectedShippingFee)}
          </span>
        </div>

        {/* Divider */}
        <div className="border-t-2 border-gray-200 dark:border-gray-700 pt-4">
          <div className="flex justify-between items-center">
            <span className="text-lg font-semibold text-gray-900 dark:text-white">
              {t('cartSummary.total')}
            </span>
            <span className="text-2xl font-bold text-amber-600 dark:text-amber-400">
              {formatPrice(selectedTotal)}
            </span>
          </div>
        </div>
      </div>

      {/* Checkout Button */}
      {noItemsSelected ? (
        <div className="text-center text-sm text-gray-600 dark:text-gray-400 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
          {t('cartSummary.noItemsSelected')}
        </div>
      ) : hasOutOfStockItems ? (
        <div className="text-center text-sm text-red-600 dark:text-red-400 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
          {t('cartSummary.hasOutOfStock')}
        </div>
      ) : (
        <Link
          to="/checkout"
          state={{ selectedItems: selectedItems.map((item) => item.id) }}
          className="w-full py-4 bg-gradient-to-r from-amber-500 to-orange-500 dark:from-amber-600 dark:to-orange-600 text-white rounded-xl font-bold text-lg hover:from-amber-600 hover:to-orange-600 dark:hover:from-amber-700 dark:hover:to-orange-700 transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 group"
        >
          {t('cartSummary.proceedToCheckout')}
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </Link>
      )}

      {/* Free Shipping Progress */}
      {selectedShippingFee > 0 && selectedSubtotal > 0 && (
        <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <div className="text-xs text-blue-700 dark:text-blue-400 mb-2">
            {t('cartSummary.freeShippingProgress', {
              amount: formatPrice(200000 - selectedSubtotal),
            })}
          </div>
          <div className="w-full bg-blue-200 dark:bg-blue-900 rounded-full h-2">
            <div
              className="bg-blue-500 dark:bg-blue-400 h-2 rounded-full transition-all"
              style={{ width: `${Math.min((selectedSubtotal / 200000) * 100, 100)}%` }}
            />
          </div>
        </div>
      )}

      {/* Total Cart Info (For Reference) */}
      {selectedItems.length < cart.items.length && (
        <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg text-sm text-gray-600 dark:text-gray-400">
          <div className="flex justify-between">
            <span>{t('cartSummary.cartTotal')}:</span>
            <span className="font-medium">
              {formatPrice(cart.subtotal + cart.estimatedShippingFee)}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};