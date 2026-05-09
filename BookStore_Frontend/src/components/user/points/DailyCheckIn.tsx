import { useTranslation } from 'react-i18next';import { Calendar, Gift, Zap, CheckCircle } from 'lucide-react';
import { useAppContext } from '../../../context/AppContext';
import type { PointsSummaryResponse } from '../../../types/points.types';

interface DailyCheckInProps {
  summary: PointsSummaryResponse;
  checking: boolean;
  onCheckIn: () => Promise<void>;
}

export const DailyCheckIn = ({ summary, checking, onCheckIn }: DailyCheckInProps) => {const { t } = useTranslation();
  const { language } = useAppContext();

  const days = [1, 2, 3, 4, 5, 6, 7];
  const basePoints = 10;
  const bonusPoints = 50;

  return (
    <div className="space-y-6">
            {/* Check-in Status */}
            <div className={`rounded-xl p-6 border-2 ${summary.checkedInToday ?
      'bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-500' :
      'bg-gradient-to-br from-amber-50 to-orange-50 dark:from-gray-800 dark:to-gray-700 border-amber-500'}`
      }>
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                            {summary.checkedInToday ?
              language === 'vi' ? t("Common.daDiemDanhHomNay") : 'Checked in today!' :
              language === 'vi' ? t("Common.diemDanhHangNgay") : 'Daily Check-in'}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400">
                            {language === 'vi' ?
              `Chuỗi check-in: ${summary.consecutiveCheckInDays} ngày` :
              `Streak: ${summary.consecutiveCheckInDays} days`}
                        </p>
                    </div>
                    {summary.checkedInToday ?
          <CheckCircle className="w-12 h-12 text-green-600 dark:text-green-400" /> :

          <button
            onClick={onCheckIn}
            disabled={checking}
            className="px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-500 dark:from-amber-600 dark:to-orange-600 text-white rounded-xl font-bold hover:from-amber-600 hover:to-orange-600 dark:hover:from-amber-700 dark:hover:to-orange-700 transition-all disabled:opacity-50 shadow-lg hover:shadow-xl flex items-center gap-2">
            
                            {checking ?
            <>
                                    <Zap className="w-5 h-5 animate-spin" />
                                    {language === 'vi' ? t("Common.dangXuLy") : 'Processing...'}
                                </> :

            <>
                                    <Gift className="w-5 h-5" />
                                    {language === 'vi' ? t("Common.diemDanh10d") : 'Check-in +10pts'}
                                </>
            }
                        </button>
          }
                </div>

                {/* Streak Progress */}
                <div className="bg-white/50 dark:bg-gray-800/50 rounded-lg p-4">
                    <div className="grid grid-cols-7 gap-2">
                        {days.map((day) => {
              const isChecked = day <= summary.consecutiveCheckInDays;
              const isToday = day === summary.consecutiveCheckInDays + (summary.checkedInToday ? 0 : 1);
              const isBonusDay = day === 7;

              return (
                <div
                  key={day}
                  className={`aspect-square rounded-lg flex flex-col items-center justify-center p-2 transition-all ${isChecked ?
                  'bg-gradient-to-br from-amber-500 to-orange-500 text-white shadow-lg scale-105' :
                  isToday ?
                  'bg-amber-100 dark:bg-amber-900/30 border-2 border-amber-500 dark:border-amber-400' :
                  'bg-gray-100 dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600'}`
                  }>
                  
                                    <span className="text-xs font-medium mb-1">
                                        {language === 'vi' ? t("Common.ngay") : 'Day'} {day}
                                    </span>
                                    <span className="text-lg font-bold">
                                        {isBonusDay ?
                    <Gift className="w-5 h-5" /> :
                    isChecked ?
                    <CheckCircle className="w-5 h-5" /> :

                    `+${basePoints}`
                    }
                                    </span>
                                    {isBonusDay &&
                  <span className="text-[10px] font-bold mt-0.5">
                                            +{bonusPoints}
                                        </span>
                  }
                                </div>);

            })}
                    </div>
                    <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-3">
                        {language === 'vi' ?
            `Check-in 7 ngày liên tục nhận +${bonusPoints} điểm bonus!` :
            `Check-in 7 days in a row to get +${bonusPoints} bonus points!`}
                    </p>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-3 mb-2">
                        <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                            {language === 'vi' ? t("Common.tongCheckin") : 'Total Check-ins'}
                        </span>
                    </div>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">
                        {summary.totalCheckIns}
                    </p>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-3 mb-2">
                        <Zap className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                            {language === 'vi' ? t("Common.lienTuc") : 'Current Streak'}
                        </span>
                    </div>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">
                        {summary.consecutiveCheckInDays}
                    </p>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-3 mb-2">
                        <Gift className="w-5 h-5 text-green-600 dark:text-green-400" />
                        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                            {language === 'vi' ? t("Common.diemTuCheckin") : 'Points from Check-in'}
                        </span>
                    </div>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">
                        {summary.totalCheckIns * basePoints + Math.floor(summary.totalCheckIns / 7) * bonusPoints}
                    </p>
                </div>
            </div>

            {/* Tips */}
            <div className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-gray-800 dark:to-gray-700 rounded-xl p-6 border-2 border-blue-200 dark:border-blue-800">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                    <Zap className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    {language === 'vi' ? t("Common.meo") : 'Tips'}
                </h4>
                <ul className="space-y-2 text-gray-700 dark:text-gray-300 text-sm">
                    <li>• {language === 'vi' ? t("Common.diemDanhMoiNgayDe") : 'Check-in daily to earn points'}</li>
                    <li>• {language === 'vi' ? t("Common.chuoiCheckinSeResetNeu") : 'Streak resets if you miss a day'}</li>
                    <li>• {language === 'vi' ? t("Common.checkin7NgayLienTuc") : 'Complete 7-day streak for 50 bonus points'}</li>
                    <li>• {language === 'vi' ? t("Common.diemDanhCangSomCang") : 'Check-in early to not forget!'}</li>
                </ul>
            </div>
        </div>);

};