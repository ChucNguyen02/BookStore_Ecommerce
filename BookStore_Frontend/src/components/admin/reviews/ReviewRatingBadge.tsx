import { Star } from 'lucide-react';

interface ReviewRatingBadgeProps {
    rating: number;
    size?: 'sm' | 'md' | 'lg';
}

export default function ReviewRatingBadge({ rating, size = 'md' }: ReviewRatingBadgeProps) {
    const sizeClasses = {
        sm: 'w-3 h-3',
        md: 'w-4 h-4',
        lg: 'w-5 h-5'
    };

    const textClasses = {
        sm: 'text-xs',
        md: 'text-sm',
        lg: 'text-base'
    };

    const getRatingColor = (rating: number) => {
        if (rating >= 4) return 'text-green-600 dark:text-green-400';
        if (rating >= 3) return 'text-yellow-600 dark:text-yellow-400';
        return 'text-red-600 dark:text-red-400';
    };

    return (
        <div className="inline-flex items-center space-x-1 animate-fadeInLeft">
            {[...Array(5)].map((_, index) => (
                <Star
                    key={index}
                    className={`${sizeClasses[size]} transition-smooth hover-scale ${index < rating
                            ? 'fill-amber-400 text-amber-400'
                            : 'fill-gray-300 text-gray-300 dark:fill-gray-600 dark:text-gray-600'
                        }`}
                />
            ))}
            <span className={`${textClasses[size]} font-semibold ${getRatingColor(rating)} ml-1`}>
                {rating.toFixed(1)}
            </span>
        </div>
    );
}