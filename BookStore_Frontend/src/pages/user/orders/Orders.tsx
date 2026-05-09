import { ShoppingBag, ChevronLeft, ChevronRight } from 'lucide-react';
import { OrderCard } from '../../../components/user/orders/OrderCard';
import { OrderStatusTabs } from '../../../components/user/orders/OrderStatusTabs';
import LoadingSpinner from '../../../components/user/common/LoadingSpinner';
import { useOrders } from '../../../hooks/user/useOrders';
import { usePayment } from '../../../hooks/user/usePayment';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';

const Orders = () => {
    const { t } = useTranslation();
    const {
        orders,
        loading,
        error,
        totalPages,
        totalElements,
        currentPage,
        currentStatus,
        filterByStatus,
        changePage,
    } = useOrders();

    const { createVNPayPayment, createMomoPayment } = usePayment();

    // Handle "Pay Now" for PAYMENT_PENDING orders
    const handlePayNow = async (orderCode: string) => {
        const order = orders.find(o => o.orderCode === orderCode);
        if (!order) return;

        try {
            // Lưu thông tin để tracking redirect sau khi thanh toán
            localStorage.setItem('pendingPayment', JSON.stringify({
                orderCode: order.orderCode,
                method: order.paymentMethod,
                timestamp: Date.now()
            }));

            let paymentResponse;

            if (order.paymentMethod === 'VNPAY') {
                paymentResponse = await createVNPayPayment(orderCode);
            } else if (order.paymentMethod === 'MOMO') {
                paymentResponse = await createMomoPayment(orderCode);
            }

            if (paymentResponse?.paymentUrl) {
                window.location.href = paymentResponse.paymentUrl;
            } else {
                throw new Error('No payment URL received');
            }
        } catch (error: any) {
            console.error('Payment error:', error);
            toast.error(error.message || t('Orders.paymentError'));
        }
    };

    if (loading && orders.length === 0) {
        return <LoadingSpinner fullScreen />;
    }

    if (error && orders.length === 0) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center space-y-4">
                    <p className="text-xl text-red-600 dark:text-red-400">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="px-6 py-3 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors"
                    >
                        {t('Orders.error.tryAgain')}
                    </button>
                </div>
            </div>
        );
    }

    const getPaginationNumbers = () => {
        const delta = 2;
        const range: number[] = [];

        for (
            let i = Math.max(0, currentPage - delta);
            i <= Math.min(totalPages - 1, currentPage + delta);
            i++
        ) {
            range.push(i);
        }

        return range;
    };

    // Count orders by status for tabs
    const statusCounts = orders.reduce((acc, order) => {
        acc[order.status] = (acc[order.status] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);
    statusCounts['ALL'] = totalElements;

    return (
        <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
            <div className="container mx-auto px-4 py-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-serif font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-3">
                        <ShoppingBag className="w-10 h-10 text-amber-600 dark:text-amber-400" />
                        {t('Orders.title')}
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        {t('Orders.totalOrders', { count: totalElements })}
                    </p>
                </div>

                {/* Status Tabs */}
                <OrderStatusTabs
                    activeStatus={currentStatus}
                    onStatusChange={(status: any) => filterByStatus(status)}
                    counts={statusCounts}
                />

                {/* Orders List */}
                <div className="mt-6">
                    {loading ? (
                        <LoadingSpinner />
                    ) : orders.length > 0 ? (
                        <>
                            <div className="grid grid-cols-1 gap-6">
                                {orders.map((order) => (
                                    <OrderCard
                                        key={order.id}
                                        order={order}
                                        onPayNow={handlePayNow}
                                    />
                                ))}
                            </div>

                            {/* Pagination */}
                            {totalPages > 1 && (
                                <div className="mt-8 flex items-center justify-center gap-2 flex-wrap">
                                    <button
                                        onClick={() => changePage(currentPage - 1)}
                                        disabled={currentPage === 0}
                                        className="px-4 py-2 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-amber-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                                    >
                                        <ChevronLeft className="w-5 h-5" />
                                        {t('Orders.pagination.previous')}
                                    </button>

                                    <div className="flex items-center gap-2">
                                        {getPaginationNumbers().map((pageNum) => (
                                            <button
                                                key={pageNum}
                                                onClick={() => changePage(pageNum)}
                                                className={`w-10 h-10 rounded-lg font-medium transition-colors ${
                                                    currentPage === pageNum
                                                        ? 'bg-amber-500 text-white'
                                                        : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-amber-50 dark:hover:bg-gray-700'
                                                }`}
                                            >
                                                {pageNum + 1}
                                            </button>
                                        ))}
                                    </div>

                                    <button
                                        onClick={() => changePage(currentPage + 1)}
                                        disabled={currentPage >= totalPages - 1}
                                        className="px-4 py-2 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-amber-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                                    >
                                        {t('Orders.pagination.next')}
                                        <ChevronRight className="w-5 h-5" />
                                    </button>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-2xl">
                            <ShoppingBag className="w-24 h-24 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
                            <p className="text-gray-500 dark:text-gray-400 text-lg mb-4">
                                {t('Orders.empty')}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Orders;