import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, ArrowLeft, Trash2 } from 'lucide-react';
import { CartItemCard } from '../../../components/user/cart/CartItemCard';
import { CartSummary } from '../../../components/user/cart/CartSummary';
import LoadingSpinner from '../../../components/user/common/LoadingSpinner';
import { useCart } from '../../../hooks/user/useCart';
import { useTranslation } from 'react-i18next';

const Cart = () => {
    const { t } = useTranslation();
    const {
        cart,
        loading,
        error,
        updateCartItem,
        removeFromCart,
        clearCart,
    } = useCart();

    const [isClearing, setIsClearing] = useState(false);
    const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());

    // Mặc định chọn tất cả items khi cart load
    useEffect(() => {
        if (cart?.items) {
            const inStockIds = cart.items
                .filter(item => item.inStock)
                .map(item => item.id);
            setSelectedItems(new Set(inStockIds));
        }
    }, [cart?.items]);

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
                        {t('Cart.continueShopping')}
                    </Link>
                </div>
            </div>
        );
    }

    if (!cart || !cart.items || cart.items.length === 0) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
                <div className="container mx-auto px-4 py-16">
                    <div className="text-center space-y-6">
                        <ShoppingCart className="w-24 h-24 text-gray-400 dark:text-gray-600 mx-auto" />
                        <h2 className="text-3xl font-serif font-bold text-gray-900 dark:text-white">
                            {t('Cart.empty.title')}
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
                            {t('Cart.empty.description')}
                        </p>
                        <Link
                            to="/books"
                            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-500 dark:from-amber-600 dark:to-orange-600 text-white rounded-xl font-bold text-lg hover:from-amber-600 hover:to-orange-600 dark:hover:from-amber-700 dark:hover:to-orange-700 transition-all shadow-md hover:shadow-lg"
                        >
                            <ShoppingCart className="w-6 h-6" />
                            {t('Cart.empty.startShopping')}
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    const handleClearCart = async () => {
        if (window.confirm(t('Cart.confirmClear'))) {
            setIsClearing(true);
            try {
                await clearCart();
            } finally {
                setIsClearing(false);
            }
        }
    };

    const handleSelectItem = (itemId: string) => {
        setSelectedItems(prev => {
            const newSet = new Set(prev);
            if (newSet.has(itemId)) {
                newSet.delete(itemId);
            } else {
                newSet.add(itemId);
            }
            return newSet;
        });
    };

    const handleSelectAll = () => {
        const inStockIds = cart.items
            .filter(item => item.inStock)
            .map(item => item.id);

        if (selectedItems.size === inStockIds.length) {
            setSelectedItems(new Set());
        } else {
            setSelectedItems(new Set(inStockIds));
        }
    };

    const selectedItemsData = cart.items.filter(item => selectedItems.has(item.id));
    const allInStockSelected = cart.items
        .filter(item => item.inStock)
        .every(item => selectedItems.has(item.id));

    return (
        <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
            <div className="container mx-auto px-4 py-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
                    <div>
                        <h1 className="text-4xl font-serif font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-3">
                            <ShoppingCart className="w-10 h-10 text-amber-600 dark:text-amber-400" />
                            {t('Cart.title')}
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400">
                            {t('Cart.header.items', { totalItems: cart.totalItems, itemCount: cart.items?.length || 0 })}
                        </p>
                    </div>

                    <div className="flex items-center gap-4">
                        <Link
                            to="/books"
                            className="flex items-center gap-2 px-6 py-3 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium"
                        >
                            <ArrowLeft className="w-5 h-5" />
                            <span className="hidden sm:inline">
                                {t('Cart.continueShopping')}
                            </span>
                        </Link>

                        <button
                            onClick={handleClearCart}
                            disabled={isClearing}
                            className="flex items-center gap-2 px-6 py-3 border-2 border-red-300 dark:border-red-700 text-red-600 dark:text-red-400 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isClearing ? (
                                <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                            ) : (
                                <Trash2 className="w-5 h-5" />
                            )}
                            <span className="hidden sm:inline">
                                {t('Cart.clearCart')}
                            </span>
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Cart Items */}
                    <div className="lg:col-span-2 space-y-4">
                        {/* Select All */}
                        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-md border-2 border-gray-200 dark:border-gray-700">
                            <label className="flex items-center gap-3 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={allInStockSelected && cart.items.some(i => i.inStock)}
                                    onChange={handleSelectAll}
                                    className="w-5 h-5 rounded border-gray-300 text-amber-600 focus:ring-amber-500"
                                />
                                <span className="font-semibold text-gray-900 dark:text-white">
                                    {t('Cart.selectAll')} ({selectedItems.size}/{cart.items.filter(i => i.inStock).length})
                                </span>
                            </label>
                        </div>

                        {cart.items.map((item) => (
                            <CartItemCard
                                key={item.id}
                                item={item}
                                selected={selectedItems.has(item.id)}
                                onSelect={handleSelectItem}
                                onUpdateQuantity={updateCartItem}
                                onRemove={removeFromCart}
                            />
                        ))}
                    </div>

                    {/* Summary */}
                    <div className="lg:col-span-1">
                        <CartSummary
                            cart={cart}
                            selectedItems={selectedItemsData}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;