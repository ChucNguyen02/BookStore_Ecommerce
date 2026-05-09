import { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
    Star,
    Heart,
    ShoppingCart,
    Share2,
    ChevronLeft,
    ChevronRight,
    Package,
    Truck,
    Shield,
    Eye,
    TrendingUp,
    Calendar,
    Book,
    Globe,
    FileText,
    User,
    Sparkles,
    Tag,
    MessageCircle,
} from 'lucide-react';
import LoadingSpinner from '../../../components/user/common/LoadingSpinner';
import { BookReviews } from '../../../components/user/books/BookReviews';
import { BookQuestions } from '../../../components/user/books/BookQuestions';

import { useTranslation } from 'react-i18next';
import { useCartWishlist } from '../../../context/CartWishlistProvider';
import { useViewHistory } from '../../../hooks/user';
import { useBookDetail } from '../../../hooks/user/useBookDetail';
import { useAuth } from '../../../hooks/user/useAuth';
import toast from 'react-hot-toast';

const BookDetail = () => {
    const { t, i18n } = useTranslation();
    const { slug } = useParams<{ slug: string }>();

    const { data: book, isLoading: loading, error: fetchError } = useBookDetail(slug);

    const {
        addToCart,
        addToWishlist,
        removeFromWishlist,
        isInWishlist: checkIsInWishlist,
        isCartLoading,
        isWishlistLoading,
    } = useCartWishlist();

    const { recordView } = useViewHistory();
    const { isAuthenticated } = useAuth();

    const [selectedImage, setSelectedImage] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [activeTab, setActiveTab] = useState<'description' | 'reviews' | 'questions'>('description');
    const [isInWish, setIsInWish] = useState(false);

    const viewRecordedRef = useRef<string | null>(null);
    const recordingRef = useRef(false);

    // Record view khi book được load thành công
    useEffect(() => {
        if (!book || viewRecordedRef.current === book.id || recordingRef.current) return;

        const record = async () => {
            recordingRef.current = true;
            try {
                const newViewCount = await recordView(book.id);
                if (newViewCount !== undefined) {
                    // React Query không tự update nested field → có thể dùng refetch nếu cần
                    // Hoặc dùng setQueryData nếu muốn update cache
                }
                viewRecordedRef.current = book.id;
            } catch (err) {
                console.error('Failed to record view:', err);
            } finally {
                recordingRef.current = false;
            }
        };

        record();
    }, [book, recordView]);

    // Check wishlist status
    useEffect(() => {
        if (!book || !isAuthenticated) {
            setIsInWish(false);
            return;
        }
        setIsInWish(checkIsInWishlist(book.id));
    }, [book?.id, checkIsInWishlist, isAuthenticated]);

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
        }).format(price);
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat(i18n.language === 'vi' ? 'vi-VN' : 'en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        }).format(date);
    };

    const handleAddToCart = async () => {
        if (!book) return;

        if (!isAuthenticated) {
            toast.error(t('BookDetail.loginRequiredCart'));
            window.location.href = '/login';
            return;
        }

        if (!book.inStock) {
            toast.error(t('BookDetail.outOfStock'));
            return;
        }

        const success = await addToCart({ bookId: book.id, quantity });
        if (success) {
            setQuantity(1);
        }
    };

    const handleToggleWishlist = async () => {
        if (!book) return;

        if (!isAuthenticated) {
            toast.error(t('BookDetail.loginRequiredWishlist'));
            window.location.href = '/login';
            return;
        }

        if (isInWish) {
            const success = await removeFromWishlist(book.id);
            if (success) setIsInWish(false);
        } else {
            const success = await addToWishlist(book.id);
            if (success) setIsInWish(true);
        }
    };

    const isUpdating = isCartLoading(book?.id || '') || isWishlistLoading(book?.id || '');

    const handleQuantityChange = (value: number) => {
        if (value < 1) return;
        if (book && value > book.stockQuantity) return;
        setQuantity(value);
    };

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: book?.title,
                text: book?.description || '',
                url: window.location.href,
            });
        } else {
            navigator.clipboard.writeText(window.location.href);
            toast.success(t('BookDetail.linkCopied'));
        }
    };

    if (loading) return <LoadingSpinner fullScreen />;

    if (fetchError || !book) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
                <div className="text-center space-y-4">
                    <p className="text-xl text-red-600 dark:text-red-400">
                        {fetchError?.message || t('BookDetail.notFound')}
                    </p>
                    <Link to="/books" className="text-amber-600 dark:text-amber-400 hover:underline">
                        {t('BookDetail.backToList')}
                    </Link>
                </div>
            </div>
        );
    }

    const images = book.imageUrls.length > 0 ? book.imageUrls : [book.coverImageUrl || '/placeholder-book.jpg'];
    const effectivePrice = book.discountPrice || book.price;
    const hasDiscount = book.discountPrice && book.discountPrice < book.price;

    return (
        <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
            <div className="container mx-auto px-4 py-8">
                {/* Breadcrumb */}
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-8">
                    <Link to="/" className="hover:text-amber-600 dark:hover:text-amber-400">
                        {t('BookDetail.home')}
                    </Link>
                    <span>/</span>
                    <Link to="/books" className="hover:text-amber-600 dark:hover:text-amber-400">
                        {t('BookDetail.books')}
                    </Link>
                    <span>/</span>
                    <Link to={`/categories/${book.category.slug}`} className="hover:text-amber-600 dark:hover:text-amber-400">
                        {book.category.name}
                    </Link>
                    <span>/</span>
                    <span className="text-gray-900 dark:text-white truncate">{book.title}</span>
                </div>

                {/* Main Content */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
                    {/* Images */}
                    <div className="space-y-4">
                        <div className="relative aspect-[3/4] bg-gray-100 dark:bg-gray-800 rounded-2xl overflow-hidden group">
                            <img src={images[selectedImage]} alt={book.title} className="w-full h-full object-contain" />

                            {/* Badges */}
                            <div className="absolute top-4 left-4 flex flex-col gap-2">
                                {hasDiscount && (
                                    <span className="px-4 py-2 bg-red-500 text-white text-sm font-bold rounded-full shadow-lg flex items-center gap-2">
                                        <Tag className="w-4 h-4" />
                                        -{book.discountPercentage}%
                                    </span>
                                )}
                                {book.isFeatured && (
                                    <span className="px-4 py-2 bg-amber-500 text-white text-sm font-bold rounded-full shadow-lg flex items-center gap-2">
                                        <Sparkles className="w-4 h-4" />
                                        {t('BookDetail.featured')}
                                    </span>
                                )}
                                <span
                                    className={`px-4 py-2 text-white text-sm font-bold rounded-full shadow-lg ${book.isActive ? 'bg-green-500' : 'bg-gray-500'
                                        }`}
                                >
                                    {book.isActive ? t('BookDetail.active') : t('BookDetail.inactive')}
                                </span>
                            </div>

                            {/* Navigation arrows */}
                            {images.length > 1 && (
                                <>
                                    <button
                                        onClick={() => setSelectedImage((selectedImage - 1 + images.length) % images.length)}
                                        className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white dark:hover:bg-gray-700"
                                    >
                                        <ChevronLeft className="w-6 h-6" />
                                    </button>
                                    <button
                                        onClick={() => setSelectedImage((selectedImage + 1) % images.length)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white dark:hover:bg-gray-700"
                                    >
                                        <ChevronRight className="w-6 h-6" />
                                    </button>
                                </>
                            )}
                        </div>

                        {/* Thumbnails */}
                        {images.length > 1 && (
                            <div className="flex gap-2 overflow-x-auto pb-2">
                                {images.map((img, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setSelectedImage(index)}
                                        className={`flex-shrink-0 w-20 h-24 rounded-lg overflow-hidden border-2 transition-all ${selectedImage === index
                                                ? 'border-amber-500 ring-2 ring-amber-200 dark:ring-amber-800'
                                                : 'border-gray-200 dark:border-gray-700 hover:border-amber-300'
                                            }`}
                                    >
                                        <img src={img} alt={`${book.title} ${index + 1}`} className="w-full h-full object-cover" />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Info */}
                    <div className="space-y-6">
                        <Link
                            to={`/categories/${book.category.slug}`}
                            className="inline-block text-sm text-amber-600 dark:text-amber-400 font-semibold hover:underline"
                        >
                            📚 {book.category.name}
                        </Link>

                        <h1 className="text-4xl font-serif font-bold text-gray-900 dark:text-white">{book.title}</h1>

                        {/* Authors */}
                        <div className="space-y-2">
                            <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
                                <User className="w-4 h-4" />
                                {t('BookDetail.authors')}:
                            </p>
                            <div className="flex flex-wrap gap-2">
                                {book.authors.map((author) => (
                                    <Link
                                        key={author.id}
                                        to={`/authors/${author.id}`}
                                        className="px-4 py-2 bg-white dark:bg-gray-800 rounded-full text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-amber-50 dark:hover:bg-gray-700 hover:text-amber-600 dark:hover:text-amber-400 transition-colors shadow-sm border border-gray-200 dark:border-gray-700"
                                    >
                                        {author.name}
                                    </Link>
                                ))}
                            </div>
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-gray-800 dark:to-gray-700 rounded-2xl">
                            <div className="text-center">
                                <div className="flex items-center justify-center gap-1 mb-1">
                                    <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
                                    <span className="text-2xl font-bold text-gray-900 dark:text-white">
                                        {book.averageRating.toFixed(1)}
                                    </span>
                                </div>
                                <p className="text-xs text-gray-600 dark:text-gray-400">
                                    {t('BookDetail.reviewsCount', { count: book.reviewCount })}
                                </p>
                            </div>
                            <div className="text-center">
                                <div className="flex items-center justify-center gap-1 mb-1">
                                    <TrendingUp className="w-5 h-5 text-green-500" />
                                    <span className="text-2xl font-bold text-gray-900 dark:text-white">{book.soldCount}</span>
                                </div>
                                <p className="text-xs text-gray-600 dark:text-gray-400">{t('BookDetail.sold')}</p>
                            </div>
                            <div className="text-center">
                                <div className="flex items-center justify-center gap-1 mb-1">
                                    <Eye className="w-5 h-5 text-blue-500" />
                                    <span className="text-2xl font-bold text-gray-900 dark:text-white">{book.viewCount}</span>
                                </div>
                                <p className="text-xs text-gray-600 dark:text-gray-400">{t('BookDetail.views')}</p>
                            </div>
                            <div className="text-center">
                                <div className="flex items-center justify-center gap-1 mb-1">
                                    <Package className="w-5 h-5 text-purple-500" />
                                    <span
                                        className={`text-2xl font-bold ${book.inStock ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                                            }`}
                                    >
                                        {book.stockQuantity}
                                    </span>
                                </div>
                                <p className="text-xs text-gray-600 dark:text-gray-400">{t('BookDetail.inStock')}</p>
                            </div>
                        </div>

                        {/* Price */}
                        <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-gray-800 dark:to-gray-700 p-6 rounded-2xl border-2 border-amber-200 dark:border-amber-800">
                            <div className="flex items-center gap-4 mb-2">
                                <span className="text-4xl font-bold text-amber-600 dark:text-amber-400">
                                    {formatPrice(effectivePrice)}
                                </span>
                                {hasDiscount && (
                                    <div className="flex flex-col">
                                        <span className="text-xl text-gray-400 dark:text-gray-500 line-through">
                                            {formatPrice(book.price)}
                                        </span>
                                        <span className="text-sm text-red-600 dark:text-red-400 font-semibold">
                                            {t('BookDetail.save')} {formatPrice(book.price - effectivePrice)}
                                        </span>
                                    </div>
                                )}
                            </div>
                            {hasDiscount && (
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    🎉 {t('BookDetail.onSale')} {book.discountPercentage}%
                                </p>
                            )}
                        </div>

                        {/* Details */}
                        <div className="grid grid-cols-2 gap-4 p-4 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700">
                            {book.isbn && (
                                <div>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1 flex items-center gap-1">
                                        <FileText className="w-3 h-3" /> ISBN:
                                    </p>
                                    <p className="font-medium text-gray-900 dark:text-white">{book.isbn}</p>
                                </div>
                            )}
                            {book.publisher && (
                                <div>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">{t('BookDetail.publisher')}:</p>
                                    <p className="font-medium text-gray-900 dark:text-white">{book.publisher}</p>
                                </div>
                            )}
                            {book.publishYear && (
                                <div>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1 flex items-center gap-1">
                                        <Calendar className="w-3 h-3" /> {t('BookDetail.publishYear')}:
                                    </p>
                                    <p className="font-medium text-gray-900 dark:text-white">{book.publishYear}</p>
                                </div>
                            )}
                            {book.pages && (
                                <div>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1 flex items-center gap-1">
                                        <Book className="w-3 h-3" /> {t('BookDetail.pages')}:
                                    </p>
                                    <p className="font-medium text-gray-900 dark:text-white">{book.pages}</p>
                                </div>
                            )}
                            <div>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1 flex items-center gap-1">
                                    <Globe className="w-3 h-3" /> {t('BookDetail.language')}:
                                </p>
                                <p className="font-medium text-gray-900 dark:text-white">{book.language}</p>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-4">
                                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('BookDetail.quantity')}:</span>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => handleQuantityChange(quantity - 1)}
                                        className="w-10 h-10 bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-700 rounded-lg font-bold text-gray-700 dark:text-gray-300 hover:bg-amber-50 dark:hover:bg-gray-700 hover:border-amber-500 transition-all"
                                        disabled={!book.inStock}
                                    >
                                        -
                                    </button>
                                    <input
                                        type="number"
                                        value={quantity}
                                        onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
                                        className="w-20 h-10 text-center border-2 border-gray-300 dark:border-gray-700 rounded-lg font-medium bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                                        disabled={!book.inStock}
                                        min="1"
                                        max={book.stockQuantity}
                                    />
                                    <button
                                        onClick={() => handleQuantityChange(quantity + 1)}
                                        className="w-10 h-10 bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-700 rounded-lg font-bold text-gray-700 dark:text-gray-300 hover:bg-amber-50 dark:hover:bg-gray-700 hover:border-amber-500 transition-all"
                                        disabled={!book.inStock}
                                    >
                                        +
                                    </button>
                                </div>
                                <span className="text-sm text-gray-500 dark:text-gray-400">
                                    ({book.stockQuantity} {t('BookDetail.available')})
                                </span>
                            </div>

                            <div className="flex gap-3">
                                <button
                                    onClick={handleAddToCart}
                                    disabled={!book.inStock || isUpdating}
                                    className="flex-1 py-4 bg-gradient-to-r from-amber-500 to-orange-500 dark:from-amber-600 dark:to-orange-600 text-white rounded-xl font-bold text-lg hover:from-amber-600 hover:to-orange-600 dark:hover:from-amber-700 dark:hover:to-orange-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                                >
                                    <ShoppingCart className="w-6 h-6" />
                                    {isUpdating
                                        ? t('BookDetail.adding')
                                        : book.inStock
                                            ? t('BookDetail.addToCart')
                                            : t('BookDetail.outOfStock')}
                                </button>
                                <button
                                    onClick={handleToggleWishlist}
                                    disabled={isUpdating}
                                    className={`w-14 h-14 border-2 rounded-xl transition-all flex items-center justify-center shadow-lg ${isInWish
                                            ? 'bg-red-50 dark:bg-red-900/20 border-red-500 text-red-600 dark:text-red-400'
                                            : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 hover:bg-amber-50 dark:hover:bg-gray-700 hover:border-amber-500 text-gray-700 dark:text-gray-300'
                                        }`}
                                >
                                    <Heart className={`w-6 h-6 ${isInWish ? 'fill-current' : ''}`} />
                                </button>
                                <button
                                    onClick={handleShare}
                                    className="w-14 h-14 bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-700 rounded-xl hover:bg-amber-50 dark:hover:bg-gray-700 hover:border-amber-500 transition-all flex items-center justify-center shadow-lg"
                                >
                                    <Share2 className="w-6 h-6 text-gray-700 dark:text-gray-300" />
                                </button>
                            </div>
                        </div>

                        {/* Features */}
                        <div className="grid grid-cols-3 gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
                            <div className="flex flex-col items-center gap-2 text-center">
                                <Package className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                                <span className="text-xs text-gray-600 dark:text-gray-400 font-medium">{t('BookDetail.authentic')}</span>
                            </div>
                            <div className="flex flex-col items-center gap-2 text-center">
                                <Truck className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                                <span className="text-xs text-gray-600 dark:text-gray-400 font-medium">{t('BookDetail.fastShip')}</span>
                            </div>
                            <div className="flex flex-col items-center gap-2 text-center">
                                <Shield className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                                <span className="text-xs text-gray-600 dark:text-gray-400 font-medium">{t('BookDetail.returnPolicy')}</span>
                            </div>
                        </div>

                        {/* Timestamps */}
                        <div className="pt-4 border-t border-gray-200 dark:border-gray-700 space-y-2">
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                {t('BookDetail.created')}: <span className="font-medium">{formatDate(book.createdAt)}</span>
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                {t('BookDetail.updated')}: <span className="font-medium">{formatDate(book.updatedAt)}</span>
                            </p>
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden mb-8">
                    <div className="flex border-b border-gray-200 dark:border-gray-700">
                        <button
                            onClick={() => setActiveTab('description')}
                            className={`flex-1 px-6 py-4 font-semibold transition-colors flex items-center justify-center gap-2 ${activeTab === 'description'
                                    ? 'bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 border-b-2 border-amber-500'
                                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                                }`}
                        >
                            <FileText className="w-5 h-5" />
                            {t('BookDetail.description')}
                        </button>
                        <button
                            onClick={() => setActiveTab('reviews')}
                            className={`flex-1 px-6 py-4 font-semibold transition-colors flex items-center justify-center gap-2 ${activeTab === 'reviews'
                                    ? 'bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 border-b-2 border-amber-500'
                                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                                }`}
                        >
                            <Star className="w-5 h-5" />
                            {t('BookDetail.reviews')}
                            <span className="px-2 py-0.5 bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-400 rounded-full text-xs font-semibold">
                                {book.reviewCount}
                            </span>
                        </button>
                        <button
                            onClick={() => setActiveTab('questions')}
                            className={`flex-1 px-6 py-4 font-semibold transition-colors flex items-center justify-center gap-2 ${activeTab === 'questions'
                                    ? 'bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 border-b-2 border-amber-500'
                                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                                }`}
                        >
                            <MessageCircle className="w-5 h-5" />
                            {t('BookDetail.qa')}
                        </button>
                    </div>

                    <div className="p-8">
                        {activeTab === 'description' && book.description && (
                            <div className="prose dark:prose-invert max-w-none text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                                {book.description}
                            </div>
                        )}
                        {activeTab === 'reviews' && <BookReviews bookId={book.id} />}
                        {activeTab === 'questions' && <BookQuestions bookId={book.id} />}
                    </div>
                </div>

                {/* Author Info */}
                {book.authors.length > 0 && (
                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg">
                        <h2 className="text-2xl font-serif font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                            <User className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                            {t('BookDetail.aboutAuthors')}
                        </h2>
                        <div className="space-y-6">
                            {book.authors.map((author) => (
                                <div key={author.id} className="flex gap-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                                    {author.avatarUrl && (
                                        <img
                                            src={author.avatarUrl}
                                            alt={author.name}
                                            className="w-24 h-24 rounded-full object-cover ring-4 ring-amber-200 dark:ring-amber-800"
                                        />
                                    )}
                                    <div className="flex-1">
                                        <Link
                                            to={`/authors/${author.id}`}
                                            className="text-xl font-bold text-gray-900 dark:text-white hover:text-amber-600 dark:hover:text-amber-400 transition-colors mb-2 inline-block"
                                        >
                                            {author.name}
                                        </Link>
                                        {author.bio && (
                                            <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-2">{author.bio}</p>
                                        )}
                                        <div className="flex flex-wrap gap-4 text-sm text-gray-500 dark:text-gray-400">
                                            {author.birthDate && (
                                                <span>
                                                    🎂 {new Date(author.birthDate).toLocaleDateString(i18n.language === 'vi' ? 'vi-VN' : 'en-US')}
                                                </span>
                                            )}
                                            {author.nationality && <span>🌍 {author.nationality}</span>}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BookDetail;