import {
    Clock,
    CheckCircle,
    Truck,
    Package,
    XCircle,
    RotateCcw
} from 'lucide-react';
import { type OrderStatus } from '../../../types';

interface OrderStatusBadgeProps {
    status: OrderStatus;
    showAnimation?: boolean;
    size?: 'sm' | 'md' | 'lg';
}

export default function OrderStatusBadge({
    status,
    showAnimation = true,
    size = 'md'
}: OrderStatusBadgeProps) {
    const statusConfig = {
        PENDING: {
            icon: Clock,
            label: 'Pending',
            gradient: 'from-yellow-500 to-amber-600',
            bgClass: 'bg-yellow-100 dark:bg-yellow-900/30',
            textClass: 'text-yellow-700 dark:text-yellow-400',
            iconClass: 'text-yellow-600 dark:text-yellow-500',
            borderClass: 'border-yellow-200 dark:border-yellow-800',
            glowClass: 'shadow-yellow-500/20',
            pulseColor: 'bg-yellow-500',
            showPulse: true
        },
        CONFIRMED: {
            icon: CheckCircle,
            label: 'Confirmed',
            gradient: 'from-blue-500 to-cyan-600',
            bgClass: 'bg-blue-100 dark:bg-blue-900/30',
            textClass: 'text-blue-700 dark:text-blue-400',
            iconClass: 'text-blue-600 dark:text-blue-500',
            borderClass: 'border-blue-200 dark:border-blue-800',
            glowClass: 'shadow-blue-500/20',
            pulseColor: 'bg-blue-500',
            showPulse: false
        },
        SHIPPING: {
            icon: Truck,
            label: 'Shipping',
            gradient: 'from-purple-500 to-indigo-600',
            bgClass: 'bg-purple-100 dark:bg-purple-900/30',
            textClass: 'text-purple-700 dark:text-purple-400',
            iconClass: 'text-purple-600 dark:text-purple-500',
            borderClass: 'border-purple-200 dark:border-purple-800',
            glowClass: 'shadow-purple-500/20',
            pulseColor: 'bg-purple-500',
            showPulse: true
        },
        DELIVERED: {
            icon: Package,
            label: 'Delivered',
            gradient: 'from-green-500 to-emerald-600',
            bgClass: 'bg-green-100 dark:bg-green-900/30',
            textClass: 'text-green-700 dark:text-green-400',
            iconClass: 'text-green-600 dark:text-green-500',
            borderClass: 'border-green-200 dark:border-green-800',
            glowClass: 'shadow-green-500/20',
            pulseColor: 'bg-green-500',
            showPulse: false
        },
        CANCELLED: {
            icon: XCircle,
            label: 'Cancelled',
            gradient: 'from-red-500 to-rose-600',
            bgClass: 'bg-red-100 dark:bg-red-900/30',
            textClass: 'text-red-700 dark:text-red-400',
            iconClass: 'text-red-600 dark:text-red-500',
            borderClass: 'border-red-200 dark:border-red-800',
            glowClass: 'shadow-red-500/20',
            pulseColor: 'bg-red-500',
            showPulse: false
        },
        RETURNED: {
            icon: RotateCcw,
            label: 'Returned',
            gradient: 'from-orange-500 to-amber-600',
            bgClass: 'bg-orange-100 dark:bg-orange-900/30',
            textClass: 'text-orange-700 dark:text-orange-400',
            iconClass: 'text-orange-600 dark:text-orange-500',
            borderClass: 'border-orange-200 dark:border-orange-800',
            glowClass: 'shadow-orange-500/20',
            pulseColor: 'bg-orange-500',
            showPulse: false
        },
        PAYMENT_PENDING: {
            icon: Clock,
            label: 'Payment Pending',
            gradient: 'from-orange-400 to-yellow-500',
            bgClass: 'bg-orange-100 dark:bg-orange-900/30',
            textClass: 'text-orange-700 dark:text-orange-400',
            iconClass: 'text-orange-600 dark:text-orange-500',
            borderClass: 'border-orange-200 dark:border-orange-800',
            glowClass: 'shadow-orange-500/20',
            pulseColor: 'bg-orange-500',
            showPulse: true
        }
    };

    const sizeConfig = {
        sm: {
            padding: 'px-2.5 py-1',
            iconSize: 'w-3.5 h-3.5',
            textSize: 'text-xs',
            dotSize: 'w-1.5 h-1.5',
            spacing: 'space-x-1.5'
        },
        md: {
            padding: 'px-3 py-1.5',
            iconSize: 'w-4 h-4',
            textSize: 'text-sm',
            dotSize: 'w-2 h-2',
            spacing: 'space-x-2'
        },
        lg: {
            padding: 'px-4 py-2',
            iconSize: 'w-5 h-5',
            textSize: 'text-base',
            dotSize: 'w-2.5 h-2.5',
            spacing: 'space-x-2.5'
        }
    };

    const config = statusConfig[status];
    const sizes = sizeConfig[size];
    const Icon = config.icon;

    return (
        <div className={`
            inline-flex items-center ${sizes.spacing} ${sizes.padding} 
            rounded-full border
            ${config.bgClass} 
            ${config.borderClass}
            transition-all duration-300
            ${showAnimation ? 'hover-scale' : ''}
            shadow-sm hover:shadow-md ${config.glowClass}
        `}>
            {/* Animated pulse dot for active statuses */}
            {config.showPulse && showAnimation && (
                <span className="relative flex">
                    <span className={`
                        animate-ping absolute inline-flex h-full w-full rounded-full 
                        ${config.pulseColor} opacity-75
                    `}></span>
                    <span className={`
                        relative inline-flex rounded-full ${sizes.dotSize} 
                        ${config.pulseColor}
                    `}></span>
                </span>
            )}

            {/* Icon with optional animation */}
            <Icon className={`
                ${sizes.iconSize} ${config.iconClass}
                ${showAnimation && status === 'SHIPPING' ? 'animate-bounce' : ''}
                transition-transform duration-300
            `} />

            {/* Status label */}
            <span className={`${sizes.textSize} font-semibold ${config.textClass}`}>
                {config.label}
            </span>
        </div>
    );
}

