import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { BookOpen, Sun, Moon, Globe, Settings } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useTheme } from "next-themes";
import { useAppContext } from '../../../context/AppContext';

export const AuthHeader = () => {
    const { setLanguage, language } = useAppContext();
    const { t } = useTranslation();
    const { resolvedTheme, setTheme } = useTheme();

    const [showSettings, setShowSettings] = useState(false);
    const settingsRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (settingsRef.current && !settingsRef.current.contains(event.target as Node)) {
                setShowSettings(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleToggleLanguage = () => {
        setLanguage(language === 'vi' ? 'en' : 'vi');
    };

    const currentLangLabel = language === 'vi' ? t('AuthHeader.vietnamese') : t('AuthHeader.english');

    return (
        <header className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-gray-900 shadow-md">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link to="/" className="flex items-center space-x-3 group">
                        <BookOpen className="w-8 h-8 text-amber-600 dark:text-amber-500 group-hover:text-amber-700 dark:group-hover:text-amber-400 transition-all" />
                        <span className="text-2xl font-serif font-bold bg-gradient-to-r from-amber-700 to-orange-600 dark:from-amber-500 dark:to-orange-500 bg-clip-text text-transparent">
                            BookStore
                        </span>
                    </Link>

                    <div className="flex items-center gap-4">
                        <div className="relative" ref={settingsRef}>
                            <button
                                onClick={() => setShowSettings(!showSettings)}
                                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                                aria-label={t('AuthHeader.settingsTitle')}
                            >
                                <Settings className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                            </button>

                            {showSettings && (
                                <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden z-50">
                                    <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                                        <p className="text-xs font-semibold uppercase text-gray-600 dark:text-gray-300">
                                            {t('AuthHeader.settingsTitle')}
                                        </p>
                                    </div>

                                    {/* Theme Toggle */}
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
                                                {resolvedTheme === 'light' ? t('AuthHeader.lightMode') : t('AuthHeader.darkMode')}
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

                                    {/* Language Toggle */}
                                    <button
                                        onClick={handleToggleLanguage}
                                        className="flex items-center justify-between w-full px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                                    >
                                        <div className="flex items-center gap-3">
                                            <Globe className="w-5 h-5 text-amber-500" />
                                            <span className="text-gray-800 dark:text-white">{t('AuthHeader.language')}</span>
                                        </div>
                                        <span className="text-sm font-medium text-amber-600 dark:text-amber-400">
                                            {currentLangLabel}
                                        </span>
                                    </button>
                                </div>
                            )}
                        </div>
                        <Link to="/login" className="text-gray-700 dark:text-gray-300 hover:text-amber-600 dark:hover:text-amber-400 font-medium transition-colors">
                            {t('AuthHeader.login')}
                        </Link>

                        <Link to="/register" className="px-5 py-2 bg-gradient-to-r from-amber-500 to-orange-500 dark:from-amber-600 dark:to-orange-600 text-white rounded-full font-medium hover:from-amber-600 hover:to-orange-600 transition-all shadow-md">
                            {t('AuthHeader.register')}
                        </Link>


                    </div>
                </div>
            </div>
        </header>
    );
};