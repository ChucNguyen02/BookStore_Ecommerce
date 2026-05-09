import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FileText, FileSpreadsheet } from 'lucide-react';

interface ExportButtonsProps {
    onExport: (format: 'excel' | 'pdf') => void;
}

export default function ExportButtons({ onExport }: ExportButtonsProps) {
    const { t } = useTranslation();
    const [isExporting, setIsExporting] = useState(false);

    const handleExport = async (format: 'excel' | 'pdf') => {
        setIsExporting(true);
        try {
            await onExport(format);
        } finally {
            setIsExporting(false);
        }
    };

    return (
        <div className="flex items-center gap-2">
            <button
                onClick={() => handleExport('excel')}
                disabled={isExporting}
                className="px-4 py-2.5 bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 hover:from-green-200 hover:to-emerald-200 dark:hover:from-green-900/50 dark:hover:to-emerald-900/50 text-green-700 dark:text-green-400 border-2 border-green-200 dark:border-green-800 rounded-xl font-semibold transition-smooth hover-scale shadow-lg hover:shadow-xl flex items-center gap-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:transform-none"
            >
                <div className="w-6 h-6 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center shadow-lg">
                    <FileSpreadsheet className="w-3.5 h-3.5 text-white" />
                </div>
                <span className="hidden sm:inline">{t('admin.exportExcel')}</span>
            </button>

            <button
                onClick={() => handleExport('pdf')}
                disabled={isExporting}
                className="px-4 py-2.5 bg-gradient-to-r from-red-100 to-rose-100 dark:from-red-900/30 dark:to-rose-900/30 hover:from-red-200 hover:to-rose-200 dark:hover:from-red-900/50 dark:hover:to-rose-900/50 text-red-700 dark:text-red-400 border-2 border-red-200 dark:border-red-800 rounded-xl font-semibold transition-smooth hover-scale shadow-lg hover:shadow-xl flex items-center gap-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:transform-none"
            >
                <div className="w-6 h-6 bg-gradient-to-br from-red-500 to-rose-600 rounded-lg flex items-center justify-center shadow-lg">
                    <FileText className="w-3.5 h-3.5 text-white" />
                </div>
                <span className="hidden sm:inline">{t('admin.exportPDF')}</span>
            </button>

            {isExporting && (
                <div className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 border border-blue-200 dark:border-blue-800 rounded-xl animate-fadeIn">
                    <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                    <span className="text-sm font-medium text-blue-700 dark:text-blue-400">
                        {t('admin.exporting')}
                    </span>
                </div>
            )}
        </div>
    );
}