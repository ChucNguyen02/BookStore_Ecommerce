import { memo, useState, useRef, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  Heart,
  ShoppingCart,
  Bell,
  User,
  Package,
  LogOut,
  Sun,
  Moon,
  Globe,
  ChevronDown,
  BarChart3,
  Coins,
  Ticket,
  Gift } from
'lucide-react';
import { useTranslation } from 'react-i18next';
import { useTheme } from 'next-themes';
import { useAppContext } from '../../../../context/AppContext';
import type { User as UserType } from '../../../../types';

interface UserActionsProps {
  currentUser: UserType;
  cartCount: number;
  wishlistCount: number;
  notificationCount: number;
  onLogout: () => void;
}

export const UserActions = memo(({
  currentUser,
  cartCount,
  wishlistCount,
  notificationCount,
  onLogout
}: UserActionsProps) => {
  const { t } = useTranslation();
  const { setLanguage, language } = useAppContext();
  const { resolvedTheme, setTheme } = useTheme();

  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const userMenuRef = useRef<HTMLDivElement>(null);
  const notificationsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!showUserMenu && !showNotifications) return;

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;

      if (userMenuRef.current && !userMenuRef.current.contains(target)) {
        setShowUserMenu(false);
      }
      if (notificationsRef.current && !notificationsRef.current.contains(target)) {
        setShowNotifications(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showUserMenu, showNotifications]);

  const handleToggleUserMenu = useCallback(() => {
    setShowUserMenu((prev) => !prev);
    setShowNotifications(false);
  }, []);

  const handleToggleNotifications = useCallback(() => {
    setShowNotifications((prev) => !prev);
    setShowUserMenu(false);
  }, []);

  const handleCloseMenus = useCallback(() => {
    setShowUserMenu(false);
    setShowNotifications(false);
  }, []);

  const handleToggleLanguage = useCallback(() => {
    setLanguage(language === 'vi' ? 'en' : 'vi');
  }, [language, setLanguage]);

  const currentLangLabel = language === 'vi' ? t('AuthHeader.vietnamese') : t('AuthHeader.english');

  return (
    <>
            {/* Wishlist */}
            <Link
        to="/wishlist"
        className="relative p-2.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors group"
        title={t('UserActions.wishlist')}>
        
                <Heart className="w-5 h-5 text-gray-700 dark:text-gray-300 group-hover:text-red-500 transition-colors" />
                {wishlistCount > 0 &&
        <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                        {wishlistCount > 9 ? '9+' : wishlistCount}
                    </span>
        }
            </Link>

            {/* Cart */}
            <Link
        to="/cart"
        className="relative p-2.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors group"
        title={t('UserActions.cart')}>
        
                <ShoppingCart className="w-5 h-5 text-gray-700 dark:text-gray-300 group-hover:text-amber-600 transition-colors" />
                {cartCount > 0 &&
        <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                        {cartCount > 9 ? '9+' : cartCount}
                    </span>
        }
            </Link>

            {/* Notifications */}
            <div className="relative" ref={notificationsRef}>
                <button
          onClick={handleToggleNotifications}
          className="relative p-2.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors group"
          title={t('UserActions.notifications')}>
          
                    <Bell className="w-5 h-5 text-gray-700 dark:text-gray-300 group-hover:text-amber-600 transition-colors" />
                    {notificationCount > 0 &&
          <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse"></span>
          }
                </button>

                {showNotifications &&
        <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden animate-fadeIn max-h-96 overflow-y-auto z-50">
                        <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-750">
                            <div className="flex items-center justify-between">
                                <h3 className="font-semibold text-gray-900 dark:text-white">
                                    {t('UserActions.notifications')}
                                </h3>
                                {notificationCount > 0 &&
              <span className="text-xs text-amber-600 dark:text-amber-400 font-medium">
                                        {notificationCount} {language === 'vi' ? t("Common.moi") : 'new'}
                                    </span>
              }
                            </div>
                        </div>
                        <Link
            to="/notifications"
            onClick={handleCloseMenus}
            className="block px-4 py-3 text-center text-sm font-medium text-amber-600 dark:text-amber-400 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            
                            {t('UserActions.viewAll')}
                        </Link>
                    </div>
        }
            </div>

            {/* User Menu */}
            <div className="relative" ref={userMenuRef}>
                <button
          onClick={handleToggleUserMenu}
          className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-all">
          
                    {currentUser.avatarUrl ?
          <img
            src={currentUser.avatarUrl}
            alt={currentUser.fullName}
            className="w-9 h-9 rounded-full object-cover ring-2 ring-amber-500" /> :


          <div className="w-9 h-9 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 flex items-center justify-center text-white font-bold ring-2 ring-amber-500">
                            {currentUser.fullName?.charAt(0).toUpperCase()}
                        </div>
          }
                    <div className="hidden lg:block text-left">
                        <p className="text-sm font-semibold text-gray-900 dark:text-white">
                            {currentUser.fullName}
                        </p>
                        {currentUser.totalPoints !== null && currentUser.totalPoints !== undefined &&
            <p className="text-xs text-amber-600 dark:text-amber-400 font-medium">
                                ⭐ {currentUser.totalPoints} {language === 'vi' ? t("Common.diem") : 'points'}
                            </p>
            }
                    </div>
                    <ChevronDown
            className={`w-4 h-4 transition-transform ${showUserMenu ? 'rotate-180' : ''}`} />
          
                </button>

                {showUserMenu &&
        <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden animate-fadeIn z-50">
                        {/* User Info */}
                        <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-gray-800 dark:to-gray-750">
                            <div className="flex items-center space-x-3">
                                {currentUser.avatarUrl ?
              <img
                src={currentUser.avatarUrl}
                alt={currentUser.fullName}
                className="w-12 h-12 rounded-full object-cover ring-2 ring-white" /> :


              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 flex items-center justify-center text-white font-bold text-lg ring-2 ring-white">
                                        {currentUser.fullName?.charAt(0).toUpperCase()}
                                    </div>
              }
                                <div className="flex-1 min-w-0">
                                    <p className="font-semibold text-gray-900 dark:text-white truncate">
                                        {currentUser.fullName}
                                    </p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                        {currentUser.email}
                                    </p>
                                    {currentUser.totalPoints !== null && currentUser.totalPoints !== undefined &&
                <p className="text-xs text-amber-600 dark:text-amber-400 font-medium mt-1 flex items-center gap-1">
                                            ⭐ {currentUser.totalPoints} {language === 'vi' ? t("Common.diem") : 'points'}
                                            {currentUser.tier &&
                  <span className="ml-2 px-2 py-0.5 bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-400 text-xs rounded-full font-semibold">
                                                    {currentUser.tier}
                                                </span>
                  }
                                        </p>
                }
                                </div>
                            </div>
                        </div>

                        {/* Menu Items */}
                        <div className="py-2">
                            <Link
              to="/profile"
              onClick={handleCloseMenus}
              className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300">
              
                                <User className="w-5 h-5" />
                                <span>{t('UserActions.profile')}</span>
                            </Link>
                            <Link
              to="/orders"
              onClick={handleCloseMenus}
              className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300">
              
                                <Package className="w-5 h-5" />
                                <span>{t('UserActions.orders')}</span>
                            </Link>
                            <Link
              to="/points"
              onClick={handleCloseMenus}
              className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300">
              
                                <Coins className="w-5 h-5" />
                                <span>{t('UserActions.points')}</span>
                            </Link>
                            <Link
              to="/rewards"
              onClick={handleCloseMenus}
              className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300">
              
                                <Gift className="w-5 h-5 text-amber-500" />
                                <span>{t('UserActions.rewards')}</span>
                            </Link>
                            <Link
              to="/vouchers"
              onClick={handleCloseMenus}
              className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300">
              
                                <Ticket className="w-5 h-5" />
                                <span>{t('UserActions.vouchers')}</span>
                            </Link>
                            <Link
              to="/statistics"
              onClick={handleCloseMenus}
              className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300">
              
                                <BarChart3 className="w-5 h-5" />
                                <span>{t('UserActions.statistics')}</span>
                            </Link>
                        </div>

                        {/* Settings */}
                        <div className="border-t border-gray-200 dark:border-gray-700 py-2">
                            <div className="px-4 py-2">
                                <p className="text-xs font-semibold uppercase text-gray-500 dark:text-gray-400">
                                    {t('AuthHeader.settingsTitle')}
                                </p>
                            </div>
                            <button
              onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
              className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300">
              
                                <div className="flex items-center gap-3">
                                    {resolvedTheme === 'light' ?
                <Sun className="w-5 h-5 text-amber-500" /> :

                <Moon className="w-5 h-5 text-amber-400" />
                }
                                    <span>{resolvedTheme === 'light' ? t('AuthHeader.lightMode') : t('AuthHeader.darkMode')}</span>
                                </div>
                                <div
                className={`w-11 h-6 rounded-full transition-colors ${resolvedTheme === 'dark' ? 'bg-amber-500' : 'bg-gray-300 dark:bg-gray-600'}`
                }>
                
                                    <div
                  className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform mt-0.5 ${resolvedTheme === 'dark' ? 'translate-x-5 ml-0.5' : 'translate-x-0.5'}`
                  } />
                
                                </div>
                            </button>
                            <button
              onClick={handleToggleLanguage}
              className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300">
              
                                <div className="flex items-center gap-3">
                                    <Globe className="w-5 h-5 text-amber-500" />
                                    <span>{t('AuthHeader.language')}</span>
                                </div>
                                <span className="text-sm font-medium text-amber-600 dark:text-amber-400">
                                    {currentLangLabel}
                                </span>
                            </button>
                        </div>

                        {/* Logout */}
                        <div className="border-t border-gray-200 dark:border-gray-700 py-2">
                            <button
              onClick={() => {
                handleCloseMenus();
                onLogout();
              }}
              className="w-full flex items-center gap-3 px-4 py-3 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20">
              
                                <LogOut className="w-5 h-5" />
                                <span className="font-medium">{t('UserActions.logout')}</span>
                            </button>
                        </div>
                    </div>
        }
            </div>
        </>);

});

UserActions.displayName = 'UserActions';