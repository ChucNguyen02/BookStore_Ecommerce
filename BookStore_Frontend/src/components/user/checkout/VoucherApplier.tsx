import { useTranslation } from 'react-i18next';import { useState } from 'react';
import { Tag, X, Check, Loader2 } from 'lucide-react';
import type { VoucherResponse } from '../../../types/voucher.types';
import { useAppContext } from '../../../context/AppContext';

interface VoucherApplierProps {
  appliedVoucher: VoucherResponse | null;
  validating: boolean;
  onApply: (code: string) => Promise<VoucherResponse | null>;
  onRemove: () => void;
}

export const VoucherApplier = ({ appliedVoucher, validating, onApply, onRemove }: VoucherApplierProps) => {const { t } = useTranslation();
  const { language } = useAppContext();
  const [code, setCode] = useState('');

  const handleApply = async () => {
    if (!code.trim()) return;
    await onApply(code.trim().toUpperCase());
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const getDiscountText = (voucher: VoucherResponse) => {
    if (voucher.discountType === 'PERCENTAGE') {
      return `${voucher.discountValue}%`;
    }
    return formatPrice(voucher.discountValue);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
            <h3 className="text-xl font-serif font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                <Tag className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                {language === 'vi' ? t("Common.maGiamGia") : 'Voucher Code'}
            </h3>

            {appliedVoucher ?
      <div className="p-4 bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20 border-2 border-orange-500 rounded-xl">
                    <div className="flex items-start justify-between">
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                                <Check className="w-5 h-5 text-green-600 dark:text-green-400" />
                                <span className="font-bold text-gray-900 dark:text-white">
                                    {appliedVoucher.code}
                                </span>
                                <span className="px-2 py-0.5 bg-orange-500 text-white text-xs font-semibold rounded-full">
                                    {getDiscountText(appliedVoucher)}
                                </span>
                            </div>
                            {appliedVoucher.description &&
            <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                                    {appliedVoucher.description}
                                </p>
            }
                            <div className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
                                {appliedVoucher.minOrderValue > 0 &&
              <p>
                                        {language === 'vi' ? t("Common.donToiThieu") : 'Min order: '}
                                        {formatPrice(appliedVoucher.minOrderValue)}
                                    </p>
              }
                                {appliedVoucher.maxDiscountAmount &&
              <p>
                                        {language === 'vi' ? t("Common.giamToiDa") : 'Max discount: '}
                                        {formatPrice(appliedVoucher.maxDiscountAmount)}
                                    </p>
              }
                            </div>
                        </div>
                        <button
            onClick={onRemove}
            className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors">
            
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div> :

      <div>
                    <div className="flex gap-3">
                        <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            onKeyPress={(e) => e.key === 'Enter' && handleApply()}
            placeholder={language === 'vi' ? t("Common.nhapMaGiamGia") : 'Enter voucher code'}
            disabled={validating}
            className="flex-1 px-4 py-3 border-2 border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-orange-500 dark:focus:ring-orange-400 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white uppercase" />
          
                        <button
            onClick={handleApply}
            disabled={validating || !code.trim()}
            className="px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-500 dark:from-orange-600 dark:to-amber-600 text-white rounded-lg font-semibold hover:from-orange-600 hover:to-amber-600 dark:hover:from-orange-700 dark:hover:to-amber-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2">
            
                            {validating ?
            <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    {language === 'vi' ? t("Common.dangKiemTra") : 'Checking...'}
                                </> :

            <>{language === 'vi' ? t("Common.apDung") : 'Apply'}</>
            }
                        </button>
                    </div>

                    <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                            💡 {language === 'vi' ? t("Common.nhapMaGiamGiaDe") :

            'Enter voucher code for extra discounts!'}
                        </p>
                    </div>
                </div>
      }
        </div>);

};