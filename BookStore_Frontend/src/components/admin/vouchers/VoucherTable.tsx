import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
    Eye,
    Edit,
    Trash2,
    ToggleLeft,
    ToggleRight,
    Percent,
    DollarSign,
    Users,
    User,
    Calendar,
    MoreVertical,
} from 'lucide-react';
import { type VoucherResponse } from '../../../types/voucher.types';
import ConfirmDialog from '../common/ConfirmDialog';

interface VoucherTableProps {
    vouchers: VoucherResponse[];
    onEdit: (voucherId: string) => void;
    onView: (voucherId: string) => void;
    onToggleActive: (voucherId: string) => void;
    onDelete: (voucherId: string) => void;
}

export default function VoucherTable({
    vouchers,
    onEdit,
    onView,
    onToggleActive,
    onDelete,
}: VoucherTableProps) {
    const { t } = useTranslation();
    const [activeMenu, setActiveMenu] = useState<string | null>(null);
    const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; voucherId: string | null }>({
        open: false,
        voucherId: null,
    });

    const handleDeleteClick = (voucherId: string) => {
        setDeleteDialog({ open: true, voucherId });
        setActiveMenu(null);
    };

    const handleDeleteConfirm = () => {
        if (deleteDialog.voucherId) {
            onDelete(deleteDialog.voucherId);
        }
        setDeleteDialog({ open: false, voucherId: null });
    };

    const getDiscountDisplay = (voucher: VoucherResponse) => {
        if (voucher.discountType === 'PERCENTAGE') {
            return (
                <div className="flex items-center space-x-1 text-purple-600 dark:text-purple-400">
                    <Percent className="w-4 h-4" />
                    <span className="font-semibold">{voucher.discountValue}%</span>
                </div>
            );
        }
        return (
            <div className="flex items-center space-x-1 text-green-600 dark:text-green-400">
                <DollarSign className="w-4 h-4" />
                <span className="font-semibold">${voucher.discountValue}</span>
            </div>
        );
    };

    const getStatusColor = (isValid: boolean) => {
        return isValid
            ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
            : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
    };

    const getRemainingUses = (voucher: VoucherResponse) => {
        if (!voucher.usageLimit) return '∞';
        return voucher.remainingUses || 0;
    };

    const isExpiringSoon = (endDate: string) => {
        const end = new Date(endDate);
        const now = new Date();
        const daysLeft = Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
        return daysLeft <= 7 && daysLeft > 0;
    };

    return (
        <>
            <div className="card overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 dark:bg-gray-700/50">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                                    {t('admin.code')}
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                                    {t('admin.discount')}
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                                    {t('admin.minOrder')}
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                                    {t('admin.usage')}
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                                    {t('admin.type')}
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                                    {t('admin.validity')}
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                                    {t('admin.status')}
                                </th>
                                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                                    {t('admin.actions')}
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                            {vouchers.map((voucher, index) => (
                                <tr
                                    key={voucher.id}
                                    className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-smooth stagger-item"
                                    style={{ animationDelay: `${index * 0.05}s` }}
                                >
                                    <td className="px-6 py-4">
                                        <div>
                                            <p className="font-mono font-bold text-gray-900 dark:text-white">
                                                {voucher.code}
                                            </p>
                                            {voucher.description && (
                                                <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-1 mt-0.5">
                                                    {voucher.description}
                                                </p>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        {getDiscountDisplay(voucher)}
                                        {voucher.maxDiscountAmount && (
                                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                                {t('admin.max')}: ${voucher.maxDiscountAmount}
                                            </p>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center space-x-1 text-gray-900 dark:text-white">
                                            <DollarSign className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                                            <span className="text-sm font-semibold">{voucher.minOrderValue}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center space-x-2">
                                            <div className="text-sm">
                                                <span className="font-semibold text-gray-900 dark:text-white">
                                                    {voucher.usedCount}
                                                </span>
                                                <span className="text-gray-500 dark:text-gray-400">
                                                    {' '}/ {getRemainingUses(voucher)}
                                                </span>
                                            </div>
                                            {voucher.usageLimit && (
                                                <div className="w-16 h-1.5 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                                                    <div
                                                        className="h-full bg-gradient-to-r from-amber-500 to-amber-600 dark:from-amber-600 dark:to-amber-700 transition-smooth"
                                                        style={{ width: `${Math.min((voucher.usedCount / voucher.usageLimit) * 100, 100)}%` }}
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        {voucher.isPersonal ? (
                                            <div className="inline-flex items-center space-x-1.5 px-2.5 py-1 bg-blue-50 dark:bg-blue-900/30 rounded-lg border border-blue-200 dark:border-blue-700/50">
                                                <User className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                                                <span className="text-xs font-medium text-blue-700 dark:text-blue-400">
                                                    {t('admin.personal')}
                                                </span>
                                            </div>
                                        ) : (
                                            <div className="inline-flex items-center space-x-1.5 px-2.5 py-1 bg-purple-50 dark:bg-purple-900/30 rounded-lg border border-purple-200 dark:border-purple-700/50">
                                                <Users className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                                                <span className="text-xs font-medium text-purple-700 dark:text-purple-400">
                                                    {t('admin.public')}
                                                </span>
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="space-y-1">
                                            <div className="flex items-center space-x-1.5 text-gray-600 dark:text-gray-400">
                                                <Calendar className="w-3.5 h-3.5" />
                                                <span className="text-xs">{new Date(voucher.startDate).toLocaleDateString()}</span>
                                            </div>
                                            <div className="flex items-center space-x-1.5">
                                                <Calendar className="w-3.5 h-3.5 text-gray-400 dark:text-gray-500" />
                                                <span className={`text-xs font-medium ${isExpiringSoon(voucher.endDate)
                                                    ? 'text-amber-600 dark:text-amber-400'
                                                    : 'text-gray-600 dark:text-gray-400'
                                                    }`}>
                                                    {new Date(voucher.endDate).toLocaleDateString()}
                                                </span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`badge ${voucher.isValid ? 'badge-success' : 'badge-danger'}`}>
                                            {voucher.isValid ? t('admin.active') : t('admin.inactive')}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-end space-x-2">
                                            <button
                                                onClick={() => onView(voucher.id)}
                                                className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-smooth hover-scale"
                                                title={t('admin.viewDetail')}
                                            >
                                                <Eye className="w-5 h-5" />
                                            </button>

                                            <div className="relative">
                                                <button
                                                    onClick={() =>
                                                        setActiveMenu(activeMenu === voucher.id ? null : voucher.id)
                                                    }
                                                    className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-smooth hover-scale"
                                                >
                                                    <MoreVertical className="w-5 h-5" />
                                                </button>

                                                {activeMenu === voucher.id && (
                                                    <div className="absolute right-0 mt-2 w-48 glass dark:glass-dark rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 py-2 z-10 animate-fadeInDown">
                                                        <button
                                                            onClick={() => {
                                                                onEdit(voucher.id);
                                                                setActiveMenu(null);
                                                            }}
                                                            className="w-full px-4 py-2.5 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-amber-50 dark:hover:bg-amber-900/20 hover:text-amber-700 dark:hover:text-amber-400 flex items-center space-x-2.5 transition-smooth group"
                                                        >
                                                            <Edit className="w-4 h-4 group-hover:scale-110 transition-smooth" />
                                                            <span className="font-medium">{t('admin.edit')}</span>
                                                        </button>

                                                        <button
                                                            onClick={() => {
                                                                onToggleActive(voucher.id);
                                                                setActiveMenu(null);
                                                            }}
                                                            className="w-full px-4 py-2.5 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-purple-50 dark:hover:bg-purple-900/20 hover:text-purple-700 dark:hover:text-purple-400 flex items-center space-x-2.5 transition-smooth group"
                                                        >
                                                            {voucher.isValid ? (
                                                                <>
                                                                    <ToggleLeft className="w-4 h-4 group-hover:scale-110 transition-smooth" />
                                                                    <span className="font-medium">{t('admin.deactivate')}</span>
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <ToggleRight className="w-4 h-4 group-hover:scale-110 transition-smooth" />
                                                                    <span className="font-medium">{t('admin.activate')}</span>
                                                                </>
                                                            )}
                                                        </button>

                                                        <hr className="my-2 border-gray-200 dark:border-gray-700" />

                                                        <button
                                                            onClick={() => handleDeleteClick(voucher.id)}
                                                            className="w-full px-4 py-2.5 text-left text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-700 dark:hover:text-red-300 flex items-center space-x-2.5 transition-smooth group"
                                                        >
                                                            <Trash2 className="w-4 h-4 group-hover:scale-110 group-hover:rotate-12 transition-smooth" />
                                                            <span className="font-medium">{t('admin.delete')}</span>
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <ConfirmDialog
                open={deleteDialog.open}
                title={t('admin.deleteVoucherConfirm')}
                message={t('admin.deleteVoucherMessage')}
                onConfirm={handleDeleteConfirm}
                onCancel={() => setDeleteDialog({ open: false, voucherId: null })}
            />
        </>
    );
}