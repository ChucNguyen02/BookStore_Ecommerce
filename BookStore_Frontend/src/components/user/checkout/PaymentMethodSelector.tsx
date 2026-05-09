import { CreditCard, Banknote, Wallet, Check, Zap, Terminal } from 'lucide-react';
import type { PaymentMethod } from '../../../types/enum';
import { useTranslation } from 'react-i18next';
import env from '../../../utils/env.config';

interface PaymentMethodSelectorProps {
  selectedMethod: PaymentMethod;
  onSelectMethod: (method: PaymentMethod) => void;
}

export const PaymentMethodSelector = ({ selectedMethod, onSelectMethod }: PaymentMethodSelectorProps) => {
  const { t } = useTranslation();

  const paymentMethods = [
    {
      id: 'COD' as PaymentMethod,
      name: t('paymentMethodSelector.methods.cod.name'),
      description: t('paymentMethodSelector.methods.cod.description'),
      icon: <Banknote className="w-6 h-6" />,
      color: 'from-green-500 to-emerald-500',
      badge: null,
    },
    ...(env.ENABLE_LOCAL_PAYMENT ? [
      {
        id: 'LOCAL' as PaymentMethod,
        name: t('paymentMethodSelector.methods.local.name', 'Local test'),
        description: t('paymentMethodSelector.methods.local.description', 'Simulate payment locally (no gateway)'),
        icon: <Terminal className="w-6 h-6" />,
        color: 'from-slate-500 to-gray-700',
        badge: t('paymentMethodSelector.methods.local.badge', 'Dev only'),
      },
    ] : []),
    {
      id: 'PAYOS' as PaymentMethod,
      name: 'PayOS',
      description: t('paymentMethodSelector.methods.payos.description', 'Thanh toán qua QR Code, chuyển khoản ngân hàng'),
      icon: <Zap className="w-6 h-6" />,
      color: 'from-blue-500 to-indigo-600',
      badge: t('paymentMethodSelector.methods.payos.badge', 'Khuyên dùng'),
    },
    {
      id: 'MOMO' as PaymentMethod,
      name: t('paymentMethodSelector.methods.momo.name'),
      description: t('paymentMethodSelector.methods.momo.description'),
      icon: <Wallet className="w-6 h-6" />,
      color: 'from-pink-500 to-rose-500',
      badge: null,
    },
    {
      id: 'VNPAY' as PaymentMethod,
      name: t('paymentMethodSelector.methods.vnpay.name'),
      description: t('paymentMethodSelector.methods.vnpay.description'),
      icon: <CreditCard className="w-6 h-6" />,
      color: 'from-red-500 to-orange-500',
      badge: null,
    },
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
      <h3 className="text-xl font-serif font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
        <CreditCard className="w-6 h-6 text-purple-600 dark:text-purple-400" />
        {t('paymentMethodSelector.title')}
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {paymentMethods.map((method) => (
          <button
            key={method.id}
            onClick={() => onSelectMethod(method.id)}
            className={`relative p-4 border-2 rounded-xl text-left transition-all ${selectedMethod === method.id
                ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                : 'border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-700'
              }`}
          >
            {/* Recommended badge */}
            {method.badge && (
              <span className="absolute -top-2.5 left-3 px-2 py-0.5 bg-blue-600 text-white text-xs font-semibold rounded-full">
                {method.badge}
              </span>
            )}
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <div className={`p-2 bg-gradient-to-r ${method.color} text-white rounded-lg`}>
                  {method.icon}
                </div>
                {selectedMethod === method.id && (
                  <Check className="w-5 h-5 text-purple-600 dark:text-purple-400 flex-shrink-0" />
                )}
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                  {method.name}
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {method.description}
                </p>
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Payment Notes */}
      <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
        <p className="text-sm text-blue-800 dark:text-blue-300">
          {t('paymentMethodSelector.secureNote')}
        </p>
        {selectedMethod === 'PAYOS' && (
          <p className="text-sm text-blue-700 dark:text-blue-400 mt-1 font-medium">
            💡 PayOS hỗ trợ 40+ ngân hàng Việt Nam và thanh toán QR nhanh chóng.
          </p>
        )}
      </div>
    </div>
  );
};