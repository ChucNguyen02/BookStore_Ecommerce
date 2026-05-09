import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
    X,
    Percent,
    DollarSign,
    Calendar,
    Users,
    User,
    TrendingUp,
    Clock,
    CheckCircle,
    XCircle,
} from 'lucide-react';
import { adminVoucherService } from '../../../services';
import { type VoucherResponse } from '../../../types/voucher.types';
import LoadingSpinner from '../common/LoadingSpinner';

interface VoucherDetailModalProps {
    voucherId: string;
    onClose: () => void;
}

export default function VoucherDetailModal({ voucherId, onClose }: VoucherDetailModalProps) {
    const { t } = useTranslation();
    const [voucher, setVoucher] = useState<VoucherResponse | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchVoucherDetail();
    }, [voucherId]);

    const fetchVoucherDetail = async () => {
        try {
            setIsLoading(true);
            setError(null);
            const data = await adminVoucherService.getVoucherById(voucherId);
            setVoucher(data);
        } catch (err: any) {
            setError(err.message || 'Failed to fetch voucher details');
        } finally {
            setIsLoading(false);
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

    if (error || !voucher) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-3xl p-8">
                    <p className="text-red-600 dark:text-red-400">{error || t('admin.voucherNotFound')}</p>
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

    const getDiscountDisplay = () => {
        if (voucher.discountType === 'PERCENTAGE') {
            return (
                <div className="flex items-center space-x-2 text-3xl font-bold text-purple-600 dark:text-purple-400">
                    <Percent className="w-8 h-8" />
                    <span>{voucher.discountValue}%</span>
                </div>
            );
        }
        return (
            <div className="flex items-center space-x-2 text-3xl font-bold text-green-600 dark:text-green-400">
                <DollarSign className="w-8 h-8" />
                <span>{voucher.discountValue}</span>
            </div>
        );
    };

    const getRemainingUses = () => {
        if (!voucher.usageLimit) return '∞';
        return voucher.remainingUses || 0;
    };

    const getUsagePercentage = () => {
        if (!voucher.usageLimit) return 0;
        return (voucher.usedCount / voucher.usageLimit) * 100;
    };

    const getDaysRemaining = () => {
        const end = new Date(voucher.endDate);
        const now = new Date();
        const daysLeft = Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
        return daysLeft;
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-3xl my-8 animate-scaleIn max-h-[90vh] flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                        {t('admin.voucherDetails')}
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-smooth hover-scale"
                    >
                        <X className="w-6 h-6 text-gray-500 dark:text-gray-400" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6 overflow-y-auto flex-1">
                    {/* Voucher Code Card */}
                    <div className="animated-gradient rounded-2xl p-6 text-white stagger-item hover-lift shadow-xl">
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <p className="text-sm opacity-80 mb-1">{t('admin.voucherCode')}</p>
                                <p className="text-3xl font-bold font-mono tracking-wider">{voucher.code}</p>
                            </div>
                            <div className="text-right">
                                {voucher.isValid ? (
                                    <div className="flex items-center space-x-2 glass-dark px-4 py-2 rounded-full shadow-lg">
                                        <CheckCircle className="w-5 h-5" />
                                        <span className="font-semibold">{t('admin.active')}</span>
                                    </div>
                                ) : (
                                    <div className="flex items-center space-x-2 glass-dark px-4 py-2 rounded-full shadow-lg">
                                        <XCircle className="w-5 h-5" />
                                        <span className="font-semibold">{t('admin.inactive')}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                        {voucher.description && (
                            <p className="text-sm opacity-90 leading-relaxed">{voucher.description}</p>
                        )}
                    </div>

                    {/* Discount Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="card stagger-item hover-scale">
                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-3 font-medium">
                                {t('admin.discountValue')}
                            </p>
                            {getDiscountDisplay()}
                            {voucher.maxDiscountAmount && (
                                <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                                    <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center space-x-1.5">
                                        <span className="font-medium">{t('admin.maxDiscount')}:</span>
                                        <span className="text-amber-600 dark:text-amber-400 font-semibold">
                                            ${voucher.maxDiscountAmount}
                                        </span>
                                    </p>
                                </div>
                            )}
                        </div>

                        <div className="card stagger-item hover-scale">
                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-3 font-medium">
                                {t('admin.minOrderValue')}
                            </p>
                            <div className="flex items-center space-x-2 text-3xl font-bold text-gray-900 dark:text-white">
                                <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-amber-600 dark:from-amber-600 dark:to-amber-700 rounded-xl flex items-center justify-center shadow-lg">
                                    <DollarSign className="w-7 h-7 text-white" />
                                </div>
                                <span>{voucher.minOrderValue}</span>
                            </div>
                        </div>
                    </div>

                    {/* Usage Statistics */}
                    <div className="card stagger-item">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center space-x-2">
                                <TrendingUp className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                                <span>{t('admin.usageStatistics')}</span>
                            </h3>
                            <div className="flex items-center space-x-2 px-4 py-2 bg-purple-50 dark:bg-purple-900/30 rounded-xl border border-purple-200 dark:border-purple-700/50">
                                <span className="text-sm font-semibold text-purple-700 dark:text-purple-400">
                                    {voucher.usedCount} / {getRemainingUses()}
                                </span>
                            </div>
                        </div>

                        {voucher.usageLimit && (
                            <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-4 overflow-hidden shadow-inner">
                                <div
                                    className="bg-gradient-to-r from-purple-500 via-pink-500 to-purple-600 dark:from-purple-600 dark:via-pink-600 dark:to-purple-700 h-full transition-smooth shadow-lg"
                                    style={{ width: `${Math.min(getUsagePercentage(), 100)}%` }}
                                />
                            </div>
                        )}

                        <div className="mt-6 grid grid-cols-2 gap-4">
                            <div className="p-4 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-xl border border-blue-200 dark:border-blue-700/50">
                                <p className="text-sm text-blue-600 dark:text-blue-400 font-medium mb-1">
                                    {t('admin.timesUsed')}
                                </p>
                                <p className="text-3xl font-bold text-blue-700 dark:text-blue-300">
                                    {voucher.usedCount}
                                </p>
                            </div>
                            <div className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl border border-purple-200 dark:border-purple-700/50">
                                <p className="text-sm text-purple-600 dark:text-purple-400 font-medium mb-1">
                                    {t('admin.remainingUses')}
                                </p>
                                <p className="text-3xl font-bold text-purple-700 dark:text-purple-300">
                                    {getRemainingUses()}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Validity Period */}
                    <div className="card stagger-item">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
                            <Calendar className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                            <span>{t('admin.validityPeriod')}</span>
                        </h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl border border-gray-200 dark:border-gray-600">
                                <div className="flex items-center space-x-2 text-gray-500 dark:text-gray-400 mb-2">
                                    <Calendar className="w-4 h-4" />
                                    <span className="text-sm font-medium">{t('admin.startDate')}</span>
                                </div>
                                <p className="text-lg font-bold text-gray-900 dark:text-white">
                                    {new Date(voucher.startDate).toLocaleDateString()}
                                </p>
                            </div>
                            <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl border border-gray-200 dark:border-gray-600">
                                <div className="flex items-center space-x-2 text-gray-500 dark:text-gray-400 mb-2">
                                    <Calendar className="w-4 h-4" />
                                    <span className="text-sm font-medium">{t('admin.endDate')}</span>
                                </div>
                                <p className="text-lg font-bold text-gray-900 dark:text-white">
                                    {new Date(voucher.endDate).toLocaleDateString()}
                                </p>
                            </div>
                        </div>

                        {voucher.isValid && getDaysRemaining() > 0 && (
                            <div className="mt-4 p-4 glass rounded-xl border border-blue-200 dark:border-blue-700/50 shadow-lg">
                                <div className="flex items-center space-x-3 text-blue-600 dark:text-blue-400">
                                    <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/40 rounded-full flex items-center justify-center">
                                        <Clock className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-sm">
                                            {getDaysRemaining()} {t('admin.daysRemaining')}
                                        </p>
                                        <p className="text-xs text-blue-500 dark:text-blue-400 opacity-80">
                                            {t('admin.voucherStillActive')}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {getDaysRemaining() <= 0 && (
                            <div className="mt-4 p-4 glass rounded-xl border border-red-200 dark:border-red-700/50 shadow-lg">
                                <div className="flex items-center space-x-3 text-red-600 dark:text-red-400">
                                    <div className="w-10 h-10 bg-red-100 dark:bg-red-900/40 rounded-full flex items-center justify-center">
                                        <XCircle className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-sm">{t('admin.expired')}</p>
                                        <p className="text-xs text-red-500 dark:text-red-400 opacity-80">
                                            {t('admin.voucherNoLongerValid')}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Voucher Type */}
                    <div className="card stagger-item hover-lift">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                            {t('admin.voucherType')}
                        </h3>
                        <div className="flex items-center space-x-4 p-4 bg-gradient-to-r from-gray-50 to-white dark:from-gray-700/50 dark:to-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-600">
                            {voucher.isPersonal ? (
                                <>
                                    <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-cyan-500 dark:from-blue-600 dark:to-cyan-600 rounded-2xl flex items-center justify-center shadow-lg hover-scale">
                                        <User className="w-7 h-7 text-white" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-bold text-lg text-gray-900 dark:text-white mb-1">
                                            {t('admin.personalVoucher')}
                                        </p>
                                        <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                                            {t('admin.personalVoucherDesc')}
                                        </p>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 dark:from-purple-600 dark:to-pink-600 rounded-2xl flex items-center justify-center shadow-lg hover-scale">
                                        <Users className="w-7 h-7 text-white" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-bold text-lg text-gray-900 dark:text-white mb-1">
                                            {t('admin.publicVoucher')}
                                        </p>
                                        <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                                            {t('admin.publicVoucherDesc')}
                                        </p>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}