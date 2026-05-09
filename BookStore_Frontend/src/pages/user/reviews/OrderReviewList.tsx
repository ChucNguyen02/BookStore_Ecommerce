import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { Star, Package, ArrowLeft, CheckCircle, Award, Sparkles } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useOrders } from '../../../hooks/user/useOrders';
import toast from 'react-hot-toast';
import type { OrderDetailResponse, OrderItemResponse } from '../../../types';

export default function OrderReviewList() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { orderCode } = useParams<{ orderCode: string }>();

    const [order, setOrder] = useState<OrderDetailResponse | null>(null);
    const [reviewableItems, setReviewableItems] = useState<OrderItemResponse[]>([]);
    const [loadingReview, setLoadingReview] = useState(true);

    const { getOrderDetail } = useOrders();

    useEffect(() => {
        if (!orderCode) {
            toast.error(t('OrderReviewList.orderNotFound'));
            navigate('/orders');
            return;
        }

        loadOrderForReview();
    }, [orderCode, t, navigate]);

    const loadOrderForReview = async () => {
        try {
            setLoadingReview(true);
            const orderData = await getOrderDetail(orderCode!);

            if (orderData.status !== 'DELIVERED') {
                toast.error(t('OrderReviewList.onlyDelivered'));
                navigate(`/orders/${orderCode}`);
                return;
            }

            const itemsToReview = orderData.items.filter(item => !item.hasReviewed);

            if (itemsToReview.length === 0) {
                toast(t('OrderReviewList.allReviewed'), { icon: 'ℹ️' });
                navigate(`/orders/${orderCode}`);
                return;
            }

            setOrder(orderData);
            setReviewableItems(itemsToReview);
        } catch (error) {
            console.error('Load order error:', error);
            toast.error(t('OrderReviewList.loadFailed'));
            navigate('/orders');
        } finally {
            setLoadingReview(false);
        }
    };

    const handleReviewItem = (item: OrderItemResponse) => {
        navigate(`/review/create?bookId=${item.bookId}&orderId=${order?.id}&orderCode=${orderCode}`);
    };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(price);
    };

    const calculateMaxPoints = (quantity: number) => {
        const maxPerReview = 20; // 10 + 5 + 5
        return maxPerReview * quantity;
    };

    const totalPotentialPoints = reviewableItems.reduce((sum, item) =>
        sum + calculateMaxPoints(item.quantity), 0
    );

    if (loadingReview) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500"></div>
            </div>
        );
    }

    if (!order) {
        return null;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 py-8">
            <div className="container mx-auto px-4 max-w-4xl">
                {/* Header */}
                <div className="mb-8">
                    <button
                        onClick={() => navigate(`/orders/${orderCode}`)}
                        className="flex items-center gap-2 text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 mb-4 font-medium transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        {t('OrderReviewList.back')}
                    </button>

                    <h1 className="text-4xl font-serif font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-3">
                        <Star className="w-10 h-10 text-amber-500 fill-amber-500" />
                        {t('OrderReviewList.title')}
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        {t('OrderReviewList.orderCode', { orderCode })}
                    </p>
                </div>

                {/* Points Reward Banner */}
                <div className="bg-gradient-to-r from-amber-50 via-orange-50 to-yellow-50 dark:from-amber-900/20 dark:via-orange-900/20 dark:to-yellow-900/20 border-2 border-amber-300 dark:border-amber-700 rounded-xl p-6 mb-6 shadow-lg">
                    <div className="flex items-start gap-4">
                        <div className="flex-shrink-0">
                            <div className="w-14 h-14 bg-gradient-to-br from-amber-400 to-orange-500 dark:from-amber-500 dark:to-orange-600 rounded-full flex items-center justify-center animate-pulse">
                                <Sparkles className="w-7 h-7 text-white" />
                            </div>
                        </div>
                        <div className="flex-1">
                            <h3 className="font-bold text-amber-900 dark:text-amber-100 mb-2 text-xl">
                                {t('OrderReviewList.pointsTitle')}
                            </h3>
                            <p className="text-amber-800 dark:text-amber-300 mb-3">
                                {t('OrderReviewList.pointsDescription', {
                                    count: reviewableItems.length,
                                    points: totalPotentialPoints
                                })}
                            </p>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
                                <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-amber-200 dark:border-amber-700">
                                    <div className="flex items-center gap-2 mb-1">
                                        <Star className="w-4 h-4 text-amber-600 dark:text-amber-400 fill-amber-600 dark:fill-amber-400" />
                                        <span className="text-xs font-semibold text-amber-900 dark:text-amber-100">
                                            {t('OrderReviewList.basicReview')}
                                        </span>
                                    </div>
                                    <p className="text-amber-700 dark:text-amber-300 font-bold text-sm">
                                        10 {t('OrderReviewList.pointsPerItem')}
                                    </p>
                                </div>
                                <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-amber-200 dark:border-amber-700">
                                    <div className="flex items-center gap-2 mb-1">
                                        <Package className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                                        <span className="text-xs font-semibold text-amber-900 dark:text-amber-100">
                                            {t('OrderReviewList.addPhotos')}
                                        </span>
                                    </div>
                                    <p className="text-amber-700 dark:text-amber-300 font-bold text-sm">
                                        +5 {t('OrderReviewList.pointsPerItem')}
                                    </p>
                                </div>
                                <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-amber-200 dark:border-amber-700">
                                    <div className="flex items-center gap-2 mb-1">
                                        <Award className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                                        <span className="text-xs font-semibold text-amber-900 dark:text-amber-100">
                                            {t('OrderReviewList.detailedReview')}
                                        </span>
                                    </div>
                                    <p className="text-amber-700 dark:text-amber-300 font-bold text-sm">
                                        +5 {t('OrderReviewList.pointsPerItem')}
                                    </p>
                                </div>
                            </div>

                            <div className="bg-amber-100 dark:bg-amber-900/40 rounded-lg p-3">
                                <p className="text-sm text-amber-900 dark:text-amber-200 font-semibold">
                                    💡 {t('OrderReviewList.pointsMultiply')}
                                </p>
                                <p className="text-xs text-amber-800 dark:text-amber-300 mt-1">
                                    {t('OrderReviewList.example', { quantity: 3, points: 60 })}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Reviewable Items List */}
                <div className="space-y-4">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                        {t('OrderReviewList.itemsToReview', { count: reviewableItems.length })}
                    </h2>

                    {reviewableItems.map((item) => {
                        const maxPoints = calculateMaxPoints(item.quantity);

                        return (
                            <div
                                key={item.id}
                                className="bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition-all overflow-hidden border border-gray-200 dark:border-gray-700 relative"
                            >
                                <div className="absolute top-4 right-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2 shadow-lg z-10">
                                    <Sparkles className="w-4 h-4" />
                                    {t('OrderReviewList.upToPoints', { points: maxPoints })}
                                </div>

                                <div className="p-6">
                                    <div className="flex gap-4">
                                        <div className="flex-shrink-0 w-24 h-32 bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden">
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
                                        </div>

                                        <div className="flex-1 pr-20">
                                            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                                                {item.bookTitle}
                                            </h3>

                                            <div className="flex items-center gap-4 mb-3 flex-wrap">
                                                <span className="text-sm text-gray-600 dark:text-gray-400">
                                                    {t('OrderReviewList.quantity')} <span className="font-bold text-amber-600 dark:text-amber-400 ml-1">{item.quantity}</span>
                                                </span>
                                                <span className="text-lg font-bold text-amber-600 dark:text-amber-400">
                                                    {formatPrice(item.subtotal)}
                                                </span>
                                            </div>

                                            {item.quantity > 1 && (
                                                <div className="bg-amber-50 dark:bg-amber-900/20 rounded-lg p-3 mb-3 border border-amber-200 dark:border-amber-800">
                                                    <p className="text-xs text-amber-800 dark:text-amber-300 font-semibold">
                                                        🎯 {t('OrderReviewList.pointsMultiplied', { quantity: item.quantity })}
                                                    </p>
                                                    <p className="text-xs text-amber-700 dark:text-amber-400 mt-1">
                                                        {t('OrderReviewList.maximumPoints', { max: maxPoints })}
                                                    </p>
                                                </div>
                                            )}

                                            <div className="flex gap-3 flex-wrap">
                                                <button
                                                    onClick={() => handleReviewItem(item)}
                                                    className="flex-1 sm:flex-none px-6 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-lg font-semibold transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                                                >
                                                    <Star className="w-5 h-5 fill-white" />
                                                    {t('OrderReviewList.writeReview')}
                                                </button>

                                                <Link
                                                    to={`/books/${item.bookSlug}`}
                                                    className="px-4 py-2.5 border-2 border-amber-500 dark:border-amber-600 text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/20 rounded-lg font-medium transition-colors"
                                                >
                                                    {t('OrderReviewList.viewBook')}
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Already Reviewed Items */}
                {order.items.some(item => item.hasReviewed) && (
                    <div className="mt-8">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                            <CheckCircle className="w-6 h-6 text-green-500" />
                            {t('OrderReviewList.alreadyReviewed')}
                        </h2>

                        <div className="space-y-4">
                            {order.items
                                .filter(item => item.hasReviewed)
                                .map((item) => (
                                    <div
                                        key={item.id}
                                        className="bg-gray-50 dark:bg-gray-900 rounded-xl p-4 border border-gray-200 dark:border-gray-700"
                                    >
                                        <div className="flex gap-4 items-center">
                                            <div className="flex-shrink-0 w-16 h-20 bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden">
                                                {item.bookImage ? (
                                                    <img
                                                        src={item.bookImage}
                                                        alt={item.bookTitle}
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center">
                                                        <Package className="w-6 h-6 text-gray-400" />
                                                    </div>
                                                )}
                                            </div>

                                            <div className="flex-1">
                                                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                                                    {item.bookTitle}
                                                </h3>
                                                <div className="flex items-center gap-3 text-sm">
                                                    <div className="flex items-center gap-1 text-green-600 dark:text-green-400">
                                                        <CheckCircle className="w-4 h-4" />
                                                        {t('OrderReviewList.reviewed')}
                                                    </div>
                                                    {item.quantity > 1 && (
                                                        <span className="text-gray-600 dark:text-gray-400">
                                                            • {t('OrderReviewList.quantityShort')}: {item.quantity}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>

                                            <Link
                                                to={`/books/${item.bookSlug}`}
                                                className="px-4 py-2 text-sm border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                                            >
                                                {t('OrderReviewList.view')}
                                            </Link>
                                        </div>
                                    </div>
                                ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}