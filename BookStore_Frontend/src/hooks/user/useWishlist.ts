import { useState, useCallback } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { wishlistService, cartService, authService } from '../../services';
import toast from 'react-hot-toast';
import { useAppContext } from '../../context/AppContext';
import { eventEmitter, EVENTS } from '../../utils/eventEmitter';

export const useWishlist = () => {
    const { language } = useAppContext();
    const queryClient = useQueryClient();
    const isAuthenticated = authService.isAuthenticated();

    const [currentPage, setCurrentPage] = useState(0);
    const [updating, setUpdating] = useState(false);

    const { data: wishlistData, isLoading: loading, error: queryError, refetch: fetchWishlist } = useQuery({
        queryKey: ['wishlist', currentPage],
        queryFn: () => wishlistService.getUserWishlist(currentPage, 20),
        enabled: isAuthenticated,
        staleTime: 5 * 60 * 1000,
    });

    const wishlist = wishlistData?.content || [];
    const totalPages = wishlistData?.totalPages || 0;
    const totalElements = wishlistData?.totalElements || 0;

    const error = queryError ? (queryError as Error).message : null;

    if (queryError) {
        console.error('Wishlist fetch error:', queryError);
    }

    const addToWishlist = async (bookId: string): Promise<boolean> => {
        try {
            setUpdating(true);
            const newItem = await wishlistService.addToWishlist(bookId);


            queryClient.invalidateQueries({ queryKey: ['wishlist'] });

            toast.success(language === 'vi' ? 'Đã thêm vào yêu thích' : 'Added to wishlist');


            eventEmitter.emit(EVENTS.WISHLIST_UPDATED);
            eventEmitter.emit(EVENTS.WISHLIST_ITEM_ADDED, { bookId });

            return true;
        } catch (err: unknown) {
            console.error('Add to wishlist error:', err);
            toast.error(err instanceof Error ? err.message : (language === 'vi' ? 'Không thể thêm vào wishlist' : 'Cannot add to wishlist'));
            return false;
        } finally {
            setUpdating(false);
        }
    };

    const removeFromWishlist = async (bookId: string): Promise<boolean> => {
        try {
            setUpdating(true);
            await wishlistService.removeFromWishlist(bookId);


            queryClient.invalidateQueries({ queryKey: ['wishlist'] });

            toast.success(language === 'vi' ? 'Đã xóa khỏi yêu thích' : 'Removed from wishlist');



            eventEmitter.emit(EVENTS.WISHLIST_UPDATED);
            eventEmitter.emit(EVENTS.WISHLIST_ITEM_REMOVED, { bookId });

            return true;
        } catch (err: unknown) {
            console.error('Remove from wishlist error:', err);
            toast.error(err instanceof Error ? err.message : (language === 'vi' ? 'Không thể xóa khỏi wishlist' : 'Cannot remove from wishlist'));
            return false;
        } finally {
            setUpdating(false);
        }
    };

    const isInWishlist = async (bookId: string): Promise<boolean> => {
        if (!authService.isAuthenticated()) {
            return false;
        }

        try {
            return await wishlistService.isInWishlist(bookId);
        } catch (err) {
            console.error('Check wishlist error:', err);
            return false;
        }
    };

    const clearWishlist = async (): Promise<boolean> => {
        try {
            setUpdating(true);
            await wishlistService.clearWishlist();
            queryClient.invalidateQueries({ queryKey: ['wishlist'] });
            toast.success(language === 'vi' ? 'Đã xóa toàn bộ wishlist' : 'Wishlist cleared');


            eventEmitter.emit(EVENTS.WISHLIST_UPDATED);

            return true;
        } catch (err: unknown) {
            console.error('Clear wishlist error:', err);
            toast.error(err instanceof Error ? err.message : (language === 'vi' ? 'Không thể xóa wishlist' : 'Cannot clear wishlist'));
            return false;
        } finally {
            setUpdating(false);
        }
    };

    const addToCart = async (bookId: string, quantity: number = 1): Promise<boolean> => {
        try {
            setUpdating(true);
            await cartService.addToCart({ bookId, quantity });
            toast.success(language === 'vi' ? 'Đã thêm vào giỏ hàng' : 'Added to cart');

            eventEmitter.emit(EVENTS.CART_UPDATED);

            return true;
        } catch (err: unknown) {
            console.error('Add to cart error:', err);
            toast.error(err instanceof Error ? err.message : (language === 'vi' ? 'Không thể thêm vào giỏ' : 'Cannot add to cart'));
            return false;
        } finally {
            setUpdating(false);
        }
    };

    const addToCartAndRemove = async (bookId: string, quantity: number = 1): Promise<boolean> => {
        try {
            setUpdating(true);
            await cartService.addToCart({ bookId, quantity });
            await wishlistService.removeFromWishlist(bookId);

            queryClient.invalidateQueries({ queryKey: ['wishlist'] });

            toast.success(language === 'vi' ? 'Đã chuyển vào giỏ hàng' : 'Moved to cart');

            eventEmitter.emit(EVENTS.CART_UPDATED);
            eventEmitter.emit(EVENTS.WISHLIST_UPDATED);

            return true;
        } catch (err: unknown) {
            console.error('Move to cart error:', err);
            toast.error(err instanceof Error ? err.message : (language === 'vi' ? 'Không thể chuyển vào giỏ' : 'Cannot move to cart'));
            return false;
        } finally {
            setUpdating(false);
        }
    };

    const loadMore = (page: number) => {
        setCurrentPage(page);
    };


    const refreshWishlist = useCallback(async () => {

        await fetchWishlist();
    }, [fetchWishlist]);

    return {
        wishlist,
        loading,
        error,
        updating,
        totalElements,
        totalPages,
        currentPage,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        clearWishlist,
        addToCart,
        addToCartAndRemove,
        loadMore,
        refresh: refreshWishlist,
        refreshWishlist,
    };
};