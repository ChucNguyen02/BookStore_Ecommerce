import { type LucideIcon } from 'lucide-react';

interface RewardStatsCardProps {
    label: string;
    value: number;
    icon: LucideIcon;
    color: 'amber' | 'blue' | 'orange' | 'green';
}

export default function RewardStatsCard({ label, value, icon: Icon, color }: RewardStatsCardProps) {
    const colorClasses = {
        amber: 'from-amber-500 to-orange-500',
        blue: 'from-blue-500 to-cyan-500',
        orange: 'from-orange-500 to-red-500',
        green: 'from-green-500 to-emerald-500',
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 bg-gradient-to-br ${colorClasses[color]} rounded-xl flex items-center justify-center`}>
                    <Icon className="w-6 h-6 text-white" />
                </div>
            </div>
            <p className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                {value}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
                {label}
            </p>
        </div>
    );
}