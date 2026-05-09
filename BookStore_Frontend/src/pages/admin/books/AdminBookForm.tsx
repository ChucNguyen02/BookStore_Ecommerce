import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Save, ArrowLeft, Upload, X, Image as ImageIcon } from 'lucide-react';
import { useAdminBooks } from '../../../hooks/admin/useAdminBooks';
import { useCategories } from '../../../hooks/user/useCategories';
import { useAuthors } from '../../../hooks/admin/useAdminAuthors';
import LoadingSpinner from '../../../components/admin/common/LoadingSpinner';
import { toast } from 'react-hot-toast';
import type { BookRequest } from '../../../types/book.types';

export default function AdminBookForm() {
    const navigate = useNavigate();
    const { id } = useParams();
    const { t } = useTranslation();
    const isEditMode = !!id;

    const { createBook, updateBook, getBookById } = useAdminBooks();
    const { useAllCategories } = useCategories();
    const { data: categories = [] } = useAllCategories();
    const { authors } = useAuthors();

    const [isLoading, setIsLoading] = useState(false);

    const [formData, setFormData] = useState<BookRequest>({
        title: '',
        isbn: null,
        description: null,
        price: 0,
        discountPrice: null,
        stockQuantity: 0,
        pages: null,
        publisher: null,
        publishYear: null,
        language: 'English',
        categoryId: String(0),
        authorIds: [],
        isFeatured: false,
        isActive: true,
    });

    // Images state
    const [coverImageUrl, setCoverImageUrl] = useState<string | null>(null);
    const [coverImageFile, setCoverImageFile] = useState<File | null>(null);

    const [existingImageUrls, setExistingImageUrls] = useState<string[]>([]);
    const [newImageFiles, setNewImageFiles] = useState<File[]>([]);
    const [newImagePreviews, setNewImagePreviews] = useState<string[]>([]);

    const [keepExistingImages, setKeepExistingImages] = useState(true);

    useEffect(() => {
        if (isEditMode && id) {
            loadBookData(id);
        }
    }, [id, isEditMode]);

    const loadBookData = async (bookId: string) => {
        try {
            setIsLoading(true);
            const book = await getBookById(bookId);

            setFormData({
                title: book.title,
                isbn: book.isbn,
                description: book.description,
                price: book.price,
                discountPrice: book.discountPrice,
                stockQuantity: book.stockQuantity,
                pages: book.pages,
                publisher: book.publisher,
                publishYear: book.publishYear,
                language: book.language,
                categoryId: book.category.id,
                authorIds: book.authors.map(a => String(a.id)),
                isFeatured: book.isFeatured,
                isActive: book.isActive,
            });

            setCoverImageUrl(book.coverImageUrl);
            setExistingImageUrls(book.imageUrls || []);
        } catch (err: any) {
            toast.error(err.message || t('admin.failedToLoadBook'));
            navigate('/admin/books');
        } finally {
            setIsLoading(false);
        }
    };

    const handleCoverSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            toast.error(t('admin.validation.invalidImageFormat'));
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            toast.error(t('admin.validation.imageTooLarge'));
            return;
        }

        setCoverImageFile(file);

        const reader = new FileReader();
        reader.onloadend = () => {
            setCoverImageUrl(reader.result as string);
        };
        reader.readAsDataURL(file);
    };

    const handleGallerySelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (files.length === 0) return;

        const validFiles = files.filter(file => {
            if (!file.type.startsWith('image/')) {
                toast.error(`${file.name}: ${t('admin.validation.invalidImageFormat')}`);
                return false;
            }
            if (file.size > 5 * 1024 * 1024) {
                toast.error(`${file.name}: ${t('admin.validation.imageTooLarge')}`);
                return false;
            }
            return true;
        });

        if (validFiles.length === 0) return;

        // Check total images limit (max 10)
        const totalImages = existingImageUrls.length + newImageFiles.length + validFiles.length;
        if (totalImages > 10) {
            toast.error(t('admin.validation.maxImagesExceeded'));
            return;
        }

        setNewImageFiles(prev => [...prev, ...validFiles]);

        // Generate previews
        validFiles.forEach(file => {
            const reader = new FileReader();
            reader.onloadend = () => {
                setNewImagePreviews(prev => [...prev, reader.result as string]);
            };
            reader.readAsDataURL(file);
        });
    };

    const handleRemoveCover = () => {
        setCoverImageUrl(null);
        setCoverImageFile(null);
    };

    const handleRemoveExistingImage = (index: number) => {
        setExistingImageUrls(prev => prev.filter((_, i) => i !== index));
    };

    const handleRemoveNewImage = (index: number) => {
        setNewImageFiles(prev => prev.filter((_, i) => i !== index));
        setNewImagePreviews(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validation
        if (!formData.title.trim()) {
            toast.error(t('admin.validation.titleRequired'));
            return;
        }

        if (formData.price <= 0) {
            toast.error(t('admin.validation.priceRequired'));
            return;
        }

        if (formData.categoryId === '0') {
            toast.error(t('admin.validation.categoryRequired'));
            return;
        }

        if (formData.authorIds.length === 0) {
            toast.error(t('admin.validation.authorRequired'));
            return;
        }

        try {
            setIsLoading(true);
            const toastId = toast.loading(
                isEditMode ? t('admin.updatingBook') : t('admin.creatingBook')
            );

            if (isEditMode && id) {
                await updateBook(
                    id,
                    formData,
                    coverImageFile || undefined,
                    newImageFiles.length > 0 ? newImageFiles : undefined,
                    keepExistingImages
                );
                toast.success(t('admin.bookUpdatedSuccess'), { id: toastId });
            } else {
                await createBook(
                    formData,
                    coverImageFile || undefined,
                    newImageFiles.length > 0 ? newImageFiles : undefined
                );
                toast.success(t('admin.bookCreatedSuccess'), { id: toastId });
            }

            navigate('/admin/books');
        } catch (err: any) {
            toast.error(err.message || t('admin.operationFailed'));
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading && isEditMode) {
        return <LoadingSpinner />;
    }

    // Calculate total images
    const totalImages = existingImageUrls.length + newImageFiles.length;
    const canAddMore = totalImages < 10;

    return (
        <div className="min-h-screen bg-gradient-to-br from-amber-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 p-6">
            <div className="max-w-5xl mx-auto space-y-6">
                {/* Header với animation */}
                <div className="flex items-center space-x-4 animate-fadeInDown">
                    <button
                        onClick={() => navigate('/admin/books')}
                        className="p-2 hover:bg-white/80 dark:hover:bg-gray-800 rounded-lg transition-smooth hover-scale"
                    >
                        <ArrowLeft className="w-6 h-6 text-gray-600 dark:text-gray-400" />
                    </button>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                            {isEditMode ? t('admin.editBook') : t('admin.createBook')}
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400 mt-1">
                            {isEditMode ? t('admin.editBookDescription') : t('admin.createBookDescription')}
                        </p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Basic Information - Stagger animation */}
                    <div className="card stagger-item hover-lift">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                            <span className="w-1 h-6 bg-gradient-to-b from-amber-500 to-orange-500 rounded-full mr-3"></span>
                            {t('admin.basicInformation')}
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Title */}
                            <div className="md:col-span-2">
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                    {t('admin.bookTitle')} <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    className="input-field transition-smooth"
                                    required
                                />
                            </div>

                            {/* ISBN */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                    {t('admin.isbn')}
                                </label>
                                <input
                                    type="text"
                                    value={formData.isbn || ''}
                                    onChange={(e) => setFormData({ ...formData, isbn: e.target.value || null })}
                                    className="input-field transition-smooth"
                                />
                            </div>

                            {/* Language */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                    {t('admin.language')}
                                </label>
                                <input
                                    type="text"
                                    value={formData.language}
                                    onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                                    className="input-field transition-smooth"
                                />
                            </div>

                            {/* Category */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                    {t('admin.category')} <span className="text-red-500">*</span>
                                </label>
                                <select
                                    value={formData.categoryId}
                                    onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                                    className="input-field transition-smooth"
                                    required
                                >
                                    <option value={0}>{t('admin.selectCategory')}</option>
                                    {categories?.map((cat) => (
                                        <option key={cat.id} value={cat.id}>
                                            {cat.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Authors */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                    {t('admin.authors')} <span className="text-red-500">*</span>
                                </label>

                                <select
                                    value="0"
                                    onChange={(e) => {
                                        const authorId = e.target.value;
                                        if (authorId !== '0' && !formData.authorIds.includes(authorId)) {
                                            setFormData({
                                                ...formData,
                                                authorIds: [...formData.authorIds, authorId]
                                            });
                                        }
                                    }}
                                    className="input-field transition-smooth mb-3"
                                >
                                    <option value="0">{t('admin.selectAuthor')}</option>
                                    {authors?.content
                                        .filter(author => !formData.authorIds.includes(String(author.id)))
                                        .map((author) => (
                                            <option key={author.id} value={String(author.id)}>
                                                {author.name}
                                            </option>
                                        ))}
                                </select>

                                {formData.authorIds.length > 0 ? (
                                    <div className="space-y-2">
                                        {formData.authorIds.map((authorId, index) => {
                                            const author = authors?.content.find(a => String(a.id) === String(authorId));
                                            return author ? (
                                                <div
                                                    key={authorId}
                                                    className="flex items-center justify-between p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl transition-smooth hover-scale animate-fadeIn"
                                                    style={{ animationDelay: `${index * 0.1}s` }}
                                                >
                                                    <span className="font-medium text-gray-900 dark:text-white">
                                                        {author.name}
                                                    </span>
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            setFormData({
                                                                ...formData,
                                                                authorIds: formData.authorIds.filter(id => id !== authorId)
                                                            });
                                                        }}
                                                        className="p-1.5 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-smooth hover-scale"
                                                    >
                                                        <X className="w-4 h-4 text-gray-500 dark:text-gray-400 hover:text-red-600" />
                                                    </button>
                                                </div>
                                            ) : null;
                                        })}
                                    </div>
                                ) : (
                                    <div className="text-center py-4 text-sm text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-700/50 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600">
                                        {t('admin.noAuthorsSelected')}
                                    </div>
                                )}
                            </div>

                            {/* Description */}
                            <div className="md:col-span-2">
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                    {t('admin.description')}
                                </label>
                                <textarea
                                    value={formData.description || ''}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value || null })}
                                    rows={5}
                                    className="input-field transition-smooth resize-none"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Pricing & Inventory */}
                    <div className="card stagger-item hover-lift">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                            <span className="w-1 h-6 bg-gradient-to-b from-amber-500 to-orange-500 rounded-full mr-3"></span>
                            {t('admin.pricingInventory')}
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                    {t('admin.price')} <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400">$</span>
                                    <input
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        value={formData.price}
                                        onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                                        className="input-field pl-8 transition-smooth"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                    {t('admin.discountPrice')}
                                </label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400">$</span>
                                    <input
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        value={formData.discountPrice || ''}
                                        onChange={(e) => setFormData({ ...formData, discountPrice: parseFloat(e.target.value) || null })}
                                        className="input-field pl-8 transition-smooth"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                    {t('admin.stockQuantity')} <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="number"
                                    min="0"
                                    value={formData.stockQuantity}
                                    onChange={(e) => setFormData({ ...formData, stockQuantity: parseInt(e.target.value) || 0 })}
                                    className="input-field transition-smooth"
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    {/* Publishing Information */}
                    <div className="card stagger-item hover-lift">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                            <span className="w-1 h-6 bg-gradient-to-b from-amber-500 to-orange-500 rounded-full mr-3"></span>
                            {t('admin.publishingInformation')}
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                    {t('admin.publisher')}
                                </label>
                                <input
                                    type="text"
                                    value={formData.publisher || ''}
                                    onChange={(e) => setFormData({ ...formData, publisher: e.target.value || null })}
                                    className="input-field transition-smooth"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                    {t('admin.publishYear')}
                                </label>
                                <input
                                    type="number"
                                    min="1900"
                                    max={new Date().getFullYear()}
                                    value={formData.publishYear || ''}
                                    onChange={(e) => setFormData({ ...formData, publishYear: parseInt(e.target.value) || null })}
                                    className="input-field transition-smooth"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                    {t('admin.pages')}
                                </label>
                                <input
                                    type="number"
                                    min="0"
                                    value={formData.pages || ''}
                                    onChange={(e) => setFormData({ ...formData, pages: parseInt(e.target.value) || null })}
                                    className="input-field transition-smooth"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Images */}
                    <div className="card stagger-item hover-lift">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                            <span className="w-1 h-6 bg-gradient-to-b from-amber-500 to-orange-500 rounded-full mr-3"></span>
                            {t('admin.images')}
                        </h2>

                        {/* Cover Image */}
                        <div className="mb-8">
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">
                                {t('admin.coverImage')}
                            </label>

                            {coverImageUrl ? (
                                <div className="relative inline-block group animate-scaleIn">
                                    <img
                                        src={coverImageUrl}
                                        alt="Cover"
                                        className="w-48 h-64 object-cover rounded-xl shadow-lg transition-smooth hover-lift"
                                    />
                                    <button
                                        type="button"
                                        onClick={handleRemoveCover}
                                        className="absolute -top-2 -right-2 p-1.5 bg-red-500 hover:bg-red-600 text-white rounded-full shadow-lg transition-smooth hover-scale opacity-0 group-hover:opacity-100"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                    {coverImageFile && (
                                        <span className="absolute bottom-2 left-2 right-2 px-2 py-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-xs rounded text-center animate-fadeIn shadow-lg">
                                            {t('admin.newImage')}
                                        </span>
                                    )}
                                </div>
                            ) : (
                                <label className="flex flex-col items-center justify-center w-48 h-64 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl cursor-pointer hover:border-amber-500 dark:hover:border-amber-500 transition-smooth hover-lift bg-white dark:bg-gray-800">
                                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                        <ImageIcon className="w-12 h-12 text-gray-400 mb-3 animate-pulse" />
                                        <p className="text-sm text-gray-500 dark:text-gray-400 text-center px-4">
                                            {t('admin.clickToUpload')}
                                        </p>
                                    </div>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleCoverSelect}
                                        className="hidden"
                                    />
                                </label>
                            )}
                        </div>

                        {/* Gallery Images */}
                        <div>
                            <div className="flex items-center justify-between mb-4">
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                                    {t('admin.galleryImages')}
                                    <span className="ml-2 badge badge-primary animate-pulse">
                                        {totalImages}/10
                                    </span>
                                </label>

                                {isEditMode && existingImageUrls.length > 0 && (
                                    <label className="flex items-center space-x-2 cursor-pointer group">
                                        <input
                                            type="checkbox"
                                            checked={keepExistingImages}
                                            onChange={(e) => setKeepExistingImages(e.target.checked)}
                                            className="rounded border-gray-300 text-amber-600 focus:ring-amber-500 transition-smooth"
                                        />
                                        <span className="text-sm text-gray-600 dark:text-gray-400 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                                            {t('admin.keepExistingImages')}
                                        </span>
                                    </label>
                                )}
                            </div>

                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-4">
                                {/* Existing images */}
                                {keepExistingImages && existingImageUrls.map((url, index) => (
                                    <div key={`existing-${index}`} className="relative group animate-scaleIn" style={{ animationDelay: `${index * 0.05}s` }}>
                                        <img
                                            src={url}
                                            alt={`Existing ${index + 1}`}
                                            className="w-full h-32 object-cover rounded-lg shadow-md transition-smooth hover-lift"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveExistingImage(index)}
                                            className="absolute -top-2 -right-2 p-1.5 bg-red-500 hover:bg-red-600 text-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-smooth hover-scale"
                                        >
                                            <X className="w-3 h-3" />
                                        </button>
                                        <span className="absolute bottom-2 left-2 right-2 px-1 py-0.5 bg-gradient-to-r from-green-500 to-green-600 text-white text-xs rounded text-center shadow-lg">
                                            {t('admin.existing')}
                                        </span>
                                    </div>
                                ))}

                                {/* New images */}
                                {newImagePreviews.map((preview, index) => (
                                    <div key={`new-${index}`} className="relative group animate-bounceIn" style={{ animationDelay: `${index * 0.05}s` }}>
                                        <img
                                            src={preview}
                                            alt={`New ${index + 1}`}
                                            className="w-full h-32 object-cover rounded-lg shadow-md transition-smooth hover-lift"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveNewImage(index)}
                                            className="absolute -top-2 -right-2 p-1.5 bg-red-500 hover:bg-red-600 text-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-smooth hover-scale"
                                        >
                                            <X className="w-3 h-3" />
                                        </button>
                                        <span className="absolute bottom-2 left-2 right-2 px-1 py-0.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-xs rounded text-center shadow-lg animate-pulse">
                                            {t('admin.new')}
                                        </span>
                                    </div>
                                ))}

                                {/* Add more button */}
                                {canAddMore && (
                                    <label className="flex flex-col items-center justify-center h-32 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:border-amber-500 dark:hover:border-amber-500 transition-smooth hover-lift bg-white dark:bg-gray-800 group">
                                        <div className="flex flex-col items-center justify-center">
                                            <Upload className="w-8 h-8 text-gray-400 group-hover:text-amber-500 mb-2 transition-colors animate-bounce" />
                                            <p className="text-xs text-gray-500 dark:text-gray-400 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                                                {t('admin.addMore')}
                                            </p>
                                        </div>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            multiple
                                            onChange={handleGallerySelect}
                                            className="hidden"
                                        />
                                    </label>
                                )}
                            </div>

                            {!canAddMore && (
                                <div className="flex items-center space-x-2 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg animate-fadeIn">
                                    <span className="text-sm text-amber-600 dark:text-amber-400">
                                        {t('admin.maxImagesReached')}
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Settings */}
                    <div className="card stagger-item hover-lift">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                            <span className="w-1 h-6 bg-gradient-to-b from-amber-500 to-orange-500 rounded-full mr-3"></span>
                            {t('admin.settings')}
                        </h2>

                        <div className="space-y-4">
                            {/* Is Featured */}
                            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-white/80 to-amber-50/80 dark:from-gray-900/95 dark:to-gray-800/95 rounded-xl transition-smooth hover-lift border border-gray-200 dark:border-gray-700">
                                <div>
                                    <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                                        {t('admin.featuredBook')}
                                    </label>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                        {t('admin.featuredBookDescription')}
                                    </p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={formData.isFeatured}
                                        onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                                        className="sr-only peer"
                                    />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-amber-300 dark:peer-focus:ring-amber-800 rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-gradient-to-r peer-checked:from-amber-500 peer-checked:to-orange-500"></div>
                                </label>
                            </div>

                            {/* Is Active */}
                            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-white/80 to-amber-50/80 dark:from-gray-900/95 dark:to-gray-800/95 rounded-xl transition-smooth hover-lift border border-gray-200 dark:border-gray-700">
                                <div>
                                    <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                                        {t('admin.activeBook')}
                                    </label>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                        {t('admin.activeBookDescription')}
                                    </p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={formData.isActive}
                                        onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                                        className="sr-only peer"
                                    />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 dark:peer-focus:ring-green-800 rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-gradient-to-r peer-checked:from-green-500 peer-checked:to-green-600"></div>
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* Actions với glass effect */}
                    <div className="flex items-center justify-end space-x-4 stagger-item">
                        <button
                            type="button"
                            onClick={() => navigate('/admin/books')}
                            className="btn-secondary hover-scale"
                        >
                            {t('common.cancel')}
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="btn-primary hover-scale disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:transform-none"
                        >
                            {isLoading ? (
                                <div className="flex items-center space-x-2">
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                    <span>{t('common.saving')}</span>
                                </div>
                            ) : (
                                <div className="flex items-center space-x-2">
                                    <Save className="w-5 h-5" />
                                    <span>{isEditMode ? t('common.update') : t('common.create')}</span>
                                </div>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}