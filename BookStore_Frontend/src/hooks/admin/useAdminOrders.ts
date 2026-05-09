import { useState, useEffect, useCallback } from 'react';
import { adminOrderService, orderService } from '../../services';
import { toast } from 'react-hot-toast';
import { 
    type OrderResponse, 
    type PageResponse,
    type OrderStatus,
    type PaymentMethod,
    type UpdateOrderStatusRequest 
} from '../../types';

interface SearchFilters {
    keyword?: string;
    status?: OrderStatus;
    paymentMethod?: PaymentMethod;
    startDate?: string;
    endDate?: string;
}

export function useAdminOrders() {
    const [orders, setOrders] = useState<PageResponse<OrderResponse> | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentFilters, setCurrentFilters] = useState<SearchFilters>({});
    const [statistics, setStatistics] = useState<any>(null);

    const fetchOrders = useCallback(async (
        status?: OrderStatus,
        page = 0,
        size = 20
    ) => {
        try {
            setIsLoading(true);
            setError(null);
            
            let data: PageResponse<OrderResponse>;
            if (status) {
                data = await adminOrderService.getAllOrdersByStatus(status, page, size);
            } else {
                data = await adminOrderService.getAllOrders(page, size);
            }
            
            setOrders(data);
            setCurrentFilters({ status });
        } catch (err: any) {
            const message = err.message || 'Failed to load orders';
            setError(message);
            toast.error(message);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const searchOrders = useCallback(async (
        keyword: string,
        status?: OrderStatus,
        page = 0,
        size = 20
    ) => {
        try {
            setIsLoading(true);
            setError(null);
            
            let data: PageResponse<OrderResponse>;
            
            // Check if keyword is order code, email, or phone
            if (keyword.includes('@')) {
                // Email search
                data = await adminOrderService.getOrdersByEmail(keyword, page, size);
            } else if (/^\d+$/.test(keyword) && keyword.length >= 10) {
                // Phone search (numeric and at least 10 digits)
                data = await adminOrderService.getOrdersByPhone(keyword, page, size);
            } else if (keyword.startsWith('ORD') || /^[A-Z0-9]{6,}$/.test(keyword)) {
                // Order code search
                data = await adminOrderService.searchOrders(keyword, page, size);
            } else {
                // General search
                data = await adminOrderService.searchOrders(keyword, page, size);
            }

            // Apply status filter if provided
            if (status && data.content.length > 0) {
                const filtered = data.content.filter(order => order.status === status);
                setOrders({
                    ...data,
                    content: filtered,
                    totalElements: filtered.length
                });
            } else {
                setOrders(data);
            }
            
            setCurrentFilters({ keyword, status });
        } catch (err: any) {
            const message = err.message || 'Failed to search orders';
            setError(message);
            toast.error(message);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const searchByPhone = useCallback(async (
        phone: string,
        page = 0,
        size = 20
    ) => {
        try {
            setIsLoading(true);
            setError(null);
            const data = await adminOrderService.getOrdersByPhone(phone, page, size);
            setOrders(data);
            setCurrentFilters({ keyword: phone });
        } catch (err: any) {
            const message = err.message || 'Failed to search orders by phone';
            setError(message);
            toast.error(message);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const searchByEmail = useCallback(async (
        email: string,
        page = 0,
        size = 20
    ) => {
        try {
            setIsLoading(true);
            setError(null);
            const data = await adminOrderService.getOrdersByEmail(email, page, size);
            setOrders(data);
            setCurrentFilters({ keyword: email });
        } catch (err: any) {
            const message = err.message || 'Failed to search orders by email';
            setError(message);
            toast.error(message);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const filterByPaymentMethod = useCallback(async (
        paymentMethod: PaymentMethod,
        page = 0,
        size = 20
    ) => {
        try {
            setIsLoading(true);
            setError(null);
            const data = await adminOrderService.getOrdersByPaymentMethod(paymentMethod, page, size);
            setOrders(data);
            setCurrentFilters({ paymentMethod });
        } catch (err: any) {
            const message = err.message || 'Failed to filter orders by payment method';
            setError(message);
            toast.error(message);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const fetchOrdersByDateRange = useCallback(async (
        startDate: string,
        endDate: string,
        page = 0,
        size = 20
    ) => {
        try {
            setIsLoading(true);
            setError(null);
            const data = await adminOrderService.getOrdersBetweenDates(
                startDate,
                endDate,
                page,
                size
            );
            setOrders(data);
            setCurrentFilters({ startDate, endDate });
        } catch (err: any) {
            const message = err.message || 'Failed to load orders';
            setError(message);
            toast.error(message);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const updateOrderStatus = useCallback(async (
        orderCode: string,
        statusData: UpdateOrderStatusRequest
    ) => {
        try {
            await orderService.updateOrderStatus(orderCode, statusData);
            toast.success('Order status updated successfully');
            return true;
        } catch (err: any) {
            const message = err.message || 'Failed to update order status';
            toast.error(message);
            return false;
        }
    }, []);

    const addOrderNote = useCallback(async (
        orderCode: string,
        note: string
    ) => {
        try {
            await adminOrderService.addOrderNote(orderCode, note);
            toast.success('Note added successfully');
            return true;
        } catch (err: any) {
            const message = err.message || 'Failed to add note';
            toast.error(message);
            return false;
        }
    }, []);

    const updateTrackingNumber = useCallback(async (
        orderCode: string,
        trackingNumber: string
    ) => {
        try {
            await adminOrderService.updateTrackingNumber(orderCode, trackingNumber);
            toast.success('Tracking number updated successfully');
            return true;
        } catch (err: any) {
            const message = err.message || 'Failed to update tracking number';
            toast.error(message);
            return false;
        }
    }, []);

    const getExpiredPendingOrders = useCallback(async (hoursTimeout = 24) => {
        try {
            return await adminOrderService.getExpiredPendingOrders(hoursTimeout);
        } catch (err: any) {
            toast.error(err.message || 'Failed to fetch expired orders');
            return [];
        }
    }, []);

    const getAutoCompleteOrders = useCallback(async (daysAfterDelivery = 7) => {
        try {
            return await adminOrderService.getOrdersToAutoComplete(daysAfterDelivery);
        } catch (err: any) {
            toast.error(err.message || 'Failed to fetch auto-complete orders');
            return [];
        }
    }, []);

    const fetchStatistics = useCallback(async () => {
        try {
            const stats = await adminOrderService.getOrderStatistics();
            setStatistics(stats);
        } catch (err: any) {
            console.error('Failed to fetch statistics:', err);
        }
    }, []);

    const clearFilters = useCallback(() => {
        setCurrentFilters({});
        fetchOrders();
    }, [fetchOrders]);

    useEffect(() => {
        fetchOrders();
        fetchStatistics();
    }, []);

    return {
        orders,
        isLoading,
        error,
        statistics,
        currentFilters,
        fetchOrders,
        searchOrders,
        searchByPhone,
        searchByEmail,
        filterByPaymentMethod,
        fetchOrdersByDateRange,
        updateOrderStatus,
        addOrderNote,
        updateTrackingNumber,
        getExpiredPendingOrders,
        getAutoCompleteOrders,
        clearFilters,
        refetch: fetchOrders
    };
}