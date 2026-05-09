import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
    Eye,
    Edit,
    Trash2,
    ToggleLeft,
    ToggleRight,
    Gift,
    Package,
    Award,
    MoreVertical,
    Plus,
    Minus,
} from 'lucide-react';
import { type RewardItemResponse } from '../../../types/reward.types';
import ConfirmDialog from '../common/ConfirmDialog';

interface RewardItemsTableProps {
    rewards: RewardItemResponse[];
    onEdit: (rewardId: string) => void;
    onView: (rewardId: string) => void;
    onToggleActive: (rewardId: string) => void;
    onDelete: (rewardId: string) => void;
    onUpdateStock: (rewardId: string, quantity: number) => void;
}

export default function RewardItemsTable({
    rewards,
    onEdit,
    onView,
    onToggleActive,
    onDelete,
    onUpdateStock,
}: RewardItemsTableProps) {
    const { t } = useTranslation();
    const [activeMenu, setActiveMenu] = useState<string | null>(null);
    const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; rewardId: string | null }>({
        open: false,
        rewardId: null,
    });
    const [stockDialog, setStockDialog] = useState<{ open: boolean; rewardId: string | null; currentStock: number }>({
        open: false,
        rewardId: null,
        currentStock: 0,
    });
    const [stockQuantity, setStockQuantity] = useState(0);

    const handleDeleteClick = (rewardId: string) => {
        setDeleteDialog({ open: true, rewardId });
        setActiveMenu(null);
    };

    const handleDeleteConfirm = () => {
        if (deleteDialog.rewardId) {
            onDelete(deleteDialog.rewardId);
        }
        setDeleteDialog({ open: false, rewardId: null });
    };

    const handleStockClick = (rewardId: string, currentStock: number) => {
        setStockDialog({ open: true, rewardId, currentStock });
        setStockQuantity(0);
        setActiveMenu(null);
    };

    const handleStockUpdate = () => {
        if (stockDialog.rewardId && stockQuantity !== 0) {
            onUpdateStock(stockDialog.rewardId, stockQuantity);
        }
        setStockDialog({ open: false, rewardId: null, currentStock: 0 });
    };

    const getTypeIcon = (type: string) => {
        switch (type) {
            case 'BOOK':
                return <Package className="w-5 h-5 text-blue-600 dark:text-blue-400" />;
            case 'VOUCHER':
                return <Award className="w-5 h-5 text-purple-600 dark:text-purple-400" />;
            case 'GIFT':
                return <Gift className="w-5 h-5 text-amber-600 dark:text-amber-400" />;
            default:
                return <Gift className="w-5 h-5 text-gray-600 dark:text-gray-400" />;
        }
    };

    const getTypeColor = (type: string) => {
        switch (type) {
            case 'BOOK':
                return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
            case 'VOUCHER':
                return 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400';
            case 'GIFT':
                return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400';
            default:
                return 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-400';
        }
    };

    return (
        <>
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 dark:bg-gray-700">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                                    {t('admin.reward')}
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                                    {t('admin.type')}
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                                    {t('admin.pointsRequired')}
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                                    {t('admin.stock')}
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                                    {t('admin.claimed')}
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
                            {rewards.map((reward) => (
                                <tr
                                    key={reward.id}
                                    className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                                >
                                    <td className="px-6 py-4">
                                        <div className="flex items-center space-x-3">
                                            {reward.imageUrl ? (
                                                <img
                                                    src={reward.imageUrl}
                                                    alt={reward.name}
                                                    className="w-12 h-12 rounded-lg object-cover"
                                                />
                                            ) : (
                                                <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-500 rounded-lg flex items-center justify-center">
                                                    <Gift className="w-6 h-6 text-white" />
                                                </div>
                                            )}
                                            <div>
                                                <p className="font-medium text-gray-900 dark:text-white">
                                                    {reward.name}
                                                </p>
                                                <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-1">
                                                    {reward.description}
                                                </p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center space-x-2">
                                            {getTypeIcon(reward.type)}
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getTypeColor(reward.type)}`}>
                                                {reward.type}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center space-x-2">
                                            <Award className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                                            <span className="font-semibold text-gray-900 dark:text-white">
                                                {reward.pointsRequired.toLocaleString()}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm">
                                            <span className={`font-semibold ${reward.stockQuantity === 0 ? 'text-red-600 dark:text-red-400' : 'text-gray-900 dark:text-white'}`}>
                                                {reward.stockQuantity}
                                            </span>
                                            <span className="text-gray-500 dark:text-gray-400">
                                                {' '}{t('admin.available')}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                                            {reward.claimedCount}
                                        </p>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span
                                            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                                                reward.isAvailable
                                                    ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                                    : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                                            }`}
                                        >
                                            {reward.isAvailable ? t('admin.active') : t('admin.inactive')}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-end space-x-2">
                                            <button
                                                onClick={() => onView(reward.id)}
                                                className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                                                title={t('admin.viewDetail')}
                                            >
                                                <Eye className="w-5 h-5" />
                                            </button>

                                            <div className="relative">
                                                <button
                                                    onClick={() =>
                                                        setActiveMenu(activeMenu === reward.id ? null : reward.id)
                                                    }
                                                    className="p-2 text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                                                >
                                                    <MoreVertical className="w-5 h-5" />
                                                </button>

                                                {activeMenu === reward.id && (
                                                    <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-10">
                                                        <button
                                                            onClick={() => {
                                                                onEdit(reward.id);
                                                                setActiveMenu(null);
                                                            }}
                                                            className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center space-x-2"
                                                        >
                                                            <Edit className="w-4 h-4" />
                                                            <span>{t('admin.edit')}</span>
                                                        </button>

                                                        <button
                                                            onClick={() => handleStockClick(reward.id, reward.stockQuantity)}
                                                            className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center space-x-2"
                                                        >
                                                            <Package className="w-4 h-4" />
                                                            <span>{t('admin.updateStock')}</span>
                                                        </button>

                                                        <button
                                                            onClick={() => {
                                                                onToggleActive(reward.id);
                                                                setActiveMenu(null);
                                                            }}
                                                            className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center space-x-2"
                                                        >
                                                            {reward.isAvailable ? (
                                                                <>
                                                                    <ToggleLeft className="w-4 h-4" />
                                                                    <span>{t('admin.deactivate')}</span>
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <ToggleRight className="w-4 h-4" />
                                                                    <span>{t('admin.activate')}</span>
                                                                </>
                                                            )}
                                                        </button>

                                                        <hr className="my-2 border-gray-200 dark:border-gray-700" />

                                                        <button
                                                            onClick={() => handleDeleteClick(reward.id)}
                                                            className="w-full px-4 py-2 text-left text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center space-x-2"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                            <span>{t('admin.delete')}</span>
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

            {/* Delete Confirmation */}
            <ConfirmDialog
                open={deleteDialog.open}
                title={t('admin.deleteRewardConfirm')}
                message={t('admin.deleteRewardMessage')}
                onConfirm={handleDeleteConfirm}
                onCancel={() => setDeleteDialog({ open: false, rewardId: null })}
            />

            {/* Stock Update Dialog */}
            {stockDialog.open && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full animate-scaleIn">
                        <div className="p-6">
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                                {t('admin.updateStock')}
                            </h3>
                            <div className="mb-4">
                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                                    {t('admin.currentStock')}: {stockDialog.currentStock}
                                </p>
                                <div className="flex items-center space-x-4">
                                    <button
                                        onClick={() => setStockQuantity(prev => prev - 1)}
                                        className="p-3 bg-red-100 hover:bg-red-200 dark:bg-red-900/30 dark:hover:bg-red-900/50 text-red-600 dark:text-red-400 rounded-lg transition-colors"
                                    >
                                        <Minus className="w-5 h-5" />
                                    </button>
                                    <input
                                        type="number"
                                        value={stockQuantity}
                                        onChange={(e) => setStockQuantity(parseInt(e.target.value) || 0)}
                                        className="flex-1 px-4 py-3 text-center border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-lg font-bold focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                                    />
                                    <button
                                        onClick={() => setStockQuantity(prev => prev + 1)}
                                        className="p-3 bg-green-100 hover:bg-green-200 dark:bg-green-900/30 dark:hover:bg-green-900/50 text-green-600 dark:text-green-400 rounded-lg transition-colors"
                                    >
                                        <Plus className="w-5 h-5" />
                                    </button>
                                </div>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                                    {t('admin.newStock')}: {stockDialog.currentStock + stockQuantity}
                                </p>
                            </div>
                            <div className="flex items-center space-x-3">
                                <button
                                    onClick={() => setStockDialog({ open: false, rewardId: null, currentStock: 0 })}
                                    className="flex-1 px-4 py-3 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-xl font-medium transition-all"
                                >
                                    {t('common.cancel')}
                                </button>
                                <button
                                    onClick={handleStockUpdate}
                                    disabled={stockQuantity === 0}
                                    className="flex-1 px-4 py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {t('admin.update')}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}