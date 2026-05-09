import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
    X,
    Package,
    Clock,
    CheckCircle,
    XCircle,
    Truck,
    MapPin,
    Award,
    Loader2,
} from 'lucide-react';
import { adminRewardService } from '../../../services';
import { type UserRewardResponse } from '../../../types/reward.types';
import { type UpdateRedemptionStatusRequest } from '../../../types/admin.types';
import { RedemptionStatus } from '../../../types/enum';
import LoadingSpinner from '../common/LoadingSpinner';
import toast from 'react-hot-toast';

interface RedemptionDetailModalProps {
    redemptionId: string;
    onClose: () => void;
    onUpdate: () => void;
}

export default function RedemptionDetailModal({
    redemptionId,
    onClose,
    onUpdate,
}: RedemptionDetailModalProps) {
    const { t } = useTranslation();
    const [redemption, setRedemption] = useState<UserRewardResponse | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);
    const [error, setError] = useState<string | null>(null);
    
    const [updateData, setUpdateData] = useState<UpdateRedemptionStatusRequest>({
        status: 'PENDING',
        trackingNumber: '',
        note: '',
    });

    useEffect(() => {
        fetchRedemptionDetail();
    }, [redemptionId]);

    const fetchRedemptionDetail = async () => {
        try {
            setIsLoading(true);
            setError(null);
            
            // Get all redemptions and find the specific one
            // Note: Backend should have endpoint GET /admin/rewards/redemptions/{id}
            const allRedemptions = await adminRewardService.getAllRedemptions(0, 1000);
            const found = allRedemptions.content.find(r => r.id === redemptionId);
            
            if (found) {
                setRedemption(found);
                setUpdateData({
                    status: found.status,
                    trackingNumber: found.trackingNumber || '',
                    note: found.note || '',
                });
            } else {
                setError('Redemption not found');
            }
        } catch (err: any) {
            setError(err.message || 'Failed to fetch redemption details');
        } finally {
            setIsLoading(false);
        }
    };

    const handleUpdateStatus = async () => {
        if (!redemption) return;

        try {
            setIsUpdating(true);
            await adminRewardService.updateRedemptionStatus(redemptionId, updateData);
            toast.success('Redemption status updated successfully');
            onUpdate();
            onClose();
        } catch (err: any) {
            toast.error(err.message || 'Failed to update redemption status');
        } finally {
            setIsUpdating(false);
        }
    };

    if (isLoading) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-3xl p-8">
                    <LoadingSpinner />
                </div>
            </div>
        );
    }

    if (error || !redemption) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-3xl p-8">
                    <p className="text-red-600 dark:text-red-400">{error || t('admin.redemptionNotFound')}</p>
                    <button
                        onClick={onClose}
                        className="mt-4 px-6 py-2 bg-gray-200 dark:bg-gray-700 rounded-xl"
                    >
                        {t('common.close')}
                    </button>
                </div>
            </div>
        );
    }

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'PENDING':
                return <Clock className="w-6 h-6" />;
            case 'PROCESSING':
                return <Package className="w-6 h-6" />;
            case 'COMPLETED':
                return <CheckCircle className="w-6 h-6" />;
            case 'CANCELLED':
                return <XCircle className="w-6 h-6" />;
            default:
                return <Clock className="w-6 h-6" />;
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'PENDING':
                return 'from-yellow-500 to-orange-500';
            case 'PROCESSING':
                return 'from-blue-500 to-cyan-500';
            case 'COMPLETED':
                return 'from-green-500 to-emerald-500';
            case 'CANCELLED':
                return 'from-red-500 to-pink-500';
            default:
                return 'from-gray-500 to-gray-600';
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn overflow-y-auto">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-3xl my-8 animate-scaleIn">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                        {t('admin.redemptionDetails')}
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors"
                    >
                        <X className="w-6 h-6 text-gray-500" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6 max-h-[calc(100vh-200px)] overflow-y-auto">
                    {/* Status Card */}
                    <div className={`bg-gradient-to-r ${getStatusColor(redemption.status)} rounded-2xl p-6 text-white`}>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                                    {getStatusIcon(redemption.status)}
                                </div>
                                <div>
                                    <p className="text-sm opacity-80">{t('admin.status')}</p>
                                    <p className="text-2xl font-bold">{redemption.status}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-sm opacity-80">{t('admin.redeemedAt')}</p>
                                <p className="font-semibold">
                                    {new Date(redemption.redeemedAt).toLocaleDateString()}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Reward Info */}
                    <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                            {t('admin.rewardInformation')}
                        </h3>
                        <div className="flex items-center space-x-4 mb-4">
                            {redemption.reward.imageUrl ? (
                                <img
                                    src={redemption.reward.imageUrl}
                                    alt={redemption.reward.name}
                                    className="w-20 h-20 rounded-lg object-cover"
                                />
                            ) : (
                                <div className="w-20 h-20 bg-gradient-to-br from-amber-500 to-orange-500 rounded-lg flex items-center justify-center">
                                    <Award className="w-10 h-10 text-white" />
                                </div>
                            )}
                            <div className="flex-1">
                                <p className="text-lg font-bold text-gray-900 dark:text-white">
                                    {redemption.reward.name}
                                </p>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    {redemption.reward.description}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600 dark:text-gray-400">{t('admin.type')}</span>
                            <span className="font-semibold text-gray-900 dark:text-white">
                                {redemption.reward.type}
                            </span>
                        </div>
                        <div className="flex items-center justify-between text-sm mt-2">
                            <span className="text-gray-600 dark:text-gray-400">{t('admin.pointsSpent')}</span>
                            <div className="flex items-center space-x-2">
                                <Award className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                                <span className="font-semibold text-gray-900 dark:text-white">
                                    {redemption.pointsSpent.toLocaleString()}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Voucher Code (if applicable) */}
                    {redemption.voucherCode && (
                        <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl p-6 text-white">
                            <p className="text-sm opacity-80 mb-2">{t('admin.voucherCode')}</p>
                            <p className="text-2xl font-bold font-mono">{redemption.voucherCode}</p>
                        </div>
                    )}

                    {/* Shipping Info */}
                    {redemption.shippingAddress && (
                        <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6">
                            <div className="flex items-center space-x-2 mb-4">
                                <MapPin className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                    {t('admin.shippingAddress')}
                                </h3>
                            </div>
                            <p className="text-gray-900 dark:text-white">
                                {redemption.shippingAddress}
                            </p>
                        </div>
                    )}

                    {/* Update Status Section */}
                    <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6 space-y-4">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            {t('admin.updateRedemptionStatus')}
                        </h3>

                        {/* Status Selection */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                {t('admin.status')}
                            </label>
                            <select
                                value={updateData.status}
                                onChange={(e) =>
                                    setUpdateData({ ...updateData, status: e.target.value as RedemptionStatus })
                                }
                                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                            >
                                <option value="PENDING">{t('admin.pending')}</option>
                                <option value="PROCESSING">{t('admin.processing')}</option>
                                <option value="COMPLETED">{t('admin.completed')}</option>
                                <option value="CANCELLED">{t('admin.cancelled')}</option>
                            </select>
                        </div>

                        {/* Tracking Number */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                <div className="flex items-center space-x-2">
                                    <Truck className="w-4 h-4" />
                                    <span>{t('admin.trackingNumber')}</span>
                                </div>
                            </label>
                            <input
                                type="text"
                                value={updateData.trackingNumber || ''}
                                onChange={(e) =>
                                    setUpdateData({ ...updateData, trackingNumber: e.target.value })
                                }
                                placeholder={t('admin.enterTrackingNumber')}
                                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent font-mono"
                            />
                        </div>

                        {/* Note */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                {t('admin.note')}
                            </label>
                            <textarea
                                value={updateData.note || ''}
                                onChange={(e) => setUpdateData({ ...updateData, note: e.target.value })}
                                placeholder={t('admin.addNoteOptional')}
                                rows={3}
                                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent resize-none"
                            />
                        </div>
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
                            onClick={handleUpdateStatus}
                            disabled={isUpdating}
                            className="flex-1 px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                        >
                            {isUpdating && <Loader2 className="w-5 h-5 animate-spin" />}
                            <span>{t('admin.updateStatus')}</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}