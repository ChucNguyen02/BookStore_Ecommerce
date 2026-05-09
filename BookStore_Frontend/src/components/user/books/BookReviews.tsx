import { useState, useEffect } from 'react';
import { Star, ChevronDown, Image, Sparkles, Loader2 } from 'lucide-react';
import { ReviewCard } from './ReviewCard';
import { ReviewForm } from './ReviewForm';
import { useReviews } from '../../../hooks/user/useReviews';
import LoadingSpinner from '../common/LoadingSpinner';
import type { ReviewResponse } from '../../../types/review.types';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import { aiService } from '../../../services';

interface BookReviewsProps {
  bookId: string;
}

export const BookReviews = ({ bookId }: BookReviewsProps) => {
  const { t } = useTranslation();
  const {
    reviews,
    summary,
    loading,
    loadingMore,
    submitting,
    hasMore,
    filter,
    currentUser,
    hasPurchased,
    isAdmin,
    checkPurchaseStatus,
    loadReviews,
    loadMore,
    loadSummary,
    updateFilter,
    createReview,
    updateReview,
    deleteReview,
    voteReview,
    removeVote,
    replyToReview
  } = useReviews(bookId);

  const [showReviewForm, setShowReviewForm] = useState(false);
  const [editingReview, setEditingReview] = useState<ReviewResponse | null>(null);
  const [aiSummary, setAiSummary] = useState<string | null>(null);
  const [aiSummaryLoading, setAiSummaryLoading] = useState(false);

  const handleAiSummarize = async () => {
    if (aiSummaryLoading) return;
    setAiSummaryLoading(true);
    try {
      const result = await aiService.summarizeReviews(bookId);
      setAiSummary(result.summary);
    } catch {
      toast.error(t("Common.khongTheTaoTomTat"));
    } finally {
      setAiSummaryLoading(false);
    }
  };

  useEffect(() => {
    loadReviews(true);
    loadSummary();
    if (currentUser) {
      checkPurchaseStatus();
    }
  }, [bookId, currentUser?.id]);

  useEffect(() => {
    loadReviews(true);
  }, [filter]);

  const handleSubmitReview = async (data: {
    rating: number;
    comment?: string;
    imageUrls?: string[];
  }) => {
    let success = false;

    if (editingReview) {
      success = await updateReview(editingReview.id, {
        rating: data.rating,
        comment: data.comment
      });
    } else {
      success = await createReview({
        bookId,
        orderId: '', // This should come from the purchase record
        rating: data.rating,
        comment: data.comment,
        imageUrls: data.imageUrls
      });
    }

    if (success) {
      setShowReviewForm(false);
      setEditingReview(null);
    }
  };

  const handleEdit = (review: ReviewResponse) => {
    setEditingReview(review);
    setShowReviewForm(true);
  };

  const handleReply = async (review: ReviewResponse) => {
    if (!isAdmin) return;

    const replyText = window.prompt(t('bookReviews.enterYourReply') || 'Enter your reply:');

    if (replyText) {
      await replyToReview(review.id, replyText);
    }
  };

  const handleWriteReview = () => {
    if (!currentUser) {
      toast.error(t('bookReviews.pleaseLoginToReview'));
      return;
    }

    if (!hasPurchased) {
      toast.error(t('bookReviews.mustPurchaseToReview'));
      return;
    }

    setShowReviewForm(true);
  };

  if (loading && reviews.length === 0) {
    return <LoadingSpinner />;
  }

  const canWriteReview = currentUser && hasPurchased;

  return (
    <div className="space-y-6">
      {/* Summary */}
      {summary &&
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-8 mb-6">
            <div className="text-center">
              <div className="text-5xl font-bold text-amber-600 dark:text-amber-400 mb-2">
                {summary.averageRating.toFixed(1)}
              </div>
              <div className="flex items-center justify-center gap-1 mb-1">
                {[1, 2, 3, 4, 5].map((star) =>
              <Star
                key={star}
                className={`w-5 h-5 ${
                star <= Math.round(summary.averageRating) ?
                'fill-amber-400 text-amber-400' :
                'text-gray-300 dark:text-gray-600'}`
                } />

              )}
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {t('bookReviews.reviewsCount', { count: summary.totalReviews })}
              </p>
            </div>

            <div className="flex-1 space-y-2">
              {[5, 4, 3, 2, 1].map((rating) =>
            <div key={rating} className="flex items-center gap-3">
                  <div className="flex items-center gap-1 w-20">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {rating}
                    </span>
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  </div>
                  <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div
                  className="h-full bg-amber-500 dark:bg-amber-600"
                  style={{ width: `${summary.ratingPercentages[rating] || 0}%` }} />
                
                  </div>
                  <span className="text-sm text-gray-600 dark:text-gray-400 w-16 text-right">
                    {summary.ratingDistribution[rating] || 0}
                  </span>
                </div>
            )}
            </div>
          </div>

          <button
          onClick={handleWriteReview}
          disabled={!canWriteReview}
          className={`w-full py-3 rounded-lg transition-all font-medium ${
          canWriteReview ?
          'bg-gradient-to-r from-amber-500 to-orange-500 dark:from-amber-600 dark:to-orange-600 text-white hover:from-amber-600 hover:to-orange-600 dark:hover:from-amber-700 dark:hover:to-orange-700' :
          'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'}`
          }>
          
            {!currentUser ?
          t('bookReviews.loginToReview') :
          !hasPurchased ?
          t('bookReviews.purchaseRequired') :
          t('bookReviews.writeReview')}
          </button>

          {!hasPurchased && currentUser &&
        <p className="text-xs text-center text-gray-500 dark:text-gray-400 mt-2">
              {t('bookReviews.purchaseRequiredNote')}
            </p>
        }
        </div>
      }

      {/* AI Review Summary */}
      {summary && summary.totalReviews > 0 &&
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-xl p-5 border border-indigo-200/50 dark:border-indigo-700/30">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-indigo-500" />
              <h4 className="font-semibold text-gray-800 dark:text-gray-200 text-sm" style={{ fontFamily: 'Inter, sans-serif' }}>{t("Common.aiTomTatDanhGia")}

            </h4>
            </div>
            {!aiSummary &&
          <button
            onClick={handleAiSummarize}
            disabled={aiSummaryLoading}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-sm font-medium rounded-lg hover:from-indigo-600 hover:to-purple-600 transition-all disabled:opacity-50 shadow-sm hover:shadow-md">
            
                {aiSummaryLoading ?
            <>
                    <Loader2 className="w-4 h-4 animate-spin" />{t("Common.dangPhanTich")}

            </> :

            <>
                    <Sparkles className="w-4 h-4" />{t("Common.tomTatBangAi")}

            </>
            }
              </button>
          }
          </div>
          {aiSummary &&
        <div className="bg-white/70 dark:bg-gray-800/50 rounded-lg p-4 text-sm text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
              {aiSummary}
            </div>
        }
        </div>
      }

      {/* Review Form Modal */}
      {showReviewForm &&
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              {editingReview ? t('bookReviews.editReview') : t('bookReviews.writeReview')}
            </h3>
            <ReviewForm
            bookId={bookId}
            orderId=""
            existingReview={
            editingReview ?
            {
              id: editingReview.id,
              rating: editingReview.rating,
              comment: editingReview.comment,
              imageUrls: editingReview.imageUrls
            } :
            undefined
            }
            onSubmit={handleSubmitReview}
            onCancel={() => {
              setShowReviewForm(false);
              setEditingReview(null);
            }}
            submitting={submitting} />
          
          </div>
        </div>
      }

      {/* Filters */}
      <div className="flex items-center gap-4 flex-wrap">
        <button
          onClick={() => updateFilter({ rating: undefined })}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
          !filter.rating ?
          'bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-400' :
          'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'}`
          }>
          
          {t('bookReviews.all')}
        </button>
        {[5, 4, 3, 2, 1].map((rating) =>
        <button
          key={rating}
          onClick={() => updateFilter({ rating })}
          className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-1 ${
          filter.rating === rating ?
          'bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-400' :
          'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'}`
          }>
          
            {rating} <Star className="w-4 h-4" />
          </button>
        )}
        <button
          onClick={() => updateFilter({ hasImages: !filter.hasImages })}
          className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
          filter.hasImages ?
          'bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-400' :
          'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'}`
          }>
          
          <Image className="w-4 h-4" />
          {t('bookReviews.withImages')}
        </button>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {reviews.map((review) =>
        <ReviewCard
          key={review.id}
          review={review}
          currentUserId={currentUser?.id}
          isAdmin={isAdmin}
          onVote={voteReview}
          onRemoveVote={removeVote}
          onEdit={handleEdit}
          onDelete={(id) => deleteReview(id)}
          onReply={handleReply} />

        )}
      </div>

      {/* Load More */}
      {hasMore &&
      <div className="flex justify-center">
          <button
          onClick={loadMore}
          disabled={loadingMore}
          className="px-6 py-3 bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium disabled:opacity-50 flex items-center gap-2">
          
            {loadingMore ?
          <>
                <div className="w-5 h-5 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
                {t('bookReviews.loading')}
              </> :

          <>
                <ChevronDown className="w-5 h-5" />
                {t('bookReviews.loadMore')}
              </>
          }
          </button>
        </div>
      }

      {reviews.length === 0 && !loading &&
      <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400">
            {t('bookReviews.noReviewsYet')}
          </p>
        </div>
      }
    </div>);

};