import { Search, Filter, Star, Image, MessageSquare, X } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

interface ReviewFiltersProps {
    onSearch: (keyword: string) => void;
    onRatingFilter: (rating?: number) => void;
    onImageFilter: (hasImages: boolean) => void;
    onCommentFilter: (hasComment: boolean) => void;
    onVerifiedFilter: (isVerified: boolean) => void;
    onSortChange: (sortBy: string, sortDirection: string) => void;
    onClearFilters: () => void;
}

export default function ReviewFilters({
    onSearch,
    onRatingFilter,
    onImageFilter,
    onCommentFilter,
    onVerifiedFilter,
    onSortChange,
    onClearFilters
}: ReviewFiltersProps) {
    const { t } = useTranslation();
    const [searchKeyword, setSearchKeyword] = useState('');
    const [selectedRating, setSelectedRating] = useState<number | ''>('');
    const [hasImages, setHasImages] = useState(false);
    const [hasComment, setHasComment] = useState(false);
    const [isVerified, setIsVerified] = useState(false);
    const [sortBy, setSortBy] = useState('createdAt');
    const [sortDirection, setSortDirection] = useState('DESC');
    const [showFilters, setShowFilters] = useState(false);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        onSearch(searchKeyword);
    };

    const handleRatingChange = (rating: string) => {
        setSelectedRating(rating ? Number(rating) : '');
        onRatingFilter(rating ? Number(rating) : undefined);
    };

    const handleHasImagesToggle = () => {
        const newValue = !hasImages;
        setHasImages(newValue);
        onImageFilter(newValue);
    };

    const handleHasCommentToggle = () => {
        const newValue = !hasComment;
        setHasComment(newValue);
        onCommentFilter(newValue);
    };

    const handleIsVerifiedToggle = () => {
        const newValue = !isVerified;
        setIsVerified(newValue);
        onVerifiedFilter(newValue);
    };

    const handleSortChange = (newSortBy: string) => {
        setSortBy(newSortBy);
        onSortChange(newSortBy, sortDirection);
    };

    const handleSortDirectionChange = (newDirection: string) => {
        setSortDirection(newDirection);
        onSortChange(sortBy, newDirection);
    };

    const handleClearAll = () => {
        setSearchKeyword('');
        setSelectedRating('');
        setHasImages(false);
        setHasComment(false);
        setIsVerified(false);
        setSortBy('createdAt');
        setSortDirection('DESC');
        onClearFilters();
    };

    const hasActiveFilters = searchKeyword || selectedRating || hasImages || hasComment || isVerified;

    return (
        <div className="card animate-fadeInUp">
            {/* Search Bar */}
            <form onSubmit={handleSearch} className="mb-4">
                <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        value={searchKeyword}
                        onChange={(e) => setSearchKeyword(e.target.value)}
                        placeholder={t('admin.searchReviews')}
                        className="input-field pl-12"
                    />
                </div>
            </form>

            {/* Filter Toggle */}
            <div className="flex items-center justify-between mb-4">
                <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="btn-secondary flex items-center space-x-2"
                >
                    <Filter className="w-4 h-4" />
                    <span>{t('common.filters')}</span>
                    {hasActiveFilters && (
                        <span className="ml-2 w-2 h-2 bg-amber-500 rounded-full animate-pulse"></span>
                    )}
                </button>

                {hasActiveFilters && (
                    <button
                        onClick={handleClearAll}
                        className="flex items-center space-x-2 px-4 py-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-smooth"
                    >
                        <X className="w-4 h-4" />
                        <span>{t('common.clearAll')}</span>
                    </button>
                )}
            </div>

            {/* Filters Panel */}
            {showFilters && (
                <div className="space-y-4 pt-4 border-t border-gray-200 dark:border-gray-700 animate-fadeInDown">
                    {/* Rating Filter */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            {t('admin.filterByRating')}
                        </label>
                        <div className="flex items-center space-x-2">
                            <button
                                onClick={() => handleRatingChange('')}
                                className={`px-3 py-2 rounded-lg border transition-smooth hover-scale ${selectedRating === ''
                                        ? 'bg-amber-500 text-white border-amber-500'
                                        : 'bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600'
                                    }`}
                            >
                                {t('common.all')}
                            </button>
                            {[5, 4, 3, 2, 1].map((rating) => (
                                <button
                                    key={rating}
                                    onClick={() => handleRatingChange(rating.toString())}
                                    className={`px-3 py-2 rounded-lg border transition-smooth hover-scale flex items-center space-x-1 ${selectedRating === rating
                                            ? 'bg-amber-500 text-white border-amber-500'
                                            : 'bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600'
                                        }`}
                                >
                                    <Star className="w-4 h-4 fill-current" />
                                    <span>{rating}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Toggle Filters */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <button
                            onClick={handleHasImagesToggle}
                            className={`flex items-center justify-center space-x-2 px-4 py-3 rounded-lg border transition-smooth hover-lift ${hasImages
                                    ? 'bg-blue-500 text-white border-blue-500'
                                    : 'bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600'
                                }`}
                        >
                            <Image className="w-4 h-4" />
                            <span className="font-medium">{t('admin.withImages')}</span>
                        </button>

                        <button
                            onClick={handleHasCommentToggle}
                            className={`flex items-center justify-center space-x-2 px-4 py-3 rounded-lg border transition-smooth hover-lift ${hasComment
                                    ? 'bg-purple-500 text-white border-purple-500'
                                    : 'bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600'
                                }`}
                        >
                            <MessageSquare className="w-4 h-4" />
                            <span className="font-medium">{t('admin.withComments')}</span>
                        </button>

                        <button
                            onClick={handleIsVerifiedToggle}
                            className={`flex items-center justify-center space-x-2 px-4 py-3 rounded-lg border transition-smooth hover-lift ${isVerified
                                    ? 'bg-green-500 text-white border-green-500'
                                    : 'bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600'
                                }`}
                        >
                            <span className="font-medium">{t('admin.verifiedPurchase')}</span>
                        </button>
                    </div>

                    {/* Sort Options */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                {t('admin.sortBy')}
                            </label>
                            <select
                                value={sortBy}
                                onChange={(e) => handleSortChange(e.target.value)}
                                className="input-field"
                            >
                                <option value="createdAt">{t('admin.date')}</option>
                                <option value="rating">{t('admin.rating')}</option>
                                <option value="helpfulCount">{t('admin.helpfulCount')}</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                {t('admin.sortDirection')}
                            </label>
                            <select
                                value={sortDirection}
                                onChange={(e) => handleSortDirectionChange(e.target.value)}
                                className="input-field"
                            >
                                <option value="DESC">{t('admin.descending')}</option>
                                <option value="ASC">{t('admin.ascending')}</option>
                            </select>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}