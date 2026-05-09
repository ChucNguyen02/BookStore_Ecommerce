import { memo } from 'react';
import { Zap, Phone, Mail } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export const TopBar = memo(() => {
    const { t } = useTranslation();

    return (
        <div className="bg-gradient-to-r from-amber-600 to-orange-500 dark:from-amber-700 dark:to-orange-600 text-white py-2">
            <div className="container mx-auto px-4 flex justify-between items-center text-sm">
                <div className="flex items-center gap-2 animate-pulse font-medium">
                    <Zap className="w-4 h-4" />
                    <span>{t('TopBar.hotDeal')}</span>
                </div>
                <div className="hidden md:flex items-center gap-6">
                    <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4" />
                        <span>{t('TopBar.hotline')}</span>
                    </div>
                    <span className="text-white/60">|</span>
                    <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        <span>{t('TopBar.email')}</span>
                    </div>
                </div>
            </div>
        </div>
    );
});

TopBar.displayName = 'TopBar';