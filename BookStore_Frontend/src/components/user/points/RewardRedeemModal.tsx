import { useTranslation } from 'react-i18next';import { useState } from 'react';
import { X, Star, Package, AlertCircle, Loader2 } from 'lucide-react';
import { useAppContext } from '../../../context/AppContext';
import type { RewardItemResponse } from '../../../types/reward.types';

interface RewardRedeemModalProps {
  reward: RewardItemResponse;
  currentPoints: number;
  redeeming: boolean;
  onConfirm: (rewardId: string, shippingAddress?: string, note?: string) => Promise<void>;
  onClose: () => void;
}

export const RewardRedeemModal = ({
  reward,
  currentPoints,
  redeeming,
  onConfirm,
  onClose
}: RewardRedeemModalProps) => {const { t } = useTranslation();
  const { language } = useAppContext();
  const [shippingAddress, setShippingAddress] = useState('');
  const [note, setNote] = useState('');

  const needsShipping = reward.type === 'BOOK' || reward.type === 'GIFT';
  const pointsAfter = currentPoints - reward.pointsRequired;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onConfirm(
      reward.id,
      needsShipping && shippingAddress ? shippingAddress : undefined,
      note || undefined
    );
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
                {/* Header */}
                <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-6 flex items-center justify-between z-10">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                        {language === 'vi' ? t("Common.xacNhanDoiQua") : 'Confirm Redemption'}
                    </h2>
                    <button
            onClick={onClose}
            disabled={redeeming}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors">
            
                        <X className="w-6 h-6 text-gray-600 dark:text-gray-400" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {/* Reward Info */}
                    <div className="flex gap-4">
                        {reward.imageUrl &&
            <img
              src={reward.imageUrl}
              alt={reward.name}
              className="w-32 h-32 rounded-xl object-cover flex-shrink-0" />

            }
                        <div className="flex-1">
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                                {reward.name}
                            </h3>
                            {reward.description &&
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">
                                    {reward.description}
                                </p>
              }
                            <div className="flex items-center gap-2">
                                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${reward.type === 'BOOK' ?
                'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400' :
                reward.type === 'VOUCHER' ?
                'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400' :
                'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'}`
                }>
                                    {reward.type}
                                </span>
                                {reward.bookTitle &&
                <span className="text-sm text-gray-600 dark:text-gray-400">
                                        • {reward.bookTitle}
                                    </span>
                }
                            </div>
                        </div>
                    </div>

                    {/* Points Summary */}
                    <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-gray-700 dark:to-gray-600 rounded-xl p-4 border-2 border-amber-200 dark:border-amber-800">
                        <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-600 dark:text-gray-400">
                                    {language === 'vi' ? t("Common.diemHienTai") : 'Current Points:'}
                                </span>
                                <span className="font-semibold text-gray-900 dark:text-white flex items-center gap-1">
                                    <Star className="w-4 h-4 text-amber-500" />
                                    {currentPoints.toLocaleString()}
                                </span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-600 dark:text-gray-400">
                                    {language === 'vi' ? t("Common.diemCanDung") : 'Points Required:'}
                                </span>
                                <span className="font-semibold text-red-600 dark:text-red-400 flex items-center gap-1">
                                    <Star className="w-4 h-4" />
                                    -{reward.pointsRequired.toLocaleString()}
                                </span>
                            </div>
                            <div className="pt-2 border-t border-amber-300 dark:border-amber-700 flex items-center justify-between">
                                <span className="font-semibold text-gray-900 dark:text-white">
                                    {language === 'vi' ? t("Common.diemConLai") : 'Remaining Points:'}
                                </span>
                                <span className="font-bold text-xl text-gray-900 dark:text-white flex items-center gap-1">
                                    <Star className="w-5 h-5 text-amber-500" />
                                    {pointsAfter.toLocaleString()}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Voucher Info */}
                    {reward.type === 'VOUCHER' && reward.voucherDiscountValue &&
          <div className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-4 border border-purple-200 dark:border-purple-800">
                            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                                {language === 'vi' ? t("Common.thongTinVoucher") : 'Voucher Details'}
                            </h4>
                            <p className="text-sm text-gray-700 dark:text-gray-300">
                                {language === 'vi' ? t("Common.giam") : 'Discount: '}
                                <span className="font-bold text-purple-600 dark:text-purple-400">
                                    {reward.voucherDiscountType === 'PERCENTAGE' ?
                `${reward.voucherDiscountValue}%` :
                `${reward.voucherDiscountValue.toLocaleString()}đ`}
                                </span>
                            </p>
                        </div>
          }

                    {/* Shipping Address */}
                    {needsShipping &&
          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                {language === 'vi' ? t("Common.diaChiGiaoHang") : 'Shipping Address'} *
                            </label>
                            <textarea
              value={shippingAddress}
              onChange={(e) => setShippingAddress(e.target.value)}
              required
              rows={3}
              placeholder={language === 'vi' ? t("Common.nhapDiaChiGiaoHang") : 'Enter full shipping address...'}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-amber-500 dark:focus:ring-amber-400 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 resize-none" />
            
                            <p className="text-xs text-gray-500 dark:text-gray-500 mt-1 flex items-center gap-1">
                                <Package className="w-3 h-3" />
                                {language === 'vi' ? t("Common.vuiLongNhapDiaChi") :

              'Please enter accurate address for delivery'}
                            </p>
                        </div>
          }

                    {/* Note */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            {language === 'vi' ? t("Common.ghiChuTuyChon") : 'Note (optional)'}
                        </label>
                        <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={2}
              placeholder={language === 'vi' ? t("Common.themGhiChuNeuCan") : 'Add note if needed...'}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-amber-500 dark:focus:ring-amber-400 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 resize-none" />
            
                    </div>

                    {/* Warning */}
                    <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 border border-blue-200 dark:border-blue-800">
                        <div className="flex gap-3">
                            <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                            <div className="text-sm text-blue-900 dark:text-blue-300">
                                <p className="font-semibold mb-1">
                                    {language === 'vi' ? t("Common.luuY") : 'Note:'}
                                </p>
                                <ul className="space-y-1 text-blue-800 dark:text-blue-400">
                                    <li>• {language === 'vi' ? t("Common.khongTheHoanDiemSau") :

                    'Points cannot be refunded after redemption'}</li>
                                    <li>• {language === 'vi' ? t("Common.xuLyTrongVong13") :

                    'Processing within 1-3 business days'}</li>
                                    {needsShipping &&
                  <li>• {language === 'vi' ? t("Common.giaoHangMienPhiCho") :

                    'Free shipping for all reward redemptions'}</li>
                  }
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3">
                        <button
              type="button"
              onClick={onClose}
              disabled={redeeming}
              className="flex-1 px-6 py-3 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50">
              
                            {language === 'vi' ? t("Common.huy") : 'Cancel'}
                        </button>
                        <button
              type="submit"
              disabled={redeeming || needsShipping && !shippingAddress}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 dark:from-amber-600 dark:to-orange-600 text-white rounded-xl font-bold hover:from-amber-600 hover:to-orange-600 dark:hover:from-amber-700 dark:hover:to-orange-700 transition-all disabled:opacity-50 shadow-lg hover:shadow-xl flex items-center justify-center gap-2">
              
                            {redeeming ?
              <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    {language === 'vi' ? t("Common.dangXuLy") : 'Processing...'}
                                </> :

              <>
                                    <Star className="w-5 h-5" />
                                    {language === 'vi' ? t("Common.xacNhanDoi") : 'Confirm Redeem'}
                                </>
              }
                        </button>
                    </div>
                </form>
            </div>
        </div>);

};