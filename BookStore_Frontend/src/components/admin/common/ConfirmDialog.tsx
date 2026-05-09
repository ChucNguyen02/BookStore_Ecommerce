import { AlertTriangle } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface ConfirmDialogProps {
    open: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
}

export default function ConfirmDialog({ open, title, message, onConfirm, onCancel }: ConfirmDialogProps) {
    const { t } = useTranslation();

    if (!open) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn"
            onClick={onCancel}
        >
            <div
                className="card max-w-md w-full animate-scaleIn"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="p-6 space-y-6">
                    {/* Icon & Title Section */}
                    <div className="animate-fadeInDown">
                        <div className="flex items-center justify-center mb-4">
                            <div className="relative">
                                <div className="absolute inset-0 bg-red-500 opacity-20 rounded-full animate-ping" />
                                <div className="relative w-16 h-16 bg-gradient-to-br from-red-100 to-red-200 dark:from-red-900/40 dark:to-red-800/40 rounded-full flex items-center justify-center shadow-lg">
                                    <AlertTriangle className="w-8 h-8 text-red-600 dark:text-red-400 animate-wiggle" />
                                </div>
                            </div>
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white text-center mb-2">
                            {title}
                        </h3>
                        <div className="h-1 w-20 bg-gradient-to-r from-red-500 via-red-400 to-transparent rounded-full mx-auto" />
                    </div>

                    {/* Message Box */}
                    <div className="card bg-red-50 dark:bg-red-900/10 border-l-4 border-red-500 dark:border-red-600 p-4 animate-fadeInUp">
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                            {message}
                        </p>
                    </div>

                    {/* Warning Badge */}
                    <div className="flex items-center justify-center animate-fadeIn" style={{ animationDelay: '0.2s' }}>
                        <div className="badge badge-danger flex items-center space-x-2 shadow-md">
                            <span className="animate-pulse">⚠️</span>
                            <span className="font-semibold">{t('common.actionCannotBeUndone') || 'This action cannot be undone'}</span>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row items-center gap-3 pt-2 animate-fadeInUp" style={{ animationDelay: '0.3s' }}>
                        <button
                            onClick={onCancel}
                            className="btn-secondary w-full sm:flex-1 order-2 sm:order-1"
                        >
                            {t('common.cancel')}
                        </button>
                        <button
                            onClick={onConfirm}
                            className="btn-primary w-full sm:flex-1 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 dark:from-red-600 dark:to-red-700 dark:hover:from-red-700 dark:hover:to-red-800 shadow-red-500/50 hover:shadow-red-600/60 order-1 sm:order-2"
                        >
                            🗑️ {t('common.delete')}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}