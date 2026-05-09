import { ShoppingCart, Clock, CheckCircle, Truck, Package } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

interface RecentActivityProps {
    ordersByStatus: Record<string, number>;
}

export default function RecentActivity({ ordersByStatus }: RecentActivityProps) {
    const { t } = useTranslation();
    const navigate = useNavigate();

    const activities = [
        {
            status: 'PENDING',
            icon: Clock,
            color: 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400',
            borderColor: 'border-amber-200 dark:border-amber-800',
            gradient: 'from-amber-500 to-orange-500',
        },
        {
            status: 'CONFIRMED',
            icon: CheckCircle,
            color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
            borderColor: 'border-blue-200 dark:border-blue-800',
            gradient: 'from-blue-500 to-cyan-500',
        },
        {
            status: 'SHIPPING',
            icon: Truck,
            color: 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400',
            borderColor: 'border-purple-200 dark:border-purple-800',
            gradient: 'from-purple-500 to-pink-500',
        },
        {
            status: 'DELIVERED',
            icon: Package,
            color: 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400',
            borderColor: 'border-green-200 dark:border-green-800',
            gradient: 'from-green-500 to-emerald-500',
        },
    ];

    const handleStatusClick = (status: string) => {
        navigate(`/admin/orders?status=${status}`);
    };

    const totalOrders = Object.values(ordersByStatus || {}).reduce((sum, val) => sum + val, 0);

    return (
        <div className="card animate-fadeInUp">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                    📊 {t('admin.ordersByStatus')}
                </h3>
                <span className="badge badge-primary text-xs">
                    {totalOrders} {t('admin.total')}
                </span>
            </div>
            
            <div className="space-y-3">
                {activities.map((activity, index) => {
                    const Icon = activity.icon;
                    const count = ordersByStatus?.[activity.status] || 0;
                    const percentage = totalOrders > 0 ? ((count / totalOrders) * 100).toFixed(1) : '0';
                    
                    return (
                        <button
                            key={activity.status}
                            onClick={() => handleStatusClick(activity.status)}
                            className={`stagger-item w-full flex items-center justify-between p-4 border-2 ${activity.borderColor} rounded-xl hover:shadow-lg transition-all hover-lift group cursor-pointer`}
                            style={{ animationDelay: `${index * 0.1}s` }}
                        >
                            <div className="flex items-center gap-4 flex-1">
                                {/* Icon with gradient background on hover */}
                                <div className={`relative w-14 h-14 ${activity.color} rounded-xl flex items-center justify-center group-hover:scale-110 transition-all duration-300 overflow-hidden`}>
                                    {/* Gradient overlay on hover */}
                                    <div className={`absolute inset-0 bg-gradient-to-br ${activity.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
                                    <Icon className="w-7 h-7 relative z-10 group-hover:text-white transition-colors duration-300" strokeWidth={2.5} />
                                </div>
                                
                                <div className="flex-1 text-left">
                                    <p className="text-sm font-bold text-gray-900 dark:text-white mb-1 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                                        {t(`admin.${activity.status.toLowerCase()}`)}
                                    </p>
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs text-gray-500 dark:text-gray-400">
                                            {count} {t('admin.orders')}
                                        </span>
                                        <span className="text-xs text-gray-400 dark:text-gray-500">•</span>
                                        <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                                            {percentage}%
                                        </span>
                                    </div>
                                    
                                    {/* Progress Bar */}
                                    <div className="mt-2 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                        <div 
                                            className={`h-full bg-gradient-to-r ${activity.gradient} rounded-full transition-all duration-500`}
                                            style={{ width: `${percentage}%` }}
                                        ></div>
                                    </div>
                                </div>
                            </div>

                            {/* Count Badge */}
                            <div className="ml-4">
                                <div className={`min-w-[3rem] px-4 py-2 ${activity.color} rounded-lg group-hover:scale-110 transition-transform`}>
                                    <p className="text-2xl font-bold text-center">
                                        {count}
                                    </p>
                                </div>
                            </div>
                        </button>
                    );
                })}
            </div>

            {/* Total Summary với enhanced design */}
            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                <button
                    onClick={() => navigate('/admin/orders')}
                    className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-xl hover:from-amber-100 hover:to-orange-100 dark:hover:from-amber-900/30 dark:hover:to-orange-900/30 transition-all hover-lift group"
                >
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-500 dark:from-amber-600 dark:to-orange-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                            <ShoppingCart className="w-5 h-5 text-white" strokeWidth={2.5} />
                        </div>
                        <span className="text-sm font-bold text-gray-700 dark:text-gray-300 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                            {t('admin.totalOrders')}
                        </span>
                    </div>
                    <span className="text-2xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 dark:from-amber-400 dark:to-orange-400 bg-clip-text text-transparent">
                        {totalOrders}
                    </span>
                </button>
            </div>
        </div>
    );
}