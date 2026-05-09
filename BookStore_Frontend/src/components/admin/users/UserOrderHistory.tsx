import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Package, Calendar, DollarSign } from 'lucide-react';
import { orderService } from '../../../services';
import { type OrderResponse } from '../../../types/order.types';
import LoadingSpinner from '../common/LoadingSpinner';

interface UserOrderHistoryProps {
    userId: string;
}

export default function UserOrderHistory({ userId }: UserOrderHistoryProps) {
    const { t } = useTranslation();
    const [orders, setOrders] = useState<OrderResponse[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                setIsLoading(true);
                setError(null);

                // Note: Backend doesn't have admin endpoint to get user orders by userId
                // This would need to be implemented as /admin/users/{userId}/orders
                // For now, we'll use the regular user orders endpoint
                const response = await orderService.getUserOrders(0, 100);
                setOrders(response.content);
            } catch (err: any) {
                setError(err.message || 'Failed to fetch orders');
            } finally {
                setIsLoading(false);
            }
        };

        fetchOrders();
    }, [userId]);

    if (isLoading) {
        return <LoadingSpinner />;
    }

    if (error) {
        return (
            <div className="text-center py-8">
                <p className="text-red-600 dark:text-red-400">{error}</p>
            </div>
        );
    }

    if (orders.length === 0) {
        return (
            <div className="text-center py-12">
                <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400">{t('admin.noOrdersFound')}</p>
            </div>
        );
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'PENDING':
                return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400';
            case 'CONFIRMED':
                return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
            case 'SHIPPING':
                return 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400';
            case 'DELIVERED':
                return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
            case 'CANCELLED':
                return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
            default:
                return 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-400';
        }
    };

    return (
        <div className="space-y-4">
            {orders.map((order, index) => (
                <div
                    key={order.id}
                    className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 hover:shadow-md transition-smooth hover-lift stagger-item"
                    style={{ animationDelay: `${index * 0.1}s` }}
                >
                    <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center text-white hover-scale">
                                <Package className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="font-semibold text-gray-900 dark:text-white">
                                    #{order.orderCode}
                                </p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    {order.itemCount} {t('admin.items')}
                                </p>
                            </div>
                        </div>
                        <span className={`badge ${getStatusColor(order.status)}`}>
                            {order.status}
                        </span>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                            <Calendar className="w-4 h-4" />
                            <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                            <DollarSign className="w-4 h-4" />
                            <span className="font-semibold text-gray-900 dark:text-white">
                                ${order.totalAmount.toLocaleString()}
                            </span>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}