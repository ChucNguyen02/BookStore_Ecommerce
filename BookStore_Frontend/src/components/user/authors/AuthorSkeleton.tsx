interface AuthorSkeletonProps {
    viewMode: 'grid' | 'list';
    count?: number;
}

export const AuthorSkeleton = ({ viewMode, count = 8 }: AuthorSkeletonProps) => {
    if (viewMode === 'grid') {
        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {[...Array(count)].map((_, i) => (
                    <div key={i} className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden animate-pulse">
                        {/* Avatar Section */}
                        <div className="h-48 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 flex items-center justify-center">
                            <div className="w-32 h-32 rounded-full bg-gray-300 dark:bg-gray-600" />
                        </div>

                        {/* Content Section */}
                        <div className="p-6 space-y-4">
                            {/* Name */}
                            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mx-auto" />

                            {/* Stats */}
                            <div className="space-y-2">
                                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3 mx-auto" />
                                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mx-auto" />
                            </div>

                            {/* Bio */}
                            <div className="space-y-2">
                                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full" />
                                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-5/6 mx-auto" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    // List view skeleton
    return (
        <div className="space-y-4">
            {[...Array(count)].map((_, i) => (
                <div key={i} className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden animate-pulse">
                    <div className="flex flex-col sm:flex-row">
                        {/* Avatar */}
                        <div className="w-full sm:w-48 h-48 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600" />

                        {/* Content */}
                        <div className="flex-1 p-6 space-y-4">
                            {/* Header */}
                            <div className="flex justify-between items-start">
                                <div className="flex-1 space-y-2">
                                    <div className="h-7 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
                                </div>
                                <div className="w-20 h-10 bg-gray-200 dark:bg-gray-700 rounded-full" />
                            </div>

                            {/* Bio */}
                            <div className="space-y-2">
                                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full" />
                                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6" />
                            </div>

                            {/* Stats */}
                            <div className="flex gap-4">
                                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24" />
                                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32" />
                            </div>

                            {/* Button */}
                            <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-lg w-40" />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};