import { useState, useEffect, useRef } from 'react';
import { Settings, Sun, Moon, Globe } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useTheme } from 'next-themes';
import { useAppContext } from '../../../context/AppContext';

export default function SettingsDropdown() {
    const [isOpen, setIsOpen] = useState(false);
    const { language, setLanguage } = useAppContext();
    const { resolvedTheme, setTheme } = useTheme();
    const { t } = useTranslation();
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    const toggleLanguage = () => {
        setLanguage(language === 'vi' ? 'en' : 'vi');
    };

    const currentLangLabel = language === 'vi' ? t('AuthHeader.vietnamese') : t('AuthHeader.english');

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-smooth hover-scale"
                aria-label={t('AuthHeader.settingsTitle')}
            >
                <Settings className={`w-5 h-5 text-gray-600 dark:text-gray-300 ${isOpen ? 'animate-spin' : ''}`} />
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-64 card animate-scaleIn z-50">
                    <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                            {t('AuthHeader.settingsTitle')}
                        </h3>
                    </div>

                    <div className="p-2 space-y-1">
                        {/* Theme Toggle */}
                        <button
                            onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
                            className="w-full flex items-center justify-between px-4 py-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-smooth hover-lift"
                        >
                            <div className="flex items-center space-x-3">
                                {resolvedTheme === 'light' ? (
                                    <Sun className="w-5 h-5 text-amber-500 animate-pulse" />
                                ) : (
                                    <Moon className="w-5 h-5 text-blue-400 animate-pulse" />
                                )}
                                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                    {t('AuthHeader.theme')}
                                </span>
                            </div>
                            {/* Toggle Switch */}
                            <div className={`relative w-11 h-6 rounded-full transition-smooth ${resolvedTheme === 'dark' ? 'bg-blue-500' : 'bg-gray-300'
                                }`}>
                                <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-md transition-smooth ${resolvedTheme === 'dark' ? 'translate-x-5' : 'translate-x-0'
                                    }`}>
                                    {resolvedTheme === 'dark' ? (
                                        <Moon className="w-3 h-3 text-blue-500 absolute top-1 left-1" />
                                    ) : (
                                        <Sun className="w-3 h-3 text-amber-500 absolute top-1 left-1" />
                                    )}
                                </div>
                            </div>
                        </button>

                        {/* Language Toggle */}
                        <button
                            onClick={toggleLanguage}
                            className="w-full flex items-center justify-between px-4 py-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-smooth hover-lift"
                        >
                            <div className="flex items-center space-x-3">
                                <Globe className="w-5 h-5 text-green-500 hover-scale" />
                                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                    {t('AuthHeader.language')}
                                </span>
                            </div>
                            <span className="text-sm font-medium text-amber-600 dark:text-amber-400">
                                {currentLangLabel}
                            </span>
                        </button>
                    </div>

                    {/* Current Settings Display */}
                    <div className="p-3 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-200 dark:border-gray-700 rounded-b-lg">
                        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                            <span className="badge badge-primary">
                                {resolvedTheme === 'light' ? t('AuthHeader.lightMode') : t('AuthHeader.darkMode')}
                            </span>
                            <span className="badge badge-success">
                                {language === 'vi' ? t('AuthHeader.vietnamese') : t('AuthHeader.english')}
                            </span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}