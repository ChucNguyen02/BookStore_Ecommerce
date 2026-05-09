import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { orderService, voucherService, paymentService } from '../../services';
import type { CreateOrderRequest } from '../../types';
import type { VoucherResponse } from '../../types';
import type { PaymentMethod } from '../../types';
import toast from 'react-hot-toast';
import { eventEmitter, EVENTS } from '../../utils/eventEmitter';

export const useCheckout = () => {
    const navigate = useNavigate();
    const [processing, setProcessing] = useState(false);
    const [appliedVoucher, setAppliedVoucher] = useState<VoucherResponse | null>(null);
    const [validatingVoucher, setValidatingVoucher] = useState(false);

    const validateVoucher = async (code: string): Promise<VoucherResponse | null> => {
        setValidatingVoucher(true);
        try {
            const voucher = await voucherService.validateVoucher(code);
            setAppliedVoucher(voucher);
            toast.success('Voucher applied successfully!');
            return voucher;
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : 'Invalid voucher code';
            toast.error(message);
            return null;
        } finally {
            setValidatingVoucher(false);
        }
    };

    const removeVoucher = () => {
        setAppliedVoucher(null);
        toast.success('Voucher removed');
    };

    const createOrder = async (data: CreateOrderRequest) => {
        setProcessing(true);
        try {
            const paymentMethod = data.paymentMethod as PaymentMethod;


            const order = await orderService.createOrder(data);


            eventEmitter.emit(EVENTS.CART_CLEARED);
            eventEmitter.emit(EVENTS.CART_UPDATED);
            eventEmitter.emit(EVENTS.ORDER_CREATED, { orderCode: order.orderCode });


            if (paymentMethod === 'COD') {

                toast.success('Order placed successfully!');
                navigate(`/orders/${order.orderCode}`, {
                    state: { fromCheckout: true }
                });

            } else if (paymentMethod === 'LOCAL') {

                try {
                    const paymentResponse = await paymentService.createLocalPayment(order.orderCode);

                    localStorage.setItem('pendingPayment', JSON.stringify({
                        orderCode: order.orderCode,
                        method: 'LOCAL',
                        timestamp: Date.now()
                    }));

                    window.location.href = paymentResponse.paymentUrl;

                } catch (paymentError: unknown) {
                    console.error('Local payment creation failed:', paymentError);
                    const message = paymentError instanceof Error
                        ? paymentError.message
                        : 'Failed to create local payment. Redirecting to order...';
                    toast.error(message);

                    setTimeout(() => {
                        navigate(`/orders/${order.orderCode}`);
                    }, 2000);
                }

            } else if (paymentMethod === 'VNPAY') {

                try {
                    const paymentResponse = await paymentService.createVNPayPayment(order.orderCode);


                    localStorage.setItem('pendingPayment', JSON.stringify({
                        orderCode: order.orderCode,
                        method: 'VNPAY',
                        timestamp: Date.now()
                    }));


                    window.location.href = paymentResponse.paymentUrl;

                } catch (paymentError: unknown) {
                    console.error('Payment URL creation failed:', paymentError);
                    const message = paymentError instanceof Error
                        ? paymentError.message
                        : 'Failed to create payment URL. Redirecting to order...';
                    toast.error(message);

                    setTimeout(() => {
                        navigate(`/orders/${order.orderCode}`);
                    }, 2000);
                }

            } else if (paymentMethod === 'MOMO') {

                try {
                    const paymentResponse = await paymentService.createMomoPayment(order.orderCode);


                    localStorage.setItem('pendingPayment', JSON.stringify({
                        orderCode: order.orderCode,
                        method: 'MOMO',
                        timestamp: Date.now()
                    }));


                    window.location.href = paymentResponse.paymentUrl;

                } catch (paymentError: unknown) {
                    console.error('Payment URL creation failed:', paymentError);
                    const message = paymentError instanceof Error
                        ? paymentError.message
                        : 'Failed to create payment URL. Redirecting to order...';
                    toast.error(message);

                    setTimeout(() => {
                        navigate(`/orders/${order.orderCode}`);
                    }, 2000);
                }

            } else if (paymentMethod === 'PAYOS') {

                try {
                    const paymentResponse = await paymentService.createPayOSPayment(order.orderCode);

                    localStorage.setItem('pendingPayment', JSON.stringify({
                        orderCode: order.orderCode,
                        method: 'PAYOS',
                        timestamp: Date.now()
                    }));

                    // Redirect to PayOS checkout page
                    window.location.href = paymentResponse.paymentUrl;

                } catch (paymentError: unknown) {
                    console.error('PayOS payment URL creation failed:', paymentError);
                    const message = paymentError instanceof Error
                        ? paymentError.message
                        : 'Failed to create PayOS payment link. Redirecting to order...';
                    toast.error(message);

                    setTimeout(() => {
                        navigate(`/orders/${order.orderCode}`);
                    }, 2000);
                }
            }

        } catch (error: unknown) {
            console.error('Order creation error:', error);
            const message = error instanceof Error ? error.message : 'Failed to create order';
            toast.error(message);
        } finally {
            // ✅ FIX: Luôn reset processing state, kể cả khi redirect thành công
            // (nếu redirect bị block hoặc fail, UI không bị stuck)
            setProcessing(false);
        }

    };

    return {
        processing,
        appliedVoucher,
        validatingVoucher,
        validateVoucher,
        removeVoucher,
        createOrder,
    };
};