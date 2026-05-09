import { useState } from 'react';
import { Star, ThumbsUp, ThumbsDown, MoreVertical, Edit, Trash2, MessageSquare, ShieldCheck } from 'lucide-react';
import type { ReviewResponse } from '../../../types/review.types';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';

interface ReviewCardProps {
    review: ReviewResponse;
    currentUserId?: string;
    isAdmin?: boolean;
    onVote: (reviewId: string, voteType: string) => Promise<boolean>;
    onRemoveVote: (reviewId: string) => Promise<boolean>;
    onEdit: (review: ReviewResponse) => void;
    onDelete: (reviewId: string) => void;
    onReply: (review: ReviewResponse) => void;
}

export const ReviewCard = ({
    review,
    currentUserId,
    isAdmin = false,
    onVote,
    onRemoveVote,
    onEdit,
    onDelete,
    onReply,
}: ReviewCardProps) => {
    const { t, i18n } = useTranslation();
    const [showMenu, setShowMenu] = useState(false);
    const [showImages, setShowImages] = useState(false);

    const isOwnReview = currentUserId === review.userId;
    const isLoggedIn = !!currentUserId;

    const handleVote = async (voteType: 'HELPFUL' | 'UNHELPFUL') => {
        if (!isLoggedIn) {
            toast.error(t('reviewCard.pleaseLoginToVote'));
            return;
        }

        if (review.currentUserVote === voteType) {
            await onRemoveVote(review.id);
        } else {
            await onVote(review.id, voteType);
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat(i18n.language, {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        }).format(date);
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-3">
                    {/* Avatar */}
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white font-bold text-lg">
                        {review.userName.charAt(0).toUpperCase()}
                    </div>

                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-semibold text-gray-900 dark:text-white">
                                {review.userName}
                            </h4>
                            {review.isVerifiedPurchase && (
                                <span className="flex items-center gap-1 text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-2 py-0.5 rounded-full">
                                    <ShieldCheck className="w-3 h-3" />
                                    {t('reviewCard.verifiedPurchase')}
                                </span>
                            )}
                        </div>

                        {/* Rating */}
                        <div className="flex items-center gap-1 mb-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                    key={star}
                                    className={`w-4 h-4 ${star <= review.rating ? 'fill-amber-400 text-amber-400' : 'text-gray-300 dark:text-gray-600'}`}
                                />
                            ))}
                        </div>

                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            {formatDate(review.createdAt)}
                        </p>
                    </div>
                </div>

                {/* Menu for own review */}
                {isOwnReview && (
                    <div className="relative">
                        <button
                            onClick={() => setShowMenu(!showMenu)}
                            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                        >
                            <MoreVertical className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                        </button>

                        {showMenu && (
                            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-10">
                                <button
                                    onClick={() => {
                                        onEdit(review);
                                        setShowMenu(false);
                                    }}
                                    className="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2 text-gray-700 dark:text-gray-300"
                                >
                                    <Edit className="w-4 h-4" />
                                    {t('reviewCard.edit')}
                                </button>
                                <button
                                    onClick={() => {
                                        onDelete(review.id);
                                        setShowMenu(false);
                                    }}
                                    className="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2 text-red-600 dark:text-red-400"
                                >
                                    <Trash2 className="w-4 h-4" />
                                    {t('reviewCard.delete')}
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Comment */}
            {review.comment && (
                <p className="text-gray-700 dark:text-gray-300 mb-4 whitespace-pre-wrap">
                    {review.comment}
                </p>
            )}

            {/* Images */}
            {review.imageUrls && review.imageUrls.length > 0 && (
                <div className="mb-4">
                    <div className="flex gap-2 flex-wrap">
                        {review.imageUrls.slice(0, 4).map((url, index) => (
                            <div
                                key={index}
                                className="relative w-20 h-20 rounded-lg overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
                                onClick={() => setShowImages(true)}
                            >
                                <img
                                    src={url}
                                    alt={`Review image ${index + 1}`}
                                    className="w-full h-full object-cover"
                                />
                                {index === 3 && review.imageUrls.length > 4 && (
                                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-white font-semibold">
                                        +{review.imageUrls.length - 4}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Image Modal */}
                    {showImages && (
                        <div
                            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
                            onClick={() => setShowImages(false)}
                        >
                            <div className="max-w-4xl w-full">
                                <div className="grid grid-cols-2 gap-4">
                                    {review.imageUrls.map((url, index) => (
                                        <img
                                            key={index}
                                            src={url}
                                            alt={`Review image ${index + 1}`}
                                            className="w-full rounded-lg"
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Seller Reply */}
            {review.sellerReply && (
                <div className="bg-amber-50 dark:bg-amber-900/20 rounded-lg p-4 mb-4 border-l-4 border-amber-500">
                    <div className="flex items-center gap-2 mb-2">
                        <MessageSquare className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                        <span className="font-semibold text-amber-900 dark:text-amber-200">
                            {t('reviewCard.sellerResponse')}
                        </span>
                    </div>
                    <p className="text-gray-700 dark:text-gray-300 text-sm">
                        {review.sellerReply.replyText}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                        {formatDate(review.sellerReply.createdAt)}
                    </p>
                </div>
            )}

            {/* Actions */}
            <div className="flex items-center gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                {/* Vote Buttons */}
                {isLoggedIn ? (
                    <>
                        <button
                            onClick={() => handleVote('HELPFUL')}
                            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors ${review.currentUserVote === 'HELPFUL'
                                ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                                }`}
                        >
                            <ThumbsUp className="w-4 h-4" />
                            <span className="text-sm font-medium">{review.helpfulCount}</span>
                        </button>

                        <button
                            onClick={() => handleVote('UNHELPFUL')}
                            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors ${review.currentUserVote === 'UNHELPFUL'
                                ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
                                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                                }`}
                        >
                            <ThumbsDown className="w-4 h-4" />
                            <span className="text-sm font-medium">{review.unhelpfulCount}</span>
                        </button>
                    </>
                ) : (
                    <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                        <span className="flex items-center gap-1">
                            <ThumbsUp className="w-4 h-4" />
                            {review.helpfulCount}
                        </span>
                        <span className="flex items-center gap-1">
                            <ThumbsDown className="w-4 h-4" />
                            {review.unhelpfulCount}
                        </span>
                        <span className="text-xs">({t('reviewCard.loginToVote')})</span>
                    </div>
                )}

                {/* Reply Button - Admin only */}
                {isLoggedIn && isAdmin && !review.sellerReply && (
                    <button
                        onClick={() => onReply(review)}
                        className="ml-auto flex items-center gap-2 px-3 py-1.5 text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/20 rounded-lg transition-colors"
                    >
                        <MessageSquare className="w-4 h-4" />
                        <span className="text-sm font-medium">
                            {t('reviewCard.reply')}
                        </span>
                    </button>
                )}
            </div>
        </div>
    );
};