import { useState, useEffect, useCallback } from 'react';
import { orderService } from '../../services';
import { toast } from 'react-hot-toast';
import { type OrderDetailResponse } from '../../types';

export function useOrderDetail(orderCode: string | null) {
    const [orderDetail, setOrderDetail] = useState<OrderDetailResponse | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchOrderDetail = useCallback(async (code: string) => {
        try {
            setIsLoading(true);
            setError(null);
            const data = await orderService.getOrderDetail(code);
            setOrderDetail(data);
        } catch (err: any) {
            const message = err.message || 'Failed to load order details';
            setError(message);
            toast.error(message);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        if (orderCode) {
            fetchOrderDetail(orderCode);
        }
    }, [orderCode, fetchOrderDetail]);

    return {
        orderDetail,
        isLoading,
        error,
        refetch: () => orderCode && fetchOrderDetail(orderCode)
    };
}