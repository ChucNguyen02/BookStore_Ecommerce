import { useState, useEffect } from 'react';
import { Package, Truck, Tag, Star, TrendingUp, ShoppingBag } from 'lucide-react';
import type { CartResponse, CartItemResponse } from '../../../types/cart.types';
import type { VoucherResponse } from '../../../types/voucher.types';
import { usePoints } from '../../../hooks/user/usePoints';
import { useTranslation } from 'react-i18next';

interface CheckoutSummaryProps {
  cart: CartResponse;
  selectedItems: CartItemResponse[];
  appliedVoucher: VoucherResponse | null;
  pointsToUse: number;
  onPointsChange: (points: number) => void;
}

export const CheckoutSummary = ({
  cart,
  selectedItems,
  appliedVoucher,
  pointsToUse,
  onPointsChange,
}: CheckoutSummaryProps) => {
  const { t, i18n } = useTranslation();
  const { points } = usePoints();

  const [maxPointsToUse, setMaxPointsToUse] = useState(0);

  const userPoints = points?.totalPoints || 0;

  // Tính toán cho selected items
  const selectedSubtotal = selectedItems.reduce((sum, item) => {
    const price = item.discountPrice || item.price;
    return sum + price * item.quantity;
  }, 0);

  const selectedQuantity = selectedItems.reduce((sum, item) => sum + item.quantity, 0);
  const selectedShippingFee = selectedSubtotal >= 200000 ? 0 : 30000;

  useEffect(() => {
    if (userPoints > 0) {
      // Max points: 50% of subtotal, converted at rate 10 points = 100 VND
      const maxFromOrder = Math.floor((selectedSubtotal * 0.5) / 100) * 10;
      const maxAvailable = Math.floor(userPoints / 10) * 10;
      setMaxPointsToUse(Math.min(maxFromOrder, maxAvailable));
    } else {
      setMaxPointsToUse(0);
    }
  }, [selectedSubtotal, userPoints]);

  const formatPrice = (price: number) =>
    new Intl.NumberFormat(i18n.language === 'vi' ? 'vi-VN' : 'en-US', {
      style: 'currency',
      currency: i18n.language === 'vi' ? 'VND' : 'USD',
    }).format(price);

  // Calculate discounts
  const voucherDiscount = appliedVoucher
    ? appliedVoucher.discountType === 'PERCENTAGE'
      ? Math.min((selectedSubtotal * appliedVoucher.discountValue) / 100, appliedVoucher.maxDiscountAmount || Infinity)
      : appliedVoucher.discountValue
    : 0;

  const pointsDiscount = (pointsToUse / 10) * 100;
  const totalDiscount = voucherDiscount + pointsDiscount;
  const totalAmount = Math.max(0, selectedSubtotal + selectedShippingFee - totalDiscount);

  // Calculate points to earn (1% of final amount)
  const pointsToEarn = Math.floor(totalAmount * 0.01);

  const handlePointsInput = (value: string) => {
    const points = parseInt(value) || 0;
    const validPoints = Math.min(Math.max(0, points), maxPointsToUse);
    // Round to nearest 10
    const roundedPoints = Math.floor(validPoints / 10) * 10;
    onPointsChange(roundedPoints);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border-2 border-gray-200 dark:border-gray-700">
      <h3 className="text-xl font-serif font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
        <Package className="w-6 h-6 text-green-600 dark:text-green-400" />
        {t('checkoutSummary.orderSummary')}
      </h3>

      <div className="space-y-4 mb-6">
        {/* Selected Items Info */}
        <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-3 border border-green-200 dark:border-green-800">
          <div className="flex items-center gap-2 text-sm text-green-800 dark:text-green-200">
            <ShoppingBag className="w-4 h-4" />
            <span className="font-medium">
              {t('checkoutSummary.selectedItems', {
                count: selectedItems.length,
              })}
            </span>
          </div>
        </div>

        {/* Items Count */}
        <div className="flex justify-between text-gray-600 dark:text-gray-400">
          <span>{t('checkoutSummary.quantity')}</span>
          <span className="font-semibold text-gray-900 dark:text-white">{selectedQuantity}</span>
        </div>

        {/* Subtotal */}
        <div className="flex justify-between text-gray-600 dark:text-gray-400">
          <span>{t('checkoutSummary.subtotal')}</span>
          <span className="font-semibold text-gray-900 dark:text-white">{formatPrice(selectedSubtotal)}</span>
        </div>

        {/* Shipping Fee */}
        <div className="flex justify-between text-gray-600 dark:text-gray-400">
          <div className="flex items-center gap-1">
            <Truck className="w-4 h-4" />
            <span>{t('checkoutSummary.shipping')}</span>
          </div>
          <span className="font-semibold text-gray-900 dark:text-white">
            {selectedShippingFee === 0 ? t('checkoutSummary.freeShipping') : formatPrice(selectedShippingFee)}
          </span>
        </div>

        {/* Voucher Discount */}
        {voucherDiscount > 0 && (
          <div className="flex justify-between text-green-600 dark:text-green-400">
            <div className="flex items-center gap-1">
              <Tag className="w-4 h-4" />
              <span>{t('checkoutSummary.voucherDiscount')}</span>
            </div>
            <span className="font-semibold">-{formatPrice(voucherDiscount)}</span>
          </div>
        )}

        {/* Points Usage */}
        {maxPointsToUse > 0 && (
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-1">
              <Star className="w-4 h-4 text-amber-500" />
              {t('checkoutSummary.usePoints')}
            </label>
            <div className="flex gap-2">
              <input
                type="number"
                value={pointsToUse || ''}
                onChange={(e) => handlePointsInput(e.target.value)}
                placeholder="0"
                min="0"
                max={maxPointsToUse}
                step="10"
                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-amber-500 dark:focus:ring-amber-400 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              />
              <button
                onClick={() => onPointsChange(maxPointsToUse)}
                className="px-4 py-2 bg-amber-500 dark:bg-amber-600 text-white rounded-lg hover:bg-amber-600 dark:hover:bg-amber-700 transition-colors text-sm font-medium"
              >
                {t('checkoutSummary.max')}
              </button>
            </div>
            <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
              <span>{t('checkoutSummary.available')}: {userPoints}</span>
              <span>{t('checkoutSummary.max')}: {maxPointsToUse}</span>
            </div>
            {pointsDiscount > 0 && (
              <div className="flex justify-between text-green-600 dark:text-green-400 text-sm">
                <span>{t('checkoutSummary.pointsDiscount')}</span>
                <span className="font-semibold">-{formatPrice(pointsDiscount)}</span>
              </div>
            )}
          </div>
        )}

        {/* Divider */}
        <div className="border-t-2 border-gray-200 dark:border-gray-700 pt-4">
          <div className="flex justify-between items-center">
            <span className="text-lg font-semibold text-gray-900 dark:text-white">
              {t('checkoutSummary.total')}
            </span>
            <span className="text-2xl font-bold text-green-600 dark:text-green-400">
              {formatPrice(totalAmount)}
            </span>
          </div>
        </div>

        {/* Points to Earn */}
        {pointsToEarn > 0 && (
          <div className="p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400">
                <TrendingUp className="w-4 h-4" />
                <span className="font-medium">{t('checkoutSummary.pointsToEarn')}</span>
              </div>
              <span className="font-bold text-amber-700 dark:text-amber-400">
                +{pointsToEarn}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Free Shipping Progress */}
      {selectedShippingFee > 0 && (
        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <div className="text-xs text-blue-700 dark:text-blue-400 mb-2">
            {t('checkoutSummary.freeShippingProgress', {
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

      {/* Info: Items not selected */}
      {selectedItems.length < cart.items.length && (
        <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
          <p className="text-xs text-gray-600 dark:text-gray-400 text-center">
            💡 {t('checkoutSummary.remainingItems', { count: cart.items.length - selectedItems.length })}
          </p>
        </div>
      )}
    </div>
  );
};