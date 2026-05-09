import { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle, XCircle, Loader2, ArrowRight } from 'lucide-react';
import type { OrderDetailResponse } from '../../../types/order_detail.types';
import toast from 'react-hot-toast';
import { useOrders } from '../../../hooks/user';
import { useTranslation } from 'react-i18next';

const PaymentResult = () => {
    const { t } = useTranslation();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { getOrderDetail } = useOrders();
    const hasCheckedStatus = useRef(false);

    const [order, setOrder] = useState<OrderDetailResponse | null>(null);
    const [internalLoading, setInternalLoading] = useState(true);
    const [countdown, setCountdown] = useState(5);

    const orderCode = searchParams.get('orderCode');
    const isSuccess = searchParams.get('resultCode') === '0';

    // ✅ FIX: Clear pendingPayment ngay khi PaymentResult mount
    // Đảm bảo không bị dính dữ liệu cũ khi checkout đơn mới
    useEffect(() => {
        localStorage.removeItem('pendingPayment');
    }, []);

    useEffect(() => {
        if (!orderCode) {
            toast.error(t('PaymentResult.error.noOrderCode'));
            navigate('/orders');
            return;
        }

        // ✅ FIX: Prevent double-call in React Strict Mode
        if (hasCheckedStatus.current) return;
        hasCheckedStatus.current = true;

        const checkPaymentStatus = async () => {
            try {
                const orderData = await getOrderDetail(orderCode);
                setOrder(orderData);

                // Nếu success nhưng backend chưa update → đợi IPN
                if (isSuccess && orderData.paymentStatus === 'PENDING') {
                    toast.loading(t('PaymentResult.toast.confirming'), { duration: 3000 });
                    setTimeout(() => {
                        checkPaymentStatus();
                    }, 3000);
                    return;
                }

                setInternalLoading(false);
            } catch (error: any) {
                console.error('❌ Error fetching order:', error);

                if (error.response?.status === 401) {
                    toast.error(t('PaymentResult.error.unauthorized'));
                    setTimeout(() => {
                        navigate('/login', {
                            state: { from: `/orders/${orderCode}` }
                        });
                    }, 2000);
                    return;
                }

                if (error.response?.status === 404) {
                    setInternalLoading(false);
                    return;
                }

                toast.error(t('PaymentResult.error.fetchFailed'));
                setInternalLoading(false);
            }
        };

        checkPaymentStatus();
    }, [orderCode, isSuccess, navigate, getOrderDetail, t]);

    // Countdown redirect
    useEffect(() => {
        if (!internalLoading && countdown > 0) {
            const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
            return () => clearTimeout(timer);
        }
        if (countdown === 0) {
            navigate(`/orders/${orderCode}`);
        }
    }, [countdown, internalLoading, navigate, orderCode]);

    if (internalLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
                <div className="text-center">
                    <Loader2 className="w-16 h-16 animate-spin text-blue-600 mx-auto mb-4" />
                    <p className="text-gray-600 dark:text-gray-400">
                        {t('PaymentResult.loading')}
                    </p>
                </div>
            </div>
        );
    }

    const paymentSuccess = order?.paymentStatus === 'PAID';
    const paymentFailed = order?.paymentStatus === 'FAILED';

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 px-4">
            <div className="max-w-md w-full">
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 text-center">
                    {/* Icon */}
                    <div className="mb-6">
                        {paymentSuccess ? (
                            <CheckCircle className="w-24 h-24 text-green-500 mx-auto animate-bounce" />
                        ) : paymentFailed ? (
                            <XCircle className="w-24 h-24 text-red-500 mx-auto animate-pulse" />
                        ) : (
                            <Loader2 className="w-24 h-24 text-yellow-500 mx-auto animate-spin" />
                        )}
                    </div>

                    {/* Title */}
                    <h1 className="text-3xl font-bold mb-3 text-gray-900 dark:text-white">
                        {paymentSuccess && t('PaymentResult.success.title')}
                        {paymentFailed && t('PaymentResult.failed.title')}
                        {!paymentSuccess && !paymentFailed && t('PaymentResult.processing.title')}
                    </h1>

                    {/* Message */}
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                        {paymentSuccess && t('PaymentResult.success.message')}
                        {paymentFailed && t('PaymentResult.failed.message')}
                        {!paymentSuccess && !paymentFailed && t('PaymentResult.processing.message')}
                    </p>

                    {/* Order Info */}
                    {order && (
                        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-6">
                            <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                                {t('PaymentResult.orderInfo.orderCode')}
                            </div>
                            <div className="font-mono font-bold text-lg text-gray-900 dark:text-white">
                                {order.orderCode}
                            </div>
                            <div className="text-sm text-gray-600 dark:text-gray-400 mt-3 mb-1">
                                {t('PaymentResult.orderInfo.totalAmount')}
                            </div>
                            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                                {order.totalAmount.toLocaleString('vi-VN')}₫
                            </div>
                        </div>
                    )}

                    {/* Actions */}
                    <div className="space-y-3">
                        <button
                            onClick={() => navigate(`/orders/${orderCode}`)}
                            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold flex items-center justify-center gap-2 transition"
                        >
                            {t('PaymentResult.actions.viewDetail')}
                            <ArrowRight className="w-5 h-5" />
                        </button>

                        <button
                            onClick={() => navigate('/orders')}
                            className="w-full py-3 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-lg font-semibold transition"
                        >
                            {t('PaymentResult.actions.manageOrders')}
                        </button>

                        <p className="text-sm text-gray-500 dark:text-gray-400 pt-2">
                            {t('PaymentResult.autoRedirect', { seconds: countdown })}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PaymentResult;