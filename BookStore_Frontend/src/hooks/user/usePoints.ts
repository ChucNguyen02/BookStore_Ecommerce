import { useState, useEffect } from 'react';
import { pointsService } from '../../services';
import { useAppContext } from '../../context/AppContext';
import toast from 'react-hot-toast';
import type { PointsResponse, PointsSummaryResponse, CheckInResponse } from '../../types';

export const usePoints = () => {
    const { language } = useAppContext();
    const [points, setPoints] = useState<PointsResponse | null>(null);
    const [summary, setSummary] = useState<PointsSummaryResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [checkingIn, setCheckingIn] = useState(false);

    const fetchPoints = async () => {
        try {
            setLoading(true);
            setError(null);
            const [pointsData, summaryData] = await Promise.all([
                pointsService.getUserPoints(),
                pointsService.getPointsSummary(),
            ]);
            setPoints(pointsData);
            setSummary(summaryData);
        } catch (err: unknown) {
            const errorMsg = err instanceof Error ? err.message : (language === 'vi' ? 'Không thể tải thông tin điểm' : 'Failed to load points');
            setError(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    const dailyCheckIn = async () => {
        try {
            setCheckingIn(true);
            const result: CheckInResponse = await pointsService.dailyCheckIn();

            toast.success(
                language === 'vi'
                    ? `Điểm danh thành công! +${result.pointsEarned}${result.bonusPoints ? ` (Bonus +${result.bonusPoints})` : ''} điểm`
                    : `Check-in successful! +${result.pointsEarned}${result.bonusPoints ? ` (Bonus +${result.bonusPoints})` : ''} points`,
                { duration: 5000 }
            );

            if (result.nextBonusAt) {
                toast(
                    language === 'vi'
                        ? `Check-in thêm ${result.nextBonusAt} ngày nữa để nhận bonus!`
                        : `Check-in ${result.nextBonusAt} more days for bonus!`,
                    { icon: '🎉', duration: 4000 }
                );
            }

            // Refresh data
            await fetchPoints();
        } catch (err: unknown) {
            const errorMsg = err instanceof Error ? err.message : (language === 'vi' ? 'Điểm danh thất bại' : 'Check-in failed');
            toast.error(errorMsg);
        } finally {
            setCheckingIn(false);
        }
    };

    useEffect(() => {
        fetchPoints();
    }, []);

    return {
        points,
        summary,
        loading,
        error,
        checkingIn,
        dailyCheckIn,
        refetch: fetchPoints,
    };
};