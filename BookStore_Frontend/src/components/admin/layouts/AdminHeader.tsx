import { Shield, Menu, X, Sparkles } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAdmin } from '../../../context/AdminContext';
import NotificationDropdown from '../notifications/NotificationDropdown';
import SettingsDropdown from '../settings/SettingsDropdown';
import UserMenu from '../users/UserMenu';

interface AdminHeaderProps {
    sidebarOpen: boolean;
    setSidebarOpen: (open: boolean) => void;
}

export default function AdminHeader({ sidebarOpen, setSidebarOpen }: AdminHeaderProps) {
    const { user } = useAdmin();
    const { t } = useTranslation();

    return (
        <header className="fixed top-0 left-0 right-0 h-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm z-40 animate-fadeInDown">
            <div className="h-full px-4 flex items-center justify-between">
                {/* Left: Toggle & Logo */}
                <div className="flex items-center gap-4">
                    {/* Mobile Menu Toggle */}
                    <button
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-all hover-scale group"
                        aria-label="Toggle sidebar"
                    >
                        {sidebarOpen ? (
                            <X className="w-5 h-5 text-gray-600 dark:text-gray-300 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors" />
                        ) : (
                            <Menu className="w-5 h-5 text-gray-600 dark:text-gray-300 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors" />
                        )}
                    </button>

                    {/* Logo & Brand */}
                    <div className="flex items-center gap-3">
                        <div className="relative group">
                            <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-600 dark:from-amber-600 dark:to-orange-700 rounded-lg flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                                <Shield className="w-6 h-6 text-white" strokeWidth={2.5} />
                            </div>
                            {/* Glow effect */}
                            <div className="absolute inset-0 bg-gradient-to-br from-amber-500 to-orange-600 rounded-lg blur-md opacity-0 group-hover:opacity-50 transition-opacity"></div>
                        </div>
                        
                        <div className="hidden sm:block">
                            <div className="flex items-center gap-2">
                                <h1 className="text-lg font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                                    BookStore Admin
                                </h1>
                                <Sparkles className="w-4 h-4 text-amber-500 dark:text-amber-400 animate-pulse" />
                            </div>
                            <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                                {t('admin.administratorDashboard')}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Right: Actions */}
                <div className="flex items-center gap-2">
                    <NotificationDropdown />
                    <SettingsDropdown />
                    
                    {/* Divider */}
                    <div className="hidden sm:block w-px h-6 bg-gray-300 dark:bg-gray-600"></div>
                    
                    <UserMenu user={user} />
                </div>
            </div>

            {/* Bottom gradient line */}
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-amber-500 to-transparent opacity-50"></div>
        </header>
    );
}