import { memo, useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, LayoutGrid, Tag, TrendingUp, Clock, Users, ChevronDown, Sparkles, Ticket } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface NavigationItem {
    path: string;
    label: string;
}

interface MainNavigationProps {
    navigationItems: NavigationItem[];
    currentPath: string;
}

const iconMap: Record<string, React.ReactNode> = {
    '/': <BookOpen className="w-4 h-4" />,
    '/books': <LayoutGrid className="w-4 h-4" />,
    '/categories': <Tag className="w-4 h-4" />,
    '/authors': <Users className="w-4 h-4" />,
    '/vouchers-public': <Ticket className="w-4 h-4" />,
    '/promotions': <Sparkles className="w-4 h-4" />,
    '/bestsellers': <TrendingUp className="w-4 h-4" />,
    '/new-arrivals': <Clock className="w-4 h-4" />,
};

export const MainNavigation = memo(({ currentPath }: MainNavigationProps) => {
    const { t } = useTranslation();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const handleMouseEnter = () => setIsDropdownOpen(true);
    const handleMouseLeave = () => setIsDropdownOpen(false);

    const mainNavItems = [
        { path: '/', label: t('MainNavigation.home') },
        { path: '/books', label: t('MainNavigation.allBooks') },
        { path: '/categories', label: t('MainNavigation.categories') },
        { path: '/authors', label: t('MainNavigation.authors') },
        { path: '/vouchers-public', label: t('MainNavigation.vouchers') },
    ];

    const dropdownItems = [
        { path: '/promotions', label: t('MainNavigation.promotions'), icon: <Sparkles className="w-4 h-4" /> },
        { path: '/bestsellers', label: t('MainNavigation.bestSellers'), icon: <TrendingUp className="w-4 h-4" /> },
        { path: '/new-arrivals', label: t('MainNavigation.newArrivals'), icon: <Clock className="w-4 h-4" /> },
    ];

    const isDropdownItemActive = dropdownItems.some(item => item.path === currentPath);

    return (
        <nav className="hidden md:flex items-center justify-center gap-1 pb-4 border-t border-gray-200 dark:border-gray-700 pt-4">
            {/* Main Navigation Items */}
            {mainNavItems.map((item) => {
                const isActive = currentPath === item.path;

                return (
                    <Link
                        key={item.path}
                        to={item.path}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                            isActive
                                ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400'
                                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-amber-600 dark:hover:text-amber-400'
                        }`}
                    >
                        {iconMap[item.path]}
                        <span>{item.label}</span>
                    </Link>
                );
            })}

            {/* Dropdown Menu */}
            <div
                className="relative"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
            >
                <button
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                        isDropdownItemActive || isDropdownOpen
                            ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400'
                            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-amber-600 dark:hover:text-amber-400'
                    }`}
                >
                    <Sparkles className="w-4 h-4" />
                    <span>{t('MainNavigation.discover')}</span>
                    <ChevronDown
                        className={`w-4 h-4 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`}
                    />
                </button>

                {/* Dropdown Content */}
                {isDropdownOpen && (
                    <div className="absolute top-full left-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 py-2 animate-fadeInDown z-50">
                        {dropdownItems.map((item) => {
                            const isActive = currentPath === item.path;

                            return (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    className={`flex items-center gap-3 px-4 py-3 transition-all ${
                                        isActive
                                            ? 'bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400'
                                            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-amber-600 dark:hover:text-amber-400'
                                    }`}
                                >
                                    <div
                                        className={`p-1.5 rounded-lg ${
                                            isActive
                                                ? 'bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400'
                                                : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                                        }`}
                                    >
                                        {item.icon}
                                    </div>
                                    <span className="font-medium">{item.label}</span>
                                </Link>
                            );
                        })}
                    </div>
                )}
            </div>
        </nav>
    );
});

MainNavigation.displayName = 'MainNavigation';