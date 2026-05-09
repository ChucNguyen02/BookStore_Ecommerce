import apiClient from './api.client';
import { type PaymentRequest, type PaymentResponse } from '../types';

class PaymentService {
    private readonly BASE_URL = '/payment';

    /**
     * Create VNPay payment URL
     */
    async createVNPayPayment(orderCode: string): Promise<PaymentResponse> {
        const data: PaymentRequest = { orderCode };

        const response = await apiClient.post<PaymentResponse>(
            `${this.BASE_URL}/vnpay/create`,
            data
        );

        if (!response.result) {
            throw new Error('Failed to create VNPay payment: No result returned');
        }

        return response.result;
    }

    /**
     * Create Momo payment URL
     */
    async createMomoPayment(orderCode: string): Promise<PaymentResponse> {
        const data: PaymentRequest = { orderCode };

        const response = await apiClient.post<PaymentResponse>(
            `${this.BASE_URL}/momo/create`,
            data
        );

        if (!response.result) {
            throw new Error('Failed to create Momo payment: No result returned');
        }

        return response.result;
    }

    /**
     * Create PayOS payment link (real payment)
     */
    async createPayOSPayment(orderCode: string): Promise<PaymentResponse> {
        const data: PaymentRequest = { orderCode };

        const response = await apiClient.post<PaymentResponse>(
            `${this.BASE_URL}/payos/create`,
            data
        );

        if (!response.result) {
            throw new Error('Failed to create PayOS payment: No result returned');
        }

        return response.result;
    }

    /**
     * Create local test payment (dev only)
     */
    async createLocalPayment(orderCode: string): Promise<PaymentResponse> {
        const data: PaymentRequest = { orderCode };

        const response = await apiClient.post<PaymentResponse>(
            `${this.BASE_URL}/local/create`,
            data
        );

        if (!response.result) {
            throw new Error('Failed to create local payment: No result returned');
        }

        return response.result;
    }

    /**
     * Create payment and redirect user to payment gateway
     * @param orderCode - Order code to create payment for
     * @param method - Payment method (VNPAY | MOMO | PAYOS | LOCAL)
     */
    async createPaymentAndRedirect(orderCode: string, method: 'VNPAY' | 'MOMO' | 'PAYOS' | 'LOCAL'): Promise<void> {
        try {
            let response: PaymentResponse;

            if (method === 'VNPAY') {
                response = await this.createVNPayPayment(orderCode);
            } else if (method === 'MOMO') {
                response = await this.createMomoPayment(orderCode);
            } else if (method === 'LOCAL') {
                response = await this.createLocalPayment(orderCode);
            } else {
                // PAYOS
                response = await this.createPayOSPayment(orderCode);
            }

            if (!response.paymentUrl) {
                throw new Error('No payment URL returned from gateway');
            }

            // Redirect to payment gateway
            window.location.href = response.paymentUrl;
        } catch (error) {
            console.error(`Failed to create ${method} payment:`, error);
            throw error;
        }
    }

    /**
     * Parse payment callback from URL search params
     * Handles VNPay, Momo, and PayOS callbacks
     */
    parsePaymentCallback(): { orderCode: string | null; success: boolean } {
        const params = new URLSearchParams(window.location.search);
        const orderCode = params.get('orderCode');
        const resultCode = params.get('resultCode');

        // All gateways (VNPay, Momo, PayOS) redirect via backend with
        // normalized params: ?orderCode=XXX&resultCode=0 (success) or resultCode=1/other (fail)
        const success = resultCode === '0';

        return {
            orderCode,
            success
        };
    }
}

export const paymentService = new PaymentService();
export default paymentService;