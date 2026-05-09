import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
    LayoutDashboard,
    Users,
    BookOpen,
    ShoppingCart,
    Tag,
    Gift,
    BarChart3,
    Settings,
    MessageSquare,
    Star,
    Package,
    ChevronRight,
} from 'lucide-react';

interface AdminSidebarProps {
    isOpen: boolean;
}

export default function AdminSidebar({ isOpen }: AdminSidebarProps) {
    const { t } = useTranslation();

    const navItems = [
        { to: '/admin/dashboard', icon: LayoutDashboard, label: t('admin.dashboard'), color: 'text-blue-500' },
        { to: '/admin/users', icon: Users, label: t('admin.users'), color: 'text-purple-500' },
        { to: '/admin/books', icon: BookOpen, label: t('admin.books'), color: 'text-amber-500' },
        { to: '/admin/orders', icon: ShoppingCart, label: t('admin.orders'), color: 'text-green-500' },
        { to: '/admin/categories', icon: Tag, label: t('admin.categories'), color: 'text-pink-500' },
        { to: '/admin/authors', icon: Package, label: t('admin.authors'), color: 'text-indigo-500' },
        { to: '/admin/vouchers', icon: Gift, label: t('admin.vouchers'), color: 'text-red-500' },
        { to: '/admin/rewards', icon: Star, label: t('admin.rewards'), color: 'text-yellow-500' },
        { to: '/admin/reviews', icon: MessageSquare, label: t('admin.reviews'), color: 'text-cyan-500' },
        { to: '/admin/questions', icon: MessageSquare, label: t('admin.questions'), color: 'text-teal-500' },
        { to: '/admin/reports', icon: BarChart3, label: t('admin.statistics'), color: 'text-orange-500' },
        
    ];

    if (!isOpen) return null;

    return (
        <aside className="fixed left-0 top-16 bottom-0 w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 overflow-y-auto z-30 shadow-lg animate-fadeInLeft">
            {/* Sidebar Header */}
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    {t('admin.navigation')}
                </p>
            </div>

            {/* Navigation */}
            <nav className="p-3 space-y-1">
                {navItems.map((item, index) => {
                    const Icon = item.icon;
                    return (
                        <NavLink
                            key={item.to}
                            to={item.to}
                            className={({ isActive }) =>
                                `stagger-item group relative flex items-center gap-3 px-4 py-3 rounded-xl transition-all hover-lift ${
                                    isActive
                                        ? 'bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 text-amber-600 dark:text-amber-400 font-semibold shadow-md'
                                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                                }`
                            }
                            style={{ animationDelay: `${index * 0.05}s` }}
                        >
                            {({ isActive }) => (
                                <>
                                    {/* Active indicator */}
                                    {isActive && (
                                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-amber-500 to-orange-500 rounded-r-full animate-fadeIn"></div>
                                    )}

                                    {/* Icon */}
                                    <div className={`w-9 h-9 flex items-center justify-center rounded-lg transition-all ${
                                        isActive 
                                            ? 'bg-gradient-to-br from-amber-500 to-orange-500 dark:from-amber-600 dark:to-orange-600 text-white shadow-lg shadow-amber-500/30' 
                                            : `${item.color} bg-gray-100 dark:bg-gray-700 group-hover:scale-110`
                                    }`}>
                                        <Icon className="w-5 h-5" strokeWidth={2.5} />
                                    </div>

                                    {/* Label */}
                                    <span className="flex-1 text-sm">
                                        {item.label}
                                    </span>

                                    {/* Arrow indicator */}
                                    <ChevronRight className={`w-4 h-4 transition-all ${
                                        isActive 
                                            ? 'opacity-100 translate-x-0' 
                                            : 'opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0'
                                    }`} />
                                </>
                            )}
                        </NavLink>
                    );
                })}
            </nav>

            
        </aside>
    );
}