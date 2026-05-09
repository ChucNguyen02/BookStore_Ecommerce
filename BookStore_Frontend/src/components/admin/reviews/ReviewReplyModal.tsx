import { X, Send } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { type ReviewResponse } from '../../../types';
import ReviewRatingBadge from './ReviewRatingBadge';

interface ReviewReplyModalProps {
    open: boolean;
    review: ReviewResponse | null;
    onClose: () => void;
    onSubmit: (reviewId: string, replyText: string) => Promise<boolean>;
}

export default function ReviewReplyModal({
    open,
    review,
    onClose,
    onSubmit
}: ReviewReplyModalProps) {
    const { t } = useTranslation();
    const [replyText, setReplyText] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (!open || !review) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!replyText.trim()) return;

        setIsSubmitting(true);
        const success = await onSubmit(review.id, replyText.trim());
        setIsSubmitting(false);

        if (success) {
            setReplyText('');
            onClose();
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('vi-VN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
            <div className="card max-w-2xl w-full animate-scaleIn">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                        {t('admin.replyToReview')}
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-smooth hover-scale"
                    >
                        <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                    {/* Original Review */}
                    <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl animate-fadeInUp">
                        <div className="flex items-start space-x-4 mb-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white font-semibold flex-shrink-0 hover-scale">
                                {review.userName.charAt(0).toUpperCase()}
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center space-x-2 mb-1">
                                    <h4 className="font-semibold text-gray-900 dark:text-white">
                                        {review.userName}
                                    </h4>
                                </div>
                                <ReviewRatingBadge rating={review.rating} size="sm" />
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                    {formatDate(review.createdAt)}
                                </p>
                            </div>
                        </div>

                        {/* Book Info */}
                        <div className="mb-3 p-2 bg-white dark:bg-gray-800 rounded-lg">
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                {t('admin.reviewFor')}: <span className="font-medium text-gray-900 dark:text-white">{review.bookTitle}</span>
                            </p>
                        </div>

                        {review.comment && (
                            <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                                {review.comment}
                            </p>
                        )}
                    </div>

                    {/* Reply Form */}
                    <form onSubmit={handleSubmit} className="space-y-4 animate-fadeInUp" style={{ animationDelay: '0.1s' }}>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                {t('admin.yourReply')}
                            </label>
                            <textarea
                                value={replyText}
                                onChange={(e) => setReplyText(e.target.value)}
                                placeholder={t('admin.enterReplyPlaceholder')}
                                rows={6}
                                className="input-field resize-none"
                                disabled={isSubmitting}
                            />
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                                {t('admin.replyAsSellerNote')}
                            </p>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center space-x-3">
                            <button
                                type="button"
                                onClick={onClose}
                                disabled={isSubmitting}
                                className="btn-secondary flex-1 disabled:opacity-50"
                            >
                                {t('common.cancel')}
                            </button>
                            <button
                                type="submit"
                                disabled={!replyText.trim() || isSubmitting}
                                className="flex-1 flex items-center justify-center space-x-2 px-4 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-smooth disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isSubmitting ? (
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                ) : (
                                    <Send className="w-4 h-4" />
                                )}
                                <span>{isSubmitting ? t('common.sending') : t('admin.sendReply')}</span>
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}