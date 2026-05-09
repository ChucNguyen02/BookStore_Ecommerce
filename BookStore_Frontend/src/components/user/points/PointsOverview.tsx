import { useTranslation } from 'react-i18next';import { TrendingUp, TrendingDown, Award, Calendar, Gift } from 'lucide-react';
import { useAppContext } from '../../../context/AppContext';
import type { PointsSummaryResponse } from '../../../types/points.types';

interface PointsOverviewProps {
  summary: PointsSummaryResponse;
}

export const PointsOverview = ({ summary }: PointsOverviewProps) => {const { t } = useTranslation();
  const { language } = useAppContext();

  const benefits = [
  {
    tier: 'BRONZE',
    color: 'from-orange-400 to-orange-600',
    benefits: language === 'vi' ?
    [t("Common.tichDiemCoBan"), t("Common.uuDaiSinhNhat"), t("Common.hoTroUuTien")] :
    ['Basic points', 'Birthday discount', 'Priority support']
  },
  {
    tier: 'SILVER',
    color: 'from-gray-400 to-gray-600',
    benefits: language === 'vi' ?
    [t("Common.tichDiemX12"), t("Common.mienPhiShip"), t("Common.voucherDocQuyen")] :
    ['1.2x points', 'Free shipping', 'Exclusive vouchers']
  },
  {
    tier: 'GOLD',
    color: 'from-yellow-400 to-yellow-600',
    benefits: language === 'vi' ?
    [t("Common.tichDiemX15"), t("Common.uuDaiDacBiet"), t("Common.quaTangHangThang")] :
    ['1.5x points', 'Special offers', 'Monthly gifts']
  },
  {
    tier: 'PLATINUM',
    color: 'from-purple-400 to-purple-600',
    benefits: language === 'vi' ?
    [t("Common.tichDiemX2"), t("Common.vipDocQuyen"), t("Common.suKienDacBiet")] :
    ['2x points', 'VIP exclusive', 'Special events']
  }];


  return (
    <div className="space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-gray-800 dark:to-gray-700 rounded-xl p-4 border border-amber-200 dark:border-amber-800">
                    <div className="flex items-center gap-3 mb-2">
                        <Award className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                            {language === 'vi' ? t("Common.diemHienTai") : 'Current Points'}
                        </span>
                    </div>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">
                        {summary.totalPoints.toLocaleString()}
                    </p>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-800 dark:to-gray-700 rounded-xl p-4 border border-purple-200 dark:border-purple-800">
                    <div className="flex items-center gap-3 mb-2">
                        <TrendingUp className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                            {language === 'vi' ? 'Lifetime' : 'Lifetime'}
                        </span>
                    </div>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">
                        {summary.lifetimePoints.toLocaleString()}
                    </p>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-gray-800 dark:to-gray-700 rounded-xl p-4 border border-green-200 dark:border-green-800">
                    <div className="flex items-center gap-3 mb-2">
                        <Calendar className="w-5 h-5 text-green-600 dark:text-green-400" />
                        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                            {language === 'vi' ? t("Common.checkinLienTuc") : 'Consecutive Days'}
                        </span>
                    </div>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">
                        {summary.consecutiveCheckInDays}
                    </p>
                </div>

                <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-gray-800 dark:to-gray-700 rounded-xl p-4 border border-blue-200 dark:border-blue-800">
                    <div className="flex items-center gap-3 mb-2">
                        <Gift className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                            {language === 'vi' ? t("Common.daDoiQua") : 'Redemptions'}
                        </span>
                    </div>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">
                        {summary.totalRedemptions}
                    </p>
                </div>
            </div>

            {/* Monthly Stats */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    {language === 'vi' ? t("Common.thongKeThangNay") : 'This Month Stats'}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                            <TrendingUp className="w-6 h-6 text-green-600 dark:text-green-400" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                {language === 'vi' ? t("Common.diemNhanDuoc") : 'Points Earned'}
                            </p>
                            <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                                +{summary.pointsEarnedThisMonth.toLocaleString()}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
                            <TrendingDown className="w-6 h-6 text-red-600 dark:text-red-400" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                {language === 'vi' ? t("Common.diemDaDung") : 'Points Redeemed'}
                            </p>
                            <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                                -{summary.pointsRedeemedThisMonth.toLocaleString()}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tier Benefits */}
            <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    {language === 'vi' ? t("Common.quyenLoiTheoHang") : 'Tier Benefits'}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {benefits.map((item) =>
          <div
            key={item.tier}
            className={`bg-gradient-to-br ${item.color} text-white rounded-xl p-4 ${summary.tier === item.tier ? 'ring-4 ring-white dark:ring-gray-800 ring-offset-2' : ''}`
            }>
            
                            <div className="flex items-center gap-2 mb-3">
                                <Award className="w-5 h-5" />
                                <span className="font-bold">{item.tier}</span>
                                {summary.tier === item.tier &&
              <span className="ml-auto text-xs bg-white/30 px-2 py-0.5 rounded-full">
                                        {language === 'vi' ? t("Common.hienTai") : 'Current'}
                                    </span>
              }
                            </div>
                            <ul className="space-y-1 text-sm opacity-90">
                                {item.benefits.map((benefit, idx) =>
              <li key={idx}>• {benefit}</li>
              )}
                            </ul>
                        </div>
          )}
                </div>
            </div>

            {/* Tips */}
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-gray-800 dark:to-gray-700 rounded-xl p-6 border-2 border-amber-200 dark:border-amber-800">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                    <Award className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                    {language === 'vi' ? t("Common.cachTichDiem") : 'How to Earn Points'}
                </h3>
                <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                    <li className="flex items-center gap-2">
                        <span className="w-6 h-6 bg-amber-500 text-white rounded-full flex items-center justify-center text-xs font-bold">1</span>
                        {language === 'vi' ? t("Common.muaSamNhanDiemTheo") : 'Shop: Earn points on every purchase'}
                    </li>
                    <li className="flex items-center gap-2">
                        <span className="w-6 h-6 bg-amber-500 text-white rounded-full flex items-center justify-center text-xs font-bold">2</span>
                        {language === 'vi' ? t("Common.diemDanhHangNgay10") : 'Daily check-in: +10 pts, 7 days streak +50 bonus'}
                    </li>
                    <li className="flex items-center gap-2">
                        <span className="w-6 h-6 bg-amber-500 text-white rounded-full flex items-center justify-center text-xs font-bold">3</span>
                        {language === 'vi' ? t("Common.vietReviewNhanDiemCho") : 'Write reviews: Get points for each review'}
                    </li>
                    <li className="flex items-center gap-2">
                        <span className="w-6 h-6 bg-amber-500 text-white rounded-full flex items-center justify-center text-xs font-bold">4</span>
                        {language === 'vi' ? t("Common.gioiThieuBanBeCa") : 'Refer friends: Both get points'}
                    </li>
                </ul>
            </div>
        </div>);

};