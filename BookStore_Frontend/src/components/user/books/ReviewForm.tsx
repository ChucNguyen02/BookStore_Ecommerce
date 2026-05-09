import { useState } from 'react';
import { Star, Upload, X, Loader2 } from 'lucide-react';
import { useFileUpload } from '../../../hooks/user/useFileUpload';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';

interface ReviewFormProps {
    bookId?: string;
    orderId?: string;
    existingReview?: {
        id: string;
        rating: number;
        comment: string | null;
        imageUrls: string[] | null;
    };
    onSubmit: (data: {
        rating: number;
        comment?: string;
        imageUrls?: string[];
    }) => Promise<void>;
    onCancel: () => void;
    submitting: boolean;
}

export const ReviewForm = ({
    bookId: _bookId,
    orderId: _orderId,
    existingReview,
    onSubmit,
    onCancel,
    submitting,
}: ReviewFormProps) => {
    const { t } = useTranslation();
    const { uploadImages, deleteImage, uploading: isUploading } = useFileUpload();

    const [rating, setRating] = useState(existingReview?.rating || 0);
    const [hoveredRating, setHoveredRating] = useState(0);
    const [comment, setComment] = useState(existingReview?.comment || '');
    const [imageUrls, setImageUrls] = useState<string[]>(existingReview?.imageUrls || []);

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        if (imageUrls.length + files.length > 5) {
            toast.error(t('reviewForm.maxImagesError'));
            return;
        }

        const fileArray = Array.from(files);
        const uploadedUrls = await uploadImages(fileArray, 'reviews');

        if (uploadedUrls.length > 0) {
            setImageUrls((prev) => [...prev, ...uploadedUrls]);
            toast.success(t('reviewForm.uploadSuccess'));
        }
    };

    const handleRemoveImage = async (url: string) => {
        const success = await deleteImage(url);

        if (success) {
            setImageUrls((prev) => prev.filter((img) => img !== url));
            toast.success(t('reviewForm.removeSuccess'));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (rating === 0) {
            toast.error(t('reviewForm.ratingRequired'));
            return;
        }

        await onSubmit({
            rating,
            comment: comment.trim() || undefined,
            imageUrls: imageUrls.length > 0 ? imageUrls : undefined,
        });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Rating */}
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t('reviewForm.rating')} <span className="text-red-500">*</span>
                </label>
                <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <button
                            key={star}
                            type="button"
                            onClick={() => setRating(star)}
                            onMouseEnter={() => setHoveredRating(star)}
                            onMouseLeave={() => setHoveredRating(0)}
                            className="transition-transform hover:scale-110"
                        >
                            <Star
                                className={`w-8 h-8 ${star <= (hoveredRating || rating) ? 'fill-amber-400 text-amber-400' : 'text-gray-300 dark:text-gray-600'
                                    }`}
                            />
                        </button>
                    ))}
                    <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                        {rating > 0 && t('reviewForm.stars', { count: rating })}
                    </span>
                </div>
            </div>

            {/* Comment */}
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t('reviewForm.comment')}
                </label>
                <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    rows={5}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-amber-500 dark:focus:ring-amber-400 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 resize-none"
                    placeholder={t('reviewForm.commentPlaceholder')}
                />
            </div>

            {/* Images */}
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t('reviewForm.images')} ({imageUrls.length}/5)
                </label>

                <div className="grid grid-cols-5 gap-4">
                    {imageUrls.map((url, index) => (
                        <div key={index} className="relative aspect-square">
                            <img src={url} alt={`Review ${index + 1}`} className="w-full h-full object-cover rounded-lg" />
                            <button
                                type="button"
                                onClick={() => handleRemoveImage(url)}
                                className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    ))}

                    {imageUrls.length < 5 && (
                        <label className="aspect-square border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-amber-500 dark:hover:border-amber-400 transition-colors">
                            {isUploading ? (
                                <Loader2 className="w-8 h-8 text-gray-400 animate-spin" />
                            ) : (
                                <>
                                    <Upload className="w-8 h-8 text-gray-400 mb-2" />
                                    <span className="text-xs text-gray-500 dark:text-gray-400">{t('reviewForm.upload')}</span>
                                </>
                            )}
                            <input
                                type="file"
                                accept="image/*"
                                multiple
                                onChange={handleImageUpload}
                                disabled={isUploading}
                                className="hidden"
                            />
                        </label>
                    )}
                </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 justify-end pt-4 border-t border-gray-200 dark:border-gray-700">
                <button
                    type="button"
                    onClick={onCancel}
                    disabled={submitting}
                    className="px-6 py-3 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium disabled:opacity-50"
                >
                    {t('reviewForm.cancel')}
                </button>
                <button
                    type="submit"
                    disabled={submitting || rating === 0}
                    className="px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 dark:from-amber-600 dark:to-orange-600 text-white rounded-lg hover:from-amber-600 hover:to-orange-600 dark:hover:from-amber-700 dark:hover:to-orange-700 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                    {submitting && <Loader2 className="w-5 h-5 animate-spin" />}
                    {existingReview ? t('reviewForm.update') : t('reviewForm.submit')}
                </button>
            </div>
        </form>
    );
};