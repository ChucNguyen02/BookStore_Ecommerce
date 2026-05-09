import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Award, TrendingUp, TrendingDown, Calendar } from 'lucide-react';
import { pointsService } from '../../../services';
import { type PointTransactionResponse } from '../../../types/points.types';
import LoadingSpinner from '../common/LoadingSpinner';

interface UserPointsHistoryProps {
    userId: string;
}

export default function UserPointsHistory({ userId }: UserPointsHistoryProps) {
    const { t } = useTranslation();
    const [transactions, setTransactions] = useState<PointTransactionResponse[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchPointsHistory = async () => {
            try {
                setIsLoading(true);
                setError(null);

                // Note: Backend doesn't have admin endpoint to get user points by userId
                // This would need to be implemented as /admin/users/{userId}/points
                // For now, we'll use the regular user points history endpoint
                const response = await pointsService.getPointHistory(0, 100);
                setTransactions(response.content);
            } catch (err: any) {
                setError(err.message || 'Failed to fetch points history');
            } finally {
                setIsLoading(false);
            }
        };

        fetchPointsHistory();
    }, [userId]);

    if (isLoading) {
        return <LoadingSpinner />;
    }

    if (error) {
        return (
            <div className="text-center py-8">
                <p className="text-red-600 dark:text-red-400">{error}</p>
            </div>
        );
    }

    if (transactions.length === 0) {
        return (
            <div className="text-center py-12">
                <Award className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400">{t('admin.noPointsHistory')}</p>
            </div>
        );
    }

    const getTransactionIcon = (type: string) => {
        switch (type) {
            case 'EARN':
            case 'BONUS':
            case 'REFUND':
                return <TrendingUp className="w-5 h-5 text-green-500" />;
            case 'REDEEM':
            case 'EXPIRE':
                return <TrendingDown className="w-5 h-5 text-red-500" />;
            default:
                return <Award className="w-5 h-5 text-gray-500" />;
        }
    };

    const getTransactionColor = (type: string) => {
        switch (type) {
            case 'EARN':
            case 'BONUS':
            case 'REFUND':
                return 'text-green-600 dark:text-green-400';
            case 'REDEEM':
            case 'EXPIRE':
                return 'text-red-600 dark:text-red-400';
            default:
                return 'text-gray-600 dark:text-gray-400';
        }
    };

    return (
        <div className="space-y-4">
            {transactions.map((transaction, index) => (
                <div
                    key={transaction.id}
                    className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 hover:shadow-md transition-smooth hover-lift stagger-item"
                    style={{ animationDelay: `${index * 0.1}s` }}
                >
                    <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center text-white hover-scale">
                                {getTransactionIcon(transaction.type)}
                            </div>
                            <div>
                                <p className="font-semibold text-gray-900 dark:text-white">
                                    {transaction.type}
                                </p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    {transaction.description || transaction.referenceType}
                                </p>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className={`text-lg font-bold ${getTransactionColor(transaction.type)}`}>
                                {transaction.type === 'EARN' || transaction.type === 'BONUS' || transaction.type === 'REFUND' ? '+' : '-'}
                                {Math.abs(transaction.points)}
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                {t('admin.balance')}: {transaction.balanceAfter}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(transaction.createdAt).toLocaleString()}</span>
                    </div>
                </div>
            ))}
        </div>
    );
}