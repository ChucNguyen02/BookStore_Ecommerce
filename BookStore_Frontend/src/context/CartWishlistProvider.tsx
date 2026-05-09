import { createContext, useContext, ReactNode, useState, useCallback } from 'react';
import { useCart as useCartHook } from '../hooks/user/useCart';
import { useWishlist as useWishlistHook } from '../hooks/user/useWishlist';
import type { AddToCartRequest } from '../types/cart.types';

interface CartWishlistContextType {
    cartLoadingItems: Set<string>;
    wishlistLoadingItems: Set<string>;
    addToCart: (data: AddToCartRequest) => Promise<boolean>;
    addToWishlist: (bookId: string) => Promise<boolean>;
    removeFromWishlist: (bookId: string) => Promise<boolean>;
    isInWishlist: (bookId: string) => boolean;
    isCartLoading: (bookId: string) => boolean;
    isWishlistLoading: (bookId: string) => boolean;
}

const CartWishlistContext = createContext<CartWishlistContextType | null>(null);

export const CartWishlistProvider = ({ children }: { children: ReactNode }) => {
    const cart = useCartHook();
    const wishlist = useWishlistHook();

    const [cartLoadingItems, setCartLoadingItems] = useState<Set<string>>(new Set());
    const [wishlistLoadingItems, setWishlistLoadingItems] = useState<Set<string>>(new Set());

    const isInWishlist = useCallback((bookId: string): boolean => {
        return wishlist.wishlist.some(item => item.bookId === bookId);
    }, [wishlist.wishlist]);

    const isCartLoading = useCallback((bookId: string) => {
        return cartLoadingItems.has(bookId);
    }, [cartLoadingItems]);

    const isWishlistLoading = useCallback((bookId: string) => {
        return wishlistLoadingItems.has(bookId);
    }, [wishlistLoadingItems]);

    const addToCart = useCallback(async (data: AddToCartRequest): Promise<boolean> => {
        const bookId = data.bookId;
        setCartLoadingItems(prev => new Set(prev).add(bookId));

        try {
            // ✅ Event được emit trong useCart hook rồi, không cần emit lại
            const success = await cart.addToCart(data);
            return success;
        } finally {
            setCartLoadingItems(prev => {
                const newSet = new Set(prev);
                newSet.delete(bookId);
                return newSet;
            });
        }
    }, [cart]);

    const addToWishlist = useCallback(async (bookId: string): Promise<boolean> => {
        setWishlistLoadingItems(prev => new Set(prev).add(bookId));

        try {
            // ✅ Event được emit trong useWishlist hook rồi
            const success = await wishlist.addToWishlist(bookId);
            return success;
        } finally {
            setWishlistLoadingItems(prev => {
                const newSet = new Set(prev);
                newSet.delete(bookId);
                return newSet;
            });
        }
    }, [wishlist]);

    const removeFromWishlist = useCallback(async (bookId: string): Promise<boolean> => {
        setWishlistLoadingItems(prev => new Set(prev).add(bookId));

        try {
            // ✅ Event được emit trong useWishlist hook rồi
            const success = await wishlist.removeFromWishlist(bookId);
            return success;
        } finally {
            setWishlistLoadingItems(prev => {
                const newSet = new Set(prev);
                newSet.delete(bookId);
                return newSet;
            });
        }
    }, [wishlist]);

    const value: CartWishlistContextType = {
        cartLoadingItems,
        wishlistLoadingItems,
        addToCart,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        isCartLoading,
        isWishlistLoading,
    };

    return (
        <CartWishlistContext.Provider value={value}>
            {children}
        </CartWishlistContext.Provider>
    );
};

export const useCartWishlist = () => {
    const context = useContext(CartWishlistContext);
    if (!context) {
        throw new Error('useCartWishlist must be used within CartWishlistProvider');
    }
    return context;
};