// Export variant with gradient background
export function OrderStatusBadgeGradient({
    status,
    size = 'md'
}: OrderStatusBadgeProps) {
    const statusConfig = {
        PENDING: {
            icon: Clock,
            label: 'Pending',
            gradient: 'from-yellow-500 to-amber-600',
            showPulse: true
        },
        CONFIRMED: {
            icon: CheckCircle,
            label: 'Confirmed',
            gradient: 'from-blue-500 to-cyan-600',
            showPulse: false
        },
        SHIPPING: {
            icon: Truck,
            label: 'Shipping',
            gradient: 'from-purple-500 to-indigo-600',
            showPulse: true
        },
        DELIVERED: {
            icon: Package,
            label: 'Delivered',
            gradient: 'from-green-500 to-emerald-600',
            showPulse: false
        },
        CANCELLED: {
            icon: XCircle,
            label: 'Cancelled',
            gradient: 'from-red-500 to-rose-600',
            showPulse: false
        },
        RETURNED: {
            icon: RotateCcw,
            label: 'Returned',
            gradient: 'from-orange-500 to-amber-600',
            showPulse: false
        },
        PAYMENT_PENDING: {
            icon: Clock,
            label: 'Payment Pending',
            gradient: 'from-orange-400 to-yellow-500',
            showPulse: true
        }
    };

    const sizeConfig = {
        sm: {
            padding: 'px-2.5 py-1',
            iconSize: 'w-3.5 h-3.5',
            textSize: 'text-xs',
            spacing: 'space-x-1.5'
        },
        md: {
            padding: 'px-3 py-1.5',
            iconSize: 'w-4 h-4',
            textSize: 'text-sm',
            spacing: 'space-x-2'
        },
        lg: {
            padding: 'px-4 py-2',
            iconSize: 'w-5 h-5',
            textSize: 'text-base',
            spacing: 'space-x-2.5'
        }
    };

    const config = statusConfig[status];
    const sizes = sizeConfig[size];
    const Icon = config.icon;

    return (
        <div className={`
            inline-flex items-center ${sizes.spacing} ${sizes.padding}
            rounded-full
            bg-gradient-to-r ${config.gradient}
            text-white
            shadow-lg hover:shadow-xl
            transition-all duration-300
            hover-scale
        `}>
            <Icon className={`
                ${sizes.iconSize}
                ${status === 'SHIPPING' ? 'animate-bounce' : ''}
            `} />
            <span className={`${sizes.textSize} font-semibold`}>
                {config.label}
            </span>
        </div>
    );
}