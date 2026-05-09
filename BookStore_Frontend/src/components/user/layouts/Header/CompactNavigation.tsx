import { memo, useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { LayoutGrid, BookOpen, Tag, TrendingUp, Clock, Users, ChevronDown, Sparkles, Ticket } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface NavigationItem {
    path: string;
    label: string;
}

interface CompactNavigationProps {
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

export const CompactNavigation = memo(({
    currentPath,
}: CompactNavigationProps) => {
    const { t } = useTranslation();
    const [showMenu, setShowMenu] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!showMenu) return;

        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setShowMenu(false);
                setIsDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [showMenu]);

    // Main navigation items
    const mainNavItems = [
        { path: '/', label: t('CompactNavigation.home') },
        { path: '/books', label: t('CompactNavigation.allBooks') },
        { path: '/categories', label: t('CompactNavigation.categories') },
        { path: '/authors', label: t('CompactNavigation.authors') },
        { path: '/vouchers-public', label: t('CompactNavigation.vouchers') },
    ];

    // Dropdown items
    const dropdownItems = [
        {
            path: '/promotions',
            label: t('CompactNavigation.promotions'),
            icon: <Sparkles className="w-4 h-4" />
        },
        {
            path: '/bestsellers',
            label: t('CompactNavigation.bestSellers'),
            icon: <TrendingUp className="w-4 h-4" />
        },
        {
            path: '/new-arrivals',
            label: t('CompactNavigation.newArrivals'),
            icon: <Clock className="w-4 h-4" />
        },
    ];

    const isDropdownItemActive = dropdownItems.some(item => item.path === currentPath);

    return (
        <div className="hidden md:block fixed left-4 top-24 z-50" ref={menuRef}>
            <button
                onClick={() => setShowMenu(!showMenu)}
                className="p-3 bg-white dark:bg-gray-800 rounded-full shadow-lg hover:shadow-xl border-2 border-amber-500 dark:border-amber-400 text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-gray-700 transition-all"
                title={t('CompactNavigation.menuTitle')}
            >
                <LayoutGrid className="w-5 h-5" />
            </button>

            {showMenu && (
                <div className="absolute top-0 left-16 w-64 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden animate-fadeIn">
                    <div className="px-4 py-3 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-gray-750 dark:to-gray-700 border-b border-gray-200 dark:border-gray-700">
                        <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                            <LayoutGrid className="w-4 h-4" />
                            {t('CompactNavigation.menu')}
                        </h3>
                    </div>
                    <div className="py-2">
                        {/* Main Navigation Items */}
                        {mainNavItems.map((item) => {
                            const isActive = currentPath === item.path;
                            return (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    onClick={() => setShowMenu(false)}
                                    className={`flex items-center gap-3 px-4 py-3 transition-colors ${isActive
                                        ? 'bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 font-semibold'
                                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                                        }`}
                                >
                                    {iconMap[item.path]}
                                    <span>{item.label}</span>
                                </Link>
                            );
                        })}

                        {/* Dropdown Section */}
                        <div className="border-t border-gray-200 dark:border-gray-700 mt-2 pt-2">
                            <button
                                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                className={`flex items-center justify-between w-full px-4 py-3 transition-colors ${isDropdownItemActive || isDropdownOpen
                                    ? 'bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 font-semibold'
                                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                                    }`}
                            >
                                <div className="flex items-center gap-3">
                                    <Sparkles className="w-4 h-4" />
                                    <span>{t('CompactNavigation.discover')}</span>
                                </div>
                                <ChevronDown
                                    className={`w-4 h-4 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''
                                        }`}
                                />
                            </button>

                            {/* Dropdown Items */}
                            {isDropdownOpen && (
                                <div className="bg-gray-50 dark:bg-gray-900/50">
                                    {dropdownItems.map((item) => {
                                        const isActive = currentPath === item.path;
                                        return (
                                            <Link
                                                key={item.path}
                                                to={item.path}
                                                onClick={() => setShowMenu(false)}
                                                className={`flex items-center gap-3 px-4 py-3 pl-11 transition-colors ${isActive
                                                    ? 'bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-400 font-medium'
                                                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                                                    }`}
                                            >
                                                <div
                                                    className={`p-1 rounded ${isActive
                                                        ? 'bg-amber-200 dark:bg-amber-900/60 text-amber-600 dark:text-amber-400'
                                                        : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-500'
                                                        }`}
                                                >
                                                    {item.icon}
                                                </div>
                                                <span>{item.label}</span>
                                            </Link>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
});

CompactNavigation.displayName = 'CompactNavigation';