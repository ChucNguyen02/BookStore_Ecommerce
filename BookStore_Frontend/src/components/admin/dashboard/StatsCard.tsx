import { TrendingUp, TrendingDown } from 'lucide-react';

interface StatsCardProps {
    label: string;
    value: string | number;
    change?: string;
    changeType?: 'increase' | 'decrease';
    description?: string;
    icon: any;
    colorClass: string;
}

export default function StatsCard({ 
    label, 
    value, 
    change, 
    changeType = 'increase',
    description,
    icon: Icon, 
    colorClass 
}: StatsCardProps) {
    return (
        <div className="card card-hover group">
            {/* Gradient Top Border */}
            <div className={`h-1.5 bg-gradient-to-r ${colorClass} rounded-t-xl`}></div>
            
            <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                    {/* Icon với enhanced effects */}
                    <div className="relative">
                        <div className={`relative w-16 h-16 bg-gradient-to-br ${colorClass} rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-300`}>
                            <Icon className="w-8 h-8 text-white" strokeWidth={2.5} />
                        </div>
                        {/* Animated glow effect */}
                        <div className={`absolute inset-0 bg-gradient-to-br ${colorClass} rounded-xl blur-xl opacity-0 group-hover:opacity-60 transition-opacity duration-300 animate-pulse`}></div>
                    </div>

                    {/* Change Badge */}
                    {change && (
                        <div className={`badge flex items-center gap-1.5 shadow-md hover-scale ${
                            changeType === 'increase'
                                ? 'badge-success'
                                : 'badge-danger'
                        }`}>
                            {changeType === 'increase' ? (
                                <TrendingUp className="w-3.5 h-3.5" />
                            ) : (
                                <TrendingDown className="w-3.5 h-3.5" />
                            )}
                            <span className="font-bold">{change}</span>
                        </div>
                    )}
                </div>
                
                <div className="space-y-2">
                    {/* Label */}
                    <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        {label}
                    </p>

                    {/* Value với gradient hover */}
                    <p className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:bg-clip-text group-hover:from-amber-500 group-hover:to-orange-500 transition-all duration-300">
                        {value}
                    </p>

                    {/* Description với animated dot */}
                    {description && (
                        <div className="flex items-center gap-2 pt-1">
                            <div className="relative">
                                <span className="w-2 h-2 bg-amber-500 dark:bg-amber-400 rounded-full inline-block animate-pulse"></span>
                                <span className="absolute inset-0 w-2 h-2 bg-amber-500 dark:bg-amber-400 rounded-full inline-block animate-ping opacity-75"></span>
                            </div>
                            <p className="text-xs text-gray-600 dark:text-gray-400 font-medium">
                                {description}
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* Bottom shine effect on hover */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-amber-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm"></div>
        </div>
    );
}