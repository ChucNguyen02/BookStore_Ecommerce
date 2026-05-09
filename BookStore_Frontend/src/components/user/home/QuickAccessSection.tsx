import { memo } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, TrendingUp, Clock, Tag, Gift, BookOpen } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export const QuickAccessSection = memo(() => {
    const { t } = useTranslation();

    const quickLinks = [
        {
            icon: <Sparkles className="w-8 h-8" />,
            title: t('QuickAccess.featured'),
            link: '/books?featured=true',
            color: 'from-amber-400 to-orange-500',
            bgColor: 'bg-amber-50 dark:bg-amber-900/20'
        },
        {
            icon: <TrendingUp className="w-8 h-8" />,
            title: t('QuickAccess.bestseller'),
            link: '/books?sort=bestseller',
            color: 'from-blue-400 to-cyan-500',
            bgColor: 'bg-blue-50 dark:bg-blue-900/20'
        },
        {
            icon: <Clock className="w-8 h-8" />,
            title: t('QuickAccess.new'),
            link: '/books?sort=newest',
            color: 'from-green-400 to-emerald-500',
            bgColor: 'bg-green-50 dark:bg-green-900/20'
        },
        {
            icon: <Tag className="w-8 h-8" />,
            title: t('QuickAccess.sale'),
            link: '/books?sale=true',
            color: 'from-red-400 to-pink-500',
            bgColor: 'bg-red-50 dark:bg-red-900/20'
        },
        {
            icon: <Gift className="w-8 h-8" />,
            title: t('QuickAccess.rewards'),
            link: '/rewards',
            color: 'from-purple-400 to-pink-500',
            bgColor: 'bg-purple-50 dark:bg-purple-900/20'
        },
        {
            icon: <BookOpen className="w-8 h-8" />,
            title: t('QuickAccess.allBooks'),
            link: '/books',
            color: 'from-gray-400 to-gray-600',
            bgColor: 'bg-gray-50 dark:bg-gray-800'
        }
    ];

    return (
        <section className="py-8 -mt-20 relative z-10">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    {quickLinks.map((item, index) => (
                        <Link
                            key={index}
                            to={item.link}
                            className={`group ${item.bgColor} rounded-2xl p-6 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2`}
                        >
                            <div className={`w-16 h-16 bg-gradient-to-br ${item.color} rounded-xl flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform shadow-lg`}>
                                {item.icon}
                            </div>
                            <h3 className="font-bold text-gray-900 dark:text-white text-lg">
                                {item.title}
                            </h3>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
});

QuickAccessSection.displayName = 'QuickAccessSection';