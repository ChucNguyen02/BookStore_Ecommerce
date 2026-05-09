import { CreditCard, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { usePayment } from '../../../hooks/user/usePayment';
import { paymentService } from '../../../services';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';

interface RetryPaymentButtonProps {
  order: any;
}

export const RetryPaymentButton = ({ order }: RetryPaymentButtonProps) => {
  const { t } = useTranslation();
  const [processing, setProcessing] = useState(false);
  const { createVNPayPayment, createMomoPayment } = usePayment();

  if (
    order.paymentStatus !== 'PENDING' ||
    order.paymentMethod === 'COD' ||
    order.status === 'CANCELLED'
  ) {
    return null;
  }

  const handleRetryPayment = async () => {
    setProcessing(true);
    try {
      let paymentResponse;

      if (order.paymentMethod === 'VNPAY') {
        paymentResponse = await createVNPayPayment(order.orderCode);
      } else if (order.paymentMethod === 'MOMO') {
        paymentResponse = await createMomoPayment(order.orderCode);
      } else if (order.paymentMethod === 'PAYOS') {
        paymentResponse = await paymentService.createPayOSPayment(order.orderCode);
      }

      if (paymentResponse && paymentResponse.paymentUrl) {
        // Lưu thông tin để tracking
        localStorage.setItem(
          'pendingPayment',
          JSON.stringify({
            orderCode: order.orderCode,
            method: order.paymentMethod,
            timestamp: Date.now(),
          })
        );

        // Redirect đến payment gateway
        window.location.href = paymentResponse.paymentUrl;
      } else {
        toast.error(t('retryPayment.failedToCreateUrl'));
        setProcessing(false);
      }
    } catch (error: any) {
      console.error('Retry payment error:', error);
      // Hook đã xử lý toast.error rồi, không cần toast lại
      setProcessing(false);
    }
  };

  return (
    <div className="bg-amber-50 dark:bg-amber-900/20 border-2 border-amber-200 dark:border-amber-800 rounded-xl p-6">
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0">
          <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/50 rounded-full flex items-center justify-center">
            <CreditCard className="w-6 h-6 text-amber-600 dark:text-amber-400" />
          </div>
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-amber-900 dark:text-amber-100 mb-2">
            {t('retryPayment.title')}
          </h3>
          <p className="text-sm text-amber-800 dark:text-amber-300 mb-4">
            {t('retryPayment.description', { method: order.paymentMethod })}
          </p>
          <button
            onClick={handleRetryPayment}
            disabled={processing}
            className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-600 dark:from-amber-600 dark:to-orange-700 text-white rounded-xl font-semibold hover:from-amber-600 hover:to-orange-700 dark:hover:from-amber-700 dark:hover:to-orange-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {processing ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                {t('retryPayment.processing')}
              </>
            ) : (
              <>
                <CreditCard className="w-5 h-5" />
                {t('retryPayment.retry')}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};