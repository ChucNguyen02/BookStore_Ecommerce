import { useTranslation } from 'react-i18next';import { Link } from 'react-router-dom';
import {
  ChevronRight,
  Calendar,
  CreditCard,
  Package,
  AlertCircle,
  Star } from
'lucide-react';
import { useState, useEffect } from 'react';
import { OrderStatusBadge } from './OrderStatusBadge';
import { PaymentMethodBadge } from './PaymentMethodBadge';
import { useAppContext } from '../../../context/AppContext';
import type { OrderResponse } from '../../../types/order.types';

interface OrderCardProps {
  order: OrderResponse;
  onPayNow?: (orderCode: string) => void;
}

export const OrderCard = ({ order, onPayNow }: OrderCardProps) => {const { t } = useTranslation();
  const { language } = useAppContext();
  const [timeLeft, setTimeLeft] = useState<string>('');
  const [isExpiringSoon, setIsExpiringSoon] = useState(false);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat(language === 'vi' ? 'vi-VN' : 'en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  // Countdown timer cho PAYMENT_PENDING orders
  useEffect(() => {
    if (order.status !== 'PAYMENT_PENDING') return;

    const updateTimer = () => {
      const createdTime = new Date(order.createdAt).getTime();
      const expiryTime = createdTime + 60 * 60 * 1000; // +1 hour
      const now = Date.now();
      const remaining = expiryTime - now;

      if (remaining <= 0) {
        setTimeLeft(language === 'vi' ? t("Common.daHetHan") : 'Expired');
        setIsExpiringSoon(true);
        return;
      }

      const minutes = Math.floor(remaining / 60000);
      const seconds = Math.floor(remaining % 60000 / 1000);
      setTimeLeft(`${minutes}:${seconds.toString().padStart(2, '0')}`);
      setIsExpiringSoon(minutes < 15); // Warn khi còn < 15 phút
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [order.status, order.createdAt, language]);

  const isPaymentPending = order.status === 'PAYMENT_PENDING';
  const isDelivered = order.status === 'DELIVERED';

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition-all overflow-hidden border-2 ${
    isPaymentPending ?
    'border-orange-300 dark:border-orange-700' :
    'border-gray-200 dark:border-gray-700'}`
    }>
            {/* Header */}
            <div className={`px-6 py-4 border-b ${
      isPaymentPending ?
      'bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 border-orange-200 dark:border-orange-800' :
      'bg-gradient-to-r from-amber-50 to-orange-50 dark:from-gray-750 dark:to-gray-700 border-gray-200 dark:border-gray-700'}`
      }>
                <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-3">
                        <Package className={`w-5 h-5 ${
            isPaymentPending ?
            'text-orange-600 dark:text-orange-400' :
            'text-amber-600 dark:text-amber-400'}`
            } />
                        <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                {language === 'vi' ? t("Common.maDonHang") : 'Order Code'}
                            </p>
                            <p className="font-bold text-gray-900 dark:text-white">
                                {order.orderCode}
                            </p>
                        </div>
                    </div>
                    <OrderStatusBadge status={order.status} />
                </div>
            </div>

            {/* Payment Pending Warning Banner */}
            {isPaymentPending &&
      <div className={`px-6 py-3 ${
      isExpiringSoon ?
      'bg-red-50 dark:bg-red-900/20 border-b-2 border-red-200 dark:border-red-800' :
      'bg-orange-50 dark:bg-orange-900/20 border-b-2 border-orange-200 dark:border-orange-800'}`
      }>
                    <div className="flex items-center gap-3">
                        <AlertCircle className={`w-5 h-5 flex-shrink-0 ${
          isExpiringSoon ? 'text-red-600 dark:text-red-400 animate-pulse' : 'text-orange-600 dark:text-orange-400'}`
          } />
                        <div className="flex-1">
                            <p className={`text-sm font-semibold ${
            isExpiringSoon ? 'text-red-800 dark:text-red-300' : 'text-orange-800 dark:text-orange-300'}`
            }>
                                {language === 'vi' ? t("Common.vuiLongThanhToanTrong") :

              'Please complete payment within'}
                            </p>
                            <p className={`text-xs ${
            isExpiringSoon ? 'text-red-700 dark:text-red-400' : 'text-orange-700 dark:text-orange-400'}`
            }>
                                {language === 'vi' ? t("Common.donHangSeTuDong") :

              'Order will be auto-cancelled if not paid'}
                            </p>
                        </div>
                        <div className={`text-right px-3 py-1 rounded-lg font-mono font-bold text-lg ${
          isExpiringSoon ?
          'bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300' :
          'bg-white dark:bg-gray-800 text-orange-600 dark:text-orange-400'}`
          }>
                            {timeLeft}
                        </div>
                    </div>
                </div>
      }

            {/* Body */}
            <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    {/* Date */}
                    <div className="flex items-start gap-3">
                        <Calendar className="w-5 h-5 text-gray-400 dark:text-gray-500 mt-0.5" />
                        <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                                {language === 'vi' ? t("Common.ngayDat") : 'Order Date'}
                            </p>
                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                                {formatDate(order.createdAt)}
                            </p>
                        </div>
                    </div>

                    {/* Payment Method */}
                    <div className="flex items-start gap-3">
                        <CreditCard className="w-5 h-5 text-gray-400 dark:text-gray-500 mt-0.5" />
                        <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                                {language === 'vi' ? t("Common.thanhToan") : 'Payment'}
                            </p>
                            <PaymentMethodBadge method={order.paymentMethod} size="sm" />
                        </div>
                    </div>
                </div>

                {/* Items Count & Total */}
                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                    <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            {order.itemCount} {language === 'vi' ? t("Common.sanPham") : 'items'}
                        </p>
                    </div>
                    <div className="text-right">
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                            {language === 'vi' ? t("Common.tongTien") : 'Total'}
                        </p>
                        <p className={`text-xl font-bold ${
            isPaymentPending ?
            'text-orange-600 dark:text-orange-400' :
            'text-amber-600 dark:text-amber-400'}`
            }>
                            {formatPrice(order.totalAmount)}
                        </p>
                    </div>
                </div>

                {/* Actions */}
                <div className="mt-4 flex gap-3">
                    {isPaymentPending ?
          <>
                            <button
              onClick={() => onPayNow?.(order.orderCode)}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white rounded-lg font-bold transition-all shadow-md hover:shadow-lg">
              
                                <CreditCard className="w-5 h-5" />
                                {language === 'vi' ? t("Common.thanhToanNgay") : 'Pay Now'}
                            </button>
                            <Link
              to={`/orders/${order.orderCode}`}
              className="px-4 py-2.5 border-2 border-orange-500 dark:border-orange-600 text-orange-600 dark:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-900/20 rounded-lg font-medium transition-colors">
              
                                {language === 'vi' ? t("Common.chiTiet") : 'Details'}
                            </Link>
                        </> :

          <>
                            <Link
              to={`/orders/${order.orderCode}`}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-amber-500 hover:bg-amber-600 dark:bg-amber-600 dark:hover:bg-amber-700 text-white rounded-lg font-medium transition-colors">
              
                                {language === 'vi' ? t("Common.xemChiTiet") : 'View Details'}
                                <ChevronRight className="w-4 h-4" />
                            </Link>

                            {/* Review Button for Delivered Orders */}
                            {isDelivered && order.canReview &&
            <Link
              to={`/orders/${order.orderCode}/review`}
              className="px-4 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-lg font-medium transition-all shadow-md hover:shadow-lg flex items-center gap-2">
              
                                    <Star className="w-4 h-4" />
                                    {language === 'vi' ? t("Common.danhGia") : 'Review'}
                                </Link>
            }
                        </>
          }
                </div>
            </div>
        </div>);

};