import { Eye, Download, Printer } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { type OrderResponse } from '../../../types';
import OrderStatusBadge from './OrderStatusBadge';

interface OrderTableProps {
    orders: OrderResponse[];
    onViewDetail: (orderCode: string) => void;
    onPrint?: (orderCode: string) => void;
    onExport?: () => void;
}

export default function OrderTable({ orders, onViewDetail, onPrint, onExport }: OrderTableProps) {
    const { t } = useTranslation();

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(amount);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('vi-VN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getPaymentMethodLabel = (method: string) => {
        const labels: Record<string, string> = {
            'COD': 'COD',
            'BANK_TRANSFER': 'Bank Transfer',
            'MOMO': 'MoMo',
            'VNPAY': 'VNPay'
        };
        return labels[method] || method;
    };

    const getPaymentStatusBadge = (status: string) => {
        const config: Record<string, { bg: string; text: string; label: string }> = {
            'PENDING': { bg: 'bg-yellow-100 dark:bg-yellow-900/30', text: 'text-yellow-700 dark:text-yellow-400', label: 'Pending' },
            'PAID': { bg: 'bg-green-100 dark:bg-green-900/30', text: 'text-green-700 dark:text-green-400', label: 'Paid' },
            'FAILED': { bg: 'bg-red-100 dark:bg-red-900/30', text: 'text-red-700 dark:text-red-400', label: 'Failed' },
            'REFUNDED': { bg: 'bg-gray-100 dark:bg-gray-700', text: 'text-gray-700 dark:text-gray-300', label: 'Refunded' }
        };
        const c = config[status] || config['PENDING'];
        return (
            <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${c.bg} ${c.text}`}>
                {c.label}
            </span>
        );
    };

    if (orders.length === 0) {
        return (
            <div className="card text-center hover-lift">
                <div className="py-16">
                    <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse shadow-lg">
                        <Eye className="w-12 h-12 text-gray-400" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                        {t('admin.noOrdersFound')}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                        {t('admin.noOrdersDesc')}
                    </p>
                </div>
            </div>
        );
    }


    return (
        <div className="card overflow-hidden animate-fadeIn">
            {/* Header with Export */}
            {onExport && (
                <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-gray-50 to-amber-50/30 dark:from-gray-700/30 dark:to-gray-700/50">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-3">
                            <span className="w-1 h-6 bg-gradient-to-b from-amber-500 to-orange-500 rounded-full"></span>
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                                {t('admin.orderList')}
                            </h3>
                            <span className="badge badge-primary">
                                {orders.length}
                            </span>
                        </div>
                        <button
                            onClick={onExport}
                            className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-xl transition-smooth shadow-lg hover:shadow-xl hover-scale"
                        >
                            <Download className="w-4 h-4" />
                            <span className="font-medium">{t('common.exportExcel')}</span>
                        </button>
                    </div>
                </div>
            )}

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700/50 dark:to-gray-700/30 border-b-2 border-amber-500/20">
                        <tr>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                                <div className="flex items-center space-x-2">
                                    <span className="w-1 h-4 bg-gradient-to-b from-amber-500 to-orange-500 rounded-full"></span>
                                    <span>{t('admin.orderCode')}</span>
                                </div>
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                                {t('admin.orderDate')}
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                                {t('admin.items')}
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                                {t('admin.totalAmount')}
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                                {t('admin.paymentMethod')}
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                                {t('admin.paymentStatus')}
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                                {t('admin.orderStatus')}
                            </th>
                            <th className="px-6 py-4 text-right text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                                {t('common.actions')}
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                        {orders.map((order, index) => (
                            <tr
                                key={order.id}
                                className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-smooth animate-fadeInUp"
                                style={{ animationDelay: `${index * 0.05}s` }}
                            >
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center space-x-2">
                                        <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                                        <span className="text-sm font-semibold text-gray-900 dark:text-white">
                                            #{order.orderCode}
                                        </span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-600 dark:text-gray-400">
                                        {formatDate(order.createdAt)}
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center space-x-2">
                                        <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-lg flex items-center justify-center text-white text-xs font-bold">
                                            {order.itemCount}
                                        </div>
                                        <span className="text-sm text-gray-600 dark:text-gray-400">
                                            {t('admin.items')}
                                        </span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm font-bold text-gray-900 dark:text-white">
                                        {formatCurrency(order.totalAmount)}
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-gray-100 dark:bg-gray-700 text-xs font-medium text-gray-700 dark:text-gray-300">
                                        {getPaymentMethodLabel(order.paymentMethod)}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {getPaymentStatusBadge(order.paymentStatus)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <OrderStatusBadge status={order.status} />
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right">
                                    <div className="flex items-center justify-end space-x-2">
                                        <button
                                            onClick={() => onViewDetail(order.orderCode)}
                                            className="inline-flex items-center space-x-1 px-3 py-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-lg transition-smooth shadow-lg hover:shadow-xl hover-scale"
                                            title="View Details"
                                        >
                                            <Eye className="w-4 h-4" />
                                            <span className="text-sm font-medium">{t('common.view')}</span>
                                        </button>
                                        {onPrint && (
                                            <button
                                                onClick={() => onPrint(order.orderCode)}
                                                className="p-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg transition-smooth hover-scale"
                                                title="Print Order"
                                            >
                                                <Printer className="w-4 h-4" />
                                            </button>
                                        )}
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