interface CategorySkeletonProps {
    viewMode?: 'grid' | 'list';
    count?: number;
}

export const CategorySkeleton = ({ viewMode = 'grid', count = 6 }: CategorySkeletonProps) => {
    if (viewMode === 'list') {
        return (
            <div className="space-y-4">
                {[...Array(count)].map((_, i) => (
                    <div key={i} className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden animate-pulse">
                        <div className="flex items-stretch">
                            {/* Image Skeleton */}
                            <div className="w-48 h-48 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600" />

                            {/* Content Skeleton */}
                            <div className="flex-1 p-6 space-y-4">
                                {/* Title */}
                                <div className="space-y-2">
                                    <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-2/3" />
                                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/4" />
                                </div>

                                {/* Description */}
                                <div className="space-y-2">
                                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full" />
                                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6" />
                                </div>

                                {/* Badges */}
                                <div className="flex gap-2">
                                    <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-full w-20" />
                                    <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-full w-24" />
                                </div>

                                {/* Tags */}
                                <div className="flex flex-wrap gap-2">
                                    {[...Array(5)].map((_, j) => (
                                        <div key={j} className="h-6 bg-gray-200 dark:bg-gray-700 rounded-full w-16" />
                                    ))}
                                </div>

                                {/* Button */}
                                <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-lg w-32" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(count)].map((_, i) => (
                <div key={i} className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden animate-pulse">
                    {/* Image Skeleton */}
                    <div className="aspect-[16/9] bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600" />

                    {/* Content Skeleton */}
                    <div className="p-6 space-y-4">
                        {/* Title */}
                        <div className="space-y-2">
                            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
                            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
                        </div>

                        {/* Description */}
                        <div className="space-y-2">
                            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full" />
                            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3" />
                        </div>

                        {/* Badges */}
                        <div className="flex gap-2">
                            <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded-full w-16" />
                        </div>

                        {/* Tags */}
                        <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-24 mb-2" />
                            <div className="flex flex-wrap gap-2">
                                {[...Array(3)].map((_, j) => (
                                    <div key={j} className="h-5 bg-gray-200 dark:bg-gray-700 rounded-full w-16" />
                                ))}
                            </div>
                        </div>

                        {/* Button */}
                        <div className="h-11 bg-gray-200 dark:bg-gray-700 rounded-lg w-full" />
                    </div>
                </div>
            ))}
        </div>
    );
};