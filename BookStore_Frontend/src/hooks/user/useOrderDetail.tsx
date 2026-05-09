import { useTranslation } from 'react-i18next';
import { useState, useEffect, useCallback } from 'react';
import { orderService } from '../../services';
import toast from 'react-hot-toast';
import { useAppContext } from '../../context/AppContext';
import type { CancelOrderRequest } from '../../types';
import type { OrderDetailResponse } from '../../types';



export const useOrderDetail = (orderCode: string) => {
  const { language } = useAppContext();
  const { t } = useTranslation();
  const [order, setOrder] = useState<OrderDetailResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cancelling, setCancelling] = useState(false);

  const fetchOrderDetail = useCallback(async () => {
    if (!orderCode) return;

    try {
      setLoading(true);
      setError(null);
      const data = await orderService.getOrderDetail(orderCode);
      setOrder(data);
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : language === 'vi' ? t("Common.khongTheTaiChiTiet") : 'Cannot load order details';
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  }, [orderCode, language]);

  useEffect(() => {
    fetchOrderDetail();
  }, [fetchOrderDetail]);

  const cancelOrder = useCallback(async (data: CancelOrderRequest) => {
    if (!orderCode) return;

    try {
      setCancelling(true);
      await orderService.cancelOrder(orderCode, data);
      toast.success(language === 'vi' ? t("Common.daHuyDonHangThanh") : 'Order cancelled successfully');
      await fetchOrderDetail();
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : language === 'vi' ? t("Common.khongTheHuyDonHang") : 'Cannot cancel order';
      toast.error(errorMsg);
      throw err;
    } finally {
      setCancelling(false);
    }
  }, [orderCode, language, fetchOrderDetail]);

  const refreshOrder = useCallback(() => {
    fetchOrderDetail();
  }, [fetchOrderDetail]);

  return {
    order,
    loading,
    error,
    cancelling,
    cancelOrder,
    refreshOrder
  };
};