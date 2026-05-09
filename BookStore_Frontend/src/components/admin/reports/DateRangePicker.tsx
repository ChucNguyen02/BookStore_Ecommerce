import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Calendar, ChevronDown } from 'lucide-react';

interface DateRangePickerProps {
    startDate: string;
    endDate: string;
    onChange: (startDate: string, endDate: string) => void;
}

export default function DateRangePicker({ startDate, endDate, onChange }: DateRangePickerProps) {
    const { t } = useTranslation();
    const [showPresets, setShowPresets] = useState(false);

    const presets = [
        { label: t('admin.last7Days'), days: 7 },
        { label: t('admin.last30Days'), days: 30 },
        { label: t('admin.last90Days'), days: 90 },
        { label: t('admin.last365Days'), days: 365 }
    ];

    const handlePresetClick = (days: number) => {
        const end = new Date();
        const start = new Date();
        start.setDate(end.getDate() - days);

        onChange(
            start.toISOString().split('T')[0],
            end.toISOString().split('T')[0]
        );
        setShowPresets(false);
    };

    return (
        <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
                <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                    <input
                        type="date"
                        value={startDate}
                        onChange={(e) => onChange(e.target.value, endDate)}
                        className="input-field pl-10 pr-4 py-2.5 text-sm transition-smooth hover-scale"
                    />
                </div>

                <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg shadow-lg">
                    <span className="text-white font-bold text-sm">→</span>
                </div>

                <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                    <input
                        type="date"
                        value={endDate}
                        onChange={(e) => onChange(startDate, e.target.value)}
                        className="input-field pl-10 pr-4 py-2.5 text-sm transition-smooth hover-scale"
                    />
                </div>
            </div>

            <div className="relative">
                <button
                    onClick={() => setShowPresets(!showPresets)}
                    className={`
                    px-4 py-2.5 rounded-xl font-semibold text-sm
                    flex items-center gap-2 transition-smooth hover-scale shadow-lg
                    ${showPresets
                            ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white'
                            : 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-900/50'
                        }
                `}
                >
                    <Calendar className="w-4 h-4" />
                    <span>{t('admin.presets')}</span>
                    <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${showPresets ? 'rotate-180' : ''}`} />
                </button>

                {showPresets && (
                    <>
                        <div
                            className="fixed inset-0 z-10 bg-black/20 backdrop-blur-sm animate-fadeIn"
                            onClick={() => setShowPresets(false)}
                        />
                        <div className="absolute top-full mt-2 right-0 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl shadow-2xl z-20 min-w-[180px] py-2 animate-scaleIn overflow-hidden">
                            {presets.map((preset, index) => (
                                <button
                                    key={preset.days}
                                    onClick={() => handlePresetClick(preset.days)}
                                    className="w-full px-4 py-2.5 text-left text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gradient-to-r hover:from-blue-50 hover:to-cyan-50 dark:hover:from-blue-900/20 dark:hover:to-cyan-900/20 transition-smooth flex items-center gap-3 group animate-fadeInUp"
                                    style={{ animationDelay: `${index * 0.05}s` }}
                                >
                                    <div className="w-2 h-2 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 group-hover:scale-125 transition-transform"></div>
                                    <span className="group-hover:translate-x-1 transition-transform">{preset.label}</span>
                                </button>
                            ))}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}