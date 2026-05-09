import { useTranslation } from 'react-i18next';import { Ticket, Calendar, TrendingUp, Copy, Check } from 'lucide-react';
import { useState } from 'react';
import { useAppContext } from '../../../context/AppContext';
import type { VoucherResponse } from '../../../types/voucher.types';

interface VoucherCardProps {
  voucher: VoucherResponse;
  onCopy?: (code: string) => void;
}

export const VoucherCard = ({ voucher, onCopy }: VoucherCardProps) => {const { t } = useTranslation();
  const { language } = useAppContext();
  const [copied, setCopied] = useState(false);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(language === 'vi' ? 'vi-VN' : 'en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const getDiscountText = () => {
    if (voucher.discountType === 'PERCENTAGE') {
      return `${voucher.discountValue}%`;
    }
    return formatPrice(voucher.discountValue);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(voucher.code);
    setCopied(true);
    onCopy?.(voucher.code);
    setTimeout(() => setCopied(false), 2000);
  };

  const isExpired = new Date(voucher.endDate) < new Date();
  const isOutOfUses = voucher.usageLimit !== null && voucher.remainingUses === 0;

  return (
    <div className={`relative overflow-hidden rounded-xl border-2 transition-all ${
    voucher.isValid && !isExpired && !isOutOfUses ?
    'border-amber-500 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 hover:shadow-lg' :
    'border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 opacity-60'}`
    }>
            {/* Decorative circles */}
            <div className="absolute -left-4 top-1/2 -translate-y-1/2 w-8 h-8 bg-white dark:bg-gray-900 rounded-full" />
            <div className="absolute -right-4 top-1/2 -translate-y-1/2 w-8 h-8 bg-white dark:bg-gray-900 rounded-full" />
            
            <div className="relative p-6">
                <div className="flex items-start justify-between gap-4">
                    {/* Left side - Icon & Discount */}
                    <div className="flex items-center gap-4">
                        <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
            voucher.isValid && !isExpired && !isOutOfUses ?
            'bg-gradient-to-br from-amber-500 to-orange-500' :
            'bg-gray-400 dark:bg-gray-600'}`
            }>
                            <Ticket className="w-8 h-8 text-white" />
                        </div>
                        
                        <div>
                            <div className={`text-3xl font-bold ${
              voucher.isValid && !isExpired && !isOutOfUses ?
              'text-amber-600 dark:text-amber-400' :
              'text-gray-500 dark:text-gray-400'}`
              }>
                                {getDiscountText()}
                            </div>
                            <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                {language === 'vi' ? t("Common.giamGia") : 'Discount'}
                            </div>
                        </div>
                    </div>

                    {/* Right side - Status badges */}
                    <div className="flex flex-col gap-2 items-end">
                        {voucher.isPersonal &&
            <span className="px-3 py-1 bg-purple-500 text-white text-xs font-semibold rounded-full">
                                {language === 'vi' ? t("Common.caNhan") : 'Personal'}
                            </span>
            }
                        {isExpired &&
            <span className="px-3 py-1 bg-red-500 text-white text-xs font-semibold rounded-full">
                                {language === 'vi' ? t("Common.hetHan") : 'Expired'}
                            </span>
            }
                        {isOutOfUses &&
            <span className="px-3 py-1 bg-gray-500 text-white text-xs font-semibold rounded-full">
                                {language === 'vi' ? t("Common.hetLuot") : 'Out of uses'}
                            </span>
            }
                        {voucher.isValid && !isExpired && !isOutOfUses &&
            <span className="px-3 py-1 bg-green-500 text-white text-xs font-semibold rounded-full">
                                {language === 'vi' ? t("Common.coHieuLuc") : 'Valid'}
                            </span>
            }
                    </div>
                </div>

                {/* Description */}
                {voucher.description &&
        <p className="mt-4 text-sm text-gray-700 dark:text-gray-300">
                        {voucher.description}
                    </p>
        }

                {/* Details */}
                <div className="mt-4 space-y-2">
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <TrendingUp className="w-4 h-4" />
                        <span>
                            {language === 'vi' ? t("Common.donToiThieu") : 'Min order: '}
                            <span className="font-semibold text-gray-900 dark:text-white">
                                {formatPrice(voucher.minOrderValue)}
                            </span>
                        </span>
                    </div>

                    {voucher.maxDiscountAmount &&
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                            <TrendingUp className="w-4 h-4" />
                            <span>
                                {language === 'vi' ? t("Common.giamToiDa") : 'Max discount: '}
                                <span className="font-semibold text-gray-900 dark:text-white">
                                    {formatPrice(voucher.maxDiscountAmount)}
                                </span>
                            </span>
                        </div>
          }

                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <Calendar className="w-4 h-4" />
                        <span>
                            {language === 'vi' ? 'HSD: ' : 'Valid until: '}
                            <span className="font-semibold text-gray-900 dark:text-white">
                                {formatDate(voucher.startDate)} - {formatDate(voucher.endDate)}
                            </span>
                        </span>
                    </div>

                    {voucher.usageLimit &&
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                            <Ticket className="w-4 h-4" />
                            <span>
                                {language === 'vi' ? t("Common.conLai") : 'Remaining: '}
                                <span className="font-semibold text-gray-900 dark:text-white">
                                    {voucher.remainingUses}/{voucher.usageLimit}
                                </span>
                            </span>
                        </div>
          }
                </div>

                {/* Code & Copy button */}
                <div className="mt-4 pt-4 border-t border-dashed border-gray-300 dark:border-gray-600">
                    <div className="flex items-center justify-between gap-4">
                        <div className="flex-1">
                            <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                                {language === 'vi' ? t("Common.maVoucher") : 'Voucher code'}
                            </div>
                            <div className="px-4 py-2 bg-white dark:bg-gray-700 rounded-lg border-2 border-dashed border-amber-500 dark:border-amber-400">
                                <code className="text-lg font-bold text-amber-600 dark:text-amber-400 tracking-wider">
                                    {voucher.code}
                                </code>
                            </div>
                        </div>
                        
                        <button
              onClick={handleCopy}
              disabled={!voucher.isValid || isExpired || isOutOfUses}
              className={`px-6 py-3 rounded-lg font-semibold transition-all flex items-center gap-2 ${
              voucher.isValid && !isExpired && !isOutOfUses ?
              'bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-600 hover:to-orange-600 shadow-md hover:shadow-lg' :
              'bg-gray-300 dark:bg-gray-700 text-gray-500 cursor-not-allowed'}`
              }>
              
                            {copied ?
              <>
                                    <Check className="w-5 h-5" />
                                    {language === 'vi' ? t("Common.daSao") : 'Copied'}
                                </> :

              <>
                                    <Copy className="w-5 h-5" />
                                    {language === 'vi' ? t("Common.saoMa") : 'Copy'}
                                </>
              }
                        </button>
                    </div>
                </div>
            </div>
        </div>);

};