import { useTranslation } from 'react-i18next';
import { TrendingUp, Award, BookOpen, DollarSign } from 'lucide-react';

interface TopBook {
    bookId: string;
    bookTitle: string;
    totalSold: number;
    revenue: number;
}

interface TopBooksProps {
    topBooks: TopBook[];
}

export default function TopBooks({ topBooks }: TopBooksProps) {
    const { t } = useTranslation();

    const getRankBadge = (index: number) => {
        const badges = [
            { gradient: 'from-amber-500 to-orange-600', icon: '🥇', glow: 'shadow-amber-500/50' },
            { gradient: 'from-gray-400 to-gray-500', icon: '🥈', glow: 'shadow-gray-500/50' },
            { gradient: 'from-orange-600 to-red-600', icon: '🥉', glow: 'shadow-orange-500/50' },
        ];
        
        if (index < 3) {
            return badges[index];
        }
        return { gradient: 'from-gray-300 to-gray-400 dark:from-gray-700 dark:to-gray-600', icon: index + 1, glow: '' };
    };
    
    return (
        <div className="card animate-fadeInUp h-full flex flex-col">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                    <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-500 dark:from-amber-600 dark:to-orange-600 rounded-lg flex items-center justify-center">
                        <TrendingUp className="w-5 h-5 text-white" strokeWidth={2.5} />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                        {t('admin.topSellingBooks')}
                    </h3>
                </div>
                <span className="badge badge-primary text-xs">
                    {t('admin.top')} {topBooks?.length || 0}
                </span>
            </div>
            
            {topBooks && topBooks.length > 0 ? (
                <div className="space-y-3 flex-1">
                    {topBooks.slice(0, 5).map((book, index) => {
                        const rankBadge = getRankBadge(index);
                        const maxRevenue = Math.max(...topBooks.map(b => b.revenue));
                        const revenuePercentage = (book.revenue / maxRevenue) * 100;

                        return (
                            <div 
                                key={book.bookId} 
                                className="stagger-item group relative p-3 rounded-xl hover:bg-gradient-to-r hover:from-amber-50 hover:to-orange-50 dark:hover:from-amber-900/20 dark:hover:to-orange-900/20 transition-all hover-lift border-2 border-transparent hover:border-amber-200 dark:hover:border-amber-800"
                                style={{ animationDelay: `${index * 0.1}s` }}
                            >
                                <div className="flex items-center gap-3">
                                    {/* Rank Badge với animation */}
                                    <div className="relative">
                                        <div className={`w-10 h-10 bg-gradient-to-br ${rankBadge.gradient} rounded-full flex items-center justify-center text-sm font-bold text-white shadow-lg ${rankBadge.glow} group-hover:scale-110 transition-transform`}>
                                            {rankBadge.icon}
                                        </div>
                                        {index < 3 && (
                                            <div className="absolute -top-1 -right-1">
                                                <Award className="w-4 h-4 text-amber-500 dark:text-amber-400 animate-pulse" />
                                            </div>
                                        )}
                                    </div>

                                    {/* Book Info */}
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-bold text-gray-900 dark:text-white truncate group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors mb-1">
                                            {book.bookTitle}
                                        </p>
                                        
                                        <div className="flex items-center gap-3 text-xs">
                                            <span className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                                                <BookOpen className="w-3 h-3" />
                                                <span className="font-semibold">{book.totalSold}</span> {t('admin.sold')}
                                            </span>
                                            <span className="text-gray-400 dark:text-gray-600">•</span>
                                            <span className="flex items-center gap-1 text-amber-600 dark:text-amber-400 font-bold">
                                                <DollarSign className="w-3 h-3" />
                                                {book.revenue?.toLocaleString() || 0}
                                            </span>
                                        </div>

                                        {/* Revenue Progress Bar */}
                                        <div className="mt-2 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                            <div 
                                                className="h-full bg-gradient-to-r from-amber-500 to-orange-500 dark:from-amber-600 dark:to-orange-600 rounded-full transition-all duration-500"
                                                style={{ width: `${revenuePercentage}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <div className="flex-1 flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600 p-8">
                    <div className="w-20 h-20 bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/40 dark:to-orange-900/40 rounded-full flex items-center justify-center mb-4 animate-pulse">
                        <BookOpen className="w-10 h-10 text-amber-600 dark:text-amber-400" />
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 font-medium text-center">
                        {t('admin.noTopBooksData')}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-2 text-center">
                        {t('admin.dataWillAppearHere')}
                    </p>
                </div>
            )}
        </div>
    );
}