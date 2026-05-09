import {
    ThumbsUp,
    ThumbsDown,
    Trash2,
    MessageSquare,
    Flag,
    CheckCircle,
    Eye,
    EyeOff
} from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { type ReviewResponse } from '../../../types';
import ReviewRatingBadge from './ReviewRatingBadge';

interface ReviewCardProps {
    review: ReviewResponse;
    onDelete: (reviewId: string) => void;
    onReply: (reviewId: string) => void;
    onFlag: (reviewId: string) => void;
    onToggleVisibility?: (reviewId: string) => void;
}

export default function ReviewCard({
    review,
    onDelete,
    onReply,
    onFlag,
    onToggleVisibility
}: ReviewCardProps) {
    const { t } = useTranslation();
    const [showImages, setShowImages] = useState(false);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('vi-VN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const handleImageClick = (imageUrl: string) => {
        setSelectedImage(imageUrl);
    };

    const closeImageModal = () => {
        setSelectedImage(null);
    };

    return (
        <div className="card hover-lift border-l-4 border-amber-500 animate-fadeIn">
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-start space-x-4">
                    {/* User Avatar */}
                    <div className="relative">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                            {review.userName.charAt(0).toUpperCase()}
                        </div>
                        {review.isVerifiedPurchase && (
                            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full border-2 border-white dark:border-gray-800 flex items-center justify-center">
                                <CheckCircle className="w-3 h-3 text-white" />
                            </div>
                        )}
                    </div>

                    {/* User Info & Rating */}
                    <div>
                        <div className="flex items-center space-x-2 mb-1 flex-wrap">
                            <h4 className="font-bold text-gray-900 dark:text-white">
                                {review.userName}
                            </h4>
                            {review.isVerifiedPurchase && (
                                <span className="inline-flex items-center space-x-1 px-2 py-0.5 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-full text-xs font-semibold shadow-sm">
                                    <CheckCircle className="w-3 h-3" />
                                    <span>{t('admin.verified')}</span>
                                </span>
                            )}
                        </div>
                        <ReviewRatingBadge rating={review.rating} size="sm" />
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 flex items-center gap-1">
                            <MessageSquare className="w-3 h-3" />
                            {formatDate(review.createdAt)}
                        </p>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex items-center space-x-2">
                    {onToggleVisibility && (
                        <button
                            onClick={() => onToggleVisibility(review.id)}
                            className="p-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-smooth hover-scale border border-gray-200 dark:border-gray-600"
                            title={t('admin.toggleVisibility')}
                        >
                            <EyeOff className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                        </button>
                    )}
                    <button
                        onClick={() => onFlag(review.id)}
                        className="p-2 bg-yellow-100 dark:bg-yellow-900/30 hover:bg-yellow-200 dark:hover:bg-yellow-900/50 rounded-lg transition-smooth hover-scale border border-yellow-200 dark:border-yellow-800"
                        title={t('admin.flagSpam')}
                    >
                        <Flag className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
                    </button>
                    <button
                        onClick={() => onDelete(review.id)}
                        className="p-2 bg-red-100 dark:bg-red-900/30 hover:bg-red-200 dark:hover:bg-red-900/50 rounded-lg transition-smooth hover-scale border border-red-200 dark:border-red-800"
                        title={t('common.delete')}
                    >
                        <Trash2 className="w-4 h-4 text-red-600 dark:text-red-400" />
                    </button>
                </div>
            </div>

            {/* Book Info */}
            <div className="mb-4 p-3 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-xl border border-amber-200 dark:border-amber-800">
                <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 bg-gradient-to-br from-amber-500 to-orange-600 rounded-lg flex items-center justify-center">
                        <MessageSquare className="w-3.5 h-3.5 text-white" />
                    </div>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                        <span className="font-medium text-amber-700 dark:text-amber-400">{t('admin.reviewFor')}:</span>{' '}
                        <span className="font-semibold text-gray-900 dark:text-white">{review.bookTitle}</span>
                    </p>
                </div>
            </div>

            {/* Review Content */}
            {review.comment && (
                <div className="mb-4 p-4 bg-gradient-to-r from-gray-50 to-white dark:from-gray-700/50 dark:to-gray-700/30 rounded-xl border border-gray-200 dark:border-gray-700">
                    <div className="flex items-start space-x-3">
                        <div className="w-1 h-full bg-gradient-to-b from-amber-500 to-orange-500 rounded-full mt-1"></div>
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed flex-1">
                            "{review.comment}"
                        </p>
                    </div>
                </div>
            )}

            {/* Review Images */}
            {review.imageUrls && review.imageUrls.length > 0 && (
                <div className="mb-4">
                    <button
                        onClick={() => setShowImages(!showImages)}
                        className="inline-flex items-center space-x-2 px-3 py-1.5 bg-gradient-to-r from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 hover:from-amber-200 hover:to-orange-200 dark:hover:from-amber-900/50 dark:hover:to-orange-900/50 text-amber-700 dark:text-amber-400 rounded-lg transition-smooth hover-scale border border-amber-200 dark:border-amber-800 font-semibold text-sm"
                    >
                        <Eye className="w-4 h-4" />
                        <span>{showImages ? t('admin.hideImages') : `${t('admin.viewImages')} (${review.imageUrls.length})`}</span>
                    </button>
                    {showImages && (
                        <div className="grid grid-cols-4 gap-2 mt-3 animate-fadeIn">
                            {review.imageUrls.map((url, index) => (
                                <div
                                    key={index}
                                    className="relative group animate-scaleIn"
                                    style={{ animationDelay: `${index * 0.1}s` }}
                                >
                                    <img
                                        src={url}
                                        alt={`Review ${index + 1}`}
                                        onClick={() => handleImageClick(url)}
                                        className="w-full h-24 object-cover rounded-lg cursor-pointer hover-lift border-2 border-gray-200 dark:border-gray-700 shadow-lg"
                                    />
                                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                                        <Eye className="w-6 h-6 text-white" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Seller Reply */}
            {review.sellerReply && (
                <div className="mb-4 p-4 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-xl border-l-4 border-blue-500 animate-fadeIn">
                    <div className="flex items-center space-x-2 mb-2">
                        <div className="w-7 h-7 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-lg flex items-center justify-center shadow-lg">
                            <MessageSquare className="w-4 h-4 text-white" />
                        </div>
                        <span className="text-sm font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                            {review.sellerReply.replyBy}
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                            • {formatDate(review.sellerReply.createdAt)}
                        </span>
                    </div>
                    <p className="text-sm text-gray-700 dark:text-gray-300 pl-9">
                        {review.sellerReply.replyText}
                    </p>
                </div>
            )}

            {/* Footer Actions */}
            <div className="flex items-center justify-between pt-4 border-t-2 border-gray-200 dark:border-gray-700">
                {/* Vote Stats */}
                <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1.5 px-3 py-1.5 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg border border-green-200 dark:border-green-800">
                        <ThumbsUp className="w-4 h-4 text-green-600 dark:text-green-400" />
                        <span className="text-sm font-bold text-green-700 dark:text-green-400">
                            {review.helpfulCount}
                        </span>
                    </div>
                    <div className="flex items-center space-x-1.5 px-3 py-1.5 bg-gradient-to-r from-red-50 to-rose-50 dark:from-red-900/20 dark:to-rose-900/20 rounded-lg border border-red-200 dark:border-red-800">
                        <ThumbsDown className="w-4 h-4 text-red-600 dark:text-red-400" />
                        <span className="text-sm font-bold text-red-700 dark:text-red-400">
                            {review.unhelpfulCount}
                        </span>
                    </div>
                </div>

                {/* Reply Button */}
                {!review.sellerReply && (
                    <button
                        onClick={() => onReply(review.id)}
                        className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white rounded-xl transition-smooth hover-scale shadow-lg hover:shadow-xl font-semibold"
                    >
                        <MessageSquare className="w-4 h-4" />
                        <span className="text-sm">{t('admin.reply')}</span>
                    </button>
                )}
            </div>

            {/* Image Modal */}
            {selectedImage && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn"
                    onClick={closeImageModal}
                >
                    <div className="relative max-w-4xl max-h-full animate-scaleIn">
                        <img
                            src={selectedImage}
                            alt="Review"
                            className="max-w-full max-h-[90vh] object-contain rounded-xl shadow-2xl"
                        />
                        <button
                            onClick={closeImageModal}
                            className="absolute top-4 right-4 p-3 bg-white/20 hover:bg-white/30 rounded-xl backdrop-blur-sm transition-smooth hover-scale shadow-lg"
                        >
                            <Eye className="w-6 h-6 text-white" />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}