import { useTranslation } from 'react-i18next';import { CreditCard, Banknote, Wallet, Building2 } from 'lucide-react';
import { useAppContext } from '../../../context/AppContext';
import type { PaymentMethod } from '../../../types/enum';

interface PaymentMethodBadgeProps {
  method: PaymentMethod;
  size?: 'sm' | 'md' | 'lg';
}

export const PaymentMethodBadge = ({ method, size = 'md' }: PaymentMethodBadgeProps) => {const { t } = useTranslation();
if ((method as any) === 'LOCAL') return null;
  const { language } = useAppContext();

  const getMethodConfig = () => {
    const configs = {
      COD: {
        label: language === 'vi' ? t("Common.thanhToanKhiNhanHang") : 'Cash on Delivery',
        shortLabel: 'COD',
        icon: Banknote,
        bgColor: 'bg-green-100 dark:bg-green-900/20',
        textColor: 'text-green-700 dark:text-green-400',
        iconColor: 'text-green-600 dark:text-green-500'
      },
      BANK_TRANSFER: {
        label: language === 'vi' ? t("Common.chuyenKhoanNganHang") : 'Bank Transfer',
        shortLabel: language === 'vi' ? t("Common.chuyenKhoan") : 'Transfer',
        icon: Building2,
        bgColor: 'bg-blue-100 dark:bg-blue-900/20',
        textColor: 'text-blue-700 dark:text-blue-400',
        iconColor: 'text-blue-600 dark:text-blue-500'
      },
      MOMO: {
        label: 'MoMo',
        shortLabel: 'MoMo',
        icon: Wallet,
        bgColor: 'bg-pink-100 dark:bg-pink-900/20',
        textColor: 'text-pink-700 dark:text-pink-400',
        iconColor: 'text-pink-600 dark:text-pink-500'
      },
      VNPAY: {
        label: 'VNPay',
        shortLabel: 'VNPay',
        icon: CreditCard,
        bgColor: 'bg-indigo-100 dark:bg-indigo-900/20',
        textColor: 'text-indigo-700 dark:text-indigo-400',
        iconColor: 'text-indigo-600 dark:text-indigo-500'
      }
    };

    return (configs as any)[method] || configs.COD;
  };

  const config = getMethodConfig();
  const Icon = config.icon;

  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
    lg: 'px-4 py-2 text-base'
  };

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5'
  };

  return (
    <span className={`
            inline-flex items-center gap-1.5 rounded-full font-semibold
            ${config.bgColor} ${config.textColor} ${sizeClasses[size]}
        `}>
            <Icon className={`${iconSizes[size]} ${config.iconColor}`} />
            {size === 'sm' ? config.shortLabel : config.label}
        </span>);

};