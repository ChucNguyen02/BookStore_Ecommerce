import { useTranslation } from 'react-i18next';
import { Eye, Award, Clock, CheckCircle, XCircle, Package } from 'lucide-react';
import { type UserRewardResponse } from '../../../types/reward.types';

interface RedemptionsTableProps {
    redemptions: UserRewardResponse[];
    onView: (redemptionId: string) => void;
}

export default function RedemptionsTable({ redemptions, onView }: RedemptionsTableProps) {
    const { t } = useTranslation();

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'PENDING':
                return <Clock className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />;
            case 'PROCESSING':
                return <Package className="w-5 h-5 text-blue-600 dark:text-blue-400" />;
            case 'COMPLETED':
                return <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />;
            case 'CANCELLED':
                return <XCircle className="w-5 h-5 text-red-600 dark:text-red-400" />;
            default:
                return <Clock className="w-5 h-5 text-gray-600 dark:text-gray-400" />;
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'PENDING':
                return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400';
            case 'PROCESSING':
                return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
            case 'COMPLETED':
                return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
            case 'CANCELLED':
                return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
            default:
                return 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-400';
        }
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                        <tr>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                                {t('admin.reward')}
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                                {t('admin.pointsSpent')}
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                                {t('admin.status')}
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                                {t('admin.tracking')}
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                                {t('admin.redeemedAt')}
                            </th>
                            <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                                {t('admin.actions')}
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                        {redemptions.map((redemption) => (
                            <tr
                                key={redemption.id}
                                className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                            >
                                <td className="px-6 py-4">
                                    <div className="flex items-center space-x-3">
                                        {redemption.reward.imageUrl ? (
                                            <img
                                                src={redemption.reward.imageUrl}
                                                alt={redemption.reward.name}
                                                className="w-12 h-12 rounded-lg object-cover"
                                            />
                                        ) : (
                                            <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-500 rounded-lg flex items-center justify-center">
                                                <Award className="w-6 h-6 text-white" />
                                            </div>
                                        )}
                                        <div>
                                            <p className="font-medium text-gray-900 dark:text-white">
                                                {redemption.reward.name}
                                            </p>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                                {redemption.reward.type}
                                            </p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center space-x-2">
                                        <Award className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                                        <span className="font-semibold text-gray-900 dark:text-white">
                                            {redemption.pointsSpent.toLocaleString()}
                                        </span>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center space-x-2">
                                        {getStatusIcon(redemption.status)}
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(redemption.status)}`}>
                                            {redemption.status}
                                        </span>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    {redemption.trackingNumber ? (
                                        <p className="text-sm font-mono text-gray-900 dark:text-white">
                                            {redemption.trackingNumber}
                                        </p>
                                    ) : (
                                        <p className="text-sm text-gray-500 dark:text-gray-400">-</p>
                                    )}
                                </td>
                                <td className="px-6 py-4">
                                    <p className="text-sm text-gray-900 dark:text-white">
                                        {new Date(redemption.redeemedAt).toLocaleDateString()}
                                    </p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                        {new Date(redemption.redeemedAt).toLocaleTimeString()}
                                    </p>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center justify-end">
                                        <button
                                            onClick={() => onView(redemption.id)}
                                            className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                                            title={t('admin.viewDetail')}
                                        >
                                            <Eye className="w-5 h-5" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}