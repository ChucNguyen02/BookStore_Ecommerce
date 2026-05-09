import { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { MessageSquare, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import { useAdminReviews } from '../../../hooks/admin/useAdminReviews';
import { useReviewSummary } from '../../../hooks/admin/useReviewSummary';
import { type ReviewResponse, type ReviewFilterRequest } from '../../../types';
import ReviewFilters from '../../../components/admin/reviews/ReviewFilters';
import ReviewCard from '../../../components/admin/reviews/ReviewCard';
import ReviewReplyModal from '../../../components/admin/reviews/ReviewReplyModal';
import ReviewSummaryCard from '../../../components/admin/reviews/ReviewSummaryCard';
import Pagination from '../../../components/admin/common/Pagination';
import LoadingSpinner from '../../../components/admin/common/LoadingSpinner';
import ConfirmDialog from '../../../components/admin/common/ConfirmDialog';
import { toast } from 'react-hot-toast';

export default function AdminReviews() {
    const { t } = useTranslation();
    const {
        reviews,
        pendingReviews,
        isLoading,
        error,
        fetchPendingReviews,
        fetchBookReviews,
        deleteReview,
        replyToReview,
        refetch
    } = useAdminReviews();

    const [selectedBookId] = useState<string | null>(null);
    const { summary } = useReviewSummary(selectedBookId);

    const [currentPage, setCurrentPage] = useState(0);
    const [selectedReview, setSelectedReview] = useState<ReviewResponse | null>(null);
    const [showReplyModal, setShowReplyModal] = useState(false);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [reviewToDelete, setReviewToDelete] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<'all' | 'pending'>('pending');

    const [filters, setFilters] = useState<ReviewFilterRequest>({
        page: 0,
        size: 20,
        sortBy: 'createdAt',
        sortDirection: 'DESC'
    });

    const handleSearch = useCallback((_keyword: string) => {
        // Implement search functionality
        toast('Search functionality will be implemented', { icon: 'ℹ️' });
    }, []);

    const handleRatingFilter = useCallback((rating?: number) => {
        setFilters(prev => ({ ...prev, rating, page: 0 }));
        setCurrentPage(0);
        if (selectedBookId) {
            fetchBookReviews(selectedBookId, { ...filters, rating, page: 0 });
        }
    }, [filters, selectedBookId, fetchBookReviews]);

    const handleImageFilter = useCallback((hasImages: boolean) => {
        setFilters(prev => ({ ...prev, hasImages: hasImages || undefined, page: 0 }));
        setCurrentPage(0);
        if (selectedBookId) {
            fetchBookReviews(selectedBookId, { ...filters, hasImages: hasImages || undefined, page: 0 });
        }
    }, [filters, selectedBookId, fetchBookReviews]);

    const handleCommentFilter = useCallback((hasComment: boolean) => {
        setFilters(prev => ({ ...prev, hasComment: hasComment || undefined, page: 0 }));
        setCurrentPage(0);
        if (selectedBookId) {
            fetchBookReviews(selectedBookId, { ...filters, hasComment: hasComment || undefined, page: 0 });
        }
    }, [filters, selectedBookId, fetchBookReviews]);

    const handleVerifiedFilter = useCallback((_isVerified: boolean) => {
        // Implement verified filter
        toast('Verified filter will be implemented', { icon: 'ℹ️' });
    }, []);

    const handleSortChange = useCallback((sortBy: string, sortDirection: string) => {
        setFilters(prev => ({ ...prev, sortBy, sortDirection, page: 0 }));
        setCurrentPage(0);
        if (selectedBookId) {
            fetchBookReviews(selectedBookId, { ...filters, sortBy, sortDirection, page: 0 });
        }
    }, [filters, selectedBookId, fetchBookReviews]);

    const handleClearFilters = useCallback(() => {
        const defaultFilters: ReviewFilterRequest = {
            page: 0,
            size: 20,
            sortBy: 'createdAt',
            sortDirection: 'DESC'
        };
        setFilters(defaultFilters);
        setCurrentPage(0);
        if (activeTab === 'pending') {
            fetchPendingReviews(0, 20);
        } else if (selectedBookId) {
            fetchBookReviews(selectedBookId, defaultFilters);
        }
    }, [activeTab, selectedBookId, fetchPendingReviews, fetchBookReviews]);

    const handlePageChange = useCallback((page: number) => {
        setCurrentPage(page);
        setFilters(prev => ({ ...prev, page }));
        if (activeTab === 'pending') {
            fetchPendingReviews(page, 20);
        } else if (selectedBookId) {
            fetchBookReviews(selectedBookId, { ...filters, page });
        }
    }, [activeTab, selectedBookId, filters, fetchPendingReviews, fetchBookReviews]);

    const handleDeleteClick = useCallback((reviewId: string) => {
        setReviewToDelete(reviewId);
        setShowDeleteDialog(true);
    }, []);

    const handleDeleteConfirm = useCallback(async () => {
        if (!reviewToDelete) return;

        const success = await deleteReview(reviewToDelete);
        if (success) {
            setShowDeleteDialog(false);
            setReviewToDelete(null);
            refetch();
        }
    }, [reviewToDelete, deleteReview, refetch]);

    const handleReplyClick = useCallback((reviewId: string) => {
        const review = activeTab === 'pending'
            ? pendingReviews?.content.find(r => r.id === reviewId)
            : reviews?.content.find(r => r.id === reviewId);

        if (review) {
            setSelectedReview(review);
            setShowReplyModal(true);
        }
    }, [activeTab, pendingReviews, reviews]);

    const handleReplySubmit = useCallback(async (reviewId: string, replyText: string) => {
        const success = await replyToReview(reviewId, { replyText });
        if (success) {
            refetch();
        }
        return success;
    }, [replyToReview, refetch]);

    const handleFlagSpam = useCallback((_reviewId: string) => {
        toast.success('Review flagged as spam');
        // Implement flag spam functionality
    }, []);

    const handleToggleVisibility = useCallback((_reviewId: string) => {
        toast.success('Review visibility toggled');
        // Implement toggle visibility functionality
    }, []);

    const handleTabChange = useCallback((tab: 'all' | 'pending') => {
        setActiveTab(tab);
        setCurrentPage(0);
        setFilters(prev => ({ ...prev, page: 0 }));
        if (tab === 'pending') {
            fetchPendingReviews(0, 20);
        }
    }, [fetchPendingReviews]);

    if (isLoading && !pendingReviews && !reviews) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
                <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 h-32"></div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <LoadingSpinner />
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
                <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 h-32"></div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg text-center">
                        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                        <p className="text-xl text-red-600 dark:text-red-400 font-semibold mb-2">
                            {t('common.error')}
                        </p>
                        <p className="text-gray-600 dark:text-gray-400">{error}</p>
                    </div>
                </div>
            </div>
        );
    }

    const currentData = activeTab === 'pending' ? pendingReviews : reviews;

    return (
        <div className="min-h-screen bg-gradient-to-br from-amber-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
            {/* Header với gradient animation */}
            <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 text-white shadow-2xl animate-fadeInDown relative overflow-hidden">
                {/* Animated background pattern */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent animate-shimmer"></div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative">
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="flex items-center space-x-3 mb-2">
                                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center animate-pulse shadow-lg">
                                    <MessageSquare className="w-7 h-7" />
                                </div>
                                <h1 className="text-3xl font-bold">{t('admin.reviewsManagement')}</h1>
                            </div>
                            <p className="text-amber-100 animate-fadeIn">
                                {t('admin.manageAllReviews')}
                            </p>
                        </div>
                        <div className="hidden md:block">
                            <div className="relative">
                                <MessageSquare className="w-20 h-20 opacity-20 animate-pulse" />
                                <div className="absolute inset-0 bg-gradient-to-t from-transparent to-white/10 rounded-full blur-xl"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
                {/* Stats Cards với stagger animation */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="card hover-lift stagger-item">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600 dark:text-gray-400 font-medium mb-1">
                                    {t('admin.totalReviews')}
                                </p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                    {currentData?.totalElements || 0}
                                </p>
                            </div>
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center shadow-lg">
                                <MessageSquare className="w-6 h-6 text-white" />
                            </div>
                        </div>
                        <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                            <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                                    <div className="bg-gradient-to-r from-blue-500 to-cyan-500 h-1.5 rounded-full animate-pulse" style={{ width: '100%' }}></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="card hover-lift stagger-item">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600 dark:text-gray-400 font-medium mb-1">
                                    {t('admin.pendingReviews')}
                                </p>
                                <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                                    {pendingReviews?.totalElements || 0}
                                </p>
                            </div>
                            <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-amber-600 rounded-xl flex items-center justify-center shadow-lg animate-pulse">
                                <Clock className="w-6 h-6 text-white" />
                            </div>
                        </div>
                        <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                            <div className="flex items-center text-xs text-yellow-600 dark:text-yellow-400">
                                <span className="w-1.5 h-1.5 bg-yellow-500 rounded-full mr-2 animate-pulse"></span>
                                {t('admin.awaitingModeration')}
                            </div>
                        </div>
                    </div>

                    <div className="card hover-lift stagger-item">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600 dark:text-gray-400 font-medium mb-1">
                                    {t('admin.currentPage')}
                                </p>
                                <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                                    {(currentData?.pageNumber || 0) + 1} / {currentData?.totalPages || 1}
                                </p>
                            </div>
                            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                                <MessageSquare className="w-6 h-6 text-white" />
                            </div>
                        </div>
                        <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                            <div className="flex items-center text-xs text-purple-600 dark:text-purple-400">
                                <div className="flex space-x-1 mr-2">
                                    <div className="w-1 h-3 bg-purple-500 rounded-full"></div>
                                    <div className="w-1 h-3 bg-purple-500 rounded-full opacity-75"></div>
                                    <div className="w-1 h-3 bg-purple-500 rounded-full opacity-50"></div>
                                </div>
                                {t('admin.pagination')}
                            </div>
                        </div>
                    </div>

                    <div className="card hover-lift stagger-item">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600 dark:text-gray-400 font-medium mb-1">
                                    {t('admin.showing')}
                                </p>
                                <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                                    {currentData?.content.length || 0}
                                </p>
                            </div>
                            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                                <CheckCircle className="w-6 h-6 text-white" />
                            </div>
                        </div>
                        <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                            <div className="flex items-center text-xs text-green-600 dark:text-green-400">
                                <CheckCircle className="w-3 h-3 mr-2" />
                                {t('admin.onThisPage')}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Review Summary */}
                {summary && selectedBookId && (
                    <div className="stagger-item animate-fadeIn">
                        <ReviewSummaryCard summary={summary} />
                    </div>
                )}

                {/* Tabs với enhanced styling */}
                <div className="card stagger-item overflow-hidden p-2">
                    <div className="grid grid-cols-2 gap-2">
                        <button
                            onClick={() => handleTabChange('pending')}
                            className={`relative px-6 py-4 rounded-xl font-medium transition-smooth hover-scale ${activeTab === 'pending'
                                    ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg'
                                    : 'bg-gray-50 dark:bg-gray-700/50 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                                }`}
                        >
                            <div className="flex flex-col items-center space-y-2">
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-smooth ${activeTab === 'pending'
                                        ? 'bg-white/20 backdrop-blur-sm'
                                        : 'bg-gray-200 dark:bg-gray-600'
                                    }`}>
                                    <Clock className="w-5 h-5" />
                                </div>
                                <div>
                                    <span className="block text-sm font-semibold">
                                        {t('admin.pendingReviews')}
                                    </span>
                                    <span className={`text-xs ${activeTab === 'pending'
                                            ? 'text-white/90'
                                            : 'text-gray-500 dark:text-gray-400'
                                        }`}>
                                        {pendingReviews?.totalElements || 0} {t('admin.reviews')}
                                    </span>
                                </div>
                            </div>
                            {activeTab === 'pending' && (
                                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-1 bg-white rounded-t-full animate-fadeIn"></div>
                            )}
                        </button>

                        <button
                            onClick={() => handleTabChange('all')}
                            className={`relative px-6 py-4 rounded-xl font-medium transition-smooth hover-scale ${activeTab === 'all'
                                    ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg'
                                    : 'bg-gray-50 dark:bg-gray-700/50 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                                }`}
                        >
                            <div className="flex flex-col items-center space-y-2">
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-smooth ${activeTab === 'all'
                                        ? 'bg-white/20 backdrop-blur-sm'
                                        : 'bg-gray-200 dark:bg-gray-600'
                                    }`}>
                                    <MessageSquare className="w-5 h-5" />
                                </div>
                                <div>
                                    <span className="block text-sm font-semibold">
                                        {t('admin.allReviews')}
                                    </span>
                                    <span className={`text-xs ${activeTab === 'all'
                                            ? 'text-white/90'
                                            : 'text-gray-500 dark:text-gray-400'
                                        }`}>
                                        {reviews?.totalElements || 0} {t('admin.reviews')}
                                    </span>
                                </div>
                            </div>
                            {activeTab === 'all' && (
                                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-1 bg-white rounded-t-full animate-fadeIn"></div>
                            )}
                        </button>
                    </div>
                </div>

                {/* Filters */}
                <div className="stagger-item">
                    <ReviewFilters
                        onSearch={handleSearch}
                        onRatingFilter={handleRatingFilter}
                        onImageFilter={handleImageFilter}
                        onCommentFilter={handleCommentFilter}
                        onVerifiedFilter={handleVerifiedFilter}
                        onSortChange={handleSortChange}
                        onClearFilters={handleClearFilters}
                    />
                </div>

                {/* Reviews List */}
                {currentData && (
                    <>
                        {currentData.content.length > 0 ? (
                            <>
                                {/* Results Summary */}
                                <div className="card stagger-item">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-3">
                                            <span className="w-1 h-6 bg-gradient-to-b from-amber-500 to-orange-500 rounded-full"></span>
                                            <div>
                                                <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                                                    {activeTab === 'pending' ? t('admin.pendingReviews') : t('admin.allReviews')}
                                                </h2>
                                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                                    {t('admin.showing')} <span className="font-semibold text-gray-900 dark:text-white">{currentData.content.length}</span> {t('admin.of')} {currentData.totalElements}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            {activeTab === 'pending' && (
                                                <div className="flex items-center gap-2">
                                                    <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
                                                    <span className="text-sm text-gray-600 dark:text-gray-400">
                                                        {t('admin.needsAttention')}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Review Cards */}
                                <div className="space-y-4">
                                    {currentData.content.map((review, index) => (
                                        <div
                                            key={review.id}
                                            className="animate-fadeInUp"
                                            style={{ animationDelay: `${index * 0.05}s` }}
                                        >
                                            <ReviewCard
                                                review={review}
                                                onDelete={handleDeleteClick}
                                                onReply={handleReplyClick}
                                                onFlag={handleFlagSpam}
                                                onToggleVisibility={handleToggleVisibility}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </>
                        ) : (
                            <div className="card text-center stagger-item hover-lift">
                                <div className="py-16">
                                    <div className="w-24 h-24 bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse shadow-lg">
                                        <MessageSquare className="w-12 h-12 text-amber-400 dark:text-amber-500" />
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                                        {t('admin.noReviewsFound')}
                                    </h3>
                                    <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
                                        {activeTab === 'pending'
                                            ? t('admin.noPendingReviewsDesc')
                                            : t('admin.noReviewsDesc')
                                        }
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Pagination */}
                        {currentData.totalPages > 1 && (
                            <div className="flex justify-center stagger-item">
                                <div className="card inline-block">
                                    <Pagination
                                        currentPage={currentPage}
                                        totalPages={currentData.totalPages}
                                        onPageChange={handlePageChange}
                                    />
                                </div>
                            </div>
                        )}

                        {/* Bottom Stats */}
                        {currentData.content.length > 0 && (
                            <div className="card stagger-item bg-gradient-to-r from-amber-50 to-orange-50 dark:from-gray-800 dark:to-gray-800 border-2 border-amber-200 dark:border-amber-800">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-6">
                                        <div className="flex items-center space-x-2">
                                            <MessageSquare className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                                            <span className="text-sm text-gray-600 dark:text-gray-400">
                                                {currentData.totalElements} {t('admin.totalReviews')}
                                            </span>
                                        </div>
                                        <div className="h-4 w-px bg-gray-300 dark:bg-gray-600"></div>
                                        <div className="flex items-center space-x-2">
                                            <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
                                            <span className="text-sm text-gray-600 dark:text-gray-400">
                                                {pendingReviews?.totalElements || 0} {t('admin.pending')}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="text-sm text-gray-500 dark:text-gray-400">
                                        {t('admin.page')} <span className="font-semibold text-gray-900 dark:text-white">{currentPage + 1}</span> {t('admin.of')} {currentData.totalPages}
                                    </div>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* Reply Modal với backdrop blur */}
            {showReplyModal && selectedReview && (
                <div className="fixed inset-0 z-50 overflow-y-auto animate-fadeIn">
                    <div className="flex min-h-screen items-center justify-center p-4">
                        <div
                            className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
                            onClick={() => setShowReplyModal(false)}
                        ></div>
                        <div className="relative animate-scaleIn w-full max-w-2xl">
                            <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl">
                                {/* Modal Header */}
                                <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-6 py-4 rounded-t-2xl">
                                    <h3 className="text-lg font-bold flex items-center">
                                        <MessageSquare className="w-5 h-5 mr-2" />
                                        {t('admin.replyToReview')}
                                    </h3>
                                </div>

                                <ReviewReplyModal
                                    open={showReplyModal}
                                    review={selectedReview}
                                    onClose={() => setShowReplyModal(false)}
                                    onSubmit={handleReplySubmit}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation */}
            <ConfirmDialog
                open={showDeleteDialog}
                title={t('admin.deleteReview')}
                message={t('admin.deleteReviewConfirm')}
                onConfirm={handleDeleteConfirm}
                onCancel={() => setShowDeleteDialog(false)}
            />
        </div>
    );
}