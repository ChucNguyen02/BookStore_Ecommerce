import { createContext, useContext, useState, useCallback, useMemo, useEffect } from 'react';
import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

interface AppContextType {
    language: 'vi' | 'en';
    setLanguage: (lang: 'vi' | 'en') => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
    const { i18n } = useTranslation();

    const [language, setLanguageState] = useState<'vi' | 'en'>(() => {
        if (typeof window === 'undefined') return 'vi';
        const saved = localStorage.getItem('language');
        return saved === 'en' ? 'en' : 'vi';
    });

    useEffect(() => {
        localStorage.setItem('language', language);
        i18n.changeLanguage(language);
    }, [language, i18n]);

    const setLanguage = useCallback((lang: 'vi' | 'en') => {
        setLanguageState(lang);
    }, []);

    const value = useMemo(
        () => ({
            language,
            setLanguage,
        }),
        [language, setLanguage]
    );

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error('useAppContext must be used within AppProvider');
    }
    return context;
};