import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { Star, Image as ImageIcon, X, Upload, Award, CheckCircle, ArrowLeft, Package, Sparkles } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useFileUpload } from '../../../hooks/user/useFileUpload';
import { useOrders } from '../../../hooks/user/useOrders';
import { useReviews } from '../../../hooks/user/useReviews';
import toast from 'react-hot-toast';
import type { OrderItemResponse } from '../../../types';

export default function Review() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const bookId = searchParams.get('bookId');
    const orderId = searchParams.get('orderId');
    const orderCode = searchParams.get('orderCode');

    const [orderItem, setOrderItem] = useState<OrderItemResponse | null>(null);
    const [rating, setRating] = useState(5);
    const [hoverRating, setHoverRating] = useState(0);
    const [comment, setComment] = useState('');
    const [images, setImages] = useState<File[]>([]);
    const [imagePreviews, setImagePreviews] = useState<string[]>([]);

    const [loadingItem, setLoadingItem] = useState(true);

    const { uploadImages, uploading: uploadingFiles } = useFileUpload();
    const { getOrderDetail } = useOrders();
    const { createReview, submitting: submittingReview } = useReviews(bookId || '');

    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [pointsEarned, setPointsEarned] = useState(0);

    useEffect(() => {
        if (!bookId || !orderId || !orderCode) {
            toast.error(t('Review.invalidParams'));
            navigate('/orders');
            return;
        }

        loadOrderItem();
    }, [bookId, orderId, orderCode, t, navigate]);

    const loadOrderItem = async () => {
        try {
            setLoadingItem(true);
            const order = await getOrderDetail(orderCode!);
            const item = order.items.find(i => i.bookId === bookId);

            if (!item) {
                toast.error(t('Review.itemNotFound'));
                navigate('/orders');
                return;
            }

            if (item.hasReviewed) {
                toast.error(t('Review.alreadyReviewed'));
                navigate(`/books/${item.bookSlug}`);
                return;
            }

            setOrderItem(item);
        } catch (error) {
            console.error('Load order item error:', error);
            toast.error(t('Review.loadFailed'));
            navigate('/orders');
        } finally {
            setLoadingItem(false);
        }
    };

    const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);

        if (images.length + files.length > 5) {
            toast.error(t('Review.maxImages', { max: 5 }));
            return;
        }

        const validFiles = files.filter(file => {
            if (!file.type.startsWith('image/')) {
                toast.error(t('Review.invalidFormat', { name: file.name }));
                return false;
            }
            if (file.size > 5 * 1024 * 1024) {
                toast.error(t('Review.fileTooLarge', { name: file.name }));
                return false;
            }
            return true;
        });

        setImages(prev => [...prev, ...validFiles]);

        validFiles.forEach(file => {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreviews(prev => [...prev, reader.result as string]);
            };
            reader.readAsDataURL(file);
        });
    };

    const removeImage = (index: number) => {
        setImages(prev => prev.filter((_, i) => i !== index));
        setImagePreviews(prev => prev.filter((_, i) => i !== index));
    };

    const calculatePotentialPoints = () => {
        if (!orderItem) return 0;

        const base = 10;
        const imagesBonus = images.length > 0 ? 5 : 0;
        const detailedBonus = comment.trim().length > 100 ? 5 : 0;
        const perItem = base + imagesBonus + detailedBonus;

        return perItem * orderItem.quantity;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (rating === 0) {
            toast.error(t('Review.ratingRequired'));
            return;
        }

        if (!comment.trim()) {
            toast.error(t('Review.commentRequired'));
            return;
        }

        try {
            let imageUrls: string[] = [];

            if (images.length > 0) {
                imageUrls = await uploadImages(images, 'reviews');

                if (imageUrls.length === 0) {
                    toast.error(t('Review.uploadFailed'));
                    return;
                }
            }

            const success = await createReview({
                bookId: bookId!,
                orderId: orderId!,
                rating,
                comment: comment.trim(),
                imageUrls: imageUrls.length > 0 ? imageUrls : undefined,
            });

            if (!success) return;

            const base = 10;
            const imagesBonus = imageUrls.length > 0 ? 5 : 0;
            const detailedBonus = comment.trim().length > 100 ? 5 : 0;
            const perItem = base + imagesBonus + detailedBonus;
            const total = perItem * (orderItem?.quantity || 1);

            setPointsEarned(total);
            setShowSuccessModal(true);
        } catch (error: any) {
            console.error('Submit review error:', error);
            toast.error(error.message || t('Review.submitFailed'));
        }
    };

    const handleSuccessClose = () => {
        setShowSuccessModal(false);
        if (orderItem) {
            navigate(`/books/${orderItem.bookSlug}`);
        } else {
            navigate('/orders');
        }
    };

    if (loadingItem) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500"></div>
            </div>
        );
    }

    if (!orderItem) return null;

    const potentialPoints = calculatePotentialPoints();

    return (
        <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 py-8">
            <div className="container mx-auto px-4 max-w-3xl">
                {/* Header */}
                <div className="mb-8">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 mb-4 font-medium"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        {t('Review.back')}
                    </button>

                    <h1 className="text-4xl font-serif font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-3">
                        <Star className="w-10 h-10 text-amber-500 fill-amber-500" />
                        {t('Review.title')}
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        {t('Review.subtitle')}
                    </p>
                </div>

                {/* Product Info */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 mb-6">
                    <div className="flex gap-4">
                        <div className="flex-shrink-0 w-24 h-32 bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden">
                            {orderItem.bookImage ? (
                                <img
                                    src={orderItem.bookImage}
                                    alt={orderItem.bookTitle}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                    <Package className="w-8 h-8 text-gray-400" />
                                </div>
                            )}
                        </div>
                        <div className="flex-1">
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                                {orderItem.bookTitle}
                            </h2>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                                {t('Review.orderCode')}: {orderCode}
                            </p>
                            {orderItem.quantity > 1 && (
                                <div className="mt-2 flex items-center gap-2">
                                    <span className="px-3 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 rounded-full text-sm font-semibold">
                                        {t('Review.quantity')}: {orderItem.quantity}
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Potential Points Banner */}
                {potentialPoints > 20 && (
                    <div className="bg-gradient-to-r from-amber-50 via-orange-50 to-yellow-50 dark:from-amber-900/20 dark:via-orange-900/20 dark:to-yellow-900/20 border-2 border-amber-300 dark:border-amber-700 rounded-xl p-4 mb-6">
                        <div className="flex items-center gap-3">
                            <Sparkles className="w-6 h-6 text-amber-600 dark:text-amber-400 animate-pulse" />
                            <div className="flex-1">
                                <p className="font-bold text-amber-900 dark:text-amber-100">
                                    🎁 {t('Review.potentialPoints', { points: potentialPoints })}
                                </p>
                                <p className="text-xs text-amber-800 dark:text-amber-300">
                                    {t('Review.multipliedReason', { quantity: orderItem.quantity })}
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Review Form */}
                <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 space-y-6">
                    {/* Rating */}
                    <div>
                        <label className="block text-lg font-semibold text-gray-900 dark:text-white mb-3">
                            {t('Review.yourRating')} *
                        </label>
                        <div className="flex items-center gap-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    type="button"
                                    onMouseEnter={() => setHoverRating(star)}
                                    onMouseLeave={() => setHoverRating(0)}
                                    onClick={() => setRating(star)}
                                    className="transition-transform hover:scale-110"
                                >
                                    <Star
                                        className={`w-12 h-12 transition-colors ${star <= (hoverRating || rating)
                                            ? 'fill-amber-400 text-amber-400'
                                            : 'text-gray-300 dark:text-gray-600'
                                            }`}
                                    />
                                </button>
                            ))}
                            <span className="ml-3 text-2xl font-bold text-amber-600 dark:text-amber-400">
                                {rating}/5
                            </span>
                        </div>
                    </div>

                    {/* Comment */}
                    <div>
                        <label className="block text-lg font-semibold text-gray-900 dark:text-white mb-3">
                            {t('Review.yourReview')} *
                        </label>
                        <textarea
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder={t('Review.placeholder')}
                            rows={6}
                            className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent dark:bg-gray-700 dark:text-white resize-none"
                            required
                        />
                        <div className="mt-2 flex items-center justify-between text-sm flex-wrap gap-2">
                            <span className="text-gray-500 dark:text-gray-400">
                                {comment.length} {t('Review.characters')}
                            </span>
                            {comment.length > 100 && (
                                <span className="text-green-600 dark:text-green-400 font-medium flex items-center gap-1">
                                    <Award className="w-4 h-4" />
                                    +5 × {orderItem.quantity} = +{5 * orderItem.quantity} {t('Review.pointsUnit')}
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Images */}
                    <div>
                        <label className="block text-lg font-semibold text-gray-900 dark:text-white mb-3">
                            {t('Review.addPhotos')}
                        </label>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                            {t('Review.photosHelpful')}
                        </p>

                        <div className="grid grid-cols-3 md:grid-cols-5 gap-4 mb-4">
                            {imagePreviews.map((preview, index) => (
                                <div key={index} className="relative group">
                                    <img
                                        src={preview}
                                        alt={`Preview ${index + 1}`}
                                        className="w-full h-24 object-cover rounded-lg"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => removeImage(index)}
                                        className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}

                            {images.length < 5 && (
                                <label className="w-full h-24 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-amber-500 hover:bg-amber-50 dark:hover:bg-amber-900/10 transition-colors">
                                    <Upload className="w-6 h-6 text-gray-400 dark:text-gray-500 mb-1" />
                                    <span className="text-xs text-gray-500 dark:text-gray-400">
                                        {t('Review.upload')}
                                    </span>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        multiple
                                        onChange={handleImageSelect}
                                        className="hidden"
                                    />
                                </label>
                            )}
                        </div>

                        <p className="text-xs text-gray-500 dark:text-gray-400">
                            {t('Review.imageLimit')} ({images.length}/5)
                        </p>
                        {images.length > 0 && (
                            <p className="text-sm text-green-600 dark:text-green-400 font-medium flex items-center gap-1 mt-2">
                                <Award className="w-4 h-4" />
                                +5 × {orderItem.quantity} = +{5 * orderItem.quantity} {t('Review.pointsUnit')}
                            </p>
                        )}
                    </div>

                    {/* Points Calculation Info */}
                    <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-xl p-4 border border-amber-200 dark:border-amber-800">
                        <div className="flex items-start gap-3">
                            <Award className="w-6 h-6 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                            <div>
                                <h3 className="font-semibold text-amber-900 dark:text-amber-100 mb-2">
                                    {t('Review.pointsCalculation')}
                                </h3>
                                <ul className="text-sm text-amber-800 dark:text-amber-300 space-y-1">
                                    <li>• {t('Review.basicPoints', { points: 10 * orderItem.quantity })}</li>
                                    <li>• {t('Review.photoPoints', { points: 5 * orderItem.quantity })}</li>
                                    <li>• {t('Review.detailedPoints', { points: 5 * orderItem.quantity })}</li>
                                </ul>
                                {orderItem.quantity > 1 && (
                                    <p className="text-xs text-amber-700 dark:text-amber-400 mt-2 font-semibold">
                                        💡 {t('Review.multipliedNote', { quantity: orderItem.quantity })}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Submit */}
                    <div className="flex gap-4">
                        <button
                            type="button"
                            onClick={() => navigate(-1)}
                            className="flex-1 px-6 py-3 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                        >
                            {t('Review.cancel')}
                        </button>
                        <button
                            type="submit"
                            disabled={submittingReview || uploadingFiles || !comment.trim()}
                            className="flex-1 px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl"
                        >
                            {uploadingFiles
                                ? t('Review.uploading')
                                : submittingReview
                                    ? t('Review.submitting')
                                    : t('Review.submit')}
                        </button>
                    </div>
                </form>
            </div>

            {/* Success Modal */}
            {showSuccessModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-md w-full p-8 text-center animate-fadeIn">
                        <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
                            <CheckCircle className="w-12 h-12 text-white" />
                        </div>

                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                            {t('Review.thankYou')}
                        </h2>

                        <p className="text-gray-600 dark:text-gray-400 mb-6">
                            {t('Review.successMessage')}
                        </p>

                        <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-xl p-6 mb-6 border border-amber-200 dark:border-amber-800">
                            <div className="flex items-center justify-center gap-3 mb-2">
                                <Sparkles className="w-8 h-8 text-amber-500" />
                                <span className="text-4xl font-bold text-amber-600 dark:text-amber-400">
                                    +{pointsEarned}
                                </span>
                            </div>
                            <p className="text-sm text-amber-800 dark:text-amber-300">
                                {t('Review.pointsAdded')}
                            </p>
                            {orderItem && orderItem.quantity > 1 && (
                                <p className="text-xs text-amber-700 dark:text-amber-400 mt-2">
                                    ({pointsEarned / orderItem.quantity} × {orderItem.quantity} {t('Review.copies')})
                                </p>
                            )}
                        </div>

                        <button
                            onClick={handleSuccessClose}
                            className="w-full px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-xl font-semibold transition-all"
                        >
                            {t('Review.close')}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}