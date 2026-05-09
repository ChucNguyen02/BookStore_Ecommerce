import { useCallback } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { cartService, authService } from '../../services';
import type { AddToCartRequest, UpdateCartItemRequest } from '../../types';
import toast from 'react-hot-toast';
import { useAppContext } from '../../context/AppContext';
import { eventEmitter, EVENTS } from '../../utils/eventEmitter';

export const useCart = () => {
    const { language } = useAppContext();
    const queryClient = useQueryClient();
    const isAuthenticated = authService.isAuthenticated();

    const { data: cartData, isLoading: loading, error: queryError, refetch: fetchCart } = useQuery({
        queryKey: ['cart'],
        queryFn: async () => {
            if (!isAuthenticated) return null;
            return await cartService.getCart();
        },
        enabled: isAuthenticated,
        staleTime: 2 * 60 * 1000,
    });

    const cart = cartData || null;
    const error = queryError ? (queryError as Error).message : null;

    if (queryError) {
        console.error('Cart fetch error:', queryError);
    }

    const addToCart = async (data: AddToCartRequest): Promise<boolean> => {
        try {
            await cartService.addToCart(data);
            queryClient.invalidateQueries({ queryKey: ['cart'] });
            toast.success(language === 'vi' ? 'Đã thêm vào giỏ hàng!' : 'Added to cart!');


            eventEmitter.emit(EVENTS.CART_UPDATED);
            eventEmitter.emit(EVENTS.CART_ITEM_ADDED, { bookId: data.bookId, quantity: data.quantity });

            return true;
        } catch (err: unknown) {
            console.error('Add to cart error:', err);
            toast.error(err instanceof Error ? err.message : (language === 'vi' ? 'Thêm vào giỏ hàng thất bại' : 'Failed to add to cart'));
            return false;
        }
    };

    const updateCartItem = async (cartItemId: string, quantity: number): Promise<boolean> => {
        if (!cart || !cart.items) return false;


        const originalCart = JSON.parse(JSON.stringify(cart));

        try {

            const updatedItems = cart.items.map(item => {
                if (item.id === cartItemId) {
                    const effectivePrice = item.discountPrice || item.price;
                    const newSubtotal = effectivePrice * quantity;
                    return { ...item, quantity, subtotal: newSubtotal };
                }
                return item;
            });


            const subtotal = updatedItems.reduce((sum, item) => sum + item.subtotal, 0);
            const totalItems = updatedItems.reduce((sum, item) => sum + item.quantity, 0);
            const estimatedShippingFee = subtotal >= 200000 ? 0 : 30000;
            const estimatedTotal = subtotal + estimatedShippingFee;


            const optimisticCart = {
                items: updatedItems,
                totalItems,
                subtotal,
                estimatedShippingFee,
                estimatedTotal,
            };
            queryClient.setQueryData(['cart'], optimisticCart);


            const data: UpdateCartItemRequest = { quantity };
            await cartService.updateCartItem(cartItemId, data);


            eventEmitter.emit(EVENTS.CART_UPDATED);

            return true;
        } catch (err: unknown) {
            console.error('Update cart error:', err);
            queryClient.setQueryData(['cart'], originalCart);
            const message = err instanceof Error ? err.message : (language === 'vi' ? 'Cập nhật thất bại' : 'Update failed');
            toast.error(message);
            return false;
        }
    };

    const removeFromCart = async (cartItemId: string): Promise<boolean> => {
        if (!cart || !cart.items) return false;


        const originalCart = JSON.parse(JSON.stringify(cart));

        try {

            const updatedItems = cart.items.filter(item => item.id !== cartItemId);


            if (updatedItems.length === 0) {

                queryClient.setQueryData(['cart'], {
                    items: [],
                    totalItems: 0,
                    subtotal: 0,
                    estimatedShippingFee: 0,
                    estimatedTotal: 0,
                });
            } else {
                const subtotal = updatedItems.reduce((sum, item) => sum + item.subtotal, 0);
                const totalItems = updatedItems.reduce((sum, item) => sum + item.quantity, 0);
                const estimatedShippingFee = subtotal >= 200000 ? 0 : 30000;
                const estimatedTotal = subtotal + estimatedShippingFee;

                queryClient.setQueryData(['cart'], {
                    items: updatedItems,
                    totalItems,
                    subtotal,
                    estimatedShippingFee,
                    estimatedTotal,
                });
            }


            await cartService.removeFromCart(cartItemId);
            toast.success(language === 'vi' ? 'Đã xóa khỏi giỏ hàng' : 'Removed from cart');


            eventEmitter.emit(EVENTS.CART_UPDATED);
            eventEmitter.emit(EVENTS.CART_ITEM_REMOVED, { cartItemId });

            return true;
        } catch (err: unknown) {
            console.error('Remove from cart error:', err);
            queryClient.setQueryData(['cart'], originalCart);
            const message = err instanceof Error ? err.message : (language === 'vi' ? 'Xóa thất bại' : 'Remove failed');
            toast.error(message);
            return false;
        }
    };

    const clearCart = async (): Promise<boolean> => {
        if (!cart || !cart.items) return false;

        const originalCart = JSON.parse(JSON.stringify(cart));

        try {

            queryClient.setQueryData(['cart'], {
                items: [],
                totalItems: 0,
                subtotal: 0,
                estimatedShippingFee: 0,
                estimatedTotal: 0,
            });


            await cartService.clearCart();
            toast.success(language === 'vi' ? 'Đã xóa toàn bộ giỏ hàng' : 'Cart cleared');


            eventEmitter.emit(EVENTS.CART_UPDATED);
            eventEmitter.emit(EVENTS.CART_CLEARED);

            return true;
        } catch (err: unknown) {
            console.error('Clear cart error:', err);
            
            queryClient.setQueryData(['cart'], originalCart);
            const message = err instanceof Error ? err.message : (language === 'vi' ? 'Xóa thất bại' : 'Clear failed');
            toast.error(message);
            return false;
        }
    };

    const isBookInCart = async (bookId: string): Promise<boolean> => {
        try {
            return await cartService.isBookInCart(bookId);
        } catch (err) {
            console.error('Check cart error:', err);
            return false;
        }
    };

    
    const refreshCart = useCallback(async () => {
        await fetchCart();
    }, [fetchCart]);

    return {
        cart,
        loading,
        error,
        addToCart,
        updateCartItem,
        removeFromCart,
        clearCart,
        isBookInCart,
        refreshCart,
    };
};