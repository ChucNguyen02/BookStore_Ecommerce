import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { X, Loader2, Upload } from 'lucide-react';
import { adminRewardService } from '../../../services';
import { type RewardItemRequest } from '../../../types/reward.types';
import { RewardType, VoucherDiscountType } from '../../../types/enum';
import toast from 'react-hot-toast';

interface RewardFormModalProps {
    rewardId?: string;
    onClose: () => void;
    onSuccess: () => void;
}

export default function RewardFormModal({ rewardId, onClose, onSuccess }: RewardFormModalProps) {
    const { t } = useTranslation();
    const isEdit = !!rewardId;
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [formData, setFormData] = useState<RewardItemRequest>({
        name: '',
        description: '',
        type: 'GIFT',
        pointsRequired: 0,
        stockQuantity: 0,
        imageUrl: '',
        bookId: undefined,
        voucherDiscountType: undefined,
        voucherDiscountValue: undefined,
        startDate: undefined,
        endDate: undefined,
        isActive: true,
    });

    useEffect(() => {
        if (rewardId) {
            fetchRewardData();
        }
    }, [rewardId]);

    const fetchRewardData = async () => {
        try {
            setIsLoading(true);
            const reward = await adminRewardService.getRewardById(rewardId!);
            
            setFormData({
                name: reward.name,
                description: reward.description || '',
                type: reward.type,
                pointsRequired: reward.pointsRequired,
                stockQuantity: reward.stockQuantity,
                imageUrl: reward.imageUrl || '',
                bookId: reward.bookId || undefined,
                voucherDiscountType: reward.voucherDiscountType || undefined,
                voucherDiscountValue: reward.voucherDiscountValue || undefined,
                startDate: reward.startDate?.split('T')[0],
                endDate: reward.endDate?.split('T')[0],
                isActive: reward.isAvailable,
            });
        } catch (err: any) {
            toast.error(err.message || 'Failed to fetch reward data');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!formData.name.trim()) {
            toast.error('Reward name is required');
            return;
        }

        if (formData.pointsRequired <= 0) {
            toast.error('Points required must be greater than 0');
            return;
        }

        if (formData.stockQuantity < 0) {
            toast.error('Stock quantity cannot be negative');
            return;
        }

        try {
            setIsSubmitting(true);

            if (isEdit) {
                await adminRewardService.updateReward(rewardId!, formData);
                toast.success('Reward updated successfully');
            } else {
                await adminRewardService.createReward(formData);
                toast.success('Reward created successfully');
            }

            onSuccess();
        } catch (err: any) {
            toast.error(err.message || 'Failed to save reward');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleChange = (field: keyof RewardItemRequest, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    if (isLoading) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-3xl p-8">
                    <div className="flex items-center justify-center">
                        <Loader2 className="w-8 h-8 animate-spin text-amber-600" />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn overflow-y-auto">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-3xl my-8 animate-scaleIn">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                        {isEdit ? t('admin.editReward') : t('admin.createReward')}
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors"
                    >
                        <X className="w-6 h-6 text-gray-500" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[calc(100vh-200px)] overflow-y-auto">
                    {/* Reward Name */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            {t('admin.rewardName')} *
                        </label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => handleChange('name', e.target.value)}
                            placeholder={t('admin.rewardNamePlaceholder')}
                            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                            required
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            {t('admin.description')}
                        </label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => handleChange('description', e.target.value)}
                            placeholder={t('admin.rewardDescriptionPlaceholder')}
                            rows={3}
                            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent resize-none"
                        />
                    </div>

                    {/* Type */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            {t('admin.rewardType')} *
                        </label>
                        <select
                            value={formData.type}
                            onChange={(e) => handleChange('type', e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                        >
                            <option value="BOOK">{t('admin.book')}</option>
                            <option value="VOUCHER">{t('admin.voucher')}</option>
                            <option value="GIFT">{t('admin.gift')}</option>
                        </select>
                    </div>

                    {/* Points & Stock */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                {t('admin.pointsRequired')} *
                            </label>
                            <input
                                type="number"
                                value={formData.pointsRequired}
                                onChange={(e) => handleChange('pointsRequired', parseInt(e.target.value))}
                                min="0"
                                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                {t('admin.stockQuantity')} *
                            </label>
                            <input
                                type="number"
                                value={formData.stockQuantity}
                                onChange={(e) => handleChange('stockQuantity', parseInt(e.target.value))}
                                min="0"
                                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                                required
                            />
                        </div>
                    </div>

                    {/* Image URL */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            {t('admin.imageUrl')}
                        </label>
                        <input
                            type="text"
                            value={formData.imageUrl}
                            onChange={(e) => handleChange('imageUrl', e.target.value)}
                            placeholder="https://example.com/image.jpg"
                            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                        />
                    </div>

                    {/* Book ID (if type is BOOK) */}
                    {formData.type === 'BOOK' && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                {t('admin.bookId')}
                            </label>
                            <input
                                type="text"
                                value={formData.bookId || ''}
                                onChange={(e) => handleChange('bookId', e.target.value || undefined)}
                                placeholder={t('admin.bookIdPlaceholder')}
                                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                            />
                        </div>
                    )}

                    {/* Voucher Settings (if type is VOUCHER) */}
                    {formData.type === 'VOUCHER' && (
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    {t('admin.discountType')}
                                </label>
                                <select
                                    value={formData.voucherDiscountType || ''}
                                    onChange={(e) => handleChange('voucherDiscountType', e.target.value || undefined)}
                                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                                >
                                    <option value="">{t('admin.selectDiscountType')}</option>
                                    <option value="PERCENTAGE">{t('admin.percentage')}</option>
                                    <option value="FIXED_AMOUNT">{t('admin.fixedAmount')}</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    {t('admin.discountValue')}
                                </label>
                                <input
                                    type="number"
                                    value={formData.voucherDiscountValue || ''}
                                    onChange={(e) => handleChange('voucherDiscountValue', e.target.value ? parseFloat(e.target.value) : undefined)}
                                    min="0"
                                    step="0.01"
                                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                                />
                            </div>
                        </div>
                    )}

                    {/* Date Range */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                {t('admin.startDate')}
                            </label>
                            <input
                                type="date"
                                value={formData.startDate || ''}
                                onChange={(e) => handleChange('startDate', e.target.value || undefined)}
                                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                {t('admin.endDate')}
                            </label>
                            <input
                                type="date"
                                value={formData.endDate || ''}
                                onChange={(e) => handleChange('endDate', e.target.value || undefined)}
                                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                            />
                        </div>
                    </div>

                    {/* Active Status */}
                    <div className="flex items-center space-x-3">
                        <input
                            type="checkbox"
                            id="isActive"
                            checked={formData.isActive}
                            onChange={(e) => handleChange('isActive', e.target.checked)}
                            className="w-5 h-5 rounded border-gray-300 text-amber-600 focus:ring-amber-500"
                        />
                        <label htmlFor="isActive" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            {t('admin.activeReward')}
                        </label>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-6 py-3 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-xl font-medium transition-all"
                        >
                            {t('common.cancel')}
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="flex-1 px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                        >
                            {isSubmitting && <Loader2 className="w-5 h-5 animate-spin" />}
                            <span>{isEdit ? t('admin.updateReward') : t('admin.createReward')}</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}