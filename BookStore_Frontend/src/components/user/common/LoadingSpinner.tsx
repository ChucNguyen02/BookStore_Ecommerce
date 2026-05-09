import { Loader2 } from 'lucide-react';

interface LoadingSpinnerProps {
    fullScreen?: boolean;
    size?: 'sm' | 'md' | 'lg';
    message?: string;
}

export default function LoadingSpinner({ fullScreen, size = 'md', message }: LoadingSpinnerProps) {
    const sizeClasses = {
        sm: 'w-6 h-6',
        md: 'w-10 h-10',
        lg: 'w-16 h-16'
    };

    const glowClasses = {
        sm: 'blur-md',
        md: 'blur-xl',
        lg: 'blur-2xl'
    };

    // Full screen loading - Với gradient background
    if (fullScreen) {
        return (
            <div className="fixed inset-0 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-gray-900 dark:to-gray-800 flex flex-col items-center justify-center z-50 animate-fadeIn">
                <div className="relative animate-scaleIn">
                    {/* Outer ring */}
                    <div className="absolute inset-0 -m-4">
                        <div className="w-full h-full border-4 border-amber-200 dark:border-amber-900/30 rounded-full animate-ping opacity-75"></div>
                    </div>
                    
                    {/* Main spinner container */}
                    <div className="relative">
                        <Loader2 
                            className={`${sizeClasses[size]} animate-spin text-amber-600 dark:text-amber-400`}
                            strokeWidth={2.5}
                        />
                        {/* Animated glow effect */}
                        <div className="absolute inset-0 animate-pulse">
                            <div className={`w-full h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full ${glowClasses[size]} opacity-40`}></div>
                        </div>
                    </div>
                </div>
                
                {message && (
                    <p className="mt-8 text-base font-medium text-gray-700 dark:text-gray-300 animate-fadeInUp">
                        {message}
                    </p>
                )}

                
            </div>
        );
    }

    // Content area loading - Clean and centered
    return (
        <div className="flex flex-col items-center justify-center p-12 animate-fadeIn">
            <div className="relative">
                {/* Decorative circle background */}
                <div className="absolute inset-0 -m-3">
                    <div className="w-full h-full bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/20 dark:to-orange-900/20 rounded-full"></div>
                </div>

                {/* Main spinner */}
                <div className="relative">
                    <Loader2 
                        className={`${sizeClasses[size]} animate-spin text-amber-600 dark:text-amber-400`}
                        strokeWidth={2.5}
                    />
                    {/* Glow effect */}
                    <div className="absolute inset-0 animate-pulse">
                        <div className={`w-full h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full ${glowClasses[size]} opacity-30`}></div>
                    </div>
                </div>
            </div>

            {message && (
                <p className="mt-6 text-sm font-medium text-gray-600 dark:text-gray-400 animate-fadeInUp">
                    {message}
                </p>
            )}
        </div>
    );
}