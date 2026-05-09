import React from 'react';
import { AlertCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface ErrorMessageProps {
    title?: string;
    message: string;
    onRetry?: () => void;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({
    title,
    message,
    onRetry,
}) => {
    const { t } = useTranslation();
    
    return (
        <div className="flex flex-col items-center justify-center py-12 px-4">
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6 max-w-md w-full">
                <div className="flex items-center gap-3 mb-4">
                    <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
                    <h3 className="text-lg font-semibold text-red-900 dark:text-red-100">
                        {title || t('ErrorMessage.defaultTitle')}
                    </h3>
                </div>
                <p className="text-red-700 dark:text-red-300 mb-4">{message}</p>
                {onRetry && (
                    <button
                        onClick={onRetry}
                        className="w-full px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
                    >
                        {t('ErrorMessage.retry')}
                    </button>
                )}
            </div>
        </div>
    );
};