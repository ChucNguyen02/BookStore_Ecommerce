import { useState, useEffect } from 'react';
import { X, Upload, Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { type CategoryResponse, type CategoryRequest } from '../../../types/category.types';
import { fileUploadService } from '../../../services';
import { toast } from 'react-hot-toast';

interface AdminCategoryFormProps {
    category?: CategoryResponse | null;
    parentCategories: CategoryResponse[];
    onSubmit: (data: CategoryRequest) => Promise<boolean>;
    onClose: () => void;
}

export default function AdminCategoryForm({
    category,
    parentCategories,
    onSubmit,
    onClose,
}: AdminCategoryFormProps) {
    const { t } = useTranslation();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [imageUploading, setImageUploading] = useState(false);
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    const [formData, setFormData] = useState<CategoryRequest>({
        name: '',
        description: null,
        parentId: null,
        imageUrl: null,
        displayOrder: 0,
        isActive: true,
    });

    useEffect(() => {
        if (category) {
            setFormData({
                name: category.name,
                description: category.description,
                parentId: category.parentId,
                imageUrl: category.imageUrl,
                displayOrder: category.displayOrder,
                isActive: category.isActive,
            });
            if (category.imageUrl) {
                setImagePreview(category.imageUrl);
            }
        }
    }, [category]);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value, type } = e.target;

        if (type === 'checkbox') {
            const checked = (e.target as HTMLInputElement).checked;
            setFormData(prev => ({ ...prev, [name]: checked }));
        } else if (name === 'displayOrder') {
            setFormData(prev => ({ ...prev, [name]: parseInt(value) || 0 }));
        } else if (name === 'parentId') {
            setFormData(prev => ({ ...prev, [name]: value || null }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value || null }));
        }
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            toast.error('Please upload an image file');
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            toast.error('Image size must be less than 5MB');
            return;
        }

        try {
            setImageUploading(true);
            const imageUrl = await fileUploadService.uploadImage(file, 'categories');
            setFormData(prev => ({ ...prev, imageUrl }));
            setImagePreview(imageUrl);
            toast.success('Image uploaded successfully');
        } catch (error: any) {
            toast.error(error.message || 'Failed to upload image');
        } finally {
            setImageUploading(false);
        }
    };

    const handleRemoveImage = async () => {
        if (formData.imageUrl) {
            try {
                await fileUploadService.deleteImage(formData.imageUrl);
                setFormData(prev => ({ ...prev, imageUrl: null }));
                setImagePreview(null);
                toast.success('Image removed successfully');
            } catch (error: any) {
                toast.error(error.message || 'Failed to remove image');
            }
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.name.trim()) {
            toast.error('Category name is required');
            return;
        }

        setIsSubmitting(true);
        const success = await onSubmit(formData);
        setIsSubmitting(false);

        if (success) {
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
            <div className="card max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col animate-scaleIn">
                {/* Header */}
                <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-6 flex items-center justify-between z-10">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                        {category ? t('admin.editCategory') : t('admin.createCategory')}
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all hover-scale"
                        aria-label={t('common.close')}
                    >
                        <X className="w-6 h-6 text-gray-500 dark:text-gray-400" />
                    </button>
                </div>

                {/* Form Body */}
                <form onSubmit={handleSubmit} className="p-6 space-y-6 overflow-y-auto flex-1">
                    {/* Category Name */}
                    <div className="animate-fadeInUp">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            {t('admin.categoryName')} <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            className="input-field"
                            placeholder={t('admin.enterCategoryName')}
                        />
                    </div>

                    {/* Description */}
                    <div className="animate-fadeInUp" style={{ animationDelay: '0.1s' }}>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            {t('admin.description')}
                        </label>
                        <textarea
                            name="description"
                            value={formData.description || ''}
                            onChange={handleChange}
                            rows={4}
                            className="input-field resize-none"
                            placeholder={t('admin.enterDescription')}
                        />
                    </div>

                    {/* Parent Category & Display Order - Grid Layout */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                {t('admin.parentCategory')}
                            </label>
                            <select
                                name="parentId"
                                value={formData.parentId || ''}
                                onChange={handleChange}
                                className="input-field"
                            >
                                <option value="">{t('admin.noParent')}</option>
                                {parentCategories
                                    .filter(cat => !category || cat.id !== category.id)
                                    .map(cat => (
                                        <option key={cat.id} value={cat.id}>
                                            {cat.name}
                                        </option>
                                    ))}
                            </select>
                        </div>

                        <div className="animate-fadeInUp" style={{ animationDelay: '0.3s' }}>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                {t('admin.displayOrder')}
                            </label>
                            <input
                                type="number"
                                name="displayOrder"
                                value={formData.displayOrder}
                                onChange={handleChange}
                                min="0"
                                className="input-field"
                                placeholder="0"
                            />
                        </div>
                    </div>

                    {/* Image Upload */}
                    <div className="animate-fadeInUp" style={{ animationDelay: '0.4s' }}>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                            {t('admin.categoryImage')}
                        </label>

                        {imagePreview ? (
                            <div className="relative group">
                                <img
                                    src={imagePreview}
                                    alt="Preview"
                                    className="w-full h-56 object-cover rounded-xl shadow-lg hover-brightness transition-all"
                                />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center">
                                    <button
                                        type="button"
                                        onClick={handleRemoveImage}
                                        className="p-3 bg-red-500 hover:bg-red-600 text-white rounded-full transition-all hover-scale shadow-lg"
                                    >
                                        <X className="w-6 h-6" />
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <label className="flex flex-col items-center justify-center w-full h-56 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl cursor-pointer bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all hover-lift">
                                <div className="flex flex-col items-center justify-center py-6">
                                    {imageUploading ? (
                                        <>
                                            <Loader2 className="w-16 h-16 text-amber-500 dark:text-amber-400 animate-spin mb-4" />
                                            <p className="text-sm font-medium text-amber-600 dark:text-amber-400">
                                                {t('common.uploading')}...
                                            </p>
                                        </>
                                    ) : (
                                        <>
                                            <div className="w-20 h-20 bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/40 dark:to-orange-900/40 rounded-full flex items-center justify-center mb-4 animate-pulse">
                                                <Upload className="w-10 h-10 text-amber-600 dark:text-amber-400" />
                                            </div>
                                            <p className="mb-2 text-sm text-gray-600 dark:text-gray-300">
                                                <span className="font-semibold">{t('admin.clickToUpload')}</span> {t('admin.orDragDrop')}
                                            </p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                                PNG, JPG, GIF • Max 5MB
                                            </p>
                                        </>
                                    )}
                                </div>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    className="hidden"
                                    disabled={imageUploading}
                                />
                            </label>
                        )}
                    </div>

                    {/* Is Active Toggle */}
                    <div className="animate-fadeInUp" style={{ animationDelay: '0.5s' }}>
                        <div className="card bg-gray-50 dark:bg-gray-700/50 p-4">
                            <label className="flex items-center cursor-pointer group">
                                <input
                                    type="checkbox"
                                    name="isActive"
                                    checked={formData.isActive}
                                    onChange={handleChange}
                                    className="w-5 h-5 text-amber-600 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-amber-500 transition-all"
                                />
                                <div className="ml-3 flex-1">
                                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                                        {t('admin.active')}
                                    </span>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                                        {formData.isActive
                                            ? t('admin.categoryVisible')
                                            : t('admin.categoryHidden')}
                                    </p>
                                </div>
                                <span className={`badge ${formData.isActive ? 'badge-success' : 'bg-gray-400 dark:bg-gray-600 text-white'}`}>
                                    {formData.isActive ? '✓ Active' : '✕ Inactive'}
                                </span>
                            </label>
                        </div>
                    </div>

                    {/* Submit Buttons */}
                    <div className="flex flex-col sm:flex-row items-center gap-3 pt-6 border-t border-gray-200 dark:border-gray-700 animate-fadeInUp" style={{ animationDelay: '0.6s' }}>
                        <button
                            type="button"
                            onClick={onClose}
                            className="btn-secondary w-full sm:flex-1"
                        >
                            {t('common.cancel')}
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting || imageUploading}
                            className="btn-primary w-full sm:flex-1 flex items-center justify-center space-x-2"
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    <span>{t('common.saving')}</span>
                                </>
                            ) : (
                                <>
                                    <span>{category ? t('common.update') : t('common.create')}</span>
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}