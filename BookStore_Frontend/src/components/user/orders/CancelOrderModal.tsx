import { useTranslation } from 'react-i18next';import { useState } from 'react';
import { X, AlertTriangle, Loader2 } from 'lucide-react';
import { useAppContext } from '../../../context/AppContext';

interface CancelOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => Promise<void>;
  orderCode: string;
  loading?: boolean;
}

export const CancelOrderModal = ({
  isOpen,
  onClose,
  onConfirm,
  orderCode,
  loading = false
}: CancelOrderModalProps) => {const { t } = useTranslation();
  const { language } = useAppContext();
  const [reason, setReason] = useState('');
  const [selectedReason, setSelectedReason] = useState('');

  const predefinedReasons = [
  language === 'vi' ? t("Common.doiYKhongMuonMua") : 'Changed my mind',
  language === 'vi' ? t("Common.timDuocGiaTotHon") : 'Found better price',
  language === 'vi' ? t("Common.datNhamSanPham") : 'Ordered wrong item',
  language === 'vi' ? t("Common.thoiGianGiaoHangQua") : 'Delivery time too long',
  language === 'vi' ? t("Common.lyDoKhac") : 'Other reason'];


  const handleSubmit = async () => {
    const finalReason = selectedReason === (language === 'vi' ? t("Common.lyDoKhac") : 'Other reason') ?
    reason :
    selectedReason;

    if (!finalReason.trim()) return;

    await onConfirm(finalReason);
    handleClose();
  };

  const handleClose = () => {
    setReason('');
    setSelectedReason('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-md w-full shadow-2xl animate-fadeInUp">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center">
                            <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                                {language === 'vi' ? t("Common.huyDonHang") : 'Cancel Order'}
                            </h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                {orderCode}
                            </p>
                        </div>
                    </div>
                    <button
            onClick={handleClose}
            disabled={loading}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors disabled:opacity-50">
            
                        <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 space-y-4">
                    <p className="text-gray-600 dark:text-gray-400">
                        {language === 'vi' ? t("Common.vuiLongChoChungToi") :

            'Please let us know why you want to cancel this order.'}
                    </p>

                    {/* Predefined Reasons */}
                    <div className="space-y-2">
                        {predefinedReasons.map((r) =>
            <label
              key={r}
              className={`
                                    flex items-center gap-3 p-4 border-2 rounded-xl cursor-pointer transition-all
                                    ${selectedReason === r ?
              'border-red-500 bg-red-50 dark:bg-red-900/10' :
              'border-gray-200 dark:border-gray-700 hover:border-red-300 dark:hover:border-red-800'}
                                `
              }>
              
                                <input
                type="radio"
                name="reason"
                value={r}
                checked={selectedReason === r}
                onChange={(e) => setSelectedReason(e.target.value)}
                disabled={loading}
                className="w-4 h-4 text-red-600 focus:ring-red-500" />
              
                                <span className="text-sm font-medium text-gray-900 dark:text-white">
                                    {r}
                                </span>
                            </label>
            )}
                    </div>

                    {/* Custom Reason */}
                    {selectedReason === (language === 'vi' ? t("Common.lyDoKhac") : 'Other reason') &&
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            rows={4}
            disabled={loading}
            placeholder={language === 'vi' ? t("Common.nhapLyDoCuaBan") : 'Enter your reason...'}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-red-500 dark:focus:ring-red-400 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 resize-none" />

          }
                </div>

                {/* Footer */}
                <div className="flex gap-3 p-6 border-t border-gray-200 dark:border-gray-700">
                    <button
            onClick={handleClose}
            disabled={loading}
            className="flex-1 px-6 py-3 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50">
            
                        {language === 'vi' ? t("Common.dong") : 'Close'}
                    </button>
                    <button
            onClick={handleSubmit}
            disabled={loading || !selectedReason || selectedReason === (language === 'vi' ? t("Common.lyDoKhac") : 'Other reason') && !reason.trim()}
            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800 text-white rounded-xl font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
            
                        {loading ?
            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                {language === 'vi' ? t("Common.dangXuLy") : 'Processing...'}
                            </> :

            language === 'vi' ? t("Common.xacNhanHuy") : 'Confirm Cancel'
            }
                    </button>
                </div>
            </div>
        </div>);

};