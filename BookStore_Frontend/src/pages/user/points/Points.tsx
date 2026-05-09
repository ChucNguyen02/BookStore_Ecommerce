import { useState, useMemo } from 'react';
import { Award, Gift, History, Trophy, TrendingUp, Calendar, Star } from 'lucide-react';
import { PointsOverview } from '../../../components/user/points/PointsOverview';
import { DailyCheckIn } from '../../../components/user/points/DailyCheckIn';
import { PointsHistory } from '../../../components/user/points/PointsHistory';
import { RewardsShop } from '../../../components/user/points/RewardsShop';
import { TierProgress } from '../../../components/user/points/TierProgress';
import { usePoints } from '../../../hooks/user/usePoints';
import LoadingSpinner from '../../../components/user/common/LoadingSpinner';
import { useTranslation } from 'react-i18next';

type TabType = 'overview' | 'history' | 'rewards' | 'checkin';

const Points = () => {
    const { t } = useTranslation();
    const [activeTab, setActiveTab] = useState<TabType>('overview');
    const {
        points,
        summary,
        loading,
        error,
        checkingIn,
        dailyCheckIn,
    } = usePoints();

    const tabs = useMemo(() => [
        {
            id: 'overview' as TabType,
            label: t('Points.tabs.overview'),
            icon: <Trophy className="w-5 h-5" />,
        },
        {
            id: 'checkin' as TabType,
            label: t('Points.tabs.checkin'),
            icon: <Calendar className="w-5 h-5" />,
        },
        {
            id: 'history' as TabType,
            label: t('Points.tabs.history'),
            icon: <History className="w-5 h-5" />,
        },
        {
            id: 'rewards' as TabType,
            label: t('Points.tabs.rewards'),
            icon: <Gift className="w-5 h-5" />,
        },
    ], [t]);

    if (loading) {
        return <LoadingSpinner fullScreen />;
    }

    if (error || !points) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center space-y-4">
                    <p className="text-xl text-red-600 dark:text-red-400">
                        {error || t('Points.error.loadFailed')}
                    </p>
                    <button
                        onClick={() => window.location.reload()}
                        className="px-6 py-3 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors"
                    >
                        {t('Points.error.tryAgain')}
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
            <div className="container mx-auto px-4 py-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-serif font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-3">
                        <Award className="w-10 h-10 text-amber-600 dark:text-amber-400" />
                        {t('Points.title')}
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        {t('Points.subtitle')}
                    </p>
                </div>

                {/* Points Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="bg-gradient-to-br from-amber-500 to-orange-500 dark:from-amber-600 dark:to-orange-600 text-white rounded-2xl p-6 shadow-lg">
                        <div className="flex items-center justify-between mb-2">
                            <Star className="w-8 h-8" />
                            <span className="text-3xl font-bold">{points.totalPoints}</span>
                        </div>
                        <p className="text-sm opacity-90">{t('Points.stats.currentPoints')}</p>
                        <p className="text-xs mt-1 opacity-75">
                            {t('Points.stats.lifetime', { points: points.lifetimePoints })}
                        </p>
                    </div>

                    <div className="bg-gradient-to-br from-purple-500 to-pink-500 dark:from-purple-600 dark:to-pink-600 text-white rounded-2xl p-6 shadow-lg">
                        <div className="flex items-center justify-between mb-2">
                            <Trophy className="w-8 h-8" />
                            <span className="text-3xl font-bold">{points.tier}</span>
                        </div>
                        <p className="text-sm opacity-90">{t('Points.stats.tier')}</p>
                        {points.nextTier && (
                            <p className="text-xs mt-1 opacity-75">
                                {t('Points.stats.pointsToNext', {
                                    points: points.pointsToNextTier,
                                    tier: points.nextTier
                                })}
                            </p>
                        )}
                    </div>

                    {summary && (
                        <>
                            <div className="bg-gradient-to-br from-green-500 to-emerald-500 dark:from-green-600 dark:to-emerald-600 text-white rounded-2xl p-6 shadow-lg">
                                <div className="flex items-center justify-between mb-2">
                                    <Calendar className="w-8 h-8" />
                                    <span className="text-3xl font-bold">{summary.consecutiveCheckInDays}</span>
                                </div>
                                <p className="text-sm opacity-90">{t('Points.stats.checkinDays')}</p>
                                <p className="text-xs mt-1 opacity-75">
                                    {t('Points.stats.totalCheckIns', { count: summary.totalCheckIns })}
                                </p>
                            </div>

                            <div className="bg-gradient-to-br from-blue-500 to-cyan-500 dark:from-blue-600 dark:to-cyan-600 text-white rounded-2xl p-6 shadow-lg">
                                <div className="flex items-center justify-between mb-2">
                                    <TrendingUp className="w-8 h-8" />
                                    <span className="text-3xl font-bold">{summary.pointsEarnedThisMonth}</span>
                                </div>
                                <p className="text-sm opacity-90">{t('Points.stats.thisMonth')}</p>
                                <p className="text-xs mt-1 opacity-75">
                                    {t('Points.stats.usedThisMonth', { count: summary.pointsRedeemedThisMonth })}
                                </p>
                            </div>
                        </>
                    )}
                </div>

                {/* Tier Progress */}
                {points.nextTier && (
                    <div className="mb-8">
                        <TierProgress
                            currentTier={points.tier}
                            nextTier={points.nextTier}
                            currentPoints={points.lifetimePoints}
                            pointsToNextTier={points.pointsToNextTier || 0}
                        />
                    </div>
                )}

                {/* Tabs */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
                    <div className="flex border-b border-gray-200 dark:border-gray-700 overflow-x-auto">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex-1 min-w-[120px] px-6 py-4 font-semibold transition-colors flex items-center justify-center gap-2 ${activeTab === tab.id
                                    ? 'bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 border-b-2 border-amber-500'
                                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                                    }`}
                            >
                                {tab.icon}
                                <span>{tab.label}</span>
                            </button>
                        ))}
                    </div>

                    <div className="p-6">
                        {activeTab === 'overview' && summary && (
                            <PointsOverview summary={summary} />
                        )}

                        {activeTab === 'checkin' && summary && (
                            <DailyCheckIn
                                summary={summary}
                                checking={checkingIn}
                                onCheckIn={dailyCheckIn}
                            />
                        )}

                        {activeTab === 'history' && (
                            <PointsHistory />
                        )}

                        {activeTab === 'rewards' && (
                            <RewardsShop currentPoints={points.totalPoints} />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Points;