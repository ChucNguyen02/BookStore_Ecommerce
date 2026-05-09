import React from 'react';
import { Calendar, Clock } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { NewArrivalTimePeriod } from '../../../types/new_arrivals.types';

interface NewArrivalsTimelineProps {
    activePeriod: NewArrivalTimePeriod;
    onPeriodChange: (period: NewArrivalTimePeriod) => void;
}

export const NewArrivalsTimeline: React.FC<NewArrivalsTimelineProps> = ({
    activePeriod,
    onPeriodChange,
}) => {
    const { t } = useTranslation();

    const PERIODS: { value: NewArrivalTimePeriod; label: string; icon: React.ReactNode }[] = [
        { value: 'today', label: t('NewArrivalsTimeline.today'), icon: <Clock className="w-4 h-4" /> },
        { value: 'week', label: t('NewArrivalsTimeline.week'), icon: <Calendar className="w-4 h-4" /> },
        { value: 'month', label: t('NewArrivalsTimeline.month'), icon: <Calendar className="w-4 h-4" /> },
        { value: 'all', label: t('NewArrivalsTimeline.all'), icon: <Calendar className="w-4 h-4" /> },
    ];

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                {t('NewArrivalsTimeline.title')}
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {PERIODS.map((period) => {
                    const isActive = activePeriod === period.value;
                    return (
                        <button
                            key={period.value}
                            onClick={() => onPeriodChange(period.value)}
                            className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-all ${
                                isActive
                                    ? 'bg-teal-500 text-white shadow-lg shadow-teal-500/30'
                                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                            }`}
                        >
                            {period.icon}
                            <span>{period.label}</span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
};