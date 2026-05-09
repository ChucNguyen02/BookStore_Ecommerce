import { Users, BookOpen, ShoppingCart, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function QuickActions() {
    const navigate = useNavigate();
    const { t } = useTranslation();

    const actions = [
        {
            id: 1,
            label: t('admin.manageUsers'),
            icon: Users,
            path: '/admin/users',
            color: 'from-blue-500 to-cyan-500',
            darkColor: 'dark:from-blue-600 dark:to-cyan-600',
            bgLight: 'bg-blue-50 dark:bg-blue-900/20',
            textColor: 'text-blue-600 dark:text-blue-400',
        },
        {
            id: 2,
            label: t('admin.addBook'),
            icon: BookOpen,
            path: '/admin/books/create',
            color: 'from-amber-500 to-orange-500',
            darkColor: 'dark:from-amber-600 dark:to-orange-600',
            bgLight: 'bg-amber-50 dark:bg-amber-900/20',
            textColor: 'text-amber-600 dark:text-amber-400',
        },
        {
            id: 3,
            label: t('admin.viewOrders'),
            icon: ShoppingCart,
            path: '/admin/orders',
            color: 'from-green-500 to-emerald-500',
            darkColor: 'dark:from-green-600 dark:to-emerald-600',
            bgLight: 'bg-green-50 dark:bg-green-900/20',
            textColor: 'text-green-600 dark:text-green-400',
        },
        {
            id: 4,
            label: t('admin.settings'),
            icon: Settings,
            path: '/admin/settings',
            color: 'from-purple-500 to-pink-500',
            darkColor: 'dark:from-purple-600 dark:to-pink-600',
            bgLight: 'bg-purple-50 dark:bg-purple-900/20',
            textColor: 'text-purple-600 dark:text-purple-400',
        },
    ];

    return (
        <div className="card animate-fadeInUp">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                    ⚡ {t('admin.quickActions')}
                </h3>
                <span className="badge badge-primary text-xs">
                    {actions.length}
                </span>
            </div>

            <div className="grid grid-cols-2 gap-4">
                {actions.map((action, index) => {
                    const Icon = action.icon;

                    return (
                        <button
                            key={action.id}
                            onClick={() => navigate(action.path)}
                            className={`stagger-item group relative flex flex-col items-center justify-center p-6 bg-gradient-to-br ${action.color} ${action.darkColor} text-white rounded-xl shadow-md hover:shadow-xl hover-lift overflow-hidden`}
                            style={{ animationDelay: `${index * 0.1}s` }}
                        >
                            {/* Animated shine effect */}
                            <div className="absolute inset-0 opacity-0 group-hover:opacity-30 transition-opacity duration-500 bg-gradient-to-r from-transparent via-white to-transparent transform -skew-x-12 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>
                            
                            {/* Icon with background circle */}
                            <div className="relative mb-3">
                                <div className="absolute inset-0 bg-white/20 rounded-full blur-xl group-hover:bg-white/30 transition-all duration-300"></div>
                                <div className="relative w-14 h-14 flex items-center justify-center bg-white/10 backdrop-blur-sm rounded-full group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                                    <Icon className="w-7 h-7" strokeWidth={2.5} />
                                </div>
                            </div>
                            
                            <span className="text-sm font-bold tracking-wide text-center drop-shadow-lg">
                                {action.label}
                            </span>

                            {/* Corner decoration */}
                            <div className="absolute top-2 right-2 w-2 h-2 bg-white/30 rounded-full group-hover:scale-150 transition-transform duration-300"></div>
                        </button>
                    );
                })}
            </div>

        </div>
    );
}