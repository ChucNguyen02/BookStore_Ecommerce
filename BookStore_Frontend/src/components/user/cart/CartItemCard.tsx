import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Minus, Plus, Trash2, AlertCircle } from 'lucide-react';
import type { CartItemResponse } from '../../../types/cart.types';
import { useTranslation } from 'react-i18next';
// import toast from 'react-hot-toast';

interface CartItemCardProps {
    item: CartItemResponse;
    selected: boolean;
    onSelect: (cartItemId: string) => void;
    onUpdateQuantity: (cartItemId: string, quantity: number) => Promise<boolean>;
    onRemove: (cartItemId: string) => Promise<boolean>;
}

export const CartItemCard = ({
    item,
    selected,
    onSelect,
    onUpdateQuantity,
    onRemove,
}: CartItemCardProps) => {
    const { t, i18n } = useTranslation();
    const [quantity, setQuantity] = useState(item.quantity);
    const [isUpdating, setIsUpdating] = useState(false);
    const [isRemoving, setIsRemoving] = useState(false);

    const formatPrice = (price: number) =>
        new Intl.NumberFormat(i18n.language === 'vi' ? 'vi-VN' : 'en-US', {
            style: 'currency',
            currency: i18n.language === 'vi' ? 'VND' : 'USD',
        }).format(price);

    const effectivePrice = item.discountPrice || item.price;
    const hasDiscount = item.discountPrice && item.discountPrice < item.price;

    const handleQuantityChange = async (newQuantity: number) => {
        if (newQuantity < 1 || newQuantity > item.availableStock) return;
        if (newQuantity === quantity) return;

        const oldQuantity = quantity;
        setQuantity(newQuantity);
        setIsUpdating(true);

        try {
            const success = await onUpdateQuantity(item.id, newQuantity);
            if (!success) {
                setQuantity(oldQuantity);
            }
        } finally {
            setIsUpdating(false);
        }
    };

    const handleRemove = async () => {
        setIsRemoving(true);
        setTimeout(async () => {
            await onRemove(item.id);
        }, 300);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = parseInt(e.target.value) || 1;
        const validValue = Math.max(1, Math.min(val, item.availableStock));
        setQuantity(validValue);
    };

    const handleInputBlur = () => {
        if (quantity !== item.quantity) {
            handleQuantityChange(quantity);
        }
    };

    const isDisabled = isUpdating || isRemoving;

    return (
        <div
            className={`bg-white dark:bg-gray-800 rounded-xl p-4 shadow-md border-2 transition-all duration-300 ${selected
                    ? 'border-amber-400 dark:border-amber-600 ring-2 ring-amber-200 dark:ring-amber-800'
                    : !item.inStock
                        ? 'border-red-300 dark:border-red-700'
                        : 'border-gray-200 dark:border-gray-700'
                } ${isRemoving ? 'opacity-0 scale-95 pointer-events-none' : 'opacity-100 scale-100'}`}
        >
            <div className="flex gap-4">
                {/* Checkbox */}
                <div className="flex-shrink-0 flex items-start pt-1">
                    <input
                        type="checkbox"
                        checked={selected}
                        onChange={() => onSelect(item.id)}
                        disabled={!item.inStock || isDisabled}
                        className="w-5 h-5 rounded border-gray-300 text-amber-600 focus:ring-amber-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                </div>

                {/* Image */}
                <Link
                    to={`/books/${item.bookSlug}`}
                    className="flex-shrink-0 w-24 h-32 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700"
                >
                    <img
                        src={item.bookImage || '/placeholder-book.jpg'}
                        alt={item.bookTitle}
                        className="w-full h-full object-cover hover:scale-105 transition-transform"
                    />
                </Link>

                {/* Info */}
                <div className="flex-1 min-w-0">
                    {/* Title */}
                    <Link
                        to={`/books/${item.bookSlug}`}
                        className="font-semibold text-gray-900 dark:text-white hover:text-amber-600 dark:hover:text-amber-400 line-clamp-2 mb-2 block"
                    >
                        {item.bookTitle}
                    </Link>

                    {/* Price */}
                    <div className="flex items-center gap-2 mb-3">
                        <span className="text-lg font-bold text-amber-600 dark:text-amber-400">
                            {formatPrice(effectivePrice)}
                        </span>
                        {hasDiscount && (
                            <span className="text-sm text-gray-400 dark:text-gray-500 line-through">
                                {formatPrice(item.price)}
                            </span>
                        )}
                    </div>

                    {/* Stock Warning */}
                    {!item.inStock && (
                        <div className="flex items-center gap-2 text-red-600 dark:text-red-400 text-sm mb-2">
                            <AlertCircle className="w-4 h-4" />
                            <span>{t('cartItem.outOfStock')}</span>
                        </div>
                    )}

                    {item.inStock && item.availableStock < 5 && (
                        <div className="flex items-center gap-2 text-orange-600 dark:text-orange-400 text-sm mb-2">
                            <AlertCircle className="w-4 h-4" />
                            <span>{t('cartItem.lowStock', { count: item.availableStock })}</span>
                        </div>
                    )}

                    {/* Actions */}
                    <div className="flex items-center justify-between gap-4">
                        {/* Quantity Controls */}
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => handleQuantityChange(quantity - 1)}
                                disabled={isDisabled || !item.inStock || quantity <= 1}
                                className="w-8 h-8 flex items-center justify-center border-2 border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                <Minus className="w-4 h-4" />
                            </button>

                            <input
                                type="number"
                                value={quantity}
                                onChange={handleInputChange}
                                onBlur={handleInputBlur}
                                disabled={isDisabled || !item.inStock}
                                className="w-16 text-center border-2 border-gray-300 dark:border-gray-600 rounded-lg py-1 font-medium bg-white dark:bg-gray-800 text-gray-900 dark:text-white disabled:opacity-50"
                                min="1"
                                max={item.availableStock}
                            />

                            <button
                                onClick={() => handleQuantityChange(quantity + 1)}
                                disabled={isDisabled || !item.inStock || quantity >= item.availableStock}
                                className="w-8 h-8 flex items-center justify-center border-2 border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                <Plus className="w-4 h-4" />
                            </button>
                        </div>

                        {/* Subtotal & Remove */}
                        <div className="flex items-center gap-4">
                            <div className="text-right">
                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                    {t('cartItem.subtotal')}
                                </div>
                                <div className="text-lg font-bold text-gray-900 dark:text-white">
                                    {formatPrice(effectivePrice * quantity)}
                                </div>
                            </div>

                            <button
                                onClick={handleRemove}
                                disabled={isDisabled}
                                className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                title={t('cartItem.remove')}
                            >
                                <Trash2 className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};