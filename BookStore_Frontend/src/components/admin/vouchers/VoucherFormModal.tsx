import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { X, Loader2, DollarSign, Percent, Calendar } from 'lucide-react';
import { adminVoucherService } from '../../../services';
import { type VoucherRequest } from '../../../types/voucher.types';
// import { VoucherDiscountType } from '../../../types/enum';
import toast from 'react-hot-toast';

interface VoucherFormModalProps {
    voucherId?: string;
    onClose: () => void;
    onSuccess: () => void;
}

export default function VoucherFormModal({ voucherId, onClose, onSuccess }: VoucherFormModalProps) {
    const { t } = useTranslation();
    const isEdit = !!voucherId;
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [formData, setFormData] = useState<VoucherRequest>({
        code: '',
        description: '',
        discountType: 'PERCENTAGE',
        discountValue: 0,
        minOrderValue: 0,
        maxDiscountAmount: undefined,
        usageLimit: undefined,
        userId: undefined,
        startDate: new Date().toISOString().split('T')[0],
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        isActive: true,
    });

    useEffect(() => {
        if (voucherId) {
            fetchVoucherData();
        }
    }, [voucherId]);

    const fetchVoucherData = async () => {
        try {
            setIsLoading(true);
            const voucher = await adminVoucherService.getVoucherById(voucherId!);

            setFormData({
                code: voucher.code,
                description: voucher.description || '',
                discountType: voucher.discountType,
                discountValue: voucher.discountValue,
                minOrderValue: voucher.minOrderValue,
                maxDiscountAmount: voucher.maxDiscountAmount || undefined,
                usageLimit: voucher.usageLimit || undefined,
                userId: undefined, // Personal vouchers userId
                startDate: voucher.startDate.split('T')[0],
                endDate: voucher.endDate.split('T')[0],
                isActive: voucher.isValid,
            });
        } catch (err: any) {
            toast.error(err.message || 'Failed to fetch voucher data');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validation
        if (!formData.code.trim()) {
            toast.error('Voucher code is required');
            return;
        }

        if (formData.discountValue <= 0) {
            toast.error('Discount value must be greater than 0');
            return;
        }

        if (formData.discountType === 'PERCENTAGE' && formData.discountValue > 100) {
            toast.error('Percentage discount cannot exceed 100%');
            return;
        }

        if (formData.minOrderValue < 0) {
            toast.error('Minimum order value cannot be negative');
            return;
        }

        if (new Date(formData.startDate) > new Date(formData.endDate)) {
            toast.error('End date must be after start date');
            return;
        }

        try {
            setIsSubmitting(true);

            if (isEdit) {
                await adminVoucherService.updateVoucher(voucherId!, formData);
                toast.success('Voucher updated successfully');
            } else {
                await adminVoucherService.createVoucher(formData);
                toast.success('Voucher created successfully');
            }

            onSuccess();
        } catch (err: any) {
            toast.error(err.message || 'Failed to save voucher');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleChange = (field: keyof VoucherRequest, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    if (isLoading) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-3xl p-8">
                    <div className="flex items-center justify-center">
                        <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-3xl my-8 animate-scaleIn max-h-[90vh] flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                        {isEdit ? t('admin.editVoucher') : t('admin.createVoucher')}
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-white dark:hover:bg-gray-700 rounded-xl transition-smooth hover-scale"
                    >
                        <X className="w-6 h-6 text-gray-500 dark:text-gray-400" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-6 overflow-y-auto flex-1">
                    {/* Voucher Code */}
                    <div className="stagger-item">
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center space-x-1.5">
                            <span>{t('admin.voucherCode')}</span>
                            <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={formData.code}
                            onChange={(e) => handleChange('code', e.target.value.toUpperCase())}
                            placeholder="SUMMER2024"
                            className="input-field font-mono font-bold text-lg tracking-wider"
                            required
                        />
                        <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                            {t('admin.codeWillBeAutoUppercase')}
                        </p>
                    </div>

                    {/* Description */}
                    <div className="stagger-item">
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                            {t('admin.description')}
                        </label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => handleChange('description', e.target.value)}
                            placeholder={t('admin.voucherDescriptionPlaceholder')}
                            rows={3}
                            className="input-field resize-none"
                        />
                    </div>

                    {/* Discount Type & Value */}
                    <div className="grid grid-cols-2 gap-4 stagger-item">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center space-x-1.5">
                                <span>{t('admin.discountType')}</span>
                                <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <select
                                    value={formData.discountType}
                                    onChange={(e) => handleChange('discountType', e.target.value)}
                                    className="input-field appearance-none pr-10"
                                >
                                    <option value="PERCENTAGE">📊 {t('admin.percentage')}</option>
                                    <option value="FIXED_AMOUNT">💵 {t('admin.fixedAmount')}</option>
                                </select>
                                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center space-x-1.5">
                                <span>{t('admin.discountValue')}</span>
                                <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <input
                                    type="number"
                                    value={formData.discountValue}
                                    onChange={(e) => handleChange('discountValue', parseFloat(e.target.value))}
                                    min="0"
                                    max={formData.discountType === 'PERCENTAGE' ? 100 : undefined}
                                    step="0.01"
                                    className="input-field pl-10 font-semibold"
                                    required
                                />
                                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                    {formData.discountType === 'PERCENTAGE' ? (
                                        <Percent className="w-5 h-5 text-purple-500" />
                                    ) : (
                                        <DollarSign className="w-5 h-5 text-green-500" />
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Min Order & Max Discount */}
                    <div className="grid grid-cols-2 gap-4 stagger-item">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center space-x-1.5">
                                <span>{t('admin.minOrderValue')}</span>
                                <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <input
                                    type="number"
                                    value={formData.minOrderValue}
                                    onChange={(e) => handleChange('minOrderValue', parseFloat(e.target.value))}
                                    min="0"
                                    step="0.01"
                                    className="input-field pl-10 font-semibold"
                                    required
                                />
                                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                    <DollarSign className="w-5 h-5 text-amber-500" />
                                </div>
                            </div>
                        </div>

                        {formData.discountType === 'PERCENTAGE' && (
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                    {t('admin.maxDiscountAmount')}
                                </label>
                                <div className="relative">
                                    <input
                                        type="number"
                                        value={formData.maxDiscountAmount || ''}
                                        onChange={(e) => handleChange('maxDiscountAmount', e.target.value ? parseFloat(e.target.value) : undefined)}
                                        min="0"
                                        step="0.01"
                                        placeholder={t('admin.unlimited')}
                                        className="input-field pl-10"
                                    />
                                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                        <DollarSign className="w-5 h-5 text-gray-400" />
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Usage Limit */}
                    <div className="stagger-item">
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                            {t('admin.usageLimit')}
                        </label>
                        <input
                            type="number"
                            value={formData.usageLimit || ''}
                            onChange={(e) => handleChange('usageLimit', e.target.value ? parseInt(e.target.value) : undefined)}
                            min="1"
                            placeholder={t('admin.unlimitedUses')}
                            className="input-field"
                        />
                        <p className="mt-2 text-xs text-gray-500 dark:text-gray-400 flex items-center space-x-1.5">
                            <span>💡</span>
                            <span>{t('admin.leaveEmptyForUnlimited')}</span>
                        </p>
                    </div>

                    {/* Date Range */}
                    <div className="grid grid-cols-2 gap-4 stagger-item">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center space-x-1.5">
                                <Calendar className="w-4 h-4" />
                                <span>{t('admin.startDate')}</span>
                                <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="date"
                                value={formData.startDate}
                                onChange={(e) => handleChange('startDate', e.target.value)}
                                className="input-field"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center space-x-1.5">
                                <Calendar className="w-4 h-4" />
                                <span>{t('admin.endDate')}</span>
                                <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="date"
                                value={formData.endDate}
                                onChange={(e) => handleChange('endDate', e.target.value)}
                                className="input-field"
                                required
                            />
                        </div>
                    </div>

                    {/* Active Status */}
                    <div className="stagger-item">
                        <div className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-white dark:from-gray-700/50 dark:to-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-600">
                            <div className="flex items-center space-x-3">
                                <input
                                    type="checkbox"
                                    id="isActive"
                                    checked={formData.isActive}
                                    onChange={(e) => handleChange('isActive', e.target.checked)}
                                    className="w-5 h-5 rounded border-gray-300 dark:border-gray-600 text-purple-600 focus:ring-purple-500 dark:focus:ring-purple-400 transition-smooth cursor-pointer"
                                />
                                <label htmlFor="isActive" className="text-sm font-semibold text-gray-700 dark:text-gray-300 cursor-pointer">
                                    {t('admin.activeVoucher')}
                                </label>
                            </div>
                            <span className={`badge ${formData.isActive ? 'badge-success' : 'badge-danger'}`}>
                                {formData.isActive ? t('admin.active') : t('admin.inactive')}
                            </span>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                        <button
                            type="button"
                            onClick={onClose}
                            className="btn-secondary flex-1"
                        >
                            {t('common.cancel')}
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 dark:from-purple-600 dark:to-pink-600 dark:hover:from-purple-700 dark:hover:to-pink-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl hover-lift transition-smooth disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                        >
                            {isSubmitting && <Loader2 className="w-5 h-5 animate-spin" />}
                            <span>{isEdit ? t('admin.updateVoucher') : t('admin.createVoucher')}</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}