import { useTranslation } from 'react-i18next';
import { CheckCircle, Clock, List } from 'lucide-react';

interface QuestionFiltersProps {
    filterStatus: 'all' | 'unanswered' | 'answered';
    onFilterChange: (status: 'all' | 'unanswered' | 'answered') => void;
}

export default function QuestionFilters({
    filterStatus,
    onFilterChange
}: QuestionFiltersProps) {
    const { t } = useTranslation();

    const statusOptions = [
        {
            value: 'all' as const,
            label: t('admin.allQuestions'),
            icon: List,
            color: 'gray'
        },
        {
            value: 'unanswered' as const,
            label: t('admin.unanswered'),
            icon: Clock,
            color: 'orange'
        },
        {
            value: 'answered' as const,
            label: t('admin.answered'),
            icon: CheckCircle,
            color: 'green'
        }
    ];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t-2 border-gray-200 dark:border-gray-700">
            {statusOptions.map((option, index) => {
                const Icon = option.icon;
                const isActive = filterStatus === option.value;

                const colorClasses = {
                    gray: {
                        active: 'bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 text-gray-900 dark:text-white border-gray-300 dark:border-gray-500 shadow-lg',
                        inactive: 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600',
                        icon: 'from-gray-500 to-gray-600',
                        dot: 'bg-gray-500'
                    },
                    orange: {
                        active: 'bg-gradient-to-r from-orange-100 to-amber-100 dark:from-orange-900/30 dark:to-amber-900/30 text-orange-900 dark:text-orange-400 border-orange-300 dark:border-orange-700 shadow-lg',
                        inactive: 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700 hover:border-orange-300 dark:hover:border-orange-700',
                        icon: 'from-orange-500 to-amber-600',
                        dot: 'bg-orange-500'
                    },
                    green: {
                        active: 'bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 text-green-900 dark:text-green-400 border-green-300 dark:border-green-700 shadow-lg',
                        inactive: 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700 hover:border-green-300 dark:hover:border-green-700',
                        icon: 'from-green-500 to-emerald-600',
                        dot: 'bg-green-500'
                    }
                };

                const colors = colorClasses[option.color as keyof typeof colorClasses];

                return (
                    <button
                        key={option.value}
                        onClick={() => onFilterChange(option.value)}
                        className={`
                        flex items-center justify-center gap-3 px-4 py-3 
                        rounded-xl border-2 font-semibold 
                        transition-smooth hover-scale
                        ${isActive ? colors.active : colors.inactive}
                        animate-fadeInUp
                    `}
                        style={{ animationDelay: `${index * 0.1}s` }}
                    >
                        <div className={`
                        w-8 h-8 rounded-lg flex items-center justify-center
                        ${isActive
                                ? `bg-gradient-to-br ${colors.icon} shadow-lg`
                                : 'bg-gray-100 dark:bg-gray-700'
                            }
                    `}>
                            <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-gray-500 dark:text-gray-400'}`} />
                        </div>
                        <div className="flex items-center gap-2">
                            <span>{option.label}</span>
                            {isActive && option.value === 'unanswered' && (
                                <span className="relative flex">
                                    <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${colors.dot} opacity-75`}></span>
                                    <span className={`relative inline-flex rounded-full w-2 h-2 ${colors.dot}`}></span>
                                </span>
                            )}
                        </div>
                    </button>
                );
            })}
        </div>
    );
}