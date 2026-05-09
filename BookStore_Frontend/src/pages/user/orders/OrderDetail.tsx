import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate, useSearchParams } from 'react-router-dom';
import {
    ArrowLeft,
    Package,
    MapPin,
    CreditCard,
    FileText,
    Star,
    XCircle,
    Printer,
    MessageCircle,
    Tag,
    Award,
    Loader2,
    AlertCircle,
    Sparkles,
} from 'lucide-react';
import { OrderTimeline } from '../../../components/user/orders/OrderTimeline';
import { OrderStatusBadge } from '../../../components/user/orders/OrderStatusBadge';
import { PaymentMethodBadge } from '../../../components/user/orders/PaymentMethodBadge';
import { CancelOrderModal } from '../../../components/user/orders/CancelOrderModal';
import LoadingSpinner from '../../../components/user/common/LoadingSpinner';
import { useOrderDetail } from '../../../hooks/user/useOrderDetail';
import { usePayment } from '../../../hooks/user/usePayment';
import { paymentService } from '../../../services';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';

const OrderDetail = () => {
    const { t } = useTranslation();
    const { orderCode } = useParams<{ orderCode: string }>();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [retryingPayment, setRetryingPayment] = useState(false);

    const { createVNPayPayment, createMomoPayment } = usePayment();

    const {
        order,
        loading,
        error,
        cancelling,
        cancelOrder,
    } = useOrderDetail(orderCode || '');

    useEffect(() => {
        const action = searchParams.get('action');
        if (action === 'review' && order?.canReview) {
            // Scroll to items section or open review modal
        }
    }, [searchParams, order]);

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(price);
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('vi-VN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        }).format(date);
    };

    const handleCancelOrder = async (reason: string) => {
        try {
            await cancelOrder({ reason });
            setShowCancelModal(false);
        } catch (err) {
            // Error is handled in hook
        }
    };

    const handleRetryPayment = async () => {
        if (!order) return;

        setRetryingPayment(true);
        try {
            let paymentResponse;

            if (order.paymentMethod === 'VNPAY') {
                paymentResponse = await createVNPayPayment(order.orderCode);
            } else if (order.paymentMethod === 'MOMO') {
                paymentResponse = await createMomoPayment(order.orderCode);
            } else if (order.paymentMethod === 'PAYOS') {
                paymentResponse = await paymentService.createPayOSPayment(order.orderCode);
            }

            if (paymentResponse) {
                localStorage.setItem('pendingPayment', JSON.stringify({
                    orderCode: order.orderCode,
                    method: order.paymentMethod,
                    timestamp: Date.now()
                }));

                window.location.href = paymentResponse.paymentUrl;
            }
        } catch (error: any) {
            console.error('Retry payment error:', error);
            toast.error(error.message || t('OrderDetail.retryPaymentFailed'));
            setRetryingPayment(false);
        }
    };

    const handlePrint = () => {
        window.print();
    };

    const calculateReviewPoints = (quantity: number) => {
        const basePoints = 10;
        const photoBonus = 5;
        const detailedCommentBonus = 5;
        const maxPerReview = basePoints + photoBonus + detailedCommentBonus;
        return maxPerReview * quantity;
    };

    const reviewableItemsCount = order?.items.filter(item =>
        item.canReview && !item.hasReviewed
    ).length || 0;

    const totalPotentialPoints = order?.items
        .filter(item => item.canReview && !item.hasReviewed)
        .reduce((sum, item) => sum + calculateReviewPoints(item.quantity), 0) || 0;

    if (loading) {
        return <LoadingSpinner fullScreen />;
    }

    if (error || !order) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center space-y-4">
                    <p className="text-xl text-red-600 dark:text-red-400">
                        {error || t('OrderDetail.error.notFound')}
                    </p>
                    <Link
                        to="/orders"
                        className="inline-block px-6 py-3 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors"
                    >
                        {t('OrderDetail.backToList')}
                    </Link>
                </div>
            </div>
        );
    }

    const showRetryPayment =
        order.paymentStatus === 'PENDING' &&
        (order.paymentMethod === 'VNPAY' || order.paymentMethod === 'MOMO' || order.paymentMethod === 'PAYOS') &&
        order.status !== 'CANCELLED';

    return (
        <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
            <div className="container mx-auto px-4 py-8">
                {/* Header */}
                <div className="mb-8">
                    <button
                        onClick={() => navigate('/orders')}
                        className="flex items-center gap-2 text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 mb-4 font-medium"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        {t('OrderDetail.back')}
                    </button>

                    <div className="flex items-start justify-between flex-wrap gap-4">
                        <div>
                            <h1 className="text-4xl font-serif font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-3">
                                <Package className="w-10 h-10 text-amber-600 dark:text-amber-400" />
                                {t('OrderDetail.title')}
                            </h1>
                            <div className="flex items-center gap-3 flex-wrap">
                                <p className="text-lg text-gray-600 dark:text-gray-400">
                                    {order.orderCode}
                                </p>
                                <OrderStatusBadge status={order.status} size="lg" />
                            </div>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                                {t('OrderDetail.orderDate')} {formatDate(order.createdAt)}
                            </p>
                        </div>

                        <div className="flex gap-3 flex-wrap">
                            {order.canReview && reviewableItemsCount > 0 && (
                                <Link
                                    to={`/orders/${order.orderCode}/review`}
                                    className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-lg font-semibold transition-all shadow-md hover:shadow-lg"
                                >
                                    <Star className="w-5 h-5 fill-white" />
                                    {t('OrderDetail.review')}
                                    {reviewableItemsCount > 1 && (
                                        <span className="ml-1 px-2 py-0.5 bg-white/20 rounded-full text-xs">
                                            {reviewableItemsCount}
                                        </span>
                                    )}
                                </Link>
                            )}

                            <button
                                onClick={handlePrint}
                                className="flex items-center gap-2 px-4 py-2.5 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium"
                            >
                                <Printer className="w-5 h-5" />
                                {t('OrderDetail.print')}
                            </button>

                            {order.canCancel && (
                                <button
                                    onClick={() => setShowCancelModal(true)}
                                    className="flex items-center gap-2 px-4 py-2.5 border-2 border-red-500 dark:border-red-600 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors font-medium"
                                >
                                    <XCircle className="w-5 h-5" />
                                    {t('OrderDetail.cancelOrder')}
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* RETRY PAYMENT BANNER */}
                {showRetryPayment && (
                    <div className="mb-6 bg-amber-50 dark:bg-amber-900/20 border-2 border-amber-200 dark:border-amber-800 rounded-xl p-6">
                        <div className="flex items-start gap-4">
                            <div className="flex-shrink-0">
                                <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/50 rounded-full flex items-center justify-center">
                                    <AlertCircle className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                                </div>
                            </div>
                            <div className="flex-1">
                                <h3 className="font-semibold text-amber-900 dark:text-amber-100 mb-2 text-lg">
                                    {t('OrderDetail.retryPayment.title')}
                                </h3>
                                <p className="text-sm text-amber-800 dark:text-amber-300 mb-4">
                                    {t('OrderDetail.retryPayment.description', { method: order.paymentMethod })}
                                </p>
                                <button
                                    onClick={handleRetryPayment}
                                    disabled={retryingPayment}
                                    className="px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-600 dark:from-amber-600 dark:to-orange-700 text-white rounded-xl font-semibold hover:from-amber-600 hover:to-orange-700 dark:hover:from-amber-700 dark:hover:to-orange-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                >
                                    {retryingPayment ? (
                                        <>
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                            {t('OrderDetail.retryPayment.processing')}
                                        </>
                                    ) : (
                                        <>
                                            <CreditCard className="w-5 h-5" />
                                            {t('OrderDetail.retryPayment.payNow')}
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* REVIEW REWARDS BANNER */}
                {order.canReview && reviewableItemsCount > 0 && (
                    <div className="mb-6 bg-gradient-to-r from-amber-50 via-orange-50 to-yellow-50 dark:from-amber-900/20 dark:via-orange-900/20 dark:to-yellow-900/20 border-2 border-amber-300 dark:border-amber-700 rounded-xl p-6 shadow-lg">
                        <div className="flex items-start gap-4">
                            <div className="flex-shrink-0">
                                <div className="w-14 h-14 bg-gradient-to-br from-amber-400 to-orange-500 dark:from-amber-500 dark:to-orange-600 rounded-full flex items-center justify-center animate-pulse">
                                    <Sparkles className="w-7 h-7 text-white" />
                                </div>
                            </div>
                            <div className="flex-1">
                                <h3 className="font-bold text-amber-900 dark:text-amber-100 mb-2 text-xl flex items-center gap-2">
                                    🎁 {t('OrderDetail.reviewRewards.title')}
                                </h3>
                                <p className="text-amber-800 dark:text-amber-300 mb-3">
                                    {t('OrderDetail.reviewRewards.description', {
                                        count: reviewableItemsCount,
                                        points: totalPotentialPoints
                                    })}
                                </p>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
                                    <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-amber-200 dark:border-amber-700">
                                        <div className="flex items-center gap-2 mb-1">
                                            <Star className="w-4 h-4 text-amber-600 dark:text-amber-400 fill-amber-600 dark:fill-amber-400" />
                                            <span className="text-xs font-semibold text-amber-900 dark:text-amber-100">
                                                {t('OrderDetail.reviewRewards.basic')}
                                            </span>
                                        </div>
                                        <p className="text-amber-700 dark:text-amber-300 font-bold">
                                            +10 {t('OrderDetail.reviewRewards.pointsPerItem')}
                                        </p>
                                    </div>
                                    <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-amber-200 dark:border-amber-700">
                                        <div className="flex items-center gap-2 mb-1">
                                            <Package className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                                            <span className="text-xs font-semibold text-amber-900 dark:text-amber-100">
                                                {t('OrderDetail.reviewRewards.addPhotos')}
                                            </span>
                                        </div>
                                        <p className="text-amber-700 dark:text-amber-300 font-bold">
                                            +5 {t('OrderDetail.reviewRewards.pointsPerItem')}
                                        </p>
                                    </div>
                                    <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-amber-200 dark:border-amber-700">
                                        <div className="flex items-center gap-2 mb-1">
                                            <FileText className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                                            <span className="text-xs font-semibold text-amber-900 dark:text-amber-100">
                                                {t('OrderDetail.reviewRewards.detailed')}
                                            </span>
                                        </div>
                                        <p className="text-amber-700 dark:text-amber-300 font-bold">
                                            +5 {t('OrderDetail.reviewRewards.pointsPerItem')}
                                        </p>
                                    </div>
                                </div>
                                <div className="bg-amber-100 dark:bg-amber-900/40 rounded-lg p-3 mb-4">
                                    <p className="text-sm text-amber-900 dark:text-amber-200 font-semibold">
                                        💡 {t('OrderDetail.reviewRewards.note')}
                                    </p>
                                    <p className="text-xs text-amber-800 dark:text-amber-300 mt-1">
                                        {t('OrderDetail.reviewRewards.example')}
                                    </p>
                                </div>
                                <Link
                                    to={`/orders/${order.orderCode}/review`}
                                    className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white rounded-xl font-bold transition-all shadow-md hover:shadow-lg"
                                >
                                    <Star className="w-5 h-5 fill-white" />
                                    {t('OrderDetail.reviewRewards.startReview')}
                                </Link>
                            </div>
                        </div>
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column - Timeline */}
                    <div className="lg:col-span-2 space-y-6">
                        <OrderTimeline order={order} />

                        {/* Order Items */}
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                                <Package className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                                {t('OrderDetail.items.title')}
                            </h3>

                            <div className="space-y-4">
                                {order.items.map((item) => {
                                    const itemReviewPoints = calculateReviewPoints(item.quantity);
                                    const canReviewThisItem = item.canReview && !item.hasReviewed;

                                    return (
                                        <div
                                            key={item.id}
                                            className="flex gap-4 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg relative"
                                        >
                                            {canReviewThisItem && order.canReview && (
                                                <div className="absolute top-2 right-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-md">
                                                    <Sparkles className="w-3 h-3" />
                                                    {t('OrderDetail.items.upToPoints', { points: itemReviewPoints })}
                                                </div>
                                            )}

                                            <Link
                                                to={`/books/${item.bookSlug}`}
                                                className="flex-shrink-0 w-20 h-28 bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden"
                                            >
                                                {item.bookImage ? (
                                                    <img
                                                        src={item.bookImage}
                                                        alt={item.bookTitle}
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center">
                                                        <Package className="w-8 h-8 text-gray-400" />
                                                    </div>
                                                )}
                                            </Link>

                                            <div className="flex-1 min-w-0">
                                                <Link
                                                    to={`/books/${item.bookSlug}`}
                                                    className="text-lg font-semibold text-gray-900 dark:text-white hover:text-amber-600 dark:hover:text-amber-400 transition-colors line-clamp-2"
                                                >
                                                    {item.bookTitle}
                                                </Link>
                                                <div className="flex items-center gap-4 mt-2 text-sm text-gray-600 dark:text-gray-400">
                                                    <span>{formatPrice(item.price)}</span>
                                                    <span>×</span>
                                                    <span className="font-semibold">{item.quantity}</span>
                                                </div>
                                                <p className="text-lg font-bold text-amber-600 dark:text-amber-400 mt-2">
                                                    {formatPrice(item.subtotal)}
                                                </p>

                                                {order.canReview && canReviewThisItem && (
                                                    <button
                                                        onClick={() => navigate(`/review/create?bookId=${item.bookId}&orderId=${order.id}&orderCode=${order.orderCode}`)}
                                                        className="mt-3 flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-lg font-medium transition-all shadow-sm hover:shadow-md text-sm"
                                                    >
                                                        <Star className="w-4 h-4 fill-white" />
                                                        {t('OrderDetail.items.reviewNow')}
                                                        {item.quantity > 1 && (
                                                            <span className="ml-1 px-2 py-0.5 bg-white/20 rounded-full text-xs">
                                                                ×{item.quantity}
                                                            </span>
                                                        )}
                                                    </button>
                                                )}

                                                {item.hasReviewed && (
                                                    <div className="mt-3 flex items-center gap-2 text-sm text-green-600 dark:text-green-400 font-medium">
                                                        <Star className="w-4 h-4 fill-green-600 dark:fill-green-400" />
                                                        {t('OrderDetail.items.reviewed')}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Info */}
                    <div className="lg:col-span-1 space-y-6">
                        {/* Shipping Address */}
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                <MapPin className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                                {t('OrderDetail.shippingAddress.title')}
                            </h3>
                            <div className="space-y-2 text-sm">
                                <p className="font-semibold text-gray-900 dark:text-white">
                                    {order.shippingName}
                                </p>
                                <p className="text-gray-600 dark:text-gray-400">
                                    {order.shippingPhone}
                                </p>
                                <p className="text-gray-600 dark:text-gray-400">
                                    {order.shippingAddress}
                                </p>
                            </div>
                        </div>

                        {/* Payment Info */}
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                <CreditCard className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                                {t('OrderDetail.payment.title')}
                            </h3>
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-600 dark:text-gray-400">
                                        {t('OrderDetail.payment.method')}
                                    </span>
                                    <PaymentMethodBadge method={order.paymentMethod} size="sm" />
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-600 dark:text-gray-400">
                                        {t('OrderDetail.payment.status')}
                                    </span>
                                    <span className={`text-sm font-semibold ${
                                        order.paymentStatus === 'PAID'
                                            ? 'text-green-600 dark:text-green-400'
                                            : order.paymentStatus === 'FAILED'
                                                ? 'text-red-600 dark:text-red-400'
                                                : 'text-yellow-600 dark:text-yellow-400'
                                    }`}>
                                        {order.paymentStatus === 'PAID'
                                            ? t('OrderDetail.payment.paid')
                                            : order.paymentStatus === 'FAILED'
                                                ? t('OrderDetail.payment.failed')
                                                : order.paymentStatus === 'REFUNDED'
                                                    ? t('OrderDetail.payment.refunded')
                                                    : t('OrderDetail.payment.pending')}
                                    </span>
                                </div>
                                {order.transactionId && (
                                    <div className="flex items-center justify-between pt-2 border-t border-gray-200 dark:border-gray-700">
                                        <span className="text-xs text-gray-500 dark:text-gray-400">
                                            {t('OrderDetail.payment.transactionId')}
                                        </span>
                                        <span className="text-xs font-mono text-gray-700 dark:text-gray-300">
                                            {order.transactionId}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Order Summary */}
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                <FileText className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                                {t('OrderDetail.summary.title')}
                            </h3>
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-600 dark:text-gray-400">
                                        {t('OrderDetail.summary.subtotal')}
                                    </span>
                                    <span className="font-medium text-gray-900 dark:text-white">
                                        {formatPrice(order.subtotal)}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-600 dark:text-gray-400">
                                        {t('OrderDetail.summary.shipping')}
                                    </span>
                                    <span className="font-medium text-gray-900 dark:text-white">
                                        {formatPrice(order.shippingFee)}
                                    </span>
                                </div>
                                {order.voucherDiscount && order.voucherDiscount > 0 && (
                                    <div className="flex items-center justify-between text-green-600 dark:text-green-400">
                                        <span className="text-sm flex items-center gap-1">
                                            <Tag className="w-4 h-4" />
                                            {t('OrderDetail.summary.voucher')}
                                            {order.voucherCode && (
                                                <span className="font-mono text-xs">({order.voucherCode})</span>
                                            )}
                                        </span>
                                        <span className="font-medium">
                                            -{formatPrice(order.voucherDiscount)}
                                        </span>
                                    </div>
                                )}
                                {order.pointsDiscount > 0 && (
                                    <div className="flex items-center justify-between text-blue-600 dark:text-blue-400">
                                        <span className="text-sm flex items-center gap-1">
                                            <Award className="w-4 h-4" />
                                            {t('OrderDetail.summary.points')}
                                            ({order.pointsUsed})
                                        </span>
                                        <span className="font-medium">
                                            -{formatPrice(order.pointsDiscount)}
                                        </span>
                                    </div>
                                )}
                                <div className="pt-3 border-t-2 border-gray-200 dark:border-gray-700 flex items-center justify-between">
                                    <span className="text-lg font-bold text-gray-900 dark:text-white">
                                        {t('OrderDetail.summary.total')}
                                    </span>
                                    <span className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                                        {formatPrice(order.totalAmount)}
                                    </span>
                                </div>
                                {order.pointsEarned > 0 && (
                                    <div className="pt-2 text-center">
                                        <span className="text-sm text-amber-600 dark:text-amber-400 font-medium">
                                            🎉 +{order.pointsEarned} {t('OrderDetail.summary.pointsEarned')}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Note */}
                        {order.note && (
                            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                    <MessageCircle className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                                    {t('OrderDetail.note.title')}
                                </h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    {order.note}
                                </p>
                            </div>
                        )}

                        {/* Tracking Number */}
                        {order.trackingNumber && (
                            <div className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800">
                                <h3 className="text-sm font-semibold text-blue-900 dark:text-blue-300 mb-2">
                                    {t('OrderDetail.tracking.title')}
                                </h3>
                                <p className="text-lg font-mono font-bold text-blue-700 dark:text-blue-400">
                                    {order.trackingNumber}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Cancel Order Modal */}
            <CancelOrderModal
                isOpen={showCancelModal}
                onClose={() => setShowCancelModal(false)}
                onConfirm={handleCancelOrder}
                orderCode={order.orderCode}
                loading={cancelling}
            />
        </div>
    );
};

export default OrderDetail;