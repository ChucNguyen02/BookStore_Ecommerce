import { useState, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { orderService } from '../../services';
import toast from 'react-hot-toast';
import { useAppContext } from '../../context/AppContext';
import type { OrderResponse, } from '../../types';
import { OrderStatus } from '../../types';
import type { PageResponse } from '../../types';

export const useOrders = () => {
    const { language } = useAppContext();
    const [currentPage, setCurrentPage] = useState(0);
    const [currentStatus, setCurrentStatus] = useState<OrderStatus | 'ALL'>('ALL');
    const { data: orderData, isLoading: loading, error: queryError, refetch: refreshOrders } = useQuery({
        queryKey: ['orders', currentPage, currentStatus],
        queryFn: async () => {
            if (currentStatus === 'ALL') {
                return await orderService.getUserOrders(currentPage, 10);
            } else {
                return await orderService.getUserOrdersByStatus(currentStatus, currentPage, 10);
            }
        },
        staleTime: 2 * 60 * 1000,
    });

    const orders = orderData?.content || [];
    const totalPages = orderData?.totalPages || 0;
    const totalElements = orderData?.totalElements || 0;
    const error = queryError ? (queryError as Error).message : null;

    if (queryError) {
        const errorMsg = (queryError as Error).message || (language === 'vi' ? 'Không thể tải đơn hàng' : 'Cannot load orders');
        toast.error(errorMsg);
    }

    const filterByStatus = useCallback((status: OrderStatus | 'ALL') => {
        setCurrentPage(0);
        setCurrentStatus(status);
    }, []);

    const changePage = useCallback((page: number) => {
        setCurrentPage(page);
    }, []);

    const getOrderDetail = useCallback(async (orderCode: string) => {
        try {
            return await orderService.getOrderDetail(orderCode);
        } catch (err: unknown) {
            const errorMsg = err instanceof Error ? err.message : (language === 'vi' ? 'Không thể tải chi tiết đơn hàng' : 'Cannot load order details');
            throw new Error(errorMsg);
        }
    }, [language]);

    return {
        orders,
        loading,
        error,
        totalPages,
        totalElements,
        currentPage,
        currentStatus,
        refreshOrders,
        filterByStatus,
        changePage,
        getOrderDetail,
    };
};