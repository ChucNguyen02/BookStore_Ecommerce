import { type LucideIcon } from 'lucide-react';

interface VoucherStatsCardProps {
    label: string;
    value: number;
    icon: LucideIcon;
    color: 'blue' | 'green' | 'purple' | 'orange';
}

export default function VoucherStatsCard({ label, value, icon: Icon, color }: VoucherStatsCardProps) {
    const colorClasses = {
        blue: 'from-blue-500 to-cyan-500',
        green: 'from-green-500 to-emerald-500',
        purple: 'from-purple-500 to-pink-500',
        orange: 'from-orange-500 to-red-500',
    };

    return (
        <div className="card card-hover group">
            <div className="flex items-center justify-between mb-4">
                <div className={`w-14 h-14 bg-gradient-to-br ${colorClasses[color]} rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-smooth group-hover:scale-110`}>
                    <Icon className="w-7 h-7 text-white" />
                </div>
            </div>
            <p className="text-4xl font-bold text-gray-900 dark:text-white mb-2 animate-fadeInUp">
                {/* {value.toLocaleString()} */}
            </p>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                {label}
            </p>
            <div className={`mt-4 h-1 bg-gradient-to-r ${colorClasses[color]} rounded-full opacity-0 group-hover:opacity-100 transition-smooth`} />
        </div>
    );
}