import { useTranslation } from 'react-i18next';
import { MessageSquare, CheckCircle, Clock, TrendingUp } from 'lucide-react';

interface QuestionStatsProps {
    stats: {
        totalQuestions: number;
        answeredQuestions: number;
        unansweredQuestions: number;
        answerRate: number;
    };
}

export default function QuestionStats({ stats }: QuestionStatsProps) {
    const { t } = useTranslation();

    const statCards = [
        {
            label: t('admin.totalQuestions'),
            value: stats.totalQuestions.toLocaleString(),
            icon: MessageSquare,
            color: 'from-blue-500 to-cyan-500',
            bgColor: 'bg-blue-100 dark:bg-blue-900/30',
            textColor: 'text-blue-600 dark:text-blue-400'
        },
        {
            label: t('admin.answered'),
            value: stats.answeredQuestions.toLocaleString(),
            icon: CheckCircle,
            color: 'from-green-500 to-emerald-500',
            bgColor: 'bg-green-100 dark:bg-green-900/30',
            textColor: 'text-green-600 dark:text-green-400'
        },
        {
            label: t('admin.unanswered'),
            value: stats.unansweredQuestions.toLocaleString(),
            icon: Clock,
            color: 'from-orange-500 to-amber-500',
            bgColor: 'bg-orange-100 dark:bg-orange-900/30',
            textColor: 'text-orange-600 dark:text-orange-400'
        },
        {
            label: t('admin.answerRate'),
            value: `${stats.answerRate.toFixed(1)}%`,
            icon: TrendingUp,
            color: 'from-purple-500 to-pink-500',
            bgColor: 'bg-purple-100 dark:bg-purple-900/30',
            textColor: 'text-purple-600 dark:text-purple-400'
        }
    ];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {statCards.map((stat, index) => {
                const Icon = stat.icon;
                const isUnanswered = stat.label === t('admin.unanswered');

                return (
                    <div
                        key={stat.label}
                        className="card hover-lift stagger-item"
                        style={{ animationDelay: `${index * 0.1}s` }}
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600 dark:text-gray-400 font-medium mb-1">
                                    {stat.label}
                                </p>
                                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                                    {stat.value}
                                </p>
                            </div>
                            <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center shadow-lg ${isUnanswered ? 'animate-pulse' : ''}`}>
                                <Icon className="w-6 h-6 text-white" />
                            </div>
                        </div>

                        <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                            <div className="flex items-center text-xs">
                                {isUnanswered ? (
                                    <>
                                        <span className="relative flex mr-2">
                                            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${stat.textColor.replace('text-', 'bg-').split(' ')[0]} opacity-75`}></span>
                                            <span className={`relative inline-flex rounded-full w-1.5 h-1.5 ${stat.textColor.replace('text-', 'bg-').split(' ')[0]}`}></span>
                                        </span>
                                        <span className={stat.textColor}>
                                            {t('admin.needsAttention')}
                                        </span>
                                    </>
                                ) : stat.label === t('admin.answerRate') ? (
                                    <div className="w-full">
                                        <div className="flex items-center justify-between mb-1">
                                            <span className="text-gray-600 dark:text-gray-400">{t('admin.progress')}</span>
                                            <span className={`font-semibold ${stat.textColor}`}>{stat.value}</span>
                                        </div>
                                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                                            <div
                                                className={`bg-gradient-to-r ${stat.color} h-1.5 rounded-full transition-all duration-500`}
                                                style={{ width: stat.value }}
                                            ></div>
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        <span className={`inline-flex rounded-full w-1.5 h-1.5 mr-2 ${stat.textColor.replace('text-', 'bg-').split(' ')[0]}`}></span>
                                        <span className="text-gray-500 dark:text-gray-400">
                                            {stat.label === t('admin.answered') ? t('admin.resolved') : t('admin.total')}
                                        </span>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}