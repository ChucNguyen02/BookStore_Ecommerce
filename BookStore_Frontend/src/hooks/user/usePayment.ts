import { useState, useCallback } from 'react';
import { paymentService } from '../../services';
import { useAppContext } from '../../context/AppContext';
import toast from 'react-hot-toast';
import type { PaymentResponse } from '../../types';

export const usePayment = () => {
    const { language } = useAppContext();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const createVNPayPayment = useCallback(async (orderCode: string): Promise<PaymentResponse | null> => {
        try {
            setLoading(true);
            setError(null);
            const response = await paymentService.createVNPayPayment(orderCode);
            return response;
        } catch (err: unknown) {
            const errorMsg = err instanceof Error ? err.message : (language === 'vi' ? 'Không thể tạo thanh toán VNPay' : 'Cannot create VNPay payment');
            setError(errorMsg);
            toast.error(errorMsg);
            return null;
        } finally {
            setLoading(false);
        }
    }, [language]);

    const createMomoPayment = useCallback(async (orderCode: string): Promise<PaymentResponse | null> => {
        try {
            setLoading(true);
            setError(null);
            const response = await paymentService.createMomoPayment(orderCode);
            return response;
        } catch (err: unknown) {
            const errorMsg = err instanceof Error ? err.message : (language === 'vi' ? 'Không thể tạo thanh toán Momo' : 'Cannot create Momo payment');
            setError(errorMsg);
            toast.error(errorMsg);
            return null;
        } finally {
            setLoading(false);
        }
    }, [language]);

    const createPaymentAndRedirect = useCallback(async (orderCode: string, method: 'VNPAY' | 'MOMO' | 'PAYOS'): Promise<void> => {
        try {
            setLoading(true);
            setError(null);
            await paymentService.createPaymentAndRedirect(orderCode, method);
        } catch (err: unknown) {
            const errorMsg = err instanceof Error ? err.message : (language === 'vi' ? 'Không thể tạo thanh toán' : 'Cannot create payment');
            setError(errorMsg);
            toast.error(errorMsg);
            throw err;
        } finally {
            setLoading(false);
        }
    }, [language]);

    const parsePaymentCallback = useCallback(() => {
        return paymentService.parsePaymentCallback();
    }, []);

    return {
        loading,
        error,
        createVNPayPayment,
        createMomoPayment,
        createPaymentAndRedirect,
        parsePaymentCallback,
    };
};