import { memo, useState, useRef, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Settings, Sun, Moon, Globe } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useTheme } from 'next-themes';
import { useAppContext } from '../../../../context/AppContext';


export const GuestActions = memo(() => {
    const { t } = useTranslation();
    const { setLanguage, language } = useAppContext();
    const { resolvedTheme, setTheme } = useTheme();

    const [showSettingsMenu, setShowSettingsMenu] = useState(false);
    const settingsMenuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (settingsMenuRef.current && !settingsMenuRef.current.contains(event.target as Node)) {
                setShowSettingsMenu(false);
            }
        };

        if (showSettingsMenu) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [showSettingsMenu]);

    const handleToggleSettings = useCallback(() => {
        setShowSettingsMenu(prev => !prev);
    }, []);

    const handleToggleLanguage = useCallback(() => {
        setLanguage(language === 'vi' ? 'en' : 'vi');
    }, [language, setLanguage]);

    const currentLangLabel = language === 'vi' ? t('GuestActions.vietnamese') : t('GuestActions.english');

    return (
        <>
            <div className="relative" ref={settingsMenuRef}>
                <button
                    onClick={handleToggleSettings}
                    className="p-2.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    title={t('GuestActions.settings')}
                >
                    <Settings className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                </button>

                {showSettingsMenu && (
                    <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-xl shadow-xl dark:shadow-gray-950/60 border border-gray-200 dark:border-gray-700 overflow-hidden z-50">
                        <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                            <p className="text-xs font-semibold uppercase text-gray-600 dark:text-gray-300">
                                {t('GuestActions.settings')}
                            </p>
                        </div>

                        <button
                            onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
                            className="flex items-center justify-between w-full px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                        >
                            <div className="flex items-center gap-3">
                                {resolvedTheme === 'light' ? (
                                    <Sun className="w-5 h-5 text-amber-500" />
                                ) : (
                                    <Moon className="w-5 h-5 text-amber-400" />
                                )}
                                <span className="text-gray-800 dark:text-white">
                                    {resolvedTheme === 'light' ? t('GuestActions.lightMode') : t('GuestActions.darkMode')}
                                </span>
                            </div>
                            <div
                                className={`w-11 h-6 rounded-full transition-colors ${resolvedTheme === 'dark' ? 'bg-amber-500' : 'bg-gray-300 dark:bg-gray-600'
                                    }`}
                            >
                                <div
                                    className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform mt-0.5 ${resolvedTheme === 'dark' ? 'translate-x-5 ml-0.5' : 'translate-x-0.5'
                                        }`}
                                />
                            </div>
                        </button>

                        <button
                            onClick={handleToggleLanguage}
                            className="flex items-center justify-between w-full px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                        >
                            <div className="flex items-center gap-3">
                                <Globe className="w-5 h-5 text-amber-500" />
                                <span className="text-gray-800 dark:text-white">{t('GuestActions.language')}</span>
                            </div>
                            <span className="text-sm font-medium text-amber-600 dark:text-amber-400">
                                {currentLangLabel}
                            </span>
                        </button>
                    </div>
                )}
            </div>

            <Link
                to="/login"
                className="px-5 py-2 text-gray-700 dark:text-white hover:text-amber-600 dark:hover:text-amber-400 transition-colors font-medium"
            >
                {t('GuestActions.login')}
            </Link>

            <Link
                to="/register"
                className="px-5 py-2 bg-gradient-to-r from-amber-500 to-orange-500 dark:from-amber-600 dark:to-orange-600 text-white rounded-full hover:from-amber-600 hover:to-orange-600 dark:hover:from-amber-700 dark:hover:to-orange-700 transition-all shadow-md hover:shadow-lg font-medium"
            >
                {t('GuestActions.register')}
            </Link>
        </>
    );
});

GuestActions.displayName = 'GuestActions';