import { useTranslation } from 'react-i18next';import React from 'react';
import { Ticket, Copy, Check } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import type { VoucherResponse } from '../../../types/voucher.types';
import { formatCurrency } from '../../../utils/format';

interface VoucherSectionProps {
  vouchers: VoucherResponse[];
  isLoading: boolean;
}

export const VoucherSection: React.FC<VoucherSectionProps> = ({ vouchers, isLoading }) => {const { t } = useTranslation();
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    toast.success(t("Common.daSaoChepMaVoucher"));
    setTimeout(() => setCopiedCode(null), 2000);
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{t("Common.maGiamGia")}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[...Array(3)].map((_, i) =>
          <div key={i} className="h-32 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse" />
          )}
                </div>
            </div>);

  }

  if (vouchers.length === 0) return null;

  return (
    <div className="space-y-4">
            <div className="flex items-center gap-2">
                <Ticket className="w-6 h-6 text-amber-600" />
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{t("Common.maGiamGia")}</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {vouchers.map((voucher) =>
        <div
          key={voucher.id}
          className="relative bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl p-4 text-white overflow-hidden group hover:shadow-xl transition-shadow">
          
                        {/* Background Pattern */}
                        <div className="absolute inset-0 opacity-10">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full -translate-y-1/2 translate-x-1/2" />
                            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white rounded-full translate-y-1/2 -translate-x-1/2" />
                        </div>

                        {/* Content */}
                        <div className="relative space-y-3">
                            <div className="flex items-start justify-between">
                                <div>
                                    <div className="text-sm opacity-90">{t("Common.giamGia")}</div>
                                    <div className="text-2xl font-bold">
                                        {voucher.discountType === 'PERCENTAGE' ?
                  `${voucher.discountValue}%` :
                  formatCurrency(voucher.discountValue)}
                                    </div>
                                </div>
                                <Ticket className="w-8 h-8 opacity-50" />
                            </div>

                            <div className="text-sm opacity-90">
                                {voucher.description || `Đơn tối thiểu ${formatCurrency(voucher.minOrderValue)}`}
                            </div>

                            {/* Code */}
                            <div className="flex items-center gap-2">
                                <div className="flex-1 bg-white/20 backdrop-blur-sm rounded-lg px-3 py-2 font-mono font-bold">
                                    {voucher.code}
                                </div>
                                <button
                onClick={() => handleCopy(voucher.code)}
                className="p-2 bg-white/20 backdrop-blur-sm rounded-lg hover:bg-white/30 transition-colors">
                
                                    {copiedCode === voucher.code ?
                <Check className="w-5 h-5" /> :

                <Copy className="w-5 h-5" />
                }
                                </button>
                            </div>

                            {/* Expiry */}
                            <div className="text-xs opacity-75">
                                HSD: {new Date(voucher.endDate).toLocaleDateString('vi-VN')}
                            </div>
                        </div>
                    </div>
        )}
            </div>
        </div>);

};